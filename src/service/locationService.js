import {pool as dataLocation} from '../database/userDataBase.js'

// Momento que e perciso fazer uma transação no banco passa por esse serviço

// Momento de criar a locaçaõ 
export const serviceLocation =  {
    async criarLocacaoComBens(locacao, bens) {
  const client = await dataLocation.connect();

  try {
    await client.query("BEGIN");

    // Inserir locação
    const insertLocacao = `
      INSERT INTO clieloc (
        cllonmlo, clloidcl, cllodtdv, cllodtlo, cllopgmt, 
        cllorua, cllocep, clloclno, cllobair, cllocida, 
        cllorefe, clloqdlt, clloresi, cllocpcn, cllodesc
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING clloid
    `;
    const resultLocacao = await client.query(insertLocacao, [
      locacao.cllonmlo, locacao.clloidcl, locacao.cllodtdv, locacao.cllodtlo,
      locacao.cllopgmt, locacao.cllorua, locacao.cllocep, locacao.clloclno,
      locacao.cllobair, locacao.cllocida, locacao.cllorefe, locacao.clloqdlt,
      locacao.clloresi, locacao.cllocpcn, locacao.cllodesc
    ]);
    const clloid = resultLocacao.rows[0].clloid;

    // Inserir bens
    const insertBens = `
      INSERT INTO bensloc (
        belocodb, belobem, belodtin, belodtfi, beloqntd, 
        beloobsv, belostat, beloidcl
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING belocode
    `;
    const bensResult = [];
    for (const ben of bens) {
      const valores = [
        ben.codeBen, ben.produto, ben.dataInicio, ben.dataFim,
        ben.quantidade, ben.observacao, ben.status, clloid
      ];
      const resultBen = await client.query(insertBens, valores);
      bensResult.push(resultBen.rows[0]);
    }

    await client.query("COMMIT");

    return { clloid, bens: bensResult };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
},
}

