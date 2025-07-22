import { body } from 'express-validator';
import fetch from 'node-fetch'; // se usar Node 18+ pode remover e usar o fetch global

export const validateDestino = [
  // ✅ CEP do destino com validação assíncrona ViaCEP
  body('cepDest')
    .matches(/^\d{5}-?\d{3}$/)
    .withMessage('CEP inválido.')
    .bail() // se o formato já estiver errado, nem consulta a API
    .custom(async (value) => {
      const cepLimpo = value.replace(/\D/g, '');
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      if (!response.ok) {
        throw new Error('Erro ao consultar o CEP.');
      }
      const cepData = await response.json();
      if (cepData.erro) {
        throw new Error('CEP não encontrado.');
      }
      return true;
    }),
];
