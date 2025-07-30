
document.addEventListener('DOMContentLoaded', function(){
  addNameDriverExterno();
  vehicleBelongsDriver();
})


async function addNameDriverExterno(){
  try {

    console.log('storage', localStorage)
    const userId = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    const nameDriverScreen = document.getElementById('nomeMotorista')
      if(!userId || !token)return
   
        const result = await fetch(`/api/driver/${userId}`,{
          method:"GET",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!result.ok) {
      throw new Error(`Falha ao buscar motorista: ${result.status}`);
     }
    const driver = await result.json()


    const nameDriverLogin = driver?.motorista?.motonome
      if(nameDriverLogin){
       nameDriverScreen.innerHTML = `<strong>Seja Bem-vindo ${nameDriverLogin}</strong>`
      }
   } catch (error) {
      console.error('Erro para pegar o nome do motorista')
       Toastify({
        text: "Erro para buscar nome do motorista",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
      return 
    }
};


async function getVehicleTheDriver(code) {
   
     try {
         const response = await fetch(`/api/automo/${code}` , {
            method:"GET",
            headers:{
                "content-type":"application/json"
            }
         })
          const result = await response.json()

         if(!response.ok || result.success === false){
            Toastify({
           text: "Não foi possivel encontrar veiculo desse motorista",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
          }).showToast();
          return
         }

         
           const veiculo = result.veiculo
           document.getElementById('placaVeiculo').textContent = veiculo.caauplac
           document.getElementById("modeloVeiculo").textContent = veiculo.caaumode
           document.getElementById("statusVeiculo").textContent = veiculo.caaustat
         
         console.log('resultado' , result)
        
         console.log(veiculo)


     } catch (error) {
         console.error("Erro ao buscar veículo externo:", error);
    Toastify({
      text: "Erro ao buscar dados do veículo externo",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
     }
}

async function vehicleBelongsDriver() {
  try {
      const userId = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      if(!userId || !token) return

      const response = await fetch(`/api/drivercar/${userId}`,{
         method:"GET",
         headers:{
            "content-type":"application/json"
         }
      })
       const result = await response.json()

      if(!response.ok || result.success === false){
        Toastify({
        text: "Erro para buscar veiculo deste motorista",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
      return
    }
     
      const codeVehicle = result?.result?.seexveic
      if(codeVehicle)getVehicleTheDriver(codeVehicle)
        
    } catch (error) {
      console.error("Erro ao buscar vínculo do veículo com motorista:", error);
      Toastify({
      text: "Erro interno ao buscar dados do motorista",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();

    }
}