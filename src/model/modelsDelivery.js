
import {pool as delivery} from '../database/userDataBase.js';

const mecanismDelivey = {
     
    async getDateLocationFinish(){
         try {
             const query = `SELECT *FROM locafim `
             const result = await delivery.query(query)
             return result.rows
         } catch (error) {
             console.erro("Problema no model da entrega:", error)
             throw new Error("Erro no model entrega:" , error);
             
         }
    },

    async getDataLocationForDriver(id){
         try {
             const query = `SELECT * FROM locafim WHERE lofiidmt = $1 AND lofistat IN ('Pendente' , 'Entrega aceita') `
             const value = [id]
             const result = await delivery.query(query , value)

             return result.rows
         } catch (error) {
            console.error("Não foi encontrado entrega para esse motorista")
            throw error 
         }
    },

    async updateStatusDelivery(client, id , body){
      try {
            const update = `UPDATE locafim SET lofistat = $1 WHERE loficode = $2 RETURNING *;`
             
         const values = [body ,id]

         const result = await client.query(update , values)
         console.log(result.rows)
          return result.rows[0]

          
        } catch (error) {
            console.error('Erro para atualizar o status da entrega')
            throw error
        }
    },

    async finishDelivery(payload) {
           
        try {
          const {enfiLoca , enfiStat , enfiNmlo , enfiNmMt  ,enfiBem} = payload
          
          const query = `INSERT INTO entrfins(enfiloca , enfistat , enfinmlo , enfinmmt , enfibem)VALUES($1 , $2 , $3 , $4 , $5) RETURNING *`

          const values = [enfiLoca ,enfiStat ,enfiNmlo , enfiNmMt , enfiBem]

          const result = await delivery.query(query ,values)
          if(result.rows.length > 0){
             return result.rows[0]
          }
        } catch (error) {
            console.error("Erro ao finalizar entrega" , error)
             throw new Error("Erro ao finalizar entrega" , error);
        }
    },


}

export {mecanismDelivey} 