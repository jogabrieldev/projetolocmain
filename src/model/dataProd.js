// const dataBaseM = require('../database/dataBaseSgt')
import { client } from "../database/userDataBase.js";
const userDbProd = client;

export const crudRegisterProd = {
  registerOfProd: async (data) => {
    try {
      const {
        prodCode,
        prodDesc,
        prodTipo,
        prodUni,
        prodData,
        prodValor,
        prodPeli,
        prodPebr,
        prodAtiv,
      } = data;

      const insert = `INSERT INTO cadprod(prodcode, proddesc, prodtipo, produnid, proddtuc, prodvluc, prodpeli, prodpebr, prodativ ) VALUES( $1 , $2 , $3 , $4 , $5 ,$6 , $7 , $8 , $9 ) RETURNING *`;

      const values = [
        prodCode,
        prodDesc,
        prodTipo,
        prodUni,
        prodData,
        prodValor,
        prodPeli,
        prodPebr,
        prodAtiv,
      ];
      const result = await userDbProd.query(insert, values);
  
      return result.rows[0];
    } catch (error) {

      if (error.code === "23505") { 
        throw new Error("Código do Produto ja cadastrado. Tente outro.");
      }
      console.error("erro para registrar tipo");
      throw error;
    }
  },

  getCodeProd: async()=>{
     try {
      const query = "SELECT prodcode FROM cadprod";

      const result = await userDbProd.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro em listar code do produto:", error.message);
      throw error;
    }
  },

  listingOfProd: async (data) => {
    try {
      const query = "SELECT * FROM cadprod";

      const result = await userDbProd.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro em listar tipo produto:", error.message);
      throw error;
    }
  },

  deleteOfProd: async (id) => {
    try {
      const delet = "DELETE FROM cadprod WHERE prodcode = $1 RETURNING *";
      const result = await userDbProd.query(delet, [id]);

      return result.rows[0];
    } catch (error) {
      console.error("Erro no model:", error.message);
      throw error;
    }
  },

  updateOfProd: async (id, updateProd) => {
    try {
      const query = `
        UPDATE cadprod
        SET 
             proddesc = $1, prodtipo = $2, produnid = $3, proddtuc = $4, prodvluc = $5, prodpeli = $6, prodpebr = $7, 
             prodativ = $8
             WHERE prodcode = $9
            RETURNING *;
            `;
      const values = [
        updateProd.proddesc || null,
        updateProd.prodtipo || null,
        updateProd.produnid || null,
        updateProd.proddtuc || null,
        updateProd.prodvluc || null,
        updateProd.prodpeli || null,
        updateProd.prodpebr || null,
        updateProd.prodativ || null,
        id,
      ];
      const result = await userDbProd.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error("erro na atualização", error);
      throw error;
    }
  },

  buscartipoProd: async () => {
    try {
      const result = await userDbProd.query("SELECT tiprcode FROM cadtipr");
      return result.rows;
    } catch (error) {
      console.error("Erro no model tipo prod");
      throw error;
    }
  },
};
