
import { validationResult } from "express-validator";

export const validate = (req , res, next)=>{
     
     const error = validationResult(req)

     if(error.isEmpty()){
         return next()
     }

     const  verifiqueError = []
     error.array().map((err)=> verifiqueError.push({[err.type]: err.msg}))

     return res.status(400).json({
        errors: verifiqueError
     })
}