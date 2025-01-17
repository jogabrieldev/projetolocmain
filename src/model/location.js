const database = require('../database/dataBaseSgt')
const dataLocation = require('../database/userDataBase')


const LocacaoModel = {
  async clientLoc({clloclit, cllodtlo, cllodtdv, cllohrlo, cllofmpg}) {


    const query = `
      INSERT INTO clieloc(clloclit, cllodtlo, cllodtdv, cllohrlo, cllofmpg )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING cllocode
    `;
    const values = [clloclit, cllodtlo, cllodtdv, cllohrlo, cllofmpg];
    const result= await dataLocation.query(query, values);
    return result.rows[0]
    
  },

  async inserirBens(bens) {
    const query = `
    INSERT INTO bensloc ( belofmbn, beloben, beloqntd , belodesc)
    VALUES ($1, $2, $3, $4) RETURNING belocode
  `;
   try{

    await dataLocation.query("BEGIN");

    const resultados = [];
    for (const { codeBen, produto, quantidade, descricao } of bens) {
      const resultado = await dataLocation.query(query, [codeBen, produto, quantidade, descricao]);
      resultados.push(resultado.rows[0]); // Coleta o código retornado
    }
    await dataLocation.query("COMMIT"); // Confirma transação
    return resultados; // Retorna os resultados das inserções

  }catch(error){
    await dataLocation.query("ROLLBACK"); // Desfaz em caso de erro
    throw error;
  }
      
},



  async buscarClientePorCPF(cpf) {
    console.log("Buscando cliente com CPF:", cpf); // Adicione este log
  const query = `SELECT cliecode FROM cadclie WHERE cliecpf = $1`;
  const { rows } = await dataLocation.query(query, [cpf]);
  console.log("Resultado da busca:", rows); // Adicione este log
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


}
module.exports = LocacaoModel;
