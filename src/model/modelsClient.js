import { pool as dataClient } from "../database/userDataBase.js";

export const clientRegister = {
  registerOfClient: async (data) => {
    try {
      const {
        clieCode,
        clieName,
        clieTpCl,
        clieCpf,
        clieCnpj,
        dtCad,
        dtNasc,
        clieCelu,
        clieCity,
        clieEstd,
        clieRua,
        clieCep,
        clieMail,
        clieBanc,
        clieAgen,
        clieCont,
        cliePix,
      } = data;

      const insert = `INSERT INTO cadclie( cliecode, clienome,clietpcl, cliecpf, cliecnpj, cliedtcd, cliedtnc, cliecelu, cliecity, clieestd, clierua, cliecep, cliemail, cliebanc, clieagen , cliecont , cliepix) VALUES( $1 , $2 , $3 , $4 , $5 ,$6 , $7 , $8 , $9 , $10 , $11 , $12 , $13 , $14 ,$15 , $16 , $17 ) RETURNING *`;

      const values = [
        clieCode,
        clieName,
        clieTpCl,
        clieCpf,
        clieCnpj,
        dtCad,
        dtNasc,
        clieCelu,
        clieCity,
        clieEstd,
        clieRua,
        clieCep,
        clieMail,
        clieBanc,
        clieAgen,
        clieCont,
        cliePix,
      ];

      const result = await dataClient.query(insert, values);
      return result.rows[0];
    } catch (error) {
      if (error.code === "23505") {
        // Código de erro para chave duplicada no PostgreSQL
        throw new Error("Código de cliente já cadastrado. Tente outro.");
      }
      console.error("Erro no registro do cliente");
      throw error;
    }
  },



   getAllClientForId: async()=>{
    try {
      const query = "SELECT cliecode FROM cadclie";

      const result = await dataClient.query(query);
      if(result){
        return result.rows;
      }
      
    } catch (error) {
      console.error("Erro em listar ID Cliente:", error.message);
      throw error;
    }
  },
    
  verifiqueFilial: async (cliecode)=>{
   try {
    const query = ` SELECT COUNT(*) AS total_filiais FROM clifili WHERE filiclid = $1`;
     const values = [cliecode];
     const result = await dataClient.query(query, values);
     const total = parseInt(result.rows[0].total_filiais, 10);
     if(total > 0){
          return total;
     }
  
      } catch (error) {
         console.error('Erro na verificação de filiais')
          throw error;
    }
  },

   getClientForId: async(cliecode)=>{
    try {
      const query = "SELECT * FROM cadclie WHERE cliecode = $1 ";
      const values = [cliecode]
      const result = await dataClient.query(query , values);
      if(result){
        return result.rows[0];
      }
      
    } catch (error) {
      console.error("Erro em listar ID do Cliente:", error.message);
      throw error;
    }
  },

  verifyCredenciClient: async () => {
    try {
      const query = "SELECT cliecpf , cliecnpj FROM cadclie";
      const result = await dataClient.query(query);
      if (result) {
        return result.rows;
      }
    } catch (error) {
      console.error("Erro na busca credencial do cliente", error);
      throw error;
    }
  },

  async getClientByFilter(cliecode, cpf, cnpj) {
    try {
      let query = "SELECT * FROM cadclie WHERE 1=1";
      const values = [];

      if (cliecode) {
        values.push(cliecode.trim());
        query += ` AND cliecode = $${values.length}`;
      }

      if (cpf) {
        values.push(cpf.trim());
        query += ` AND cliecpf ILIKE $${values.length}`;
      }

      if (cnpj) {
        values.push(cnpj.trim());
        query += ` AND cliecnpj ILIKE $${values.length}`;
      }

      const result = await dataClient.query(query, values);
      return result.rows; // retorna array, mesmo que só 1 bem
    } catch (error) {
      console.error("Erro ao buscar o cliente por filtros:", error.message);
      throw error;
    }
  },

  listingClient: async () => {
    try {
      const query = "SELECT * FROM cadclie";
      const result = await dataClient.query(query);

        return result.rows;

    } catch (error) {
      console.error("Erro em listar todos os cliente:", error.message);
      throw error;
    }
  },

  verificarDependenciaCliente: async (id) => {
    try {
      const checkQuery = "SELECT COUNT(*) FROM clieloc WHERE clloidcl= $1";
      const checkResult = await dataClient.query(checkQuery, [id]);

      return parseInt(checkResult.rows[0].count) > 0;
    } catch (error) {
      console.error("Erro ao verificar dependências do cliente:", error);
      throw error;
    }
  },

  deleteClient: async (id) => {
    try {
      const deleteCadclie =
        "DELETE FROM cadclie WHERE cliecode = $1 RETURNING *";
      const result = await dataClient.query(deleteCadclie, [id]);

      return result.rows[0];
    } catch (error) {
      console.error("Erro no model:", error.message);
      throw error;
    }
  },

  updateClient: async (id, updateClient) => {
    try {
      const query = ` UPDATE cadclie SET  clienome = $1, clietpcl = $2, cliecpf = $3, cliecnpj = $4, cliedtcd = $5, cliedtnc = $6, cliecelu = $7, cliecity = $8, clieestd = $9, clierua = $10, cliecep = $11, cliemail = $12, cliebanc = $13, clieagen = $14 , cliecont = $15 , cliepix = $16 WHERE cliecode = $17 RETURNING * ;`;

      const values = [
        updateClient.clienome || null,
        updateClient.clietpcl || null,
        updateClient.cliecpf || null,
        updateClient.cliecnpj || null,
        updateClient.cliedtcd || null,
        updateClient.cliedtnc || null,
        updateClient.cliecelu || null,
        updateClient.cliecity || null,
        updateClient.clieestd || null,
        updateClient.clierua || null,
        updateClient.cliecep || null,
        updateClient.cliemail || null,
        updateClient.cliebanc || null,
        updateClient.clieagen || null,
        updateClient.cliecont || null,
        updateClient.cliepix || null,
        id,
      ];

      const result = await dataClient.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("erro no model", error.message);
      throw error;
    }
  },
};
