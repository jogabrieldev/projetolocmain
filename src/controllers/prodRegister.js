const prodRegister = require('../model/dataProd')

const movementOfprod = {

    registerProd: async(req , res)=>{
          
        try {
          const dataProd = req.body

          if(!dataProd){
              return res.status(400).json({message:"campos obrigatorios não preenchidos"})
           }

           const newProd = prodRegister.registerOfProd(dataProd)
          res.status(201).json({ success: true, user: newProd });

        } catch (error) {
             
          console.log('erro no controller')
          res.status(500).json({ success: false, message: error.message });
        }
   },

   listofProd: async(req , res)=>{
       
    try {
        const produto = await prodRegister.listingOfProd()
        res.json(produto).status(200);
      } catch (error) {
        console.error("Erro no controller:", error.message);
        res
          .status(500)
          .json({
            success: false,
            message: "erro interno no server",
            message: error.message,
          });
      }
   },

   deleteProd: async(req , res)=>{
    try {
        const { id } = req.params;
        const deleteComponent = await prodRegister.deleteOfProd(id);

       if (!deleteComponent) {
       return res.status(404).json({ message: "Componente Não encontrado" });
         }
         return res
         .status(200)
         .json({
           message: "componente Apagado com sucesso",
           component: deleteComponent,
         });
       } catch (error) {
        
        console.error("erro ao apagar componente:", error);
        return res.status(500).json({ message: "erro no servidor" });

    }
   }
}

module.exports = movementOfprod