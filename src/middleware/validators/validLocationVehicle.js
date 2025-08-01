import { body } from 'express-validator';
import { parseISO, isValid, differenceInCalendarDays } from 'date-fns';
import {LocacaoModel} from '../../model/modelsLocationGoods.js'

const feriados = [
  "01-01", "04-18", "04-21", "05-01", "09-07",
  "10-12", "11-02", "11-15", "12-25"
];

const formatDiaMes = (data) => {
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  return `${mes}-${dia}`;
};

export const validateLocationVehicle = [

  body('client.localization').custom((value) => {
    if (!value || typeof value !== 'object') throw new Error('Endereço da locação é obrigatório.');
    return true;
  }),


  body('client.client').custom(async (value, { req }) => {
  if (!Array.isArray(value) || value.length < 2) {
    throw new Error('CPF ou CNPJ do cliente é obrigatório.');
  }

  const ClientDate = value[1].replace(/\D/g, '');

  let cliente = null;

  if (ClientDate.length === 11) {
    cliente = await LocacaoModel.buscarClientePorCPF(ClientDate);
  } else if (ClientDate.length === 14) {
    cliente = await LocacaoModel.buscarClientePorCnpj(ClientDate);
  } else {
    throw new Error('Formato de CPF ou CNPJ inválido.');
  }

  if (!cliente) {
    throw new Error('Cliente não encontrado no banco de dados.');
  }

  // salvar cliente na request para reutilizar no controller
  req.clienteValidado = cliente;

  return true;
}),


  body('client.cllodtlo')
    .notEmpty().withMessage('Data de locação é obrigatória.')
    .custom((value) => {
      const data = parseISO(value);
      if (!isValid(data)) throw new Error('Data de locação inválida.');
      return true;
    }),

  body('client.cllodtdv')
    .notEmpty().withMessage('Data de devolução é obrigatória.')
    .custom((value, { req }) => {
      const dataDevo = parseISO(value);
      const dataLoc = parseISO(req.body.client.cllodtlo);

      if (!isValid(dataDevo)) throw new Error('Data de devolução inválida.');
      if (!isValid(dataLoc)) throw new Error('Data de locação inválida.');
      
      const diff = differenceInCalendarDays(dataDevo, dataLoc);
      if (diff <= 0) throw new Error('Data de devolução deve ser posterior à locação.');

      const feriado = formatDiaMes(dataDevo);
      if (feriados.includes(feriado)) {
        throw new Error(`A data de devolução (${value}) cai em um feriado. Escolha outra.`);
      }

      return true;
    }),

  body('veiculos').isArray({ min: 1 }).withMessage('Pelo menos um veículo deve ser informado.'),

  body('veiculos').custom((veiculos) => {
    const camposInvalidos = veiculos.some(v => {
      return (
        !v.code || typeof v.code !== 'string' || v.code.trim() === '' ||
        !v.carga || typeof v.carga !== 'string' || v.carga.trim() === '' ||
        isNaN(v.quantidade) || Number(v.quantidade) <= 0
      );
    });
    if (camposInvalidos) {
      throw new Error('Todos os veículos devem ter código, carga e quantidade válida.');
    }
    return true;
  }),

];
