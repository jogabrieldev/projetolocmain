// services/logisticsService.js
import LogistcsModel from "../model/modelsLogistics.js";
import { crudRegisterDriver as authDriver } from "../model/modelsDriver.js";
import { goodsRegister as authGoods } from "../model/modelsGoods.js";
import { LocacaoModel as updateStatusLocation } from "../model/modelsLocationGoods.js";
import { pool } from "../database/userDataBase.js";

class LogisticsService {
  async handleSubmit(payload) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN"); // inicia transação

      // 1️⃣ Inserir locação
      const result = await LogistcsModel.submitDate(payload, payload.localization);
      if (!result) throw new Error("Erro ao criar locação");

    // 2️⃣ Atualizar status do motorista
    const driverUpdated = await authDriver.updateStatusMoto(result.lofiidmt, "Entrega destinada");
    if (!driverUpdated) throw new Error("Falha ao atualizar status do motorista");

    // 3️⃣ Atualizar status do bem
    const goodsUpdated = await authGoods.updateStatus(result.lofiidbe, "Locado");
    if (!goodsUpdated) throw new Error("Falha ao atualizar status do bem");

    // 4️⃣ Atualizar status da locação
    const locationUpdated = await updateStatusLocation.updateBemStatus(result.loficolo, "Em Locação");
    if (!locationUpdated) throw new Error("Falha ao atualizar status da locação");
      await client.query("COMMIT"); // confirma todas alterações
      return result;
    } catch (error) {
      await client.query("ROLLBACK"); // desfaz tudo se houver erro
      console.error("Erro no handleSubmit:", error);
      throw error;
    } finally {
      client.release();
    }
  }
}

export default new LogisticsService();

