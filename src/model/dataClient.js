const database = require('../database/dataBaseSgt')
const dataUser = require('../database/userDataBase')

const crudRegisterClient = {

    registerOfClient: async(data)=>{
       
      const {
        clieCode,
        clieName,
        cpf,
        dtCad,
        dtNasc,
        clieCelu,
        clieCity,
        clieEstd,
        clieRua,
        clieCep,
        clieMail,
      } = data

      const insert = `INSERT INTO cadclie( cliecode, clienome, cliecpf, cliedtcd, cliedtnc, cliecelu, cliecity, clieestd, clierua, cliecep, cliemail ) VALUES( $1 , $2 , $3 , $4 , $5 ,$6 , $7 , $8 , $9 , $10 , $11) RETURNING *`;
      
      const values = [ 
        clieCode,
        clieName,
        cpf,
        dtCad,
        dtNasc,
        clieCelu,
        clieCity,
        clieEstd,
        clieRua,
        clieCep,
        clieMail
      ]
       
      const result = await dataUser.query(insert , values)
      return result.rows[0];
    },

    listingClient: async()=>{
       
      try {
        const query = 'SELECT * FROM cadclie';

        const result = await dataUser.query(query)
        return result.rows;

      } catch (error) {
        console.error('Erro em listar bens:' , error.message)
      }
      
    },

    deleteClient: async(id)=>{

      try {
            
        const delet = "DELETE FROM cadclie WHERE cliecode = $1 RETURNING *";
        const result = await dataUser.query(delet, [id])

       return result.rows[0]

      } catch (error) {
        console.error('Erro no model:', error.message)
      }
       
    },
    updateClient: async(id , updateClient)=>{

      try {
        
        const query =  ` UPDATE cadclie SET  clienome = $1, cliecpf = $2, cliedtcd = $3, cliedtnc = $4, cliecelu = $5, cliecity = $6, clieestd = $7, clierua = $8, cliecep = $9, cliemail = $10 WHERE cliecode = $11 RETURNING * ;`;

      const values = [
        updateClient.clienome || null,
        updateClient.cliecpf || null,
        updateClient.clidtcd || null,
        updateClient.cliedtnc || null, 
        updateClient.cliecelu || null,
        updateClient.clicity || null,
        updateClient.clieestd || null,
        updateClient.clierua || null,
        updateClient.cliecep || null,
        updateClient.cliemail || null,
        id
      ]

      const result = await dataUser.query(query , values)
      return result.rows[0]

      } catch (error) {
        
        console.error('erro no model' , error.message)
      }
      
    }



}


module.exports = crudRegisterClient