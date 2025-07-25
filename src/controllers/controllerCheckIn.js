import { movimentCheckInAndCheckOut } from "../model/modelsCheckIn.js";
import { autoRegister as updateRuntime } from "../model/modelsVehicles.js";

 export const controllerCheckInAndCheckOut = {
       
    async toDoCheckIn(req ,res){
      try {
            
         const payloadCheckin = req.body

          if(!payloadCheckin){
            return res.status(400).json({message:'Falta ser passado as informações'})
           }

          if (!payloadCheckin.checStat || payloadCheckin.checStat.trim() === '') {
             payloadCheckin.checStat = 'Em uso';
            }
        
           const newCheckIn =  await movimentCheckInAndCheckOut.toDoCheckIn(payloadCheckin)
           if(!newCheckIn){
             return res.status(400).json({message:"Erro para fazer esse CHECK_IN tente novemente"})
           }
           
          const io = req.app.get("socketio")
           if(io){
            const listVehicle = await updateRuntime.listAutos()
             io.emit("checkIn" , listVehicle)
           }
           return res.status(200).json({success:true , checkin: newCheckIn})
        } catch (error) {
            console.error('Erro para fazer checkin' ,error)
            return res.status(500).json({message:"Erro no sever para fazer checkin."})
        }
    },

    async getCheckInOpen(req ,res){
        try {
            const idMoto = req.params.idMoto
            console.log('id' , idMoto)
             
             if(idMoto){
                
                const status = 'Em uso'
               const verificar = await movimentCheckInAndCheckOut.getCheckInOpen(idMoto , status)
              if(!verificar){
                return res.status(400).json({message: "Não consegui encontrar nenhum registro!"})
              }
             
               return res.status(200).json({success:true , verificar:verificar })
             }
        } catch (error) {
             console.error('não foi encontrado nenhum registro')
             return res.status(500).json({message:"não foi encontrado nenhum registro"})
        }
    },

 async toCheckOut(req, res) {
  try {
    const { id } = req.params; // ID do check-in aberto
    const {
      checkmvt, // quilometragem final
      checdtvt, // data/hora do checkout
      checobvt  // observações finais
    } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'ID do check-in é obrigatório!' });
    }

    // Aqui você pode validar os campos obrigatórios
    if (!checkmvt || !checdtvt) {
      return res.status(400).json({ message: 'Dados do check-out incompletos!' });
    }

    // Atualizar no banco
    const atualizado = await movimentCheckInAndCheckOut.toDoCheckOut(id, {
      checstvt: 'Finalizado', // novo status
      checkmvt,               // KM final
      checdtvt,               // Data/hora do check-out
      checobvt                // Observação
    });

    if (!atualizado) {
      return res.status(400).json({ message: 'Não foi possível finalizar o check-out!' });
    }

    return res.status(200).json({ success: true, checkout: atualizado });

  } catch (error) {
    console.error('Erro no checkout:', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}

}