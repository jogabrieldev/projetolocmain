const express = require('express')
const path = require('path')
const app = express()

class models  {

    start(){
       app.get('/' , (req ,res)=>{
        res.sendFile((path.join(__dirname,'view','index.html')))
    })}

    
}


module.exports = new models()