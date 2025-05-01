// const dataBaseM = require('../database/dataBaseSgt')
import {client} from '../database/userDataBase.js';
const userDbTypeProd = client

 export const crudRegisterTypeProd = {
     
  registerTypeProd: async (data)=>{

    try {

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
      
    } catch (error) {

      if (error.code === "23505") { 
        throw new Error("Código do tipo de produto ja cadastrado. Tente outro.");
      }
       console.error('Erro ao registrar tipo de produto')
       throw error;
    } 
 },

     listTypeProd: async ()=>{
           
        try {
            const query = 'SELECT * FROM cadtipr';
   
            const result = await userDbTypeProd.query(query)
            return result.rows;
   
           } catch (error) {
           console.error('Erro em listar Tipo do produto:' , error.message)
           throw error;
         }
     },

     verificarDependeciaDetipoProd: async(id)=>{
      try {
        const checkQuery = "SELECT COUNT(*) FROM cadprod WHERE prodtipo = $1";
        const checkResult = await userDbTypeProd.query(checkQuery, [id]);
    
        if (checkResult.rows[0].count > 0) {
          return { error: "Não é possível excluir. Existem bens vinculados a este fornecedor." };
        }
        return parseInt(checkResult.rows[0].count) > 0;
      } catch (error) {
        console.error("Erro ao verificar dependências da familia de bens:", error);
        throw error;
      }
     }, 

     deleteTypeProd: async(id)=>{
        try {
            
            const delet = "DELETE FROM cadtipr WHERE tiprcode = $1 RETURNING *";
            const result = await userDbTypeProd.query(delet, [id])
    
            return result.rows[0]
    
          } catch (error) {
            console.error('Erro no model:', error.message)
            throw error;
          }
     },

     updateTypeProd: async(id , updatetypeProd)=>{

      try {
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
    return result.rows[0];

    } catch (error) {
        console.error('erro')
        throw error;
    }        
 },


}
