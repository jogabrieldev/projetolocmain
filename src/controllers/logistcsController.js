import logistcsModel from "../model/logisticsModel.js";
import{mecanismDelivey} from "../model/deliveryModel.js"
import { crudRegisterDriver } from "../model/dataDriver.js";
import { goodsRegister } from "../model/dataGoods.js";
import { clientRegister } from "../model/dataClient.js";
const authClient = clientRegister
const authGoods = goodsRegister
const authDriver = crudRegisterDriver

class logistcgController {

  async postData(req, res) {
    try {
      const data = req.body;
      console.log('corpo envido' , data)
  
      if(!data){
        res.status(404).json({message:"Não foi passado nenhum dado"})
      }

      if(!data.bemId || !data.idClient || !data.driver || !data.devolution || !data.locationId ){
          return res.status(400).json({ message: "Falta informações para conclusão" });
      }

      const drive = await authDriver.getAllDriverId();
      const codeValid = drive.map(item => item.motocode);
      
      if (!codeValid.includes(data.driver)) {
        return res.status(400).json({ message: "Código do motorista inválido." });
      }
      
      const goods = await authGoods.getAllBemId()
      const codeValidGoods = goods.map(item => item.benscode); 

      if (!codeValidGoods.includes(data.bemId)) {
        return res.status(400).json({ message: "Código do Bem inválido." });
        }
      
      const client = await authClient.getAllClientId()
      const codeValidClient = client.map(item=> item.cliecode)

      if(!codeValidClient.includes(data.idClient)){
         return res.status(400).json({message:'Codigo do cliente e invalido'})
      }
    
      const result = await logistcsModel.post(data);
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
   
  async getItensVinculados(req, res) {
  try {
    const { clloid } = req.params;

    if (!clloid) {
      return res.status(400).json({ message: "Parâmetro clloid é obrigatório" });
    }

    const result = await logistcsModel.getItensVinculadosPorLocacao(clloid);

    if (result.length === 0) {
      return res.status(200).json({ message: "Nenhum bem vinculado a esta locação.", data: [] });
    }

    return res.status(200).json({ data: result });
  } catch (error) {
    console.error("Erro no getItensVinculados:", error);
    return res.status(500).json({ message: "Erro ao buscar itens vinculados", error: error.message });
  }
}

};

export default new logistcgController();
