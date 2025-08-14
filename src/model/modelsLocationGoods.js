// const database = require("../database/dataBaseSgt");
import { client } from "../database/userDataBase.js";
import cron from "node-cron"
const dataLocation = client;

export const LocacaoModel = {
  async gerarNumeroLocacao() {
    let numero;
    let existe;

    do {
      numero = Math.floor(100000 + Math.random() * 900000);

      const query = "SELECT COUNT(*) FROM clieloc WHERE cllonmlo = $1";
      const result = await dataLocation.query(query, [numero]);
      existe = parseInt(result.rows[0].count) > 0;
    } while (existe); 

    return numero;
  },

  async criarLocacao({cllonmlo, clloidcl, cllodtdv, cllodtlo, cllopgmt,cllorua ,cllocep, clloclno, cllobair, cllocida,cllorefe, clloqdlt, clloresi , cllocpcn , cllodesc}) {
    try {
      if (!cllonmlo|| !clloidcl||!cllodtdv||!cllodtlo|| !cllopgmt|| !cllorua|| !cllobair|| !cllocida|| !clloresi|| !clloclno|| !cllocpcn || !cllodesc){
        throw new Error("Erro: Algum valor está indefinido na inserção do cliente que locou!");
      }

      const insertQuery = `
  INSERT INTO clieloc(cllonmlo, clloidcl, cllodtdv, cllodtlo, cllopgmt,cllorua ,cllocep, clloclno, cllobair, cllocida,cllorefe, clloqdlt, clloresi , cllocpcn , cllodesc)
  VALUES ($1, $2, $3, $4, $5, $6 , $7 ,$8 ,$9 , $10 , $11 , $12 , $13 , $14 , $15)
  RETURNING clloid;
`;

      const values = [
        cllonmlo, clloidcl, cllodtdv, cllodtlo, cllopgmt,cllorua ,cllocep, clloclno, cllobair, cllocida,cllorefe, clloqdlt, clloresi , cllocpcn, cllodesc
      ];

      const result = await dataLocation.query(insertQuery, values);

      return result.rows[0].clloid;
    } catch (error) {
      console.error("Erro ao criar locação:", error);
      throw error;
    }
  },

  async inserirBens(bens, clloid) {
    const query = `
      INSERT INTO bensloc (belocodb, belobem, belodtin, belodtfi, beloqntd, beloobsv, belostat, beloidcl , belocontr)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8 , $9)
      RETURNING belocode;
    `;

    try {
      await dataLocation.query("BEGIN");

      const resultados = [];
      for (const {
        codeBen,
        produto,
        dataInicio,
        dataFim,
        quantidade,
        observacao,
        status,
        contrato
      } of bens) {
        const valoresBens = [
          codeBen,
          produto,
          dataInicio,
          dataFim,
          quantidade,
          observacao,
          status,
          clloid,
          contrato?.trim() || null
        ];

        const resultado = await dataLocation.query(query, valoresBens);
        resultados.push(resultado.rows[0]);
      }

      await dataLocation.query("COMMIT");
      return resultados;
    } catch (error) {
      await dataLocation.query("ROLLBACK");
      console.error("Erro ao inserir bens:", error);
      throw error;
    }
  },

async getNumberLocationCheck(){
   try {
       const resunt = await dataLocation.query(`SELECT cllonmlo FROM clieloc`)
       if(!resunt){return}
      return resunt.rows
   } catch (error) {
      console.error('Erro para verificar numero de locação esta repetido', error)
      throw error;
   }
},

  async getClientByCPF(cpf) {
    try {
      const query = "SELECT clienome FROM cadclie WHERE cliecpf = $1";
      const values = [cpf];

      const result = await dataLocation.query(query, values);
      return result.rows[0]; // Retorna apenas o primeiro resultado encontrado
    } catch (error) {
      console.error("Erro ao buscar cliente pelo CPF:", error.message);
      throw error;
    }
  },

  
  async buscarClientePorCPF(cpf) {
    const query = `SELECT cliecode, clienome , cliecpf FROM cadclie WHERE cliecpf = $1; `;
    const { rows } = await dataLocation.query(query, [cpf]);
    return rows[0];
  },
  async buscarClientePorCnpj(cnpj) {
    const query = `SELECT cliecode, clienome , cliecnpj FROM cadclie WHERE cliecnpj = $1; `;
    const { rows } = await dataLocation.query(query, [cnpj]);
    return rows[0];
  },

  async buscarCodigosBens() {
    const query = `SELECT fabecode , fabedesc FROM cadfabe `;
    try {
      const result = await dataLocation.query(query);
      return result.rows; // Retorna todos os códigos
    } catch (error) {
      console.erro("Erro ao buscar familia de bem", error);
    }
  },

  async buscarTodasLocacoes() {
    const query = `
    SELECT 
  c.clloid, 
  c.cllonmlo, 
  c.cllodtdv, 
  c.clloidcl,
  c.cllodtlo, 
  c.cllopgmt, 
  c.clloclno, 
  c.cllocpcn,
  c.cllorua,
  c.cllocep,
  c.cllobair,
  c.cllocida,
  c.cllorefe,
  c.clloqdlt,
  c.clloresi,
  c.cllodesc,
  
  b.belocode, 
  b.belocodb, 
  b.belobem, 
  b.belodtin, 
  b.belodtfi, 
  b.beloqntd, 
  b.beloobsv, 
  b.belostat
FROM clieloc c
INNER JOIN bensloc b ON c.clloid = b.beloidcl
ORDER BY c.clloid;`

   
   try {
    const { rows } = await dataLocation.query(query);

  const locacoes = rows.reduce((acc, row) => {
    let locacao = acc.find((l) => l.clloid === row.clloid);

    if (!locacao) {
      locacao = {
        clloid: row.clloid,
        cllonmlo: row.cllonmlo,
        clloidcl:row.clloidcl,
        cllodtdv: row.cllodtdv,
        cllodtlo: row.cllodtlo,
        cllopgmt: row.cllopgmt,
        clloclno: row.clloclno,
        cllocpcn: row.cllocpcn,
        cllorua: row.cllorua,
        cllocep: row.cllocep,
        cllobair: row.cllobair,
        cllocida: row.cllocida,
        cllorefe: row.cllorefe,
        clloqdlt: row.clloqdlt,
        clloresi: row.clloresi,
        cllodesc: row.cllodesc,
        bens: []
      };
      acc.push(locacao);
    }

    if (row.belocode) {
      locacao.bens.push({
        belocode: row.belocode,
        belocodb: row.belocodb,
        belobem: row.belobem,
        belodtin: row.belodtin,
        belodtfi: row.belodtfi,
        beloqntd: row.beloqntd,
        beloobsv: row.beloobsv,
        belostat: row.belostat,
      });
    }

    return acc;
  }, []);

  return locacoes;
} catch (error) {
  console.error("Erro ao buscar locações de bens:", error);
  throw error;
 }

},

  async buscarLocationPorId(id) {
    const query = `SELECT * FROM clieloc WHERE cllonmlo = $1`;
    try {
      const { rows } = await dataLocation.query(query, [id]);

      if (rows.length === 0) return null;

      return { ...rows[0] };
    } catch (error) {
      console.error("Erro ao buscar locação por ID:", error);
      throw error;
    }
  },

  verificarDependenciaLocacao: async (id) => {
    try {
      const checkQuery = "SELECT COUNT(*) FROM locafim WHERE lofiidlo= $1";
      const checkResult = await dataLocation.query(checkQuery, [id]);

      return parseInt(checkResult.rows[0].count) > 0;
    } catch (error) {
      console.error("Erro ao verificar dependências de bens:", error);
      throw error;
    }
  },

  async deleteLocation(numeroLocacao) {
    try {
      const result = await dataLocation.query(
        "SELECT clloid FROM clieloc WHERE cllonmlo = $1",
        [numeroLocacao]
      );

      if (result.rows.length === 0) {
        console.log("Nenhuma locação encontrada com o número fornecido.");
        return false;
      }

      const idLocacao = result.rows[0].clloid;

      await dataLocation.query("DELETE FROM bensloc WHERE beloidcl = $1", [
        idLocacao,
      ]);

      await dataLocation.query("DELETE FROM clieloc WHERE clloid = $1", [
        idLocacao,
      ]);

      return true;
    } catch (error) {
      console.error("Erro no model:", error.message);
      throw error;
    }
  },

  // atualizando status de locação
  async updateBemStatus(codeLocation, beloStat) {
    const query = `UPDATE bensloc SET belostat = $1 WHERE belocode = $2 RETURNING *;`;

    try {
      const { rowCount, rows } = await dataLocation.query(query, [
        beloStat,
        codeLocation,
      ]);

      if (rowCount === 0) {
        return null;
      }

      return rows[0];
    } catch (error) {
      console.error("Erro ao atualizar status locação:", error);
      throw error;
    }
  },

  async updateLocationAndBens(id, bens) {
    try {
      await dataLocation.query("BEGIN");

      // Query para atualização dos bens
      const updateQuery = `
      UPDATE bensloc
      SET belocodb = $1, belobem = $2, belodtin = $3, belodtfi = $4, beloqntd = $5, 
          beloobsv = $6
      WHERE belocode = $7
      RETURNING belocode;
    `;

      const resultadosBens = [];

      for (const bem of bens) {
        const {
          belocode, 
          codeBen,
          produto,
          dataInicio,
          dataFim,
          quantidade,
          observacao,
        } = bem;

        if (belocode) {
          const bemExistente = await dataLocation.query(
            `SELECT * FROM bensloc WHERE belocode = $1`,
            [belocode]
          );

          if (bemExistente.rows.length > 0) {
            // Atualizando bem existente
            const updateValues = [
              codeBen,
              produto,
              dataInicio,
              dataFim,
              quantidade,
              observacao,
              belocode,
            ];

            const result = await dataLocation.query(updateQuery, updateValues);
            if (result.rows.length) {
              resultadosBens.push(result.rows[0]);
              console.log("Bem atualizado:", result.rows[0]);
            } else {
              console.log("Nenhum bem foi atualizado.");
            }
          } else {
            console.log(
              `Bem com belocode ${belocode} não encontrado para atualização.`
            );
          }
        } else {
          console.log("Bem não possui belocode, não será atualizado.");
        }
      }

      await dataLocation.query("COMMIT");

      return {
        bensAtualizados: resultadosBens,
      };
    } catch (error) {
      // Rollback caso ocorra erro
      await dataLocation.query("ROLLBACK");
      console.error("Erro ao atualizar locação e bens:", error);
      throw error;
    }
  },

  // Método para inserção de novos bens na tabela bensloc
  async inserirNovosBens(bens) {
    try {
      const insertQuery = `
      INSERT INTO bensloc (
         bencodb, beloben, belodtin, belodtfi, beloqntd, beloobsv, belostat , beloidcl
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING belocode;
    `;

      const resultados = [];

      console.log("ID", bens);

      for (const bem of bens) {
        const {
          bencodb,
          beloben,
          belodtin,
          belodtfi,
          beloqntd,
          beloobsv,
          belostat,
          beloidcl,
        } = bem;

        // Inserção do novo bem
        const result = await dataLocation.query(insertQuery, [
          bencodb,
          beloben,
          belodtin,
          belodtfi,
          beloqntd,
          beloobsv,
          belostat,
          beloidcl,
        ]);

        if (result.rows.length > 0) {
          resultados.push(result.rows[0]);
        }
      }

      return resultados; // Retorna os bens inseridos
    } catch (error) {
      console.error("Erro ao inserir novos bens:", error);
      throw error;
    }
  },

async verificarLocacoesComBens(io) {

  // executa no minuto zero de cada hora
  cron.schedule("0 * * * *", async () => {
    console.log("⏰ Verificando locações pendentes há > 1h...");

    const query = `
      SELECT DISTINCT 
        b.beloidcl   AS clloid,
        c.cllonmlo   AS numerolocacao,
        TO_CHAR(MIN(c.cllohrat) , 'HH24:MI:SS') AS primeiroinicio
      FROM bensloc b
      JOIN clieloc c ON c.clloid = b.beloidcl
      WHERE b.belostat = 'Pendente'
        AND b.belodtin <= NOW() - INTERVAL '1 hour'
      GROUP BY b.beloidcl, c.cllonmlo
    `;

    try {
      const { rows } = await client.query(query);

      if (rows.length > 0) {
        for (const loc of rows) {
          // envia para todos os clientes conectados
            console.log("Dados recebidos do banco:", loc);
          io.emit("locacaoPendenteHaMaisDe1h", {
            clloid: loc.clloid,
            numero: loc.numerolocacao,
            desde: loc.primeiroinicio
          });
          console.log(`⚠️ Locação ${loc.numerolocacao} pendente há mais de 1h`);
        }
      } else {
        // console.log("✅ Nenhuma locação pendente há > 1h");
      }
    } catch (err) {
      console.error("Erro ao verificar locações pendentes:", err);
    }
  });
}

};
