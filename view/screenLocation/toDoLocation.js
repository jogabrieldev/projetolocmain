document.querySelector(".btnCadBens").style.display = "none";
document.querySelector(".btnCadClie").style.display = "none";
document.querySelector(".btnCadForn").style.display = "none";
document.querySelector(".btnCadProd").style.display = "none";
document.querySelector(".btnCadFabri").style.display = "none";
document.querySelector(".btnCadTypeProd").style.display = "none";
document.querySelector(".btnCadMotorista").style.display = "none";

const btnAtivRegister = document.querySelector(".btnAtivRegister");
btnAtivRegister.addEventListener("click", () => {
  const informative = document.querySelector(".information");
  informative.style.display = "block";
  informative.textContent = "SEÇÃO CADASTROS";

  document.querySelector(".btnCadBens").style.display = "flex";
  document.querySelector(".btnCadClie").style.display = "flex";
  document.querySelector(".btnCadForn").style.display = "flex";
  document.querySelector(".btnCadProd").style.display = "flex";
  document.querySelector(".btnCadFabri").style.display = "flex";
  document.querySelector(".btnCadTypeProd").style.display = "flex";
  document.querySelector(".btnCadMotorista").style.display = "flex";

  //none
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

});

const registerLocation = document.querySelector('.registerLocation')
registerLocation.addEventListener('click' , ()=>{
     
   const contentLocation = document.querySelector('.content')
   contentLocation.style.display = 'flex'

   const tableLocation = document.querySelector('.tableLocation')
   tableLocation.style.display = 'none'

   const btnInitPageMainLoc = document.querySelector('.btnInitPageMainLoc')
   btnInitPageMainLoc.style.display = 'none'
})

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


// data e hora em tempo REAL
function atualizarDataHora() {
  const agora = new Date();

  // Formata data e hora no padrão YYYY-MM-DDTHH:MM
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  const horas = String(agora.getHours()).padStart(2, '0');
  const minutos = String(agora.getMinutes()).padStart(2, '0');

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

  // Se todos estiverem preenchidos, gera o número de locação
  if (todosPreenchidos) {
    gerarNumeroLocacao();
  }
}

// Buscar cliente para verificar se tem cadastro
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

    const clienteEncontrado = clientes.find(
      (cliente) => cliente.clienome === inputSearchClient
    );
    const clienteEncontradoCpf = clientes.find(
      (cliente) => cliente.cliecpf === inputSearchClient
    );

    const clientGeral = clienteEncontrado || clienteEncontradoCpf;

    if (clientGeral) {
      console.log("Cliente encontrado:", clientGeral);

      Toastify({
        text: `Cliente "${inputSearchClient}" encontrado com sucesso!`,
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();

      const infoClientDiv = document.querySelector(".infoClient");

      // Formatação de data
      const formatData = (data) => {
        if (!data) return "";
        const dateObj = new Date(data);
        return new Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(dateObj);
      };

      // Preencher os inputs com os dados do cliente
      document.getElementById("nameClient").value = clientGeral.clienome || "";
      document.getElementById("cpfClient").value = clientGeral.cliecpf || "";
      document.getElementById("ruaClient").value = clientGeral.clierua || "";
      document.getElementById("cityClient").value = clientGeral.cliecity || "";
      document.getElementById("cepClient").value = clientGeral.cliecep || "";
      document.getElementById("mailClient").value = clientGeral.cliemail || "";


      // Verifica se todos os campos foram preenchidos antes de gerar número de locação
      verificarPreenchimentoCliente();

      return;
    } else {
      console.log("Cliente não encontrado");
      Toastify({
        text: `Cliente "${inputSearchClient}" não encontrado.`,
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
    }
  } catch (error) {
    console.error("Erro ao validar o cliente:", error);
    alert("Erro ao validar o cliente. Tente novamente mais tarde.");
  }
});

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
    alert("Erro ao carregar famílias de bens. Tente novamente mais tarde.");
  }
}

 function preencherProduto(index, familias) {
  const select = document.getElementById(`family${index}`);
  const inputProduto = document.getElementById(`produto${index}`);
  const codigoSelecionado = select.value;

  // Encontra a família correspondente ao código selecionado
  const familiaSelecionada = familias.find(familia => familia.fabecode === codigoSelecionado);

  if (familiaSelecionada) {
    console.log("Família selecionada:", familiaSelecionada); // Verifique os dados retornados
    inputProduto.value = familiaSelecionada.fabedesc|| "Sem nome definido"; // Altere "nome" se necessário
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

    console.log(`Dados do grupo ${i}:`, {  codeBen,
      observacao,
      dataInicio,
      dataFim,
      quantidade,
      produto });

    // Só adiciona ao array se pelo menos um campo estiver preenchido
    if (codeBen || dataFim || dataInicio || observacao|| produto|| quantidade ) {
      bens.push({
        codeBen,
        observacao,
        dataInicio,
        dataFim,
        quantidade,
        produto
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

      const numericLocation = document.querySelector('#numeroLocation').value
      const nameClient = document.querySelector('#nameClient').value
      const cpfClient = document.querySelector('#cpfClient').value

    const userClientValidade = [
     nameClient, cpfClient
    ]
    // console.log( " NOME:" , nameClient ,  "CPF: ", cpfClient)
    const dataLoc = document.getElementById("dataLoc")?.value || null;
    const dataDevo = document.getElementById("DataDevo")?.value || null;
    const pagament = document.getElementById("pagament")?.value || null;

    const payload = {
      numericLocation,
      userClientValidade,
      dataLoc,
      dataDevo,
      pagament,
      bens
    }

    console.log("Payload Locação:", payload);

    const response = await fetch('/api/datalocation', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      Toastify({
        text: "Contrato de locação gerado com sucesso!",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();

      gerarContrato()
       
    } else {  
      Toastify({
        text: "Erro na locaçao!",
        duration: 2000,
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

async function gerarContrato() {

  const cpfCliente = document.getElementById("cpfClient")?.value || "Não informado";
  const nomeCliente = document.getElementById('nameClient')?.value || "Não informado"

  const dataLocacao = document.getElementById("dataLoc")?.value || "Não informado";
  const dataDevolucao = document.getElementById("DataDevo")?.value || "Não informado";
  const numericLocation= document.getElementById("numeroLocation")?.value || "Não informado";
  const pagamento = document.getElementById("pagament")?.value || "Não informado";

  const gruposBens = [];
  for (let i = 1; i <= 4; i++) {
    const codeBen = document.getElementById(`family${i}`)?.value || "Não informado";
    const produto = document.getElementById(`produto${i}`)?.value || "Não informado";
    const quantidade = document.getElementById(`quantidade${i}`)?.value || "Não informado";
    const observacao = document.getElementById(`observacao${i}`)?.value || "Não informado";
    const dataInit = document.getElementById(`dataInicio${i}`)?.value || "Não informado";
    const dataFim = document.getElementById(`dataFim${i}`)?.value || "Não informado";

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
  document.querySelector('.content').style.display = 'none'

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
        ? `<table border="1" style="width: 100%; text-align: left; border-collapse: collapse;">
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
    document.querySelector(".informationMainClient").style.display = "block";
    document.querySelector(".familyBens").style.display = "block";
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
