
document.addEventListener('DOMContentLoaded', function(){
  addNameDriverExterno();
  vehicleBelongsDriver();
  getDeliveryDriverExternal()
})


async function addNameDriverExterno(){
  try {

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

//buscar motorista

async function getDriverInDelivery(code , token){
  if(!code || !token)return
  try {
    const response = await fetch(`/api/driver/${code}` , {
       method:"GET",
       headers:{
        "content-type":"application/json",
        Authorization:`Bearer ${token}`
       }
    })
     if(!response.ok){
        throw new Error("Erro para buscar motorista pra finalizar entrega");
     }

     const result = await response.json()
     console.log("result",result)
     if(result){
        const driver = result?.motorista
        return driver.motonome
     }
  } catch (error) {
      console.error("Erro em buscar motorista que esta na entrega")
       throw new Error("Erro em buscar nome do motorista que esta na entrega");
  };
};
// PEGAR ENTRAGAS DO MOTORISTA EXTERNO
let deliveryToConfirm = null
let deliveryToFinish = null
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
  
    const result = await response.json()

    if (!response.ok) {
      Toastify({
        text: `${result.message}`||"Erro em listar entrega do motorista! Verifique",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
      return;
    }

    // const result = await response.json();
    const deliveries = result?.entrega || [];
    console.log("Entregas recebidas:", deliveries);

    const listaEntregas = document.getElementById("listaEntregas");
    listaEntregas.innerHTML = ""; // Limpa cards antigos
  

    deliveries.forEach( async(entrega, index) => {

     const bemLocado = await getGoodsInDelivery(entrega?.lofiidbe , token)
     const clientLocation = await getClientInDelivery(entrega?.lofiidcl , token)
     const nameDriverDelivery = await getDriverInDelivery(entrega?.lofiidmt , token)
     console.log(nameDriverDelivery)

     let buttonHTML = "";

     if (entrega.lofistat === "Pendente") {
       buttonHTML = `
       <button class="btn btn-success acceptDelivery w-100" 
       data-id="${entrega.loficode}" 
       data-numeric="${entrega.lofiidlo}" 
       data-bem="${entrega.lofiidbe}" 
       data-loc="${entrega.lofiidlo}" 
       data-client="${clientLocation.nome}" 
       data-dataloc="${entrega.lofidtlo}" 
       data-endereco="${entrega.loficep} - ${entrega.lofirua} - ${entrega.loficida}">
       <i class="bi bi-check-circle"></i> Confirmar Entrega
      </button>
     `;
     } else if (entrega.lofistat === "Entrega aceita") {
       buttonHTML = `
       <button class="btn btn-warning finalizeDelivery w-100" 
        data-id="${entrega.loficode}" data-location="${entrega.lofiidlo}"
        data-cliente="${entrega.lofiidcl}"
          data-id="${entrega.loficode}"
          data-localization="${entrega.loficep} - ${entrega.lofirua} - ${entrega.loficida}"
          data-dataloc="${entrega.lofidtlo}"
          data-bem="${entrega.lofiidbe}"
          data-moto="${nameDriverDelivery}">
      <i class="bi bi-flag-checkered"></i> Finalizar Entrega
    </button>
  `;
     } else {
  // Para outros status, pode deixar vazio ou colocar outro botão, ou nada
      buttonHTML = ``;
    }

     
      let statusClass = "text-secondary";
      if (entrega.lofistat === "Pendente") statusClass = "text-danger";
      else if (entrega.lofistat === "Entrega aceita") statusClass = "text-success";
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
         ${buttonHTML}
      </div>
    </div>
  </div>
`;


    listaEntregas.insertAdjacentHTML("beforeend", cardHTML);
      listaEntregas.addEventListener("click", async (e) => {
        const btnAccept = e.target.closest(".acceptDelivery");
  if (btnAccept) {
    deliveryToConfirm = {
      entregaId: btnAccept.dataset.id,
      bemLocado: btnAccept.dataset.bem,
      numberLoc: btnAccept.dataset.numeric
    };

    const data = new Date(btnAccept.dataset.dataloc);
    const dataFormatada = data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
    const horaFormatada = data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });

    document.getElementById("IdEntrega").textContent = btnAccept.dataset.numeric;
    document.getElementById("enderecoEntrega").textContent = btnAccept.dataset.endereco;
    document.getElementById("clienteEntrega").textContent = btnAccept.dataset.client;
    document.getElementById("dataEntrega").textContent = `${dataFormatada} ${horaFormatada}`;

    new bootstrap.Modal(document.getElementById("modalConfirmAcceptDriverExternal")).show();
    return; // evita executar o código abaixo no mesmo clique
  }

  // Botão de finalizar entrega
const modalFinishEl = document.getElementById("modalFinishLocation");
const modalFinish = modalFinishEl ? new bootstrap.Modal(modalFinishEl) : null;
const checkBoxValid = document.getElementById("confirmTermos");
const buttonFinish = document.getElementById("submitFinishDelivery");

// Habilita/desabilita botão só uma vez
if (checkBoxValid && buttonFinish) {
  checkBoxValid.addEventListener("change", () => {
    buttonFinish.disabled = !checkBoxValid.checked;
  });
}

// Clique no botão finalizar
if (buttonFinish) {
  buttonFinish.addEventListener("click", () => {
    if (deliveryToFinish) {
      finishDeliveryDriverExternal(
        deliveryToFinish.idDelivery,
        deliveryToFinish.idNumeroLocacao,
        deliveryToFinish.nomeMotorista,
        deliveryToFinish.idBem
      );
    }
  });
}

// Evento de abrir modal
const btnFinish = e.target.closest(".finalizeDelivery");
if (btnFinish && modalFinish) {
  deliveryToFinish = {
    idDelivery: btnFinish.dataset.id,
    idNumeroLocacao: btnFinish.dataset.location,
    idBem: btnFinish.dataset.bem,
    nomeMotorista: btnFinish.dataset.moto,
    localization: btnFinish.dataset.localization,
    nomeCliente: btnFinish.dataset.cliente,
    dataLocacao: btnFinish.dataset.dataloc,
  };
  console.log(deliveryToFinish)

   const data = new Date(deliveryToFinish.dataLocacao);

// Data formatada no padrão pt-BR com fuso de Brasília
const dataFormatada = data.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
const horaFormatada = data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });

  try {
    const client = await getClientInDelivery(deliveryToFinish.nomeCliente, token);

    document.getElementById("numeroDaLocacao").textContent = deliveryToFinish.idNumeroLocacao;
    document.getElementById("destinoEntrega").textContent = deliveryToFinish.localization;
    document.getElementById("nomeDoMotorista").textContent = nameDriverDelivery || "";
    document.getElementById("nomeDoCliente").textContent = client?.nome || "";
    document.getElementById("dataEntrega").textContent = `${dataFormatada} - ${horaFormatada}`

    modalFinish.show();
  } catch (err) {
    console.error("Erro ao buscar cliente:", err);
   }
  }
});
      document.getElementById('buttonAcceptDelivery').addEventListener('click' ,()=>{
        if(deliveryToConfirm)
          AcceptDelivery(deliveryToConfirm.entregaId , deliveryToConfirm.bemLocado , deliveryToConfirm.numberLoc , token )
      })

    
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

async function updateStatusGoodsDriverExterno(idBem , body) {
  try {
    const token = localStorage.getItem("token");
    if(!token)return
    const response = await fetch(`/api/updatestatus/${idBem}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bensstat: body }),
    });

    if (!response.ok) {
      Toastify({
        text: "Status do bem não foi atualizado! verifique",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
      return;
    }
    return true
  } catch (error) {
    Toastify({
      text: "erro no server em atualizar status",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return false
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
    const goodUpdate = updateStatusGoodsDriverExterno(idBem , "A destino do cliente")
    if(goodUpdate === false)return

    Toastify({
        text: "Entrega aceita com sucesso!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();

      const modalEl = document.getElementById("modalConfirmAcceptDriverExternal");
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) {
      modalInstance.hide();
    }

  } catch (error) {
     console.error("Erro para o motorista externo aceitar a entrega", error)
       Toastify({
        text: "Erro em aceitar a entrega verifique!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
  };
 
};

 async function finishDeliveryDriverExternal(idDelivery,idNumeroLocacao,nomeMotorista,idBem){
   try {
    const token = localStorage.getItem("token");
    if(!token)return

    const payload = {
      enfiLoca: idDelivery,
      enfiNmlo: idNumeroLocacao,
      enfiNmMt: nomeMotorista,
      enfiBem: idBem,
    };
    
    console.log('payload' , payload)

    
    if (!payload || !token) return;

    const response = await fetch("/api/deliveryfinish", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      Toastify({
        text: "Erro ao finalizar entrega! verifique",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
      return;
    }
    const result = await response.json();
    if (response.ok && result.success === true) {
      Toastify({
        text: "Entrega finalizada com sucesso!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();

      
      // Fecha a modal
      const modalEl = document.getElementById("modalFinishLocation");
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) {
        modal.hide();
      }

      const goodUpdate = updateStatusGoodsDriverExterno(idBem , "Esta com cliente")
      if(goodUpdate === false)return
    }

    console.log("Resposta do servidor:", response);
  } catch (error) {
    console.error("Erro para enviar dados de finalização de entrega", error);
  };
};


