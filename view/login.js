


//iconPassword
function showPassword() {
  const inputPassword = document.querySelector("#pin");
  const iconPassword = document.querySelector("#btn-senha");

  if (inputPassword.type === "password") {
    inputPassword.setAttribute("type", "text");
    iconPassword.classList.replace("bi-eye-fill", "bi-eye-slash-fill");
  } else {
    inputPassword.setAttribute("type", "password");
    iconPassword.classList.replace("bi-eye-slash-fill", "bi-eye-fill");
  }
}

//to-enter-page main /valid login
 function submitFormLogin(){
  const form = document.querySelector("#formLogin")
  if(form){
    form.addEventListener("submit", async (event) => {

      event.preventDefault()
    const username = document.querySelector("#user").value.trim();
    const password = document.querySelector("#pin").value.trim();
  
    
         await fetch('/autenticar' , {
          method: 'POST',
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({username , password})
         })
         .then((responseData)=> responseData.json())
         .then((response)=>{
          if(response.token) {
            localStorage.setItem('token' ,  response.token )
            Toastify({
              text: "Login com sucesso",
              duration: 3000,
              destination: "https://github.com/apvarun/toastify-js",
              newWindow: true,
              close: true,
              gravity: "top", 
              position: "center", 
              stopOnFocus: true, 
              style: {
                background: "green",
              },
              onClick: function(){} 
            }).showToast();
           
            setTimeout(()=>{
            window.location.href = "screenMain/main.html"
            },2000)
            
            return;
            
        } else {
          Toastify({
            text: "Usuario invalido",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top",
            position: "center", 
            stopOnFocus: true, 
            style: {
              background: "red",
            },
            onClick: function(){} 
          }).showToast();
         return;
        }
         })
     })
 }
}

 
const buttonSubmitLogin = document.getElementById('buttonLogin')
if(buttonSubmitLogin){
   buttonSubmitLogin.addEventListener('click', submitFormLogin())
}
  


      
      
   

