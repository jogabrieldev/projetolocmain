//butoes relacionados aos bens
const buttonStartCadBens = document.querySelector(".btnCadBens");
buttonStartCadBens.addEventListener("click", () => {
  const navigatorPageBens = document.querySelector(".pageListingBens");
  const contentOptionsClient = document.querySelector(".optionsClient");

  if ((navigatorPageBens.style.display = "none")) {
    navigatorPageBens.style.display = "flex";
  }
  if ((navigatorPageBens.style.display = "flex")) {
    contentOptionsClient.style.display = "none";
  }
});

const buttonOutStart = document.querySelector(".material-symbols-outlined");
buttonOutStart.addEventListener("click", () => {
  window.location.href = "main.html";
});

const buttonRegisterGoods = document.querySelector(".registerGoods");
buttonRegisterGoods.addEventListener("click", () => {
  const registerBens = document.querySelector(".showContentBens");
  const contentOptions = document.querySelector(".pageListingBens");

  if ((contentOptions.style.display = "flex")) {
    contentOptions.style.display = "none";
    registerBens.style.display = "flex";
  }
});

const buttonExit = document.querySelector(".buttonExit");
buttonExit.addEventListener("click", () => {
  const pagelistBens = document.querySelector(".pageListingBens");
  if ((pagelistBens.style.display = "flex")) {
    pagelistBens.style.display = "none";
    return;
  }
});

const btnOutPageEdit = document.querySelector(".btnOutPageEdit");
btnOutPageEdit.addEventListener("click", (e) => {
  e.preventDefault();
  const pageEditForm = document.querySelector(".editForm");
  pageEditForm.style.display = "none";
  return;
});

const buttonOutGoods = document.querySelector(".btnOut");
buttonOutGoods.addEventListener("click", (event) => {
  event.preventDefault();
  const ContentBens = document.querySelector(".showContentBens");
  if ((ContentBens.style.display = "flex")) {
    ContentBens.style.display = "none";
  }
  return;
});

//mascaras para os inputs 

$(document).ready(function(){
  // Aplica a máscara para o campo de valor
  $('#valorCp').mask('R$ 000.000.000,00', {reverse: true});
});


//validação dos campos
$(document).ready(function() {
  $('#formRegisterBens').validate({
    rules: {
      code: {
        required: true,
        minlength:3
      },
      name: {
        required: true,
        minlength:4
      },
      cofa:{
        required: true 
      },
      model:{
        required: true
      },
      serial:{
        required: true,
        minlength: 5
      },
      dtCompra:{
        date:true,
        required:true
      },
      valor:{
        required: true
      },
      ntFiscal:{
        required: true,
        minlength: 5
      },
      cofo:{
        required: true,
        minlength: 4
      },
      valorAlug:{
        required: true
      }
      
  },
     
    messages:{
      code: {
        required: "Por favor, insira o codigo",
        minlength:'Maior que 3 caracteres'
      },
      name: {
        required: "Por favor, insira um Nome",
        minlength:'Maior que 4 caracteres'
      },

      cofa:{
        required: 'Por favor insira o codigo'
      },
      model:{
        required: 'Por favor insira o Modelo'
      },
      serial:{
        required: 'Por favor insira o serial',
        minlength: 'Maior que 3 caracteres'
      },
      dtCompra:{
          required: 'Por favor insira uma data valida',
          date: 'Por favor insiar uma data valida'
      },   
      valor:{
        required: 'Por Favor insira o valor'
      }, 
      ntFiscal:{
        required: 'Por favor insira o numero da Nota',
        minlength:'Sua nota não tem a quantidade de digitos correto'
      },
      cofo:{
        required: 'Por favor insira um codigo do fornecedor valido',
        minlength: 'Tamanho do Codigo invalido'
      },
      valorAlug:{
        required: 'Coloque o valor'
      }
      
     

  },
     
    errorPlacement: function (error, element) {
      // Adiciona uma mensagem de erro logo abaixo do input
      error.addClass('error-text'); // Adiciona uma classe para estilização
      error.insertAfter(element);
    },
    highlight: function(element) {
      // Adiciona uma classe de erro ao campo inválido
      $(element).addClass('error-field');
    },
    unhighlight: function(element) {
      // Remove a classe de erro do campo válido
      $(element).removeClass('error-field');
    },
    submitHandler: function(form) {
      form.submit(); // Envia o formulário se for válido
    }
  });
});


const formRegister = document
  .querySelector("#formRegisterBens")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
     const response =  await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({data})
      })
       if(response.ok){

        console.log('deu certo')

         Toastify({
          text: "Sucesso",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor:"red"
        }).showToast();

       
        document.querySelector('#formRegisterBens').reset()
       
      }else{
        Toastify({
          text: "Erro no cadastro",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red"
        }).showToast();
        console.log('deu ruim')
      }

    } catch (error) {
      console.log("erro no envio", error);
    }
  });

// fazendo listagens

let bensData = {};

async function fetchBens() {
  try {
    const response = await fetch("/api/listbens");
    const bens = await response.json();

    const bensListDiv = document.querySelector(".listingBens");
    bensListDiv.innerHTML = ""; // Limpa a div antes de preencher

    if (bens.length > 0) {
      const tabela = document.createElement("table");
      tabela.style.width = "100%";
      tabela.setAttribute("border", "1"); // Adiciona borda para tabela

      // Cabeçalho
      const cabecalho = tabela.createTHead();
      const linhaCabecalho = cabecalho.insertRow();
      const colunas = [
        "Selecionar",
        "Código",
        "Nome",
        "Código Fabricante",
        "Modelo",
        "Número de Série",
        "Placa",
        "Ano",
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

        // Adiciona os dados do bem
        linha.insertCell().textContent = bem.benscode;
        linha.insertCell().textContent = bem.bensnome;
        linha.insertCell().textContent = bem.benscofa;
        linha.insertCell().textContent = bem.bensmode;
        linha.insertCell().textContent = bem.bensnuse;
        linha.insertCell().textContent = bem.bensplac;
        linha.insertCell().textContent = bem.bensanmo;
        linha.insertCell().textContent = bem.bensdtcp;
        linha.insertCell().textContent = bem.bensvacp;
        linha.insertCell().textContent = bem.bensnunf;
        linha.insertCell().textContent = bem.benscofo;
        linha.insertCell().textContent = bem.benskmat;
        linha.insertCell().textContent = bem.bensdtkm;
        linha.insertCell().textContent = bem.bensstat;
        linha.insertCell().textContent = bem.bensdtus;
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

      // Adiciona a tabela à div
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
      text: "Selecione um item para excluir",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red"
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
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
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
  const selectedCheckbox = document.querySelector(
    'input[name="selectBem"]:checked'
  );

  if (!selectedCheckbox) {
    Toastify({
      text: "Selecione um item para editar",
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
      { id: "cofa", valor: bemSelecionado.benscofa },
      { id: "model", valor: bemSelecionado.bensmode },
      { id: "serial", valor: bemSelecionado.bensnuse },
      { id: "placa", valor: bemSelecionado.bensplac },
      { id: "bensAnmo", valor: bemSelecionado.bensanmo },
      { id: "dtCompra", valor: bemSelecionado.bensdtcp },
      { id: "valor", valor: bemSelecionado.bensvacp },
      { id: "ntFiscal", valor: bemSelecionado.bensnunf },
      { id: "cofo", valor: bemSelecionado.benscofo },
      { id: "kmAtual", valor: bemSelecionado.benskmat },
      { id: "dtKm", valor: bemSelecionado.bensdtkm },
      { id: "status", valor: bemSelecionado.bensstat },
      { id: "dtStatus", valor: bemSelecionado.bensdtst },
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
        elemento.value = valor || ""; // Define o valor ou vazio se indefinido
      } else {
        console.warn(`Elemento com ID '${id}' não encontrado.`);
      }
    });

    // Mostrar o formulário de edição e ocultar a lista
    const editForm = document.querySelector(".editForm");
    const listingBens = document.querySelector(".pageListingBens");

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
  } catch (error) {
    console.error("Erro ao fazer parse de data-bem:", error);
  }
});


// Função para editar e atualizar os dados
async function editAndUpdateOfBens() {
  const formEditBens = document.querySelector("#formEditBens");

  formEditBens.addEventListener("submit", async (event) => {

    event.preventDefault()

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Obter o checkbox selecionado
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
      bemIdParsed = JSON.parse(bemId).benscode; // Supondo que benscode seja a identificação
    } catch (error) {
      console.error("Erro ao fazer parse de bemId:", error);
      return;
    }

    const updateBem = {
      benscode: document.getElementById("code").value,
      bensnome: document.getElementById("name").value,
      benscofa: document.getElementById("cofa").value,
      bensmode: document.getElementById("model").value,
      bensnuse: document.getElementById("serial").value,
      bensplac: document.getElementById("placa").value,
      bensanmo: document.getElementById("bensAnmo").value,
      bensdtcp: document.getElementById("dtCompra").value || null,
      bensvacp: document.getElementById("valorCp").value,
      bensnunf: document.getElementById("ntFiscal").value,
      benscofo: document.getElementById("cofo").value,
      benskmat: document.getElementById("kmAtual").value,
      bensdtkm: document.getElementById("dtKm").value || null,
      bensstat: document.getElementById("status").value,
      bensdtst: document.getElementById("dtStatus").value || null,
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
        body: JSON.stringify(updateBem)
      });

      console.log( 'resposta:' ,response)

      if (response.ok) {
        console.log("Atualização bem-sucedida");

        Toastify({
          text: `Bem '${bemIdParsed}' Atualizado com sucesso!!`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        }).showToast();

        setTimeout(() => {
          window.location.reload();
          document.querySelector(".editForm").style.display = "none";
        }, 3000)
       
        formEditBens.reset();

      } else {
        console.error("Erro ao atualizar bem:", await response.text());
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  });
} editAndUpdateOfBens();







 


