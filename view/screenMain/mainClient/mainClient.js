

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
   
  $("#clieCpf").mask("000.000.000-00");
  $("#searchCpf").mask("000.000.000-00");
  $("#clieCnpj").mask("00.000.000/0000-00");
   $("#searchCnpj").mask("00.000.000/0000-00");
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

function initTipoClienteHandler() {
  const tipoInput = document.getElementById('clieTiCli');
  const btnAddFili = document.querySelector(".btnAddFili");
  const popUpFilial = document.querySelector('.popUpFilial');
  const buttonExitPopUpFilial = document.querySelector('.outPageRegisterClientFili');

  if (!tipoInput || !btnAddFili) return;

  tipoInput.addEventListener('change', function () {
    const tipoCliente = this.value;
    const cpfField = document.getElementById('clieCpf');
    const cnpjField = document.getElementById('clieCnpj');

    if (!cpfField || !cnpjField) return;

    if (tipoCliente === "Pessoa Jurídica") {
      cpfField.value = "";
      cpfField.readOnly = true;
      cnpjField.readOnly = false;
      btnAddFili.classList.remove('hidden');
      btnAddFili.classList.add('flex');
    } else if (tipoCliente === "Pessoa Física") {
      cnpjField.value = "";
      cnpjField.readOnly = true;
      cpfField.readOnly = false;
      btnAddFili.classList.add('hidden');
      btnAddFili.classList.remove('flex');
    } else {
      cpfField.readOnly = false;
      cnpjField.readOnly = false;
      btnAddFili.classList.add('hidden');
      btnAddFili.classList.remove('flex');
    }
  });

  // Abrir o pop-up ao clicar no botão de adicionar filial
  btnAddFili.addEventListener('click', () => {
    if (popUpFilial) {
      popUpFilial.style.display = 'flex';
    }
  });

  // Fechar o pop-up ao clicar no botão de saída
  if (buttonExitPopUpFilial) {
    buttonExitPopUpFilial.addEventListener('click', () => {
      if (popUpFilial) {
        popUpFilial.style.display = 'none';
      }
    });
  }
}

function getFilialData() {
  const nomeFili = document.getElementById('nameFili').value.trim();
  const cnpjFili = document.getElementById('cnpjFili').value.trim();
  const cepFili = document.getElementById('cepFili').value.trim();
  const ruaFili = document.getElementById('ruaFili').value.trim();
  const cidaFili = document.getElementById('cidaFili').value.trim();
  const bairFili = document.getElementById('bairFili')?.value.trim() || '';

  if (!nomeFili && !cnpjFili && !cepFili && !ruaFili && !cidaFili && !bairFili) {
    return null; // Nenhuma filial foi preenchida
  }

  if (!nomeFili || !cnpjFili || !cepFili || !ruaFili || !cidaFili || !bairFili) {
    Toastify({
      text: "Faltam informações da filial!",
      duration: 3000,
      backgroundColor: "red",
    }).showToast();
    return null;
  }

  return {
    nomeFili,
    cnpjFili,
    cepFili,
    ruaFili,
    cidaFili,
    bairFili
  };
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
          initTipoClienteHandler()
          interationSystemClient();
          searchClient();
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

  const buttonToBack = document.getElementById("buttonExitClient");
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

  const btnAddFilial = document.querySelector('.btnAddFili')
  if(btnAddFilial){
     btnAddFilial.addEventListener('click' , ()=>{
         const popUpBranch = document.querySelector('.popUpFilial')
         if(popUpBranch){
             popUpBranch.style.display = 'flex'
               console.log('pop' , popUpBranch)
         }
           console.log('pop' , popUpBranch)
           
            
     })
     
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
      const dataFilial =getFilialData()
      const formData = {
        clieCode: document.querySelector("#clieCode").value.trim(),
        clieName: document.querySelector("#clieName").value.trim(),
        clieTpCl: document.querySelector('#clieTiCli').value.trim(),
        clieCpf: document.querySelector("#clieCpf").value.trim().replace(/\D/g, ''),    // <-- Limpa CPF
        clieCnpj: document.querySelector("#clieCnpj").value.trim().replace(/\D/g, ''),
        dtCad:document.querySelector('#dtCad').value,
        dtNasc: document.querySelector("#dtNasc").value,
        clieCelu: document.querySelector("#clieCelu").value.trim().replace(/\D/g, ''),
        clieCity: document.querySelector("#clieCity").value.trim(),
        clieEstd: document.querySelector("#clieEstd").value.trim(),
        clieRua: document.querySelector("#clieRua").value.trim(),
        clieCep: document.querySelector("#clieCep").value.trim().replace(/\D/g, ''),
        clieMail: document.querySelector("#clieMail").value.trim(),
        clieBanc: document.querySelector('#clieBanc').value.trim(),
        clieAgen: document.querySelector('#clieAgen').value.trim(),
        clieCont: document.querySelector('#clieCont').value.trim(),
        cliePix: document.querySelector('#cliePix').value.trim(),
        filial: dataFilial
      }
      if(formData.clieTpCl === "Pessoa Jurídica" && formData.clieCnpj === ""){
          Toastify({
          text: "O Cliente e uma pessoa jurídica adicione o CNPJ dele. OBRIGATORIO",
          duration: 4000,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
        return;
      }

      if(formData.clieTpCl === "Pessoa Física" && formData.clieCpf === ""){
          Toastify({
          text: "O Cliente e uma Pessoa Física adicione o CPF dele. OBRIGATORIO",
          duration: 4000,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
        return;
      }

     
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

        const validDoc  = cliente.cliecnpj || cliente.cliecpf
        const formatDoc = formatarCampo(  'documento',validDoc)
        const telefoneFormatado = formatarCampo("telefone", cliente.cliecelu);
       const cepFormatado = formatarCampo("cep", cliente.cliecep);

        // Dados do cliente
        const dados = [
          cliente.cliecode,
          cliente.clienome,
          formatDoc,
          formatDate(cliente.cliedtcd),
          formatDate(cliente.cliedtnc),
          telefoneFormatado ,
          cliente.cliecity,
          cliente.clieestd,
          cliente.clierua,
          cepFormatado,
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
  };
};

// BUSCAR CLIENTE ESPECIFICO
async function searchClient() {

  const btnForSearch = document.getElementById('searchClient');
  const popUpSearch = document.querySelector('.searchIdClient');
  const bensListDiv = document.querySelector(".listClient");
  const backdrop = document.querySelector('.popupBackDrop');
  const btnOutPageSearch = document.querySelector('.outPageSearchClient')
 

  if(btnForSearch && popUpSearch){
     btnForSearch.addEventListener('click' , ()=>{
       popUpSearch.style.display = 'flex'
       backdrop.style.display = 'block'
       
     })
  }

   if(popUpSearch || btnOutPageSearch){
     btnOutPageSearch.addEventListener('click' , ()=>{
       popUpSearch.style.display = 'none'
        backdrop.style.display = 'none'
     })
  }

  let btnClearFilter = document.getElementById('btnClearFilter');
  if (!btnClearFilter) {
    btnClearFilter = document.createElement('button');
    btnClearFilter.id = 'btnClearFilter';
    btnClearFilter.textContent = 'Limpar filtro';
    btnClearFilter.className = 'btn btn-secondary w-25 aling align-items: center;';
    btnClearFilter.style.display = 'none'; // fica oculto até uma busca ser feita
    bensListDiv.parentNode.insertBefore(btnClearFilter, bensListDiv);

    btnClearFilter.addEventListener('click', () => {
     
      btnClearFilter.style.display = 'none';
      
         document.getElementById('codeClient').value = ""
         document.getElementById('searchCpf').value = ""
          document.getElementById('searchCnpj').value = ""
    
      fetchListClientes();
    });
  }

  const btnSubmitSearchClient =  document.querySelector('.submitSearchClient')
  if(btnSubmitSearchClient){
     btnSubmitSearchClient.addEventListener('click' , async ()=>{
           
         const cliecode = document.getElementById('codeClient').value.trim()
         const valueCpf = document.getElementById('searchCpf').value.trim()
         const valueCnpj = document.getElementById('searchCnpj').value.trim()

       const preenchidos = [cliecode, valueCpf, valueCnpj].filter(valor => valor !== "");

       if (preenchidos.length === 0) {
       Toastify({
        text: "Preencha pelo menos um campo para buscar!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
       }).showToast();
      return;
    }

      if (preenchidos.length > 1) {
      Toastify({
      text: "Preencha apenas um campo por vez para buscar!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "orange",
     }).showToast();
     return;
    }


      const params = new URLSearchParams();
      if (cliecode) params.append('cliecode', cliecode);
      if (valueCpf) params.append('valueCpf', valueCpf);
      if(valueCnpj) params.append('valueCnpj' , valueCnpj);

    try {
      const result =  await fetch(`/api/cliente/search?${params}` , {
        method:'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
      })
       
      const data = await result.json()

      if(result.ok || data.cliente.length > 0){
           
          Toastify({
          text: "O Cliente foi encontrado com sucesso!.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
          }).showToast();
          // Exibe botão limpar filtro
          btnClearFilter.style.display = 'inline-block';
          
          renderClientesTable(data.cliente)
 
          if (popUpSearch) popUpSearch.style.display = 'none';
          if(backdrop)backdrop.style.display = 'none'

      }else{
        Toastify({
          text: data.message || "Nenhum Cliente encontrado nessa pesquisa",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
          }).showToast();
      }

     } catch (error) {
         console.error('Erro ao buscar cliente' , error)
          Toastify({
          text: "Erro a buscar Cliente tente novamente",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
          }).showToast();
     };
    });
  };
};

//RENDERIZAR TABELA PATHERS 
function renderClientesTable(clientes) {
  const clientesListDiv = document.querySelector(".listClient");
  clientesListDiv.innerHTML = "";

  if (!clientes || clientes.length === 0) {
    clientesListDiv.innerHTML = "<p class='text-light'>Nenhum cliente cadastrado.</p>";
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "table-responsive";

  const tabela = document.createElement("table");
  tabela.className = "table table-sm table-hover table-striped table-bordered tableClient";

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
    th.classList.add("align-middle");

    if (["Selecionar", "Código", "CPF/CNPJ", "Estado", "CEP"].includes(coluna)) {
      th.classList.add("text-center", "px-2", "py-1", "wh-nowrap");
    } else {
      th.classList.add("px-3", "py-2");
    }

    linhaCabecalho.appendChild(th);
  });

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
    checkbox.className = "form-check-input m-0";
    checkbox.dataset.cliente = JSON.stringify(cliente);
    checkboxCell.classList.add("text-center", "align-middle", "wh-nowrap");
    checkboxCell.appendChild(checkbox);

    // Dados formatados
    const doc = cliente.cliecnpj || cliente.cliecpf;
    const docFormatado = formatarCampo("documento", doc);
    const telFormatado = formatarCampo("telefone", cliente.cliecelu);
    const cepFormatado = formatarCampo("cep", cliente.cliecep);

    const dados = [
      cliente.cliecode,
      cliente.clienome,
      docFormatado,
      formatDate(cliente.cliedtcd),
      formatDate(cliente.cliedtnc),
      telFormatado,
      cliente.cliecity,
      cliente.clieestd,
      cliente.clierua,
      cepFormatado,
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

      const coluna = colunas[index + 1]; // +1 por causa do "Selecionar"
      if (["Código", "CPF/CNPJ", "Estado", "CEP"].includes(coluna)) {
        td.classList.add("text-center", "wh-nowrap", "px-2", "py-1");
      } else {
        td.classList.add("px-3", "py-2");
      }
    });
  });

  wrapper.appendChild(tabela);
  clientesListDiv.appendChild(wrapper);
};

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
      containerEditForm.style.display = 'flex'
    
    }

    const clientData = selectedCheckbox.getAttribute("data-cliente");

    if (!clientData) {
      console.error("O atributo data-client está vazio ou indefinido.");
      return;
    }
    console.log('cliente' , clientData)

    try {
      const clientSelecionado = JSON.parse(clientData);

      const campos = [
        { id: "editClieCode", valor: clientSelecionado.cliecode },
        { id: "editClieName", valor: clientSelecionado.clienome },
        { id: "EditClieTiCli", valor: clientSelecionado.clietpcl },
        { id: "editClieCpf", valor: clientSelecionado.cliecpf },
        { id: "editClieCnpj", valor: clientSelecionado.cliecnpj },
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
        cliecpf: document.getElementById("editClieCpf").value || null,
        cliecnpj: document.getElementById("editClieCnpj").value || null,
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

