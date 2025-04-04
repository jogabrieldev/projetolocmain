const btnCadFabri = document.querySelector(".btnCadFabri");
btnCadFabri.addEventListener("click", () => {
  const containerAppFabri = document.querySelector(".containerAppFabri");
  containerAppFabri.style.display = "flex";

  const containerAppClient = document.querySelector(".containerAppClient");
  containerAppClient.style.display = "none";

  const containerAppBens = document.querySelector(".containerAppBens");
  containerAppBens.style.display = "none";

  const containerAppForn = document.querySelector(".containerAppForn");
  containerAppForn.style.display = "none";

  const btnPageInit = document.querySelector(".btnMainPageFabri");
  btnPageInit.style.display = "flex";

  const containerFormRegisterFabri = document.querySelector(".listingFabri");
  containerFormRegisterFabri.style.display = "flex";

  const formRegisterFabri = document.querySelector(".formRegisterFabri");
  formRegisterFabri.style.display = "none";

  const containerAppDriver = document.querySelector(".containerAppDriver");
  containerAppDriver.style.display = "none";

  const containerAppAutomo = document.querySelector(".containerAppAutomo");
  containerAppAutomo.style.display = "none";

  const containerAppTypeProd = document.querySelector(".containerAppTipoProd");
  containerAppTypeProd.style.display = "none";

  const containerAppProd = document.querySelector(".containerAppProd");
  containerAppProd.style.display = "none";

  const containerFormEdit = document.querySelector(".editFabri");
  containerFormEdit.style.diplay = "none";

  const informative = document.querySelector(".information");
  informative.style.display = "block";
  informative.textContent = "SEÇÃO FAMILIA DE BENS";
});

const btnPageRegisterFabri = document.querySelector(".registerFabri");
btnPageRegisterFabri.addEventListener("click", () => {
  const formRegisterFabri = document.querySelector(".formRegisterFabri");
  const btnPageInit = document.querySelector(".btnMainPageFabri");
  const listFabricante = document.querySelector(".listingFabri");

  listFabricante.style.display = "none";
  btnPageInit.style.display = "none";

  formRegisterFabri.style.display = "flex";
});

const btnOutOfRegister = document.querySelector(".btnOutInitFabri");
btnOutOfRegister.addEventListener("click", (event) => {
  event.preventDefault();

  const btnPageInit = document.querySelector(".btnMainPageFabri");
  btnPageInit.style.display = "flex";

  const listFabricante = document.querySelector(".listingFabri");
  listFabricante.style.display = "flex";

  const containerFormFabriRegister =
    document.querySelector(".formRegisterFabri");
  containerFormFabriRegister.style.display = "none";
});

const btnExitFamilygoods = document.querySelector(".buttonExitFabri");
btnExitFamilygoods.addEventListener("click", (event) => {
  event.preventDefault();

  const containerAppFabri = document.querySelector(".containerAppFabri");
  containerAppFabri.style.display = "none";
});

const btnOutInitFabriEdit = document.querySelector(".btnOutInitFabriEdit");
btnOutInitFabriEdit.addEventListener("click", (event) => {
  event.preventDefault();

  const btnPageInit = document.querySelector(".btnMainPageFabri");
  btnPageInit.style.display = "flex";

  const listFabricante = document.querySelector(".listingFabri");
  listFabricante.style.display = "flex";

  const containerFormFabriRegister = document.querySelector(".editFabri");
  containerFormFabriRegister.style.display = "none";
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

const socketUpdateFamilyBens = io()
document.addEventListener("DOMContentLoaded", async () => {
   
   await fetchListFabricante();
   socketUpdateFamilyBens.on("updateRunTimeFamilyBens", (familyGoods) => {
    insertFamilyGoodsTableRunTime(familyGoods);
  });

  socketUpdateFamilyBens.on("updateRunTimeTableFamilyGoods", (updatedFamimyGoods) => {
   updateFamilyGoodsInTableRunTime(updatedFamimyGoods);
  });


    document.querySelector(".cadFabri").addEventListener("click", async (event) => {

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

      if (!$(".formRegisterFabricante").valid()) {
        return;
      }

      // Captura os valores do formulário
      const formData = {
        fabeCode: document.querySelector("#fabeCode").value, // Código
        fabeDesc: document.querySelector("#fabeDesc").value, // Descrição
        fabeCate: document.querySelector("#fabeCate").value, // Categoria
        fabeSuca: document.querySelector("#fabeSuca").value, // Subcategoria
        fabeObs: document.querySelector("#fabeObs").value, // Observação
        fabeCtct: document.querySelector("#fabeCtct").value, // Centro de Custo
      };

      try {
        const response = await fetch("http://localhost:3000/api/fabri/submit", {
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
            text: "Familia do bem cadastrado com sucesso!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "green",
          }).showToast();

          // Limpar o formulário após o sucesso
          document.querySelector(".formRegisterFabricante").reset();
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
            text: "Erro ao cadastrar familia de bens",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
          }).showToast();
        }
      } catch (error) {
        console.error("Erro ao enviar formulário:", error);
        alert("Erro ao enviar os dados.", error);
      }
    });
  validationFormFabric();
});

function insertFamilyGoodsTableRunTime(familyGoods) {
  const fabricanteListDiv = document.querySelector(".listingFabri");
  fabricanteListDiv.innerHTML = "";

  if (familyGoods.length > 0) {
    const tabela = document.createElement("table");
    tabela.style.width = "100%";
    tabela.setAttribute("border", "1");

    // Cabeçalho
    const cabecalho = tabela.createTHead();
    const linhaCabecalho = cabecalho.insertRow();
    const colunas = [
      "Selecionar",
      "Código",
      "Descrição",
      "Categoria",
      "Subcategoria",
      "Observação",
      "Centro de Custo"
    ];

    colunas.forEach((coluna) => {
      const th = document.createElement("th");
      th.textContent = coluna;
      linhaCabecalho.appendChild(th);
    });

    // Corpo da tabela
    const corpo = tabela.createTBody();
    familyGoods.forEach((familyGoods) => {
      const linha = corpo.insertRow();
      linha.setAttribute("data-fabecode", familyGoods.fabecode);

      const checkboxCell = linha.insertCell();
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "selectfamilyGoods";
      checkbox.value = familyGoods.fabecode;
      checkbox.dataset.familyGoods = JSON.stringify(familyGoods);
      checkboxCell.appendChild(checkbox);

      linha.insertCell().textContent = familyGoods.fabecode;
      linha.insertCell().textContent = familyGoods.fabedesc;
      linha.insertCell().textContent = familyGoods.fabecate;
      linha.insertCell().textContent = familyGoods.fabesuca;
      linha.insertCell().textContent = familyGoods.fabeobs;
      linha.insertCell().textContent = familyGoods.fabectct;
    });

    fabricanteListDiv.appendChild(tabela);
  } else {
    fabricanteListDiv.innerHTML = "<p>Nenhum fabricante cadastrado.</p>";
  }
}

// listagem de fabricante
async function fetchListFabricante() {

  const token = localStorage.getItem('token'); // Pega o token armazenado no login

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
    const response = await fetch("/api/listfabri" , {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    });
    const familyGoods = await response.json();

    const familyGoodsListDiv = document.querySelector(".listingFabri");
    familyGoodsListDiv.innerHTML = "";

    if (familyGoods.length > 0) {
      const tabela = document.createElement("table");
      tabela.style.width = "100%";
      tabela.setAttribute("border", "1");

      const cabecalho = tabela.createTHead();
      const linhaCabecalho = cabecalho.insertRow();
      const colunas = [
        "Selecionar",
        "Código",
        "Discrição",
        "Categoria",
        "Subcategoria",
        "Observação",
        "Centro de custo",
      ];

      colunas.forEach((coluna) => {
        const th = document.createElement("th");
        th.textContent = coluna;
        linhaCabecalho.appendChild(th);
      });

      const corpo = tabela.createTBody();
      familyGoods.forEach((familyGoods) => {
        const linha = corpo.insertRow();

        linha.setAttribute("data-fabecode", familyGoods.fabecode);

        const checkboxCell = linha.insertCell();
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "selectfamilyGoods";
        checkbox.value = familyGoods.fabecode;

        const fabricanteData = JSON.stringify(familyGoods);
        if (fabricanteData) {
          checkbox.dataset.familyGoods = fabricanteData;
        } else {
          console.warn(`Fornecedor inválido encontrado:`, familyGoods);
        }

        checkboxCell.appendChild(checkbox);

        linha.insertCell().textContent = familyGoods.fabecode;
        linha.insertCell().textContent = familyGoods.fabedesc;
        linha.insertCell().textContent = familyGoods.fabecate;
        linha.insertCell().textContent = familyGoods.fabesuca;
        linha.insertCell().textContent = familyGoods.fabeobs;
        linha.insertCell().textContent = familyGoods.fabectct;
      });

      familyGoodsListDiv.appendChild(tabela);
    } else {
      familyGoodsListDiv.innerHTML = "<p>Nenhum fornecedor cadastrado.</p>";
    }
  } catch (error) {
    console.error("Erro ao carregar fornecedores:", error);
    document.querySelector(".listingFabri").innerHTML =
      "<p>Erro ao carregar fornecedores.</p>";
  }
}

//deletar fabricante
const btnDeleteFabri = document.querySelector(".buttonDeleteFabri");
btnDeleteFabri.addEventListener("click", async () => {
  const selectedCheckbox = document.querySelector(
    'input[name="selectfamilyGoods"]:checked'
  );
  if (!selectedCheckbox) {
    Toastify({
      text: "Selecione uma familia de bem para excluir",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return;
  }

  const fabricanteSelecionado = JSON.parse(selectedCheckbox.dataset.familyGoods);
  const fabricanteId = fabricanteSelecionado.fabecode;

  console.log("ID Family", fabricanteId);

  const confirmacao = confirm(
    `Tem certeza de que deseja excluir o Fabricante com código ${fabricanteId}?`
  );
  if (!confirmacao) {
    return;
  }

  await deleteFabri(fabricanteId, selectedCheckbox.closest("tr"));
});

async function deleteFabri(id, fabeRow) {
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
    const response = await fetch(`/api/deletefabri/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log("Resposta do servidor:", data);
    if (response.ok) {
      Toastify({
        text: "O Familia de bens excluída com sucesso!",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();

      fabeRow.remove();
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
          text: "Erro na exclusão da familia de bem",
          duration: 2000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
      }
    }
  } catch (error) {
    console.error("Erro ao excluir fabricante:", error);
    Toastify({
      text: "Erro ao excluir familia de bem. Tente novamente.",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
  }
}

// Edição do fabricante
const btnFormEditFabri = document.querySelector(".buttonEditFabri");
btnFormEditFabri.addEventListener("click", () => {
  const selectedCheckbox = document.querySelector(
    'input[name="selectfamilyGoods"]:checked'
  );

  if (!selectedCheckbox) {
    Toastify({
      text: "Selecione uma familia de bem para editar",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return;
  }

  const fabricanteData = selectedCheckbox.dataset.familyGoods;
  if (!fabricanteData) {
    console.error("O atributo data-fabecode está vazio ou indefinido.");
    return;
  }

  try {
    const fabricanteSelecionado = JSON.parse(fabricanteData);

    // Campos e IDs correspondentes
    const campos = [
      { id: "editFabeCode", valor: fabricanteSelecionado.fabecode },
      { id: "editFabeDesc", valor: fabricanteSelecionado.fabedesc },
      { id: "editFabeCate", valor: fabricanteSelecionado.fabecate },
      { id: "editFabeSuca", valor: fabricanteSelecionado.fabesuca },
      { id: "editFabeObs", valor: fabricanteSelecionado.fabeobs },
      { id: "editFabeCtct", valor: fabricanteSelecionado.fabectct },
    ];

    console.log(campos);
    // Atualizar valores no formulário
    campos.forEach(({ id, valor }) => {
      const elemento = document.getElementById(id);
      if (elemento) {
        elemento.value = valor || "";
      } else {
        console.warn(`Elemento com ID '${id}' não encontrado.`);
      }
    });

    // Mostrar o formulário de edição e ocultar a lista
    const spaceEditFabri = document.querySelector(".editFabri");
    const btnMainPageFabri = document.querySelector(".btnMainPageFabri");
    const listingFabri = document.querySelector(".listingFabri");

    if (spaceEditFabri) {
      spaceEditFabri.style.display = "flex";
    } else {
      console.error("O formulário de edição não foi encontrado.");
    }

    if (listingFabri) {
      listingFabri.style.display = "none";
    } else {
      console.error("A lista de Fabricantes não foi encontrada.");
    }

    if (btnMainPageFabri) {
      btnMainPageFabri.style.display = "none";
    }
  } catch (error) {
    console.error("Erro ao fazer parse de data-bem:", error);
  }
});

// função DE EDIÇÃO
async function editAndUpdateOfFabric() {
  const formEditFabri = document.querySelector(".formEditFabri");

  formEditFabri.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const selectedCheckbox = document.querySelector(
      'input[name="selectfamilyGoods"]:checked'
    );

    if (!selectedCheckbox) {
      console.error("Nenhum checkbox foi selecionado.");
      return;
    }

    const fabricanteId = selectedCheckbox.dataset.familyGoods;

    if (!fabricanteId) {
      console.error("O atributo data-bem está vazio ou inválido.");
      return;
    }

    let fabeIdParsed;
    try {
      fabeIdParsed = JSON.parse(fabricanteId).fabecode;
    } catch (error) {
      console.error("Erro ao fazer parse de bemId:", error);
      return;
    }

    const updateFabric = {
      fabecode: document.getElementById("editFabeCode").value,
      fabedesc: document.getElementById("editFabeDesc").value,
      fabecate: document.getElementById("editFabeCate").value,
      fabesuca: document.getElementById("editFabeSuca").value,
      fabeobs: document.getElementById("editFabeObs").value,
      fabectct: document.getElementById("editFabeCtct").value,
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
      const response = await fetch(`/api/updatefabe/${fabeIdParsed}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
         'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateFabric),
      });

      console.log("resposta:", response);

      if (response.ok) {
        console.log("Atualização bem-sucedida");

        Toastify({
          text: `Familia'${fabeIdParsed}' Atualizada com sucesso!!`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();

        formEditFabri.reset();
      } else {
        console.error("Erro ao atualizar familia:", await response.text());
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  });
};
editAndUpdateOfFabric();

// ATUALIZÇÃO EM RUNTIME
function updateFamilyGoodsInTableRunTime(updatedFamimyGoods) {
  const row = document.querySelector(
    `[data-fabecode="${updatedFamimyGoods.fabecode}"]`
  );

  if (row) {
    // Atualiza as células da linha com as novas informações do fabricante
    row.cells[2].textContent = updatedFamimyGoods.fabedesc || "-"; // Descrição
    row.cells[3].textContent = updatedFamimyGoods.fabecate || "-"; // Categoria
    row.cells[4].textContent = updatedFamimyGoods.fabesuca || "-"; // Subcategoria
    row.cells[5].textContent = updatedFamimyGoods.fabeobs || "-"; // Observação
    row.cells[6].textContent = updatedFamimyGoods.fabectct || "-"; // Centro de Custo
  }
};

