import { crudRegisterDriver as driverRegister } from "../model/modelsDriver.js";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const movementOfDriver = {

  async registerOfDriver(req, res) {
    try {
      const data = req.body;
      console.log('data' , data)

      if (!data) {
        return res
          .status(400)
          .json({ message: "Campos obrigatórios não preenchidos." });
      }

      
      const saltRounds = 10;

      if (!data.motoPasw || data.motoPasw.length < 6) {
         return res.status(400).json({
          success: false,
          message: "A senha é obrigatória e deve ter pelo menos 6 caracteres.",
        });
      }

     data.motoPasw = await bcrypt.hash(data.motoPasw, saltRounds);
        
  
      const newDriver = await driverRegister.registerDriver(data);
      if(!newDriver){
        return res.status(400).json({message:"Erro para cadastrar o motorista"})
      }

      const listDriver = await driverRegister.listingDriver();

      const io = req.app.get("socketio");
      if (io) {
        io.emit("updateRunTimeDriver", listDriver);
      }

      return res.status(200).json({ success: true, Motorista: newDriver });
    } catch (error) {
      console.error("erro no controller", error);

      if (error.message.includes("Código do motorista ja cadastrado")) {
        return res.status(409).json({ success: false, message: error.message });
      }

      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getDriverByCode(req ,res){
       
    try {
      const {motoristaid} = req.params

      if(!motoristaid){
        return res.status(400).json({message:"ID do motorista não passado"})
      }

      const success = await driverRegister.getDriverByCode(motoristaid)
      if(!success){
        return res.status(400).json({message:"Erro ao buscar o motorista"})
      }

      return res.status(200).json({success:true , motorista:success})
    } catch (error) {
       console.error('Erro ao buscar motorista')
       return res.status(500).json({message:"Erro no server ao buscar motorista" , success:false})
    }
  },

  async searchDriver(req, res) {

   const { motocode, status , situacao } = req.query;
     
    try {
      if (!motocode && !status && !situacao ) {
        return res.status(400).json({ message: "Informe o código, status ou situação para a busca."});
      }
  
      const driver = await driverRegister.searchDriver(motocode , status , situacao);
  
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
      return res.status(200).json(motorista);
    } catch (error) {
      console.error("erro no controller", error.message);
      return res.status(500).json({
        success: false,
        message: "erro interno no server",
        message: error.message,
      });
    }
  },

  async deleteOfDriver(req, res) {
    const { id } = req.params;
     try {

      if(!id){
         return res.status(400).json({message:"ID do motorista não foi passado"})
      }

      const verificarEntregas = await driverRegister.verificarEntregaComMotorista(id);
      if (verificarEntregas) {
        return res.status(400).json({
          message:
            "Não é possível excluir. O motorista tem entregas pendentes ou está em entrega.",
        });
      }

      const verificarMotoristaExterno = await driverRegister.verificarVeiculoComMotorsitaExterno(id)
      if(verificarMotoristaExterno){
        return res.status(400).json({message:"Não e possivel excluir. O motorista esta vinculado ao seu veiculo externo"})
      }
      const deleteMotorista = await driverRegister.deleteDriver(id);

      if (!deleteMotorista) {
        return res.status(404).json({ message: "Motorista Não encontrado" });
      }
      return res.status(200).json({
        message: "componente Apagado com sucesso",
        motorista: deleteMotorista,
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

    if(!motoId || !updateData){
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
        return res.status(404).json({message: "Atualizaçao não foi bem sucedida.",});
      }
      const io = req.app.get("socketio");

      if (io) {
        io.emit("updateRunTimeTableDrive", updateMoto);
      } else {
        console.warn("Socket.IO não está configurado.");
      }
      return res.status(200).json({message: "Motorista atualizado com sucesso", Motorista: updateMoto});
    } catch (error) {
      console.error("Erro ao atualizar o Motorista:", error);
       return res.status(500).json({ message: "Erro ao atualizar o Motorista", error });
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

      return res.status(200).json({ message: "Status atualizado com sucesso!", status: result.motostat });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      return res.status(500).json({ message: "Erro no servidor para atualizar status motorista" });
    }
  },

};
