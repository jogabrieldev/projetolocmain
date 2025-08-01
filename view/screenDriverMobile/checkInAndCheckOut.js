
async function updateStatusVehicle(id , body){
      try { 
          const token = localStorage.getItem('token')
          if(!token)return
          const result= await fetch(`/api/automo/${id}` , {
            method:"PATCH",
            headers:{
                "content-type":"application/json",
                authorization: `Bearer ${token}`
            },
            body:JSON.stringify(body)
          })
          if(result.status === 200 || result.ok){
             Toastify({
            text: "Veiculo Destinado a você!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "green",
            }).showToast();
          }
      } catch (error) {
         console.error("Erro para atualizar status desse veiculo")
          Toastify({
            text: "Erro para atualizar status desse veiculo",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
            }).showToast();
      }
};



async function checkIn(){


let userId = localStorage.getItem('user')
const token = localStorage.getItem('token')
if(!userId || !token)return

let user= userId

 const btnSubmitCheckIn = document.getElementById('submitCheckIn')
  if(btnSubmitCheckIn){
  btnSubmitCheckIn.addEventListener('click' , async (event)=>{
        event.preventDefault()
        
    const truckValue = document.getElementById('caminhao')?.value
     const observacao =  document.getElementById('checObs')?.value
     const quilometrosAt = document.getElementById('kmAt')?.value

    if(!truckValue || !quilometrosAt){
        Toastify({
            text: "Preencha os campos do veiculo e de quilometragem!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "orange",
            }).showToast();
      return
    };

    try {

         const payloadCheckin = {
            checVeic:truckValue,
            checkObs:observacao,
            checKmat:quilometrosAt,
            checMoto:user
         }
         console.log('payload' , payloadCheckin)

         if(payloadCheckin){
            const idVeic = payloadCheckin.checVeic
            const data = await fetch("/api/checkin",{
                method:"POST",
                headers:{
                    "content-type":"application/json",
                    Authorization: `Bearer ${token}`
                },
                body:JSON.stringify(payloadCheckin)
            })


        const result = await data.json()

        console.log('resultado' , result)
            
        if(data.status === 200 || data.ok){
            // Toastify({
            // text: "CHECK-IN feito com sucesso",
            // duration: 3000,
            // close: true,
            // gravity: "top",
            // position: "center",
            // backgroundColor: "green",
            // }).showToast();

            setTimeout(()=>{
            // getVehicleWithDriver(result?.checkin?.checveic)
            updateStatusVehicle(idVeic , {caaustat:"Esta com Motorista!"})
            document.getElementById('caminhao').value = ""
            document.getElementById('checObs').value = ""
            document.getElementById('kmAt').value = ""
            document.querySelectorAll(".toAcceptDelivery").forEach(btn => {
              btn.disabled = false;
             });

            },100)

           
         }else{

          if (result.errors && Array.isArray(result.errors)) {
            
             result.errors.forEach((err) => {
              Toastify({
                text: err.msg || "Erro para executar o CHECK-IN",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "center",
                backgroundColor: "red",
              }).showToast();
            });
          } else {
            Toastify({
              text: result?.message || "Erro para fazer o check-in.",
              duration: 3000,
              close: true,
              gravity: "top",
              position: "center",
              backgroundColor: "red",
            }).showToast();
          }
        };
     };
    } catch (error) {
        Toastify({
         text: "Erro no server para fazer check-in",
         duration: 3000,
         close: true,
         gravity: "top",
         position: "center",
         backgroundColor:"red",
        }).showToast();
    };
   });
  };
};

async function getVehicleWithDriver(code) {
    try {
        const response = await fetch(`/api/automo/${code}`,{
          method:'GET',
          headers:{
             "content-type":"application/json"
          }
        })
        const result = await response.json()

        if(response.ok && result.success === true){
           return result.veiculo
        }
        
    } catch (error) {
       console.error('Erro para pegar o veiculo que esta com motorista')
       return false
    };
};

function finalizarCheckOut(idVeiculo) {
  const inputVehicle = document.getElementById('caminhaoCheckOut');
  const inputObs = document.getElementById('checObsVt');
  const inputKm = document.getElementById('kmVt');

  // Atualiza o status do veículo para "Disponível"
  if (idVeiculo) {
    updateStatusVehicle(idVeiculo, { caaustat: "Disponivel" });
  }

  // Limpa os campos
  if (inputVehicle) {
    inputVehicle.value = "";
    inputVehicle.readOnly = true; // ou inputVehicle.disabled = true;
    inputVehicle.placeholder = "CHECK-OUT concluído — sem veículo";
  }

  if (inputObs) inputObs.value = "";
  if (inputKm) inputKm.value = "";
}

function finisihCheckOutRunTime(){
   const socket = io()
   socket.on("checkOut", async(listVehicle)=>{
    console.log('lista lifa' , listVehicle)
        finisihCheckOut(listVehicle.caaucode)
   } )  
}

async function getCheck() {
    try {
      const idMotorista = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if(!idMotorista || !token)return
      const response = await fetch(`/api/checkin/${idMotorista}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

     const result = await response.json();
     const check = result?.verificar[0]
     const status = check?.checstat
     console.log(status)

       if(response.ok && status === "Em uso"){

        const inputCaminhao = document.getElementById('caminhao');
         if (inputCaminhao) {
           inputCaminhao.disabled = true; // Torna o campo somente leitura
          }
        return checkOut(idMotorista, token)
         
       
       }else if(status === "Finalizado"){
          getAllCar()
       }
   console.log(result)
    
    } catch (error) {
      console.error('Erro para verificar se o motorista tem pendendica' , error)
    }
}


async function checkOut(idMoto , token) {

  try {
    
    const inputVehicle = document.getElementById("caminhaoCheckOut");
    if (!idMoto || !token) return;

    const response = await fetch(`/api/checkin/${idMoto}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    const result = await response.json();
    const check = result?.verificar[0]
    
    const status = check.checstat
    
   if (response.ok && Array.isArray(result.verificar) && status === "Em uso"){
      

      const vehicle = await getVehicleWithDriver(check.checveic);
      if (vehicle &&  inputVehicle) {
       inputVehicle.value = `${vehicle.caaumaca} - ${vehicle.caauplac}`;
      }
     
      const btnSubmitCheckOut = document.getElementById('submitCheckOut')
      if(btnSubmitCheckOut){
         btnSubmitCheckOut.addEventListener('click' ,async ()=>{

          const observacao =  document.getElementById('checObsVt')?.value
          const quilometrosAt = document.getElementById('kmVt')?.value

          if(!quilometrosAt){
             Toastify({
             text: "E obrigatorio preecher a quilometragem!",
             duration: 3000,
             close: true,
             gravity: "top",
             position: "center",
             backgroundColor:"orange",
            }).showToast();
            return
          }
             const response = await fetch(`/api/checkin/${check.checid}` ,{
               method:'PUT',
               headers:{
                 "content-type":"application/json",
                  Authorization: `Bearer ${token}`
               },
               body:JSON.stringify({checkmvt:quilometrosAt ,checobvt:observacao })
             })

             const result = await response.json()
             const checkOut = result?.checkout
             console.log('resposta server' , response)
             console.log('resultado' , result)
       
             if(response.ok){
             Toastify({
             text: "CHECK-OUT feito com sucesso!",
             duration: 3000,
             close: true,
             gravity: "top",
             position: "center",
             backgroundColor:"green",
            }).showToast();
            
            setTimeout(()=>{
                finisihCheckOutRunTime(checkOut.checveic)
                 document.getElementById('caminhaoCheckOut').value = ""
            document.getElementById('checObsVt').value = ""
            document.getElementById('kmVt').value = ""
            },100)
          
           }
         });
      };

    } else {
      console.warn("Nenhuma veiuculo pendente");
    }

  } catch (error) {
    console.error('Erro ao executar checkOut:', error);
     Toastify({
         text: "Erro em fazer o CHECKOUT",
         duration: 3000,
         close: true,
         gravity: "top",
         position: "center",
         backgroundColor:"red",
        }).showToast();
  };
};
