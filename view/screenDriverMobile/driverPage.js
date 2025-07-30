document.addEventListener("DOMContentLoaded", function () {
 
  const selectCar = document.getElementById("caminhao");
  if (selectCar) {
    selectCar.addEventListener("click", getAllCar());
  }
  
  checkOut();
  checkIn();
  listDeliveryForDriver();
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
    year: "numeric",
  });
};

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
      return true;
    }
  } catch (error) {
    console.error("Erro ao buscar motorista");
    return false;
  };
};

async function addNameDriver() {
  try {
    const userId = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const nameDriverScreen = document.querySelector(".nameDriver");
    if (!userId || !token) return;

    const result = await fetch(`/api/driver/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!result.ok) {
      throw new Error(`Falha ao buscar motorista: ${result.status}`);
    }
    const driver = await result.json();

    const nameDriverLogin = driver?.motorista?.motonome;
    if (nameDriverLogin) {
      nameDriverScreen.innerHTML = `<strong>Seja Bem-vindo ${nameDriverLogin}</strong>`;
    }
  } catch (error) {
    console.error("Erro para pegar o nome do motorista");
    Toastify({
      text: "Erro para buscar nome do motorista",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return;
  };
};

async function getAllCar() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await fetch("/api/listauto", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const carros = await response.json();

    const carrosAtivos = carros.filter(
      (carro) => carro.caaustat === "Disponivel" && carro.caausitu === "Interno"
    );

    const select = document.getElementById("caminhao");
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
  };
};

let idDelivery = "";
let idBem = ""
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

    const response = await fetch(`/api/deliverydriver/${motoristaId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      Toastify({
        text: "Erro para listar entregas desse motorista!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
    }

    const entrega = data.entrega;

    if (entrega.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center">
          <i class="bi bi-truck-flatbed fs-1 text-muted"></i>
          <p class="text-muted">Nenhuma entrega disponível para você no momento.</p>
        </div>`;
      return;
    }
    
    idDelivery = entrega?.loficode;
    idBem = entrega?.lofiidbe

    let botoes = "";

    const statusEntrega = entrega.lofistat;

    if (statusEntrega === "Entrega aceita") {
      botoes = `<button class="btn btn-warning w-75 finishDelivery">Finalizar</button>`;
    } else {
      botoes = `<button class="btn btn-success w-75 toAcceptDelivery">Aceitar</button>`;
    }

    let nomeClient = "";
    let clientPhone = "";

    const cliecode = entrega.lofiidcl;

    const clientRes = await fetch(`/api/client/${cliecode}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (clientRes.ok) {
      const cliente = await clientRes.json();

      if (Array.isArray(cliente) && clientRes.length > 0) {
        const client = cliente[0];
        nomeClient = client.clienome || "Sem nome";
        clientPhone = client.cliecelu || "Não passado";
      }

      nomeClient = cliente.clienome || "Sem nome";
      clientPhone = cliente.cliecelu || "Não passado";

      const card = document.createElement("div");
      card.className = "col-md-6 col-lg-4";

      card.innerHTML = `
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title">
              <i class="bi bi-box-seam-fill text-primary"></i>
              Entrega #${entrega.lofiidlo}
            </h5>
            <p class="mb-1"><i class="bi bi-geo-alt-fill text-danger"></i> ${
              entrega.lofirua
            }, ${entrega.lofibair}, ${entrega.loficida}</p>
            <p class="mb-1"><i class="bi bi-calendar-check text-success me-2"></i>Data da Locação: ${formatarData(
              entrega.lofidtlo
            )}</p>
            <p class="mb-1"><i class="bi bi-calendar-check text-success me-2"></i>Data da Devolução: ${formatarData(
              entrega.lofidtdv
            )}</p>
            <p class="mb-1"><i class="bi bi-person-fill text-info"></i> Cliente: ${nomeClient}</p>
            <p class="mb-1"><i class="bi bi-telephone-fill"></i> Telefone do Cliente:${clientPhone}</p>
            <p class="mb-0"><i class="bi bi-credit-card-fill text-warning"></i> Pagamento: ${
              entrega.lofipgmt
            }</p>
            <br>
            <div class = "d-flex flex-row justify-content-center w-100">
             ${botoes}
            </div>
          </div>
        </div> `;
      container.appendChild(card);

      const btnAceitar = card.querySelector(".toAcceptDelivery");
      if (btnAceitar) {
        btnAceitar.addEventListener("click", (event) =>
          toAcceptDeliveryNow(event)
        );
      }
    }
  } catch (error) {
    console.error("Erro na listagem de entregas:", error);
    document.querySelector(".showDelivery").innerHTML = `
      <p class="text-danger text-center fw-bold">Erro ao carregar entregas.</p>`;
  };
};

async function updateStatusGoods(idBem) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`/api/updatestatus/${idBem}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bensstat: "A destino do cliente" }),
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
  } catch (error) {
    Toastify({
      text: "erro no server em atualizar status",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
  };
};

async function toAcceptDeliveryNow(event) {
  try {
    const token = localStorage.getItem("token"); // ou da onde você armazena

    if (!token || !idDelivery) {
      throw new Error("Token ou ID da entrega não encontrado");
    }

    const response = await fetch(`/api/updatestatus/${idDelivery}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ body: "Entrega aceita" }),
    });
    if (!response.ok) {
      Toastify({
        text: "Erro para aceitar essa entrega",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
      return;
    }

    Toastify({
      text: "Entrega aceita pelo o motorista!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "green",
    }).showToast();

    const btnAceitar = event.target;
    const cardBody = btnAceitar.closest(".card-body");

    const btnFinalizar = cardBody.querySelector(".finishDelivery");

    if (btnAceitar) btnAceitar.classList.add("d-none");
  
    if (btnFinalizar) btnFinalizar.classList.add("d-flex");

    updateStatusGoods(idBem);

  } catch (error) {
    console.error("Erro para atualizar status da entrega", error);
    Toastify({
      text: "Erro para atualizar status da entrega",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
  }
}

