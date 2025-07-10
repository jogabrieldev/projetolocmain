
// TABELA COM AS LOCAÇOES
async function frontLocation() {
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
      document.querySelector(
        ".tableLocation"
      ).innerHTML = `<p style="text-align:center;">Nenhuma locação encontrada.</p>`;
      return;
    }

    const dataFinish = await response.json();
    const locacoesFinishTable = dataFinish.locacoes || [];

    // Limpa a tabela antes de popular os dados
    const table = document.querySelector(".tableLocation");
    if (table) {
      table.innerHTML = "";
    } else {
      console.warn("Elemento .tableLocation não encontrado.");
      return;
    }

    // Criar array unindo clientes e bens
    const listaLocacoes = locacoesFinishTable
      .map((locacao) => {
        if (locacao.bens.length > 0) {
          return locacao.bens.map((bem) => ({
            idClient: locacao.clloid,
            numeroLocacao: locacao.cllonmlo || "Não definido",
            nomeCliente: locacao.clloclno || "Não definido",
            dataLocacao: formatDate(locacao.cllodtlo),
            dataDevolucao: formatDate(locacao.cllodtdv),
            formaPagamento: locacao.cllopgmt || "Não definido",
            cidade:locacao.cllocida|| "__",
            bairro:locacao.cllobair || "__",
            refere:locacao.cllorefe || "__",
            rua:locacao.cllorua || "__", 
            qdlt:locacao.clloqdlt || "__" ,   
            residuo:locacao.clloresi || "__" ,
            codigoBem: bem.bencodb || "-",
            belocode:bem.belocode,
            produto: bem.beloben || "Nenhum bem associado",
            quantidade: bem.beloqntd || "-",
            status: bem.belostat || "Não definido",
            observacao: bem.beloobsv || "Sem observação",
            dataInicio: formatDate(bem.belodtin),
            dataFim: formatDate(bem.belodtfi),
          }));
           
         }else{
            return []
         }
      })
    
      .flat(); 

    renderTable(listaLocacoes); // Renderiza a tabela com os dados obtidos
  } catch (error) {
    console.error("Erro ao gerar tabela de locação:", error);
  }
}

function renderTable(data) {
  const tableDiv = document.querySelector(".tableLocation");

  tableDiv.innerHTML = "";

  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.justifyContent = "space-between";
  container.style.alignItems = "center";
  container.style.marginBottom = "10px";

  const title = document.createElement("h2");
  title.textContent = "Locaçaõ de Bens";
  title.style.margin = "0";

  const messageFilter = document.createElement("span");
  messageFilter.id = "messsageFilter";
  messageFilter.style.display = "none";

  const resetFilterBtn = document.createElement("button");
  resetFilterBtn.id = "resetFilterBtn";
  resetFilterBtn.style.display = "none";
  resetFilterBtn.textContent = "Remover Filtro";

  // const searchBtn = document.createElement("button");
  // searchBtn.classList.add("searchloc");
  // searchBtn.innerHTML = `<i class="bi bi-search me-2"></i>Buscar Locação`

  container.appendChild(title);
  container.appendChild(messageFilter);
  container.appendChild(resetFilterBtn);
  // container.appendChild(searchBtn);

  tableDiv.appendChild(container);

  const table = document.createElement("table");
  table.classList.add("tableLocationAll");

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const headers = [
    "Selecionar",
    "Número de Locação",
    "Status",
    "Nome do Cliente",
    "Data da Locação",
    "Data de Devolução",
    "Forma de Pagamento",
    "Familia do bem",
    "Descrição",
    "Quantidade",
    "Observação",
    "Data Início",
    "Data Final",
    "Visualizar"
  ];

  headers.forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  data.forEach((locacao) => {
    const row = document.createElement("tr");

    const checkboxTd = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("locacao-checkbox");
    checkbox.value = JSON.stringify(locacao);
    checkboxTd.appendChild(checkbox);
    row.appendChild(checkboxTd);
  

    [
      "numeroLocacao",
      "status",
      "nomeCliente",
      "dataLocacao",
      "dataDevolucao",
      "formaPagamento",
      "codigoBem",
      "produto",
      "quantidade",
      "observacao",
      "dataInicio",
      "dataFim",
    ].forEach((key) => {
      const td = document.createElement("td");
      td.textContent = locacao[key];
      row.appendChild(td);
    });

     const visualizarTd = document.createElement("td");
    const visualizarBtn = document.createElement("button");
    visualizarBtn.classList.add("btn", "btn-sm", "btn-success");
    visualizarBtn.textContent = "Visualizar";
    if(visualizarBtn){
       visualizarBtn.addEventListener("click", () => {
      showContratoLocationGoods(locacao)
     
       });
    }
    visualizarTd.appendChild(visualizarBtn);
  row.appendChild(visualizarTd);

    tbody.appendChild(row);
  });

  if (data.length === 0) {
    const emptyRow = document.createElement("tr");
    const emptyTd = document.createElement("td");
    emptyTd.colSpan = "14";
    emptyTd.style.textAlign = "center";
    emptyTd.textContent = "Nenhuma locação encontrada.";
    emptyRow.appendChild(emptyTd);
    tbody.appendChild(emptyRow);
  }


  table.appendChild(tbody);
  tableDiv.appendChild(table);

  const checkboxes = document.querySelectorAll(".locacao-checkbox");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const locacaoData = JSON.parse(event.target.value);
      const isChecked = event.target.checked;

      document.querySelectorAll(".locacao-checkbox").forEach((cb) => {
        if (JSON.parse(cb.value).numeroLocacao === locacaoData.numeroLocacao) {
          cb.checked = isChecked;
        }
      });
    });
  });

  // Adiciona o evento de busca ao botão "Buscar Locação"
 
}

async function showContratoLocationGoods(locacao) {
     const contratoDiv = document.querySelector(".contrato");
  if (!contratoDiv) return;

  contratoDiv.innerHTML = ""; // Limpa o conteúdo anterior

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return isNaN(d) ? "-" : d.toLocaleDateString("pt-BR");
  };

  const container = document.createElement("div");
  container.className = "text-dark p-4 rounded";

  const h2 = document.createElement("h2");
  h2.className = "text-center mb-4";
  h2.textContent = "Contrato de Locação de Bens";
  container.appendChild(h2);

  container.innerHTML += `
    <hr class="border-light">
    <p><strong>Número da locação:</strong> ${locacao.numeroLocacao}</p>
    <p><strong>Nome do Cliente:</strong> ${locacao.nomeCliente}</p>
    <p><strong>Forma de Pagamento:</strong> ${locacao.formaPagamento || "-"}</p>
    <p><strong>Data da Locação:</strong> ${formatDate(locacao.dataLocacao)}</p>
    <p><strong>Data de Devolução:</strong> ${formatDate(locacao.dataDevolucao)}</p>
    <p><strong>Observação:</strong> ${locacao.observacao || "-"}</p>
    <hr class="border-light">
  `;

  const enderecoDiv = document.createElement("div");
  enderecoDiv.className = "border rounded p-3 mb-3 bg-dark-subtle text-white";

  const enderecoTitulo = document.createElement("p");
  enderecoTitulo.className = "mb-1";
  enderecoTitulo.innerHTML = `<strong>Endereço da Locação:</strong>`;
  enderecoDiv.appendChild(enderecoTitulo);

  const row1 = document.createElement("div");
  row1.className = "row";

  const ruaDiv = document.createElement("div");
  ruaDiv.className = "col-md-4 text-dark";
  ruaDiv.innerHTML = `<strong>Rua:</strong> ${locacao?.rua || "-"}`;
  row1.appendChild(ruaDiv);

  const bairroDiv = document.createElement("div");
  bairroDiv.className = "col-md-4 text-dark";
  bairroDiv.innerHTML = `<strong>Bairro:</strong> ${locacao?.bairro || "-"}`;
  row1.appendChild(bairroDiv);

  const cidadeDiv = document.createElement("div");
  cidadeDiv.className = "col-md-4 text-dark";
  cidadeDiv.innerHTML = `<strong>Cidade:</strong> ${locacao?.cidade || "-"}`;
  row1.appendChild(cidadeDiv);

  enderecoDiv.appendChild(row1);

  const row2 = document.createElement("div");
  row2.className = "row";

  const cepDiv = document.createElement("div");
  cepDiv.className = "col-md-4 text-dark";
  cepDiv.innerHTML = `<strong>CEP:</strong> ${locacao.localization?.cep || "-"}`;
  row2.appendChild(cepDiv);

  const refDiv = document.createElement("div");
  refDiv.className = "col-md-4 text-dark";
  refDiv.innerHTML = `<strong>Referência:</strong> ${locacao.refere || "-"}`;
  row2.appendChild(refDiv);

  const qdrDiv = document.createElement("div");
  qdrDiv.className = "col-md-4 text-dark";
  qdrDiv.innerHTML = `<strong>Quadra/Lote:</strong> ${locacao.qdlt || "-"}`;
  row2.appendChild(qdrDiv);

  enderecoDiv.appendChild(row2);

  container.appendChild(enderecoDiv);

  const pResiduo = document.createElement("p");
  pResiduo.innerHTML = `<strong>Residuo Envolvido:</strong> ${locacao.residuo || "-"}`;
  container.appendChild(pResiduo);

  const BemLocado = document.createElement('P')
  BemLocado.innerHTML = `<strong>Bem Locado</strong>`
  container.appendChild(BemLocado)


  const tableResponsive = document.createElement("div");
  tableResponsive.className = "table-responsive";

  const table = document.createElement("table");
  table.className = "table table-bordered table-dark table-sm";

  const thead = document.createElement("thead");
  thead.className = "table-light";

  const trHead = document.createElement("tr");
  ["Código do Bem", "Descrição", "Quantidade", "Data Início", "Data Final"].forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  const tr = document.createElement("tr");

  ["codigoBem", "produto", "quantidade", "dataInicio", "dataFim"].forEach(field => {
    const td = document.createElement("td");
    td.textContent = locacao[field] || "-";
    tr.appendChild(td);
  });

  tbody.appendChild(tr);
  table.appendChild(tbody);
  tableResponsive.appendChild(table);
  container.appendChild(tableResponsive);

  // Botão voltar
  const divBtn = document.createElement("div");
  divBtn.className = "text-center mt-4 d-flex justify-content-center gap-2";

  const btnVoltar = document.createElement("button");
  btnVoltar.className = "btn btn-light";
  btnVoltar.textContent = "Voltar";

  btnVoltar.addEventListener("click", () => {
    contratoDiv.style.display = "none";

    const table = document.querySelector(".tableLocation");
    if (table) {
      table.classList.remove("hidden");
      table.classList.add("flex");
    }

    const containerBtn = document.querySelector(".btnInitPageMainLoc");
    if (containerBtn) {
      containerBtn.classList.remove("hidden");
      containerBtn.classList.add("flex");
    }
  });

  divBtn.appendChild(btnVoltar);
  container.appendChild(divBtn);

  contratoDiv.appendChild(container);
  contratoDiv.style.display = "block";

  const tableList = document.querySelector(".tableLocation");
  if (tableList) {
    tableList.classList.remove("flex");
    tableList.classList.add("hidden");
  }

  const containerBtn = document.querySelector(".btnInitPageMainLoc");
  if (containerBtn) {
    containerBtn.classList.remove("flex");
    containerBtn.classList.add("hidden");
  }
}

//Filtar locação
async function filterTable() {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
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

    if (!response.ok) {
      throw new Error(`Erro ao buscar locações. Status: ${response.status}`);
    }

    const dataFinish = await response.json();
    const locacoes = dataFinish.locacoes || [];

    const numberLocation = document
      .getElementById("numberLocation")
      .value.trim();
    const statusLocation = document
      .getElementById("statusLocation")
      .value.trim();
    const nameClient = document.getElementById("nameClientSearch").value.trim();

    // Verifica quantos campos foram preenchidos
    const camposPreenchidos = [
      numberLocation,
      statusLocation,
      nameClient,
    ].filter((value) => value !== "").length;

    if (camposPreenchidos === 0) {
      Toastify({
        text: "Por favor, preencha algum campo de pesquisa.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
      return;
    }

    if (camposPreenchidos > 1) {
      Toastify({
        text: "Preencha somente 1 campo",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "orange",
      }).showToast();
      return;
    }

    const filteredData = locacoes.filter((loc) => {
      const matchNumero = numberLocation
        ? loc.cllonmlo.includes(numberLocation)
        : true;
      const matchStatus = statusLocation
        ? loc.bens.some((bem) =>
            bem.belostat.toLowerCase().includes(statusLocation.toLowerCase())
          )
        : true;
      const matchNome = nameClient
        ? loc.clloclno.toLowerCase().includes(nameClient.toLowerCase())
        : true;

      return matchNumero && matchStatus && matchNome;
    });

    if (filteredData.length === 0) {
      Toastify({
        text: "Nenhuma locação encontrada. Insira um valor válido.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
      return;
    }

    const listaLocacoesFilter = filteredData
      .map((locacao) => {
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
      .flat();

    renderTable(listaLocacoesFilter);
    document.querySelector('.popupBackDrop').style.display = "none"
    document.querySelector('.searchLocation').style.display = 'none'
    document.getElementById("resetFilterBtn").style.display = "inline-block";
    document.getElementById("messsageFilter").style.display = "inline-block";
    document.getElementById("messsageFilter").textContent =
      "Tabela filtrada por sua pesquisa.";

    document.getElementById("resetFilterBtn").addEventListener("click", () => {
      frontLocation();
      document.getElementById("resetFilterBtn").style.display = "none";
    });
  } catch (error) {
    console.error("Erro ao buscar e filtrar locações:", error);
  }
}

// BOTÃO DELETAR LOCAÇÃO
function deletarLocation() {
  const btnDeleteLocation = document.querySelector(".buttonDeleteLocation");
  btnDeleteLocation.addEventListener("click", async () => {
    const selectedCheckbox = document.querySelector(
      ".locacao-checkbox:checked"
    );

    try {
      if (!selectedCheckbox) {
        Toastify({
          text: "Selecione uma Locação para excluir",
          duration: 2000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
        return;
      }
      const tipo = selectedCheckbox.getAttribute("data-tipo");

      const locacaoData = JSON.parse(selectedCheckbox.value);
      const locacaoId = locacaoData.numeroLocacao;

      const confirmacao = confirm(
        `Tem certeza de que deseja excluir a locação com código ${locacaoId}?`
      );
      if (!confirmacao) return;

      await deletelocation(locacaoId, tipo, selectedCheckbox.closest("tr"));
    } catch (error) {
      console.error("Erro ao excluir locação", error);
      Toastify({
        text: "Erro ao validar locação antes da exclusão.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
    }
  });

  //  Função de exclusão
  async function deletelocation(id,tipo, rowProd) {
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
      let rota = tipo === "veiculo" ? `/api/locacaoveiculo/${id}` : `/api/deletelocation/${id}`;
      const response = await fetch(rota, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        Toastify({
          text: "Locação excluida com sucesso",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();

        rowProd.remove();
      } else {
        if (response.status === 400) {
          Toastify({
            text: data.message, // Mensagem retornada do backend
            duration: 4000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "orange",
          }).showToast();
        } else {
          console.log("Erro para excluir:", data);
          Toastify({
            text: "Erro a excluir locação. Server",
            duration: 2000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
          }).showToast();
        }
      }
    } catch (error) {
      console.error("Erro ao excluir locação:", error);
      Toastify({
        text: "Erro ao excluir locação. Tente novamente.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
    }
  }
}
// Editar Locação

function editLocation() {
  const buttonEditLocation = document.querySelector(".buttonEditLocation");
  if (buttonEditLocation) {
    buttonEditLocation.addEventListener("click", async () => {
      const selectedCheckbox = document.querySelector(
        ".locacao-checkbox:checked"
      );

      try {
        if (!selectedCheckbox) {
          Toastify({
            text: "Selecione uma Locação para editar",
            duration: 2000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
          }).showToast();
          return;
        }
        const contentEditlocation = document.querySelector(
          ".containerEditLocation"
        );
        if (contentEditlocation) {
          contentEditlocation.classList.remove("hidden");
          contentEditlocation.classList.add("flex");
        }

        const btnInitPageMainLoc = document.querySelector(
          ".btnInitPageMainLoc"
        );
        if (btnInitPageMainLoc) {
          btnInitPageMainLoc.classList.remove("flex");
          btnInitPageMainLoc.classList.add("hidden");
        }

        const listLocation = document.querySelector(".tableLocation");
        if (listLocation) {
          listLocation.classList.remove("flex");
          listLocation.classList.add("hidden");
        }

        const locacaoData = JSON.parse(selectedCheckbox.value);
        const locacaoId = locacaoData.numeroLocacao;

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

        const response = await fetch("/api/locationFinish", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();

        const locacaoSelecionada = result.locacoes.find(
          (loc) => loc.cllonmlo === locacaoId
        );

        if (locacaoSelecionada) {
          const existeBemEmLocacao = locacaoSelecionada.bens.some(
            (bem) => bem.belostat === "Em Locação"
          );
        
          if (existeBemEmLocacao) {
            Toastify({
              text: "A locação selecionada já possui um bem em locação!",
              duration: 3000,
              close: true,
              gravity: "top",
              position: "center",
              backgroundColor: "orange",
            }).showToast();
            
            return; 
          }
        
          preencherFormularioDeEdicao(locacaoSelecionada);
        } else {
          console.error("Locação não encontrada.");
        }
        
      } catch (error) {
        console.error('ERRO NA APLICAÇÃO' , error)
      }
    });
  }
}

function preencherFormularioDeEdicao(locacao) {
  document.getElementById("idLocation").value = locacao.cllonmlo;

  document.getElementById("clientList").value = locacao.clloclno;

  document.getElementById('dateDev').value = locacao.cllodtdv.split("T")[0] 

  locacao.bens.forEach((bem, index) => {
    const i = index + 1;

    if(bem.belodtin){
      document.getElementById(`dataInicio${i}Edit`).readOnly = true;
    }
  

    if (i <= 5) {
      document.getElementById(`family${i}Edit`).value = bem.bencodb;
      document.getElementById(`produto${i}Edit`).value = bem.beloben;
      document.getElementById(`quantidade${i}Edit`).value = bem.beloqntd;
      document.getElementById(`observacao${i}Edit`).value = bem.beloobsv;
      document.getElementById(`dataInicio${i}Edit`).value = bem.belodtin.split("T")[0];
      document.getElementById(`dataFim${i}Edit`).value = bem.belodtfi.split("T")[0];
      document.getElementById(`belocode${i}Edit`).value = bem.belocode;
    }

  });

  editarlocationFinish(locacao.cllonmlo);
}

function editarlocationFinish(id) {
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

  const buttonSave = document.querySelector(".save");
  if (buttonSave) {
    buttonSave.addEventListener("click", async (event) => {
      event.preventDefault();
        
      const confirmacao = confirm(
        `Tem certeza de que deseja ATUALIZAR essa locação?`
      );
      if (!confirmacao) return;

      const validLocation = await fetch("/api/locationFinish", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!validLocation.ok) {
        console.error("❌ Erro ao buscar locações");
        return;
      }

      const data = await validLocation.json();
      const { locacoes } = data;

      const locacaoEncontrada = locacoes.find((loc) => loc.cllonmlo === id);
      if (!locacaoEncontrada) {
        console.error(`Locação ${id} não encontrada`);
        return;
      }

      const bensEditados = [];
      const bensNovos = [];

      for (let i = 1; i <= 5; i++) {
        const family = document.getElementById(`family${i}Edit`).value;
        const produto = document.getElementById(`produto${i}Edit`).value;
        const quantidade = document.getElementById(`quantidade${i}Edit`).value;
        const observacao = document.getElementById(`observacao${i}Edit`).value;
        const dataInicioStr = document.getElementById(`dataInicio${i}Edit`).value;
        const dataFimStr = document.getElementById(`dataFim${i}Edit`).value;
        const belocode = document.getElementById(`belocode${i}Edit`).value;
        
        const todosCamposPreenchidos = [family, produto, quantidade, observacao, dataInicioStr, dataFimStr].every(campo => campo && campo.trim() !== "");
        if (!todosCamposPreenchidos) {
          continue; 
        }

        if (!isDataValida(dataInicioStr) || !isDataValida(dataFimStr)) {
          Toastify({
            text: `Item ${i}: data de início ou fim inválida.`,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
          }).showToast();
          return;
        }

        const dataDevolutionStr = document.getElementById('dateDev')?.value || "";
        const dataInicio = parseDataLocal(dataInicioStr);
        const dataFim = parseDataLocal(dataFimStr);
        const dataDevolution = parseDataLocal(dataDevolutionStr);
       
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        if (dataFim < hoje ) {
          Toastify({
            text: `Item ${i}: a data de FIM deve ser futura`,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "orange",
          }).showToast();
          return;
        }

        if (dataFim.getTime() !== dataDevolution.getTime()) {
           Toastify({
           text: `Item ${i}: A data FIM foi alterada, portanto, a data de DEVOLUÇÃO da locação também deve ser atualizada.`,
           duration: 4000,
           close: true,
           gravity: "top",
           position: "center",
           backgroundColor: "red",
        }).showToast();
       return;
     }
        if (!belocode && dataInicio > hoje) {
          Toastify({
            text: `Item ${i}: a data de INÍCIO deve ser hoje ou futura.`,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "orange",
          }).showToast();
          return;
        }

        const bem = {
          bencodb: family,
          beloben: produto,
          beloqntd: quantidade,
          beloobsv: observacao,
          belodtin: dataInicioStr,
          belodtfi: dataFimStr,
          belostat: "Pendente"
        };

        

        if (belocode) {
          bem.belocode = belocode;
          bensEditados.push(bem);
        } else {
          bem.beloidcl = locacaoEncontrada.clloid;
          bensNovos.push(bem);
        }
      }

      // === ATUALIZAÇÃO DOS BENS EXISTENTES ===
      try {
        let bensForamAtualizados = false;

        if (bensEditados.length > 0) {
          const bodyUpdate = {
            cllonmlo: id,
            bens: bensEditados,
          };

          const respon = await fetch(`/api/location/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(bodyUpdate),
          });

          const result = await respon.json();
          bensForamAtualizados = result?.data?.bensAtualizados?.length > 0;

          if (bensForamAtualizados) {
            Toastify({
              text: "Dados atualizados com sucesso!",
              duration: 3000,
              close: true,
              gravity: "top",
              position: "center",
              backgroundColor: "green",
            }).showToast();
          }
        }

        // Inserção de novos bens em função separada
        if (bensNovos.length > 0) {
          await addNewGoodsInLocation(bensNovos, token);
        }

        if (!bensForamAtualizados && bensNovos.length === 0) {
          Toastify({
            text: "Nenhuma alteração detectada.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "orange",
          }).showToast();
        }
      } catch (error) {
        console.error("🔥 Erro ao atualizar bens:", error);
        Toastify({
          text: "Erro ao atualizar no servidor.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
      }
    });
  }
}

async function addNewGoodsInLocation(novosBens, token) {
  if (novosBens.length > 0) {
    console.log("Novos bens", novosBens);
    try {
      const responseNovoBem = await fetch(`/api/novobem/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          newGoods: novosBens,
        }),
      });

      if (!responseNovoBem.ok) throw new Error("Erro ao inserir novos bens");

      Toastify({
        text: "Novos bens vinculados com sucesso!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();
    } catch (error) {
      console.error("🔥 Erro ao inserir novos bens:", error);
      Toastify({
        text: "Erro ao inserir bens no servidor.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
    }
  }
}


