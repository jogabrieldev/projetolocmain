import { LocacaoModel } from "../model/location.js";

export const location = {
  async dataLocacao(req, res) {
    const {
      userClientValidade,
      numericLocation,
      dataLoc,
      dataDevo,
      pagament,
      bens,
    } = req.body;

    console.log("Corpo da requisição recebido:", req.body);

    try {
      if (!bens || bens.length === 0) {
        return res.status(400).json({ error: "Nenhum dado de bens enviado." });
      }

      if (!userClientValidade || userClientValidade.length < 2) {
        return res.status(400).json({ error: "CPF do cliente é obrigatório" });
      }

      const cpfClient = userClientValidade[1];

      const cliente = await LocacaoModel.buscarClientePorCPF(cpfClient);
      console.log("Esse e o cliente: ", cliente);

      if (!cliente) {
        return res.status(404).json({ error: "Cliente não encontrado." });
      }

      const locationClient = await LocacaoModel.clientLoc({
        cllonmlo: numericLocation,
        clloidcl: cliente.cliecode,
        cllodtdv: dataDevo,
        cllodtlo: dataLoc,
        cllopgmt: pagament,
        clloclno: cliente.clienome,
        cllocpf: cpfClient,
      });

      await LocacaoModel.inserirBens(bens, locationClient);

      return res.status(201).json({ message: "Locação criada com sucesso." });
    } catch (error) {
      console.error("Erro ao criar locação:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  },

  async getClientByCPF(req, res) {
    try {
      const { cpf } = req.query;

      if (!cpf) {
        return res
          .status(400)
          .json({ success: false, message: "CPF não fornecido." });
      }

      const client = await LocacaoModel.getClientByCPF(cpf);

      if (!client) {
        return res
          .status(404)
          .json({ success: false, message: "Cliente não encontrado." });
      }

      res.status(200).json({ success: true, nome: client.clienome });
    } catch (error) {
      console.error(
        "Erro no controller ao buscar cliente por CPF:",
        error.message
      );
      res.status(500).json({
        success: false,
        message: "Erro interno no servidor.",
        error: error.message,
      });
    }
  },

  async listarFamilias(req, res) {
    try {
      const familias = await LocacaoModel.buscarCodigosBens();
      res.status(200).json(familias); // Retorna os dados como JSON
    } catch (error) {
      console.error("Erro ao listar famílias de bens:", error);
      res.status(500).json({ error: "Erro ao buscar famílias de bens." });
    }
  },

  async buscarLocationFinish(req, res) {
    try {
      const [clientes, bens] = await Promise.all([
        LocacaoModel.buscarLocationClient(),
        LocacaoModel.buscarLocationGoods(),
      ]);

      res.status(200).json({ clientes, bens });
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar os dados" });
    }
  },

  async DeleteLocationFinish(req, res) {
    try {
      const { id } = req.params;
      const deleteSuccess = await LocacaoModel.deleteLocation(id);

      if (!deleteSuccess) {
        return res.status(404).json({ message: "Locação não encontrada" });
      }

      return res.status(200).json({
        message: "Locação apagada com sucesso",
      });
    } catch (error) {
      console.error("Erro ao apagar locação:", error);
      return res.status(500).json({ message: "Erro no servidor" });
    }
  },

  async updateStatus(req, res) {
    const { bemId } = req.params;
    const { belostat } = req.body; // Novo status

    if (!bemId || !belostat) {
      return res
        .status(400)
        .json({ error: "Bem ID e novo status são obrigatórios." });
    }

    try {
      
      const bemAtualizado = await LocacaoModel.updateBemStatus(bemId, belostat);
      if (!bemAtualizado) {
        return res.status(404).json({ error: "Bem não encontrado." });
      }

      res.status(200).json({
        message: "Status atualizado com sucesso.",
        bem: bemAtualizado,
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar o status do bem." });
    }
  },
};
