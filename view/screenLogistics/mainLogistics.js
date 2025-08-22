const socketLogistcs = io();
document.addEventListener("DOMContentLoaded", () => {
  const btnLoadLogistics = document.querySelector(".btnLogistic");
  if (btnLoadLogistics) {
    btnLoadLogistics.addEventListener("click", async () => {
      try {
        const responseLogistcs = await fetch("/logistcs", {
          method: "GET",
        });
        if (!responseLogistcs.ok)
          throw new Error(`Erro HTTP: ${responseLogistcs.status}`);
        const html = await responseLogistcs.text();
        const mainContent = document.querySelector("#mainContent");
        if (mainContent) {
          mainContent.innerHTML = html;
          locationPendente();
          needVsAvaible();
          btnExitSection();
          validateFamilyBensPending();
          loadingDriver();
          filterLocation();
          validLocationHours();
        } else {
          console.error("#mainContent não encontrado no DOM");
          return;
        }

        const informative = document.querySelector(".information");
        informative.style.display = "block";
        informative.textContent = "SESSÃO LOGISTICA";

        const containerLogistica = document.querySelector(".containerLogistica");
        if (containerLogistica) {
          containerLogistica.classList.remove("hidden");
          containerLogistica.classList.add("flex");
        }

        const modalVinvular = document.querySelector(".modal");
        if (modalVinvular) {
          modalVinvular.classList.remove("flex");
          modalVinvular.classList.add("hidden");
        }

        const containerLocation = document.querySelector(
          ".containerAppLocation"
        );
        if (containerLocation) {
          containerLocation.classList.remove("flex");
          containerLocation.classList.add("hidden");
        }

        const containerDelivery = document.querySelector(".deliveryFinish");
        if (containerDelivery) {
          containerDelivery.classList.remove("flex");
          containerDelivery.classList.add("hidden");
        }
      } catch (error) {
        console.error("Erro ao carregar dados de logistica");
      };

      socketLogistcs.on("updateGoodsTable", (updatedGood) => {
        validateFamilyBensPending();
        needVsAvaible();
      });

      socketLogistcs.on("updateRunTimeGoods", (updatedGood) => {
        validateFamilyBensPending();
       
      });

      socketLogistcs.on("updateRunTimeFamilyBens", (updatedFamily) => {
        validateFamilyBensPending();
      });

      socketLogistcs.on("updateRunTimeRegisterLocation", () => {
        validateFamilyBensPending();
        
      });
      socketLogistcs.on("updateRunTimeDriver", () => {
        loadingDriver();
      });
      socketLogistcs.on("updateRunTimeRegisterLinkGoodsLocation", () => {
        locationPendente();
        loadingDriver();
        needVsAvaible();
        validateFamilyBensPending();
      });
      await locationPendente();
    });
  };
});

// ARRUMAR PARA FECHAR SECTION
function btnExitSection(){
    const btnExit = document.getElementById('btnExitSection')
    if(btnExit){
      btnExit.addEventListener('click' , ()=>{
          const containerLogistics = document.querySelector('.containerLogistica')
          if(containerLogistics){
            containerLogistics.style.display = 'none'
            containerLogistics.classList.remove('d-flex')
          }
      });
    } 
};

//TABELA DE LOCAÇÃO PENDENTE
const vinculacoesPendentes = new Map();

async function locationPendente() {
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
    const response = await fetch("/api/locationFinish", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 404) {
      document.querySelector(".orders").innerHTML ="<p class=' text-danger text-center'>Nenhuma Locação encontrada ainda!</p>";
      return;
    }

    if (!response.ok) {
      const erroTexto = await response.text();
      console.error("Erro HTTP:", response.status, erroTexto);
      throw new Error("Erro ao buscar locações.");
    }

    const data = await response.json();
    const locacoes = data.locacoes || [];

    const tableDiv = document.querySelector(".orders");
    if (tableDiv) {
      tableDiv.innerHTML = "";
    }

    const listaLocacoes = locacoes.flatMap((locacao) => {
      // Garante que a propriedade "bens" está definida e é um array
      if (Array.isArray(locacao.bens) && locacao.bens.length > 0) {
        return locacao.bens.map((bem) => ({
          idClient: locacao.clloid,
          codigoLoc: bem.belocode,
          numeroLocacao: locacao.cllonmlo || "Não definido",
          nomeCliente: locacao.clloclno || "Não definido",
          cpfCliente: locacao.cllocpf || "Não definido",
          dataLocacao: formatDataPattersBr(locacao.cllodtlo),
          dataDevolucao: formatDataPattersBr(locacao.cllodtdv),
          formaPagamento: locacao.cllopgmt || "Não definido",
          codigoBem: bem.belocodb || "-",
          produto: bem.belobem || "Nenhum bem associado",
          quantidade: bem.beloqntd || "-",
          status: bem.belostat || "Não definido",
          observacao: bem.beloobsv || "Sem observação",
          dataInicio: formatDataPattersBr(bem.belodtin),
          dataFim: formatDataPattersBr(bem.belodtfi),
        }));
      } else{
        return []
      }
    });

    const filterStatusPendente = listaLocacoes.filter((locacao) => locacao.status === "Pendente");

  if (filterStatusPendente.length > 0) {
  const wrapper = document.createElement("div");
  wrapper.className = "table-responsive"; // Scroll em telas pequenas

  const table = document.createElement("table");
  table.id = "tabelaLocacoesPendentes";
  table.className = "table table-sm table-bordered table-hover table-striped text-center mb-0 w-100";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const headers = [
    "Selecionar",
    "Número de Locação",
    "Status",
    "Nome do Cliente",
    "Data da Locação",
    "Data de Devolução",
    "Familia do bem",
    "Descrição",
    "Quantidade",
  ];

  headers.forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    th.scope = "col";
    th.className = "px-1 py-1";
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  const vinculacoesPendentes = new Map();

  filterStatusPendente.forEach((locacao) => {
    const row = document.createElement("tr");

    const tdCheckbox = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("form-check-input", "select-location", "mx-auto", "d-block");
    checkbox.value = locacao.numeroLocacao;
    checkbox.dataset.quantidade = locacao.quantidade;
    checkbox.dataset.familia = locacao.codigoBem;
    checkbox.dataset.cliente = locacao.nomeCliente;
    checkbox.dataset.belocode = locacao.codigoLoc;

    tdCheckbox.appendChild(checkbox);
    row.appendChild(tdCheckbox);

    const values = [
      locacao.numeroLocacao,
      locacao.status,
      locacao.nomeCliente,
      locacao.dataLocacao,
      locacao.dataDevolucao,
      locacao.codigoBem,
      locacao.produto,
      locacao.quantidade,
    ];

    values.forEach((text) => {
      const td = document.createElement("td");
      td.textContent = text;
      td.className = "px-1 py-1";
      row.appendChild(td);
    });

    tbody.appendChild(row);

    checkbox.addEventListener("change", (event) => {
      const quantidade = parseInt(event.target.dataset.quantidade);
      const isChecked = event.target.checked;
      const numeroLocacao = event.target.value;
      const familiaBem = event.target.dataset.familia;
      const cliente = event.target.dataset.cliente;
      const codeLoc = event.target.dataset.belocode;

      needVsAvaible(cliente, quantidade, familiaBem, isChecked, codeLoc);
      loadingDriver();

      if (isChecked) {
        if (!vinculacoesPendentes.has(numeroLocacao)) {
          vinculacoesPendentes.set(numeroLocacao, {});
        }

        const familias = vinculacoesPendentes.get(numeroLocacao);
        if (!familias[familiaBem]) {
          familias[familiaBem] = {
            solicitados: quantidade,
            vinculados: 0,
          };
        }
      } else {
        vinculacoesPendentes.delete(numeroLocacao);
      }
    });
  });

  table.appendChild(tbody);
  wrapper.appendChild(table);     
  tableDiv.appendChild(wrapper); 

} else {
  const msg = document.createElement("p");
  msg.innerHTML = "<p class='text-danger text-center'>Nenhuma locação pendente encontrada.</p>";
  tableDiv.appendChild(msg);
}
  } catch (error) {
    console.error("Erro para gerar tabela locação!!", error);
    Toastify({
      text: "Erro no server para listar locações! Verifique.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "#f44336",
    }).showToast();
  };
};

// FILTAR LOCAÇÃO
function filterLocation() {
  const buttonFilterInLocation = document.getElementById("btnFilter");
  if (buttonFilterInLocation) {
    buttonFilterInLocation.addEventListener("click", async () => {
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
        const response = await fetch("/api/locationFinish", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 404) {
          document.querySelector(".orders").innerHTML = "<p class='text-danger text-center'>Nenhuma Locação encontrada</p>";
          return
        };

        if (!response.ok) throw new Error("Erro ao buscar locações.");

        const data = await response.json();
        const locacao = data.locacoes || [];

        const tableDiv = document.querySelector(".orders");
        tableDiv.innerHTML = "";

        const listaLocacoes = locacao.flatMap((locacao) => {
          if (locacao.bens.length > 0) {
            return locacao.bens.map((bem) => ({
              idClient: locacao.clloid,
              numeroLocacao: locacao.cllonmlo || "Não definido",
              nomeCliente: locacao.clloclno || "Não definido",
              cpfCliente: locacao.cllocpf || "Não definido",
              dataLocacao: formatDataPattersBr(locacao.cllodtlo),
              dataDevolucao: formatDataPattersBr(locacao.cllodtdv),
              formaPagamento: locacao.cllopgmt || "Não definido",
              codigoBem: bem.belocodb || "-",
              produto: bem.belobem || "Nenhum bem associado",
              quantidade: bem.beloqntd || "-",
              status: bem.belostat || "Não definido",
              observacao: bem.beloobsv || "Sem observação",
              dataInicio: formatDataPattersBr(bem.belodtin),
              dataFim: formatDataPattersBr(bem.belodtfi),
            }));
          } else{
             return []
          }
        });

        const filterStatusEmLocacao = listaLocacoes.filter(
          (locacao) => locacao.status === "Em Locação"
        );

        if (filterStatusEmLocacao.length > 0) {
          // Criar tabela
          const table = document.createElement("table");
          table.classList.add("table", "table-sm", "table-bordered", "table-hover", "table-striped" ,"table-responsive", "text-center", "align-middle", "mb-0" , "tableLocationInLocation")

          const thead = document.createElement("thead");
          
          const headerRow = document.createElement("tr");
          const headers = [
            "Selecionar",
            "Número de Locação",
            "Status",
            "Nome do Cliente",
            "Data da Locação",
            "Data de Devolução",
            "Familia do bem",
            "Descrição",
            "Quantidade",
          ];

          headers.forEach((text) => {
            const th = document.createElement("th");
            th.textContent = text;
            headerRow.appendChild(th);
          });
          thead.appendChild(headerRow);
          table.appendChild(thead);

          // Criar corpo da tabela
          const tbody = document.createElement("tbody");

          filterStatusEmLocacao.forEach((locacao) => {
            const row = document.createElement("tr");

            // Criar checkbox
            const tdCheckbox = document.createElement("td");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("form-check-input", "select-location", "mx-auto", "d-block");
            checkbox.value = JSON.stringify(locacao);
            checkbox.dataset.quantidade = locacao.quantidade;
            checkbox.dataset.familia = locacao.codigoBem;
            checkbox.dataset.cliente = locacao.nomeCliente;
            tdCheckbox.appendChild(checkbox);
            row.appendChild(tdCheckbox);

            // Criar células com os dados
            const values = [
              locacao.numeroLocacao,
              locacao.status,
              locacao.nomeCliente,
              locacao.dataLocacao,
              locacao.dataDevolucao,
              locacao.codigoBem,
              locacao.produto,
              locacao.quantidade,
            ];
            values.forEach((text) => {
              const td = document.createElement("td");
              td.textContent = text;
              td.className = "px-2 py-1"
              row.appendChild(td);
            });

            tbody.appendChild(row);
            tbody.appendChild(row);
          });

          table.appendChild(tbody);
          tableDiv.appendChild(table);

          Toastify({
            text: `Filtro aplicado (EM LOCAÇÃO)! quantidade ${filterStatusEmLocacao.length}`,
            duration: 4000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#1d5e1d",
          }).showToast();
          return;
        } else {
          Toastify({
            text: "Não temos locações com status (Em Locação)!",
            duration: 4000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "orange",
          }).showToast();
          await locationPendente();
          return;
        }
      } catch (error) {
        console.error("Erro para filtar em locação", error);
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
async function needVsAvaible(
  cliente,
  quantidadeLocacao,
  familiaBem,
  isChecked,
  codeLoc
) {
  const token = localStorage.getItem("token");
  try {
    const bensResponse = await fetch("/api/listbens", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await bensResponse.json();
    if (!bensResponse.ok) {
      Toastify({
        text: result?.message || "Erro ao carregar Bens para analise.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
      return;
    }
    const bens = result.bens;
    const bensFiltrados = bens.filter((bem) => {
      bem.bensstat === "Disponível" && bem.benscofa === familiaBem;
      return bem.bensstat === "Disponível" && bem.benscofa === familiaBem;
    });

    const quantidadeDisponivel = bensFiltrados.length;

    const statusText =
      quantidadeDisponivel >= quantidadeLocacao ? "Suficiente" : "Insuficiente";

    if (statusText === "Insuficiente" && isChecked) {
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

    if (isChecked && statusText === "Suficiente") {
      const divNeed = document.querySelector(".need");
      divNeed.innerHTML = "";
      const table = document.createElement("table");
      table.id = "tableGoodsVsRequestPending";
      table.classList.add("table", "table-bordered", "table-sm");
      table.style.width = "100%";
  
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      [
        "Bens Disponíveis",
        "Bens Necessários",
        "Família do bem",
        "Status",
        "Ação",
      ].forEach((headerText) => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      const tbody = document.createElement("tbody");
      const row = document.createElement("tr");

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
        btn.innerHTML = `<i class="bi bi-link-45deg"></i> Vincular`
        btn.dataset.familia = familiaBem;
        btn.dataset.quantidade = quantidadeLocacao;
        btn.dataset.cliente = cliente;
        btn.dataset.belocode = codeLoc;
        tdAcao.appendChild(btn);
      }

      [row, tdDisponivel, tdNecessario, tdFamilia, tdStatus, tdAcao].forEach(
        (td) => {
          if (td !== row) row.appendChild(td);
        }
      );
      tbody.appendChild(row);
      table.appendChild(tbody);

      divNeed.appendChild(table);

      const btnModal = document.querySelector(".openModal");
      if (btnModal) {
        btnModal.addEventListener("click", (event) => {
          const familiaBem = event.target.dataset.familia;
          const quantidadeLocacao = event.target.dataset.quantidade;
          const cliente = event.target.dataset.cliente;
          const codigo = event.target.dataset.belocode;

          abrirModal(cliente, familiaBem, quantidadeLocacao, codigo);
        });
      }
    } else {
      const divNeed = document.querySelector(".need");
      divNeed.innerHTML = "";
      const divDrive = document.querySelector(".linkDrive");
      divDrive.innerHTML = "";
    }
  } catch (error) {
    console.error("Erro ao buscar os dados para compara necessidade e disponibilidade",error);
     Toastify({
        text: "Erro ao buscar os dados para compara necessidade e disponibilidade! Verifique",
        duration: 4000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
  };
};

// COMPARAÇÃO ENTRE DISPONIVEL E PENDENCIA
async function validateFamilyBensPending() {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {

    localStorage.removeItem("token");
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 2000);
    return;
  }
  try {
    const bensResponse = await fetch("/api/listbens", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!bensResponse.ok) {
      Toastify({
        text: result?.message || "Erro ao carregar Bens para analise.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
      return;
    }

     const result = await bensResponse.json();

    const listFamilyBens = await fetch("/api/listfabri", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!listFamilyBens.ok) {
      Toastify({
        text:
        result?.message || "Erro ao carregar familia de Bens para analise.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
      return;
    }
    const resultFamily = await listFamilyBens.json();
  
    const locationResponse = await fetch("/api/locationFinish", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!locationResponse.ok) return
    
    
    const resultLocation = await locationResponse.json();
    
    const bensLoc = resultLocation.locacoes?.flatMap((loc) => loc.bens) || [];

    const resultadosPorFamilia = resultFamily.reduce((acc, familia) => {
      const codigoFamilia = familia.fabecode;
      const familiaDescrição = familia.fabedesc;

      const bensDisponiveis = result.bens.filter(
        (bem) => bem.bensstat === "Disponível" && bem.benscofa === codigoFamilia
      ).length;

     const pedidosPendentes = bensLoc.filter((bem) =>
        bem.belostat === "Pendente" && bem.belocodb === codigoFamilia).reduce((total, bem) => total + Number(bem.beloqntd || 0), 0);

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
  };
};

// pegar a quantidade de entrega daquele motorista selecioando
async function quantidadeDeEntregaMotorista(codeDriver) {

   if(!codeDriver)return
   try {
    const token = localStorage.getItem("token");
    if(!token)return
    const response = await fetch(`/api/deliverydriver/${codeDriver}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

 
    const data = await response.json();

     if(response.status === 400){
        Toastify({
        text: `${data.message}` || "Motorista não possui nenhuma entrega em aberto!",
        duration: 4000,
        gravity: "top",
        position: "center",
        style: {
          background: "#ffc107", 
          color: "#000",
        },
      }).showToast();
     } else{
        Toastify({
        text: `${data.message}`,
        duration: 4000,
        gravity: "top",
        position: "center",
        style: {
          background: "#ffc107", 
          color: "#000",
        },
      }).showToast();
     };

    const totalEntregas = Array.isArray(data.entrega) ? data.entrega.length : 0;

    if (totalEntregas > 0) {
      Toastify({
        text: `🚚 Motorista selecionado tem ${totalEntregas} entrega(s) pendente(s)!`,
        duration: 4000,
        gravity: "top",
        position: "center",
        style: {
          background: "#ffc107", 
          color: "#000",
        },
      }).showToast();
    };

  } catch (error) {
    console.error("Erro ao buscar quantidade de entregas:", error);
    Toastify({
      text: "Erro no server",
      duration: 4000,
      position: "center",
      style: { background: "red" },
    }).showToast();
  };
};

// CARREGAR MOTORISTA DISPONIVEIS
async function loadingDriver() {
  const token = localStorage.getItem("token");

  const response = await fetch("/api/listingdriver", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const driver = await response.json();

  const avalibleDrivers = driver.filter((d) => d.motostat === "Disponível" || d.motostat === "Entrega destinada");

  const divContainerDriver = document.querySelector(".linkDrive");
  if (divContainerDriver) {
    divContainerDriver.innerHTML = "";
  } else {
    console.warn("ERRO MOTORISTA");
  }

  if (avalibleDrivers.length > 0) {
   
    const wrapper = document.createElement("div");
    wrapper.className = "table-responsive";

    const tabela = document.createElement("table");
    tabela.className =
      "table table-sm table-bordered table-hover align-middle listDriver";
    tabela.classList.add("tableDriver");

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
      "E-mail",
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

      checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
       quantidadeDeEntregaMotorista(motorista.motocode);
     }
});


      linha.insertCell().textContent = motorista.motonome;
      linha.insertCell().textContent = motorista.motostat;
      linha.insertCell().textContent = motorista.motoctch;
      linha.insertCell().textContent = formatDataPattersBr(motorista.motodtvc);
      linha.insertCell().textContent = motorista.motorest;
      linha.insertCell().textContent = motorista.motoorem;
      linha.insertCell().textContent = motorista.motocelu;
      linha.insertCell().textContent = motorista.motomail;
    });

    wrapper.appendChild(tabela);
    divContainerDriver.appendChild(wrapper);
  } else {
    divContainerDriver.innerHTML = "<p class='text-danger'>Nenhum motorista disponível.</p>";
  };
};

// MODAL PARA VINCULAR BEM/CAÇAMBA A LOCAÇÃO SELECIONADA 
async function abrirModal(cliente, familiaBem, quantidadeLocacao, codigo) {
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
    return;
  }

  const motoristasSelecionados = Array.from(
    document.querySelectorAll(".checkbox-motorista:checked")
  ).map((cb) => cb.value);

  if (motoristasSelecionados.length === 0) {
    Toastify({
      text: "Selecione 1 motorista para a entrega",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "#f44336",
    }).showToast();
    return;
  };

  const motoId = motoristasSelecionados[0];

  const response = await fetch("/api/listbens", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Erro ao buscar bens.");
  const result = await response.json();

  const bensFiltrados = result.bens.filter(
    (bem) => bem.bensstat === "Disponível" && bem.benscofa === familiaBem
  );

  const modalWrapper = document.querySelector(".modal");
  if (!modalWrapper) {
    console.warn("Elemento .modal não encontrado");
    return;
  }

  // Exibe os dados na modal HTML existente
  document.getElementById("clienteModal").textContent = cliente;
  document.getElementById("familiaBemModal").textContent = familiaBem;
  document.getElementById("quantidadeModal").textContent = quantidadeLocacao;
  document.getElementById("quantidadeTotalModal").textContent = quantidadeLocacao;
  document.getElementById("contadorVinculados").textContent = "0";

  const tabelaBody = document
    .querySelector("#bensDisponiveis tbody");

  tabelaBody.innerHTML = "";

  if (bensFiltrados.length > 0) {
    bensFiltrados.forEach((bem) => {
      const tr = document.createElement("tr");

      const tdCodigo = document.createElement("td");
      tdCodigo.textContent = bem.benscode;

      const tdDescricao = document.createElement("td");
      tdDescricao.textContent = bem.bensnome;

      const tdAcao = document.createElement("td");
      const btn = document.createElement("button");
      btn.className = "btn btn-sm btn-success vincular-bem";
      btn.dataset.id = bem.benscode;
      btn.dataset.code = codigo;
      btn.innerHTML = `<i class="bi bi-link-45deg"></i> Vincular`;
      tdAcao.appendChild(btn);

      tr.appendChild(tdCodigo);
      tr.appendChild(tdDescricao);
      tr.appendChild(tdAcao);

      tabelaBody.appendChild(tr);
    });
  } else {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 3;
    td.className = "text-center text-muted";
    td.textContent = "Nenhum bem disponível.";
    tr.appendChild(td);
    tabelaBody.appendChild(tr);
  }

  // Exibir modal e ocultar conteúdo principal
  modalWrapper.classList.remove("hidden");
  modalWrapper.classList.add("flex");

  const conteiner = document.querySelector(".containerLogistica");
  if (conteiner) {
    conteiner.classList.remove("flex");
    conteiner.classList.add("hidden");
  };

  // Lógica de vinculação dos bens
  let quantidadeVinculada = 0;

  document.querySelectorAll(".vincular-bem").forEach((botao) => {
    botao.addEventListener("click", async function () {
      if (quantidadeVinculada >= quantidadeLocacao) return;

      const bemId = botao.dataset.id;
      const codeLocation = botao.dataset.code;

      const sucesso = await vincularBem(
        bemId,
        familiaBem,
        motoId,
        codeLocation
      );

      if (sucesso) {
        quantidadeVinculada++;
        document.getElementById("contadorVinculados").textContent = quantidadeVinculada;
        botao.closest("tr").remove();

        if (vinculacoesPendentes.has(codigo)) {
          const familias = vinculacoesPendentes.get(codigo);
          if (familias[familiaBem]) {
            familias[familiaBem].vinculados++;
          }
        };

        if (quantidadeVinculada >= quantidadeLocacao) {
          document.querySelectorAll(".vincular-bem")
            .forEach((btn) => (btn.disabled = true));

          Toastify({
            text: "Todos os bens foram vinculados com sucesso!",
            duration: 4000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#1d5e1d",
          }).showToast();
        }
      }
    });
  });

  // Evento para fechar a modal
  document.querySelectorAll(".OutScreenLinkGoods").forEach((btn) => {
    btn.addEventListener("click", () => {
      modalWrapper.classList.remove("flex");
      modalWrapper.classList.add("hidden");

      const containerLogistica = document.querySelector(".containerLogistica");
      if (containerLogistica) {
        containerLogistica.classList.remove("hidden");
        containerLogistica.classList.add("flex");
      }
    });
  });
}

// pegar locações para logistica
async function getAllLocationsForLogistics(token) {

try {
    const resunt = await fetch("/api/locationFinish", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resunt.ok) {
    throw new Error("Erro ao obter dados da locacao");
  };

  const locacao = await resunt.json();
  if(locacao) return locacao;
  
 } catch (error) {
  console.error("Erro em buscar a locação para a logistica")
  throw new Error("Erro em buscar a locação para a logistica");
  
 };
};

// PEGAR CLIENTE ENVOLCIDO
async function buscarClientePorNome(cliecode, token) {
  try {
    const response = await fetch(`/api/client/${cliecode}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao obter lista de clientes");
    }

    const cliente = await response.json();
    console.log("clientes" , cliente)
    if(cliente) return cliente

  } catch (error) {
    console.error(error);
    Toastify({
      text: "Erro ao buscar cliente. Verifique",
      duration: 4000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "#f44336",
    }).showToast();
    return null;
  };
};
 //atualizar status no processo de vincular bem a locação
async function atualizarStatus(url, body, mensagemErro, token) {
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const erroDetalhado = await res.json().catch(() => ({}));
    throw new Error(
      `${mensagemErro}: ${erroDetalhado.message || "Erro inesperado."}`
    );
  };
};

//contador para ver se subrimos a necessidade do cliente
function atingiuQuantidadeSolicitada(locacao, familiaBem) {
  const bensFamilia = locacao.bens.filter((b) => b.beloben === familiaBem);

  if (bensFamilia.length === 0) return false;

  const quantidadeSolicitada = parseInt(bensFamilia[0].beloqntd, 10);

  const vinculados = bensFamilia.filter(
    (b) => b.belostat === "Locado"
  ).length;

  return vinculados >= quantidadeSolicitada;
}

// BUSCAR A CAÇAMBA/BEM PELO O CODIGO
async function buscarBemPorCodigo(id, token) {
   try {
    const response = await fetch(`/api/bens/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar bem pelo código");
    }

    const bem = await response.json();
    return bem;
   } catch (error) {
      console.error('Erro ao buscar o bem' , error)
      throw new error("Erro ao buscar o bem pelo o codigo")
   };
};

// vincular o bem a locação e atualizar status
async function vincularBem(bemId, familiaBem, motoId, codeLocation) {
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
    return false;
  }

  if(!bemId || !familiaBem || !motoId || !codeLocation){
    throw new Error('Falta passar informações para finalizar processo da logistica')
  };

  try {

    const bemResponse = await buscarBemPorCodigo(bemId, token)

    if(!bemResponse) {
      Toastify({
        text: `Bem ${bemId} não está disponível para locação.`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red"
      }).showToast();
      return false;
    }

    const locations = await getAllLocationsForLogistics(token);
    if (!locations || locations.locacoes.length === 0) {
      throw new Error("Não foi possível localizar dados de locação.");
    }

   console.log('PEGAR LOCALIZAÇÃO' ,locations.locacoes)

    const locacaoEncontrada = locations.locacoes.find((loc) =>
      loc.bens?.some((b) => String(b.belocode) === codeLocation)
    );

   
    if (!locacaoEncontrada) {
      Toastify({
        text: `Locação não encontrada na base de dados.`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
      return false;
    }
    
    
    const cliecode = locacaoEncontrada?.clloidcl;
    const cliente = await buscarClientePorNome(cliecode, token);
    if (!cliente) return false;


    const confirmacao = confirm(
      `Deseja vincular o bem ${bemId} ao cliente ${cliente.clienome} (Locação ${locacaoEncontrada.cllonmlo})?`
    );
    if (!confirmacao) return false;

    const payloadLogistcs = {
        bemId: bemId,
        familiaBem,
        idClient: cliente.cliecode,
        locationId: locacaoEncontrada.cllonmlo,
        codeLocation:codeLocation,
        driver: motoId,
        pagament: locacaoEncontrada.cllopgmt,
        devolution: locacaoEncontrada.cllodtdv,
        status:"Pendente",
        localization:{
           rua:locacaoEncontrada.cllorua,
           cep:locacaoEncontrada.cllocep,
           bairro:locacaoEncontrada.cllobair,
           refere: locacaoEncontrada.cllorefe,
           region: locacaoEncontrada.clloqdlt,
           cidade: locacaoEncontrada.cllocida
        }
    }

    console.log('payloadLogistcs' , payloadLogistcs)

    // Envio dos dados da locação
    const response = await fetch("/logistics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:`Bearer ${token}`
      },
      body: JSON.stringify({payloadLogistcs}),
    });

    console.log('resposta vincular' , response)

    if (!response.ok) {
      const errorData = await response.json();
        Toastify({
        text: `${errorData.message} || "Erro ao vincular bem."`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
      throw new Error(errorData.message || "Erro ao vincular bem.");
    }
    
      const contratoAtualResponse = await fetch(`/api/contrato/${codeLocation}` , {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

if (!contratoAtualResponse.ok) {
  throw new Error("Não foi possível buscar o contrato atual.");
}
const contratoAtualData = await contratoAtualResponse.json();
const contratoHTML = contratoAtualData.result; // HTML como string

// Converte a string HTML em DOM manipulável
const parser = new DOMParser();
const contratoDoc = parser.parseFromString(contratoHTML, "text/html");


const bensVnculadoDiv = contratoDoc.querySelector(".bensVinculados");
if (!bensVnculadoDiv) {
  throw new Error("container de bens não encontrada no contrato.");
}
bensVnculadoDiv.style.display = 'block'

const bemCard = document.createElement("div");
bemCard.className = "card mb-3 shadow-sm";

const bemHeader = document.createElement("div");
bemHeader.className = "card-header bg-success text-white d-flex justify-content-between align-items-center";
bemHeader.innerHTML = `
  <span><i class="bi bi-box-seam me-2"></i> Bem Vinculado</span>
  <span class="badge bg-light text-success">
    <i class="bi bi-check-circle me-1"></i>OK
  </span>
`;

const bemLocado = bemResponse.bem
// Corpo do card
const bemBody = document.createElement("div");
bemBody.className = "card-body p-2";
bemBody.innerHTML = `
  <table class="table table-sm mb-0">
    <thead>
      <tr>
        <th>Modelo</th>
        <th>Nome</th>
        <th>Código</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${bemLocado.bensmode || "-"}</td>
        <td>${bemLocado.bensnome}</td>
        <td>${bemLocado.benscode}</td>
      </tr>
    </tbody>
  </table>
`;

bemCard.appendChild(bemHeader);
bemCard.appendChild(bemBody);

 bensVnculadoDiv.appendChild(bemCard);

 const contratoAtualizado = contratoDoc.body.innerHTML;

const responseUpdateContrato = await fetch(`/api/contrato/${codeLocation}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization:`Bearer ${token}`
  },
  body: JSON.stringify({ contrato: contratoAtualizado }),
});

if (!responseUpdateContrato.ok) {
  const erro = await responseUpdateContrato.json();
  throw new Error(erro.message || "Erro ao atualizar contrato.");
};

    Toastify({
      text: `Bem ${bemId} vinculado com sucesso!`,
      duration: 4000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "#1d5e1d",
    }).showToast();

    
  return true;
  } catch (error) {
    console.error("Erro ao vincular bem:", error);
    Toastify({
      text: error.message || "Erro ao vincular o bem no server!",
      duration: 4000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "#f44336",
    }).showToast();
    return false;
  };
};
