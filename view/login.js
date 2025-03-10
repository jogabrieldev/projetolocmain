

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

document.querySelector("#formLogin").addEventListener("submit", async (event) => {
 
  event.preventDefault()
  const username = document.querySelector("#user").value;
  const password = document.querySelector("#pin").value;

  
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
            onClick: function(){} // Callback after click
          }).showToast();

          setTimeout(() => {
            window.location.href = 'screenMain/main.html';
          }, 2000);

          
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
          onClick: function(){} // Callback after click
        }).showToast();

        console.log("deu errado");
      }
       })
        
  })
      
      
   

