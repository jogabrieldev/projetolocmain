import { mecanismDelivey } from "../model/modelsDelivery.js";


const controllerDelivery = {

      async getDate(req , res){
          try {
             const response = await mecanismDelivey.getDateLocationFinish()
             if(response){
                return res.status(200).json(response)
             }
          } catch (error) {
              console.error('erro no controller', error)
             return res.status(500).json({messagem: "ERRO SERVER "})
           

          }
     },

}

export {controllerDelivery}