import logistcsModel from "../model/modelsLogistics.js";
import{mecanismDelivey} from "../model/modelsDelivery.js"
import { crudRegisterDriver as authDriver } from "../model/modelsDriver.js";
import { goodsRegister as authGoods} from "../model/modelsGoods.js";
import { clientRegister as authClient } from "../model/modelsClient.js";


class logistcgController {

  async submitDateForLogistcs(req, res) {
    try {
      const {payloadLogistcs} = req.body;

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
        res.status(200).json({ message: result });
      }  

      const listDelivery = await mecanismDelivey.getDateLocationFinish()
      if(!listDelivery){
         return res.status(400).json({message: 'Erro ao listar entrega'})
      }

      const io = req.app.get("socketio");
      if (io) {
        io.emit("updateRunTimeRegisterLinkGoodsLocation", listDelivery);
      }
    } catch (error) {
      console.error('Erro Logistica Controller:' , error)
      res.status(500).json({ sucess: false, message: error.message });
    }
  }
  
};

export default new logistcgController();
