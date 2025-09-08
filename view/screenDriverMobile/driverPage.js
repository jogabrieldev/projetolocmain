document.addEventListener("DOMContentLoaded", async function () {
  const check = await getCheck();
  if (check) {
    const token = localStorage.getItem("token");
    const inputVehicle = document.getElementById("caminhaoCheckOut");

    const vehicle = await getVehicleWithDriver(check.checveic, token);
    if (vehicle && inputVehicle) {
      inputVehicle.value = `${vehicle.caaumaca} - ${vehicle.caauplac}`;
    }
  }
  verifiqueCheck();
  valueSelect();
  checkIn();
  listDeliveryForDriver();
  addNameDriver();
  // toAcceptDeliveryNow();
  initCheckOut();
});

function valueSelect() {
  const selectCar = document.getElementById("caminhao");
  if (selectCar) {
    selectCar.addEventListener("click", getAllCar());
  }
}

//INICIALIZADOR DE CHECK-OUT
function initCheckOut() {
  const submitCheckOut = document.getElementById("submitCheckOut");
  if (submitCheckOut) {
    submitCheckOut.addEventListener("click", async (event) => {
      event.preventDefault();
      const inputVehicle = document.getElementById("caminhaoCheckOut");
      const quilometrosAt = document.getElementById("kmVt").value;
      const observacao = document.getElementById("checObsVt").value;
      const token = localStorage.getItem("token");
      const idMoto = localStorage.getItem("user");

      if (!inputVehicle.value || !quilometrosAt) {
        Toastify({
          text: "Preencha os campos do veiculo e de quilometragem!",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
        return;
      }

      await checkOut(idMoto, token);
    });
  }
}

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
}

// validar o usuario que logou
async function verifiqueID(motoristaId) {
  try {
    const response = await fetch(`/api/driver/${motoristaId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const res = await response.json();
    if (response.ok) {
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
     Toastify({
        text: `Erro ao buscar motorista! Faça login novamente`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();
    console.error("Erro ao buscar motorista" , error);
    return false;
  };
};

// adicionar Nome do motorista no titulo
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

// Pesquisar o motorista logado 
async function SearchNameDriverLogado(id) {
  try {
    const token = localStorage.getItem("token");

    // if (!token || !id) return;
    const response = await fetch(`/api/driver/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if(!response.ok)return

    const result = await response.json();
    if (result.success === true) {
      return result.motorista.motonome;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Erro ao buscar motorista logado");
    return false;
  };
}

// VERIFICAR SE O MOTORISTA TEM CHECKIn EM ABERTO
async function verifiqueCheck() {
  try {
    const userId = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userId || !token) return;

    const response = await fetch(`/api/checkin/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar check-in: ${response.status}`);
    }

    const data = await response.json();
    const check = data.verificar[0];
    if (check && check.checstat === "Em uso") {
      document.querySelectorAll(".toAcceptDelivery").forEach((btn) => {
        btn.disabled = false;
      });
      return true;
    } else {
      document.querySelectorAll(".toAcceptDelivery").forEach((btn) => {
        btn.disabled = true;
      });
      return false;
    }
  } catch (error) {
    console.error("Erro ao verificar check-in:", error);
    return false;
  };
};

// pegar veiculos para adicionar no input através de um filtro
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
    console.log("carros", carros);

    const carrosAtivos = carros.filter(
      (carro) => carro.caaustat === "Disponível" && carro.caausitu === "Interno"
    );

    const select = document.getElementById("caminhao");
    if (select) {
      select.innerHTML = '<option value="">Selecione..</option>';
      carrosAtivos.forEach((carro) => {
        const option = document.createElement("option");
        option.value = carro.caaucode;
        option.textContent = `${carro.caaumaca} - ${carro.caauplac}`;
        select.appendChild(option);
      });

      select.value = "";
    }
  } catch (error) {
    console.error("Erro na aplicação para buscar carros DISPONIVEIS E INTERNOS:", error);
  }
}

let idDelivery = "";
let idBem = "";

async function listDeliveryForDriver() {
  updateRuntimeStatusDelivery();

  try {
    const token = localStorage.getItem("token");
    const motoristaId = localStorage.getItem("user");
    const container = document.querySelector(".showDelivery");

    if (!token || !motoristaId || !container) return;

    if (isTokenExpired(token)) {
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

    if (!response.ok) return;

    const data = await response.json();
    
    const entregas = data.entrega;
    if (!entregas || entregas.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center">
          <i class="bi bi-truck-flatbed fs-1 text-muted"></i>
          <p class="text-muted">Nenhuma entrega disponível para você no momento.</p>
        </div>`;
      return;
    }

    const nomeMotorista = await SearchNameDriverLogado(motoristaId);
    if (!nomeMotorista) return;

    for (const entrega of entregas) {
      idDelivery = entrega.loficode;
      idBem = entrega.lofiidbe;

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

        if (Array.isArray(cliente) && cliente.length > 0) {
          nomeClient = cliente[0].clienome || "Sem nome";
          clientPhone = cliente[0].cliecelu || "Não passado";
        } else if (cliente?.clienome) {
          nomeClient = cliente.clienome;
          clientPhone = cliente.cliecelu || "Não passado";
        }
      }

      let botoes = "";
      const statusEntrega = entrega.lofistat;

      if (statusEntrega === "Entrega aceita") {
        botoes = `<button 
          class="btn btn-warning w-75 finishDelivery"
          data-location="${entrega.lofiidlo}"
          data-cliente="${nomeClient}"
          data-id="${entrega.loficode}"
          data-localization="${entrega.loficep} - ${entrega.lofirua} - ${entrega.loficida}"
          data-dataloc="${entrega.lofidtlo}"
          data-bem="${entrega.lofiidbe}"
          data-moto="${nomeMotorista}">
          Finalizar
        </button>`;
      } else {
        botoes = `<button class="btn btn-success w-75 toAcceptDelivery" 
        data-id="${entrega.loficode}"
        data-bem="${entrega.lofiidbe}"
        data-endereco=" ${entrega.loficep} - ${entrega.lofirua} - ${entrega.lofibair} - ${entrega.loficida}"
        data-cliente="${nomeClient}"
        data-dataloc="${formatarData(entrega.lofidtlo)}">Aceitar</button>`;
      }
      
      const card = document.createElement("div");
      card.className = "col-md-6 col-lg-4";

      card.innerHTML = `
        <div class="card border-0 shadow-sm h-100" data-entrega-id="${
          entrega.lofiidlo
        }">
          <div class="card-body">
            <h5 class="card-title">
              <i class="bi bi-truck"></i>
              Entrega #${entrega.lofiidlo}
            </h5>
            <p class="mb-1"><i class="bi bi-geo-alt-fill text-danger"></i> ${
              entrega.lofirua
            }, ${entrega.lofibair}, ${entrega.loficida}</p>
            <p class="mb-1"><i class="bi bi-calendar-check text-success me-2"></i>Data da Locação: ${formatarData(
              entrega.lofidtlo
            )}</p>
           
            <p class="mb-1"><i class="bi bi-person-fill text-info"></i> Cliente: ${nomeClient}</p>
            <p class="mb-1"><i class="bi bi-telephone-fill"></i> Telefone do Cliente: ${clientPhone}</p>
            <p class="mb-0"><i class="bi bi-credit-card-fill text-warning"></i> Pagamento: ${
              entrega.lofipgmt
            }</p>
            <br>
            <div class="d-flex flex-row justify-content-center w-100">
              ${botoes}
            </div>
          </div>
        </div>`;

      container.appendChild(card);

      const btnAceitar = card.querySelector(".toAcceptDelivery");
      if (btnAceitar) {
        btnAceitar.disabled = true
       btnAceitar.addEventListener("click", (event) => {
       const btn = event.currentTarget;
    
       idDelivery = btn.dataset.id;
       idBem = btn.dataset.bem;

       document.getElementById("IdEntrega").textContent = btn.dataset.id;
       document.getElementById("enderecoEntrega").textContent = btn.dataset.endereco;
       document.getElementById("clienteEntrega").textContent = btn.dataset.cliente;
       document.getElementById("dataEntrega").textContent = btn.dataset.dataloc;

   
        const modal = new bootstrap.Modal(document.getElementById("modalConfirmAccept"));
        modal.show();
       });

       const btnConfirmModal = document.getElementById("buttonAcceptDelivery");
        btnConfirmModal.onclick = (event) => {
        toAcceptDeliveryNow(event , token , idDelivery , idBem);
        };

     }

      const btnFinish = card.querySelector(".finishDelivery");
      if (btnFinish) {
        btnFinish.addEventListener("click", (event) =>
          finishDelivery(event.currentTarget)
        );
      };
    };
    await verifiqueCheck()
  } catch (error) {
    console.error("Erro na listagem de entregas:", error);
    document.querySelector(".showDelivery").innerHTML = `
      <p class="text-danger text-center fw-bold">Erro ao carregar entregas.</p>`;
  };
};



// ATUALIZAR EM TEMPO REAL PARA MOSTRAR O BOTÃO NA TELA FINALIZAR
async function updateRuntimeStatusDelivery() {
  const socket = io();

  socket.on("statusDelivey", (entregaAtualizada) => {
    console.log("Atualização recebida via socket:", entregaAtualizada);

    // Localize o card da entrega pelo ID (usando o texto da entrega)
    let cardBody = null;
    document.querySelectorAll(".card-title").forEach((card) => {
      if (card.textContent.includes(`Entrega #${entregaAtualizada.lofiidlo}`)) {
        cardBody = card.closest(".card-body");
      }
    });

    if (cardBody) {
      const btnFinalizar = cardBody.querySelector(".finishDelivery");
      const btnAceitar = cardBody.querySelector(".toAcceptDelivery");

      if (btnAceitar) btnAceitar.classList.add("d-none");
      if (btnFinalizar) btnFinalizar.classList.remove("d-none");
    }
  });
};

// Esta função será chamada ao clicar no botão "Aceitar Entrega" da modal
async function toAcceptDeliveryNow(event,token, idDelivery, idBem) {

  console.log('id bem' , token)
  try {
    
    if (!idDelivery || !idBem) throw new Error("Dados obrigatórios faltando!");
    console.log(idDelivery)

    const response = await fetch(`/api/statusupdate/${idDelivery}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
         status: "Entrega aceita", 
         goodsId: idBem
      })
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message);

    Toastify({
      text: "Entrega aceita e bem atualizado!",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "green",
    }).showToast();

    // atualiza UI
    await listDeliveryForDriver();
    const btnAceitar = event.target;
    btnAceitar.classList.add("d-none");
    btnAceitar.closest(".card")?.querySelector(".finishDelivery")?.classList.remove("d-none");

  } catch (error) {
    console.error("Erro:", error);
    Toastify({
      text: "Erro ao aceitar entrega",
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
  };
};


// finalizar a entrega deixar a caçamba no cliente
function finishDelivery(button) {
  const modalFinishDeliveryEl = document.querySelector(".modalFinishLocation");
  if (modalFinishDeliveryEl) {
    const idDelivery = button.getAttribute("data-id");
    const idNumeroLocacao = button.getAttribute("data-location");
    const localization = button.getAttribute("data-localization");
    const nomeCliente = button.getAttribute("data-cliente");
    const dataLocacao = button.getAttribute("data-dataLoc");
    const idBem = button.getAttribute("data-bem");
    const dataFormatada = new Date(dataLocacao).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Sao_Paulo",
    });
    const nomeMotorista = button.getAttribute("data-moto");

    
    document.getElementById("nomeDoCliente").textContent = nomeCliente;
    document.getElementById("numeroDaLocacao").textContent = idNumeroLocacao;
    document.getElementById("destinoEntrega").textContent = localization;
    document.getElementById("dataEntrega").textContent = dataFormatada;
    document.getElementById("nomeDoMotorista").textContent = nomeMotorista;

    const buttonFinish = document.getElementById("submitFinishDelivery");
    const checkBoxValid = document.getElementById("confirmTermos");

    if (checkBoxValid && buttonFinish && idDelivery) {
      checkBoxValid.addEventListener("change", () => {
        if (checkBoxValid.checked) {
          buttonFinish.removeAttribute("disabled");
        } else {
          buttonFinish.setAttribute("disabled", "true");
        }
      });
    }

    const modal = new bootstrap.Modal(modalFinishDeliveryEl);
    modal.show();

    if (!idDelivery || !idNumeroLocacao || !nomeMotorista) return;

    if (buttonFinish) {
      buttonFinish.addEventListener("click", async () => {
        submitDataFinishDelivery(
          idDelivery,
          idNumeroLocacao,
          nomeMotorista,
          idBem,
          button
        );
      });
    };
  };
};

// enviar dados da modal de finalização da entrega e finalizar 
async function submitDataFinishDelivery(idDelivery,idNumeroLocacao,nomeMotorista,idBem,button) {
  try {
    const token = localStorage.getItem("token");

    const payload = {
      enfiLoca: idDelivery,
      enfiNmlo: idNumeroLocacao,
      enfiNmMt: nomeMotorista,
      enfiBem: idBem,
    };
    
    console.log("payload" ,payload)

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

      const card = button.closest(".col-md-6"); 
      if (card) {
        card.remove();
      }

      // Fecha a modal
      const modalEl = document.querySelector(".modalFinishLocation");
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) {
        modal.hide();
      }
    };

  } catch (error) {
    console.error("Erro para enviar dados de finalização de entrega", error);
  };
};
