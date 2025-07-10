

function validationFormGoods() {
  $('#formRegisterBens').validate({
    rules: {
      code: {
        required: true,
        minlength: 3
      },
      name: {
        required: true,
        minlength: 4
      },
      cofa: {
        required: true
      },
      model: {
        required: true
      },
      serial: {
        required: true,
        minlength: 5
      },
      dtCompra: {
        required: true,
        date: true
      },
      valorCpMain: {
        required: true
      },
      ntFiscal: {
        required: true,
        minlength: 5
      },
      cofo: {
        required: true,
      },
      status:{
        required:true
      },
      dtStatus:{
        required:true
      },
      hrStatus:{
         required:true
      },
      bensAtiv:{
         required:true
      }
    },
    messages: {
      code: {
        required: "OBRIGATORIO",
        minlength: "O código deve ter no mínimo 3 caracteres."
      },
      name: {
        required: "OBRIGATORIO",
        minlength: "O nome deve ter no mínimo 4 caracteres."
      },
      cofa: {
        required: "OBRIGATORIO"
      },
      model: {
        required: "OBRIGATORIO"
      },
      serial: {
        required: "OBRIGATORIO",
        minlength: "O número de série deve ter no mínimo 5 caracteres."
      },
      dtCompra: {
        required: "OBRIGATORIO",
        date: "Insira uma data no formato correto."
      },
      valorCpMain: {
        required: "OBRIGATORIO"
      },
      ntFiscal: {
        required: "OBRIGATORIO",
        minlength: "O número da nota fiscal deve ter no mínimo 5 caracteres."
      },
      cofo: {
        required: "OBRIGATORIO",
        minlength: "O código do fornecedor deve ter no mínimo 4 caracteres."
      },
      status:{
        required:"OBRIGATORIO"
      },
      dtStatus:{
        required:"OBRIGATORIO"
      },
      hrStatus:{
         required:"OBRIGATORIO"
      },
      bensAtiv:{
         required:"OBRIGATORIO"
      }
      
    },
    errorPlacement: function (error, element) {
      error.addClass('error-text');
      error.insertAfter(element);
    },
    highlight: function (element) {
      $(element).addClass('error-field');
    },
    unhighlight: function (element) {
      $(element).removeClass('error-field');
    },
    submitHandler: async function (form) {
      
    }
  });
 }


$(function () {
  validationFormGoods();
});
  

// Client
function validationFormClient(){
    $('#formRegisterClient').validate({
        rules: {
            clieCode: {
              required: true,
              minlength: 3
            },
            clieName: {
              required: true,
              minlength: 4
            },
            clieTiCli:{
              required:true
            },
            dtCad:{
                required:true ,
                date: true
            },
            dtNasc:{
                required: true,
                date: true
            },
            clieCelu:{
              required:true
            },
          
           clieCep:{
            required: true,
           },
           clieMail:{
            required: true
           }
           
      },
            messages: {
                clieCode: {
                  required: "OBRIGATORIO",
                  minlength: "O código deve ter no mínimo 3 caracteres."
                },
                clieName: {
                  required: "OBRIGATORIO",
                  minlength: "O nome deve ter no mínimo 4 caracteres."
                },
                clieTiCli:{
                  required:'OBRIGATORIO'
               },
                cpfAndCnpj:{
                required: 'OBRIGATORIO'
                },
                dtCad:{
                    required: 'OBRIGATORIO',
                    date: 'Insira uma data valida'
                },
                dtNasc:{
                    required: 'OBRIGATORIO',
                    date: 'insira uma data valida'
                },
                clieCelu:{
                   required: "OBRIGATORIO",
                   minlength: 'MINIMO 15 CARACTERES'
                },
                 clieCep:{
                  required: "OBRIGATORIO",
                  minlength: 'MINIMO 9 CARACTERES'
                 },
                 clieMail:{
                  required: "OBRIGATORIO"
                 }

            },

            errorPlacement: function (error, element) {
                error.addClass('error-text');
                error.insertAfter(element);
              },
              highlight: function (element) {
                $(element).addClass('error-field');
              },
              unhighlight: function (element) {
                $(element).removeClass('error-field');
              },
              submitHandler: function (form) {
                form.submit();
              }
    })
}
$(function () {
    validationFormClient();
  });

// FORMULARIO CLIENTE PAGE LOCATION 
function validationFormClientPageLocation(){
  $('#formRegisterClientLoc').validate({
      rules: {
        clieCodeLoc: {
            required: true,
            minlength: 4
          },
          clieNameLoc: {
            required: true,
            minlength: 4
          },
          clieTiCliLoc:{
            required:true
          },
          
          dtCadLoc:{
              required:true ,
              date: true
          },
          dtNascLoc:{
              required: true,
              date: true
          },
          clieCeluLoc:{
            required:true,
            minlength: 15
          },

         clieCepLoc:{
          required: true,
          minlength: 9
         },
         clieMailLoc:{
          required: true
         }
         
    },
          messages: {
            clieCodeLoc: {
                required: "OBRIGATORIO",
                minlength: "O código deve ter no mínimo 3 caracteres."
              },
              clieNameLoc: {
                required: "OBRIGATORIO",
                minlength: "O nome deve ter no mínimo 4 caracteres."
              },

              clieTiCliLoc:{
                required:"OBRIGATORIO"
              },
              cpfClientLoc: {
                  required: "OBRIGATORIO"
               
              },
              dtCadLoc:{
                  required: 'OBRIGATORIO',
                  date: 'Insira uma data valida'
              },
              dtNascLoc:{
                  required: 'OBRIGATORIO',
                  date: 'insira uma data valida'
              },
              clieCeluLoc:{
                 required: "OBRIGATORIO",
                 minlength: 'MINIMO 15 CARACTERES'
              },
               clieCepLoc:{
                required: "OBRIGATORIO",
                minlength: 'MINIMO 9 CARACTERES'
               },
               clieMailLoc:{
                required: "OBRIGATORIO"
               }

          },

          errorPlacement: function (error, element) {
              error.addClass('error-text');
              error.insertAfter(element);
            },
            highlight: function (element) {
              $(element).addClass('error-field');
            },
            unhighlight: function (element) {
              $(element).removeClass('error-field');
            },
            submitHandler: function (form) {
              form.submit();
            }
  })
}
$(function () {
  validationFormClientPageLocation();
});
 

 // fornecedor
  function validationFormForne(){
    $('#registerForn').validate({
        rules: {
            
          fornCode:{
            required: true ,
            minlength: 5
          },
          fornName:{
            required: true
          },
          nomeFan:{
             minlength:5
          },
          fornCnpj:{
            required: true,
          
          },
          fornCep:{
            required: true,
          },
          fornCelu:{
            required: true
          },
          fornMail:{
            required: true,
          },
          fornBank:{
            required: true
          },
          fornAge:{
             required: true,
             maxlength: 4
          },
          fornCont:{
            required: true,
            maxlength:8
          },
          fornPix:{
            required: true
         },
         fornDtcd:{
           required: true,
           date: true
         }

      },
            messages: {
              fornCode:{
                required: 'OBRIGATORIO',
                minlength: 'minimo 4 caracteres'
              },
              fornName:{
                 required:'OBRIGATORIO'
              },
              nomeFan:{
                minlength:'minimo 5 caracteres'
             },
             fornCnpj:{
               required:'OBRIGATORIO',
               minlength: 'MINIMO 18 CARACTERES'
             },
          
          fornCep:{
            required: "OBRIGATORIO"
          },
          fornCelu:{
            required: 'OBRIGATORIO',
            minlength:'MINIMO 15 CARACTERS'
          },
          fornMail:{
            required: 'OBRIGATORIO'
          },
          fornBank:{
            required: " OBRIGATORIO"
          },
          fornAge:{
            required: "OBRIGATORIO",
            maxlength: 'Maximo 4 caracteres'
         },
         fornCont:{
           required: "OBRIGATORIO",
           maxlength: 'Maximo 8 caracteres'
         },
         fornPix:{
            required: 'OBRIGATORIO'
         },
         fornDtcd:{
          required: 'OBRIGATORIO',
          date: 'Insira uma data valida'
        }
           
      },

            errorPlacement: function (error, element) {
                error.addClass('error-text');
                error.insertAfter(element);
              },
              highlight: function (element) {
                $(element).addClass('error-field');
              },
              unhighlight: function (element) {
                $(element).removeClass('error-field');
              },
              submitHandler: function (form) {
                form.submit();
              }
    })
}
$(function () {
    validationFormForne();
  });

  //produto
  function validationFormProd(){
    $('.formRegisterProduto').validate({
        rules: {
            
          prodCode:{
            required: true ,
          },
          prodDesc:{
            required: true
          },
          prodTipo:{
            required: true,
          },
          prodUni:{
            required: true,
            number: true
          },
          prodValor:{
             required: true
          },
          prodPeli:{
            required: true
          },
          prodPebr:{
            required: true
          },
          prodAtiv:{
            required: true
          },
          prodData:{
            required:true,
            date: true
          }
          

      },
            messages: {

              prodCode:{
                required: 'OBRIGATORIO',
              },
              prodDesc:{
                 required:'OBRIGATORIO'
              },
              prodTipo:{
                required:"OBRIGATORIO",
              },
              prodUni:{
                required: "OBRIGATORIO",
                number: "Insira o valor numerico"
              },
              prodValor:{
               required: "OBRIGATORIO"
             },
             prodPeli:{
              required: "OBRIGATORIO"
            },
            prodPebr:{
              required: "OBRIGATORIO"
            },
            prodAtiv:{
              required: "OBRIGATORIO"
            },
             prodData:{
              required: "OBRIGATORIO",
              date: 'Insira uma data valida'
             }

        },

            errorPlacement: function (error, element) {
                error.addClass('error-text');
                error.insertAfter(element);
              },
              highlight: function (element) {
                $(element).addClass('error-field');
              },
              unhighlight: function (element) {
                $(element).removeClass('error-field');
              },
              submitHandler: function (form) {
                form.submit();
              }
    })
}
$(function () {
    validationFormProd();
  });

// FAMILIA DE BEM

function validationFormFabric(){
  $('.formRegisterFabricante').validate({
      rules: {
          
        fabeCode:{
          required: true ,
        },
        fabeDesc:{
          required: true
        },
        fabeCate:{
           required: true
        },
        
        fabeCtct:{
          required: true
        },
        fabeCapa:{
          required: true
        }
        

    },
          messages: {

            fabeCode:{
              required: 'OBRIGATORIO',
            },
            fabeDesc:{
               required:'OBRIGATORIO'
            },
            fabeCate:{
             required: "OBRIGATORIO"
           },
            fabeCapa:{
              required:"OBRIGATORIO"
            },
           fabeCtct:{
            required: "OBRIGATORIO"
           },
           fabeCapa:{
            required: "OBRIGATORIO"
           }
          
          },

          errorPlacement: function (error, element) {
              error.addClass('error-text');
              error.insertAfter(element);
            },
            highlight: function (element) {
              $(element).addClass('error-field');
            },
            unhighlight: function (element) {
              $(element).removeClass('error-field');
            },
            submitHandler: function (form) {
              form.submit();
            }
  })
}
$(function () {
  validationFormFabric();
});

// tipo de produto

function validationFormTipoProd(){
  $('.formRegisterTipoProdu').validate({
      rules: {
          
        tpCode:{
          required: true ,
        },
        tpDesc:{
          required: true
        },
        tpCat:{
           required: true
        },
        tpSubCat:{
          required: true
        },
        tpCtct:{
          required: true
        }
        
    },
          messages: {

            tpCode:{
              required: "OBRIGATORIO" ,
            },
            tpDesc:{
              required: "OBRIGATORIO"
            },
            tpCat:{
               required: "OBRIGATORIO"
            },
            tpSubCat:{
              required: "OBRIGATORIO"
            },
            tpCtct:{
              required: "OBRIGATORIO"
            }
          
          },

          errorPlacement: function (error, element) {
              error.addClass('error-text');
              error.insertAfter(element);
            },
            highlight: function (element) {
              $(element).addClass('error-field');
            },
            unhighlight: function (element) {
              $(element).removeClass('error-field');
            },
            submitHandler: function (form) {
              form.submit();
            }
  })
}
$(function () {
  validationFormTipoProd();
});


// motorista 

function  validationFormMoto(){
  $('.formRegisterDriver').validate({
      rules: {
          
        motoCode:{
          required: true ,
        },
        motoNome:{
          required: true
        },
        motoDtnc:{
           required: true,
           date: true
        },
        motoCpf:{
          required: true,
          minlength:14
        },
        motoDtch:{
          required: true,
          date: true
        },
        motoDtvc:{
          required: true,
          date: true
        },
        motoctch:{
          required: true
        },
        motoOrem:{
          required: true
        },
        motoCelu:{
          required: true,
          minlength:15
        },
        motoCep:{
           required: true,
           minlength: 9
        },
        motoStat:{
           required:true
        },
        motoMail:{
            required:true
           },
        motoSitu:{
            required:true
           }


    },
          messages: {

            motoCode:{
              required: "OBRIGATORIO" ,
            },
            motoNome:{
              required: "OBRIGATORIO"
            },
            motoDtnc:{
               required: 'OBRIGATORIO',
               date: 'Insira uma data valida'
            },
            motoCpf:{
              required: "OBRIGATORIO",
              minlength: 'MINIMO 14 CARACTERES'
            },
            motoDtch:{
              required: "OBRIGATORIO",
              date: 'Insira uma data valida'
            },
            motoDtvc:{
              required: 'OBRIGATORIO',
              date: "Insira uma data valida"
            },
            motoctch:{
              required: "OBRIGATORIO"
            },
            motoOrem:{
              required: "OBRIGATORIO"
            },
            motoCelu:{
              required: "OBRIGATORIO",
              minlength: 'MINIMO 15 CARACTERES'
            },
            motoCep:{
               required: "OBRIGATORIO",
               minlength: 'MINIMO 9 CARACTERES'
            },
            motoStat:{
              required: "OBRIGATORIO"
           },motoMail:{
              required: "OBRIGATORIO"
           },
           motoSitu:{
            required: "OBRIGATORIO"
           }

          },

          errorPlacement: function (error, element) {
              error.addClass('error-text');
              error.insertAfter(element);
            },
            highlight: function (element) {
              $(element).addClass('error-field');
            },
            unhighlight: function (element) {
              $(element).removeClass('error-field');
            },
            submitHandler: function (form) {
              form.submit();
            }
  })
}
$(function () {
  validationFormMoto();
});

// veiculos
function  validationFormAutomovel(){
  $('.foorm').validate({
      rules: {
          
        codeAuto:{
          required: true 
        },
        placAuto:{
          required: true
        },
        chassAuto:{
           required: true,
           maxlength: 17
          
        },
         renaAuto:{
          required: true,
          maxlength: 11
        },
        macaAuto:{
          required: true
        },
        modeAuto:{
          required: true
        },
        corAuto:{
          required: true
        },
        tpCombusAuto:{
          required: true
        },
        kmAtAuto:{
          required: true,
          number:true
        },
       pdLocCar:{
          required: true
        },
        statAuto:{
          required: true
        },
        dtCadAuto:{
           required:true,
           date: true
        }
    },
          messages: {
            codeAuto:{
              required: "OBRIGATORIO"
            },
            placAuto:{
              required: "OBRIGATORIO"
            },
            chassAuto:{
               required: "OBRIGATORIO",
               maxlength: "maximo 17 caracteres "
              
            },
             renaAuto:{
              required: "OBRIGATORIO",
              maxlength: "maximo 11 caracteres"
            },
            macaAuto:{
              required: "OBRIGATORIO"
            },
            modeAuto:{
              required: "OBRIGATORIO"
            },
            corAuto:{
              required: "OBRIGATORIO"
            },
            tpCombusAuto:{
              required: "OBRIGATORIO"
            },
            kmAtAuto:{
              required: "OBRIGATORIO",
              number:"Somente valor numerico"
            },
            pdLocCar:{
              required: "OBRIGATORIO"
            },
            statAuto:{
              required: "OBRIGATORIO"
            },
            dtCadAuto:{
               required:"OBRIGATORIO",
               date: "Insira uma data valida"
            }
          },

          errorPlacement: function (error, element) {
              error.addClass('error-text');
              error.insertAfter(element);
            },
            highlight: function (element) {
              $(element).addClass('error-field');
            },
            unhighlight: function (element) {
              $(element).removeClass('error-field');
            },
            submitHandler: function (form) {
              form.submit();
            }
  })
}
$(function () {
  validationFormAutomovel();
});

// destino de descarte
function validationFormDestinationDescarte(){
  $('#formRegisterDestination').validate({
      rules: {
          
        nomeDest:{
          required: true 
        },
        cepDest:{
          required: true
        },
        
        ativDest:{
          required: true
        },
        tipoDest:{
          required: true
        },
        
    },
         messages: {

        nomeDest:{
          required:"OBRIGATORIO"
        },
        cepDest:{
          required:"OBRIGATORIO"
        },

        ativDest:{
          required: "OBRIGATORIO"
        },
        tipoDest:{
          required: "OBRIGATORIO"
        },
          },

          errorPlacement: function (error, element) {
              error.addClass('error-text');
              error.insertAfter(element);
            },
            highlight: function (element) {
              $(element).addClass('error-field');
            },
            unhighlight: function (element) {
              $(element).removeClass('error-field');
            },
            submitHandler: function (form) {
              form.submit();
            }
  })
}
$(function () {
  validationFormDestinationDescarte();
});




