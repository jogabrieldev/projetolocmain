
import { client } from "../database/userDataBase.js";
const dataClient = client;

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
        cliePix
      } = data;

      const insert = `INSERT INTO cadclie( cliecode, clienome,clietpcl, cliecpf, cliecnpj, cliedtcd, cliedtnc, cliecelu, cliecity, clieestd, clierua, cliecep, cliemail, cliebanc, clieagen , cliecont , cliepix ) VALUES( $1 , $2 , $3 , $4 , $5 ,$6 , $7 , $8 , $9 , $10 , $11 , $12 , $13 , $14 ,$15 , $16 , $17) RETURNING *`;

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
        cliePix
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
  
  getAllClientCredenci: async()=>{
        try {
           const query = "SELECT cliecpf , cliecnpj FROM cadclie"
           const result = await dataClient.query(query)
           if(result){
             return result.rows
           }
        } catch (error) {
            console.error('Erro na busca' , error)
            throw error
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
      const query = ` UPDATE cadclie SET  clienome = $1, clietpcl = $2, cliecpcn = $3, cliedtcd = $4, cliedtnc = $5, cliecelu = $6, cliecity = $7, clieestd = $8, clierua = $9, cliecep = $10, cliemail = $11, cliebanc = $12, clieagen = $13 , cliecont = $14 , cliepix = $15 WHERE cliecode = $16 RETURNING * ;`;

      const values = [
        updateClient.clienome || null,
        updateClient.clietpcl || null,
        updateClient.cliecpcn || null,
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
        updateClient.cliecont|| null,
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
