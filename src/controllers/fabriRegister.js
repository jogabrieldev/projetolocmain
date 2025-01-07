const fabriRegister = require('../model/dataFabri')

const movementOfFabri = {
      
    registerOfFabri: async (req , res)=>{
       
        try {
            const dataFabri = req.body

            if(!dataFabri){
                return res.status(400).json({message:"campos obrigatorios não preenchidos"})
             }

             const newFabri = fabriRegister.registerOfFabri(dataFabri)
            res.status(201).json({ success: true, user: newFabri });

          } catch (error) {
               
            console.log('erro no controller')
            res.status(500).json({ success: false, message: error.message });
          }
    },

    listingOfFabri: async (req , res)=>{
        try {
            const fabricante = await fabriRegister.listingFabri()
            res.json(fabricante).status(200)

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

    deleteOfFabri: async(req ,res)=>{
         
        try {
            const { id } = req.params;
            const deleteComponent = await fabriRegister.deleteFabri(id);
    
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

    updateFabri:  async(req, res)=> {
        const fabeId = req.params.id;
        const updateData = req.body;
       
        Object.keys(updateData).forEach((key) => {
          if (updateData[key] === "") {
            updateData[key] = null;
          }
        });
    
        try {
    
          const updateProd = await fabriRegister.updateFabri(fabeId, updateData);
          res.json({ message: "produto atualizado com sucesso", fabricante: updateProd });
    
        } catch (error) {
    
          console.error("Erro ao atualizar o fabricante:", error);
          res.status(500).json({ message: "Erro ao atualizar o fabricante", error });
        }
      },


}

module.exports = movementOfFabri