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
    }
}

export {mecanismDelivey} 