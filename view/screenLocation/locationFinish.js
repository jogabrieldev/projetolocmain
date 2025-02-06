
 // locação finalizada 

 const btnOutPageLocation = document.querySelector('.buttonExitLocation')
 btnOutPageLocation.addEventListener('click' , ()=>{

    const containerAppLocation =  document.querySelector('.containerAppLocation')
    containerAppLocation.style.display = 'none'
 });
 
  async function frontLocation() {
    try {
        // Chamar a API para buscar os dados de locações
        const response = await fetch('/api/location');
        if (!response.ok) throw new Error("Erro ao buscar locações.");

        // Obter os dados
        const data = await response.json();
        console.log("Dados retornados da API:", data);

        const clientes = data.clientes || [];
        const bens = data.bens || [];

        console.log("Clientes recebidos:", clientes);
        console.log("Bens recebidos:", bens);

        // Se não houver clientes, exibir mensagem e sair
        if (clientes.length === 0) {
            document.querySelector(".tableLocation").innerHTML = `<p style="text-align:center;">Nenhuma locação encontrada.</p>`;
            return;
        }

        // Função para formatar data
        const formatDate = (isoDate) => {
            if (!isoDate) return "";
            const dateObj = new Date(isoDate);
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, "0");
            const day = String(dateObj.getDate()).padStart(2, "0");
            return `${year}/${month}/${day}`;
          };
  

        // Criar um array unindo clientes e bens
        const locacoes = [];
        clientes.forEach(cliente => {
            const bensCliente = bens.filter(bem => bem.beloidcl == cliente.clloid);

            if (bensCliente.length > 0) {
                bensCliente.forEach(bem => {
                    locacoes.push({
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
                        dataInicio : formatDate(bem.belodtin),
                        dataFim: formatDate(bem.belodtfi)
                        // devo trazer o status
                    });
                });
            } else {
                // Caso um cliente não tenha bens cadastrados, ele ainda é mostrado na tabela
                locacoes.push({
                    numeroLocacao: cliente.cllonmlo,
                    nomeCliente: cliente.clloclno,
                    cpfCliente: cliente.cllocpf,
                    dataLocacao: formatDate(cliente.cllodtlo),
                    dataDevolucao: formatDate(cliente.cllodtdv),
                    formaPagamento: cliente.cllopgmt,
                    codigoBem: "-",
                    produto: "Nenhum bem associado",
                    quantidade: "-",
                    observacao: "Nenhuma observação"
                });
            }
        });

        console.log("Locações processadas:", locacoes);

        // Gerar tabela dinamicamente com os dados retornados
        const tableDiv = document.querySelector(".tableLocation");
        tableDiv.innerHTML = `
            <h2>Dados da Locação</h2>
            <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                    <tr>
                        <th>Selecionar</th>
                        <th>Número de Locação</th>
                        <th>Nome do Cliente</th>
                        <th>CPF do Cliente</th>
                        <th>Data da Locação</th>
                        <th>Data de Devolução</th>
                        <th>Forma de Pagamento</th>
                        <th>Código do Bem</th>
                        <th>Produto</th>
                        <th>Quantidade</th>
                        <th>Observação</th>
                        <th>Data Inicio</th>
                        <th>Data Final</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${
                        locacoes.length > 0
                            ? locacoes.map(locacao => `
                                <tr>
                                 <td> <input type="checkbox" name="selecionarLocacao" value="${locacao.numeroLocacao}"
                                 </td>
                                    <td>${locacao.numeroLocacao}</td>
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
                                    <td>Pendente</td>
                                </tr>
                            `).join("")
                            : `
                                <tr>
                                    <td colspan="10" style="text-align: center;">Nenhuma locação encontrada.</td>
                                </tr>
                            `
                    }
                </tbody>
            </table>
             
        `;
        tableDiv.style.display = "block";


    } catch (error) {
        console.error("Erro ao gerar tabela de locação:", error);

        Toastify({
            text: "Ocorreu um erro ao buscar as locações. Por favor, tente novamente.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
          }).showToast();
    }
};
 document.querySelector('.btnRegisterLocation').addEventListener('click', ()=>{
  frontLocation();
});






