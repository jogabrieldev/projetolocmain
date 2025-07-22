import { body } from "express-validator";
import { crudRegisterTypeProd as validTypeProd } from "../../model/modelsTypeProd.js"; // ajuste o caminho conforme seu projeto

export const validateProduto = [
  // ✅ Data de cadastro: formato e deve ser a data de hoje
  body("prodData").custom((value) => {
    if (!value) {
      throw new Error("Data de cadastro inválida.");
    }
    const parts = value.split("-");
    if (parts.length !== 3) {
      throw new Error("Data de cadastro inválida.");
    }
    const [y, m, d] = parts.map(Number);
    const dtCd = new Date(y, m - 1, d);
    if (
      dtCd.getFullYear() !== y ||
      dtCd.getMonth() !== m - 1 ||
      dtCd.getDate() !== d
    ) {
      throw new Error("Data de cadastro inválida.");
    }
    const hoje = new Date();
    const hoje0 = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    if (dtCd.getTime() !== hoje0.getTime()) {
      throw new Error("Data de cadastro deve ser a data de hoje.");
    }
    return true;
  }),

  // ✅ Preços: líquido e bruto, e regra de comparação
  body("prodPeli").custom((value, { req }) => {
    const valorLiquido = parseFloat(value);
    const valorBruto = parseFloat(req.body.prodPebr);

    if (isNaN(valorLiquido) || isNaN(valorBruto)) {
      throw new Error("Valores de preço inválidos.");
    }

    if (valorLiquido > valorBruto) {
      throw new Error("O preço líquido não pode ser maior que o preço bruto.");
    }

    return true;
  }),

  // ✅ Tipo de produto: checagem assíncrona no banco
  body("prodTipo").custom(async (value) => {
    if (!value) {
      throw new Error("Código do tipo de produto é obrigatório.");
    }
    const codeTypePro = await validTypeProd.getCodeIdtypeP();
    const codeValid = codeTypePro.map((item) => item.tiprcode);

    if (!codeValid.includes(value)) {
      throw new Error("Código do tipo de produto é inválido.");
    }
    return true;
  }),
];
