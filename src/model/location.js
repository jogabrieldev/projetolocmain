// const database = require("../database/dataBaseSgt");
import { client } from "../database/userDataBase.js";
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
  async updateBemStatus(codeLocation, beloStat) {
    // Alterar a query para usar belocode como chave primária
    const query = `UPDATE bensloc SET belostat = $1 WHERE belocode = $2 RETURNING *;`;
  
    try {
      const { rowCount, rows } = await dataLocation.query(query, [
        beloStat, // Novo status que será atualizado
        codeLocation, // Identificador da locação (belocode)
      ]);
  
      if (rowCount === 0) {
        return null; // Retorna null caso nenhum registro seja afetado
      }
  
      return rows[0]; // Retorna o registro atualizado
    } catch (error) {
      console.error("Erro ao atualizar status locação:", error);
      throw error; // Lança o erro para tratamento externo
    }
  },

async updateLocationAndBens(id, bens) {
  try {
    await dataLocation.query("BEGIN");

    // Query para atualização dos bens
    const updateQuery = `
      UPDATE bensloc
      SET bencodb = $1, beloben = $2, belodtin = $3, belodtfi = $4, beloqntd = $5, 
          beloobsv = $6, belostat = $7
      WHERE belocode = $8 
      RETURNING belocode;
    `;

    const resultadosBens = [];

    // Atualizando os bens existentes
    for (const bem of bens) {
      const {
        belocode,     // Se existir, é um bem para UPDATE
        codeBen,
        produto,
        dataInicio,
        dataFim,
        quantidade,
        observacao,
        status
      } = bem;

      if (belocode) {
        // Verificando se o bem já existe no banco de dados
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
            status,
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
          // Bem não encontrado, ignorando o bem
          console.log(`Bem com belocode ${belocode} não encontrado para atualização.`);
        }
      } else {
        // Se não houver belocode, ignora o bem (não faz nada)
        console.log("Bem não possui belocode, não será atualizado.");
      }
    }

    // Comitando as mudanças
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

    console.log('ID', bens)

    for (const bem of bens) {
      const { bencodb, beloben, belodtin, belodtfi, beloqntd, beloobsv, belostat, beloidcl } = bem;

      // Inserção do novo bem
      const result = await dataLocation.query(insertQuery, [
        bencodb,
        beloben,
        belodtin,
        belodtfi,
        beloqntd,
        beloobsv,
        belostat,
        beloidcl
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
}

}
