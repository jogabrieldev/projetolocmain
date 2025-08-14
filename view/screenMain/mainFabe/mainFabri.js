function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expTime = payload.exp * 1000;
    return Date.now() > expTime;
  } catch (error) {
    return true;
  }
}

function addMetrosCubicos() {
  const inputCapa = document.getElementById('fabeCapa');
  if (!inputCapa) return; 

  inputCapa.addEventListener('input', () => {
    let somenteNumero = inputCapa.value.replace(/\D/g, '');
    inputCapa.value = somenteNumero ? `${somenteNumero}m³` : '';
  });

   inputCapa.addEventListener('focus', () => {
    inputCapa.value = inputCapa.value.replace(/m³/, '');
  });
};

function aplicarMetrosCubicosEdicao(valorNumero) {
  const inputEdit = document.getElementById('editFabeCapa');
  if (!inputEdit) return;

  inputEdit.value = valorNumero ? `${valorNumero}m³` : '';

  inputEdit.addEventListener('focus', () => {
    inputEdit.value = inputEdit.value.replace(/m³/, '');
  });

  inputEdit.addEventListener('blur', () => {
    let apenasNumero = inputEdit.value.replace(/\D/g, '');
    inputEdit.value = apenasNumero ? `${apenasNumero}m³` : '';
  });
};

const socketFamilyBens = io();
document.addEventListener("DOMContentLoaded", () => {
  const btnLoadFabe = document.querySelector(".btnCadFabri");
  if (btnLoadFabe) {
    btnLoadFabe.addEventListener("click", async (event) => {
      event.preventDefault();
      try {
        const responseFabe = await fetch("/fabe", {
          method: "GET",
        });

        if (!responseFabe.ok)
          throw new Error(`Erro HTTP: ${responseFabe.status}`);
        const html = await responseFabe.text();
        const mainContent = document.querySelector("#mainContent");
        if (mainContent) {
          mainContent.innerHTML = html;
          interationSystemFamilyBens();
          registerNewFamilyBens();
          addMetrosCubicos();
          searchFamilyGoodsForId();
          deleteFamilyGoods();
          editFamilyGoods();
        } else {
          console.error("#mainContent não encontrado no DOM");
          return;
        }

        const containerAppFabri = document.querySelector(".containerAppFabri");
        if (containerAppFabri) containerAppFabri.classList.add("flex");

        const sectionsToHide = [
          ".containerAppForn",
          ".containerAppProd",
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

        const containerRegisterFabri =
          document.querySelector(".formRegisterFabri");
        const btnMainPageFabri = document.querySelector(".btnMainPageFabri");
        const listingFabri = document.querySelector(".listingFabri");
        const editFormProd = document.querySelector(".editFabri");
        const informative = document.querySelector(".information");

        if (containerRegisterFabri)
          containerRegisterFabri.style.display = "none";
        if (btnMainPageFabri) btnMainPageFabri.style.display = "flex";
        if (listingFabri) listingFabri.style.display = "flex";
        if (editFormProd) editFormProd.style.display = "none";
        if (informative) {
          informative.style.display = "block";
          informative.textContent = "SEÇÃO FAMILIA DE BENS";
        }
      } catch (error) {
        Toastify({
          text: "Erro na pagina",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
        console.error("Erro na pagina");
      }

      await fetchListFabricante();
    });
  }
  socketFamilyBens.on("updateRunTimeFamilyBens", (familyGoods) => {
    fetchListFabricante();
  });

  socketFamilyBens.on("updateRunTimeTableFamilyGoods", (updatedFamimyGoods) => {
    fetchListFabricante();
  });
});

// INTERAÇÃO
function interationSystemFamilyBens() {
  const btnPageRegisterFabri = document.querySelector(".registerFabri");
  if (btnPageRegisterFabri) {
    btnPageRegisterFabri.addEventListener("click", () => {
      const formRegisterFabri = document.querySelector(".formRegisterFabri");
      if (formRegisterFabri) {
        formRegisterFabri.classList.remove("hidden");
        formRegisterFabri.classList.add("flex");
      }

      const btnPageInit = document.querySelector(".btnMainPageFabri");
      if (btnPageInit) {
        btnPageInit.classList.remove("flex");
        btnPageInit.classList.add("hidden");
      }

      const listFabricante = document.querySelector(".listingFabri");
      if (listFabricante) {
        listFabricante.classList.remove("flex");
        listFabricante.classList.add("hidden");
      }
    });
  };

  const buttonOutPageEdit = document.querySelector(".btnOutInitFabriEdit");
  if(buttonOutPageEdit){
    buttonOutPageEdit.addEventListener("click", (event) => {
      event.preventDefault();
    
      const listingFamilyGoods = document.querySelector(".listingFabri");
      if(listingFamilyGoods){
        listingFamilyGoods.classList.remove('hidden')
        listingFamilyGoods.classList.add('flex')
      }
    
      const btnMainPage = document.querySelector(".btnMainPageFabri");
      if(btnMainPage){
        btnMainPage.classList.remove('hidden')
        btnMainPage.classList.add('flex')
      }
      
      const containerEditFamilyGoods = document.querySelector(".editFabri");
      if(containerEditFamilyGoods){
        containerEditFamilyGoods.classList.remove('flex')
        containerEditFamilyGoods.classList.add('hidden')
      }
      
      return;
    });
 };
  const btnOutOfRegister = document.querySelector(".btnOutInitFabri");
  if (btnOutOfRegister) {
    btnOutOfRegister.addEventListener("click", (event) => {
      event.preventDefault();

      const btnPageInit = document.querySelector(".btnMainPageFabri");
      if (btnPageInit) {
        btnPageInit.classList.remove("hidden");
        btnPageInit.classList.add("flex");
      }

      const listFabricante = document.querySelector(".listingFabri");
      if (listFabricante) {
        listFabricante.classList.remove("hidden");
        listFabricante.classList.add("flex");
      }

      const containerFormFabriRegister =
        document.querySelector(".formRegisterFabri");
      if (containerFormFabriRegister) {
        containerFormFabriRegister.classList.remove("flex");
        containerFormFabriRegister.classList.add("hidden");
      }
    });
  };

  const btnExitFamilygoods = document.getElementById("buttonExitFabri");
  if(btnExitFamilygoods){
    btnExitFamilygoods.addEventListener("click", (event) => {
      event.preventDefault();
  
      const containerAppFabri = document.querySelector(".containerAppFabri");
      if(containerAppFabri){
        containerAppFabri.classList.remove('flex')
        containerAppFabri.classList.add('hidden')
          
      }

      const informative = document.querySelector('.information')
            if (informative) {
              informative.style.display = 'block';
              informative.textContent = 'Sessão ativa';
            }
    });
  };
 
  const btnOutInitFabriEdit = document.querySelector(".btnOutInitFabriEdit");
  if(btnOutInitFabriEdit){
    btnOutInitFabriEdit.addEventListener("click", (event) => {
      event.preventDefault();
  
      const btnPageInit = document.querySelector(".btnMainPageFabri");
      if(btnPageInit){
        btnPageInit.classList.remove('hidden')
        btnPageInit.classList.add('flex')
      }
    
      const listFamilyGoods = document.querySelector(".listingFabri");
      if(listFamilyGoods){
        listFamilyGoods.classList.remove("hidden")
        listFamilyGoods.classList.add('flex')
      }
      
      const containerFormFabriRegister = document.querySelector(".editFabri");
      if(containerFormFabriRegister){
        containerFormFabriRegister.classList.remove('flex')
        containerFormFabriRegister.classList.add('hidden')
      }
    });
  };
  
};

// CADASTRAR FAMILIA DE BENS
function registerNewFamilyBens() {

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

      const formData = {
        fabeCode: document.querySelector("#fabeCode").value.trim(), // Código
        fabeDesc: document.querySelector("#fabeDesc").value.trim(), // Descrição
        fabeCate: document.querySelector("#fabeCate").value.trim(), // Categoria
        fabeCapa: document.querySelector("#fabeCapa").value.trim().replace(/\D/g, ''), 
        fabeObs: document.querySelector("#fabeObs").value.trim(), // Observação
        fabeCtct: document.querySelector("#fabeCtct").value.trim(), // Centro de Custo
      };

      try {
        const response = await fetch("/api/fabri/submit", {
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
            backgroundColor: "#1d5e1d",
          }).showToast();

          document.querySelector(".formRegisterFabricante").reset();
        } else {
          Toastify({
            text: result.message || "Erro ao cadastrar familia de bem",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: response.status === 409 ? "orange" : "#f44336",
          }).showToast();
        }
      } catch (error) {
        console.error("Erro ao enviar formulário:", error);
         Toastify({
            text: "Erro ao enviar dados para o server",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#f44336",
          }).showToast();
      }
    });
  validationFormFabric();
};

//Listagem de familia de bens
async function fetchListFabricante() {
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
    const response = await fetch("/api/listfabri", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      Toastify({
        text: result?.message || "Erro ao carregar Família de Bens.",
        duration: 4000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
      return;
    }

    const familyGoods = result;
    const familyGoodsListDiv = document.querySelector(".listingFabri");
    familyGoodsListDiv.innerHTML = "";

    if (familyGoods.length > 0) {
      const wrapper = document.createElement("div");
      wrapper.className = "table-responsive";

      const tabela = document.createElement("table");
      tabela.className = "table table-sm table-hover table-striped table-bordered tableFamilyBens";

      const cabecalho = tabela.createTHead();
      const linhaCabecalho = cabecalho.insertRow();
      const colunas = [
        "Selecionar",
        "Código",
        "Descrição",
        "Categoria",
        "Capacidade",
        "Observação",
        "Centro de custo",
      ];

      colunas.forEach((coluna) => {
        const th = document.createElement("th");
        th.textContent = coluna;

        if (["Selecionar", "Código"].includes(coluna)) {
         th.classList.add("text-center", "px-2", "py-1", "align-middle", "text-break");
        } else {
          th.classList.add("px-3", "py-2", "align-middle");
        }

        linhaCabecalho.appendChild(th);
      });

      const corpo = tabela.createTBody();

      familyGoods.forEach((fabricante) => {
        const linha = corpo.insertRow();
        linha.setAttribute("data-fabecode", fabricante.fabecode);

        // Checkbox
        const checkboxCell = linha.insertCell();
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "selectfamilyGoods";
        checkbox.value = fabricante.fabecode;

        const fabricanteData = JSON.stringify(fabricante);
        if (fabricanteData) {
          checkbox.dataset.familyGoods = fabricanteData;
        }

        checkbox.className = "form-check-input m-0";
        checkboxCell.classList.add("text-center", "align-middle", "wh-nowrap");
        checkboxCell.appendChild(checkbox);

        // Demais dados
        const dados = [
          fabricante.fabecode,
          fabricante.fabedesc,
          fabricante.fabecate,
          fabricante.fabecapa,
          fabricante.fabeobse,
          fabricante.fabectct,
        ];

        dados.forEach((valor, index) => {
          const td = linha.insertCell();
         if (index === 3 && valor) {
            td.textContent = valor + "m³";
           } else {
              td.textContent = valor || "";
          }

          td.classList.add("align-middle", "text-break");

          const coluna = colunas[index + 1];
          if (["Código"].includes(coluna)) {
            td.classList.add("text-center", "px-2", "py-1", "align-middle", "text-break");
          } else {
            td.classList.add("px-3", "py-2");
          }
        });
      });

      wrapper.appendChild(tabela);
      familyGoodsListDiv.appendChild(wrapper);
    } else {
      familyGoodsListDiv.innerHTML = "<p class='text-dark'>Nenhuma familia de bens cadastrado.</p>";
    }
  } catch (error) {
    console.error("Erro ao carregar familia de bens:", error);
     Toastify({
      text: "Erro na comunicação com o servidor para listar familia de bens.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "#f44336",
    }).showToast();
    document.querySelector(".listingFabri").innerHTML =
      "<p class='text-dark'>Erro ao carregar familia de bens.</p>";
  };
};

// buscar family bens
async function searchFamilyGoodsForId() {
    
  const btnFamilySearch = document.getElementById('searchFamilyGoods');
  const popUpSearch = document.querySelector('.popUpsearchIdFamilyGoods');
  const familyGoodsListDiv = document.querySelector(".listingFabri");
  const backdrop = document.querySelector('.popupBackDrop')
  const btnOutPageSearch = document.querySelector('.outPageSearchFamilyGoods')

  if (btnFamilySearch && popUpSearch) {
    btnFamilySearch.addEventListener('click', () => {
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
    familyGoodsListDiv.parentNode.insertBefore(btnClearFilter, familyGoodsListDiv);

    btnClearFilter.addEventListener('click', () => {
     
      btnClearFilter.style.display = 'none';
      
      document.getElementById('codeFamilyBens').value = '';
      fetchListFabricante();
    });
  };

 const btnSearchFamilyGoods = document.querySelector('.submitSearchFamilyGoods');
  if (btnSearchFamilyGoods) {
    btnSearchFamilyGoods.addEventListener('click', async () => {

      const codeInput = document.getElementById('codeFamilyBens').value.trim();

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
      if (codeInput) params.append('fabeCode', codeInput);
      try {
        const response = await fetch(`/api/family/search?${params}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok && data.familyGoods?.length > 0) {
          console.log("Resultados encontrados:", data.produto);
          
          Toastify({
          text: "O tipo de familia de bem foi encontrado com sucesso!.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#1d5e1d",
          }).showToast();
      
          btnClearFilter.style.display = 'inline-block';
          
          renderFamilyGoodsTable(data.familyGoods);

          if (popUpSearch) popUpSearch.style.display = 'none';
          if(backdrop)backdrop.style.display = 'none'

        } else {
          Toastify({
          text: data.message || "Nenhuma familia de bem encontrado nessa pesquisa",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#f44336",
          }).showToast();
        }
      } catch (error) {
        console.error("Erro ao buscar familia de bem:", error);
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

// RENDERIZAR TABELA 
function renderFamilyGoodsTable(familyGoods) {
  const familyGoodsListDiv = document.querySelector(".listingFabri");
  familyGoodsListDiv.innerHTML = "";

  if (familyGoods.length === 0) {
    familyGoodsListDiv.innerHTML = "<p class='text-light'>Nenhum fornecedor cadastrado.</p>";
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "table-responsive";

  const tabela = document.createElement("table");
  tabela.className = "table table-sm table-hover table-striped table-bordered tableFamilyBens";

  const colunas = [
    "Selecionar",
    "Código",
    "Descrição",
    "Categoria",
    "Capacidade",
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

  familyGoods.forEach((fabricante) => {
    const linha = corpo.insertRow();
    linha.setAttribute("data-fabecode", fabricante.fabecode);

    // Checkbox
    const checkboxCell = linha.insertCell();
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "selectfamilyGoods";
    checkbox.value = fabricante.fabecode;
    checkbox.dataset.familyGoods = JSON.stringify(fabricante);
    checkbox.className = "form-check-input m-0";
    checkboxCell.classList.add("text-center", "align-middle", "wh-nowrap");
    checkboxCell.appendChild(checkbox);

    // Dados
    const dados = [
      fabricante.fabecode,
      fabricante.fabedesc,
      fabricante.fabecate,
      fabricante.fabecapa,
      fabricante.fabeobse,
      fabricante.fabectct,
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
  familyGoodsListDiv.appendChild(wrapper);
};

// //deletar FAMILIA DE BEM
function deleteFamilyGoods(){

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
      backgroundColor: "#f44336",
    }).showToast();
    return;
  };

  const fabricanteSelecionado = JSON.parse(selectedCheckbox.dataset.familyGoods);
  const fabricanteId = fabricanteSelecionado.fabecode;

  const confirmacao = confirm(
    `Tem certeza de que deseja excluir a familia de bens com código: ${fabricanteId}?`
  );
  if (!confirmacao) {
    return;
  }

  await deleteFabri(fabricanteId, selectedCheckbox.closest("tr"));
});
//DELETE
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
    if (response.ok) {
      Toastify({
        text: "O Familia de bens excluída com sucesso!",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#1d5e1d",
      }).showToast();

      fabeRow.remove();
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
          text: "Erro na exclusão da familia de bem",
          duration: 2000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#f44336",
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
      backgroundColor: "#f44336",
    }).showToast();
  };
 };
};

// Edição do familia de ben
function editFamilyGoods(){
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
      backgroundColor: "#f44336",
    }).showToast();
    return;
  }

  
  const btnMainPageFamiliGoods = document.querySelector(".btnMainPageFabri");
  if(btnMainPageFamiliGoods){
    btnMainPageFamiliGoods.classList.remove('flex')
    btnMainPageFamiliGoods.classList.add('hidden')
  }

  const listFamilyGoods = document.querySelector(".listingFabri");
  if(listFamilyGoods){
    listFamilyGoods.classList.remove('flex')
    listFamilyGoods.classList.add('hidden')
  }

const containerEditForm = document.querySelector('.editFabri')
   if(containerEditForm){
      containerEditForm.classList.remove('hidden')
      containerEditForm.classList.add('flex')
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
      { id: "editFabeCapa", valor: fabricanteSelecionado.fabecapa },
      { id: "editFabeObs", valor: fabricanteSelecionado.fabeobse },
      { id: "editFabeCtct", valor: fabricanteSelecionado.fabectct },
    ];

    // Atualizar valores no formulário
    campos.forEach(({ id, valor }) => {
      const elemento = document.getElementById(id);
      if (elemento) {
        if(id === "editFabeCapa"){
           elemento.value = (valor || "")? valor + "m³" : ""
        }else{
             elemento.value = valor || "";
        }
       
      } else {
        console.warn(`Elemento com ID '${id}' não encontrado.`);
      }
    });
    function aplicarMascaraMetrosCubicosEdicao() {
  const input = document.getElementById("editFabeCapa");
  if (!input) return;

  input.addEventListener("focus", () => {
    input.value = input.value.replace(/m³/, "");
  });

  input.addEventListener("blur", () => {
    const num = input.value.replace(/\D/g, "");
    input.value = num ? num + "m³" : "";
  });
};

aplicarMascaraMetrosCubicosEdicao();

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
    const valorCapacidadeComUnidade = document.getElementById("editFabeCapa").value;
    const apenasNumeroCapacidade = valorCapacidadeComUnidade.replace(/\D/g, "");

    const updateFabric = {
      fabecode: document.getElementById("editFabeCode").value,
      fabedesc: document.getElementById("editFabeDesc").value,
      fabecate: document.getElementById("editFabeCate").value,
      fabecapa: apenasNumeroCapacidade,
      fabeobse: document.getElementById("editFabeObs").value,
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

      const confirmedEdition = confirm(`Tem certeza de que deseja ATUALIZAR os dados dessa Familia de bem ?`);
        if (!confirmedEdition) return;

      const response = await fetch(`/api/updatefabe/${fabeIdParsed}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
         'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateFabric),
      });

      if (response.ok) {
       
        Toastify({
          text: `Familia'${fabeIdParsed}' Atualizada com sucesso!!`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#1d5e1d",
        }).showToast();

        formEditFabri.reset();
      } else {
        console.error("Erro ao atualizar familia:");
         const errorResponse = await response.json();

          Toastify({
            text: errorResponse.message || "Erro ao atualizar familia de bens.",
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
          text: `Erro no server para atualizar familia de bens`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#f44336",
        }).showToast();
    }
  });
};
  editAndUpdateOfFabric();
};
