import {client} from "../database/userDataBase.js";

class logistcsModel  {
   
    async submitDate(id , localization){

        const { bemId, familiaBem,idClient,locationId, driver, pagament , devolution , status } = id
        const{rua , cep , bairro , refere , cidade, region }= localization
          
         try {
            const query = `INSERT INTO locafim( lofiidbe, lofiidfa, lofiidcl, lofiidlo , lofiidmt , lofipgmt , lofidtdv, lofirua , loficep , lofibair , lofistat, lofirefe , loficida , lofiregi )
            VALUES ($1, $2, $3, $4 , $5 , $6 , $7 , $8 , $9 , $10 , $11 , $12 ,$13 , $14)
            RETURNING *;`
  
            const values = [bemId,familiaBem, idClient, locationId , driver , pagament , devolution , rua , cep , bairro , status, refere , cidade, region]
  
            const result = await client.query(query , values)
            return result.rows[0]
            
     } catch (error) {
            console.error('erro model logistica:' , error)
     }
    }

async getContratosPorLocacao(belocode) {
       const query = `
        SELECT belocontr
        FROM bensloc
        WHERE belocode = $1
      `;

  try {
    const result = await client.query(query, [belocode]);
    return result.rows.map(row => row.belocontr);
  } catch (error) {
    console.error("Erro ao buscar contratos:", error);
    throw error;
  }
}

async getContratoAndUpdate(id , body){
    const query = `
    UPDATE bensloc
    SET belocontr = $1
    WHERE belocode = $2
    RETURNING belocontr;
  `;

  try {
    const result = await client.query(query, [body.trim(), id]);
    return result.rows[0]; // Retorna o contrato atualizado
  } catch (error) {
    console.error("Erro ao atualizar contrato do bem:", error);
    throw error;
  }
}


};

export default new logistcsModel()