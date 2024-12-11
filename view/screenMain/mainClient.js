// botoes relacionado aos clientes

const buttonStartCadClient = document.querySelector(".btnCadClie");
buttonStartCadClient.addEventListener("click", () => {
  const contentOptionsClient = document.querySelector(".optionsClient");
  const contentOptionsGoods = document.querySelector(".optionsBens");
  if ((contentOptionsClient.style.display = "none")) {
    contentOptionsClient.style.display = "flex";
  }
  if ((contentOptionsClient.style.display = "flex")) {
    contentOptionsGoods.style.display = "none";
  }
});
const registerClient = document.querySelector(".registerClient");
registerClient.addEventListener("click", () => {
  const screenRegisterClient = document.querySelector(".showContentClient");
  const contentOptionsClient = document.querySelector(".optionsClient");

  if ((screenRegisterClient.style.display = "none")) {
       screenRegisterClient.style.display = "flex";
    contentOptionsClient.style.display = "none";
  }
});