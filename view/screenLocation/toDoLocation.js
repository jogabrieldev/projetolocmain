// document.querySelector(".btnCadBens").style.display = "none";
// document.querySelector(".btnCadClie").style.display = "none";
// document.querySelector(".btnCadForn").style.display = "none";
// document.querySelector(".btnCadProd").style.display = "none";
// document.querySelector(".btnCadFabri").style.display = "none";
// document.querySelector(".btnCadTypeProd").style.display = "none";
// document.querySelector(".btnCadMotorista").style.display = "none";


const btnAtivRegister = document.querySelector(".btnAtivRegister");
btnAtivRegister.addEventListener("click", () => {
  const informative = document.querySelector(".information");
  informative.style.display = "block";
  informative.textContent = "SEÇÃO CADASTROS";
  
  document.querySelector(".btnCadBens").style.display = "flex";
  document.querySelector(".btnCadAutomo").style.display = "flex"
  document.querySelector(".btnCadClie").style.display = "flex";
  document.querySelector(".btnCadForn").style.display = "flex";
  document.querySelector(".btnCadProd").style.display = "flex";
  document.querySelector(".btnCadFabri").style.display = "flex";
  document.querySelector(".btnCadTypeProd").style.display = "flex";
  document.querySelector(".btnCadMotorista").style.display = "flex";

  //none
  document.querySelector('.btnLogistic').style.display = 'none'
  document.querySelector(".btnRegisterLocation").style.display = "none";
  document.querySelector(".containerAppLocation").style.display = "none";
});

const btnLocation = document.querySelector(".btnRegisterLocation");
btnLocation.addEventListener("click", () => {
  const informative = document.querySelector(".information");
  informative.style.display = "block";
  informative.textContent = "SEÇÃO LOCAÇÃO";

  const containerAppLocation = document.querySelector(".containerAppLocation");
  containerAppLocation.style.display = "flex";

  const btnInitPageMainLoc = document.querySelector(".btnInitPageMainLoc");
  btnInitPageMainLoc.style.display = "flex";

  const containerLogistica = document.querySelector(".containerLogistica");
  containerLogistica.style.display = "none";
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

// data e hora em tempo REAL
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

function gerarNumeroLocacao() {
  let numerosGerados = JSON.parse(localStorage.getItem("numerosLocacao")) || []; // Busca os números já gerados
  let novoNumero;

  do {
    novoNumero = Math.floor(Math.random() * 1000000); // Gera um número aleatório de 0 a 999999
  } while (numerosGerados.includes(novoNumero)); // Verifica se já foi gerado antes

  numerosGerados.push(novoNumero); // Adiciona o novo número na lista
  localStorage.setItem("numerosLocacao", JSON.stringify(numerosGerados)); // Salva no localStorage

  document.getElementById("numeroLocation").value = novoNumero; // Atualiza o campo input
}

// Função para verificar se os inputs do cliente foram preenchidos
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

  if (todosPreenchidos) {
    gerarNumeroLocacao();
  }
}

const searchClient = document.querySelector("#search");
searchClient.addEventListener("click", async (event) => {
  event.preventDefault();
  const inputSearchClient = document.querySelector("#client").value.trim();

  try {
    const response = await fetch("/api/listclient");

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const clientes = await response.json();

    console.log("Clientes da API", clientes);

    const clienteEncontrado = clientes.filter(
      (cliente) =>
        cliente.clienome.toLowerCase().includes(inputSearchClient.toLowerCase()) ||
      cliente.cliecpf === inputSearchClient
    );

    const resultDiv = document.querySelector(".searchClient");

    if (clienteEncontrado.length > 1) {
      resultDiv.innerHTML = "";

      clienteEncontrado.forEach((cliente) => {
        const clienteDiv = document.createElement("div");
        clienteDiv.classList.add("cliente-info");
        clienteDiv.style.border = "2px solid  #000000";
        clienteDiv.style.margin = "10px";
        clienteDiv.style.padding = "10px";
        clienteDiv.style.borderRadius = "5px";
        clienteDiv.style.backgroundColor = "#f9f9f9";

        clienteDiv.innerHTML = `
          <p><strong>Nome:</strong> ${cliente.clienome}</p>
          <p><strong>CPF:</strong> ${cliente.cliecpf}</p>
          <p><strong>Rua:</strong> ${cliente.clierua}</p>
          <p><strong>Cidade:</strong> ${cliente.cliecity}</p>
          <p><strong>CEP:</strong> ${cliente.cliecep}</p>
          <p><strong>Email:</strong> ${cliente.cliemail}</p>
        `;

        resultDiv.appendChild(clienteDiv);
      });

      const buttonVoltar = document.createElement("button");
      buttonVoltar.type = "button";
      buttonVoltar.textContent = "Voltar";
      buttonVoltar.classList.add("btnOutSearchClient");
      buttonVoltar.addEventListener("click", () => {
        resultDiv.style.display = "none";
      });

      resultDiv.appendChild(buttonVoltar);

      resultDiv.style.display = "flex";

      Toastify({
        text: `Foram encontrados ${clienteEncontrado.length} clientes com o critério "${inputSearchClient}"`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "orange",
      }).showToast();
    } else if (clienteEncontrado.length === 1) {
      // Preencher os campos com os dados do único cliente encontrado
      const primeiroCliente = clienteEncontrado[0];
      document.getElementById("nameClient").value =
        primeiroCliente.clienome || "";
      document.getElementById("cpfClient").value =
        primeiroCliente.cliecpf || "";
      document.getElementById("ruaClient").value =
        primeiroCliente.clierua || "";
      document.getElementById("cityClient").value =
        primeiroCliente.cliecity || "";
      document.getElementById("cepClient").value =
        primeiroCliente.cliecep || "";
      document.getElementById("mailClient").value =
        primeiroCliente.cliemail || "";

      verificarPreenchimentoCliente();

      Toastify({
        text: `Cliente "${inputSearchClient}" encontrado com sucesso!`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
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

// familia de bens locados
async function carregarFamilias() {
  try {
    const response = await fetch("/api/codefamilybens");
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

function preencherProduto(index, familias) {
  const select = document.getElementById(`family${index}`);
  const inputProduto = document.getElementById(`produto${index}`);
  const codigoSelecionado = select.value;

  // Encontra a família correspondente ao código selecionado
  const familiaSelecionada = familias.find(
    (familia) => familia.fabecode === codigoSelecionado
  );

  if (familiaSelecionada) {
    inputProduto.value = familiaSelecionada.fabedesc || "Sem nome definido"; 
  } else {
    inputProduto.value = "";
  }
}

document.addEventListener("DOMContentLoaded", carregarFamilias);

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

    console.log(`Dados do grupo ${i}:`, {
      codeBen,
      observacao,
      dataInicio,
      dataFim,
      quantidade,
      produto,
    });

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
        status: "Pendente"
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

  console.log("Array de bens final:", bens);

  try {
    const numericLocation = document.querySelector("#numeroLocation").value;
    const nameClient = document.querySelector("#nameClient").value;
    const cpfClient = document.querySelector("#cpfClient").value;

    const userClientValidade = [nameClient, cpfClient];
    const dataLoc = document.getElementById("dataLoc")?.value || null;
    const dataDevo = document.getElementById("DataDevo")?.value || null;
    const pagament = document.getElementById("pagament")?.value || null;

    if(!dataDevo  || !pagament ){
        
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

    const response = await fetch("/api/datalocation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

async function buscarNomeCliente(cpf) {
  try {
    const response = await fetch(`/api/client?cpf=${cpf}`);
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

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const dateObj = new Date(isoDate);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

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
    <p><strong>Numero da Locação:</strong> ${numericLocation}</p>
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
    console.log("Formulario Vazio");
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

  try {
    await fetch("/api/client/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
 


// Editar locação

const buttonEditLocation = document.querySelector(".buttonEditLocation");

buttonEditLocation.addEventListener("click", async () => {
  // Obter o checkbox selecionado
  const selectedCheckbox = document.querySelector(
    'input[name="selecionarLocacao"]:checked'
  );

  if (!selectedCheckbox) {
    Toastify({
      text: "Selecione uma Locação para editar",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return;
  }

  // ID da locação selecionada
  const locationId = selectedCheckbox.value;

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const dateObj = new Date(isoDate);
    return `${dateObj.getFullYear()}/${String(
      dateObj.getMonth() + 1
    ).padStart(2, "0")}/${String(dateObj.getDate()).padStart(2, "0")}`;
  };

  // Buscar os dados da API
  try {
    const response = await fetch("/api/location");
    const result = await response.json();

    const clientLoc = await result.clientes
    const goodsLoc = await result.bens
    
    console.log('cliente' , clientLoc)
    console.log('bens' , goodsLoc)

    // Procurar a locação correspondente ao ID
    const consolidatedLocations = clientLoc.map((cliente) => {
      const bensCliente = goodsLoc.filter(
        (ben) => ben.beloidcl === cliente.clloid
      );

      return {
         ...cliente,           // Inclui os dados do cliente
        ... bensCliente,    // Adiciona os bens associados ao cliente
      };
    });

    // Procurar a locação correspondente ao ID
    const locationToEdit = consolidatedLocations.find(
      (loc) => loc.cllonmlo === locationId
    );

    console.log('locação final' , locationToEdit)

    if (locationToEdit) {
      // Mostrar a área de edição
      const contentMain = document.querySelector(".contentEditlocation");
      contentMain.style.display = "flex";

      // Esconder o botão inicial
      const btnInitPageMainLoc = document.querySelector(".btnInitPageMainLoc");
      btnInitPageMainLoc.style.display = "none";

      // Preencher os campos com os dados obtidos
      document.querySelector("#numeroLocationEdit").value = locationToEdit.cllonmlo || "";
      document.querySelector("#dataLocEdit").value = locationToEdit.cllodtlo
        
      document.querySelector("#DataDevoEdit").value = locationToEdit.cllodtdv
        
      document.querySelector("#pagamentEdit").value = locationToEdit.cllopgmt || "";

      // Preencher os campos adicionais da família de bens
      document.querySelector("#family1").value = locationToEdit.bencodb || "";
      document.querySelector("#produto1").value = locationToEdit.beloben || "";
      document.querySelector("#dataInicio1").value = formatDate((locationToEdit.belodtin))
        
      document.querySelector("#dataFim1").value = formatDate((locationToEdit.belodtfi))
     

      Toastify({
        text: "Locação carregada para edição!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();
    } else {
      Toastify({
        text: "Erro ao carregar a locação. Tente novamente.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
    }
  } catch (error) {
    console.error("Erro ao buscar os dados da API:", error);
    Toastify({
      text: "Erro ao buscar os dados. Verifique a conexão.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
  }
});
