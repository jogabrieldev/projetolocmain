import { body } from "express-validator";
import { crudRegisterDriver as validDriver } from "../../model/modelsDriver.js"; 
import { differenceInYears, isValid, parseISO } from 'date-fns';
import fetch from "node-fetch"; 

export const validateMotorista = [
 
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

 body('motoDtnc').custom((value) => {
  const dataNascimento = parseISO(value);
  if (!isValid(dataNascimento)) {
    throw new Error('Data de Nascimento inválida.');
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0); 

  if (dataNascimento >= hoje) {
    throw new Error('Data de Nascimento não pode ser no futuro.');
  }

  const idade = differenceInYears(hoje, dataNascimento);
  if (idade < 18) {
    throw new Error('É necessário ter pelo menos 18 anos.');
  }

  return true;
}),


 
  body("motoMail")
    .isEmail()
    .withMessage("E-mail inválido. Insira um e-mail no formato correto."),

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

  
  body("motoPasw")
    .isLength({ min: 6 })
    .withMessage("A senha é obrigatória e deve ter pelo menos 6 caracteres."),
];
