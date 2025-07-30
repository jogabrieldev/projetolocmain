async function getCarSituationExterno() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await fetch("/api/listauto", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      }
    });

    const carros = await response.json();
   
    const carrosAtivos = carros.filter((carro) => carro.caausitu === "Externo");

    const select = document.getElementById("veicExterno");
    if (select) {
       select.innerHTML = '<option value="">Selecione..</option>'; // Limpa
      carrosAtivos.forEach((carro) => {
        const option = document.createElement("option");
        option.value = carro.caaucode;
        option.textContent = `${carro.caaumaca} - ${carro.caauplac}`;
        select.appendChild(option);
      });

       select.value = "";
    }

  } catch (error) {
    console.error("Erro na aplicação para buscar carros:", error);
  }
};

function linkDriverExternoWithVehicle(){
    const buttonLinkDriverExterno = document.getElementById('buttonLinkDriverExterno')
    const popUpLinkDriverVehicle = document.querySelector('.popUpLinkDriverVehicle')
    const linkDriverVehicle = document.querySelector('.linkDriverVehicle')

    const exitPopUpLinkVehicle = document.querySelector('.exitPopUpLinkVehicle')
    if(exitPopUpLinkVehicle){
      exitPopUpLinkVehicle.addEventListener('click' , ()=>{
          
         linkDriverVehicle.style.display = "none";
        popUpLinkDriverVehicle.style.display = "none";
      })
    }
    
    if (buttonLinkDriverExterno && linkDriverVehicle && popUpLinkDriverVehicle) {
    buttonLinkDriverExterno.addEventListener("click", () => {

     const selectedCheckbox = document.querySelector('input[name="selectDriver"]:checked');
     if (!selectedCheckbox) {
      Toastify({
        text: "Selecione um Motorista para vincular veiculo",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
      return;
    }
      const motoristaSelecionado = JSON.parse(selectedCheckbox.dataset.motorista);

       if (motoristaSelecionado.motositu !== "Externo") {
        Toastify({
          text: "O motorista selecionado não é externo! ",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
        return;
      }
     const codeDriver = motoristaSelecionado.motocode;
     if (!codeDriver) {
      Toastify({
       text: "Código do motorista inválido!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
     backgroundColor: "red",
      }).showToast();
     return;
    }
     document.getElementById("codigoMotorista").value = codeDriver;
     document.getElementById('idMoto').value = motoristaSelecionado.motonome

      linkDriverWithVehicleSubmit(codeDriver ,motoristaSelecionado.motonome)

      linkDriverVehicle.style.display = "block";
      popUpLinkDriverVehicle.style.display = "flex";
    });
  };
 };

async function linkDriverWithVehicleSubmit(codeMoto , nameMoto) {

    console.log('code' , codeMoto ,)

    const btnSubmitLink = document.querySelector('.saveDriverVehicle')
    if(btnSubmitLink){
        btnSubmitLink.addEventListener('click' , async ()=>{
             const codeVeic = document.getElementById('veicExterno')?.value;

      if (!codeVeic) {
        Toastify({
          text: "Selecione um veículo para vincular!",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
        return;
      }
              
         try {
          const response = await fetch('/api/linkdriver'  ,{
            method:'POST',
             headers:{
               "content-type":"Application/json"
             },
             body:JSON.stringify({codeMoto , codeVeic})
          }) 

          console.log('resposta' , response)

          const res = await response.json()

          if(response.ok){
            Toastify({
            text: `Motorista ${nameMoto} foi vinculado com o veiculo selecionado!`,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "green",
           }).showToast();
           
          }else{
            Toastify({
            text: "Erro para vincular o motorista ao veiculo! ",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
           }).showToast();
          }
     } catch (error) {
        console.error('Erro para vincular o motorista ao veiculo')
          Toastify({
            text: "Erro para vincular o motorista ao veiculo!" ,error,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
           }).showToast();
     }
        })
    }
    
}
