// const dataBaseM = require('../database/dataBaseSgt')
import { client } from "../database/userDataBase.js";
const dbFamilyGoods = client;

export const crudRegisterFamilyGoods = {
  registerOfFabri: async (data) => {
    try {
      const { fabeCode, fabeDesc, fabeCate, fabeSuca, fabeObs, fabeCtct } =
        data;

      const insert = `INSERT INTO cadfabe( fabecode, fabedesc, fabecate, fabesuca, fabeobs, fabectct) VALUES( $1 , $2 , $3 , $4 , $5 ,$6 ) RETURNING *`;

      const values = [
        fabeCode,
        fabeDesc,
        fabeCate,
        fabeSuca,
        fabeObs,
        fabeCtct,
      ];

      const result = await dbFamilyGoods.query(insert, values);
      return result.rows[0];
    } catch (error) {
      console.error("erro ao registrar familia de bem");
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
  deleteFabri: async (id) => {
    try {
      // Excluir o cliente da tabela "cadclie"
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
             fabedesc = $1, fabecate = $2, fabesuca = $3, fabeobs = $4, fabectct = $5 
             WHERE fabecode = $6
            RETURNING *;
            `;
      const values = [
        updateFabri.fabedesc || null,
        updateFabri.fabecate || null,
        updateFabri.fabesuca || null,
        updateFabri.fabeobs || null,
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
