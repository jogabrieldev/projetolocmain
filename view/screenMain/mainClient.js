// botoes relacionado aos clientes

const btnRegisterGoods = document.querySelector(".btnCadBens");
btnRegisterGoods.addEventListener("click", () => {
  const containerAppClient = document.querySelector(".containerAppClient");
  const containerAppBens = document.querySelector(".containerAppBens");
  const containerAppForn = document.querySelector(".containerAppForn")
    
  containerAppForn.style.display = 'none'

  containerAppClient.style.display = "none";
  containerAppBens.style.display = "flex";
});


const btnRegisterClient = document.querySelector(".btnCadClie");
btnRegisterClient.addEventListener("click", () => {

  const containerAppBens = document.querySelector(".containerAppBens");
  const containerAppClient = document.querySelector(".containerAppClient");
  const listingClient = document.querySelector(".listClient");
  const btnMainPage = document.querySelector(".buttonsMainPage");
  const containerAppForn = document.querySelector(".containerAppForn")
  const containerAppProd = document.querySelector('.containerAppProd')
    
  containerAppForn.style.display = 'none'
  containerAppBens.style.display = "none";
  formRegisterClient.style.display = "none";
  containerAppProd.style.display = 'none';
  

  containerAppClient.style.display = "flex";
  listingClient.style.display = "flex";
  btnMainPage.style.display = "flex";
});

const buttonRegisterClient = document.querySelector(".registerClient");
buttonRegisterClient.addEventListener("click", () => {
  const formRegisterClient = document.querySelector("#formRegisterClient");
  const listingClient = document.querySelector(".listClient");
  const btnMainPage = document.querySelector(".buttonsMainPage");

  formRegisterClient.style.display = "flex";
  btnMainPage.style.display = "none";
  listingClient.style.display = "none";
});

const buttonOutPageClient = document.querySelector(".btnOutInit");
buttonOutPageClient.addEventListener("click", (event) => {
  event.preventDefault();
  const containerAppClient = document.querySelector(".containerAppClient");
  const formEditRegisterClient = document.querySelector(".formEditClient");

  formEditRegisterClient.style.display = "none";

  containerAppClient.style.display = "none";
  return;
});
const buttonOutPageEdit = document.querySelector(".outPageEditClient");
buttonOutPageEdit.addEventListener("click", (event) => {
  event.preventDefault();

  const containerAppClient = document.querySelector(".containerAppClient");
  const formRegisterClient = document.querySelector("#formRegisterClient");
  const formEditRegisterClient = document.querySelector(".formEditClient");

  formEditRegisterClient.style.display = "none";
  formRegisterClient.style.display = "none";
  containerAppClient.style.display = "none";

  return;
});

const buttonEditClient = document.querySelector(".buttonEditClient");
buttonEditClient.addEventListener("click", () => {
  const btnMainPage = document.querySelector(".buttonsMainPage");

  btnMainPage.style.display = "none";
});

const buttonToBack = document.querySelector(".buttonExitClient");
buttonToBack.addEventListener("click", () => {
  const containerAppClient = document.querySelector(".containerAppClient");

  containerAppClient.style.display = "none";
});

//fetch register
const formRegisterClient = document.querySelector("#formRegisterClient");
formRegisterClient.addEventListener("submit", async (event) => {
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

        document.querySelector("#formRegisterClient").reset();
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

//fetch listClient
let clientesData = {};
async function fetchListClientes() {
  try {
    const response = await fetch("/api/listclient");
    const clientes = await response.json();

    // console.log(clientes)

    const clientesListDiv = document.querySelector(".listClient");
    clientesListDiv.innerHTML = "";

    if (clientes.length > 0) {
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
        "CPF",
        "Data de Cadastro",
        "Data de Nascimento",
        "Celular",
        "Cidade",
        "Estado",
        "Rua",
        "CEP",
        "E-mail",
      ];

      colunas.forEach((coluna) => {
        const th = document.createElement("th");
        th.textContent = coluna;
        linhaCabecalho.appendChild(th);
      });

      // Corpo da tabela
      const corpo = tabela.createTBody();
      clientes.forEach((cliente) => {
        const linha = corpo.insertRow();

        linha.setAttribute("data-cliecode", cliente.cliecode);

        const checkboxCell = linha.insertCell();
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "selectCliente";
        checkbox.value = cliente.cliecode;

        const clienteData = JSON.stringify(cliente);
        if (clienteData) {
          checkbox.dataset.cliente = clienteData;
        } else {
          console.warn(`Cliente inválido encontrado:`, cliente);
        }

        checkboxCell.appendChild(checkbox);

        linha.insertCell().textContent = cliente.cliecode;
        linha.insertCell().textContent = cliente.clienome;
        linha.insertCell().textContent = cliente.cliecpf;
        linha.insertCell().textContent = cliente.cliedtcd;
        linha.insertCell().textContent = cliente.cliedtnc;
        linha.insertCell().textContent = cliente.cliecelu;
        linha.insertCell().textContent = cliente.cliecity;
        linha.insertCell().textContent = cliente.clieestd;
        linha.insertCell().textContent = cliente.clierua;
        linha.insertCell().textContent = cliente.cliecep;
        linha.insertCell().textContent = cliente.cliemail;
      });

      // Adiciona a tabela à div
      clientesListDiv.appendChild(tabela);
    } else {
      clientesListDiv.innerHTML = "<p>Nenhum cliente cadastrado.</p>";
    }
  } catch (error) {
    console.error("Erro ao carregar clientes:", error);
    document.querySelector(".listClient").innerHTML =
      "<p>Erro ao carregar clientes.</p>";
  }
}
fetchListClientes();

const buttonDeleteClient = document.querySelector(".buttonDeleteClient");
buttonDeleteClient.addEventListener("click", async () => {
  const selectedCheckbox = document.querySelector(
    'input[name="selectCliente"]:checked'
  );
  if (!selectedCheckbox) {
    Toastify({
      text: "Selecione um item para excluir",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return;
  }

  const clienteSelecionado = JSON.parse(selectedCheckbox.dataset.cliente);
  const clienteId = clienteSelecionado.cliecode;

  const confirmacao = confirm(
    `Tem certeza de que deseja excluir o cliente com código ${clienteId}?`
  );
  if (!confirmacao) {
    return;
  }

  await deleteClient(clienteId, selectedCheckbox.closest("tr"));
});

async function deleteClient(id, clientRow) {
  try {
    const response = await fetch(`/api/deleteclient/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log("Resposta do servidor:", data);

    if (response.ok) {
      Toastify({
        text: "O cliente foi excluído com sucesso!",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();

      clientRow.remove();
    } else {
      console.log("Erro para excluir:", data);
      Toastify({
        text: "Erro na exclusão do cliente",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
    }
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    Toastify({
      text: "Erro ao excluir cliente. Tente novamente.",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
  }
}

// Botão para iniciar a edição
const editButtonClient = document.querySelector(".buttonEditClient");

editButtonClient.addEventListener("click", () => {
  const selectedCheckbox = document.querySelector(
    'input[name="selectCliente"]:checked'
  );

  if (!selectedCheckbox) {
    Toastify({
      text: "Selecione um cliente para editar",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();

    document.querySelector(".buttonsMainPage").style.display = "flex";
    return;
  }

  const clientData = selectedCheckbox.dataset.cliente;

  if (!clientData) {
    console.error("O atributo data-client está vazio ou indefinido.");
    return;
  }

  try {
    const clientSelecionado = JSON.parse(clientData);
    console.log("Editar cliente:", clientSelecionado);

    // Campos e IDs correspondentes
    const campos = [
      { id: "clieCode", valor: clientSelecionado.cliecode },
      { id: "clieName", valor: clientSelecionado.clienome },
      { id: "cpf", valor: clientSelecionado.cliecpf },
      { id: "dtCad", valor: clientSelecionado.cliedtcd },
      { id: "dtNasc", valor: clientSelecionado.cliedtnc },
      { id: "clieCelu", valor: clientSelecionado.cliecelu },
      { id: "clieCity", valor: clientSelecionado.cliecity },
      { id: "clieEstd", valor: clientSelecionado.clieestd },
      { id: "clieRua", valor: clientSelecionado.clierua },
      { id: "clieCep", valor: clientSelecionado.cliecep },
      { id: "clieMail", valor: clientSelecionado.cliemail },
    ];

    // Atualizar valores no formulário
    campos.forEach(({ id, valor }) => {
      const elemento = document.getElementById(id);
      if (elemento) {
        elemento.value = valor || ""; // Preencher com valor ou vazio
      } else {
        console.warn(`Elemento com ID '${id}' não encontrado.`);
      }
    });

    document.querySelector(".formEditClient").style.display = "flex";
    document.querySelector(".listClient").style.display = "none";
  } catch (error) {
    console.error("Erro ao fazer parse de data-client:", error);
  }
});

// Função para enviar os dados atualizados
async function editAndUpdateOfClient() {
  const formEditClient = document.querySelector("#formEditRegisterClient");

  formEditClient.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const selectedCheckbox = document.querySelector(
      'input[name="selectCliente"]:checked'
    );

    if (!selectedCheckbox) {
      console.error("Nenhum cliente foi selecionado.");
      return;
    }

    const clientId = selectedCheckbox.dataset.cliente;

    if (!clientId) {
      console.error("O atributo data-client está vazio ou inválido.");
      return;
    }

    let clientIdParsed;
    try {
      clientIdParsed = JSON.parse(clientId).cliecode;
    } catch (error) {
      console.error("Erro ao fazer parse de clientId:", error);
      return;
    }

    const updateClient = {
      clienome: document.getElementById("clieName").value,
      cliecpf: document.getElementById("cpf").value,
      cliedtcd: document.getElementById("dtCad").value || null,
      cliedtnc: document.getElementById("dtNasc").value || null,
      cliecelu: document.getElementById("clieCelu").value,
      clicity: document.getElementById("clieCity").value,
      clieestd: document.getElementById("clieEstd").value,
      clierua: document.getElementById("clieRua").value,
      cliecep: document.getElementById("clieCep").value,
      cliemail: document.getElementById("clieMail").value,
    };

    try {
      const response = await fetch(`/api/updateclient/${clientIdParsed}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateClient),
      });

      if (response.ok) {
        console.log("Atualização bem-sucedida");
        Toastify({
          text: `Cliente '${clientIdParsed}' atualizado com sucesso!`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        }).showToast();

        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        console.error("Erro ao atualizar cliente:", await response.text());
        Toastify({
          text: "Erro ao atualizar cliente",
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
editAndUpdateOfClient();
