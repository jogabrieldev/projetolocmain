

async function updateStatusVehicle(id){
      try { 
          const token = localStorage.getItem('token')
          if(!token)return
          const result= await fetch(`/api/automo/${id}` , {
            method:"PATCH",
            headers:{
                "content-type":"application/json",
                authorization: token
            },
            body:JSON.stringify({caaustat:"Esta com Motorista!"})
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

 function getCurrentDateTime() {
  const now = new Date();

  // Data no formato YYYY-MM-DD
  const date = now.toISOString().split('T')[0];

  // Horário no formato HH:mm:ss
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const time = `${hours}:${minutes}:${seconds}`;

  // Junta tudo
  const dateTime = `${date} ${time}`;
  return dateTime;
};
 

let userId = localStorage.getItem('user')
if(!userId)return

let user= userId

 const btnSubmitCheckIn = document.getElementById('submitCheckIn')
  if(btnSubmitCheckIn){
  btnSubmitCheckIn.addEventListener('click' , async (event)=>{
        event.preventDefault()
        
    const truckValue = document.getElementById('caminhao')?.value
     const observacao =  document.getElementById('checObs')?.value
     const quilometrosAt = document.getElementById('kmAt')?.value

    if(!truckValue || !observacao || !quilometrosAt){return};

    try {

       
         const payloadCheckin = {
            checVeic:truckValue,
            observacao:observacao,
            checKmat:quilometrosAt,
            checDtch:getCurrentDateTime(),
            checMoto:user
         }
         console.log('payload' , payloadCheckin)

         if(payloadCheckin){
            const idVeic = payloadCheckin.checVeic
            const data = await fetch("/api/checkin",{
                method:"POST",
                headers:{
                    "content-type":" application/json",
                    authorization:""
                },
                body:JSON.stringify(payloadCheckin)
            })

        const result = await data.json()
            
        if(data.status === 200 || data.ok){
            Toastify({
            text: "CHECK-IN com sucesso",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "green",
            }).showToast();
            setTimeout(()=>{
            updateStatusVehicle(idVeic)
            document.getElementById('caminhao').value = ""
            document.getElementById('checObs').value = ""
            document.getElementById('kmAt').value = ""
            },100)
           
         }else{

          if (result.errors && Array.isArray(result.errors)) {
           
            result.errors.forEach((err) => {
              Toastify({
                text: err.msg,
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

async function checkOut(params) {
                                                                          
}