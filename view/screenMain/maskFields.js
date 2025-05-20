
$(document).ready(function () {
  
  $("#cpf").mask("000.000.000-00")
    
  $("#clieCelu").mask("(00) 00000-0000");

  $("#clieCep").mask("00000-000");

  $("#editCliecpf").mask("000.000.000-00")
    
  $("#editClieCelu").mask("(00) 00000-0000");

  $("#editClieCep").mask("00000-000");

  $("#clieCepLoc").mask("00000-000");

  $("#clieCeluLoc").mask("(00) 00000-0000");

  $("#cpfClientLoc").mask("000.000.000-00")
  
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

    $("#valorCpEdit").mask('R$ 000.000.000,00',{ reverse: true,  } )
   
    $("#valorAlugEdit").mask('R$ 000.000.000,00',{ reverse: true,  } );

    $("#valorCpMain").mask('R$ 000.000.000,00',{ reverse: true,  } )
   
    $("#valorAlugMain").mask('R$ 000.000.000,00',{ reverse: true,  } );
  
});

$(document).ready(function () {
  
    $("#motoCpf").mask("000.000.000-00")
      
    $("#motoCelu").mask("(00) 00000-0000");
  
    $("#motoCep").mask("00000-000");

    $("#editMotoCpf").mask("000.000.000-00")
      
    $("#editMotoCelu").mask("(00) 00000-0000");
  
    $("#editMotoCep").mask("00000-000");
  
  });


  
$(document).ready(function () {

  $("#placAuto").mask("SSS-0S00", {
    translation: {
      'S': { pattern: /[A-Za-z]/ },
    },
    placeholder: "___-__00",
    onKeyPress: function (val, e, field, options) {
      field.val(val.toUpperCase());
    }
  });

  $("#renaAuto").mask("00000000000");

  $("#chassAuto").on("input", function () {
    this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 17);
  });
});

  










  