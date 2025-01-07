const dataBaseM = require('../database/dataBaseSgt')
const  userDbFabri = require('../database/userDataBase')

const crudRegisterFabri = {
      
      registerOfFabri: async(data)=>{

      const {
        fabeCode,
        fabeDesc,
        fabeCate,
        fabeSuca,
        fabeObs,
        fabeCtct
      } = data

      const insert = `INSERT INTO cadfabe( fabecode, fabedesc, fabecate, fabesuca, fabeobs, fabectct) VALUES( $1 , $2 , $3 , $4 , $5 ,$6 ) RETURNING *`;

      const values = [
        fabeCode,
        fabeDesc,
        fabeCate,
        fabeSuca,
        fabeObs,
        fabeCtct
      ]

      const result = await userDbFabri.query(insert , values)
      return result.rows[0];
    },

    listingFabri: async()=>{
        try {
            const query = 'SELECT * FROM cadfabe';
    
            const result = await userDbFabri.query(query)
            return result.rows;
    
          } catch (error) {
            console.error('Erro em listar fabricante:' , error.message)
          }
    },

    deleteFabri: async(id)=>{
         
        try {
            
            const delet = "DELETE FROM cadfabe WHERE fabecode = $1 RETURNING *";
            const result = await userDbFabri.query(delet, [id])
    
            return result.rows[0]
    
          } catch (error) {
            console.error('Erro no model:', error.message)
          }
    },

    updateFabri: async (id, updateFabri) => {
        const query = `
            UPDATE cadfabe
            SET 
                 fabedesc = $1, fabecate = $2, fabesuca = $3, fabeobs = $4, fabectct = $5 
                 WHERE fabecode = $6
                RETURNING *;
                `;
        const values = [
            updateFabri.fabedesc || null,
            updateFabri.fabecate || null,
            updateFabri.fabesuca || null,
            updateFabri.fabeobs  || null,
            updateFabri.fabectct || null,
          id
        ];
        const result = await userDbFabri.query(query, values);
        
    
        return result.rows[0];
      },

};

module.exports = crudRegisterFabri