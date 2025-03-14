import logistcsModel from "../model/logisticsModel.js";

class logistcgController {

  async postData(req, res) {
    try {
      const data = req.body;
      const motorista = req.body.driver

      const result = await logistcsModel.post(data , motorista);
      if(result){
        res.status(200).json({ message: result });
      }  
     
    } catch (error) {
      console.error('Erro Logistica Controller:' , error)
      res.status(500).json({ sucess: false, message: error.message });
    }
  }
}

export default new logistcgController();
