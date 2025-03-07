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
    
     const containerAppAutomo = document.querySelector('.containerAppAutomo')
       containerAppAutomo.style.display = 'none'
       
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

function isTokenExpired(token) {
  try {
      const payload = JSON.parse(atob(token.split('.')[1])); 
      const expTime = payload.exp * 1000; 
      return Date.now() > expTime; 
  } catch (error) {
      return true; 
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.btnNext').addEventListener('click', async (event) => {
      event.preventDefault(); // Evita que o formulário recarregue a página

      const token = localStorage.getItem('token'); // Pega o token armazenado no login

      if (!token || isTokenExpired(token)) {
        Toastify({
            text: "Sessão expirada. Faça login novamente.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
        }).showToast();
    
        localStorage.removeItem("token"); // Remove o token expirado
        setTimeout(() => {
            window.location.href = "/index.html"; // Redireciona para a página de login
        }, 2000); // Espera 2 segundos para exibir a notificação antes do redirecionamento
        return;
    }

      if (!$('#formRegisterBens').valid()) {
        return;
    }
      // Captura os valores do formulário
      const formData = {
          code: document.querySelector('#code').value,               // Código
          name: document.querySelector('#name').value,               // Nome
          cofa: document.querySelector('#cofa').value,               // Família de bem
          model: document.querySelector('#model').value,             // Modelo
          serial: document.querySelector('#serial').value,           // Número de Série
          placa: document.querySelector('#placa').value,             // Placa
          bensAnmo: document.querySelector('#bensAnmo').value,       // Ano do modelo
          dtCompra: document.querySelector('#dtCompra').value,       // Data da compra
          valorCp: document.querySelector('#valorCpMain').value,         // Valor de compra
          ntFiscal: document.querySelector('#ntFiscal').value,       // Nota Fiscal
          cofo: document.querySelector('#cofo').value,               // Código do fornecedor
          kmAtual: document.querySelector('#kmAtual').value,         // KM Atual
          dtKm: document.querySelector('#dtKm').value,               // Data do KM
          status: document.querySelector('#status').value,           // Status
          dtStatus: document.querySelector('#dtStatus').value,       // Data do Status
          hrStatus: document.querySelector('#hrStatus').value,       // Hora do Status
          chassi: document.querySelector('#chassi').value,           // Chassi
          cor: document.querySelector('#cor').value,                 // Cor
          nuMO: document.querySelector('#nuMO').value,               // nuMO
          rena: document.querySelector('#rena').value,               // Renavam
          bensCtep: document.querySelector('#bensCtep').value,       // bensCtep
          bensAtiv: document.querySelector('#bensAtiv').value,       // Ativo
          alug: document.querySelector('#alug').value,               // Alugado
          valorAlug: document.querySelector('#valorAlugMain').value,     // Valor Alugado
          fabri: document.querySelector('#fabri').value              // Fabricante
      };

      // Remove campos vazios antes de enviar
Object.keys(formData).forEach(key => {
  if (formData[key] === "") {
      delete formData[key];
  }
});


      try {
          const response = await fetch('http://localhost:3000/api/bens/submit', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(formData)
          });

          const result = await response.json();

          console.log('DADOS BENS:' ,formData)

          if (response.ok) {
              Toastify({
                  text: "Bem cadastrado com sucesso!",
                  duration: 3000,
                  close: true,
                  gravity: "top",
                  position: "center",
                  backgroundColor: "green",
              }).showToast();

              // Limpar o formulário após o sucesso
              document.querySelector('#formRegisterBens').reset();
          } else {

            Toastify({
              text: `Erro ao cadastrar o bem`,
              duration: 3000,
              close: true,
              gravity: "top",
              position: "center",
              backgroundColor: "red",
          }).showToast();
             
          }
      } catch (error) {
          console.error('Erro ao enviar formulário:', error);
          alert('Erro ao enviar os dados.');
      }
  });
  validationFormGoods()
});


  async function loadSelectOptions(url, selectId, fieldName , name) {
    try {
        const response = await fetch(url);
        const result = await response.json();
        
        console.log('resposta da api:' , result)
        
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
 
          // Debug
            if (!item.hasOwnProperty(fieldName)) {
                console.warn(`Campo '${fieldName}' não encontrado em`, item);
                return;
            }

            if (!item.hasOwnProperty(name)) {
              console.warn(`Campo '${name}' não encontrado em`, item);
              return;
          }

            const option = document.createElement("option");
            option.value = item[fieldName];
            option.textContent = item[name];
            select.appendChild(option);
        });
 
    } catch (error) {
        console.error(`Erro ao carregar os dados para ${selectId}:`, error);
    }
};

// Chamar a função corretamente ao carregar a página
document.querySelector('.registerGoods').addEventListener('click' , ()=>{
  loadSelectOptions("/api/codefamilyben", "cofa", 'fabecode'  ,"fabedesc");
  loadSelectOptions("/api/codeforn", "cofo", 'forncode' , "fornnome");
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
        const statusCell = linha.insertCell();
        statusCell.textContent = bem.bensstat;
        statusCell.classList.add("status-bem");
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

  const token = localStorage.getItem('token'); 

  if (!token) {
    Toastify({
      text: "Você precisa estar autenticado para deletar o bem!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
      return;
  }
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

  await deleteBem(bemId, selectedCheckbox.closest("tr") , token);
});

//deleteBens
async function deleteBem(id, bemItem , token) {
  try {
    const response = await fetch(`/api/delete/${id}`, {
      method: "DELETE",
      headers:{ 
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      }
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
        text:  data.error || "Erro na exclusão do Bem",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
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
      if (elemento) {
        if (elemento.type === "date" && valor) {
          const dataFormatada = new Date(valor).toISOString().split('T')[0];
          elemento.value = dataFormatada;
        } else {
          elemento.value = valor || ""; 
        }
      } else {
        console.warn(`Elemento com ID '${id}' não encontrado.`);
      }
    });

    document.querySelector(".editForm").style.display = "flex";
    document.querySelector(".listingBens").style.display = "none";
    document.querySelector(".btnPageListGoods").style.display = "none";
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateBem),
      });
      console.log('uptade date' , updateBem)

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
