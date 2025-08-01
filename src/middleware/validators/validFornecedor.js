import { body } from "express-validator";
import { crudRegisterForn as validForn } from '../../model/modelsFornecedor.js';
import fetch from "node-fetch"; // se estiver usando Node 18+ pode usar fetch global

export const validateForn = [
  // Nome do fornecedor
  body("fornName")
    .trim()
    .isLength({ min: 5 })
    .withMessage("O nome do fornecedor é obrigatório e deve conter pelo menos 5 letras."),

  // CNPJ (assincrono: verificar duplicado no banco)
  body("fornCnpj")
    .notEmpty().withMessage("CNPJ é obrigatório.")
    .bail()
    .custom(async (value) => {
      // aqui você pode também validar formato do CNPJ se quiser
      const validCnpjSystem = await validForn.buscarIdFornCnpj();
      const existentes = validCnpjSystem.map((item) => item.forncnpj);
      if (existentes.includes(value)) {
        throw new Error("CNPJ já cadastrado. Valide com seu fornecedor.");
      }
      return true;
    }),

  // Data de cadastro (formato e igual à data de hoje)
  body("fornDtcd").custom((value) => {
    // Verifica formato YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(value)) {
      throw new Error("Data de cadastro inválida.");
    }
    const [y, m, d] = value.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    if (
      date.getFullYear() !== y ||
      date.getMonth() !== m - 1 ||
      date.getDate() !== d
    ) {
      throw new Error("Data de cadastro inválida.");
    }
    // Comparar com hoje
    const hoje = new Date();
    const hoje0 = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const dtCd = new Date(y, m - 1, d);
    if (dtCd.getTime() !== hoje0.getTime()) {
      throw new Error("Data de cadastro deve ser a data de hoje.");
    }
    return true;
  }),

  // E-mail
  body("fornMail")
    .isEmail()
    .withMessage("E-mail inválido. Insira um e-mail no formato correto."),

  // CEP (regex e consulta via API)
  body("fornCep")
    .custom(async (value) => {
      if (!value || !/^\d{5}-?\d{3}$/.test(value)) {
        throw new Error("CEP inválido.");
      }
      // consulta no ViaCEP
      const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
      const cepData = await response.json();
      if (cepData.erro) {
        throw new Error("CEP não encontrado.");
      }
      return true;
    }),
];
