import { crudRegisterFamilyGoods as fabriRegister } from "../model/modelsFamilyGoods.js";

export const movementOfFamilyGoods = {

  //cadastro de familia de bens
  async registerOfFabri(req, res) {
    try {
      const dataFabri = req.body;

      if (!dataFabri) {
        return res
          .status(400)
          .json({ message: "campos obrigatorios não preenchidos" });
      }

      const newFabri = await fabriRegister.registerOfFabri(dataFabri);
      if(!newFabri){
        return res.status(400).json({message: 'Erro ao cadastrar nova familia de bens'})
      }

      const listFamilyBens = await fabriRegister.listingFabri();
      if(!listFamilyBens){
         return res.status(400).json({message:"Erro ao listar familias para o socket"})
      }

      const io = req.app.get("socketio");
      if (io) {
        io.emit("updateRunTimeFamilyBens", listFamilyBens);
      }
       return res.status(200).json({ success: true, familia: newFabri });
    } catch (error) {

      console.error("erro no controller");

      if (error.message.includes("Código da familia de bens ja cadastrado. Tente outro.")) {
        return res.status(409).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // buscar familia de bens por codigo
  async getfamilygoodsByCode(req, res) {
     const { fabeCode } = req.query;
     
      try {
        if (!fabeCode) {
          return res.status(400).json({ message: "Informe o código da familia de bem." });
        }
  
        const familyGoods = await fabriRegister.getFamilyGoodsById(fabeCode);
    
        if (!familyGoods) {
          return res.status(404).json({ message: "Nenhuma familia encontrado com esse codigo." });
        }
    
        return res.status(200).json({ success: true, familyGoods });
      } catch (error) {
        console.error("Erro ao buscar familia de bem :", error);
        return res.status(500).json({ message: "Erro ao buscar familia de bem." });
      }
   },
  
   // listar familia de bens
  async listingOfFabri(req, res) {
    try {
      const fabricante = await fabriRegister.listingFabri();
      if(!fabricante){
        return res.status(400).json({message:'Erro ao listar familias de bens'})
      }
      return res.status(200).json(fabricante);
    } catch (error) {
      console.error("erro no controller", error.message);
      return res.status(500).json({
        success: false,
        message: "erro interno no server",
        message: error.message,
      });
    }
  },

  // deletar familia de bens
  async deleteOfFabri(req, res) {
    const { id } = req.params;
     try {
       const temDependencia =
        await fabriRegister.verificarDependenciaDaFamiliaBens(id);
 
      if (temDependencia) {
        return res.status(400).json({
          message:
            "Não e possivel excluir. Temos bens vinculados a essa Familia de bem",
        });
      }

      const dependenciaInLocacao = await fabriRegister.verificarDepedenciaDeReservaLocacao(id)

      if(dependenciaInLocacao){
        return res.status(400).json({
          message:
            "Não é possível excluir. Existem reservas ou locações vinculadas a essa Família de bem.",
        });
      }
      const deleteComponent = await fabriRegister.deleteFabri(id);

      if (deleteComponent) {
        return res.status(200).json({
          message: "componente Apagado com sucesso",
          component: deleteComponent,
        });
      }
    } catch (error) {
      console.error("erro ao apagar componente:", error);
      return res.status(500).json({ message: "erro no servidor" });
    }
  },
  
 // atualizar familia de bens
  async updateFabri(req, res) {
    const fabeId = req.params.id;
    const updateData = req.body;

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === "") {
        updateData[key] = null;
      }
    });

    if(!fabeId || !updateData){
      return res.status(400).json({message:"Não foi passado os dados necessarios para atualização"})
    }

     const idFamilyBens = await fabriRegister.getCodeIdFamilyBens()
      const codeValid = idFamilyBens.map(item => item.fabecode);

        if (!codeValid.includes(fabeId)) {
          return res.status(400).json({ message: "Código da familia de bens inválido." });
          }


    try {
      const io = req.app.get("socketio");
      const updatedFamily = await fabriRegister.updateFabri(fabeId, updateData);
       
      if(!updatedFamily){
        return res.status(404).json({ message: "familia de bem não encontrado para atualização."});
      }
      
      if (io) {
        io.emit("updateRunTimeTableFamilyGoods", updatedFamily); 
      } else {
        console.warn("Socket.IO não está configurado.");
      }

     return res.json({
        message: "produto atualizado com sucesso",
        familia: updatedFamily ,
      });
    } catch (error) {
      console.error("Erro ao atualizar o familia:", error);
      return res.status(500).json({ message: "Erro ao atualizar o familia", error });
    }
  },
};
