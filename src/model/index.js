import express from 'express' 
import path from  'path'
const app = express()

class renderingMain  {

    start(){
       app.get('/' , (req ,res)=>{
        res.sendFile((path.join(__dirname,'view','index.html')))
    })}

    
}


export {renderingMain}