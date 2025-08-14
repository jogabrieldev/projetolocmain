
import {modelsLocationAuto} from '../model/modelsLocationVehicle.js'
import { LocacaoModel } from "../model/modelsLocationGoods.js";

export const controllerLocationVehicle = {

      
async dataLocacaoVehicle(req ,res){
       
 try {
          
  // console.log('req body' , req.body)
    const isLocacaoVeiculo = req.body;
  
     const veiculo = isLocacaoVeiculo.veiculos

     const dateClient = isLocacaoVeiculo.client

     const localization = isLocacaoVeiculo.client.localization

     const cliente = req.clienteValidado;
      
 

       const locationClient = await LocacaoModel.criarLocacao({
        cllonmlo: dateClient.cllonmlo,
        clloidcl: cliente.cliecode,
        cllodtdv: dateClient.cllodtdv,
        cllodtlo: dateClient.cllodtlo,
        cllopgmt: dateClient.cllopgmt,
        clloclno: cliente.clienome,
        cllocpcn: cliente.cliecpf || cliente.cliecnpj,
        clloresi: dateClient.clloresi,
        cllodesc: dateClient.cllodesc,
        cllorua:localization.localizationRua,
        cllobair:localization.localizationBairro,
        cllocida:localization.localizationCida,
        cllocep:localization.localizationCep,
        cllorefe:localization.localizationRefe,
        clloqdlt:localization.localizationQdLt
      }); 


       const camposInvalidos = veiculo.some((v, index) => {
          return (  !v.code || v.code.trim() === "" ||  !v.carga || v.carga.trim() === "" ||!v.quantidade || isNaN(v.quantidade) || Number(v.quantidade) <= 0
         );
      });
       if (camposInvalidos) {
           return res.status(400).json({message: "Preencha todos os campos referente ao veiculo corretamente"})
        
        }

          const contrato = req.body.contrato || null;
        const result = await modelsLocationAuto.registerLocationAuto(veiculo, contrato, locationClient)
        if(!result){
           return res.status().status(400).json({message: "Erro para locar o veiculo"})
        }

        console.log('result' , result)
    
        return res.status(200).json({message: 'Locaçaõ do veiculo feita com sucesso!' , success:true , result})
    } catch (error) {
      console.error('Erro no locaçãp veiculo' , error)
      return res.status(500).json({message: 'Erro no servidor'})
    }
  },

    
  async getLocationVehicles(req ,res){
       try {
      const locacaoFinishVehicles = await modelsLocationAuto.buscarTodasLocacoes();

      if (!locacaoFinishVehicles|| locacaoFinishVehicles.length === 0) {
        return res.status(404).json({ message: 'Nenhuma locação de veiculos encontrada' , success:false });
      }
  
      return res.status(200).json({ locacoes: locacaoFinishVehicles }); 
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar os dados de locação" });
    }
  },

  async deleteLocationVehicles(req , res){
       
    const {id} = req.params

    console.log('identificador' , id)

    try {
      
      const deleteSuccess = await modelsLocationAuto.deleteLocationVehicles(id);

    if (!deleteSuccess) {
      return res.status(404).json({ message: "Locação não encontrada" });
    }

    return res.status(200).json({
      message: "Locação apagada com sucesso",
    });
    } catch (error) {
       console.error('Erro para deletar locação do veiculo')

       res.status(500).json({message: 'Erro no server para deletar'})
    }
  },
  async updateContrato(req, res) {
  const { id } = req.params; // velocode
  const { contrato } = req.body;

  console.log("Recebido PUT contrato:", req.params.id, req.body.contrato);


  if (!contrato || contrato.trim() === "") {
    return res.status(400).json({ error: "Contrato não pode estar vazio." });
  }

  try {
    const result = await modelsLocationAuto.updateContratoVeiculo(id, contrato);

    return res.status(200).json({ message: "Contrato atualizado com sucesso!", success: true , result });
  } catch (error) {
    console.error("Erro ao atualizar contrato:", error);
    return res.status(500).json({ error: "Erro interno ao atualizar contrato." });
  }
}


}