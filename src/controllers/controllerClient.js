
import { clientRegister } from "../model/modelsClient.js";
import { dateFilial as controllerFili } from "../model/modelsFilial.js";
import fetch from "node-fetch";

export const movementClient = {
  async registerClient(req, res) {
    try {
      const dataClientSubmit = req.body;

     console.log('dataclient' , dataClientSubmit)

      if (!dataClientSubmit) {
        return res
          .status(400)
          .json({ message: "Campos obrigatórios não preenchidos." });
      }

      // const cepClie = dataClientSubmit.clieCep;

      // if (!cepClie || !/^\d{5}-?\d{3}$/.test(cepClie)) {
      //   return res.status(400).json({ message: "CEP inválido." });
      // }

      // const response = await fetch(`https://viacep.com.br/ws/${cepClie}/json/`);
      // const cepData = await response.json();

      // if (cepData.erro) {
      //   return res.status(400).json({ message: "CEP não encontrado." });
      // }

      const newClient = await clientRegister.registerOfClient(dataClientSubmit);
      if (!newClient) {
        return res.status(400).json({ message: "Erro ao cadastrar o cliente" });
      }

      if(dataClientSubmit.filial){
          const filialData = dataClientSubmit.filial
          try {
               await controllerFili.registerFilial(newClient.cliecode , filialData)
          } catch (error) {
              return res.status(400).json({message: "Erro para cadastrar filial"})
          }
         
      }

      const io = req.app.get("socketio");
      if (io) {
        const clients = await clientRegister.listingClient();
        io.emit("clienteAtualizado", clients);
      }

     return res.status(200).json({ success: true, cliente: newClient });
      
    } catch (error) {
      console.error("erro no controller client" , error);

      if (error.message.includes("Código de cliente já cadastrado")) {
        return res.status(409).json({ success: false, message: error.message });
      }

      return res.status(500).json({ success: false, message: error.message });
    }
  },

 async searchClient(req, res) {
    const { cliecode , valueCpf , valueCnpj } = req.query;
    try {
      if (!cliecode && !valueCpf && !valueCnpj ) {
        return res.status(400).json({ message: "Dados do cliente e obrigatorio para pesquisa." });
      }

      const cpf = valueCpf?.replace(/\D/g, "")
      const cnpj = valueCnpj?.replace(/\D/g, "")

      if(valueCpf && !cpf){
         return res.status(400).json({ message: "O CPF do cliente está em formato inválido." });
       }

      if (valueCnpj && !cnpj) {
      return res.status(400).json({ message: "O CNPJ do cliente está em formato inválido." });
      }

      const cliente = await clientRegister.getClientByFilter(cliecode , cpf , cnpj);

      if (!cliente || cliente.length === 0) {
        return res.status(404).json({ message: "Cliente não encontrado valide os dados de pesquisa." });
      }

      return res.status(200).json({success:true , cliente});
    } catch (error) {
      console.error("Erro ao buscar cliente por código:", error);
      return res.status(500).json({ message: "Erro ao buscar cliente." });
    }
  },

  getClientId: async (req, res) => {
    const { cliecode } = req.params;

    if(!cliecode){
       return res.status(400).json({message: 'E preciso passar o parametro para a busca'})
    }

    try {
      const cliente = await clientRegister.getClientForId(cliecode);

      if (!cliente || cliente.length === 0) {
        return res.status(404).json({ message: "Cliente não encontrado verifique a credencial." });
      }

     return res.status(200).json(cliente);
    } catch (error) {
      console.error("Erro ao buscar cliente:", error.message);
      return res.status(500).json({ message: "Erro interno ao buscar cliente." });
    }
  },

  async listingOfClient(req, res) {
    try {
      const client = await clientRegister.listingClient();
      if (!client) {
        return res
          .status(400)
          .json({ success: false, message: "Erro na listagem de client" });
      }
     return res.status(200).json(client);
    } catch (error) {
      console.error("erro no controller para listar o cliente", error.message);
      return res.status(500).json({
        success: false,
        message: "erro interno no server",
        message: error.message,
      });
    }
  },

  async deleteOfClient(req, res) {
    const { id } = req.params;
    try {
      const temDependencia = await clientRegister.verificarDependenciaCliente(id);
      if (temDependencia) {
        return res.status(400).json({
          message: "Não e possivel excluir. O cliente tem locação",
        });
      }

      const verifiqueFilial = await clientRegister.verifiqueFilial(id)
    
      if(verifiqueFilial){
        return res.status(400).json({message:'O cliente possui filiais no nosso sistema'})
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

    if(!clientId || !updateClient){
       return res.status(400).json({message: 'Falta informações para atualização do cliente'})
    }

    Object.keys(updateClient).forEach((key) => {
      if (updateClient[key] === "") {
        updateClient[key] = null;
      }
    });

    const clientExists = await clientRegister.getAllClientForId(clientId);
      if (!clientExists) {
       return res.status(400).json({ message: "Código do cliente é inválido." });
    }


    const { cliemail} = updateClient;

      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailValido.test(cliemail)) {
        return res.status(400).json({
          success: false,
          message: "E-mail inválido. Insira um e-mail no formato correto.",
        });
      }

      const cepClie = updateClient.cliecep;

      if (!cepClie || !/^\d{5}-?\d{3}$/.test(cepClie)) {
        return res.status(400).json({ message: "CEP inválido." });
      }

      const response = await fetch(`https://viacep.com.br/ws/${cepClie}/json/`);
      const cepData = await response.json();

      if (cepData.erro) {
        return res.status(400).json({ message: "CEP não encontrado." });
      }

    try {
      const io = req.app.get("socketio");
      const clientUpdate = await clientRegister.updateClient(
        clientId,
        updateClient
      );
      if (!clientUpdate) {
        return res
          .status(404)
          .json({ message: "cliente não encontrado para atualização." });
      }
      if (io) {
        io.emit("updateClients", clientUpdate);
      } else {
        console.warn("Socket.IO não está configurado.");
      }

      return res.json({
        message: "Bem atualizado com sucesso",
        Cliente: clientUpdate,
      });
    } catch (error) {
      console.error("Erro ao atualizar o Cliente:", error);
      return res.status(500).json({ message: "Erro ao atualizar o Cliente", error });
    }
  },
};
