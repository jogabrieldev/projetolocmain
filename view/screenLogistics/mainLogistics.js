
const btnAtivLogistics = document.querySelector(".btnLogistic");
btnAtivLogistics.addEventListener("click", () => {

  const informative = document.querySelector(".information");
  informative.style.display = "block";
  informative.textContent = "SEÇÃO LOGISTICA";

  const containerLogistica = document.querySelector(".containerLogistica");
  containerLogistica.style.display = "flex";

  document.querySelector(".containerAppLocation").style.display = "none";
   document.querySelector('.deliveryFinish').style.display = 'none'
      
});


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
     
      const filterStatusPendente = listaLocacoes.filter(locacao => locacao.status === "Pendente");

      if (filterStatusPendente.length > 0) {
          // Criar tabela
          const table = document.createElement("table");
          table.id = "tableWithAllLocation";

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
 const buttonFilterInLocation = document.getElementById('btnFilter')
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

              console.log('Logistica checkbox:' , checkbox.value)
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
      divNeed.innerHTML = `
          <table id="tableGoodsVsRequestPending">
              <thead>
                  <tr>
                      <th>Bens Disponíveis</th>
                      <th>Bens Necessários</th>
                      <th>Família do bem</th>
                      <th>Status</th>
                      <th>Ação</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>${quantidadeDisponivel}</td>
                      <td>${quantidadeLocacao}</td>
                      <td>${familiaBem}</td>
                      <td>${statusText}</td>
                      <td>
                    ${
                      statusText === "Suficiente"
                        ? `<button class="openModal" data-familia="${familiaBem}" data-quantidade="${quantidadeLocacao}" data-cliente="${cliente}">Vincular</button>`
                        : ""
                    }
                  </td>
                  </tr>
              </tbody>
          </table>
      `;
      
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

document.addEventListener("DOMContentLoaded", async () => {
  await validateFamilyBensPending();

  const socketUpdateLogistcs = io(); 

  socketUpdateLogistcs.on("updateGoodsTable", (updatedGood) => {
      validateFamilyBensPending(); 
      needVsAvaible()
  });

  socketUpdateLogistcs.on("updateRunTimeGoods", (updatedGood) => {
      validateFamilyBensPending();
      needVsAvaible()
  });

  socketUpdateLogistcs.on("updateRunTimeFamilyBens", (updatedFamily) => {
      validateFamilyBensPending(); 
  });
  
  socketUpdateLogistcs.on('updateRunTimeRegisterLocation' , ()=>{
    validateFamilyBensPending(); 
    needVsAvaible();
  });
  socketUpdateLogistcs.on("updateRunTimeDriver", ()=>{
    loadingDriver()
  });
  socketUpdateLogistcs.on('updateRunTimeRegisterLinkGoodsLocation' , ()=>{
   locationPendente();
   loadingDriver();
   needVsAvaible();
   validateFamilyBensPending(); 

  });

});

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
      <table id="tableGoodsVsRequestPendinglll">
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
  const response = await fetch("/api/listingdriver" ,{
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
  });
  const driver = await response.json();

  const avalibleDrivers = driver.filter(
    (driver) => driver.motostat === "Disponivel"
  );

  if (avalibleDrivers.length > 0) {
    const divContainerDriver = document.querySelector(".linkDrive");
    divContainerDriver.innerHTML = ``;

    const tabela = document.createElement("table");
    tabela.classList.add = ".listDriver";
    tabela.style.width = "100%";
    tabela.setAttribute("border", "1");

    const cabecalho = tabela.createTHead();
    const linhaCabecalho = cabecalho.insertRow();
    const colunas = [
      "Selecionar",
      "Nome",
      "status",
      "Categoria da CNH",
      "Data de vencimento",
      "Restrições",
      "Orgão Emissor",
      "Celular",
      "E-mail",
    ];

    colunas.forEach((coluna) => {
      const th = document.createElement("th");
      th.textContent = coluna;
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

      checkboxCell.appendChild(checkbox);


      const motoristaData = JSON.stringify(motorista);
      if (motoristaData) {
        checkbox.dataset.driver = motoristaData;
      } else {
        console.warn(`Fornecedor inválido encontrado:`, motorista);
      }

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

    divContainerDriver.appendChild(tabela);
  } else {
    const divContainerDriver = document.querySelector(".linkDrive");
    divContainerDriver.innerHTML = "Nenhum motorista disponivel";
  }
};

// pagina que vincula o bem
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

    const modalDiv = document.querySelector(".modal");
    modalDiv.innerHTML = `
      <div class="modal-content">
          <h2>Detalhes da Locação</h2>
          <P>Cliente: <strong>${cliente}</strong></p>
          <p>Família do Bem: <strong>${familiaBem}</strong></p>
          <p>Quantidade Solicitada: <strong>${quantidadeLocacao}</strong></p>
          <p>Bens Vinculados: <strong id="contadorVinculados">0</strong>/${quantidadeLocacao}</p>


          <h2>Bens Disponíveis</h2>
          <table id="bensDisponiveis">
              <thead>
                  <tr>
                      <th>Código</th>
                      <th>Descrição</th>
                      <th>Ação</th>
                  </tr>
              </thead>
              <tbody>
                  ${
                    bensFiltrados.length > 0
                      ? bensFiltrados
                          .map(
                            (bem) => `
                              <tr>
                                  <td>${bem.benscode}</td>
                                  <td>${bem.bensnome}</td>
                                  <td><button class="vincular-bem" data-id="${bem.benscode}">Vincular</button></td>
                              </tr>
                          `
                          )
                          .join("")
                      : `<tr><td colspan="3">Nenhum bem disponível.</td></tr>`
                  }
              </tbody>
          </table>
          <button class = "OutScreenLinkGoods">Volta</button>
      </div>
    `;

   
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

modalDiv.style.display = "block";

    if ((modalDiv.style.display = "block")) {
      document.querySelector(".containerLogistica").style.display = "none";
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

        modalDiv.style.display = "none";
        const containerLogistica = document.querySelector( ".containerLogistica");
        containerLogistica.style.display = "flex";
      });

  } catch (error) {
    console.error("Erro ao abrir modal", error);
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
      body: JSON.stringify({ bensstat: "Locado" }),
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
      bemRow.querySelector(".status-bem").textContent = "Locado";
    }

    const motoRow = document.querySelector(`[data-motocode="${motoId}"]`);
    if (motoRow) {
      motoRow.querySelector(".status-moto").textContent = "Entrega destinada";
    }

    document.querySelectorAll("tr td:nth-child(3)").forEach((td) => {
      if (td.previousElementSibling.textContent.trim() === locationId) {
        td.textContent = "Em Locação";
      }
    });
    
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

