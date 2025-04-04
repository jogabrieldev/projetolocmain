const btnForn = document.querySelector(".btnCadForn");
btnForn.addEventListener("click", () => {
  const containerAppClient = document.querySelector(".containerAppClient");
  containerAppClient.style.display = "none";

  const containerAppBens = document.querySelector(".containerAppBens");
  containerAppBens.style.display = "none";

  const containerAppProd = document.querySelector(".containerAppProd");
  containerAppProd.style.display = "none";

  const containerAppFabri = document.querySelector(".containerAppFabri");
  containerAppFabri.style.display = "none";

  const containerAppTypeProd = document.querySelector(".containerAppTipoProd");
  containerAppTypeProd.style.display = "none";

  const containerAppDriver = document.querySelector(".containerAppDriver");
  containerAppDriver.style.display = "none";

  const containerAppAutomo = document.querySelector(".containerAppAutomo");
  containerAppAutomo.style.display = "none";

  const formRegisterForn = document.querySelector(".formRegisterForn");
  formRegisterForn.style.display = "none";

  const containerFormEdit = document.querySelector(".formEditRegisterForn");
  containerFormEdit.style.display = "none";

  const listingForn = document.querySelector(".listingForn");
  listingForn.style.display = "flex";

  const btnMainPageForm = document.querySelector(".btnMainPageForn");
  btnMainPageForm.style.display = "flex";

  const containerAppForn = document.querySelector(".containerAppForn");
  containerAppForn.style.display = "flex";

  const informative = document.querySelector(".information");
  informative.style.display = "block";
  informative.textContent = "SEÇÃO FORNECEDOR";
});

const buttonEditForn = document.querySelector(".buttonEditForn");
buttonEditForn.addEventListener("click", () => {
  const btnMainPageForm = document.querySelector(".btnMainPageForn");

  btnMainPageForm.style.display = "none";
});
const btnRegisterForn = document.querySelector(".registerForn");
btnRegisterForn.addEventListener("click", () => {
  const formRegisterForn = document.querySelector(".formRegisterForn");
  const listingForn = document.querySelector(".listingForn");
  const btnMainPageForm = document.querySelector(".btnMainPageForn");

  formRegisterForn.style.display = "flex";

  listingForn.style.display = "none";
  btnMainPageForm.style.display = "none";
});

const btnOutSectionForn = document.querySelector(".buttonExitForn");
btnOutSectionForn.addEventListener("click", (event) => {
  event.preventDefault();

  const containerAppForn = document.querySelector(".containerAppForn");
  containerAppForn.style.display = "none";
});

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

const btnOutInitForn = document.querySelector(".btnOutInitFornEdit");
btnOutInitForn.addEventListener("click", (event) => {
  event.preventDefault();

  const caixaForn = document.querySelector(".formEditRegisterForn");
  caixaForn.style.display = "none";

  const listingForn = document.querySelector(".listingForn");
  listingForn.style.display = "flex";

  const btnMainPageForm = document.querySelector(".btnMainPageForn");
  btnMainPageForm.style.display = "flex";

  return;
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


const socketUpdateForn = io();
document.addEventListener("DOMContentLoaded", async () => {

  await fetchListFornecedores() 
    
  socketUpdateForn.on("updateRunTimeForne", (fornecedor) => {
    insertFornecedoresInTableRunTime(fornecedor);
     
  });
  socketUpdateForn.on("updateFornTable", (updateFornecedor) => {
    updateFornecedorInTableRunTime(updateFornecedor) 
     
  });
   
  
    document .querySelector(".btnRegisterforn").addEventListener("click", async (event) => {
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
      // Captura os valores do formulário
      const formData = {
        fornCode: document.querySelector("#fornCode").value, // Código
        fornName: document.querySelector("#fornName").value, // Nome
        nomeFan: document.querySelector("#nomeFan").value, // Nome Fantasia
        fornCnpj: document.querySelector("#fornCnpj").value, // CNPJ
        fornCep: document.querySelector("#fornCep").value, // CEP
        fornRua: document.querySelector("#fornRua").value, // Rua
        fornCity: document.querySelector("#fornCity").value, // Cidade
        fornEstd: document.querySelector("#fornEstd").value, // Estado
        fornCelu: document.querySelector("#fornCelu").value, // Celular
        fornMail: document.querySelector("#fornMail").value, // E-mail
        fornBank: document.querySelector("#fornBank").value, // Banco
        fornAge: document.querySelector("#fornAge").value, // Agência
        fornCont: document.querySelector("#fornCont").value, // Conta
        fornPix: document.querySelector("#fornPix").value, // Pix
        fornDtcd: document.querySelector("#fornDtcd").value, // Data do Cadastro
        fornDisPro: document.querySelector("#fornDisPro").value, // Descrição do Produto
      };

      try {
        const response = await fetch("http://localhost:3000/api/forne/submit", {
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
            backgroundColor: "green",
          }).showToast();

          // Limpar o formulário após o sucesso
          document.querySelector("#registerForn").reset();
          
        } else if(response.status === 409) {
          Toastify({
            text: result.message,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "orange",
          }).showToast();
        
        }else{
            
          Toastify({
            text: `Erro para Cadastrar fornecedor`,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
          }).showToast();
        }
      } catch (error) {
        console.error("Erro ao enviar formulário:", error);
        alert("Erro ao enviar os dados para o server.");
      }
    });
  validationFormForne();
});


// ATUALIZA A TABELA E RUNTIME QUANDO INSERIR
function insertFornecedoresInTableRunTime(fornecedores) {
  const fornecedoresListDiv = document.querySelector(".listingForn");
  fornecedoresListDiv.innerHTML = "";

  if (fornecedores.length > 0) {
    const tabela = document.createElement("table");
    tabela.style.width = "100%";
    tabela.setAttribute("border", "1");

    const cabecalho = tabela.createTHead();
    const linhaCabecalho = cabecalho.insertRow();
    const colunas = [
      "Selecionar", "Código", "Nome", "Nome Fantasia", "CNPJ", "CEP", "Rua",
      "Cidade", "Estado", "Celular", "E-mail", "Banco", "Agência", "Conta",
      "Pix", "Data do cadastro", "Descrição"
    ];

    colunas.forEach((coluna) => {
      const th = document.createElement("th");
      th.textContent = coluna;
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
      checkboxCell.appendChild(checkbox);

      linha.insertCell().textContent = fornecedor.forncode;
      linha.insertCell().textContent = fornecedor.fornnome;
      linha.insertCell().textContent = fornecedor.fornnoft;
      linha.insertCell().textContent = fornecedor.forncnpj;
      linha.insertCell().textContent = fornecedor.forncep;
      linha.insertCell().textContent = fornecedor.fornrua;
      linha.insertCell().textContent = fornecedor.forncity;
      linha.insertCell().textContent = fornecedor.fornestd;
      linha.insertCell().textContent = fornecedor.forncelu;
      linha.insertCell().textContent = fornecedor.fornmail;
      linha.insertCell().textContent = fornecedor.fornbanc;
      linha.insertCell().textContent = fornecedor.fornagen;
      linha.insertCell().textContent = fornecedor.forncont;
      linha.insertCell().textContent = fornecedor.fornpix;
      linha.insertCell().textContent = formatDate(fornecedor.forndtcd);
      linha.insertCell().textContent = fornecedor.fornptsv;
    });

    fornecedoresListDiv.appendChild(tabela);
  }
}

// lista de fornecedor
async function fetchListFornecedores() {

  const token = localStorage.getItem('token'); 

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
    const response = await fetch("/api/listForn" , {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    });
    const fornecedores = await response.json();


    const fornecedoresListDiv = document.querySelector(".listingForn");
    fornecedoresListDiv.innerHTML = "";

    if (fornecedores.length > 0) {
      const tabela = document.createElement("table");
      tabela.style.width = "100%";
      tabela.setAttribute("border", "1");

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
        checkboxCell.appendChild(checkbox);

        linha.insertCell().textContent = fornecedor.forncode;
        linha.insertCell().textContent = fornecedor.fornnome;
        linha.insertCell().textContent = fornecedor.fornnoft;
        linha.insertCell().textContent = fornecedor.forncnpj;
        linha.insertCell().textContent = fornecedor.forncep;
        linha.insertCell().textContent = fornecedor.fornrua;
        linha.insertCell().textContent = fornecedor.forncity;
        linha.insertCell().textContent = fornecedor.fornestd;
        linha.insertCell().textContent = fornecedor.forncelu;
        linha.insertCell().textContent = fornecedor.fornmail;
        linha.insertCell().textContent = fornecedor.fornbanc;
        linha.insertCell().textContent = fornecedor.fornagen;
        linha.insertCell().textContent = fornecedor.forncont;
        linha.insertCell().textContent = fornecedor.fornpix;
        linha.insertCell().textContent = formatDate(fornecedor.forndtcd);
        linha.insertCell().textContent = fornecedor.fornptsv;
      });

      fornecedoresListDiv.appendChild(tabela);
    } else {
      fornecedoresListDiv.innerHTML = "<p>Nenhum fornecedor cadastrado.</p>";
    }
  } catch (error) {
    console.error("Erro ao carregar fornecedores:", error);
    document.querySelector(".listingForn").innerHTML =
      "<p>Erro ao carregar fornecedores.</p>";
  }
}

// deletar fornecedor
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
      backgroundColor: "red",
    }).showToast();
    return;
  }

  const fornecedorSelecionado = JSON.parse(selectedCheckbox.dataset.fornecedor);
  const fornecedorId = fornecedorSelecionado.forncode;

  const confirmacao = confirm(
    `Tem certeza de que deseja excluir o Fornecedor com código ${fornecedorId}?`
  );
  if (!confirmacao) {
    return;
  }

  await deleteForne(fornecedorId, selectedCheckbox.closest("tr"));
});

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
        backgroundColor: "green",
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
          backgroundColor: "red",
        }).showToast();
      }
    }
  } catch (error) {
    Toastify({
      text: "Erro ao excluir Fornecedor. Tente novamente.",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
  }
}

// atualização
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
      backgroundColor: "red",
    }).showToast();
    document.querySelector(".btnMainPageForn").style.display = "flex";
    return;
  }

  const fornData = selectedCheckbox.dataset.fornecedor;

  if (!fornData) {
    console.error("O atributo data-fornecedor está vazio ou indefinido.");
    return;
  }

  try {
    const fornecedorSelecionado = JSON.parse(fornData);
    console.log("Fornecedor selecionado para edição:", fornecedorSelecionado);

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
          // Formata a data para YYYY-MM-DD, caso seja necessário
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

// função ENVIA O DADO ATUALIZADO
async function editAndUpdateOfForn() {
  const formEditForn = document.querySelector(".formEditForn");

  formEditForn.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    console.log("ESSE E MEU DADO:", data);

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
      const response = await fetch(`/api/updateforn/${fornIdParsed}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateForn),
      });

      console.log("corpo:", updateForn);

      if (response.ok) {
        console.log("Atualização bem-sucedida");

        Toastify({
          text: `Fonecedor '${fornIdParsed}' Atualizado com sucesso!!`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();

        formEditForn.reset();
      } else {
        console.error("Erro ao atualizar fornecedor:", await response.text());
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  });
}
editAndUpdateOfForn();

// ATUALIZAR EM RUNTIME A EDIÇÃO
function updateFornecedorInTableRunTime(updatedFornecedor) {
  
  const row = document.querySelector(
    `[data-forncode="${updatedFornecedor.forncode}"]`
  );

  if (row) {
    // Atualiza as células da linha com as novas informações do fornecedor
    row.cells[1].textContent = updatedFornecedor.forncode || "-"; // Código
    row.cells[2].textContent = updatedFornecedor.fornnome || "-"; // Nome
    row.cells[3].textContent = updatedFornecedor.fornnoft || "-"; // Nome Fantasia
    row.cells[4].textContent = updatedFornecedor.forncnpj || "-"; // CNPJ
    row.cells[5].textContent = updatedFornecedor.forncep || "-"; // CEP
    row.cells[6].textContent = updatedFornecedor.fornrua || "-"; // Rua
    row.cells[7].textContent = updatedFornecedor.forncity || "-"; // Cidade
    row.cells[8].textContent = updatedFornecedor.fornestd || "-"; // Estado
    row.cells[9].textContent = updatedFornecedor.forncelu || "-"; // Celular
    row.cells[10].textContent = updatedFornecedor.fornmail || "-"; // E-mail
    row.cells[11].textContent = updatedFornecedor.fornbanc || "-"; // Banco
    row.cells[12].textContent = updatedFornecedor.fornagen || "-"; // Agência
    row.cells[13].textContent = updatedFornecedor.forncont || "-"; // Conta
    row.cells[14].textContent = updatedFornecedor.fornpix || "-"; // Pix
    row.cells[15].textContent = formatDate(updatedFornecedor.forndtcd) || "-"; // Data do cadastro
    row.cells[16].textContent = updatedFornecedor.fornptsv || "-"; // Descrição
  }
}

