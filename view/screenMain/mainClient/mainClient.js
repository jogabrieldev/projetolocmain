
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expTime = payload.exp * 1000;
    return Date.now() > expTime;
  } catch (error) {
    return true;
  }
}

function maskFieldClient(){
  $("#cpf").mask("000.000.000-00")
    
  $("#clieCelu").mask("(00) 00000-0000");

  $("#clieCep").mask("00000-000");

  $("#editCliecpf").mask("000.000.000-00")
    
  $("#editClieCelu").mask("(00) 00000-0000");

  $("#editClieCep").mask("00000-000");

  $("#clieCepLoc").mask("00000-000");

  $("#clieCeluLoc").mask("(00) 00000-0000");

  $("#cpfClientLoc").mask("000.000.000-00")
}

const formatDate = (isoDate) => {
  if (!isoDate) return "";
  const dateObj = new Date(isoDate);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};
const socketClient = io()

document.addEventListener('DOMContentLoaded' , ()=>{
   
  const btnloadClie = document.querySelector('.btnCadClie')
  if(btnloadClie){

     btnloadClie.addEventListener('click', async (event)=>{
        event.preventDefault()

        try {
          const response = await fetch('/client' ,{
            method: 'GET'
          });
          if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
          const html = await response.text();
          const mainContent = document.querySelector('#mainContent');
          if (mainContent) {
            mainContent.innerHTML = html;
            maskFieldClient()
            interationSystemClient()
            registerNewClient()
            deleteClient()
            editarCliente()
          }else {
            console.error('#mainContent não encontrado no DOM');
            return;
          }


          const containerAppClient = document.querySelector('.containerAppClient');
        if (containerAppClient) containerAppClient.classList.add('flex') ;
  
        const sectionsToHide = [
          '.containerAppProd', '.containerAppFabri', '.containerAppTipoProd',
          '.containerAppDriver', '.containerAppAutomo', '.containerAppBens',
          '.containerAppForn'
        ];
        sectionsToHide.forEach((selector) => {
          const element = document.querySelector(selector);
          if (element) element.style.display = 'none';
        });
  
        const showContentBens = document.querySelector('.showContentBens');
        const btnMainPageClient = document.querySelector('.buttonsMainPage');
        const listingClient = document.querySelector('.listClient');
        const editFormClient = document.querySelector('.formEditClient');
        const informative = document.querySelector('.information');
  
        if (showContentBens) showContentBens.style.display = 'none';
        if (btnMainPageClient) btnMainPageClient.style.display = 'flex';
        if (listingClient) listingClient.style.display = 'flex';
        if (editFormClient) editFormClient.style.display = 'none';
        if (informative) {
          informative.style.display = 'block';
          informative.textContent = 'SEÇÃO CLIENTE';
        }
        
        await fetchListClientes()
        
     }catch(error){
      Toastify({
        text: "Erro na pagina",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
          console.error('Erro na chamada do "CONTENT CLIENT"')
     } 
   });
  };

  socketClient.on("updateClients", (updatedClient) => {
    updateClientInTableRunTime(updatedClient);
  });

  socketClient.on("clienteAtualizado", (clientes) => {
    insertClientTableRunTime(clientes); 
  });
})



 async function interationSystemClient() {

  const buttonRegisterClient = document.querySelector(".registerClient");

  if(buttonRegisterClient){
  buttonRegisterClient.addEventListener("click", () => {

    const formRegisterClient = document.querySelector(".containerOfForm");
    if(formRegisterClient){
      formRegisterClient.classList.remove('hidden')
      formRegisterClient.classList.add('flex')
    }
    
    const listingClient = document.querySelector(".listClient");
    if(listingClient){
      listingClient.classList.remove('flex')
      listingClient.classList.add('hidden')
    }
 
  
    const btnMainPage = document.querySelector(".buttonsMainPage");
    if(btnMainPage){
       btnMainPage.classList.remove('flex')
       btnMainPage.classList.add('hidden')
    }
    return;
  });
 }

const buttonOutPageClient = document.querySelector(".btnOutInit");
 
 if(buttonOutPageClient){
  buttonOutPageClient.addEventListener("click", (event) => {
    event.preventDefault();
  
    const listingClient = document.querySelector(".listClient");
    if(listingClient){
       listingClient.classList.remove('hidden')
       listingClient.classList.add('flex')
    }
    
  
    const btnMainPage = document.querySelector(".buttonsMainPage");
    if(btnMainPage){
      btnMainPage.classList.remove('hidden')   
      btnMainPage.classList.add('flex')
    }
    
    const containeFormClient = document.querySelector(".containerOfForm");
    if(containeFormClient){
      containeFormClient.classList.remove('flex')
      containeFormClient.classList.add('hidden')
    }
    return;
  });
 }

const buttonOutPageEdit = document.querySelector(".outPageEditClient");
  if(buttonOutPageEdit){
    buttonOutPageEdit.addEventListener("click", (event) => {
      event.preventDefault();
    
      const listingClient = document.querySelector(".listClient");
      if(listingClient){
        listingClient.classList.remove('hidden')
        listingClient.classList.add('flex')
      }
    
      const btnMainPage = document.querySelector(".buttonsMainPage");
      if(btnMainPage){
        btnMainPage.classList.remove('hidden')
        btnMainPage.classList.add('flex')
      }
      
      
      const containerEditClient = document.querySelector(".formEditClient");
      if(containerEditClient){
        containerEditClient.classList.remove('flex')
        containerEditClient.classList.add('hidden')
      }
      
      return;
    });
 }

    const buttonToBack = document.querySelector(".buttonExitClient");
    if(buttonToBack){
      buttonToBack.addEventListener("click", () => {
        const containerAppClient = document.querySelector(".containerAppClient");
        containerAppClient.classList.remove('flex')
        containerAppClient.classList.add('hidden')

        const continformation = document.querySelector('.information')
        if(continformation){
          continformation.textContent = 'Sessão ativa'
        }
      });
      return;
    }
}

 async function registerNewClient(){

      document.querySelector(".btnRegisterClient").addEventListener("click", async (event) => {
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
        setTimeout(() => {
          window.location.href = "/index.html";
        }, 2000);
        return;
      }

      if (!$("#formRegisterClient").valid()) {
        return;
      }

      // Captura os valores do formulário
      const formData = {
        clieCode: document.querySelector("#clieCode").value, // Codigo
        clieName: document.querySelector("#clieName").value, // Nome
        cpf: document.querySelector("#cpf").value, // CPF
        dtCad: document.querySelector("#dtCad").value, // Data de Cadastro
        dtNasc: document.querySelector("#dtNasc").value, // Data de Nascimento
        clieCelu: document.querySelector("#clieCelu").value, // Celular
        clieCity: document.querySelector("#clieCity").value, // Cidade
        clieEstd: document.querySelector("#clieEstd").value, // Estado
        clieRua: document.querySelector("#clieRua").value, // Rua
        clieCep: document.querySelector("#clieCep").value, // Cep
        clieMail: document.querySelector("#clieMail").value, // E-mail
      };

      try {
        const response = await fetch("/api/client/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
          Toastify({
            text: "Cliente cadastrado com sucesso!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "green",
          }).showToast();
    
          document.querySelector("#formRegisterClient").reset();
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
            text: "Erro ao cadastrar Cliente",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
          }).showToast();
        }
      } catch (error) {
        console.error("Erro ao enviar formulário:", error);
        alert("Erro ao enviar os dados para o server.");
      }
    });

  validationFormClient();

};


//ATUALIZAR EM TEMPO REAL NA INSERÇÃO
function insertClientTableRunTime(clientes) {
  const clientesListDiv = document.querySelector(".listClient");
  clientesListDiv.innerHTML = "";

  if (clientes.length > 0) {
    const tabela = document.createElement("table");
    tabela.classList.add('tableClient')

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
        checkbox.setAttribute("data-cliente", clienteData);
      } else {
        console.warn(`Cliente inválido encontrado:`, cliente);
      }

      checkboxCell.appendChild(checkbox);

      linha.insertCell().textContent = cliente.cliecode;
      linha.insertCell().textContent = cliente.clienome;
      linha.insertCell().textContent = cliente.cliecpf;
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
}

// LISTAGEM DE CLIENTES
let clientesData = {};
async function fetchListClientes() {
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const clientes = await response.json();

    const clientesListDiv = document.querySelector(".listClient");
    clientesListDiv.innerHTML = "";

    if (clientes.length > 0) {
      const tabela = document.createElement("table");
      tabela.classList.add('tableClient')

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
          checkbox.setAttribute("data-cliente", clienteData);
        } else {
          console.warn(`Cliente inválido encontrado:`, cliente);
        }

        checkboxCell.appendChild(checkbox);

        linha.insertCell().textContent = cliente.cliecode;
        linha.insertCell().textContent = cliente.clienome;
        linha.insertCell().textContent = cliente.cliecpf;
        linha.insertCell().textContent = formatDate(cliente.cliedtcd);
        linha.insertCell().textContent = formatDate(cliente.cliedtnc);
        linha.insertCell().textContent = cliente.cliecelu;
        linha.insertCell().textContent = cliente.cliecity;
        linha.insertCell().textContent = cliente.clieestd;
        linha.insertCell().textContent = cliente.clierua;
        linha.insertCell().textContent = cliente.cliecep;
        linha.insertCell().textContent = cliente.cliemail;
      });

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

// //deletar cliente
function deleteClient(){

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

// função para deletar
async function deleteClient(id, clientRow) {
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
    const response = await fetch(`/api/deleteclient/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      Toastify({
        text: "O Cliente foi excluído com sucesso!",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();

      clientRow.remove();
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
          text: "Erro na exclusão do Cliente",
          duration: 2000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
      }
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
}

function editarCliente(){
     // Botão para iniciar a edição
const editButtonClient = document.querySelector(".buttonEditClient");
editButtonClient.addEventListener("click", () => {
  const selectedCheckbox = document.querySelector(
    'input[name="selectCliente"]:checked'
  );
 
  if (!selectedCheckbox) {
    Toastify({
      text: "Selecione um Cliente para editar",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast(); 
    return;
  }

  const btnMainPageClient = document.querySelector(".buttonsMainPage");
  if(btnMainPageClient){
    btnMainPageClient.classList.remove('flex')
    btnMainPageClient.classList.add('hidden')
  }

  const listClient = document.querySelector(".listClient");
  if(listClient){
    listClient.classList.remove('flex')
    listClient.classList.add('hidden')
  }

const containerEditForm = document.querySelector('.formEditClient')
   if(containerEditForm){
      containerEditForm.classList.remove('hidden')
      containerEditForm.classList.add('flex')
   }

 
  const clientData = selectedCheckbox.getAttribute("data-cliente");

  if (!clientData) {
    console.error("O atributo data-client está vazio ou indefinido.");
    return;
  }

  try {
    const clientSelecionado = JSON.parse(clientData);
    const campos = [
      { id: "editClieCode", valor: clientSelecionado.cliecode },
      { id: "editClieName", valor: clientSelecionado.clienome },
      { id: "editCliecpf", valor: clientSelecionado.cliecpf },
      { id: "editClieDtCad", valor: formatDate(clientSelecionado.cliedtcd) },
      { id: "editClieDtNasc", valor: formatDate(clientSelecionado.cliedtnc) },
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
        if (elemento.type === "date" && valor) {
          // Formata a data para YYYY-MM-DD, caso seja necessário
          const dataFormatada = new Date(valor).toISOString().split("T")[0];
          elemento.value = dataFormatada;
        } else {
          elemento.value = valor || "";
        }
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
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateClient),
      });

      if (response.ok) {
    
        Toastify({
          text: `Cliente '${clientIdParsed}' atualizado com sucesso!`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();

        formEditClient.reset();
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
}

// atualizar a celula da tabela runtime
function updateClientInTableRunTime(updatedClient) {
  const row = document.querySelector(
    `[data-cliecode="${updatedClient.cliecode}"]`
  );

  if (row) {
    
    row.cells[2].textContent = updatedClient.clienome || "-"; // Nome
    row.cells[3].textContent = updatedClient.cliecpf || "-"; // CPF
    row.cells[4].textContent = formatDate(updatedClient.cliedtcd) || "-"; // Data de Cadastro
    row.cells[5].textContent = formatDate(updatedClient.cliedtnc) || "-"; // Data de Nascimento
    row.cells[6].textContent = updatedClient.cliecelu || "-"; // Celular
    row.cells[7].textContent = updatedClient.cliecity || "-"; // Cidade
    row.cells[8].textContent = updatedClient.clieestd || "-"; // Estado
    row.cells[9].textContent = updatedClient.clierua || "-"; // Rua
    row.cells[10].textContent = updatedClient.cliecep || "-"; // CEP
    row.cells[11].textContent = updatedClient.cliemail || "-"; // E-mail
  }
}
