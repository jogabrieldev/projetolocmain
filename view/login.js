
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
       .then((responseData)=>{

        if(responseData.ok) {
          // console.log(response);
            //  alert('Usuario acessou')
            Toastify({
              text: "Login com sucesso",
              duration: 2000,
              destination: "https://github.com/apvarun/toastify-js",
              newWindow: true,
              close: true,
              gravity: "top", // `top` or `bottom`
              position: "center", // `left`, `center` or `right`
              stopOnFocus: true, // Prevents dismissing of toast on hover
              style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
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
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "red",
            },
            onClick: function(){} // Callback after click
          }).showToast();

          console.log("deu errado");
        }
       })
      
      
   
});
