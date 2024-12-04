// funcionalidade dos botoes do menu da tela
//button bens
const buttonStartCadBens = document.querySelector('.btnCadBens')
buttonStartCadBens.addEventListener('click' , ()=>{
    const contentOptionsGoods = document.querySelector('.optionsBens')
    const contentOptionsClient = document.querySelector('.optionsClient')
    
    
   
     if(contentOptionsGoods.style.display ='none'){
         contentOptionsGoods.style.display ='flex';

     } if(contentOptionsGoods.style.display ='flex'){
         contentOptionsClient.style.display = 'none'

     }
});

const buttonOutStart = document.querySelector('.material-symbols-outlined')
buttonOutStart.addEventListener('click', ()=>{
    window.location.href = 'main.html'
})

const buttonRegisterGoods = document.querySelector('.registerGoods');
buttonRegisterGoods.addEventListener('click' , ()=>{
  const registerBens = document.querySelector('.showContentBens');
  const contentOptions = document.querySelector('.optionsBens');
   
     if(contentOptions.style.display = 'flex'){
          contentOptions.style.display = 'none';
          registerBens.style.display = 'flex';
     }
     
    
});

const buttonListGoods = document.querySelector('.listGoods')
buttonListGoods.addEventListener('click' , ()=>{
     const listingGoods = document.querySelector('.listingBens')
     const contentOptions = document.querySelector('.optionsBens');
       if(listingGoods.style.display = 'none'){
          listingGoods.style.display = 'flex'
          contentOptions.style.display = 'none'
       }
})

const buttonOutGoods = document.querySelector('.btnOut');
buttonOutGoods.addEventListener('click' , ()=>{
    const ContentBens = document.querySelector('.showContentBens');
    if(ContentBens.style.display ='flex'){
        return  ContentBens.style.display ='none'
     }
});
function toCurretBug(){
    const ContentBens = document.querySelector('.showContentBens');
    const contentOptions = document.querySelector('.optionsBens');
    if(ContentBens.style.display = 'flex'){
       contentOptions.style.display = 'none'
    }
    
 }

// button client
const buttonStartCadClient = document.querySelector('.btnCadClie')
buttonStartCadClient.addEventListener('click' , ()=>{
   const contentOptionsClient = document.querySelector('.optionsClient')
   const contentOptionsGoods = document.querySelector('.optionsBens')
      if(contentOptionsClient.style.display = 'none'){
           contentOptionsClient.style.display = 'flex'

      }if( contentOptionsClient.style.display = 'flex'){
             contentOptionsGoods.style.display = 'none'
      }
})
const registerClient = document.querySelector('.registerClient')
registerClient.addEventListener('click' , ()=>{
   const screenRegisterClient = document.querySelector('.showContentClient') 
   const contentOptionsClient = document.querySelector('.optionsClient')
    
      if(screenRegisterClient.style.display = 'none'){
        screenRegisterClient.style.display = 'flex'
        contentOptionsClient.style.display = 'none'
      }
})



// fazer o cadastro do item
const formRegister = document.querySelector('#formRegisterBens').addEventListener('submit' , async (event)=>{
    event.preventDefault()
    // const nome = document.querySelector('#name').value
    // const modelo = document.querySelector('#model').value
    // const serial = document.querySelector('#serial').value
    // const codForne = document.querySelector('#codForne').value
    // const dtCompra = document.querySelector('#dtCompra').value
    // const valor = document.querySelector('#valor').value
    // const ntFiscal = document.querySelector('#ntFiscal').value
    // const status = document.querySelector('#status').value
    // const dtStatus = document.querySelector('#dtStatus').value
    // const fabricante = document.querySelector('#fabri').value
    // const renavam = document.querySelector('#rena').value
    // const placa = document.querySelector('#placa').value
    // const alugado = document.querySelector('#alug').value
    // const chassi = document.querySelector('#chassi').value
    // const cor = document.querySelector('#cor').value
    // const hrStatus = document.querySelector('#hrStatus').value
    // const kmAtual = document.querySelector('#kmAtual').value
    // const valorAlugado = document.querySelector('#valorAlug').value
   
     const formData = new FormData(event.target)
     const data = Object.fromEntries(formData.entries())
    // const valueFieldsForm = [nome , modelo , serial , codForne ,dtCompra , valor , ntFiscal , status , dtStatus , fabricante,renavam , placa , alugado , chassi , cor , hrStatus , kmAtual,valorAlugado ]
    
    try {
        
        await fetch('/submit' , {
            method: 'POST',
             headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({data})
        }).then((response)=>{
            
            if(response.ok){
                console.log('deu certo' , response)
            }else{
                console.log('deu ruim')
            }

        })

    } catch (error) {
        console.log('erro no envio',  error)
    }
    

})