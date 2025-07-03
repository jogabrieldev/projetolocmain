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
    console.log('car' , carros)

    // Filtra apenas os veículos com status "Ativo"
    const carrosAtivos = carros.filter((carro) => carro.caaustat === "Ativo");

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

    // Cache para evitar requisições duplicadas
    const clienteCache = {};

    for (const entrega of entregasDoMotorista) {
      const cliecode = entrega.lofiidcl;

      let clienteNome = "Desconhecido";
      let clientPhone = "Não passado"

      if (clienteCache[cliecode]) {
        clienteNome = clienteCache[cliecode];
        clientPhone = clienteCache[cliecode];
      } else {
        const clientRes = await fetch(`/api/cliente/${cliecode}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (clientRes.ok) {
          const cliente = await clientRes.json();
          clienteNome = cliente.clienome || "Sem nome";
          clienteCache[cliecode] = clienteNome;
          clientPhone = cliente.cliecelu || "Não passado"
        }
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
            <p class="mb-1"><i class="bi bi-person-fill text-info"></i> Cliente: ${clienteNome}</p>
            <p class="mb-1"><i class="bi bi-telephone-fill"></i> Telefone do Cliente:${clientPhone}</p>
            <p class="mb-0"><i class="bi bi-credit-card-fill text-warning"></i> Pagamento: ${entrega.lofipgmt}</p>
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

document.addEventListener("DOMContentLoaded", function () {
  listDeliveryForDriver();
  getAllCar();
});

