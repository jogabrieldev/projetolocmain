import { crudRegisterProd } from "../model/dataProd.js";
import { crudRegisterTypeProd } from "../model/dataTypeProd.js";
const typePro = crudRegisterTypeProd
const prodRegister = crudRegisterProd;

export const movementOfProd = {
  async registerProd(req, res) {
  try {
    const dataProd = req.body;

    if (!dataProd) {
      return res.status(400).json({ message: "Campos obrigatórios não preenchidos." });
    }

   
    const dataParts = dataProd.prodData?.split("-");
    if (!dataParts || dataParts.length !== 3) {
      return res.status(400).json({ message: "Data de cadastro inválida." });
    }

    const [y, m, d] = dataParts.map(Number);
    const dtCd = new Date(y, m - 1, d);
    const hoje = new Date();
    const hoje0 = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

    if (dtCd.getTime() !== hoje0.getTime()) {
      return res.status(400).json({ message: "Data de cadastro deve ser a data de hoje." });
    }

    const valorLiquido = parseFloat(dataProd.prodPeli);
    const valorBruto = parseFloat(dataProd.prodPebr);

    if (isNaN(valorLiquido) || isNaN(valorBruto)) {
      return res.status(400).json({ message: "Valores de preço inválidos." });
    }

    if (valorLiquido > valorBruto) {
      return res.status(400).json({ message: "O preço líquido não pode ser maior que o preço bruto." });
    }

    const codeTypePro = await typePro.getCodeIdtypeP()

    const codeValid = codeTypePro.map(item => item.tiprcode);

    if (!codeValid.includes(dataProd.prodTipo)) {
      return res.status(400).json({ message: "Código do tipo de produto e inválido." });
      }

    const newProd = await prodRegister.registerOfProd(dataProd);
    const listProduto = await prodRegister.listingOfProd();

    const io = req.app.get("socketio");
    if (io) {
      io.emit("updateRunTimeProduto", listProduto);
    }

    res.status(201).json({ success: true, user: newProd });
  } catch (error) {
    console.error("Erro no controller:", error);

    if (error.message.includes("Código do Produto ja cadastrado. Tente outro.")) {
      return res.status(409).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: error.message });
  }
},


  async codeTipoProd(req, res) {
    try {
      const dataTyperod = await prodRegister.buscartipoProd();

      if (dataTyperod) {
        res.status(200).json(dataTyperod);
        return dataTyperod;
      } else {
        return req.status(400).json({ error: "Nenhum dado encontrado" });
      }
    } catch (error) {
      console.error("Erro ao buscar tipo do produto:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  async listofProd(req, res) {
    try {
      const produto = await prodRegister.listingOfProd();
      if(!produto){
          res.status(400).json({message:"Erro na listagem de produtos"})
      }
      res.json(produto).status(200);
    } catch (error) {
      console.error("Erro no controller:", error.message);
      res.status(500).json({
        success: false,
        message: "erro interno no server",
        message: error.message,
      });
    }
  },

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

  async updateProduct(req, res) {
    const prodId = req.params.id;
    const updateData = req.body;

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === "") {
        updateData[key] = null;
      }
    });

    if(!prodId){
      return res.status(400).json({message:'Erro no ID do produto'})
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
      res.json({
        message: "produto atualizado com sucesso",
        produto: updateProd,
      });


    } catch (error) {
      console.error("Erro ao atualizar o bem:", error);
      res.status(500).json({ message: "Erro ao atualizar o produto", error });
    }
  },
};
