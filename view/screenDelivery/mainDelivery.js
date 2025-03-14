const btnDelivery = document.querySelector('.delivery')
btnDelivery.addEventListener('click' , ()=>{
      const deliveryFinish = document.querySelector('.deliveryFinish')
      deliveryFinish.style.display = 'flex'

      const containerAppLocation = document.querySelector(".containerAppLocation");
      containerAppLocation.style.display = "none";

      const containerLogistica = document.querySelector(".containerLogistica");
      containerLogistica.style.display = "none";
})

