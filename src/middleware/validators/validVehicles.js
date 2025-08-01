import { body } from 'express-validator';
import { autoRegister } from '../../model/modelsVehicles.js';
import { parseISO, addDays, isAfter } from 'date-fns';



export const validateAutomovel = [


  body("caauplac")
  .notEmpty().withMessage('Obrigatorio passar a placa do veiculo')
  .custom(async(value)=>{
      const validPlac = await autoRegister.searchPlacaExist()
      const placExist = validPlac.map((item)=>item.caauplac)
      if(placExist.includes(value)){
         throw new Error("Placa ja e cadastrada verifique se a placa esta correta")
      }
  }),
 
  body('caaudtca')
    .custom((value) => {
      // Verifica formato yyyy-mm-dd
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error('Data de Cadastro inválida.');
      }

      // Converte para data e verifica se é uma data real
      const [y, m, d] = value.split('-').map(Number);
      const dataCadastro = new Date(y, m - 1, d);
      if (
        dataCadastro.getFullYear() !== y ||
        dataCadastro.getMonth() !== m - 1 ||
        dataCadastro.getDate() !== d
      ) {
        throw new Error('Data de Cadastro inválida.');
      }

      // Verifica se é igual a data de hoje
      const hoje = new Date();
      const hojeZerado = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate()
      );
      if (dataCadastro.getTime() !== hojeZerado.getTime()) {
        throw new Error('Data de cadastro deve ser a data de hoje.');
      }

      return true;
    }),
   
   body('caaukmat')
  .notEmpty().withMessage('Obrigatório informar o KM atual do veículo.')
  .isNumeric().withMessage('O KM atual deve ser um número.')
  .custom((value) => {
    const km = Number(value);
    
    if (km < 0) {
      throw new Error('O KM atual não pode ser negativo.');
    }
    
    if (km === -2000) {
      throw new Error('Valor -2000 não é permitido para o KM atual.');
    }

    return true;
  }),


    body('caauvenc')
    .notEmpty().withMessage('Obrigatorio passar a data de vencimento do veiculo')
    .custom((value) => {
    const dataInformada = parseISO(value); // Transforma string em objeto Date
    const dataMinima = addDays(new Date(), 10); // Data atual + 10 dias

    if (!isAfter(dataInformada, dataMinima)) {
      throw new Error('A data de vencimento deve ser pelo menos 10 dias no futuro');
    }

    return true;
  })
];
