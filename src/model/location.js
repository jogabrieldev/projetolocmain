// const database = require("../database/dataBaseSgt");
import {client} from "../database/userDataBase.js";
const dataLocation = client

 export const LocacaoModel = {

  
  async clientLoc({  cllonmlo, clloidcl, cllodtdv, cllodtlo, cllopgmt, clloclno, cllocpf }) {
    try {
      console.log("Verificando cliente no banco com código:", clloidcl);
  
      const clienteQuery = `SELECT cliecode FROM cadclie WHERE clienome = $1 AND cliecpf = $2`;

     
  
      if (!cllonmlo || !cllodtdv || !cllodtlo || !cllopgmt || !clloidcl || !clloclno ||  !cllocpf) {
        console.error("Erro: Algum valor está indefinido!", { cllonmlo, cllodtdv, cllodtlo, cllopgmt, clloidcl,  cllocpf });
        return;
      }
  
      const insertQuery = `
      INSERT INTO clieloc(clloidcl, cllonmlo, cllodtdv, cllodtlo, cllopgmt, clloclno, cllocpf)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
      const values = [clloidcl, cllonmlo, cllodtdv, cllodtlo, cllopgmt, clloclno, cllocpf];
  
      const result = await dataLocation.query(insertQuery, values);
  
      console.log("Resultado da inserção:", result.rows);
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
      for (const { codeBen, produto, dataInicio, dataFim, quantidade, observacao , status } of bens) {
        const valoresBens = [codeBen, produto, dataInicio, dataFim, quantidade, observacao, status, clloid];
  
        console.log("Inserindo bens com valores:", valoresBens);
  
        const resultado = await dataLocation.query(query, valoresBens);
        resultados.push(resultado.rows[0]);
      }
  
      console.log("Resultado da inserção de bens:", resultados);
  
      await dataLocation.query("COMMIT");
      return resultados;
    } catch (error) {
      await dataLocation.query("ROLLBACK");
      console.error("Erro ao inserir bens:", error);
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

  async buscarLocationClient(){
    const queryClient = `SELECT * FROM clieloc`
     try {
       const {rows} = await dataLocation.query(queryClient)
       return rows
     } catch (error) {
       console.error('erro ao buscar cliente de locação:'  ,error)
     }
  },

  async buscarLocationGoods(){
    const queryGoods = `SELECT * FROM bensloc`
    try {
      const {rows} = await dataLocation.query(queryGoods)
      return rows
    } catch (error) {
       console.error('erro ao buscar bens de locação' , error)
    }
  },

  async deleteLocation(numeroLocacao) {
    try {
      console.log('Número da locação recebido:', numeroLocacao);
  
      // 1. Buscar o ID da locação correspondente ao número da locação
      const result = await dataLocation.query(
        'SELECT clloid FROM clieloc WHERE cllonmlo = $1',
        [numeroLocacao]  // Certifique-se de passar o parâmetro corretamente
      );
  
      if (result.rows.length === 0) {
        console.log('Nenhuma locação encontrada com o número fornecido.');
        return false;
      }
  
      console.log('Linhas:', result.rows);
  
      // Extraindo o ID da locação corretamente
      const idLocacao = result.rows[0].clloid;
      console.log('ID da locação encontrado:', idLocacao);
  
      // 2. Excluir os registros relacionados na tabela bensloc
      await dataLocation.query('DELETE FROM bensloc WHERE beloidcl = $1', [idLocacao]);
  
      // 3. Excluir o registro principal na tabela clienteLoc
      await dataLocation.query('DELETE FROM clieloc WHERE clloid = $1', [idLocacao]);
  
      console.log('Locação excluída com sucesso.');
      return true;
    } catch (error) {
      console.error('Erro no model:', error.message);
      throw error;
    }
  },

  async editLocation(){

    const query = `
    INSERT INTO bensloc (bencodb, beloben, belodtin, belodtfi, beloqntd, beloobsv, beloidcl)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING belocode;
  `;

   const insertQuery = `
   INSERT INTO clieloc(clloidcl, cllonmlo, cllodtdv, cllodtlo, cllopgmt, clloclno, cllocpf)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *;
`;

 }
   
}  
