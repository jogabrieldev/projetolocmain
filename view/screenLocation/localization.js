

function addLocalizationInLocation(){
    const btnAddLocalization = document.getElementById('addlocalization')
    if(btnAddLocalization){
        btnAddLocalization.addEventListener('click', ()=>{
              const containerMaps = document.querySelector('.containerMaps')
              if(containerMaps){
                 containerMaps.classList.remove('hidden')
                 containerMaps.classList.add('flex')
              }
        })
    }

    const buttonExitAddlocalization = document.querySelector('.btnExitAddLoc')
    if(buttonExitAddlocalization){
        buttonExitAddlocalization.addEventListener('click' , ()=>{
            const containerMaps = document.querySelector('.containerMaps')
              if(containerMaps){
                 containerMaps.classList.remove('flex')
                 containerMaps.classList.add('hidden')
              }
        })
    }
}

function saveLocalizationInCache(){
        
    const buttonSaveLocalization = document.querySelector('.btnSaveLocalization')
      if(buttonSaveLocalization){
       buttonSaveLocalization.addEventListener('click' , ()=>{
            
     try {
     
       const localizationRua = document.getElementById('enderecoRuaInput').value.trim()
       const localizationCep = document.getElementById('enderecoCepInput').value.trim()
       const localizationQdLt = document.getElementById('enderecoQdLtInput').value.trim()
       const localizationBairro = document.getElementById('enderecoBairroInput').value.trim()
        const localizationCida = document.getElementById('enderecoCityInput').value.trim()
       const localizationRefe = document.getElementById('enderecoRefeInput').value.trim()
         
        const dateForSave = {
            localizationBairro,
            localizationCida,
            localizationCep,
            localizationRua,
            localizationQdLt,
            localizationRefe
        }

        
        const token = localStorage.getItem('token')
        if(token){
           localStorage.setItem('dadosInputs' , JSON.stringify(dateForSave))
           Toastify({
            text: "Endereço Salvo para locação",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "green",
          }).showToast();
          limparCamposInputs()
        }else{
            Toastify({
            text: "Token não fornecido! faça login novamente",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
          }).showToast();
          
        }
        
         return 
     } catch (error) {
         console.erro('Erro para salvar os dados em cache', error)
    }

     })
   }       
}

function limparCamposInputs() {
  document.getElementById('enderecoRuaInput').value = '';
  document.getElementById('enderecoCepInput').value = '';
  document.getElementById('enderecoQdLtInput').value = '';
  document.getElementById('enderecoBairroInput').value = '';
  document.getElementById('enderecoCityInput').value = '';
  document.getElementById('enderecoRefeInput').value =""
}