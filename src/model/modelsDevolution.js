import { pool as devolution } from "../database/userDataBase.js";

export const processDevolution = {
      
  async getDevolutionTheDay () {
    
    try {

     const query = ` SELECT 
      entrfins.enfiid,
      entrfins.enfiloca,
      entrfins.enfistat,
      entrfins.enfinmlo,
      entrfins.enfinmmt,
      entrfins.enfibem,
      locafim.loficode,
      locafim.lofiidbe,
      locafim.lofiidcl,
      locafim.lofiidlo,
      locafim.lofidtdv,
      locafim.loficida,
      locafim.loficep,
      locafim.lofirua,
      locafim.lofistat,
      locafim.lofipgmt,
      locafim.lofibair
    FROM 
      entrfins
    JOIN 
      locafim ON entrfins.enfiloca = locafim.loficode
    WHERE 
      locafim.lofidtdv::date = CURRENT_DATE
      AND locafim.lofistat = 'Finalizado'`
     const result  = await devolution.query(query)
     return result.rows
        
    } catch (error) {
        console.error("Erro em buscar devoluções do dia")
        throw new Error("Erro em buscar devoluções do dia")
    }
  
  }
};