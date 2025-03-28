import { crudRegisterForn } from "../model/dataForn.js";
const fornRegister = crudRegisterForn;

export const movementForne = {
  async registerForn(req, res) {
    try {
      const dataForn = req.body;

      if (!dataForn) {
        return res
          .status(400)
          .json({ message: "campos obrigatorios não preenchidos" });
      }

      const newForn = await fornRegister.registerOfForn(dataForn);
      const forne = await fornRegister.listingForn();

      const io = req.app.get("socketio");
      if (io) {
        io.emit("updateRunTimeForne", forne);
      }
      res.status(201).json({ success: true, user: newForn });
    } catch (error) {
      console.log("erro no controller");
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async listOfForn(req, res) {
    try {
      const forne = await fornRegister.listingForn();
      res.json(forne).status(200);
    } catch (error) {
      console.error("erro no controller", error.message);
      res.status(500).json({
        success: false,
        message: "erro interno no server",
        message: error.message,
      });
    }
  },

  async codeForn(req, res) {
    try {
      const dataforn = await fornRegister.buscarIdForn();
      if (dataforn) {
        res.status(200).json(dataforn);
        return dataforn;
      } else {
        return req.status(400).json({ error: "Nenhum dado encontrado" });
      }
    } catch (error) {
      console.error("Erro ao buscar fornecedor", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  async deleteOfForm(req, res) {
    try {
      const { id } = req.params;

      const temDependencia = await fornRegister.verificarDependenciaForne(id);

      if (temDependencia) {
        return res.status(400).json({
          message:
            "Não e possivel excluir. Temos bens vinculados a esse fornecedor",
        });
      }
      const deleteComponent = await fornRegister.deleteForn(id);

      if (deleteComponent) {
        return res.status(200).json({
          message: "componente Apagado com sucesso",
          component: deleteComponent,
        });
      } else {
        res.status(500).json({ message: "Erro no servidor" });
      }
    } catch (error) {
      console.error("erro ao apagar componente:", error);
      return res.status(500).json({ message: "erro no servidor" });
    }
  },

  async updateOfForn(req, res) {
    const fornId = req.params.id;
    const updateForn = req.body;

    Object.keys(updateForn).forEach((key) => {
      if (updateForn[key] === "") {
        updateForn[key] = null;
      }
    });

    try {
      const io = req.app.get("socketio");
      const fornUpdate = await fornRegister.updateForn(fornId, updateForn);

      
      if (io) {
        io.emit("updateFornTable", fornUpdate);
      }else{
        console.warn("Socket.IO não está configurado.");
      }
      res.json({
        message: "Bem atualizado com sucesso",
        Fornecedor: fornUpdate,
      });
    } catch (error) {
      console.error("Erro ao atualizar o Fornecedor:", error);
      res.status(500).json({ message: "Erro ao atualizar o Cliente", error });
    }
  },
};
