

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

function maskFieldLocalization(){
    $(document).ready(function () {

    $("#enderecoCepInput").mask("00000-000");
});
}

 function saveLocalizationInCache(){
        
    const buttonSaveLocalization = document.querySelector('.btnSaveLocalization')
      if(buttonSaveLocalization){
       buttonSaveLocalization.addEventListener('click' , async ()=>{

         const localizationCep = document
        .querySelector("#enderecoCepInput")
        .value.replace(/\D/g, "");
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${localizationCep}/json/`
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar o CEP.");
        }

        const data = await response.json();

        if (data.erro) {
          Toastify({
            text: "CEP inválido.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
          }).showToast();
          return;
        }

        // Preenchendo os campos do formulário
        const ruaField = document.getElementById("enderecoRuaInput");
        const cityField = document.getElementById("enderecoCityInput");
        const regionField = document.getElementById("enderecostateInput");
        const bairroField =document.getElementById('enderecoBairroInput')

        if (ruaField) {
          ruaField.value = `${data.logradouro}` || "";
          
        }
        if (cityField) {
          cityField.value = data.localidade || "";
          
        }
        if (regionField) {
          regionField.value = data.uf || "";
          
        }

        if(bairroField){
           bairroField.value = `${data.bairro}`
        }
      } catch (error) {
        console.error("Erro ao buscar o CEP:", error);
        Toastify({
          text: "Erro ao buscar o CEP, tente novamente.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
        return;
      }
            
     try {

       const localizationRua = document.getElementById('enderecoRuaInput').value.trim()
       const localizationCep = document.getElementById('enderecoCepInput').value.trim()
       const localizationRegion = document.getElementById('enderecoRegionInput').value.trim()
       const localizationBairro = document.getElementById('enderecoBairroInput').value.trim()
        const localizationCida = document.getElementById('enderecoCityInput').value.trim()
       const localizationRefe = document.getElementById('enderecoRefeInput').value.trim()

      

         
        const dateForSave = {
            localizationBairro,
            localizationCida,
            localizationCep,
            localizationRua,
            localizationRegion,
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
          // limparCamposInputs()
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