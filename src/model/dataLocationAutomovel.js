import { client } from "../database/userDataBase.js";
const locationAuto = client;

export const modelsLocationAuto = {
      
   async registerLocationAuto(veiculo, clloid){
           
    const query = `
      INSERT INTO autoloc (veloidau, veloplac, velomode, velotime, velotpca, velostat, veloclie)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING velocode;
    `;

    try {
      await locationAuto.query("BEGIN");

      const resultados = [];
      for (const {
      code,
      modelo,
      placa,
      horario,
      carga,
      status
      } of veiculo) {
        const valoresVeiculo = [
            code,
            placa,
            modelo,
            horario,
           carga,
           status,
          clloid,
        ];
        
        const resultado = await locationAuto.query(query, valoresVeiculo);

        // console.log('resuntado' , resultado)
        resultados.push(resultado.rows[0]);
      }

      await locationAuto.query("COMMIT");
      return resultados;
    } catch (error) {
      await locationAuto.query("ROLLBACK");
      console.error("Erro ao inserir veiculo locado:", error);
      throw error;
    }
     
 } ,

 async buscarTodasLocacoes() {
  const query = `
    SELECT 
      c.clloid, 
      c.cllonmlo, 
      c.cllodtdv, 
      c.cllodtlo, 
      c.cllopgmt, 
      c.clloclno, 
      c.cllocpf,
      c.cllorua,
      c.cllocep,
      c.cllobair,
      c.cllocida,
      c.cllorefe,
      c.clloqdlt,
      c.clloresi,

      a.velocode,
      a.veloidau,
      a.veloplac,
      a.velomode,
      a.velotime,
      a.velotpca,
      a.velostat
    FROM clieloc c
    LEFT JOIN autoloc a ON c.clloid = a.veloclie
    ORDER BY c.clloid;
  `;

  try {
    const { rows } = await locationAuto.query(query);

    const locacoes = rows.reduce((acc, row) => {
      let locacao = acc.find((l) => l.clloid === row.clloid);

      if (!locacao) {
        locacao = {
          clloid: row.clloid,
          cllonmlo: row.cllonmlo,
          cllodtdv: row.cllodtdv,
          cllodtlo: row.cllodtlo,
          cllopgmt: row.cllopgmt,
          clloclno: row.clloclno,
          cllocpf: row.cllocpf,
          cllorua: row.cllorua,
          cllocep: row.cllocep,
          cllobair: row.cllobair,
          cllocida: row.cllocida,
          cllorefe: row.cllorefe,
          clloqdlt: row.clloqdlt,
          clloresi: row.clloresi,
          veiculos: [],
        };
        acc.push(locacao);
      }

      if (row.velocode) {
        locacao.veiculos.push({
          velocode: row.velocode,
          veloidau: row.veloidau,
          veloplac: row.veloplac,
          velomode: row.velomode,
          velotime: row.velotime,
          velotpca: row.velotpca,
          velostat: row.velostat,
        });
      }

      return acc;
    }, []);

    return locacoes;
  } catch (error) {
    console.error("Erro ao buscar locações e veículos:", error);
    throw error;
  }
},

async deleteLocationVehicles(numeroLocacao){
       try {
      const result = await locationAuto.query(
        "SELECT clloid FROM clieloc WHERE cllonmlo = $1",
        [numeroLocacao]
      );

      if (result.rows.length === 0) {
        console.log("Nenhuma locação encontrada com o número fornecido.");
        return false;
      }

      const idLocacao = result.rows[0].clloid;

      await locationAuto.query("DELETE FROM autoloc WHERE veloclie = $1", [
        idLocacao,
      ]);

      await locationAuto.query("DELETE FROM clieloc WHERE clloid = $1", [
        idLocacao,
      ]);

      return true;
    } catch (error) {
      console.error("Erro no model:", error.message);
      throw error;
    }
}

}