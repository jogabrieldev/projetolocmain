
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
                    deleteTypeProduct();
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
                  
                 }
                 
                
          })
       }
       socketTypeProd.on("updateRunTimeTypeProduto", (tipoProduto) => {
        fetchListTypeProduct();
      });
    
      socketTypeProd.on("updateRunTimeTableTypeProduto", (updatedTypeProduct) => {
        fetchListTypeProduct();
      });
})


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

}


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
}


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
  
}

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

 }
};

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

    // Captura os valores do formulário
    const formData = {
      tpCode: document.querySelector("#tpCode").value.trim(), // Código
      tpDesc: document.querySelector("#tpDesc").value.trim(), // Descrição
      tpCat: document.querySelector("#tpCat").value.trim(), // Categoria
      tpSubCat: document.querySelector("#tpSubCat").value.trim(), // Subcategoria
      tpObs: document.querySelector("#tpObs").value.trim(), // Observação
      tpCtct: document.querySelector("#tpCtct").value.trim(), // Centro de Custo
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
          backgroundColor: "red",
        }).showToast();
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      alert("Erro ao enviar os dados.");
    }
  });
  validationFormTipoProd();
}

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
    tableWrapper.innerHTML = ""; // Limpa antes de adicionar a tabela

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
      tableWrapper.innerHTML = "<p class='text-light'>Nenhum tipo de produto cadastrado.</p>";
    }

  } catch (error) {
    console.error("Erro ao carregar tipos de produto:", error);
    document.querySelector(".listingTipoProd").innerHTML =
      "<p>Erro ao carregar tipo de produto.</p>";
  }
}

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
    btnClearFilter.style.display = 'none'; // fica oculto até uma busca ser feita
    typeProdListDiv.parentNode.insertBefore(btnClearFilter, typeProdListDiv);

    btnClearFilter.addEventListener('click', () => {
     
      btnClearFilter.style.display = 'none';
      
      document.getElementById('codeTypeProduct').value = '';
       fetchListTypeProduct();
    });
  }

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
        backgroundColor: "red",
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
          backgroundColor: "green",
          }).showToast();
          // Exibe botão limpar filtro
          btnClearFilter.style.display = 'inline-block';
          // Atualiza a tabela com os bens filtrados
          renderTypeProdTable(data.typeProduct);

          // Fecha o pop-up após a busca (opcional)
          if (popUpSearch) popUpSearch.style.display = 'none';
          if(backdrop)backdrop.style.display = 'none'

        } else {
          Toastify({
          text: data.message || "Nenhum tipo encontrado nessa pesquisa",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
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
          backgroundColor: "red",
          }).showToast();
      }
    });
  };
};

// renderizar tabela 

function renderTypeProdTable(tipoProduto) {
  const tableWrapper = document.querySelector(".listingTipoProd");
  tableWrapper.innerHTML = ""; // Limpa antes de adicionar a nova tabela

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
function deleteTypeProduct(){

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
}

  
function EditTypeProduct(){

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
// //atualização
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

    try {
      const confirmedEdition = confirm(
        `Tem certeza de que deseja ATUALIZAR os dados desse Tipo de produto?`
        );
          if (!confirmedEdition) return;
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
};


