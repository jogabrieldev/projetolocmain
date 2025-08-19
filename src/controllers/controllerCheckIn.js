import { movimentCheckInAndCheckOut } from "../model/modelsCheckIn.js";
import { autoRegister as updateRuntime } from "../model/modelsVehicles.js";
import { mecanismDelivey } from "../model/modelsDelivery.js";
import { pool as dataCheckIn } from "../database/userDataBase.js";

 export const controllerCheckInAndCheckOut = {
       
    async toDoCheckIn(req, res) {
    const client = await dataCheckIn.connect(); // pega conexão do pool
    try {
      await client.query("BEGIN"); // inicia transação

      const payloadCheckin = req.body;
  
      if (!payloadCheckin) {
        return res.status(400).json({ message: "Falta ser passado as informações" });
      }

      if (!payloadCheckin.checStat || payloadCheckin.checStat.trim() === "") {
        payloadCheckin.checStat = "Em uso";
      }

      if (!payloadCheckin.checDtch || payloadCheckin.checDtch === "") {
        payloadCheckin.checDtch = new Date();
      }

      const newCheckIn = await movimentCheckInAndCheckOut.toDoCheckIn(payloadCheckin);
      if (!newCheckIn) throw new Error("Erro para fazer CHECK-IN");

      const updatedKm = await movimentCheckInAndCheckOut.updateKmVehicle(
        payloadCheckin.checKmat,
        payloadCheckin.checVeic,
      
      );
      if (!updatedKm) throw new Error("Falha ao atualizar KM do veículo");

      const io = req.app.get("socketio");
      if (io) {
        const listVehicle = await updateRuntime.updateStatus(
          payloadCheckin.checVeic,
          "Está com Motorista!"
        );
        io.emit("checkIn", { vehicle: listVehicle });
      }

      await client.query("COMMIT"); // confirma todas alterações
      return res.status(200).json({ success: true, checkin: newCheckIn });

    } catch (error) {
      await client.query("ROLLBACK"); // desfaz tudo se houver erro
      console.error("Erro no check-in:", error);
      return res.status(500).json({ message: "Erro no servidor para fazer check-in." });

    } finally {
      client.release(); // devolve conexão ao pool
    }
  },

 async getCheckInOpenForDriver(req, res) {
    try {
      const idMoto = req.params.idMoto;

    if (idMoto) {
      const verificar = await movimentCheckInAndCheckOut.getCheckInOpenForDriver(idMoto);

      if (!verificar || verificar.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Não encontrei nenhum check-in ativo para este motorista."
        });
      }

      return res.status(200).json({ success: true, verificar: verificar });
    }

    return res.status(400).json({ message: "ID do motorista não informado" });
  } catch (error) {
    console.error('Erro ao buscar check-in:', error);
    return res.status(500).json({ message: "Erro interno ao buscar check-in" });
  }
},

async toCheckOut(req, res) {
  const client = await dataCheckIn.connect();
  try {
    await client.query("BEGIN");

    const { id } = req.params;
    const { checkmvt, checobvt } = req.body;

    if (!id || !checkmvt) {
      throw new Error('Dados do check-out incompletos!');
    }

    // Atualizar check-out usando a mesma conexão da transação
    const atualizado = await movimentCheckInAndCheckOut.toDoCheckOut(
      id,
      {
        checstat: 'Finalizado',
        checkmvt,
        checdtvt: new Date(),
        checobvt
      },
      client
    );

    if (!atualizado) throw new Error('Não foi possível finalizar o check-out');

    // Atualizar KM do veículo na mesma transação
    const update = await movimentCheckInAndCheckOut.updateKmVehicle(
      checkmvt,
      atualizado.checveic,
      client
    );
    if (!update) throw new Error("Falha ao atualizar KM do veículo");

    await client.query("COMMIT"); // confirma tudo

    // Emitir socket após commit
    const socket = req.app.get("socketio");
    if (socket) {
      const statusVehicle = await updateRuntime.updateStatus(atualizado.checveic, "Disponível");
      socket.emit('checkOut', statusVehicle);
    }

    return res.status(200).json({ success: true, checkout: atualizado });

  } catch (error) {
    await client.query("ROLLBACK"); // desfaz tudo em caso de erro
    console.error('Erro no checkout:', error);
    return res.status(500).json({ message: error.message || 'Erro interno no servidor.' });
  } finally {
    client.release(); // libera conexão do pool
  }
}

}

