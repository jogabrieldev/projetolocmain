import { moduleResiduo } from "../model/dataResiduo.js";

export const movementResiduo =  {
    
    async registerResiduo(req , res){
         
        try {
         const {dataResi} = req.body

         console.log(" corpo" ,  dataResi)

         if(!dataResi){
            res.status(400).json({message: 'Precisa passar os dados obrigatorios'})
         }

         const result = await moduleResiduo.registerResiduo(dataResi)
         if(!result){
            res.status(400).json({message:'Erro para inserir no DB'})
        }
        
        res.status(200).json({message:"Residuo Inserido com sucesso" , success:true , residuo:result})
     
        } catch (error) {
            console.error('erro na aplicação na parte residuo' , error)
            res.status(500).json({message: 'Erro no controller do residuo' , success:false})
        }
       
    },

      async deleteResiduo(req, res) {
       
        try {
             const { id } = req.params;
            if(!id){
                res.status(400).json({message:"E preciso passar o ID do client"})
            }

            console.log('id' , id)
          const  deleteComponent = await moduleResiduo.deleteResiduo(id)
         
          if (deleteComponent) {
            return res.status(200).json({
              message: "Client Apagado com sucesso",
              component: deleteComponent,
            });
          } else {
            return res.status(500).json({ message: "Cliente não encontrado" });
          }
        } catch (error) {
          console.error("erro ao apagar componente:", error);
          return res.status(500).json({ message: "erro no servidor" });
        }
      },
}