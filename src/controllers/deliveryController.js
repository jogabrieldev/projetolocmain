import { mecanismDelivey } from "../model/modelsDelivery.js";
import { goodsRegister as updateBem } from "../model/modelsGoods.js";
import {deliveryService} from "../service/deliveryService.js"


const controllerDelivery = {
  
  // pegar dados de locação final ja com o bem
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
 
     // pegar locação por codigo do motorista passado no parametro
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

     // atualizar status de entrega
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

     // finalizar a entrega
async finishProcessDelivery(req, res) {
  try {
    const payload = req.body;

    if (!payload) {
      return res.status(400).json({
        message: "É obrigatório enviar a entrega, número da locação e o nome do motorista",
        success: false,
      });
    }

    const socket = req.app.get("socketio");

    // Chama o service que já trata toda a transação
    const result = await deliveryService.finishDeliveryTransaction(payload, socket);

    return res.status(200).json(result);

  } catch (error) {
    console.error("Erro ao finalizar entrega", error);

    return res.status(500).json({ message:"Erro no server para finalizar entrega", success: false });
  }
},
 // Aceitar entrega e atualizar status
  async updateStatusAcceptDelivery(req ,res){

     try {
       const {id} = req.params
       const { goodsId ,status} = req.body

       console.log(req.body)

       if(!status || !id || !goodsId){
        return res.status(400).json({message:'Não foi passado os dados obrigatorios! Verifique'})
       }

       const { updatedDelivery, updatedGoods } = await deliveryService.acceptDeliveryAndUpdateGoods(
        id,
        goodsId,
        status,                    
        "A destino do cliente"  
      );
       
      return res.status(200).json({
        message: "Status da entrega e do bem atualizados com sucesso!",
        delivery: updatedDelivery,
        goods: updatedGoods
      });
     
    } catch (error) {
      console.error('Erro para atualizar os status no momento de aceitar entrega')
      return res.status(500).json({message:"Erro no server para atualizar status"})
    }
     
  }
}

export {controllerDelivery}