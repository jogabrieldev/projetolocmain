const express = require('express')
const app = express()
const route = require('./src/routes/route.js')
const path = require('path')
const bodyParser = require('body-parser')
require('dotenv').config()



app.use(express.static(path.join(__dirname , 'view', )))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(route)


app.listen('3000' , ()=>{
    console.log('SERVER ROAD OK')
})