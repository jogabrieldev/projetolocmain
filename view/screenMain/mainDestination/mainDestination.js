
function maskFieldDestination(){
     $("#cepDest").mask("00000-000");
}

const socketDestinationDescard = io()
document.addEventListener('DOMContentLoaded' , function(){
     
    const btnLoadDestination = document.querySelector('.btnLoadDestination')
    if(btnLoadDestination){
        btnLoadDestination.addEventListener('click' , async()=>{     
       try {
             const resunt = await fetch('/destination' , {
                method:'GET'
             })
             if(!resunt.ok)throw new Error(`Erro HTTP: ${resunt.status}`)
                 const html = await resunt.text()
                const mainContent = document.getElementById('mainContent')
                if(mainContent){
                    mainContent.innerHTML = html
                  interationSystemDestination();
                  registerDestination();
                  maskFieldDestination();
                  getAllDestinationDescarte();
                  deleteDestination();
                 updateDestination();
                }else {
          console.error("#mainContent não encontrado no DOM");
          return;
        }

        const containerAppClient = document.querySelector(
          ".containerAppDestination" 
        );
        if (containerAppClient) containerAppClient.classList.add("flex");

        const sectionsToHide = [
          "containerAppClient",
          ".containerAppProd",
          ".containerAppFabri",
          ".containerAppTipoProd",
          ".containerAppDriver",
          ".containerAppAutomo",
          ".containerAppBens",
          ".containerAppForn",
        ];
        sectionsToHide.forEach((selector) => {
          const element = document.querySelector(selector);
          if (element) element.style.display = "none";
        });

        const showContentDestination = document.querySelector(".containerFormRegisterDestination");
        const btnMainPageDestination = document.querySelector(".buttonsMainPage");
        const listDestinationDescart = document.querySelector(".listDestinationDescart");
        const editFormDestination = document.querySelector(".containerFormEditDestination");
        const informative = document.querySelector(".information");

        if (showContentDestination) showContentDestination.style.display = "none";
        if (btnMainPageDestination) btnMainPageDestination.style.display = "flex";
        if (listDestinationDescart) listDestinationDescart.style.display = "flex";
        if (editFormDestination) editFormDestination.style.display = "none";
        if (informative) {
          informative.style.display = "block";
          informative.textContent = "SEÇÃO DESTINO DE DESCARTE";
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
        console.error('Erro na chamada do "CONTENT DESTINATION DESCARTE"');
        };
     });
  };

  socketDestinationDescard.on("updateRunTimeDestinationDiscard", (msg) => {
    getAllDestinationDescarte();
  });
});

// INTERAÇÃO
function interationSystemDestination(){
    const btnInitregisterDestination = document.querySelector('.registerDestination')
    if(btnInitregisterDestination){
        btnInitregisterDestination.addEventListener('click' , ()=>{
              const containerRegisterDestination = document.querySelector('.containerFormRegisterDestination')
              if(containerRegisterDestination){
                 containerRegisterDestination.classList.remove('hidden')
                 containerRegisterDestination.classList.add('flex')
              }

              const buttonsMainPage = document.querySelector('.buttonsMainPage')
              if(buttonsMainPage){
                buttonsMainPage.classList.remove('flex')
                buttonsMainPage.classList.add('hidden')
              }

             const listDestinationDescart =  document.querySelector('.listDestinationDescart')
             if(listDestinationDescart){
                listDestinationDescart.classList.remove('flex')
                listDestinationDescart.classList.add('hidden')
             }
        });
    };

    const buttonExitDestination = document.getElementById('buttonExitDestination')
         if(buttonExitDestination){
            buttonExitDestination.addEventListener('click' , ()=>{
                 const containerAppDestination = document.querySelector('.containerAppDestination')    
                 if(containerAppDestination){
                    containerAppDestination.classList.remove('flex')
                    containerAppDestination.classList.add('hidden')
                 }        
          });
       };
    
    const buttonExitPageRegister = document.querySelector('.btnOutInitDestination')
     if(buttonExitPageRegister){
         buttonExitPageRegister.addEventListener('click' , ()=>{
             const containerRegisterDestination = document.querySelector('.containerFormRegisterDestination')
              if(containerRegisterDestination){
                 containerRegisterDestination.classList.remove('flex')
                 containerRegisterDestination.classList.add('hidden')
              }

              const buttonsMainPage = document.querySelector('.buttonsMainPage')
              if(buttonsMainPage){
                buttonsMainPage.classList.remove('hidden')
                buttonsMainPage.classList.add('flex')
              }

             const listDestinationDescart =  document.querySelector('.listDestinationDescart')
             if(listDestinationDescart){
                listDestinationDescart.classList.remove('hidden')
                listDestinationDescart.classList.add('flex')
             }
         });
     };

     const exitContainerFormEditDestination = document.querySelector('.btnOutEditDestination')
     if(exitContainerFormEditDestination){
        exitContainerFormEditDestination.addEventListener('click',()=>{
              const buttonsMainPage = document.querySelector('.buttonsMainPage')
              if(buttonsMainPage){
                buttonsMainPage.classList.remove('hidden')
                buttonsMainPage.classList.add('flex')
              }

             const listDestinationDescart =  document.querySelector('.listDestinationDescart')
             if(listDestinationDescart){
                listDestinationDescart.classList.remove('hidden')
                listDestinationDescart.classList.add('flex')
             }

             const containerFormEditDestination = document.querySelector('.containerFormEditDestination')
             if(containerFormEditDestination){
               containerFormEditDestination.classList.remove('flex')
               containerFormEditDestination.classList.add('hidden')
             }

        });
     };

     const btnSubmitEdit = document.querySelector('.btnSubmitEditDestination')
     if(btnSubmitEdit){
       btnSubmitEdit.addEventListener('click' , ()=>{
          editAndUpdateDestination()
       })
     };
};

//CADASTRAR DESTINO
function registerDestination(){
  const btnSubmitDestination =  document.querySelector('.btnRegisterDestination')
     if(btnSubmitDestination){
        btnSubmitDestination.addEventListener('click' , async (event)=>{
            event.preventDefault()

       if (!$("#formRegisterDestination").valid()) {
        return;
      }
        try {

      
       const ativDestValue = document.getElementById('ativDest').value.trim().toLowerCase();
         const formData = {
           nomeDest: document.getElementById('nomeDest').value.trim(),
           cidaDest: document.getElementById('cidaDest').value.trim(),
           ruaDest: document.getElementById('ruaDest').value.trim(),  
           bairDest: document.getElementById('bairDest').value.trim(),
           estdDest: document.getElementById('estdDest').value.trim(),
           ativDest: ativDestValue === "sim",
           tipoDest: document.getElementById('tipoDest').value.trim()
         }

         const result = await fetch('/api/destination' , {
            method:'POST',
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify(formData)
         })
          await result.json()
         
         if(result.ok){
            Toastify({
            text: "Destino de descarte cadastrado com sucesso!.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#1d5e1d",
            }).showToast();
            document.querySelector("#formRegisterDestination").reset()
         }else {
        
          if (result?.errors && Array.isArray(result.errors)) {
          
            const mensagens = result.errors
              .map((err) => `• ${err.msg}`)
              .join("\n");

            Toastify({
              text: mensagens,
              duration: 5000,
              close: true,
              gravity: "top",
              position: "center",
              backgroundColor: "#f44336",
            }).showToast();
          } else {
            Toastify({
              text: result?.message || "Erro ao cadastrar destino.",
              duration: 3000,
              close: true,
              gravity: "top",
              position: "center",
              backgroundColor: response.status === 409 ? "orange" : "#f44336",
            }).showToast();
          };
        };

           } catch (error) {
            console.log('Erro no server' , error)
            Toastify({
            text: "Erro no server na inserção de destino.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
            }).showToast();
          }
        });
     };
     validationFormDestinationDescarte()
};

// listar destinos de descarte
async function getAllDestinationDescarte() {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    
    localStorage.removeItem("token");
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 2000);
    return;
  }

  try {
    const response = await fetch("/api/destination", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      Toastify({
        text: result?.message || "Erro ao carregar destinos.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();

      document.querySelector(".listDestinationDescart").innerHTML =
        "<p>Erro ao carregar destinos.</p>";
      return;
    }

    const destinos = result.destino;
    const destinoListDiv = document.querySelector(".listDestinationDescart");
    destinoListDiv.innerHTML = "";

    if (destinos.length > 0) {
      const wrapper = document.createElement("div");
      wrapper.className = "table-responsive";

      const tabela = document.createElement("table");
      tabela.className = "table table-sm table-hover table-striped table-bordered tableDest";

      // Cabeçalho
      const cabecalho = tabela.createTHead();
      const linhaCabecalho = cabecalho.insertRow();
      const colunas = [
        "Selecionar",
        "Nome",
        "Cidade",
        "Rua",
        "Bairro",
        "Estado",
        "Ativo",
        "Tipo"
      ];

      colunas.forEach((coluna) => {
        const th = document.createElement("th");
        th.textContent = coluna;

        if (["Selecionar", "Código", "CEP", "Estado", "Ativo"].includes(coluna)) {
          th.classList.add("text-center", "px-2", "py-1", "align-middle", "wh-nowrap");
        } else {
          th.classList.add("px-3", "py-2", "align-middle");
        }

        linhaCabecalho.appendChild(th);
      });

      // Corpo
      const corpo = tabela.createTBody();
      destinos.forEach((dest) => {
        const linha = corpo.insertRow();
        linha.setAttribute("data-dereid", dest.dereid);

        // Checkbox
        const checkboxCell = linha.insertCell();
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "selectDestino";
        checkbox.value = dest.dereid;
        
        const destData = JSON.stringify(dest)
        if(destData){
          checkbox.dataset.destino = destData;
        }
        
        checkbox.className = "form-check-input m-0";
        checkboxCell.classList.add("text-center", "align-middle", "wh-nowrap");
        checkboxCell.appendChild(checkbox);

        // Dados
        const dados = [
          dest.derenome,
          dest.derecida,
          dest.dererua,
          dest.derebair,
          dest.dereestd,
          dest.dereativ ? "Sim" : "Não",
          dest.deretipo
        ];

        dados.forEach((valor, index) => {
          const td = linha.insertCell();
          td.textContent = valor || "";
          td.classList.add("align-middle", "text-break");

          const coluna = colunas[index + 1];
          if (["Código", "CEP", "Estado", "Ativo"].includes(coluna)) {
            td.classList.add("text-center", "wh-nowrap", "px-2", "py-1");
          } else {
            td.classList.add("px-3", "py-2");
          }
        });
      });

      wrapper.appendChild(tabela);
      destinoListDiv.appendChild(wrapper);
    } else {
      destinoListDiv.innerHTML = "<p class='text-light'>Nenhum destino cadastrado.</p>";
    }
  } catch (error) {
    console.error("Erro ao carregar destinos:", error);
    Toastify({
      text: "Erro de conexão com o servidor.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    document.querySelector(".listDestinationDescart").innerHTML =
      "<p>Erro ao carregar destinos.</p>";
  };
};

// DELETAR DESTINO DE DESCARTE
function deleteDestination() {
  const buttonDeleteDestination = document.querySelector(".buttonDeleteDestination");
  
  buttonDeleteDestination.addEventListener("click", async () => {
    const selectedCheckbox = document.querySelector('input[name="selectDestino"]:checked');

    if (!selectedCheckbox) {
      Toastify({
        text: "Selecione um destino para excluir.",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
      return;
    }

    const destinoSelecionado = JSON.parse(selectedCheckbox.dataset.destino);
    const destinoId = destinoSelecionado.dereid;

    const confirmacao = confirm(`Tem certeza de que deseja excluir o destino com código ${destinoId}?`);
    if (!confirmacao) {
      return;
    }

    await deleteDestino(destinoId, selectedCheckbox.closest("tr"));
  });

  // função interna que faz o fetch
  async function deleteDestino(id, destinoRow) {
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
      const response = await fetch(`/api/destination/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        Toastify({
          text: "Destino excluído com sucesso!",
          duration: 2000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#1d5e1d",
        }).showToast();

        destinoRow.remove();
      } else {
        Toastify({
          text: data.message || "Erro na exclusão do destino.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#f44336",
        }).showToast();
      }
    } catch (error) {
      console.error("Erro ao excluir destino:", error);
      Toastify({
        text: "Erro ao excluir destino. Tente novamente.",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
    };
  };
};

//Atualização de destino 

 function updateDestination() {
   
  const buttonEdit = document.querySelector('.buttonEditDestination')
  if(buttonEdit){
     buttonEdit.addEventListener('click' , ()=>{
            
      const selectedCheckbox = document.querySelector('input[name="selectDestino"]:checked');

      if (!selectedCheckbox) {
        Toastify({
        text: "Selecione um destino para editar",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
       }).showToast();
       return;
     }
      
      const listDestinationDescart = document.querySelector('.listDestinationDescart')
      if(listDestinationDescart){
        listDestinationDescart.classList.remove('flex')
        listDestinationDescart.style.display = 'none'
       
      }

      const btnMainPageDestination = document.querySelector('.buttonsMainPage')
      if(btnMainPageDestination){
         btnMainPageDestination.classList.remove('flex')
         btnMainPageDestination.classList.add('hidden') 
         btnMainPageDestination.style.display = 'none'

      }

      const containerEditDestination = document.querySelector('.containerFormEditDestination')
      if(containerEditDestination){
        containerEditDestination.classList.remove('hidden')
        containerEditDestination.style.display = 'flex'
      }

      const dataDestination = selectedCheckbox.getAttribute('data-destino')
      if(!dataDestination){
        console.warn('não possui dados')
      }
       
      try {
         const destinationSelect = JSON.parse(dataDestination)
      
      const campos = [
          { id: "editNomeDest", valor: destinationSelect.derenome },
          { id: "editCepDest", valor: destinationSelect.derecep },
          { id: "editCidaDest", valor: destinationSelect.derecida },
          { id: "editRuaDest", valor: destinationSelect.dererua },
          { id: "editBairDest", valor: destinationSelect.derebair },
          { id: "editEstdDest", valor: destinationSelect.dereestd },
          { id: "editAtivDest", valor: destinationSelect.dereativ ? "Sim" : "Não" },
          { id: "editTipoDest", valor: destinationSelect.deretipo }
        ];

        campos.forEach(({ id, valor }) => {
          const elemento = document.getElementById(id);
          if (!elemento) {
            console.warn(`Elemento com ID '${id}' não encontrado.`);
            return;
          }

          if (elemento.tagName === "SELECT") {
            const option = [...elemento.options].find(opt => opt.value === valor);
            if (option) {
              elemento.value = valor;
            }
          } else {
            elemento.value = valor || "";
          }
        });

        // Guardar o ID no formulário
        const form = document.getElementById("formEditDestination");
        form.dataset.destinationId = destinationSelect.dereid;

      } catch (error) {
         console.error('Erro ao carregar destino selecionado')
        Toastify({
        text: "Erro ao carregar destino selecionado",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
       }).showToast();
      }
     
   });
 };
};

//EDITAR
async function editAndUpdateDestination() {

  const form = document.getElementById("formEditDestination");
    const id = form.dataset.destinationId;

    if (!id) {
      console.error("ID do destino não encontrado.");
      return;
    }
    
             
    const body = {
      nomeDest: document.getElementById("editNomeDest").value,
      cepDest: document.getElementById("editCepDest").value,
      cidaDest: document.getElementById("editCidaDest").value,
      ruaDest: document.getElementById("editRuaDest").value,
      bairDest: document.getElementById("editBairDest").value,
      estdDest: document.getElementById("editEstdDest").value,
      ativDest: document.getElementById("editAtivDest").value === "Sim",
       tipoDest: document.getElementById("editTipoDest").value
    };

    try {
      const confirmed = confirm(`Tem certeza de que deseja atualizar esse destino?`);
      if (!confirmed) return;

      const response = await fetch(`/api/destination/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        Toastify({
          text: "Destino atualizado com sucesso!",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#1d5e1d",
        }).showToast();

        form.reset();
        form.removeAttribute("data-destination-id");
        document.querySelector(".containerFormEditDestination").style.display = "none";

      } else {
        const error = await response.json();
         Toastify({
          text: `${error.message}` || "Errp ao atualizar destino",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#f44336",
        }).showToast();
        throw new Error(error.message || "Erro ao atualizar destino");
      }

    } catch (error) {
      console.error("Erro na atualização:", error);
      Toastify({
        text: "Erro no server para atualizar destino",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
    };
};


