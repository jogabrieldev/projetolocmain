const db = require("../database/dataBaseSgt");
const userDataBase =  require('../database/userDataBase')

const AuthController = {
  autenticateLogin: async (username , password) => {
    
      const query = "SELECT * FROM cademp WHERE empmail = $1 AND empsenh = $2 LIMIT 1";
      const values = [username, password]; 

      const result = await db.query(query, values);
      return result.rows[0];
  },

   registerDateFormBens: async(data) =>{
    
    const { nome , modelo , serial , codForne ,dtCompra , valor , ntFiscal , status , dtStatus , fabricante,renavam , placa , alugado , chassi , cor , hrStatus , kmAtual,valorAlugado} = data
     
      const insert =
        "INSERT INTO cadbens(bensnome , benscofa , bensmode , bensnuse , bensplac, bensanmo, bensdtcp , bensvacp , bensnunf , benscofo , benskmat , bensdtkm , bensstat , bensdtus , benshrus , bensnuch , benscore , bensnumo) VALUES($1, $2, $3, $4, $5, $6, 7$, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *" 

      const values = [nome , modelo , serial , codForne ,dtCompra , valor , ntFiscal , status , dtStatus , fabricante,renavam , placa , alugado , chassi , cor , hrStatus , kmAtual,valorAlugado]; 

      const result = await userDataBase.query(insert, values);
     
      return result.rows[0]
      
   }

}
module.exports = AuthController;
