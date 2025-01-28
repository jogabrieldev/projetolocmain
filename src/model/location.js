const database = require("../database/dataBaseSgt");
const dataLocation = require("../database/userDataBase");

const LocacaoModel = {

  async clientLoc({ clloclit, cllodtlo, cllodtdv, cllohrlo, cllofmpg }) {

    try {
      const clienteQuery = `
        SELECT clienome FROM cadclie WHERE cliecode = $1;
      `;
      const clienteResult = await dataLocation.query(clienteQuery, [clloclit]);

      if (clienteResult.rows.length === 0) {
        throw new Error("Cliente não encontrado.");
      }

      const cllonome = clienteResult.rows[0].clienome;

      const insertQuery = `
        INSERT INTO clieloc(clloclit, cllodtlo, cllodtdv, cllohrlo, cllofmpg)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING clloid;
      `;
      const values = [
        clloclit,
        cllodtlo,
        cllodtdv,
        cllohrlo,
        cllofmpg,
      ];
      const result = await dataLocation.query(insertQuery, values);

      console.log( " Esse são os valores passados do meu client" ,result.rows)

      return result.rows[0].clloid;
    } catch (error) {
      console.error("Erro ao criar locação na parte do cliente:", error);
      throw error;
    }
  },

  async inserirBens(bens , clloid) {
    const query = `
      INSERT INTO bensloc (belofmbn, beloben, beloqntd, belodesc, clloid )
      VALUES ($1, $2, $3, $4 , $5) RETURNING beloid
    `;

    try {
      await dataLocation.query("BEGIN");


      const resultados = [];
      for (const { codeBen, produto, quantidade, descricao, } of bens) {
        const resultado = await dataLocation.query(query, [
          codeBen,
          produto,
          quantidade,
          descricao,
          clloid
        ]);
        resultados.push(resultado.rows[0])
      }


      await dataLocation.query("COMMIT"); 
      return resultados; 

    } catch (error) {
      await dataLocation.query("ROLLBACK"); 
      throw error;
    }
  },


 async getClientByCPF (cpf) {
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
    const query = `SELECT cliecode FROM cadclie WHERE cliecpf = $1`;
    const { rows } = await dataLocation.query(query, [cpf]);
    return rows[0];
  },

  async buscarCodigosBens() {
    const query = `SELECT fabecode FROM cadfabe `;
    try {
      const result = await dataLocation.query(query);
      return result.rows; // Retorna todos os códigos
    } catch (error) {
      console.erro("Erro ao buscar familia de bem", error);
    }
  },

  async buscarLocacoes() {
    try {
      // Consulta para buscar os dados com JOIN entre clieloc e bensloc
      const query = `
      SELECT 
    clieloc.clloid AS clienteid,
    clieloc.cllodtlo AS datalocacao,
    clieloc.cllodtdv AS datadevolucao,
    bensloc.beloid AS bemID,
    bensloc.beloqntd AS quantidade
FROM 
    clieloc
JOIN 
    bensloc ON clieloc.clloid = bensloc.beloid
ORDER BY 
    clieloc.clloid, bensloc.beloid;
    `;

      const result = await dataLocation.query(query);

      console.log('dados retornados do Join:' ,result.rows)

      // Verificar se existem registros retornados
      if (result.rows.length === 0) {
        console.log(
          "Nenhuma locação encontrada para inserir na tabela locfim."
        );
        return [];
      }

      await dataLocation.query("BEGIN");

      for (const row of result.rows) {
        const insertQuery = `
        INSERT INTO locfim (
          lofiben, loficlie, lofidtlo, lofidtdv, lofiqntd
        ) VALUES ($1, $2, $3, $4, $5)
      `;
        const values = [
          row.bemid,
          row.clienteid,
          row.datalocacao,
          row.datadevolucao,
          row.quantidade,
        ]

        console.log('valores indo para tabela' ,values)
        // Inserir o registro na tabela locfim
        await dataLocation.query(insertQuery, values);
      }


      // Confirmar a transação
      await dataLocation.query("COMMIT");

      console.log("Dados inseridos com sucesso na tabela locfim.");
      return result.rows; // Retornar os dados inseridos
    } catch (error) {
      // Em caso de erro, desfazer a transação
      await dataLocation.query("ROLLBACK");
      console.error("Erro ao inserir dados na tabela locfim:", error);
      throw error;
    }
  },

};
module.exports = LocacaoModel;
