import { movementDestination } from "../model/modelsDestination.js";
import fetch from "node-fetch";

export const controllerDestination = {
  async insertDestination(req, res) {
    try {
      const body = req.body;
      if (!body) {
        return res.status(400).json({message: "Falta passar informações para o cadastro de destino",});
      }

      const insert = await movementDestination.registerInDestination(body);
      if (!insert) {
        return res.status(400).json({ message: "Erro ao inserir Destiono de descarte" });
      }

      const io = req.app.get("socketio");
      if (io) {
        const destination = await movementDestination.getAllDestination();
        io.emit("updateRunTimeDestinationDiscard", destination);
      }

      return res.status(200).json({ messsage: "Sucesso", destino: insert });
    } catch (error) {
      if (error.message.includes("Código de destino já cadastrado")) {
        return res.status(409).json({ success: false, message: error.message });
      }
      console.error("Erro ao inserir no server", error);
      return res.status(500).json({ message: "Erro no server para inserir destino" });
    }
  },

  async getDestination(req, res) {
    try {
      const destino = await movementDestination.getAllDestination();
      if (!destino) {
        return res
          .status(400)
          .json({ message: "Não foi encontrado nenhum destino" });
      }
      return res.status(200).json({ success: true, destino });
    } catch (error) {
      console.error("Erro ao listar destinos de descarte", error);
      return res
        .status(500)
        .json({ message: "Erro no server ao listar destinos" });
    }
  },

async getDestinationByCode(req , res){
   try {
       const {code} = req.params;
        if(!code){
            return res.status(400).json({message:'Falta passar o codigo do destino'})
        }
        const destino = await movementDestination.getDestinationByCode(code)
          if(!destino){
             return res.status(400).json({message:"Destino não encontrado"})
           }

           return res.status(200).json({success:true , destino})
      } catch (error) {
         console.error("Erro ao buscar destino por código:", error.message);
         return res.status(500).json({message:"Erro no server ao buscar destino por codigo"})
      }
},

  async deleteDestination(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(400)
          .json({ message: "Não foi passado o indentificador para deletar" });
      }
      const delet = await movementDestination.deleteDestination(id);
      if (!delet) {
        return res
          .status(400)
          .json({ message: "Erro ao tentar deletar destino" });
      }

      return res.status(200).json({ success: true, delet });
    } catch (error) {
      console.error("Erro para deletar destino");
      return res
        .status(500)
        .json({ message: "Erro no server ao deletar destino" });
    }
  },

 async updateDestination(req , res){
    try {
        const {iddestination} = req.params
        const bodyDestination = req.body

       if(!iddestination || !bodyDestination){
          return res.status(400).json({message:'falta passar informações verifique'})
         }

       const updateDestination = await movementDestination.updateDestination(iddestination , bodyDestination)
         if(!updateDestination){
            return res.status(400).json({message:'Erro na atualização de destino'})
        }

        return res.status(200).json({message:"Destino atualizado com sucesso" , dest:updateDestination , success:true})
  
     } catch (error) {
        console.log('Erro no server na atualização' , error)
        return res.status(500).json({message: 'Erro no server na atualização de destino'})
     }
  }
};
