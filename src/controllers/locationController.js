import { LocacaoModel } from "../model/location.js";

export const location = {

  async gerarNumeroLocacao(req, res) {
    try {
      const numero = await LocacaoModel.gerarNumeroLocacao(); 

      if(!numero){
         return res.status(404).json({message: "Numero de locação não foi gerado"})
      }
      return res.status(200).json({ numericLocation: numero });
    } catch (error) {
      console.error("Erro ao gerar número de locação:", error);
      return res.status(500).json({ error: "Erro ao gerar número de locação." });
    }
  },

  async dataLocacao(req, res) {
    const { userClientValidade, numericLocation, dataLoc, dataDevo, pagament, bens } = req.body;

    try {
      if (!bens || bens.length === 0) {
        return res.status(400).json({ error: "Nenhum dado de bens enviado." });
      }
  
      if (!userClientValidade || userClientValidade.length < 2) {
        return res.status(400).json({ error: "CPF do cliente é obrigatório." });
      }
  
      const cpfClient = userClientValidade[1];
      const cliente = await LocacaoModel.buscarClientePorCPF(cpfClient);
  
      if (!cliente) {
        return res.status(404).json({ error: "Cliente não encontrado." });
      }
  
      // Verificações de data
      if (!dataLoc || !dataDevo) {
        return res.status(400).json({ error: "Data de locação e devolução são obrigatórias." });
      }
  
      const dataLocDate = new Date(dataLoc);
      const dataDevoDate = new Date(dataDevo);
  
      if (isNaN(dataLocDate) || isNaN(dataDevoDate)) {
        return res.status(400).json({ error: "Formato de data inválido." });
      }
  
      // Normalizar datas para comparar apenas a parte da data (sem hora)
      const normalizar = (data) => new Date(data.getFullYear(), data.getMonth(), data.getDate());
  
      const dataLocNormalizada = normalizar(dataLocDate);
      const dataDevoNormalizada = normalizar(dataDevoDate);

      if (dataDevoNormalizada <= dataLocNormalizada) {
        return res.status(400).json({ error: "A data de devolução deve ser posterior à data da locação." });
      }
       
      const feriados = [
        "2025-01-01", // Confraternização Universal
        "2025-04-18", // Sexta-feira Santa
        "2025-04-21", // Tiradentes
        "2025-05-01", // Dia do Trabalho
        "2025-09-07", // Independência do Brasil
        "2025-10-12", // Nossa Senhora Aparecida
        "2025-11-02", // Finados
        "2025-11-15", // Proclamação da República
        "2025-12-25"  // Natal
      ];

      const dataDevoStr = dataDevoNormalizada.toISOString().split("T")[0];
      if (feriados.includes(dataDevoStr)) {
        return res.status(400).json({ error: `A data de devolução (${dataDevoStr}) cai em um feriado. Escolha outra data.` });
      }
  
      for (const [index, bem] of bens.entries()) {
        if (!bem.dataFim) {
          return res.status(400).json({ error: `Grupo ${index + 1}: Data FIM do bem é obrigatória.` });
        }
  
        const dataFimBem = new Date(bem.dataFim);
        if (isNaN(dataFimBem)) {
          return res.status(400).json({ error: `Grupo ${index + 1}: Data FIM inválida.` });
        }
  
        const dataFimNormalizada = normalizar(dataFimBem);
  
        if (dataFimNormalizada.getTime() !== dataDevoNormalizada.getTime()) {
          return res.status(400).json({
            error: `Grupo ${index + 1}: A data FIM (${bem.dataFim}) deve ser igual à data de devolução da locação (${dataDevo}).`
          });
        }
      }
  
      const locationClient = await LocacaoModel.criarLocacao({
        cllonmlo: numericLocation,
        clloidcl: cliente.cliecode,
        cllodtdv: dataDevo,
        cllodtlo: dataLoc,
        cllopgmt: pagament,
        clloclno: cliente.clienome,
        cllocpf: cpfClient,
      });
  
      await LocacaoModel.inserirBens(bens, locationClient);
  
      const listAllLocation = await LocacaoModel.buscarTodasLocacoes();
  
      const io = req.app.get("socketio");
      if (io) {
        io.emit("updateRunTimeRegisterLocation", listAllLocation);
      }
  
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
      if(!familias){
        res.status(400).json({success:false , message:'Erro ao buscar dados'})
      }
      res.status(200).json(familias); // Retorna os dados como JSON
    } catch (error) {
      console.error("Erro ao listar famílias de bens:", error);
      res.status(500).json({ error: "Erro ao buscar famílias de bens." });
    }
  },

  async buscarLocationFinish(req, res) {
    try {
      const locacaoFinish = await LocacaoModel.buscarTodasLocacoes();

      if (!locacaoFinish || locacaoFinish.length === 0) {
        return res.status(404).json({ message: 'Nenhuma locação encontrada' });
      }
  
      return res.status(200).json({ locacoes: locacaoFinish }); 
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar os dados de locação" });
    }
  },
  
  async buscarLocacaoPorId(req, res) {
    try {
        const { id } = req.params; // Pega o ID da URL

        if (!id) {
            return res.status(400).json({ error: "ID da locação não foi informado." });
        }

        const locacao = await LocacaoModel.buscarLocationPorId(id); 

        if (!locacao) {
            return res.status(404).json({ error: "Essa Locação não foi encontrada." });
        }

         return res.status(200).json(locacao);
    } catch (error) {
        console.error("Erro ao buscar locação por ID:", error);
        res.status(500).json({ error: "Erro ao buscar a locação" });
    }
},

async DeleteLocationFinish(req, res) {

  const { id } = req.params;
  try {
     const verificar = await LocacaoModel.verificarDependenciaLocacao(id);
    
          if (verificar) {
            return res.status(400).json({
              message: "Não e possivel excluir. a locação esta vinculada a um bem ",
            });
          }
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
    const { codeLocation } = req.params;
    const { belostat } = req.body; // Novo status

    if (!codeLocation || !belostat) {
      return res
        .status(400)
        .json({ error: " ID bem e novo status são obrigatórios." });
    }

    try {
      const bemAtualizado = await LocacaoModel.updateBemStatus(codeLocation, belostat);
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

  async updateLocationAndBens(req, res) {
    try {
      const { id } = req.params; // ID da locação vindo da URL
      const { bens } = req.body; // Recebendo os dados da locação e bens

      const bensConvertidos = bens.map(bem => ({
        codeBen: bem.bencodb,
        produto: bem.beloben,
        dataInicio: bem.belodtin,
        dataFim: bem.belodtfi,
        quantidade: bem.beloqntd,
        observacao: bem.beloobsv,
        belocode: bem.belocode // se tiver
      }));

      if (!id || !Array.isArray(bens)) {
        return res.status(400).json({ error: "Dados inválidos para atualização." });
      }

      const resultado = await LocacaoModel.updateLocationAndBens(id, bensConvertidos);
      if(!resultado){
        return res.status(400).json({error: "Erro na atualização da locação"})
      }

      const io = req.app.get("socketio");
      if (io) {
        io.emit("updateRunTimeInEditLocation", {id:id});
      }

      res.status(200).json({
        message: "Locação atualizada com sucesso!",
        data: resultado,
      });
    } catch (error) {
      console.error("Erro ao atualizar locação e bens:", error);
      res.status(500).json({ error: "Erro interno ao atualizar locação e bens." });
    }
  },
  
  async insertNewGoods(req , res){
      
    try {
        //  const {idLoc} = req.params
         const {newGoods} = req.body 

         console.log('novo' ,newGoods)

         if ( !Array.isArray(newGoods)) {
          return res.status(400).json({ error: "Dados inválidos para atualização." });
        }
      
       const novosbensInseridosLocacao = await LocacaoModel.inserirNovosBens(newGoods)
       if(!novosbensInseridosLocacao){
        res.status(400).json({error: "Bens não inserido"})
       }

       const io = req.app.get("socketio");
       if (io) {
         io.emit("InsertNewGoodsRunTimeInEditLocation", novosbensInseridosLocacao);
       }
 
       return res.status(201).json({
        message: "Novos bens inseridos com sucesso.",
        inseridos: novosbensInseridosLocacao
      });
    } catch (error) {
        
      console.error("Erro no insertNewGoods:", error);
      return res.status(500).json({ error: "Erro ao inserir novos bens." });
    }
  }
};
