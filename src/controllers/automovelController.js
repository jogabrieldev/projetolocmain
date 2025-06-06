import { autoRegister } from "../model/dataAutomo.js";
import { crudRegisterDriver } from "../model/dataDriver.js";

const driver = crudRegisterDriver

export const movementAuto = {

  async registerAuto(req, res) {
  try {
    const dataAuto = req.body;

    if (!dataAuto) {
      return res
        .status(400)
        .json({ message: "Campos obrigatórios não preenchidos." });
    }

    // === Validação: data de cadastro ===
    const isDataValida = (dataStr) => {
      return /^\d{4}-\d{2}-\d{2}$/.test(dataStr);
    };

    if (!isDataValida(dataAuto.caaudtca)) {
      return res.status(400).json({
        success: false,
        message: "Data de Cadastro inválida.",
      });
    }

    const [y, m, d] = dataAuto.caaudtca.split("-").map(Number);
    const dtCd = new Date(y, m - 1, d);
    const hoje = new Date();
    const hojeZerado = new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      hoje.getDate()
    );

    if (dtCd.getTime() !== hojeZerado.getTime()) {
      return res.status(400).json({
        success: false,
        message: "Data de cadastro deve ser a data de hoje.",
      });
    }

    const newAuto = await autoRegister.registerAuto(dataAuto);
    if(!newAuto){
      return res.status(400).json({message: 'Erro ao gerar cadastro de um automovel'})
    }

    const io = req.app.get("socketio");
    if (io) {
      const automovel = await autoRegister.listAutos();
      io.emit("updateRunTimeAutomovel", automovel);
    }

    res.status(201).json({ success: true, auto: newAuto });

  } catch (error) {
    console.error("Erro no controller:", error);

    if (error.message.includes("Código do veiculo já cadastrado. Tente outro.")) {
      return res.status(409).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: "Erro interno no servidor." });
  }
},

  async listingOfAuto(req, res) {
    try {
      const autos = await autoRegister.listAutos();
      if(!autos){
        return res.status(400).json({message:'Erro na listagem de veiculos'})
      }
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

      const hasDependecy = await autoRegister.verificarDependeciaDoAutomovel()
      if(hasDependecy){
        return res.status(400).json({message: 'Não é Possivel apagar o veiculo, tem um motorista vinculado ao veiculo'})
      }
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
