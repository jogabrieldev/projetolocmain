import { movimentCheckInAndCheckOut } from "../model/modelsCheckIn.js";
// import { autoRegister as updateRuntime } from "../model/modelsVehicles.js";
// import { mecanismDelivey } from "../model/modelsDelivery.js";
// import { pool as dataCheckIn } from "../database/userDataBase.js";
import { checkInService } from "../service/checkInService.js";

 export const controllerCheckInAndCheckOut = {
       
    async toDoCheckIn(req, res) {
    try {
      const io = req.app.get("socketio");
 
      const newCheckIn = await checkInService.doCheckIn(req.body, io);

      return res.status(200).json({ success: true, checkin: newCheckIn });
    } catch (error) {
      console.error("Erro no check-in:", error);
      return res.status(500).json({ message: error.message || "Erro no servidor" });
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
    try {
      const io = req.app.get("socketio");
      const atualizado = await checkInService.doCheckOut(req.params.id, req.body, io);
      return res.status(200).json({ success: true, checkout: atualizado });
    } catch (error) {
      console.error("Erro no checkout:", error);
      return res.status(500).json({ message: error.message || "Erro interno no servidor" });
    }
  },

};

