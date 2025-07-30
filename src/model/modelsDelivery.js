import {client} from '../database/userDataBase.js';
const delivery = client

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
             const query = `SELECT * FROM locafim WHERE lofiidmt = $1 `
             const value = [id]
             const result = await delivery.query(query , value)

             return result.rows[0]
         } catch (error) {
            console.error("Não foi encontrado entrega para esse motorista")
            throw error 
         }
    },

    async updateStatusDelivery(id , body){
      try {
            const update = `UPDATE locafim SET lofistat = $1 WHERE loficode = $2 RETURNING *;`
             
         const values = [body ,id]

         const result = await delivery.query(update , values)
          return result.rows[0]

        } catch (error) {
            console.error('Erro para atualizar o status da entrega')
            throw error
        }
    }
}

export {mecanismDelivey} 