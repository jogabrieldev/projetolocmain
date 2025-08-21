
import { pool as dbGoods } from "../database/userDataBase.js";
// const dbGoods = pool;

export const goodsRegister = {
  registerOfBens: async (data) => {
    try {
      const {
        code,
        name,
        cofa,
        model,
        serial,
        bensAnmo,
        dtCompra,
        valorCp,
        ntFiscal,
        cofo,
        status,
        dtStatus,
        hrStatus,
        cor,
        bensAtiv,
        alug,
        valorAlug,
        fabri,
      } = data;

      const insert = `
          INSERT INTO cadbens(
             benscode , bensnome, benscofa, bensmode, bensnuse, bensanmo, bensdtcp, bensvacp, 
            bensnunf, benscofo, bensstat, bensdtus, benshrus, 
            benscore, bensativ, bensalug, bensvaal, bensfabr
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
          ) RETURNING *`;

      const values = [
        code,
        name,
        cofa,
        model,
        serial,
        bensAnmo,
        dtCompra,
        valorCp,
        ntFiscal,
        cofo,
        status,
        dtStatus,
        hrStatus,
        cor,
        bensAtiv,
        alug,
        valorAlug,
        fabri,
      ];

      await dbGoods.query("BEGIN");

      const result = await dbGoods.query(insert, values);

      await dbGoods.query("COMMIT");
      return result.rows[0];
    } catch (error) {

      if (error.code === "23505") { 
        throw new Error("Código do Bem ja cadastrado. Tente outro.");
      }
      console.error("Erro ao registrar bem:", error);
      throw error;
    }
  },

  pegarbemPorID:async (id)=>{
      try {
         const query = "SELECT * FROM cadbens WHERE benscode = $1";
         const result = await dbGoods.query(query,[id])
         if(result.rows.length === 0){
            return null;
         }
         return result.rows[0];
      } catch (error) {
         console.error("Erro ao buscar bem por codigo" , error)
      }
  },
  getAllBemId:async ()=>{
    try {
      const query = "SELECT benscode FROM cadbens";
      const result = await dbGoods.query(query);

      return result.rows;
    } catch (error) {
      console.error("Erro ao listar ID de bens:", error.message);
      throw error;
    }
  },

 async getGoodsById(benscode, status) {
  try {
    let query = "SELECT * FROM cadbens WHERE 1=1";
    const values = [];

    if (benscode) {
      values.push(benscode.trim());
      query += ` AND benscode = $${values.length}`;
    }

    if (status) {
      values.push(status.trim());
      query += ` AND bensstat ILIKE $${values.length}`; // ILIKE ignora maiúsculas
    }

    const result = await dbGoods.query(query, values);
    return result.rows; // retorna array, mesmo que só 1 bem
  } catch (error) {
    console.error("Erro ao buscar bens por filtros:", error.message);
    throw error;
  }
},

  listingBens: async () => {
    try {
      const query = "SELECT * FROM cadbens";
      const result = await dbGoods.query(query);

      return result.rows;
    } catch (error) {
      console.error("Erro ao listar bens:", error.message);
      throw error;
    }
  },

  verificarDependenciaBens: async (id) => {
    try {
      const checkQuery = "SELECT COUNT(*) FROM locafim WHERE lofiidbe= $1";
      const checkResult = await dbGoods.query(checkQuery, [id]);

      return parseInt(checkResult.rows[0].count) > 0;
    } catch (error) {
      console.error("Erro ao verificar dependências de bens:", error);
      throw error;
    }
  },
  deleteBens: async (id) => {
    try {
      const delet = "DELETE FROM cadbens WHERE benscode = $1 RETURNING *";
      const result = await dbGoods.query(delet, [id]);

      return result.rows[0];
    } catch (error) {
      console.error("Erro ao deletar bem:", error);
      throw error;
    }
  },

  updateBens: async (id, updateBem) => {
    try {
      const query = `
      UPDATE cadbens
      SET 
           bensnome = $1, benscofa = $2, bensmode = $3, bensnuse = $4, bensanmo = $5, bensdtcp = $6, bensvacp = $7, 
           bensnunf = $8, benscofo = $9, bensstat = $10, bensdtus = $11, benshrus = $12, 
           benscore = $13, bensativ = $14, bensalug = $15, bensvaal = $16, bensfabr = $17
      WHERE benscode = $18
      RETURNING *;
  `;
      const values = [
        updateBem.bensnome || null,
        updateBem.benscofa || null,
        updateBem.bensmode || null,
        updateBem.bensnuse || null,
        updateBem.bensanmo || null,
        updateBem.bensdtcp || null,
        updateBem.bensvacp || null,
        updateBem.bensnunf || null,
        updateBem.benscofo || null,
        updateBem.bensstat || null,
        updateBem.bensdtus || null,
        updateBem.benshrus || null,
        updateBem.benscore || null,
        updateBem.bensativ || null,
        updateBem.bensalug || null,
        updateBem.bensvaal || null,
        updateBem.bensfabr || null,
        id,
      ];
      const result = await dbGoods.query(query, values);

      return result.rows[0];
    } catch (error) {
      console.error("Erro a atualizar bem:", error);
      throw error;
    }
  },

  buscarIdFamiliaBens: async () => {
    try {
      const result = await dbGoods.query(
        "SELECT fabecode , fabedesc FROM cadfabe"
      );
      return result.rows;
    } catch (error) {
      console.log("error no model family bens", error);
      throw error;
    }
  },

  updateStatus: async (client ,goodsId, bensstat) => {
    console.log('bens' , goodsId , 'status' , bensstat)
  try {
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toISOString().split('T')[0]; // yyyy-mm-dd
    const horaFormatada = dataAtual.toTimeString().split(' ')[0]; // HH:mm:ss

    const query = `
      UPDATE cadbens
      SET bensstat = $1, bensdtus = $2, benshrus = $3
      WHERE benscode = $4
      RETURNING *;
    `;

    const values = [bensstat, dataFormatada, horaFormatada, goodsId];
    const result = await client.query(query, values);

    return result.rows[0];
  } catch (error) {
    console.error("Erro ao atualizar status do bem:", error);
    throw error;
  }
},

};
