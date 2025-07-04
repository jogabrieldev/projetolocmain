import { crudRegisterDriver as driverRegister } from "../model/modelsDriver.js";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const movementOfDriver = {

  async registerOfDriver(req, res) {
    try {
      const data = req.body;

      if (!data) {
        return res
          .status(400)
          .json({ message: "Campos obrigatórios não preenchidos." });
      }

            const validCpfSystem = await driverRegister.getAllDriverIdCpf();
            const resuntConsult = validCpfSystem.map(item =>(item.motocpf));
            const cpfToCheck = data.motoCpf;
      
           if (resuntConsult.includes(cpfToCheck)) {
              return res.status(400).json({ message: "CPF já cadastrado no sistema, valide com o motorista" });
            }

      function isDataValida(dataStr) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dataStr)) return false;

        const [ano, mes, dia] = dataStr.split("-").map(Number);
        const data = new Date(ano, mes - 1, dia);
        return (
          data.getFullYear() === ano &&
          data.getMonth() === mes - 1 &&
          data.getDate() === dia
        );
      }

      const { motoDtvc, motoDtnc, motoCep } = data;

      // Validação das datas
      const datas = [
        { key: "motoDtvc", label: "Data de Vencimento" },
        { key: "motoDtnc", label: "Data de Nascimento" },
      ];

      for (const { key, label } of datas) {
        if (!isDataValida(data[key])) {
          return res.status(400).json({ message: `${label} inválida.` });
        }
      }

      const [yVc, mVc, dVc] = motoDtvc.split("-").map(Number);
      const [yNc, mNc, dNc] = motoDtnc.split("-").map(Number);

      const dtVenci = new Date(yVc, mVc - 1, dVc);
      const dtNasc = new Date(yNc, mNc - 1, dNc);
      const hoje = new Date();
      const hoje0 = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate()
      );

      // Data de vencimento deve ser futura
      if (dtVenci.getTime() <= hoje0.getTime()) {
        return res
          .status(400)
          .json({
            message:
              "A data de vencimento da CNH deve ser maior que a data de hoje.",
          });
      }

      // Data de nascimento não pode ser futura
      if (dtNasc.getTime() >= hoje0.getTime()) {
        return res
          .status(400)
          .json({
            message:
              "Data de nascimento não pode ser maior ou igual à data de hoje.",
          });
      }

      const { motoMail } = data;

      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailValido.test(motoMail)) {
        return res.status(400).json({
          success: false,
          message: "E-mail inválido. Insira um e-mail no formato correto.",
        });
      }

      // Validação de CEP usando ViaCEP
      const cepLimpo = motoCep.replace(/\D/g, "");
      const viaCepRes = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );

      if (!viaCepRes.ok) {
        return res.status(400).json({ message: "Erro ao buscar o CEP." });
      }

      const cepData = await viaCepRes.json();

      if (cepData.erro) {
        return res.status(400).json({ message: "CEP inválido." });
      }

      // Preenchendo dados a partir do ViaCEP (caso necessário)
      data.motoRua =
      data.motoRua || `${cepData.logradouro} - ${cepData.bairro}`;
      data.motoCity = data.motoCity || cepData.localidade;
      data.motoEstd = data.motoEstd || cepData.uf;

      const saltRounds = 10;

      if (!data.motoPasw || data.motoPasw.length < 6) {
         return res.status(400).json({
          success: false,
          message: "A senha é obrigatória e deve ter pelo menos 6 caracteres.",
        });
      }

     data.motoPasw = await bcrypt.hash(data.motoPasw, saltRounds);


      // Prossegue com o cadastro
      const newDriver = await driverRegister.registerDriver(data);
      const listDriver = await driverRegister.listingDriver();

      const io = req.app.get("socketio");
      if (io) {
        io.emit("updateRunTimeDriver", listDriver);
      }

      res.status(201).json({ success: true, user: newDriver });
    } catch (error) {
      console.error("erro no controller", error);

      if (error.message.includes("Código do motorista ja cadastrado")) {
        return res.status(409).json({ success: false, message: error.message });
      }

      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getAllDriverForDelivery(req ,res){
       
    try {
      const {motoristaid} = req.params
      if(!motoristaid){
        return res.status(400).json({message:"Parametro não passado"})
      }

      console.log('motorista' , motoristaid)

      const success = await driverRegister.getAllDriverForDelivery(motoristaid)
      if(!success){
        return res.status(400).json({message:"Erro ao buscar"})
      }

      return res.status(200).json({success:true , user:success})
    } catch (error) {
       console.error('Erro ao buscar motorista')
       return res.status(500).json({message:"Erro no server ao buscar motorista" , success:false})
    }
  },

  async getDriverByCode(req, res) {

    const { motocode, status , situacao } = req.query;
     
    try {
      if (!motocode && !status && !situacao ) {
        return res.status(400).json({ message: "Informe o código, status ou situação para a busca." });
      }
  
      const driver = await driverRegister.getdriverById(motocode , status , situacao);
  
      if (!driver || driver.length === 0) {
        return res.status(404).json({ message: "Nenhum motorista encontrado." });
      }
  
      return res.status(200).json({ success: true, driver });
    } catch (error) {
      console.error("Erro ao buscar motorista:", error);
      return res.status(500).json({ message: "Erro ao buscar motorista." });
    }
  },

  async listingOfDriver(req, res) {
    try {
      const motorista = await driverRegister.listingDriver();
      if(!motorista){
        return res.status(400).json({message: 'Erro ao listar Motoristas'})
      }
      res.json(motorista).status(200);
    } catch (error) {
      console.error("erro no controller", error.message);
      res.status(500).json({
        success: false,
        message: "erro interno no server",
        message: error.message,
      });
    }
  },

  async deleteOfDriver(req, res) {
    const { id } = req.params;
    try {
      
      const verificarEntregas =
        await driverRegister.verificarEntregaComMotorista(id);
      if (verificarEntregas) {
        return res.status(400).json({
          message:
            "Não é possível excluir. O motorista tem entregas pendentes ou está em entrega.",
        });
      }
      const deleteMotorista = await driverRegister.deleteDriver(id);

      if (!deleteMotorista) {
        return res.status(404).json({ message: "Componente Não encontrado" });
      }
      return res.status(200).json({
        message: "componente Apagado com sucesso",
        component: deleteMotorista,
      });
    } catch (error) {
      console.error("erro ao apagar componente:", error);
      return res.status(500).json({ message: "erro no servidor" });
    }
  },

  async updateOfDrive(req, res) {
    const motoId = req.params.id;
    const updateData = req.body;

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === "") {
        updateData[key] = null;
      }
    });

    if(!motoId){
      return res.status(400).json({message: 'ID do motorista não passado'})
    }

     const  motomail  = updateData.motomail;
    
          const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
          if (!emailValido.test(motomail)) {
            return res.status(400).json({
              success: false,
              message: "E-mail inválido. Insira um e-mail no formato correto.",
            });
          }
    
          const cepMoto = updateData.motocep;
    
          if (!cepMoto || !/^\d{5}-?\d{3}$/.test(cepMoto)) {
            return res.status(400).json({ message: "CEP inválido." });
          }
    
          const response = await fetch(`https://viacep.com.br/ws/${cepMoto}/json/`);
          const cepData = await response.json();
    
          if (cepData.erro) {
            return res.status(400).json({ message: "CEP não encontrado." });
          }
    
    try {
      const updateMoto = await driverRegister.updateDriver(motoId, updateData);

      if (!updateMoto) {
        return res
          .status(404)
          .json({
            message: "Atualizaçao não foi bem sucedida.",
          });
      }
        const io = req.app.get("socketio");

      if (io) {
        io.emit("updateRunTimeTableDrive", updateMoto);
      } else {
        console.warn("Socket.IO não está configurado.");
      }
      res.status(200).json({
        message: "Motorista atualizado com sucesso",
        Motorista: updateMoto,
      });
    } catch (error) {
      console.error("Erro ao atualizar o Motorista:", error);
      res.status(500).json({ message: "Erro ao atualizar o Motorista", error });
    }
  },

  async updateStatusDriver(req, res) {
    try {
      const { motoId } = req.params;
      const { motostat } = req.body;

      if (!motoId || !motostat) {
        return res.status(400).json({ message: "Dados inválidos" });
      }

      const result = await driverRegister.updateStatusMoto(motoId, motostat);
      if (!result) {
        return res.status(404).json({ message: "Motorista não encontrado" });
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
