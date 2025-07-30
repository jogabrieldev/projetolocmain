
import { processDriverExternoWithVehicles as linkVehicle } from "../model/modelsDriverExternoWithVehicle.js";

export const controllerLinkVehicleWithDriver = {
  async registerLinkVehicleWithDriver(req, res) {
    try {
      const { codeMoto, codeVeic } = req.body;

      console.log(req.body)

      if (!codeMoto || !codeVeic) {
        return res.status(400).json({ message: "Nao foi passado os codigos para vinculação" });
      }

       const listDriverWithVehicle = await linkVehicle.getDriverWithVehicle()
       const codeDriver = listDriverWithVehicle.map((item)=> item.seexmoto)
       if(codeDriver.includes(codeMoto)){
         return res.status(400).json({message:"Esse motorista ja esta vinculado a um veiculo"})
       }
        
      //  console.log('code' , codeDriver)

      const linkSuccess = await linkVehicle.registerDriverWithVehicle(codeMoto,codeVeic);
      if (!linkSuccess) {
        return res.status(400).json({ message: "ERRO para vincular o veiculo com o motorista", success:false });
      }
      return res.status(200).json({ message: "Vinculado com sucesso", success: true, linkSuccess:linkSuccess });

    } catch (error) {
      console.error("Erro no server para vincular motorista ao veiculo");
      return res.status(500).json({message:"Erro no server para vincular o motorista ao veiculo" , success:false })
    }
  },

   async getAllDriverExternoWithVehicle(req ,res){
       try {
          const list = await linkVehicle.getDriverWithVehicle()
          if(list){
            return res.status(200).json({success:true ,driver:list ,  message:"Busca feita com sucesso"})
          }
       } catch (error) {
        console.error('Erro parar listar motorista externos com seus veiculos')
         return res.status(500).json({message:"Erro para listar os motoristas externos com seus veiculos"})
       }
   },
   
  async getVehicleTheDriver(req ,res){
      try {
          const {id} = req.params
          if(!id){
            return res.status(400).json({message:"E Obrigatorio passar o ID para busca"})
          }

          const result = await linkVehicle.getVehicleTheDriver(id)
          if(!result){
             return res.status(400).json({message:"Não foi encontrado nenhum veiculo vinculado a esse motorista"})
          }

          return res.status(200).json({success:true , message:"Veiculo do motorista encontrado", result:result})
      } catch (error) {
        console.error('Erro para verificar se o motorista tem veiculo')
        return res.status(500).json({message:"Erro para verificar se o motorista tem veiculo" , success:false})
      }
  }

};
