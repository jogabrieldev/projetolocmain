
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
    submitHandler: function (form) {
      form.submit();
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
            cpf:{
                required: true,
                minlength: 8
            },
            dtCad:{
                required:true ,
                date: true
            },
            dtNasc:{
                required: true,
                date: true
            },
           clieCity:{
            required: true,
            minlength:4
           },
           clieEstd:{
             required:true,
             minlength:4
           },
           clieRua:{
            required: true,
            minlength: 5
           },
           clieCep:{
            required: true,
            minlength: 4
           },
           clieMail:{
            required: true
           }
           
      },
            messages: {
                clieCode: {
                  required: "Por favor, insira o código.",
                  minlength: "O código deve ter no mínimo 3 caracteres."
                },
                clieName: {
                  required: "Por favor, insira um nome.",
                  minlength: "O nome deve ter no mínimo 4 caracteres."
                },
                cpf: {
                    required: "Por favor, insira um CPF valido",
                  minlength: "Insira a quantidade correta de numeros"
                },
                dtCad:{
                    required: 'Insira uma data',
                    date: 'Insira uma data valida'
                },
                dtNasc:{
                    required: 'insira uma data',
                    date: 'insira uma data valida'
                },
                
                clieCity:{
                  required: "Obrigatorio",
                  minlength: 'Caracteres minimos são 4'
                 },
                 clieEstd:{
                  required:'Obrigatorio',
                  minlength: 'Caracteres minimos são 4'
                },
                clieRua:{
                  required: 'Obrigatorio',
                  minlength: 'Caracteres minimos são 5 Se preciso inclua QD E LT'
                 },
                 clieCep:{
                  required: "Obrigatorio",
                  minlength: 'Caracteres minimos são 4'
                 },
                 clieMail:{
                  required: "Obrigatorio"
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
          fornRua:{
             required:true
          },
          fornCity:{
            required: true
          },
          fornEstd:{
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
                required: 'obrigatorio',
                minlength: 'minimo 4 caracteres'
              },
              fornName:{
                 required:'Obrigatorio'
              },
              nomeFan:{
                minlength:'minimo 5 caracteres'
             },
             fornCnpj:{
               required:'Obrigatorio',
               number: 'Somente valor numerico',
               minlength: 'minimo 14 caracteres'
             },
             fornCep:{
                required:'Obrigatorio',
                number: 'Somente valores numericos'
             },
             fornRua:{
              required:"Obrigatorio"
           },

           fornCity:{
            required: "obrigatorio"
          },
          fornEstd:{
            required: "Obrigatorio"
          },
          fornMail:{
            required: 'Obrigatorio'
          },
          fornBank:{
            required: " Obrigatorio"
          },
          fornAge:{
            required: "Obrigatorio",
            maxlength: 'Maximo 4 caracteres'
         },
         fornCont:{
           required: "obrigatorio",
           maxlength: 'Maximo 8 caracteres'
         },
         fornPix:{
            required: 'Obrigatorio'
         },
         fornDtcd:{
          required: 'Obrigatorio',
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
                required: 'obrigatorio',
              },
              prodDesc:{
                 required:'Obrigatorio'
              },
              prodTipo:{
                required:"Obrigatorio",
              },
              prodUni:{
                required: "Obrigatorio",
                number: "Insira o valor numerico"
              },
              prodValor:{
               required: "Obrigatorio"
             },
             prodPeli:{
              required: "Obrigatorio"
            },
            prodPebr:{
              required: "Obrigatorio"
            },
            prodAtiv:{
              required: "Obrigatorio"
            },
             prodData:{
              required: "Obrigatorio",
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

// fabricante 

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
        fabeSuca:{
          required: true
        }
        

    },
          messages: {

            fabeCode:{
              required: 'obrigatorio',
            },
            fabeDesc:{
               required:'Obrigatorio'
            },
            fabeCate:{
             required: "Obrigatorio"
           },
           fabeCtct:{
            required: "Obrigatorio"
           },
           fabeSuca:{
            required: "Obrigatorio"
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
              required: "Obrigatorio" ,
            },
            tpDesc:{
              required: "Obrigatorio"
            },
            tpCat:{
               required: "Obrigatorio"
            },
            tpSubCat:{
              required: "Obrigatorio"
            },
            tpCtct:{
              required: "Obrigatorio"
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
          required: true
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
        motoCep:{
           required: true
        },
        motoRua:{
           required: true
        },
        motoCity:{
           required: true
        },
        motoStat:{
           required:true
        }


    },
          messages: {

            motoCode:{
              required: "Obrigatorio" ,
            },
            motoNome:{
              required: "Obrigatorio"
            },
            motoDtnc:{
               required: 'Obrigatorio',
               date: 'Insira uma data valida'
            },
            motoCpf:{
              required: "Obrigatorio"
            },
            motoDtch:{
              required: "Obrigatorio",
              date: 'Insira uma data valida'
            },
            motoDtvc:{
              required: 'Obrigatorio',
              date: "Insira uma data valida"
            },
            motoctch:{
              required: "Obrigatorio"
            },
            motoOrem:{
              required: "Obrigatorio"
            },
            motoCep:{
               required: "Obrigatorio"
            },
            motoRua:{
               required: "Obrigatorio"
            },
            motoCity:{
               required: "Obrigatorio"
            },
            motoStat:{
              required: "Obrigatorio"
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
function  validationFormTipoProd(){
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
  validationFormTipoProd();
});




