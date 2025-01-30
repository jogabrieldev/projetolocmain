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

  const btnlocationFinish = document.querySelector('.btnlocationFinish')
   btnlocationFinish.style.display = 'flex'

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

// buscar cliente para verificar se tem cadastro.
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

      const informationClientDiv = document.querySelector(".informationClient");
      informationClientDiv.style.display = "flex";
      informationClientDiv.innerHTML = "";

      const table = document.createElement("table");
      table.style.borderCollapse = "collapse";
      table.style.width = "100%";

      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      ["Nome", "CPF","Rua" , "CEP", "Data de Cadastro"].forEach((headerText) => {
        const th = document.createElement("th");
        th.textContent = headerText;
        th.style.border = "1px solid #ccc";
        th.style.padding = "";
        th.style.textAlign = "left";
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      const tbody = document.createElement("tbody");
      const dataRow = document.createElement("tr");

    // formatação de data
      const formData = (data) => {
        if (!data) return 'Data não informada';
        const dateObj = new Date(data);
        return new Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).format(dateObj);
      };

      // Preencher dados do cliente
      [clientGeral.clienome, clientGeral.cliecpf, clientGeral.clierua, clientGeral.cliecep, formData(clientGeral.cliedtcd)].forEach(
        (cellData) => {
          const td = document.createElement("td");
          td.textContent = cellData;
          td.style.border = "1px solid #ccc";
          td.style.padding = "8px";

          dataRow.appendChild(td);
        }
      );

      tbody.appendChild(dataRow);
      table.appendChild(tbody);

      informationClientDiv.appendChild(table);

      setTimeout(() => {
        if (table) {
          table.remove();
        }
      }, 5000);
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

// Chama a função ao carregar a página
document.addEventListener("DOMContentLoaded", carregarFamilias);

async function handleSubmit(event) {
  event.preventDefault();

  const totalGrups = 4;
  const bens = [];

  // Capturar dados dos grupos
  for (let i = 1; i <= totalGrups; i++) {
    const codeBen = document.getElementById(`family${i}`)?.value;
    const produto = document.getElementById(`produto${i}`)?.value;
    const quantidade = document.getElementById(`quantidade${i}`)?.value;
    const descricao = document.getElementById(`descricao${i}`)?.value;

    console.log(`Dados do grupo ${i}:`, { codeBen, produto, quantidade, descricao });

    if (codeBen && produto && quantidade && descricao) {
      bens.push({ codeBen, produto, quantidade, descricao });
    }
  }

  if (bens.length === 0) {
    console.error("Nenhum grupo válido foi preenchido.");
    Toastify({
      text: "Preencha ao menos um grupo de bens corretamente.",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return;
  }

  try {
  
    // Enviar dados do cliente
    const userClientValidade = document.querySelector("#numCpf")?.value || null;
    const dataLoc = document.getElementById("dataLoc")?.value || null;
    const dataDevo = document.getElementById("DataDevo")?.value || null;
    const horaLoc = document.getElementById("horaLoc")?.value || null;
    const pagament = document.getElementById("pagament")?.value || null;

    const payload = {
      userClientValidade,
      dataLoc,
      dataDevo,
      horaLoc,
      pagament,
      bens
    }

    console.log("Payload Locação:", payload);

    const response = await fetch('/api/locclient', {
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
 
  const cpfCliente = document.getElementById("numCpf")?.value || "Não informado";

  const nomeCliente = cpfCliente !== "Não informado" ? await buscarNomeCliente(cpfCliente) : "CPF não informado";

  const dataLocacao = document.getElementById("dataLoc")?.value || "Não informado";
  const dataDevolucao = document.getElementById("DataDevo")?.value || "Não informado";
  const horaLocacao = document.getElementById("horaLoc")?.value || "Não informado";
  const pagamento = document.getElementById("pagament")?.value || "Não informado";

  const gruposBens = [];
  for (let i = 1; i <= 4; i++) {
    const codeBen = document.getElementById(`family${i}`)?.value || "Não informado";
    const produto = document.getElementById(`produto${i}`)?.value || "Não informado";
    const quantidade = document.getElementById(`quantidade${i}`)?.value || "Não informado";
    const descricao = document.getElementById(`descricao${i}`)?.value || "Não informado";

    if (produto !== "Não informado") {
      gruposBens.push(`
        <tr>
          <td>${codeBen}</td>
          <td>${produto}</td>
          <td>${quantidade}</td>
          <td>${descricao}</td>
        </tr>
      `);
    }
  }

  // Esconder as outras divs
  document.querySelector(".informationMainClient").style.display = "none";
  document.querySelector(".familyBens").style.display = "none";
  document.querySelector(".LocRegisterClient").style.display = "none";

  // Gerar conteúdo do contrato
  const contratoDiv = document.getElementById("contrato");
  contratoDiv.innerHTML = `
    <h2>Contrato de Locação</h2>
    <hr>
    <p><strong>Nome do Cliente:</strong> ${nomeCliente}</p>
    <p><strong>CPF do Cliente:</strong> ${cpfCliente}</p>
    <p><strong>Data da Locação:</strong> ${dataLocacao}</p>
    <p><strong>Data de Devolução:</strong> ${dataDevolucao}</p>
    <p><strong>Hora da Locação:</strong> ${horaLocacao}</p>
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
