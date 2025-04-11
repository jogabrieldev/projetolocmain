
function isTokenExpired(token) {
  try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expTime = payload.exp * 1000; 
      return Date.now() > expTime; 
  } catch (error) {
      return true; 
  }
};
 
function maskFieldDriver(){
     
  $("#motoCpf").mask("000.000.000-00")
      
    $("#motoCelu").mask("(00) 00000-0000");
  
    $("#motoCep").mask("00000-000");

    $("#editMotoCpf").mask("000.000.000-00")
      
    $("#editMotoCelu").mask("(00) 00000-0000");
  
    $("#editMotoCep").mask("00000-000");
}

const sokectDriver = io()
document.addEventListener('DOMContentLoaded' , ()=>{
      
      const btnLoadDriver = document.querySelector('.btnCadMotorista')
      if(btnLoadDriver){
          btnLoadDriver.addEventListener('click' , async(event)=>{
             event.preventDefault()

             try {
              const responseDriver = await fetch('/driver' ,{
                method: 'GET'
              });
              if (!responseDriver.ok) throw new Error(`Erro HTTP: ${responseDriver.status}`);
              const html = await responseDriver.text();
              const mainContent = document.querySelector('#mainContent');
              if (mainContent) {
                mainContent.innerHTML = html;
                maskFieldDriver()
                interationSystemDriver()
                registerNewDriver()
                deleteMotista()
                editDriver()
              }else{
                console.error('#mainContent não encontrado no DOM');
                return;
              }

              const containerAppDriver = document.querySelector('.containerAppDriver');
              if (containerAppDriver) containerAppDriver.classList.add('flex') ;
        
              const sectionsToHide = [
                '.containerAppProd', '.containerAppFabri', '.containerAppFabri',
                '.containerAppTipoProd', '.containerAppAutomo', '.containerAppBens',
                '.containerAppForn'
              ];
              sectionsToHide.forEach((selector) => {
                const element = document.querySelector(selector);
                if (element) element.style.display = 'none';
              });
        
              const containerRegisterDriver = document.querySelector('.RegisterDriver');
              const btnMainPageDriver = document.querySelector('.btnInitPageMain');
              const listingDrive = document.querySelector('.listingDriver');
              const editFormClient = document.querySelector('.containerFormEditDriver');
              const informative = document.querySelector('.information');
        
              if (containerRegisterDriver) containerRegisterDriver.style.display = 'none';
              if (btnMainPageDriver) btnMainPageDriver.style.display = 'flex';
              if (listingDrive)listingDrive.style.display = 'flex';
              if (editFormClient) editFormClient.style.display = 'none';
              if (informative) {
                informative.style.display = 'block';
                informative.textContent = 'SEÇÃO MOTORISTA';
              }
              
              await fetchListMotorista()
             } catch (error) {
              Toastify({
                text: "Erro na pagina",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "center",
                backgroundColor: "red",
              }).showToast();

             }
         })
      }

      sokectDriver.on("updateRunTimeDriver", (motorista) => {
    insertDriverTableRunTime(motorista);
    loadingDriver()
  });

  sokectDriver.on("updateRunTimeTableDrive", (updatedDriver) => {
    updateDriverInTableRunTime(updatedDriver)
    loadingDriver()
  });

})


function interationSystemDriver(){

const registerDriver = document.querySelector(".registerDriver");
if(registerDriver){
  registerDriver.addEventListener("click", () => {

    const formRegisterDriver = document.querySelector(".RegisterDriver");
    if(formRegisterDriver){
       formRegisterDriver.classList.remove('hidden')
       formRegisterDriver.classList.add('flex')
    }
  
    const listingDriver = document.querySelector(".listingDriver");
    if(listingDriver){
      listingDriver.classList.remove('flex')
      listingDriver.classList.add('hidden')
    }
    
  
    const btnPageMain = document.querySelector(".btnInitPageMain");
    if(btnPageMain){
      btnPageMain.classList.remove('flex')
      btnPageMain.classList.add('hidden')
    }
   
  });
}


const btnOutSectionDriver = document.querySelector('.buttonExitDriver')
if(btnOutSectionDriver){
  btnOutSectionDriver.addEventListener('click', ()=>{

    const containerAppDriver = document.querySelector(".containerAppDriver");
    if(containerAppDriver){
      containerAppDriver.classList.remove('flex')
      containerAppDriver.classList.add('hidden')
    }

    const informative = document.querySelector('.information')
    if (informative) {
      informative.style.display = 'block';
      informative.textContent = 'Sessão ativa';
    }
  
  })
}


const btnOutPageDrive = document.querySelector(".btnOutPageRegister");
if(btnOutPageDrive){
  btnOutPageDrive.addEventListener("click", (event) => {
    event.preventDefault();
  
    const formRegisterDriver = document.querySelector(".RegisterDriver");
    if(formRegisterDriver){
      formRegisterDriver.classList.remove('flex')
      formRegisterDriver.classList.add('hidden')
    }
   
    const listingDriver = document.querySelector(".listingDriver");
    if(listingDriver){
      listingDriver.classList.remove('hidden')
      listingDriver.classList.add('flex')
    }
  
    const btnPageMain = document.querySelector(".btnInitPageMain");
    if(btnPageMain){
      btnPageMain.classList.remove('hidden')
      btnPageMain.classList.add('flex')
    }
    
  });
  
}

const btnOutformPageEdit = document.querySelector('.btnOutPageRegisterEdit')
if(btnOutformPageEdit){
  btnOutformPageEdit.addEventListener('click' , (event)=>{
    event.preventDefault()

    const containerFormEditDriver = document.querySelector('.containerFormEditDriver')
    if(containerFormEditDriver){
      containerFormEditDriver.classList.remove('flex')
      containerFormEditDriver.classList.add('hidden')
    }
   
    const listingDriver = document.querySelector(".listingDriver");
    if(listingDriver){
       listingDriver.classList.remove('hidden')
       listingDriver.classList.add('flex')
    }
    

    const btnPageMain = document.querySelector(".btnInitPageMain");
    if(btnPageMain){
      btnPageMain.classList.remove('hidden')
      btnPageMain.classList.add('flex')
    }
     
});
}

}

function registerNewDriver(){
      
         document.querySelector('.cadDriver').addEventListener('click', async (event) => {
      event.preventDefault(); 

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

      if (!$('.formRegisterDriver').valid()) {
        return;
    }

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
          } else if(response.status === 409) {
            Toastify({
              text: result.message,
              duration: 3000,
              close: true,
              gravity: "top",
              position: "center",
              backgroundColor: "orange",
            }).showToast();
          }else{
            Toastify({
              text: "Erro no cadastro do motorista",
              duration: 3000,
              close: true,
              gravity: "top",
              position: "center",
              backgroundColor: "red",
            }).showToast();
          }
      } catch (error) {
          console.error('Erro ao enviar formulário:', error);
          alert('Erro ao enviar os dados.');
      }
  });
  validationFormMoto()

}


// ATUALIZAR EM RUNTIME QUANDO INSERIR
function insertDriverTableRunTime(motorista) {
  const motoristaListDiv = document.querySelector(".listingDriver");
  motoristaListDiv.innerHTML = ""; 

  if (motorista.length > 0) {
    const tabela = document.createElement("table");
    tabela.classList.add('tableDriver')

    // Cabeçalho da tabela
    const cabecalho = tabela.createTHead();
    const linhaCabecalho = cabecalho.insertRow();
    const colunas = [
      "Selecionar",
      "Código",
      "Status",
      "Nome",
      "Data de Nascimento",
      "CPF",
      "Data de Emissão",
      "Categoria da CNH",
      "Data de Vencimento",
      "Restrições",
      "Órgão Emissor",
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
    motorista.forEach((driver) => {
      const linha = corpo.insertRow();
      linha.setAttribute("data-motocode", driver.motocode);

      const checkboxCell = linha.insertCell();
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "selectDriver";
      checkbox.value = driver.motocode;
      checkbox.dataset.motorista = JSON.stringify(driver);
      checkboxCell.appendChild(checkbox);

      linha.insertCell().textContent = driver.motocode;
      
      const statusCell = linha.insertCell();
      statusCell.textContent = driver.motostat || "-";
      statusCell.classList.add("status-moto");

      linha.insertCell().textContent = driver.motoname || "-";
      linha.insertCell().textContent = formatDate(driver.motodtnc);
      linha.insertCell().textContent = driver.motocpf || "-";
      linha.insertCell().textContent = formatDate(driver.motodtch);
      linha.insertCell().textContent = driver.motoctch || "-";
      linha.insertCell().textContent = formatDate(driver.motodtvc);
      linha.insertCell().textContent = driver.motorest || "-";
      linha.insertCell().textContent = driver.motoorem || "-";
      linha.insertCell().textContent = driver.motocelu || "-";
      linha.insertCell().textContent = driver.motocep || "-";
      linha.insertCell().textContent = driver.motorua || "-";
      linha.insertCell().textContent = driver.motocity || "-";
      linha.insertCell().textContent = driver.motoestd || "-";
      linha.insertCell().textContent = driver.motomail || "-";
    });

    motoristaListDiv.appendChild(tabela);
  } else {
    motoristaListDiv.innerHTML = "<p>Nenhum motorista cadastrado.</p>";
  }
};

//listagem de motorista
async function fetchListMotorista() {

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
      tabela.classList.add('tableDriver')

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

function deleteMotista(){

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
        const response = await fetch(`/api/deletedriver/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
  
        const data = await response.json();
      
        if (response.ok) {
            Toastify({
                text: "Motorista deletado com sucesso!",
                duration: 2000,
                close: true,
                gravity: "top",
                position: "center",
                backgroundColor: "green",
            }).showToast();
  
            driverRow.remove();
        } else {
            // Caso o status seja 400, 404 ou outro erro do servidor
            let errorMessage = "Erro ao excluir o motorista.";
            
            if (response.status === 400 || response.status === 404) {
                errorMessage = data.message;
            }
  
            Toastify({
                text: errorMessage,
                duration: 3000,
                close: true,
                gravity: "top",
                position: "center",
                backgroundColor: "orange",
            }).showToast();
        }
  
    } catch (error) {
        console.error("Erro ao excluir motorista:", error);
        Toastify({
            text: "Erro ao excluir motorista. Tente novamente.",
            duration: 2000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
        }).showToast();
    }
  };
}

function editDriver(){
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
     

    const btnMainPageDrive = document.querySelector(".btnInitPageMain");
  if( btnMainPageDrive){
    btnMainPageDrive.classList.remove('flex')
    btnMainPageDrive.classList.add('hidden')
  }

  const listDriver = document.querySelector(".listingDriver");
  if(listDriver){
    listDriver.classList.remove('flex')
    listDriver.classList.add('hidden')
  }

   const containerEditForm = document.querySelector('.containerFormEditDriver')
   if(containerEditForm){
      containerEditForm.classList.remove('hidden')
      containerEditForm.classList.add('flex')
   }

    const motoristaData = selectedCheckbox.dataset.motorista;
    if (!motoristaData) {
      console.error("O atributo data-motocode está vazio ou indefinido.");
      return;
    }
  
    try {
      const motoristaSelecionado = JSON.parse(motoristaData);
         
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
        const response = await fetch(`/api/updatemoto/${motoIdParsed}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
          body: JSON.stringify(updateDriver),
        });
  
        if (response.ok) {
  
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
}
// botão de editar


// ATUALIZAÇÃO EM RUNTIME
function updateDriverInTableRunTime(updatedDriver) {
  const row = document.querySelector(`[data-motocode="${updatedDriver.motocode}"]`);

  if (row) {

    row.cells[2].textContent = updatedDriver.motostat || "-"; // Status
    row.cells[3].textContent = updatedDriver.motoname || "-"; // Nome
    row.cells[4].textContent = formatDate(updatedDriver.motodtnc); // Data de Nascimento
    row.cells[5].textContent = updatedDriver.motocpf || "-"; // CPF
    row.cells[6].textContent = formatDate(updatedDriver.motodtch); // Data de Emissão
    row.cells[7].textContent = updatedDriver.motoctch || "-"; // Categoria da CNH
    row.cells[8].textContent = formatDate(updatedDriver.motodtvc); // Data de Vencimento
    row.cells[9].textContent = updatedDriver.motorest || "-"; // Restrições
    row.cells[10].textContent = updatedDriver.motoorem || "-"; // Órgão Emissor
    row.cells[11].textContent = updatedDriver.motocelu || "-"; // Celular
    row.cells[12].textContent = updatedDriver.motocep || "-"; // CEP
    row.cells[13].textContent = updatedDriver.motorua || "-"; // Rua
    row.cells[14].textContent = updatedDriver.motocity || "-"; // Cidade
    row.cells[15].textContent = updatedDriver.motoestd || "-"; // Estado
    row.cells[16].textContent = updatedDriver.motomail || "-"; // E-mail
  }
};
