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

    body("caauchss")
    .notEmpty().withMessage("Obrigatório informar o chassi.")
    .custom((value) => {
      value = value.toUpperCase().trim();
      if (value.length !== 17) throw new Error("Chassi deve ter 17 caracteres.");
      if (/[IOQ]/.test(value)) throw new Error("Chassi não pode conter I, O ou Q.");
      if (!/^[A-Z0-9]+$/.test(value)) throw new Error("Chassi deve conter apenas letras e números.");
      return true;
    }),

  // RENAVAM
  body("caaurena")
    .notEmpty().withMessage("Obrigatório informar o RENAVAM.")
    .custom((value) => {
      value = value.replace(/\D/g, '');
      if (value.length !== 11) throw new Error("RENAVAM deve ter 11 dígitos.");
      if (/^(\d)\1+$/.test(value)) throw new Error("RENAVAM inválido.");

      let renavamSemDV = value.slice(0, -1);
      let soma = 0;
      let multiplicador = 2;

      for (let i = renavamSemDV.length - 1; i >= 0; i--) {
        soma += parseInt(renavamSemDV[i]) * multiplicador;
        multiplicador++;
        if (multiplicador > 9) multiplicador = 2;
      }

      let resto = soma % 11;
      let dvCalculado = (resto === 0 || resto === 1) ? 0 : (11 - resto);
      if (dvCalculado !== parseInt(value.slice(-1))) {
        throw new Error("RENAVAM inválido.");
      }

      return true;
    }),

];
