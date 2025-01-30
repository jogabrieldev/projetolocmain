// const dataBaseM = require('../database/dataBaseSgt')
import {client} from '../database/userDataBase.js';
const userDbTypeProd = client

 export const crudRegisterTypeProd = {
     
     registerTypeProd: async (data)=>{
          const{
            tpCode,
            tpDesc,
            tpCat,
            tpSubCat,
            tpObs,
            tpCtct
           } = data

        const query = `INSERT INTO cadtipr(tiprcode, tiprdesc, tiprcate, tiprsuca, tiprobs, tiprctct ) VALUES( $1 , $2 , $3 , $4 , $5 ,$6 ) RETURNING *`; 

        const values = [
            tpCode,
            tpDesc,
            tpCat,
            tpSubCat,
            tpObs,
            tpCtct
        ]
            const result = await userDbTypeProd.query(query, values);
            return result.rows[0];

     },

     listTypeProd: async ()=>{
           
        try {
            const query = 'SELECT * FROM cadtipr';
   
            const result = await userDbTypeProd.query(query)
            return result.rows;
   
           } catch (error) {
           console.error('Erro em listar Tipo do produto:' , error.message)
         }
     },

     deleteTypeProd: async(id)=>{
        try {
            
            const delet = "DELETE FROM cadtipr WHERE tiprcode = $1 RETURNING *";
            const result = await userDbTypeProd.query(delet, [id])
    
            return result.rows[0]
    
          } catch (error) {
            console.error('Erro no model:', error.message)
          }
     },

     updateTypeProd: async(id , updatetypeProd)=>{
         
        const query = `
          UPDATE cadtipr
          SET 
              tiprdesc = $1, tiprcate = $2, tiprsuca = $3, tiprobs = $4, tiprctct = $5 
               WHERE tiprcode = $6
              RETURNING *;
              `;
      const values = [
        updatetypeProd.tiprdesc || null,
        updatetypeProd.tiprcate || null,
        updatetypeProd.tiprsuca|| null,
        updatetypeProd.tiprobs || null,
        updatetypeProd.tiprctct || null,
        id
      ];
      const result = await userDbTypeProd.query(query , values)
    //   console.log('dados enviados para o model:' ,result)
  
      return result.rows[0];
     }

}
