const btnAtivLogistics = document.querySelector('.btnLogistic')
btnAtivLogistics.addEventListener('click' , ()=>{

    const informative = document.querySelector(".information");
     informative.style.display = "block";
     informative.textContent = "SEÇÃO LOGISTICA";
     
     const containerLogistica = document.querySelector('.containerLogistica')
     containerLogistica.style.display = 'flex'

     document.querySelector(".containerAppLocation").style.display = "none";
});

async function locationPendente() {
     
    try {
        const response = await fetch("/api/location");
    if (!response.ok) throw new Error("Erro ao buscar locações.");

    // Obter os dados
    const data = await response.json();
    const clientes = data.clientes || [];
    const bens = data.bens || [];

    if (clientes.length === 0 || bens.length === 0) {
      document.querySelector(
        ".orders"
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
            codigoBem: bem.bencodb,
            produto: bem.beloben,
            quantidade: bem.beloqntd,
            status: bem.belostat,
            observacao: bem.beloobsv || "Sem observação",
            dataInicio: formatDate(bem.belodtin),
            dataFim: formatDate(bem.belodtfi),
          });
        });
      } else {
        locacoes.push({
          numeroLocacao: "Não foi gerado",
          nomeCliente: "Não foi definido",
          cpfCliente: "Não foi definido",
          dataLocacao: "Não foi definida",
          dataDevolucao: "A data não foi definida",
          formaPagamento: "Não foi definido",
          codigoBem: "-",
          produto: "Nenhum bem associado",
          quantidade: "-",
          observacao: "Nenhuma observação",
        });
      }
    });
      
    const filterStatus = locacoes.filter((locacao) => locacao.status === "Em locação");
    const filterStatusPendente = locacoes.filter((locacao) => locacao.status === "Pendente");
    
    const tableDiv = document.querySelector(".orders");
    
    // Se houver locações "Em Locação", limpa a tabela e não renderiza nada
    if (filterStatus.length > 0 && filterStatusPendente.length === 0) {
        tableDiv.innerHTML = "";
    } 
    // Se houver locações "Pendente", renderiza a tabela apenas com elas
    else if (filterStatusPendente.length > 0) {
        tableDiv.innerHTML = `
           <table id="tableWithAllLocation">
                <thead>
                    <tr>
                        <th>Selecionar</th>
                        <th>Número de Locação</th>
                        <th>Status</th>
                        <th>Nome do Cliente</th>
                        <th>Data da Locação</th>
                        <th>Data de Devolução</th>
                        <th>Familia do bem</th>
                        <th>Descrição</th>
                        <th>Quantidade</th>
                    </tr>
                </thead>
                <tbody>
                    ${filterStatusPendente
                        .map(
                            (locacao) => `
                                <tr>
                                    <td><input type="checkbox" name="selecionarLocacao" class="select-location" 
                                        value="${locacao.numeroLocacao}" data-quantidade="${locacao.quantidade}" 
                                        data-familia="${locacao.codigoBem}" data-cliente="${locacao.nomeCliente}" ></td>
                                    <td>${locacao.numeroLocacao}</td>
                                    <td>${locacao.status}</td>
                                    <td>${locacao.nomeCliente}</td>
                                    <td>${locacao.dataLocacao}</td>
                                    <td>${locacao.dataDevolucao}</td>
                                    <td>${locacao.codigoBem}</td>
                                    <td>${locacao.produto}</td>
                                    <td>${locacao.quantidade}</td>
                                </tr>
                            `
                        )
                        .join("")
                    }
                </tbody>
            </table>
        `;
    } else {
        tableDiv.innerHTML = `<p style="text-align:center;">Nenhuma locação pendente encontrada.</p>`;
    }
    

    document.querySelectorAll(".select-location").forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        const quantidadeLocacao  = parseInt(event.target.dataset.quantidade);
        const isChecked = event.target.checked;
        const familiaBem = event.target.dataset.familia;
        const cliente = event.target.dataset.cliente
       
        console.log('familia do bem:' , familiaBem)

      
        needVsAvaible( cliente, quantidadeLocacao, familiaBem, isChecked);
      });
    });

  } catch (error) {
        console.error('Erro para gerar tabela locação!!' , error)  }
}

// Necessidade vs Disponibilidade
async function needVsAvaible( cliente,quantidadeLocacao, familiaBem , isChecked) {


  try {
      const bensResponse = await fetch('/api/listbens');
      if (!bensResponse.ok) throw new Error("Erro ao buscar bens.");
      const bens = await bensResponse.json();

      const bensFiltrados = bens.filter(bem => {
        bem.bensstat === 'Disponivel' && bem.benscofa === familiaBem
        return bem.bensstat === "Disponivel" && bem.benscofa === familiaBem;
      });

      const quantidadeDisponivel = bensFiltrados.length;


      // console.log("📌 Bens disponíveis filtrados:", bensFiltrados);
      // console.log("📢 Quantidade disponível:", quantidadeDisponivel);
      const statusText = quantidadeDisponivel >= quantidadeLocacao ? "Suficiente" : "Insuficiente";

      const divNeed = document.querySelector('.need');
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
  
          console.log("Cliente locação", cliente);
          abrirModal(cliente, familiaBem, quantidadeLocacao);
        });
      }
    
  } catch (error) {
      console.error("Erro ao buscar dados", error);
  }
}


async function abrirModal(cliente, familiaBem, quantidadeLocacao) {
  try {
    const response = await fetch("/api/listbens");
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

          <h3>Bens Disponíveis</h3>
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

    modalDiv.style.display = "block";

    if(modalDiv.style.display = "block"){
      document.querySelector('.containerLogistica').style.display = 'none'
    }

    // Evento para fechar o modal
    document.querySelector(".OutScreenLinkGoods").addEventListener("click", () => {
      modalDiv.style.display = "none";
    });

    // Evento para vincular bem ao cliente
    document.querySelectorAll(".vincular-bem").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const bemId = event.target.dataset.id;
      
        const sucess = await vincularBem(bemId, familiaBem );
        if(sucess){
          removerBemDaTabela(bemId)
        }
      });
    });
  } catch (error) {
    console.error("Erro ao abrir modal", error);
  }
}

// tira o bem assim que vinculado


// vincular o bem a locação marcada
 async function vincularBem(bemId, familiaBem) {
  try {
    // Pega a locação selecionada
    const locacaoSelecionada = document.querySelector(".select-location:checked");

    if (!locacaoSelecionada) {
      alert("Nenhuma locação selecionada!");
      return;
    }

    // Obtém os dados do cliente a partir da linha da tabela
    const tr = locacaoSelecionada.closest("tr");
    console.log("Linha da tabela selecionada:", tr);

    const locationId = tr.querySelector("td:nth-child(2)").textContent.trim();

    const nomeCliente = tr.querySelector("td:nth-child(4)").textContent
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();

    const responseClientes = await fetch("/api/listclient");
    if (!responseClientes.ok) throw new Error("Erro ao obter lista de clientes");

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
    console.log(`Cliente encontrado:`, clienteEncontrado);
    console.log("id do Cliente:", idClient);

    

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
      }),
    });

    if (!response.ok) throw new Error("Erro ao vincular bem.");

    const statusUpdateResponse = await fetch(`/api/updatestatus/${bemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bensstat: "Em Locação" }),
    });

    const statusUpdateResponseLocation = await fetch(`/api/updatestatuslocation/${familiaBem}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ belostat: "Em Locação" }),
    });

    if (!statusUpdateResponse.ok || !statusUpdateResponseLocation.ok) {
      throw new Error("Erro ao atualizar status do bem ou da locação.");
    }

    const bemRow = document.querySelector(`[data-benscode="${bemId}"]`);
    if (bemRow) {
      bemRow.querySelector(".status-bem").textContent = "Em Locação";
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
      text: `Erro: ${error.message}`,
      duration: 4000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
  }
}

 document.addEventListener('DOMContentLoaded',()=>{
  validateFamilyBensPending()
})
async function validateFamilyBensPending() {
  try {
    
    const bensResponse = await fetch('/api/listbens');
    const bens = await bensResponse.json();

    const listFamilyBens = await fetch("/api/listfabri");
    const familyBens = await listFamilyBens.json();

    const locationResponse = await fetch('/api/location');
    const locations = await locationResponse.json();
    const bensLoc = locations.bens;

    const resultadosPorFamilia = familyBens.reduce((acc, familia) => {
      const codigoFamilia = familia.fabecode;
      const familiaDescrição = familia.fabedesc

      // Contar bens disponíveis para essa família
      const bensDisponiveis = bens.filter(bem => 
        bem.bensstat === 'Disponivel' && bem.benscofa === codigoFamilia
      ).length;

      // Contar pedidos pendentes para essa família
      const pedidosPendentes = bensLoc.filter(bem => 
        bem.belostat === "Pendente" && bem.bencodb === codigoFamilia
      ).length;

      acc[codigoFamilia] = { familiaDescrição, bensDisponiveis, pedidosPendentes };
      return acc;
    }, {});

    console.log('Resultados por família:', resultadosPorFamilia);

    // Renderizar os resultados na tabela
    let tableRows = '';
    for (const [codigoFamilia, {familiaDescrição, bensDisponiveis, pedidosPendentes }] of Object.entries(resultadosPorFamilia)) {
      tableRows += `
        <tr>
          <td> ${codigoFamilia}</td>
          <td>${familiaDescrição}</td>
          <td>${bensDisponiveis}</td>
          <td>${pedidosPendentes}</td>
          
        
        </tr>
      `;
    }

    const divNeed = document.querySelector('.validadeFamily');
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
}


