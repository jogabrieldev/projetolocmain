// botoes relacionado aos clientes

const btnRegisterClient = document.querySelector(".btnCadClie");
btnRegisterClient.addEventListener("click", () => {

  const containerAppClient = document.querySelector(".containerAppClient");
    containerAppClient.style.display = "flex";

  const listingClient = document.querySelector(".listClient");
     listingClient.style.display = "flex";

  const btnMainPage = document.querySelector(".buttonsMainPage");
   btnMainPage.style.display = "flex";

  const containerAppForn = document.querySelector(".containerAppForn")
    containerAppForn.style.display = 'none'

  const containerAppProd = document.querySelector('.containerAppProd')
  containerAppProd.style.display = 'none';

  const containerAppFabri = document.querySelector('.containerAppFabri')
    containerAppFabri.style.display = 'none'

  const containerAppDriver = document.querySelector('.containerAppDriver')
    containerAppDriver.style.display = 'none'
    
  const containerAppTypeProd = document.querySelector('.containerAppTipoProd')
  containerAppTypeProd.style.display = 'none'

  const containerAppBens = document.querySelector(".containerAppBens");
   containerAppBens.style.display = "none";

  const containerFormEdit = document.querySelector('.formEditClient')
    containerFormEdit.style.display = 'none'

  formRegisterClient.style.display = "none";

  const informative = document.querySelector('.information')
   informative.style.display = 'block'
    informative.textContent = 'SEÇÃO CLIENTE'
    
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
 event.preventDefault()

  const listingClient = document.querySelector(".listClient");
    listingClient.style.display = 'flex'

  const btnMainPage = document.querySelector(".buttonsMainPage");
     btnMainPage.style.display  ='flex'

  const containeFormClient = document.querySelector('#formRegisterClient')
  containeFormClient.style.display = 'none'

  
});
const buttonOutPageEdit = document.querySelector(".outPageEditClient");
buttonOutPageEdit.addEventListener("click", (event) => {
  event.preventDefault();
   
  const listingClient = document.querySelector(".listClient");
      listingClient.style.display = 'flex'

  const btnMainPage = document.querySelector(".buttonsMainPage");
     btnMainPage.style.display  ='flex'

  const containerEditClient = document.querySelector('.formEditClient')
  containerEditClient.style.display = 'none'

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
      
  // });

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

        const formatDate = (isoDate) => {
          if (!isoDate) return "";
          const dateObj = new Date(isoDate);
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, "0");
          const day = String(dateObj.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };

        linha.insertCell().textContent = formatDate(cliente.cliedtcd);
        linha.insertCell().textContent = formatDate(cliente.cliedtnc);
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
      text: "Selecione um Cliente para excluir",
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
      { id: "editClieCode", valor: clientSelecionado.cliecode },
      { id: "editClieName", valor: clientSelecionado.clienome },
      { id: "editCliecpf", valor: clientSelecionado.cliecpf },
      { id: "editClieDtCad", valor: clientSelecionado.cliedtcd },
      { id: "editClieDtNasc", valor: clientSelecionado.cliedtnc },
      { id: "editClieCelu", valor: clientSelecionado.cliecelu },
      { id: "editClieCity", valor: clientSelecionado.cliecity },
      { id: "editClieEstd", valor: clientSelecionado.clieestd },
      { id: "editClieRua", valor: clientSelecionado.clierua },
      { id: "editClieCep", valor: clientSelecionado.cliecep },
      { id: "editClieMail", valor: clientSelecionado.cliemail },
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
      cliecode: document.getElementById("editClieCode").value,
      clienome: document.getElementById("editClieName").value,
      cliecpf: document.getElementById("editCliecpf").value,
      cliedtcd: document.getElementById("editClieDtCad").value || null,
      cliedtnc: document.getElementById("editClieDtNasc").value || null,
      cliecelu: document.getElementById("editClieCelu").value,
      cliecity: document.getElementById("editClieCity").value,
      clieestd: document.getElementById("editClieEstd").value,
      clierua: document.getElementById("editClieRua").value,
      cliecep: document.getElementById("editClieCep").value,
      cliemail: document.getElementById("editClieMail").value,
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
          backgroundColor: "green",
        }).showToast();

        document.querySelector("#formEditRegisterClient").reset()

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
