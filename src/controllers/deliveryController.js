import { mecanismDelivey } from "../model/deliveryModel.js";

const controllerDelivery = {

      async getDate(req , res){
          try {
             const response = await mecanismDelivey.getDateLocationFinish()
             if(response){
                return res.status(200).json(response)
             }
          } catch (error) {
            res.status(500).json({messagem: "ERRO SERVER "})
             console.error('erro no controller', error)

          }
     }
}

export {controllerDelivery}