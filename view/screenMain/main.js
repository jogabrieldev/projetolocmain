const buttonOutStart = document.querySelector(".material-symbols-outlined");
buttonOutStart.addEventListener("click", () => {
  window.location.reload()
});

const btnStartRegister = document.getElementById('btnStartRegister');
if(btnStartRegister){

  btnStartRegister.addEventListener('click', () => {
    const menuButton =  document.querySelector('#cadastrosMenu')
    if(menuButton){
       menuButton.classList.remove('hidden')
       menuButton.classList.add('flex')
    }
    
       const btnLocation =  document.querySelector('.btnRegisterLocation')
       if(btnLocation){
        btnLocation.classList.remove('flex')
        btnLocation.classList.add('hidden')
       }
        
       const btnLogistic = document.querySelector('.btnLogistic')
       if(btnLogistic){
         btnLogistic.classList.remove('flex')
         btnLogistic.classList.add('hidden')
       }
       
       const btnDelivery = document.querySelector('.delivery')
       if(btnDelivery){
          btnDelivery.classList.remove('flex')
          btnDelivery.classList.add('hidden')
       }
    
 });

 btnStartRegister.addEventListener('dblclick', () => {
  const cadastrosMenu = document.querySelector('#cadastrosMenu');
  if(cadastrosMenu){
     cadastrosMenu.classList.remove('flex')
     cadastrosMenu.classList.add('hidden')
  }
 
   const btnLocation = document.querySelector('.btnRegisterLocation')
    if(btnLocation){
      btnLocation.classList.remove('hidden')
      btnLocation.classList.add('flex')
    }
  const btnLogistics = document.querySelector('.btnLogistic')
  if(btnLogistics){
     btnLogistics.classList.remove("hidden")
     btnLogistics.classList.add('flex')
  }
    
  const buttonDelivery = document.querySelector('.delivery')
  if(buttonDelivery){
     buttonDelivery.classList.remove('hidden')
     buttonDelivery.classList.add('flex')
  }
 
});

}

document.addEventListener("DOMContentLoaded", () => {
   const mainContent = document.getElementById("mainContent");

   function showWelcome() {
     const animationHTML = `
       <section id="welcomeAnimation" class="welcome-container text-white">
         <div class="text-center animate__animated animate__fadeInDown">
           <svg width="100" height="100" viewBox="0 0 24 24" fill="none"
             stroke="#00d1ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             class="mb-4 animate__animated animate__pulse animate__infinite">
             <path d="M20 6L9 17l-5-5" />
           </svg>
           <h1 class="fw-bold mb-3 typewriter">Bem-vindo ao sistema SGTTEC!</h1>
           
         </div>
       </section>
     `;
     mainContent.innerHTML = animationHTML;
   }

   function hideWelcome() {
     const welcome = document.getElementById("welcomeAnimation");
     if (welcome) {
       welcome.classList.add("hidden");
     }
   }

   // Mostra após login
   showWelcome();

   // Oculta ao clicar em qualquer botão de navegação
   const buttons = document.querySelectorAll(
     "#btnLoadBens, .btnCadClie, .btnCadForn, .btnCadProd, .btnCadFabri, .btnCadTypeProd, .btnCadMotorista, .btnCadAutomo, .btnRegisterLocation, .btnLogistic, .delivery"
   );

   buttons.forEach((btn) => {
     btn.addEventListener("click", () => {
       hideWelcome();
     });
   });
 });


