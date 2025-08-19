
document.addEventListener('DOMContentLoaded', () => {
    const btnDevolution = document.querySelector('.btnDevolution');
    if (btnDevolution) {

      btnDevolution.addEventListener('click', async() => {
         
        try {
              const responseDevol = await fetch('/devolution' , {
                method: 'GET',
              })

           if (!responseDevol.ok) throw new Error(`Erro HTTP: ${responseDevol.status}`);
           const html = await responseDevol.text();
           const mainContent = document.querySelector('#mainContent');
           if (mainContent) {
             mainContent.innerHTML = html;
             interationSystemDevolution();
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
          Toastify({
          text: "Erro na pagina!.",
          duration: 3000,
          close: true,
          gravity: "top",
           position: "center",
          backgroundColor: "#f44336",
          }).showToast();
        }
      });
    };
  });

  function interationSystemDevolution(){
      const btnOutPageDevolution =  document.getElementById('outPageDevolution')
      if(btnOutPageDevolution){
         btnOutPageDevolution.addEventListener('click' , ()=>{
             const sectiondevolutionDelivery = document.querySelector('.devolutionDelivery')
             if(sectiondevolutionDelivery){
               sectiondevolutionDelivery.classList.remove('flex')
               sectiondevolutionDelivery.classList.add('hidden')
             }
         })
      }


      const outPageDetailsDevolution = document.querySelector(".outPageDetailsDevolution")
      if(outPageDetailsDevolution){
        outPageDetailsDevolution.addEventListener("click" , ()=>{
            const backDrop = document.querySelector('.popupBackDrop')
            if(backDrop) backDrop.style.display = "none"

            const popUp = document.querySelector(".detailsTheDevolution")
            if(popUp) popUp.style.display = "none"
           

        })
      }
  }
  

   async function searchNameClient(cliecode){
     try {
        const token = localStorage.getItem('token')
         const response = await fetch(`/api/client/${cliecode}`,{
           method:"GET",
           headers:{
             "content-type": "application/json",
             Authorization: `Bearer ${token}`
           }
         })
        if(response.ok){
          
           const result = await response.json()
           const nameClient = result.clienome
           return nameClient
         }
         
     } catch (error) {
       console.error("Erro ao buscar cliente")
     };
  };

  async function searchNameGoods(idBem){
       
   try {
        const token = localStorage.getItem('token')
         const response = await fetch(`/api/bens/${idBem}`,{
           method:"GET",
           headers:{
             "content-type": "application/json",
             Authorization: `Bearer ${token}`
           }
         })
        if(response.ok){
          
           const result = await response.json()
           if(result){ 
              const goods = result.bem
              const nameGoods = goods.bensnome
              return nameGoods
           }
           
         }
         
     } catch (error) {
       console.error("Erro ao buscar bem")
     };
  }

  // pegar Devoluções 
  async function getdeliveryForDevolution() {

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
    const response = await fetch('/api/devolution', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      Toastify({
      text: "Erro em buscar devoluções do dia!.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "#f44336",
    }).showToast();
      console.error('Erro ao buscar devoluções.');
      return;
    }

    const data = await response.json();
    const devolucoesHoje = data.devolution;

  
   const container = document.querySelector('.devolutionTheDay');
   if(!container)return
   container.innerHTML = ''; 

   if(!devolucoesHoje || devolucoesHoje.length === 0) {
      container.innerHTML = "<p class='text-danger text-center'> Nenhuma devolução encontrada pra hoje! </p>"
      return;
    }

    // Cria a tabela
    const table = document.createElement('table');
    table.className = 'table table-bordered';

    const thead = document.createElement('thead');
    thead.className = 'table-light';
    const headRow = document.createElement('tr');
    const headers = [ 'ID Locação', 'Bem', 'Cliente', 'Forma Pgto', , 'Data Devolução', 'Detalhes'];

    headers.forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      if (text === 'ID') th.style.width = '80px';
      headRow.appendChild(th);
    });

    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    devolucoesHoje.forEach( async loc => {
      const tr = document.createElement('tr');

      const tdLocacao = document.createElement('td');
      tdLocacao.textContent = loc.lofiidlo;
      tr.appendChild(tdLocacao);

      const tdBem = document.createElement('td');
      tdBem.textContent = loc.lofiidbe;
      tr.appendChild(tdBem);

      const tdCliente = document.createElement('td');
      const nomeClient = await searchNameClient(loc.lofiidcl)
      tdCliente.textContent = nomeClient || loc.lofiidcl;
      tr.appendChild(tdCliente);

      const tdPgto = document.createElement('td');
      tdPgto.textContent = loc.lofipgmt || '-';
      tr.appendChild(tdPgto);

      const tdDataDev = document.createElement('td');
      tdDataDev.textContent = formatDataPattersBr(loc.lofidtdv);
      tdDataDev.classList.add('text-danger', 'fw-bold');
      tr.appendChild(tdDataDev);

      const tdDetalhes = document.createElement('td');
      const btnDetalhes = document.createElement('button');
      btnDetalhes.className = 'btn btn-sm btn-success btn-details';
      btnDetalhes.textContent = 'Detalhes';
      btnDetalhes.location = loc;
      tdDetalhes.appendChild(btnDetalhes);
      tr.appendChild(tdDetalhes);

      btnDetalhes.addEventListener("click" , (event)=>{
         detailsForDevolution(event)
      })

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);

  } catch (error) {
    console.error('Erro ao buscar devoluções:', error);
    Toastify({
      text: "Erro em buscar devoluções do dia!.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "#f44336",
    }).showToast();
  };
};

// detalhes
async function detailsForDevolution(event) {
  
    try {
      const button = event.currentTarget
     const locationDevolution = button.location;

       const backDrop = document.querySelector('.popupBackDrop')
      if(backDrop){
        backDrop.style.display = 'flex'
      }
 
      const popUp = document.querySelector('.detailsTheDevolution')
       if(popUp){
        popUp.style.display = 'flex'
     }

     if(locationDevolution){
          document.getElementById('nameClient').textContent = await searchNameClient(locationDevolution?.lofiidcl) || locationDevolution?.lofiidcl
          document.getElementById("nameGoods").textContent = await searchNameGoods(locationDevolution?.lofiidbe) ||  locationDevolution?.lofiidbe
          document.getElementById("numberLocation").textContent = locationDevolution?.enfinmlo
          document.getElementById("cepDevolution").textContent = locationDevolution?.loficep || "Não foi passado"
          document.getElementById("ruaDevolution").textContent = locationDevolution?.lofirua
          document.getElementById("cidaDevolution").textContent = locationDevolution?.loficida || "Não foi passado"
          document.getElementById("bairroDevolution").textContent = locationDevolution?.lofibair || "Não foi passado"
     }
     
         
    } catch (error) {
      
    }
}
