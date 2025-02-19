// locação finalizada

// const buttonAtivRegister = document.querySelector(".btnAtivRegister");
// buttonAtivRegister.addEventListener("click", () => {
//   const containerSearch = document.querySelector(".containerSearch");
//   containerSearch.style.display = "none";
// });

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


let locacoes = []; // Variável global para armazenar os dados das locações

async function frontLocation() {
  try {
    // Chamar a API para buscar os dados de locações
    const response = await fetch("/api/location");
    if (!response.ok) throw new Error("Erro ao buscar locações.");

    // Obter os dados
    const data = await response.json();
    const clientes = data.clientes || [];
    const bens = data.bens || [];

    if (clientes.length === 0 || bens.length === 0) {
      document.querySelector(
        ".tableLocation"
      ).innerHTML = `<p style="text-align:center;">Nenhuma locação encontrada.</p>`;
      return;
    }

    const formatDate = (isoDate) => {
      if (!isoDate) return "";
      const dateObj = new Date(isoDate);
      return `${dateObj.getFullYear()}/${String(
        dateObj.getMonth() + 1
      ).padStart(2, "0")}/${String(dateObj.getDate()).padStart(2, "0")}`;
    };

    // Criar array unindo clientes e bens
    locacoes = []; // Limpa o array global antes de popular
    clientes.forEach((cliente) => {
      const bensCliente = bens.filter((bem) => bem.beloidcl == cliente.clloid);
      if (bensCliente.length > 0) {
        bensCliente.forEach((bem) => {
          locacoes.push({
            idClient: cliente.clloid,
            numeroLocacao: cliente.cllonmlo,
            nomeCliente: cliente.clloclno,
            cpfCliente: cliente.cllocpf,
            dataLocacao: formatDate(cliente.cllodtlo),
            dataDevolucao: formatDate(cliente.cllodtdv),
            formaPagamento: cliente.cllopgmt,
            codigoBem: bem.bencodb,
            produto: bem.beloben,
            quantidade: bem.beloqntd,
            observacao: bem.beloobsv || "Sem observação",
            dataInicio: formatDate(bem.belodtin),
            dataFim: formatDate(bem.belodtfi),
          });
        });
      } else {
        locacoes.push({
          numeroLocacao: "Não foi gerado",
          nomeCliente: "Não foi defindo",
          cpfCliente: "Não foi defindo",
          dataLocacao: "Não foi gerado",
          dataDevolucao: "Não foi defindo",
          formaPagamento: "Não foi defindo",
          codigoBem: "-",
          produto: "Nenhum bem associado",
          quantidade: "-",
          observacao: "Nenhuma observação",
        });
      }
    });

    renderTable(locacoes); // Renderiza a tabela inicial
  } catch (error) {
    console.error("Erro ao gerar tabela de locação:", error);
  }
}

function renderTable(data) {
  const tableDiv = document.querySelector(".tableLocation");
  tableDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;    margin-bottom: 10px;">
           <h2 style="margin: 0;">Dados da Locação</h2>
            <span id = "messsageFilter" style = "display:none;"> </span>
            <button id="resetFilterBtn" style = "display: none;">Remover Filtro</button>
            <button class="searchloc">Buscar Locação</button>
        </div>
        
        <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
                <tr>
                    <th>Selecionar</th>
                    <th>Número de Locação</th>
                    <th>Status</th>
                    <th>Nome do Cliente</th>
                    <th>CPF do Cliente</th>
                    <th>Data da Locação</th>
                    <th>Data de Devolução</th>
                    <th>Forma de Pagamento</th>
                    <th>Familia do bem</th>
                    <th>Descrição</th>
                    <th>Quantidade</th>
                    <th>Observação</th>
                    <th>Data Início</th>
                    <th>Data Final</th>
                </tr>
            </thead>
            <tbody>
                ${
                  data.length > 0
                    ? data
                        .map(
                          (locacao) => `
                            <tr>
                                <td><input type="checkbox" name="selecionarLocacao" value="${locacao.numeroLocacao}"></td>
                                <td>${locacao.numeroLocacao}</td>
                                <td>Pendente</td>
                                <td>${locacao.nomeCliente}</td>
                                <td>${locacao.cpfCliente}</td>
                                <td>${locacao.dataLocacao}</td>
                                <td>${locacao.dataDevolucao}</td>
                                <td>${locacao.formaPagamento}</td>
                                <td>${locacao.codigoBem}</td>
                                <td>${locacao.produto}</td>
                                <td>${locacao.quantidade}</td>
                                <td>${locacao.observacao}</td>
                                <td>${locacao.dataInicio}</td>
                                <td>${locacao.dataFim}</td>
                            </tr>
                        `
                        )
                        .join("")
                    : `<tr><td colspan="14" style="text-align: center;">Nenhuma locação encontrada.</td></tr>`
                }
            </tbody>
        </table>
    `;
  console.log('MEUS DADOS ' ,  data)
  // Adiciona o evento de busca ao botão "Buscar Locação"
  document.querySelector(".searchloc").addEventListener("click", () => {
    document.querySelector(".searchLocation").style.display = "flex";
  });
}


function filterTable() {
  const numberLocation = document.getElementById("numberLocation").value.trim();
  const nameClient = document.getElementById("nameClientSearch").value.trim();
  const dateLocation = document  .getElementById("dateLocation")  .value.trim() .split("-")
 .join("/");

  const filledInputs = [numberLocation, nameClient, dateLocation].filter((input) => input !== "" ).length;

  if (filledInputs > 1) {
    Toastify({
      text: "Por favor, preencha apenas um campo de pesquisa.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return;
  }

  if (filledInputs === 0) {
    Toastify({
      text: "Por favor, preencha algum campo de pesquisa.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center", 
      backgroundColor: "red",
    }).showToast();
  }
  const filteredData = locacoes.filter((loc) => {
    const matchNumero = numberLocation ? loc.numeroLocacao.includes(numberLocation): true;
    const matchNome = nameClient ? loc.nomeCliente.toLowerCase().includes(nameClient.toLowerCase()) : true;
    const matchData = dateLocation ? loc.dataLocacao === dateLocation : true;
    return matchNumero && matchNome && matchData;
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

  renderTable(filteredData);
  const resetButton = document.getElementById("resetFilterBtn");
  resetButton.style.display = "inline-block";

  const filterMessage = document.getElementById("messsageFilter");
  filterMessage.style.display = "inline-block";
  let filterText = 'Tabela filtrada por: ' ;
  if (numberLocation) filterText += `Número de Locação `;
  if (nameClient) filterText += `Nome do Cliente `;
  if (dateLocation) filterText += `Data de Locação`;
  filterMessage.textContent = filterText;

  
  resetButton.addEventListener("click", () => {
    renderTable(locacoes);
    resetButton.style.display = "none"; 
  });
  document.querySelector(".searchLocation").style.display = "none"; 
};

const btnDeleteLocation = document.querySelector('.buttonDeleteLocation')
 btnDeleteLocation.addEventListener('click' , async ()=>{
         
    const selectedCheckbox = document.querySelector(
        'input[name="selecionarLocacao"]:checked'
      );
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
    
      const locacaoId = selectedCheckbox.value;
    
      const confirmacao = confirm(
        `Tem certeza de que deseja excluir a locação com código ${locacaoId}?`
      );
      if (!confirmacao) {
        return;
      }
    
      await deletelocation(locacaoId, selectedCheckbox.closest("tr"));
  
})

async function deletelocation(id , rowProd) {
    
    try {
        const response = await fetch(`/api/deletelocation/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();
        console.log("Resposta do servidor:", data);
    
        if (response.ok) {
          Toastify({
            text: "A locação foi excluido com sucesso",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "green",
          }).showToast();
    
          rowProd.remove();
        } else {
          console.log("Erro para excluir:", data);
          Toastify({
            text: "Erro na exclusão da Locação",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
          }).showToast();
        }
      } catch (error) {
        console.error("Erro ao excluir locação:", error);
        Toastify({
          text: "Erro ao excluir Locação. Tente novamente.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
      }
}

