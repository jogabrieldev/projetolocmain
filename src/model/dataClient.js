
import { client } from "../database/userDataBase.js";
const dataClient = client;

export const clientRegister = {
  registerOfClient: async (data) => {
    try {
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
      } = data;

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
        clieMail,
      ];

      const result = await dataClient.query(insert, values);
      return result.rows[0];
    } catch (error) {

      if (error.code === "23505") { // Código de erro para chave duplicada no PostgreSQL
        throw new Error("Código de cliente já cadastrado. Tente outro.");
      }
      console.error("Erro no registro do cliente");
      throw error;
    }
  },

    getAllClientId: async()=>{
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

    getAllClientcpf: async()=>{
    try {
      const query = "SELECT cliecpf FROM cadclie";

      const result = await dataClient.query(query);
      if(result){
        return result.rows;
      }
      
    } catch (error) {
      console.error("Erro em listar ID Cliente:", error.message);
      throw error;
    }
  },

  listingClient: async () => {
    try {
      const query = "SELECT * FROM cadclie";

      const result = await dataClient.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro em listar cliente:", error.message);
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
      const query = ` UPDATE cadclie SET  clienome = $1, cliecpf = $2, cliedtcd = $3, cliedtnc = $4, cliecelu = $5, cliecity = $6, clieestd = $7, clierua = $8, cliecep = $9, cliemail = $10 WHERE cliecode = $11 RETURNING * ;`;

      const values = [
        updateClient.clienome || null,
        updateClient.cliecpf || null,
        updateClient.cliedtcd || null,
        updateClient.cliedtnc || null,
        updateClient.cliecelu || null,
        updateClient.cliecity || null,
        updateClient.clieestd || null,
        updateClient.clierua || null,
        updateClient.cliecep || null,
        updateClient.cliemail || null,
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
