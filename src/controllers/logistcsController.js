import logistcsModel from "../model/logisticsModel.js";

class logistcgController {
  async postData(req, res) {
    try {
      const data = req.body;
      console.log("requisição no corpo:", req.body);
      const result = await logistcsModel.post(data);
      res.status(200).json({ message: result });
    } catch (error) {
      res.status(500).json({ sucess: false, message: error.message });
    }
  }
}

export default new logistcgController();
