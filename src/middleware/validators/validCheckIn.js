import { body } from 'express-validator';
import { crudRegisterDriver as validDriver } from '../../model/modelsDriver.js';
import { autoRegister as validVehicles } from '../../model/modelsVehicles.js';


 export const validateCheckIn = [

    body('checMoto')
    .notEmpty().withMessage("Motorista é obrigatório.")
    .bail()
    .custom(async(value)=>{
         const driver = await validDriver.getDriverByCode(value)
         if(!driver){
             throw new Error("Codigo do motorista invalido ou não encontrado")
         }
         return true
    }),

    body('checVeic')
    .notEmpty().withMessage("Veiculo é obrigatório.")
    .bail()
    .custom(async(value)=>{
        const vehicle = await validVehicles.getCodeVehicle(value)
        if(!vehicle || vehicle === null){
            throw new Error("O codigo do veiculo invalido ou não encontrado")
        }
        return true
    }),

    // body('checDtch')
    // .notEmpty().withMessage("A data é obrigatória.")
    // .bail()
    // .custom(value => {
      
    //   const datePart = value.split(' ')[0]; 

    //   if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    //     throw new Error('Data de cadastro inválida.');
    //   }

    //   const [y, m, d] = datePart.split('-').map(Number);
    //   const dataCadastro = new Date(y, m - 1, d);

    //   const hoje = new Date();
    //   const hoje0 = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

    //   if (dataCadastro.getTime() !== hoje0.getTime()) {
    //     throw new Error('Data de cadastro deve ser igual à data de hoje.');
    //   }

    //   return true;
    // }),

]

export const validateCheckInOpen = [
      body('idMoto')
      .notEmpty().withMessage('não foi passado qual e o motorista!')
]

