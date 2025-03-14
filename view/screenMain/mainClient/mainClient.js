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

     const containerAppAutomo = document.querySelector('.containerAppAutomo')
       containerAppAutomo.style.display = 'none'
    
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

function isTokenExpired(token) {
  try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expTime = payload.exp * 1000; 
      return Date.now() > expTime; 
  } catch (error) {
      return true; 
  }
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.btnRegisterClient').addEventListener('click', async (event) => {

      event.preventDefault();
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
      
      if (!$('#formRegisterClient').valid()) {
        return;
    }

      // Captura os valores do formulário
      const formData = {
          clieCode: document.querySelector('#clieCode').value,            // Codigo
          clieName: document.querySelector('#clieName').value,            // Nome
          cpf: document.querySelector('#cpf').value,                      // CPF
          dtCad: document.querySelector('#dtCad').value,                  // Data de Cadastro
          dtNasc: document.querySelector('#dtNasc').value,                // Data de Nascimento
          clieCelu: document.querySelector('#clieCelu').value,            // Celular
          clieCity: document.querySelector('#clieCity').value,            // Cidade
          clieEstd: document.querySelector('#clieEstd').value,            // Estado
          clieRua: document.querySelector('#clieRua').value,              // Rua
          clieCep: document.querySelector('#clieCep').value,              // Cep
          clieMail: document.querySelector('#clieMail').value             // E-mail
      };
        
      try {
          const response = await fetch('http://localhost:3000/api/client/submit', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(formData)
          });

          const result = await response.json();
          
          if (response.ok) {
              Toastify({
                  text: "Cliente cadastrado com Sucesso",
                  duration: 3000,
                  close: true,
                  gravity: "top",
                  position: "center",
                  backgroundColor: "green",
              }).showToast();

              // Limpar o formulário após o sucesso
              document.querySelector('#formRegisterClient').reset();
          } else {
            Toastify({
              text: "Erro ao cadastrar Cliente",
              duration: 3000,
              close: true,
              gravity: "top",
              position: "center",
              backgroundColor: "green",
          }).showToast();
          
          }
      } catch (error) {
          console.error('Erro ao enviar formulário:', error);
          alert('Erro ao enviar os dados para o server.');
      }
  });

  validationFormClient();
});


//fetch listClient


let clientesData = {};
async function fetchListClientes() {

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
    const response = await fetch("/api/listclient" ,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
    });
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
          return `${year}/${month}/${day}`;
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
    const response = await fetch(`/api/deleteclient/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
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
      }
    else{ 
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

    const formatDate = (isoDate) => {
      if (!isoDate) return "";
      const dateObj = new Date(isoDate);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      return `${year}/${month}/${day}`;
    };

    // Campos e IDs correspondentes
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
          const dataFormatada = new Date(valor).toISOString().split('T')[0];
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

// // Função para enviar os dados atualizados
async function editAndUpdateOfClient() {
 
  const formEditClient = document.querySelector("#formEditRegisterClient");

  formEditClient.addEventListener("submit", async (event) => {
    event.preventDefault();

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
      cliedtcd: document.getElementById ("editClieDtCad").value || null,
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
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
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

        formEditClient.reset()

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
