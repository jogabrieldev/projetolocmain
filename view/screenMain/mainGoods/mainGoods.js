
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

const  socketUpdateBens = io()
document.addEventListener("DOMContentLoaded", () => {

  const btnLoadBens = document.querySelector('#btnLoadBens');
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
          registerGoodsSystem()
          deleteGoodsSystem()
          updateGoodsSystem()
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
          informative.textContent = 'SEÇÃO BENS';
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
          backgroundColor: "green",
        }).showToast();
        console.error('Erro ao carregar bens:', err);
      }
    });
  } else {
    console.warn('#btnLoadBens não encontrado no DOM');
  }
 
  socketUpdateBens.on("updateRunTimeGoods", (bens) => {
    insertBensInTableRunTime(bens);
  });

  socketUpdateBens.on("updateGoodsTable", (updatedBem) => {
     updateBemInTableRunTime(updatedBem)
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
 // registrar o bem
 async function registerGoodsSystem(){
  

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
      placa: document.querySelector("#placa").value.trim(),
      bensAnmo: document.querySelector("#bensAnmo").value.trim(),
      dtCompra: document.querySelector("#dtCompra").value.trim(),
      valorCp: document.querySelector("#valorCpMain").value.trim(),
      ntFiscal: document.querySelector("#ntFiscal").value.trim(),
      cofo: document.querySelector("#cofo").value.trim(),
      kmAtual: document.querySelector("#kmAtual").value.trim(),
      dtKm: document.querySelector("#dtKm").value.trim(),
      status: document.querySelector("#status").value.trim(),
      dtStatus: document.querySelector("#dtStatus").value.trim(),
      hrStatus: document.querySelector("#hrStatus").value.trim(),
      chassi: document.querySelector("#chassi").value.trim(),
      cor: document.querySelector("#cor").value.trim(),
      nuMO: document.querySelector("#nuMO").value.trim(),
      rena: document.querySelector("#rena").value.trim(),
      bensCtep: document.querySelector("#bensCtep").value.trim(),
      bensAtiv: document.querySelector("#bensAtiv").value.trim(),
      alug: document.querySelector("#alug").value.trim(),
      valorAlug: document.querySelector("#valorAlugMain").value.trim(),
      fabri: document.querySelector("#fabri").value.trim(),
    };


    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${currentHours}:${currentMinutes}`;

    if(formData.hrStatus !== currentTime){
      Toastify({
        text: "Insira o horario atual ",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "orange",
      }).showToast();
      return;
    }

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
      const response = await fetch("http://localhost:3000/api/bens/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanedData),
      });

      const result = await response.json();

      if (response.ok) {
        Toastify({
          text: "Bem cadastrado com sucesso!",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();

        document.querySelector("#formRegisterBens").reset();
      } else if (response.status === 409) {
        Toastify({
          text: result.message,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
      } else {
        Toastify({
          text: result.message || "Erro ao cadastrar o Bem",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
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
 }

// ATUALIZAR TABELA NA INSERÇÃO EM RUNTIME
function insertBensInTableRunTime(bens) {
  const bensListDiv = document.querySelector("#listingBens");
  if (!bensListDiv) {
    console.error('Elemento .listingBens não encontrado para atualização em tempo real');
    return;
  }

  bensListDiv.innerHTML = "";
  if (bens.length > 0) {
    const tabela = document.createElement("table");
    tabela.classList.add('dark-table')

    const cabecalho = tabela.createTHead();
    const linhaCabecalho = cabecalho.insertRow();
    const colunas = [
      "Selecionar", "Código", "Nome", "Família do Bem", "Status", "Número de Série",
      "Placa", "Ano do Modelo", "Data da Compra", "Valor de Compra", "Nota Fiscal",
      "Código Fornecedor", "Km Atual", "Data do Km", "Modelo", "Data do Status",
      "Hora Status", "Chassi", "Cor", "Número", "Renavam", "Ctep", "Ativo",
      "Alugado", "Valor Alugado", "Fabricante"
    ];

    colunas.forEach((coluna) => {
      const th = document.createElement("th");
      th.textContent = coluna;
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
      checkbox.dataset.bem = JSON.stringify(bem);
      checkboxCell.appendChild(checkbox);

      linha.insertCell().textContent = bem.benscode || '';
      linha.insertCell().textContent = bem.bensnome || '';
      linha.insertCell().textContent = bem.benscofa || '';
      linha.insertCell().textContent = bem.bensstat || '';
      linha.insertCell().textContent = bem.bensnuse || '';
      linha.insertCell().textContent = bem.bensplac || '';
      linha.insertCell().textContent = formatDate(bem.bensanmo);
      linha.insertCell().textContent = formatDate(bem.bensdtcp);
      linha.insertCell().textContent = bem.bensvacp || '';
      linha.insertCell().textContent = bem.bensnunf || '';
      linha.insertCell().textContent = bem.benscofo || '';
      linha.insertCell().textContent = bem.benskmat || '';
      linha.insertCell().textContent = formatDate(bem.bensdtkm);
      linha.insertCell().textContent = bem.bensmode || '';
      linha.insertCell().textContent = formatDate(bem.bensdtus);
      linha.insertCell().textContent = bem.benshrus || '';
      linha.insertCell().textContent = bem.bensnuch || '';
      linha.insertCell().textContent = bem.benscore || '';
      linha.insertCell().textContent = bem.bensnumo || '';
      linha.insertCell().textContent = bem.bensrena || '';
      linha.insertCell().textContent = bem.bensctep || '';
      linha.insertCell().textContent = bem.bensativ || '';
      linha.insertCell().textContent = bem.bensalug || '';
      linha.insertCell().textContent = bem.bensvaal || '';
      linha.insertCell().textContent = bem.bensfabr || '';
    });

    bensListDiv.appendChild(tabela);
  }
}
//LISTAGEM DOS BENS
let bensData = {};
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
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    Toastify({
      text: result?.message || "Erro ao carregar clientes.",
      duration: 4000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return;
  }

  const bens = result;
  const bensListDiv = document.querySelector("#listingBens");
  bensListDiv.innerHTML = "";

  if (bens.length > 0) {
    const tabela = document.createElement("table");
    tabela.classList.add('dark-table');

    // Cabeçalho
    const cabecalho = tabela.createTHead();
    const linhaCabecalho = cabecalho.insertRow();
    const colunas = [
      "Selecionar", "Código", "Nome", "Familida do Bem", "Status", "Número de Série",
      "Placa", "Ano do Modelo", "Data da Compra", "valor de Compra", "Nota Fiscal",
      "Código Fornecedor", "Km Atual", "Data do Km", "Modelo", "Data do Status",
      "Hora Status", "Chassi", "Cor", "Número", "Renavam", "Ctep", "Ativo",
      "Alugado", "Valor Alugado", "Fabricante"
    ];

    colunas.forEach((coluna) => {
      const th = document.createElement("th");
      th.textContent = coluna;
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

      const bemData = JSON.stringify(bem, bem.bensstat);
      if (bemData) {
        checkbox.dataset.bem = bemData;
      } else {
        console.warn(`Bem inválido encontrado:`, bem);
      }
      checkboxCell.appendChild(checkbox);

      linha.insertCell().textContent = bem.benscode;
      linha.insertCell().textContent = bem.bensnome;
      linha.insertCell().textContent = bem.benscofa;
      const statusCell = linha.insertCell();
      statusCell.textContent = bem.bensstat;
      statusCell.classList.add("status-bem");
      linha.insertCell().textContent = bem.bensnuse;
      linha.insertCell().textContent = bem.bensplac;
      linha.insertCell().textContent = formatDate(bem.bensanmo);
      linha.insertCell().textContent = formatDate(bem.bensdtcp);
      linha.insertCell().textContent = bem.bensvacp;
      linha.insertCell().textContent = bem.bensnunf;
      linha.insertCell().textContent = bem.benscofo;
      linha.insertCell().textContent = bem.benskmat;
      linha.insertCell().textContent = formatDate(bem.bensdtkm);
      linha.insertCell().textContent = bem.bensmode;
      linha.insertCell().textContent = formatDate(bem.bensdtus);
      linha.insertCell().textContent = bem.benshrus;
      linha.insertCell().textContent = bem.bensnuch;
      linha.insertCell().textContent = bem.benscore;
      linha.insertCell().textContent = bem.bensnumo;
      linha.insertCell().textContent = bem.bensrena;
      linha.insertCell().textContent = bem.bensctep;
      linha.insertCell().textContent = bem.bensativ;
      linha.insertCell().textContent = bem.bensalug;
      linha.insertCell().textContent = bem.bensvaal;
      linha.insertCell().textContent = bem.bensfabr;
    });

    bensListDiv.appendChild(tabela);
  } else {
    bensListDiv.innerHTML = "<p>Nenhum bem cadastrado.</p>";
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
    const response = await fetch(`/api/delete/${id}`, {
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
        { id: "placaEdit", valor: bemSelecionado.bensplac },
        { id: "bensAnmoEdit", valor: bemSelecionado.bensanmo },
        { id: "dtCompraEdit", valor: bemSelecionado.bensdtcp },
        { id: "valorCpEdit", valor: bemSelecionado.bensvacp },
        { id: "ntFiscalEdit", valor: bemSelecionado.bensnunf },
        { id: "cofoEdit", valor: bemSelecionado.benscofo },
        { id: "kmAtualEdit", valor: bemSelecionado.benskmat },
        { id: "dtKmEdit", valor: bemSelecionado.bensdtkm },
        { id: "statusEdit", valor: bemSelecionado.bensstat },
        { id: "dtStatusEdit", valor: bemSelecionado.bensdtus },
        { id: "hrStatusEdit", valor: bemSelecionado.benshrus },
        { id: "chassiEdit", valor: bemSelecionado.bensnuch },
        { id: "corEdit", valor: bemSelecionado.benscore },
        { id: "nuMOEdit", valor: bemSelecionado.bensnumo },
        { id: "renaEdit", valor: bemSelecionado.bensrena },
        { id: "bensCtepEdit", valor: bemSelecionado.bensctep },
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
      bensplac: document.getElementById("placaEdit").value,
      bensanmo: document.getElementById("bensAnmoEdit").value,
      bensdtcp: document.getElementById("dtCompraEdit").value || null,
      bensvacp: document.getElementById("valorCpEdit").value,
      bensnunf: document.getElementById("ntFiscalEdit").value,
      benscofo: document.getElementById("cofoEdit").value,
      benskmat: document.getElementById("kmAtualEdit").value,
      bensdtkm: document.getElementById("dtKmEdit").value || null,
      bensstat: document.getElementById("statusEdit").value,
      bensdtus: document.getElementById("dtStatusEdit").value || null,
      benshrus: document.getElementById("hrStatusEdit").value,
      bensnuch: document.getElementById("chassiEdit").value,
      benscore: document.getElementById("corEdit").value,
      bensnumo: document.getElementById("nuMOEdit").value,
      bensrena: document.getElementById("renaEdit").value,
      bensctep: document.getElementById("bensCtepEdit").value,
      bensativ: document.getElementById("bensAtivEdit").value,
      bensalug: document.getElementById("alugEdit").value,
      bensvaal: document.getElementById("valorAlugEdit").value,
      bensfabr: document.getElementById("fabriEdit").value,
    };
       
    
   
    try {
      const response = await fetch(`/api/update/${bemIdParsed}`, {
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
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  });
}

// ATUALIZAÇÃO EM RUNTIME 
function updateBemInTableRunTime(updatedBem) {
  const row = document.querySelector(
    `[data-benscode="${updatedBem.benscode}"]`
  );
   
  if (row) {
   
    row.cells[1].textContent = updatedBem.benscode || "-"; // Código
    row.cells[2].textContent = updatedBem.bensnome || "-"; // Nome
    row.cells[3].textContent = updatedBem.benscofa || "-"; // Família do Bem
    row.cells[4].textContent = updatedBem.bensstat || "-"; // Status
    row.cells[5].textContent = updatedBem.bensnuse || "-"; // Número de Série
    row.cells[6].textContent = updatedBem.bensplac || "-"; // Placa
    row.cells[7].textContent = formatDate(updatedBem.bensanmo) || "-"; // Ano do Modelo
    row.cells[8].textContent = formatDate(updatedBem.bensdtcp) || "-"; // Data da Compra
    row.cells[9].textContent = updatedBem.bensvacp || "-"; // Valor de Compra
    row.cells[10].textContent = updatedBem.bensnunf || "-"; // Nota Fiscal
    row.cells[11].textContent = updatedBem.benscofo || "-"; // Código Fornecedor
    row.cells[12].textContent = updatedBem.benskmat || "-"; // Km Atual
    row.cells[13].textContent = formatDate(updatedBem.bensdtkm) || "-"; // Data do Km
    row.cells[14].textContent = updatedBem.bensmode || "-"; // Modelo
    row.cells[15].textContent = formatDate(updatedBem.bensdtus) || "-"; // Data do Status
    row.cells[16].textContent = updatedBem.benshrus || "-"; // Hora Status
    row.cells[17].textContent = updatedBem.bensnuch || "-"; // Chassi
    row.cells[18].textContent = updatedBem.benscore || "-"; // Cor
    row.cells[19].textContent = updatedBem.bensnumo || "-"; // Número
    row.cells[20].textContent = updatedBem.bensrena || "-"; // Renavam
    row.cells[21].textContent = updatedBem.bensctep || "-"; // Ctep
    row.cells[22].textContent = updatedBem.bensativ || "-"; // Ativo
    row.cells[23].textContent = updatedBem.bensalug || "-"; // Alugado
    row.cells[24].textContent = updatedBem.bensvaal || "-"; // Valor Alugado
    row.cells[25].textContent = updatedBem.bensfabr || "-"; // Fabricante
  }
};


