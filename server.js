import  express from 'express'
const app = express()

import {route}  from './src/routes/route.js'

import path from'path' 
import { fileURLToPath } from 'url'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname , 'view', )))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(route)


app.listen('3000' , ()=>{
    console.log('SERVER ROAD OK')
})