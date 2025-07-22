import { body } from 'express-validator';

export const validateAutomovel = [
  // ✅ Validação da data de cadastro do automóvel
  body('caaudtca')
    .custom((value) => {
      // Verifica formato yyyy-mm-dd
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error('Data de Cadastro inválida.');
      }

      // Converte para data e verifica se é uma data real
      const [y, m, d] = value.split('-').map(Number);
      const dataCadastro = new Date(y, m - 1, d);
      if (
        dataCadastro.getFullYear() !== y ||
        dataCadastro.getMonth() !== m - 1 ||
        dataCadastro.getDate() !== d
      ) {
        throw new Error('Data de Cadastro inválida.');
      }

      // Verifica se é igual a data de hoje
      const hoje = new Date();
      const hojeZerado = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate()
      );
      if (dataCadastro.getTime() !== hojeZerado.getTime()) {
        throw new Error('Data de cadastro deve ser a data de hoje.');
      }

      return true;
    }),
];
