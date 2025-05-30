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
      }
}