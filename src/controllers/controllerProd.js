import { crudRegisterProd as prodRegister} from "../model/modelsProd.js";

export const movementOfProd = {

  // cadastro de produto
  async registerProd(req, res) {
  try {
    const dataProd = req.body;

    if (!dataProd) {
      return res.status(400).json({ message: "Campos obrigatórios não preenchidos." });
    }

    const newProd = await prodRegister.registerOfProd(dataProd);
    if(!newProd){
      return res.status(400).json({message: 'Erro para cadastrar o produto' , success:false})
    }
    const listProduto = await prodRegister.listingOfProd();

    const io = req.app.get("socketio");
    if (io) {
      io.emit("updateRunTimeProduto", listProduto);
    }

   return res.status(200).json({ success: true, produto: newProd });

  } catch (error) {
    console.error("Erro no controller:", error);

    if (error.message.includes("Código do Produto ja cadastrado. Tente outro.")) {
      return res.status(409).json({ success: false, message: error.message });
    }

    return res.status(500).json({ success: false, message: error.message });
  }
},

// buscar produto por codigo
async searchProductByCode(req, res) {
      const { prodCode } = req.query;
    
    try {
      if (!prodCode) {
        return res.status(400).json({ message: "Informe o código do produto." });
      }

      const produto = await prodRegister.getProdutoById(prodCode);
  
      if (!produto) {
        return res.status(404).json({ message: "Nenhum produto encontrado com esse codigo." });
      }
  
      return res.status(200).json({ success: true, produto });
    } catch (error) {
      console.error("Erro ao buscar produto :", error);
      return res.status(500).json({ message: "Erro ao buscar produto." });
    }
 },

// Buscar codigos de tipo de produto
  async codeTipoProd(req, res) {
    try {
      const dataTyperod = await prodRegister.buscartipoProd();

      if (dataTyperod) {
       return res.status(200).json(dataTyperod);
      } else {
        return res.status(400).json({ error: "Nenhum dado encontrado" });
      }
    } catch (error) {
      console.error("Erro ao buscar tipo do produto:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // listagem de produtos
  async listofProd(req, res) {
    try {
      const produto = await prodRegister.listingOfProd();
      if(!produto){
          return res.status(400).json({message:"Erro na listagem de produtos"})
      }
      return res.status(200).json({sucess:true , produto});
    } catch (error) {
      console.error("Erro no controller:", error.message);
      return res.status(500).json({
        success: false,
        message: "erro interno no server",
        message: error.message,
      });
    }
  },

  // deletar produto
  async deleteProd(req, res) {
    try {
      const { id } = req.params;
      const deleteComponent = await prodRegister.deleteOfProd(id);

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

  // atualizar produto
  async updateProduct(req, res) {
    const prodId = req.params.id;
    const updateData = req.body;

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === "") {
        updateData[key] = null;
      }
    });

    if(!prodId || !updateData){
      return res.status(400).json({message:'Não foi passado as informações necessarias'})
    }

     const idProduto = await prodRegister.getCodeProd()
      const codeValid = idProduto.map(item => item.prodcode);

        if (!codeValid.includes(prodId)) {
          return res.status(400).json({ message: "Código do produto inválido." });
          }

    try {
      const io = req.app.get("socketio");
      const updateProd = await prodRegister.updateOfProd(prodId, updateData);
      if(!updateProd){
        return res.status(404).json({ message: "produto não encontrado para atualização." });
      }

      if (io) {
        io.emit("updateRunTimeTableProduto", updateProd); 
      } else {
        console.warn("Socket.IO não está configurado.");
      }
      return res.status(200).json({
        message: "produto atualizado com sucesso",
        produto: updateProd,
      });

    } catch (error) {
      console.error("Erro ao atualizar o bem:", error);
      return res.status(500).json({ message: "Erro ao atualizar o produto", error });
    }
  },
};
