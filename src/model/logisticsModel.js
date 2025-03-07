import {client} from "../database/userDataBase.js";

class logistcsModel  {
   
    async post(id){
        const { bemId, familiaBem,idClient,locationId  } = id
          
         try {
            const query = `INSERT INTO locafim( lofiidbe,lofiidfa, lofiidcl, lofiidlo, lofiidmt)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;`
  
            const values = [bemId,familiaBem, idClient, locationId,'code10']
  
            const result = await client.query(query , values)
            return result.rows[0]
            
     } catch (error) {
            console.error('erro model logistica:' , error)
     }
   
        
    }
}

export default new logistcsModel()