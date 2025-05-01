import { clientRegister } from "../model/dataClient.js";

export const movementClient = {
  async registerClient(req, res) {
    try {
      const dataClientSubmit = req.body;

      if (!dataClientSubmit) {
        return res
          .status(400)
          .json({ message: "campos obrigatorios não preenchidos" });
      }

      const newClient = await clientRegister.registerOfClient(dataClientSubmit);

      const io = req.app.get("socketio");
      if (io) {
        const clients = await clientRegister.listingClient(); 
        io.emit("clienteAtualizado", clients); 
      }
      res.status(201).json({ success: true, user: newClient });
    } catch (error) {
      
      console.error("erro no controller");

      if (error.message.includes("Código de cliente já cadastrado")) {
        return res.status(409).json({ success: false, message: error.message });
      }

      res.status(500).json({ success: false, message: error.message });
    }
  },

  async listingOfClient(req, res) {
    try {
      const client = await clientRegister.listingClient();
      res.json(client).status(200);
    } catch (error) {
      console.error("erro no controller", error.message);
      res.status(500).json({
        success: false,
        message: "erro interno no server",
        message: error.message,
      });
    }
  },

  async deleteOfClient(req, res) {
    const { id } = req.params;
    try {
      const temDependencia = await clientRegister.verificarDependenciaCliente(
        id
      );

      if (temDependencia) {
        return res.status(400).json({
          message: "Não e possivel excluir. O cliente tem locação",
        });
      }
      const deleteComponent = await clientRegister.deleteClient(id);

      if (deleteComponent) {
        return res.status(200).json({
          message: "Client Apagado com sucesso",
          component: deleteComponent,
        });
      } else {
        return res.status(500).json({ message: "Cliente não encontrado" });
      }
    } catch (error) {
      console.error("erro ao apagar componente:", error);
      return res.status(500).json({ message: "erro no servidor" });
    }
  },

  async updateOfClient(req, res) {
    const clientId = req.params.id;
    const updateClient = req.body;

    Object.keys(updateClient).forEach((key) => {
      if (updateClient[key] === "") {
        updateClient[key] = null;
      }
    });

    try {
      const io = req.app.get("socketio");
      const clientUpdate = await clientRegister.updateClient(
        clientId,
        updateClient
      );
      if(!clientUpdate){
        return res.status(404).json({ message: "cliente não encontrado para atualização." });
      }
      if (io) {
        io.emit("updateClients", clientUpdate);
      } else {
        console.warn("Socket.IO não está configurado.");
      }

      res.json({
        message: "Bem atualizado com sucesso",
        Cliente: clientUpdate,
      });
    } catch (error) {
      console.error("Erro ao atualizar o Cliente:", error);
      res.status(500).json({ message: "Erro ao atualizar o Cliente", error });
    }
  },
};
