import { crudRegisterTypeProd } from "../model/dataTypeProd.js";
const typeProdRegister = crudRegisterTypeProd;

export const movementOfTypeProd = {
  async registerTyperProd(req, res) {
    try {
      const dataTypeProd = req.body;

      if (!dataTypeProd) {
        return res
          .status(400)
          .json({ message: "campos obrigatorios não preenchidos" });
      }

      const newTypeProd = await typeProdRegister.registerTypeProd(dataTypeProd);
      res.status(201).json({ success: true, user: newTypeProd });
    } catch (error) {
      console.log("erro no controller");
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async listingOfTypeProd(req, res) {
    try {
      const produto = await typeProdRegister.listTypeProd(req, res);
      res.json(produto).status(200);
    } catch (error) {
      console.error("Erro no controller:", error.message);
      res.status(500).json({
        success: false,
        message: "erro interno no server",
        message: error.message,
      });
    }
  },

  async deleteOfTypeProd(req, res) {
    const { id } = req.params;
    try {
      const verificar = await typeProdRegister.verificarDependeciaDetipoProd(
        id
      );

      if (verificar) {
        return res.status(400).json({
          message:
            "Não e possivel excluir. Temos produtos vinculado a esse tipo",
        });
      }

      const deleteComponent = await typeProdRegister.deleteTypeProd(id);

      if (!deleteComponent) {
        return res.status(404).json({ message: "Componente Não encontrado" });
      }
      return res.status(200).json({
        message: "componente Apagado com sucesso",
        component: deleteComponent,
      });
    } catch (error) {
      console.error("erro ao apagar componente:", error);
      return res.status(500).json({ message: "erro no servidor" });
    }
  },

  async updateOfTypeProd(req, res) {
    const prodId = req.params.id;
    const updateData = req.body;

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === "") {
        updateData[key] = null;
      }
    });

    try {
      const updateTypeProd = await typeProdRegister.updateTypeProd(
        prodId,
        updateData
      );
      res.json({
        message: "tipo do produto atualizado com sucesso",
        produto: updateTypeProd,
      });
    } catch (error) {
      console.error("Erro ao atualizar o tipo do produto:", error);
      res
        .status(500)
        .json({ message: "Erro ao atualizar o tipo do produto", error });
    }
  },
};
