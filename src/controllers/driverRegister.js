import  {crudRegisterDriver} from "../model/dataDriver.js";
const driverRegister = crudRegisterDriver


 export const movementOfDriver = {
  async registerOfDriver(req, res) {
    try {
      const dataDriver = req.body;

      if (!dataDriver) {
        return res
          .status(400)
          .json({ message: "campos obrigatorios não preenchidos" });
      }

      const newDriver = driverRegister.registerDriver(dataDriver);
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
    try {
      const { id } = req.params;
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

    try {
      const updateMoto = await driverRegister.updateDriver(motoId, updateData);
      res.json({
        message: "Motorista atualizado com sucesso",
        Motorista: updateMoto,
      });
    } catch (error) {
      console.error("Erro ao atualizar o Motorista:", error);
      res.status(500).json({ message: "Erro ao atualizar o Motorista", error });
    }
  },
};

