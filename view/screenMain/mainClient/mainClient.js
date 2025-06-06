function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expTime = payload.exp * 1000;
    return Date.now() > expTime;
  } catch (error) {
    return true;
  }
}

function maskFieldClient() {
  const cpfCnpjMaskBehavior = function (val) {
    return val.replace(/\D/g, '').length <= 11
      ? '000.000.000-00'
      : '00.000.000/0000-00';
  };

  // Opções para aplicar dinamicamente a máscara
  const cpfCnpjOptions = {
    onKeyPress: function (val, e, field, options) {
      field.mask(cpfCnpjMaskBehavior.apply({}, arguments), options);
    }
  };

  // Aplica ao campo específico
  $('#cpfAndCnpj').mask(cpfCnpjMaskBehavior($('#cpfAndCnpj').val()), cpfCnpjOptions);


  $("#clieCelu").mask("(00) 00000-0000");

  $("#clieCep").mask("00000-000");

  $("#editCliecpfCnpj").mask("000.000.000-00");

  $("#editClieCelu").mask("(00) 00000-0000");

  $("#editClieCep").mask("00000-000");

  $("#clieCepLoc").mask("00000-000");

  $("#clieCeluLoc").mask("(00) 00000-0000");

  $("#cpfClientLoc").mask("000.000.000-00");
}

const formatDate = (isoDate) => {
  if (!isoDate) return "";
  const dateObj = new Date(isoDate);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

function dateAtualInField(date){
  const inputDtCad = document.getElementById(date)
  if(inputDtCad){

  const hoje = new Date()
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

    inputDtCad.value = `${ano}-${mes}-${dia}`;
    return true; 
  }else{
    console.error('Campo #fornDtcd não encontrado no DOM');
    return false; // indica falha
  }
 
}

const socketClient = io();
document.addEventListener("DOMContentLoaded", () => {
  const btnloadClie = document.querySelector(".btnCadClie");
  if (btnloadClie) {
    btnloadClie.addEventListener("click", async (event) => {
      event.preventDefault();

      try {
        const response = await fetch("/client", {
          method: "GET",
        });
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const html = await response.text();
        const mainContent = document.querySelector("#mainContent");
        if (mainContent) {
          mainContent.innerHTML = html;
          maskFieldClient();
          interationSystemClient();
          registerNewClient();
          dateAtualInField('dtCad')
          deleteClient();
          editarCliente();
        } else {
          console.error("#mainContent não encontrado no DOM");
          return;
        }

        const containerAppClient = document.querySelector(
          ".containerAppClient"
        );
        if (containerAppClient) containerAppClient.classList.add("flex");

        const sectionsToHide = [
          ".containerAppProd",
          ".containerAppFabri",
          ".containerAppTipoProd",
          ".containerAppDriver",
          ".containerAppAutomo",
          ".containerAppBens",
          ".containerAppForn",
        ];
        sectionsToHide.forEach((selector) => {
          const element = document.querySelector(selector);
          if (element) element.style.display = "none";
        });

        const showContentBens = document.querySelector(".showContentBens");
        const btnMainPageClient = document.querySelector(".buttonsMainPage");
        const listingClient = document.querySelector(".listClient");
        const editFormClient = document.querySelector(".formEditClient");
        const informative = document.querySelector(".information");

        if (showContentBens) showContentBens.style.display = "none";
        if (btnMainPageClient) btnMainPageClient.style.display = "flex";
        if (listingClient) listingClient.style.display = "flex";
        if (editFormClient) editFormClient.style.display = "none";
        if (informative) {
          informative.style.display = "block";
          informative.textContent = "SEÇÃO CLIENTE";
        }

        await fetchListClientes();
      } catch (error) {
        Toastify({
          text: "Erro na pagina",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
        console.error('Erro na chamada do "CONTENT CLIENT"');
      }
    });
  }

  socketClient.on("updateClients", (updatedClient) => {
    fetchListClientes();
  });

  socketClient.on("clienteAtualizado", (clientes) => {
    fetchListClientes();
  });
});

async function interationSystemClient() {
  const buttonRegisterClient = document.querySelector(".registerClient");

  if (buttonRegisterClient) {
    buttonRegisterClient.addEventListener("click", () => {
      const formRegisterClient = document.querySelector(".containerOfForm");
      if (formRegisterClient) {
        formRegisterClient.classList.remove("hidden");
        formRegisterClient.classList.add("flex");
      }

      const listingClient = document.querySelector(".listClient");
      if (listingClient) {
        listingClient.classList.remove("flex");
        listingClient.classList.add("hidden");
      }

      const btnMainPage = document.querySelector(".buttonsMainPage");
      if (btnMainPage) {
        btnMainPage.classList.remove("flex");
        btnMainPage.classList.add("hidden");
      }
      return;
    });
  }

  const buttonOutPageClient = document.querySelector(".btnOutInit");

  if (buttonOutPageClient) {
    buttonOutPageClient.addEventListener("click", (event) => {
      event.preventDefault();

      const listingClient = document.querySelector(".listClient");
      if (listingClient) {
        listingClient.classList.remove("hidden");
        listingClient.classList.add("flex");
      }

      const btnMainPage = document.querySelector(".buttonsMainPage");
      if (btnMainPage) {
        btnMainPage.classList.remove("hidden");
        btnMainPage.classList.add("flex");
      }

      const containeFormClient = document.querySelector(".containerOfForm");
      if (containeFormClient) {
        containeFormClient.classList.remove("flex");
        containeFormClient.classList.add("hidden");
      }
      return;
    });
  }

  const buttonOutPageEdit = document.querySelector(".outPageEditClient");
  if (buttonOutPageEdit) {
    buttonOutPageEdit.addEventListener("click", (event) => {
      event.preventDefault();

      const listingClient = document.querySelector(".listClient");
      if (listingClient) {
        listingClient.classList.remove("hidden");
        listingClient.classList.add("flex");
      }

      const btnMainPage = document.querySelector(".buttonsMainPage");
      if (btnMainPage) {
        btnMainPage.classList.remove("hidden");
        btnMainPage.classList.add("flex");
      }

      const containerEditClient = document.querySelector(".formEditClient");
      if (containerEditClient) {
        containerEditClient.classList.remove("flex");
        containerEditClient.classList.add("hidden");
      }

      return;
    });
  }

  const buttonToBack = document.querySelector(".buttonExitClient");
  if (buttonToBack) {
    buttonToBack.addEventListener("click", () => {
      const containerAppClient = document.querySelector(".containerAppClient");
      containerAppClient.classList.remove("flex");
      containerAppClient.classList.add("hidden");

      const continformation = document.querySelector(".information");
      if (continformation) {
        continformation.textContent = "Sessão ativa";
      }
    });
    return;
  }
}

async function registerNewClient() {

  dateAtualInField('dtCad')
  document
    .querySelector(".btnRegisterClient")
    .addEventListener("click", async (event) => {
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
      const clieCep = document
        .querySelector("#clieCep")
        .value.replace(/\D/g, "");
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${clieCep}/json/`
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar o CEP.");
        }

        const data = await response.json();

        if (data.erro) {
          Toastify({
            text: "CEP inválido.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
          }).showToast();
          return;
        }

        // Preenchendo os campos do formulário
        const ruaField = document.getElementById("clieRua");
        const cityField = document.getElementById("clieCity");
        const stateField = document.getElementById("clieEstd");

        if (ruaField) {
          ruaField.value = `${data.logradouro} - ${data.bairro}` || "";
          ruaField.readOnly = true;
        }
        if (cityField) {
          cityField.value = data.localidade || "";
          cityField.readOnly = true;
        }
        if (stateField) {
          stateField.value = data.uf || "";
          stateField.readOnly = true;
        }
      } catch (error) {
        console.error("Erro ao buscar o CEP:", error);
        Toastify({
          text: "Erro ao buscar o CEP, tente novamente.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
        return;
      }

      // Captura os valores do formulário após o preenchimento
      const formData = {
        clieCode: document.querySelector("#clieCode").value.trim(),
        clieName: document.querySelector("#clieName").value.trim(),
        clieTpCl: document.querySelector('#clieTiCli').value.trim(),
        cpfAndCnpj: document.querySelector("#cpfAndCnpj").value.trim(),
        dtCad:document.querySelector('#dtCad').value,
        dtNasc: document.querySelector("#dtNasc").value,
        clieCelu: document.querySelector("#clieCelu").value.trim(),
        clieCity: document.querySelector("#clieCity").value.trim(),
        clieEstd: document.querySelector("#clieEstd").value.trim(),
        clieRua: document.querySelector("#clieRua").value.trim(),
        clieCep: document.querySelector("#clieCep").value.trim(),
        clieMail: document.querySelector("#clieMail").value.trim(),
        clieBanc: document.querySelector('#clieBanc').value.trim(),
        clieAgen: document.querySelector('#clieAgen').value.trim(),
        clieCont: document.querySelector('#clieCont').value.trim(),
        cliePix: document.querySelector('#cliePix').value.trim()
      };
    
      console.log('dados' , formData)
       const clieMail = formData.clieMail
      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailValido.test(clieMail)) {
        Toastify({
          text: "E-mail inválido. Verifique o formato (ex: nome@dominio.com).",
          duration: 3000,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
        return;
      }

      const datas = [
        { key: "dtNasc", label: "Data de Nascimento" },
      ];
      for (const { key, label } of datas) {
        const str = formData[key];
        if (!isDataValida(str)) {
          Toastify({
            text: `${label} INVALIDA .`,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
          }).showToast();
          return;
        }
      }

      const [yNasc, mNasc, dNasc] = formData.dtNasc.split("-").map(Number);
      const dtNasc = new Date(yNasc, mNasc - 1, dNasc);
      const hoje = new Date();
      const hoje0 = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate()
      );

      if (dtNasc.getTime() >= hoje0.getTime()) {
        Toastify({
          text: "Data de Nascimento não pode ser maior que a data de hoje.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
        return;
      }

      // 5.3) dtNasc deve ser anterior ou igual a dtCad
      if (dtNasc.getTime() > formData.dtCad) {
        Toastify({
          text: "Data de Nascimento não pode ser maior que a data de cadastro.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
        return;
      }

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
          dateAtualInField('dtCad')
        } else {
          Toastify({
            text: result?.message || "Erro ao cadastrar Cliente.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: response.status === 409 ? "orange" : "red",
          }).showToast();
        }
      } catch (error) {
        console.error("Erro ao enviar formulário:", error);
        alert("Erro ao enviar os dados para o server.");
      }
    });

  validationFormClient();
}

// LISTAGEM DE CLIENTES
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
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      Toastify({
        text: result?.message || "Erro ao carregar clientes.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();

      document.querySelector(".listClient").innerHTML =
        "<p>Erro ao carregar clientes.</p>";
      return;
    }

    const clientes = result;
    const clientesListDiv = document.querySelector(".listClient");
    clientesListDiv.innerHTML = "";

    if (clientes.length > 0) {
      const wrapper = document.createElement("div");
      wrapper.className = "table-responsive";

      const tabela = document.createElement("table");
      tabela.className = "table table-sm table-hover table-striped table-bordered tableClient";

      // Cabeçalho
      const cabecalho = tabela.createTHead();
      const linhaCabecalho = cabecalho.insertRow();
      const colunas = [
        "Selecionar",
        "Código",
        "Nome",
        "CPF/CNPJ",
        "Data de Cadastro",
        "Data de Nascimento",
        "Celular",
        "Cidade",
        "Estado",
        "Rua",
        "CEP",
        "E-mail",
        "Tipo de Cliente",
        "Banco",
        "Agencia",
        "Conta"
        
      ];

      colunas.forEach((coluna) => {
        const th = document.createElement("th");
        th.textContent = coluna;

        if (["Selecionar", "Código", "CPF", "Estado", "CEP"].includes(coluna)) {
          th.classList.add("text-center", "px-2", "py-1", "align-middle", "wh-nowrap");
        } else {
          th.classList.add("px-3", "py-2", "align-middle");
        }

        linhaCabecalho.appendChild(th);
      });

      // Corpo
      const corpo = tabela.createTBody();
      clientes.forEach((cliente) => {
        const linha = corpo.insertRow();
        linha.setAttribute("data-cliecode", cliente.cliecode);

        // Checkbox
        const checkboxCell = linha.insertCell();
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "selectCliente";
        checkbox.value = cliente.cliecode;

        const clienteData = JSON.stringify(cliente);
        if (clienteData) {
          checkbox.dataset.cliente = clienteData;
        }

        checkbox.className = "form-check-input m-0";
        checkboxCell.classList.add("text-center", "align-middle", "wh-nowrap");
        checkboxCell.appendChild(checkbox);

        // Dados do cliente
        const dados = [
          cliente.cliecode,
          cliente.clienome,
          cliente.cliecpcn,
          formatDate(cliente.cliedtcd),
          formatDate(cliente.cliedtnc),
          cliente.cliecelu,
          cliente.cliecity,
          cliente.clieestd,
          cliente.clierua,
          cliente.cliecep,
          cliente.cliemail,
          cliente.clietpcl,
          cliente.cliebanc,
          cliente.clieagen,
          cliente.cliecont
        ];

        dados.forEach((valor, index) => {
          const td = linha.insertCell();
          td.textContent = valor || "";
          td.classList.add("align-middle", "text-break");

          const coluna = colunas[index + 1];
          if (["Código", "CPF", "Estado", "CEP"].includes(coluna)) {
            td.classList.add("text-center", "wh-nowrap", "px-2", "py-1");
          } else {
            td.classList.add("px-3", "py-2");
          }
        });
      });

      wrapper.appendChild(tabela);
      clientesListDiv.appendChild(wrapper);
    } else {
      clientesListDiv.innerHTML = "<p class='text-light'>Nenhum cliente cadastrado.</p>";
    }
  } catch (error) {
    console.error("Erro ao carregar clientes:", error);
    Toastify({
      text: "Erro de conexão com o servidor.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    document.querySelector(".listClient").innerHTML =
      "<p>Erro ao carregar clientes.</p>";
  }
}

// //deletar cliente
function deleteClient() {
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

function editarCliente() {
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
    if (btnMainPageClient) {
      btnMainPageClient.classList.remove("flex");
      btnMainPageClient.classList.add("hidden");
    }

    const listClient = document.querySelector(".listClient");
    if (listClient) {
      listClient.classList.remove("flex");
      listClient.classList.add("hidden");
    }

    const containerEditForm = document.querySelector(".formEditClient");
    if (containerEditForm) {
      containerEditForm.classList.remove("hidden");
      containerEditForm.classList.add("flex");
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
        { id: "EditClieTiCli", valor: clientSelecionado.clietpcl },
        { id: "editCliecpfCnpj", valor: clientSelecionado.cliecpcn },
        { id: "editClieDtCad", valor: formatDate(clientSelecionado.cliedtcd) },
        { id: "editClieDtNasc", valor: formatDate(clientSelecionado.cliedtnc) },
        { id: "editClieCelu", valor: clientSelecionado.cliecelu },
        { id: "editClieCity", valor: clientSelecionado.cliecity },
        { id: "editClieEstd", valor: clientSelecionado.clieestd },
        { id: "editClieRua", valor: clientSelecionado.clierua },
        { id: "editClieCep", valor: clientSelecionado.cliecep },
        { id: "editClieMail", valor: clientSelecionado.cliemail },
        {id: "editClieBanc" , valor: clientSelecionado.cliebanc},
        {id: "editClieAgen" , valor: clientSelecionado.clieagen},
        {id: "editClieCont" , valor: clientSelecionado.cliecont},
        {id: "editCliePix" , valor: clientSelecionado.cliepix}
      ];

      // Atualizar valores no formulário
      campos.forEach(({ id, valor }) => {
       const elemento = document.getElementById(id);
  if (!elemento) {
    console.warn(`Elemento com ID '${id}' não encontrado.`);
    return;
  }

  if (elemento.type === "date" && valor) {
    const dataFormatada = new Date(valor).toISOString().split("T")[0];
    elemento.value = dataFormatada;
  } else if (elemento.tagName === "SELECT") {
    const option = [...elemento.options].find(opt => opt.value === valor);
    if (option) {
      elemento.value = valor;
      if (id === "EditClieTiCli") {
        const hiddenInput = document.getElementById("tipoClieEditHidden");
        if (hiddenInput) {
          hiddenInput.value = valor;
        }
      }
    }
  } else {
    elemento.value = valor || "";
  }
      });

      document.querySelector(".formEditClient").style.display = "flex";
      document.querySelector(".listClient").style.display = "none";
    } catch (error) {
      console.error("Erro ao fazer parse de data-client:", error);
    }
  });

  const cepInput = document.getElementById("editClieCep");
  const ruaField = document.getElementById("editClieRua");
  const cityField = document.getElementById("editClieCity");
  const stateField = document.getElementById("editClieEstd");

  if (cepInput) {
    cepInput.addEventListener("input", async () => {
      const clieCep = cepInput.value.replace(/\D/g, "");

      // Só executa a busca se tiver 8 dígitos
      if (clieCep.length === 8) {
        try {
          const response = await fetch(
            `https://viacep.com.br/ws/${clieCep}/json/`
          );

          if (!response.ok) throw new Error("Erro ao buscar o CEP");

          const data = await response.json();

          if (data.erro) {
            Toastify({
              text: "CEP inválido ou não encontrado.",
              duration: 3000,
              close: true,
              gravity: "top",
              position: "center",
              backgroundColor: "red",
            }).showToast();

            if (ruaField) ruaField.value = "";
            if (cityField) cityField.value = "";
            if (stateField) stateField.value = "";
            return;
          }

          if (ruaField) {
            ruaField.value = `${data.logradouro} - ${data.bairro}` || "";
            ruaField.readOnly = true;
          }

          if (cityField) {
            cityField.value = data.localidade || "";
            cityField.readOnly = true;
          }

          if (stateField) {
            stateField.value = data.uf || "";
            stateField.readOnly = true;
          }
        } catch (error) {
          console.error("Erro ao buscar o CEP:", error);
          Toastify({
            text: "Erro ao buscar o CEP.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
          }).showToast();
        }
      } else {
        if (ruaField) ruaField.value = "";
        if (cityField) cityField.value = "";
        if (stateField) stateField.value = "";
      }
    });
  }

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
        clietpcl: document.getElementById('EditClieTiCli').value,
        cliecpcn: document.getElementById("editCliecpfCnpj").value,
        cliedtcd: document.getElementById("editClieDtCad").value || null,
        cliedtnc: document.getElementById("editClieDtNasc").value || null,
        cliecelu: document.getElementById("editClieCelu").value,
        cliecity: document.getElementById("editClieCity").value,
        clieestd: document.getElementById("editClieEstd").value,
        clierua: document.getElementById("editClieRua").value,
        cliecep: document.getElementById("editClieCep").value,
        cliemail: document.getElementById("editClieMail").value,
        cliebanc: document.getElementById("editClieBanc").value,
        clieagen: document.getElementById("editClieAgen").value,
        cliecont: document.getElementById("editClieCont").value,
        cliepix: document.getElementById("editCliePix").value,
      };

      try {

        const confirmedEdition = confirm(
        `Tem certeza de que deseja ATUALIZAR os dados desse Cliente?`
        );
          if (!confirmedEdition) return;

        const response = await fetch(`/api/updateclient/${clientIdParsed}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
  
          const errorResponse = await response.json();
          Toastify({
            text: errorResponse.message || "Erro ao atualizar Cliente.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
          }).showToast();

      }
     } catch (error) {
        console.error("Erro na requisição:", error);
         Toastify({
          text: "Erro interno na requisição. Tente novamente.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
      }
    });
  }
  editAndUpdateOfClient();
}

