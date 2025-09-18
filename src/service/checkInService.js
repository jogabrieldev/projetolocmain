import { pool as dataCheckIn } from "../database/userDataBase.js";
import { movimentCheckInAndCheckOut } from "../model/modelsCheckIn.js";
import { autoRegister as updateRuntime } from "../model/modelsVehicles.js";

// Momento que e perciso fazer uma transação no banco passa por esse serviço

// check-in e check-out
export const checkInService = {
  async doCheckIn(payloadCheckin, io) {
    const client = await dataCheckIn.connect();
    try {
      await client.query("BEGIN");

      if (!payloadCheckin) {
        throw new Error("Falta ser passado as informações");
      }
      if (!payloadCheckin.checStat || payloadCheckin.checStat.trim() === "") {
        payloadCheckin.checStat = "Em uso";
      }
      if (!payloadCheckin.checDtch || payloadCheckin.checDtch === "") {
        payloadCheckin.checDtch = new Date();
      }
      
      const validKM = await updateRuntime.getQuilometragemVehicle(payloadCheckin.checVeic);

      if (validKM !== null && Number(payloadCheckin.checKmat) < Number(validKM)) {
       throw new Error(`Quilometragem inválida: o valor informado (${payloadCheckin.checKmat}) é menor que o atual (${validKM}).`);
     }
     
      const newCheckIn = await movimentCheckInAndCheckOut.toDoCheckIn(client, payloadCheckin);
      if (!newCheckIn) throw new Error("Erro para fazer CHECK-IN");

      const updatedKm = await movimentCheckInAndCheckOut.updateKmVehicle(
        payloadCheckin.checKmat,
        payloadCheckin.checVeic,
        client
      );
      if (!updatedKm) throw new Error("Falha ao atualizar KM do veículo");

      if (io) {
        const listVehicle = await updateRuntime.updateStatus(
          client,
          payloadCheckin.checVeic,
          "Está com Motorista!"
        );
        io.emit("checkIn", { vehicle: listVehicle });
      }

      await client.query("COMMIT");

      return newCheckIn;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },


 async doCheckOut(id, payload, io) {
    const client = await dataCheckIn.connect();
    try {
      await client.query("BEGIN");

      if (!id || !payload.checkmvt) {
        throw new Error("Dados do check-out incompletos!");
      }

      const checkInData = await movimentCheckInAndCheckOut.getCheckIn(id, client);
      console.log(checkInData)
      if (!checkInData) throw new Error("Check-in não encontrado para checkOut");

     const veiculo = checkInData.checveic;

      const validKM = await updateRuntime.getQuilometragemVehicle(veiculo);
     
      if (validKM !== null && Number(payload.checkmvt) < Number(validKM)) {
       throw new Error(`Quilometragem inválida: o valor informado (${payload.checkmvt}) é menor que o atual (${validKM}).`);
      }

      const atualizado = await movimentCheckInAndCheckOut.toDoCheckOut(
        id,
        {
          checstat: "Finalizado",
          checkmvt: payload.checkmvt,
          checdtvt: new Date(),
          checobvt: payload.checobvt || null
        },
        client
      );
      if (!atualizado) throw new Error("Não foi possível finalizar o check-out");

      const updateKm = await movimentCheckInAndCheckOut.updateKmVehicle(
        payload.checkmvt,
        atualizado.checveic,
         client,
      );
      if (!updateKm) throw new Error("Falha ao atualizar KM do veículo");

      await client.query("COMMIT");

      if (io) {
        const statusVehicle = await updateRuntime.updateStatus(
          client,
          atualizado.checveic,
          "Disponível"
        );
        io.emit("checkOut", statusVehicle);
      }

      return atualizado;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    };
   }
};
