import { body } from 'express-validator';
import { goodsRegister as validGoods } from '../../model/modelsGoods.js';
import { crudRegisterForn as validForn } from '../../model/modelsFornecedor.js';

export const validateBens = [
  // dtCompra
  body('dtCompra').custom((value) => {
    const date = new Date(value);
    if (!value || isNaN(date.getTime())) {
      throw new Error('Data de compra inválida.');
    }
    const hoje = new Date();
    const hojeFormatada = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const dtCompraFormatada = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (dtCompraFormatada > hojeFormatada) {
      throw new Error('A data da compra deve ser menor ou igual à data atual.');
    }
    return true;
  }),

  // dtStatus
body('dtStatus').custom((value) => {
    const hoje = new Date().toISOString().split('T')[0]; // "2025-07-31"
    const dataRecebida = new Date(value).toISOString().split('T')[0];

    if (dataRecebida !== hoje) {
      throw new Error('A data de status deve ser igual à data atual.');
    }

    return true;
  }),

  // bensAnmo
  body('bensAnmo')
    .optional()
    .custom((value, { req }) => {
      const dataModelo = new Date(value);
      if (isNaN(dataModelo.getTime())) {
        throw new Error('Data do modelo inválida.');
      }
      const dtCompra = new Date(req.body.dtCompra);
      if (dataModelo > dtCompra) {
        throw new Error('A data do modelo não pode ser maior que a data da compra.');
      }
      return true;
    }),

  // cofa assíncrono
  body('cofa').custom(async (value) => {
    if (!value) {
      throw new Error('Código da família de bens é obrigatório.');
    }
    const codigosFamilia = await validGoods.buscarIdFamiliaBens();
    const codigosValidos = codigosFamilia.map(item => item.fabecode);
    if (!codigosValidos.includes(value)) {
      throw new Error('Código da família de bens inválido.');
    }
    return true;
  }),

  // cofo assíncrono
  body('cofo').custom(async (value) => {
    if (!value) {
      throw new Error('Código do fornecedor de bens é obrigatório.');
    }
    const codigosFornecedor = await validForn.buscarIdForn();
    const codeValid = codigosFornecedor.map(item => item.forncode);
    if (!codeValid.includes(value)) {
      throw new Error('Código do fornecedor de bens inválido.');
    }
    return true;
  }),

];

  
