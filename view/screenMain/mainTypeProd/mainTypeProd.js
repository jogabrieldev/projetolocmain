const btnInitCadTypeProd = document.querySelector(".btnCadTypeProd");
btnInitCadTypeProd.addEventListener("click", () => {
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

  const containerAppDriver = document.querySelector(".containerAppDriver");
  containerAppDriver.style.display = "none";

  const containerAppAutomo = document.querySelector(".containerAppAutomo");
  containerAppAutomo.style.display = "none";

  const containerFormRegisterTp = document.querySelector(
    ".formRegisterTipoProd"
  );
  containerFormRegisterTp.style.display = "none";

  const containerFormEditTp = document.querySelector(".containerRegisterEdit");
  containerFormEditTp.style.display = "none";

  const containerAppTypeProd = document.querySelector(".containerAppTipoProd");
  containerAppTypeProd.style.display = "flex";

  const listingTp = document.querySelector(".listingTipoProd");
  listingTp.style.display = "flex";

  const btnMainPageTp = document.querySelector(".btnMainPageTipoProd");
  btnMainPageTp.style.display = "flex";

  const informative = document.querySelector(".information");
  informative.style.display = "block";
  informative.textContent = "SEÇÃO TIPO DE PRODUTOS";
});

const btnRegisterTp = document.querySelector(".registerTipoProd");
btnRegisterTp.addEventListener("click", () => {
  const registerTp = document.querySelector(".formRegisterTipoProd");
  registerTp.style.display = "flex";
  const listingTp = document.querySelector(".listingTipoProd");
  listingTp.style.display = "none";
  const btnMainPage = document.querySelector(".btnMainPageTipoProd");
  btnMainPage.style.display = "none";
});

const btnOutInitTp = document.querySelector(".btnOutInitTp");
btnOutInitTp.addEventListener("click", (e) => {
  e.preventDefault();

  const registerTp = document.querySelector(".formRegisterTipoProd");
  registerTp.style.display = "none";

  const listingTp = document.querySelector(".listingTipoProd");
  listingTp.style.display = "flex";

  const btnMainPage = document.querySelector(".btnMainPageTipoProd");
  btnMainPage.style.display = "flex";
});

const btnExitSectionTypeProd = document.querySelector(".buttonExitTipoProd");
btnExitSectionTypeProd.addEventListener("click", () => {
  const containerAppTypeProd = document.querySelector(".containerAppTipoProd");
  containerAppTypeProd.style.display = "none";
});

const btnOutInitTpEdit = document.querySelector(".btnOutInitTpEdit");
btnOutInitTpEdit.addEventListener("click", (e) => {
  e.preventDefault();

  const registerTpEdit = document.querySelector(".containerRegisterEdit");
  registerTpEdit.style.display = "none";

  const listingTp = document.querySelector(".listingTipoProd");
  listingTp.style.display = "flex";

  const btnMainPage = document.querySelector(".btnMainPageTipoProd");
  btnMainPage.style.display = "flex";
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

const socketUpdateTypeProd  = io()
document.addEventListener("DOMContentLoaded", () => {
    
  socketUpdateTypeProd.on("updateRunTimeTypeProduto", (tipoProduto) => {
    insertTypeProductTableRunTime(tipoProduto)
  });

  socketUpdateTypeProd.on("updateRunTimeTableTypeProduto", (updatedTypeProduct) => {
    updateTypeProductInTableRunTime(updatedTypeProduct)
  });


  document.querySelector(".cadTp").addEventListener("click", async (event) => {
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
    if (!$(".formRegisterTipoProdu").valid()) {
      return;
    }

    // Captura os valores do formulário
    const formData = {
      tpCode: document.querySelector("#tpCode").value, // Código
      tpDesc: document.querySelector("#tpDesc").value, // Descrição
      tpCat: document.querySelector("#tpCat").value, // Categoria
      tpSubCat: document.querySelector("#tpSubCat").value, // Subcategoria
      tpObs: document.querySelector("#tpObs").value, // Observação
      tpCtct: document.querySelector("#tpCtct").value, // Centro de Custo
    }; 

    

    try {
      const response = await fetch(
        "http://localhost:3000/api/typeprod/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        Toastify({
          text: "Tipo de produto cadastrado com sucesso!",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();

        // Limpar o formulário após o sucesso
        document.querySelector(".formRegisterTipoProdu").reset();
      } else {
        Toastify({
          text: "Erro ao cadastrar tipo de produt",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      alert("Erro ao enviar os dados.");
    }
  });
  validationFormTipoProd();
});

// ATUALIZAR A TABELA EM RUNTIME NA INSERÇÃO
function insertTypeProductTableRunTime(tipoProduto) {
  const tableWrapper = document.querySelector(".tableWrapper");
  tableWrapper.innerHTML = ""; 

  if (tipoProduto.length > 0) {
    const tabela = document.createElement("table");
    tabela.style.width = "100%";
    tabela.setAttribute("border", "1");

    // Cabeçalho da tabela
    const cabecalho = tabela.createTHead();
    const linhaCabecalho = cabecalho.insertRow();
    const colunas = [
      "Selecionar",
      "Código",
      "Descrição",
      "Categoria",
      "Subcategoria",
      "Observação",
      "Centro de Custo",
    ];

    colunas.forEach((coluna) => {
      const th = document.createElement("th");
      th.textContent = coluna;
      linhaCabecalho.appendChild(th);
    });

    // Corpo da tabela
    const corpo = tabela.createTBody();
    tipoProduto.forEach((typeProd) => {
      const linha = corpo.insertRow();
      linha.setAttribute("data-typecode", typeProd.tiprcode);

      const checkboxCell = linha.insertCell();
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "selectTypeProd";
      checkbox.value = typeProd.tiprcode;

      const typeProdData = JSON.stringify(typeProd);
      if (typeProdData) {
        checkbox.dataset.typeProd = typeProdData;
      } else {
        console.warn(`Produto inválido encontrado:`, typeProd);
      }

      checkboxCell.appendChild(checkbox);

      linha.insertCell().textContent = typeProd.tiprcode;
      linha.insertCell().textContent = typeProd.tiprdesc;
      linha.insertCell().textContent = typeProd.tiprcate;
      linha.insertCell().textContent = typeProd.tiprsuca;
      linha.insertCell().textContent = typeProd.tiprobs;
      linha.insertCell().textContent = typeProd.tiprctct;
    });

    tableWrapper.appendChild(tabela);
  } else {
    tableWrapper.innerHTML = "<p>Nenhum tipo de produto cadastrado.</p>";
  }
};

//listagem do tipo do produto
async function fetchListTypeProduct() {
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
      const response = await fetch("/api/listingTypeProd", {
          method: "GET",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
      });

      const tipoProduto = await response.json();

      const tableWrapper = document.querySelector('.tableWrapper');
      tableWrapper.innerHTML = ""; // Limpa antes de adicionar a tabela

      if (tipoProduto.length > 0) {
          const tabela = document.createElement("table");
          tabela.style.width = "100%"; // Define largura fixa

          tabela.setAttribute("border", "1");

          const cabecalho = tabela.createTHead();
          const linhaCabecalho = cabecalho.insertRow();
          const colunas = [
              "Selecionar",
              "Código",
              "Descrição",
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
          tipoProduto.forEach((typeProd) => {
              const linha = corpo.insertRow();
              linha.setAttribute("data-typecode", typeProd.tiprcode);

              const checkboxCell = linha.insertCell();
              const checkbox = document.createElement("input");
              checkbox.type = "checkbox";
              checkbox.name = "selectTypeProd";
              checkbox.value = typeProd.tiprcode;

              const typeProdData = JSON.stringify(typeProd);
              if (typeProdData) {
                  checkbox.dataset.typeProd = typeProdData;
              } else {
                  console.warn(`Fornecedor inválido encontrado:`, typeProd);
              }

              checkboxCell.appendChild(checkbox);

              linha.insertCell().textContent = typeProd.tiprcode;
              linha.insertCell().textContent = typeProd.tiprdesc;
              linha.insertCell().textContent = typeProd.tiprcate;
              linha.insertCell().textContent = typeProd.tiprsuca;
              linha.insertCell().textContent = typeProd.tiprobs;
              linha.insertCell().textContent = typeProd.tiprctct;
          });

          tableWrapper.appendChild(tabela);
      } else {
          tableWrapper.innerHTML = "<p>Nenhum tipo de produto cadastrado.</p>";
      }
  } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
      document.querySelector(".listingTipoProd").innerHTML =
          "<p>Erro ao carregar tipo de produto.</p>";
  }
}
fetchListTypeProduct();

//delete tipo do produto
const btnDeleteTypeProd = document.querySelector(".buttonDeleteTipoProd");
btnDeleteTypeProd.addEventListener("click", async () => {
  const selectedCheckbox = document.querySelector(
    'input[name="selectTypeProd"]:checked'
  );
  if (!selectedCheckbox) {
    Toastify({
      text: "Selecione um tipo de Produto para excluir",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return;
  }

  const typeProdutoSelecionado = JSON.parse(selectedCheckbox.dataset.typeProd);
  const tyoeProdutoId = typeProdutoSelecionado.tiprcode;

  const confirmacao = confirm(
    `Tem certeza de que deseja excluir o produto com código ${tyoeProdutoId}?`
  );
  if (!confirmacao) {
    return;
  }

  await deleteTypeProd(tyoeProdutoId, selectedCheckbox.closest("tr"));
});

async function deleteTypeProd(id, rowProd) {
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
    const response = await fetch(`/api/deletetp/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (response.ok) {
      Toastify({
        text: "tipo de produto excluído com sucesso!",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();

      rowProd.remove();
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
          text: "Erro na exclusão do tipo de produto",
          duration: 2000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
      }
    }
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    Toastify({
      text: "Erro ao excluir tipo do produto. Tente novamente.",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
  }
}

//botão editar
const btnEditTp = document.querySelector(".buttonEditTipoProd");
btnEditTp.addEventListener("click", () => {
  const selectedCheckbox = document.querySelector(
    'input[name="selectTypeProd"]:checked'
  );

  if (!selectedCheckbox) {
    Toastify({
      text: "Selecione o tipo de Produto para editar",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return;
  }

  const typeProdutoData = selectedCheckbox.dataset.typeProd;
  if (!typeProdutoData) {
    console.error("O atributo data-bem está vazio ou indefinido.");
    return;
  }

  try {
    const typeProdutoSelecionado = JSON.parse(typeProdutoData);

    // Campos e IDs correspondentes
    const campos = [
      { id: "editTpCode", valor: typeProdutoSelecionado.tiprcode },
      { id: "editTpDesc", valor: typeProdutoSelecionado.tiprdesc },
      { id: "editTpCat", valor: typeProdutoSelecionado.tiprcate },
      { id: "editTpSubCat", valor: typeProdutoSelecionado.tiprsuca },
      { id: "editTpObs", valor: typeProdutoSelecionado.tiprobs },
      { id: "editTpCtct", valor: typeProdutoSelecionado.tiprctct },
    ];

    // Atualizar valores no formulário
    campos.forEach(({ id, valor }) => {
      const elemento = document.getElementById(id);
      if (elemento) {
        elemento.value = valor || "";
      } else {
        console.warn(`Elemento com ID '${id}' não encontrado.`);
      }
    });

    const spaceEditTypeprod = document.querySelector(".containerRegisterEdit");
    const btnMainPageProd = document.querySelector(".btnMainPageTipoProd");
    const listingTypeProd = document.querySelector(".listingTipoProd");

    if (spaceEditTypeprod) {
      spaceEditTypeprod.style.display = "flex";
    } else {
      console.error("O formulário de edição não foi encontrado.");
    }

    if (listingTypeProd) {
      listingTypeProd.style.display = "none";
    } else {
      console.error("A lista de produto não foi encontrada.");
    }

    if (btnMainPageProd) {
      btnMainPageProd.style.display = "none";
    }
  } catch (error) {
    console.error("Erro ao fazer parse de data-bem:", error);
  }
});

//atualização
async function editAndUpdateOfTypeProduct() {
  const formEditProd = document.querySelector(".formEditTp");

  formEditProd.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const selectedCheckbox = document.querySelector(
      'input[name="selectTypeProd"]:checked'
    );

    if (!selectedCheckbox) {
      console.error("Nenhum checkbox foi selecionado.");
      return;
    }

    const typeProdutoId = selectedCheckbox.dataset.typeProd;

    if (!typeProdutoId) {
      console.error("O atributo data-bem está vazio ou inválido.");
      return;
    }

    let typeProdIdParsed;
    try {
      typeProdIdParsed = JSON.parse(typeProdutoId).tiprcode;
    } catch (error) {
      console.error("Erro ao fazer parse de bemId:", error);
      return;
    }

    const updateTypeProduct = {
      tiprcode: document.getElementById("editTpCode").value,
      tiprdesc: document.getElementById("editTpDesc").value,
      tiprcate: document.getElementById("editTpCat").value,
      tiprsuca: document.getElementById("editTpSubCat").value,
      tiprobs: document.getElementById("editTpObs").value,
      tiprctct: document.getElementById("editTpCtct").value,
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
      const response = await fetch(`/api/updatetypeprod/${typeProdIdParsed}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateTypeProduct),
      });

      console.log("resposta:", response);

      if (response.ok) {
        console.log("Atualização bem-sucedida");

        Toastify({
          text: `Bem '${typeProdIdParsed}' Atualizado com sucesso!!`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();

        formEditProd.reset();
      } else {
        console.error("Erro ao atualizar produto:", await response.text());
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  });
};
editAndUpdateOfTypeProduct();

// atualização em runtime NA EDIÇÃO
function updateTypeProductInTableRunTime(updatedTypeProduct) {
  const row = document.querySelector(
    `[data-typecode="${updatedTypeProduct.tiprcode}"]`
  );

  if (row) {
    // Atualiza as células da linha com as novas informações do tipo de produto
    row.cells[2].textContent = updatedTypeProduct.tiprdesc || "-"; // Descrição
    row.cells[3].textContent = updatedTypeProduct.tiprcate || "-"; // Categoria
    row.cells[4].textContent = updatedTypeProduct.tiprsuca || "-"; // Subcategoria
    row.cells[5].textContent = updatedTypeProduct.tiprobs || "-"; // Observação
    row.cells[6].textContent = updatedTypeProduct.tiprctct || "-"; // Centro de Custo
  }
};
