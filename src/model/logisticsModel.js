import {client} from "../database/userDataBase.js";

class logistcsModel  {
   
    async post(id , motorista){

        const { bemId, familiaBem,idClient,locationId, pagament , devolution } = id
        const motoristaId  = motorista[0]
          
         try {
            const query = `INSERT INTO locafim( lofiidbe, lofiidfa, lofiidcl, lofiidlo , lofiidmt , lofipgmt , lofidtdv)
            VALUES ($1, $2, $3, $4 , $5 , $6 , $7)
            RETURNING *;`
  
            const values = [bemId,familiaBem, idClient, locationId , motoristaId , pagament , devolution]
  
            const result = await client.query(query , values)
            return result.rows[0]
            
     } catch (error) {
            console.error('erro model logistica:' , error)
     }
    }

};

export default new logistcsModel()