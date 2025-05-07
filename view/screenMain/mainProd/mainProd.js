
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expTime = payload.exp * 1000;
    return Date.now() > expTime;
  } catch (error) {
    return true;
  }
}

function maskFieldProduto(){
  $("#prodValor").mask('R$ 000.000.000,00',{ reverse: true,  } )
   
  $("#prodPeli").mask('R$ 000.000.000,00',{ reverse: true,  } );

  $("#prodPebr").mask('R$ 000.000.000,00', { reverse: true,  });

  $("#editProdValor").mask('R$ 000.000.000,00',{ reverse: true,  } )
 
  $("#editProdPeli").mask('R$ 000.000.000,00',{ reverse: true,  } );

  $("#editProdPebr").mask('R$ 000.000.000,00', { reverse: true,  });
}

const socketProduto = io();
document.addEventListener('DOMContentLoaded' , ()=>{
    
  const btnLoadProd = document.querySelector('.btnCadProd')
  if(btnLoadProd){
      btnLoadProd.addEventListener('click' , async ()=>{

         try {
            const responseProd = await fetch('/produto' , {
              method:'GET'
            })

            if (!responseProd.ok) throw new Error(`Erro HTTP: ${responseProd.status}`);
            const html = await responseProd.text();
            const mainContent = document.querySelector('#mainContent');
            if (mainContent) {
              mainContent.innerHTML = html;
                 maskFieldProduto()
                interationSystemProduto()
                 registerNewProduto()
                 deleteProduto()
                 editProduto()
            }else{
              console.error('#mainContent não encontrado no DOM')
            }

            const containerAppProd = document.querySelector('.containerAppProd');
            if (containerAppProd) containerAppProd.classList.add('flex') ;
      
            const sectionsToHide = [
              '.containerAppForn', '.containerAppFabri', '.containerAppTipoProd',
              '.containerAppDriver', '.containerAppAutomo', '.containerAppBens',
              '.containerAppClient'
            ];
            sectionsToHide.forEach((selector) => {
              const element = document.querySelector(selector);
              if (element) element.style.display = 'none';
            });
      
            const  containerRegisterProd = document.querySelector('.formRegisterProd');
            const btnMainPageProd = document.querySelector('.btnMainPageProd');
            const listingProd = document.querySelector('.listingProd');
            const editFormProd = document.querySelector('.formEditProd');
            const informative = document.querySelector('.information');
      
            if (containerRegisterProd) containerRegisterProd.style.display = 'none';
            if (btnMainPageProd) btnMainPageProd.style.display = 'flex';
            if (listingProd)listingProd.style.display = 'flex';
            if (editFormProd ) editFormProd.style.display = 'none';
            if (informative) {
              informative.style.display = 'block';
              informative.textContent = 'SEÇÃO PRODUTO';
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
            backgroundColor: "green",
          }).showToast();
           console.error("btnLoadProd não encontrado no DOM")
         }
      })
  }

  socketProduto.on("updateRunTimeProduto", (produtos) => {
    insertProductTableRunTime(produtos);
  });

  socketProduto.on("updateRunTimeTableProduto", (updatedProduct) => {
    updateProductInTableRunTime(updatedProduct);
  });
})

function interationSystemProduto(){

 const registerProd = document.querySelector(".registerProd");
 if(registerProd){
   registerProd.addEventListener("click", () => {

    const formRegisterProd = document.querySelector(".formRegisterProd");
    if(formRegisterProd){
       formRegisterProd.classList.remove('hidden')
       formRegisterProd.classList.add('flex')
    }
    const btnMainPageProd = document.querySelector(".btnMainPageProd");
    if(btnMainPageProd){
      btnMainPageProd.classList.remove('flex')
      btnMainPageProd.classList.add('hidden')
    }
    const listingProd = document.querySelector(".listingProd");
    if(listingProd){
       listingProd.classList.remove('flex')
       listingProd.classList.add('hidden')
    }
    
  });
 }
 

const btnExitProd = document.querySelector(".buttonExitProd");
if(btnExitProd){
  btnExitProd.addEventListener("click", () => {

    const containerAppProd = document.querySelector(".containerAppProd");
    if(containerAppProd){
      containerAppProd.classList.remove('flex')
      containerAppProd.classList.add('hidden')
    }

    const informative = document.querySelector('.information')
            if (informative) {
              informative.style.display = 'block';
              informative.textContent = 'Sessão ativa';
            }
   
  });
}


const btnOutInitProd = document.querySelector(".btnOutInitProd");

if(btnOutInitProd){
  btnOutInitProd.addEventListener("click", (event) => {
    event.preventDefault();

    const btnMainPageProd = document.querySelector(".btnMainPageProd");
    if(btnMainPageProd){
       btnMainPageProd.classList.remove('hidden')
       btnMainPageProd.classList.add('flex')
    }

    const listingProd = document.querySelector(".listingProd");
    if(listingProd){
       listingProd.classList.remove('hidden')
       listingProd.classList.add('flex')
    }

    const containerFormProd = document.querySelector(".formRegisterProd");
    if(containerFormProd){
      containerFormProd.classList.remove('flex')
      containerFormProd.classList.add('hidden')
    }
  });
}

const btnOutEditForm = document.querySelector(".btnOutInitProdEdit");
if(btnOutEditForm){
  btnOutEditForm.addEventListener("click", (event) => {
    event.preventDefault();
  
    const btnMainPageProd = document.querySelector(".btnMainPageProd");
    if(btnMainPageProd){
       btnMainPageProd.classList.remove('hidden')
       btnMainPageProd.classList.add('flex')
    }
    
    const listingProd = document.querySelector(".listingProd");
    if(listingProd){
       listingProd.classList.remove('hidden')
       listingProd.classList.add('flex')
    }
    
  
    const containerFormEditProd = document.querySelector(".formEditProd");
    if(containerFormEditProd){
      containerFormEditProd.classList.remove('flex')
      containerFormEditProd.classList.add('hidden')
    }
   
  });
  };
}

function registerNewProduto(){

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
        prodCode: document.querySelector("#prodCode").value, // Código
        prodDesc: document.querySelector("#prodDesc").value, // Descrição
        prodTipo: document.querySelector("#prodTipo").value, // Tipo de Produto
        prodUni: document.querySelector("#prodUni").value, // Unidade
        prodData: document.querySelector("#prodData").value, // Data
        prodValor: document.querySelector("#prodValor").value, // Valor de Compra
        prodPeli: document.querySelector("#prodPeli").value, // Preço Líquido
        prodPebr: document.querySelector("#prodPebr").value, // Preço Bruto
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
    
      //  Converte “YYYY-MM-DD” para Date local e zera horas
      const [y, m, d] = formData.prodData.split('-').map(Number);
      const dtCd       = new Date(y, m - 1, d);
      const hoje       = new Date();
      const hoje0      = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    
      //  Regra: não pode ser futura
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
        const response = await fetch("http://localhost:3000/api/prod/submit", {
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
            backgroundColor: "green",
          }).showToast();

          // Limpar o formulário após o sucesso
          document.querySelector(".formRegisterProduto").reset();

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
            text: `Erro ao cadastrar produto`,
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
  validationFormProd();
}
  
async function loadSelectOptions(url, selectId, fieldName) {
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
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();

    const data = Array.isArray(result) ? result : result.data;

    if (!Array.isArray(data)) {
      throw new Error(
        `Formato de dados inesperado de ${url}: ` + JSON.stringify(result)
      );
    }

    const select = document.getElementById(selectId);
    if (!select) {
      throw new Error(`Elemento select com ID '${selectId}' não encontrado.`);
    }

    data.forEach((item) => {
      // Debug
      if (!item.hasOwnProperty(fieldName)) {
        console.warn(`Campo '${fieldName}' não encontrado em`, item);
        return;
      }

      const option = document.createElement("option");
      option.value = item[fieldName];
      option.textContent = item[fieldName];
      select.appendChild(option);
    });
  } catch (error) {
    console.error(`Erro ao carregar os dados para ${selectId}:`, error);
  }
}

//inserção em runtime in table 
function insertProductTableRunTime(produtos) {
  const produtosListDiv = document.querySelector(".listingProd");
  produtosListDiv.innerHTML = "";

  if (produtos.length > 0) {
    const tabela = document.createElement("table");
    tabela.classList.add('tableProd')
   
    // Cabeçalho
    const cabecalho = tabela.createTHead();
    const linhaCabecalho = cabecalho.insertRow();
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

    colunas.forEach((coluna) => {
      const th = document.createElement("th");
      th.textContent = coluna;
      linhaCabecalho.appendChild(th);
    });

    // Corpo da tabela
    const corpo = tabela.createTBody();
    produtos.forEach((produto) => {
      const linha = corpo.insertRow();
      linha.setAttribute("data-prodcode", produto.prodCode);

      const checkboxCell = linha.insertCell();
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "selectProduto";
      checkbox.value = produto.prodCode;
      checkbox.dataset.produto = JSON.stringify(produto);
      checkboxCell.appendChild(checkbox);

      
      linha.insertCell().textContent = produto.prodcode;
      linha.insertCell().textContent = produto.proddesc;
      linha.insertCell().textContent = produto.prodtipo;
      linha.insertCell().textContent = produto.produnid;
      linha.insertCell().textContent = formatDate(produto.proddtuc);
      linha.insertCell().textContent = produto.prodvluc;
      linha.insertCell().textContent = produto.prodpeli;
      linha.insertCell().textContent = produto.prodpebr;
      linha.insertCell().textContent = produto.prodativ === "S" ? "Sim" : "Não";
    });
    produtosListDiv.appendChild(tabela);
  } else {
    produtosListDiv.innerHTML = "<p>Nenhum produto cadastrado.</p>";
  }
}

// listagem de produtos
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const produtos = await response.json();

    const produtosListDiv = document.querySelector(".listingProd");
    produtosListDiv.innerHTML = "";

    if (produtos.length > 0) {
      const tabela = document.createElement("table");
      tabela.classList.add('tableProd')

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
        "Preço Liguido",
        "Preço Bruto",
        "Ativo",
      ];

      colunas.forEach((coluna) => {
        const th = document.createElement("th");
        th.textContent = coluna;
        linhaCabecalho.appendChild(th);
      });

      const corpo = tabela.createTBody();
      produtos.forEach((produto) => {
        const linha = corpo.insertRow();
        linha.setAttribute("data-prodcode", produto.prodcode);

        const checkboxCell = linha.insertCell();
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "selectProduto";
        checkbox.value = produto.prodCode;

        checkbox.dataset.produto = JSON.stringify(produto);
        checkboxCell.appendChild(checkbox);

        

        linha.insertCell().textContent = produto.prodcode;
        linha.insertCell().textContent = produto.proddesc;
        linha.insertCell().textContent = produto.prodtipo;
        linha.insertCell().textContent = produto.produnid;
        linha.insertCell().textContent = formatDate(produto.proddtuc);
        linha.insertCell().textContent = produto.prodvluc;
        linha.insertCell().textContent = produto.prodpeli;
        linha.insertCell().textContent = produto.prodpebr;
        linha.insertCell().textContent =
          produto.prodativ === "S" ? "Sim" : "Não";
      });

      produtosListDiv.appendChild(tabela);
    } else {
      produtosListDiv.innerHTML = "<p>Nenhum produto cadastrado.</p>";
    }
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    document.querySelector(".listingProd").innerHTML =
      "<p>Erro ao carregar produtos.</p>";
  }
}

// deletar produto

function deleteProduto(){

  const btnDeleteProd = document.querySelector(".buttonDeleteProd");
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
      backgroundColor: "red",
    }).showToast();
    return;
  }

  const produtoSelecionado = JSON.parse(selectedCheckbox.dataset.produto);
  const produtoId = produtoSelecionado.prodcode;

  const confirmacao = confirm(
    `Tem certeza de que deseja excluir o produto com código ${produtoId}?`
  );
  if (!confirmacao) {
    return;
  }

  await deleteProd(produtoId, selectedCheckbox.closest("tr"));
});

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
        backgroundColor: "green",
      }).showToast();

      rowProd.remove();
    } else {
      console.log("Erro para excluir:", data);
      Toastify({
        text: "Erro na exclusão do produto",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
    }
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    Toastify({
      text: "Erro ao excluir produto. Tente novamente.",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
  }
 }
}
// EDITAR PRODUTO

function editProduto(){

  const editProdButton = document.querySelector(".buttonEditProd");
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
      backgroundColor: "red",
    }).showToast();
    return;
  }

  const btnMainPageProd = document.querySelector(".btnMainPageProd");
  if(btnMainPageProd ){
    btnMainPageProd.classList.remove('flex')
    btnMainPageProd .classList.add('hidden')
  }

  const listProd = document.querySelector(".listingProd");
  if(listProd){
    listProd.classList.remove('flex')
    listProd.classList.add('hidden')
  }

const containerEditForm = document.querySelector('.formEditProd')
   if(containerEditForm){
      containerEditForm.classList.remove('hidden')
      containerEditForm.classList.add('flex')
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

async function editAndUpdateOfProduct() {
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
      console.error("Erro ao fazer parse de bemId:", error);
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
          backgroundColor: "green",
        }).showToast();

        formEditProd.reset();
      } else {
        Toastify({
          text: `Produto '${prodIdParsed}' Atualizado com sucesso!!`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();
        formEditProd.reset();
        console.error("Erro ao atualizar produto:", await response.text());
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  });
}
 editAndUpdateOfProduct();
}

//atualizar em run time A EDIÇÃO
function updateProductInTableRunTime(updatedProduct) {
  const row = document.querySelector(
    `[data-prodcode="${updatedProduct.prodcode}"]`
  );

  if (row) {
    // Atualiza as células da linha com as novas informações do produto
    row.cells[2].textContent = updatedProduct.proddesc || "-"; // Descrição
    row.cells[3].textContent = updatedProduct.prodtipo || "-"; // Tipo
    row.cells[4].textContent = updatedProduct.produnid || "-"; // Unidade
    row.cells[5].textContent = formatDate(updatedProduct.proddtuc) || "-"; // Data da compra
    row.cells[6].textContent = updatedProduct.prodvluc || "-"; // Valor
    row.cells[7].textContent = updatedProduct.prodpeli || "-"; // Preço Líquido
    row.cells[8].textContent = updatedProduct.prodpebr || "-"; // Preço Bruto
    row.cells[9].textContent = updatedProduct.prodativ === "S" ? "Sim" : "Não"; // Ativo
  }
}
