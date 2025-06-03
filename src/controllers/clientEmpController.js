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
     },

     async listClientEmp(req , res){
         try {
            const clientEmp = await moduleClientEmp.getAllClientEmp()
            if(!clientEmp){return res.status(400).json({message:'Erro ao buscar cliente empresa'})}
            return res.status(200).json({success:true , client:clientEmp})
         } catch (error) {
            console.error('erro no controller do new clientEMp', error)
            res.status(500).json({message:"ERRO no server na listagem do cliente"})
         }
     },

     async deleteClientEmp(req ,res){
       try {
         const { id } = req.params;
         const deleteComponent = await moduleClientEmp.deleteClientEmp(id);

        if (!deleteComponent) {
          return res.status(404).json({ message: "Componente Não encontrado" });
        }
          return res.status(200).json({
          message: "componente Apagado com sucesso",
          component: deleteComponent,
      });
      
    } catch (error) {
         console.error("erro ao apagar componente:", error);
        return res.status(500).json({ message: "erro no servidor" });
    }
 },

   async update(req, res) {
    try {
      const clemcode = req.params.clemcode; 
      const data = req.body;

      console.log('code' , clemcode)

      if(!clemcode){
         res.status(400).json({message: "ID não fornecido para atualizar"})
      }
      if(!data){
         res.status(400).json({message: 'Erro no envio de novos dados para atualizar'})
      }
      const result = await moduleClientEmp.updateClientEmp(clemcode , data);
      res.status(200).json({
        message: "Cliente empresarial atualizado com sucesso.",
        data: result
      });
    } catch (error) {
      res.status(400).json({
        message: error.message || "Erro ao atualizar cliente empresarial."
      });
    }
  }

}