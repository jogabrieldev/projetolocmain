import { moduleClientEmp } from "../model/dataClientEmp.js";


 export const movementClientEmp = {
     
    async registerNewClientEmp(req , res){
          
        try {
             const { dataClientEmp } = req.body
             console.log('dados' , dataClientEmp)

             if(!dataClientEmp){
                return res.status(400).json({message:" falta dados obrigatorios"})
             }

             const resunt = await moduleClientEmp.registerClientEmp(dataClientEmp)
             if(!resunt){
                return res.status(400).json({message: "Erro na inserção do novo cliente"})
             }

              return res.status(200).json({message:"sucesso ao cadastrar novo cliente" , success: true , data: resunt})
        } catch (error) {
            console.error('erro no controller do new clientEMp', error)
            res.status(500).json({message:"ERRO no server na inserção do cliente"})
        }
     }
}