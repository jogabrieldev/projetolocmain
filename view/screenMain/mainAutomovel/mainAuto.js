
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expTime = payload.exp * 1000;
    return Date.now() > expTime;
  } catch (error) {
    return true;
  }
}
function dateAtualInField(date){
  const inputDtCad = document.getElementById(date)
  if(inputDtCad){

  const hoje = new Date()
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

    inputDtCad.value = `${ano}-${mes}-${dia}`;
    return true; // indica sucesso
  }else{
    console.error('Campo #fornDtcd não encontrado no DOM');
    return false; // indica falha
  }
 
}

function maskFieldveicu(){
   
  $(document).ready(function(){
  $('#placAuto').mask('AAA0A00', {
    translation: {
      'A': { pattern: /[A-Za-z]/ },
      '0': { pattern: /[0-9]/ }
    }
  });
});

}

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
          dateAtualInField('dtCadAuto');
          deleteVehicles();
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
        const editFormVehicles = document.querySelector(".formEditClient");
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
      } catch (error) {}
    });
  }

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
  }

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
  }

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
  }

  const buttonExitAuto = document.querySelector(".buttonExitAuto");
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
  }
}

async function registerNewVehicles() {

 dateAtualInField('dtCadAuto')
  const token = localStorage.getItem("token");

  const resunt = await fetch("/api/listauto", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const res = await resunt.json();

  document
    .querySelector(".cadAutomo")
    .addEventListener("click", async (event) => {
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
        caaucode: document.querySelector("#codeAuto").value.trim(),
        caauplac: document.querySelector("#placAuto").value.toUpperCase().replace(/[^A-Z0-9-]/g, ""),
        caauchss: document.querySelector("#chassAuto").value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 17),
        caaurena: document.querySelector("#renaAuto").value.trim(),
        caaumaca: document.querySelector("#macaAuto").value.trim(),
        caaumode: document.querySelector("#modeAuto").value.trim(),
        caaucor: document.querySelector("#corAuto").value.trim(),
        caautico: document.querySelector("#tpCombusAuto").value.trim(),
        caaukmat: document.querySelector("#kmAtAuto").value.trim(),
        caauloca: document.querySelector('#pdLocCar').value.trim(),
        caaustat: document.querySelector("#statAuto").value.trim(),
        caaudtca: document.querySelector('#dtCadAuto').value,
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
          dateAtualInField('dtCadAuto')
        } else if (response.status === 409) {
          Toastify({
            text: result.message || "Codigo ja cadastrado",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "orange",
          }).showToast();
        } else {
          Toastify({
            text: result.message || "Erro ao cadastrar o Bem",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
          }).showToast();
        }
      } catch (error) {
        console.error("Erro ao enviar formulário:", error);
        Toastify({
          text: "Erro ao enviar os dados.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
      }
    });
  validationFormAutomovel();
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

    const result = await response.json();

    if (!response.ok) {
      Toastify({
        text: result?.message || "Erro ao carregar Bens.",
        duration: 4000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
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
      tabela.className = "table table-sm table-hover table-striped table-bordered tableVehicles";

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
        "Data de Cadastro",
      ];

      colunas.forEach((coluna) => {
        const th = document.createElement("th");
        th.textContent = coluna;
        th.classList.add("px-3", "py-2", "align-middle", "text-center", "wh-nowrap");
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
          formatDate(v.caaudtca),
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
      veiculosListDiv.innerHTML = "<p class='text-light'>Nenhum veículo cadastrado.</p>";
    }
  } catch (error) {
    console.error("Erro ao carregar veículos:", error);
    document.querySelector(".listingAutomo").innerHTML =
      "<p class='text-light'>Erro ao carregar veículos.</p>";
  }
}



// DELETAR VEICULOS
function deleteVehicles() {
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
      if (response.status === 400) {
        Toastify({
          text: data.message, // Mensagem retornada do backend
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
      } else {
        console.log("Erro para excluir:", data);
        Toastify({
          text: "Erro na exclusão do Veiculo ",
          duration: 2000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
      }
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
}

// EDITAR AUTOMOVEL
function editVehicles() {
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
      console.log('veiculo' , autoSelecionado)

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
        {id: "pdLocCarEdit" , valor: autoSelecionado.caauloca},
        { id: "dtCadAutoEdit", valor: autoSelecionado.caaudtca },
      ];

      campos.forEach(({ id, valor }) => {
        const elemento = document.getElementById(id);
        if (elemento) {
          if (elemento.type === "date" && valor) {
            elemento.value = formatDateInput(valor);
          } else {
            elemento.value = valor || "";
          }

        } else {
          console.warn(`Elemento com ID '${id}' não encontrado.`);
        }
          
         let valorFormatado = (valor || "").trim();
        if (elemento.tagName === "SELECT") {
          const option = [...elemento.options].find(opt => opt.value === valorFormatado);
          if (option) {
            elemento.value = valorFormatado;

            if (id === "tpCombusAutoEdit") {
              const hiddenInput = document.getElementById("tpCombusAutoEditHidden");
              if (hiddenInput) {
                hiddenInput.value = valorFormatado;
              }
            }
          }
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
        caaustat: document.getElementById("statAutoEdit").value,
        caauloca: document.getElementById('pdLocCarEdit').value,
        caaudtca: document.getElementById("dtCadAutoEdit").value,
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

        const confirmedEdition = confirm(
        `Tem certeza de que deseja ATUALIZAR os dados desse veiculo?`
        );
          if (!confirmedEdition) return;

        const response = await fetch(
          `/api/cadauto/${autoSelecionado.caaucode}`,
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
};

