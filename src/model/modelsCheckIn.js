import { th } from "date-fns/locale";
import { pool as dataCheckIn } from "../database/userDataBase.js";

export const movimentCheckInAndCheckOut = {
       
  async toDoCheckIn(client  ,data){
    try {
         const {checMoto, checVeic,checDtch,checKmat,checStat ,checkObs} = data
         console.log(data)

         const insert = `
         INSERT INTO checmtve (checmoto, checveic, checdtch, checkmat, checstat , checobse)
         VALUES ($1, $2, $3, $4, $5 , $6)
         RETURNING *`;


         const values = [ checMoto,checVeic,checDtch, checKmat,checStat , checkObs]

         const result = await client.query(insert , values)

         return result.rows[0]
     } catch (error) {  
        console.error('Erro para fazer check-in' , error)
        throw error
    }
 },

async updateKmVehicle(quilimetro , code){
   try { 
        const updateKmQuery = `
        UPDATE cadauto
        SET caaukmat = $1
        WHERE caaucode = $2
        RETURNING *;
      `;
      const result = await dataCheckIn.query(updateKmQuery, [quilimetro, code]);
        if (!result.rows || result.rows.length === 0) {
      throw new Error(`Falha: veículo ${code} não encontrado ou KM não atualizado`);
    }

    return result.rows[0];
   } catch (error) {
      console.error("Erro em atualizar o KM" , error)
      throw new Error('Erro para atualizar km')
   }
 },

 async getCheckIn(id , client){
    try {
        const query = `SELECT * from checmtve WHERE checid = $1`
        const result =  await client.query(query  ,[id])
        if(result.rows.length > 0){
           return result.rows[0]
        }
        return null
    } catch (error) {
       console.error("Erro a buscar check-in")
       throw error
    }
 },

  async getCheckInOpenForDriver(idMoto) {
  try {
    const query = `
      SELECT * FROM checmtve 
      WHERE checmoto = $1 AND checstat = 'Em uso'
      ORDER BY checid DESC
      LIMIT 1
    `;
    const values = [idMoto];
    const result = await dataCheckIn.query(query, values);

    if (result.rows.length > 0) {
      return result.rows;
    }

    return []; 
  } catch (error) {
    console.error('Erro para verificar check-In:', error);
    throw error;
  }
},
  
 

 async toDoCheckOut(id , body , client){
  try {
    const query = `
      UPDATE checmtve
      SET checdtvt = $1,
          checkmvt = $2,
          checstat = $3,
          checobvt = $4
      WHERE checid = $5
      RETURNING *;
    `;

    const values = [    
      body.checdtvt,
      body.checkmvt,
      body.checstat,
      body.checobvt,
      id
    ];

    const result = await client.query(query, values);
    return result.rows[0];

  } catch (error) {
    console.error("Erro em fazer check-out:", error);
    throw error;
  }
}

}