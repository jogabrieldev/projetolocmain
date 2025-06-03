function isDataValida(data) {
  const date = new Date(data);
  const ano = date.getFullYear();

  return (
    !isNaN(date.getTime()) && // Verifica se o Date é válido
    ano >= 1960 && ano <= 2027 // Define limites plausíveis para ano
  );
}

function isDataVencimento(data) {
  const date = new Date(data);
  const ano = date.getFullYear();

  return (
    !isNaN(date.getTime()) && 
    ano >= 2025 && ano <= 2035 
  );
}

function validarPrecoLiquidoMenorOuIgual(precoLiquido, precoBruto) {
  const valorLiquido = parseFloat(precoLiquido);
  const valorBruto = parseFloat(precoBruto);

  if (isNaN(valorLiquido) || isNaN(valorBruto)) {
    console.warn("Valores inválidos informados para validação de preços.");
    return false;
  }
  return valorLiquido <= valorBruto;
}

function formatDateInput(dataISO) {
  if (!dataISO) return "";
  const data = new Date(dataISO);
  const offset = data.getTimezoneOffset();
  data.setMinutes(data.getMinutes() - offset); 
  return data.toISOString().split("T")[0];
}

function parseDataLocal(dataStr) {
  const [ano, mes, dia] = dataStr.split("-").map(Number);
  return new Date(ano, mes - 1, dia); // mês é zero-based
}

const buttonOutStart = document.querySelector(".material-symbols-outlined");
buttonOutStart.addEventListener("click", () => {
  window.location.reload()
});

const btnStartRegister = document.getElementById('btnStartRegister');

if (btnStartRegister) {
  const menuButton = document.querySelector('#cadastrosMenu');
  const collapse = new bootstrap.Collapse(menuButton, {
    toggle: false
  });

  const outrosBotoes = [
    document.querySelector('.btnRegisterLocation'),
    document.querySelector('.btnLogistic'),
    document.querySelector('.delivery'),
    document.querySelector('.btnDevolution')
  ];

  let menuAberto = false;

  btnStartRegister.addEventListener('click', () => {
    menuAberto = !menuAberto;

    if (menuAberto) {
      collapse.show();
      outrosBotoes.forEach(el => el?.classList.add('d-none'));
    } else {
      collapse.hide();
      outrosBotoes.forEach(el => el?.classList.remove('d-none'));
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
   const mainContent = document.getElementById("mainContent");

   function showWelcome() {
     const animationHTML = `
       <section id="welcomeAnimation" class="welcome-container text-white">
         <div class="text-center animate__animated animate__fadeInDown">
           <svg width="100" height="100" viewBox="0 0 24 24" fill="none"
             stroke="#00d1ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             class="mb-4 animate__animated animate__pulse animate__infinite">
             <path d="M20 6L9 17l-5-5" />
           </svg>
           <h1 class="fw-bold mb-3 typewriter">Bem-vindo ao sistema SGTTEC!</h1>
           
         </div>
       </section>
     `;
     mainContent.innerHTML = animationHTML;
   }

   function hideWelcome() {
     const welcome = document.getElementById("welcomeAnimation");
     if (welcome) {
       welcome.classList.add("hidden");
     }
   }

   // Mostra após login
   showWelcome();

   // Oculta ao clicar em qualquer botão de navegação
   const buttons = document.querySelectorAll(
     "#btnLoadBens, .btnCadClie, .btnCadForn, .btnCadProd, .btnCadFabri, .btnCadTypeProd, .btnCadMotorista, .btnCadAutomo, .btnRegisterLocation, .btnLogistic, .delivery , .btnDevolution"
   );

   buttons.forEach((btn) => {
     btn.addEventListener("click", () => {
       hideWelcome();
     });
   });
 });

//  document.addEventListener("click", async function (e) {
//   const target = e.target;

//   // Botão Bens
//   if (target.closest(".btnLoadBens")) {
//     e.preventDefault();
//     await loadingSectionGoods();
//     return;
//   }

//   // Cliente com CPF
//   if (target.closest(".btnCadClie")) {
//     e.preventDefault();
//     await loadingSectionClient();
//     return;
//   }

//   // Fornecedor
//   if (target.closest(".btnCadForn")) {
//     e.preventDefault();
//     await carregarFornecedor();
//     return;
//   }

//   // Produto
//   if (target.closest(".btnCadProd")) {
//     e.preventDefault();
//     await carregarProduto();
//     return;
//   }

//   // Família de Bens
//   if (target.closest(".btnCadFabri")) {
//     e.preventDefault();
//     await carregarFamiliaBens();
//     return;
//   }

//   // Tipo do Produto
//   if (target.closest(".btnCadTypeProd")) {
//     e.preventDefault();
//     await carregarTipoProduto();
//     return;
//   }

//   // Motorista
//   if (target.closest(".btnCadMotorista")) {
//     e.preventDefault();
//     await carregarMotorista();
//     return;
//   }

//   // Veículos
//   if (target.closest(".btnCadAutomo")) {
//     e.preventDefault();
//     await carregarVeiculos();
//     return;
//   }

//   // Locação
//   if (target.closest(".btnRegisterLocation")) {
//     e.preventDefault();
//     await carregarLocacao();
//     return;
//   }

//   // Logística
//   if (target.closest(".btnLogistic")) {
//     e.preventDefault();
//     locationPendente();
//     return;
//   }

//   // Entrega
//   if (target.closest(".delivery")) {
//     e.preventDefault();
//     await carregarEntrega();
//     return;
//   }

//   // Devoluções
//   if (target.closest(".btnDevolution")) {
//     e.preventDefault();
//     await carregarDevolucao();
//     return;
//   }
// });

