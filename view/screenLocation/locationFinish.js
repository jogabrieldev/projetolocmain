const btnlocationFinish = document.querySelector('.btnlocationFinish')
btnlocationFinish.addEventListener('click' , ()=>{

    const containerLocationFinish = document.querySelector('.containerLocationFinish')
    containerLocationFinish.style.display = 'flex'

   const containerAppLocation = document.querySelector('.containerAppLocation')
   containerAppLocation.style.display = 'none'
})

   
  async function processarLocacao() {

  const resuntClient = await fetch()

    
  }


  async function goodsLocation() {
    try {
      // Chamar a API para buscar os dados de locações
      const response = await fetch("/api/locationfinish");
      if (!response.ok) throw new Error("Erro ao buscar locações.");
      
      // Obter dados de locações
      const locacoes = await response.json();
      console.log("Dados de locações:", locacoes);
  
      // Função para formatar data
      const formData = (data) => {
        if (!data) return 'Data não informada';
        const dateObj = new Date(data);
        return new Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).format(dateObj);
      };
  
      // Gerar tabela dinamicamente com os dados retornados
      const tableDiv = document.querySelector(".tableLocation");
      tableDiv.innerHTML = `
        <h2>Dados da Locação</h2>
        <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr>
              <th>Nome do Cliente</th>
              <th>CPF do Cliente</th>
              <th>Data da Locação</th>
              <th>Data de Devolução</th>
              <th>Hora da Locação</th>
              <th>Forma de Pagamento</th>
              <th>Código do Bem</th>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Descrição</th>
            </tr>
          </thead>
          <tbody>
            ${
              locacoes.length > 0
                ? locacoes
                    .map(
                      (locacao) =>
                        console.log("Gerando linha para:", locacao) `
                        <tr>
                          <td>${locacao.nomecliente}</td>
                          <td>${locacao.clienteid}</td>
                          <td>${formData(locacao.datalocacao)}</td>
                          <td>${formData(locacao.datadevolucao)}</td>
                          <td>${locacao.horalocacao}</td>
                          <td>${locacao.formapagament}</td>
                          <td>${locacao.bemid}</td>
                          <td>${locacao.nomebem}</td>
                          <td>${locacao.quantidade}</td>
                          <td>${locacao.descricaobem}</td>
                        </tr>
                      `
                    )
                    .join("")
                : `
                  <tr>
                    <td colspan="10" style="text-align: center;">Nenhuma locação encontrada.</td>
                  </tr>
                `
            }
          </tbody>
        </table>
        <button id="voltar">Voltar</button>
      `;
      tableDiv.style.display = "block";
  
      // Adicionar evento ao botão de voltar
      document.getElementById("voltar").addEventListener("click", () => {
        tableDiv.style.display = "none";
        document.querySelector(".informationMainClient").style.display = "block";
        document.querySelector(".familyBens").style.display = "block";
      });

      
    } catch (error) {
      console.error("Erro ao gerar tabela de locação:", error);
      alert("Ocorreu um erro ao buscar as locações. Por favor, tente novamente.");
    }
  }
 


