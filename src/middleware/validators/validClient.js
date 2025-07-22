import { body } from 'express-validator';
import { clientRegister } from '../../model/modelsClient.js'; 
import fetch from 'node-fetch';

export const validateClient = [
  // Nome entre 3 e 100 caracteres
  body('clieName')
    .isLength({ min: 3, max: 100 })
    .withMessage('Nome deve ter entre 3 e 100 caracteres.'),

  // Email válido e máximo de 150 caracteres
  body('clieMail')
    .isEmail().withMessage('E-mail inválido.')
    .isLength({ max: 150 }).withMessage('E-mail deve ter no máximo 150 caracteres.'),

  // CEP formato brasileiro
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

  // CPF ou CNPJ opcional, mas se vier deve ter tamanho correto
  body('clieCpf').optional().isLength({ max: 14 }).withMessage('CPF inválido.'),
  body('clieCnpj').optional().isLength({ max: 18 }).withMessage('CNPJ inválido.'),

  // Validação de dtCad
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

  // Validação de dtNasc
  body('dtNasc').custom((value, { req }) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || isNaN(new Date(value).getTime())) {
      throw new Error('Data de Nascimento inválida.');
    }
    const [yCad, mCad, dCad] = req.body.dtCad.split('-').map(Number);
    const [yNasc, mNasc, dNasc] = value.split('-').map(Number);
    const dataCadastro = new Date(yCad, mCad - 1, dCad);
    const dataNascimento = new Date(yNasc, mNasc - 1, dNasc);
    const hoje = new Date();
    const hoje0 = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

    if (dataNascimento.getTime() >= hoje0.getTime()) {
      throw new Error('Data de Nascimento não pode ser maior ou igual à data de hoje.');
    }
    if (dataNascimento.getTime() > dataCadastro.getTime()) {
      throw new Error('Data de Nascimento não pode ser posterior à Data de Cadastro.');
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
