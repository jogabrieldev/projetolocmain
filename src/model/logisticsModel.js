import {client} from "../database/userDataBase.js";

class logistcsModel  {
   
    async post(id){

        const { bemId, familiaBem,idClient,locationId, driver, pagament , devolution } = id
          
         try {
            const query = `INSERT INTO locafim( lofiidbe, lofiidfa, lofiidcl, lofiidlo , lofiidmt , lofipgmt , lofidtdv)
            VALUES ($1, $2, $3, $4 , $5 , $6 , $7)
            RETURNING *;`
  
            const values = [bemId,familiaBem, idClient, locationId , driver , pagament , devolution]
  
            const result = await client.query(query , values)
            return result.rows[0]
            
     } catch (error) {
            console.error('erro model logistica:' , error)
     }
    }

    async getItensVinculadosPorLocacao(clloid) {
  try {
    const query = `
      SELECT lofiidfa AS familia_bem, COUNT(*) AS quantidade
      FROM locafim
      WHERE lofiidlo = $1
      GROUP BY lofiidfa
      ORDER BY lofiidfa;
    `;

    const result = await client.query(query, [clloid]);
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar itens vinculados:', error);
    throw error;
  }
}


};

export default new logistcsModel()