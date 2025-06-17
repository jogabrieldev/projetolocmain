
import {modelsLocationAuto} from '../model/dataLocationAutomovel.js'
import { LocacaoModel } from "../model/location.js";

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
     
       if (!dateClient||dateClient.client.length < 2) {
        return res.status(400).json({ error: "CPF do cliente é obrigatório." });
      }

      const client = dateClient.client
      
      const cpfClient = client[1];
     
      const cliente = await LocacaoModel.buscarClientePorCPF(cpfClient);
    
      if (!cliente) {
        return res.status(404).json({ error: "Cliente não encontrado." });
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
        cllocpf: cpfClient,
        clloresi: cliente.clloresi,
        cllorua:localization.localizationRua,
        cllobair:localization.localizationBairro,
        cllocida:localization.localizationCida,
        cllocep:localization.localizationCep,
        cllorefe:localization.localizationRefe,
        clloqdlt:localization.localizationQdLt
      }); 

        await modelsLocationAuto.registerLocationAuto(veiculo, locationClient)
    
        return res.status(200).json({message: 'Locaçaõ do veiculo veita' , success:true })
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