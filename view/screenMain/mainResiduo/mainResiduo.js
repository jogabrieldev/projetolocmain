
const socketResiduo = io()
document.addEventListener('DOMContentLoaded' , ()=>{
    const btnLoadResiduo = document.querySelector('.btnCadResiduo')
    if(btnLoadResiduo){
         btnLoadResiduo.addEventListener('click' , async (event)=>{
           event.preventDefault()
           
        try {

             const response = await fetch('/residuoview', {
             method: "GET",
           });
          if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
         const html = await response.text();
         const mainContent = document.querySelector("#mainContent");
          
         if (mainContent) {
           mainContent.innerHTML = html;
              interationSystemResiduo()
              registerNewResiduo()
              getAllResiduo()
              deleteResiduo()
            }else {
          console.error("#mainContent não encontrado no DOM");
          return;
        } 

         const containerAppResiduo = document.querySelector('.containerAppResiduo')

           if (containerAppResiduo) containerAppResiduo.style.display = "flex";

        const sectionsToHide = [
          ".containerAppProd",
          ".containerAppFabri",
          ".containerAppTipoProd",
          ".containerAppDriver",
          ".containerAppAutomo",
          ".containerAppBens",
          ".containerAppForn",
          ".containerAppClient"
        ];
        sectionsToHide.forEach((selector) => {
          const element = document.querySelector(selector);
          if (element) element.style.display = "none";
        }); 

         const containerResiduo = document.querySelector(".containerAppResiduo");
        const btnMainPageClient = document.querySelector(".buttonsMainPage");
        const listingResiduo = document.querySelector(".listResiduo");
        // const editFormClient = document.querySelector(".formEditClient");
        const informative = document.querySelector(".information");

        if (containerResiduo) containerResiduo.style.display = "flex";
        if (btnMainPageClient) btnMainPageClient.style.display = "flex";
        if (listingResiduo) listingResiduo.style.display = "flex";
        // if (editFormClient) editFormClient.style.display = "none";
        if (informative) {
          informative.style.display = "block";
          informative.textContent = "SEÇÃO RESIDUO";
        }

    
        } catch (error) {
               
          Toastify({
          text: "Erro na pagina",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
           console.error('Erro na chamada do "CONTENT RESIDUO"');
         }
        })
    }

    socketResiduo.on("updateRunTimeResiduo", (residuo) => {
    getAllResiduo();
  });
})

function interationSystemResiduo(){
     
    const btnRegisterResiduo = document.querySelector('.registerResiduo')
    if(btnRegisterResiduo){
        btnRegisterResiduo.addEventListener('click' , ()=>{
             const containerForm = document.querySelector('.containerFormRegister')
             if(containerForm){
                containerForm.classList.remove('hidden')
                containerForm.classList.add('flex')
             }

             const btnMainPage = document.querySelector('.buttonsMainPage')
             if(btnMainPage){
                btnMainPage.classList.remove('flex')
                btnMainPage.classList.add('hidden')
             }

             const listResiduo = document.querySelector('.listResiduo')
             if(listResiduo){
                listResiduo.classList.remove('flex')
                listResiduo.classList.add('hidden')
             }
        })
    }

    const btnOutInitResiduo = document.querySelector('.btnOutInitResiduo')
    if(btnOutInitResiduo){
        btnOutInitResiduo.addEventListener('click' , ()=>{
          
            const containerResiduoRegister = document.querySelector('.containerFormRegister')
            if(containerResiduoRegister){
                containerResiduoRegister.classList.remove('flex')
                containerResiduoRegister.classList.add('hidden')
            }

            const btnMainPage = document.querySelector('.buttonsMainPage')
             if(btnMainPage){
                btnMainPage.classList.remove('hidden')
                btnMainPage.classList.add('flex')
             }

             const listResiduo = document.querySelector('.listResiduo')
             if(listResiduo){
                listResiduo.classList.remove('hidden')
                listResiduo.classList.add('flex')
             }
      })
    }

    const exitSectionResiduo = document.querySelector('.buttonExitResiduo')
    if(exitSectionResiduo){
        exitSectionResiduo.addEventListener('click', ()=>{
              
            const containerAppResiduo = document.querySelector('.containerAppResiduo')
            if(containerAppResiduo){
                containerAppResiduo.classList.remove('flex')
                containerAppResiduo.classList.add('hidden')
            }
        })
    }
}

 async function registerNewResiduo(){
    const btnRegisterResiduo = document.querySelector('.btnRegisterResiduo')
    if(btnRegisterResiduo){
        btnRegisterResiduo.addEventListener('click' , async ()=>{
           
        try {
            const codeRes = document.getElementById('codeRes').value.trim()
          const descResi = document.getElementById('descResi').value.trim()

          if(!codeRes || !descResi){
            Toastify({
            text: "Não foi passado os valores obrigatorios",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
          }).showToast();
           return
        }

        
         const response = await fetch('/residuo' , {
            method: "POST",
            headers: {
              "Content-Type": "application/json" },
            body: JSON.stringify({ dataResi: { codeRes, descResi }})

         })

           const result = await response.json();

           if(response.ok){
              Toastify({
            text: "Residuo cadastrado com sucesso!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "green",
          }).showToast();
          document.getElementById('formRegisterResiduo').reset()
         }else{
           Toastify({
            text: result?.message || "Erro ao cadastrar Residuo.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: response.status === 409 ? "orange" : "red",
          }).showToast();
         }
            } catch (error) {
                console.error('Erro na aplicação no cadastro de residuo' , error)
               Toastify({
               text: "Erro no server" , error,
               duration: 3000,
               close: true,
               gravity: "top",
               position: "center",
              backgroundColor: 'red'
              }).showToast()
           }
        });
    };
};

async function getAllResiduo() {
  try {
    const res = await fetch('/residuo', {
      method: 'GET'
    });

    const data = await res.json(); // resposta completa com list e success
    const residuo = data.list || []; // pega o array de resíduos

    const listResiduo = document.querySelector('.listResiduo');
    listResiduo.innerHTML = ''; // limpa conteúdo anterior

    const wrapper = document.createElement('div');
    wrapper.className = "table-responsive";
    listResiduo.appendChild(wrapper);

    if (residuo.length > 0) {
      const table = document.createElement('table');
      table.className = 'table table-sm table-hover table-striped table-bordered tableResiduo';

      // Cabeçalho
      const cabecalho = table.createTHead();
      const linhaCabecalho = cabecalho.insertRow();
      const colunas = ['Selecionar', 'Código', 'Descrição'];

      colunas.forEach(coluna => {
        const th = document.createElement('th');
        th.textContent = coluna;
        th.classList.add('text-center');
        linhaCabecalho.appendChild(th);
      });

      // Corpo
      const corpo = table.createTBody();
      residuo.forEach(resi => {
        const linha = corpo.insertRow();
        linha.setAttribute('data-resicode', resi.resicode);

        // Checkbox
        const checkboxCell = linha.insertCell();
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'selectResiduo';
        checkbox.value = resi.resicode;
        checkbox.dataset.residuo = JSON.stringify(resi);
        checkbox.className = 'form-check-input m-0';
        checkboxCell.classList.add('text-center', 'align-middle');
        checkboxCell.appendChild(checkbox);

        // Dados
        const dados = [resi.resicode, resi.residesc];
        dados.forEach(valor => {
          const td = document.createElement('td');
          td.textContent = valor || '';
          td.classList.add('align-middle', 'text-break');
          linha.appendChild(td);
        });
      });

      wrapper.appendChild(table);
    } else {
      const mensagem = document.createElement('p');
      mensagem.textContent = 'Nenhum resíduo cadastrado.';
      mensagem.className = 'text-muted text-center my-2';
      wrapper.appendChild(mensagem);
    }
  } catch (error) {
    console.error('Erro na listagem de resíduo:', error);
    Toastify({
      text: "Erro no servidor",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: 'red'
    }).showToast();
  };
};

async function deleteResiduo() {
    
   const btnDeleteProd = document.querySelector(".buttonDeleteResiduo");
   if(btnDeleteProd){
       btnDeleteProd.addEventListener("click", async () => {
    const selectedCheckbox = document.querySelector(
    'input[name="selectResiduo"]:checked'
  );
  if (!selectedCheckbox) {
    Toastify({
      text: "Selecione um residuo para excluir",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return;
  }

  const residuoSelecionado = JSON.parse(selectedCheckbox.dataset.residuo);
  const residuoId = residuoSelecionado.resicode;

  const confirmacao = confirm(
    `Tem certeza de que deseja excluir o produto com código ${residuoId}?`
  );
  if (!confirmacao) {
    return;
  }
     await deleteElement(residuoId , selectedCheckbox.closest("tr") )
  })

 async function deleteElement(id , rowResi) {
      
    try {
        const response = await fetch(`/residuo/${id}`, {
         method: "DELETE",
        headers: {
        "Content-Type": "application/json"
      },
    });
    const data = await response.json();

    if (response.ok) {
      Toastify({
        text: "O residuo foi excluido com sucesso",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();

      rowResi.remove();
    } else {
      console.log("Erro para excluir:", data);
      Toastify({
        text: "Erro na exclusão do residuo",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
    }
      } catch (error) {
         console.error('Erro na exclusão do residuo')
        Toastify({
        text: "Erro na exclusão do residuo no server",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
    }
  };
 }
};


