const dataBaseM = require('../database/dataBaseSgt')
const  userDbProd = require('../database/userDataBase')

const crudRegisterProd = {
    
    registerOfProd: async (data)=>{
          const {
            prodCode,
            prodDesc,
            prodTipo,
            prodUni,
            prodCofa,
            prodData,
            prodValor,
            prodPeli,
            prodPebr,
            prodAtiv
          } = data

         const insert = `INSERT INTO cadprod(prodcode, proddesc, prodtipo, produnid, prodcofa, proddtuc, prodvluc, prodpeli, prodpebr, prodativ ) VALUES( $1 , $2 , $3 , $4 , $5 ,$6 , $7 , $8 , $9 , $10 ) RETURNING *`;
          
         const values = [
            prodCode,
            prodDesc,
            prodTipo,
            prodUni,
            prodCofa,
            prodData,
            prodValor,
            prodPeli,
            prodPebr,
            prodAtiv
         ]
         const result = await userDbProd.query(insert, values);
         return result.rows[0];
  },

    listingOfProd: async(data)=>{
       try {
         const query = 'SELECT * FROM cadprod';

         const result = await userDbProd.query(query)
         return result.rows;

        } catch (error) {
        console.error('Erro em listar produto:' , error.message)
      }
  },

  deleteOfProd: async(id)=>{

    try {
            
        const delet = "DELETE FROM cadprod WHERE prodcode = $1 RETURNING *";
        const result = await userDbProd.query(delet, [id])

        return result.rows[0]

      } catch (error) {
        console.error('Erro no model:', error.message)
      }
       
    },



  }
   


module.exports = crudRegisterProd