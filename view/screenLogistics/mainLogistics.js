
const socketLogistcs = io()
document.addEventListener('DOMContentLoaded' , ()=>{
    
   const btnLoadLogistics = document.querySelector('.btnLogistic')
   if(btnLoadLogistics){
      btnLoadLogistics.addEventListener('click' , async ()=>{
          
         try {
              
          const responseLogistcs = await fetch('/logistcs' ,{
            method: 'GET'
          });
          if (!responseLogistcs.ok) throw new Error(`Erro HTTP: ${responseLogistcs.status}`);
          const html = await responseLogistcs.text();
          const mainContent = document.querySelector('#mainContent');
          if (mainContent) {
            mainContent.innerHTML = html;
            
            
            needVsAvaible();
            validateFamilyBensPending();
            loadingDriver();
            filterLocation();
          
            
          }else{
            console.error('#mainContent não encontrado no DOM');
            return;
          }
            
          const informative = document.querySelector(".information");
          informative.style.display = "block";
          informative.textContent = "SEÇÃO LOGISTICA";
        
          const containerLogistica = document.querySelector(".containerLogistica");
          if(containerLogistica){
             containerLogistica.classList.remove('hidden')
             containerLogistica.classList.add('flex')
          }

          const modalVinvular = document.querySelector('.modal')
          if(modalVinvular){
            modalVinvular.classList.remove('flex')
            modalVinvular.classList.add('hidden')
          }
          
          const containerLocation = document.querySelector('.containerAppLocation')
          if(containerLocation){
            containerLocation.classList.remove('flex')
            containerLocation.classList.add('hidden')
          }
 
          const containerDelivery = document.querySelector('.deliveryFinish')
          if(containerDelivery){
             containerDelivery.classList.remove('flex')
             containerDelivery.classList.add('hidden')
          }
          
         } catch (error) {
           console.error('Erro ao carregar dados de logistica')
         }

        socketLogistcs.on("updateGoodsTable", (updatedGood) => {
          validateFamilyBensPending(); 
          needVsAvaible()
      });
    
      socketLogistcs.on("updateRunTimeGoods", (updatedGood) => {
          validateFamilyBensPending();
          needVsAvaible()
      });
    
      socketLogistcs.on("updateRunTimeFamilyBens", (updatedFamily) => {
          validateFamilyBensPending(); 
      });
      
      socketLogistcs.on('updateRunTimeRegisterLocation' , ()=>{
        validateFamilyBensPending(); 
        needVsAvaible();
      });
      socketLogistcs.on("updateRunTimeDriver", ()=>{
        loadingDriver()
      });
      socketLogistcs.on('updateRunTimeRegisterLinkGoodsLocation' , ()=>{
       locationPendente();
       loadingDriver();
       needVsAvaible();
       validateFamilyBensPending(); 
    
      });
      await locationPendente();
      })
   }
   
})

//  my table location 
async function locationPendente() {
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
      const response = await fetch("/api/locationFinish", {
          method: "GET",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
      });

      if(response.status === 404){
         document.querySelector('.orders').innerHTML = "Nenhuma Locação encontrada"
      }

      if (!response.ok) throw new Error("Erro ao buscar locações.");

      const data = await response.json();
      const locacao = data.locacoes || []

      const tableDiv = document.querySelector(".orders");
      if(tableDiv){
        tableDiv.innerHTML = ""; 
       }
     

      const listaLocacoes = locacao.flatMap((locacao) => {
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
      })
     
      const filterStatusPendente = listaLocacoes.filter(locacao => locacao.status === "Pendente");

      if (filterStatusPendente.length > 0) {
          // Criar tabela
          const table = document.createElement("table");
          table.id = "tableWithAllLocation";
          // table.className = "compact-table table table-sm table-bordered table-striped table-hover";

          const thead = document.createElement("thead");
          const headerRow = document.createElement("tr");
          const headers = ["Selecionar", "Número de Locação", "Status", "Nome do Cliente", "Data da Locação", "Data de Devolução", "Familia do bem", "Descrição", "Quantidade"];

          headers.forEach(text => {
              const th = document.createElement("th");
              th.textContent = text;
              headerRow.appendChild(th);
          });
          thead.appendChild(headerRow);
          table.appendChild(thead);

          // Criar corpo da tabela
          const tbody = document.createElement("tbody");

          filterStatusPendente.forEach(locacao => {
              const row = document.createElement("tr");

              // Criar checkbox
              const tdCheckbox = document.createElement("td");
              const checkbox = document.createElement("input");
              checkbox.type = "checkbox";
              checkbox.classList.add("select-location");
              checkbox.value = locacao.numeroLocacao;
              checkbox.dataset.quantidade = locacao.quantidade;
              checkbox.dataset.familia = locacao.codigoBem;
              checkbox.dataset.cliente = locacao.nomeCliente;
              tdCheckbox.appendChild(checkbox);
              row.appendChild(tdCheckbox);

              // Criar células com os dados
              const values = [locacao.numeroLocacao, locacao.status, locacao.nomeCliente, locacao.dataLocacao, locacao.dataDevolucao, locacao.codigoBem, locacao.produto, locacao.quantidade];
              values.forEach(text => {
                  const td = document.createElement("td");
                  td.textContent = text;
                  row.appendChild(td);
              });

              tbody.appendChild(row);
          });

          table.appendChild(tbody);
          tableDiv.appendChild(table);

          // Adicionar evento aos checkboxes
          document.querySelectorAll(".select-location").forEach(checkbox => {
              checkbox.addEventListener("change", (event) => {
                  const quantidadeLocacao = parseInt(event.target.dataset.quantidade);
                  const isChecked = event.target.checked;
                  const familiaBem = event.target.dataset.familia;
                  const cliente = event.target.dataset.cliente;

                  needVsAvaible(cliente, quantidadeLocacao, familiaBem, isChecked);
                  loadingDriver()
              });
          });

      } else {
          const msg = document.createElement("p");
          msg.style.textAlign = "center";
          msg.textContent = "Nenhuma locação pendente encontrada.";
          tableDiv.appendChild(msg);
      }
  } catch (error) {
      console.error("Erro para gerar tabela locação!!", error);
  }
};

// filtrar EM LOCAÇÃO
function filterLocation(){
      const buttonFilterInLocation = document.getElementById('btnFilter')
      if(buttonFilterInLocation){
        buttonFilterInLocation.addEventListener('click' , async ()=>{
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
            const response = await fetch("/api/locationFinish", {
              method: "GET",
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
          });
        
          if(response.status === 404){
             document.querySelector('.orders').innerHTML = "Nenhuma Locação encontrada"
          }
        
          if (!response.ok) throw new Error("Erro ao buscar locações.");
        
          const data = await response.json();
          const locacao = data.locacoes || []
        
          const tableDiv = document.querySelector(".orders");
          tableDiv.innerHTML = ""; 
        
          const listaLocacoes = locacao.flatMap((locacao) => {
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
          })
         
          const filterStatusEmLocacao = listaLocacoes.filter(locacao => locacao.status === "Em Locação");
        
              if (filterStatusEmLocacao.length > 0) {
                  // Criar tabela
                  const table = document.createElement("table");
                  table.id = "tableWithAllLocation";
        
                  const thead = document.createElement("thead");
                  const headerRow = document.createElement("tr");
                  const headers = ["Selecionar", "Número de Locação", "Status", "Nome do Cliente", "Data da Locação", "Data de Devolução", "Familia do bem", "Descrição", "Quantidade" , "Edição"];
        
                  headers.forEach(text => {
                      const th = document.createElement("th");
                      th.textContent = text;
                      headerRow.appendChild(th);
                  });
                  thead.appendChild(headerRow);
                  table.appendChild(thead);
        
                  // Criar corpo da tabela
                  const tbody = document.createElement("tbody");
        
                  filterStatusEmLocacao.forEach(locacao => {
                      const row = document.createElement("tr");
        
                      // Criar checkbox
                      const tdCheckbox = document.createElement("td");
                      const checkbox = document.createElement("input");
                      checkbox.type = "checkbox";
                      checkbox.classList.add("select-location");
                      checkbox.value = JSON.stringify(locacao);
                      checkbox.dataset.quantidade = locacao.quantidade;
                      checkbox.dataset.familia = locacao.codigoBem;
                      checkbox.dataset.cliente = locacao.nomeCliente;
                      tdCheckbox.appendChild(checkbox);
                      row.appendChild(tdCheckbox);
        
        
                      // Criar células com os dados
                      const values = [locacao.numeroLocacao, locacao.status, locacao.nomeCliente, locacao.dataLocacao, locacao.dataDevolucao, locacao.codigoBem, locacao.produto, locacao.quantidade ];
                      values.forEach(text => {
                          const td = document.createElement("td");
                          td.textContent = text;
                          row.appendChild(td);
                      });
        
                      const tdEdit = document.createElement("td");
                      const buttonEdit = document.createElement("button");
                      buttonEdit.textContent = "Editar";
                      buttonEdit.classList.add("buttonEditLocationFinish");
                      buttonEdit.dataset.id = locacao.numeroLocacao; // ou outro ID que desejar
                      tdEdit.appendChild(buttonEdit);
                      row.appendChild(tdEdit);
              
                      tbody.appendChild(row);
        
                      tbody.appendChild(row);
        
                  });
        
                  
        
                  table.appendChild(tbody);
                  tableDiv.appendChild(table);
        
                  Toastify({
                    text:`Filtro aplicado (EM LOCAÇÃO)! quantidade ${filterStatusEmLocacao.length}`,
                    duration: 4000,
                    close: true,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "green",
                  }).showToast();
                  return; 
        
                } else{
                  locationPendente()
                  Toastify({
                    text: "Não temos locações com status (Em Locação)!",
                    duration: 4000,
                    close: true,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "orange",
                  }).showToast();
                  return; 
                }
                
           } catch (error) {
             console.error('Erro para filtar em locação' , error)
             Toastify({
              text: "Erro para filtar em locação!",
              duration: 4000,
              close: true,
              gravity: "top",
              position: "center",
              backgroundColor: "orange",
            }).showToast();
            return; 
           }
         });
      };
};


// Necessidade vs Disponibilidade
async function needVsAvaible(cliente, quantidadeLocacao, familiaBem, isChecked) {
    
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
    const bensResponse = await fetch("/api/listbens" , {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    });
    if (!bensResponse.ok) throw new Error("Erro ao buscar bens.");
    const bens = await bensResponse.json();

    const bensFiltrados = bens.filter((bem) => {
      bem.bensstat === "Disponivel" && bem.benscofa === familiaBem;
      return bem.bensstat === "Disponivel" && bem.benscofa === familiaBem;
    });

    const quantidadeDisponivel = bensFiltrados.length;

    const statusText =
      quantidadeDisponivel >= quantidadeLocacao ? "Suficiente" : "Insuficiente";
      
   // preciso tratar essa parte para dar uma solução para o usuario  quando tiver "Insufisiente"!!!
      if(statusText === "Insuficiente" && isChecked){
        const containerNeed = document.querySelector('.need')
        containerNeed
        Toastify({
          text: "Não temos a quantidade de bens necessaria para essa locação",
          duration: 4000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
        return; 

      }

    if (isChecked) {
      const divNeed = document.querySelector(".need");
      divNeed.innerHTML = ''
      const table = document.createElement("table");
      table.id = "tableGoodsVsRequestPending";
      table.classList.add("table", "table-bordered", "table-sm"); // se estiver usando Bootstrap
      table.style.width = "100%"; // força ocupar o espaço da div
      table.style.tableLayout = "fixed"; // garante que largura fique balanceada  
      
      // Cabeçalho da tabela
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      ["Bens Disponíveis", "Bens Necessários", "Família do bem", "Status", "Ação"].forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);
      
      // Corpo da tabela
      const tbody = document.createElement("tbody");
      const row = document.createElement("tr");
      
      // Células com os valores
      const tdDisponivel = document.createElement("td");
      tdDisponivel.textContent = quantidadeDisponivel;
      
      const tdNecessario = document.createElement("td");
      tdNecessario.textContent = quantidadeLocacao;
      
      const tdFamilia = document.createElement("td");
      tdFamilia.textContent = familiaBem;
      
      const tdStatus = document.createElement("td");
      tdStatus.textContent = statusText;
      
      const tdAcao = document.createElement("td");
      if (statusText === "Suficiente") {
        const btn = document.createElement("button");
        btn.classList.add("openModal");
        btn.textContent = "Vincular";
        btn.dataset.familia = familiaBem;
        btn.dataset.quantidade = quantidadeLocacao;
        btn.dataset.cliente = cliente;
        tdAcao.appendChild(btn);
      }
      
      // Adiciona as células à linha
      [row, tdDisponivel, tdNecessario, tdFamilia, tdStatus, tdAcao].forEach(td => {
        if (td !== row) row.appendChild(td);
      });
      tbody.appendChild(row);
      table.appendChild(tbody);
      
      // Adiciona a tabela à div
      divNeed.appendChild(table);
      
      
      const btnModal = document.querySelector(".openModal");
      if (btnModal) {
        btnModal.addEventListener("click", (event) => {
          const familiaBem = event.target.dataset.familia;
          const quantidadeLocacao = event.target.dataset.quantidade;
          const cliente = event.target.dataset.cliente;

          abrirModal(cliente, familiaBem, quantidadeLocacao);
        });
      }
    } else {
      const divNeed = document.querySelector(".need");
      divNeed.innerHTML = "";
      const divDrive = document.querySelector(".linkDrive");
      divDrive.innerHTML = "";
    }
  } catch (error) {
    console.error("Erro ao buscar os dados para compara necessidade e disponibilidade", error);
  }
};


// COMPARAÇÃO ENTRE DISPONIVEL E PENDENCIA
async function validateFamilyBensPending() {

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
    const bensResponse = await fetch("/api/listbens",{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    });
    const bens = await bensResponse.json();

    const listFamilyBens = await fetch("/api/listfabri" , {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    });
    const familyBens = await listFamilyBens.json();

    const locationResponse = await fetch("/api/locationFinish" , {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    });
    
    const locations = await locationResponse.json();
    const bensLoc = locations.locacoes?.flatMap(loc => loc.bens) || [];

    const resultadosPorFamilia = familyBens.reduce((acc, familia) => {
      const codigoFamilia = familia.fabecode;
      const familiaDescrição = familia.fabedesc;

      const bensDisponiveis = bens.filter(
        (bem) => bem.bensstat === "Disponivel" && bem.benscofa === codigoFamilia
      ).length;

      // Contar pedidos pendentes para essa família
      const pedidosPendentes = bensLoc.filter(
        (bem) => bem.belostat === "Pendente" && bem.bencodb === codigoFamilia
      ).length;

      acc[codigoFamilia] = {
        familiaDescrição,
        bensDisponiveis,
        pedidosPendentes,
      };
      return acc;
    }, {});

    // Renderizar os resultados na tabela
    let tableRows = "";
    for (const [
      codigoFamilia,
      { familiaDescrição, bensDisponiveis, pedidosPendentes },
    ] of Object.entries(resultadosPorFamilia)) {
      tableRows += `
        <tr>
          <td> ${codigoFamilia}</td>
          <td>${familiaDescrição}</td>
          <td>${bensDisponiveis}</td>
          <td>${pedidosPendentes}</td>
        </tr>
      `;
    }

    const divNeed = document.querySelector(".validadeFamily");
    divNeed.innerHTML = `
      <table id="tableGoodsVsRequestPendingall">
        <thead>
          <tr>
            <th>Codigo da familia</th>
            <th>Descrição
            <th>Bens Disponíveis</th>
            <th>Pedidos Pendentes</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;
  } catch (error) {
    console.error("Erro ao validar os bens e pedidos:", error);
  }
};

// CARREGAR MOTORISTA DISPONIVEIS
async function loadingDriver() {
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

  const response = await fetch("/api/listingdriver", {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  const driver = await response.json();

  const avalibleDrivers = driver.filter(d => d.motostat === "Disponivel");

  const divContainerDriver = document.querySelector(".linkDrive");
  if(divContainerDriver){
    divContainerDriver.innerHTML = "";
  }else{
    console.warn('ERRO MOTORISTA')
  }
 

  if (avalibleDrivers.length > 0) {
    // Wrapper responsivo da tabela (Bootstrap)
    const wrapper = document.createElement("div");
    wrapper.className = "table-responsive";

    const tabela = document.createElement("table");
    tabela.className = "table table-sm table-bordered table-hover align-middle listDriver";
    tabela.classList.add('tableDriver')

    const cabecalho = tabela.createTHead();
    const linhaCabecalho = cabecalho.insertRow();
    const colunas = [
      "Selecionar",
      "Nome",
      "Status",
      "Categoria da CNH",
      "Data de vencimento",
      "Restrições",
      "Órgão Emissor",
      "Celular",
      "E-mail"
    ];

    colunas.forEach((coluna) => {
      const th = document.createElement("th");
      th.textContent = coluna;
      th.className = "text-nowrap text-center";
      linhaCabecalho.appendChild(th);
    });

    const corpo = tabela.createTBody();
    avalibleDrivers.forEach((motorista) => {
      const linha = corpo.insertRow();
      linha.setAttribute("data-motocode", motorista.motocode);

      const checkboxCell = linha.insertCell();
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "selectDriver";
      checkbox.value = motorista.motocode;
      checkbox.classList.add("checkbox-motorista");
      checkbox.dataset.driver = JSON.stringify(motorista);

      checkboxCell.appendChild(checkbox);

      linha.insertCell().textContent = motorista.motoname;
      linha.insertCell().textContent = motorista.motostat;
      linha.insertCell().textContent = motorista.motoctch;
      linha.insertCell().textContent = formatDate(motorista.motodtvc);
      linha.insertCell().textContent = motorista.motorest;
      linha.insertCell().textContent = motorista.motoorem;
      linha.insertCell().textContent = motorista.motocelu;
      linha.insertCell().textContent = motorista.motomail;
    });

    wrapper.appendChild(tabela);
    divContainerDriver.appendChild(wrapper);
  } else {
    divContainerDriver.textContent = "Nenhum motorista disponível.";
  }
}


async function abrirModal(cliente, familiaBem, quantidadeLocacao) {
     
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
    const response = await fetch("/api/listbens" , {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    });
    if (!response.ok) throw new Error("Erro ao buscar bens.");
    const bens = await response.json();

    const bensFiltrados = bens.filter(
      (bem) => bem.bensstat === "Disponivel" && bem.benscofa === familiaBem
    );
     
    const modalWrapper = document.querySelector(".modal");
    if(!modalWrapper){
       console.warn('Elemento não presente no html')
    }

    // Limpar conteúdo anterior
    modalWrapper.innerHTML = ""; 

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
  
    // Título principal
    const title = document.createElement("h2");
    title.textContent = "Detalhes da Locação";
    modalContent.appendChild(title);
    
    // Cliente
    const pCliente = document.createElement("p");
    pCliente.innerHTML = `Cliente: <strong>${cliente}</strong>`;
    modalContent.appendChild(pCliente);
    
    // Família do bem
    const pFamilia = document.createElement("p");
    pFamilia.innerHTML = `Família do Bem: <strong>${familiaBem}</strong>`;
    modalContent.appendChild(pFamilia);
    
    // Quantidade solicitada
    const pQuantidade = document.createElement("p");
    pQuantidade.innerHTML = `Quantidade Solicitada: <strong>${quantidadeLocacao}</strong>`;
    modalContent.appendChild(pQuantidade);
    
    // Bens vinculados
    const pVinculados = document.createElement("p");
    pVinculados.innerHTML = `Bens Vinculados: <strong id="contadorVinculados">0</strong>/${quantidadeLocacao}`;
    modalContent.appendChild(pVinculados);
    
    // Título "Bens Disponíveis"
    const titleBens = document.createElement("h2");
    titleBens.textContent = "Bens Disponíveis";
    modalContent.appendChild(titleBens);
    
    // Tabela
    const table = document.createElement("table");
    table.id = "bensDisponiveis";
    
    // Cabeçalho da tabela
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["Código", "Descrição", "Ação"].forEach(header => {
      const th = document.createElement("th");
      th.textContent = header;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Corpo da tabela
    const tbody = document.createElement("tbody");
    
    if (bensFiltrados.length > 0) {
      bensFiltrados.forEach(bem => {
        const tr = document.createElement("tr");
    
        const tdCodigo = document.createElement("td");
        tdCodigo.textContent = bem.benscode;
    
        const tdDescricao = document.createElement("td");
        tdDescricao.textContent = bem.bensnome;
    
        const tdAcao = document.createElement("td");
        const btn = document.createElement("button");
        btn.classList.add("vincular-bem");
        btn.dataset.id = bem.benscode;
        btn.textContent = "Vincular";
        tdAcao.appendChild(btn);
    
        tr.appendChild(tdCodigo);
        tr.appendChild(tdDescricao);
        tr.appendChild(tdAcao);
    
        tbody.appendChild(tr);
      });
    } else {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 3;
      td.textContent = "Nenhum bem disponível.";
      td.style.textAlign = "center";
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
    
    table.appendChild(tbody);
    modalContent.appendChild(table);
    modalWrapper.appendChild(modalContent)
    
    // Botão voltar
    const btnVoltar = document.createElement("button");
    btnVoltar.classList.add("OutScreenLinkGoods");
    btnVoltar.textContent = "Volta";
    modalContent.appendChild(btnVoltar);
    
   
    

    let motoristasSelecionados = Array.from(document.querySelectorAll(".checkbox-motorista:checked"))
    .map(cb => cb.value);

if (motoristasSelecionados.length === 0) {
  Toastify({
    text: "Selecione 1 motorista para a entrega",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "center",
    backgroundColor: "red",
  }).showToast();
  return;
}

modalWrapper.classList.remove('hidden')
modalWrapper.classList.add('flex')

    if (modalContent) {
      const conteiner =  document.querySelector(".containerLogistica")
       if(conteiner){
        conteiner.classList.remove('flex')
        conteiner.classList.add('hidden')
       }
    }
      
    let quantidadeVinculada = 0
    const botoesVincular = document.querySelectorAll(".vincular-bem");

    botoesVincular.forEach((botao) => {
      botao.addEventListener("click", async function () {

        if (quantidadeVinculada >= quantidadeLocacao) return;

        const bemId = botao.dataset.id;
        const sucesso = await vincularBem(bemId, familiaBem, motoristasSelecionados);
           
        if (sucesso) {
          quantidadeVinculada++;
          contadorVinculados.textContent = quantidadeVinculada;

          botao.closest("tr").remove();

          // Desativar botões caso atinja o limite
          if (quantidadeVinculada >= quantidadeLocacao) {
            document.querySelectorAll(".vincular-bem").forEach(btn => btn.disabled = true);
          }
        }
      });
    });
    // Evento para fechar a pagina de vinculo
    document.querySelector(".OutScreenLinkGoods").addEventListener("click", () => {

        modalWrapper.classList.remove('flex')
        modalWrapper.classList.add('hidden')
        const containerLogistica = document.querySelector( ".containerLogistica");
        if(containerLogistica){
          containerLogistica.classList.remove('hidden')
          containerLogistica.classList.add('flex')
        }
       
      });

  } catch (error) {
    console.error("Erro ao abrir modal e vincular bem", error);
  }
}

// vincular o bem a locação marcada
async function vincularBem(bemId, familiaBem, motoId) {

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
    const resunt = await fetch('/api/locationFinish', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!resunt.ok) {
      throw new Error("Erro ao obter dados da locação");
    }
 
    const locacao = await resunt.json()
   
    const locations = await locacao.locacoes || [];
    
    
    if (!Array.isArray(locations) || locations.length === 0) {
      throw new Error("Não foi possível localizar dados de locação.");
    }

    const locacaoSelecionada = document.querySelector(".select-location:checked");
    
    if (!locacaoSelecionada) {
      Toastify({
        text: `Nenhuma locação selecionada`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
      return;
    }
    
    // Obtendo o número da locação selecionada
    const numeroLocacaoSelecionado = locacaoSelecionada.value;
    
    // Filtrando a locação correspondente
    const locacaoEncontrada =  locations.find(loc => loc.cllonmlo === numeroLocacaoSelecionado);
    
    if (!locacaoEncontrada) {
      Toastify({
        text: `Locação não encontrada na base de dados.`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
      return;
    }
    
  
    const meioPagamento = locacaoEncontrada.cllopgmt;
    
    const tr = locacaoSelecionada.closest("tr");

    const locationId = tr.querySelector("td:nth-child(2)").textContent.trim();

    const nomeCliente = tr
      .querySelector("td:nth-child(4)")
      .textContent.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();

    const responseClientes = await fetch("/api/listclient" , {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    });
    if (!responseClientes.ok)
      throw new Error("Erro ao obter lista de clientes");

    const clientes = await responseClientes.json();

    const clienteEncontrado = clientes.find(
      (cliente) =>
        cliente.clienome
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .trim()
          .toLowerCase() === nomeCliente
    );

    if (!clienteEncontrado) {
      Toastify({
        text: `Cliente "${nomeCliente}" não encontrado na base de dados!`,
        duration: 4000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();

      return;
    }

    const idClient = clienteEncontrado.cliecode;

    const confirmacao = confirm(
      `Deseja vincular o bem ${bemId} ao cliente ${nomeCliente} (Locação ${locationId})?`
    );

    if (!confirmacao) return;

    const response = await fetch("/logistics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bemId,
        familiaBem,
        idClient,
        locationId,
        driver: motoId,
        pagament: meioPagamento
      }),
    });

    if (!response.ok) throw new Error("Erro ao vincular bem.");

    if(response.ok){
      renderTableDelivery()
    }

    const statusUpdateResponse = await fetch(`/api/updatestatus/${bemId}`, {
      method: "PUT",
      headers:{ 
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ bensstat: "Em Locação" }),
    });

    const statusUpdateResponseLocation = await fetch(
      `/api/updatestatuslocation/${familiaBem}`,
      {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
        body: JSON.stringify({ belostat: "Em Locação" }),
      }
    );

    const statusUptadeDrive = await fetch(
      `/api/updatestatusMoto/${motoId}`,
      {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
        body: JSON.stringify({ motostat: "Entrega destinada" }),
      }
    );

    if ( !statusUpdateResponse.ok || !statusUpdateResponseLocation.ok || !statusUptadeDrive) {
      throw new Error(
        "Erro ao atualizar status do bem , do motorista ou da locação."
      );
    }

    const bemRow = document.querySelector(`[data-benscode="${bemId}"]`);
    if (bemRow) {
      const statusBem = bemRow.querySelector(".status-bem");
      if (statusBem) statusBem.textContent = "Em Locação";
    }
    
    const motoRow = document.querySelector(`[data-motocode="${motoId}"]`);
    if (motoRow) {
      const statusMoto = motoRow.querySelector(".status-moto");
      if (statusMoto) statusMoto.textContent = "Entrega destinada";
    }
    
    const statusTdLocation = tr.querySelector("td:nth-child(3)");
    if (statusTdLocation) {
      statusTdLocation.textContent = "Em Locação";
    }
;
    
    Toastify({
      text: "Bem vinculado com sucesso!",
      duration: 4000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "green",
    }).showToast();

    return true;
  } catch (error) {
    console.error("Erro ao vincular bem", error);
    Toastify({
      text: "Erro ao vincular o bem!",
      duration: 4000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
  }
};

