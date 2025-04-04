const btnCadAutomo = document.querySelector(".btnCadAutomo");
btnCadAutomo.addEventListener("click", () => {
  const informative = document.querySelector(".information");
  informative.style.display = "block";
  informative.textContent = "SEÇÃO VEICULOS";

  const containerAppAutomo = document.querySelector(".containerAppAutomo");
  containerAppAutomo.style.display = "flex";

  const containerAppFabri = document.querySelector(".containerAppFabri");
  containerAppFabri.style.display = "none";

  const containerAppClient = document.querySelector(".containerAppClient");
  containerAppClient.style.display = "none";

  const containerAppBens = document.querySelector(".containerAppBens");
  containerAppBens.style.display = "none";

  const containerAppForn = document.querySelector(".containerAppForn");
  containerAppForn.style.display = "none";

  const containerAppProd = document.querySelector(".containerAppProd");
  containerAppProd.style.display = "none";

  const containerAppTypeProd = document.querySelector(".containerAppTipoProd");
  containerAppTypeProd.style.display = "none";

  const containerForm = document.querySelector(".RegisterDriver");
  containerForm.style.display = "none";

  const containerFormEditDriver = document.querySelector(
    ".containerFormEditDriver"
  );
  containerFormEditDriver.style.display = "none";

  const containerAppDriver = document.querySelector(".containerAppDriver");
  containerAppDriver.style.display = "none";
});

const btnRegisterAutomo = document.querySelector(".registerAuto");
btnRegisterAutomo.addEventListener("click", () => {
  const formCadAuto = document.querySelector(".formCadAuto");
  formCadAuto.style.display = "flex";

  const btnInitAutoPageMain = document.querySelector(".btnInitAutoPageMain");
  btnInitAutoPageMain.style.display = "none";

  const listingAutomo = document.querySelector(".listingAutomo");
  listingAutomo.style.display = "none";
});

const btnOutCadAuto = document.querySelector(".btnOutCadAuto");
btnOutCadAuto.addEventListener("click", (event) => {
  event.preventDefault();
  const formCadAuto = document.querySelector(".formCadAuto");
  formCadAuto.style.display = "none";

  const btnInitAutoPageMain = document.querySelector(".btnInitAutoPageMain");
  btnInitAutoPageMain.style.display = "flex";

  const listingAutomo = document.querySelector(".listingAutomo");
  listingAutomo.style.display = "flex";
});

const btnOutCadAutoEdit = document.querySelector(".btnOutCadAutoEdit");
btnOutCadAutoEdit.addEventListener("click", (event) => {
  event.preventDefault();

  const btnInitAutoPageMain = document.querySelector(".btnInitAutoPageMain");
  btnInitAutoPageMain.style.display = "flex";

  const editFormAuto = document.querySelector(".editFormAuto");
  editFormAuto.style.display = "none";

  const listingAutomo = document.querySelector(".listingAutomo");
  listingAutomo.style.display = "flex";
});
const buttonExitAuto = document.querySelector(".buttonExitAuto");
buttonExitAuto.addEventListener("click", () => {
  const containerAppAutomo = document.querySelector(".containerAppAutomo");
  containerAppAutomo.style.display = "none";
});
//listar motorista
const loadDrivers = async () => {
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
    const response = await fetch("/api/listingdriver", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const drivers = await response.json();

    const select = document.getElementById("motoAuto");
    const selectEdit = document.getElementById("motoAutoEdit");

    // Adiciona as opções ao select
    drivers.forEach((driver) => {
      const option = document.createElement("option");
      option.value = driver.motocode;
      option.textContent = driver.motoname;
      select.appendChild(option);
    });
    drivers.forEach((driver) => {
      const option = document.createElement("option");
      option.value = driver.motocode;
      option.textContent = driver.motoname;
      selectEdit.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar motoristas:", error);
  }
};

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expTime = payload.exp * 1000;
    return Date.now() > expTime;
  } catch (error) {
    return true;
  }
}

// cadastrar
const socketUpdateAutomovel = io();
document.addEventListener("DOMContentLoaded", async () => {
  await loadDrivers();

  await listarVeiculos();

  socketUpdateAutomovel.on("updateRunTimeAutomovel", (veiculos) => {
    insertVehicleTableRunTime(veiculos);
  });

  socketUpdateAutomovel.on("updateTableAutomovel", (updatedVeiculo) => {
    updateVeiculoInTableRunTime(updatedVeiculo);
  });
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
      // Captura os valores do formulário
      const formData = {
        caaucode: document.querySelector("#codeAuto").value,
        caauplac: document.querySelector("#placAuto").value,
        caauchss: document.querySelector("#chassAuto").value,
        caaurena: document.querySelector("#renaAuto").value,
        caaumaca: document.querySelector("#macaAuto").value,
        caaumode: document.querySelector("#modeAuto").value,
        caaucor: document.querySelector("#corAuto").value,
        caautico: document.querySelector("#tpCombusAuto").value,
        caaukmat: document.querySelector("#kmAtAuto").value,
        caaumoto: document.querySelector("#motoAuto").value,
        caaustat: document.querySelector("#statAuto").value,
        caaudtca: document.querySelector("#dtCadAuto").value,
      };

      try {
        const response = await fetch("http://localhost:3000/api/cadauto", {
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
            backgroundColor: "green",
          }).showToast();
          document.querySelector(".foorm").reset();

        }else if(response.status === 409) {
          Toastify({
            text: result.message || "Codigo ja cadastrado" , 
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "orange",
          }).showToast();
        }else{   
          Toastify({
            text: "Erro para cadastrar veiculo",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
          }).showToast();
        }

      } catch (error) {
        console.error("Erro ao enviar formulário:", error);
        alert("Erro ao enviar os dados para server.");
      }
    });
  validationFormAutomovel();
});

// inserindo os dados na tabela em runtime
function insertVehicleTableRunTime(veiculos) {
  const veiculosListDiv = document.querySelector(".listingAutomo");
  veiculosListDiv.innerHTML = ""; 

  if (veiculos.length > 0) {
    const tabela = document.createElement("table");
    tabela.style.width = "100%";
    tabela.setAttribute("border", "1");

    // Cabeçalho da tabela
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
      "Tipo",
      "Km Atual",
      "Motor",
      "Status",
      "Data de Cadastro",
    ];

    colunas.forEach((coluna) => {
      const th = document.createElement("th");
      th.textContent = coluna;
      linhaCabecalho.appendChild(th);
    });

    const corpo = tabela.createTBody();
    veiculos.forEach((veiculo) => {
      const linha = corpo.insertRow();
      linha.setAttribute("data-caaucode", veiculo.caaucode);

      const checkboxCell = linha.insertCell();
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "selectVeiculo";
      checkbox.value = veiculo.caaucode;
      checkbox.dataset.veiculo = JSON.stringify(veiculo);
      checkboxCell.appendChild(checkbox);

      linha.insertCell().textContent = veiculo.caaucode || "-";
      linha.insertCell().textContent = veiculo.caauplac || "-";
      linha.insertCell().textContent = veiculo.caauchss || "-";
      linha.insertCell().textContent = veiculo.caaurena || "-";
      linha.insertCell().textContent = veiculo.caaumaca || "-";
      linha.insertCell().textContent = veiculo.caaumode || "-";
      linha.insertCell().textContent = veiculo.caaucor || "-";
      linha.insertCell().textContent = veiculo.caautico || "-";
      linha.insertCell().textContent = veiculo.caaukmat || "-";
      linha.insertCell().textContent = veiculo.caaumoto || "-";
      linha.insertCell().textContent = veiculo.caaustat || "-";
      linha.insertCell().textContent = formatDate(veiculo.caaudtca);
    });

    veiculosListDiv.appendChild(tabela);
  } else {
    veiculosListDiv.innerHTML = "<p>Nenhum veículo cadastrado.</p>";
  }
}

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
    const veiculos = await response.json();

    console.log('Meus Veiculos:' ,  veiculos)

    const veiculosListDiv = document.querySelector(".listingAutomo");
    veiculosListDiv.innerHTML = "";

    if (veiculos.length > 0) {
      const tabela = document.createElement("table");
      tabela.style.width = "100%";
      tabela.setAttribute("border", "1");

      // Cabeçalho
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
        "Tipo",
        "Km Atual",
        "Motorista",
        "Status",
        "Data de Cadastro",
      ];

      colunas.forEach((coluna) => {
        const th = document.createElement("th");
        th.textContent = coluna;
        linhaCabecalho.appendChild(th);
      });

      // Corpo da tabela
      const corpo = tabela.createTBody();
      veiculos.forEach((veiculo) => {
        const linha = corpo.insertRow();

        linha.setAttribute("data-caaucode", veiculo.caaucode);

        const checkboxCell = linha.insertCell();
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "selectVeiculo";
        checkbox.value = veiculo.caaucode;

        const veiculoData = JSON.stringify(veiculo);
        if (veiculoData) {
          checkbox.dataset.veiculo = veiculoData;
        } else {
          console.warn(`Veículo inválido encontrado:`, veiculo);
        }

        checkboxCell.appendChild(checkbox);

        linha.insertCell().textContent = veiculo.caaucode;
        linha.insertCell().textContent = veiculo.caauplac;
        linha.insertCell().textContent = veiculo.caauchss;
        linha.insertCell().textContent = veiculo.caaurena;
        linha.insertCell().textContent = veiculo.caaumaca;
        linha.insertCell().textContent = veiculo.caaumode;
        linha.insertCell().textContent = veiculo.caaucor;
        linha.insertCell().textContent = veiculo.caautico;
        linha.insertCell().textContent = veiculo.caaukmat;
        linha.insertCell().textContent = veiculo.caaumoto;
        linha.insertCell().textContent = veiculo.caaustat;

        linha.insertCell().textContent = formatDate(veiculo.caaudtca);
      });

      // Adiciona a tabela à div
      veiculosListDiv.appendChild(tabela);
    } else {
      veiculosListDiv.innerHTML = "<p>Nenhum veículo cadastrado.</p>";
    }
  } catch (error) {
    console.error("Erro ao carregar veículos:", error);
    document.querySelector(".listVeiculos").innerHTML =
      "<p>Erro ao carregar veículos.</p>";
  }
}

// DELETAR AUTOMOVEL
const buttonDeleteAuto = document.querySelector(".buttonDeleteAuto");
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
      backgroundColor: "red",
    }).showToast();
    return;
  }

  const veiculoSelecionado = JSON.parse(selectedCheckbox.dataset.veiculo);
  const veiculoId = veiculoSelecionado.caaucode;

  const confirmacao = confirm(
    `Tem certeza de que deseja excluir o veículo com código ${veiculoId}?`
  );
  if (!confirmacao) {
    return;
  }

  await deleteAuto(veiculoId, selectedCheckbox.closest("tr"));
});

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
    console.log("Resposta do servidor:", data);

    if (response.ok) {
      Toastify({
        text: "O veículo foi excluído com sucesso!",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();

      autoRow.remove();
    } else {
      console.log("Erro para excluir:", data);
      Toastify({
        text: "Erro na exclusão do veículo",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
    }
  } catch (error) {
    console.error("Erro ao excluir veículo:", error);
    Toastify({
      text: "Erro ao excluir veículo. Tente novamente.",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
  }
}

// EDITAR AUTOMOVEL
const editButtonAuto = document.querySelector(".buttonEditAuto");
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
      backgroundColor: "red",
    }).showToast();
    return;
  }

  // Exibir o formulário de edição e ocultar a listagem
  document.querySelector(".editFormAuto").style.display = "flex";
  document.querySelector(".btnInitAutoPageMain").style.display = "none";
  document.querySelector(".listingAutomo").style.display = "none";

  // Pegar os dados do veículo selecionado
  const autoData = selectedCheckbox.dataset.veiculo;

  if (!autoData) {
    console.error("O atributo data-veiculo está vazio ou indefinido.");
    return;
  }

  try {
    const autoSelecionado = JSON.parse(autoData);
    console.log("Editar veículo:", autoSelecionado);

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
      { id: "motoAutoEdit", valor: autoSelecionado.caaumoto },
      { id: "statAutoEdit", valor: autoSelecionado.caaustat },
      { id: "dtCadAutoEdit", valor: formatDate(autoSelecionado.caaudtca) },
    ];

    campos.forEach(({ id, valor }) => {
      const elemento = document.getElementById(id);
      if (elemento) {
        if (elemento.type === "date" && valor) {
          elemento.value = formatDate(valor);
        } else {
          elemento.value = valor || "";
        }
      } else {
        console.warn(`Elemento com ID '${id}' não encontrado.`);
      }
    });
  } catch (error) {
    console.error("Erro ao processar os dados do veículo:", error);
  }
});

async function editAndUpdateOfAuto() {
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
      caauplac: document.getElementById("placAutoEdit").value,
      caauchss: document.getElementById("chassAutoEdit").value,
      caaurena: document.getElementById("renaAutoEdit").value,
      caaumaca: document.getElementById("macaAutoEdit").value,
      caaumode: document.getElementById("modeAutoEdit").value,
      caaucor: document.getElementById("corAutoEdit").value,
      caautico: document.getElementById("tpCombusAutoEdit").value,
      caaukmat: document.getElementById("kmAtAutoEdit").value,
      caaumoto: document.getElementById("motoAutoEdit").value,
      caaustat: document.getElementById("statAutoEdit").value,
      caaudtca: document.getElementById("dtCadAutoEdit").value || null,
    };
    const token = localStorage.getItem("token"); // Pega o token armazenado no login

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
      const response = await fetch(`/api/cadauto/${autoSelecionado.caaucode}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateAuto),
      });

      if (response.ok) {
        console.log("Atualização bem-sucedida");
        Toastify({
          text: `Veículo '${autoSelecionado.caaucode}' atualizado com sucesso!`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();

        formEditAuto.reset();
      } else {
        console.error("Erro ao atualizar veículo:", await response.text());
        Toastify({
          text: "Erro ao atualizar veículo",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  });
}

editAndUpdateOfAuto();

// ATUALIZAR EM TEMPO REAL 
function updateVeiculoInTableRunTime(updatedVeiculo) {
  const row = document.querySelector(
    `[data-caaucode="${updatedVeiculo.caaucode}"]`
  );

  if (row) {
    row.cells[2].textContent = updatedVeiculo.caauplac || "-"; // Placa
    row.cells[3].textContent = updatedVeiculo.caauchss || "-"; // Chassi
    row.cells[4].textContent = updatedVeiculo.caaurena || "-"; // Modelo
    row.cells[5].textContent = updatedVeiculo.caaumaca || "-"; // Marca
    row.cells[6].textContent = updatedVeiculo.caaumode || "-"; // Ano
    row.cells[7].textContent = updatedVeiculo.caaucor || "-"; // Cor
    row.cells[8].textContent = updatedVeiculo.caautico || "-"; // Tipo
    row.cells[9].textContent = updatedVeiculo.caaukmat || "-"; // Km Atual
    row.cells[10].textContent = updatedVeiculo.caaumoto || "-"; // Motor
    row.cells[11].textContent = updatedVeiculo.caaustat || "-"; // Status
    row.cells[12].textContent = formatDate(updatedVeiculo.caaudtca); // Data de Cadastro
  }
}
