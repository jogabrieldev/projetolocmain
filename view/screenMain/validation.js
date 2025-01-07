
//Função de validação
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
      valor: {
        required: true
      },
      ntFiscal: {
        required: true,
        minlength: 5
      },
      cofo: {
        required: true,
        minlength: 4
      },
      valorAlug: {
        required: true
      }
    },
    messages: {
      code: {
        required: "Por favor, insira o código.",
        minlength: "O código deve ter no mínimo 3 caracteres."
      },
      name: {
        required: "Por favor, insira um nome.",
        minlength: "O nome deve ter no mínimo 4 caracteres."
      },
      cofa: {
        required: "Por favor, insira o código COFA."
      },
      model: {
        required: "Por favor, insira o modelo."
      },
      serial: {
        required: "Por favor, insira o número de série.",
        minlength: "O número de série deve ter no mínimo 5 caracteres."
      },
      dtCompra: {
        required: "Por favor, insira uma data válida.",
        date: "Insira uma data no formato correto."
      },
      valor: {
        required: "Por favor, insira o valor."
      },
      ntFiscal: {
        required: "Por favor, insira o número da nota fiscal.",
        minlength: "O número da nota fiscal deve ter no mínimo 5 caracteres."
      },
      cofo: {
        required: "Por favor, insira o código do fornecedor.",
        minlength: "O código do fornecedor deve ter no mínimo 4 caracteres."
      },
      valorAlug: {
        required: "Por favor, insira o valor do aluguel."
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

// Inicialize no carregamento do documento
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
            clieCelu:{
              required: true,
              number: true
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
                    required: "Por favor, insira o cpf valido",
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
                clieCelu:{
                    required: 'Insira o numero de telefone',
                    number: 'valor tem que ser numerico'
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


  function validationFormForne(){
    $('#registerForn').validate({
        rules: {
            
          fornCode:{
            required: true ,
            minlength: 4
          },
          fornName:{
            required: true
          },
          nomeFan:{
             minlength:5
          },
          fornCnpj:{
            required: true,
            number: true,
            minlength: 13
          },
          fornCep:{
            required: true,
            number: true
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
            mail: true
          },
          fornBank:{
            required: true
          },
          fornAge:{
             required: true
          },
          fornCont:{
            required: true
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
            required: "Obrigatorio"
         },
         fornCont:{
           required: "obrigatorio"
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

  function validationFormProd(){
    $('#registerForn').validate({
        rules: {
            
          fornCode:{
            required: true ,
            minlength: 4
          },
          fornName:{
            required: true
          },
          nomeFan:{
             minlength:5
          },
          forCnpj:{
            required: true,
            number: true
          },
          forCep:{
            required: true,
            number: true
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
             forCnpj:{
               required:'Obrigatorio',
               number: 'Somente valor numerico'
             },
             forCep:{
                required:'Obrigatorio',
                number: 'Somente valores numericos'
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



