import {client} from "../database/userDataBase.js";

class logistcsModel  {
   
    async submitDate(id , localization){

        const { bemId, familiaBem,idClient,locationId, driver, pagament , devolution } = id
        const{rua , cep , bairro , refere , cidade, region }= localization
          
         try {
            const query = `INSERT INTO locafim( lofiidbe, lofiidfa, lofiidcl, lofiidlo , lofiidmt , lofipgmt , lofidtdv, lofirua , loficep , lofibair , lofirefe , loficida , lofiregi )
            VALUES ($1, $2, $3, $4 , $5 , $6 , $7 , $8 , $9 , $10 , $11 , $12 ,$13)
            RETURNING *;`
  
            const values = [bemId,familiaBem, idClient, locationId , driver , pagament , devolution , rua , cep , bairro , refere , cidade, region]
  
            const result = await client.query(query , values)
            return result.rows[0]
            
     } catch (error) {
            console.error('erro model logistica:' , error)
     }
    }

};

export default new logistcsModel()