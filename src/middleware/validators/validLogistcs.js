import logistcsModel from "../../model/modelsLogistics.js";
import {body} from "express-validator"
import { crudRegisterDriver as authDriver } from "../../model/modelsDriver.js";
import { goodsRegister as authGoods} from "../../model/modelsGoods.js";
import { clientRegister as authClient } from "../../model/modelsClient.js";
import { crudRegisterFamilyGoods as authFamilyGoods } from "../../model/modelsFamilyGoods.js";

export const validateSubmitDateForLogistics = [

  body("payloadLogistcs")
    .notEmpty()
    .withMessage("Não foi passado nenhum dado."),

  body("payloadLogistcs.bemId")
    .notEmpty()
    .withMessage("Código do Bem é obrigatório.")
    .bail()
    .custom(async (bemId) => {
      const goods = await authGoods.getAllBemId();
      const codeValidGoods = goods.map(item => item.benscode);
      if (!codeValidGoods.includes(bemId)) {
        return Promise.reject("Código do Bem inválido.");
      }
      return true;
    }),

  body("payloadLogistcs.idClient")
    .notEmpty()
    .withMessage("Código do Cliente é obrigatório.")
    .bail()
    .custom(async (idClient) => {
      const clients = await authClient.getAllClientForId();
      const codeValidClient = clients.map(item => item.cliecode);
      if (!codeValidClient.includes(idClient)) {
        return Promise.reject("Código do Cliente inválido.");
      }
      return true;
    }),

    body("payloadLogistcs.familiaBem")
    .notEmpty()
    .withMessage("E obrigatorio passar o tipo de bem valido!.")
    .bail()
    .custom(async (idClient) => {
      const clients = await authFamilyGoods.getCodeIdFamilyBens();
      const codeValidFamilyGoods = clients.map(item => item.fabecode);
      if (!codeValidFamilyGoods.includes(idClient)) {
        return Promise.reject("Código do tipo de bem e invalido não existe no sistema!.");
      }
      return true;
    }),

  body("payloadLogistcs.driver")
    .notEmpty()
    .withMessage("Código do Motorista é obrigatório.")
    .bail()
    .custom(async (driver) => {
      const drivers = await authDriver.getAllDriverId();
      const codeValid = drivers.map(item => item.motocode);
      if (!codeValid.includes(driver)) {
        return Promise.reject("Código do Motorista inválido.");
      }
      return true;
    }),

  body("payloadLogistcs.devolution")
    .notEmpty()
    .withMessage("Data de devolução é obrigatória."),

  body("payloadLogistcs.locationId")
    .notEmpty()
    .withMessage("Código da Locação é obrigatório."),
];