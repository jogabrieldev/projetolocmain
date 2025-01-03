const fornRegister = require('../model/dataForn')

 const  movementOfForn = {
     registerForn: async(req , res)=>{
          
          try {
            const dataForn = req.body

            if(!dataForn){
                return res.status(400).json({message:"campos obrigatorios não preenchidos"})
             }

             const newForn = fornRegister.registerOfForn(dataForn)
            res.status(201).json({ success: true, user: newForn });

          } catch (error) {
               
            console.log('erro no controller')
            res.status(500).json({ success: false, message: error.message });
          }
     },

     listOfForn : async(req, res )=>{
        try {
            const forne  = await fornRegister.listingForn()
            res.json(forne).status(200)

        } catch (error) {
            console.error('erro no controller', error.message)
            res
            .status(500)
            .json({
              success: false,
              message: "erro interno no server",
              message: error.message,
            });
        }   
     },

     deleteOfForm: async(req ,res)=>{
         
      try {
        const { id } = req.params;
        const deleteComponent = await fornRegister.deleteForn(id);

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
     },

     updateOfForn: async(req , res)=>{
         
        const fornId = req.params.id;
        const updateForn = req.body;

       Object.keys(updateForn).forEach((key) => {
         if (updateForn[key] === "") {
          updateForn[key] = null;
      }
    });

      try {
        const fornUpdate = await fornRegister.updateForn(fornId, updateForn)
        res.json({ message: "Bem atualizado com sucesso", Fornecedor: fornUpdate });
    } catch (error) {
        console.error("Erro ao atualizar o Cliente:", error);
        res.status(500).json({ message: "Erro ao atualizar o Cliente", error });
    }
     }
 }
 module.exports = movementOfForn