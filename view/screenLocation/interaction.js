document.querySelector(".btnCadBens").style.display = "none";
document.querySelector(".btnCadClie").style.display = "none";
document.querySelector(".btnCadForn").style.display = "none";
document.querySelector(".btnCadProd").style.display = "none";
document.querySelector(".btnCadFabri").style.display = "none";
document.querySelector(".btnCadTypeProd").style.display = "none";
document.querySelector(".btnCadMotorista").style.display = "none";

const btnAtivRegister = document.querySelector(".btnAtivRegister");
btnAtivRegister.addEventListener("click", () => {
  const informative = document.querySelector(".information");
  informative.style.display = "block";
  informative.textContent = "SEÇÃO CADASTROS";

  document.querySelector(".btnCadBens").style.display = "flex";
  document.querySelector(".btnCadClie").style.display = "flex";
  document.querySelector(".btnCadForn").style.display = "flex";
  document.querySelector(".btnCadProd").style.display = "flex";
  document.querySelector(".btnCadFabri").style.display = "flex";
  document.querySelector(".btnCadTypeProd").style.display = "flex";
  document.querySelector(".btnCadMotorista").style.display = "flex";

  //none
  document.querySelector(".btnRegisterLocation").style.display = "none";
  document.querySelector(".containerAppLocation").style.display = "none";
});

const btnLocation = document.querySelector(".btnRegisterLocation");
btnLocation.addEventListener("click", () => {
  const informative = document.querySelector(".information");
  informative.style.display = "block";
  informative.textContent = "SEÇÃO LOCAÇÃO";

  const containerAppLocation = document.querySelector(".containerAppLocation");
  containerAppLocation.style.display = "flex";
});

const locBtnRegisterClient = document.querySelector(".locCadClient");
locBtnRegisterClient.addEventListener("click", (event) => {
  event.preventDefault();

  const LocRegisterClient = document.querySelector(".LocRegisterClient");
  LocRegisterClient.style.display = "flex";

  const familyBens = document.querySelector(".familyBens");
  familyBens.style.display = "none";

  const informationClient = document.querySelector(".informationClient");
  informationClient.style.display = "none";
});

const btnOutInitLoc = document.querySelector(".btnOutInitLoc");
btnOutInitLoc.addEventListener("click", (event) => {
  event.preventDefault();

  const LocRegisterClient = document.querySelector(".LocRegisterClient");
  LocRegisterClient.style.display = "none";

  const familyBens = document.querySelector(".familyBens");
  familyBens.style.display = "block";

  const informationClient = document.querySelector(".informationClient");
  informationClient.style.display = "flex";
});

// buscar cliente
const searchClient = document.querySelector("#search");
searchClient.addEventListener("click", async (event) => {
  event.preventDefault();
  const inputSearchClient = document.querySelector("#client").value.trim();

  try {
    const response = await fetch("/api/listclient");

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const clientes = await response.json();

    const clienteEncontrado = clientes.find(
      (cliente) => cliente.clienome === inputSearchClient
    );
    const clienteEncontradoCpf = clientes.find(
      (cliente) => cliente.cliecpf === inputSearchClient
    );

    const clientGeral = clienteEncontrado || clienteEncontradoCpf;

    if (clientGeral) {
      console.log("Cliente encontrado:", clientGeral);

      Toastify({
        text: `Cliente "${inputSearchClient}" encontrado com sucesso!`,
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();

      const informationClientDiv = document.querySelector(".informationClient");
      informationClientDiv.style.display = "flex";
      informationClientDiv.innerHTML = "";

      const table = document.createElement("table");
      table.style.borderCollapse = "collapse";
      table.style.width = "100%";

      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      ["Nome", "CPF", "Data de Cadastro"].forEach((headerText) => {
        const th = document.createElement("th");
        th.textContent = headerText;
        th.style.border = "1px solid #ccc";
        th.style.padding = "";
        th.style.textAlign = "left";
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      const tbody = document.createElement("tbody");
      const dataRow = document.createElement("tr");

      // Preencher dados do cliente
      [clientGeral.clienome, clientGeral.cliecpf, clientGeral.cliedtcd].forEach(
        (cellData) => {
          const td = document.createElement("td");
          td.textContent = cellData;
          td.style.border = "1px solid #ccc";
          td.style.padding = "8px";

          dataRow.appendChild(td);
        }
      );

      tbody.appendChild(dataRow);
      table.appendChild(tbody);

      informationClientDiv.appendChild(table);

      setTimeout(() => {
        if (table) {
          table.remove();
        }
      }, 5000);
      return;
    } else {
      console.log("Cliente não encontrado");
      Toastify({
        text: `Cliente "${inputSearchClient}" não encontrado.`,
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
    }
  } catch (error) {
    console.error("Erro ao validar o cliente:", error);
    alert("Erro ao validar o cliente. Tente novamente mais tarde.");
  }
});

//Carregamento do codigo do ben
// async function carregarCodigosBens() {
//   try {
//     const response = await fetch("/api/codefamilybens");
//     if (!response.ok) {
//       throw new Error("Erro ao carregar os códigos dos bens.");
//     }
//     const bens = await response.json();

//     const select = document.querySelectorAll("[id^='codeBen']");
//     select.innerHTML = ""; // Limpar opções existentes
     
//     select.forEach((select) => {
//       select.innerHTML = "";
//     bens.forEach((bem) => {
//       const option = document.createElement("option");
//       option.value = bem.fabecode;
//       option.textContent = `${bem.fabecode}`;
//       select.appendChild(option);
//     });
//   })
//   } catch (error) {
//     console.error("Erro ao carregar códigos dos bens:", error);
//     alert("Erro ao carregar códigos dos bens.");
//   }
// }
// document.addEventListener("DOMContentLoaded", carregarCodigosBens);

// PROCESSO DE LOCAÇÃO
// async function handleSubmit(event) {

//   event.preventDefault()

 
//   const totalGrups = 3
//   const groups = [];


   
//     console.log( ' Esse e meu total:',totalGrups)
 


//  for (let i = 1; i <=  totalGrups; i++) {
//    const codeBen = document.getElementById(`codeBen${i}`)?.value;
//    const produto = document.getElementById(`produto${i}`)?.value;
//    const quantidade = document.getElementById(`quantidade${i}`)?.value;
//    const descricao = document.getElementById(`descricao${i}`)?.value;

//    if (codeBen && produto && quantidade && descricao) {
//      groups.push({ codeBen, produto, quantidade, descricao });
//    }
//  }

//  if (groups.length === 0) {
//    alert("Por favor, preencha pelo menos um grupo completo.");
//    return;
//  }

//  console.log("Grupos preenchidos:", groups);

//  // Enviar os dados ao backend
//  try {
//    const response = await fetch("/api/locacoes", {
//      method: "POST",
//      headers: { "Content-Type": "application/json" },
//      body: JSON.stringify(groups),
//    });

//    const result = await response.json();
//    console.log("Dados enviados:", result);


//    if (response.ok) {
//     alert("Dados cadastrados com sucesso!");
//   } else {
//     alert("Erro ao cadastrar dados: " + result.error);
//   }
// } catch (error) {
//   console.error("Erro ao enviar os dados:", error);
//   alert("Erro ao enviar os dados.");
// }
  
//   const userClientValidade = document.querySelector("#numCpf").value;
//   const client = document.getElementById("client").value;
//   const dataLoc = document.getElementById("dataLoc").value;
//   const dataDevo = document.getElementById("DataDevo").value;
//   const horaLoc = document.getElementById("horaLoc").value;
//   const pagament = document.getElementById("pagament").value;

//   const payload = {
//     userClientValidade,
//     dataLoc,
//     dataDevo,
//     horaLoc,
//     pagament,
    
//   };
//   console.log(payload)


//   try {
//     // Enviar os dados ao backend
//     const response = await fetch("/api/locacoes", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     const data = await response.json();
//     console.log(data);
//   } catch (error) {
//     console.error("erro no fetch que envia loc para database:", error);
//   }

//   try {
//     const response = await fetch("/api/listclient");
//     if (!response.ok) {
//       throw new Error("Erro ao buscar dados dos clientes.");
//     }

//     const clients = await response.json();
//     const isCPFRegistered = clients.find(
//       (client) => client.cliecpf === userClientValidade
//     );

//     if (isCPFRegistered) {
//       const clientName = isCPFRegistered.clienome;

//       Toastify({
//         text: `Contrato de locação gerado`,
//         duration: 4000,
//         close: true,
//         gravity: "top",
//         position: "center",
//         backgroundColor: "green",
//       }).showToast();

    
//     } else {
//       Toastify({
//         text: `Usuário não cadastrado`,
//         duration: 2000,
//         close: true,
//         gravity: "top",
//         position: "center",
//         backgroundColor: "red",
//       }).showToast();
//     }
//   } catch (error) {
//     console.error("Erro ao validar CPF:", error);
//     alert("Ocorreu um erro ao validar o CPF. Tente novamente mais tarde.");
//   }
// }

async function carregarFamilias() {
  try {
    const response = await fetch("/api/codefamilybens");
    if (!response.ok) {
      throw new Error("Erro ao buscar famílias de bens");
    }

    const familias = await response.json();

    for (let i = 1; i <= 3; i++) {
      const select = document.getElementById(`family${i}`);
      familias.forEach(({ fabecode }) => {
        const option = document.createElement("option");
        option.value = fabecode;
        option.textContent = fabecode;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Erro ao carregar famílias de bens:", error);
    alert("Erro ao carregar famílias de bens. Tente novamente mais tarde.");
  }
}

// Chama a função ao carregar a página
document.addEventListener("DOMContentLoaded", carregarFamilias);

async function handleSubmit(event) {
  event.preventDefault();

  const totalGrups = 3;
  const groups = [];

  // Capturar dados dos grupos
  for (let i = 1; i <= totalGrups; i++) {
    const codeBen = document.getElementById(`family${i}`)?.value;
    const produto = document.getElementById(`produto${i}`)?.value;
    const quantidade = document.getElementById(`quantidade${i}`)?.value;
    const descricao = document.getElementById(`descricao${i}`)?.value;

    console.log(`Dados do grupo ${i}:`, { codeBen, produto, quantidade, descricao });

    if (codeBen && produto && quantidade && descricao) {
      groups.push({ codeBen, produto, quantidade, descricao });
    }
  }

  if (groups.length === 0) {
    console.error("Nenhum grupo válido foi preenchido.");
    alert("Preencha ao menos um grupo corretamente.");
    return;
  }

  // console.log("Grupos preenchidos:", groups);

  const result = await fetch("/api/locBens" , {
    method: "POST",
    headers:{
      "Content-Type": "application/json"
    },
    body: JSON.stringify({groups})
  })
   if(result.ok){
    console.log('bens enviados com sucesso!! ')
   }

  try {
  

    // Enviar dados do cliente
    const userClientValidade = document.querySelector("#numCpf")?.value || null;
    const dataLoc = document.getElementById("dataLoc")?.value || null;
    const dataDevo = document.getElementById("DataDevo")?.value || null;
    const horaLoc = document.getElementById("horaLoc")?.value || null;
    const pagament = document.getElementById("pagament")?.value || null;

    const payload = {
      userClientValidade,
      dataLoc,
      dataDevo,
      horaLoc,
      pagament,
      groups
    }

    console.log("Payload completo enviado:", payload);

    const response = await fetch("/api/locacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload )
    });

    // const result = await response.json();

    // console.log("Resposta do backend para locação:", result);

    if (response.ok) {
      Toastify({
        text: "Contrato de locação gerado com sucesso!",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();
     
    } else {
      Toastify({
        text: "Erro na locaçao : " + result.error || "Erro desconhecido.",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
    
    }
  } catch (error) {

    console.error("Erro ao enviar os dados:", error);
    Toastify({
      text: "Erro ao enviar os dados verifique conexão",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
  }
}






// formulario da tela de locação caso o cliente não tenha cadastro

const formRegisterClientLoc = document.querySelector("#formRegisterClientLoc");
formRegisterClientLoc.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  if (
    Object.keys(data).length === 0 ||
    Object.values(data).some((val) => val === "")
  ) {
    console.log("Formulario Vazio");
    Toastify({
      text: "Por favor, preencha o formulário antes de enviar.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return;
  }

  try {
    await fetch("/api/client/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.ok) {
        console.log("deu certo");

        Toastify({
          text: "Cadastrado com Sucesso",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();

        document.querySelector("#formRegisterClientLoc").reset();
      } else {
        console.log("deu erro viu");

        Toastify({
          text: "Erro no cadastro",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
      }
    });
  } catch (error) {
    console.error("deu erro no envio", error);
  }
});
