const dataBaseM = require('../database/dataBaseSgt')
const  userDbFo = require('../database/userDataBase')

const crudRegisterForn = {
        
      registerOfForn: async(data)=>{
          
          const {
            fornCode,
            fornName,
            nomeFan,
            fornCnpj,
            fornCep,
            fornRua,
            fornCity,
            fornEstd,
            fornCelu,
            fornMail,
            forBank,
            fornAge,
            fornCont,
            fornPix,
            fornDtcd,
            fornDisPro
          } = data

              const insert = `INSERT INTO cadforn(forncode, fornnome, fornnoft, forncnpj, forncep, fornrua, forncity, fornestd, forncelu, fornmail, fornbanc, fornagen, forncont, fornpix, forndtcd, fornptsv)  VALUES( $1 , $2 , $3 , $4 , $5 ,$6 , $7 , $8 , $9 , $10 , $11 , $12 , $13 ,$14 , $15, $16) RETURNING *`;

              const values = [
                fornCode,
            fornName,
            nomeFan,
            fornCnpj,
            fornCep,
            fornRua,
            fornCity,
            fornEstd,
            fornCelu,
            fornMail,
            forBank,
            fornAge,
            fornCont,
            fornPix,
            fornDtcd,
            fornDisPro
              ]

              const result = await userDbFo.query(insert, values)
              return result.rows[0];

      },

      listingForn: async()=>{
        try {
            const query = 'SELECT * FROM cadforn';
    
            const result = await userDbFo.query(query)
            return result.rows;
    
          } catch (error) {
            console.error('Erro em listar bens:' , error.message)
          }
      },

      deleteForn: async(id)=>{
         
        try {
            
          const delet = "DELETE FROM cadforn WHERE forncode = $1 RETURNING *";
          const result = await userDbFo.query(delet, [id])
  
          return result.rows[0]
  
        } catch (error) {
          console.error('Erro no model:', error.message)
        }
         
      },

      updateForn: async(id , updateForn)=>{
          
        try {
            const query = `UPDATE cadforn SET fornnome = $1 , fornnoft = $2 , forncnpj = $3 , forncep = $4 , fornrua = $5 , forncity = $6 , fornestd = $7  ,forncelu = $8 , fornmail = $9 , fornbanc = $10 , fornagen = $11 , forncont = $12 , fornpix = $13 , forndtcd = $14 , fornptsv = $15 WHERE forncode = $16 RETURNING *; ` 

            const value = [
              updateForn.fornnome || null,
              updateForn.fornnoft || null,
              updateForn.forncnpj || null,
              updateForn.forncep || null,
              updateForn.fornrua || null,
              updateForn.forncity || null,
              updateForn.fornestd || null,
              updateForn.forncelu || null,
              updateForn.fornmail || null,
              updateForn.fornbanc || null,
              updateForn.fornagen || null,
              updateForn.forncont || null,
              updateForn.fornpix || null,
              updateForn.forndtcd || null,
              updateForn.fornptsv || null,
              id
            ]

            const result = await userDbFo.query(query , value)
            return result.rows[0]
        } catch (error) {
           console.error('Erro no model' , error)
        }

      }
};
module.exports = crudRegisterForn