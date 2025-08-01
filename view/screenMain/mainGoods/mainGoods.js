
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expTime = payload.exp * 1000;
    return Date.now() > expTime;
  } catch (error) {
    return true;
  }
}
function aplicarMascaras() {
  $("#valorCpEdit").mask('R$ 000.000.000,00', { reverse: true });
  $("#valorAlugEdit").mask('R$ 000.000.000,00', { reverse: true });
  $("#valorCpMain").mask('R$ 000.000.000,00', { reverse: true });
  $("#valorAlugMain").mask('R$ 000.000.000,00', { reverse: true });
}


const formatDate = (isoDate) => {
  if (!isoDate) return "";
  const dateObj = new Date(isoDate);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

function dateAtualInFieldAndHours(date , hours){

  const dtCadInput = document.getElementById(date);
  const hrCadInput = document.getElementById(hours); 

  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

   dtCadInput.value = `${ano}-${mes}-${dia}`;
  
   const horas = String(hoje.getHours()).padStart(2, "0");
   const minutos = String(hoje.getMinutes()).padStart(2, "0");
   hrCadInput.value = `${horas}:${minutos}`;
 
}


const  socketUpdateBens = io()
document.addEventListener("DOMContentLoaded", () => {

  const btnLoadBens = document.querySelector('.btnLoadBens');
  if (btnLoadBens) {
    btnLoadBens.addEventListener('click', async (event) => {
      event.preventDefault();
 
      try {
        const response = await fetch('/bens' , {
          method: 'GET'
        });
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const html = await response.text();
        const mainContent = document.querySelector('#mainContent');
        if (mainContent) {
          mainContent.innerHTML = html;

          interationSystemGoods()
          aplicarMascaras()
          searchGoodsForId()
          registerGoodsSystem()
          dateAtualInFieldAndHours("dtStatus" , "hrStatus")
          deleteGoodsSystem()
          updateGoodsSystem()
          valueFieldName('cofa')
        } else {
          console.error('#mainContent não encontrado no DOM');
          return;
        }

          
        const containerAppBens = document.querySelector('#containerAppBens');
        if (containerAppBens) containerAppBens.classList.add('flex') ;
  
        const sectionsToHide = [
          '.containerAppProd', '.containerAppFabri', '.containerAppTipoProd',
          '.containerAppDriver', '.containerAppAutomo', '.containerAppClient',
          '.containerAppForn'
        ];
        sectionsToHide.forEach((selector) => {
          const element = document.querySelector(selector);
          if (element) element.style.display = 'none';
        });
  
        const showContentBens = document.querySelector('.showContentBens');
        const btnPageListGoods = document.querySelector('#btnPageListGoods');
        const listingBens = document.querySelector('#listingBens');
        const editForm = document.querySelector('.editForm');
        const informative = document.querySelector('.information');
  
        if (showContentBens) showContentBens.style.display = 'none';
        if (btnPageListGoods) btnPageListGoods.style.display = 'flex';
        if (listingBens) listingBens.style.display = 'flex';
        if (editForm) editForm.style.display = 'none';
        if (informative) {
          informative.style.display = 'block';
          informative.textContent = 'SESSÃO BENS';
        }
        
       
        await fetchBens();
        await loadSelectOptions("/api/codefamilyben", "cofa", "fabecode", "fabedesc");
        await loadSelectOptions("/api/codeforn", "cofo", "forncode", "fornnome");
      } catch (err) {
        Toastify({
          text: "Erro na pagina",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "Red",
        }).showToast();
        console.error('Erro ao carregar bens:', err);
      }
    });
  } else {
    console.warn('#btnLoadBens não encontrado no DOM');
  }
 
  socketUpdateBens.on("updateRunTimeGoods", (bens) => {
    fetchBens();
  });

  socketUpdateBens.on("updateGoodsTable", (updatedBem) => {
     fetchBens()
  });
});

// INTREÇÃO 
function interationSystemGoods(){

  const buttonRegisterGoods = document.querySelector("#registerGoods");
  if (buttonRegisterGoods) {
    buttonRegisterGoods.addEventListener("click", () => {

      const btnMainPage = document.querySelector("#btnPageListGoods");
      if (btnMainPage) {
        btnMainPage.classList.remove("flex");
        btnMainPage.classList.add("hidden");
      }
      const listBens = document.querySelector("#listingBens");

      if (listBens){
        listBens.classList.remove('flex')
        listBens.classList.add('hidden')
     };
      const ContentBens = document.querySelector(".showContentBens");
      if (ContentBens) {
        ContentBens.classList.remove('hidden')
        ContentBens.classList.add('flex')
     }

      
    });
  }

  const buttonExit = document.querySelector("#buttonExit");
    
     if(buttonExit){
      buttonExit.addEventListener("click", () => {
  
        const containerAppBens = document.querySelector("#containerAppBens");
        if(containerAppBens){
          containerAppBens.classList.remove('flex')
          containerAppBens.classList.add('hidden')
        }
        const information = document.querySelector('.information')
        if(information){
          information.textContent = 'Sessão ativa'
        }
         
    });
 };

 
  const btnOutPageEdit = document.querySelector(".btnOutPageEdit");

    if(btnOutPageEdit){
      btnOutPageEdit.addEventListener("click", (e) => {
        e.preventDefault();
    
      
          const pageEditForm = document.querySelector(".editForm");
          if(pageEditForm){
            pageEditForm.classList.remove('flex')
            pageEditForm.classList.add('hidden')
          }
          
        
          const listingBens = document.querySelector("#listingBens");
          if(listingBens){
            listingBens.classList.remove('hidden');
            listingBens.classList.add('flex')
          }
        
        
          const btnPageListGoods = document.querySelector("#btnPageListGoods");
          btnPageListGoods.classList.remove('hidden')
          btnPageListGoods.classList.add('flex')
        
      
        return;
      });
    }
 
  
  const buttonOutGoods = document.querySelector("#btnOut");

if (buttonOutGoods) {
  buttonOutGoods.addEventListener("click", (event) => {
    event.preventDefault();

    const ContentBens = document.querySelector(".showContentBens");
    if (ContentBens) {
      ContentBens.classList.remove('flex')
      ContentBens.classList.add('hidden')
   }

    const listingBens = document.querySelector("#listingBens");
    if (listingBens) {
      listingBens.classList.remove("hidden");
      listingBens.classList.add("flex");
    }

    const btnPageListGoods = document.querySelector("#btnPageListGoods");
    if (btnPageListGoods) {
      btnPageListGoods.classList.remove("hidden");
      btnPageListGoods.classList.add("flex");
    }
  });
}

  
  const buttonSubmitRegisterGoods = document.querySelector("#btnNext");
  buttonSubmitRegisterGoods.addEventListener("click", (event) => {
    event.preventDefault();
  });
}
 

 function valueFieldName(id) {
  const select = document.getElementById(id);

  if (!select) {
    console.error(`Elemento com id "${id}" não encontrado no DOM.`);
    return;
  }

  select.addEventListener('change', function() {
    const selectedOption = this.selectedOptions && this.selectedOptions[0];
    if (selectedOption) {
      const desc = selectedOption.dataset.desc;
      if (desc) {
        document.querySelector('#name').value = desc;
      }
    }
  });
}
 
// registrar o bem
 async function registerGoodsSystem(){

  dateAtualInFieldAndHours("dtStatus" , "hrStatus")
  const btnNext = document.querySelector("#btnNext");
  if (!btnNext) {
    console.warn("Botão .btnNext não encontrado no DOM ao tentar registrar o listener.");
    return;
  }

  btnNext.addEventListener("click", async (event) => {
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
      setTimeout(() => window.location.href = "/index.html", 2000);
      return;
    }

    if (!$("#formRegisterBens").valid()) {
      return;
    }

    const formData = {
      code: document.querySelector("#code").value.trim(),
      name: document.querySelector("#name").value.trim(),
      cofa: document.querySelector("#cofa").value.trim(),
      model: document.querySelector("#model").value.trim(),
      serial: document.querySelector("#serial").value.trim(),
      bensAnmo: document.querySelector("#bensAnmo").value.trim(),
      dtCompra: document.querySelector("#dtCompra").value.trim(),
      valorCp: document.querySelector("#valorCpMain").value.trim(),
      ntFiscal: document.querySelector("#ntFiscal").value.trim(),
      cofo: document.querySelector("#cofo").value.trim(),
      status: document.querySelector("#status").value.trim(),
      dtStatus: document.querySelector('#dtStatus').value,
      hrStatus: document.querySelector("#hrStatus").value,
      cor: document.querySelector("#cor").value.trim(),
      bensAtiv: document.querySelector("#bensAtiv").value.trim(),
      alug: document.querySelector("#alug").value.trim(),
      valorAlug: document.querySelector("#valorAlugMain").value.trim(),
      fabri: document.querySelector("#fabri").value.trim(),
    };


    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${currentHours}:${currentMinutes}`;

    if (!isDataValida(formData.dtCompra)) {
      Toastify({
        text: "Data de Compra inválida coloque uma data valida",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
      return;
    }
    
   const datas = [
  { key: 'dtCompra', label: 'Data de Compra' },
  { key: 'dtStatus', label: 'Data de Status' },
  { key: 'bensAnmo', label: 'Data do Modelo' }
];

const hoje = new Date();
const hojeDate = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

for (const { key, label } of datas) {
  const str = formData[key];

  if (!isDataValida(str)) {
    Toastify({
      text: `${label} inválida. Adicione uma data válida.`,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return;
  }

  // Converter para data sem horário
  const [ano, mes, dia] = str.split('-').map(Number);
  const dataCampo = new Date(ano, mes - 1, dia);

  if (key === 'dtStatus') {
    if (dataCampo.getTime() !== hojeDate.getTime()) {
      Toastify({
        text: "Data de Status deve ser igual à data de hoje.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "orange"
      }).showToast();
      return;
    }
  }

  if (key === 'dtCompra') {
    if (dataCampo.getTime() > hojeDate.getTime()) {
      Toastify({
        text: "A data da compra deve ser menor ou igual à data de hoje.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "orange"
      }).showToast();
      return;
    }
  }

  if (key === 'bensAnmo') {
    const [aC, mC, dC] = formData.dtCompra.split('-').map(Number);
    const dataCompra = new Date(aC, mC - 1, dC);

    if (dataCampo.getTime() > dataCompra.getTime()) {
      Toastify({
        text: "A data do modelo não pode ser maior que a data da compra.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "orange"
      }).showToast();
      return;
    }
  }

    }
    const cleanedData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== "")
    );

    try {
      const response = await fetch("/api/bens/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanedData),
      });

      const result = await response.json();

      if (response.ok || response.status === 200) {
        Toastify({
          text: "Bem cadastrado com sucesso!",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();

        document.querySelector("#formRegisterBens").reset();
        dateAtualInFieldAndHours("dtStatus" , "hrStatus")
      }else {
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
              backgroundColor: "red",
            }).showToast();
          }else {
      // 👇 caso seja outro tipo de erro
         Toastify({
          text: result?.message || "Erro ao cadastrar fornecedor.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: response.status === 409 ? "orange" : "red",
          }).showToast();
       }
    }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      Toastify({
          text: "Erro ao enviar os dados.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
      
    }
  });
  validationFormGoods()
 };
 
//LISTAGEM DOS BENS
async function fetchBens() {
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
    const response = await fetch("/api/listbens", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      Toastify({
        text: result?.message || "Erro ao carregar Bens.",
        duration: 4000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
      return;
    }
  
    const bens = result.bens;
    const bensListDiv = document.querySelector("#listingBens");
    bensListDiv.innerHTML = "";

    if (bens.length > 0) {
      const wrapper = document.createElement("div");
      wrapper.className = "table-responsive";

      const tabela = document.createElement("table");
      tabela.className = "table table-sm table-hover table-striped table-bordered tableBens";
       
      // "Ctep"
      const cabecalho = tabela.createTHead();
      const linhaCabecalho = cabecalho.insertRow();
      const colunas = [
        "Selecionar", "Código", "Nome do Bem", "Familia do Bem", "Status", "Número de Série",
         "Ano do Modelo", "Data da compra", "valor de Compra", "Nota Fiscal",
        "Código Fornecedor", "Modelo", "Data do Status",
        "Hora Status",  "Cor", "Ativo",
        "Alugado", "Valor Alugado", "Fabricante"
      ];

      colunas.forEach((coluna) => {
        const th = document.createElement("th");
        th.textContent = coluna;

        if (["Selecionar", "Código", "Status", "Ativo", "Alugado", "Ano do Modelo", "Hora Status"].includes(coluna)) {
          th.classList.add("text-center", "px-2", "py-1", "align-middle", "wh-nowrap");
        } else {
          th.classList.add("px-3", "py-2", "align-middle");
        }

        linhaCabecalho.appendChild(th);
      });

      const corpo = tabela.createTBody();

      bens.forEach((bem) => {
        const linha = corpo.insertRow();
        linha.setAttribute("data-benscode", bem.benscode);

        const checkboxCell = linha.insertCell();
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "selectBem";
        checkbox.value = bem.benscode;

        const bemData = JSON.stringify(bem);
        if (bemData) checkbox.dataset.bem = bemData;

        checkbox.className = "form-check-input m-0";
        checkboxCell.classList.add("text-center", "align-middle", "wh-nowrap");
        checkboxCell.appendChild(checkbox);

        const dados = [
          bem.benscode,
          bem.bensnome,
          bem.benscofa,
          bem.bensstat,
          bem.bensnuse,
          formatDate(bem.bensanmo),
          formatDate(bem.bensdtcp),
          bem.bensvacp,
          bem.bensnunf,
          bem.benscofo,
          bem.bensmode,
          formatDate(bem.bensdtus),
          bem.benshrus,
          bem.benscore,
          bem.bensativ,
          bem.bensalug,
          bem.bensvaal,
          bem.bensfabr,
        ];

        dados.forEach((valor, index) => {
          const td = linha.insertCell();
          td.textContent = valor || "";
          td.classList.add("align-middle", "text-break");

          const coluna = colunas[index + 1];
          if (["Código", "Status", "Ativo", "Alugado", "Ano do Modelo", "Hora Status"].includes(coluna)) {
            td.classList.add("text-center", "wh-nowrap", "px-2", "py-1");
          } else {
            td.classList.add("px-3", "py-2" , "text-break");
          }

          if (coluna === "Status") {
            td.classList.add("status-bem");
          }
        });
      });

      wrapper.appendChild(tabela);
      bensListDiv.appendChild(wrapper);
    } else {
      bensListDiv.innerHTML = "<p class='text-light'>Nenhum bem cadastrado.</p>";
    }

  } catch (error) {
    console.error("Erro na requisição:", error);
    Toastify({
      text: "Erro na comunicação com o servidor.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
  }
}

// BUSCAR POR CAÇAMBA
async function searchGoodsForId() {

  const btnForSearch = document.getElementById('searchGoods');
  const popUpSearch = document.querySelector('.searchIdGoods');
  const bensListDiv = document.querySelector("#listingBens");
  const backdrop = document.querySelector('.popupBackDrop');
  const btnOutPageSearch = document.querySelector('.outPageSearchGoods')

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

  // Cria o botão limpar filtro e adiciona antes da lista, se não existir
  let btnClearFilter = document.getElementById('btnClearFilter');
  if (!btnClearFilter) {
    btnClearFilter = document.createElement('button');
    btnClearFilter.id = 'btnClearFilter';
    btnClearFilter.textContent = 'Limpar filtro';
    btnClearFilter.className = 'btn btn-secondary w-25 aling align-items: center;';
    btnClearFilter.style.display = 'none'; // fica oculto até uma busca ser feita
    bensListDiv.parentNode.insertBefore(btnClearFilter, bensListDiv);

    btnClearFilter.addEventListener('click', () => {
     
      btnClearFilter.style.display = 'none';
      
      document.getElementById('codeBem').value = '';
      document.getElementById('statusInBem').value = '';
    
      fetchBens();
    });
  }

  const btnSearchGoods = document.querySelector('.submitSearchGoods');
  if (btnSearchGoods) {
    btnSearchGoods.addEventListener('click', async () => {

      const codeInput = document.getElementById('codeBem').value.trim();
      const status = document.getElementById('statusInBem').value.trim();

      const fieldFilled = [codeInput , status].filter((valor)=> valor !== "")

       if (fieldFilled.length === 0) {
       Toastify({
        text: "Preencha pelo menos um campo para buscar!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
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
      if (codeInput) params.append('benscode', codeInput);
      if (status) params.append('status', status);

      try {
        const response = await fetch(`/api/codebens/search?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok && data.bens?.length > 0) {
          
          Toastify({
          text: "O Bem foi encontrado com sucesso!.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
          }).showToast();
          // Exibe botão limpar filtro
          btnClearFilter.style.display = 'inline-block';
          // Atualiza a tabela com os bens filtrados
          renderBensTable(data.bens);

          // Fecha o pop-up após a busca (opcional)
          if (popUpSearch) popUpSearch.style.display = 'none';
          if(backdrop)backdrop.style.display = 'none'

        } else {
          Toastify({
          text: data.message || "Nenhum Bem encontrado nessa pesquisa",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
          }).showToast();
        }
      } catch (error) {
        console.error("Erro ao buscar bens:", error);
        Toastify({
          text: "Erro a buscar caçamba tente novamente",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
          }).showToast();
      }
    });
  }
}

// Função que cria a tabela com os bens,
function renderBensTable(bens) {
  const bensListDiv = document.querySelector("#listingBens");
  bensListDiv.innerHTML = ""; // limpa conteúdo atual

  if (bens.length === 0) {
    bensListDiv.innerHTML = "<p class='text-light'>Nenhum bem encontrado.</p>";
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "table-responsive";

  const tabela = document.createElement("table");
  tabela.className = "table table-sm table-hover table-striped table-bordered tableBens";

  // Cabeçalho
  const cabecalho = tabela.createTHead();
  const linhaCabecalho = cabecalho.insertRow();
  const colunas = [
    "Selecionar", "Código", "Nome do Bem", "Familia do Bem", "Status", "Número de Série",
    "Ano do Modelo", "Data da compra", "valor de Compra", "Nota Fiscal",
    "Código Fornecedor", "Modelo", "Data do Status",
    "Hora Status",  "Cor", "Ativo",
    "Alugado", "Valor Alugado", "Fabricante"
  ];

  colunas.forEach((coluna) => {
    const th = document.createElement("th");
    th.textContent = coluna;
    if (["Selecionar", "Código", "Status", "Ativo", "Alugado", "Ano do Modelo", "Hora Status"].includes(coluna)) {
      th.classList.add("text-center", "px-2", "py-1", "align-middle", "wh-nowrap");
    } else {
      th.classList.add("px-3", "py-2", "align-middle");
    }
    linhaCabecalho.appendChild(th);
  });

  const corpo = tabela.createTBody();

  bens.forEach((bem) => {
    const linha = corpo.insertRow();
    linha.setAttribute("data-benscode", bem.benscode);

    const checkboxCell = linha.insertCell();
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "selectBem";
    checkbox.value = bem.benscode;

    const bemData = JSON.stringify(bem);
    if (bemData) checkbox.dataset.bem = bemData;

    checkbox.className = "form-check-input m-0";
    checkboxCell.classList.add("text-center", "align-middle", "wh-nowrap");
    checkboxCell.appendChild(checkbox);

    const dados = [
      bem.benscode,
      bem.bensnome,
      bem.benscofa,
      bem.bensstat,
      bem.bensnuse,
      formatDate(bem.bensanmo),
      formatDate(bem.bensdtcp),
      bem.bensvacp,
      bem.bensnunf,
      bem.benscofo,
      bem.bensmode,
      formatDate(bem.bensdtus),
      bem.benshrus,
      bem.benscore,
      bem.bensativ,
      bem.bensalug,
      bem.bensvaal,
      bem.bensfabr,
    ];

    dados.forEach((valor, index) => {
      const td = linha.insertCell();
      td.textContent = valor || "";
      td.classList.add("align-middle", "text-break");

      const coluna = colunas[index + 1];
      if (["Código", "Status", "Ativo", "Alugado", "Ano do Modelo", "Hora Status"].includes(coluna)) {
        td.classList.add("text-center", "wh-nowrap", "px-2", "py-1");
      } else {
        td.classList.add("px-3", "py-2", "text-break");
      }

      if (coluna === "Status") {
        td.classList.add("status-bem");
      }
    });
  });

  wrapper.appendChild(tabela);
  bensListDiv.appendChild(wrapper);
}

// DELETAR BEM
async function deleteGoodsSystem() {
  const deleteButton = document.querySelector("#buttonDelete");
  deleteButton.addEventListener("click", async () => {
    const selectedCheckbox = document.querySelector(
      'input[name="selectBem"]:checked'
    );
  
    if (!selectedCheckbox) {
      Toastify({
        text: "Selecione um Bem para excluir",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
      return;
    }
  
    const bemSelecionado = JSON.parse(selectedCheckbox.dataset.bem);
    const bemId = bemSelecionado.benscode;
  
    const confirmacao = confirm(
      `Tem certeza de que deseja excluir o bem com código ${bemId}?`
    );
    if (!confirmacao) {
      return;
    }
  
    await deleteBem(bemId, selectedCheckbox.closest("tr"));
  });
  
}
// DELETAR
async function deleteBem(id, bemItem) {
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
    const response = await fetch(`/api/bens/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (response.ok) {
      Toastify({
        text: "O Bem foi excluído com sucesso!",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();

      bemItem.remove();
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
          text: "Erro na exclusão do Bem ",
          duration: 2000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
      }
    }
  } catch (error) {
    console.error("erro ao excluir bem:", error);
    alert("erro ao excluir o bem");
  }
}

async function updateGoodsSystem() {

  const editButton = document.querySelector("#buttonEdit");
  editButton.addEventListener("click", (event) => {
   
    loadSelectOptions("/api/codefamilyben", "cofaEdit", "fabecode");
    loadSelectOptions("/api/codeforn", "cofoEdit", "forncode");
  
    const selectedCheckbox = document.querySelector(
      'input[name="selectBem"]:checked'
    );
  
    if (!selectedCheckbox) {
      Toastify({
        text: "Selecione um Bem para editar",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
      return;
    }
     
    const btnMainPage = document.querySelector("#btnPageListGoods");
       if(btnMainPage){
          btnMainPage.classList.remove('flex')
          btnMainPage.classList.add('hidden')
       }

       const listBens = document.querySelector("#listingBens");
       if(listBens){
         listBens.classList.remove('flex')
         listBens.classList.add('hidden')
       }
    
    const containerEditForm = document.querySelector('.editForm')
        if(containerEditForm){
           containerEditForm.classList.remove('hidden')
           containerEditForm.classList.add('flex')
        }
  
    const bemData = selectedCheckbox.dataset.bem;
    if (!bemData) {
      console.error("O atributo data-bem está vazio ou indefinido.");
      return;
    }
  
    try {
      const bemSelecionado = JSON.parse(bemData);
  
      const campos = [
        { id: "codeEdit", valor: bemSelecionado.benscode },
        { id: "nameEdit", valor: bemSelecionado.bensnome },
        { id: "cofaEdit", valor: bemSelecionado.benscofa },
        { id: "modelEdit", valor: bemSelecionado.bensmode },
        { id: "serialEdit", valor: bemSelecionado.bensnuse },
        { id: "bensAnmoEdit", valor: bemSelecionado.bensanmo },
        { id: "dtCompraEdit", valor: bemSelecionado.bensdtcp },
        { id: "valorCpEdit", valor: bemSelecionado.bensvacp },
        { id: "ntFiscalEdit", valor: bemSelecionado.bensnunf },
        { id: "cofoEdit", valor: bemSelecionado.benscofo },
        { id: "statusEdit", valor: bemSelecionado.bensstat },
        { id: "dtStatusEdit", valor: bemSelecionado.bensdtus },
        { id: "hrStatusEdit", valor: bemSelecionado.benshrus },
        { id: "corEdit", valor: bemSelecionado.benscore },
        { id: "bensAtivEdit", valor: bemSelecionado.bensativ },
        { id: "alugEdit", valor: bemSelecionado.bensalug },
        { id: "valorAlugEdit", valor: bemSelecionado.bensvaal },
        { id: "fabriEdit", valor: bemSelecionado.bensfabr },
      ];
        
       campos.forEach(({ id, valor }) => {
        const elemento = document.getElementById(id);
      
        if (!elemento) {
          console.warn(`Elemento com ID '${id}' não encontrado.`);
          return;
        }
      
        let valorFormatado = (valor || "").trim();
      
        if (elemento.tagName === "SELECT") {
          const option = [...elemento.options].find(opt => opt.value === valorFormatado);
          if (option) {
            elemento.value = valorFormatado;

            if (id === "statusEdit") {
              const hiddenInput = document.getElementById("statusEditHidden");
              if (hiddenInput) {
                hiddenInput.value = valorFormatado;
              }
            }

            if(id === "cofoEdit"){
              const hiddenInput = document.getElementById("cofoEditHidden");
              if (hiddenInput) {
                hiddenInput.value = valorFormatado;
              }
            }

            if(id === "cofaEdit"){
              const hiddenInput = document.getElementById("cofaEditHidden");
              if (hiddenInput) {
                hiddenInput.value = valorFormatado;
              }
            }
          } else {
            console.warn(`Valor '${valorFormatado}' não encontrado em <select id="${id}">`);
            elemento.selectedIndex = 0;
          }
        } else if (elemento.type === "date" && valorFormatado) {
          elemento.value = formatDateInput(valorFormatado);
        } else {
          elemento.value = valorFormatado;
        }
      });
  
      document.querySelector(".editForm").style.display = "flex";
      document.querySelector("#listingBens").style.display = "none";
      document.querySelector("#btnPageListGoods").style.display = "none";

      

    } catch (error) {
      console.error("Erro ao fazer parse de data-bem:", error);
    }
  });

   
  editAndUpdateOfBens()
}

async function editAndUpdateOfBens() {

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

   
  const formEditBens = document.querySelector("#formEditBens");

  formEditBens.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const selectedCheckbox = document.querySelector(
      'input[name="selectBem"]:checked'
    );

    if (!selectedCheckbox) {
      console.error("Nenhum checkbox foi selecionado.");
      return;
    }

    const bemId = selectedCheckbox.dataset.bem;

    if (!bemId) {
      console.error("O atributo data-bem está vazio ou inválido.");
      return;
    }

    let bemIdParsed;
    try {
      bemIdParsed = JSON.parse(bemId).benscode;
    } catch (error) {
      console.error("Erro ao fazer parse de bemId:", error);
      return;
    }

    const updateBem = {
      benscode: document.getElementById("codeEdit").value,
      bensnome: document.getElementById("nameEdit").value,
      benscofa: document.getElementById("cofaEdit").value,
      bensmode: document.getElementById("modelEdit").value,
      bensnuse: document.getElementById("serialEdit").value,
      bensanmo: document.getElementById("bensAnmoEdit").value,
      bensdtcp: document.getElementById("dtCompraEdit").value || null,
      bensvacp: document.getElementById("valorCpEdit").value,
      bensnunf: document.getElementById("ntFiscalEdit").value,
      benscofo: document.getElementById("cofoEdit").value,
      bensstat: document.getElementById("statusEdit").value,
      bensdtus: document.getElementById("dtStatusEdit").value || null,
      benshrus: document.getElementById("hrStatusEdit").value,
      benscore: document.getElementById("corEdit").value,
      bensativ: document.getElementById("bensAtivEdit").value,
      bensalug: document.getElementById("alugEdit").value,
      bensvaal: document.getElementById("valorAlugEdit").value,
      bensfabr: document.getElementById("fabriEdit").value,
    };
       
     
    try {
        
      const confirmedEdition = confirm(
        `Tem certeza de que deseja ATUALIZAR Bem?`
      );
      if (!confirmedEdition) return;

      const response = await fetch(`/api/bens/update/${bemIdParsed}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateBem),
      });

      if (response.ok) {
  
        Toastify({
          text: `Bem '${bemIdParsed}' Atualizado com sucesso!!`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();

        formEditBens.reset();
      } else {
        console.error("Erro ao atualizar bem:", await response.text());

         Toastify({
          text: "Erro ao atualizar bem",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  });
}


