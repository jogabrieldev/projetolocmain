
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expTime = payload.exp * 1000;
    return Date.now() > expTime;
  } catch (error) {
    return true;
  }
}

const socketTypeProd  = io()
document.addEventListener('DOMContentLoaded' , ()=>{
       const btnLoadTypeProd = document.querySelector('.btnCadTypeProd')
       if(btnLoadTypeProd){
        btnLoadTypeProd.addEventListener('click' , async (event)=>{
                 event.preventDefault()

                 try {
                  const responseTypeProd = await fetch("/typeprod", {
                    method: "GET",
                  });
          
                  if (!responseTypeProd.ok)
                    throw new Error(`Erro HTTP: ${responseTypeProd.status}`);
                  const html = await responseTypeProd.text();
                  const mainContent = document.querySelector("#mainContent");
                  if (mainContent) {
                    mainContent.innerHTML = html;
                    registerNewTypeProduct();
                    deleteTypeProductSystem();
                    interationSystemTypeProduct();
                    searchTypeProduct();
                    EditTypeProduct();
                  }else{
                    console.error("#mainContent não encontrado no DOM");
                  }
                  const containerAppTypeProd = document.querySelector('.containerAppTipoProd');
                  if (containerAppTypeProd) containerAppTypeProd.classList.add('flex') ;
            
                  const sectionsToHide = [
                    '.containerAppProd', '.containerAppFabri', '.containerAppFabri',
                    '.containerAppDriver', '.containerAppAutomo', '.containerAppBens',
                    '.containerAppForn'
                  ];
                  sectionsToHide.forEach((selector) => {
                    const element = document.querySelector(selector);
                    if (element) element.style.display = 'none';
                  });
            
                  const showContentBens = document.querySelector('.formRegisterTipoProd');
                  const btnMainPageClient = document.querySelector('.btnMainPageTipoProd');
                  const listingClient = document.querySelector('.listingTipoProd');
                  const editFormClient = document.querySelector('.containerRegisterEdit');
                  const informative = document.querySelector('.information');
            
                  if (showContentBens) showContentBens.style.display = 'none';
                  if (btnMainPageClient) btnMainPageClient.style.display = 'flex';
                  if (listingClient) listingClient.style.display = 'flex';
                  if (editFormClient) editFormClient.style.display = 'none';
                  if (informative) {
                    informative.style.display = 'block';
                    informative.textContent = 'SEÇÃO TIPO DE PRODUTO';
                  }
  
                  await fetchListTypeProduct();
                 } catch (error) {
                  Toastify({
                  text: `Erro na pagina`,
                  duration: 3000,
                  close: true,
                  gravity: "top",
                  position: "center",
                  backgroundColor: "red",
                  }).showToast();
               }  
          });
       };
       socketTypeProd.on("updateRunTimeTypeProduto", (tipoProduto) => {
        fetchListTypeProduct();
      });
    
      socketTypeProd.on("updateRunTimeTableTypeProduto", (updatedTypeProduct) => {
        fetchListTypeProduct();
      });
});

//INTERAÇÃO
function interationSystemTypeProduct(){
  
const btnRegisterTp = document.querySelector(".registerTipoProd");
if(btnRegisterTp){
  btnRegisterTp.addEventListener("click", () => {
    const registerTp = document.querySelector(".formRegisterTipoProd");
    if(registerTp){
      registerTp.classList.remove('hidden')
      registerTp.classList.add('flex')
    }
    
    const listingTp = document.querySelector(".listingTipoProd");
    if(listingTp){
      listingTp.classList.remove('flex')
      listingTp.classList.add('hidden')
    }
    
    const btnMainPage = document.querySelector(".btnMainPageTipoProd");
    if(btnMainPage){
       btnMainPage.classList.remove('flex')
       btnMainPage.classList.add('hidden')
    }
  
  });
};

const btnOutInitTp = document.querySelector(".btnOutInitTp");
if(btnOutInitTp){
  btnOutInitTp.addEventListener("click", (e) => {
    e.preventDefault();
  
    const registerTp = document.querySelector(".formRegisterTipoProd");
    if(registerTp){
      registerTp.classList.remove('flex')
      registerTp.classList.add('hidden')
    }
  
    const listingTp = document.querySelector(".listingTipoProd");
    if(listingTp){
       listingTp.classList.remove('hidden')
       listingTp.classList.add('flex')
    }
  
    const btnMainPage = document.querySelector(".btnMainPageTipoProd");
    if(btnMainPage){
      btnMainPage.classList.remove('hidden')
      btnMainPage.classList.add('flex')
    }
    
  });
};

const btnExitSectionTypeProd = document.getElementById("buttonExitTipoProd");
if(btnExitSectionTypeProd){
    
  btnExitSectionTypeProd.addEventListener("click", () => {
    
    const containerAppTypeProd = document.querySelector(".containerAppTipoProd");
    if(containerAppTypeProd){
      containerAppTypeProd.classList.remove('flex')
      containerAppTypeProd.classList.add('hidden')
    }
     
     const informative = document.querySelector('.information')
            if (informative) {
              informative.style.display = 'block';
              informative.textContent = 'Sessão ativa';
            }
  });
  
};

const btnOutInitTpEdit = document.querySelector(".btnOutInitTpEdit");
if(btnOutInitTpEdit){
  btnOutInitTpEdit.addEventListener("click", (e) => {
    e.preventDefault();
  
    const registerTpEdit = document.querySelector(".containerRegisterEdit");
    if(registerTpEdit){
      registerTpEdit.classList.remove('flex')
      registerTpEdit.classList.add('hidden')
    }

  
    const listingTp = document.querySelector(".listingTipoProd");
    if(listingTp){
      listingTp.classList.remove('hidden')
      listingTp.classList.add('flex')
    }
  
    const btnMainPage = document.querySelector(".btnMainPageTipoProd");
    if(btnMainPage){
      btnMainPage.classList.remove('hidden')
      btnMainPage.classList.add('flex')
    }
    
  });
 };
};

// REGISTRAR TIPO DE PRODUTO
function registerNewTypeProduct(){
       
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

    const formData = {
      tpCode: document.querySelector("#tpCode").value.trim(), // Código
      tpDesc: document.querySelector("#tpDesc").value.trim(), // Descrição
      tpCat: document.querySelector("#tpCat").value.trim(), // Categoria
      tpSubCat: document.querySelector("#tpSubCat").value.trim(), // Subcategoria
      tpObs: document.querySelector("#tpObs").value.trim(), // Observação
      tpCtct: document.querySelector("#tpCtct").value.trim(), // Centro de Custo
    }; 

    try {
      const response = await fetch("/api/typeprod/submit",
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
          backgroundColor: "#1d5e1d",
        }).showToast();

        document.querySelector(".formRegisterTipoProdu").reset();

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
          text: "Erro ao cadastrar tipo de produto",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#f44336",
        }).showToast();
      };
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      Toastify({
       text: "Erro no server para cadastrar tipo de produto",
       duration: 3000,
       close: true,
       gravity: "top",
       position: "center",
       backgroundColor: "#f44336",
      }).showToast();
    }
  });
  validationFormTipoProd();
};

// listagem tipo de produto
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
    const tableWrapper = document.querySelector('.listingTipoProd');
    tableWrapper.innerHTML = ""; 

    if (tipoProduto.length > 0) {
      const wrapper = document.createElement("div");
      wrapper.className = "table-responsive";

      const tabela = document.createElement("table");
      tabela.className = "table table-sm table-hover table-striped table-bordered tableTypeProd";

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

        if (["Selecionar", "Código"].includes(coluna)) {
          th.classList.add("text-center", "px-2", "py-1", "align-middle", "wh-nowrap");
        } else {
          th.classList.add("px-3", "py-2", "align-middle");
        }

        linhaCabecalho.appendChild(th);
      });

      const corpo = tabela.createTBody();
      tipoProduto.forEach((typeProd) => {
        const linha = corpo.insertRow();
        linha.setAttribute("data-typecode", typeProd.tiprcode);

        // Checkbox
        const checkboxCell = linha.insertCell();
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "selectTypeProd";
        checkbox.value = typeProd.tiprcode;

        const typeProdData = JSON.stringify(typeProd);
        if (typeProdData) {
          checkbox.dataset.typeProd = typeProdData;
        }

        checkbox.className = "form-check-input m-0";
        checkboxCell.classList.add("text-center", "align-middle", "wh-nowrap");
        checkboxCell.appendChild(checkbox);

        // Demais dados
        const dados = [
          typeProd.tiprcode,
          typeProd.tiprdesc,
          typeProd.tiprcate,
          typeProd.tiprsuca,
          typeProd.tiprobs,
          typeProd.tiprctct,
        ];

        dados.forEach((valor, index) => {
          const td = linha.insertCell();
          td.textContent = valor || "";
          td.classList.add("align-middle", "text-break");

          const coluna = colunas[index + 1];
          if (["Código"].includes(coluna)) {
            td.classList.add("text-center", "wh-nowrap", "px-2", "py-1");
          } else {
            td.classList.add("px-3", "py-2");
          }
        });
      });

      wrapper.appendChild(tabela);
      tableWrapper.appendChild(wrapper);
    } else {
      tableWrapper.innerHTML = "<p class='text-dark'>Nenhum tipo de produto cadastrado.</p>";
    }

  } catch (error) {
    console.error("Erro ao carregar tipos de produto:", error);
    Toastify({
      text: "Erro na comunicação com o servidor para listar os tipos de produto.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "#f44336",
    }).showToast();
    document.querySelector(".listingTipoProd").innerHTML =
    "<p class='text-dark'>Erro ao carregar tipo de produto.</p>";
  };
};

// pesquisar por tipo de produto
async function searchTypeProduct(){
      
  const btnTypeProdSearch = document.getElementById('searchTypeProd');
  const popUpSearch = document.querySelector('.popUpsearchIdTypeProd');
  const typeProdListDiv = document.querySelector(".listingTipoProd");
  const backdrop = document.querySelector('.popupBackDrop')
  const btnOutPageSearch = document.querySelector('.outPageSearchTypeProd')

  if (btnTypeProdSearch && popUpSearch) {
    btnTypeProdSearch.addEventListener('click', () => {
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
    typeProdListDiv.parentNode.insertBefore(btnClearFilter, typeProdListDiv);

    btnClearFilter.addEventListener('click', () => {
     
      btnClearFilter.style.display = 'none';
      
      document.getElementById('codeTypeProduct').value = '';
       fetchListTypeProduct();
    });
  };

 const btnSearchTypeProd = document.querySelector('.submitSearchTypeProduct');
  if (btnSearchTypeProd) {
    btnSearchTypeProd.addEventListener('click', async () => {

      const codeInput = document.getElementById('codeTypeProduct').value.trim();

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
      if (codeInput) params.append('tiprCode', codeInput);
      try {
        const response = await fetch(`/api/typeprod/search?${params}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok && data.typeProduct?.length > 0) {
          console.log("Resultados encontrados:", data.produto);
          
          Toastify({
          text: "O tipo de produto foi encontrado com sucesso!.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#1d5e1d",
          }).showToast();
      
          btnClearFilter.style.display = 'inline-block';
         
          renderTypeProdTable(data.typeProduct);

          if (popUpSearch) popUpSearch.style.display = 'none';
          if(backdrop)backdrop.style.display = 'none'

        } else {
          Toastify({
          text: data.message || "Nenhum tipo encontrado nessa pesquisa",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#f44336",
          }).showToast();
        }
      } catch (error) {
        console.error("Erro ao buscar tipo de produto:", error);
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

function renderTypeProdTable(tipoProduto) {
  const tableWrapper = document.querySelector(".listingTipoProd");
  tableWrapper.innerHTML = ""; 

  if (tipoProduto.length === 0) {
    tableWrapper.innerHTML = "<p class='text-light'>Nenhum tipo de produto cadastrado.</p>";
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "table-responsive";

  const tabela = document.createElement("table");
  tabela.className = "table table-sm table-hover table-striped table-bordered tableTypeProd";

  const colunas = [
    "Selecionar",
    "Código",
    "Descrição",
    "Categoria",
    "Subcategoria",
    "Observação",
    "Centro de custo",
  ];

  // Cabeçalho
  const cabecalho = tabela.createTHead();
  const linhaCabecalho = cabecalho.insertRow();

  colunas.forEach((coluna) => {
    const th = document.createElement("th");
    th.textContent = coluna;

    if (["Selecionar", "Código"].includes(coluna)) {
      th.classList.add("text-center", "px-2", "py-1", "align-middle", "wh-nowrap");
    } else {
      th.classList.add("px-3", "py-2", "align-middle");
    }

    linhaCabecalho.appendChild(th);
  });

  // Corpo
  const corpo = tabela.createTBody();

  tipoProduto.forEach((typeProd) => {
    const linha = corpo.insertRow();
    linha.setAttribute("data-typecode", typeProd.tiprcode);

    // Checkbox
    const checkboxCell = linha.insertCell();
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "selectTypeProd";
    checkbox.value = typeProd.tiprcode;
    checkbox.dataset.typeProd = JSON.stringify(typeProd);
    checkbox.className = "form-check-input m-0";
    checkboxCell.classList.add("text-center", "align-middle", "wh-nowrap");
    checkboxCell.appendChild(checkbox);

    // Dados da linha
    const dados = [
      typeProd.tiprcode,
      typeProd.tiprdesc,
      typeProd.tiprcate,
      typeProd.tiprsuca,
      typeProd.tiprobs,
      typeProd.tiprctct,
    ];

    dados.forEach((valor, index) => {
      const td = linha.insertCell();
      td.textContent = valor || "";
      td.classList.add("align-middle", "text-break");

      const coluna = colunas[index + 1]; // Ignora "Selecionar"
      if (["Código"].includes(coluna)) {
        td.classList.add("text-center", "wh-nowrap", "px-2", "py-1");
      } else {
        td.classList.add("px-3", "py-2");
      }
    });
  });

  wrapper.appendChild(tabela);
  tableWrapper.appendChild(wrapper);
};

//delete tipo do produto
function deleteTypeProductSystem(){

    const btnDeleteTypeProd = document.querySelector(".buttonDeleteTipoProd");
    if(!btnDeleteTypeProd) return
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
      backgroundColor: "#f44336",
    }).showToast();
    return;
  }

  const typeProdutoSelecionado = JSON.parse(selectedCheckbox.dataset.typeProd);
  const typeProdutoId = typeProdutoSelecionado.tiprcode;
   if(!typeProdutoId) return

    Swal.fire({
    title: `Excluir tipo de produto ${typeProdutoSelecionado.tiprdesc}?`,
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
      const success = await deleteTypeProd(typeProdutoId, selectedCheckbox.closest("tr"));
      if(success){
        Swal.fire({
        title: "Excluído!",
        text: "O tipo de produto foi removido com sucesso.",
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
        backgroundColor: "#1d5e1d",
      }).showToast();

      rowProd.remove();
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
        Toastify({
          text: "Erro na exclusão do tipo de produto",
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
    console.error("Erro ao excluir produto:", error);
    Toastify({
      text: "Erro ao excluir tipo do produto. Tente novamente.",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "#f44336",
    }).showToast();
    return false
  };
 };


//EDITAR TIPO DE PRODUTO
 async function EditTypeProduct(){

     const btnEditTp = document.querySelector(".buttonEditTipoProd");
     if(!btnEditTp) return
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
      backgroundColor: "#f44336",
    }).showToast();
    return;
  };
     
  const btnMainPageFamiliGoods = document.querySelector(".btnMainPageTipoProd");
  if(btnMainPageFamiliGoods){
    btnMainPageFamiliGoods.classList.remove('flex')
    btnMainPageFamiliGoods.classList.add('hidden')
  }

  const listFamilyGoods = document.querySelector(".listingTipoProd");
  if(listFamilyGoods){
    listFamilyGoods.classList.remove('flex')
    listFamilyGoods.classList.add('hidden')
  }

    const containerEditForm = document.querySelector('.containerRegisterEdit')
   if(containerEditForm){
      containerEditForm.classList.remove('hidden')
      containerEditForm.classList.add('flex')
   }

  const typeProdutoData = selectedCheckbox.dataset.typeProd;
  if (!typeProdutoData) {
    console.error("O atributo data-bem está vazio ou indefinido.");
    return;
  }

  try {
    const typeProdutoSelecionado = JSON.parse(typeProdutoData);

    const campos = [
      { id: "editTpCode", valor: typeProdutoSelecionado.tiprcode },
      { id: "editTpDesc", valor: typeProdutoSelecionado.tiprdesc },
      { id: "editTpCat", valor: typeProdutoSelecionado.tiprcate },
      { id: "editTpSubCat", valor: typeProdutoSelecionado.tiprsuca },
      { id: "editTpObs", valor: typeProdutoSelecionado.tiprobs },
      { id: "editTpCtct", valor: typeProdutoSelecionado.tiprctct },
    ];

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
  };
 });
 await editAndUpdateOfTypeProduct()
 };

// atualização
async function editAndUpdateOfTypeProduct() {
   const token = localStorage.getItem("token"); 
   if(!token) return 

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

   
    try {
      const result = await Swal.fire({
        title: `Atualizar o tipo de produto ${typeProdIdParsed}?`,
        text: "Você tem certeza de que deseja atualizar os dados deste tipo de produto?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Atualizar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
        confirmButtonColor: "#1d5e1d",
        cancelButtonColor: "#d33"
      });

      if(!result.isConfirmed) return

      const response = await fetch(`/api/updatetypeprod/${typeProdIdParsed}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateTypeProduct),
      });

      if (response.ok) {
    
        Toastify({
          text: `Bem '${typeProdIdParsed}' Atualizado com sucesso!!`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#1d5e1d",
        }).showToast();

        formEditProd.reset();
      } else {
         const errorMessage =  await response.json()

        Toastify({
          text: `${errorMessage}`|| `Erro para atualizar o tipo de produto`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#f44336",
        }).showToast();
      }
    } catch (error) {
      console.error("Erro no server para atualizar tipo de produto:", error);

       Toastify({
          text: "Erro no server para atualizar tipo de produto",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#f44336",
        }).showToast();
    }
  });
};



