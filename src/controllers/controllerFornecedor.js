import { crudRegisterForn as fornRegister } from "../model/modelsFornecedor.js";
import fetch from "node-fetch";

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
      if (!newForn) {
        return res.status(400).json({ message: "Erro ao cadastrar fornecedor" });
      }
      const forne = await fornRegister.listingForn();

      const io = req.app.get("socketio");
      if (io) {
        io.emit("updateRunTimeForne", forne);
      }
      return res.status(200).json({ success: true, fornecedor: newForn });
    } catch (error) {
      console.error("erro no controller");

      if (error.message.includes("Código do Fornecedor ja cadastrado. Tente outro.")) {
        return res.status(409).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async searchForneParams(req, res) {
    const { fornCode, fornCnpj } = req.query;
     
    try {
      if (!fornCode && !fornCnpj) {
        return res.status(400).json({ message: "Informe o código ou CNPJ para a busca." });
      }

      const cnpj = fornCnpj?.replace(/\D/g, "")
      if(fornCnpj && !cnpj){
        return res.status(400).json({message: 'O CNPJ esta no formato errado verifique por favor!.'})
      }

      const fornecedor = await fornRegister.getFornecedorById(fornCode , cnpj);
  
      if (!fornecedor || fornecedor.length === 0) {
        return res.status(404).json({ message: "Nenhum bem encontrado." });
      }
  
      return res.status(200).json({ success: true, fornecedor });
    } catch (error) {
      console.error("Erro ao buscar fornecedo :", error);
      return res.status(500).json({ message: "Erro ao buscar fornecedor." });
    }
 },

  async listOfForn(req, res) {
    try {
      const forne = await fornRegister.listingForn();
      if(!forne){
         return res.status(400).json({message: 'Erro ao listar fornecedor'})
      }
      return res.status(200).json({success:true , forne});
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

  async deleteOfForn(req, res) {
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
       if(!deleteComponent){
         return res.status(400).json({success:false , message:"Erro eo encontrar o indentificador passado"})
       }
  
        console.log('delete' , deleteComponent)
        return res.status(200).json({
          message: "componente Apagado com sucesso",
          component: deleteComponent,
        });
     
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

     if (!fornId  || !updateForn) {
          return res.status(400).json({ message: "Não foi passado os dados para atualização" });
        }
    
        const idForne = await fornRegister.buscarIdForn();
        const codeValid = idForne.map((item) => item.forncode);
    
        if (!codeValid.includes(fornId)) {
          return res.status(400).json({ message: "Código do fornecedor e inválido." });
        }


      const  fornMail  = updateForn.fornmail?.trim();

      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if ( !fornMail || !emailValido.test(fornMail)) {
        return res.status(400).json({
          success: false,
          message: "E-mail inválido. Insira um e-mail no formato correto.",
        });
      }

      const cepForn =  updateForn.forncep;

      if (!cepForn || !/^\d{5}-?\d{3}$/.test(cepForn)) {
        return res.status(400).json({ message: "CEP inválido." });
      }

      const response = await fetch(`https://viacep.com.br/ws/${cepForn}/json/` , {
        method:'GET'
      });
      const cepData = await response.json();

      if (cepData.erro) {
        return res.status(400).json({ message: "CEP não encontrado." });
      }

    try {
      const io = req.app.get("socketio");
      const fornUpdate = await fornRegister.updateForn(fornId, updateForn);

      if (io) {
        io.emit("updateFornTable", fornUpdate);
      } else {
        console.warn("Socket.IO não está configurado.");
      }
      return res.json({
        message: "Bem atualizado com sucesso",
        Fornecedor: fornUpdate,
      });
    } catch (error) {
      console.error("Erro ao atualizar o Fornecedor:", error);
      return res.status(500).json({ message: "Erro ao atualizar o Cliente", error });
    }
  },
};
