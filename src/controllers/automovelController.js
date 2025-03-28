import { autoRegister } from "../model/dataAutomo.js";

export const movementAuto = {

  async registerAuto (req, res) {
    try {
      const dataAuto = req.body;

      if (!dataAuto) {
        return res
          .status(400)
          .json({ message: "Campos obrigatórios não preenchidos" });
      }

      const newAuto = await autoRegister.registerAuto(dataAuto);

      const io = req.app.get("socketio");
            if (io) {
              const automovel = await autoRegister.listAutos(); // Pega todos os clientes após o cadastro
              io.emit("updateRunTimeAutomovel", automovel); // Emite a lista completa de clientes
            }
      res.status(201).json({ success: true, auto: newAuto });
    } catch (error) {
      console.log("Erro no controller");
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async listingOfAuto(req, res) {
    try {
      const autos = await autoRegister.listAutos();
      res.status(200).json(autos);
    } catch (error) {
      console.error("Erro no controller", error.message);
      res.status(500).json({
        success: false,
        message: "Erro interno no servidor",
        error: error.message,
      });
    }
  },

  async deleteOfAuto(req, res) {
    try {
      const { id } = req.params;
      const deletedAuto = await autoRegister.deleteAuto(id);

      if (!deletedAuto) {
        return res.status(404).json({ message: "Registro não encontrado" });
      }
      return res.status(200).json({
        message: "Registro apagado com sucesso",
        auto: deletedAuto,
      });
    } catch (error) {
      console.error("Erro ao apagar registro:", error);
      return res.status(500).json({ message: "Erro no servidor" });
    }
  },

  async updateOfAuto(req, res) {
    const autoId = req.params.id;
    const updateAuto = req.body;

    Object.keys(updateAuto).forEach((key) => {
      if (updateAuto[key] === "") {
        updateAuto[key] = null;
      }
    });

    try {
       
      const io = req.app.get("socketio");
      const updatedAuto = await autoRegister.updateAuto(autoId, updateAuto);

      if(!updateAuto){
        return res.status(404).json({ message: "cliente não encontrado para atualização." });
      }
       
      if (io) {
        io.emit("updateTableAutomovel", updateAuto);
      } else {
        console.warn("Socket.IO não está configurado.");
      }
      res.json({
        message: "Registro atualizado com sucesso",
        auto: updatedAuto,
      });
    } catch (error) {
      console.error("Erro ao atualizar o registro:", error);
      res.status(500).json({ message: "Erro ao atualizar o registro", error });
    }
  },
};
