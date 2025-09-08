import { processDevolution } from "../model/modelsDevolution.js";

export const controllerDevolution = {
      
     async getDevolution(req ,res){
         try {
              const result = await processDevolution.getDevolutionTheDay()
              if(!result){
                 return res.status(400).json({message:"Nenhuma devolução encontrata"})
              }
          
             return res.status(200).json({message:"Sucesso na busca" ,success:true , devolution:result})
         } catch (error) {
             console.error("Erro no server em buscar devolução")
             return res.status(500).json({message:"Erro no server na busca da devolução", success:false})
         }
    }

};