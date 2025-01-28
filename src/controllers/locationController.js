
const LocacaoModel = require("../model/location");

const LocacaoController = {

  async LocacaoClient(req, res) {

    const { userClientValidade, dataLoc, dataDevo, horaLoc, pagament , bens } =
      req.body;

    try {
      if (!userClientValidade) {
        return res.status(400).json({ error: "CPF do cliente e Obrigatorio" });
      }
      // Buscar o cliente pelo CPF
      const cliente = await LocacaoModel.buscarClientePorCPF(
        userClientValidade
      );
      if (!cliente) {
        return res.status(404).json({ error: "Cliente não encontrado." });
      }

      const novaLocacao = await LocacaoModel.clientLoc({
        clloclit: cliente.cliecode,
        cllodtlo: dataLoc,
        cllodtdv: dataDevo,
        cllohrlo: horaLoc,
        cllofmpg: pagament,
      });

      console.log('clloid gerado' , novaLocacao)
     
      const addIdClient = await LocacaoModel.inserirBens(bens , novaLocacao)

      return res
        .status(201)
        .json({ message: "Locação criada com sucesso.", locacao: novaLocacao });
    } catch (error) {
      console.error("Erro ao criar locação:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  },

   async getClientByCPF (req, res){
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

  async locacaoBens(req, res) {
    const { bens } = req.body;
   
  
    if (!bens || bens.length === 0) {
      return res.status(400).json({ error: "Nenhum dado enviado." });
    }

    if (!Array.isArray(bens)) {
      return res
        .status(400)
        .json({ error: 'A propriedade "bens" deve ser um array.' });
    }

    try {
      const novaLocacao = await LocacaoModel.inserirBens(bens);

      console.log( " Esssa locação agora tem client" ,novaLocacao)

      res
        .status(201)
        .json({
          message: "Dados cadastrados com sucesso.",
          locacao: novaLocacao,
        });

       
    } catch (error) {
      console.error("Erro ao cadastrar bens:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
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

  async listarLocacoes(req, res) {
    try {
      const locacoes = await LocacaoModel.buscarLocacoes();
      res.status(200).json({
        message: "Locações listadas e inseridas com sucesso na tabela locfim.",
        data: locacoes,
      });
    } catch (error) {
      console.error("Erro ao listar locações:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  },

};

module.exports = LocacaoController;
