
import { clientRegister } from "../model/modelsClient.js";
import fetch from "node-fetch";

export const movementClient = {
  async registerClient(req, res) {
    try {
      const dataClientSubmit = req.body;

      if (!dataClientSubmit) {
        return res
          .status(400)
          .json({ message: "Campos obrigatórios não preenchidos." });
      }

  
      const validCpfSystem = await clientRegister.verifyCredenciClient();

      const resuntConsult = validCpfSystem.map(item => (item.cliecpf || item.cliecnpj));

      const cpfToCheck = (dataClientSubmit.clieCpf || dataClientSubmit.clieCnpj || "").replace(/\D/g, "");

      const jaCadastrado = resuntConsult.some(doc => (doc || "").replace(/\D/g, "") === cpfToCheck);

       if (jaCadastrado) {
         return res.status(400).json({ message: "CPF ou CNPJ já cadastrado no sistema. Valide com o cliente." });
      }

      const { dtCad, dtNasc } = dataClientSubmit;

      // Função auxiliar para validar se a data é válida
      const isDataValida = (str) => {
        return (
          /^\d{4}-\d{2}-\d{2}$/.test(str) && !isNaN(new Date(str).getTime())
        );
      };

      if (!isDataValida(dtCad)) {
        return res.status(400).json({ message: "Data de Cadastro inválida." });
      }

      if (!isDataValida(dtNasc)) {
        return res
          .status(400)
          .json({ message: "Data de Nascimento inválida." });
      }

      const [yCad, mCad, dCad] = dtCad.split("-").map(Number);
      const [yNasc, mNasc, dNasc] = dtNasc.split("-").map(Number);

      const dataCadastro = new Date(yCad, mCad - 1, dCad);
      const dataNascimento = new Date(yNasc, mNasc - 1, dNasc);
      const hoje = new Date();
      const hoje0 = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate()
      );

      // dtCad deve ser igual à data de hoje
      if (dataCadastro.getTime() !== hoje0.getTime()) {
        return res.status(400).json({
          message: "Data de Cadastro deve ser igual à data de hoje.",
        });
      }

      // dtNasc não pode ser no futuro
      if (dataNascimento.getTime() >= hoje0.getTime()) {
        return res.status(400).json({
          message:
            "Data de Nascimento não pode ser maior ou igual à data de hoje.",
        });
      }

      // dtNasc deve ser anterior ou igual à dtCad
      if (dataNascimento.getTime() > dataCadastro.getTime()) {
        return res.status(400).json({
          message:
            "Data de Nascimento não pode ser posterior à Data de Cadastro.",
        });
      }

      const { clieName } = dataClientSubmit
    if (!clieName || clieName.trim().length < 3) {
    return res.status(400).json({
    success: false,
    message: "O nome do fornecedor é obrigatório e deve conter pelo menos 3 letras.",
  });
}
  const { clieMail} = dataClientSubmit;

      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailValido.test(clieMail)) {
        return res.status(400).json({
          success: false,
          message: "E-mail inválido. Insira um e-mail no formato correto.",
        });
      }

      const cepClie = dataClientSubmit.clieCep;

      if (!cepClie || !/^\d{5}-?\d{3}$/.test(cepClie)) {
        return res.status(400).json({ message: "CEP inválido." });
      }

      const response = await fetch(`https://viacep.com.br/ws/${cepClie}/json/`);
      const cepData = await response.json();

      if (cepData.erro) {
        return res.status(400).json({ message: "CEP não encontrado." });
      }

      const newClient = await clientRegister.registerOfClient(dataClientSubmit);
      if (!newClient) {
        return res.status(400).json({ message: "Erro ao inserir cliente" });
      }

      const io = req.app.get("socketio");
      if (io) {
        const clients = await clientRegister.listingClient();
        io.emit("clienteAtualizado", clients);
      }

      res.status(201).json({ success: true, user: newClient });
      
    } catch (error) {
      console.error("erro no controller client");

      if (error.message.includes("Código de cliente já cadastrado")) {
        return res.status(409).json({ success: false, message: error.message });
      }

      res.status(500).json({ success: false, message: error.message });
    }
  },

 async getClientByCode(req, res) {
    const { cliecode , valueCpf , valueCnpj } = req.query;
    try {
      if (!cliecode && !valueCpf && !valueCnpj ) {
        return res.status(400).json({ message: "Dados do cliente e obrigatorio para pesquisa." });
      }

      const cpf = valueCpf?.replace(/\D/g, "")
      const cnpj = valueCnpj?.replace(/\D/g, "")

      if(valueCpf && !cpf){
         return res.status(400).json({ message: "O CPF do cliente está em formato inválido." });
       }

      if (valueCnpj && !cnpj) {
      return res.status(400).json({ message: "O CNPJ do cliente está em formato inválido." });
      }

      const cliente = await clientRegister.getClientByFilter(cliecode , cpf , cnpj);

      if (!cliente || cliente.length === 0) {
        return res.status(404).json({ message: "Cliente não encontrado valide os dados de pesquisa." });
      }

      return res.status(200).json({success:true , cliente});
    } catch (error) {
      console.error("Erro ao buscar cliente por código:", error);
      return res.status(500).json({ message: "Erro ao buscar cliente." });
    }
  },

  getClientId: async (req, res) => {
    const { cliecode } = req.params;

    if(!cliecode){
       return res.status(400).json({message: 'E preciso passar o parametro para a busca'})
    }

    try {
      const cliente = await clientRegister.getClientForId(cliecode);

      if (!cliente || cliente.length === 0) {
        return res.status(404).json({ message: "Cliente não encontrado verifique a credencial." });
      }

      res.status(200).json(cliente);
    } catch (error) {
      console.error("Erro ao buscar cliente:", error.message);
      res.status(500).json({ message: "Erro interno ao buscar cliente." });
    }
  },

  async listingOfClient(req, res) {
    try {
      const client = await clientRegister.listingClient();
      if (!client) {
        return res
          .status(400)
          .json({ success: false, message: "Erro na listagem de client" });
      }
      res.status(200).json(client);
    } catch (error) {
      console.error("erro no controller para listar o cliente", error.message);
      res.status(500).json({
        success: false,
        message: "erro interno no server",
        message: error.message,
      });
    }
  },

  async deleteOfClient(req, res) {
    const { id } = req.params;
    try {
      const temDependencia = await clientRegister.verificarDependenciaCliente(
        id
      );

      if (temDependencia) {
        return res.status(400).json({
          message: "Não e possivel excluir. O cliente tem locação",
        });
      }
      const deleteComponent = await clientRegister.deleteClient(id);

      if (deleteComponent) {
        return res.status(200).json({
          message: "Client Apagado com sucesso",
          component: deleteComponent,
        });
      } else {
        return res.status(500).json({ message: "Cliente não encontrado" });
      }
    } catch (error) {
      console.error("erro ao apagar componente:", error);
      return res.status(500).json({ message: "erro no servidor" });
    }
  },

  async updateOfClient(req, res) {
    const clientId = req.params.id;
    const updateClient = req.body;

    if(!clientId || !updateClient){
       return res.status(400).json({message: 'Falta informações para atualização do cliente'})
    }

    Object.keys(updateClient).forEach((key) => {
      if (updateClient[key] === "") {
        updateClient[key] = null;
      }
    });

    const clientExists = await clientRegister.getClientByFilter(clientId);
      if (!clientExists) {
       return res.status(400).json({ message: "Código do cliente é inválido." });
    }


    const { cliemail} = updateClient;

      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailValido.test(cliemail)) {
        return res.status(400).json({
          success: false,
          message: "E-mail inválido. Insira um e-mail no formato correto.",
        });
      }

      const cepClie = updateClient.cliecep;

      if (!cepClie || !/^\d{5}-?\d{3}$/.test(cepClie)) {
        return res.status(400).json({ message: "CEP inválido." });
      }

      const response = await fetch(`https://viacep.com.br/ws/${cepClie}/json/`);
      const cepData = await response.json();

      if (cepData.erro) {
        return res.status(400).json({ message: "CEP não encontrado." });
      }

    try {
      const io = req.app.get("socketio");
      const clientUpdate = await clientRegister.updateClient(
        clientId,
        updateClient
      );
      if (!clientUpdate) {
        return res
          .status(404)
          .json({ message: "cliente não encontrado para atualização." });
      }
      if (io) {
        io.emit("updateClients", clientUpdate);
      } else {
        console.warn("Socket.IO não está configurado.");
      }

      res.json({
        message: "Bem atualizado com sucesso",
        Cliente: clientUpdate,
      });
    } catch (error) {
      console.error("Erro ao atualizar o Cliente:", error);
      res.status(500).json({ message: "Erro ao atualizar o Cliente", error });
    }
  },
};
