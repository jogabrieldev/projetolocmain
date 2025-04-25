
// Funções utilitárias
function mostrarElemento(el) {
  if (el) {
    el.classList.remove("hidden");
    el.classList.add("flex");
  }
}

function esconderElemento(el) {
  
  if (el) {
    el.classList.remove("flex");
    el.classList.add("hidden");
  }
}

function maskFieldClientPageLocation(){
  $("#clieCepLoc").mask("00000-000");

  $("#clieCeluLoc").mask("(00) 00000-0000");

  $("#cpfClientLoc").mask("000.000.000-00")
}


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

const socketContainerLocation = io()

document.addEventListener('DOMContentLoaded' , ()=> {
        
  const btnLoadLocation = document.querySelector(".btnRegisterLocation")
  if(btnLoadLocation){
    btnLoadLocation.addEventListener("click", async () => {

      try {
        
        await fetch("/location" , {
          method:'GET'
        })
          .then(response => response.text())
          .then(html => {
          const contentMain =  document.querySelector("#mainContent")
          if(contentMain){
            contentMain .innerHTML = html; 
          }
          interationSystemLocation();

          const aguardarElementos = () => {
            const select1 = document.getElementById("family1");
            const tableLocation = document.querySelector('.tableLocation')
            if (select1 && tableLocation) {
              frontLocation();
              searchClientForLocation();
              carregarFamilias(); 
              registerClientPageLocation();
              maskFieldClientPageLocation();
              editLocation();
              isDataValida();
              const buttonSubmitLocationFinish = document.querySelector('.finish')
              if(buttonSubmitLocationFinish){
                buttonSubmitLocationFinish.addEventListener('click' , handleSubmit)
              }
          
              deletarLocation()
              atualizarDataHora();
              esconderElemento()
              mostrarElemento()
              
            } else {
              setTimeout(aguardarElementos, 100);
            }
          };
  
          aguardarElementos();

            
          })
          .catch(err => console.error("Erro ao carregar /location", err));
           

          const containerAppLocation = document.querySelector('.containerAppLocation');
          if ( containerAppLocation) containerAppLocation.classList.add('flex') ;
    
          const sectionsToHide = [
            'containerLogistica' , 'deliveryFinish'
          ];
          sectionsToHide.forEach((selector) => {
            const element = document.querySelector(selector);
            if (element) element.style.display = 'none';
          });
    
          const showContentBens = document.querySelector('.content');
          const btnMainPageClient = document.querySelector('.btnInitPageMainLoc');
          const listingClient = document.querySelector('.tableLocation ');
          const editFormClient = document.querySelector('.contentEditlocation');
          const informative = document.querySelector('.information');
    
          if (showContentBens) showContentBens.style.display = 'none';
          if (btnMainPageClient) btnMainPageClient.style.display = 'flex';
          if (listingClient) listingClient.style.display = 'flex';
          if (editFormClient) editFormClient.style.display = 'none';
          if (informative) {
            informative.style.display = 'block';
            informative.textContent = 'SEÇÃO LOCAÇÃO';
          }
          
      } catch (error) {
          console.error('erro para carregar')
      }
     
    
  })
} 

socketContainerLocation.on("updateRunTimeRegisterLocation", (listLocation) => {
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
  
    socketContainerLocation.on("updateRunTimeFamilyBens", (updatedFamily) => {
      carregarFamilias(); 
  });
    
});


function interationSystemLocation(){
      
  const btnOutPageLocation = document.querySelector(".buttonExitLocation");
  if(btnOutPageLocation){
  
    btnOutPageLocation.addEventListener("click", () => {
      const containerAppLocation = document.querySelector(".containerAppLocation");
      if(containerAppLocation){
        esconderElemento(containerAppLocation)
      }

      
      const continformation = document.querySelector('.information')
      if(continformation){
        continformation.textContent = 'Sessão ativa'
      }
      
    });
  }
   
    const outPageSearchLocation = document.querySelector(".outPageSearchLocation");
    if(outPageSearchLocation){
  
      outPageSearchLocation.addEventListener("click", () => {
        const containerSearch = document.querySelector(".searchLocation");
        if(containerSearch){
          esconderElemento(containerSearch)
        }
       
        const containerAppLocation = document.querySelector(".containerAppLocation");
        if(containerAppLocation){
          mostrarElemento(containerAppLocation)
        }
      });
    
    }
   
    const searchLoc =document.querySelector('.searchLoc')
    if(searchLoc){
      searchLoc.addEventListener('click' , ()=>{
        const containerSearch = document.querySelector(".searchLocation");
        if(containerSearch){
          mostrarElemento(containerSearch)
        }
      })
    }
     
    const btnAtivLocation = document.querySelector('.registerLocation')
    if(btnAtivLocation){
       btnAtivLocation.addEventListener('click' , ()=>{

          const content = document.querySelector('.content')
          if(content){
            mostrarElemento(content)
          }
  
  
         const table = document.querySelector('.tableLocation')
         if(table){
         esconderElemento(table)
         }
  
         const btnPageMain = document.querySelector('.btnInitPageMainLoc')
         if(btnPageMain){
         esconderElemento(btnPageMain)
         
         }
       })
    }
   
  
     const buttonOutLocation = document.querySelector('.outLocation')
      if(buttonOutLocation){
          buttonOutLocation.addEventListener('click' , ()=>{

            const content = document.querySelector('.content')
            if(content){
              esconderElemento(content)
            }
            const table = document.querySelector('.tableLocation')
            if(table){
               mostrarElemento(table)
            }
      
            const btnMainPage = document.querySelector('.btnInitPageMainLoc')
            if(btnMainPage){
              mostrarElemento(btnMainPage)
            }
          });
       };

     
      const registerClientPageLocationIn = document.querySelector('#registerClientPageLocation')
      if(registerClientPageLocationIn){
       registerClientPageLocationIn.addEventListener('click' , ()=>{
         
         const containerForm = document.querySelector('.LocRegisterClient')
         if(containerForm){
           mostrarElemento(containerForm)
         }
 
         const containerMain = document.querySelector('.container')
         if(containerMain){
            esconderElemento(containerMain)
         }
       });
 
     };

     const btnOutPageRegisterClientLoc = document.querySelector('.btnOutPageRegisterClientLoc')
     if(btnOutPageRegisterClientLoc){
      btnOutPageRegisterClientLoc.addEventListener('click' , ()=>{
           
        const containerForm = document.querySelector('.LocRegisterClient')
         if(containerForm){
           esconderElemento(containerForm)
         }
 
         const containerMain = document.querySelector('.container')
         if(containerMain){
            mostrarElemento(containerMain)
         }
      })
     }


     const outEditLocation = document.querySelector('.outEditLocation')
     if(outEditLocation){
        outEditLocation.addEventListener('click' , ()=>{
         
          const containerEditLocation = document.querySelector('.containerEditLocation')
          if(containerEditLocation){
            esconderElemento(containerEditLocation)
          }

          const table = document.querySelector('.tableLocation')
            if(table){
               mostrarElemento(table)
            }
      
            const btnMainPage = document.querySelector('.btnInitPageMainLoc')
            if(btnMainPage){
              mostrarElemento(btnMainPage)
            }
      })
     }
};


//BUSCAR CLIENTE
function searchClientForLocation(){
     
  const searchClient = document.querySelector("#search");
  if(searchClient){
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
    
      
        const inputNormalized = normalizeText(inputSearchClient);
        const inputCpfNormalized = normalizeCPF(inputSearchClient);
    
        // Filtrando clientes
        const clienteEncontrado = clientes.filter((cliente) => {
          const nomeNormalizado = normalizeText(cliente.clienome);
          const cpfNormalizado = normalizeCPF(cliente.cliecpf);
    
          return nomeNormalizado.includes(inputNormalized) || cpfNormalizado === inputCpfNormalized;
        });
    
        const resultDiv = document.querySelector(".searchClient");
        resultDiv.innerHTML = ""; 
    
    
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
        clienteDiv.style.color = "black"
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
  };
};

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
    const response = await fetch("/api/codefamilybens", {
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
  
    for (let i = 1; i <= 5; i++) {
      const select = document.getElementById(`family${i}`);
      const selectEdit = document.getElementById(`family${i}Edit`);

      if (select) {
        select.addEventListener("change", () => preencherProduto(i, familias));

        familias.forEach(({ fabecode }) => {
          const option = document.createElement("option");
          option.value = fabecode;
          option.textContent = fabecode;
          select.appendChild(option);

          if (selectEdit) {
            selectEdit.addEventListener("change", () => preencherProduto(i, familias));

            selectEdit.appendChild(option.cloneNode(true));
          }
        });
      } else {
        console.warn(`Select family${i} não encontrado no DOM.`);
      }
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

// PRECHER A DESCRIÇÃO DE ACORDO COM O CODIGO DE FAMILIA
function preencherProduto(index, familias) {
  const select = document.getElementById(`family${index}`);
  const selectEdit = document.getElementById(`family${index}Edit`);

  const inputProduto = document.getElementById(`produto${index}`);
  const inputProdutoEdit = document.getElementById(`produto${index}Edit`);
  const codigoSelecionado = select.value;
  const codigoSelecionadoEdit = selectEdit.value;

  const familiaSelecionada = familias.find(
    (familia) => familia.fabecode === codigoSelecionado
  );

  const familiaSelecionadaEdit = familias.find(
    (familia) => familia.fabecode === codigoSelecionadoEdit
  );

  // Atualizando o produto com base na seleção de 'family'
  if (familiaSelecionada) {
    inputProduto.value = familiaSelecionada.fabedesc || "Sem nome definido";
  } else {
    inputProduto.value = "";
  }

  if (familiaSelecionadaEdit) {
    inputProdutoEdit.value = familiaSelecionadaEdit.fabedesc || "Sem nome definido";
  } else {
    inputProdutoEdit.value = "";
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

// // ENVIO DA LOCAÇÃO FINALIZADA
async function handleSubmit() {

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

  const feriadosFixos = [
    "01-01", // Ano Novo
    "04-21", // Tiradentes
    "05-01", // Dia do Trabalhador
    "09-07", // Independência
    "10-12", // Nossa Senhora Aparecida
    "11-02", // Finados
    "11-15", // Proclamação da República
    "12-25", // Natal
  ];

  function isFeriado(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dataFormatada = `${mes}-${dia}`;
  
    return feriadosFixos.includes(dataFormatada);
  }

  function parseDataLocal(dateStr) {
    const [ano, mes, dia] = dateStr.split('-').map(Number);
    return new Date(ano, mes - 1, dia); // Mês começa do zero
  } 
  
   
  
  const totalGrups = 4;
  const bens = [];

  // Capturar dados dos grupos
  for (let i = 1; i <= totalGrups; i++) {
    const codeBen = document.getElementById(`family${i}`)?.value || "";
    const produto = document.getElementById(`produto${i}`)?.value || "";
    const quantidade = document.getElementById(`quantidade${i}`)?.value || "";
    const observacao = document.getElementById(`observacao${i}`)?.value || "";
    const dataInicioStr = document.getElementById(`dataInicio${i}`)?.value || "";
    const dataFimStr = document.getElementById(`dataFim${i}`)?.value || "";

    const isParcial = codeBen || dataInicioStr || dataFimStr || observacao || produto || quantidade;

    if (isParcial) {
         
      if (!codeBen || !dataInicioStr || !dataFimStr || !quantidade) {
        Toastify({
          text: `Grupo ${i}: Preencha código, data de início e data fim.`,
          duration: 4000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
        return;
      }


      if (!isDataValida(dataInicioStr) || !isDataValida(dataFimStr)) {
        Toastify({
          text: `Grupo ${i}: Data de início ou fim inválida/outro ano.`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
        return;
      }

     
      const dataInicio = parseDataLocal(dataInicioStr);
      const dataFim = parseDataLocal(dataFimStr);

      if (isFeriado(dataFim)) {
        Toastify({
          text: `A data FIM da locação (Grupo ${i}) cai em um feriado. Escolha outro dia.`,
          duration: 4000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
        return;
      }

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
       
      if (dataInicio < hoje || dataInicio > hoje) {
        Toastify({
          text: `Item ${i}: A data INCICIO não pode ser nem maior nem menor que a data atual.`,
          duration: 4000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
        return; 
      }

      
      if (dataFim <= dataInicio) {
        Toastify({
          text: `Grupo ${i}: A data FIM deve ser maior que a data INÍCIO.`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
        return; 
      }
      bens.push({
        codeBen,
        observacao,
        dataInicio: dataInicio.toISOString().split("T")[0],
        dataFim: dataFim.toISOString().split("T")[0],
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
   
  }

  
  try {
    const numericLocation = await obterNumeroLocacao();
    document.querySelector("#numeroLocation").value = numericLocation;
    const nameClient = document.querySelector("#nameClient").value;
    const cpfClient = document.querySelector("#cpfClient").value;

    const userClientValidade = [nameClient, cpfClient];
    const dataLocStr = document.getElementById("dataLoc")?.value || null;
    const dataDevoStr = document.getElementById("DataDevo")?.value || null;
    const pagament = document.getElementById("pagament")?.value || null;

    if (!dataDevoStr || !pagament) {
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

    if (!isDataValida(dataLocStr) || !isDataValida(dataDevoStr)) {
      Toastify({
        text: "Data de devolução INVALIDA. Verifique por favor",
        duration: 4000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
      return;
    }

    const dataLoc = new Date(dataLocStr);
    const dataDevo = parseDataLocal(dataDevoStr);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
  
    const dataLocDia = new Date(dataLoc);
    dataLocDia.setHours(0, 0, 0, 0);
  
    if (dataLocDia.getTime() !== hoje.getTime()) {
      Toastify({
        text: "A data da locação deve ser igual à data de hoje.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "orange",
      }).showToast();
      return;
    }

  
    if (dataDevo <= dataLoc) {
      Toastify({
        text: "A data de devolução deve ser maior que a data da locação.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "orange",
      }).showToast();
      return;
    }
     
   
  
    const payload = {
      numericLocation,
      userClientValidade,
      dataLoc: dataLocStr,
      dataDevo: dataDevoStr,
      pagament,
      bens,
    }; 

    console.log('Envio de dado:' , payload)

    
    const response = await fetch("/api/datalocation", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
      body: JSON.stringify(payload),
    });
    const errorData = await response.json();

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
        text: errorData.error || "Erro na locação!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
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
  const containerContent = document.querySelector('.content')
  if(containerContent){
    esconderElemento(containerContent)
  }

  // Gerar conteúdo do contrato
  const contratoDiv = document.getElementById("contrato");
  contratoDiv.innerHTML = `
    <div class=" text-white p-4 rounded">
      <h2 class="text-center mb-4">Contrato de Locação</h2>
      <hr class="border-light">
      <p><strong>Número da locação:</strong> ${numericLocation}</p>
      <p><strong>Nome do Cliente:</strong> ${nomeCliente}</p>
      <p><strong>CPF do Cliente:</strong> ${cpfCliente}</p>
      <p><strong>Data da Locação:</strong> ${dataLocacao}</p>
      <p><strong>Data de Devolução:</strong> ${dataDevolucao}</p>
      <p><strong>Forma de Pagamento:</strong> ${pagamento}</p>
      <hr class="border-light">
      <p><strong>Itens Locados:</strong></p>
      ${
        gruposBens.length > 0
          ? `
          <div class="table-responsive">
            <table class="table table-bordered table-dark table-sm">
              <thead class="table-light">
                <tr>
                  <th>Código do Bem</th>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Descrição</th>
                  <th>Data de Início</th>
                  <th>Data Final</th>
                </tr>
              </thead>
              <tbody>
                ${gruposBens.join("")}
              </tbody>
            </table>
          </div>
          `
          : "<p>Nenhum item informado.</p>"
      }
      <div class="text-center mt-4">
        <button id="voltar" class="btn btn-light">Voltar</button>
      </div>
    </div>
  `;
  contratoDiv.style.display = "block";
  

  // Adicionar evento ao botão de voltar
 const voltarPageContrato = document.getElementById("voltar")
 if(voltarPageContrato){
  voltarPageContrato.addEventListener("click", () => {
   esconderElemento(contratoDiv)
    
    const listLocation = document.querySelector('.tableLocation ')
    if(listLocation){
      mostrarElemento(listLocation)
    }

    const buttonMainPage = document.querySelector('.btnInitPageMainLoc')
     if(buttonMainPage){
      mostrarElemento(buttonMainPage)
     }
  });
 }
 
}

 // cadastrar o cliente pela a tela de locação
function registerClientPageLocation(){

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


        const buttonSubmitRegisterClient = document.querySelector('.btnRegisterClientLoc')
        if(buttonSubmitRegisterClient){
          buttonSubmitRegisterClient.addEventListener('click' , async ()=>{

            if (!$("#formRegisterClientLoc").valid()) {
              return;
            }
          
            const formDataLocation = {
              clieCode: document.querySelector("#clieCodeLoc").value, // Codigo
              clieName: document.querySelector("#clieNameLoc").value, // Nome
              cpf: document.querySelector("#cpfClientLoc").value, // CPF
              dtCad: document.querySelector("#dtCadLoc").value, // Data de Cadastro
              dtNasc: document.querySelector("#dtNascLoc").value, // Data de Nascimento
              clieCelu: document.querySelector("#clieCeluLoc").value, // Celular
              clieCity: document.querySelector("#clieCityLoc").value, // Cidade
              clieEstd: document.querySelector("#clieEstdLoc").value, // Estado
              clieRua: document.querySelector("#clieRuaLoc").value, // Rua
              clieCep: document.querySelector("#clieCepLoc").value, // Cep
              clieMail: document.querySelector("#clieMailLoc").value, // E-mail
            };
             

            const datas = [
              { key: 'dtCad',  label: 'Data de Cadastro' },
              { key: 'dtNasc', label: 'Data de Nascimento' }
            ];
            for (const { key, label } of datas) {
              const str = formDataLocation[key];
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
          
            // 4) Converte strings para Date, zerando horas
            const [yCad,  mCad,  dCad]  = formDataLocation.dtCad.split('-').map(Number);
            const [yNasc, mNasc, dNasc] = formDataLocation.dtNasc.split('-').map(Number);
            const dtCad  = new Date(yCad,  mCad - 1, dCad);
            const dtNasc = new Date(yNasc, mNasc - 1, dNasc);
            const hoje   = new Date();
            const hoje0  = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
          
            // 5) Regras de negócio:
            // 5.1) dtCad não pode ser futura
            if (dtCad.getTime() > hoje0.getTime()) {
              Toastify({
                text: "Data de Cadastro não pode ser maior que a data de hoje.",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "center",
                backgroundColor: "orange",
              }).showToast();
              return;
            }
          
            // 5.2) dtNasc não pode ser futura
            if (dtNasc.getTime() > hoje0.getTime()) {
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
            if (dtNasc.getTime() > dtCad.getTime()) {
              Toastify({
                text: "Data de Nascimento não pode ser posterior à data de cadastro.",
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
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify(formDataLocation),
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
          
              document.querySelector("#formRegisterClientLoc").reset();
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
          })
        }
       
    
     validationFormClientPageLocation();
};

