import { goodsRegister } from "../model/modelsGoods.js";
import { crudRegisterForn as infoForn } from "../model/modelsFornecedor.js";
import { crudRegisterFamilyGoods as validFamily } from "../model/modelsFamilyGoods.js";

export const movementGoods = {

  async registerBens(req, res) {
  try {
    const data = req.body;
  
    if (!data) {
      return res.status(400).json({ message: "Nenhum dado enviado" });
    }

    //  Validação de datas
    const hoje = new Date();
    const hojeFormatada = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

    const isDataValida = (str) => {
      const date = new Date(str);
      return str && !isNaN(date.getTime());
    };
    const formatDate = (date) => {
      return date.toISOString().split("T")[0]; 
    };

    // 1) Validação de dtCompra
    if (!isDataValida(data.dtCompra)) {
      return res.status(400).json({ message: "Data de compra inválida." });
    }

    const hojeFormatadaStr = formatDate(new Date());
    const dtStatusStr = formatDate(new Date(data.dtStatus));

    if (dtStatusStr !== hojeFormatadaStr) {
      return res.status(400).json({ message: "A data de status deve ser igual à data atual." });
    }

    const dtCompra = new Date(data.dtCompra);
    const dtCompraFormatada = new Date(dtCompra.getFullYear(), dtCompra.getMonth(), dtCompra.getDate());
    if (dtCompraFormatada > hojeFormatada) {
      return res.status(400).json({ message: "A data da compra deve ser menor ou igual à data atual." });
    }

    // 2) Validação de dtStatus
    if (!isDataValida(data.dtStatus)) {
      return res.status(400).json({ message: "Data de status inválida." });
    }
    
    // 3) Validação do ano do modelo vs ano de compra
    if (data.bensAnmo) {
    const dataModelo = new Date(data.bensAnmo);
    const dtCompra = new Date(data.dtCompra);

  if (isNaN(dataModelo.getTime())) {
    return res.status(400).json({ message: "Data do modelo inválida." });
  }

  if (dataModelo > dtCompra) {
    return res.status(400).json({ message: "A data do modelo não pode ser maior que a data da compra." });
  }
}

    const codigosFamilia = await goodsRegister.buscarIdFamiliaBens(); 
    const codigosValidos = codigosFamilia.map(item => item.fabecode); 

    if (!codigosValidos.includes(data.cofa)) {
      return res.status(400).json({ message: "Código da família de bens inválido." });
      }
  

    const codigosFornecedor = await infoForn.buscarIdForn(); 
    const codeValid = codigosFornecedor.map(item => item.forncode);

    if (!codeValid.includes(data.cofo)) {
      return res.status(400).json({ message: "Código do fornecedor de bens inválido." });
      }
    
   
    const newBens = await goodsRegister.registerOfBens(data);
    if(!newBens){
       return res.status(400).json({message:'Erro para cadastrar bem'})
    }
    const bens = await goodsRegister.listingBens();

    const io = req.app.get("socketio");
    if (io) {
      io.emit("updateRunTimeGoods", bens);
    }

    return res.status(200).json({ success: true, Bem: newBens });

  } catch (error) {
    if (error.message.includes("Código do Bem ja cadastrado. Tente outro.")) {
      return res.status(409).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
},



async getbensByCode(req, res) {
    const { benscode, status } = req.query;
   
  try {
    if (!benscode && !status) {
      return res.status(400).json({ message: "Informe o código ou status para a busca." });
    }

    const bens = await goodsRegister.getGoodsById(benscode, status);

    if (!bens || bens.length === 0) {
      return res.status(404).json({ message: "Nenhum bem encontrado." });
    }

    return res.status(200).json({ success: true, bens });
  } catch (error) {
    console.error("Erro ao buscar bens:", error);
    return res.status(500).json({ message: "Erro ao buscar bens." });
  }
},

  async pegarBemPorID(req ,res){
     try {
        const {id} = req.params
        if(!id){
          return res.status(400).json({message:"É necessário passar o ID do bem"})
        }
        const bem = await goodsRegister.pegarbemPorID(id)
        if(!bem){
          return res.status(404).json({message:"Bem não encontrado"})
        }

        return res.status(200).json({success:true , message:"busca feita com sucesso" , bem })
     } catch (error) {
        console.error("Erro ao buscar bem por ID:", error);
        return res.status(500).json({ message: "Erro ao buscar bem por ID." });
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
      if(!bens){
         return res.status(400).json({ error: "Erro na listagem de bens" });
      }
      return res.status(200).json({success: true , bens});
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

    if(!bemId){
       return res.status(400).json({ message: "Código do bem não fornecido." });
    }

    const idBem = await goodsRegister.getAllBemId()
    const codeValid = idBem.map(item => item.benscode);

    if (!codeValid.includes(bemId)) {
      return res.status(400).json({ message: "Código do bem e inválido." });
      }
     
      const codeFamily = await goodsRegister.buscarIdFamiliaBens(); 
      const codigosValidos = codeFamily.map(item => item.fabecode); 

    if (!codigosValidos.includes(updatedData.benscofa)) {
      return res.status(400).json({ message: "Código da família de bens inválido." });
      }
  

    const codigosForne= await infoForn.buscarIdForn(); 
    const valiCode = codigosForne.map(item => item.forncode);

    if (!valiCode.includes(updatedData.benscofo)) {
      return res.status(400).json({ message: "Código do fornecedor de bens inválido." });
      }
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

  async updateStatus(req, res) {
    try {
      const { bemId } = req.params; 
      const { bensstat } = req.body; 
     
      if (!bemId || !bensstat) {
        return res.status(400).json({ message: "Dados inválidos" });
      }

      if(bensstat !== "Disponível" && bensstat !== "Locado"){
        return res.status(400).json({message:"O status passado e invalido no processo!"})
      }

      const result = await goodsRegister.updateStatus(bemId, bensstat);

      if (!result) {
        return res.status(404).json({ message: "Bem não encontrado" });
      }

      return res.status(200).json({ message: "Status atualizado com sucesso!", success:true , status: result.bensstat });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      return res.status(500).json({ message: "Erro no servidor na atualização do status" });
    }
  },
};
