

document.addEventListener('DOMContentLoaded', () => {
    const btnDevolution = document.querySelector('.DevolutionDay');
    if (btnDevolution) {
      btnDevolution.addEventListener('click', () => {
        console.log('botão clicado')
        getdeliveryForDevolution();
      });
    }
  });
  
  async function getdeliveryForDevolution() {
    try {
      const result = await fetch('/api/getdelivery', {
        method: 'GET'
      });
  
      if (!result.ok) {
        console.log('ERRO BUSCAR');
        return;
      }
  
      const location = await result.json();
      const hoje = new Date().toISOString().split('T')[0];
  
      const devolucoesHoje = location.filter(loc => {
        const dataDevolucao = loc.lofidtdv?.split('T')[0];
        return dataDevolucao === hoje;
      });
  
      const container = document.querySelector('.devolutionTheDay');
  
      if (devolucoesHoje.length === 0) {
        container.innerHTML = '<p>Nenhuma devolução marcada para hoje.</p>';
        return;
      }
  
      let tabelaHTML = `
        <table class="table table-bordered">
          <thead class="table-light">
            <tr>
              <th>ID Locação</th>
              <th>Bem</th>
              <th>Cliente</th>
              <th>Forma Pgto</th>
              <th>Data Locação</th>
              <th>Data Devolução</th>
            </tr>
          </thead>
          <tbody>
      `;
  
      devolucoesHoje.forEach(loc => {
        tabelaHTML += `
          <tr>
            <td>${loc.loficode}</td>
            <td>${loc.lofiidbe}</td>
            <td>${loc.lofiidcl}</td>
            <td>${loc.lofipgmt}</td>
            <td>${new Date(loc.lofidtlo).toLocaleDateString()}</td>
            <td class="text-danger fw-bold">${new Date(loc.lofidtdv).toLocaleDateString()}</td>
          </tr>
        `;
      });
  
      tabelaHTML += '</tbody></table>';
  
      container.innerHTML = tabelaHTML;
  
    } catch (error) {
      console.error('Erro ao buscar devoluções:', error);
    }
  }