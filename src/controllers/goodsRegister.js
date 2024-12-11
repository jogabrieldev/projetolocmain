
const userRegister = require("../model/data");

const movementOfBens= {

  registerBens: async  (req, res)=> {
    try {
      const {data} = req.body

      //  console.log(data)
       
      const newUser = await userRegister.registerOfBens(data);
      res.status(201).json({ success: true, user: newUser });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async listBens  (req , res){
    try {

        const bens = await userRegister.listingBens();
        res.json(bens).status(200);

     } catch (error) {

       console.error("Erro no controller:", error.message);
      res.status(500).json({success: false , message: 'erro interno no server' ,message: error.message})
    }
  },

  async getBemById(req, res) {
    const bemId = req.params.id;

    try {
        const bem = await userRegister.getBemByIdModel(bemId);  // Método no model
        if (!bem) {
            return res.status(404).json({ message: 'Bem não encontrado' });
        }
        res.json(bem);
    } catch (error) {
        console.error('Erro ao buscar bem:', error);
        res.status(500).json({ message: 'Erro ao buscar bem' });
    }
},

 
  async updateGoods(req , res){
     

    const bemId = req.params.id;
     const updatedData = req.body;

    try {
        const updatedBem = await userRegister.updateBens(bemId , updatedData) ;
        res.json({ message: 'Bem atualizado com sucesso', bem: updatedBem });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar o bem', error });
    }

  },

  deletarGoods: async(req , res)=>{

    try {
      const {id} = req.params 
      const deleteComponent = await userRegister.deleteBens(id)

      if(!deleteComponent){
        return res.status(404).json({message: 'Componente Não encontrado'})
      }
      return res.status(200).json({message: "componente Apagado com sucesso" , component: deleteComponent })
    } catch (error) {
       
      console.error('erro ao apagar componente:' , error)
      return res.status(500).json({message: 'erro no servidor'})
    }
  },
}

 module.exports = movementOfBens;