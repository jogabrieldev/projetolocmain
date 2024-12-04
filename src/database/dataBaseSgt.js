
const database =  require('../config/config.js')
const Pool = require("pg").Pool

const pool = new Pool(database)
    
pool.connect().then(client=>{
    console.log('Conexão estabelecida')
    client.release()
}).catch(err => {
    console.log('Erro ao conectar ao banco:', err)
})

module.exports = pool

