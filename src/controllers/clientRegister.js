import  {clientRegister} from "../model/dataClient.js";

 export const movementClient = {

  async registerClient(req, res) {
    try {
      const dataClient = req.body;

      if (!dataClient) {
        return res
          .status(400)
          .json({ message: "campos obrigatorios não preenchidos" });
      }

      const newClient = clientRegister.registerOfClient(dataClient);
      res.status(201).json({ success: true, user: newClient });
    } catch (error) {
      console.log("erro no controller");
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
    try {
      const { id } = req.params;
      const deleteComponent = await clientRegister.deleteClient(id);

      if (!deleteComponent) {
        return res.status(404).json({ message: "Componente Não encontrado" });
      }
      return res.status(200).json({
        message: "Client Apagado com sucesso",
        component: deleteComponent,
      });
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
      const clientUpdate = await clientRegister.updateClient(
        clientId,
        updateClient
      );
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

