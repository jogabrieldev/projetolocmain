


const btnForn = document.querySelector('.btnCadForn')
btnForn.addEventListener('click' , ()=>{
         
    const containerAppClient = document.querySelector(".containerAppClient");
    const containerAppBens = document.querySelector(".containerAppBens");
    const containerAppForn = document.querySelector(".containerAppForn")
    const containerAppProd = document.querySelector('.containerAppProd')
    const containerAppFabri = document.querySelector('.containerAppFabri')
    const containerAppTypeProd = document.querySelector('.containerAppTipoProd')
     const containerAppDriver = document.querySelector('.containerAppDriver')
    containerAppDriver.style.display = 'none'
    const formRegisterForn = document.querySelector('.formRegisterForn')
    const listingForn = document.querySelector('.listingForn')
    const btnMainPageForm = document.querySelector('.btnMainPageForn')

    containerAppTypeProd.style.display = 'none'
    containerAppFabri.style.display = 'none'
     formRegisterForn.style.display = 'none'
    containerAppBens.style.display = 'none'
    containerAppClient.style.display = 'none'
    containerAppProd.style.display = 'none'

    containerAppForn.style.display = 'flex'
      listingForn.style.display = 'flex'
      btnMainPageForm.style.display =  'flex'

    
})
const buttonEditForn = document.querySelector('.buttonEditForn')
buttonEditForn.addEventListener('click' , ()=>{

  const btnMainPageForm = document.querySelector('.btnMainPageForn')
 
  btnMainPageForm.style.display = 'none'
 
})
const btnRegisterForn = document.querySelector('.registerForn')
btnRegisterForn.addEventListener('click' , ()=>{
      const formRegisterForn = document.querySelector('.formRegisterForn')
      const listingForn = document.querySelector('.listingForn')
      const btnMainPageForm = document.querySelector('.btnMainPageForn')

      formRegisterForn.style.display = 'flex'

      listingForn.style.display = 'none'
      btnMainPageForm.style.display =  'none'
})

const btnOutPage = document.querySelector('.btnOutInitForn')
btnOutPage.addEventListener('click' , (e)=>{
    e.preventDefault()

       const listingForn = document.querySelector('.listingForn')
          listingForn.style.display = 'flex'

       const btnMainPageForm = document.querySelector('.btnMainPageForn')
          btnMainPageForm.style.display = 'flex'
     
        const containerFormForn = document.querySelector('.formRegisterForn')
          containerFormForn.style.display = 'none'

})

const btnOutInitForn = document.querySelector('.btnOutInitFornEdit')
btnOutInitForn.addEventListener('click' , (event)=>{

    event.preventDefault()

     const caixaForn = document.querySelector('.formEditRegisterForn')
       caixaForn.style.display = 'none'


     const listingForn = document.querySelector('.listingForn')
       listingForn.style.display = 'flex'


     const btnMainPageForm = document.querySelector('.btnMainPageForn')
        btnMainPageForm.style.display  ='flex'
   
   return;
})

const formRegisterForn = document.querySelector("#registerForn");
formRegisterForn.addEventListener("submit", async (event) => {
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

  // try {
    await fetch('/api/forne/submit', {
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
    
        document.querySelector("#registerForn").reset();
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
 
});

// lista de fornecedor

async function fetchListFornecedores() {
    try {
      const response = await fetch("/api/listForn");
      const fornecedores = await response.json();
    
      // console.log("Dados recebidos da API:", fornecedores);
    
      const fornecedoresListDiv = document.querySelector(".listingForn");
      fornecedoresListDiv.innerHTML = "";
    
      if (fornecedores.length > 0) {
        const tabela = document.createElement("table");
        tabela.style.width = "100%";
        tabela.setAttribute("border", "1");
    
        const cabecalho = tabela.createTHead();
        const linhaCabecalho = cabecalho.insertRow();
        const colunas = [
          "Selecionar",
          "Código",
          "Nome",
          "Nome Fantasia",
          "CNPJ",
          "CEP",
          "Rua",
          "Cidade",
          "Estado",
          "Celular",
          "E-mail",
          "Banco",
          "Agência",
          "Conta",
          "Pix",
          "Data do cadastro",
          "Discrição"
        ];
    
        colunas.forEach((coluna) => {
          const th = document.createElement("th");
          th.textContent = coluna;
          linhaCabecalho.appendChild(th);
        });
    
        const corpo = tabela.createTBody();
        fornecedores.forEach((fornecedor) => {
          const linha = corpo.insertRow();

          linha.setAttribute("data-forncode", fornecedor.forncode);
    
          const checkboxCell = linha.insertCell();
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.name = "selectFornecedor";
          checkbox.value = fornecedor.forncode;
          
          // const fornecedorData = JSON.stringify(fornecedor);
          // if (fornecedorData) {
          //   checkbox.dataset.fornecedor = fornecedorData;
          // } else {
          //   console.warn(`Fornecedor inválido encontrado:`, fornecedor);
          // }

          checkbox.dataset.fornecedor = JSON.stringify(fornecedor);
          checkboxCell.appendChild(checkbox);

          linha.insertCell().textContent = fornecedor.forncode;
          linha.insertCell().textContent = fornecedor.fornnome;
          linha.insertCell().textContent = fornecedor.fornnoft;
          linha.insertCell().textContent = fornecedor.forncnpj;
          linha.insertCell().textContent = fornecedor.forncep;
          linha.insertCell().textContent = fornecedor.fornrua;
          linha.insertCell().textContent = fornecedor.forncity;
          linha.insertCell().textContent = fornecedor.fornestd;
          linha.insertCell().textContent = fornecedor.forncelu;
          linha.insertCell().textContent = fornecedor.fornmail;
          linha.insertCell().textContent = fornecedor.fornbanc;
          linha.insertCell().textContent = fornecedor.fornagen;
          linha.insertCell().textContent = fornecedor.forncont;
          linha.insertCell().textContent = fornecedor.fornpix;
          linha.insertCell().textContent = fornecedor.forndtcd;
          linha.insertCell().textContent = fornecedor.fornptsv;
        });
    
        fornecedoresListDiv.appendChild(tabela);
      } else {
        fornecedoresListDiv.innerHTML = "<p>Nenhum fornecedor cadastrado.</p>";
      }
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
      document.querySelector(".listingForn").innerHTML =
        "<p>Erro ao carregar fornecedores.</p>";
    }
  }
    
  fetchListFornecedores();
 
  // deletar fornecedor
  const btnDeleteForn = document.querySelector('.buttonDeleteForn')
  btnDeleteForn.addEventListener('click' , async ()=>{
     
    const selectedCheckbox = document.querySelector(
      'input[name="selectFornecedor"]:checked'
    );
    if (!selectedCheckbox) {
      Toastify({
        text: "Selecione um Fornecedor para excluir",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
      return;
    }
  
    const fornecedorSelecionado = JSON.parse(selectedCheckbox.dataset.fornecedor);
    const fornecedorId = fornecedorSelecionado.forncode;
  
    const confirmacao = confirm(
      `Tem certeza de que deseja excluir o Fornecedor com código ${fornecedorId}?`
    );
    if (!confirmacao) {
      return;
    }
  
    await deleteForne(fornecedorId, selectedCheckbox.closest("tr"));

  })

  async function deleteForne(id, fornRow) {
    try {
      const response = await fetch(`/api/deleteForn/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      console.log("Resposta do servidor:", data);
  
      if (response.ok) {
        Toastify({
          text: "O Fornecedor foi excluído com sucesso!",
          duration: 2000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();
  
        fornRow.remove();
      } else {
        console.log("Erro para excluir:", data);
        Toastify({
          text: "Erro na exclusão do Fornecedor",
          duration: 2000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
      }
    } catch (error) {
      console.error("Erro ao excluir Fornecedor:", error);
      Toastify({
        text: "Erro ao excluir Fornecedor. Tente novamente.",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
    }
  }


  // // atualização
 
  const editButtonForn = document.querySelector(".buttonEditForn");

editButtonForn.addEventListener("click", (e) => {

  e.preventDefault()
  const selectedCheckbox = document.querySelector('input[name="selectFornecedor"]:checked');

  if (!selectedCheckbox) {
    Toastify({
      text: "Selecione um fornecedor para editar",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    document.querySelector('.btnMainPageForn').style.display = 'flex';
    return;
  }
  
  const fornData = selectedCheckbox.dataset.fornecedor;

  if (!fornData) {
    console.error("O atributo data-fornecedor está vazio ou indefinido.");
    return;
  }

  try {
    const fornecedorSelecionado = JSON.parse(fornData);
    console.log("Fornecedor selecionado para edição:", fornecedorSelecionado);

    const campos = [
      { id: "editFornCode", valor: fornecedorSelecionado.forncode },
      { id: "editFornName", valor: fornecedorSelecionado.fornnome },
      { id: "editNomeFan", valor: fornecedorSelecionado.fornnoft },
      { id: "editFornCnpj", valor: fornecedorSelecionado.forncnpj },
      { id: "editFornCep", valor: fornecedorSelecionado.forncep },
      { id: "editFornRua", valor: fornecedorSelecionado.fornrua },
      { id: "editFornCity", valor: fornecedorSelecionado.forncity },
      { id: "editFornEstd", valor: fornecedorSelecionado.fornestd },
      { id: "editFornCelu", valor: fornecedorSelecionado.forncelu },
      { id: "editFornMail", valor: fornecedorSelecionado.fornmail },
      { id: "editFornBank", valor: fornecedorSelecionado.fornbanc },
      { id: "editFornAge", valor: fornecedorSelecionado.fornagen },
      { id: "editFornCont", valor: fornecedorSelecionado.forncont },
      { id: "editFornPix", valor: fornecedorSelecionado.fornpix },
      { id: "editFornDtcd", valor: fornecedorSelecionado.forndtcd },
      { id: "editFornDisPro", valor: fornecedorSelecionado.fornptsv }
    ];

    campos.forEach(({ id, valor }) => {
      const elemento = document.getElementById(id);
      if (elemento) {
        elemento.value = valor || ""; 
      } else {
        console.warn(`Elemento com ID '${id}' não encontrado.`);
      }
    });

    document.querySelector(".formEditRegisterForn").style.display = "flex";
    document.querySelector(".listingForn").style.display = "none";
  } catch (error) {
    console.error("Erro ao fazer parse de data-fornecedor:", error);
  }
});

// função fetch

async function editAndUpdateOfForn() {
  const formEditForn = document.querySelector("#formEditForn");

  formEditForn.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());



    const selectedCheckbox = document.querySelector(
      'input[name="selectFornecedor"]:checked'
    );

    if (!selectedCheckbox) {
      console.error("Nenhum checkbox foi selecionado.");
      return;
    }

    const fornecedorId = selectedCheckbox.dataset.fornecedor;

    if (!fornecedorId) {
      console.error("O atributo data-fornecedor está vazio ou inválido.");
      return;
    }

    let fornIdParsed;
    try {
      fornIdParsed = JSON.parse(fornecedorId).forncode;
    } catch (error) {
      console.error("Erro ao fazer parse de bemId:", error);
      return;
    }

    const updateForn = {
      forncode: document.getElementById("editFornCode").value,
      fornnome: document.getElementById("editFornName").value,
      fornnoft: document.getElementById("editNomeFan").value,
      forncnpj: document.getElementById("editFornCnpj").value,
      forncep: document.getElementById("editFornCep").value,
      fornrua: document.getElementById("editFornRua").value, 
      forncity: document.getElementById("editFornCity").value,
      fornestd: document.getElementById("editFornEstd").value, 
      forncelu: document.getElementById("editFornCelu").value,
      fornmail: document.getElementById("editFornMail").value,
      fornbanc: document.getElementById('editFornBank').value,
      fornagen: document.getElementById('editFornAge').value,
      forncont: document.getElementById('editFornCont').value,
      fornpix: document.getElementById('editFornPix').value,
      forndtcd: document.getElementById('editFornDtcd')?.value || null,
      fornptsv: document.getElementById('editFornDisPro').value
    };

    try {
      const response = await fetch(`/api/updateforn/${fornIdParsed}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateForn)
      });

      console.log("resposta:", response);

      if (response.ok) {
        console.log("Atualização bem-sucedida");

        Toastify({
          text: `Bem '${fornIdParsed}' Atualizado com sucesso!!`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();

        setTimeout(() => {
          window.location.reload();
          document.querySelector(".formEditRegisterForn").style.display = "none";
        }, 3000);

        formEditForn.reset();
      } else {
        console.error("Erro ao atualizar fornecedor:", await response.text());
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  });
}
editAndUpdateOfForn();
