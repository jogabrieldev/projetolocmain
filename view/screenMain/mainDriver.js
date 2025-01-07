const btnInitCadDrive = document.querySelector('.btnCadMotorista')
btnInitCadDrive.addEventListener('click' , ()=>{

    const containerAppFabri = document.querySelector('.containerAppFabri')
      containerAppFabri.style.display = 'none'

    const containerAppClient = document.querySelector(".containerAppClient");
      containerAppClient.style.display = 'none'

    const containerAppBens = document.querySelector(".containerAppBens");
      containerAppBens.style.display = 'none'

    const containerAppForn = document.querySelector(".containerAppForn")
      containerAppForn.style.display = 'none'

    const containerAppProd = document.querySelector('.containerAppProd')
    containerAppProd.style.display = 'none'

    const containerAppTypeProd = document.querySelector('.containerAppTipoProd')
    containerAppTypeProd.style.display = 'none'

    const containerAppDriver = document.querySelector('.containerAppDriver')
    containerAppDriver.style.display = 'flex'
});

const registerDriver = document.querySelector('.registerDriver')
registerDriver.addEventListener('click' , ()=>{
     
    const formRegisterDriver = document.querySelector('.RegisterDriver')
     formRegisterDriver.style.display = 'flex'

     const listingDriver = document.querySelector('.listingDriver')
      listingDriver.style.display = 'none'

     const btnPageMain = document.querySelector('.btnInitPageMain')
     btnPageMain.style.display = 'none'
})

const btnOutPageEditDrive = document.querySelector('.btnOutPageRegister')
btnOutPageEditDrive.addEventListener('click' , (event )=>{
   
    event.preventDefault()
   
    const formRegisterDriver = document.querySelector('.RegisterDriver')
     formRegisterDriver.style.display = 'none'

     const listingDriver = document.querySelector('.listingDriver')
      listingDriver.style.display = 'flex'

     const btnPageMain = document.querySelector('.btnInitPageMain')
     btnPageMain.style.display = 'flex'

})