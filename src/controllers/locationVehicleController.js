
import {modelsLocationAuto} from '../model/modelsLocationVehicle.js'
import { LocacaoModel } from "../model/modelsLocationGoods.js";

export const controllerLocationVehicle = {

      
async dataLocacaoVehicle(req ,res){
       
 try {
          
    const isLocacaoVeiculo = req.body;
  
     const veiculo = isLocacaoVeiculo.veiculos

     const dateClient = isLocacaoVeiculo.client

     const localization = isLocacaoVeiculo.client.localization
     
       if(!localization){
         return res.status(400).json({error: 'Insira um endereço para a locação'})
       }

       if(!isLocacaoVeiculo.contrato|| null){
         return res.status(400).json({error:'Erro para enviar o contrato'})
       }
       const contrato = isLocacaoVeiculo.contrato
     
       if (!dateClient||dateClient.client.length < 2) {
        return res.status(400).json({ error: "CPF do cliente é obrigatório." });
      }

      console.log('veiculo' , veiculo)

        const ClientDate = dateClient.client[1].replace(/\D/g, ''); 

     let cliente = null;

if (ClientDate.length === 11) {
  
  cliente = await LocacaoModel.buscarClientePorCPF(ClientDate);
} else if (ClientDate.length === 14) {
 
  cliente = await LocacaoModel.buscarClientePorCnpj(ClientDate);
} else {
  return res.status(400).json({ error: "Formato de CPF ou CNPJ inválido." });
}

if (!cliente) {
  return res.status(404).json({ error: "Cliente não encontrado no banco de dados." });
}
    //   // Verificações de data
      if (!dateClient.cllodtlo || !dateClient.cllodtdv) {
        return res.status(400).json({ error: "Data de locação e devolução são obrigatórias." });
      }
  
      const dataLocDate = new Date(dateClient.cllodtlo);
      const dataDevoDate = new Date(dateClient.cllodtdv);
  
      if (isNaN(dataLocDate) || isNaN(dataDevoDate)) {
        return res.status(400).json({ error: "Formato de data inválido." });
      }
  
      // Normalizar datas para comparar apenas a parte da data (sem hora)
      const normalizar = (data) => new Date(data.getFullYear(), data.getMonth(), data.getDate());
  
      const dataLocNormalizada = normalizar(dataLocDate);
      const dataDevoNormalizada = normalizar(dataDevoDate);

      if (dataDevoNormalizada <= dataLocNormalizada) {
        return res.status(400).json({ error: "A data de devolução deve ser posterior à data da locação." });
      }
       
      const feriados = [
        "01-01", // Confraternização Universal
        "04-18", // Sexta-feira Santa
        "04-21", // Tiradentes
        "05-01", // Dia do Trabalho
        "09-07", // Independência do Brasil
        "10-12", // Nossa Senhora Aparecida
        "11-02", // Finados
        "11-15", // Proclamação da República
        "12-25"  // Natal
      ];

      const formatDiaMes = (data) => {
      const dia = String(data.getDate()).padStart(2, "0");
      const mes = String(data.getMonth() + 1).padStart(2, "0");
      return `${mes}-${dia}`;
    };

    const dataDevoDiaMes = formatDiaMes(dataDevoNormalizada);
    if (feriados.includes(dataDevoDiaMes)) {
      return res.status(400).json({ error: `A data de devolução (${dataDevoDate}) cai em um feriado. Escolha outra data.` });
    }

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
        await modelsLocationAuto.registerLocationAuto(veiculo, contrato, locationClient)
    
        return res.status(200).json({message: 'Locaçaõ do veiculo feita com sucesso!' , success:true })
    } catch (error) {
      console.error('Erro no locaçãp veiculo' , error)
      res.status(500).json({message: 'Erro no servidor'})
    }
  },

    
  async getLocationVehicles(req ,res){
       try {
      const locacaoFinishVehicles = await modelsLocationAuto.buscarTodasLocacoes();

      if (!locacaoFinishVehicles|| locacaoFinishVehicles.length === 0) {
        return res.status(404).json({ message: 'Nenhuma locação encontrada' });
      }
  
      return res.status(200).json({ locacoes: locacaoFinishVehicles }); 
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar os dados de locação" });
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
  }

}