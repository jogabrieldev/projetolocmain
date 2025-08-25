function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expTime = payload.exp * 1000;
    return Date.now() > expTime;
  } catch (error) {
    return true;
  }
}

function maskFieldProduto() {
  $("#prodValor").mask("R$ 000.000.000,00", { reverse: true });

  $("#prodPeli").mask("R$ 000.000.000,00", { reverse: true });

  $("#prodPebr").mask("R$ 000.000.000,00", { reverse: true });

  $("#editProdValor").mask("R$ 000.000.000,00", { reverse: true });

  $("#editProdPeli").mask("R$ 000.000.000,00", { reverse: true });

  $("#editProdPebr").mask("R$ 000.000.000,00", { reverse: true });
}

function dateAtualInField(date) {
  const inputDtCad = document.getElementById(date);
  if (inputDtCad) {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    inputDtCad.value = `${ano}-${mes}-${dia}`;
    return true;
  } else {
    console.error("Campo data cadastro não encontrado no DOM");
    return false;
  }
}

const socketProduto = io();
document.addEventListener("DOMContentLoaded", () => {
  const btnLoadProd = document.querySelector(".btnCadProd");
  if (btnLoadProd) {
    btnLoadProd.addEventListener("click", async () => {
      try {
        const responseProd = await fetch("/produto", {
          method: "GET",
        });

        if (!responseProd.ok)
          throw new Error(`Erro HTTP: ${responseProd.status}`);
        const html = await responseProd.text();
        const mainContent = document.querySelector("#mainContent");
        if (mainContent) {
          mainContent.innerHTML = html;
          maskFieldProduto();
          interationSystemProduto();
          dateAtualInField("prodData");
          registerNewProduto();
          searchProduto();
          deleteProdutoSystem();
          editProduto();
        } else {
          console.error("#mainContent não encontrado no DOM");
        }

        const containerAppProd = document.querySelector(".containerAppProd");
        if (containerAppProd) containerAppProd.classList.add("flex");

        const sectionsToHide = [
          ".containerAppForn",
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

        const containerRegisterProd =
          document.querySelector(".formRegisterProd");
        const btnMainPageProd = document.querySelector(".btnMainPageProd");
        const listingProd = document.querySelector(".listingProd");
        const editFormProd = document.querySelector(".formEditProd");
        const informative = document.querySelector(".information");

        if (containerRegisterProd) containerRegisterProd.style.display = "none";
        if (btnMainPageProd) btnMainPageProd.style.display = "flex";
        if (listingProd) listingProd.style.display = "flex";
        if (editFormProd) editFormProd.style.display = "none";
        if (informative) {
          informative.style.display = "block";
          informative.textContent = "SEÇÃO PRODUTO";
        }

        await fetchListProdutos();
        await loadSelectOptions("/api/codetipoprod", "prodTipo", "tiprcode");
      } catch (error) {
        Toastify({
          text: "Erro na pagina",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
        console.error("btnLoadProd não encontrado no DOM");
      }
    });
  };

  socketProduto.on("updateRunTimeProduto", (produtos) => {
    fetchListProdutos();
  });

  socketProduto.on("updateRunTimeTableProduto", (updatedProduct) => {
    fetchListProdutos();
  });
});

// INTERAÇÃO
function interationSystemProduto() {
  const registerProd = document.querySelector(".registerProd");
  if (registerProd) {
    registerProd.addEventListener("click", () => {
      const formRegisterProd = document.querySelector(".formRegisterProd");
      if (formRegisterProd) {
        formRegisterProd.classList.remove("hidden");
        formRegisterProd.classList.add("flex");
      }
      const btnMainPageProd = document.querySelector(".btnMainPageProd");
      if (btnMainPageProd) {
        btnMainPageProd.classList.remove("flex");
        btnMainPageProd.classList.add("hidden");
      }
      const listingProd = document.querySelector(".listingProd");
      if (listingProd) {
        listingProd.classList.remove("flex");
        listingProd.classList.add("hidden");
      }
    });
  };

  const btnExitProd = document.getElementById("buttonExitProd");
  if (btnExitProd) {
    btnExitProd.addEventListener("click", () => {
      const containerAppProd = document.querySelector(".containerAppProd");
      if (containerAppProd) {
        containerAppProd.classList.remove("flex");
        containerAppProd.classList.add("hidden");
      }

      const informative = document.querySelector(".information");
      if (informative) {
        informative.style.display = "block";
        informative.textContent = "Sessão ativa";
      }
    });
  };

  const btnOutInitProd = document.querySelector(".btnOutInitProd");

  if (btnOutInitProd) {
    btnOutInitProd.addEventListener("click", (event) => {
      event.preventDefault();

      const btnMainPageProd = document.querySelector(".btnMainPageProd");
      if (btnMainPageProd) {
        btnMainPageProd.classList.remove("hidden");
        btnMainPageProd.classList.add("flex");
      }

      const listingProd = document.querySelector(".listingProd");
      if (listingProd) {
        listingProd.classList.remove("hidden");
        listingProd.classList.add("flex");
      }

      const containerFormProd = document.querySelector(".formRegisterProd");
      if (containerFormProd) {
        containerFormProd.classList.remove("flex");
        containerFormProd.classList.add("hidden");
      }
    });
  };

  const btnOutEditForm = document.querySelector(".btnOutInitProdEdit");
  if (btnOutEditForm) {
    btnOutEditForm.addEventListener("click", (event) => {
      event.preventDefault();

      const btnMainPageProd = document.querySelector(".btnMainPageProd");
      if (btnMainPageProd) {
        btnMainPageProd.classList.remove("hidden");
        btnMainPageProd.classList.add("flex");
      }

      const listingProd = document.querySelector(".listingProd");
      if (listingProd) {
        listingProd.classList.remove("hidden");
        listingProd.classList.add("flex");
      }

      const containerFormEditProd = document.querySelector(".formEditProd");
      if (containerFormEditProd) {
        containerFormEditProd.classList.remove("flex");
        containerFormEditProd.classList.add("hidden");
      }
    });
  }
};

// CADASTRAR PRODUTO 
function registerNewProduto() {
  dateAtualInField("prodData");

  document.querySelector(".cadProd").addEventListener("click", async (event) => {
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

      if (!$(".formRegisterProduto").valid()) {
        return;
      }

      const formData = {
        prodCode: document.querySelector("#prodCode").value.trim(), // Código
        prodDesc: document.querySelector("#prodDesc").value.trim(), // Descrição
        prodTipo: document.querySelector("#prodTipo").value.trim(), // Tipo de Produto
        prodUni: document.querySelector("#prodUni").value.trim(), // Unidade
        prodData: document.querySelector("#prodData").value, // Data
        prodValor: document.querySelector("#prodValor").value.trim(), // Valor de Compra
        prodPeli: document.querySelector("#prodPeli").value.trim(), // Preço Líquido
        prodPebr: document.querySelector("#prodPebr").value.trim(), // Preço Bruto
        prodAtiv: document.querySelector("#prodAtiv").value, // Ativo
      };

      if (!isDataValida(formData.prodData)) {
        Toastify({
          text: "Data de Cadastro INVALIDA.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
        return;
      }

      const [y, m, d] = formData.prodData.split("-").map(Number);
      const dtCd = new Date(y, m - 1, d);
      const hoje = new Date();
      const hoje0 = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate()
      );

      if (dtCd.getTime() !== hoje0.getTime()) {
        Toastify({
          text: "Data de cadastro deve ser a data de hoje",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
        return;
      }

      if (!validarPrecoLiquidoMenorOuIgual(formData.prodPeli, formData.prodPebr)) {
        Toastify({
          text: "O preço líquido não pode ser maior que o preço bruto.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
        return;
      }

      try {
        const response = await fetch("/api/prod/submit", {
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
            text: "Produto cadastrado com sucesso!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#1d5e1d",
          }).showToast();

          document.querySelector(".formRegisterProduto").reset();
          dateAtualInField("prodData");
        } else {
         
          if (result?.errors && Array.isArray(result.errors)) {
            const mensagens = result.errors
              .map((err) => `• ${err.msg}`)
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
              text: result?.message || "Erro ao cadastrar produto.",
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
          text: "Erro ao enviar os dados para server.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#f44336",
        }).showToast();
      }
    });
  validationFormProd();
};

// Listagens de produtos
async function fetchListProdutos() {
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
    const response = await fetch("/api/listProd", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      Toastify({
        text: result?.message || "Erro ao carregar Produtos.",
        duration: 4000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
      return;
    }

    const produtos = result.produto;
    const produtosListDiv = document.querySelector(".listingProd");
    produtosListDiv.innerHTML = "";

    if (produtos.length > 0) {
      const wrapper = document.createElement("div");
      wrapper.className = "table-responsive";

      const tabela = document.createElement("table");
      tabela.className =
        "table table-sm table-hover table-striped table-bordered tableProd";

      // Cabeçalho
      const cabecalho = tabela.createTHead();
      const linhaCabecalho = cabecalho.insertRow();
      const colunas = [
        "Selecionar",
        "Código",
        "Descrição",
        "Tipo",
        "Unidade",
        "Data da compra",
        "Valor",
        "Preço Líquido",
        "Preço Bruto",
        "Ativo",
      ];

      colunas.forEach((coluna) => {
        const th = document.createElement("th");
        th.textContent = coluna;

        if (["Selecionar", "Código", "Unidade", "Ativo"].includes(coluna)) {
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

      // Corpo
      const corpo = tabela.createTBody();
      produtos.forEach((produto) => {
        const linha = corpo.insertRow();
        linha.setAttribute("data-prodcode", produto.prodcode);

        // Checkbox
        const checkboxCell = linha.insertCell();
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "selectProduto";
        checkbox.value = produto.prodcode;
        checkbox.dataset.produto = JSON.stringify(produto);
        checkbox.className = "form-check-input m-0";
        checkboxCell.classList.add("text-center", "align-middle", "wh-nowrap");
        checkboxCell.appendChild(checkbox);

        // Dados do produto
        const dados = [
          produto.prodcode,
          produto.proddesc,
          produto.prodtipo,
          produto.produnid,
          formatDataPattersBr(produto.proddtuc),
          produto.prodvluc,
          produto.prodpeli,
          produto.prodpebr,
          produto.prodativ,
        ];

        dados.forEach((valor, index) => {
          const td = linha.insertCell();
          td.textContent = valor || "";
          td.classList.add("align-middle", "text-break");

          const coluna = colunas[index + 1]; 
          if (["Código", "Unidade", "Ativo"].includes(coluna)) {
            td.classList.add("text-center", "wh-nowrap", "px-2", "py-1");
          } else {
            td.classList.add("px-3", "py-2");
          }
        });
      });

      wrapper.appendChild(tabela);
      produtosListDiv.appendChild(wrapper);
    } else {
      produtosListDiv.innerHTML =
        "<p class='text-dark'>Nenhum produto cadastrado.</p>";
    }
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    Toastify({
      text: "Erro de conexão com o servidor.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "#f44336",
    }).showToast();
    document.querySelector(".listingProd").innerHTML =
      "<p class='text-dark'>Erro ao carregar produtos.</p>";
  };
};

// pesquisar por produtos
async function searchProduto() {
  const btnProdutoSearch = document.getElementById("searchProd");
  const popUpSearch = document.querySelector(".popUpsearchIdProd");
  const produtoListDiv = document.querySelector(".listingProd");
  const backdrop = document.querySelector(".popupBackDrop");
  const btnOutPageSearch = document.querySelector(".outPageSearchProd");

  if (btnProdutoSearch && popUpSearch) {
    btnProdutoSearch.addEventListener("click", () => {
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
    btnClearFilter.className = "btn btn-secondary w-25 aling align-items: center;";
    btnClearFilter.style.display = "none"; 
    produtoListDiv.parentNode.insertBefore(btnClearFilter, produtoListDiv);

    btnClearFilter.addEventListener("click", () => {
      btnClearFilter.style.display = "none";

      document.getElementById("codeProd").value = "";
      fetchListProdutos();
    });
  };

  const btnSearchProduto = document.querySelector(".submitSearchProd");
  if (btnSearchProduto) {
    btnSearchProduto.addEventListener("click", async () => {
      const codeInput = document.getElementById("codeProd").value.trim();

      if (!codeInput) {
        Toastify({
          text: "Preencha com o codigo para fazer a pesquisa!",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#f44336",
        }).showToast();
        return;
      }

      const params = new URLSearchParams();
      if (codeInput) params.append("prodCode", codeInput);
      try {
        const response = await fetch(`/api/prod/search?${params}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok && data.produto?.length > 0) {
          Toastify({
            text: "O Produto foi encontrado com sucesso!.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#1d5e1d",
          }).showToast();
       
          btnClearFilter.style.display = "inline-block";
        
          renderProdutoTable(data.produto);

          if (popUpSearch) popUpSearch.style.display = "none";
          if (backdrop) backdrop.style.display = "none";
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
          backgroundColor: "red",
        }).showToast();
      }
    });
  };
};

// renderizar tabela
function renderProdutoTable(produtos) {
  const produtosListDiv = document.querySelector(".listingProd");
  produtosListDiv.innerHTML = "";

  if (produtos.length === 0) {
    produtosListDiv.innerHTML =
      "<p class='text-light'>Nenhum produto cadastrado.</p>";
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "table-responsive";

  const tabela = document.createElement("table");
  tabela.className =
    "table table-sm table-hover table-striped table-bordered tableProduto";

  const colunas = [
    "Selecionar",
    "Código",
    "Descrição",
    "Tipo",
    "Unidade",
    "Data da Compra",
    "Valor",
    "Preço Líquido",
    "Preço Bruto",
    "Ativo",
  ];

  // Cabeçalho
  const cabecalho = tabela.createTHead();
  const linhaCabecalho = cabecalho.insertRow();
  colunas.forEach((coluna) => {
    const th = document.createElement("th");
    th.textContent = coluna;

    if (["Selecionar", "Código", "Unidade", "Ativo"].includes(coluna)) {
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

  // Corpo
  const corpo = tabela.createTBody();

  produtos.forEach((produto) => {
    const linha = corpo.insertRow();
    linha.setAttribute("data-prodcode", produto.prodcode);

    // Checkbox
    const checkboxCell = linha.insertCell();
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "selectProduto";
    checkbox.value = produto.prodcode;
    checkbox.dataset.produto = JSON.stringify(produto);
    checkbox.className = "form-check-input m-0";
    checkboxCell.classList.add("text-center", "align-middle", "wh-nowrap");
    checkboxCell.appendChild(checkbox);

    // Dados do produto
    const dados = [
      produto.prodcode,
      produto.proddesc,
      produto.prodtipo,
      produto.produnid,
      formatDataPattersBr(produto.proddtuc),
      produto.prodvluc,
      produto.prodpeli,
      produto.prodpebr,
      produto.prodativ,
    ];

    dados.forEach((valor, index) => {
      const td = linha.insertCell();
      td.textContent = valor || "";
      td.classList.add("align-middle", "text-break");

      const coluna = colunas[index + 1]; // Ignora "Selecionar"
      if (["Código", "Unidade", "Ativo"].includes(coluna)) {
        td.classList.add("text-center", "wh-nowrap", "px-2", "py-1");
      } else {
        td.classList.add("px-3", "py-2");
      }
    });
  });

  wrapper.appendChild(tabela);
  produtosListDiv.appendChild(wrapper);
};

// deletar produto
function deleteProdutoSystem() {
  const btnDeleteProd = document.querySelector(".buttonDeleteProd");
  if(!btnDeleteProd) return
  btnDeleteProd.addEventListener("click", async () => {
    const selectedCheckbox = document.querySelector(
      'input[name="selectProduto"]:checked'
    );
    if (!selectedCheckbox) {
      Toastify({
        text: "Selecione um Produto para excluir",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
      return;
    }

    const produtoSelecionado = JSON.parse(selectedCheckbox.dataset.produto);
    const produtoId = produtoSelecionado.prodcode;
    if(!produtoId) return

    Swal.fire({
    title: `Excluir produto ${produtoSelecionado.proddesc}?`,
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
     const success = await deleteProd(produtoId, selectedCheckbox.closest("tr"));
     if(success){
        Swal.fire({
        title: "Excluído!",
        text: "O produto foi removido com sucesso.",
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
// Delete
  async function deleteProd(id, rowProd) {
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
      const response = await fetch(`/api/deleteprod/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        Toastify({
          text: "O produto foi excluido com sucesso",
          duration: 2000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#1d5e1d",
        }).showToast();

        rowProd.remove();
        return true
      } else {
        console.log("Erro para excluir:", data);
        Toastify({
          text: "Erro na exclusão do produto",
          duration: 2000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#f44336",
        }).showToast();
        return false
      }
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      Toastify({
        text: "Erro ao excluir produto. Tente novamente.",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
      return false
    };
  };

// EDITAR PRODUTO
function editProduto() {
  const editProdButton = document.querySelector(".buttonEditProd");
  if(!editProdButton) return
  editProdButton.addEventListener("click", (event) => {
    loadSelectOptions("/api/codetipoprod", "editProdTipo", "tiprcode");

    const selectedCheckbox = document.querySelector(
      'input[name="selectProduto"]:checked'
    );

    if (!selectedCheckbox) {
      Toastify({
        text: "Selecione um Produto para editar",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
      return;
    }

    const btnMainPageProd = document.querySelector(".btnMainPageProd");
    if (btnMainPageProd) {
      btnMainPageProd.classList.remove("flex");
      btnMainPageProd.classList.add("hidden");
    }

    const listProd = document.querySelector(".listingProd");
    if (listProd) {
      listProd.classList.remove("flex");
      listProd.classList.add("hidden");
    }

    const containerEditForm = document.querySelector(".formEditProd");
    if (containerEditForm) {
      containerEditForm.classList.remove("hidden");
      containerEditForm.classList.add("flex");
    }

    const produtoData = selectedCheckbox.dataset.produto;
    if (!produtoData) {
      console.error("O atributo data-bem está vazio ou indefinido.");
      return;
    }

    try {
      const produtoSelecionado = JSON.parse(produtoData);

      const campos = [
        { id: "editProdCode", valor: produtoSelecionado.prodcode },
        { id: "editProdDesc", valor: produtoSelecionado.proddesc },
        { id: "editProdTipo", valor: produtoSelecionado.prodtipo },
        { id: "editProdUni", valor: produtoSelecionado.produnid },
        { id: "editProdData", valor: produtoSelecionado.proddtuc },
        { id: "editProdValor", valor: produtoSelecionado.prodvluc },
        { id: "editProdPeli", valor: produtoSelecionado.prodpeli },
        { id: "editProdPebr", valor: produtoSelecionado.prodpebr },
        { id: "editProdAtiv", valor: produtoSelecionado.prodativ },
      ];

      campos.forEach(({ id, valor }) => {
        const elemento = document.getElementById(id);
        if (elemento) {
          if (elemento.type === "date" && valor) {
            const dataFormatada = new Date(valor).toISOString().split("T")[0];
            elemento.value = dataFormatada;

            if (id === "editProdTipo") {
              const hiddenInput = document.getElementById("editProdTipoHidden");
              if (hiddenInput) {
                hiddenInput.value = valorFormatado;
              }
            }
          } else {
            elemento.value = valor || "";
          }
        } else {
          console.warn(`Elemento com ID '${id}' não encontrado.`);
        }
      });

      const spaceEditprod = document.querySelector(".formEditProd");
      const btnMainPageProd = document.querySelector(".btnMainPageProd");
      const listingProd = document.querySelector(".listingProd");

      if (spaceEditprod) {
        spaceEditprod.style.display = "flex";
      } else {
        console.error("O formulário de edição não foi encontrado.");
      }

      if (listingProd) {
        listingProd.style.display = "none";
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
// Enviar dados atualizados
  async function editAndUpdateOfProduct() {
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
    const formEditProd = document.querySelector(".editProd");

    formEditProd.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData.entries());

      const selectedCheckbox = document.querySelector(
        'input[name="selectProduto"]:checked'
      );

      if (!selectedCheckbox) {
        console.error("Nenhum checkbox foi selecionado.");
        return;
      }

      const produtoId = selectedCheckbox.dataset.produto;

      if (!produtoId) {
        console.error("O atributo data-bem está vazio ou inválido.");
        return;
      }

      let prodIdParsed;
      try {
        prodIdParsed = JSON.parse(produtoId).prodcode;
      } catch (error) {
        console.error("Erro ao fazer parse de produtoId:", error);
        return;
      }

      const updateProduct = {
        prodcode: document.getElementById("editProdCode").value,
        proddesc: document.getElementById("editProdDesc").value,
        prodtipo: document.getElementById("editProdTipo").value,
        produnid: document.getElementById("editProdUni").value,
        proddtuc: document.getElementById("editProdData").value || null,
        prodvluc: document.getElementById("editProdValor").value,
        prodpeli: document.getElementById("editProdPeli").value,
        prodpebr: document.getElementById("editProdPebr").value,
        prodativ: document.getElementById("editProdAtiv").value,
      };

    
      try {
        const result = await Swal.fire({
        title: `Atualizar o produto ${prodIdParsed}?`,
        text: "Você tem certeza de que deseja atualizar os dados deste produto?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Atualizar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
        confirmButtonColor: "#1d5e1d",
        cancelButtonColor: "#d33"
      });

      if (!result.isConfirmed) return;

        const response = await fetch(`/api/updateprod/${prodIdParsed}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateProduct),
        });

        if (response.ok) {
          Toastify({
            text: `Produto '${prodIdParsed}' Atualizado com sucesso!!`,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#1d5e1d",
          }).showToast();

          formEditProd.reset();
        } else {
          Toastify({
            text: "Erro a atualizar produto",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#f44336",
          }).showToast();
          console.error("Erro ao atualizar produto:", await response.text());
        }
      } catch (error) {
        console.error("Erro no server para atualizar produto:", error);
        Toastify({
            text: "Erro no server para atualizar produto",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#f44336",
          }).showToast();
      }
    });
  }
  editAndUpdateOfProduct();
};
