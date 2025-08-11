
document.addEventListener('DOMContentLoaded', function(){
  addNameDriverExterno();
  vehicleBelongsDriver();
  getDeliveryDriverExternal()
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
    const token = localStorage.getItem("token")
    if(!token)return
     try {
         const response = await fetch(`/api/automo/${code}` , {
            method:"GET",
            headers:{
                "content-type":"application/json",
                Authorization:`Bearer ${token}`

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

           const veiculo = result?.veiculo
           if(veiculo){
              document.getElementById('placaVeiculo').textContent = veiculo.caauplac
              document.getElementById("modeloVeiculo").textContent = veiculo.caaumode
              document.getElementById("statusVeiculo").textContent = veiculo.caaustat 
            }
           
         
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
     };
};

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

    };
};

// pegar bem na locação
async function getGoodsInDelivery(bemId , token){
    try {
        if(!bemId || !token)return
        const response = await fetch(`/api/bens/${bemId}` , {
          method:"GET",
          headers:{
            "content-type":"application/json",
             Authorization: `Bearer ${token}`
          }
        })
        if(!response.ok){return}
        const result = await response.json()
        if(result){
           const bem = result?.bem
           return bem?.bensnome
        }
    } catch (error) {
       console.error("Erro em buscar bem locado")
       throw new Error("Erro em buscar bem locado para motorista externo");
       
    };
};

// pegar nome do cliente
async function getClientInDelivery(idClient , token) {
    try {
      if(!idClient || !token)return
      const response = await fetch(`/api/client/${idClient}`,{
        method:"GET",
        headers:{
          "content-type":"application/json",
          Authorization: `Bearer ${token}`
        }
      }) 
      const result = await response.json()
      if(result){
          const client = { nome:result?.clienome , phone:result?.cliecelu }
          return client 
      }
    } catch (error) {
        console.error("Erro em buscar cliente que locou")
       throw new Error("Erro em buscar cliente que locou");
    };
};

// PEGAR ENTRAGAS DO MOTORISTA EXTERNO
async function getDeliveryDriverExternal() {
  try {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user");
    if (!token || !userId) return;

    const response = await fetch(`/api/deliverydriver/${userId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      Toastify({
        text: "Erro em listar entrega do motorista! Verifique",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
      return;
    }

    const result = await response.json();
    const deliveries = result?.entrega || [];
    console.log("Entregas recebidas:", deliveries);

    const listaEntregas = document.getElementById("listaEntregas");
    listaEntregas.innerHTML = ""; // Limpa cards antigos
  

    deliveries.forEach( async(entrega, index) => {

        const bemLocado = await getGoodsInDelivery(entrega.lofiidbe , token)
        const clientLocation = await getClientInDelivery(entrega.lofiidcl , token)
     
      let statusClass = "text-secondary";
      if (entrega.lofistat === "Pendente") statusClass = "text-danger";
      else if (entrega.lofistat === "A Caminho") statusClass = "text-success";
      else if (entrega.lofistat === "Aguardando Carga") statusClass = "text-warning";

     const cardHTML = `
  <div class="col-md-6 col-lg-4 mb-4">
    <div class="card card-entrega h-100 shadow-sm">
      <div class="card-body">
        <h5 class="card-title">
          <i class="bi bi-truck"></i> Entrega #${entrega.lofiidlo}
        </h5>
        <p><strong><i class="bi bi-geo-alt"></i> Endereço:</strong> ${entrega.lofirua}, ${entrega.lofibair} - ${entrega.loficida} (${entrega.loficep})</p>
        <p><strong><i class="bi bi-bookmark-fill me-2"></i> Caçamba:</strong> ${bemLocado || "Erro em buscar o bem locado"}</p>
        <p><strong><i class="bi bi-person"></i> Cliente:</strong> ${clientLocation?.nome || "Erro em buscar cliente"}</p>
        <p><strong><i class="bi bi-telephone-fill"></i> Telefone do Cliente:</strong> ${clientLocation?.phone || "N/A"}</p>
        <p class="entrega-status ${statusClass}">
          <i class="bi bi-info-circle"></i> Status: ${entrega.lofistat}
        </p>
        <button class="btn btn-success acceptDelivery w-100" data-id="${entrega.loficode}" data-numeric="${entrega.lofiidlo}" data-bem="${entrega.lofiidbe}">
          <i class="bi bi-check-circle"></i> Confirmar Entrega
        </button>
      </div>
    </div>
  </div>
`;


    listaEntregas.insertAdjacentHTML("beforeend", cardHTML);
      listaEntregas.addEventListener("click", (e) => {
      const btn = e.target.closest(".acceptDelivery");
       if (!btn) return; 
       const entregaId = btn.dataset.id;
       const bemLocado = btn.dataset.bem;
       const numberLoc = btn.dataset.numeric
         const modal = new bootstrap.Modal(document.getElementById("modalConfirmAcceptDriverExternal"));
        modal.show();
      AcceptDelivery(entregaId , bemLocado , numberLoc , token);
    });

    });

  } catch (error) {
    console.error("Erro ao buscar entregas:", error);
     Toastify({
        text: "Erro no server ao buscar entregas! ",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
  };
};

// Função de exemplo para confirmar entrega
 async function AcceptDelivery(idDelivery , idBem , numberLoc , token) {
  
  console.log("Confirmando entrega:", idDelivery , idBem ,  numberLoc);

  try {
     if(!idDelivery || !token)return

      
      const response = await fetch(`/api/updatestatusdelivery/${idDelivery}`,{
        method:"PATCH",
        headers:{
          "content-type":"application/json",
            Authorization: `Bearer ${token}`
        },
        body:JSON.stringify({body:"Entrega aceita"})
      })

      if (!response.ok) {
      Toastify({
        text: "Erro ao aceitar essa entrega! Verifique.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
      return;
    }

    Toastify({
        text: "Entrega aceita com sucesso!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();

      const modalEl = document.getElementById("modalConfirmAcceptDriverExternal");
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) {
      modalInstance.hide();
    }


      
  } catch (error) {
    
  }
  // Toastify({
  //   text: `Entrega #${event} confirmada!`,
  //   duration: 3000,
  //   close: true,
  //   gravity: "top",
  //   position: "center",
  //   backgroundColor: "green",
  // }).showToast();
}
