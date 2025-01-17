

const client = require('../database/userDataBase');
const LocacaoModel = require('../model/location');

const LocacaoController = {
  async criarLocacao(req, res) {
    const {userClientValidade,
      dataLoc,
      dataDevo,
      horaLoc,
      pagament,
      } = req.body;

    try {

      if (!userClientValidade) {
        return res.status(400).json({ error: 'CPF do cliente e Obrigatorio' });
       
      }
      // Buscar o cliente pelo CPF
      const cliente = await LocacaoModel.buscarClientePorCPF(userClientValidade);
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }
       
      
      console.log("Dados sendo inseridos:", 
        cliente.cliecode
      )
   
      const novaLocacao = await LocacaoModel.clientLoc({
        clloclit: cliente.cliecode ,
        cllodtlo:dataLoc,
        cllodtdv:dataDevo,
        cllohrlo:horaLoc, 
        cllofmpg:pagament
      });
      return res.status(201).json({ message: 'Locação criada com sucesso.', locacao: novaLocacao });
    } catch (error) {
      console.error('Erro ao criar locação:', error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  },


  async locacaoBens(req, res) {
    const { groups } = req.body;

    if (!groups || groups.length === 0) {
      return res.status(400).json({ error: "Nenhum dado enviado." });
    }
      // console.log('dados recebidos do front' , groups )
    try {
      const novaLocacao = await LocacaoModel.inserirBens(groups)
      // Chama o método no Model
      res.status(201).json({ message: "Dados cadastrados com sucesso." , locacao: novaLocacao });

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


};

module.exports = LocacaoController;
