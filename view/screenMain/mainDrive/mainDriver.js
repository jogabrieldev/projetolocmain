function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expTime = payload.exp * 1000;
    return Date.now() > expTime;
  } catch (error) {
    return true;
  }
}

function maskFieldDriver() {
  $("#motoCpf").mask("000.000.000-00");

  $("#motoCelu").mask("(00) 00000-0000");

  $("#motoCep").mask("00000-000");

  $("#editMotoCpf").mask("000.000.000-00");

  $("#editMotoCelu").mask("(00) 00000-0000");

  $("#editMotoCep").mask("00000-000");
}

const sokectDriver = io();
document.addEventListener("DOMContentLoaded", () => {
  const btnLoadDriver = document.querySelector(".btnCadMotorista");
  if (btnLoadDriver) {
    btnLoadDriver.addEventListener("click", async (event) => {
      event.preventDefault();

      try {
        const responseDriver = await fetch("/driver", {
          method: "GET",
        });
        if (!responseDriver.ok)
          throw new Error(`Erro HTTP: ${responseDriver.status}`);
        const html = await responseDriver.text();
        const mainContent = document.querySelector("#mainContent");
        if (mainContent) {
          mainContent.innerHTML = html;

          maskFieldDriver();
          interationSystemDriver();
          registerNewDriver();
          deleteMotistaSystem()
          searchDriverForId();
          editDriver();
          editAndUpdateOfDriver();
          linkDriverExternoWithVehicle();
          getCarSituationExterno();
          
        } else {
          console.error("#mainContent não encontrado no DOM");
          return;
        }

        const containerAppDriver = document.querySelector(
          ".containerAppDriver"
        );
        if (containerAppDriver) containerAppDriver.classList.add("flex");

        const sectionsToHide = [
          ".containerAppProd",
          ".containerAppFabri",
          ".containerAppFabri",
          ".containerAppTipoProd",
          ".containerAppAutomo",
          ".containerAppBens",
          ".containerAppForn",
        ];
        sectionsToHide.forEach((selector) => {
          const element = document.querySelector(selector);
          if (element) element.style.display = "none";
        });

        const containerRegisterDriver =
          document.querySelector(".RegisterDriver");
        const btnMainPageDriver = document.querySelector(".btnInitPageMain");
        const listingDrive = document.querySelector(".listingDriver");
        const editFormClient = document.querySelector(
          ".containerFormEditDriver"
        );
        const informative = document.querySelector(".information");

        if (containerRegisterDriver)
          containerRegisterDriver.style.display = "none";
        if (btnMainPageDriver) btnMainPageDriver.style.display = "flex";
        if (listingDrive) listingDrive.style.display = "flex";
        if (editFormClient) editFormClient.style.display = "none";
        if (informative) {
          informative.style.display = "block";
          informative.textContent = "SEÇÃO MOTORISTA";
        }

        await fetchListMotorista();
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

  sokectDriver.on("updateRunTimeDriver", (motorista) => {
    fetchListMotorista();
    loadingDriver();
  });

  sokectDriver.on("updateRunTimeTableDrive", (updatedDriver) => {
    fetchListMotorista();
    loadingDriver();
  });
});

// INTERAÇÃO
function interationSystemDriver() {
  const registerDriver = document.querySelector(".registerDriver");
  if (registerDriver) {
    registerDriver.addEventListener("click", () => {
      const formRegisterDriver = document.querySelector(".RegisterDriver");
      if (formRegisterDriver) {
        formRegisterDriver.classList.remove("hidden");
        formRegisterDriver.classList.add("flex");
      }

      const listingDriver = document.querySelector(".listingDriver");
      if (listingDriver) {
        listingDriver.classList.remove("flex");
        listingDriver.classList.add("hidden");
      }

      const btnPageMain = document.querySelector(".btnInitPageMain");
      if (btnPageMain) {
        btnPageMain.classList.remove("flex");
        btnPageMain.classList.add("hidden");
      }
    });
  };

  const btnOutSectionDriver = document.getElementById("buttonExitDriver");
  if (btnOutSectionDriver) {
    btnOutSectionDriver.addEventListener("click", () => {
      const containerAppDriver = document.querySelector(".containerAppDriver");
      if (containerAppDriver) {
        containerAppDriver.classList.remove("flex");
        containerAppDriver.classList.add("hidden");
      }

      const informative = document.querySelector(".information");
      if (informative) {
        informative.style.display = "block";
        informative.textContent = "Sessão ativa";
      }
    });
  };

  const btnOutPageDrive = document.querySelector(".btnOutPageRegister");
  if (btnOutPageDrive) {
    btnOutPageDrive.addEventListener("click", (event) => {
      event.preventDefault();

      const formRegisterDriver = document.querySelector(".RegisterDriver");
      if (formRegisterDriver) {
        formRegisterDriver.classList.remove("flex");
        formRegisterDriver.classList.add("hidden");
      }

      const listingDriver = document.querySelector(".listingDriver");
      if (listingDriver) {
        listingDriver.classList.remove("hidden");
        listingDriver.classList.add("flex");
      }

      const btnPageMain = document.querySelector(".btnInitPageMain");
      if (btnPageMain) {
        btnPageMain.classList.remove("hidden");
        btnPageMain.classList.add("flex");
      }
    });
  };

  const btnOutformPageEdit = document.querySelector(".btnOutPageRegisterEdit");
  if (btnOutformPageEdit) {
    btnOutformPageEdit.addEventListener("click", (event) => {
      event.preventDefault();

      const containerFormEditDriver = document.querySelector(
        ".containerFormEditDriver"
      );
      if (containerFormEditDriver) {
        containerFormEditDriver.classList.remove("flex");
        containerFormEditDriver.classList.add("hidden");
      }

      const listingDriver = document.querySelector(".listingDriver");
      if (listingDriver) {
        listingDriver.classList.remove("hidden");
        listingDriver.classList.add("flex");
      }

      const btnPageMain = document.querySelector(".btnInitPageMain");
      if (btnPageMain) {
        btnPageMain.classList.remove("hidden");
        btnPageMain.classList.add("flex");
      }
    });
  };
};

// CADASTRAR MOTORISTA
function registerNewDriver() {
  document.querySelector(".cadDriver").addEventListener("click", async (event) => {
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

      if (!$(".formRegisterDriver").valid()) {
        return;
      }

      const cepDriver = document.querySelector("#motoCep").value.replace(/\D/g, "");
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepDriver}/json/`);

        if (!response.ok) {
          throw new Error("Erro ao buscar o CEP.");
        }

        const data = await response.json();

        if (data.erro) {
          Toastify({
            text: "CEP inválido.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#f44336",
          }).showToast();
          return;
        };

        // Preenchendo os campos do formulário
        const ruaField = document.getElementById("motoRua");
        const cityField = document.getElementById("motoCity");
        const stateField = document.getElementById("motoEstd");

        if (ruaField) {
          ruaField.value = `${data.logradouro} - ${data.bairro}` || "";
          ruaField.readOnly = true;
        }
        if (cityField) {
          cityField.value = data.localidade || "";
          cityField.readOnly = true;
        }
        if (stateField) {
          stateField.value = data.uf || "";
          stateField.readOnly = true;
        }
      } catch (error) {
        console.error("Erro ao buscar o CEP:", error);
        Toastify({
          text: "Erro ao buscar o CEP, tente novamente.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#f44336",
        }).showToast();
        return;
      }

      const formData = {
        motoCode: document.querySelector("#motoCode").value.trim(), // Código
        motoNome: document.querySelector("#motoNome").value.trim(), // Nome
        motoDtnc: document.querySelector("#motoDtnc").value, // Data de nascimento
        motoCpf: document.querySelector("#motoCpf").value.trim().replace(/\D/g, ""), // CPF
        motoDtch: document.querySelector("#motoDtch").value.trim(), // Data de emissão da CNH
        motoctch: document.querySelector("#motoctch").value.trim(), // Categoria da CNH
        motoDtvc: document.querySelector("#motoDtvc").value, // Data de vencimento
        motoRest: document.querySelector("#motoRest").value.trim(), // Restrições
        motoOrem: document.querySelector("#motoOrem").value.trim(), // Órgão emissor
        motoCelu: document.querySelector("#motoCelu").value.trim().replace(/\D/g, ""), // Celular
        motoCep: document.querySelector("#motoCep").value.trim().replace(/\D/g, ""), // CEP
        motoRua: document.querySelector("#motoRua").value.trim(), // Rua
        motoCity: document.querySelector("#motoCity").value.trim(), // Cidade
        motoEstd: document.querySelector("#motoEstd").value.trim(), // Estado
        motoMail: document.querySelector("#motoMail").value.trim(), // E-mail
        motoStat: document.querySelector("#motoStat").value.trim(),
        motoSitu: document.querySelector("#motoSitu").value.trim(), // status
        motoPasw: document.querySelector("#motoPasw").value.trim(),
      };

      const datas = [
        { key: "motoDtvc", label: "Data de Vencimento" },
        { key: "motoDtnc", label: "Data de Nascimento" },
      ];
      for (const { key, label } of datas) {
        const str = formData[key];
        if (!isDataValida(str)) {
          Toastify({
            text: `${label} INVALIDA .`,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#f44336",
          }).showToast();
          return;
        }
      }

      // 4) Converte strings para Date, zerando horas
      const [yCad, mCad, dCad] = formData.motoDtvc.split("-").map(Number);
      const [yNasc, mNasc, dNasc] = formData.motoDtnc.split("-").map(Number);
      const dtVenci = new Date(yCad, mCad - 1, dCad);
      const dtNasc = new Date(yNasc, mNasc - 1, dNasc);
      const hoje = new Date();
      const hoje0 = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate()
      );

      if (dtVenci.getTime() <= hoje0.getTime()) {
        Toastify({
          text: "A data de vencimento da CNH tem que ser maior que a de hoje",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
        return;
      }

      // 5.2) dtNasc não pode ser futura
      if (dtNasc.getTime() >= hoje0.getTime()) {
        Toastify({
          text: "Data de Nascimento não pode ser maior ou igual que a data de hoje.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
        return;
      }

      try {
        const response = await fetch("/api/drive/submit", {
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
            text: "Motorista cadastrado com sucesso!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#1d5e1d",
          }).showToast();

        
          document.querySelector(".formRegisterDriver").reset();
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
          }else {
          
            Toastify({
              text: result?.message || "Erro ao cadastrar motorista.",
              duration: 3000,
              close: true,
              gravity: "top",
              position: "center",
              backgroundColor: response.status === 409 ? "orange" : "#f44336",
            }).showToast();
          }
        }
      } catch (error) {
        console.error("Erro ao enviar formulário:", error);
        Toastify({
          text: "Erro no server para cadastrar",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#f44336",
        }).showToast();
      };
    });
  validationFormMoto();
};

//listagem de motorista
async function fetchListMotorista() {
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

    const result = await response.json();

    if (!response.ok) {
      Toastify({
        text: result?.message || "Erro ao carregar Motoristas.",
        duration: 4000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
      return;
    }

    const motorista = result;
    const motoristaListDiv = document.querySelector(".listingDriver");
    motoristaListDiv.innerHTML = "";

    if (motorista.length > 0) {
      const wrapper = document.createElement("div");
      wrapper.className = "table-responsive";

      const tabela = document.createElement("table");
      tabela.className =
        "table table-sm table-hover table-striped table-bordered tableDriver";

      const cabecalho = tabela.createTHead();
      const linhaCabecalho = cabecalho.insertRow();
      const colunas = [
        "Selecionar",
        "Código",
        "Status",
        "Nome",
        "Situação",
        "Data de Nascimento",
        "CPF",
        "Data de Emissão",
        "Categoria da CNH",
        "Data de Vencimento",
        "Restrições",
        "Orgão Emissor",
        "Celular",
        "CEP",
        "Rua",
        "Cidade",
        "Estado",
        "E-mail",
      ];

      colunas.forEach((coluna) => {
        const th = document.createElement("th");
        th.textContent = coluna;
        if (["Selecionar", "Código", "Status"].includes(coluna)) {
          th.classList.add(
            "text-center",
            "px-2",
            "py-1",
            "align-middle",
            "wh-nowrap"
          );
        } else {
          th.classList.add("px-3", "py-2", "align-middle");
        }
        linhaCabecalho.appendChild(th);
      });

      const corpo = tabela.createTBody();
      motorista.forEach((m) => {
        const linha = corpo.insertRow();
        linha.setAttribute("data-motocode", m.motocode);

        // Checkbox
        const checkboxCell = linha.insertCell();
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "selectDriver";
        checkbox.value = m.motocode;
        checkbox.className = "form-check-input m-0";

        const motoristaData = JSON.stringify(m);
        if (motoristaData) {
          checkbox.dataset.motorista = motoristaData;
        }

        checkboxCell.classList.add("text-center", "align-middle", "wh-nowrap");
        checkboxCell.appendChild(checkbox);

        const formatCep = formatarCampo("cep", m.motocep);
        const formatCnpj = formatarCampo("documento", m.motocpf);
        const formatPhone = formatarCampo("telefone", m.motocelu);

        // Dados
        const dados = [
          m.motocode,
          m.motostat,
          m.motonome,
          m.motositu,
          formatDataPattersBr(m.motodtnc),
          formatCnpj,
          formatDataPattersBr(m.motodtch),
          m.motoctch,
          formatDataPattersBr(m.motodtvc),
          m.motorest,
          m.motoorem,
          formatPhone,
          formatCep,
          m.motorua,
          m.motocity,
          m.motoestd,
          m.motomail,
        ];

        dados.forEach((valor, index) => {
          const td = linha.insertCell();
          td.textContent = valor || "";
          td.classList.add("align-middle", "text-break");

          const coluna = colunas[index + 1];
          if (["Código", "Status"].includes(coluna)) {
            td.classList.add("text-center", "wh-nowrap", "px-2", "py-1");
          } else {
            td.classList.add("px-3", "py-2");
          }

          if (coluna === "Status") {
            td.classList.add("status-moto");
          }
        });
      });

      wrapper.appendChild(tabela);
      motoristaListDiv.appendChild(wrapper);
    } else {
      motoristaListDiv.innerHTML =
        "<p class='text-dark'>Nenhum motorista cadastrado.</p>";
    }
  } catch (error) {
    console.error("Erro ao carregar motoristas:", error);
     Toastify({
      text: "Erro na comunicação com o servidor para listar motorista.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "#f44336",
    }).showToast();
    document.querySelector(".listingDriver").innerHTML =
      "<p class='text-dark'>Erro ao carregar motoristas.</p>";
  };
};

// buscar motorista
async function searchDriverForId() {
  const btnForSearch = document.getElementById("searchDriver");
  const popUpSearch = document.querySelector(".searchIdDriver");
  const driverListDiv = document.querySelector(".listingDriver");
  const backdrop = document.querySelector(".popupBackDrop");
  const btnOutPageSearch = document.querySelector(".outPageSearchDriver");

  if (btnForSearch && popUpSearch) {
    btnForSearch.addEventListener("click", () => {
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
    driverListDiv.parentNode.insertBefore(btnClearFilter, driverListDiv);

    btnClearFilter.addEventListener("click", async () => {
      btnClearFilter.style.display = "none";

      document.getElementById("codeDriver").value = "";
      document.getElementById("statusInDriver").value = "";
      document.getElementById("situationInDriver").value = "";

     await fetchListMotorista();
    });
  };

  const btnSubmitSearchClient = document.querySelector(".submitSearchDriver");
  if (btnSubmitSearchClient) {
    btnSubmitSearchClient.addEventListener("click", async () => {
      const motocode = document.getElementById("codeDriver").value.trim();
      const valueStat = document.getElementById("statusInDriver").value.trim();
      const valueSitu = document.getElementById("situationInDriver").value.trim();

      const preenchidos = [motocode, valueStat, valueSitu].filter((valor) => valor !== "");

      if (preenchidos.length === 0) {
        Toastify({
          text: "Preencha pelo menos um campo para buscar!",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#f44336",
        }).showToast();
        return;
      }

      if (preenchidos.length > 1) {
        Toastify({
          text: "Preencha apenas um campo por vez para buscar!",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
        return;
      }

      const params = new URLSearchParams();
      if (motocode) params.append("motocode", motocode);
      if (valueStat) params.append("status", valueStat);
      if (valueSitu) params.append("situacao", valueSitu);

      try {
        const result = await fetch(`/api/driver/search?${params}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        const data = await result.json();

        if (result.ok && data.driver.length > 0) {
          Toastify({
            text: "O motorista foi encontrado com sucesso!.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#1d5e1d",
          }).showToast();
         
          btnClearFilter.style.display = "inline-block";

          renderMotoristasTable(data.driver);

          if (popUpSearch) popUpSearch.style.display = "none";
          if (backdrop) backdrop.style.display = "none";
        } else {
          Toastify({
            text: data.message || "Nenhum motorista encontrado nessa pesquisa",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#f44336",
          }).showToast();
        }
      } catch (error) {
        console.error("Erro ao buscar motorista", error);
        Toastify({
          text: "Erro a buscar motorista tente novamente",
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

// RENDERIZAR A TABELA
function renderMotoristasTable(motoristas) {
  const motoristaListDiv = document.querySelector(".listingDriver");
  motoristaListDiv.innerHTML = "";

  if (!motoristas || motoristas.length === 0) {
    motoristaListDiv.innerHTML =
      "<p class='text-light'>Nenhum motorista cadastrado.</p>";
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "table-responsive";

  const tabela = document.createElement("table");
  tabela.className =
    "table table-sm table-hover table-striped table-bordered tableDriver";

  const colunas = [
    "Selecionar",
    "Código",
    "Status",
    "Nome",
    "Situação",
    "Data de Nascimento",
    "CPF",
    "Data de Emissão",
    "Categoria da CNH",
    "Data de Vencimento",
    "Restrições",
    "Orgão Emissor",
    "Celular",
    "CEP",
    "Rua",
    "Cidade",
    "Estado",
    "E-mail",
  ];

  // Cabeçalho
  const cabecalho = tabela.createTHead();
  const linhaCabecalho = cabecalho.insertRow();

  colunas.forEach((coluna) => {
    const th = document.createElement("th");
    th.textContent = coluna;
    th.classList.add("align-middle");

    if (
      ["Selecionar", "Código", "Status", "CPF", "Estado", "CEP"].includes(
        coluna
      )
    ) {
      th.classList.add("text-center", "px-2", "py-1", "wh-nowrap");
    } else {
      th.classList.add("px-3", "py-2");
    }

    linhaCabecalho.appendChild(th);
  });

  // Corpo
  const corpo = tabela.createTBody();

  motoristas.forEach((moto) => {
    const linha = corpo.insertRow();
    linha.setAttribute("data-motocode", moto.motocode);

    // Checkbox
    const checkboxCell = linha.insertCell();
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "selectDriver";
    checkbox.value = moto.motocode;
    checkbox.className = "form-check-input m-0";
    checkbox.dataset.motorista = JSON.stringify(moto);
    checkboxCell.classList.add("text-center", "align-middle", "wh-nowrap");
    checkboxCell.appendChild(checkbox);

    // Formatadores
    const docFormatado = formatarCampo("documento", moto.motocpf);
    const telFormatado = formatarCampo("telefone", moto.motocelu);
    const cepFormatado = formatarCampo("cep", moto.motocep);

    const dados = [
      moto.motocode,
      moto.motostat,
      moto.motonome,
      moto.motositu,
      formatDataPattersBr(moto.motodtnc),
      docFormatado,
      formatDataPattersBr(moto.motodtch),
      moto.motoctch,
      formatDataPattersBr(moto.motodtvc),
      moto.motorest,
      moto.motoorem,
      telFormatado,
      cepFormatado,
      moto.motorua,
      moto.motocity,
      moto.motoestd,
      moto.motomail,
    ];

    dados.forEach((valor, index) => {
      const td = linha.insertCell();
      td.textContent = valor || "";
      td.classList.add("align-middle", "text-break");

      const coluna = colunas[index + 1]; // +1 por causa do checkbox
      if (["Código", "Status", "CPF", "Estado", "CEP"].includes(coluna)) {
        td.classList.add("text-center", "wh-nowrap", "px-2", "py-1");
      } else {
        td.classList.add("px-3", "py-2");
      }

      if (coluna === "Status") {
        td.classList.add("status-moto");
      }
    });
  });

  wrapper.appendChild(tabela);
  motoristaListDiv.appendChild(wrapper);
}

// deletar motorista
function deleteMotistaSystem() {
  const btnDeleteDriver = document.querySelector(".buttonDeleteDriver");
  if(!btnDeleteDriver) return

  btnDeleteDriver.addEventListener("click", async () => {
    const selectedCheckbox = document.querySelector(
      'input[name="selectDriver"]:checked'
    );
    if (!selectedCheckbox) {
      Toastify({
        text: "Selecione um Motorista para excluir",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
      return;
    }

    const MotoristaSelecionado = JSON.parse(selectedCheckbox.dataset.motorista);
    const motoristaId = MotoristaSelecionado.motocode;
    if(!motoristaId) return

      Swal.fire({
    title: `Excluir motorista ${MotoristaSelecionado.motonome}?`,
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
      const success =  await deleteDriver(motoristaId, selectedCheckbox.closest("tr"));
      if(success){
        Swal.fire({
        title: "Excluído!",
        text: "O motorista foi removido com sucesso.",
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

 //DELETE
  async function deleteDriver(id, driverRow) {
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
      const response = await fetch(`/api/deletedriver/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        Toastify({
          text: "Motorista deletado com sucesso!",
          duration: 2000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#1d5e1d",
        }).showToast();

        driverRow.remove();
        return true
      } else {
      
        let errorMessage = "Erro ao excluir o motorista.";

        if (response.status === 400 || response.status === 404) {
          errorMessage = data.message;
        }

        Toastify({
          text: errorMessage,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
         return false
      }
    } catch (error) {
      console.error("Erro ao excluir motorista:", error);
      Toastify({
        text: "Erro ao excluir motorista. Tente novamente.",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
      return false
    };
  };


// EDITAR MOTORISTA
async function editDriver() {
  const btnFormEditDrive = document.querySelector(".buttonEditDriver");
  if(!btnFormEditDrive) return

  btnFormEditDrive.addEventListener("click", () => {
    const selectedCheckbox = document.querySelector(
      'input[name="selectDriver"]:checked'
    );

    if (!selectedCheckbox) {
      Toastify({
        text: "Selecione um Motorista para editar",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
      return;
    }

    const btnMainPageDrive = document.querySelector(".btnInitPageMain");
    if (btnMainPageDrive) {
      btnMainPageDrive.classList.remove("flex");
      btnMainPageDrive.classList.add("hidden");
    }

    const listDriver = document.querySelector(".listingDriver");
    if (listDriver) {
      listDriver.classList.remove("flex");
      listDriver.classList.add("hidden");
    }

    const containerEditForm = document.querySelector(
      ".containerFormEditDriver"
    );
    if (containerEditForm) {
      containerEditForm.classList.remove("hidden");
      containerEditForm.classList.add("flex");
    }

    const motoristaData = selectedCheckbox.dataset.motorista;
    if (!motoristaData) {
      console.error("O atributo data-motocode está vazio ou indefinido.");
      return;
    }

    try {
      const motoristaSelecionado = JSON.parse(motoristaData);
      const campos = [
        { id: "editMotoCode", valor: motoristaSelecionado.motocode },
        { id: "editMotoNome", valor: motoristaSelecionado.motonome },
        { id: "editMotoDtnc", valor: motoristaSelecionado.motodtnc },
        { id: "editMotoCpf", valor: motoristaSelecionado.motocpf },
        { id: "editMotoDtch", valor: motoristaSelecionado.motodtch },
        { id: "editMotoCtch", valor: motoristaSelecionado.motoctch },
        { id: "editMotoDtvc", valor: motoristaSelecionado.motodtvc },
        { id: "editMotoRest", valor: motoristaSelecionado.motorest },
        { id: "editMotoOrem", valor: motoristaSelecionado.motoorem },
        { id: "editMotoCelu", valor: motoristaSelecionado.motocelu },
        { id: "editMotoCep", valor: motoristaSelecionado.motocep },
        { id: "editMotoRua", valor: motoristaSelecionado.motorua },
        { id: "editMotoCity", valor: motoristaSelecionado.motocity },
        { id: "editMotoEstd", valor: motoristaSelecionado.motoestd },
        { id: "editMotoMail", valor: motoristaSelecionado.motomail },
        { id: "editMotoStat", valor: motoristaSelecionado.motostat },
        { id: "motoSituEdit", valor: motoristaSelecionado.motositu },
      ];

      // Atualizar valores no formulário
      campos.forEach(({ id, valor }) => {
        const elemento = document.getElementById(id);
        if (elemento) {
          if (elemento.type === "date" && valor) {
           
            const dataFormatada = new Date(valor).toISOString().split("T")[0];
            elemento.value = dataFormatada;
          } else {
            elemento.value = valor || "";
          }
          let valorFormatado = (valor || "").trim();

          if (elemento.tagName === "SELECT") {
            const option = [...elemento.options].find(
              (opt) => opt.value === valorFormatado
            );
            if (option) {
              elemento.value = valorFormatado;

              if (id === "statusEdit") {
                const hiddenInput = document.getElementById("statusEditHidden");
                if (hiddenInput) {
                  hiddenInput.value = valorFormatado;
                }
              };
            };
          };

          if (id === "motoSituEdit") {
            const hiddenInput = document.getElementById("motoSituEditHidden");
            if (hiddenInput) {
              hiddenInput.value = valorFormatado;
            }
          };

          if (id === "editMotoStat") {
            const hiddenInput = document.getElementById("editMotoStatHidden");
            if (hiddenInput) {
              hiddenInput.value = valorFormatado;
            }
          };
        } else {
          console.warn(`Elemento com ID '${id}' não encontrado.`);
        }
      });

      const spaceEditDriver = document.querySelector(
        ".containerFormEditDriver"
      );
      const btnMainPageDriver = document.querySelector(".btnInitPageMain");
      const listingDriver = document.querySelector(".listingDriver");

      if (spaceEditDriver) {
        spaceEditDriver.style.display = "flex";
      } else {
        console.error("O formulário de edição não foi encontrado.");
      }

      if (listingDriver) {
        listingDriver.style.display = "none";
      } else {
        console.error("A lista de motoristas não foi encontrada.");
      }

      if (btnMainPageDriver) {
        btnMainPageDriver.style.display = "none";
      }
    } catch (error) {
      console.error("Erro ao fazer parse de data-bem:", error);
    }
  });

  const cepInput = document.getElementById("editMotoCep");
  const ruaField = document.getElementById("editMotoRua");
  const cityField = document.getElementById("editMotoCity");
  const stateField = document.getElementById("editMotoEstd");

  if (cepInput) {
    cepInput.addEventListener("input", async () => {
      const motoCep = cepInput.value.replace(/\D/g, "");

      if (motoCep.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${motoCep}/json/`);

          if (!response.ok) throw new Error("Erro ao buscar o CEP");

          const data = await response.json();

          if (data.erro) {
            Toastify({
              text: "CEP inválido ou não encontrado.",
              duration: 3000,
              close: true,
              gravity: "top",
              position: "center",
              backgroundColor: "#f44336",
            }).showToast();

            if (ruaField) ruaField.value = "";
            if (cityField) cityField.value = "";
            if (stateField) stateField.value = "";
            return;
          }

          if (ruaField) {
            ruaField.value = `${data.logradouro} - ${data.bairro}` || "";
            ruaField.readOnly = true;
          }

          if (cityField) {
            cityField.value = data.localidade || "";
            cityField.readOnly = true;
          }

          if (stateField) {
            stateField.value = data.uf || "";
            stateField.readOnly = true;
          }
        } catch (error) {
          console.error("Erro ao buscar o CEP:", error);
          Toastify({
            text: "Erro ao buscar o CEP.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#f44336",
          }).showToast();
        };
      } else {
        if (ruaField) ruaField.value = "";
        if (cityField) cityField.value = "";
        if (stateField) stateField.value = "";
      }
    });
  };
  await editAndUpdateOfDriver()
};
//EDITAR
async function editAndUpdateOfDriver() {

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
  const formEditDrive = document.querySelector(".formEditDriver");

  formEditDrive.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const selectedCheckbox = document.querySelector(
      'input[name="selectDriver"]:checked'
    );

    if (!selectedCheckbox) {
      console.error("Nenhum checkbox foi selecionado.");
      return;
    }

    const motoristaId = selectedCheckbox.dataset.motorista;

    if (!motoristaId) {
      console.error("O atributo data-bem está vazio ou inválido.");
      return;
    }

    let motoIdParsed;
    try {
      motoIdParsed = JSON.parse(motoristaId).motocode;
    } catch (error) {
      console.error("Erro ao fazer parse de bemId:", error);
      return;
    }

    const updateDriver = {
      motocode: document.getElementById("editMotoCode").value,
      motonome: document.getElementById("editMotoNome").value,
      motodtnc: document.getElementById("editMotoDtnc").value,
      motocpf: document.getElementById("editMotoCpf").value,
      motodtch: document.getElementById("editMotoDtch").value,
      motoctch: document.getElementById("editMotoCtch").value,
      motodtvc: document.getElementById("editMotoDtvc").value,
      motorest: document.getElementById("editMotoRest").value,
      motoorem: document.getElementById("editMotoOrem").value,
      motocelu: document.getElementById("editMotoCelu").value,
      motocep: document.getElementById("editMotoCep").value,
      motorua: document.getElementById("editMotoRua").value,
      motocity: document.getElementById("editMotoCity").value,
      motoestd: document.getElementById("editMotoEstd").value,
      motomail: document.getElementById("editMotoMail").value,
      motostat: document.getElementById("editMotoStat").value,
    };

   
    try {
       const result = await Swal.fire({
        title: `Atualizar motorista ${motoIdParsed}?`,
        text: "Você tem certeza de que deseja atualizar os dados deste motorista?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Atualizar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
        confirmButtonColor: "#1d5e1d",
        cancelButtonColor: "#d33"
      });

      if (!result.isConfirmed) return;


      const response = await fetch(`/api/updatemoto/${motoIdParsed}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateDriver),
      });

      if (response.ok) {
        Toastify({
          text: `Motorista '${motoIdParsed}' Atualizado com sucesso!!`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#1d5e1d",
        }).showToast();

        formEditDrive.reset();
      } else {
        const errorResponse = await response.json();
        Toastify({
          text: errorResponse.message || "Erro ao atualizar Motorista.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#f44336",
        }).showToast();
      };
    } catch (error) {
      Toastify({
        text: "Erro interno na requisição. Tente novamente.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
    };
  });
};
