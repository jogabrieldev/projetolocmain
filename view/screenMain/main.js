function isDataValida(data) {
  const date = new Date(data);
  const ano = date.getFullYear();

  return (
    !isNaN(date.getTime()) && // Verifica se o Date é válido
    ano >= 1950 && ano <= 2030 // Define limites plausíveis para ano
  );
}




function validLocationHours(){
   const socket = io()

   socket.on("locacaoPendenteHaMaisDe1h", ({ numero, clloid, desde }) => {
  Toastify({
    text: `⚠️ Locação #${numero} está pendente há mais de 1h! desde:${desde}`,
    duration: 6000,
    close: true,
    gravity: "top",
    position: "center",
    backgroundColor: "orange",
  }).showToast();

  console.warn(`Locação ${numero} (ID ${clloid}) pendente desde ${(desde)}`);
});
}


function isDataVencimento(data) {
  const date = new Date(data);
  const ano = date.getFullYear();

  return (
    !isNaN(date.getTime()) && 
    ano >= 2025 && ano <= 2050 
  );
}

async function loadSelectOptions(url, selectId, fieldName) {
  const token = localStorage.getItem("token");

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
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();

    const data = Array.isArray(result) ? result : result.data;

    if (!Array.isArray(data)) {
      throw new Error(
        `Formato de dados inesperado de ${url}: ` + JSON.stringify(result)
      );
    }

    const select = document.getElementById(selectId);
    if (!select) {
      throw new Error(`Elemento select com ID '${selectId}' não encontrado.`);
    }

    data.forEach((item) => {
      // Debug
      if (!item.hasOwnProperty(fieldName)) {
        console.warn(`Campo '${fieldName}' não encontrado em`, item);
        return;
      }

      const option = document.createElement("option");
      option.value = item[fieldName];
      option.textContent = item[fieldName];

      if (item.hasOwnProperty("fabedesc")) {
    option.dataset.desc = item.fabedesc;
    }
      select.appendChild(option);
    });
  } catch (error) {
    console.error(`Erro ao carregar os dados para ${selectId}:`, error);
  }
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

function formatarCampo(tipo, valor) {
  if (!valor) return "";

  switch (tipo) {
    case "documento":
      if (valor.length === 11) {
        // CPF
        return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      } else if (valor.length === 14) {
        // CNPJ
        return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
      } else {
        return valor; // Se não for CPF nem CNPJ
      }

    case "cep":
      if (valor.length === 8) {
        return valor.replace(/(\d{5})(\d{3})/, "$1-$2");
      } else {
        return valor;
      }

  case "telefone":
    if (valor.length === 10) {
    // Se vier com 10 dígitos, adiciona o 9 depois do DDD
    // Exemplo: 6299999999 → (62) 9 9999-9999
    valor = valor.replace(/(\d{2})(\d{4})(\d{4})/, "$1$2$3"); // Junta tudo
    valor = valor.replace(/(\d{2})(\d{8})/, "$1" + "9" + "$2"); // Insere o 9 depois do DDD
   }

   if (valor.length === 11) {
    // Formata o número com o DDD e o 9
    return valor.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4");
   }

  return valor;

    default:
      return valor;
  }
};



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
     "#btnLoadBens, .btnCadClie, .btnCadForn, .btnCadProd, .btnCadFabri, .btnCadTypeProd, .btnCadMotorista, .btnCadAutomo, .btnRegisterLocation, .btnLogistic, .delivery , .btnDevolution" , "containerAppDestination"
   );

   buttons.forEach((btn) => {
     btn.addEventListener("click", () => {
       hideWelcome();
     });
   });
 });


