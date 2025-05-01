import { goodsRegister } from "../model/dataGoods.js";

export const movementGoods = {
  async  registerBens(req, res) {
    try {
      const data = req.body;
      if (!data) {
        return res.status(400).json({ message: "Nenhum dado enviado" }); 
      }
  
      const newUser = await goodsRegister.registerOfBens(data);
      const bens = await goodsRegister.listingBens(); 
  
      const io = req.app.get("socketio");
      if (io) {
        io.emit("updateRunTimeGoods", bens); 
      }
  
      return res.status(201).json({ success: true, user: newUser }); 
  
    } catch (error) {

      if (error.message.includes("Código do Bem ja cadastrado. Tente outro.")) {
        return res.status(409).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: error.message }); // Corrigido: adicionando return
    }
  },
  

  async codeFamilyBens(req, res) {
    try {
      const dataFamilybens = await goodsRegister.buscarIdFamiliaBens();
  
      if (!dataFamilybens || dataFamilybens.length === 0) {
        return res.status(400).json({ error: "Nenhum dado encontrado" });
      }
  
      return res.status(200).json(dataFamilybens);
    } catch (error) {
      console.error("Erro ao buscar família de bens:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
  

  async listBens(req, res) {
    try {
      const bens = await goodsRegister.listingBens();
      res.json(bens).status(200);
    } catch (error) {
      console.error("Erro no controller:", error.message);
      res.status(500).json({
        success: false,
        message: "erro interno no server",
        message: error.message,
      });
    }
  },

  async updateGoods(req, res) {
    const bemId = req.params.id;
    const updatedData = req.body;

    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key] === "") {
        updatedData[key] = null;
      }
    });

    try {
     
      const bemUpdate = await goodsRegister.updateBens(bemId , updatedData)
      if (!bemUpdate) {
        return res.status(404).json({ message: "Bem não encontrado para atualização." });
    }
     
       const io = req.app.get("socketio");
      if (io) {
        io.emit("updateGoodsTable", bemUpdate); 
      } else {
        console.warn("Socket.IO não está configurado.");
      }

        return res.json({ message: "Bem atualizado com sucesso!", bem: bemUpdate });
     
    } catch (error) {
      console.error("Erro ao atualizar o bem:", error);
      res.status(500).json({ message: "Erro ao atualizar o bem", error });
    }
  },

  async deletarGoods(req, res) {
    const { id } = req.params;
    try {
      const verificar = await goodsRegister.verificarDependenciaBens(id);

      if (verificar) {
        return res.status(400).json({
          message: "Não e possivel excluir. o bem esta em locação ",
        });
      }

      const deleteComponent = await goodsRegister.deleteBens(id);

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

  async update(req, res) {
    try {
      const { bemId } = req.params; // Pega o ID da URL
      const { bensstat } = req.body; // Pega o novo status

      if (!bemId || !bensstat) {
        return res.status(400).json({ message: "Dados inválidos" });
      }

      const result = await goodsRegister.updateStatus(bemId, bensstat);

      if (!result) {
        return res.status(404).json({ message: "Bem não encontrado" });
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
