
import {goodsRegister} from "../model/dataGoods.js";

 export const movementGoods = {

  async registerBens(req, res) {
    try {
      const {data}  = req.body;

      console.log('dados do bem:', req.body)

      const newUser = await goodsRegister.registerOfBens(data);
      res.status(201).json({ success: true, user: newUser });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  

  async codeForn(req ,res){

    try {
      const dataforn = await  goodsRegister.buscarIdForn()
       if(dataforn){
      res.status(200).json(dataforn)
       return dataforn
    }else{
      return req.status(400).json({error: "Nenhum dado encontrado"})
    }
      
    } catch (error) {
       console.error('Erro ao buscar fornecedor', error)
       return res.status(500).json({ error: "Erro interno do servidor" });
    }
    
    
  },

  async codeFamilyBens(req ,res){

    try {
      const dataFamilybens = await goodsRegister.buscarIdFamiliaBens()

      if(dataFamilybens){
      res.status(200).json(dataFamilybens)
      return dataFamilybens

    }else{
      return req.status(400).json({error: "Nenhum dado encontrado"})
    }
      
    } catch (error) {
       console.error("Erro ao buscar família de bens:", error);
       return res.status(500).json({ error: "Erro interno do servidor" });
    }
    
    
  },

  async listBens(req, res) {
    try {
      const bens = await goodsRegister.listingBens();
      res.json(bens).status(200);
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

    // console.log( "esse e meu corpo" ,updatedData)

    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key] === "") {
        updatedData[key] = null;
      }
    });

    try {
      const updatedBem = await goodsRegister.updateBens(bemId, updatedData);
      res.json({ message: "Bem atualizado com sucesso", bem: updatedBem });
    } catch (error) {
      console.error("Erro ao atualizar o bem:", error);
      res.status(500).json({ message: "Erro ao atualizar o bem", error });
    }
  },

  async deletarGoods(req, res) {
    try {
      const { id } = req.params;
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
};


