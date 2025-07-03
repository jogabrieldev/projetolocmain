import { crudRegisterTypeProd as typeProdRegister } from "../model/dataTypeProd.js";

export const movementOfTypeProd = {
  async registerTyperProd(req, res) {
    try {
      const dataTypeProd = req.body;

      if (!dataTypeProd) {
        return res
          .status(400)
          .json({ message: "campos obrigatorios não preenchidos" });
      }

      const newTypeProd = await typeProdRegister.registerTypeProd(dataTypeProd);
      if(!newTypeProd){
        return res.status(400).json({message:'Erro ao gerar um novo tipo de produto'})
      }
      const listTypeProd = await typeProdRegister.listTypeProd();
      if(!listTypeProd){
        return res.status(400).json({message:'Erro ao listar tipo de produto para socket'})
      }

      const io = req.app.get("socketio");
      if (io) {
        io.emit("updateRunTimeTypeProduto", listTypeProd );
      }
      res.status(201).json({ success: true, user: newTypeProd });
    } catch (error) {
      console.error("erro no controller");

      if (error.message.includes("Código do tipo de produto ja cadastrado. Tente outro.")) {
        return res.status(409).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getTypeProductByCode(req, res) {
    const { tiprCode } = req.query;
       
      try {
        if (!tiprCode) {
          return res.status(400).json({ message: "Informe o código do tipo de produto." });
        }
    
        const typeProduct = await typeProdRegister.getTypeProductById(tiprCode);
      
        if (!typeProduct) {
          return res.status(404).json({ message: "Nenhum tipo encontrado com esse codigo." });
        }
      
        return res.status(200).json({ success: true, typeProduct });
        } catch (error) {
          console.error("Erro ao buscar tipo de produto :", error);
          return res.status(500).json({ message: "Erro ao buscar tipo de produto." });
        }
     },
  

  async listingOfTypeProd(req, res) {
    try {
      const produto = await typeProdRegister.listTypeProd(req, res);
      if(!produto){
         return res.status(400).json({message:'Erro ao listar tipos de produto'})
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

  async deleteOfTypeProd(req, res) {
    const { id } = req.params;
    try {
      const verificar = await typeProdRegister.verificarDependeciaDetipoProd(
        id
      );

      if (verificar) {
        return res.status(400).json({
          message:
            "Não e possivel excluir. Temos produtos vinculado a esse tipo",
        });
      }

      const deleteComponent = await typeProdRegister.deleteTypeProd(id);

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

  async updateOfTypeProd(req, res) {
    const prodId = req.params.id;
    const updateData = req.body;

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === "") {
        updateData[key] = null;
      }
    });

    if(!prodId){
      return res.status(400).json({message:"Codigo do tipo de produto invalido"})
    }

     const idTypeProduto = await typeProdRegister.getCodeIdtypeP()
      const codeValid = idTypeProduto.map(item => item.tiprcode);

        if (!codeValid.includes(prodId)) {
          return res.status(400).json({ message: "Código do tipo de produto inválido." });
          }

    try {
      const io = req.app.get("socketio");
      const updateTypeProd = await typeProdRegister.updateTypeProd(prodId, updateData);

      if(!updateTypeProd){
        return res.status(404).json({ message: "Tipo de produto não encontrado para atualização." });
      }
        
      if (io) {
        io.emit("updateRunTimeTableTypeProduto", updateTypeProd); 
      } else {
        console.warn("Socket.IO não está configurado.");
      }
      res.json({
        message: "tipo do produto atualizado com sucesso",
        produto: updateTypeProd,
      });
    } catch (error) {
      console.error("Erro ao atualizar o tipo do produto:", error);
      res
        .status(500)
        .json({ message: "Erro ao atualizar o tipo do produto", error });
    }
  },
};
