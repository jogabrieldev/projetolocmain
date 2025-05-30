
document.addEventListener('DOMContentLoaded', () => {
    const btnDevolution = document.querySelector('.btnDevolution');
    if (btnDevolution) {

      btnDevolution.addEventListener('click', async() => {
         
        try {
              const responseDevol = await fetch('/devolution' , {
                method: 'GET'
              })

              if (!responseDevol.ok) throw new Error(`Erro HTTP: ${responseDevol.status}`);
           const html = await responseDevol.text();
           const mainContent = document.querySelector('#mainContent');
           if (mainContent) {
             mainContent.innerHTML = html;

             getdeliveryForDevolution();
           }else{
             console.warn('#mainContent não encontrado no DOM')
           }

           const informative = document.querySelector(".information");
           if(informative){
             informative.style.display = "block";
             informative.textContent = "SESSÃO DEVOLUÇÃO";
           }
        } catch (error) {
          
        }
        
      });
    }
  });
  
  async function getdeliveryForDevolution() {
    const token = localStorage.getItem('token'); 
    try {
      const [deliveryRes, clientsRes] = await Promise.all([
        fetch('/api/getdelivery', {
          method: 'GET'
        }),
        fetch('/api/listclient', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
      ]);
  
      if (!deliveryRes.ok || !clientsRes.ok) {
        console.log('Erro ao buscar dados.');
        return;
      }
  
      const location = await deliveryRes.json();
      const clients = await clientsRes.json();
  
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
              <th style="width: 80px;">ID</th>
              <th>ID Locação</th>
              <th>Bem</th>
              <th>Cliente</th>
              <th>Forma Pgto</th>
              <th>Data Locação</th>
              <th>Data Devolução</th>
              <th>Detalhes</th>
            </tr>
          </thead>
          <tbody>
      `;
  
      devolucoesHoje.forEach(loc => {
        const cliente = clients.find(cl => cl.cliecode === loc.lofiidcl);
        const nomeCliente = cliente ? cliente.clienome : 'Cliente não encontrado';
  
        tabelaHTML += `
          <tr>
            <td>${loc.loficode}</td>
            <td>${loc.lofiidlo}</td>
            <td>${loc.lofiidbe}</td>
            <td>${nomeCliente}</td>
            <td>${loc.lofipgmt}</td>
            <td>${new Date(loc.lofidtlo).toLocaleDateString()}</td>
            <td class="text-danger fw-bold">${new Date(loc.lofidtdv).toLocaleDateString()}</td>
            <td>
              <button class="btn btn-sm btn-success btn-details" data-id="${loc.loficode}">Detalhes</button>
            </td>
          </tr>
        `;
      });
  
      tabelaHTML += '</tbody></table>';
      container.innerHTML = tabelaHTML;
  
    } catch (error) {
      console.error('Erro ao buscar devoluções:', error);
    }
  }
  