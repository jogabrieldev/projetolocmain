function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expTime = payload.exp * 1000;
    return Date.now() > expTime;
  } catch (error) {
    return true;
  }
}

function masksFieldForne() {
  $("#fornCnpj").mask("00.000.000/0000-00");
    
  $("#inputCnpj").mask("00.000.000/0000-00");
  
  $("#fornCelu").mask("(00) 00000-0000");

  $("#fornCep").mask("00000-000");

  $("#editFornCnpj").mask("00.000.000/0000-00");

  $("#editFornCelu").mask("(00) 00000-0000");

  $("#editFornCep").mask("00000-000");
}

function dateAtualInField(date){
  const inputDtCad = document.getElementById(date)
  if(inputDtCad){

  const hoje = new Date()
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

    inputDtCad.value = `${ano}-${mes}-${dia}`;
    return true; 
  }else{
    console.error('Campo #fornDtcd não encontrado no DOM');
    return false; 
  }
 
}

const socketForn = io();
document.addEventListener("DOMContentLoaded", () => {
  const btnLoadForn = document.querySelector(".btnCadForn");
  if (btnLoadForn) {
    btnLoadForn.addEventListener("click", async () => {
      try {
        const responseForn = await fetch("/fornecedor", {
          method: "GET",
        });

        if (!responseForn.ok)
          throw new Error(`Erro HTTP: ${responseForn.status}`);
        const html = await responseForn.text();
        const mainContent = document.querySelector("#mainContent");
        if (mainContent) {
          mainContent.innerHTML = html;
          masksFieldForne();
          interationSystemForne();
          registerNewFornecedor();
          searchFornecedorForId();
          dateAtualInField("fornDtcd");
          deleteFornecedor();
          editFornecedor();
        } else {
          console.error("#mainContent não encontrado no DOM");
        }

        const containerAppForne = document.querySelector(".containerAppForn");
        if (containerAppForne) containerAppForne.classList.add("flex");

        const sectionsToHide = [
          ".containerAppProd",
          ".containerAppFabri",
          ".containerAppTipoProd",
          ".containerAppDriver",
          ".containerAppAutomo",
          ".containerAppBens",
          ".containerAppClient",
        ];
        sectionsToHide.forEach((selector) => {
          const element = document.querySelector(selector);
          if (element) element.style.display = "none";
        });

        const containerRegisterForne =
          document.querySelector(".formRegisterForn");
        const btnMainPageForn = document.querySelector(".btnMainPageForn");
        const listingForn = document.querySelector(".listingForn");
        const editFormforn = document.querySelector(".formEditRegisterForn");
        const informative = document.querySelector(".information");

        if (containerRegisterForne)
          containerRegisterForne.style.display = "none";
        if (btnMainPageForn) btnMainPageForn.style.display = "flex";
        if (listingForn) listingForn.style.display = "flex";
        if (editFormforn) editFormforn.style.display = "none";
        if (informative) {
          informative.style.display = "block";
          informative.textContent = "SEÇÃO FORNECEDOR";
        }

        await fetchListFornecedores();
      } catch (error) {
        console.warn("#btnLoadForn não encontrado no DOM");
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
  }

  socketForn.on("updateRunTimeForne", (fornecedor) => {
    fetchListFornecedores();
  });
  socketForn.on("updateFornTable", (updateFornecedor) => {
    fetchListFornecedores();
  });
});

function interationSystemForne() {
  const btnRegisterForn = document.querySelector(".registerForn");
  if (btnRegisterForn) {
    btnRegisterForn.addEventListener("click", () => {
      const formRegisterForn = document.querySelector(".formRegisterForn");
      if (formRegisterForn) {
        formRegisterForn.classList.remove("hidden");
        formRegisterForn.classList.add("flex");
      }
      const listingForn = document.querySelector(".listingForn");
      if (listingForn) {
        listingForn.classList.remove("flex");
        listingForn.classList.add("hidden");
      }
      const btnMainPageForm = document.querySelector(".btnMainPageForn");
      if (btnMainPageForm) {
        btnMainPageForm.classList.remove("flex");
        btnMainPageForm.classList.add("hidden");
      }
    });
  }

  const btnOutInitForn = document.querySelector(".btnOutInitForn");
  if (btnOutInitForn) {
    btnOutInitForn.addEventListener("click", (event) => {
      event.preventDefault();

      const caixaForn = document.querySelector(".formRegisterForn");
      if (caixaForn) {
        caixaForn.classList.remove("flex");
        caixaForn.classList.add("hidden");
      }

      const listingForn = document.querySelector(".listingForn");
      if (listingForn) {
        listingForn.classList.remove("hidden");
        listingForn.classList.add("flex");
      }

      const btnMainPageForm = document.querySelector(".btnMainPageForn");
      if (btnMainPageForm) {
        btnMainPageForm.classList.remove("hidden");
        btnMainPageForm.classList.add("flex");
      }

      return;
    });
  }

  const btnOutPageEdit = document.querySelector(".btnOutInitFornEdit");
  if (btnOutPageEdit) {
    btnOutPageEdit.addEventListener("click", () => {
      const listingForn = document.querySelector(".listingForn");
      if (listingForn) {
        listingForn.classList.remove("hidden");
        listingForn.classList.add("flex");
      }
      const btnMainPageForm = document.querySelector(".btnMainPageForn");
      if (btnMainPageForm) {
        btnMainPageForm.classList.remove("hidden");
        btnMainPageForm.classList.add("flex");
      }

      const formEditRegisterForn = document.querySelector(
        ".formEditRegisterForn"
      );
      if (formEditRegisterForn) {
        formEditRegisterForn.classList.remove("flex");
        formEditRegisterForn.classList.add("hidden");
      }
    });
  }

  const btnOutSectionForn = document.getElementById("buttonExitForn");
  if (btnOutSectionForn) {
    btnOutSectionForn.addEventListener("click", (event) => {
      event.preventDefault();

      const containerAppForn = document.querySelector(".containerAppForn");
      if (containerAppForn) {
        containerAppForn.classList.remove("flex");
        containerAppForn.classList.add("hidden");
      }

      const informative = document.querySelector(".information");
      if (informative) {
        informative.style.display = "block";
        informative.textContent = "Sessão ativa";
      }
    });
  }

  const btnOutPage = document.querySelector(".btnOutInitForn");
  btnOutPage.addEventListener("click", (e) => {
    e.preventDefault();

    const listingForn = document.querySelector(".listingForn");
    listingForn.style.display = "flex";

    const btnMainPageForm = document.querySelector(".btnMainPageForn");
    btnMainPageForm.style.display = "flex";

    const containerFormForn = document.querySelector(".formRegisterForn");
    containerFormForn.style.display = "none";
  });
}

// CADASTRAR FORNECEDOR
function registerNewFornecedor() {

 dateAtualInField("fornDtcd")
  document.querySelector(".btnRegisterforn").addEventListener("click", async (event) => {
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

      if (!$("#registerForn").valid()) {
        return;
      }

      const cepforne = document.querySelector("#fornCep").value.replace(/\D/g, "");
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepforne}/json/`);

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
        }

        const ruaField = document.getElementById("fornRua");
        const cityField = document.getElementById("fornCity");
        const stateField = document.getElementById("fornEstd");

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
      // Captura os valores do formulário
      const formData = {
        fornCode: document.querySelector("#fornCode").value.trim(), // Código
        fornName: document.querySelector("#fornName").value.trim(), // Nome
        nomeFan: document.querySelector("#nomeFan").value.trim(), // Nome Fantasia
        fornCnpj: document.querySelector("#fornCnpj").value.trim().replace(/\D/g, ''), // CNPJ
        fornCep: document.querySelector("#fornCep").value.trim().replace(/\D/g, ''), // CEP
        fornRua: document.querySelector("#fornRua").value.trim(), // Rua
        fornCity: document.querySelector("#fornCity").value.trim(), // Cidade
        fornEstd: document.querySelector("#fornEstd").value.trim(), // Estado
        fornCelu: document.querySelector("#fornCelu").value.trim().replace(/\D/g, ''), // Celular
        fornMail: document.querySelector("#fornMail").value.trim(), // E-mail
        fornBank: document.querySelector("#fornBank").value.trim(), // Banco
        fornAge: document.querySelector("#fornAge").value.trim(), // Agência
        fornCont: document.querySelector("#fornCont").value.trim(), // Conta
        fornPix: document.querySelector("#fornPix").value.trim(), // Pix
        fornDtcd: document.querySelector("#fornDtcd").value, // Data do Cadastro
        fornDisPro: document.querySelector("#fornDisPro").value.trim(), // Descrição do Produto
      };

      const fornMail = formData.fornMail;
      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailValido.test(fornMail)) {
        Toastify({
          text: "E-mail inválido. Verifique o formato (ex: nome@dominio.com).",
          duration: 3000,
          gravity: "top",
          position: "center",
          backgroundColor: "#f44336",
        }).showToast();
        return;
      }

      try {
        const response = await fetch("/api/forne/submit", {
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
            text: "Fornecedor cadastrado com sucesso!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#1d5e1d",
          }).showToast();

          document.querySelector("#registerForn").reset();
          dateAtualInField("fornDtcd")
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
          text: result?.message || "Erro ao cadastrar fornecedor.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: response.status === 409 ? "orange" : "#f44336",
          }).showToast();
       }
  };
      } catch (error) {
        console.error("Erro ao enviar formulário:", error);
       Toastify({
            text:"Erro no server para cadastrar",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#f44336",
          }).showToast();
      }
    });
  validationFormForne();
};

// BUSCAR O FORNECEDOR
async function searchFornecedorForId() {

  const btnForSearch = document.getElementById('searchFornecedor');
  const popUpSearch = document.querySelector('.searchIdForne');
  const forneListDiv = document.querySelector(".listingForn");
  const backdrop  = document.querySelector('.popupBackDrop')
  const btnOutPageSearch = document.querySelector('.outPageSearchForn')

  if (btnForSearch && popUpSearch) {
    btnForSearch.addEventListener('click', () => {
      popUpSearch.style.display = 'flex';
      backdrop.style.display = 'block'
    });
  }

  if(popUpSearch || btnOutPageSearch){
     btnOutPageSearch.addEventListener('click' , ()=>{
       popUpSearch.style.display = 'none'
       backdrop.style.display = 'none'
     })
  }

  let btnClearFilter = document.getElementById('btnClearFilter');
  if (!btnClearFilter) {
    btnClearFilter = document.createElement('button');
    btnClearFilter.id = 'btnClearFilter';
    btnClearFilter.textContent = 'Limpar filtro';
    btnClearFilter.className = 'btn btn-secondary w-25 aling align-items: center;';
    btnClearFilter.style.display = 'none'; 
    forneListDiv.parentNode.insertBefore(btnClearFilter, forneListDiv);

    btnClearFilter.addEventListener('click', () => {
     
      btnClearFilter.style.display = 'none';
      
      document.getElementById('codeForn').value = '';
      document.getElementById('inputCnpj').value = '';
    
     fetchListFornecedores();
    });
  };

  const btnSearchFornecedor = document.querySelector('.submitSearchForne');
  if (btnSearchFornecedor) {
    btnSearchFornecedor.addEventListener('click', async () => {

      const codeInput = document.getElementById('codeForn').value.trim();
      const cnpjInput = document.getElementById('inputCnpj').value.trim();

      const fieldFilled = [codeInput , cnpjInput].filter((valor)=> valor !== "")

       if (fieldFilled.length === 0) {
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

      if (fieldFilled.length > 1) {
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
      if (codeInput) params.append('fornCode', codeInput);
      if (cnpjInput) params.append('fornCnpj', cnpjInput);

      try {
        const response = await fetch(`/api/forne/search?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok && data.fornecedor?.length > 0) {
     
          Toastify({
          text: "O Fornecedor foi encontrado com sucesso!.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#1d5e1d",
          }).showToast();
         
          btnClearFilter.style.display = 'inline-block';
          
         renderFornecedorTable(data.fornecedor);

          if (popUpSearch) popUpSearch.style.display = 'none';
          if(backdrop)backdrop.style.display = 'none'

        } else {
          Toastify({
          text: data.message || "Nenhum Bem encontrado nessa pesquisa",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#f44336",
          }).showToast();
        }
      } catch (error) {
        console.error("Erro ao buscar fornecedor:", error);
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

// tabela padrão
function renderFornecedorTable(fornecedores) {
  const fornecedoresListDiv = document.querySelector(".listingForn");
  fornecedoresListDiv.innerHTML = "";

  if (fornecedores.length === 0) {
    fornecedoresListDiv.innerHTML = "<p class='text-light'>Nenhum fornecedor cadastrado.</p>";
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "table-responsive";

  const tabela = document.createElement("table");
  tabela.className = "table table-sm table-hover table-striped table-bordered tableFornecedor";

  const colunas = [
    "Selecionar", "Código", "Nome", "Nome Fantasia", "CNPJ", "CEP", "Rua",
    "Cidade", "Estado", "Celular", "E-mail", "Banco", "Agência",
    "Conta", "Pix", "Data do cadastro", "Discrição"
  ];

  // Cabeçalho
  const cabecalho = tabela.createTHead();
  const linhaCabecalho = cabecalho.insertRow();
  colunas.forEach(coluna => {
    const th = document.createElement("th");
    th.textContent = coluna;

    if (["Selecionar", "Código", "CNPJ", "CEP", "Estado", "Agência", "Conta"].includes(coluna)) {
      th.classList.add("text-center", "px-2", "py-1", "align-middle", "wh-nowrap");
    } else {
      th.classList.add("px-3", "py-2", "align-middle");
    }

    linhaCabecalho.appendChild(th);
  });

  // Corpo
  const corpo = tabela.createTBody();

  fornecedores.forEach(fornecedor => {
    const linha = corpo.insertRow();
    linha.setAttribute("data-forncode", fornecedor.forncode);

    // Checkbox
    const checkboxCell = linha.insertCell();
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "selectFornecedor";
    checkbox.value = fornecedor.forncode;
    checkbox.dataset.fornecedor = JSON.stringify(fornecedor);
    checkbox.className = "form-check-input m-0";
    checkboxCell.classList.add("text-center", "align-middle", "wh-nowrap");
    checkboxCell.appendChild(checkbox);

    // Dados formatados
    const dados = [
      fornecedor.forncode,
      fornecedor.fornnome,
      fornecedor.fornnoft,
      formatarCampo("documento", fornecedor.forncnpj),
      formatarCampo("cep", fornecedor.forncep),
      fornecedor.fornrua,
      fornecedor.forncity,
      fornecedor.fornestd,
      formatarCampo("telefone", fornecedor.forncelu),
      fornecedor.fornmail,
      fornecedor.fornbanc,
      fornecedor.fornagen,
      fornecedor.forncont,
      fornecedor.fornpix,
      formatDataPattersBr(fornecedor.forndtcd),
      fornecedor.fornptsv,
    ];

    dados.forEach((valor, index) => {
      const td = linha.insertCell();
      td.textContent = valor || "";
      td.classList.add("align-middle", "text-break");

      const coluna = colunas[index + 1];
      if (["Código", "CNPJ", "CEP", "Estado", "Agência", "Conta"].includes(coluna)) {
        td.classList.add("text-center", "wh-nowrap", "px-2", "py-1");
      } else {
        td.classList.add("px-3", "py-2");
      }
    });
  });

  wrapper.appendChild(tabela);
  fornecedoresListDiv.appendChild(wrapper);
};

// listagem de fornecedor
async function fetchListFornecedores() {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    Toastify({
      text: "Sessão expirada. Faça login novamente.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "#f44336",
    }).showToast();

    localStorage.removeItem("token");
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 2000);
    return;
  }

  try {
    const response = await fetch("/api/listForn", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      Toastify({
        text: result?.message || "Erro ao carregar fornecedores.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();

      document.querySelector(".listingForn").innerHTML =
        "<p class='text-dark'>Erro ao carregar fornecedores.</p>";
      return;
    }

    const fornecedores = result.forne;
    const fornecedoresListDiv = document.querySelector(".listingForn");
    fornecedoresListDiv.innerHTML = "";

    if (fornecedores.length > 0) {
      const wrapper = document.createElement("div");
      wrapper.className = "table-responsive";

      const tabela = document.createElement("table");
      tabela.className = "table table-sm table-hover table-striped table-bordered tableForn";
      tabela.classList.add('tableFornecedor')

      const cabecalho = tabela.createTHead();
      const linhaCabecalho = cabecalho.insertRow();
      const colunas = [
        "Selecionar",
        "Código",
        "Nome",
        "Nome Fantasia",
        "CNPJ",
        "CEP",
        "Rua",
        "Cidade",
        "Estado",
        "Celular",
        "E-mail",
        "Banco",
        "Agência",
        "Conta",
        "Pix",
        "Data do cadastro",
        "Discrição",
      ];

      colunas.forEach((coluna) => {
        const th = document.createElement("th");
        th.textContent = coluna;

        if (["Selecionar", "Código", "CNPJ", "CEP", "Estado", "Agência", "Conta"].includes(coluna)) {
          th.classList.add("text-center", "px-2", "py-1", "align-middle", "wh-nowrap");
        } else {
          th.classList.add("px-3", "py-2", "align-middle");
        }

        linhaCabecalho.appendChild(th);
      });

      const corpo = tabela.createTBody();
      fornecedores.forEach((fornecedor) => {
        const linha = corpo.insertRow();
        linha.setAttribute("data-forncode", fornecedor.forncode);

        const checkboxCell = linha.insertCell();
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "selectFornecedor";
        checkbox.value = fornecedor.forncode;
        checkbox.dataset.fornecedor = JSON.stringify(fornecedor);
        checkbox.className = "form-check-input m-0";
        checkboxCell.classList.add("text-center", "align-middle", "wh-nowrap");
        checkboxCell.appendChild(checkbox);

        
        const formatCep = formatarCampo('cep' , fornecedor.forncep)
        const formatCnpj = formatarCampo('documento' , fornecedor.forncnpj)
        const formatPhone = formatarCampo('telefone' , fornecedor.forncelu)

        const dados = [
          fornecedor.forncode,
          fornecedor.fornnome,
          fornecedor.fornnoft,
          formatCnpj,
          formatCep,
          fornecedor.fornrua,
          fornecedor.forncity,
          fornecedor.fornestd,
          formatPhone,
          fornecedor.fornmail,
          fornecedor.fornbanc,
          fornecedor.fornagen,
          fornecedor.forncont,
          fornecedor.fornpix,
          formatDataPattersBr(fornecedor.forndtcd),
          fornecedor.fornptsv,
        ];

        dados.forEach((valor, index) => {
          const td = linha.insertCell();
          td.textContent = valor || "";
          td.classList.add("align-middle", "text-break");

          const coluna = colunas[index + 1];
          if (["Código", "CNPJ", "CEP", "Estado", "Agência", "Conta"].includes(coluna)) {
            td.classList.add("text-center", "wh-nowrap", "px-2", "py-1");
          } else {
            td.classList.add("px-3", "py-2");
          }
        });
      });

      wrapper.appendChild(tabela);
      fornecedoresListDiv.appendChild(wrapper);
    } else {
      fornecedoresListDiv.innerHTML = "<p class='text-dark'>Nenhum fornecedor cadastrado.</p>";
    }
  } catch (error) {
    console.error("Erro ao carregar fornecedores:", error);
    Toastify({
      text: "Erro de conexão com o servidor.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "#f44336",
    }).showToast();
    document.querySelector(".listingForn").innerHTML =
      "<p class='text-dark'>Erro ao carregar fornecedores.</p>";
  };
};


// deletar fornecedor
function deleteFornecedor() {
  const btnDeleteForn = document.querySelector(".buttonDeleteForn");
  btnDeleteForn.addEventListener("click", async () => {
    const selectedCheckbox = document.querySelector(
      'input[name="selectFornecedor"]:checked'
    );
    if (!selectedCheckbox) {
      Toastify({
        text: "Selecione um Fornecedor para excluir",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
      return;
    }

    const fornecedorSelecionado = JSON.parse(
      selectedCheckbox.dataset.fornecedor
    );
    const fornecedorId = fornecedorSelecionado.forncode;

    const confirmacao = confirm(
      `Tem certeza de que deseja excluir o Fornecedor com código ${fornecedorId}?`
    );
    if (!confirmacao) {
      return;
    }

    await deleteForne(fornecedorId, selectedCheckbox.closest("tr"));
  });

  //delete
  async function deleteForne(id, fornRow) {
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
      const response = await fetch(`/api/deleteForn/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        Toastify({
          text: "O Fornecedor foi excluído com sucesso!",
          duration: 2000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#1d5e1d",
        }).showToast();

        fornRow.remove();
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
        } else {
          Toastify({
            text: "Erro na exclusão do Fornecedor",
            duration: 2000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#f44336",
          }).showToast();
        }
      };
    } catch (error) {
      Toastify({
        text: "Erro ao excluir Fornecedor. Tente novamente.",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
    };
  };
};

// editar fornecedor
function editFornecedor() {

  const editButtonForn = document.querySelector(".buttonEditForn");

  editButtonForn.addEventListener("click", (e) => {
    e.preventDefault();
    const selectedCheckbox = document.querySelector(
      'input[name="selectFornecedor"]:checked'
    );

    if (!selectedCheckbox) {
      Toastify({
        text: "Selecione um Fornecedor para editar",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
      return;
    }

    const btnMainPageForne = document.querySelector(".btnMainPageForn");
    if (btnMainPageForne) {
      btnMainPageForne.classList.remove("flex");
      btnMainPageForne.classList.add("hidden");
    }

    const listForn = document.querySelector(".listingForn ");
    if (listForn) {
      listForn.classList.remove("flex");
      listForn.classList.add("hidden");
    }

    const containerEditForm = document.querySelector(".formEditRegisterForn");
    if (containerEditForm) {
      containerEditForm.classList.remove("hidden");
      containerEditForm.classList.add("flex");
    }

    const fornData = selectedCheckbox.dataset.fornecedor;

    if (!fornData) {
      console.error("O atributo data-fornecedor está vazio ou indefinido.");
      return;
    }

    try {
      const fornecedorSelecionado = JSON.parse(fornData);

      const campos = [
        { id: "editFornCode", valor: fornecedorSelecionado.forncode },
        { id: "editFornName", valor: fornecedorSelecionado.fornnome },
        { id: "editNomeFan", valor: fornecedorSelecionado.fornnoft },
        { id: "editFornCnpj", valor: fornecedorSelecionado.forncnpj },
        { id: "editFornCep", valor: fornecedorSelecionado.forncep },
        { id: "editFornRua", valor: fornecedorSelecionado.fornrua },
        { id: "editFornCity", valor: fornecedorSelecionado.forncity },
        { id: "editFornEstd", valor: fornecedorSelecionado.fornestd },
        { id: "editFornCelu", valor: fornecedorSelecionado.forncelu },
        { id: "editFornMail", valor: fornecedorSelecionado.fornmail },
        { id: "editFornBank", valor: fornecedorSelecionado.fornbanc },
        { id: "editFornAge", valor: fornecedorSelecionado.fornagen },
        { id: "editFornCont", valor: fornecedorSelecionado.forncont },
        { id: "editFornPix", valor: fornecedorSelecionado.fornpix },
        { id: "editFornDtcd", valor: fornecedorSelecionado.forndtcd },
        { id: "editFornDisPro", valor: fornecedorSelecionado.fornptsv },
      ];

      campos.forEach(({ id, valor }) => {
        const elemento = document.getElementById(id);
        if (elemento) {
          if (elemento.type === "date" && valor) {
        
            const dataFormatada = new Date(valor).toISOString().split("T")[0];
            elemento.value = dataFormatada;
          } else {
            elemento.value = valor || "";
          }
          // elemento.value = valor || "";
        } else {
          console.warn(`Elemento com ID '${id}' não encontrado.`);
        }
      });

      document.querySelector(".formEditRegisterForn").style.display = "flex";
      document.querySelector(".listingForn").style.display = "none";
    } catch (error) {
      console.error("Erro ao fazer parse de data-fornecedor:", error);
    }
  });

  const cepInput = document.getElementById("editFornCep");
  const ruaField = document.getElementById("editFornRua");
  const cityField = document.getElementById("editFornCity");
  const stateField = document.getElementById("editFornEstd");

  if (cepInput) {
    cepInput.addEventListener("input", async () => {
      const fornCep = cepInput.value.replace(/\D/g, "");

      if (fornCep.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${fornCep}/json/`);

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

  // função ENVIA O DADO ATUALIZADO
  async function editAndUpdateOfForn() {
    const formEditForn = document.querySelector(".formEditForn");

    formEditForn.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData.entries());

      const selectedCheckbox = document.querySelector(
        'input[name="selectFornecedor"]:checked'
      );

      if (!selectedCheckbox) {
        console.error("Nenhum checkbox foi selecionado.");
        return;
      }

      const fornecedorId = selectedCheckbox.dataset.fornecedor;

      if (!fornecedorId) {
        console.error("O atributo data-fornecedor está vazio ou inválido.");
        return;
      }

      let fornIdParsed;
      try {
        fornIdParsed = JSON.parse(fornecedorId).forncode;
      } catch (error) {
        console.error("Erro ao fazer parse de bemId:", error);
        return;
      }

      const updateForn = {
        forncode: document.getElementById("editFornCode").value,
        fornnome: document.getElementById("editFornName").value,
        fornnoft: document.getElementById("editNomeFan").value,
        forncnpj: document.getElementById("editFornCnpj").value,
        forncep: document.getElementById("editFornCep").value,
        fornrua: document.getElementById("editFornRua").value,
        forncity: document.getElementById("editFornCity").value,
        fornestd: document.getElementById("editFornEstd").value,
        forncelu: document.getElementById("editFornCelu").value,
        fornmail: document.getElementById("editFornMail").value,
        fornbanc: document.getElementById("editFornBank").value,
        fornagen: document.getElementById("editFornAge").value,
        forncont: document.getElementById("editFornCont").value,
        fornpix: document.getElementById("editFornPix").value,
        forndtcd: document.getElementById("editFornDtcd").value || null,
        fornptsv: document.getElementById("editFornDisPro").value,
      };

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

        const confirmedEdition = confirm(
        `Tem certeza de que deseja ATUALIZAR os dados desse Fornecedor?`
        );
          if (!confirmedEdition) return;
        const response = await fetch(`/api/updateforn/${fornIdParsed}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateForn),
        });

        if (response.ok) {
          Toastify({
            text: `Fonecedor '${fornIdParsed}' Atualizado com sucesso!!`,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#1d5e1d",
          }).showToast();

          formEditForn.reset();
        } else {
          const errorResponse = await response.json();

          Toastify({
            text: errorResponse.message || "Erro ao atualizar fornecedor.",
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
          text: "Erro interno na requisição. Tente novamente.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#f44336",
        }).showToast();
      }
    });
  }
  editAndUpdateOfForn();
};


