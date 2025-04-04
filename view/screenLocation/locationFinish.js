// locação finalizada

const btnOutPageLocation = document.querySelector(".buttonExitLocation");
btnOutPageLocation.addEventListener("click", () => {
  const containerAppLocation = document.querySelector(".containerAppLocation");
  containerAppLocation.style.display = "none";
});

const outPageSearchLocation = document.querySelector(".outPageSearchLocation");
outPageSearchLocation.addEventListener("click", () => {
  const containerSearch = document.querySelector(".searchLocation");
  containerSearch.style.display = "none";

  const containerAppLocation = document.querySelector(".containerAppLocation");
  containerAppLocation.style.display = "flex";
});


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
        'Authorization': `Bearer ${token}`,
      },
    });

     if (response.status === 404) {
      document.querySelector(".tableLocation").innerHTML = `<p style="text-align:center;">Nenhuma locação encontrada.</p>`;
      return;
    }
  
    // if (!response.ok) {
    //   throw new Error(`Erro ao buscar locações. Status: ${response.status}`);
    // }
   
    const dataFinish = await response.json();
    const locacoesFinishTable = dataFinish.locacoes || [];

    // Limpa a tabela antes de popular os dados
    document.querySelector(".tableLocation").innerHTML = "";

    // Criar array unindo clientes e bens
    const listaLocacoes = locacoesFinishTable.map((locacao) => {
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
    }).flat(); // Usamos `.flat()` para remover arrays aninhados

    renderTable(listaLocacoes); // Renderiza a tabela com os dados obtidos
  } catch (error) {
    console.error("Erro ao gerar tabela de locação:", error);
  }
}
frontLocation();

function renderTable(data) {
  const tableDiv = document.querySelector(".tableLocation");
  
  tableDiv.innerHTML = "";
  
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.justifyContent = "space-between";
  container.style.alignItems = "center";
  container.style.marginBottom = "10px";
  
  const title = document.createElement("h2");
  title.textContent = "Dados da Locação";
  title.style.margin = "0";
  
  const messageFilter = document.createElement("span");
  messageFilter.id = "messsageFilter";
  messageFilter.style.display = "none";
  
  const resetFilterBtn = document.createElement("button");
  resetFilterBtn.id = "resetFilterBtn";
  resetFilterBtn.style.display = "none";
  resetFilterBtn.textContent = "Remover Filtro";
  
  const searchBtn = document.createElement("button");
  searchBtn.classList.add("searchloc");
  searchBtn.textContent = "Buscar Locação";
  
  container.appendChild(title);
  container.appendChild(messageFilter);
  container.appendChild(resetFilterBtn);
  container.appendChild(searchBtn);
  
  tableDiv.appendChild(container);
  
  const table = document.createElement("table");
  table.style.border = "1";
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";
  table.style.textAlign = "left";
  
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  
  const headers = [
    "Selecionar", "Número de Locação", "Status", "Nome do Cliente", "CPF do Cliente",
    "Data da Locação", "Data de Devolução", "Forma de Pagamento", "Familia do bem",
    "Descrição", "Quantidade", "Observação", "Data Início", "Data Final"
  ];
  
  headers.forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  const tbody = document.createElement("tbody");
  
  data.forEach(locacao => {
    const row = document.createElement("tr");
  
    const checkboxTd = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("locacao-checkbox");
    checkbox.value = JSON.stringify(locacao); // Armazena toda a locação como string JSON
    checkboxTd.appendChild(checkbox);
    row.appendChild(checkboxTd);
  
    ["numeroLocacao", "status", "nomeCliente", "cpfCliente", "dataLocacao", "dataDevolucao",
     "formaPagamento", "codigoBem", "produto", "quantidade", "observacao", "dataInicio", "dataFim"].forEach(key => {
      const td = document.createElement("td");
      td.textContent = locacao[key];
      row.appendChild(td);
    });
  
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
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", event => {
      const locacaoData = JSON.parse(event.target.value);
      const isChecked = event.target.checked;
      console.log('locação:', locacaoData)
      console.log('checando:' , isChecked)
  
      document.querySelectorAll(".locacao-checkbox").forEach(cb => {
        if (JSON.parse(cb.value).numeroLocacao === locacaoData.numeroLocacao) {
          cb.checked = isChecked;
        }

      });
    });
  });

  
  // Adiciona o evento de busca ao botão "Buscar Locação"
  document.querySelector(".searchloc").addEventListener("click", () => {
    document.querySelector(".searchLocation").style.display = "flex";
  });
}


// DELETAR LOCAÇÃO
async function filterTable() {
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
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar locações. Status: ${response.status}`);
    }

    const dataFinish = await response.json();
    const locacoes = dataFinish.locacoes || [];

    const numberLocation = document.getElementById("numberLocation").value.trim();
    const statusLocation = document.getElementById("statusLocation").value.trim();
    const nameClient = document.getElementById("nameClientSearch").value.trim();

    // Verifica quantos campos foram preenchidos
    const camposPreenchidos = [numberLocation, statusLocation, nameClient]
      .filter(value => value !== "").length;

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

  
    const filteredData = locacoes.filter(loc => {
      const matchNumero = numberLocation ? loc.cllonmlo.includes(numberLocation) : true;
      const matchStatus = statusLocation
        ? loc.bens.some(bem => bem.belostat.toLowerCase().includes(statusLocation.toLowerCase()))
        : true;
      const matchNome = nameClient ? loc.clloclno.toLowerCase().includes(nameClient.toLowerCase()) : true;
      
     
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

    const listaLocacoesFilter = filteredData.map(locacao => {
      if (locacao.bens.length > 0) {
        return locacao.bens.map(bem => ({
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
        return [{
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
        }];
      }
    }).flat();

    renderTable(listaLocacoesFilter);

    document.getElementById("resetFilterBtn").style.display = "inline-block";
    document.getElementById("messsageFilter").style.display = "inline-block";
    document.getElementById("messsageFilter").textContent = "Tabela filtrada por sua pesquisa.";

    document.getElementById("resetFilterBtn").addEventListener("click", () => {
      frontLocation();
      document.getElementById("resetFilterBtn").style.display = "none";
    });

  } catch (error) {
    console.error("Erro ao buscar e filtrar locações:", error);
  }
};

// BOTÃO DELETAR LOCAÇÃO
const btnDeleteLocation = document.querySelector('.buttonDeleteLocation');
btnDeleteLocation.addEventListener('click', async () => {
    const selectedCheckbox = document.querySelector('.locacao-checkbox:checked');

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
    const locacaoData = JSON.parse(selectedCheckbox.value);
    const locacaoId = locacaoData.numeroLocacao


      const confirmacao = confirm(`Tem certeza de que deseja excluir a locação com código ${locacaoId}?`);
        if (!confirmacao) return;

        await deletelocation(locacaoId, selectedCheckbox.closest("tr"));
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

// 🔹 Função de exclusão
async function deletelocation(id, rowProd) {
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
     
      const response = await fetch(`/api/deletelocation/${id}`, {
          method: "DELETE",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
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
        }
      else{ 
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

