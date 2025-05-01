import logistcsModel from "../model/logisticsModel.js";
import{mecanismDelivey} from "../model/deliveryModel.js"

class logistcgController {

  async postData(req, res) {
    try {
      const data = req.body;
      const motorista = req.body.driver

      if(!data || !motorista){
        res.status(404).json({message:"Não foi passado os dados"})
      }

      const result = await logistcsModel.post(data , motorista);
      if(result){
        res.status(200).json({ message: result });
      }  

      const listDelivery = await mecanismDelivey.getDateLocationFinish()

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
