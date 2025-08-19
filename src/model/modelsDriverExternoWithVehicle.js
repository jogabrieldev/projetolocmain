import { pool as linkDriver } from "../database/userDataBase.js";

export const processDriverExternoWithVehicles = {
     
 async registerDriverWithVehicle(codeMoto , codeVeic){
        try {
              const query = `INSERT INTO servexte(seexmoto , seexveic)VALUES($1 , $2) RETURNING *`
              const values = [codeMoto , codeVeic]
              const result = await linkDriver.query(query , values)

              return result.rows[0]

        } catch (error) {
            console.error('Erro para vincular o motorista ao veiculo', error)
            throw error
        }
    },

 async getDriverWithVehicle(){
    try {
        const query = `SELECT * FROM servexte`
        const result = await linkDriver.query(query)
        return result.rows
    } catch (error) {
        console.error('Erro para buscar os motoristas externos com seus veiculos')
        throw error
    }
 },

 async getVehicleTheDriver(id){
     try {
        const query = `SELECT * FROM servexte WHERE seexmoto = $1 `
        const values = [id]
        const result = await linkDriver.query(query , values)

        return result.rows[0]
     } catch (error) {
        console.error('O id passado não foi vinculado a nenhum veiculo')
        throw error
     }
 }

}