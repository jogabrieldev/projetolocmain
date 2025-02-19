
$(document).ready(function () {

  $("#cpf").mask("000.000.000-00")
  

 
  $("#clieCelu").mask("(00) 00000-0000");

 
  $("#clieCep").mask("00000-000");

});

$("#formRegisterClient").submit(function (e) {
    const celular = $("#clieCelu").val().replace(/\D/g, ""); 
    $("#clieCelu").val(celular); 
});






  