document.addEventListener('DOMContentLoaded' , ()=>{
   
    const btnLoadClientJuri = document.querySelector('.btnLoadClientJuri')
    if(btnLoadClientJuri){
         btnLoadClientJuri.addEventListener('click' , async (event)=>{
           event.preventDefault()
           
        try {

             const response = await fetch('/clientemp', {
             method: "GET",
           });
          if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
         const html = await response.text();
         const mainContent = document.querySelector("#mainContent");
          
         if (mainContent) {
           mainContent.innerHTML = html;
            
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

         const containerClientInterprise = document.querySelector(".containerAppClientInterprise");
        const btnMainPageClient = document.querySelector(".buttonsMainPage");
        const listingResiduo = document.querySelector(".listResiduo");
        // const editFormClient = document.querySelector(".formEditClient");
        const informative = document.querySelector(".information");

        if (containerClientInterprise) containerClientInterprise.style.display = "flex";
        if (btnMainPageClient) btnMainPageClient.style.display = "flex";
        if (listingResiduo) listingResiduo.style.display = "flex";
        // if (editFormClient) editFormClient.style.display = "none";
        if (informative) {
          informative.style.display = "block";
          informative.textContent = "SEÇÃO CLIENTE EMPRESA";
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
})
