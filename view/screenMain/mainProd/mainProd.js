const btnProd = document.querySelector('.btnCadProd')
btnProd.addEventListener('click' , ()=>{

  const listingProd  = document.querySelector('.listingProd')
       listingProd.style.display = 'flex'

    const btnMainPageProd =  document.querySelector('.btnMainPageProd')
     btnMainPageProd.style.display = 'flex'

    const containerAppProd = document.querySelector('.containerAppProd')
       containerAppProd.style.display = 'flex'

    const containerAppClient = document.querySelector(".containerAppClient");
     containerAppClient.style.display = 'none'

    const containerAppFabri = document.querySelector('.containerAppFabri')
       containerAppFabri.style.display = 'none'

    const containerAppBens = document.querySelector(".containerAppBens");
     containerAppBens.style.display = 'none'

    const containerAppForn = document.querySelector(".containerAppForn")
       containerAppForn.style.display = 'none'

    const containerAppTypeProd = document.querySelector('.containerAppTipoProd')
       containerAppTypeProd.style.display = 'none'

    const containerAppDriver = document.querySelector('.containerAppDriver')
    containerAppDriver.style.display = 'none'

    const containerAppAutomo = document.querySelector('.containerAppAutomo')
       containerAppAutomo.style.display = 'none'

    const containerFormRegisterProd = document.querySelector('.formRegisterProd')
    containerFormRegisterProd.style.display = 'none'

    const containerFormEdit = document.querySelector('.formEditProd')
      containerFormEdit.style.display = 'none'

      const informative = document.querySelector('.information')
       informative.style.display = 'block'
    informative.textContent = 'SEÇÃO PRODUTO'
    
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

    const btnMainPageProd =  document.querySelector('.btnMainPageProd')
       btnMainPageProd.style.display = 'flex'

    const listingProd  = document.querySelector('.listingProd')
        listingProd.style.display = 'flex'

    const containerFormProd = document.querySelector('.formRegisterProd')
      containerFormProd.style.display = 'none'

})
 const btnOutEditForm = document.querySelector('.btnOutInitProdEdit')
 btnOutEditForm .addEventListener('click' , (event)=>{

    event.preventDefault()

  const btnMainPageProd =  document.querySelector('.btnMainPageProd')
       btnMainPageProd.style.display = 'flex'

    const listingProd  = document.querySelector('.listingProd')
        listingProd.style.display = 'flex'

    const containerFormEditProd = document.querySelector('.formEditProd')
    containerFormEditProd.style.display = 'none'
 })

 function isTokenExpired(token) {
  try {
      const payload = JSON.parse(atob(token.split('.')[1])); 
      const expTime = payload.exp * 1000; 
      return Date.now() > expTime; 
  } catch (error) {
      return true; 
  } 
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.cadProd').addEventListener('click', async (event) => {
      event.preventDefault(); // Evita que o formulário recarregue a página

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

      if (!$('.formRegisterProduto').valid()) {
        return;
    }

      const formData = {
          prodCode: document.querySelector('#prodCode').value,         // Código
          prodDesc: document.querySelector('#prodDesc').value,         // Descrição
          prodTipo: document.querySelector('#prodTipo').value,         // Tipo de Produto
          prodUni: document.querySelector('#prodUni').value,           // Unidade
          prodData: document.querySelector('#prodData').value,         // Data
          prodValor: document.querySelector('#prodValor').value,       // Valor de Compra
          prodPeli: document.querySelector('#prodPeli').value,         // Preço Líquido
          prodPebr: document.querySelector('#prodPebr').value,         // Preço Bruto
          prodAtiv: document.querySelector('#prodAtiv').value          // Ativo
      };

      try {
          const response = await fetch('http://localhost:3000/api/prod/submit', {
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
                  text: "Produto cadastrado com sucesso!",
                  duration: 3000,
                  close: true,
                  gravity: "top",
                  position: "center",
                  backgroundColor: "green",
              }).showToast();

              // Limpar o formulário após o sucesso
              document.querySelector('.formRegisterProduto').reset();
          } else {
            Toastify({
              text: `Erro ao cadastrar produto`,
              duration: 3000,
              close: true,
              gravity: "top",
              position: "center",
              backgroundColor: "red",
          }).showToast();
          }
      } catch (error) {
          console.error('Erro ao enviar formulário:', error);
          alert('Erro ao enviar os dados para o server.');
      }
  });
  validationFormProd()
});


async function loadSelectOptions(url, selectId, fieldName) {
  try {
      const response = await fetch(url);
      const result = await response.json();
      
      console.log(`Dados recebidos de ${url}:`, result);

      // Caso os dados venham aninhados dentro de "data"
      const data = Array.isArray(result) ? result : result.data;

      if (!Array.isArray(data)) {
          throw new Error(`Formato de dados inesperado de ${url}: ` + JSON.stringify(result));
      }

      const select = document.getElementById(selectId);
      if (!select) {
          throw new Error(`Elemento select com ID '${selectId}' não encontrado.`);
      }

      data.forEach(item => {

        // Debug
          if (!item.hasOwnProperty(fieldName)) {
              console.warn(`Campo '${fieldName}' não encontrado em`, item);
              return;
          }

          const option = document.createElement("option");
          option.value = item[fieldName];
          option.textContent = item[fieldName];
          select.appendChild(option);
      });

  } catch (error) {
      console.error(`Erro ao carregar os dados para ${selectId}:`, error);
  }
}

document.querySelector('.registerProd').addEventListener('click' ,()=>{
  loadSelectOptions("/api/codefamilyben", "prodCofa", 'fabecode');
  loadSelectOptions("/api/codetipoprod", "prodTipo", 'tiprcode');
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
          "Data da compra",
          "Valor",
          "Preço Liguido",
          "Preço Bruto",
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

          const formatDate = (isoDate) => {
            if (!isoDate) return "";
            const dateObj = new Date(isoDate);
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, "0");
            const day = String(dateObj.getDate()).padStart(2, "0");
            return `${year}/${month}/${day}`;
          };

  
          linha.insertCell().textContent = produto.prodcode;
          linha.insertCell().textContent = produto.proddesc;
          linha.insertCell().textContent = produto.prodtipo;
          linha.insertCell().textContent = produto.produnid;
          linha.insertCell().textContent = formatDate(produto.proddtuc);
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

  // deletar produto
 const btnDeleteProd = document.querySelector('.buttonDeleteProd')
 btnDeleteProd.addEventListener('click' , async ()=>{
         
    const selectedCheckbox = document.querySelector(
        'input[name="selectProduto"]:checked'
      );
      if (!selectedCheckbox) {
        Toastify({
          text: "Selecione um Produto para excluir",
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

//  Editar
const editProdButton = document.querySelector(".buttonEditProd");
editProdButton.addEventListener("click", (event) => {

  loadSelectOptions("/api/codetipoprod", "editProdTipo", 'tiprcode');
  
  const selectedCheckbox = document.querySelector(
    'input[name="selectProduto"]:checked'
  );

  if (!selectedCheckbox) {
    Toastify({
      text: "Selecione um Produto para editar",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return;
  }

  const produtoData = selectedCheckbox.dataset.produto;
  if (!produtoData) {
    console.error("O atributo data-bem está vazio ou indefinido.");
    return;
  }

  try {
    const produtoSelecionado = JSON.parse(produtoData);
    

    // Campos e IDs correspondentes
    const campos = [
      { id: "editProdCode", valor: produtoSelecionado.prodcode },
      { id: "editProdDesc", valor: produtoSelecionado.proddesc },
      { id: "editProdTipo", valor: produtoSelecionado.prodtipo },
      { id: "editProdUni", valor: produtoSelecionado.produnid },
      { id: "editProdData", valor: produtoSelecionado.proddtuc },
      { id: "editProdValor", valor: produtoSelecionado.prodvluc },
      { id: "editProdPeli", valor: produtoSelecionado.prodpeli },
      { id: "editProdPebr", valor: produtoSelecionado.prodpebr },
      { id: "editProdAtiv", valor: produtoSelecionado.prodativ },
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
    const spaceEditprod = document.querySelector('.formEditProd')
    const btnMainPageProd =  document.querySelector('.btnMainPageProd')
    const listingProd  = document.querySelector('.listingProd')

    if (spaceEditprod) {
      spaceEditprod.style.display = "flex";
    } else {
      console.error("O formulário de edição não foi encontrado.");
    }

    if ( listingProd ) {
      listingProd .style.display = "none";
    } else {
      console.error("A lista de produto não foi encontrada.");
    }

    if(btnMainPageProd){
      btnMainPageProd.style.display = 'none'
    }
  } catch (error) {
    console.error("Erro ao fazer parse de data-bem:", error);
  }
});

//função
async function editAndUpdateOfProduct() {
  const formEditProd = document.querySelector(".editProd");

  formEditProd.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

  
    const selectedCheckbox = document.querySelector(
      'input[name="selectProduto"]:checked'
    );

    if (!selectedCheckbox) {
      console.error("Nenhum checkbox foi selecionado.");
      return;
    }

    const produtoId = selectedCheckbox.dataset.produto;

    if (!produtoId) {
      console.error("O atributo data-bem está vazio ou inválido.");
      return;
    }

    let prodIdParsed;
    try {
      prodIdParsed = JSON.parse(produtoId).prodcode;
    } catch (error) {
      console.error("Erro ao fazer parse de bemId:", error);
      return;
    }

    const updateProduct = {
      prodcode: document.getElementById("editProdCode").value,
      proddesc: document.getElementById("editProdDesc").value,
      prodtipo: document.getElementById("editProdTipo").value,
      produnid: document.getElementById("editProdUni").value,
      proddtuc: document.getElementById("editProdData").value || null,
      prodvluc: document.getElementById("editProdValor").value,
      prodpeli: document.getElementById("editProdPeli").value, 
      prodpebr: document.getElementById("editProdPebr").value,
      prodativ: document.getElementById("editProdAtiv").value,
    };

    try {
      const response = await fetch(`/api/updateprod/${prodIdParsed}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateProduct),
      });

      console.log("resposta:", response);

      if (response.ok) {
        console.log("Atualização bem-sucedida");

        Toastify({
          text: `Bem '${prodIdParsed}' Atualizado com sucesso!!`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();
      
        formEditProd.reset();

      } else {
        console.error("Erro ao atualizar produto:", await response.text());
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  });
}
editAndUpdateOfProduct();

