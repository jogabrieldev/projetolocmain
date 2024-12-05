const db = require("../database/dataBaseSgt");
const userDataBase =  require('../database/userDataBase')

const AuthController = {
  autenticateLogin: async (username , password) => {
    
      const query = "SELECT * FROM cademp WHERE empmail = $1 AND empsenh = $2 LIMIT 1";
      const values = [username, password]; 

      const result = await db.query(query, values);
      return result.rows[0];
  },

 registerBens: async (data) => {
  
  // Desestrutura os dados recebidos
  const { code , name , cofa , model , serial, placa,bensAnmo,dtCompra,valor, ntFiscal, cofo, kmAtual, dtKM, status, dtStatus, hrStatus, chassi, cor, nuMO, rena, bensctep,  bensAtiv, alug, valorAlug, fabri  } = data;

  // console.log('dados recebidos' , data)
  // SQL para o insert no banco
  const insert = `
    INSERT INTO cadbens(
       benscode , bensnome, benscofa, bensmode, bensnuse, bensplac, bensanmo, bensdtcp, bensvacp, 
      bensnunf, benscofo, benskmat, bensdtkm, bensstat, bensdtus, benshrus, bensnuch, 
      benscore, bensnumo, bensrena, bensctep, bensativ, bensalug, bensvaal, bensfabr
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
    ) RETURNING *`;

  const values = [
    code , name , cofa , model , serial, placa,bensAnmo,dtCompra,valor, ntFiscal, cofo, kmAtual, dtKM, status, dtStatus, hrStatus, chassi, cor, nuMO, rena, bensctep,  bensAtiv, alug, valorAlug, fabri
  ];

  const result = await userDataBase.query(insert, values);
  return result.rows[0]
},

listingBens: async()=>{

  try {
    const query = 'SELECT * FROM cadbens'; // Consulta todos os registros
    const result = await userDataBase.query(query);
    //  console.log(result.rows[0])
    return result.rows
    
  } catch (error) {
    console.error("Erro ao listar bens:", error.message);
    
  }
}
      
}


module.exports = AuthController;
