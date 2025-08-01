import logistcsModel from "../model/modelsLogistics.js";
import{mecanismDelivey} from "../model/modelsDelivery.js"
import { crudRegisterDriver as authDriver } from "../model/modelsDriver.js";
import { goodsRegister as authGoods} from "../model/modelsGoods.js";
import { clientRegister as authClient } from "../model/modelsClient.js";

class logistcgController {

  async submitDateForLogistcs(req, res) {
    try {
      const {payloadLogistcs} = req.body;

      console.log('Payload Logistica:' , payloadLogistcs)

      if(!payloadLogistcs){
        res.status(404).json({message:"Não foi passado nenhum dado"})
      }

      if(!payloadLogistcs.bemId || !payloadLogistcs.idClient || !payloadLogistcs.driver || !payloadLogistcs.devolution || !payloadLogistcs.locationId ){
          return res.status(400).json({ message: "Falta informações para conclusão verifique!" });
      }

      const drive = await authDriver.getAllDriverId();
      const codeValid = drive.map(item => item.motocode);
      
      if (!codeValid.includes(payloadLogistcs.driver)) {
        return res.status(400).json({ message: "Código do motorista inválido." });
      }
      
      const goods = await authGoods.getAllBemId()
      const codeValidGoods = goods.map(item => item.benscode); 

      if (!codeValidGoods.includes(payloadLogistcs.bemId)) {
        return res.status(400).json({ message: "Código do Bem inválido." });
        }
      
      const client = await authClient.getAllClientForId()
      const codeValidClient = client.map(item=> item.cliecode)

      if(!codeValidClient.includes(payloadLogistcs.idClient)){
         return res.status(400).json({message:'Codigo do cliente e invalido'})
      }

      const localization = payloadLogistcs.localization

      const result = await logistcsModel.submitDate(payloadLogistcs , localization);
     if(result){
      const io = req.app.get("socketio");
        if (io) {
        const listDelivery = await mecanismDelivey.getDateLocationFinish();
        if(listDelivery){
      io.emit("updateRunTimeRegisterLinkGoodsLocation", listDelivery);
    }
  }

  return res.status(200).json({ success:true , message:"Caçamba vinculada com sucesso" ,  result });
}

    } catch (error) {
      console.error('Erro Logistica Controller:' , error)
      res.status(500).json({ sucess: false, message: error.message });
    }
  }
  async getAll(req ,res){
      try {
         const {id}  = req.params;

          if(!id){
            return res.status(400).json({message:"É necessário passar o ID da locação"})
          }

          const result = await logistcsModel.getContratosPorLocacao(id)
          if(!result){
            return res.status(404).json({message:"Nenhum contrato encontrado para este ID"})
          }

          return res.status(200).json({success:true , message:"Busca feita com sucesso" , result})
      } catch (error) {
         console.error('Erro ao listar dados no controller Logistica' , error)
         res.status(500).json({message: 'Erro ao listar dados no controller Logistica'})
  }
   };

   async updateContratoWithGoods(req ,res){
      try {
        const {id} = req.params;
        const {contrato} = req.body;

        if(!id || !contrato){
          return res.status(400).json({message:"É necessário passar o ID e o corpo da requisição"})
        }

        const result = await logistcsModel.getContratoAndUpdate(id , contrato);

        if(!result){
          return res.status(404).json({message:"Contrato não encontrado ou não atualizado"})
        }

        return res.status(200).json({success:true , message:"Contrato atualizado com sucesso" , result})

        
      } catch (error) {
         console.error('Erro ao atualizar contrato no controller Logistica' , error)
         res.status(500).json({message: 'Erro ao atualizar contrato no controller Logistica'})
      }
   }
 };

 export default new logistcgController();
 


