const btnInitCadDrive = document.querySelector(".btnCadMotorista");
btnInitCadDrive.addEventListener("click", () => {

  const containerAppFabri = document.querySelector(".containerAppFabri");
  containerAppFabri.style.display = "none";

  const containerAppClient = document.querySelector(".containerAppClient");
  containerAppClient.style.display = "none";

  const containerAppBens = document.querySelector(".containerAppBens");
  containerAppBens.style.display = "none";

  const containerAppForn = document.querySelector(".containerAppForn");
  containerAppForn.style.display = "none";

  const containerAppProd = document.querySelector(".containerAppProd");
  containerAppProd.style.display = "none";

  const containerAppTypeProd = document.querySelector(".containerAppTipoProd");
  containerAppTypeProd.style.display = "none";

  const containerForm = document.querySelector(".RegisterDriver");
  containerForm.style.display = "none";

   const containerAppAutomo = document.querySelector('.containerAppAutomo')
      containerAppAutomo.style.display = 'none'

  const containerFormEditDriver = document.querySelector(".containerFormEditDriver");
  containerFormEditDriver.style.display = "none";

  const containerAppDriver = document.querySelector(".containerAppDriver");
  containerAppDriver.style.display = "flex";

  const listingDrive = document.querySelector(".listingDriver");
  listingDrive.style.display = "flex";

  const btnMainPage = document.querySelector(".btnInitPageMain");
  btnMainPage.style.display = "flex";

  const informative = document.querySelector(".information");
  informative.style.display = "block";
  informative.textContent = "SEÇÃO MOTORISTA";
});

const registerDriver = document.querySelector(".registerDriver");
registerDriver.addEventListener("click", () => {

  const formRegisterDriver = document.querySelector(".RegisterDriver");
  formRegisterDriver.style.display = "flex";

  const listingDriver = document.querySelector(".listingDriver");
  listingDriver.style.display = "none";

  const btnPageMain = document.querySelector(".btnInitPageMain");
  btnPageMain.style.display = "none";
});

const btnOutSectionDriver = document.querySelector('.buttonExitDriver')
btnOutSectionDriver.addEventListener('click', ()=>{

  const containerAppDriver = document.querySelector(".containerAppDriver");
  containerAppDriver.style.display = "none";

})

const btnOutPageDrive = document.querySelector(".btnOutPageRegister");
btnOutPageDrive.addEventListener("click", (event) => {
  event.preventDefault();

  const formRegisterDriver = document.querySelector(".RegisterDriver");
  formRegisterDriver.style.display = "none";

  const listingDriver = document.querySelector(".listingDriver");
  listingDriver.style.display = "flex";

  const btnPageMain = document.querySelector(".btnInitPageMain");
  btnPageMain.style.display = "flex";
});

const btnOutformPageEdit = document.querySelector('.btnOutPageRegisterEdit')
btnOutformPageEdit.addEventListener('click' , (event)=>{
    event.preventDefault()

    const containerFormEditDriver = document.querySelector('.containerFormEditDriver')
    containerFormEditDriver.style.display = 'none'

    const listingDriver = document.querySelector(".listingDriver");
    listingDriver.style.display = "flex";

    const btnPageMain = document.querySelector(".btnInitPageMain");
     btnPageMain.style.display = "flex";
});

function isTokenExpired(token) {
  try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expTime = payload.exp * 1000; 
      return Date.now() > expTime; 
  } catch (error) {
      return true; 
  }
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.cadDriver').addEventListener('click', async (event) => {
      event.preventDefault(); // Evita recarregar a página

      const token = localStorage.getItem('token'); // Recupera o token armazenado

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

      if (!$('.formRegisterDriver').valid()) {
        return;
    }

      // Captura os valores do formulário
      const formData = {
          motoCode: document.querySelector('#motoCode').value,     // Código
          motoNome: document.querySelector('#motoNome').value,     // Nome
          motoDtnc: document.querySelector('#motoDtnc').value,     // Data de nascimento
          motoCpf: document.querySelector('#motoCpf').value,       // CPF
          motoDtch: document.querySelector('#motoDtch').value,     // Data de emissão da CNH
          motoctch: document.querySelector('#motoctch').value,     // Categoria da CNH
          motoDtvc: document.querySelector('#motoDtvc').value,     // Data de vencimento
          motoRest: document.querySelector('#motoRest').value,     // Restrições
          motoOrem: document.querySelector('#motoOrem').value,     // Órgão emissor
          motoCelu: document.querySelector('#motoCelu').value,     // Celular
          motoCep: document.querySelector('#motoCep').value,       // CEP
          motoRua: document.querySelector('#motoRua').value,       // Rua
          motoCity: document.querySelector('#motoCity').value,     // Cidade
          motoEstd: document.querySelector('#motoEstd').value,     // Estado
          motoMail: document.querySelector('#motoMail').value,      // E-mail
          motoStat: document.querySelector("#motoStat").value
      };

      try {
          const response = await fetch('http://localhost:3000/api/drive/submit', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(formData)
          });

          const result = await response.json();

          if (response.ok) {
              Toastify({
                  text: "Motorista cadastrado com sucesso!",
                  duration: 3000,
                  close: true,
                  gravity: "top",
                  position: "center",
                  backgroundColor: "green",
              }).showToast();

              // Limpar o formulário após o sucesso
              document.querySelector('.formRegisterDriver').reset();
          } else {
              alert(`Erro: ${result.message}`);
          }
      } catch (error) {
          console.error('Erro ao enviar formulário:', error);
          alert('Erro ao enviar os dados.');
      }
  });
  validationFormMoto()
});


//listagem de motorista

async function fetchListMotorista() {

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
    const response = await fetch("/api/listingdriver" , {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    });
    const motorista = await response.json();

    const motoristaListDiv = document.querySelector(".listingDriver");
    motoristaListDiv.innerHTML = "";

    if (motorista.length > 0) {
      const tabela = document.createElement("table");
      tabela.style.width = "100%";
      tabela.setAttribute("border", "1");

      const cabecalho = tabela.createTHead();
      const linhaCabecalho = cabecalho.insertRow();
      const colunas = [
        "Selecionar",
        "Código",
        "status",
        "Nome",
        "Data de Nascimento",
        "CPF",
        "Data de Emisão",
        "Categoria da CNH",
        "Data de vencimento",
        "Restrições",
        "Orgão Emissor",
        "Celular",
        "CEP",
        "Rua",
        "Cidade",
        "Estado",
        "E-mail",
         
      ];

      colunas.forEach((coluna) => {
        const th = document.createElement("th");
        th.textContent = coluna;
        linhaCabecalho.appendChild(th);
      });

      const corpo = tabela.createTBody();
      motorista.forEach((motorista) => {
        const linha = corpo.insertRow();

        linha.setAttribute("data-motocode", motorista.motocode);

        const checkboxCell = linha.insertCell();
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "selectDriver";
        checkbox.value = motorista.motocode;

        const motoristaData = JSON.stringify(motorista);
        if (motoristaData) {
          checkbox.dataset.motorista = motoristaData;
        } else {
          console.warn(`Fornecedor inválido encontrado:`, motorista);
        }

        checkboxCell.appendChild(checkbox);

        const formatDate = (isoDate) => {
          if (!isoDate) return "";
          const dateObj = new Date(isoDate);
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, "0");
          const day = String(dateObj.getDate()).padStart(2, "0");
          return `${year}/${month}/${day}`;
        };

        linha.insertCell().textContent = motorista.motocode;
        const statusCell = linha.insertCell();
        statusCell.textContent = motorista.motostat;
        statusCell.classList.add("status-moto");
        linha.insertCell().textContent = motorista.motoname;
        linha.insertCell().textContent = formatDate(motorista.motodtnc);
        linha.insertCell().textContent = motorista.motocpf;
        linha.insertCell().textContent = formatDate(motorista.motodtch);
        linha.insertCell().textContent = motorista.motoctch;
        linha.insertCell().textContent = formatDate(motorista.motodtvc);
        linha.insertCell().textContent = motorista.motorest;
        linha.insertCell().textContent = motorista.motoorem;
        linha.insertCell().textContent = motorista.motocelu;
        linha.insertCell().textContent = motorista.motocep;
        linha.insertCell().textContent = motorista.motorua;
        linha.insertCell().textContent = motorista.motocity;
        linha.insertCell().textContent = motorista.motoestd;
        linha.insertCell().textContent = motorista.motomail;
        
      });

      motoristaListDiv.appendChild(tabela);
    } else {
      motoristaListDiv.innerHTML = "<p>Nenhum fornecedor cadastrado.</p>";
    }
  } catch (error) {
    console.error("Erro ao carregar fornecedores:", error);
    document.querySelector(".listingDriver").innerHTML =
      "<p>Erro ao carregar fornecedores.</p>";
  }
}
fetchListMotorista();

//delete motorista

const btnDeleteDriver = document.querySelector(".buttonDeleteDriver");
btnDeleteDriver.addEventListener("click", async () => {
  const selectedCheckbox = document.querySelector(
    'input[name="selectDriver"]:checked'
  );
  if (!selectedCheckbox) {
    Toastify({
      text: "Selecione um Motorista para excluir",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return;
  }

  const MotoristaSelecionado = JSON.parse(selectedCheckbox.dataset.motorista);
  const motoristaId = MotoristaSelecionado.motocode;

  const confirmacao = confirm(
    `Tem certeza de que deseja excluir o Fabricante com código ${motoristaId}?`
  );
  if (!confirmacao) {
    return;
  }

  await deleteDriver(motoristaId, selectedCheckbox.closest("tr"));
});

async function deleteDriver(id, driverRow) {

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
    const response = await fetch(`/api/deletedriver/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    });
    const data = await response.json();
    console.log("Resposta do servidor:", data);

    if (response.ok) {
      Toastify({
        text: "O Cliente foi excluído com sucesso!",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();

      driverRow.remove();
    } else { 
      
      if (response.status === 400) {
        Toastify({
          text: data.message, // Mensagem retornada do backend
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
      }
    else{ 
      console.log("Erro para excluir:", data);
      Toastify({
        text: "Erro na exclusão do Cliente",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();

    }
  }
  } catch (error) {
    console.error("Erro ao excluir Motorista:", error);
    Toastify({
      text: "Erro ao excluir Motorista. Tente novamente.",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
  }
}

// botão de editar
const btnFormEditDrive = document.querySelector(".buttonEditDriver");
btnFormEditDrive.addEventListener("click", () => {
  const selectedCheckbox = document.querySelector(
    'input[name="selectDriver"]:checked'
  );

  if (!selectedCheckbox) {
    Toastify({
      text: "Selecione um Motorista para editar",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return;
  }

  const motoristaData = selectedCheckbox.dataset.motorista;
  if (!motoristaData) {
    console.error("O atributo data-motocode está vazio ou indefinido.");
    return;
  }

  try {
    const motoristaSelecionado = JSON.parse(motoristaData);
    // console.log("Editar item:", fabricanteSelecionado);
       
    console.log('Motorista:' ,motoristaSelecionado)
    // Campos e IDs correspondentes
    const campos = [
      { id: "editMotoCode", valor: motoristaSelecionado.motocode },
      { id: "editMotoNome", valor: motoristaSelecionado.motoname },
      { id: "editMotoDtnc", valor: motoristaSelecionado.motodtnc },
      { id: "editMotoCpf", valor: motoristaSelecionado.motocpf },
      { id: "editMotoDtch", valor: motoristaSelecionado.motodtch },
      { id: "editMotoCtch", valor: motoristaSelecionado.motoctch },
      { id: "editMotoDtvc", valor: motoristaSelecionado.motodtvc },
      { id: "editMotoRest", valor: motoristaSelecionado.motorest },
      { id: "editMotoOrem", valor: motoristaSelecionado.motoorem },
      { id: "editMotoCelu", valor: motoristaSelecionado.motocelu },
      { id: "editMotoCep", valor: motoristaSelecionado.motocep },
      { id: "editMotoRua", valor: motoristaSelecionado.motorua },
      { id: "editMotoCity", valor: motoristaSelecionado.motorua },
      { id: "editMotoEstd", valor: motoristaSelecionado.motoestd },
      { id: "editMotoMail", valor: motoristaSelecionado.motomail },
      {id:"editMotoStat" , valor: motoristaSelecionado.motostat}
    ];

    console.log(campos);

    // Atualizar valores no formulário
    campos.forEach(({ id, valor }) => {
      const elemento = document.getElementById(id);
      if (elemento) {
        if (elemento.type === "date" && valor) {
          // Formata a data para YYYY-MM-DD, caso seja necessário
          const dataFormatada = new Date(valor).toISOString().split('T')[0];
          elemento.value = dataFormatada;
        } else {
          elemento.value = valor || ""; 
        }
        
      } else {
        console.warn(`Elemento com ID '${id}' não encontrado.`);
      }
    });

    // Mostrar o formulário de edição e ocultar a lista
    const spaceEditDriver = document.querySelector(".containerFormEditDriver");
    const btnMainPageDriver = document.querySelector(".btnInitPageMain");
    const listingDriver = document.querySelector(".listingDriver");

    if (spaceEditDriver) {
      spaceEditDriver.style.display = "flex";
    } else {
      console.error("O formulário de edição não foi encontrado.");
    }

    if (listingDriver) {
      listingDriver.style.display = "none";
    } else {
      console.error("A lista de motoristas não foi encontrada.");
    }

    if (btnMainPageDriver) {
      btnMainPageDriver.style.display = "none";
    }
  } catch (error) {
    console.error("Erro ao fazer parse de data-bem:", error);
  }
});

async function editAndUpdateOfDriver() {
  const formEditDrive = document.querySelector(".formEditDriver");

  formEditDrive.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const selectedCheckbox = document.querySelector(
      'input[name="selectDriver"]:checked'
    );

    if (!selectedCheckbox) {
      console.error("Nenhum checkbox foi selecionado.");
      return;
    }

    const motoristaId = selectedCheckbox.dataset.motorista;

    if (!motoristaId) {
      console.error("O atributo data-bem está vazio ou inválido.");
      return;
    }

    let motoIdParsed;
    try {
      motoIdParsed = JSON.parse(motoristaId).motocode;
    } catch (error) {
      console.error("Erro ao fazer parse de bemId:", error);
      return;
    }

  

    const updateDriver = {
      motocode: document.getElementById("editMotoCode").value,
      motoname: document.getElementById("editMotoNome").value,
      motodtnc: document.getElementById("editMotoDtnc").value,
      motocpf: document.getElementById("editMotoCpf").value,
      motodtch: document.getElementById("editMotoDtch").value,
      motoctch: document.getElementById("editMotoCtch").value,
      motodtvc: document.getElementById("editMotoDtvc").value,
      motorest: document.getElementById("editMotoRest").value,
      motoorem: document.getElementById("editMotoOrem").value,
      motocelu: document.getElementById("editMotoCelu").value,
      motocep: document.getElementById("editMotoCep").value,
      motorua: document.getElementById("editMotoRua").value,
      motocity: document.getElementById("editMotoCity").value,
      motoestd: document.getElementById("editMotoEstd").value,
      motomail: document.getElementById("editMotoMail").value,
      motostat: document.getElementById("editMotoStat").value
    };
       
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
      const response = await fetch(`/api/updatemoto/${motoIdParsed}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
        body: JSON.stringify(updateDriver),
      });

      console.log("resposta:", response);

      if (response.ok) {
        console.log("Atualização bem-sucedida");

        Toastify({
          text: `Motorista '${motoIdParsed}' Atualizado com sucesso!!`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();

        
        formEditDrive.reset();
      } else {
        console.error("Erro ao atualizar produto:", await response.text());
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  });
}
editAndUpdateOfDriver();
