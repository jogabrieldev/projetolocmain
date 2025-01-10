const dataBaseM = require('../database/dataBaseSgt')
const  userDbDriver = require('../database/userDataBase')

const crudRegisterDriver = {
      
    registerDriver: async (data)=>{
         
        const{
            motoCode,
            motoNome,
            motoDtnc,
            motoCpf,
            motoDtch,
            motoctch,
            motoDtvc,
            motoRest,
            motoOrem,
            motoCelu,
            motoCep,
            motoRua,
            motoCity,
            motoEstd,
            motoMail
        } = data


        const insert = `INSERT INTO cadmoto( motocode, motoname, motodtnc, motocpf, motodtch, motoctch , motodtvc, motorest, motoorem, motocelu, motocep, motorua, motocity, motoestd, motomail  ) VALUES( $1 , $2 , $3 , $4 , $5 ,$6 , $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`;

        
        const values =  [
            motoCode,
            motoNome,
            motoDtnc,
            motoCpf,
            motoDtch,
            motoctch,
            motoDtvc,
            motoRest,
            motoOrem,
            motoCelu,
            motoCep,
            motoRua,
            motoCity,
            motoEstd,
            motoMail
        ]

        const result =await userDbDriver.query(insert , values)
         return result.rows[0]

    },

    listingDriver: async()=>{

        try {
            const query = 'SELECT * FROM cadmoto';
    
            const result = await userDbDriver.query(query)
            return result.rows;
    
          } catch (error) {
            console.error('Erro em listar Motorista:' , error.message)
          }
    },

    deleteDriver: async(id)=>{
          
        try {
            
            const delet = "DELETE FROM cadmoto WHERE motocode = $1 RETURNING *";
            const result = await userDbDriver.query(delet , [id])
    
            return result.rows[0]
    
          } catch (error) {
            console.error('Erro no model:', error.message)
          }
    },

    updateDriver: async(id , updateMoto)=>{

        const query = `
        UPDATE cadmoto
        SET 
             motoname = $1, motodtnc = $2, motocpf = $3, motodtch = $4, motoctch = $5 ,
             motodtvc = $6 , motorest = $7, motoorem = $8 , motocelu = $9 , motocep = $10,
             motorua = $11, motocity = $12 , motoestd = $13 , motomail = $14
             WHERE motocode = $15
            RETURNING *;
            `;
    const values = [
        updateMoto.motoname || null,
        updateMoto.motodtnc || null,
        updateMoto.motocpf || null,
        updateMoto.motodtch || null,
        updateMoto.motoctch || null,
        updateMoto.motodtvc || null,
        updateMoto.motorest || null,
        updateMoto.motoorem || null,
        updateMoto.motocelu || null,
        updateMoto.motocep || null,
        updateMoto.motorua|| null,
        updateMoto.motocity || null,
        updateMoto.motoestd || null,
        updateMoto.motomail || null,
      id
    ];
    const result = await userDbDriver.query(query, values);
    
    return result.rows[0];
    }


    
}

module.exports = crudRegisterDriver