import LogistcsModel from "../model/modelsLogistics.js";
import{mecanismDelivey} from "../model/modelsDelivery.js"
import LogisticsService from "../service/logisticsService.js"

class logistcgController {

  // vinculando o BEM na locação e gerando a entrega
  async submitDateForLogistcs(req, res) {
    try {
      const {payloadLogistcs} = req.body;

      if(!payloadLogistcs){
        return res.status(404).json({message:"Não foi passado nenhum dado"})
      };

      if(!payloadLogistcs.bemId || !payloadLogistcs.idClient || !payloadLogistcs.driver || !payloadLogistcs.devolution || !payloadLogistcs.locationId ){
          return res.status(400).json({ message: "Falta informações para conclusão verifique!" });
      };


      const result = await LogisticsService.handleSubmit(payloadLogistcs);
      if (!result) {
        return res.status(409).json({ message: "Erro ao registrar logística" });
      }

      const io = req.app.get("socketio");
        if (io) {
        const listDelivery = await mecanismDelivey.getDateLocationFinish();
        if(listDelivery){
        io.emit("updateRunTimeRegisterLinkGoodsLocation", listDelivery);
     }
  };

    return res.status(200).json({ success:true , message:"Caçamba vinculada com sucesso" ,  result });
  

    } catch (error) {
      console.error('Erro Logistica Controller:' , error)
      res.status(500).json({ sucess: false, message: error.message });
    };
  };

  // buscando contrato
  async getAll(req ,res){
      try {
         const {id}  = req.params;

          if(!id){
            return res.status(400).json({message:"É necessário passar o ID da locação"})
          }

          const result = await LogistcsModel.getContratosPorLocacao(id)
          if(!result){
            return res.status(404).json({message:"Nenhum contrato encontrado para este ID"})
          }

          return res.status(200).json({success:true , message:"Busca feita com sucesso" , result})
      } catch (error) {
         console.error('Erro ao listar dados no controller Logistica' , error)
         res.status(500).json({message: 'Erro ao listar dados no controller Logistica'})
  }
   };

   // Buscar entrega por codigo de locação  , status , ou IDcliente
   async searchLocationForParams(req ,res){
   
       const {lofiidlo, lofistat, lofiidcl} =req.query
         
        try {
           if (!lofiidlo && !lofistat && !lofiidcl) {
            return res.status(400).json({ message: "Dados da locação são obrigatorio para pesquisa." });
         }
          
         const resultLocation = await LogistcsModel.searchLocationForParams(lofiidcl,lofistat,lofiidcl)
         console.log(resultLocation)
          if(!resultLocation){
           return res.status(404).json({message:"Não foi encontrado nenhuma locação com essa pesquisa! verifique"})
          }
          
         return res.status(200).json({success:true , resultLocation});
        } catch (error) {
            console.error("Erro ao pesquisar por locação:", error);
           return res.status(500).json({ message: "Erro ao pesquisar por locação" , success:false });
         }
   }

   // Atualizar contrato de locação de bens
   async updateContratoWithGoods(req ,res){
      try {
        const {id} = req.params;
        const {contrato} = req.body;

        if(!id || !contrato){
          return res.status(400).json({message:"É necessário passar o ID e o corpo da requisição"})
        }

        const result = await LogistcsModel.getContratoAndUpdate(id , contrato);

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
 


