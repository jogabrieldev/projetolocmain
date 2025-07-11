async function verifiqueID(motoristaId) {
  try {
    const response = await fetch(`/api/driver/${motoristaId}`, {
      method: "GET",
    });
    const res = await response.json();
    if (res.success === true) {
      const user = res.user;
      Toastify({
        text: `Seja bem vindo ${user.motonome}`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();
      return true
    }
  } catch (error) {
    console.error("Erro ao buscar motorista");
    return false
    
  }
}

async function getAllCar() {
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
   
    // Filtra apenas os veículos com status "Ativo"
    const carrosAtivos = carros.filter((carro) => carro.caaustat === "Disponivel");

    console.log("Veículos ativos:", carrosAtivos);

    // Aqui você pode, por exemplo, popular um select com esses veículos
    const select = document.getElementById("caminhao");
    if (select) {
      select.innerHTML = ""; // Limpa
      carrosAtivos.forEach((carro) => {
        const option = document.createElement("option");
        option.value = carro.caaucode;
        option.textContent = `${carro.caaumaca} - ${carro.caauplac}`;
        select.appendChild(option);
      });
    }

  } catch (error) {
    console.error("Erro na aplicação para buscar carros:", error);
  }
}

async function listDeliveryForDriver() {

  try {
    const token = localStorage.getItem("token");
    const motoristaId = localStorage.getItem("user");
    const container = document.querySelector(".showDelivery");
    console.log('motorista' , motoristaId)

    if (!token || !motoristaId || !container) return;

    container.innerHTML = "";

    const response = await fetch("/api/getdelivery", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const entregas = await response.json();
    const entregasDoMotorista = entregas.filter(e => e.lofiidmt === motoristaId);

    if (entregasDoMotorista.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center">
          <i class="bi bi-truck-flatbed fs-1 text-muted"></i>
          <p class="text-muted">Nenhuma entrega disponível para você no momento.</p>
        </div>
      `;
      return;
    }
     
    let nomeClient = ''
    let clientPhone = ''

    for (const entrega of entregasDoMotorista) {
      const cliecode = entrega.lofiidcl;

      console.log('cliecode' , cliecode)

        const clientRes = await fetch(`/api/client/${cliecode}`, {
          method:'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (clientRes.ok) {
           const cliente = await clientRes.json();

            if(Array.isArray(cliente) && clientRes.length > 0){

              const client = cliente[0]
              nomeClient = client.clienome || "Sem nome";
              clientPhone = client.cliecelu || "Não passado"

            }

         
            nomeClient = cliente.clienome || "Sem nome";
            clientPhone = cliente.cliecelu || "Não passado"
        }
      

      const card = document.createElement("div");
      card.className = "col-md-6 col-lg-4";

      card.innerHTML = `
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title">
              <i class="bi bi-box-seam-fill text-primary"></i>
              Entrega #${entrega.lofiidlo}
            </h5>
            <p class="mb-1"><i class="bi bi-geo-alt-fill text-danger"></i> ${entrega.lofirua}, ${entrega.lofibair}, ${entrega.loficida}</p>
            <p class="mb-1"><i class="bi bi-calendar-check text-success"></i> Locação: ${formatarData(entrega.lofidtlo)}</p>
            <p class="mb-1"><i class="bi bi-calendar-check text-success"></i> Devolução: ${formatarData(entrega.lofidtdv)}</p>
            <p class="mb-1"><i class="bi bi-person-fill text-info"></i> Cliente: ${nomeClient}</p>
            <p class="mb-1"><i class="bi bi-telephone-fill"></i> Telefone do Cliente:${clientPhone}</p>
            <p class="mb-0"><i class="bi bi-credit-card-fill text-warning"></i> Pagamento: ${entrega.lofipgmt}</p>
            <button class = "btn btn-success" id = "toAcceptDelivery">Aceitar</button>
          </div>
        </div>
      `;

      container.appendChild(card);
    }

  } catch (error) {
    console.error("Erro na listagem de entregas:", error);
    document.querySelector(".showDelivery").innerHTML = `
      <p class="text-danger text-center fw-bold">Erro ao carregar entregas.</p>
    `;
  }
}

function formatarData(dataISO) {
  if (!dataISO) return "-";
  const data = new Date(dataISO);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function toAcceptDelivery(){
   
}

document.addEventListener("DOMContentLoaded", function () {
  const btnAcceptDelivery = document.getElementById('toAcceptDelivery')
  if(btnAcceptDelivery){
     btnAcceptDelivery.addEventListener('click',()=>{
        toAcceptDelivery()
     })
  }
  listDeliveryForDriver();
  getAllCar();
});

