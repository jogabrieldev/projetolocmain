import { mecanismDelivey } from "../model/modelsDelivery.js";
import { goodsRegister as updateBem } from "../model/modelsGoods.js";

const controllerDelivery = {

      async getDate(req , res){
          try {
             const response = await mecanismDelivey.getDateLocationFinish()
             if(response){
                return res.status(200).json(response)
             }
          } catch (error) {
              console.error('erro no controller para listar todas as entregas', error)
             return res.status(500).json({messagem: "ERRO SERVER para listar todas as entregas "})
           

          }
     },

    async getDataLocationDriver(req ,res){
        try {
           const {id} = req.params
           if(!id){
             return res.status(400).json({message:"E obrigatorio passar o ID do motorista"})
           }
            const result = await mecanismDelivey.getDataLocationForDriver(id)
            if(!result || result.length == 0){
              return res.status(400).json({message:"Ainda não a entregas para esse motorista"})
            }

           return res.status(200).json({message:"Entrega encontrada para esse motorista" ,success:true , entrega:result})
           
        } catch (error) {
            console.error('Erro para listar entregas para esse motorista' , error)
            return  res.status(500).json({messsage:'Erro no server para listar entregas desse motorista' ,success:false})
        }
     },

     async updateStatusDelivery(req ,res){
         try {
             const {id} = req.params
             const {body} = req.body

             if(!id || !body){
               return res.status(400).json({message:"E obrigatorio enviar o ID e a informação de atualização"})
             }

             const result = await mecanismDelivey.updateStatusDelivery(id , body)
             if(!result){
               return res.status(400).json({message:"Erro na atualização", success:false})
             }

           const socket = req.app.get("socketio")
               if(socket){
                 socket.emit('statusDelivey' , result)
               }

             return res.status(200).json({message:"sucesso na atualização de status dessa entrega" , success:true,  update:result})
         } catch (error) {
            console.error('Erro para atualizar o status da entrega' , error)
            return res.status(500).json({message:"Erro no servidor para atualizar status" ,  success:false})
         }
     },

     async finishProcessDelivery(req ,res){
      try {
         const payload= req.body
         if(!payload){
          return res.status(400).json({message:"E obrigatorio enviar a entrega , numero da locação e o nome do motorista "})
         }
         if(!payload.enfiStat || payload.enfiStat === ""){
           payload.enfiStat = "Finalizado"
         }

         
         const result = await mecanismDelivey.finishDelivery(payload)
         if(!result){
           return res.status(400).json({message:"Erro ao finalizar entrega" , success:false , })
         }
          
         const updateStatus = await mecanismDelivey.updateStatusDelivery(result.enfiloca , result.enfistat)
         if(!updateStatus){
            return res.status(400).json({message:"Erro ao atualizar o status da entrega"})
         }

         const socket = req.app.get("socketio")
          if(socket){
            socket.emit('statusDelivey' , result)
          }

          const updateStatusGoods = await updateBem.updateStatus(result.enfibem , "Esta com cliente")
          if(!updateStatusGoods){
            return res.status(400).json({message:"Erro ao atualizar o status do bem"})
          }

         return res.status(200).json({message:'Entrega finalizada com sucesso' , success:true , entrega:result})
      } catch (error) {
        console.error("Erro ao finalizar entrega" , error )
        return res.status(500).json({message:"Erro no servidor ao finalizar entrega" , success:false})
      }
        
     }

}

export {controllerDelivery}