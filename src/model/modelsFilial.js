import { client as infoFili } from "../database/userDataBase.js";

 export const dateFilial ={
     
 async registerFilial(id , body){
    try {

        const {
             nomeFili,
             cnpjFili,
             cepFili,
             ruaFili,
             cidaFili,
             bairFili
        } = body

        const query = `INSERT INTO clifili(filiclid , filinome , filicnpj , filicep , filirua , filicida , filibair)VALUES($1 ,$2 , $3 , $4 , $5 , $6 , $7 ) RETURNING *  `;

        const values = [
            id ,
            nomeFili,
            cnpjFili,
            cepFili,
            ruaFili,
            cidaFili,
            bairFili
        ]

        const resunt = await infoFili.query(query , values)
        return resunt.rows
        
    } catch (error) {
        console.log('ERRO AO INSERIR FILIAL' , error)
        throw new error
    };
  }
};