const { json } = require("body-parser");
const userRegister = require("../model/data");

const movementOfBens= {

    async registerBens (req, res) {
    try {
      const { data } = req.body;
       
      const newUser = await userRegister.registerBens(data);
      res.status(201).json({ success: true, user: newUser });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

    async  listBens(req , res){
      try {

        const bens = await userRegister.listingBens();
    
        res.json(bens).status(200);

     } catch (error) {

       console.error("Erro no controller:", error.message);
      res.status(500).json({message: 'erro interno no server'})
    }
  }

}

 module.exports = movementOfBens;

// try {
//   const result = await userDataBase.query(insert, values); // Executa a consulta no banco
//   res.status(201).json({ success: true, user: result.rows[0] });  // Retorna sucesso
// } catch (error) {
//   console.error("Erro ao registrar bens:", error);
//   res.status(500).json({ success: false, message: error.message });  // Retorna erro
// }