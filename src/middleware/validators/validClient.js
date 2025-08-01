import { body } from 'express-validator';
import { clientRegister } from '../../model/modelsClient.js'; 
import { differenceInYears, isValid, parseISO } from 'date-fns';
import fetch from 'node-fetch';

export const validateClient = [
 
  body('clieName')
    .isLength({ min: 3, max: 100 })
    .withMessage('Nome deve ter entre 3 e 100 caracteres.'),

  
  body('clieMail')
    .isEmail().withMessage('E-mail inválido.')
    .isLength({ max: 150 }).withMessage('E-mail deve ter no máximo 150 caracteres.'),

  
  body('clieCep')
    .matches(/^\d{5}-?\d{3}$/)
    .withMessage('CEP inválido.')
    .bail() // para não executar o fetch se o formato já estiver errado
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

 
  body('clieCpf').optional().isLength({ max: 14 }).withMessage('CPF inválido.'),
  body('clieCnpj').optional().isLength({ max: 18 }).withMessage('CNPJ inválido.'),

  body('dtCad').custom(value => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || isNaN(new Date(value).getTime())) {
      throw new Error('Data de Cadastro inválida.');
    }
    const [y, m, d] = value.split('-').map(Number);
    const dataCadastro = new Date(y, m - 1, d);
    const hoje = new Date();
    const hoje0 = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    if (dataCadastro.getTime() !== hoje0.getTime()) {
      throw new Error('Data de Cadastro deve ser igual à data de hoje.');
    }
    return true;
  }),

 body('dtNasc').custom((value, { req }) => {
  // Verifica o formato e validade da data
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error('Data de Nascimento inválida.');
  }

  const dataNascimento = parseISO(value);
  if (!isValid(dataNascimento)) {
    throw new Error('Data de Nascimento inválida.');
  }

  const dataCadastro = req.body.dtCad
    ? parseISO(req.body.dtCad)
    : new Date(); // fallback para hoje

  if (!isValid(dataCadastro)) {
    throw new Error('Data de Cadastro inválida.');
  }

 
  if (dataNascimento >= new Date()) {
    throw new Error('Data de Nascimento não pode ser no futuro.');
  }

 
  if (dataNascimento > dataCadastro) {
    throw new Error('Data de Nascimento não pode ser posterior à Data de Cadastro.');
  }


  const idade = differenceInYears(dataCadastro, dataNascimento);
  if (idade < 18) {
    throw new Error('É necessário ter pelo menos 18 anos.');
  }

  return true;
}),

  body().custom((_, { req }) => {
    const tipoCliente = (req.body.clieTpCl || '').toLowerCase();
    const cpf = (req.body.clieCpf || '').replace(/\D/g, '');
    const cnpj = (req.body.clieCnpj || '').replace(/\D/g, '');

    if (tipoCliente === 'pessoa física' && cnpj) {
      throw new Error('Cliente Pessoa Física não pode ter CNPJ preenchido.');
    }

    if (tipoCliente === 'pessoa jurídica' && cpf) {
      throw new Error('Cliente Pessoa Jurídica não pode ter CPF preenchido.');
    }

    return true;
  }),


  // Validação de CPF/CNPJ duplicado
  body('clieCpf').custom(async (value, { req }) => {
    const cpfCnpj = (value || req.body.clieCnpj || "").replace(/\D/g, "");
    if (!cpfCnpj) return true;
    const validCpfSystem = await clientRegister.verifyCredenciClient();
    const resultConsult = validCpfSystem.map(item => (item.cliecpf || item.cliecnpj));
    const jaCadastrado = resultConsult.some(doc => (doc || "").replace(/\D/g, "") === cpfCnpj);
    if (jaCadastrado) {
      throw new Error('CPF ou CNPJ já cadastrado no sistema. Valide com o cliente.');
    }
    return true;
  }),

];
