
import {dbConfigUser} from '../config/dbConfigUser.js';
import pkg from 'pg';
const  { Pool } =  pkg;

const pool =  new Pool(dbConfigUser)
pool.connect().then(client=>{
    console.log('Conexão estabelecida')
    client.release()
}).catch(err => {
    console.log('Erro ao conectar ao banco:', err)
});

export {pool}

