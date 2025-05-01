// const Toastify = require('toastify-js')


const btnRegister = document.querySelector("#buttonRegister");
btnRegister.addEventListener("click", () => {
  validFieldName();
  validFieldFant();
});

const form = document.querySelector("#form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  //se tiver tudo certo
});
//ValidFieldName
function validFieldName() {
 const nome = document.querySelector("#name");
 if (isNaN(nome.value)) {
    nome.style.border = '0px';
    console.log("Nome valido");
 }else {
    Toastify({
      text: "Insira um nome valido",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "red ",
      },
      onClick: function () {},
    }).showToast();
    nome.style.border = '2px , solid , red';
  };
 if (nome.value.length < 4) {
    Toastify({
      text: "Nome deve ter mais de 4 caracteres",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "red",
      },
      onClick: function () {},
    }).showToast();
    nome.style.border = '2px , solid , red';
}else{
    console.log("nome validado 2");
  }
};

function validFieldFant(){
 const nameFan = document.querySelector('#nameFan')
 if(isNaN(nameFan.value)){
        nameFan.style.borde = '0px'
        console.log('nome Fantasia valido')
 }else{
        Toastify({
            text: "Nome fantasia invalido",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
            style: {
              background: "red ",
            },
            onClick: function () {},
          }).showToast();
          nameFan.style.border = '2px , solid , red'
    };
};


function validFieldPj(){
    
}

/*
const cep = document.querySelector('#cep')
const road = document.querySelector('#road')
const city =  document.querySelector('#city')
const state =  document.querySelector('#state')
const phone = document.querySelector('#phone')
const mail = document.querySelector('#mail')
const bank = document.querySelector('#bank')
const cont = document.querySelector('#cont')
const agency = document.querySelector('#agency')
const pix = document.querySelector('#pix')
*/
