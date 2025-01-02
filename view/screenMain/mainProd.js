const btnProd = document.querySelector('.btnCadProd')
btnProd.addEventListener('click' , ()=>{

    const containerAppProd = document.querySelector('.containerAppProd')
    const containerAppClient = document.querySelector(".containerAppClient");
    const containerAppBens = document.querySelector(".containerAppBens");
    const containerAppForn = document.querySelector(".containerAppForn")
    const listingProd  = document.querySelector('.listingProd')
    const btnMainPageProd =  document.querySelector('.btnMainPageProd')

    listingProd.style.display = 'flex'
    containerAppProd.style.display = 'flex'
    btnMainPageProd.style.display = 'flex'

    containerAppClient.style.display = 'none'
    containerAppBens.style.display = 'none'
    containerAppForn.style.display = 'none'
})

const registerProd = document.querySelector('.registerProd')
registerProd.addEventListener('click' , ()=>{
    const formRegisterProd = document.querySelector('.formRegisterProd')
    const btnMainPageProd =  document.querySelector('.btnMainPageProd')
    const listingProd  = document.querySelector('.listingProd')


    formRegisterProd.style.display = 'flex'

    listingProd.style.display = 'none'
    btnMainPageProd.style.display = 'none'
})
const btnExitProd = document.querySelector('.buttonExitProd')
btnExitProd.addEventListener('click'  ,()=>{
    const containerAppProd = document.querySelector('.containerAppProd')

    containerAppProd.style.display = 'none'
})
const btnOutInitProd = document.querySelector('.btnOutInitProd')
btnOutInitProd.addEventListener('click', (event)=>{
    event.preventDefault()
    const formRegisterProduto = document.querySelector('.formRegisterProduto')
    const containerAppProd = document.querySelector('.containerAppProd')

    containerAppProd.style.display = 'none'

    formRegisterProduto.style.display = 'none'
})

// registrar no banco
const formRegisterProduto = document.querySelector('.formRegisterProduto')
formRegisterProduto.addEventListener('submit' , async (event)=>{
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

      await fetch('/api/prod/submit' , {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then((response)=>{
        if(response.ok){
          console.log("deu certo");

         Toastify({
          text: "Cadastrado com Sucesso",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();
        
        document.querySelector('.formRegisterProduto').reset();
     }else{
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
    console.error('deu errro', error)
  })

})

// listagem de produtos
async function fetchListProdutos() {
    try {
      const response = await fetch("/api/listProd");
      const produtos = await response.json();
  
      const produtosListDiv = document.querySelector(".listingProd");
      produtosListDiv.innerHTML = "";
  
      if (produtos.length > 0) {
        const tabela = document.createElement("table");
        tabela.style.width = "100%";
        tabela.setAttribute("border", "1");
  
        const cabecalho = tabela.createTHead();
        const linhaCabecalho = cabecalho.insertRow();
        const colunas = [
          "Selecionar",
          "Código",
          "Descrição",
          "Tipo",
          "Unidade",
          "Código Fabricante",
          "Data",
          "Valor",
          "prodPeli",
          "prodPebr",
          "Ativo"
        ];
  
        colunas.forEach((coluna) => {
          const th = document.createElement("th");
          th.textContent = coluna;
          linhaCabecalho.appendChild(th);
        });
  
        const corpo = tabela.createTBody();
        produtos.forEach((produto) => {
          const linha = corpo.insertRow();
          linha.setAttribute("data-prodcode", produto.prodCode);
  
          const checkboxCell = linha.insertCell();
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.name = "selectProduto";
          checkbox.value = produto.prodCode;
  
          checkbox.dataset.produto = JSON.stringify(produto);
          checkboxCell.appendChild(checkbox);
  
          linha.insertCell().textContent = produto.prodcode;
          linha.insertCell().textContent = produto.proddesc;
          linha.insertCell().textContent = produto.prodtipo;
          linha.insertCell().textContent = produto.produnid;
          linha.insertCell().textContent = produto.prodcofa;
          linha.insertCell().textContent = produto.proddtuc;
          linha.insertCell().textContent = produto.prodvluc;
          linha.insertCell().textContent = produto.prodpeli;
          linha.insertCell().textContent = produto.prodpebr;
          linha.insertCell().textContent = produto.prodativ === "S" ? "Sim" : "Não";
        });
  
        produtosListDiv.appendChild(tabela);
      } else {
        produtosListDiv.innerHTML = "<p>Nenhum produto cadastrado.</p>";
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      document.querySelector(".listingProd").innerHTML =
        "<p>Erro ao carregar produtos.</p>";
    }
  }
  
  fetchListProdutos();

 const btnDeleteProd = document.querySelector('.buttonDeleteProd')
 btnDeleteProd.addEventListener('click' , async ()=>{
         
    const selectedCheckbox = document.querySelector(
        'input[name="selectProduto"]:checked'
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
    
      const produtoSelecionado = JSON.parse(selectedCheckbox.dataset.produto);
      const produtoId = produtoSelecionado.prodcode;
    
      const confirmacao = confirm(
        `Tem certeza de que deseja excluir o produto com código ${produtoId}?`
      );
      if (!confirmacao) {
        return;
      }
    
      await deleteProd(produtoId, selectedCheckbox.closest("tr"));
  
})

async function deleteProd(id , rowProd) {
    
    try {
        const response = await fetch(`/api/deleteprod/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();
        console.log("Resposta do servidor:", data);
    
        if (response.ok) {
          Toastify({
            text: "O produto foi excluido com sucesso",
            duration: 2000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "green",
          }).showToast();
    
          rowProd.remove();
        } else {
          console.log("Erro para excluir:", data);
          Toastify({
            text: "Erro na exclusão do produto",
            duration: 2000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
          }).showToast();
        }
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        Toastify({
          text: "Erro ao excluir produto. Tente novamente.",
          duration: 2000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
      }
}
  