import { client as dataCheckIn } from "../database/userDataBase.js";

export const movimentCheckInAndCheckOut = {
       
  async toDoCheckIn(data){
    try {
         const {checMoto, checVeic,checDtch,checKmat,checStat } = data
         console.log(data)

         const insert = `
         INSERT INTO checmtve (checmoto, checveic, checdtch, checkmat, checstat)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`;


         const values = [ checMoto,checVeic,checDtch, checKmat,checStat]

         const result = await dataCheckIn.query(insert , values)

         return result.rows[0]
     } catch (error) {  
        console.error('Erro para fazer check-in' , error)
        throw error
    }
 },

  async getCheckInOpen(idMoto , status){
      try {
            const query = 'SELECT * FROM checmtve WHERE checmoto = $1 AND checstat = $2 LIMIT 1'
            const values = [idMoto , status]
            const result = await dataCheckIn.query(query , values)

             if (result.rows.length > 0) {
               return result.rows
             }
 
         } catch (error) {
            console.error('Erro para verificar check-In')
            throw error
     }
  },

 async toDoCheckOut(id , body){
      try {
      const query = `
      UPDATE checmtve
      SET checobse = $1 , checdtvt = $2 , checkmvt = $3 , checstvt = $4 , checobvt = $5
      WHERE checid = $6
      RETURNING *;
  `;

      const values = [body, id];
      const result = await dataCheckIn.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error("Erro em fazer check-out " ,error);
      throw error;
    }
 }
}