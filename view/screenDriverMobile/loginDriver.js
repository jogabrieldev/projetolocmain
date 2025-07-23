document.addEventListener("DOMContentLoaded", function () {
  const btnAcceptDelivery = document.getElementById('toAcceptDelivery')
  if(btnAcceptDelivery){
     btnAcceptDelivery.addEventListener('click',()=>{
        toAcceptDelivery()
     })
  }
  listDeliveryForDriver();
  getAllCar();
  addNameDriver();
});

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expTime = payload.exp * 1000;
    return Date.now() > expTime;
  } catch (error) {
    return true;
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

async function addNameDriver(){
  try {
    const userId = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    const nameDriverScreen = document.querySelector('.nameDriver')
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
        backgroundColor: "green",
      }).showToast();
      return 
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
   
    const carrosAtivos = carros.filter((carro) => carro.caaustat === "Disponivel");

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
   
    if (!token || !motoristaId || !container) return;

    if (!token || isTokenExpired(token)) {
        Toastify({
          text: "Sessão expirada. Faça login novamente.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();

        localStorage.removeItem("token");
        setTimeout(() => {
          window.location.href = "/index.html";
        }, 2000);
        return;
      }

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
            <p class="mb-1"><i class="bi bi-calendar-check text-success me-2"></i>Data da Locação: ${formatarData(entrega.lofidtlo)}</p>
            <p class="mb-1"><i class="bi bi-calendar-check text-success me-2"></i>Data da Devolução: ${formatarData(entrega.lofidtdv)}</p>
            <p class="mb-1"><i class="bi bi-person-fill text-info"></i> Cliente: ${nomeClient}</p>
            <p class="mb-1"><i class="bi bi-telephone-fill"></i> Telefone do Cliente:${clientPhone}</p>
            <p class="mb-0"><i class="bi bi-credit-card-fill text-warning"></i> Pagamento: ${entrega.lofipgmt}</p>
            <br>
            <div class = "d-flex flex-row justify-content-between w-100">
             <button class = "btn btn-success" id = "toAcceptDelivery">Aceitar</button>
             <button class = "btn btn-danger" id = "toAcceptDelivery">Recusar</button>
            </div>
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

function toAcceptDelivery(){
   
}

function toRefuseDelivery (){
 
}


