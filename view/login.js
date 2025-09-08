
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


function loginUserCenter() {
  const form = document.querySelector("#formLogin");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const username = document.querySelector("#user").value.trim();
      const password = document.querySelector("#pin").value.trim();

      try {
        // Tenta primeiro como funcionário
        let responseData = await fetch("/autenticar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });

        let response = await responseData.json();

        if (!response.token) {
  
          responseData = await fetch("/api/drive/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
          });
          response = await responseData.json();
        }

        if (response.token) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("tipoUsuario", response.tipo);
          localStorage.setItem('user' , response.user);

          Toastify({
            text: "Login com sucesso",
            duration: 3000,
            gravity: "top",
            position: "center",
            style: { background: "green" }
          }).showToast();

          setTimeout(() => {
            if (response.tipo === "motoristaInterno") {
              window.location.href = "screenDriverMobile/driverPage.html";

            } else if(response.tipo === "motoristaExterno"){
              window.location.href = "screenDriverMobile/driverExterno/driverExterno.html"
            }
            else {
              window.location.href = "screenMain/main.html";
            }
          }, 300);

        } else {
          Toastify({
            text: response.message || "Usuário ou senha inválidos",
            duration: 3000,
            gravity: "top",
            position: "center",
            style: { background: "red" }
          }).showToast();
        }
      } catch (error) {
        console.error("Erro no login:", error);
        Toastify({
          text: "Erro no servidor, tente novamente",
          duration: 3000,
          gravity: "top",
          position: "center",
          style: { background: "red" }
        }).showToast();
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", loginUserCenter);



 

  


      
      
   

