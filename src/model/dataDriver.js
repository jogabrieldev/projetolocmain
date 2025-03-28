// const dataBaseM = require('../database/dataBaseSgt')
import { client } from "../database/userDataBase.js";
const userDbDriver = client;

export const crudRegisterDriver = {
  registerDriver: async (data) => {
    try {
      const {
        motoCode,
        motoNome,
        motoDtnc,
        motoCpf,
        motoDtch,
        motoctch,
        motoDtvc,
        motoRest,
        motoOrem,
        motoCelu,
        motoCep,
        motoRua,
        motoCity,
        motoEstd,
        motoMail,
        motoStat,
      } = data;

      const insert = `INSERT INTO cadmoto( motocode, motoname, motodtnc, motocpf, motodtch, motoctch , motodtvc, motorest, motoorem, motocelu, motocep, motorua, motocity, motoestd, motomail,motostat  ) VALUES( $1 , $2 , $3 , $4 , $5 ,$6 , $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`;

      const values = [
        motoCode,
        motoNome,
        motoDtnc,
        motoCpf,
        motoDtch,
        motoctch,
        motoDtvc,
        motoRest,
        motoOrem,
        motoCelu,
        motoCep,
        motoRua,
        motoCity,
        motoEstd,
        motoMail,
        motoStat,
      ];

      const result = await userDbDriver.query(insert, values);
      return result.rows[0];
    } catch (error) {
      console.error("Erro ao registrar motorista");
      throw error;
    }
  },

  listingDriver: async () => {
    try {
      const query = "SELECT * FROM cadmoto";

      const result = await userDbDriver.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro em listar Motorista:", error.message);
      throw error;
    }
  },

  verificarDepedenciaDeMotorista: async (id) => {
    try {
      const checkQuery = "SELECT COUNT(*) FROM cadauto WHERE caaumoto= $1";
      const checkResult = await userDbDriver.query(checkQuery, [id]);

      return parseInt(checkResult.rows[0].count) > 0;
    } catch (error) {
      console.error("Erro ao verificar dependências do Motorista:", error);
      throw error;
    }
  },

  verificarEntregaComMotorista:async (id)=>{
    try {
      const checkQuery = "SELECT COUNT(*) FROM locafim WHERE lofiidmt = $1";
      const checkResult = await userDbDriver.query(checkQuery, [id]);

      return parseInt(checkResult.rows[0].count) > 0;
    } catch (error) {
      console.error("Erro ao verificar dependências do Motorista com entrega:", error);
      throw error;
    }
  },

  deleteDriver: async (id) => {
    try {
      const delet = "DELETE FROM cadmoto WHERE motocode = $1 RETURNING *";
      const result = await userDbDriver.query(delet, [id]);

      return result.rows[0];
    } catch (error) {
      console.error("Erro no model:", error.message);
      throw error;
    }
  },

  updateDriver: async (id, updateMoto) => {
    try {
      const query = `
      UPDATE cadmoto
      SET 
           motoname = $1, motodtnc = $2, motocpf = $3, motodtch = $4, motoctch = $5 ,
           motodtvc = $6 , motorest = $7, motoorem = $8 , motocelu = $9 , motocep = $10,
           motorua = $11, motocity = $12 , motoestd = $13 , motomail = $14, motostat = $15
           WHERE motocode = $16
          RETURNING *;
          `;
      const values = [
        updateMoto.motoname || null,
        updateMoto.motodtnc || null,
        updateMoto.motocpf || null,
        updateMoto.motodtch || null,
        updateMoto.motoctch || null,
        updateMoto.motodtvc || null,
        updateMoto.motorest || null,
        updateMoto.motoorem || null,
        updateMoto.motocelu || null,
        updateMoto.motocep || null,
        updateMoto.motorua || null,
        updateMoto.motocity || null,
        updateMoto.motoestd || null,
        updateMoto.motomail || null,
        updateMoto.motostat || null,
        id,
      ];
      const result = await userDbDriver.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error("Erro ao atualizar motorista");
      throw error;
    }
  },

  updateStatusMoto: async (motoId, motostat) => {
    try {
      const query = `
        UPDATE cadmoto
        SET motostat = $1
        WHERE motocode = $2
        RETURNING *;
    `;

      const values = [motostat, motoId];
      const result = await userDbDriver.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error("Erro a atualizar status Motorista");
      throw error;
    }
  },
};
