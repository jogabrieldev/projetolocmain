
import { pool as userDbDriver } from "../database/userDataBase.js";

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
        motoSitu,
        motoPasw,
      } = data;

      const insert = `INSERT INTO cadmoto( motocode, motonome, motodtnc, motocpf, motodtch, motoctch , motodtvc, motorest, motoorem, motocelu, motocep, motorua, motocity, motoestd, motomail,motostat,motositu, motopasw  ) VALUES( $1 , $2 , $3 , $4 , $5 ,$6 , $7, $8, $9, $10, $11, $12, $13, $14, $15, $16 , $17 , $18) RETURNING *`;

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
        motoSitu,
        motoPasw,
      ];

      const result = await userDbDriver.query(insert, values);
      return result.rows[0];
    } catch (error) {
      if (error.code === "23505") {
        throw new Error("Código do motorista ja cadastrado. Tente outro.");
      }
      console.error("Erro ao registrar motorista");
      throw error;
    }
  },

  getAllDriverIdCpf: async () => {
    try {
      const query = "SELECT motocpf FROM cadmoto";
      const result = await userDbDriver.query(query);
      
      return result.rows;
    } catch (error) {
      console.error("Erro em listar ID Fornecedor:", error.message);
      throw error;
    }
  },

  getAllDriverId: async () => {
    try {
      const query = "SELECT motocode FROM cadmoto";

      const result = await userDbDriver.query(query);
      if (result) {
        return result.rows;
      }
    } catch (error) {
      console.error("Erro em listar ID dos motoristas:", error.message);
      throw error;
    }
  },

   async getPasswordByDrive(){
    try {
      const query = "SELECT motopasw FROM cadmoto";
      const result = await userDbDriver.query(query);
      console.log(result.rows)
      
      return result.rows;

    } catch (error) {
      console.error("Erro ao buscar senha do motorista:", error.message);
      throw error;
    }
  },

  async searchDriver(motocode, status, situacao) {
    try {
      let query = "SELECT * FROM cadmoto WHERE 1=1";
      const values = [];

      if (motocode) {
        values.push(motocode.trim());
        query += ` AND motocode = $${values.length}`;
      }

      if (status) {
        values.push(status.trim());
        query += ` AND motostat ILIKE $${values.length}`;
      }
      if (situacao) {
        values.push(situacao.trim());
        query += ` AND motositu ILIKE $${values.length}`;
      }

      const result = await userDbDriver.query(query, values);
      return result.rows; // retorna array, mesmo que só 1 bem
    } catch (error) {
      console.error("Erro ao buscar motorista por filtros:", error.message);
      throw error;
    }
  },

  getDriverByCode: async (id) => {
    try {
      const query = "SELECT * FROM cadmoto WHERE motocode = $1";

      const result = await userDbDriver.query(query, [id]);

      if (result && result.rows.length > 0) {
        return result.rows[0]; // retorna um único motorista
      }

      return null; // caso não encontre
    } catch (error) {
      console.error("Erro em listar motorista por ID:", error.message);
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

  verificarEntregaComMotorista: async (id) => {
    try {
      const checkQuery = "SELECT COUNT(*) FROM locafim WHERE lofiidmt = $1";
      const checkResult = await userDbDriver.query(checkQuery, [id]);

      return parseInt(checkResult.rows[0].count) > 0;
    } catch (error) {
      console.error(
        "Erro ao verificar dependências do Motorista com entrega:",
        error
      );
      throw error;
    }
  },

  verificarVeiculoComMotorsitaExterno: async(id)=>{
     try {
            const checkQuery = "SELECT COUNT(*) FROM servexte WHERE seexmoto = $1";
            const checkResult = await userDbDriver.query(checkQuery, [id]);

           return parseInt(checkResult.rows[0].count) > 0;
        } catch (error) {
           console.error("Erro ao verificar dependências do Motorista com entrega:",error);
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
           motonome = $1, motodtnc = $2, motocpf = $3, motodtch = $4, motoctch = $5 ,
           motodtvc = $6 , motorest = $7, motoorem = $8 , motocelu = $9 , motocep = $10,
           motorua = $11, motocity = $12 , motoestd = $13 , motomail = $14, motostat = $15
           WHERE motocode = $16
          RETURNING *;
          `;
      const values = [
        updateMoto.motonome || null,
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
