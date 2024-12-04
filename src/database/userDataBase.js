const userDb = require('../config/userData.js')
const Pool = require('pg').Pool

const client = new Pool(userDb)
client.connect().then((res)=>{
    console.log('conectou no db server03')
        res.release()
    }).catch((erro)=>{console.log('erro na conexao do cliente')})
    
module.exports = client