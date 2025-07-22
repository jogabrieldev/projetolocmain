import { body } from "express-validator";
import { crudRegisterDriver as validDriver } from "../../model/modelsDriver.js"; // ajuste o caminho no seu projeto
import fetch from "node-fetch"; // se usar Node 18+ pode usar fetch global

export const validateMotorista = [
  // ✅ CPF deve ser único no sistema
  body("motoCpf")
    .notEmpty().withMessage("CPF é obrigatório.")
    .bail()
    .custom(async (value) => {
      const allCpfs = await validDriver.getAllDriverIdCpf();
      const cadastrados = allCpfs.map((item) => item.motocpf);
      if (cadastrados.includes(value)) {
        throw new Error("CPF já cadastrado no sistema, valide com o motorista.");
      }
      return true;
    }),

  // ✅ Datas (vencimento e nascimento)
  body("motoDtvc").custom((value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new Error("Data de Vencimento inválida.");
    }
    const [y, m, d] = value.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) {
      throw new Error("Data de Vencimento inválida.");
    }
    const hoje = new Date();
    const hoje0 = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    if (dt.getTime() <= hoje0.getTime()) {
      throw new Error("A data de vencimento da CNH deve ser maior que a data de hoje.");
    }
    return true;
  }),

  body("motoDtnc").custom((value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new Error("Data de Nascimento inválida.");
    }
    const [y, m, d] = value.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) {
      throw new Error("Data de Nascimento inválida.");
    }
    const hoje = new Date();
    const hoje0 = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    if (dt.getTime() >= hoje0.getTime()) {
      throw new Error("Data de nascimento não pode ser maior ou igual à data de hoje.");
    }
    return true;
  }),

  // ✅ E-mail válido
  body("motoMail")
    .isEmail()
    .withMessage("E-mail inválido. Insira um e-mail no formato correto."),

  // ✅ CEP (assíncrono via ViaCEP)
  body("motoCep")
    .custom(async (value) => {
      if (!value || !/^\d{5}-?\d{3}$/.test(value)) {
        throw new Error("CEP inválido.");
      }
      const cepLimpo = value.replace(/\D/g, "");
      const viaCepRes = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      if (!viaCepRes.ok) {
        throw new Error("Erro ao buscar o CEP.");
      }
      const cepData = await viaCepRes.json();
      if (cepData.erro) {
        throw new Error("CEP inválido.");
      }
      return true;
    }),

  // ✅ Senha obrigatória com no mínimo 6 caracteres
  body("motoPasw")
    .isLength({ min: 6 })
    .withMessage("A senha é obrigatória e deve ter pelo menos 6 caracteres."),
];
