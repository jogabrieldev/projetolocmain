
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

const socketCheck = io()
// CHECKIN
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
    if(data.status === 200 || data.ok){
    Toastify({
      text: "CHECK-IN feito com sucesso",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "green",
    }).showToast();

    // Delay de 3,5 segundos antes do reload
    setTimeout(() => {
      // Limpa os campos antes do reload
      document.getElementById('caminhao').value = "";
      document.getElementById('checObs').value = "";
      document.getElementById('kmAt').value = "";
      document.querySelectorAll(".toAcceptDelivery").forEach(btn => {
        btn.disabled = false;
      });

      // Recarrega a página
       window.location.reload();
      }, 3500); // 3,5s dá tempo do toast terminar
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

async function getVehicleWithDriver(code , token) {
    try {
        const response = await fetch(`/api/automo/${code}`,{
          method:'GET',
          headers:{
             "content-type":"application/json",
              Authorization: `Bearer ${token}`
          },
          
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

// VALIDAR CHECK-IN
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
      
     console.log('resposta do check' , response)
     const result = await response.json();

      if (!response.ok) {
      Toastify({
        text: result.message || "Erro ao verificar check-in.",
        duration: 4000,
        close: true,
        gravity: "top",
        position: "center",
        style: {
        background: "ORANGE"
        }
      }).showToast();
      return; // não prossegue
    }
     const check = result?.verificar[0]
     const status = check?.checstat

      if(!check || !status)return
 
       if(status === "Em uso"){

        const inputCaminhao = document.getElementById('caminhao');
         if (inputCaminhao) {
           inputCaminhao.disabled = true; 
          }
          return check
       
       }else if(status === "Finalizado"){
          await getAllCar()
       }

    
    } catch (error) {

    Toastify({
      text: "Erro inesperado ao verificar check-in.",
      duration: 4000,
      gravity: "top",
      position: "right",
      style: {
        background: "red"
      }
    }).showToast();
  };
};

// PEGAR O CHECK-IN EM ABERTO E FAZER CHECK-OUT
async function checkOut(idMoto , token) {

  try {
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
      
          const observacao =  document.getElementById('checObsVt')?.value
          const quilometrosAt = document.getElementById('kmVt')?.value

      
             const response = await fetch(`/api/checkin/${check.checid}` ,{
               method:'PUT',
               headers:{
                 "content-type":"application/json",
                  Authorization: `Bearer ${token}`
               },
               body:JSON.stringify({checkmvt:quilometrosAt ,checobvt:observacao })
             })

             const result = await response.json()
             const checkOut = result?.checkout || result;
       
             if(response.ok && checkOut.checstat === "Finalizado"){
             Toastify({
             text: "CHECK-OUT feito com sucesso!",
             duration: 3000,
             close: true,
             gravity: "top",
             position: "center",
             backgroundColor:"green",
            }).showToast();
            
            setTimeout(()=>{
            document.getElementById('caminhaoCheckOut').value = ""
            document.getElementById('checObsVt').value = ""
            document.getElementById('kmVt').value = ""
             
            window.location.reload()
            },3500)
           } else{

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
          };
        };
      };

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
