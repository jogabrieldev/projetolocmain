
$(document).ready(function () {
  
  $("#cpf").mask("000.000.000-00")
    
  $("#clieCelu").mask("(00) 00000-0000");

  $("#clieCep").mask("00000-000");

  $("#editCliecpf").mask("000.000.000-00")
    
  $("#editClieCelu").mask("(00) 00000-0000");

 
  $("#editClieCep").mask("00000-000");

});

$(document).ready(function () {

   
    $("#fornCnpj").mask('00.000.000/0000-00')
   
    $("#fornCelu").mask("(00) 00000-0000");
  
    $("#fornCep").mask("00000-000");

    $("#editFornCnpj").mask('00.000.000/0000-00')
   
    $("#editFornCelu").mask("(00) 00000-0000");
  
    $("#editFornCep").mask("00000-000");
  
  
});

$(document).ready(function () {

    $("#prodValor").mask('R$ 000.000.000,00',{ reverse: true,  } )
   
    $("#prodPeli").mask('R$ 000.000.000,00',{ reverse: true,  } );
  
    $("#prodPebr").mask('R$ 000.000.000,00', { reverse: true,  });

    $("#editProdValor").mask('R$ 000.000.000,00',{ reverse: true,  } )
   
    $("#editProdPeli").mask('R$ 000.000.000,00',{ reverse: true,  } );
  
    $("#editProdPebr").mask('R$ 000.000.000,00', { reverse: true,  });
  
});

$(document).ready(function () {

    $("#valorCp").mask('R$ 000.000.000,00',{ reverse: true,  } )
   
    $("#valorAlug").mask('R$ 000.000.000,00',{ reverse: true,  } );

    $("#valorCpMain").mask('R$ 000.000.000,00',{ reverse: true,  } )
   
    $("#valorAlugMain").mask('R$ 000.000.000,00',{ reverse: true,  } );
  
});









  