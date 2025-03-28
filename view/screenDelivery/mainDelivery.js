
const btnDelivery = document.querySelector('.delivery')
btnDelivery.addEventListener('click' , ()=>{
      const deliveryFinish = document.querySelector('.deliveryFinish')
      deliveryFinish.style.display = 'flex'

      const informative = document.querySelector(".information");
      informative.style.display = "block";
      informative.textContent = "SEÇÃO ENTREGA ";

      const containerAppLocation = document.querySelector(".containerAppLocation");
      containerAppLocation.style.display = "none";

      const containerLogistica = document.querySelector(".containerLogistica");
      containerLogistica.style.display = "none";

      const containerDelivery = document.querySelector('.containerDelivery');
      containerDelivery.style.display = 'none'

})

const btnOutPageListLocationForDelivery = document.querySelector('.btnOutPageListLocationForDelivery')
btnOutPageListLocationForDelivery.addEventListener('click' , ()=>{

      const deliveryFinish = document.querySelector('.deliveryFinish')
      deliveryFinish.style.display = 'none'
})
const socketUpdateTableDelivey = io(); 
document.addEventListener('DOMContentLoaded', ()=>{
    
    socketUpdateTableDelivey.on("updateRunTimeRegisterLinkGoodsLocation", async () => {
        await getAllDelivery(); 
        renderTableDelivery();  
    });

})

let deliveryData = [];
let clientData = [];

// Função para buscar locações
async function getAllDelivery() {
    try {
        const response = await fetch('/api/getdelivery');
        deliveryData = await response.json();

        await getAllClients(); // Buscar clientes antes de preencher a tabela

    } catch (error) {
        console.error("Erro ao buscar as locações:", error);
    }
}

// Função para buscar clientes
async function getAllClients() {

      const token = localStorage.getItem('token'); // Pega o token armazenado no login

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
        const response = await fetch('/api/listclient' , {
            method:"GET",
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              }
        });
        clientData = await response.json();
           
        renderTableDelivery(); 

      
    } catch (error) {
        console.error("Erro ao buscar os clientes:", error);
    }
}

// Função para renderizar a tabela com dados combinados
function renderTableDelivery() {
    const tbody = document.querySelector("#tableDelivery tbody");
    const thead = document.querySelector("#tableDelivery thead");
    const table = document.querySelector("#tableDelivery");
    const messageContainer = document.querySelector("#noDeliveriesMessage");

    tbody.innerHTML = ""; 

    if (deliveryData.length > 0 && clientData.length > 0) {
        thead.style.display = "table-header-group"; // Exibe o thead
        table.style.display = "table"; 

        if (messageContainer) {
            messageContainer.remove();
        }

        deliveryData.forEach(item => {
            const cliente = clientData.find(c => c.cliecode === item.lofiidcl);
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${item.loficode}</td>
                <td>${item.lofiidbe}</td>
                <td>${cliente ? cliente.clienome : "Desconhecido"}</td>
                <td>${item.lofiidlo}</td>
                <td>${new Date(item.lofidtlo).toLocaleString()}</td>
                <td><button class="detalhes" onclick="showDetails(${item.loficode})">Detalhes</button></td>
            `;

            tbody.appendChild(tr);
        });

        // Adiciona evento para esconder a tabela ao clicar em "Detalhes"
        document.querySelectorAll(".detalhes").forEach(button => {
            button.addEventListener("click", function () {
                table.style.display = "none";
            });
        });

    } else {
        // Esconde o thead e a tabela
        thead.style.display = 'none'
        table.style.display = 'none'
       

        if (!document.querySelector("#noDeliveriesMessage")) {
            const message = document.createElement("p");
            message.id = "noDeliveriesMessage";
            message.textContent = "Nenhuma entrega para ser feita.";
            message.style.textAlign = "center";
            message.style.fontSize = "18px";
            message.style.fontWeight = "bold";
            message.style.color = "#666";
            table.parentNode.appendChild(message); // Adiciona após a tabela
        }
    }
}

let motoris = []

// Função para exibir os detalhes da locação e do cliente
 async function showDetails(codigo) {

    btnOutPageListLocationForDelivery.style.display = "none"

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
        const response  = await fetch ("/api/listingdriver" , {
            method: "GET",
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              }
      }) 

       if(!response){throw error('erro ao buscar motorista para entrega') }
         motoris = await response.json()

         const item = deliveryData.find(d => d.loficode === codigo);
         if (!item) return;
   
         const cliente = clientData.find(c => c.cliecode === item.lofiidcl);
   
         const motorista = motoris.find(m => m.motocode === item.lofiidmt); 
        
         const container = document.querySelector(".containerDelivery");
   
         // Criando os elementos
         const wrapper = document.createElement("div");
         wrapper.style.display = "flex";
         wrapper.style.gap = "20px";
         wrapper.style.height = "65%"
         
         // Div de Detalhes da Locação
         const locacaoDiv = document.createElement("div");
         locacaoDiv.style.flex = "1";
         locacaoDiv.style.padding = "10px";
         locacaoDiv.style.height = '85%'
         locacaoDiv.style.border = "1px solid #ddd";
         locacaoDiv.style.borderRadius = "5px";
         locacaoDiv.style.marginBottomn = '20%';
         locacaoDiv.innerHTML = `
             <h3>Detalhes da Locação</h3>
             <p><strong>ID do Bem:</strong> ${item.lofiidbe}</p>
             <p><strong>ID locação:</strong> ${item.lofiidlo}</p>
             <p><strong>Motorista:</strong> ${motorista ? motorista.motoname : "Nenhum"}</p>
             <p><strong>Data e Hora:</strong> ${new Date(item.lofidtlo).toLocaleString()}</p>
             <p><strong>Forma de Pagamento:</strong> ${item.lofipgmt}</p>
         `;
         
         // Div de Detalhes do Cliente
         const clienteDiv = document.createElement("div");
         clienteDiv.style.flex = "1";
         clienteDiv.style.padding = "10px";
         clienteDiv.style.height = '85%'
         clienteDiv.style.border = "1px solid #ddd";
         clienteDiv.style.borderRadius = "5px";
         clienteDiv.innerHTML = cliente
             ? `
             <h3>Detalhes do Cliente</h3>
             <p><strong>Nome:</strong> ${cliente.clienome}</p>
             <p><strong>CPF:</strong> ${cliente.cliecpf}</p>
             <p><strong>Celular:</strong> ${cliente.cliecelu}</p>
             <p><strong>Região:</strong> ${cliente.cliecity}, ${cliente.clieestd}</p>
             <p><strong>Rua:</strong> ${cliente.clierua}</p>
             <p><strong>CEP:</strong> ${cliente.cliecep}</p>
             `
             : `<p><strong>Cliente não encontrado.</strong></p>`;
          

            const containerBtnpage = document.createElement("div");
             containerBtnpage.style.display = "flex";
             containerBtnpage.style.padding = "8px";
             containerBtnpage.style.gap = '20px';
             containerBtnpage.style.justifyContent = 'start'

    
         const voltarBtn = document.createElement("button");
         voltarBtn.textContent = "Voltar";
         voltarBtn.style.marginTop = "10px";
         voltarBtn.classList.add('btnOutDelivery')

         voltarBtn.addEventListener('click', ()=>{
              const containerDelivery = document.querySelector('.containerDelivery');
              containerDelivery.style.display = 'none'

              btnOutPageListLocationForDelivery.style.display = "flex"

             renderTableDelivery()
             
        })

         const imprimir = document.createElement("button");
         imprimir.textContent = "Imprimir";
         imprimir.style.marginTop = "10px";
         imprimir.classList.add('btnImprimirDelivery')


         imprimir.addEventListener('click', ()=>{
            printDelivery(wrapper);
        })

    
         // Adicionando os elementos ao wrapper e container
         containerBtnpage.appendChild(voltarBtn)
         containerBtnpage.appendChild(imprimir)
         wrapper.appendChild(locacaoDiv);
         wrapper.appendChild(clienteDiv);
         container.innerHTML = ""; // Limpa o container antes de adicionar novos elementos
         container.appendChild(wrapper);
         container.appendChild(containerBtnpage)
         container.style.display = "block";
       
      } catch (error) {
          console.error('ERRO A MOSTRAR A TELA:', error)
      }
      
  };

  function printDelivery(element) {
    const printWindow = window.open('', '', 'width=800,height=600');
    
    printWindow.document.write(`
        <html>
        <head>
            <title>Imprimir Detalhes</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .print-container { width: 100%; margin: auto; }
                .print-container table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                .print-container th, .print-container td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .print-container th { background-color: #f2f2f2; }
                h3 { margin-bottom: 10px; }
                .no-print { display: none; } /* Oculta botões na impressão */
            </style>
        </head>
        <body>
            <div class="print-container">
                <h2>Detalhes da Entrega</h2>
                ${element.outerHTML}
            </div>
            <script>
                window.onload = function() {
                    setTimeout(() => {
                        window.print();
                        window.onafterprint = function() { window.close(); };
                    }, 500);
                };
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
};

// Carrega os dados ao iniciar a página
getAllDelivery();