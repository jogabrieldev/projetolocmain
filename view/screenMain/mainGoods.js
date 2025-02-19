//butoes relacionados aos bens
const buttonStartCadBens = document.querySelector(".btnCadBens");
buttonStartCadBens.addEventListener("click", () => {

  const containerAppBens = document.querySelector(".containerAppBens");
    containerAppBens.style.display = "flex";

  const showContentBens = document.querySelector('.showContentBens')
   showContentBens.style.display = 'none'

  const btnMainPage = document.querySelector(".btnPageListGoods");
    btnMainPage.style.display = "flex";

  const listBens = document.querySelector(".listingBens");
   listBens.style.display = "flex";

  const containerAppProd = document.querySelector('.containerAppProd')
   containerAppProd.style.display = 'none'

  const containerAppFabri = document.querySelector('.containerAppFabri')
   containerAppFabri.style.display = 'none'

  const containerAppTypeProd = document.querySelector('.containerAppTipoProd')
  containerAppTypeProd.style.display = 'none'

   const containerAppDriver = document.querySelector('.containerAppDriver')
    containerAppDriver.style.display = 'none'

    const containerAppClient = document.querySelector(".containerAppClient");
    containerAppClient.style.display = "none";

    const containerAppForn = document.querySelector(".containerAppForn")
       containerAppForn.style.display = 'none'

    const containerFormEdit = document.querySelector('.editForm')
    containerFormEdit.style.display = 'none'

    const informative = document.querySelector('.information')
    informative.style.display = 'block'
    informative.textContent = 'SEÇÃO BENS'

});

const buttonOutStart = document.querySelector(".material-symbols-outlined");
buttonOutStart.addEventListener("click", () => {
  window.location.href = "main.html";
});

const buttonRegisterGoods = document.querySelector(".registerGoods");
buttonRegisterGoods.addEventListener("click", () => {
  const registerBens = document.querySelector(".showContentBens");
  const btnMainPage = document.querySelector(".btnPageListGoods");
  const listBens = document.querySelector(".listingBens");
  const ContentBens = document.querySelector(".showContentBens");

  registerBens.style.display = "flex";
  ContentBens.style.display = "flex";

  btnMainPage.style.display = "none";
  listBens.style.display = "none";
});

const buttonExit = document.querySelector(".buttonExit");
buttonExit.addEventListener("click", () => {
  const containerAppBens = document.querySelector(".containerAppBens");
  containerAppBens.style.display = "none";
});

const btnOutPageEdit = document.querySelector(".btnOutPageEdit");
btnOutPageEdit.addEventListener("click", (e) => {
  e.preventDefault();

  const pageEditForm = document.querySelector(".editForm");
  const listingBens = document.querySelector(".listingBens");
  const btnPageListGoods = document.querySelector('.btnPageListGoods')
  
   listingBens.style.display = 'flex'
   btnPageListGoods.style.display = 'flex'


  pageEditForm.style.display = "none";

  return;
});


const buttonOutGoods = document.querySelector(".btnOut");
buttonOutGoods.addEventListener("click", (event) => {
  event.preventDefault();
  const ContentBens = document.querySelector(".showContentBens");
  const listingBens = document.querySelector(".listingBens");
  const btnPageListGoods = document.querySelector('.btnPageListGoods')

  ContentBens.style.display = "none";
  listingBens.style.display = 'flex'
  btnPageListGoods.style.display ='flex'

  return;
});

const buttonSubmitRegisterGoods = document.querySelector('.btnNext')
buttonSubmitRegisterGoods.addEventListener("submit" , (event)=>{
  event.preventDefault()
})

const formRegister = document.querySelector("#formRegisterBens")
  formRegister.addEventListener("submit", async (event) => {
 event.preventDefault()
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const responseBens = await fetch("/api/bens/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({data}),
      });
      if (responseBens.ok) {
        console.log("deu certo");

        Toastify({
          text: "Cadastrado com sucesso",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();

        document.querySelector("#formRegisterBens").reset();
      } else {
        Toastify({
          text: "Erro no cadastro",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
        console.log("deu ruim");
      }

    } catch (error) {
      console.log("erro no envio", error);
    }
  });

  async function loadSelectOptions(url, selectId, fieldName) {
    try {
        const response = await fetch(url);
        const result = await response.json();
        
        // Caso os dados venham aninhados dentro de "data"
        const data = Array.isArray(result) ? result : result.data;

        if (!Array.isArray(data)) {
            throw new Error(`Formato de dados inesperado de ${url}: ` + JSON.stringify(result));
        }

        const select = document.getElementById(selectId);
        if (!select) {
            throw new Error(`Elemento select com ID '${selectId}' não encontrado.`);
        }

        data.forEach(item => {

          console.log("Adicionando opção:", item[fieldName]); 
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
};

// Chamar a função corretamente ao carregar a página
document.querySelector('.registerGoods').addEventListener('click' , ()=>{
  loadSelectOptions("/api/codefamilyben", "cofa", 'fabecode');
  loadSelectOptions("/api/codeforn", "cofo", 'forncode');
});



// fazendo listagens

let bensData = {};

async function fetchBens() {
  try {
    const response = await fetch("/api/listbens");
    const bens = await response.json();

    const bensListDiv = document.querySelector(".listingBens");
    bensListDiv.innerHTML = "";

    if (bens.length > 0) {
      const tabela = document.createElement("table");
      tabela.style.width = "100%";
      tabela.setAttribute("border", "1");

      // Cabeçalho
      const cabecalho = tabela.createTHead();
      const linhaCabecalho = cabecalho.insertRow();
      const colunas = [
        "Selecionar",
        "Código",
        "Nome",
        "Familida do Bem",
        "Modelo",
        "Número de Série",
        "Placa",
        "Ano do Modelo",
        "Data da Compra",
        "valor de Compra",
        "Nota Fiscal",
        "Código Fornecedor",
        "Km Atual",
        "Data do Km",
        "Status",
        "Data do Status",
        "Hora Status",
        "Chassi",
        "Cor",
        "Número",
        "Renavam",
        "Ctep",
        "Ativo",
        "Alugado",
        "Valor Alugado",
        "Fabricante",
      ];

      // Preenche o cabeçalho
      colunas.forEach((coluna) => {
        const th = document.createElement("th");
        th.textContent = coluna;
        linhaCabecalho.appendChild(th);
      });

      // Corpo da tabela
      const corpo = tabela.createTBody();
      bens.forEach((bem) => {
        const linha = corpo.insertRow();

        linha.setAttribute("data-benscode", bem.benscode);

        const checkboxCell = linha.insertCell();
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "selectBem";
        checkbox.value = bem.benscode;

        // Aqui, serializa `bem` como JSON e valida antes de atribuir
        const bemData = JSON.stringify(bem);
        if (bemData) {
          checkbox.dataset.bem = bemData;
        } else {
          console.warn(`Bem inválido encontrado:`, bem);
        }

        checkboxCell.appendChild(checkbox);

        // formatação de data
        const formatDate = (isoDate) => {
          if (!isoDate) return "";
          const dateObj = new Date(isoDate);
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, "0");
          const day = String(dateObj.getDate()).padStart(2, "0");
          return `${year}/${month}/${day}`;
        };

     
        linha.insertCell().textContent = bem.benscode;
        linha.insertCell().textContent = bem.bensnome;
        linha.insertCell().textContent = bem.benscofa;
        linha.insertCell().textContent = bem.bensmode;
        linha.insertCell().textContent = bem.bensnuse;
        linha.insertCell().textContent = bem.bensplac;
        linha.insertCell().textContent = formatDate(bem.bensanmo);
        linha.insertCell().textContent = formatDate(bem.bensdtcp);
        linha.insertCell().textContent = bem.bensvacp;
        linha.insertCell().textContent = bem.bensnunf;
        linha.insertCell().textContent = bem.benscofo;
        linha.insertCell().textContent = bem.benskmat;
        linha.insertCell().textContent = formatDate(bem.bensdtkm);
        linha.insertCell().textContent = bem.bensstat;
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
    console.error("Erro ao carregar bens:", error);
    document.getElementById("bensList").innerHTML =
      "<p>Erro ao carregar bens.</p>";
  }
}

fetchBens();

// Evento para o botão Excluir
const deleteButton = document.querySelector(".buttonDelete");
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

//deleteBens
async function deleteBem(id, bemItem) {
  try {
    const response = await fetch(`/api/delete/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (response.ok) {
      Toastify({
        text: "O bem foi excluido com sucesso!",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();
      bemItem.remove();
    } else {
      console.log("erro para excluir");

      Toastify({
        text: "Erro na exclusão do Bem",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red)",
      }).showToast();
    }
  } catch (error) {
    console.error("erro ao excluir bem:", error);
    alert("erro ao excluir o bem");
  }
}

// Evento para o botão Editar
const editButton = document.querySelector(".buttonEdit");
editButton.addEventListener("click", (event) => {
  
  loadSelectOptions("/api/codefamilyben", "cofaEdit", 'fabecode');
  loadSelectOptions("/api/codeforn", "cofoEdit", 'forncode');
  
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

  const bemData = selectedCheckbox.dataset.bem;
  if (!bemData) {
    console.error("O atributo data-bem está vazio ou indefinido.");
    return;
  }

  try {
    const bemSelecionado = JSON.parse(bemData);
    console.log("Editar item:", bemSelecionado);

    // Campos e IDs correspondentes
    const campos = [
      { id: "code", valor: bemSelecionado.benscode },
      { id: "name", valor: bemSelecionado.bensnome },
      { id: "cofaEdit", valor: bemSelecionado.benscofa },
      { id: "model", valor: bemSelecionado.bensmode },
      { id: "serial", valor: bemSelecionado.bensnuse },
      { id: "placa", valor: bemSelecionado.bensplac },
      { id: "bensAnmo", valor: bemSelecionado.bensanmo },
      { id: "dtCompra", valor: bemSelecionado.bensdtcp },
      { id: "valorCp", valor: bemSelecionado.bensvacp },
      { id: "ntFiscal", valor: bemSelecionado.bensnunf },
      { id: "cofoEdit", valor: bemSelecionado.benscofo },
      { id: "kmAtual", valor: bemSelecionado.benskmat },
      { id: "dtKm", valor: bemSelecionado.bensdtkm },
      { id: "status", valor: bemSelecionado.bensstat },
      { id: "dtStatus", valor: bemSelecionado.bensdtus },
      { id: "hrStatus", valor: bemSelecionado.benshrus },
      { id: "chassi", valor: bemSelecionado.bensnuch },
      { id: "cor", valor: bemSelecionado.benscore },
      { id: "nuMO", valor: bemSelecionado.bensnumo },
      { id: "rena", valor: bemSelecionado.bensrena },
      { id: "bensCtep", valor: bemSelecionado.bensctep },
      { id: "bensAtiv", valor: bemSelecionado.bensativ },
      { id: "alug", valor: bemSelecionado.bensalug },
      { id: "valorAlug", valor: bemSelecionado.bensvaal },
      { id: "fabri", valor: bemSelecionado.bensfabr },
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

    // Mostrar o formulário de edição e ocultar a lista
    const editForm = document.querySelector(".editForm");
    const listingBens = document.querySelector(".listingBens");
    const btnMainPage = document.querySelector('.btnPageListGoods')

    if (editForm) {
      editForm.style.display = "flex";
    } else {
      console.error("O formulário de edição não foi encontrado.");
    }

    if (listingBens) {
      listingBens.style.display = "none";
    } else {
      console.error("A lista de bens não foi encontrada.");
    }

    if(btnMainPage){
      btnMainPage.style.display = 'none'
    }
  } catch (error) {
    console.error("Erro ao fazer parse de data-bem:", error);
  }
});

// Função para editar e atualizar os dados
async function editAndUpdateOfBens() {
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
      benscode: document.getElementById("code").value,
      bensnome: document.getElementById("name").value,
      benscofa: document.getElementById("cofaEdit").value,
      bensmode: document.getElementById("model").value,
      bensnuse: document.getElementById("serial").value,
      bensplac: document.getElementById("placa").value,
      bensanmo: document.getElementById("bensAnmo").value,
      bensdtcp: document.getElementById("dtCompra").value || null,
      bensvacp: document.getElementById("valorCp").value,
      bensnunf: document.getElementById("ntFiscal").value,
      benscofo: document.getElementById("cofoEdit").value,
      benskmat: document.getElementById("kmAtual").value,
      bensdtkm: document.getElementById("dtKm").value || null,
      bensstat: document.getElementById("status").value,
      bensdtus: document.getElementById("dtStatus").value || null,
      benshrus: document.getElementById("hrStatus").value,
      bensnuch: document.getElementById("chassi").value,
      benscore: document.getElementById("cor").value,
      bensnumo: document.getElementById("nuMO").value,
      bensrena: document.getElementById("rena").value,
      bensctep: document.getElementById("bensCtep").value,
      bensativ: document.getElementById("bensAtiv").value,
      bensalug: document.getElementById("alug").value,
      bensvaal: document.getElementById("valorAlug").value,
      bensfabr: document.getElementById("fabri").value,
    };

    try {
      const response = await fetch(`/api/update/${bemIdParsed}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateBem),
      });

      console.log("resposta:", response);

      if (response.ok) {
        console.log("Atualização bem-sucedida");

        Toastify({
          text: `Bem '${bemIdParsed}' Atualizado com sucesso!!`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();

          // document.querySelector(".editForm").style.display = "none";
    
          formEditBens.reset();

      } else {
        console.error("Erro ao atualizar bem:", await response.text());
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  });
}
editAndUpdateOfBens();
