import { crudRegisterForn } from "../model/dataForn.js";
const fornRegister = crudRegisterForn;

export const movementForne = {
  async registerForn(req, res) {
    try {
      const dataForn = req.body;

      console.log("forne", dataForn);

      if (!dataForn) {
        return res
          .status(400)
          .json({ message: "campos obrigatorios não preenchidos" });
      }

      const isDataValida = (dataStr) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dataStr)) return false;

        const [y, m, d] = dataStr.split("-").map(Number);
        const date = new Date(y, m - 1, d);
        return (
          date.getFullYear() === y &&
          date.getMonth() === m - 1 &&
          date.getDate() === d
        );
      };

      const { fornDtcd } = dataForn;

      if (!isDataValida(fornDtcd)) {
        return res.status(400).json({
          success: false,
          message: "Data de Cadastro INVÁLIDA.",
        });
      }

      const [y, m, d] = fornDtcd.split("-").map(Number);
      const dtCd = new Date(y, m - 1, d);
      const hoje = new Date();
      const hoje0 = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate()
      );

      if (dtCd.getTime() !== hoje0.getTime()) {
        return res.status(400).json({
          success: false,
          message: "Data de cadastro deve ser a data de hoje.",
        });
      }

      const { fornName } = dataForn;

      if (!fornName || fornName.trim().length < 3) {
        return res.status(400).json({
          success: false,
          message:
            "O nome do fornecedor é obrigatório e deve conter pelo menos 3 letras.",
        });
      }

      const { fornMail } = dataForn;

      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailValido.test(fornMail)) {
        return res.status(400).json({
          success: false,
          message: "E-mail inválido. Insira um e-mail no formato correto.",
        });
      }

      const cepForn = dataForn.fornCep;

      if (!cepForn || !/^\d{5}-?\d{3}$/.test(cepForn)) {
        return res.status(400).json({ message: "CEP inválido." });
      }

      const response = await fetch(`https://viacep.com.br/ws/${cepForn}/json/`);
      const cepData = await response.json();

      if (cepData.erro) {
        return res.status(400).json({ message: "CEP não encontrado." });
      }

      const newForn = await fornRegister.registerOfForn(dataForn);
      if (!newForn) {
        return res.status(400).json({ message: "Erro ao inserir fornecedor" });
      }
      const forne = await fornRegister.listingForn();

      const io = req.app.get("socketio");
      if (io) {
        io.emit("updateRunTimeForne", forne);
      }
      res.status(201).json({ success: true, user: newForn });
    } catch (error) {
      console.error("erro no controller");

      if (
        error.message.includes(
          "Código do Fornecedor ja cadastrado. Tente outro."
        )
      ) {
        return res.status(409).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async listOfForn(req, res) {
    try {
      const forne = await fornRegister.listingForn();
      if(!forne){
         return res.status(400).json({message: 'Erro ao listar fornecedor'})
      }
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

     if (!fornId) {
          return res.status(400).json({ message: "ID fornecedor não fornecido" });
        }
    
        const idForne = await fornRegister.buscarIdForn();
        const codeValid = idForne.map((item) => item.forncode);
    
        if (!codeValid.includes(fornId)) {
          return res.status(400).json({ message: "Código do fornecedor e inválido." });
        }

    try {
      const io = req.app.get("socketio");
      const fornUpdate = await fornRegister.updateForn(fornId, updateForn);

      if (io) {
        io.emit("updateFornTable", fornUpdate);
      } else {
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
