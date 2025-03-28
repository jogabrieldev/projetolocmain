import { crudRegisterDriver } from "../model/dataDriver.js";
const driverRegister = crudRegisterDriver;

export const movementOfDriver = {
  async registerOfDriver(req, res) {
    try {
      const dataDriver = req.body;

      if (!dataDriver) {
        return res
          .status(400)
          .json({ message: "campos obrigatorios não preenchidos" });
      }

      const newDriver = await driverRegister.registerDriver(dataDriver);
      const listDriver = await driverRegister.listingDriver()

      const io = req.app.get("socketio");
      if (io) {
        io.emit("updateRunTimeDriver", listDriver);
      }
      res.status(201).json({ success: true, user: newDriver });
    } catch (error) {
      console.log("erro no controller");
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async listingOfDriver(req, res) {
    try {
      const motorista = await driverRegister.listingDriver();
      res.json(motorista).status(200);
    } catch (error) {
      console.error("erro no controller", error.message);
      res.status(500).json({
        success: false,
        message: "erro interno no server",
        message: error.message,
      });
    }
  },

  async deleteOfDriver(req, res) {
    const { id } = req.params;
    try {
      const verificar = await driverRegister.verificarDepedenciaDeMotorista(id);
      if (verificar) {
        return res.status(400).json({
          message:
            "Não e possivel excluir. Motorista tem veiculo vinculado a ele",
        });
      }
      const verificarEntregas = await driverRegister.verificarEntregaComMotorista(id)
      if(verificarEntregas){
        return res.status(400).json({
          message:
            "Não é possível excluir. O motorista tem entregas pendentes ou está em entrega.",
        });
      }
      const deleteMotorista = await driverRegister.deleteDriver(id);

      if (!deleteMotorista) {
        return res.status(404).json({ message: "Componente Não encontrado" });
      }
      return res.status(200).json({
        message: "componente Apagado com sucesso",
        component: deleteMotorista,
      });
    } catch (error) {
      console.error("erro ao apagar componente:", error);
      return res.status(500).json({ message: "erro no servidor" });
    }
  },

  async updateOfDrive(req, res) {
    const motoId = req.params.id;
    const updateData = req.body;

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === "") {
        updateData[key] = null;
      }
    });
    //updateRunTimeTableDrive
    try {
      const io = req.app.get("socketio");
      const updateMoto = await driverRegister.updateDriver(motoId, updateData);

      if(!updateMoto){
        return res.status(404).json({ message: "Tipo de produto não encontrado para atualização." });
      }

      if (io) {
        io.emit("updateRunTimeTableDrive",updateMoto); 
      } else {
        console.warn("Socket.IO não está configurado.");
      }
      res.json({
        message: "Motorista atualizado com sucesso",
        Motorista: updateMoto,
      });
    } catch (error) {
      console.error("Erro ao atualizar o Motorista:", error);
      res.status(500).json({ message: "Erro ao atualizar o Motorista", error });
    }
  },

  async updateStatusDriver(req, res) {
    try {
      const { motoId } = req.params;
      const { motostat } = req.body;

     
      if (!motoId || !motostat) {
        return res.status(400).json({ message: "Dados inválidos" });
      }

      const result = await driverRegister.updateStatusMoto(motoId, motostat);
      if (!result) {
        return res.status(404).json({ message: "Motorista não encontrado" });
      }

      res
        .status(200)
        .json({ message: "Status atualizado com sucesso!", data: result });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      res.status(500).json({ message: "Erro no servidor" });
    }
  },
};
