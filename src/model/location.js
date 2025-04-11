// const database = require("../database/dataBaseSgt");
import { client } from "../database/userDataBase.js";
const dataLocation = client;

export const LocacaoModel = {

  async gerarNumeroLocacao() {
    let numero;
    let existe;

    do {
      numero = Math.floor(100000 + Math.random() * 900000); // Número de 6 dígitos

      const query = "SELECT COUNT(*) FROM clieloc WHERE cllonmlo = $1";
      const result = await dataLocation.query(query, [numero]);
      existe = parseInt(result.rows[0].count) > 0;
    } while (existe); // Se já existir, gera outro

    return numero;
  },
  async criarLocacao({
    cllonmlo,
    clloidcl,
    cllodtdv,
    cllodtlo,
    cllopgmt,
    clloclno,
    cllocpf,
  }) {
    try {
      if (!cllonmlo || !cllodtdv || !cllodtlo || !cllopgmt || !clloidcl || !clloclno || !cllocpf) {
        throw new Error("Erro: Algum valor está indefinido!");
      }

      const insertQuery = `
        INSERT INTO clieloc(clloidcl, cllonmlo, cllodtdv, cllodtlo, cllopgmt, clloclno, cllocpf)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;

      const values = [clloidcl, cllonmlo, cllodtdv, cllodtlo, cllopgmt, clloclno, cllocpf];
      const result = await dataLocation.query(insertQuery, values);

      return result.rows[0].clloid;
    } catch (error) {
      console.error("Erro ao criar locação:", error);
      throw error;
    }
  },

  async inserirBens(bens, clloid) {
    const query = `
      INSERT INTO bensloc (bencodb, beloben, belodtin, belodtfi, beloqntd, beloobsv, belostat, beloidcl)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING belocode;
    `;

    try {
      await dataLocation.query("BEGIN");

      const resultados = [];
      for (const { codeBen, produto, dataInicio, dataFim, quantidade, observacao, status } of bens) {
        const valoresBens = [codeBen, produto, dataInicio, dataFim, quantidade, observacao, status, clloid];

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
    const query = `SELECT cliecode, clienome FROM cadclie WHERE cliecpf = $1; `;
    const { rows } = await dataLocation.query(query, [cpf]);
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
        c.cllodtlo, 
        c.cllopgmt, 
        c.clloclno, 
        c.cllocpf,
        b.belocode, 
        b.bencodb, 
        b.beloben, 
        b.belodtin, 
        b.belodtfi, 
        b.beloqntd, 
        b.beloobsv, 
        b.belostat
      FROM clieloc c
      LEFT JOIN bensloc b ON c.clloid = b.beloidcl
      ORDER BY c.clloid;
    `;
  
    try {
      const { rows } = await dataLocation.query(query);
      
      // Agrupar os bens de cada locação em um array
      const locacoes = rows.reduce((acc, row) => {
        let locacao = acc.find(l => l.clloid === row.clloid);
        
        if (!locacao) {
          locacao = {
            clloid: row.clloid,
            cllonmlo: row.cllonmlo,
            cllodtdv: row.cllodtdv,
            cllodtlo: row.cllodtlo,
            cllopgmt: row.cllopgmt,
            clloclno: row.clloclno,
            cllocpf: row.cllocpf,
            bens: []
          };
          acc.push(locacao);
        }
  
        if (row.belocode) { 
          locacao.bens.push({
            belocode: row.belocode,
            bencodb: row.bencodb,
            beloben: row.beloben,
            belodtin: row.belodtin,
            belodtfi: row.belodtfi,
            beloqntd: row.beloqntd,
            beloobsv: row.beloobsv,
            belostat: row.belostat
          });
        }
  
        return acc;
      }, []);

      return locacoes;
      
    } catch (error) {
      console.error("Erro ao buscar locações e bens:", error);
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
  async updateBemStatus(bemId, beloStat) {
    const query = `UPDATE bensloc SET belostat = $1 WHERE bencodb = $2 RETURNING *;`;

    try {
      const { rowCount, rows } = await dataLocation.query(query, [
        beloStat,
        bemId,
      ]);

      if (rowCount === 0) {
        return null;
      }

      return rows[0];
    } catch (error) {
      console.error("Erro ao atualizar status do bem:", error);
      throw error;
    }
  },


async updateLocationAndBens(id, updateData, bens) {
  try {
    await dataLocation.query("BEGIN"); 

    const updateQuery = `
      UPDATE clieloc
      SET 
        cllonmlo = $1, cllodtdv = $2, cllodtlo = $3, cllopgmt = $4, 
        clloclno = $5, cllocpf = $6
      WHERE clloidcl = $7
      RETURNING *;
    `;
    
    const updateValues = [
      updateData.cllonmlo || null,
      updateData.cllodtdv || null,
      updateData.cllodtlo || null,
      updateData.cllopgmt || null,
      updateData.clloclno || null,
      updateData.cllocpf || null,
      id,
    ];

    const updatedLocation = await dataLocation.query(updateQuery, updateValues);
    if (!updatedLocation.rows.length) {
      throw new Error("Locação não encontrada para atualização.");
    }

    // 🔹 Inserir os novos bens vinculados à locação
    const insertBensQuery = `
      INSERT INTO bensloc (bencodb, beloben, belodtin, belodtfi, beloqntd, beloobsv, belostat, beloidcl)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING belocode;
    `;

    const resultadosBens = [];
    for (const { codeBen, produto, dataInicio, dataFim, quantidade, observacao, status } of bens) {
      const bensValues = [
        codeBen,
        produto,
        dataInicio,
        dataFim,
        quantidade,
        observacao,
        status,
        id,
      ];
      const resultado = await dataLocation.query(insertBensQuery, bensValues);
      resultadosBens.push(resultado.rows[0]);
    }

    await dataLocation.query("COMMIT"); // Confirma a transação

    return {
      locacaoAtualizada: updatedLocation.rows[0],
      bensAtualizados: resultadosBens,
    };
  } catch (error) {
    await dataLocation.query("ROLLBACK"); // Desfaz alterações em caso de erro
    console.error("Erro ao atualizar locação e bens:", error);
    throw error;
  }
},
}
