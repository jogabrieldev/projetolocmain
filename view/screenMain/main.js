// funcionalidade dos botoes do menu da tela
//button bens
const Toastify = require('toastify-js')

const buttonStartCadBens = document.querySelector(".btnCadBens");
buttonStartCadBens.addEventListener("click", () => {
  const contentOptionsGoods = document.querySelector(".optionsBens");
  const contentOptionsClient = document.querySelector(".optionsClient");

  if ((contentOptionsGoods.style.display = "none")) {
    contentOptionsGoods.style.display = "flex";
  }
  if ((contentOptionsGoods.style.display = "flex")) {
    contentOptionsClient.style.display = "none";
  }
});

const buttonOutStart = document.querySelector(".material-symbols-outlined");
buttonOutStart.addEventListener("click", () => {
  window.location.href = "main.html";
});

const buttonRegisterGoods = document.querySelector(".registerGoods");
buttonRegisterGoods.addEventListener("click", () => {
  const registerBens = document.querySelector(".showContentBens");
  const contentOptions = document.querySelector(".optionsBens");

  if ((contentOptions.style.display = "flex")) {
    contentOptions.style.display = "none";
    registerBens.style.display = "flex";
  }
});

const buttonListGoods = document.querySelector(".listGoods");
buttonListGoods.addEventListener("click", () => {
  const listingGoods = document.querySelector(".pageListingBens");
  const contentOptions = document.querySelector(".optionsBens");
  if ((listingGoods.style.display = "none")) {
    listingGoods.style.display = "flex";
    contentOptions.style.display = "none";
  }
});

const buttonOutGoods = document.querySelector(".btnOut");
buttonOutGoods.addEventListener("click", () => {
  const ContentBens = document.querySelector(".showContentBens");
  if ((ContentBens.style.display = "flex")) {
    return (ContentBens.style.display = "none");
  }
});
function toCurretBug() {
  const ContentBens = document.querySelector(".showContentBens");
  const contentOptions = document.querySelector(".optionsBens");
  if ((ContentBens.style.display = "flex")) {
    contentOptions.style.display = "none";
  }
}

// button client
const buttonStartCadClient = document.querySelector(".btnCadClie");
buttonStartCadClient.addEventListener("click", () => {
  const contentOptionsClient = document.querySelector(".optionsClient");
  const contentOptionsGoods = document.querySelector(".optionsBens");
  if ((contentOptionsClient.style.display = "none")) {
    contentOptionsClient.style.display = "flex";
  }
  if ((contentOptionsClient.style.display = "flex")) {
    contentOptionsGoods.style.display = "none";
  }
});
const registerClient = document.querySelector(".registerClient");
registerClient.addEventListener("click", () => {
  const screenRegisterClient = document.querySelector(".showContentClient");
  const contentOptionsClient = document.querySelector(".optionsClient");

  if ((screenRegisterClient.style.display = "none")) {
    screenRegisterClient.style.display = "flex";
    contentOptionsClient.style.display = "none";
  }
});

// fazer o cadastro do item
const formRegister = document.querySelector("#formRegisterBens")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {

      await fetch("/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      }).then((response) => {
        if (response.ok) {
            Toastify({
                text: 'Bem cadastrado com sucesso!',
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'right',
                backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
            }).showToast();

            document.querySelector('#formRegisterBens').reset();
          console.log("deu certo", response);

        } else {
            Toastify({
                text: 'Erro ao cadastrar bem!',
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'right',
                backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
            }).showToast();

          console.log("deu ruim");
        }
      });
    } catch (error) {
      console.log("erro no envio", error);
    }
  });

  // fazendo a listagem

  async function fetchBens() {
    try {
      const response = await fetch('/listbens'); // Faz uma requisição GET para a rota /api/bens
      const bens = await response.json(); // Converte a resposta para JSON
       
      const bensListDiv = document.querySelector('.listingBens')  // Obtém a div onde os bens serão exibidos
      bensListDiv.innerHTML = '';

      if (bens.length > 0) {
        // Se houver bens, percorre cada bem e cria um novo elemento para exibir
        bens.forEach(bem => {
          const bemItem = document.createElement('div');
          bemItem.className = 'bem-item';
          bemItem.classList.add('bem-item',)
          bemItem.innerHTML = `
           <p><strong>Codigo:</strong> ${bem.benscode}</p>
            <p><strong>Nome:</strong> ${bem.bensnome}</p>
            <p><strong>Code Fabricante:</strong> ${bem.benscofa}</p>
            <p><strong>Modelo:</strong> ${bem.bensmode}</p>
            <p><strong>Numero de serie:</strong> ${bem.bensnuse}</p>
            <p><strong>Placa:</strong> ${bem.bensplac}</p>
            <p><strong>Anmo:</strong> ${bem.bensanmo}</p>
            <p><strong>Data da compra:</strong> ${bem.bensdtcp}</p>
            <p><strong>Nota fiscal:</strong> ${bem.bensnunf}</p>
            <p><strong>Codigo do fornecedor:</strong> ${bem.benscofo}</p>
            <p><strong>Km Atual:</strong> ${bem.benskmat}</p>
            <p><strong>Data do km:</strong> ${bem.bensdtkm}</p>
            <p><strong>Status:</strong> ${bem.bensstat}</p>
            <p><strong>Data do status:</strong> ${bem.bensdtus}</p>
            <p><strong>Hora status:</strong> ${bem.benshrus}</p>
            <p><strong>Chassi:</strong> ${bem.bensnuch}</p>
            <p><strong>Cor:</strong> ${bem.benscore}</p>
            <p><strong>Numo:</strong> ${bem.bensnumo}</p>
            <p><strong>Renavam:</strong> ${bem.bensrena}</p>
            <p><strong>Ctep:</strong> ${bem.bensctep}</p>
            <p><strong>Ativo:</strong> ${bem.bensativ}</p>
            <p><strong>Alugado:</strong> ${bem.bensalug}</p>
            <p><strong>Valor:</strong> ${bem.bensvaal}</p>
            <p><strong>Fabricante:</strong> ${bem.bensfabr}</p>
          `;
          bensListDiv.appendChild(bemItem);  // Adiciona o item de bem na div
        });

      } else {
        // Se não houver bens, exibe uma mensagem
        bensListDiv.innerHTML = '<p>Nenhum bem cadastrado.</p>';
      }
    } catch (error) {
      console.error("Erro ao carregar bens:", error);
      document.getElementById('bensList').innerHTML = '<p>Erro ao carregar bens.</p>';
    }
  }
  // Chama a função de fetchBens assim que a página carregar
  fetchBens();
