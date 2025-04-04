const btnAtivRegister = document.querySelector(".btnAtivRegister");
btnAtivRegister.addEventListener("click", () => {
  const informative = document.querySelector(".information");
  informative.style.display = "block";
  informative.textContent = "SEÇÃO CADASTROS";

  document.querySelector(".btnCadBens").style.display = "flex";
  document.querySelector(".btnCadAutomo").style.display = "flex";
  document.querySelector(".btnCadClie").style.display = "flex";
  document.querySelector(".btnCadForn").style.display = "flex";
  document.querySelector(".btnCadProd").style.display = "flex";
  document.querySelector(".btnCadFabri").style.display = "flex";
  document.querySelector(".btnCadTypeProd").style.display = "flex";
  document.querySelector(".btnCadMotorista").style.display = "flex";
  document.querySelector('.outSectionRegister').style.display = "flex"

  //none
  document.querySelector(".delivery").style.display = "none";
  document.querySelector(".btnLogistic").style.display = "none";
  document.querySelector(".btnRegisterLocation").style.display = "none";
});

const btnOutSectionRegister =  document.querySelector('.outSectionRegister')
btnOutSectionRegister.addEventListener('click' , ()=>{

  document.querySelector(".btnCadBens").style.display = "none";
  document.querySelector(".btnCadAutomo").style.display = "none";
  document.querySelector(".btnCadClie").style.display = "none";
  document.querySelector(".btnCadForn").style.display = "none";
  document.querySelector(".btnCadProd").style.display = "none";
  document.querySelector(".btnCadFabri").style.display = "none";
  document.querySelector(".btnCadTypeProd").style.display = "none";
  document.querySelector(".btnCadMotorista").style.display = "none";
  document.querySelector('.outSectionRegister').style.display = "none"

  document.querySelector(".delivery").style.display = "flex";
  document.querySelector(".btnLogistic").style.display = "flex";
  document.querySelector(".btnRegisterLocation").style.display = "flex";
})

const btnLocation = document.querySelector(".btnRegisterLocation");
btnLocation.addEventListener("click", () => {
  const informative = document.querySelector(".information");
  informative.style.display = "block";
  informative.textContent = "SEÇÃO LOCAÇÃO";

  const containerAppLocation = document.querySelector(".containerAppLocation");
  containerAppLocation.style.display = "flex";

  const containerLogistica = document.querySelector(".containerLogistica");
  containerLogistica.style.display = "none";

  const deliveryFinish = document.querySelector(".deliveryFinish");
  deliveryFinish.style.display = "none";
});

const registerLocation = document.querySelector(".registerLocation");
registerLocation.addEventListener("click", () => {
  const contentLocation = document.querySelector(".content");
  contentLocation.style.display = "flex";

  const formClient = document.querySelector("#formClient");
  formClient.style.display = "flex";

  const infoClient = document.querySelector(".infoClient");
  infoClient.style.display = "flex";

  const familyBens = document.querySelector(".familyBens");
  familyBens.style.display = "flex";

  const tableLocation = document.querySelector(".tableLocation");
  tableLocation.style.display = "none";

  const btnInitPageMainLoc = document.querySelector(".btnInitPageMainLoc");
  btnInitPageMainLoc.style.display = "none";
});

const outPageRegisterLocation = document.querySelector(".outLocation");
outPageRegisterLocation.addEventListener("click", () => {
  const contentLocation = document.querySelector(".content");
  contentLocation.style.display = "none";

  const tableLocation = document.querySelector(".tableLocation");
  tableLocation.style.display = "flex";

  const btnInitPageMainLoc = document.querySelector(".btnInitPageMainLoc");
  btnInitPageMainLoc.style.display = "flex";
});
const locBtnRegisterClient = document.querySelector(".locCadClient");
locBtnRegisterClient.addEventListener("click", (event) => {
  event.preventDefault();

  const LocRegisterClient = document.querySelector(".LocRegisterClient");
  LocRegisterClient.style.display = "flex";

  const familyBens = document.querySelector(".familyBens");
  familyBens.style.display = "none";

  const informationClient = document.querySelector(".informationClient");
  informationClient.style.display = "none";
});

const btnOutInitLoc = document.querySelector(".btnOutInitLoc");
btnOutInitLoc.addEventListener("click", (event) => {
  event.preventDefault();

  const LocRegisterClient = document.querySelector(".LocRegisterClient");
  LocRegisterClient.style.display = "none";

  const familyBens = document.querySelector(".familyBens");
  familyBens.style.display = "block";

  const informationClient = document.querySelector(".informationClient");
  informationClient.style.display = "flex";
});

const buttonOutPageLocation = document.querySelector(".outLocation");
buttonOutPageLocation.addEventListener("click", () => {
  const formClientLocation = document.querySelector("#formClient");
  formClientLocation.style.display = "none";

  const informationClient = document.querySelector(".infoClient");
  informationClient.style.display = "none";

  const containerFamilyBens = document.querySelector(".familyBens");
  containerFamilyBens.style.display = "none";

  const tableDivLocation = document.querySelector(".tableLocation");
  tableDivLocation.style.display = "block";

  const containerMainBtnPage = document.querySelector(".btnInitPageMainLoc");
  containerMainBtnPage.style.display = "flex";
});

function atualizarDataHora() {
  const agora = new Date();

  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  const horas = String(agora.getHours()).padStart(2, "0");
  const minutos = String(agora.getMinutes()).padStart(2, "0");

  const dataHoraFormatada = `${ano}-${mes}-${dia}T${horas}:${minutos}`;

  document.getElementById("dataLoc").value = dataHoraFormatada;
}
setInterval(atualizarDataHora, 1000);

async function obterNumeroLocacao() {
  try {
    const response = await fetch("/api/generateNumber", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Erro ao obter número de locação do servidor.");
    }

    const data = await response.json();
    return data.numericLocation; 
  } catch (error) {
    console.error("Erro ao gerar número de locação:", error);
    throw error;
  }
};

// VERIFICA SE OS CAMPOS DOS CLIENTES ESTA OK
function verificarPreenchimentoCliente() {
  const inputsCliente = [
    "nameClient",
    "cpfClient",
    "ruaClient",
    "cityClient",
    "cepClient",
    "mailClient",
  ];

  // Verifica se algum campo está vazio
  const todosPreenchidos = inputsCliente.every((id) => {
    const input = document.getElementById(id);
    return input && input.value.trim() !== "";
  });
};

//ATUALIZAÇÃO DA TABELA DE LOCAÇAO EM RUNTIME
const socketUpdateContainerLocation = io()
document.addEventListener('DOMContentLoaded' , ()=>{
   
  socketUpdateContainerLocation.on("updateRunTimeRegisterLocation", (listLocation) => {
    const listaLocacoes = listLocation.map((locacao) => {
      if (locacao.bens.length > 0) {
        return locacao.bens.map((bem) => ({
          idClient: locacao.clloid,
          numeroLocacao: locacao.cllonmlo || "Não definido",
          nomeCliente: locacao.clloclno || "Não definido",
          cpfCliente: locacao.cllocpf || "Não definido",
          dataLocacao: formatDate(locacao.cllodtlo),
          dataDevolucao: formatDate(locacao.cllodtdv),
          formaPagamento: locacao.cllopgmt || "Não definido",
          codigoBem: bem.bencodb || "-",
          produto: bem.beloben || "Nenhum bem associado",
          quantidade: bem.beloqntd || "-",
          status: bem.belostat || "Não definido",
          observacao: bem.beloobsv || "Sem observação",
          dataInicio: formatDate(bem.belodtin),
          dataFim: formatDate(bem.belodtfi),
        }));
      } else {
        return [
          {
            idClient: locacao.clloid,
            numeroLocacao: locacao.cllonmlo || "Não definido",
            nomeCliente: locacao.clloclno || "Não definido",
            cpfCliente: locacao.cllocpf || "Não definido",
            dataLocacao: formatDate(locacao.cllodtlo),
            dataDevolucao: formatDate(locacao.cllodtdv),
            formaPagamento: locacao.cllopgmt || "Não definido",
            codigoBem: "-",
            produto: "Nenhum bem associado",
            quantidade: "-",
            status: "-",
            observacao: "Nenhuma observação",
            dataInicio: "-",
            dataFim: "-",
          },
        ];
      }
    }).flat(); 

    renderTable(listaLocacoes); 
  });

  socketUpdateContainerLocation.on("updateRunTimeFamilyBens", (updatedFamily) => {
    carregarFamilias(); 
});
})

// BUSCAR CLIENTE E VERIFICAR SE ELE JA TEM CADASTRO.
const searchClient = document.querySelector("#search");
searchClient.addEventListener("click", async (event) => {
  event.preventDefault();
  const inputSearchClient = document.querySelector("#client").value.trim();

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
    const response = await fetch("/api/listclient", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const clientes = await response.json();

    // Função para normalizar textos (remover acentos e converter para minúsculas)
    const normalizeText = (text) => {
      return text
        ? text
            .normalize("NFD") 
            .replace(/[\u0300-\u036f]/g, "") 
            .toLowerCase()
        : "";
    };

    // Função para remover caracteres não numéricos do CPF
    const normalizeCPF = (cpf) => cpf.replace(/\D/g, "");

    // Normaliza entrada do usuário
    const inputNormalized = normalizeText(inputSearchClient);
    const inputCpfNormalized = normalizeCPF(inputSearchClient);

    // Filtrando clientes
    const clienteEncontrado = clientes.filter((cliente) => {
      const nomeNormalizado = normalizeText(cliente.clienome);
      const cpfNormalizado = normalizeCPF(cliente.cliecpf);

      return nomeNormalizado.includes(inputNormalized) || cpfNormalizado === inputCpfNormalized;
    });

    const resultDiv = document.querySelector(".searchClient");
    resultDiv.innerHTML = ""; // Limpa os resultados anteriores

// Verifica se encontrou apenas um cliente e já preenche automaticamente
if (clienteEncontrado.length === 1) {
  const cliente = clienteEncontrado[0];

  document.querySelector('#nameClient').value = cliente.clienome || '';
  document.querySelector('#cpfClient').value = cliente.cliecpf || '';
  document.querySelector('#ruaClient').value = cliente.clierua || '';
  document.querySelector('#cityClient').value = cliente.cliecity || '';
  document.querySelector('#cepClient').value = cliente.cliecep || '';
  document.querySelector('#mailClient').value = cliente.cliemail || '';

  resultDiv.style.display = "none"; 

  verificarPreenchimentoCliente();

  Toastify({
    text: `Cliente "${cliente.clienome}" encontrado com sucesso!`,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "center",
    backgroundColor: "green",
  }).showToast();
} else if (clienteEncontrado.length > 1) {
 
  clienteEncontrado.forEach((cliente) => {
    const checkboxSelect = document.createElement('input');
    checkboxSelect.type = 'checkbox';
    checkboxSelect.name = 'selectClient';
    checkboxSelect.value = cliente.cliecode;
    checkboxSelect.style.marginRight = '10px';

    
    const clienteDiv = document.createElement("div");
    clienteDiv.classList.add("cliente-info");
    clienteDiv.style.border = "2px solid #000000";
    clienteDiv.style.margin = "10px";
    clienteDiv.style.padding = "10px";
    clienteDiv.style.borderRadius = "5px";
    clienteDiv.style.backgroundColor = "#f9f9f9";
    clienteDiv.style.display = "flex";
    clienteDiv.style.alignItems = "flex-start";
    clienteDiv.style.gap = "10px";

    const infoDiv = document.createElement("div");
    infoDiv.innerHTML = `
      <p><strong>Nome:</strong> ${cliente.clienome || "N/A"}</p>
      <p><strong>CPF:</strong> ${cliente.cliecpf || "N/A"}</p>
      <p><strong>Rua:</strong> ${cliente.clierua || "N/A"}</p>
      <p><strong>Cidade:</strong> ${cliente.cliecity || "N/A"}</p>
      <p><strong>CEP:</strong> ${cliente.cliecep || "N/A"}</p>
      <p><strong>Email:</strong> ${cliente.cliemail || "N/A"}</p>
    `;

  const buttonOutContainerSearch =  document.createElement('button')
  buttonOutContainerSearch.textContent = "Voltar"
  buttonOutContainerSearch.style.cursor = "pointer"
  buttonOutContainerSearch.addEventListener('click' , ()=>{
    resultDiv.style.display = 'none'
  })

    checkboxSelect.addEventListener('change', (event) => {
      if (event.target.checked) {
     
        document.querySelectorAll('input[name="selectClient"]').forEach(cb => {
          if (cb !== event.target) cb.checked = false;
        });

        // Preenche os campos
        document.querySelector('#nameClient').value = cliente.clienome || '';
        document.querySelector('#cpfClient').value = cliente.cliecpf || '';
        document.querySelector('#ruaClient').value = cliente.clierua || '';
        document.querySelector('#cityClient').value = cliente.cliecity || '';
        document.querySelector('#cepClient').value = cliente.cliecep || '';
        document.querySelector('#mailClient').value = cliente.cliemail || '';

        // Oculta a div com os resultados
        resultDiv.style.display = "none";

        Toastify({
          text: `Cliente "${cliente.clienome}" selecionado com sucesso!`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();
      }
    });

    clienteDiv.appendChild(checkboxSelect);
    clienteDiv.appendChild(infoDiv);
    clienteDiv.appendChild(buttonOutContainerSearch)
    resultDiv.appendChild(clienteDiv);
  });
   
 
  resultDiv.style.display = "flex";
  resultDiv.style.flexDirection = "column";

  Toastify({
    text: `Foram encontrados ${clienteEncontrado.length} clientes com o critério "${inputSearchClient}"`,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "center",
    backgroundColor: "orange",
  }).showToast();
} else {
  
  Toastify({
    text: `Cliente "${inputSearchClient}" não encontrado.`,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "center",
    backgroundColor: "red",
  }).showToast();
}

  } catch (error) {
    console.error("Erro ao validar o cliente:", error);
    Toastify({
      text: "Erro ao validar o cliente. Tente novamente mais tarde.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
  }
});

// CARREGAR CODIGO DA FAMILIA
async function carregarFamilias() {
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
    const response = await fetch("/api/codefamilybens" , {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
    });
    if (!response.ok) {
      throw new Error("Erro ao buscar famílias de bens");
    }

    const familias = await response.json();

    for (let i = 1; i <= 4; i++) {
      const select = document.getElementById(`family${i}`);

      select.addEventListener("change", () => preencherProduto(i, familias));

      familias.forEach(({ fabecode }) => {
        const option = document.createElement("option");
        option.value = fabecode;
        option.textContent = fabecode;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Erro ao carregar famílias de bens:", error);
    Toastify({
      text: "Erro ao carregar famílias de bens. Tente novamente mais tarde.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
  }
}
//PREECHER  DISCRIÇÃO DO PRODUTO QUE FOI LOCADO
function preencherProduto(index, familias) {
  const select = document.getElementById(`family${index}`);
  const inputProduto = document.getElementById(`produto${index}`);
  const codigoSelecionado = select.value;

 
  const familiaSelecionada = familias.find(
    (familia) => familia.fabecode === codigoSelecionado
  );

  if (familiaSelecionada) {
    inputProduto.value = familiaSelecionada.fabedesc || "Sem nome definido";
  } else {
    inputProduto.value = "";
  }
}

function clearFields() {
  document.querySelector("#numeroLocation").value = "";
  document.querySelector("#client").value = "";
  document.querySelector("#nameClient").value = "";
  document.querySelector("#cpfClient").value = "";
  document.getElementById("dataLoc").value = "";
  document.getElementById("DataDevo").value = "";
  document.getElementById("pagament").value = "";
  document.getElementById("ruaClient").value = "";
  document.getElementById("cityClient").value = "";
  document.getElementById("cepClient").value = "";
  document.getElementById("mailClient").value = "";
}

document.addEventListener("DOMContentLoaded", carregarFamilias);

// ENVIO DA LOCAÇÃO FINALIZADA
async function handleSubmit() {
  const totalGrups = 4;
  const bens = [];

  // Capturar dados dos grupos
  for (let i = 1; i <= totalGrups; i++) {
    const codeBen = document.getElementById(`family${i}`)?.value || "";
    const produto = document.getElementById(`produto${i}`)?.value || "";
    const quantidade = document.getElementById(`quantidade${i}`)?.value || "";
    const observacao = document.getElementById(`observacao${i}`)?.value || "";
    const dataInicio = document.getElementById(`dataInicio${i}`)?.value || "";
    const dataFim = document.getElementById(`dataFim${i}`)?.value || "";

    if (
      codeBen &&
      dataFim &&
      dataInicio &&
      observacao &&
      produto &&
      quantidade
    ) {
      bens.push({
        codeBen,
        observacao,
        dataInicio,
        dataFim,
        quantidade,
        produto,
        status: "Pendente",
      });
    }
  }

  if (bens.length === 0) {
    console.error("Nenhum grupo válido foi preenchido.");
    Toastify({
      text: "Preencha ao menos um grupo de bens corretamente.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return;
  }

  try {
    const numericLocation = await obterNumeroLocacao();
    document.querySelector("#numeroLocation").value = numericLocation;
    const nameClient = document.querySelector("#nameClient").value;
    const cpfClient = document.querySelector("#cpfClient").value;

    const userClientValidade = [nameClient, cpfClient];
    const dataLoc = document.getElementById("dataLoc")?.value || null;
    const dataDevo = document.getElementById("DataDevo")?.value || null;
    const pagament = document.getElementById("pagament")?.value || null;

    if (!dataDevo || !pagament) {
      Toastify({
        text: "Insira a data de devolução e a Forma de pagamento",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "Red",
      }).showToast();

      return;
    }

    const payload = {
      numericLocation,
      userClientValidade,
      dataLoc,
      dataDevo,
      pagament,
      bens,
    }; 

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

    const response = await fetch("/api/datalocation", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      Toastify({
        text: "Contrato de locação gerado com sucesso!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();

      gerarContrato();

      setTimeout(() => {
        clearFields();
      }, 500);
    } else {
      Toastify({
        text: "Erro na locaçao!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "Red",
      }).showToast();
    }
  } catch (error) {
    console.error("Erro ao enviar os dados:", error);
    Toastify({
      text: "Erro ao enviar os dados, verifique se os campos estão todos preechidos!",
      duration: 4000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
  }
}

// BUSCAR CLIENTE
async function buscarNomeCliente(cpf) {
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
    const response = await fetch(`/api/client?cpf=${cpf}` , {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    });
    if (response.ok) {
      const data = await response.json();
      return data.nome || "Nome não encontrado";
    } else {
      console.error("Erro ao buscar cliente:", response.statusText);
      return "Nome não encontrado";
    }
  } catch (error) {
    console.error("Erro ao conectar à API:", error);
    return "Erro ao buscar cliente";
  }
}

// CONTRATO COM OS DADOS A LOCAÇÃO
async function gerarContrato() {
 
  const cpfCliente =
    document.getElementById("cpfClient")?.value || "Não informado";

  const nomeCliente =
    document.getElementById("nameClient")?.value || "Não informado";

  const dataLocacao =
    document.getElementById("dataLoc")?.value || "Não informado";

  const dataDevolucao =
    document.getElementById("DataDevo")?.value || "Não informado";

  const numericLocation =
    document.getElementById("numeroLocation")?.value || "Não informado";

  const pagamento =
    document.getElementById("pagament")?.value || "Não informado";

  const gruposBens = [];
  for (let i = 1; i <= 4; i++) {
    const codeBen =
      document.getElementById(`family${i}`)?.value || "Não informado";

    const produto =
      document.getElementById(`produto${i}`)?.value || "Não informado";

    const quantidade =
      document.getElementById(`quantidade${i}`)?.value || "Não informado";

    const observacao =
      document.getElementById(`observacao${i}`)?.value || "Não informado";

    const dataInit =
      document.getElementById(`dataInicio${i}`)?.value || "Não informado";

    const dataFim =
      document.getElementById(`dataFim${i}`)?.value || "Não informado";

    if (produto !== "Não informado") {
      gruposBens.push(`
        <tr>
          <td>${codeBen}</td>
          <td>${produto}</td>
          <td>${quantidade}</td>
          <td>${observacao}</td>
          <td>${dataInit}</td>
          <td>${dataFim}</td>
        </tr>
      `);
    }
  }

  // Esconder as outras divs
  document.querySelector(".content").style.display = "none";

  // Gerar conteúdo do contrato
  const contratoDiv = document.getElementById("contrato");
  contratoDiv.innerHTML = `
    <h2>Contrato de Locação</h2>
    <hr>
    <p><strong>Numero da locação:</strong>${numericLocation}</p>
    <p><strong>Nome do Cliente:</strong> ${nomeCliente}</p>
    <p><strong>CPF do Cliente:</strong> ${cpfCliente}</p>
    <p><strong>Data da Locação:</strong> ${dataLocacao}</p>
    <p><strong>Data de Devolução:</strong> ${dataDevolucao}</p>
    <p><strong>Forma de Pagamento:</strong> ${pagamento}</p>
    <hr>
    <p><strong>Itens Locados:</strong></p>
    ${
      gruposBens.length > 0
        ? `<table border="1" style="width: 30%; text-align: left; border-collapse: collapse;" class = "tableContrato">
            <thead>
              <tr>
                <th>Código do Bem</th>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Descrição</th>
                <th>Data de Inicio</th>
                <th>Data Final</th>
              </tr>
            </thead>
            <tbody>
              ${gruposBens.join("")}
            </tbody>
          </table>`
        : "<p>Nenhum item informado.</p>"
    }
    <button id="voltar">Voltar</button>
  `;
  contratoDiv.style.display = "block";

  // Adicionar evento ao botão de voltar
  document.getElementById("voltar").addEventListener("click", () => {
    contratoDiv.style.display = "none";

    document.querySelector(".content").style.display = "flex";
  });
}

// cadastrar o cliente pela a tela de locação
const formRegisterClientLoc = document.querySelector("#formRegisterClientLoc");
formRegisterClientLoc.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  if (
    Object.keys(data).length === 0 ||
    Object.values(data).some((val) => val === "")
  ) {

    Toastify({
      text: "Por favor, preencha o formulário antes de enviar.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return;
  }
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
    await fetch("/api/client/submit", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.ok) {
        console.log("deu certo");

        Toastify({
          text: "Cadastrado com Sucesso",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();

        document.querySelector("#formRegisterClientLoc").reset();
      } else {
        console.log("deu erro viu");

        Toastify({
          text: "Erro no cadastro",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
      }
    });
  } catch (error) {
    console.error("deu erro no envio", error);
  }
});
