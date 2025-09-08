import {pool as resi} from '../database/userDataBase.js'

export const moduleResiduo = {

    async registerResiduo(data){
        try {
            const {codeRes , descResi} = data

             const insert = `INSERT INTO cadresi( resicode , residesc) VALUES( $1 , $2 ) RETURNING *`;

             const values = [codeRes , descResi]
             const resunt = await resi.query(insert , values)
             return resunt.rows[0]
        } catch (error) {

            if (error.code === "23505") { 
          throw new Error("Código de Residuo já cadastrado. Tente outro.");
         }
          console.error("Erro no registro do cliente");
           throw error;
      }
  },

async getCodeResiduo(){
  try {
     const result = await resi.query(`SELECT resicode FROM cadresi`) 
      if(!result){return}
      return result.rows
      
    } catch (error) {
       console.error('Erro para buscar codigo de residuo')
       throw error
    }
 },

  async getAllResiduo(){
      try {
         const query = `SELECT * FROM cadresi`
         const resunt =  await resi.query(query)
         if(!resunt){return}

         return resunt.rows
      } catch (error) {
        console.error('Erro na busca de residuo')
        throw error;
      }
  },

  async getIdResiduo(id){
    try {
         const query =  `SELECT * FROM cadresi WHERE resicode = $1`
         const values = [id] 
         const resunt = await resi.query(query , values)
        return resunt.rows[0]
    } catch (error) {
        console.error('Erro ao buscar id de residuo')
        throw error 
    }
  },

   // analisar por que não deleta
  deleteResiduo: async (id) => {
    try {

      const deleteResiduo =
        "DELETE FROM cadresi WHERE resicode = $1 RETURNING *";
      const result = await resi.query(deleteResiduo, [id]);
     
      return result.rows[0];
    } catch (error) {
      console.error("Erro no model:", error.message);
      throw error;
    }
  },
}