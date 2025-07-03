// const dataBaseM = require('../database/dataBaseSgt')
import { client as userDbFo  } from "../database/userDataBase.js";

export const crudRegisterForn = {
  registerOfForn: async (data) => {

    try {
      const {
        fornCode,
        fornName,
        nomeFan,
        fornCnpj,
        fornCep,
        fornRua,
        fornCity,
        fornEstd,
        fornCelu,
        fornMail,
        fornBank,
        fornAge,
        fornCont,
        fornPix,
        fornDtcd,
        fornDisPro,
      } = data;

      const insert = `INSERT INTO cadforn(forncode, fornnome, fornnoft, forncnpj, forncep, fornrua, forncity, fornestd, forncelu, fornmail, fornbanc, fornagen, forncont, fornpix, forndtcd, fornptsv)  VALUES( $1 , $2 , $3 , $4 , $5 ,$6 , $7 , $8 , $9 , $10 , $11 , $12 , $13 ,$14 , $15, $16) RETURNING *`;

      const values = [
        fornCode,
        fornName,
        nomeFan,
        fornCnpj,
        fornCep,
        fornRua,
        fornCity,
        fornEstd,
        fornCelu,
        fornMail,
        fornBank,
        fornAge,
        fornCont,
        fornPix,
        fornDtcd,
        fornDisPro,
      ];

      const result = await userDbFo.query(insert, values);
      return result.rows[0];
    } catch (error) {

      if (error.code === "23505") { 
        throw new Error("Código do Fornecedor ja cadastrado. Tente outro.");
      }
      console.error("Erro fornecedor", error);
      throw error;
    }
  },
   
  async getFornecedorById(forncode, cnpj) {
   try {
    let query = "SELECT * FROM cadforn WHERE 1=1";
    const values = [];

    if (forncode) {
      values.push(forncode.trim());
      query += ` AND forncode = $${values.length}`;
    }

    if(cnpj) {
      values.push(cnpj.trim());
      query += ` AND forncnpj = $${values.length}`;
    }

    const result = await userDbFo.query(query, values);
    return result.rows; // retorna array, mesmo que só 1 bem
  } catch (error) {
    console.error("Erro ao buscar fornecedor por filtros:", error.message);
    throw error;
  }
},
 
  listingForn: async () => {
    try {
      const query = "SELECT * FROM cadforn";

      const result = await userDbFo.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro em listar Fornecedor:", error.message);
      throw error;
    }
  },

  buscarIdFornCnpj: async () => {
    try {
      const result = await userDbFo.query(
        "SELECT forncnpj FROM cadforn"
      );
      return result.rows;
    } catch (error) {
      console.log("error no model fornecedor", error);
      throw error;
    }
  },

  buscarIdForn: async () => {
    try {
      const result = await userDbFo.query(
        "SELECT forncode, fornnome FROM cadforn"
      );
      return result.rows;
    } catch (error) {
      console.log("error no model fornecedor", error);
      throw error;
    }
  },

  verificarDependenciaForne: async (id) => {
    try {
      const checkQuery = "SELECT COUNT(*) FROM cadbens WHERE benscofo = $1";
      const checkResult = await userDbFo.query(checkQuery, [id]);

      return parseInt(checkResult.rows[0].count) > 0;
    } catch (error) {
      console.error("Erro ao verificar dependências do Fornecedor:", error);
      throw error;
    }
  },

  deleteForn: async (id) => {
    try {
      const deleteQuery = "DELETE FROM cadforn WHERE forncode = $1 RETURNING *";
      const result = await userDbFo.query(deleteQuery, [id]);

      if (result.rows.length === 0) {
        return { error: "Fornecedor não encontrado." };
      }

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error("Erro no model:", error.message);
      throw error;
    }
  },

  updateForn: async (id, updateDataForn) => {
    try {
      const query = `UPDATE cadforn SET fornnome = $1 , fornnoft = $2 , forncnpj = $3 , forncep = $4 , fornrua = $5 , forncity = $6 , fornestd = $7  ,forncelu = $8 , fornmail = $9 , fornbanc = $10 , fornagen = $11 , forncont = $12 , fornpix = $13 , forndtcd = $14 , fornptsv = $15 WHERE forncode = $16 RETURNING *; `;

      const value = [
        updateDataForn.fornnome || null,
        updateDataForn.fornnoft || null,
        updateDataForn.forncnpj || null,
        updateDataForn.forncep || null,
        updateDataForn.fornrua || null,
        updateDataForn.forncity || null,
        updateDataForn.fornestd || null,
        updateDataForn.forncelu || null,
        updateDataForn.fornmail || null,
        updateDataForn.fornbanc || null,
        updateDataForn.fornagen || null,
        updateDataForn.forncont || null,
        updateDataForn.fornpix || null,
        updateDataForn.forndtcd || null,
        updateDataForn.fornptsv || null,
        id,
      ];

      const result = await userDbFo.query(query, value);
      return result.rows[0];
    } catch (error) {
      console.error("Erro na atualização fornecedor");
      throw error;
    }
  },
};
