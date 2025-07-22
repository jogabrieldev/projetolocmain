import { autoRegister } from "../model/modelsVehicles.js";

export const movementAuto = {

  async registerAuto(req, res) {
  try {
    const dataAuto = req.body;

    if (!dataAuto) {
      return res
        .status(400)
        .json({ message: "Campos obrigatórios não preenchidos." });
    }


    const newAuto = await autoRegister.registerAuto(dataAuto);
    if(!newAuto){
      return res.status(400).json({message: 'Erro ao gerar cadastro de um automovel'})
    }

    const io = req.app.get("socketio");
    if (io) {
      const automovel = await autoRegister.listAutos();
      io.emit("updateRunTimeAutomovel", automovel);
    }

   return res.status(200).json({ success: true, automovel: newAuto });

  } catch (error) {
    console.error("Erro no controller para cadastrar veiculo:", error);

    if (error.message.includes("Código do veiculo já cadastrado. Tente outro.")) {
      return res.status(409).json({ success: false, message: error.message });
    }

     return res.status(500).json({ success: false, message: "Erro interno no servidor." });
  }
},

async getAutomovelByCode(req, res) {
    const { caaucode, caauplac } = req.query;
   
  try {
    if (!caaucode && !caauplac) {
      return res.status(400).json({ message: "Informe o código ou placa para a busca." });
    }

    const veiculo = await autoRegister.searchVehicle(caaucode , caauplac) ;

    if (!veiculo || veiculo.length === 0) {
      return res.status(404).json({ message: "Nenhum veiculo encontrado." });
    }

    return res.status(200).json({ success: true, veiculo });
  } catch (error) {
    console.error("Erro ao buscar veiculo:", error);
    return res.status(500).json({ message: "Erro ao buscar veiculo." });
  }
},

  async listingOfAuto(req, res) {
    try {
      const autos = await autoRegister.listAutos();
      if(!autos){
        return res.status(400).json({message:'Erro na listagem de veiculos'})
      }
      return res.status(200).json(autos);
    } catch (error) {
      console.error("Erro no controller ao listar veiculo", error.message);
      return res.status(500).json({
        success: false,
        message: "Erro interno no servidor",
        error: error.message,
      });
    }
  },

  
  async deleteOfAuto(req, res) {
    try {
      const { id } = req.params;

      if(!id){
        return res.status(400).json({message: 'Não foi passado o ID do veiculo'})
      }

      const deletedAuto = await autoRegister.deleteAuto(id);

      if (!deletedAuto) {
        return res.status(404).json({ message: "Registro não encontrado" });
      }
      return res.status(200).json({
        message: "Registro apagado com sucesso",
        auto: deletedAuto,
      });
    } catch (error) {
      console.error("Erro ao apagar registro do veiculo:", error);
      return res.status(500).json({ message: "Erro no servidor" });
    }
  },

  async updateOfAuto(req, res) {
    const autoId = req.params.id;
    const updateAuto = req.body;

    if(!updateAuto || ! autoId){
       return res.status(400).json({message:'Falta de informações para atualizar verifique por favor'})
    }

    Object.keys(updateAuto).forEach((key) => {
      if (updateAuto[key] === "") {
        updateAuto[key] = null;
      }
    });

    try {
       
      const io = req.app.get("socketio");
      const updatedAuto = await autoRegister.updateAuto(autoId, updateAuto);

      if(!updateAuto){
        return res.status(404).json({ message: "Erro para atualizar veiculo." });
      }
       
      if (io) {
        io.emit("updateTableAutomovel", updateAuto);
      } else {
        console.warn("Socket.IO não está configurado.");
      }
       return res.json({
        message: "Registro atualizado com sucesso",
        auto: updatedAuto,
      });
    } catch (error) {
      console.error("Erro ao atualizar o registro:", error);
      return res.status(500).json({ message: "Erro ao atualizar o veiculo", error });
    }
  },

  async updateStatusVehicle(req , res){
      try {
           const {id} = req.params
           const {caaustat} = req.body

           if(!id || !caaustat){
             return res.status(400).json({message: 'falta informações para atualizar o status'})
           }

           const update = await autoRegister.updateStatus(id , caaustat)
           if(!update){
             return res.status(400).json({message:'Erro em atualizar o status'})
           }

           return  res.status(200).json({success: true  , status: update.caaustat})
      } catch (error) {
         console.log('Erro na atualização do status do veiculo' ,error)
          return res.status(500).json({message:'Erro no server na atualização do status do veiculo', success:false})
      }
  }
};
