import { movimentCheckInAndCheckOut } from "../model/modelsCheckIn.js";
import { autoRegister as updateRuntime } from "../model/modelsVehicles.js";
import { mecanismDelivey } from "../model/modelsDelivery.js";
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

            if(!payloadCheckin.checDtch || payloadCheckin.checDtch === ""){
               payloadCheckin.checDtch = new Date()
            }
            
           const newCheckIn =  await movimentCheckInAndCheckOut.toDoCheckIn(payloadCheckin)
           if(!newCheckIn){
             return res.status(400).json({message:"Erro para fazer esse CHECK_IN tente novemente"})
           }
           
          const io = req.app.get("socketio")
           if(io){
            const listVehicle = await updateRuntime.updateStatus(payloadCheckin.checVeic , "Esta com Motorista!")

             const checkInsAbertos = await movimentCheckInAndCheckOut.getCheckInOpen(payloadCheckin.checMoto, "Em uso");

             


             io.emit("checkIn" , listVehicle , checkInsAbertos)
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
      
             if(idMoto){
              const verificar = await movimentCheckInAndCheckOut.getCheckInOpen(idMoto)
              if(!verificar){
                return res.status(400).json({message: "Não consegui encontrar nenhum registro desse motorista!"})
              }
             console.log('verificar', verificar)
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
    const {checkmvt, checobvt } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'ID do check-in é obrigatório!' });
    }

    // Aqui você pode validar os campos obrigatórios
    if (!checkmvt) {
      return res.status(400).json({ message: 'Dados do check-out incompletos!' });
    }

    // Atualizar no banco
    const atualizado = await movimentCheckInAndCheckOut.toDoCheckOut(id, {
      checstat: 'Finalizado', 
      checkmvt,               
      checdtvt: new Date(),              
      checobvt                
    });

    if (!atualizado) {
      return res.status(400).json({ message: 'Não foi possível finalizar o check-out!' });
    }
    console.log('atualizado' , atualizado)
    const socket = req.app.get("socketio")
    if(socket){

        const statusVehicle = await updateRuntime.updateStatus(atualizado.checveic , "Disponível")
          const checkInsFinish = await movimentCheckInAndCheckOut.getCheckInOpen(atualizado.checmoto, "Finalizado");

          console.log('volta' ,checkInsFinish)
      socket.emit('checkOut' , statusVehicle , checkInsFinish)
    }

    return res.status(200).json({ success: true, checkout: atualizado });

  } catch (error) {
    console.error('Erro no checkout:', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}

}