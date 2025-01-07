const btnCadFabri = document.querySelector('.btnCadFabri')
btnCadFabri.addEventListener('click' , ()=>{

    const containerAppFabri = document.querySelector('.containerAppFabri')
    const containerAppClient = document.querySelector(".containerAppClient");
    const containerAppBens = document.querySelector(".containerAppBens");
    const containerAppForn = document.querySelector(".containerAppForn")
    const containerAppProd = document.querySelector('.containerAppProd')
    const containerAppTypeProd = document.querySelector('.containerAppTipoProd')
    const btnPageInit = document.querySelector('.btnMainPageFabri')
    const formRegisterFabri = document.querySelector('.formRegisterFabri')
     const containerAppDriver = document.querySelector('.containerAppDriver')
    containerAppDriver.style.display = 'none'

    containerAppTypeProd.style.display = 'none'
    containerAppClient.style.display = 'none'
    containerAppBens.style.diplay = 'none'
    containerAppForn.style.display = 'none'
    containerAppProd.style.display = 'none'
    formRegisterFabri.style.display ='none'

    containerAppFabri.style.display = 'flex'
    btnPageInit.style.display = 'flex'
})

const btnPageRegisterFabri = document.querySelector('.registerFabri')
btnPageRegisterFabri.addEventListener('click' ,()=>{

  const formRegisterFabri = document.querySelector('.formRegisterFabri')
  const btnPageInit = document.querySelector('.btnMainPageFabri')
  const listFabricante = document.querySelector('.listingFabri')
  
  listFabricante.style.display = 'none'
  btnPageInit.style.display = 'none'

  formRegisterFabri.style.display = 'flex'
})

const btnOutOfRegister = document.querySelector('.btnOutInitFabri')
btnOutOfRegister.addEventListener('click' , (event)=>{

   event.preventDefault()

   const btnPageInit = document.querySelector('.btnMainPageFabri')
   btnPageInit.style.display = 'flex'

    const listFabricante = document.querySelector('.listingFabri')
    listFabricante.style.display = 'flex'
    

   const containerFormFabriRegister = document.querySelector('.formRegisterFabri')
    containerFormFabriRegister.style.display = 'none'
 
})

const btnOutInitFabriEdit =  document.querySelector('.btnOutInitFabriEdit')
btnOutInitFabriEdit.addEventListener('click' , (event)=>{
   event.preventDefault()

   const btnPageInit = document.querySelector('.btnMainPageFabri')
   btnPageInit.style.display = 'flex'

    const listFabricante = document.querySelector('.listingFabri')
    listFabricante.style.display = 'flex'
    
   const containerFormFabriRegister = document.querySelector('.editFabri')
    containerFormFabriRegister.style.display = 'none'
})

const formRegisterFabricante = document.querySelector('.formRegisterFabricante')
formRegisterFabricante.addEventListener('submit' , async (event)=>{
    event.preventDefault()
    
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

    await fetch('/api/fabri/submit', {
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
    
        document.querySelector(".formRegisterFabricante").reset();
        return;
        
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
    }).catch((error)=>{
      console.error("deu erro no envio", error);
    });
})

// listagem de fabricante

async function fetchListFabricante() {
  try {
    const response = await fetch("/api/listfabri");
    const fabricante= await response.json();
  
    const fabricanteListDiv = document.querySelector(".listingFabri");
    fabricanteListDiv.innerHTML = "";
  
    if (fabricante.length > 0) {
      const tabela = document.createElement("table");
      tabela.style.width = "100%";
      tabela.setAttribute("border", "1");
  
      const cabecalho = tabela.createTHead();
      const linhaCabecalho = cabecalho.insertRow();
      const colunas = [
        "Selecionar",
        "Código",
        "Discrição",
        "Categoria",
        "Fabesuca",
        "observação",
        "Centro de custo"
      ];
  
      colunas.forEach((coluna) => {
        const th = document.createElement("th");
        th.textContent = coluna;
        linhaCabecalho.appendChild(th);
      });
  
      const corpo = tabela.createTBody();
      fabricante.forEach((fabricante) => {
        const linha = corpo.insertRow();

        linha.setAttribute("data-fabecode", fabricante.fabecode);
  
        const checkboxCell = linha.insertCell();
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "selectFabricante";
        checkbox.value = fabricante.fabecode;
        
        const fabricanteData = JSON.stringify(fabricante);
        if (fabricanteData) {
          checkbox.dataset.fabricante = fabricanteData;
        } else {
          console.warn(`Fornecedor inválido encontrado:`, fabricante);
        }

        checkboxCell.appendChild(checkbox);

        linha.insertCell().textContent = fabricante.fabecode;
        linha.insertCell().textContent = fabricante.fabedesc;
        linha.insertCell().textContent = fabricante.fabecate;
        linha.insertCell().textContent = fabricante.fabesuca;
        linha.insertCell().textContent = fabricante.fabeobs;
        linha.insertCell().textContent = fabricante.fabectct;
       
      });
  
      fabricanteListDiv.appendChild(tabela);
    } else {
      fabricanteListDiv.innerHTML = "<p>Nenhum fornecedor cadastrado.</p>";
    }
  } catch (error) {
    console.error("Erro ao carregar fornecedores:", error);
    document.querySelector(".listingFabri").innerHTML =
      "<p>Erro ao carregar fornecedores.</p>";
  }
}
  
fetchListFabricante()

//deletar fabricante

const btnDeleteFabri = document.querySelector('.buttonDeleteFabri')
btnDeleteFabri.addEventListener('click' , async ()=>{

  const selectedCheckbox = document.querySelector(
    'input[name="selectFabricante"]:checked'
  );
  if (!selectedCheckbox) {
    Toastify({
      text: "Selecione um fabricante para excluir",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return;
  }

  const fabricanteSelecionado = JSON.parse(selectedCheckbox.dataset.fabricante);
  const fabricanteId = fabricanteSelecionado.fabecode;

  const confirmacao = confirm(
    `Tem certeza de que deseja excluir o Fabricante com código ${fabricanteId}?`
  );
  if (!confirmacao) {
    return;
  }

  await deleteFabri(fabricanteId, selectedCheckbox.closest("tr"));

})

async function deleteFabri(id, fabeRow) {
  try {
    const response = await fetch(`/api/deletefabri/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log("Resposta do servidor:", data);

    if (response.ok) {
      Toastify({
        text: "O Fabricante foi excluído com sucesso!",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();

      fabeRow.remove();
    } else {
      console.log("Erro para excluir:", data);
      Toastify({
        text: "Erro na exclusão do fabricante",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
    }
  } catch (error) {
    console.error("Erro ao excluir fabricante:", error);
    Toastify({
      text: "Erro ao excluir fabricante. Tente novamente.",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
  }
}


// Edição do fabricante
const btnFormEditFabri = document.querySelector('.buttonEditFabri')
btnFormEditFabri.addEventListener('click' , ()=>{
      
  const selectedCheckbox = document.querySelector(
    'input[name="selectFabricante"]:checked'
  );

  if (!selectedCheckbox) {
    Toastify({
      text: "Selecione um Fabricante para editar",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return;
  }

  const fabricanteData = selectedCheckbox.dataset.fabricante;
  if (!fabricanteData) {
    console.error("O atributo data-fabecode está vazio ou indefinido.");
    return;
  }

  try {
    const fabricanteSelecionado = JSON.parse(fabricanteData);
    // console.log("Editar item:", fabricanteSelecionado);

    // Campos e IDs correspondentes
    const campos = [
      { id: "editFabeCode", valor:fabricanteSelecionado.fabecode },
      { id: "editFabeDesc", valor: fabricanteSelecionado.fabedesc },
      { id: "editFabeCate", valor: fabricanteSelecionado.fabecate },
      { id: "editFabeSuca", valor: fabricanteSelecionado.fabesuca},
      { id: "editFabeObs", valor: fabricanteSelecionado.fabeobs },
      { id: "editFabeCtct", valor: fabricanteSelecionado.fabectct }
    ];

       console.log(campos)
    // Atualizar valores no formulário
    campos.forEach(({ id, valor }) => {
      const elemento = document.getElementById(id);
      if (elemento) {
        elemento.value = valor || "";
      } else {
        console.warn(`Elemento com ID '${id}' não encontrado.`);
      }
    });

    // Mostrar o formulário de edição e ocultar a lista
    const spaceEditFabri = document.querySelector('.editFabri')
    const btnMainPageFabri =  document.querySelector('.btnMainPageFabri')
    const listingFabri = document.querySelector('.listingFabri')

    if (spaceEditFabri) {
      spaceEditFabri.style.display = "flex";
    } else {
      console.error("O formulário de edição não foi encontrado.");
    }

    if (listingFabri ) {
      listingFabri .style.display = "none";
    } else {
      console.error("A lista de produto não foi encontrada.");
    }

    if(btnMainPageFabri){
      btnMainPageFabri.style.display = 'none'
    }
  } catch (error) {
    console.error("Erro ao fazer parse de data-bem:", error);
  }
});

// função
async function editAndUpdateOfFabric() {
  const formEditFabri = document.querySelector(".formEditFabri");

  formEditFabri.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const selectedCheckbox = document.querySelector(
      'input[name="selectFabricante"]:checked'
    );

    if (!selectedCheckbox) {
      console.error("Nenhum checkbox foi selecionado.");
      return;
    }

    const fabricanteId = selectedCheckbox.dataset.fabricante;

    if (!fabricanteId) {
      console.error("O atributo data-bem está vazio ou inválido.");
      return;
    }

    let fabeIdParsed;
    try {
      fabeIdParsed = JSON.parse(fabricanteId).fabecode;
    } catch (error) {
      console.error("Erro ao fazer parse de bemId:", error);
      return;
    }

    const updateFabric= {
      fabecode: document.getElementById("editFabeCode").value,
      fabedesc: document.getElementById("editFabeDesc").value,
      fabecate: document.getElementById("editFabeCate").value,
      fabesuca: document.getElementById("editFabeSuca").value,
      fabeobs: document.getElementById("editFabeObs").value,
      fabectct:document.getElementById("editFabeCtct").value
    };

    try {
      const response = await fetch(`/api/updatefabe/${fabeIdParsed}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateFabric),
      });

      console.log("resposta:", response);

      if (response.ok) {
        console.log("Atualização bem-sucedida");

        Toastify({
          text: `Bem '${fabeIdParsed}' Atualizado com sucesso!!`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();

        setTimeout(() => {
          window.location.reload();
          document.querySelector(".editFabri").style.display = "none";
        }, 3000);

        formEditFabri.reset();
      } else {
        console.error("Erro ao atualizar produto:", await response.text());
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  });
}
editAndUpdateOfFabric();
