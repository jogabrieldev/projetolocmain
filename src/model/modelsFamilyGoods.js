// const dataBaseM = require('../database/dataBaseSgt')
import { pool as dbFamilyGoods} from "../database/userDataBase.js";

export const crudRegisterFamilyGoods = {

  registerOfFabri: async (data) => {
    try {
      const { fabeCode, fabeDesc, fabeCate, fabeCapa, fabeObs, fabeCtct } =
        data;

      const insert = `INSERT INTO cadfabe( fabecode, fabedesc, fabecate, fabecapa, fabeobse, fabectct) VALUES( $1 , $2 , $3 , $4 , $5 ,$6 ) RETURNING *`;

      const values = [
        fabeCode,
        fabeDesc,
        fabeCate,
        fabeCapa,
        fabeObs,
        fabeCtct,
      ];

      const result = await dbFamilyGoods.query(insert, values);
      return result.rows[0];
    } catch (error) {
      if (error.code === "23505") {
        throw new Error(
          "Código da familia de bens ja cadastrado. Tente outro."
        );
      }
      console.error("erro ao registrar familia de bem");
      throw error;
    }
  },

  async getFamilyGoodsById(fabecode) {
   try {
    let query = "SELECT * FROM cadfabe WHERE 1=1";
    const values = [];

    if (fabecode) {
      values.push(fabecode.trim());
      query += ` AND fabecode = $${values.length}`;
    }

    const result = await dbFamilyGoods.query(query, values);
    return result.rows; // retorna array, mesmo que só 1 bem
  } catch (error) {
    console.error("Erro ao buscar familia de bem por filtros:", error.message);
    throw error;
  }
},

  getCodeIdFamilyBens: async () => {
    try {
      const query = "SELECT fabecode FROM cadfabe";

      const result = await dbFamilyGoods.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro em listar fabricante:", error.message);
      throw error;
    }
  },

  listingFabri: async () => {
    try {
      const query = "SELECT * FROM cadfabe";

      const result = await dbFamilyGoods.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro em listar fabricante:", error.message);
      throw error;
    }
  },

  verificarDependenciaDaFamiliaBens: async (id) => {
    try {
      const checkQuery = "SELECT COUNT(*) FROM cadbens WHERE benscofa = $1";
      const checkResult = await dbFamilyGoods.query(checkQuery, [id]);

      if (checkResult.rows[0].count > 0) {
        return {
          error:
            "Não é possível excluir. Existem bens vinculados a este fornecedor.",
        };
      }
      return parseInt(checkResult.rows[0].count) > 0;
    } catch (error) {
      console.error(
        "Erro ao verificar dependências da familia de bens:",
        error
      );
      throw error;
    }
  },

  verificarDepedenciaDeReservaLocacao: async (id) => {
    try {
      const checkQuery = "SELECT COUNT(*) FROM bensloc WHERE belocodb= $1";
      const checkResult = await dbFamilyGoods.query(checkQuery, [id]);

      return parseInt(checkResult.rows[0].count) > 0;
    } catch (error) {
      console.error("Erro ao verificar dependências do Motorista:", error);
      throw error;
    }
  },
  deleteFabri: async (id) => {
    try {
      const deleteCadclie =
        "DELETE FROM cadfabe WHERE fabecode = $1 RETURNING *";
      const result = await dbFamilyGoods.query(deleteCadclie, [id]);

      return result.rows[0];
    } catch (error) {
      console.error("Erro no model:", error.message);
      throw error;
    }
  },

  updateFabri: async (id, updateFabri) => {
    try {
      const query = `
        UPDATE cadfabe
        SET 
             fabedesc = $1, fabecate = $2, fabecapa = $3, fabeobse = $4, fabectct = $5 
             WHERE fabecode = $6
            RETURNING *;
            `;
      const values = [
        updateFabri.fabedesc || null,
        updateFabri.fabecate || null,
        updateFabri.fabecapa || null,
        updateFabri.fabeobse || null,
        updateFabri.fabectct || null,
        id,
      ];
      const result = await dbFamilyGoods.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error("erro na atualização da familia");
      throw error;
    }
  },
};
