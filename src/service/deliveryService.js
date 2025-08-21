import { pool } from "../database/userDataBase.js";
import { mecanismDelivey } from "../model/modelsDelivery.js";
import { goodsRegister } from "../model/modelsGoods.js";

export const deliveryService = {
  async acceptDeliveryAndUpdateGoods(deliveryId, goodsId, statusDelivery, statusGoods) {

     if (statusDelivery !== "Entrega aceita") {
      throw new Error("Status inválido! Só é permitido 'Entrega aceita'");
    }
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const updatedDelivery = await mecanismDelivey.updateStatusDelivery(client, deliveryId, statusDelivery);

      const updatedGoods = await goodsRegister.updateStatus(client, goodsId, statusGoods);

      await client.query("COMMIT");

      return { updatedDelivery, updatedGoods };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async finishDeliveryTransaction(payload, socketio) {
    const client = await pool.connect();

    try {
      if (!payload) {
        throw { status: 400, message: "Entrega obrigatória" };
      }

      if (!payload.enfiStat || payload.enfiStat === "") {
        payload.enfiStat = "Finalizado";
      }

      await client.query("BEGIN");

      const result = await mecanismDelivey.finishDelivery(payload, client);
      if (!result) {
        throw { status: 400, message: "Erro ao finalizar entrega" };
      }

      const updateStatus = await mecanismDelivey.updateStatusDelivery(client, result.enfiloca, result.enfistat);
      if (!updateStatus) {
        throw { status: 400, message: "Erro ao atualizar o status da entrega" };
      }

      // Atualiza status do bem
      const updateStatusGoods = await goodsRegister.updateStatus(client, result.enfibem, "Está com cliente");
      if (!updateStatusGoods) {
        throw { status: 400, message: "Erro ao atualizar o status do bem" };
      }

      await client.query("COMMIT");

      // Emite socket após commit
      if (socketio) {
        socketio.emit("statusDelivey", result);
      }

      return { success: true, message: "Entrega finalizada com sucesso", entrega: result };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
};
