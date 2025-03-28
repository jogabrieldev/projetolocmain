import { crudRegisterFamilyGoods } from "../model/dataFamilyGoods.js";
const fabriRegister = crudRegisterFamilyGoods;

export const movementOfFamilyGoods = {
  async registerOfFabri(req, res) {
    try {
      const dataFabri = req.body;

      if (!dataFabri) {
        return res
          .status(400)
          .json({ message: "campos obrigatorios não preenchidos" });
      }

      const newFabri = await fabriRegister.registerOfFabri(dataFabri);
      const listFamilyBens = await fabriRegister.listingFabri();

      const io = req.app.get("socketio");
      if (io) {
        io.emit("updateRunTimeFamilyBens", listFamilyBens);
      }
      res.status(201).json({ success: true, user: newFabri });
    } catch (error) {
      console.log("erro no controller");
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async listingOfFabri(req, res) {
    try {
      const fabricante = await fabriRegister.listingFabri();
      res.json(fabricante).status(200);
    } catch (error) {
      console.error("erro no controller", error.message);
      res.status(500).json({
        success: false,
        message: "erro interno no server",
        message: error.message,
      });
    }
  },

  async deleteOfFabri(req, res) {
    const { id } = req.params;
    try {
      const temDependencia =
        await fabriRegister.verificarDependenciaDaFamiliaBens(id);

      if (temDependencia) {
        return res.status(400).json({
          message:
            "Não e possivel excluir. Temos bens vinculados a essa Familia de bem",
        });
      }
      const deleteComponent = await fabriRegister.deleteFabri(id);

      if (deleteComponent) {
        return res.status(200).json({
          message: "componente Apagado com sucesso",
          component: deleteComponent,
        });
      }
    } catch (error) {
      console.error("erro ao apagar componente:", error);
      return res.status(500).json({ message: "erro no servidor" });
    }
  },

  async updateFabri(req, res) {
    const fabeId = req.params.id;
    const updateData = req.body;

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === "") {
        updateData[key] = null;
      }
    });

    try {
      const io = req.app.get("socketio");
      const updateProd = await fabriRegister.updateFabri(fabeId, updateData);
       
      if(!updateProd){
        return res.status(404).json({ message: "familia de bem não encontrado para atualização." });
      }
      
      if (io) {
        io.emit("updateRunTimeTableFamilyGoods", updateProd); 
      } else {
        console.warn("Socket.IO não está configurado.");
      }

      res.json({
        message: "produto atualizado com sucesso",
        fabricante: updateProd,
      });
    } catch (error) {
      console.error("Erro ao atualizar o fabricante:", error);
      res
        .status(500)
        .json({ message: "Erro ao atualizar o fabricante", error });
    }
  },
};
