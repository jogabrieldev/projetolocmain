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

    
    const tableDiv = document.querySelector(".orders");
  tableDiv.innerHTML = `
        
        <table id = "tableWithAllLocation">
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
                ${
                  locacoes.length > 0
                    ? locacoes
                        .map(
                          (locacao) => `
                            <tr>
                                 <td><input type="checkbox" name="selecionarLocacao" class="select-location" value="${locacao.numeroLocacao}"></td>
                                <td>${locacao.numeroLocacao}</td>
                                <td>Pendente</td>
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
                    : `<tr><td colspan="14" style="text-align: center;">Nenhuma locação encontrada.</td></tr>`
                }
            </tbody>
        </table>
    `;// Renderiza a tabela inicial
    
    
    } catch (error) {
        console.error('Erro grave' , error)
    }
}

// Necessidade vs Disponibilidade

async function needVsAvaible (params) {

    try {
      const bensResponse = await fetch('/api/listbens');
      const bens = await bensResponse.json();

      // console.log('bens cadastrados:' ,bens)

      
      // Buscar os dados de locações
      const locationResponse = await fetch('/api/location');
      const locations = await locationResponse.json();
      
      const bensLoc = locations.bens

      // console.log('Familia que foi locada:' , bensLoc)
    
      const bensDisponiveis = bens.filter(bem => bem.bensstat === 'Disponivel').length;
      // console.log("Bens disponivel" , bensDisponiveis)

      const pedidosPendentes = bensLoc.filter(bem => bem.belostat === "Pendente").length

      // console.log('Pedidos pendentes:' , pedidosPendentes)

      const divNeed = document.querySelector('.need')
      divNeed.innerHTML = `

       <table id = "tableGoodsVsRequestPending">
            <thead>
                <tr>
                    <th>Bens Disponiveis</th>
                    <th>Pedidos Pendentes</th>
                    
                </tr>
            </thead>
            <tbody>        
                    <tr>     
                            <td>${bensDisponiveis}</td>
                            <td>${pedidosPendentes}</td>
                    </tr>
           </tbody>
        </table>
      `
     
    }catch(error){
      console.error('Erro a buscar dados' , error)
    }
}

document.addEventListener('DOMContentLoaded',()=>{
  needVsAvaible()
  validateFamilyBensPending()
})


async function validateFamilyBensPending() {
  try {
    // Buscar os bens cadastrados
    const bensResponse = await fetch('/api/listbens');
    const bens = await bensResponse.json();
    // console.log('Bens cadastrados:', bens);

    // Buscar a lista de famílias de bens
    const listFamilyBens = await fetch("/api/listfabri");
    const familyBens = await listFamilyBens.json();
    // console.log('Família de bens:', familyBens);

    // Buscar os dados de locações
    const locationResponse = await fetch('/api/location');
    const locations = await locationResponse.json();
    const bensLoc = locations.bens;
    // console.log('Família que foi locada:', bensLoc);

    // Criar um mapa para armazenar as contagens por família
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


// async function checkBensAvailability() {
//   try {
//       // Buscar bens cadastrados e disponíveis
//       const bensResponse = await fetch('/api/listbens');
//       const bens = await bensResponse.json();

//       // Buscar a lista de famílias de bens
//       const listFamilyBens = await fetch("/api/listfabri");
//       const familyBens = await listFamilyBens.json();

//       // Buscar os dados de locações
//       const locationResponse = await fetch('/api/location');
//       const locations = await locationResponse.json();
//       const bensLoc = locations.bens;

//       // Criar um mapa de bens disponíveis por família
//       const disponibilidadePorFamilia = bens.reduce((acc, bem) => {
//           if (bem.bensstat === 'Disponivel') {
//               acc[bem.benscofa] = (acc[bem.benscofa] || 0) + bem.bensqntd;
//           }
//           return acc;
//       }, {});

//       // Criar uma análise de disponibilidade por locação
//       let tableRows = '';
//       bensLoc.forEach(bemLocado => {
//           const familiaBem = bemLocado.benscofa; // Código da família do bem locado
//           const quantidadeSolicitada = bemLocado.beloqntd;
//           const quantidadeDisponivel = disponibilidadePorFamilia[familiaBem] || 0;

//           const status = quantidadeDisponivel >= quantidadeSolicitada ? 
//               `<span style="color: green;">Disponível</span>` : 
//               `<span style="color: red;">Indisponível</span>`;

//           tableRows += `
//               <tr>
//                   <td>${bemLocado.bencodb}</td>
//                   <td>${familiaBem}</td>
//                   <td>${quantidadeSolicitada}</td>
//                   <td>${quantidadeDisponivel}</td>
//                   <td>${status}</td>
//               </tr>
//           `;
//       });

//       // Renderizar a tabela com os dados de disponibilidade
//       const divAvailability = document.querySelector('.availabilityCheck');
//       divAvailability.innerHTML = `
//           <table id="tableAvailabilityCheck">
//               <thead>
//                   <tr>
//                       <th>Código do Bem</th>
//                       <th>Código da Família</th>
//                       <th>Quantidade Solicitada</th>
//                       <th>Quantidade Disponível</th>
//                       <th>Status</th>
//                   </tr>
//               </thead>
//               <tbody>
//                   ${tableRows}
//               </tbody>
//           </table>
//       `;

//   } catch (error) {
//       console.error("Erro ao verificar disponibilidade de bens:", error);
//   }
// }

// // Chamar a função quando a página carregar
// document.addEventListener('DOMContentLoaded', () => {
//   checkBensAvailability();
// });

// async function checkBensAvailability() {
//   try {
//       // Buscar os bens cadastrados
//       const bensResponse = await fetch('/api/listbens');
//       const bens = await bensResponse.json();
//       console.log('Bens cadastrados:', bens);

//       // Buscar a lista de famílias de bens
//       const listFamilyBensResponse = await fetch("/api/listfabri");
//       const familyBens = await listFamilyBensResponse.json();
//       console.log('Famílias de bens:', familyBens);

//       // Buscar os dados de locações
//       const locationResponse = await fetch('/api/location');
//       const locations = await locationResponse.json();
//       const bensLoc = locations.bens;
//       console.log('Bens locados:', bensLoc);

//       // Criar um mapa para armazenar a disponibilidade de bens por família
//       const disponibilidadePorFamilia = bens.reduce((acc, bem) => {
//           if (bem.bensstat === 'Disponivel') {
//               const familia = bem.benscofa;  // Código da família do bem

//               // Se a família ainda não existir no acumulador, inicializa
//               if (!acc[familia]) {
//                   acc[familia] = { quantidade: 0, codigosBens: [] };
//               }

//               // Soma a quantidade de bens disponíveis
//               acc[familia].quantidade += bem.bensqntd;

//               // Adiciona o código do bem se ainda não estiver listado
//               if (!acc[familia].codigosBens.includes(bem.bencodb)) {
//                   acc[familia].codigosBens.push(bem.bencodb);
//               }
//           }
//           return acc;
//       }, {});

//       console.log("Disponibilidade por família:", disponibilidadePorFamilia);

//       // Criar um mapa para armazenar os pedidos pendentes por família
//       const pedidosPendentesPorFamilia = bensLoc.reduce((acc, bem) => {
//           if (bem.belostat === "Pendente") {
//               const familia = bem.benscofa;  // Código da família do bem

//               // Se a família ainda não existir no acumulador, inicializa
//               if (!acc[familia]) {
//                   acc[familia] = { quantidade: 0 };
//               }

//               // Soma a quantidade de bens locados pendentes
//               acc[familia].quantidade += bem.beloqntd;
//           }
//           return acc;
//       }, {});

//       console.log("Pedidos pendentes por família:", pedidosPendentesPorFamilia);

//       // Criar tabela de resultados
//       let tableRows = '';
//       familyBens.forEach((familia) => {
//           const codigoFamilia = familia.fabecode;
//           const descricaoFamilia = familia.fabedesc;

//           const disponibilidade = disponibilidadePorFamilia[codigoFamilia] || { quantidade: 0, codigosBens: [] };
//           const pedidosPendentes = pedidosPendentesPorFamilia[codigoFamilia] || { quantidade: 0 };

//           tableRows += `
//               <tr>
//                   <td>${codigoFamilia}</td>
//                   <td>${descricaoFamilia}</td>
//                   <td>${disponibilidade.quantidade}</td>
//                   <td>${disponibilidade.codigosBens.join(', ') || 'Nenhum'}</td>
//                   <td>${pedidosPendentes.quantidade}</td>
//               </tr>
//           `;
//       });

//       // Atualizar a tabela na interface
//       const divNeed = document.querySelector('.availabilityCheck');
//       divNeed.innerHTML = `
//           <table id="tableGoodsVsRequestPendinglll">
//               <thead>
//                   <tr>
//                       <th>Código da Família</th>
//                       <th>Descrição</th>
//                       <th>Bens Disponíveis</th>
//                       <th>Códigos dos Bens</th>
//                       <th>Pedidos Pendentes</th>
//                   </tr>
//               </thead>
//               <tbody>
//                   ${tableRows}
//               </tbody>
//           </table>
//       `;
//   } catch (error) {
//       console.error("Erro ao validar os bens e pedidos:", error);
//   }
// }


// // Chamar a função quando a página carregar
// document.addEventListener('DOMContentLoaded', () => {
//   checkBensAvailability();
// });
