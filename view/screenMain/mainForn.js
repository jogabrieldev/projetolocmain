


const btnForn = document.querySelector('.btnCadForn')
btnForn.addEventListener('click' , ()=>{
         
    const containerAppClient = document.querySelector(".containerAppClient");
    const containerAppBens = document.querySelector(".containerAppBens");
    const containerAppForn = document.querySelector(".containerAppForn")
    const containerAppProd = document.querySelector('.containerAppProd')
    const formRegisterForn = document.querySelector('.formRegisterForn')
    const listingForn = document.querySelector('.listingForn')
    const btnMainPageForm = document.querySelector('.btnMainPageForn')


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
    const containerAppForn = document.querySelector(".containerAppForn")

    containerAppForn.style.display = 'none'

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

    // console.log('response status: ' , response.status)
    // console.log('response ok', response.ok)

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
    
        // document.querySelector("#registerForn").reset();
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
          // checkbox.dataset.fornecedor = JSON.stringify(fornecedor);

  
          const fornecedorData = JSON.stringify(fornecedor);
          if (fornecedorData) {
            checkbox.dataset.fornecedor = fornecedorData;
          } else {
            console.warn(`Fornecedor inválido encontrado:`, fornecedor);
          }
  
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

  // Atualização

  const editButtonForn = document.querySelector(".buttonEditForn");

  editButtonForn.addEventListener("click", () => {
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
  
      // Atualizar campos do formulário
      const campos = [
        { id: "fornCode", valor: fornecedorSelecionado.forncode },
        { id: "fornName", valor: fornecedorSelecionado.fornnome },
        { id: "nomeFan", valor: fornecedorSelecionado.fornnoft },
        { id: "fornCnpj", valor: fornecedorSelecionado.forncnpj },
        { id: "fornCep", valor: fornecedorSelecionado.forncep },
        { id: "fornRua", valor: fornecedorSelecionado.fornrua },
        { id: "fornCity", valor: fornecedorSelecionado.forncity },
        { id: "fornEstd", valor: fornecedorSelecionado.fornestd },
        { id: "fornCelu", valor: fornecedorSelecionado.forncelu },
        { id: "fornMail", valor: fornecedorSelecionado.fornmail },
        { id: "fornBank", valor: fornecedorSelecionado.fornbanc },
        { id: "fornAge", valor: fornecedorSelecionado.fornagen },
        { id: "fornCont", valor: fornecedorSelecionado.forncont },
        { id: "fornPix", valor: fornecedorSelecionado.fornpix },
        { id: "fornDtcd", valor: fornecedorSelecionado.forndtcd },
        { id: "fornDisPro", valor: fornecedorSelecionado.fornptsv }
      ];
  
      campos.forEach(({ id, valor }) => {
        const elemento = document.getElementById(id);
        if (elemento) {
          elemento.value = valor || ""; // Preencher com valor ou vazio
        } else {
          console.warn(`Elemento com ID '${id}' não encontrado.`);
        }
      });
     
  
      // Mostrar formulário de edição
      document.querySelector(".formEditRegisterForn").style.display = "flex";
      document.querySelector(".listingForn").style.display = "none";
    } catch (error) {
      console.error("Erro ao fazer parse de data-fornecedor:", error);
    }
  });
  

  // atualização
 
  async function editAndUpdateOfForn() {
    const formEditForn = document.querySelector("#formEditForn");
  
    formEditForn.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData.entries());
  
      const selectedCheckbox = document.querySelector('input[name="selectFornecedor"]:checked');
  
      if (!selectedCheckbox) {
        console.error("Nenhum fornecedor foi selecionado.");
        return;
      }
  
      const fornData = selectedCheckbox.dataset.fornecedor;
  
      let fornIdParsed;
      try {
        fornIdParsed = JSON.parse(fornData).forncode;
        console.log("Fornecedor ID:", fornIdParsed);  // Verifique se o ID está correto
      } catch (error) {
        console.error("Erro ao fazer parse de fornId:", error);
        return;
      }
  
      const updateForn = {

        forncode: document.getElementById("fornCode").value || '',  // Garantir que seja uma string vazia se estiver vazio
       fornnome: document.getElementById("fornName").value || '',
  fornnoft: document.getElementById("nomeFan").value || '',
  forncnpj: document.getElementById("fornCnpj").value || '',
  forncep: document.getElementById("fornCep").value || '',
  fornrua: document.getElementById("fornRua").value || '',
  forncity: document.getElementById("fornCity").value || '',
  fornestd: document.getElementById("fornEstd").value || '',
  forncelu: document.getElementById("fornCelu").value || '',
  fornMail: document.getElementById("fornMail").value || '',
  fornbanc: document.getElementById('fornBank').value || '',
  fornagen: document.getElementById('fornAge').value || '',
  forncont: document.getElementById('fornCont').value || '',
  fornpix: document.getElementById('fornPix').value || '',
  forndtcd: document.getElementById('fornDtcd').value || null,
  fornptsv: document.getElementById('fornDisPro').value || ''
       
      };
  
      console.log("Dados a serem atualizados:", updateForn);  

      
      try {
        const response = await fetch(`/api/updateforn/${fornIdParsed}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateForn)
        });
  
        if (response.ok) {
          console.log('atualização bem sucedida')
          Toastify({
            text: `Fornecedor '${fornIdParsed}' atualizado com sucesso!`,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
          }).showToast();

         

          // setTimeout(() => {
          //   window.location.reload();
          // }, 3000);

        } else {
          const errorText = await response.text();
          console.error("Erro ao atualizar fornecedor:", errorText);
          Toastify({
            text: `Erro ao atualizar fornecedor: ${errorText}`,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red"
          }).showToast();
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    });
  }
  
  editAndUpdateOfForn();
  