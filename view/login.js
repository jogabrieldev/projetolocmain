
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
              text: 'Login com sucesso',
              duration: 3000,
              close: true,
              gravity: 'top',
              position: 'right',
              backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
          }).showToast();

             window.location.href = 'screenMain/main.html'
        } else {
  
          console.log("deu errado");
        }
       })
      
      
   
});
