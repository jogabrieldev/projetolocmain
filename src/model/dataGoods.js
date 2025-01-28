const db = require("../database/dataBaseSgt");
const userDataBase = require("../database/userDataBase");


const crudGoods =  {
   
    registerOfBens: async (data) => {
        const {
          code,
          name,
          cofa,
          model,
          serial,
          placa,
          bensAnmo,
          dtCompra,
          valor,
          ntFiscal,
          cofo,
          kmAtual,
          dtKM,
          status,
          dtStatus,
          hrStatus,
          chassi,
          cor,
          nuMO,
          rena,
          bensCtep,
          bensAtiv,
          alug,
          valorAlug,
          fabri,
        } = data;
    
        const insert = `
        INSERT INTO cadbens(
           benscode , bensnome, benscofa, bensmode, bensnuse, bensplac, bensanmo, bensdtcp, bensvacp, 
          bensnunf, benscofo, benskmat, bensdtkm, bensstat, bensdtus, benshrus, bensnuch, 
          benscore, bensnumo, bensrena, bensctep, bensativ, bensalug, bensvaal, bensfabr
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
        ) RETURNING *`;
    
        const values = [
          code,
          name,
          cofa,
          model,
          serial,
          placa,
          bensAnmo,
          dtCompra,
          valor,
          ntFiscal,
          cofo,
          kmAtual,
          dtKM,
          status,
          dtStatus,
          hrStatus,
          chassi,
          cor,
          nuMO,
          rena,
          bensCtep,
          bensAtiv,
          alug,
          valorAlug,
          fabri,
        ];
    
        const result = await userDataBase.query(insert, values);
        return result.rows[0];
      },
    
      listingBens: async () => {
        try {
          const query = "SELECT * FROM cadbens";
          const result = await userDataBase.query(query);
    
          return result.rows;
        } catch (error) {
          console.error("Erro ao listar bens:", error.message);
        }
      },
    
      deleteBens: async (id) => {
        const delet = "DELETE FROM cadbens WHERE benscode = $1 RETURNING *";
        const result = await userDataBase.query(delet, [id]);
    
        return result.rows[0];
      },
    
      updateBens: async (id, updateBem) => {
        const query = `
            UPDATE cadbens
            SET 
                 bensnome = $1, benscofa = $2, bensmode = $3, bensnuse = $4, bensplac = $5, bensanmo = $6, bensdtcp = $7, bensvacp = $8, 
                 bensnunf = $9, benscofo = $10, benskmat = $11, bensdtkm = $12, bensstat = $13, bensdtus = $14, benshrus = $15, bensnuch = $16, 
                 benscore = $17, bensnumo = $18, bensrena = $19, bensctep = $20, bensativ = $21, bensalug = $22, bensvaal = $23, bensfabr = $24
            WHERE benscode = $25
            RETURNING *;
        `;
        const values = [
          updateBem.bensnome || null,
          updateBem.benscofa || null,
          updateBem.bensmode || null,
          updateBem.bensnuse || null,
          updateBem.bensplac || null,
          updateBem.bensanmo || null,
          updateBem.bensdtcp || null,
          updateBem.bensvacp || null,
          updateBem.bensnunf || null,
          updateBem.benscofo || null,
          updateBem.benskmat || null,
          updateBem.bensdtkm || null,
          updateBem.bensstat || null,
          updateBem.bensdtus || null,
          updateBem.benshrus || null,
          updateBem.bensnuch || null,
          updateBem.benscore || null,
          updateBem.bensnumo || null,
          updateBem.bensrena || null,
          updateBem.bensctep || null,
          updateBem.bensativ || null,
          updateBem.bensalug || null,
          updateBem.bensvaal || null,
          updateBem.bensfabr || null,
          id,
        ];
        const result = await userDataBase.query(query, values);
        // console.log('dados enviados para o model:' ,result)
    
        return result.rows[0];
      },
 };

module.exports = crudGoods