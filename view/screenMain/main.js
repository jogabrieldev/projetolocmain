const buttonOutStart = document.querySelector(".material-symbols-outlined");
buttonOutStart.addEventListener("click", () => {
  window.location.reload()
});

const btnStartRegister = document.getElementById('btnStartRegister');

btnStartRegister.addEventListener('click', () => {
   const menuButton =  document.querySelector('#cadastrosMenu').style.display = 'flex'

   if(menuButton){
      document.querySelector('.btnRegisterLocation').style.display = 'none'
      document.querySelector(".btnLogistic").style.display = 'none'
      document.querySelector('.delivery').style.display = 'none'
   }
});

btnStartRegister.addEventListener('dblclick', () => {
  const cadastrosMenu = document.querySelector('#cadastrosMenu');
  cadastrosMenu.style.display = 'none';

  document.querySelector('.btnRegisterLocation').style.display = 'flex';
  document.querySelector(".btnLogistic").style.display = 'flex';
  document.querySelector('.delivery').style.display = 'flex';
});

