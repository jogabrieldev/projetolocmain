import { client as dataClient } from "../database/userDataBase.js";

export const autoRegister = {

  registerAuto: async (data) => {
    try {
      const {
        caaucode,
        caauplac,
        caauchss,
        caaurena,
        caaumaca,
        caaumode,
        caaucor,
        caautico,
        caauloca,
        caaukmat,
        caaustat,
        caausitu,
        caaudtca,
        
      } = data;

      const insert = `INSERT INTO cadauto (caaucode, caauplac, caauchss, caaurena, caaumaca, caaumode, caaucor, caautico, caauloca, caaukmat, caaustat,caausitu, caaudtca) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 , $12 , $13) RETURNING *`;

      const values = [
        caaucode,
        caauplac,
        caauchss,
        caaurena,
        caaumaca,
        caaumode,
        caaucor,
        caautico,
        caauloca,
        caaukmat,
        caaustat,
        caausitu,
        caaudtca,
       
      ];

      const result = await dataClient.query(insert, values);
      return result.rows[0];
    } catch (error) {

      if (error.code === "23505") { 
        throw new Error("Código do veiculo já cadastrado. Tente outro.");
      }

      console.error("Erro ao registrar automóvel:", error);
      throw error;
    }
  },

  async getCodeVehicle(code){
    try {
         const query = `SELECT *FROM cadauto WHERE caaucode = $1`
         const result = await dataClient.query(query , [code])
          if (result && result.rows.length > 0) {
        return result.rows[0]; // retorna um único motorista
      }

      return null;
    } catch (error) {
      console.error('Erro para buscar por code de veiculo ')
      throw error;
    }
  },

 async searchVehicle(caaucode, placa) {
   try {
     let query = "SELECT * FROM cadauto WHERE 1=1";
     const values = [];

    if (caaucode) {
      values.push(caaucode.trim());
      query += ` AND caaucode = $${values.length}`;
    }

    if (placa) {
      values.push(placa.trim());
      query += ` AND caauplac ILIKE $${values.length}`; 
    }

    const result = await dataClient.query(query, values);
    return result.rows; 
  } catch (error) {
    console.error("Erro ao buscar veiculos por filtros:", error.message);
    throw error;
  }
},

  listAutos: async () => {
    try {
      const query = "SELECT * FROM cadauto";
      const result = await dataClient.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao listar automovel:", error);
      throw error;
    }
  },

  deleteAuto: async (id) => {
    try {
      const deleteQuery = "DELETE FROM cadauto WHERE caaucode = $1 RETURNING *";
      const result = await dataClient.query(deleteQuery, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("Erro ao deletar automovel:", error.message);
      throw error;
    }
  },

  updateAuto: async (id, updateData) => {
    try {
      const query = `UPDATE cadauto SET caauplac = $1, caauchss = $2, caaurena = $3, 
                           caaumaca = $4, caaumode = $5, caaucor = $6, caautico = $7, 
                           caaukmat = $8, caauloca = $9, caaustat = $10, caaudtca = $11
                           WHERE caaucode = $12 RETURNING *;`;

      const values = [
        updateData.caauplac || null,
        updateData.caauchss || null,
        updateData.caaurena || null,
        updateData.caaumaca || null,
        updateData.caaumode || null,
        updateData.caaucor || null,
        updateData.caautico || null,
        updateData.caaukmat || null,
        updateData.caauloca || null,
        updateData.caaustat || null,
        updateData.caaudtca || null,
        id,
      ];

      const result = await dataClient.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Erro ao atualizar automovel:", error.message);
      throw error;
    }
  },

  updateStatus: async (Id, caaustat) => {
    try {
      const query = `
      UPDATE cadauto
      SET caaustat = $1
      WHERE caaucode = $2
      RETURNING *;
  `;

      const values = [caaustat, Id];
      const result = await dataClient.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error("erro a atualizar status do veiculo " ,error);
      throw error;
    }
  },
};
