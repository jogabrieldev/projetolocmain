import { LocacaoModel } from "../model/modelsLocationGoods.js";
import { moduleResiduo } from "../model/modelsResiduo.js";
import { movementDestination } from "../model/modelsDestination.js";

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
    const { userClientValidade, numericLocation, dataLoc, localization, resi, descarte, dataDevo, pagament, bens } = req.body;
     
    try {
    
       if(!bens || bens.length === 0) {
        return res.status(400).json({ error: "Nenhum dado de bens enviado." });
       }

      if(!userClientValidade || userClientValidade.length < 2) {
         return res.status(400).json({ error: "CPF/CNPJ e Nome do cliente é obrigatório." });
      }

      if(!numericLocation){
        return res.status(400).json({error:"Numero de locação não foi gerado"})
      }
       
      const idNumericLocation = await LocacaoModel.getNumberLocationCheck()
      const validNumericLocation= idNumericLocation.map(item =>item.cllonmlo)
      const numericLocationNormalized = String(numericLocation).trim();

     if (validNumericLocation.includes(numericLocationNormalized)) {
       return res.status(400).json({
       error: "O número de locação gerado já existe! Acione o suporte."
       });
      }

      if(!descarte){
        return res.status(400).json({error: "Local de descarte é obrigatório."});
      }

      const codeDescarte = await movementDestination.getCodeDestination()
  
      const validCode = codeDescarte.map(item =>item.dereid)
      if(!validCode.includes(descarte)){
        return res.status(400).json({error:"Local de descarte não existe no banco de dados! verifique"})
      }
      
      if(!resi){
        return res.status(400).json({error:"E obrigatorio passar o residuo envolvido"})
      }

       const codeResi = await moduleResiduo.getCodeResiduo()
       const codeValid = codeResi.map(item => item.resicode);
        if (!codeValid.includes(resi)) {
           return res.status(400).json({ error: "O residuo não existe no nosso banco de dados! verifique" });
         }
     
     
     const ClientDate = userClientValidade[1].replace(/\D/g, ''); 

     let cliente = null;

    if (ClientDate.length === 11) {
  
       cliente = await LocacaoModel.buscarClientePorCPF(ClientDate);
    } else if (ClientDate.length === 14) {
 
       cliente = await LocacaoModel.buscarClientePorCnpj(ClientDate);
     } else {
       return res.status(400).json({ error: "Formato de CPF ou CNPJ inválido." });
     }

   if (!cliente) {
     return res.status(404).json({ error: "Cliente não encontrado no banco de dados verifique por favor !." });
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
         return res.status(400).json({ error: "A data de devolução deve ser maior doque à data da locação." });
      }
       
      const feriados = [
        "01-01", // Confraternização Universal
        "04-18", // Sexta-feira Santa
        "04-21", // Tiradentes
        "05-01", // Dia do Trabalho
        "09-07", // Independência do Brasil
        "10-12", // Nossa Senhora Aparecida
        "11-02", // Finados
        "11-15", // Proclamação da República
        "12-25"  // Natal
      ];

      const formatDiaMes = (data) => {
      const dia = String(data.getDate()).padStart(2, "0");
      const mes = String(data.getMonth() + 1).padStart(2, "0");
      return `${mes}-${dia}`;
    };

    const dataDevoDiaMes = formatDiaMes(dataDevoNormalizada);
    if (feriados.includes(dataDevoDiaMes)) {
      return res.status(400).json({ error: `A data de devolução (${dataDevo}) cai em um feriado. Escolha outra data.` });
    }
       
      const codigoUsado = new Set()
      for (const [index, bem] of bens.entries()) {

        if (!bem.codeBen) {
        return res.status(400).json({ error: `Grupo ${index + 1}: Código do bem é obrigatório.` });
      }

      if (codigoUsado.has(bem.codeBen)) {
        return res.status(400).json({ error: `Grupo ${index + 1}: O código "${bem.codeBen}" já foi utilizado em outro grupo.` });
      }
      codigoUsado.add(bem.codeBen);

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
        cllocpcn: cliente.cliecpf || cliente.cliecnpj,
        clloresi: resi,
        cllodesc:descarte,
        cllorua:localization.localizationRua,
        cllobair:localization.localizationBairro,
        cllocida:localization.localizationCida,
        cllocep:localization.localizationCep,
        cllorefe:localization.localizationRefe,
        clloqdlt:localization.localizationQdLt
      });
      
  
      await LocacaoModel.inserirBens(bens, locationClient);
      
      const listAllLocation = await LocacaoModel.buscarTodasLocacoes();
  
      const io = req.app.get("socketio");
      if (io) {
        io.emit("updateRunTimeRegisterLocation", listAllLocation);
      }
  
      return res.status(200).json({ message: "Locação criada com sucesso." , success:true });
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

      return res.status(200).json({ success: true, nome: client.clienome });
    } catch (error) {
      console.error(
        "Erro no controller ao buscar cliente por CPF:",
        error.message
      );
      return res.status(500).json({
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
        return res.status(400).json({success:false , message:'Erro ao buscar dados da familia'})
      }
       return res.status(200).json(familias); 
    } catch (error) {
      console.error("Erro ao listar famílias de bens:", error);
       return res.status(500).json({ error: "Erro ao buscar famílias de bens." });
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
      return res.status(500).json({ error: "Erro ao buscar os dados de locação" });
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
        codeBen: bem.belocodb,
        produto: bem.belobem,
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

      return res.status(200).json({
        message: "Locação atualizada com sucesso!",
        data: resultado,
      });
    } catch (error) {
      console.error("Erro ao atualizar locação e bens:", error);
      return res.status(500).json({ error: "Erro interno ao atualizar locação e bens." });
    }
  },
  
  async insertNewGoods(req , res){
      
    try {
         const {newGoods} = req.body 

         if ( !Array.isArray(newGoods)) {
          return res.status(400).json({ error: "Dados inválidos para atualização." });
        }

        const codigoUsado = new Set();

        for (const [index, bem] of newGoods.entries()) {
         if (!bem.codeBen) {
          return res.status(400).json({ error: `Grupo ${index + 1}: Código do bem é obrigatório.` });
       }

      if (codigoUsado.has(bem.codeBen)) {
        return res.status(400).json({
          error: `Grupo ${index + 1}: O código "${bem.codeBen}" já foi utilizado em outro grupo.`,
        });
      }
    }
      
       const novosbensInseridosLocacao = await LocacaoModel.inserirNovosBens(newGoods)
       if(!novosbensInseridosLocacao){
         return res.status(400).json({error: "Problema para inserir novos bens"})
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
