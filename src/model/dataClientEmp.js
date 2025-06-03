import { client } from "../database/userDataBase.js";
const clientEmp = client

export const moduleClientEmp = {
      
     async registerClientEmp(data){
            try {
            const {clemcode,clemnome,clemnoft,clemcnpj,clemdtcd,clemcep,clemrua,clemcida,clemestd,clemcelu,clemmail,clembanc,clemagen,clemcont,clempix } = data

            console.log(data)

             const insert = `INSERT INTO cadclem( clemcode , clemnome , clemnoft , clemcnpj , clemdtcd , clemcep , clemrua , clemcida , clemestd , clemcelu , clemmail , clembanc , clemagen ,  clemcont , clempix ) VALUES( $1 , $2 , $3 , $4 , $5 , $6 , $7 , $8 , $9 , $10 ,$11 , $12 ,$13,
             $14 , $15 ) RETURNING *`;

             const values = [clemcode,clemnome,clemnoft,clemcnpj,clemdtcd,clemcep,clemrua,clemcida,clemestd,clemcelu,clemmail,clembanc,clemagen, clemcont,clempix]

             console.log('valor' , values)

             const resunt = await clientEmp.query(insert , values)
             return resunt.rows[0]
        } catch (error) {

            if (error.code === "23505") { // Código de erro para chave duplicada no PostgreSQL
          throw new Error("Código de cliente já cadastrado. Tente outro.");
         }
          console.error("Erro no registro do clienteEmpresarial");
           throw error;
      }
   },

    async getAllClientEmp(){
       try {
            const query = `SELECT * FROM cadclem`
            const result = await clientEmp.query(query)
            if(!result){return}
           return result.rows
       } catch (error) {
          console.error('Erro na busca do cliente')
          throw error;
       }
    },

    async deleteClientEmp(id){
       try {
      const delet = "DELETE FROM cadclem WHERE clemcode = $1 RETURNING *";
      const result = await clientEmp.query(delet, [id]);

      return result.rows[0];
    } catch (error) {
      console.error("Erro no model:", error.message);
      throw error;
    }

    },

   async updateClientEmp( id , data) {
    try {
    const {
      clemnome,
      clemnoft,
      clemcnpj,
      clemdtcd,
      clemcep,
      clemrua,
      clemcida,
      clemestd,
      clemcelu,
      clemmail,
      clembanc,
      clemagen,
      clemcont,
      clempix
    } = data;

    const update = `
      UPDATE cadclem SET
        clemnome = $1,
        clemnoft = $2,
        clemcnpj = $3,
        clemdtcd = $4,
        clemcep = $5,
        clemrua = $6,
        clemcida = $7,
        clemestd = $8,
        clemcelu = $9,
        clemmail = $10,
        clembanc = $11,
        clemagen = $12,
        clemcont = $13,
        clempix = $14
      WHERE clemcode = $15
      RETURNING *;
    `;

    const values = [
      clemnome,
      clemnoft,
      clemcnpj,
      clemdtcd,
      clemcep,
      clemrua,
      clemcida,
      clemestd,
      clemcelu,
      clemmail,
      clembanc,
      clemagen,
      clemcont,
      clempix,
      id,
    ];

    const result = await clientEmp.query(update, values);

    if (result.rows.length === 0) {
      throw new Error("Cliente empresarial não encontrado para atualização.");
    }

    return result.rows[0];

  } catch (error) {
    console.error("Erro ao atualizar cliente empresarial:", error.message);
    throw error;
  }
},

}