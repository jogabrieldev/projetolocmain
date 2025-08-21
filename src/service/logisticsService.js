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
      await client.query("BEGIN"); 

      const result = await LogistcsModel.submitDate(payload, payload.localization);
      if (!result) throw new Error("Erro ao criar locação");

    const driverUpdated = await authDriver.updateStatusMoto( client ,result.lofiidmt, "Entrega destinada");
    if (!driverUpdated) throw new Error("Falha ao atualizar status do motorista");

    const goodsUpdated = await authGoods.updateStatus(client ,result.lofiidbe, "Locado");
    if (!goodsUpdated) throw new Error("Falha ao atualizar status do bem");

    const locationUpdated = await updateStatusLocation.updateBemStatus(client , result.loficolo, "Em Locação");
    if (!locationUpdated) throw new Error("Falha ao atualizar status da locação");

      await client.query("COMMIT"); 
      return result;

    } catch (error) {
      
      await client.query("ROLLBACK"); 
      console.error("Erro no handleSubmit:", error);
      throw error;

    } finally {
      client.release();
    }
  }
}

export default new LogisticsService();

