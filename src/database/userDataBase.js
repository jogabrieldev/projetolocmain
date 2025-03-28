import {dbClient } from '../config/dbConfigClient.js'
import pgk from 'pg'
const {Pool} = pgk

const client = new Pool(dbClient )
client.connect().then((res)=>{
    console.log('conectou no db server03')
        res.release()
    }).catch((erro)=>{console.log('erro na conexao do cliente')})
    
export {client}