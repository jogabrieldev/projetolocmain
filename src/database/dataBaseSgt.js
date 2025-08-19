
import {dbConfigUser} from '../config/dbConfigUser.js';
import pkg from 'pg';
const  { Pool } =  pkg;

const poolSgt =  new Pool(dbConfigUser)
poolSgt.connect().then(client=>{
    console.log('Conexão estabelecida')
    client.release()
}).catch(err => {
    console.log('Erro ao conectar ao banco:', err)
});

export {poolSgt}

