
import { pool as dataDestination } from "../database/userDataBase.js";


 export const movementDestination = {
      
   async registerInDestination(body){
      try {
           const {
              nomeDest,
              cepDest,
              cidaDest,
              ruaDest,  
              bairDest,
              estdDest,
              ativDest,
              tipoDest
              }= body

             const query = `INSERT INTO cadderi(derenome , derecep , derecida , dererua , derebair , dereestd , dereativ , deretipo )VALUES($1 , $2 , $3 , $4 , $5 , $6 , $7 ,$8) RETURNING *`
             const value = [
                nomeDest,
                cepDest,
                cidaDest,
                ruaDest,  
                bairDest,
                estdDest,
                ativDest,
                tipoDest
             ]

             const resunt = await dataDestination.query(query , value)
             return resunt.rows
         } catch (error) {

           if (error.code === "23505") {
           // Código de erro para chave duplicada no PostgreSQL
          throw new Error("Código de cliente já cadastrado. Tente outro.");
         }
            console.error('Erro ao inserir destinno', error)
            throw error
         }
    },

  async  getAllDestination(){
     try {
         const query = `SELECT *FROM cadderi`
            const res = await dataDestination.query(query)
            if(!res)return;
            return res.rows
            
        } catch (error) {
            console.error('Erro em listar destinos de descarte')
            throw error
         }
    },

async getCodeDestination(){
   try {
     
       const result =  await dataDestination.query(`SELECT dereid FROM cadderi`)
       if(!result){return}
       return result.rows
       

   } catch (error) {
       console.error('Erro para buscar o codigo do descarte')
       throw error
   }
 },
async getDestinationByCode(code){
   try {
     const query = `SELECT *FROM cadderi WHERE dereid = $1`
     const values = [code]
     const result = await dataDestination.query(query , values )
        if(result.rows.length === 0){
           throw new Error("Destino não encontrado");
         }

        return result.rows[0]
     } catch (error) {
        console.error("Erro ao buscar destino por código:", error.message);
        throw error;
     } 
  },

  async deleteDestination(id){
      try {
      const deleteDestination =
        "DELETE FROM cadderi WHERE dereid = $1 RETURNING *";
      const result = await dataDestination.query(deleteDestination, [id]);

      return result.rows[0];
    } catch (error) {
      console.error("Erro no model destino:", error.message);
      throw error;
    }
  },

 async updateDestination(id , updateDest){
    try {
      const query = ` UPDATE cadderi SET  derenome = $1, derecida = $2, dererua = $3, derebair = $4, dereestd = $5, dereativ = $6, deretipo = $7 WHERE dereid = $8 RETURNING * ;`;
       
      const values = [
        updateDest.nomeDest || null,
        updateDest.cidaDest || null,
        updateDest.ruaDest || null,
        updateDest.bairDest || null,
        updateDest.estdDest || null,
        updateDest.ativDest || null,
        updateDest.tipoDest || null,
        id,
      ];

      const result = await dataDestination.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("erro no model ao atualizar o destino", error.message);
      throw error;
    }
 }
}