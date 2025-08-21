import { body } from "express-validator";
import { parseISO, isValid, differenceInCalendarDays } from "date-fns";
import { LocacaoModel } from "../../model/modelsLocationGoods.js";
import { moduleResiduo } from "../../model/modelsResiduo.js";
import { movementDestination } from "../../model/modelsDestination.js";

const feriados = [
  "01-01", "04-18", "04-21", "05-01", "09-07",
  "10-12", "11-02", "11-15", "12-25"
];

const formatDiaMes = (data) => {
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  return `${mes}-${dia}`;
};

export const validateLocationGoods = [

  body("userClientValidade")
    .custom(async (value, { req }) => {
      if (!Array.isArray(value) || value.length < 2) {
        return Promise.reject("Formato de CPF ou CNPJ inválido ou cliente não encontrado.");
      }

      const ClientDate = value[1].replace(/\D/g, "");
      let cliente = null;

      if (ClientDate.length === 11) {
        cliente = await LocacaoModel.buscarClientePorCPF(ClientDate);
      } else if (ClientDate.length === 14) {
        cliente = await LocacaoModel.buscarClientePorCnpj(ClientDate);
      } else {
        return Promise.reject("Formato de CPF ou CNPJ inválido ou cliente não encontrado.");
      }

      if (!cliente) {
        return Promise.reject("Formato de CPF ou CNPJ inválido ou cliente não encontrado.");
      }

      req.clienteValidado = cliente;
      return true;
    })
    .withMessage("Formato de CPF ou CNPJ inválido ou cliente não encontrado."),

  body("numericLocation")
    .notEmpty().withMessage("Número de locação não foi gerado.")
    .custom(async (value) => {
      const idNumericLocation = await LocacaoModel.getNumberLocationCheck();
      const validNumbers = idNumericLocation.map(item => item.cllonmlo);
      const numericLocationNormalized = String(value).trim();

      if (validNumbers.includes(numericLocationNormalized)) {
        return Promise.reject("O número de locação gerado já existe! Acione o suporte.");
      }

      return true;
    })
    .withMessage("O número de locação gerado já existe! Acione o suporte."),

  // body("descarte")
  //   .notEmpty().withMessage("Local de descarte é obrigatório.")
  //   .custom(async (value) => {
  //     const desc = await movementDestination.getCodeDestination();
  //     const valid = desc.map(item => item.dereid);

  //     if (!valid.includes(value)) {
  //       return Promise.reject("Local de descarte não existe no banco de dados.");
  //     }

  //     return true;
  //   })
  //   .withMessage("Local de descarte não existe no banco de dados."),

  body("resi")
    .notEmpty().withMessage("Resíduo é obrigatório.")
    .custom(async (value) => {
      const resiList = await moduleResiduo.getCodeResiduo();
      const valid = resiList.map(item => item.resicode);

      if (!valid.includes(value)) {
        return Promise.reject("Resíduo não existe no banco de dados.");
      }

      return true;
    })
    .withMessage("Local de descarte não existe no banco de dados."),

  body("dataLoc")
    .notEmpty().withMessage("Data de locação é obrigatória.")
    .custom(value => {
      const data = parseISO(value);
      if (!isValid(data)) throw new Error("Data de locação inválida.");
      return true;
    }),

  body("dataDevo")
    .notEmpty().withMessage("Data de devolução é obrigatória.")
    .custom((value, { req }) => {
      const dataDevo = parseISO(value);
      const dataLoc = parseISO(req.body.dataLoc);
      if (!isValid(dataDevo) || !isValid(dataLoc)) {
        throw new Error("Formato de data inválido.");
      }

      const diff = differenceInCalendarDays(dataDevo, dataLoc);
      if (diff <= 0) throw new Error("A data de devolução deve ser posterior à locação.");

      const diaMes = formatDiaMes(dataDevo);
      if (feriados.includes(diaMes)) {
        throw new Error(`A data de devolução (${value}) cai em um feriado. Escolha outra data.`);
      }

      return true;
    }),

  body("bens").isArray({ min: 1 }).withMessage("Nenhum bem foi informado."),

  body("bens").custom((bens, { req }) => {
    const codigoSet = new Set();

    for (let i = 0; i < bens.length; i++) {
      const bem = bens[i];

      if (!bem.codeBen) {
        throw new Error(`Grupo ${i + 1}: Código do bem é obrigatório.`);
      }

      if (codigoSet.has(bem.codeBen)) {
        throw new Error(`Grupo ${i + 1}: Código duplicado (${bem.codeBen}).`);
      }

      codigoSet.add(bem.codeBen);

      if (!bem.dataFim) {
        throw new Error(`Grupo ${i + 1}: Data FIM do bem é obrigatória.`);
      }

      const dataFim = parseISO(bem.dataFim);
      const dataDevo = parseISO(req.body.dataDevo);

      if (!isValid(dataFim)) {
        throw new Error(`Grupo ${i + 1}: Data FIM inválida.`);
      }

      const normalize = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
      if (normalize(dataFim).getTime() !== normalize(dataDevo).getTime()) {
        throw new Error(`Grupo ${i + 1}: A data FIM (${bem.dataFim}) deve ser igual à data de devolução (${req.body.dataDevo}).`);
      }
    }

    return true;
  })
];
