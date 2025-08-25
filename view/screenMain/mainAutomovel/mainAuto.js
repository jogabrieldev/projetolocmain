function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expTime = payload.exp * 1000;
    return Date.now() > expTime;
  } catch (error) {
    return true;
  }
}
function dateAtualInField(date) {
  const inputDtCad = document.getElementById(date);
  if (inputDtCad) {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    inputDtCad.value = `${ano}-${mes}-${dia}`;
    return true; // indica sucesso
  } else {
    console.error("Campo #fornDtcd não encontrado no DOM");
    return false; // indica falha
  }
}

function maskFieldveicu() {
  $(document).ready(function () {
    $("#placAuto").mask("AAA0A00", {
      translation: {
        A: { pattern: /[A-Za-z]/ },
        0: { pattern: /[0-9]/ },
      },
    });
  });
};

function validarRenavam(renavam) {
  // Remove caracteres não numéricos
  renavam = renavam.replace(/\D/g, '');

  // Deve ter exatamente 11 dígitos
  if (renavam.length !== 11) return false;

  // Verifica se todos os dígitos são iguais (ex.: 11111111111)
  if (/^(\d)\1+$/.test(renavam)) return false;

  // Calcula dígito verificador
  let renavamSemDV = renavam.slice(0, -1);
  let soma = 0;
  let multiplicador = 2;

  for (let i = renavamSemDV.length - 1; i >= 0; i--) {
    soma += parseInt(renavamSemDV[i]) * multiplicador;
    multiplicador++;
    if (multiplicador > 9) multiplicador = 2;
  }

  let resto = soma % 11;
  let dvCalculado = resto === 0 || resto === 1 ? 0 : (11 - resto);

  return dvCalculado === parseInt(renavam.slice(-1));
};

function validarChassi(chassi) {
  chassi = chassi.toUpperCase().trim();

  // Deve ter 17 caracteres
  if (chassi.length !== 17) return false;

  // Não pode conter I, O ou Q
  if (/[IOQ]/.test(chassi)) return false;

  // Deve conter apenas letras e números
  if (!/^[A-Z0-9]+$/.test(chassi)) return false;

  return true; // Validação básica
};



const socketAutomovel = io();
document.addEventListener("DOMContentLoaded", () => {
  const btnLoadVehicles = document.querySelector(".btnCadAutomo");
  if (btnLoadVehicles) {
    btnLoadVehicles.addEventListener("click", async (event) => {
      event.preventDefault();
      try {
        const responseVehicles = await fetch("/veiculos", {
          method: "GET",
        });
        if (!responseVehicles.ok)
          throw new Error(`Erro HTTP: ${responseVehicles.status}`);
        const html = await responseVehicles.text();
        const mainContent = document.querySelector("#mainContent");
        if (mainContent) {
          mainContent.innerHTML = html;
          interationSystemVehicles();
          registerNewVehicles();
          dateAtualInField("dtCadAuto");
          deleteVehiclesSystem();
          searchVehicles();
          editVehicles();
          maskFieldveicu();
        } else {
          console.error("#mainContent não encontrado no DOM");
        }

        const containerAppVehicles = document.querySelector(
          ".containerAppAutomo"
        );
        if (containerAppVehicles) containerAppVehicles.classList.add("flex");

        const sectionsToHide = [
          ".containerAppProd",
          ".containerAppFabri",
          ".containerAppTipoProd",
          ".containerAppDriver",
          ".containerAppClient",
          ".containerAppBens",
          ".containerAppForn",
        ];
        sectionsToHide.forEach((selector) => {
          const element = document.querySelector(selector);
          if (element) element.style.display = "none";
        });

        const containerRegisterVehicles =
          document.querySelector(".formCadAuto");
        const btnMainPageVehicles = document.querySelector(
          ".btnInitAutoPageMain"
        );
        const listingVehicles = document.querySelector(".listingAutomo");
        const editFormVehicles = document.querySelector(".editFormAuto");
        const informative = document.querySelector(".information");

        if (containerRegisterVehicles)
          containerRegisterVehicles.style.display = "none";
        if (btnMainPageVehicles) btnMainPageVehicles.style.display = "flex";
        if (listingVehicles) listingVehicles.style.display = "flex";
        if (editFormVehicles) editFormVehicles.style.display = "none";
        if (informative) {
          informative.style.display = "block";
          informative.textContent = "SEÇÃO VEÍCULOS";
        }

        await listarVeiculos();
      } catch (error) {
         Toastify({
          text: "Erro na pagina",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
      }
    });
  };

  socketAutomovel.on("updateRunTimeAutomovel", (veiculos) => {
    listarVeiculos();
  });

  socketAutomovel.on("updateTableAutomovel", (updatedVeiculo) => {
    listarVeiculos();
  });
});

function interationSystemVehicles() {
  const btnRegisterAutomo = document.querySelector(".registerAuto");
  if (btnRegisterAutomo) {
    btnRegisterAutomo.addEventListener("click", () => {
      const formCadAuto = document.querySelector(".formCadAuto");
      if (formCadAuto) {
        formCadAuto.classList.remove("hidden");
        formCadAuto.classList.add("flex");
      }

      const btnInitAutoPageMain = document.querySelector(
        ".btnInitAutoPageMain"
      );
      if (btnInitAutoPageMain) {
        btnInitAutoPageMain.classList.remove("flex");
        btnInitAutoPageMain.classList.add("hidden");
      }

      const listingAutomo = document.querySelector(".listingAutomo");
      if (listingAutomo) {
        listingAutomo.classList.remove("flex");
        listingAutomo.classList.add("hidden");
      }
    });
  };

  const btnOutCadAuto = document.querySelector(".btnOutCadAuto");
  if (btnOutCadAuto) {
    btnOutCadAuto.addEventListener("click", (event) => {
      event.preventDefault();

      const formCadAuto = document.querySelector(".formCadAuto");
      if (formCadAuto) {
        formCadAuto.classList.remove("flex");
        formCadAuto.classList.add("hidden");
      }

      const btnInitAutoPageMain = document.querySelector(
        ".btnInitAutoPageMain"
      );
      if (btnInitAutoPageMain) {
        btnInitAutoPageMain.classList.remove("hidden");
        btnInitAutoPageMain.classList.add("flex");
      }

      const listingAutomo = document.querySelector(".listingAutomo");
      if (listingAutomo) {
        listingAutomo.classList.remove("hidden");
        listingAutomo.classList.add("flex");
      }
    });
  };

  const btnOutCadAutoEdit = document.querySelector(".btnOutCadAutoEdit");
  if (btnOutCadAutoEdit) {
    btnOutCadAutoEdit.addEventListener("click", (event) => {
      event.preventDefault();

      const btnInitAutoPageMain = document.querySelector(
        ".btnInitAutoPageMain"
      );
      if (btnInitAutoPageMain) {
        btnInitAutoPageMain.classList.remove("hidden");
        btnInitAutoPageMain.classList.add("flex");
      }

      const editFormAuto = document.querySelector(".editFormAuto");
      if (editFormAuto) {
        editFormAuto.classList.remove("flex");
        editFormAuto.classList.add("hidden");
      }

      const listingAutomo = document.querySelector(".listingAutomo");
      if (listingAutomo) {
        listingAutomo.classList.remove("hidden");
        listingAutomo.classList.add("flex");
      }
    });
  };

  const buttonExitAuto = document.getElementById("buttonExitAuto");
  if (buttonExitAuto) {
    buttonExitAuto.addEventListener("click", () => {
      const containerAppAutomo = document.querySelector(".containerAppAutomo");
      if (containerAppAutomo) {
        containerAppAutomo.classList.remove("flex");
        containerAppAutomo.classList.add("hidden");
      }

      const informative = document.querySelector(".information");
      if (informative) {
        informative.style.display = "block";
        informative.textContent = "Sessão ativa";
      }
    });
  };
};

//CADASTRAR VEICULOS
async function registerNewVehicles() {
  dateAtualInField("dtCadAuto");
  document.querySelector(".cadAutomo").addEventListener("click", async (event) => {
      event.preventDefault();

      const token = localStorage.getItem("token");

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

      if (!$(".foorm").valid()) {
        return;
      }

     const chassiValido = validarChassi(document.querySelector("#chassAuto").value);

     if (!chassiValido) {
     Toastify({
     text: "O formato que foi adicionado no campo CHASSI não é compatível!",
     duration: 3000,
     close: true,
     gravity: "top",
     position: "center",
     backgroundColor: "#f44336",
     }).showToast();
     return;
    }

    const renavamValido = validarRenavam(document.querySelector("#renaAuto").value.trim());

    if (!renavamValido) {
      Toastify({
      text: "O formato que foi adicionado no campo RENAVAM não é compatível!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "#f44336",
     }).showToast();
    return;
   }


      const formData = {
        caaucode: document.querySelector("#codeAuto").value.trim(),
        caauplac: document.querySelector("#placAuto").value.toUpperCase(),
        caauchss: document.querySelector("#chassAuto").value.trim().toUpperCase(),
        caaurena: document.querySelector("#renaAuto").value.trim(),
        caaumaca: document.querySelector("#macaAuto").value.trim(),
        caaumode: document.querySelector("#modeAuto").value.trim(),
        caaucor: document.querySelector("#corAuto").value.trim(),
        caautico: document.querySelector("#tpCombusAuto").value.trim(),
        caaukmat: document.querySelector("#kmAtAuto").value.trim(),
        caauloca: document.querySelector("#pdLocCar").value.trim(),
        caaustat: document.querySelector("#statAuto").value.trim(),
        caaudtca: document.querySelector("#dtCadAuto").value,
        caausitu: document.querySelector("#situAuto").value.trim(),
        caauvenc: document.querySelector("#dtVenci").value
      };
      
       
      try {
        const response = await fetch("/api/cadauto", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
          Toastify({
            text: "Veiculo cadastrado com Sucesso",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#1d5e1d",
          }).showToast();
          document.querySelector(".foorm").reset();
          dateAtualInField("dtCadAuto");
          
        } else {
    
          if (result?.errors && Array.isArray(result.errors)) {
            const mensagens = result.errors
              .map((err) => `• ${err.message || err.msg}`)
              .join("\n");

            Toastify({
              text: mensagens,
              duration: 5000,
              close: true,
              gravity: "top",
              position: "center",
              backgroundColor: "#f44336",
            }).showToast();
          } else {
         
            Toastify({
              text: result?.message || "Erro ao cadastrar automovel.",
              duration: 3000,
              close: true,
              gravity: "top",
              position: "center",
              backgroundColor: response.status === 409 ? "orange" : "#f44336",
            }).showToast();
          };
        };
      } catch (error) {
        console.error("Erro ao enviar formulário:", error);
        Toastify({
          text: "Erro ao enviar os dados.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#f44336",
        }).showToast();
      };
    });
  validationFormAutomovel();
};

//listagem de veiculos
async function listarVeiculos() {
  const token = localStorage.getItem("token");

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

  try {
    const response = await fetch("/api/listauto", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      Toastify({
        text: result?.message || "Erro ao carregar Bens.",
        duration: 4000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
      return;
    }

    const veiculos = result;
    const veiculosListDiv = document.querySelector(".listingAutomo");
    veiculosListDiv.innerHTML = "";

    if (veiculos.length > 0) {
      const wrapper = document.createElement("div");
      wrapper.className = "table-responsive";

      const tabela = document.createElement("table");
      tabela.className =
        "table table-sm table-hover table-striped table-bordered tableVehicles";

      const cabecalho = tabela.createTHead();
      const linhaCabecalho = cabecalho.insertRow();

      const colunas = [
        "Selecionar",
        "Código",
        "Placa",
        "Chassi",
        "Modelo",
        "Marca",
        "Ano",
        "Cor",
        "Tipo de combustivel",
        "Km Atual",
        "Pode ser Locado",
        "Status",
        "Situação",
        "Data de Cadastro",
      ];

      colunas.forEach((coluna) => {
        const th = document.createElement("th");
        th.textContent = coluna;
        th.classList.add(
          "px-3",
          "py-2",
          "align-middle",
          "text-center",
          "wh-nowrap"
        );
        linhaCabecalho.appendChild(th);
      });

      const corpo = tabela.createTBody();
      veiculos.forEach((v) => {
        const linha = corpo.insertRow();
        linha.setAttribute("data-caaucode", v.caaucode);

        const checkboxCell = linha.insertCell();
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "selectVeiculo";
        checkbox.value = v.caaucode;
        checkbox.className = "form-check-input m-0";

        const veiculoData = JSON.stringify(v);
        if (veiculoData) {
          checkbox.dataset.veiculo = veiculoData;
        }

        checkboxCell.appendChild(checkbox);
        checkboxCell.classList.add("text-center", "align-middle", "wh-nowrap");

        const dados = [
          v.caaucode,
          v.caauplac,
          v.caauchss,
          v.caaurena,
          v.caaumaca,
          v.caaumode,
          v.caaucor,
          v.caautico,
          v.caaukmat,
          v.caauloca,
          v.caaustat,
          v.caausitu,
          formatDataPattersBr(v.caaudtca),
        ];

        dados.forEach((valor, index) => {
          const td = linha.insertCell();
          td.textContent = valor || "";
          td.classList.add("align-middle", "text-break", "px-3", "py-2");
        });
      });

      wrapper.appendChild(tabela);
      veiculosListDiv.appendChild(wrapper);
    } else {
      veiculosListDiv.innerHTML =
        "<p class='text-dark'>Nenhum veículo cadastrado.</p>";
    };
  } catch (error) {
    console.error("Erro ao carregar veículos:", error);
    document.querySelector(".listingAutomo").innerHTML =
      "<p class='text-dark'>Erro ao carregar veículos.</p>";
  };
};

// PESQUISAR VEICULO

async function searchVehicles() {
  const btnSearch = document.getElementById("searchVehicle");
  const popUpSearch = document.querySelector(".popUpsearchIdVehicles");
  const vehicleListDiv = document.querySelector(".listingAutomo");
  const backdrop = document.querySelector(".popupBackDrop");
  const btnOutPageSearch = document.querySelector(".outPageSearchVehicle");

  if (btnSearch && popUpSearch) {
    btnSearch.addEventListener("click", () => {
      popUpSearch.style.display = "flex";
      backdrop.style.display = "block";
    });
  }

  if (popUpSearch || btnOutPageSearch) {
    btnOutPageSearch.addEventListener("click", () => {
      popUpSearch.style.display = "none";
      backdrop.style.display = "none";
    });
  }

  let btnClearFilter = document.getElementById("btnClearFilter");
  if (!btnClearFilter) {
    btnClearFilter = document.createElement("button");
    btnClearFilter.id = "btnClearFilter";
    btnClearFilter.textContent = "Limpar filtro";
    btnClearFilter.className =
      "btn btn-secondary w-25 aling align-items: center;";
    btnClearFilter.style.display = "none";
    vehicleListDiv.parentNode.insertBefore(btnClearFilter, vehicleListDiv);

    btnClearFilter.addEventListener("click", () => {
      btnClearFilter.style.display = "none";

      document.getElementById("codeVehicle").value = "";
      document.getElementById("placVehicles").value = "";
      listarVeiculos();
    });
  };

  const btnSearchVehicle = document.querySelector(".submitSearchVehicle");
  if (btnSearchVehicle) {
    btnSearchVehicle.addEventListener("click", async () => {
      const codeInput = document.getElementById("codeVehicle").value.trim();
      const placInput = document.getElementById("placVehicles").value.trim();

      const filterField = [codeInput, placInput].filter((value) => value !== "");

      if (filterField.length === 0) {
        Toastify({
          text: "Preencha um campo para a pesquisa!",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#f44336",
        }).showToast();
        return;
      }
      if (filterField.length > 1) {
        Toastify({
          text: "Preencha apenas 1 campo para a pesquisa!",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#f44336",
        }).showToast();
        return;
      }

      const params = new URLSearchParams();
      if (codeInput) params.append("caaucode", codeInput);
      if (placInput) params.append("caauplac", placInput);

      try {
        const response = await fetch(`/api/automovel/search?${params}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok && data.veiculo?.length > 0) {
        
          Toastify({
            text: "O tipo de familia de bem foi encontrado com sucesso!.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#1d5e1d",
          }).showToast();
          
          btnClearFilter.style.display = "inline-block";
          
          renderVeiculosTable(data.veiculo);

          if (popUpSearch) popUpSearch.style.display = "none";
          if (backdrop) backdrop.style.display = "none";
        } else {
          Toastify({
            text: data.message || "Nenhum veiculo encontrado nessa pesquisa",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#f44336",
          }).showToast();
        };
      } catch (error) {
        console.error("Erro ao buscar veiculo:", error);
        Toastify({
          text: "Erro a buscar tente novamente",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#f44336",
        }).showToast();
      }
    });
  };
};

// renderizar tabela
function renderVeiculosTable(veiculos) {
  const veiculosListDiv = document.querySelector(".listingAutomo");
  veiculosListDiv.innerHTML = "";

  if (!veiculos || veiculos.length === 0) {
    veiculosListDiv.innerHTML =
      "<p class='text-light'>Nenhum veículo cadastrado.</p>";
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "table-responsive";

  const tabela = document.createElement("table");
  tabela.className =
    "table table-sm table-hover table-striped table-bordered tableVehicles";

  const colunas = [
    "Selecionar",
    "Código",
    "Placa",
    "Chassi",
    "Modelo",
    "Marca",
    "Ano",
    "Cor",
    "Tipo de combustível",
    "Km Atual",
    "Pode ser Locado",
    "Status",
    "Data de Cadastro",
  ];

  // Cabeçalho
  const cabecalho = tabela.createTHead();
  const linhaCabecalho = cabecalho.insertRow();

  colunas.forEach((coluna) => {
    const th = document.createElement("th");
    th.textContent = coluna;
    th.classList.add("px-3", "py-2", "align-middle");

    if (["Selecionar", "Código", "Placa", "Status"].includes(coluna)) {
      th.classList.add("text-center", "wh-nowrap");
    }

    linhaCabecalho.appendChild(th);
  });

  // Corpo
  const corpo = tabela.createTBody();

  veiculos.forEach((v) => {
    const linha = corpo.insertRow();
    linha.setAttribute("data-caaucode", v.caaucode);

    // Checkbox
    const checkboxCell = linha.insertCell();
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "selectVeiculo";
    checkbox.value = v.caaucode;
    checkbox.dataset.veiculo = JSON.stringify(v);
    checkbox.className = "form-check-input m-0";
    checkboxCell.classList.add("text-center", "align-middle", "wh-nowrap");
    checkboxCell.appendChild(checkbox);

    // Dados
    const dados = [
      v.caaucode,
      v.caauplac,
      v.caauchss,
      v.caaumode,
      v.caaumaca,
      v.caaurena,
      v.caaucor,
      v.caautico,
      v.caaukmat,
      v.caauloca,
      v.caaustat,
      formatDataPattersBr(v.caaudtca),
    ];

    dados.forEach((valor, index) => {
      const td = linha.insertCell();
      td.textContent = valor || "";
      td.classList.add("align-middle", "text-break", "px-3", "py-2");

      const coluna = colunas[index + 1]; // Ignora "Selecionar"
      if (["Código", "Placa", "Status"].includes(coluna)) {
        td.classList.add("text-center", "wh-nowrap");
      }
    });
  });

  wrapper.appendChild(tabela);
  veiculosListDiv.appendChild(wrapper);
};

// DELETAR VEICULOS
function deleteVehiclesSystem() {
  const buttonDeleteAuto = document.querySelector(".buttonDeleteAuto");
  if(!buttonDeleteAuto) return 
  buttonDeleteAuto.addEventListener("click", async () => {
    const selectedCheckbox = document.querySelector(
      'input[name="selectVeiculo"]:checked'
    );
    if (!selectedCheckbox) {
      Toastify({
        text: "Selecione um veículo para excluir",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
      return;
    };

    const veiculoSelecionado = JSON.parse(selectedCheckbox.dataset.veiculo);
    const veiculoId = veiculoSelecionado.caaucode;
     if(!veiculoId) return
    Swal.fire({
    title: `Excluir veiculo ${veiculoSelecionado.caauplac}?`,
    text: "Essa ação não poderá ser desfeita!",
    icon: "warning",
    iconColor: "#dc3545", // cor do ícone de alerta
    showCancelButton: true,
    confirmButtonText: "Excluir !",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
    background: "#f8f9fa", // cor de fundo clara
    color: "#212529", // cor do texto
    confirmButtonColor: "#dc3545", // vermelho Bootstrap
    cancelButtonColor: "#6c757d", // cinza Bootstrap
    buttonsStyling: true, // deixa os botões com estilo customizado
    customClass: {
     popup: "rounded-4 shadow-lg", // bordas arredondadas e sombra
     title: "fw-bold text-danger", // título em negrito e vermelho
     confirmButton: "btn btn-danger px-4", // botão vermelho estilizado
     cancelButton: "btn btn-secondary px-4" // botão cinza estilizado
   }
  }).then(async (result) => {
   if (result.isConfirmed) {
      const success = await deleteAuto(veiculoId, selectedCheckbox.closest("tr"));
      if(success){
        Swal.fire({
        title: "Excluído!",
        text: "O veiculo foi removido com sucesso.",
        icon: "success",
        confirmButtonColor: "#198754", 
        confirmButtonText: "OK",
        background: "#f8f9fa",
        customClass: {
        popup: "rounded-4 shadow-lg"
      }
    });
    };
   };
  });
 });
};
// deletar veiculo
  async function deleteAuto(id, autoRow) {
    const token = localStorage.getItem("token");

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
    try {
      const response = await fetch(`/api/cadauto/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        Toastify({
          text: "O veículo foi excluído com sucesso!",
          duration: 2000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#1d5e1d",
        }).showToast();

        autoRow.remove();
        return true
      } else {
        if (response.status === 400) {
          Toastify({
            text: data.message,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "orange",
          }).showToast();
          return false
        } else {
          console.log("Erro para excluir:", data);
          Toastify({
            text: "Erro na exclusão do Veiculo ",
            duration: 2000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#f44336",
          }).showToast();
          return false
        };
      };
    } catch (error) {
      console.error("Erro ao excluir veículo:", error);
      Toastify({
        text: "Erro ao excluir veículo. Tente novamente.",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
      return false
    };
  };


// EDITAR AUTOMOVEL
async function editVehicles() {
  const editButtonAuto = document.querySelector(".buttonEditAuto");
  if(!editButtonAuto) return 

  editButtonAuto.addEventListener("click", () => {
    const selectedCheckbox = document.querySelector(
      'input[name="selectVeiculo"]:checked'
    );

    if (!selectedCheckbox) {
      Toastify({
        text: "Selecione um veículo para editar",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
      return;
    }

    const btnMainPageVehicles = document.querySelector(".btnInitAutoPageMain");
    if (btnMainPageVehicles) {
      btnMainPageVehicles.classList.remove("flex");
      btnMainPageVehicles.classList.add("hidden");
    }

    const listVehicles = document.querySelector(".listingAutomo ");
    if (listVehicles) {
      listVehicles.classList.remove("flex");
      listVehicles.classList.add("hidden");
    }

    const containerEditForm = document.querySelector(".editFormAuto");
    if (containerEditForm) {
      containerEditForm.classList.remove("hidden");
      containerEditForm.classList.add("flex");
    }

    document.querySelector(".editFormAuto").style.display = "flex";
    document.querySelector(".btnInitAutoPageMain").style.display = "none";
    document.querySelector(".listingAutomo").style.display = "none";

    const autoData = selectedCheckbox.dataset.veiculo;

    if (!autoData) {
      console.error("O atributo data-veiculo está vazio ou indefinido.");
      return;
    }

    try {
      const autoSelecionado = JSON.parse(autoData);
    
      const campos = [
        { id: "codeAutoEdit", valor: autoSelecionado.caaucode },
        { id: "placAutoEdit", valor: autoSelecionado.caauplac },
        { id: "chassAutoEdit", valor: autoSelecionado.caauchss },
        { id: "renaAutoEdit", valor: autoSelecionado.caaurena },
        { id: "macaAutoEdit", valor: autoSelecionado.caaumaca },
        { id: "modeAutoEdit", valor: autoSelecionado.caaumode },
        { id: "corAutoEdit", valor: autoSelecionado.caaucor },
        { id: "tpCombusAutoEdit", valor: autoSelecionado.caautico },
        { id: "kmAtAutoEdit", valor: autoSelecionado.caaukmat },
        { id: "statAutoEdit", valor: autoSelecionado.caaustat },
        { id: "pdLocCarEdit", valor: autoSelecionado.caauloca },
        { id: "dtCadAutoEdit", valor: autoSelecionado.caaudtca },
      ];

      campos.forEach(({ id, valor }) => {
        const elemento = document.getElementById(id);
        if (elemento) {
          if (elemento.type === "date" && valor) {
            elemento.value = formatDateInput(valor);
          } else {
            elemento.value = valor || "";
          };
        } else {
          console.warn(`Elemento com ID '${id}' não encontrado.`);
        };

        let valorFormatado = (valor || "").trim();
        if (elemento.tagName === "SELECT") {
          const option = [...elemento.options].find(
            (opt) => opt.value === valorFormatado
          );
          if (option) {
            elemento.value = valorFormatado;

            if (id === "tpCombusAutoEdit") {
              const hiddenInput = document.getElementById("tpCombusAutoEditHidden");
              if (hiddenInput) {
                hiddenInput.value = valorFormatado;
              }
            };
          };
        };
      });
    } catch (error) {
      console.error("Erro ao processar os dados do veículo:", error);
    }
  });
  await editAndUpdateOfAuto();
};

  // EDITAR AUTOMOVEL
  async function editAndUpdateOfAuto() {

     const token = localStorage.getItem("token"); 

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
    const formEditAuto = document.querySelector(".foormEditVeicu");

    formEditAuto.addEventListener("submit", async (event) => {
      event.preventDefault();

      const selectedCheckbox = document.querySelector(
        'input[name="selectVeiculo"]:checked'
      );

      if (!selectedCheckbox) {
        console.error("Nenhum veículo foi selecionado.");
        return;
      }

      const autoData = selectedCheckbox.dataset.veiculo;

      if (!autoData) {
        console.error("O atributo data-veiculo está vazio ou inválido.");
        return;
      }

      let autoSelecionado;
      try {
        autoSelecionado = JSON.parse(autoData);
      } catch (error) {
        console.error("Erro ao fazer parse dos dados do veículo:", error);
        return;
      }

      const updateAuto = {
        caaucode: document.getElementById("codeAutoEdit").value,
        caauplac: document.getElementById("placAutoEdit").value.trim(),
        caauchss: document.getElementById("chassAutoEdit").value,
        caaurena: document.getElementById("renaAutoEdit").value,
        caaumaca: document.getElementById("macaAutoEdit").value.trim(),
        caaumode: document.getElementById("modeAutoEdit").value.trim(),
        caaucor: document.getElementById("corAutoEdit").value.trim(),
        caautico: document.getElementById("tpCombusAutoEdit").value,
        caaukmat: document.getElementById("kmAtAutoEdit").value.trim(),
        caaustat: document.getElementById("statAutoEdit").value.trim(),
        caauloca: document.getElementById("pdLocCarEdit").value.trim(),
        caaudtca: document.getElementById("dtCadAutoEdit").value
      };

     
      try {
         const result = await Swal.fire({
        title: `Atualizar veiculo ${autoSelecionado.caaucode}?`,
        text: "Você tem certeza de que deseja atualizar os dados deste veiculo?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Atualizar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
        confirmButtonColor: "#1d5e1d",
        cancelButtonColor: "#d33"
      });

      if (!result.isConfirmed) return;

        const response = await fetch(`/api/cadauto/${autoSelecionado.caaucode}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateAuto),
          }
        );

        if (response.ok) {
          
          Toastify({
            text: `Veículo '${autoSelecionado.caaucode}' atualizado com sucesso!`,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#1d5e1d",
          }).showToast();

          formEditAuto.reset();
        } else {
           const errorMessage =  await response.json();
          Toastify({
            text:`${errorMessage}`|| "Erro ao atualizar veículo",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#f44336",
          }).showToast();
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
         Toastify({
            text:"Erro no server para atualizar veiculo! verifique ",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#f44336",
          }).showToast();
      }
    });
  };

 

