import { moduleResiduo } from "../model/modelsResiduo.js";

export const movementResiduo =  {
    
    async registerResiduo(req , res){
         
        try {
         const {dataResi} = req.body

         if(!dataResi){
            res.status(400).json({message: 'Precisa passar os dados obrigatorios'})
         }

         const result = await moduleResiduo.registerResiduo(dataResi)
         if(!result){
            res.status(400).json({message:'Erro para inserir no DB'})
        }

          const io = req.app.get("socketio");
            if (io) {
              const residuo = await moduleResiduo.getAllResiduo();
               io.emit("updateRunTimeResiduo", residuo);
              }

       
        res.status(200).json({message:"Residuo Inserido com sucesso" , success:true , residuo:result})
     
        } catch (error) {
            console.error('erro na aplicação na parte residuo' , error)

            if (error.message.includes("Código de Residuo já cadastrado. Tente outro.")) {
            return res.status(409).json({ success: false, message: error.message });
      }
            res.status(500).json({message: 'Erro no controller do residuo' , success:false})
        }
       
    },

     async listResiduo(req , res){
          try {
              const residuo = await moduleResiduo.getAllResiduo()
              if(!residuo){return res.status(400).json({message:"Erro para pegar os residuos"})}
              return res.status(200).json({success: true , list: residuo})
          } catch (error) {
            console.error('erro na aplicação na parte residuo para listar' , error)
            res.status(500).json({message: 'Erro no controller do residuo' , success:false})
          }
     },

  async getIdResiduo(req , res){
      try {
         const {id} =  req.params
         if(!id){
          return res.status(400).json({message:'Tem que passar o ID do residuo'})
         }

         const resunt = await moduleResiduo.getIdResiduo(id)
         if(!resunt){
           return res.status(400).json({message:"não existe esse residuo no sistema"})
         }
         
         return res.status(200).json({message:'Busca bem sucedida!', success:true , resunt})
      } catch (error) {
         console.error('Erro a buscar o indentificador do residuo')
         return res.status(500).json({message:"Erro no server a buscar o ID residuo"})
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