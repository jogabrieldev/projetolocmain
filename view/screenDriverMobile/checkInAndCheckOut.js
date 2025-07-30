
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
            observacao:observacao,
            checKmat:quilometrosAt,
            checMoto:user
         }
         console.log('payload' , payloadCheckin)

         if(payloadCheckin){
            const idVeic = payloadCheckin.checVeic
            const data = await fetch("/api/checkin",{
                method:"POST",
                headers:{
                    "content-type":" application/json",
                    Authorization: `Bearer ${token}`
                },
                body:JSON.stringify(payloadCheckin)
            })

            console.log(data)

        const result = await data.json()
            
        if(data.status === 200 || data.ok){
            Toastify({
            text: "CHECK-IN feito com sucesso",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "green",
            }).showToast();

            setTimeout(()=>{
            updateStatusVehicle(idVeic , {caaustat:"Esta com Motorista!"})
            document.getElementById('caminhao').value = ""
            document.getElementById('checObs').value = ""
            document.getElementById('kmAt').value = ""
            },100)

           
         }else{

          if (result.errors && Array.isArray(result.errors)) {
            
            console.error('erro' , erro)
             result.errors.forEach((err) => {
              Toastify({
                text: err.msg || "Erro para executar o CHECK-IN", errors,
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
    }
}

async function checkOut() {
  try {
    
    const inputVehicle = document.getElementById("caminhaoCheckOut");
    let idMoto = localStorage.getItem('user');
    const token = localStorage.getItem('token')
    if (!idMoto || !token) return;

    const response = await fetch(`/api/checkin/${idMoto}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    const result = await response.json();
  
   if (response.ok && result.success === true && Array.isArray(result.verificar) && result.verificar.length > 0){
      const check = result.verificar[0];
      
      const vehicle = await getVehicleWithDriver(check.checveic);
      if (vehicle && inputVehicle) {
       inputVehicle.value = `${vehicle.caaumaca} - ${vehicle.caauplac}`;
      }

      const btnSubmitCheckOut = document.getElementById('submitCheckOut')
      if(btnSubmitCheckOut){
         btnSubmitCheckOut.addEventListener('click' ,async ()=>{

          // const truckValue = document.getElementById('caminhao')?.value
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
              updateStatusVehicle(check.checveic , {caaustat:"Disponivel"})
             document.getElementById('caminhaoCheckOut').value = ""
             document.getElementById('checObsVt').value = ""
             document.getElementById('kmVt').value = ""
            },100)
             
           }
         })
      }

    } else {
      console.warn("Nenhuma verificação encontrada ou estrutura inválida.");
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
  }
}
