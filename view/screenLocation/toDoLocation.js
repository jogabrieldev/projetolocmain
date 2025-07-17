// Funções utilitárias
function mostrarElemento(el) {
  if (el) {
    el.classList.remove("hidden");
    el.classList.add("flex");
  }
}

function esconderElemento(el) {
  if (el) {
    el.classList.remove("flex");
    el.classList.add("hidden");
  }
}

function maskFieldClientPageLocation() {
  $("#clieCepLoc").mask("00000-000");

  $("#clieCeluLoc").mask("(00) 00000-0000");
  $("#cnpjClientLoc").mask("00.000.000/0000-00");
  $("#cpfClientLoc").mask("000.000.000-00");
}

async function obterNumeroLocacao() {
  try {
    const response = await fetch("/api/generateNumber", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Erro ao obter número de locação do servidor.");
    }

    const data = await response.json();
    return data.numericLocation;
  } catch (error) {
    console.error("Erro ao gerar número de locação:", error);
    throw error;
  }
}

function atualizarData(date) {
  const agora = new Date();

  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");

  const dataHoraFormatada = `${ano}-${mes}-${dia}`;

  document.getElementById(date).value = dataHoraFormatada;
}

async function preencheraResiduo(id) {
  const fieldResi = document.getElementById(id);
  try {
     const res = await fetch( `/residuo`, {
      method: "GET",
    });
    const data = await res.json();
    console.log("residuo", data);

    const lista = data.list;

    if (Array.isArray(lista) && fieldResi) {
      lista.forEach(({ resicode, residesc }) => {
        const option = document.createElement("option");
        option.value = resicode;
        option.textContent = residesc;
        fieldResi.appendChild(option);
      });
    }

    return true;
  } catch (error) {
    console.error("Erro na function AUXILIAR resi", error);
    return false;
  }
}

async function preencherFieldLocalDescarte(id) {
    try {

      const fieldLocalDescarte = document.getElementById(id);
      if(fieldLocalDescarte){
        const res = await fetch('/api/destination',{
        method: "GET"
       })
       const data =  await res.json()
       const destino =  await data.destino || []

      if (Array.isArray(destino) && fieldLocalDescarte){
         destino.forEach(({ dereid, derenome }) => {
        const option = document.createElement("option");
        option.value = dereid;
        option.textContent = derenome;
        fieldLocalDescarte.appendChild(option);
       });
      }

        return true;
    } 
        
    } catch (error) {
      console.error('Erro ao preencher o campo de local de descarte' , error)
      return false
    }
}

// VERIFICA SE OS CAMPOS DOS CLIENTES ESTA OK
function verificarPreenchimentoCliente() {
  const inputsCliente = [
    "nameClient",
    "cpfClient",
    "ruaClient",
    "cityClient",
    "cepClient",
    "mailClient",
  ];

  // Verifica se algum campo está vazio
  const todosPreenchidos = inputsCliente.every((id) => {
    const input = document.getElementById(id);
    return input && input.value.trim() !== "";
  });
}

function readOnlyFieldChange(){

    document.getElementById('clieTiCliLoc').addEventListener('change', function () {
       const tipoCliente = this.value;
       const cpfField = document.getElementById('cpfClientLoc');
       const cnpjField = document.getElementById('cnpjClientLoc');

      if (tipoCliente === "Pessoa Jurídica") {
         cpfField.value = "";
         cpfField.readOnly = true;
         cnpjField.readOnly = false;

      } else if (tipoCliente === "Pessoa Física") {
        cnpjField.value = "";
        cnpjField.readOnly = true;
        cpfField.readOnly = false;

      } else {
       cpfField.readOnly = false;
       cnpjField.readOnly = false;
      }
  });
}

async function buscarLocalDescarte(id) {
   try {
        const response = await fetch(`/api/destination/${id}` , {
          method: 'GET'
        })

        const data = await response.json()

        if(data.success && response.ok){
           return data.destino
        }else{
            console.warn('Resposta inválida:', data);
            return null;
        }
   } catch (error) {
      console.error('Erro ao buscar local de descarte' , error)
      return null
   }
}


const socketContainerLocation = io();

document.addEventListener("DOMContentLoaded", () => {
  const btnLoadLocation = document.querySelector(".btnRegisterLocation");
  if (btnLoadLocation) {
    btnLoadLocation.addEventListener("click", async () => {
      try {
        await fetch("/location", {
          method: "GET",
        })
          .then((response) => response.text())
          .then((html) => {
            const contentMain = document.querySelector("#mainContent");
            if (contentMain) {
              contentMain.innerHTML = html;
            }
            interationSystemLocation();
            preencheraResiduo("residuoSelect");
            interationSystemLocationVehicle();
            preencherFieldLocalDescarte("locDescarte");
            for (let i = 1; i <= 5; i++) {
               atualizarData(`dataInicio${i}`);
             }
           
            validLocationHours();
            localStorage.removeItem("dadosInputs");
            const aguardarElementos = () => {
              const select1 = document.getElementById("family1");
              const tableLocation = document.querySelector(".tableLocation");
              if (select1 && tableLocation) {
                frontLocation();
                searchClientForLocation();
                carregarFamilias();
                atualizarData("dataLoc");
                atualizarData("dtCadLoc")
                atualizarData("dtCadLoc")
                loadVehicles();
                registerClientPageLocation();
                saveLocalizationInCache();
                maskFieldClientPageLocation();
                editLocation();
                isDataValida();
                hoursField("time1");
                hoursField("time2");
                readOnlyFieldChange()
                const buttonSubmitLocationFinish =
                  document.querySelector(".finish");
                if (buttonSubmitLocationFinish) {
                  buttonSubmitLocationFinish.addEventListener(
                    "click",
                    handleSubmit
                  );
                }

                const buttonSubmitLocationFinishVehicles =
                  document.querySelector(".finishVehicles");
                if (buttonSubmitLocationFinishVehicles) {
                  buttonSubmitLocationFinishVehicles.addEventListener(
                    "click",
                    locationTheVehicle
                  );
                }
                maskFieldLocalization();
                addLocalizationInLocation();
                deletarLocation();
                esconderElemento();
                mostrarElemento();
              } else {
                setTimeout(aguardarElementos, 100);
              }
            };
         
            aguardarElementos();
          })
          .catch((err) => console.error("Erro ao carregar /location", err));

        const containerAppLocation = document.querySelector(
          ".containerAppLocation"
        );
        if (containerAppLocation) containerAppLocation.classList.add("flex");

        const sectionsToHide = ["containerLogistica", "deliveryFinish"];
        sectionsToHide.forEach((selector) => {
          const element = document.querySelector(selector);
          if (element) element.style.display = "none";
        });

        const showContentBens = document.querySelector(".content");
        const btnMainPageClient = document.querySelector(".btnInitPageMainLoc");
        const listingClient = document.querySelector(".tableLocation ");
        const editFormClient = document.querySelector(".contentEditlocation");
        const informative = document.querySelector(".information");

        if (showContentBens) showContentBens.style.display = "none";
        if (btnMainPageClient) btnMainPageClient.style.display = "flex";
        if (listingClient) listingClient.style.display = "flex";
        if (editFormClient) editFormClient.style.display = "none";
        if (informative) {
          informative.style.display = "block";
          informative.textContent = "SESSÃO LOCAÇÃO";
        }
      } catch (error) {
        console.error("erro para carregar");
      }
    });
  }

  socketContainerLocation.on(
    "updateRunTimeRegisterLocation",
    (listLocation) => {
      const listaLocacoes = listLocation
        .map((locacao) => {
          if (locacao.bens.length > 0) {
            return locacao.bens.map((bem) => ({
              idClient: locacao.clloid,
              numeroLocacao: locacao.cllonmlo || "Não definido",
              nomeCliente: locacao.clloclno || "Não definido",
              cpfCliente: locacao.cllocpf || "Não definido",
              dataLocacao: formatDate(locacao.cllodtlo),
              dataDevolucao: formatDate(locacao.cllodtdv),
              formaPagamento: locacao.cllopgmt || "Não definido",
              codigoBem: bem.bencodb || "-",
              produto: bem.beloben || "Nenhum bem associado",
              quantidade: bem.beloqntd || "-",
              status: bem.belostat || "Não definido",
              observacao: bem.beloobsv || "Sem observação",
              dataInicio: formatDate(bem.belodtin),
              dataFim: formatDate(bem.belodtfi),
            }));
          } else {
            return [];
          }
        })
        .flat();

      renderTable(listaLocacoes);
    }
  );

  socketContainerLocation.on("updateRunTimeFamilyBens", (updatedFamily) => {
    carregarFamilias();
  });

  socketContainerLocation.on("updateRunTimeInEditLocation", (msg) => {
    console.log("Mensagem recebida via socket:", msg);
    if (msg && msg.id) {
      frontLocation();
    }
  });

  socketContainerLocation.on("InsertNewGoodsRunTimeInEditLocation", (msg) => {
    console.log("Mensagem recebida via socket:", msg);
    if (msg && msg.id) {
      frontLocation();
    }
  });
});

function interationSystemLocation() {
  const btnOutPageLocation = document.getElementById("buttonExitLocation");
  if (btnOutPageLocation) {
    btnOutPageLocation.addEventListener("click", () => {
      const containerAppLocation = document.querySelector(
        ".containerAppLocation"
      );
      if (containerAppLocation) {
        esconderElemento(containerAppLocation);
      }

      const continformation = document.querySelector(".information");
      if (continformation) {
        continformation.textContent = "Sessão ativa";
      }
    });
  }

  const outPageSearchLocation = document.querySelector(
    ".outPageSearchLocation"
  );
  if (outPageSearchLocation) {
    outPageSearchLocation.addEventListener("click", () => {
      const containerSearch = document.querySelector(".searchLocation");
      const backdrop = document.querySelector('.popupBackDrop')
      if (containerSearch) {
        containerSearch.style.display = 'none';
         backdrop.style.display = 'none'
      }

      const containerAppLocation = document.querySelector(
        ".containerAppLocation"
      );
      if (containerAppLocation) {
        mostrarElemento(containerAppLocation);
      }
    });
  }

  const btnSearchLoc = document.querySelector(".searchloc")
  if(btnSearchLoc){
    btnSearchLoc.addEventListener("click", () => {
     const containerSearch = document.querySelector(".searchLocation")
     const backdrop = document.querySelector('.popupBackDrop')
     if(containerSearch){
        containerSearch.style.display = "flex";
        backdrop.style.display = 'block'
     }
      
  });

  }

  const btnAtivLocation = document.querySelector(".registerLocation");
  if (btnAtivLocation) {
    btnAtivLocation.addEventListener("click", () => {
      const content = document.querySelector(".content");
      if (content) {
        mostrarElemento(content);
      }

      const table = document.querySelector(".tableLocation");
      if (table) {
        esconderElemento(table);
      }

      const btnPageMain = document.querySelector(".btnInitPageMainLoc");
      if (btnPageMain) {
        esconderElemento(btnPageMain);
      }
    });
  }

  const btnAtivGoods = document.querySelector(".btnAtivGoods");
  if (btnAtivGoods) {
    btnAtivGoods.addEventListener("click", () => {
      const containerLocationPartGoods =
        document.querySelector(".containerGoodsloc");
      if (containerLocationPartGoods) {
        mostrarElemento(containerLocationPartGoods);
      }

      const containerdecision = document.querySelector(".decisionHeader");
      if (containerdecision) {
        esconderElemento(containerdecision);
      }

      const textTypeLocation = document.querySelector(".textTypeLocation");
      if (textTypeLocation) {
        textTypeLocation.innerHTML = "<b>Locação de Caçambas</b>";
      }
    });
  }

  const buttonOutLocation = document.querySelector(".outLocation");
  if (buttonOutLocation) {
    buttonOutLocation.addEventListener("click", () => {
      const content = document.querySelector(".containerGoodsloc ");
      if (content) {
        esconderElemento(content);
      }
      const decisionHeader = document.querySelector(".decisionHeader");
      if (decisionHeader) {
        mostrarElemento(decisionHeader);
      }

      const textTypeLoc = document.querySelector(".textTypeLocation");
      if (textTypeLoc) {
        textTypeLoc.innerHTML = "<b>Qual tipo de locação</b>";
      }
    });
  }

  const registerClientPageLocationIn = document.querySelector(
    "#registerClientPageLocation"
  );
  if (registerClientPageLocationIn) {
    registerClientPageLocationIn.addEventListener("click", () => {
      const containerForm = document.querySelector(".LocRegisterClient");
      if (containerForm) {
        mostrarElemento(containerForm);
      }

      const containerMain = document.querySelector(".container");
      if (containerMain) {
        esconderElemento(containerMain);
      }
    });
  }

  const btnOutPageRegisterClientLoc = document.querySelector(
    ".btnOutPageRegisterClientLoc"
  );
  if (btnOutPageRegisterClientLoc) {
    btnOutPageRegisterClientLoc.addEventListener("click", () => {
      const containerForm = document.querySelector(".LocRegisterClient");
      if (containerForm) {
        esconderElemento(containerForm);
      }

      const containerMain = document.querySelector(".container");
      if (containerMain) {
        mostrarElemento(containerMain);
      }
    });
  }

  const outEditLocation = document.querySelector(".outEditLocation");
  if (outEditLocation) {
    outEditLocation.addEventListener("click", () => {
      const containerEditLocation = document.querySelector(
        ".containerEditLocation"
      );
      if (containerEditLocation) {
        esconderElemento(containerEditLocation);
      }

      const table = document.querySelector(".tableLocation");
      if (table) {
        mostrarElemento(table);
      }

      const btnMainPage = document.querySelector(".btnInitPageMainLoc");
      if (btnMainPage) {
        mostrarElemento(btnMainPage);
      }
    });
  }

  const btnSearchLocation = document.querySelector('.submitSearchLocation')
  if(btnSearchLocation){
      btnSearchLocation.addEventListener('click',()=>{
         filterTable()
      })
  }
}

//BUSCAR CLIENTE
function searchClientForLocation() {
  const searchClient = document.querySelector("#search");
  if (searchClient) {
    searchClient.addEventListener("click", async (event) => {
      event.preventDefault();
      const inputElement = document.querySelector("#client");
      const inputSearchClient = inputElement.value.trim();

      if (!inputSearchClient) {
        Toastify({
          text: "Por favor, digite o nome, CPF ou CNPJ do cliente.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
        return;
      }

      const token = localStorage.getItem("token");

      try {
        const response = await fetch("/api/listclient", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status}`);
        }

        const clientes = await response.json();

        const normalizeText = (text) => {
          return text
            ? text
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
            : "";
        };

        const normalizeNumber = (number) =>
          number ? number.replace(/\D/g, "") : "";

        const inputNormalized = normalizeText(inputSearchClient);
        const inputCpfCnpjNormalized = normalizeNumber(inputSearchClient);

        // Filtrando clientes
        const clienteEncontrado = clientes.filter((cliente) => {
          const nomeNormalizado = normalizeText(cliente.clienome);
          const cpfNormalizado = normalizeNumber(cliente.cliecpf);
          const cnpjNormalizado = normalizeNumber(cliente.cliecnpj);

          const pesquisaPorNome =
            inputNormalized.length >= 3 &&
            nomeNormalizado.startsWith(inputNormalized);

          const pesquisaPorCpf =
            inputCpfCnpjNormalized.length === 11 &&
            cpfNormalizado === inputCpfCnpjNormalized;

          const pesquisaPorCnpj =
            inputCpfCnpjNormalized.length === 14 &&
            cnpjNormalizado === inputCpfCnpjNormalized;

          return pesquisaPorNome || pesquisaPorCpf || pesquisaPorCnpj;
        });

        const resultDiv = document.querySelector(".searchClient");
        resultDiv.innerHTML = "";

        if (clienteEncontrado.length === 1) {
          const cliente = clienteEncontrado[0];

          const formatDoc = formatarCampo(
            "documento",
            cliente.cliecpf || cliente.cliecnpj
          );
          const formatCep = formatarCampo("cep", cliente.cliecep);

          document.querySelector("#nameClient").value = cliente.clienome || "";
          document.querySelector("#cpfClient").value = formatDoc || "";
          document.querySelector("#tpClient").value = cliente.clietpcl || "";
          document.querySelector("#cityClient").value = cliente.cliecity || "";
          document.querySelector("#cepClient").value = formatCep || "";
          document.querySelector("#mailClient").value = cliente.cliemail || "";

          resultDiv.style.display = "none";

          verificarPreenchimentoCliente();

          Toastify({
            text: `Cliente "${cliente.clienome}" encontrado com sucesso!`,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "green",
          }).showToast();
        } else if (clienteEncontrado.length > 1) {
          clienteEncontrado.forEach((cliente) => {
            const formatDoc = formatarCampo(
              "documento",
              cliente.cliecpf || cliente.cliecnpj
            );
            const formatCep = formatarCampo("cep", cliente.cliecep);
            const checkboxSelect = document.createElement("input");
            checkboxSelect.type = "checkbox";
            checkboxSelect.name = "selectClient";
            checkboxSelect.value = cliente.cliecode;
            checkboxSelect.style.marginRight = "10px";

            const clienteDiv = document.createElement("div");
            clienteDiv.classList.add("cliente-info");
            clienteDiv.style.border = "2px solid #000000";
            clienteDiv.style.color = "black";
            clienteDiv.style.margin = "10px";
            clienteDiv.style.padding = "10px";
            clienteDiv.style.borderRadius = "5px";
            clienteDiv.style.backgroundColor = "#f9f9f9";
            clienteDiv.style.display = "flex";
            clienteDiv.style.alignItems = "flex-start";
            clienteDiv.style.gap = "10px";

            const infoDiv = document.createElement("div");
            infoDiv.innerHTML = `
          <p><strong>Nome:</strong> ${cliente.clienome || "N/A"}</p>
          <p><strong>CPF ou CNPJ:</strong> ${formatDoc || "N/A"}</p>
          <p><strong>Tipo de cliente:</strong> ${cliente.clietpcl || "N/A"}</p>
          <p><strong>Cidade:</strong> ${cliente.cliecity || "N/A"}</p>
          <p><strong>CEP:</strong> ${formatCep || "N/A"}</p>
          <p><strong>Email:</strong> ${cliente.cliemail || "N/A"}</p>
        `;

            const buttonOutContainerSearch = document.createElement("button");
            buttonOutContainerSearch.className =
              "btn btn-outline-secondary d-flex align-items-center";
            buttonOutContainerSearch.textContent = "Voltar";
            buttonOutContainerSearch.style.cursor = "pointer";
            buttonOutContainerSearch.addEventListener("click", () => {
              resultDiv.style.display = "none";
            });

            checkboxSelect.addEventListener("change", (event) => {
              if (event.target.checked) {
                const formatDoc = formatarCampo(
                  "documento",
                  cliente.cliecpf || cliente.cliecnpj
                );
                const formatCep = formatarCampo("cep", cliente.cliecep);
                document
                  .querySelectorAll('input[name="selectClient"]')
                  .forEach((cb) => {
                    if (cb !== event.target) cb.checked = false;
                  });

                // Preenche os campos
                document.querySelector("#nameClient").value =
                  cliente.clienome || "";
                document.querySelector("#cpfClient").value = formatDoc || "";
                document.querySelector("#tpClient").value =
                  cliente.clietpcl || "";
                document.querySelector("#cityClient").value =
                  cliente.cliecity || "";
                document.querySelector("#cepClient").value = formatCep || "";
                document.querySelector("#mailClient").value =
                  cliente.cliemail || "";

                // Oculta a div com os resultados
                resultDiv.style.display = "none";

                Toastify({
                  text: `Cliente "${cliente.clienome}" selecionado com sucesso!`,
                  duration: 3000,
                  close: true,
                  gravity: "top",
                  position: "center",
                  backgroundColor: "green",
                }).showToast();
              }
            });

            clienteDiv.appendChild(checkboxSelect);
            clienteDiv.appendChild(infoDiv);
            clienteDiv.appendChild(buttonOutContainerSearch);
            resultDiv.appendChild(clienteDiv);
          });

          resultDiv.style.display = "flex";
          resultDiv.style.flexDirection = "column";

          Toastify({
            text: `Foram encontrados ${clienteEncontrado.length} clientes com o critério "${inputSearchClient}"`,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "orange",
          }).showToast();
        } else {
          Toastify({
            text: `Cliente "${inputSearchClient}" não encontrado.`,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
          }).showToast();
        }
      } catch (error) {
        console.error("Erro ao validar o cliente:", error);
        Toastify({
          text: "Erro ao validar o cliente. Tente novamente mais tarde.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
      }
    });
  }
}

// CARREGAR CODIGO DA FAMILIA
async function carregarFamilias() {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    Toastify({
      text: "Sessão expirada. Faça login novamente.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();

    localStorage.removeItem("token");
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 2000);
    return;
  }

  try {
    const response = await fetch("/api/codefamilybens", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar famílias de bens");
    }

    const familias = await response.json();

    for (let i = 1; i <= 5; i++) {
      const select = document.getElementById(`family${i}`);
      const selectEdit = document.getElementById(`family${i}Edit`);

      if (select) {
        select.addEventListener("change", () => preencherProduto(i, familias));

        familias.forEach(({ fabecode }) => {
          const option = document.createElement("option");
          option.value = fabecode;
          option.textContent = fabecode;
          select.appendChild(option);

          if (selectEdit) {
            selectEdit.addEventListener("change", () =>
              preencherProduto(i, familias)
            );

            selectEdit.appendChild(option.cloneNode(true));
          }
        });
      } else {
        console.warn(`Select family${i} não encontrado no DOM.`);
      }
    }
  } catch (error) {
    console.error("Erro ao carregar famílias de bens:", error);
    Toastify({
      text: "Erro ao carregar famílias de bens. Tente novamente mais tarde.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
  }
}

// PRECHER A DESCRIÇÃO DE ACORDO COM O CODIGO DE FAMILIA
function preencherProduto(index, familias) {
  const select = document.getElementById(`family${index}`);
  const selectEdit = document.getElementById(`family${index}Edit`);

  const inputProduto = document.getElementById(`produto${index}`);
  const inputProdutoEdit = document.getElementById(`produto${index}Edit`);
  const codigoSelecionado = select.value;
  const codigoSelecionadoEdit = selectEdit.value;

  const familiaSelecionada = familias.find(
    (familia) => familia.fabecode === codigoSelecionado
  );

  const familiaSelecionadaEdit = familias.find(
    (familia) => familia.fabecode === codigoSelecionadoEdit
  );

  if (familiaSelecionada) {
    inputProduto.value = familiaSelecionada.fabedesc || "Sem nome definido";
  } else {
    inputProduto.value = "";
  }

  if (familiaSelecionadaEdit) {
    inputProdutoEdit.value =
      familiaSelecionadaEdit.fabedesc || "Sem nome definido";
  } else {
    inputProdutoEdit.value = "";
  }
}

function clearFields() {
  document.querySelector("#numeroLocation").value = "";
  document.querySelector("#client").value = "";
  document.querySelector("#nameClient").value = "";
  document.querySelector("#cpfClient").value = "";
  document.getElementById("dataLoc").value = "";
  document.getElementById("DataDevo").value = "";
  document.getElementById("pagament").value = "";
  document.getElementById("tpClient").value = "";
  document.getElementById("cityClient").value = "";
  document.getElementById("cepClient").value = "";
  document.getElementById("mailClient").value = "";
}

// ENVIO DA LOCAÇÃO FINALIZADA
async function handleSubmit() {
  atualizarData("dataLoc");

  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 2000);
    return;
  }

  const feriadosFixos = [
    "01-01", // Ano Novo
    "04-21", // Tiradentes
    "05-01", // Dia do Trabalhador
    "09-07", // Independência
    "10-12", // Nossa Senhora Aparecida
    "11-02", // Finados
    "11-15", // Proclamação da República
    "12-25", // Natal
  ];

  function isFeriado(data) {
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dataFormatada = `${mes}-${dia}`;

    return feriadosFixos.includes(dataFormatada);
  }

  const totalGrups = 4;
  const bens = [];

  const codigosUsados = new Set();
   
  // Capturar dados dos grupos
  for (let i = 1; i <= totalGrups; i++) {
  const codeBen = document.getElementById(`family${i}`)?.value.trim() || "";
  const produto = document.getElementById(`produto${i}`)?.value.trim() || "";
  const quantidade = document.getElementById(`quantidade${i}`)?.value.trim() || "";
  const observacao = document.getElementById(`observacao${i}`)?.value.trim() || "";
  const dataInicioStr = document.getElementById(`dataInicio${i}`)?.value.trim() || "";
  const dataFimStr = document.getElementById(`dataFim${i}`)?.value.trim() || "";

  // Se todos os campos estão em branco, pula
  if (!codeBen && !quantidade && !dataFimStr) continue;

  const quantidadeNum = parseInt(quantidade, 10);
   if (isNaN(quantidadeNum) || quantidadeNum < 1 || quantidadeNum > 5) {
   Toastify({
    text: `Grupo ${i}: A quantidade deve ser um número entre 1 e 5.`,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "center",
    backgroundColor: "orange",
  }).showToast();
  return;
}

  console.log('Grupo:', i, 'CodeBen:', codeBen, 'Quantidade:', quantidade, 'Data Início:', dataInicioStr, 'Data Fim:', dataFimStr);

  // Verifica campos obrigatórios
  if (!codeBen || !quantidade || !dataInicioStr || !dataFimStr) {
    Toastify({
      text: `Grupo ${i}: Preencha código, quantidade, data de início e data fim.`,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return;
  }

  // Verifica duplicidade
  if (codigosUsados.has(codeBen)) {
    Toastify({
      text: `Grupo ${i}: O código "${codeBen}" já foi selecionado em outro grupo.`,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return;
  }

  codigosUsados.add(codeBen);

      if (!isDataValida(dataInicioStr) || !isDataValida(dataFimStr)) {
        Toastify({
          text: `Grupo ${i}: Data de início ou fim inválida/outro ano.`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
        return;
      }

      const dataInicio = parseDataLocal(dataInicioStr);
      const dataFim = parseDataLocal(dataFimStr);
      const dataDevoValid = document.getElementById("DataDevo")?.value || null;

      const dataDevo = parseDataLocal(dataDevoValid);

      if (dataFim.getTime() !== dataDevo.getTime()) {
        Toastify({
          text: `Grupo ${i}: A data FIM do bem deve ser igual à data de DEVOLUÇÃO da locação.`,
          duration: 4000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
        return;
      }

      if (isFeriado(dataFim)) {
        Toastify({
          text: `A data FIM da locação (Grupo ${i}) cai em um feriado. Escolha outro dia.`,
          duration: 4000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
        return;
      }

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const dataInicioNormalizada = new Date(dataInicio);
      dataInicioNormalizada.setHours(0, 0, 0, 0);

      if (dataInicioNormalizada.getTime() < hoje.getTime()) {
        Toastify({
          text: `Item ${i}: A data INÍCIO deve ser igual à data atual ou posterior.`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
        return;
      }

      if (dataFim <= dataInicio) {
        Toastify({
          text: `Grupo ${i}: A data FIM deve ser maior que a data INÍCIO.`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
        return;
      }
   
      bens.push({
        codeBen,
        observacao,
        dataInicio: dataInicio.toISOString().split("T")[0],
        dataFim: dataFim.toISOString().split("T")[0],
        quantidade,
        produto,
        status: "Pendente",
        contrato: ""
      });
      
  }

  if (bens.length === 0) {
    console.error("Nenhum grupo válido foi preenchido.");
    Toastify({
      text: "Preencha ao menos um grupo de bens corretamente.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return
  }

  
  try {
    const numericLocation = await obterNumeroLocacao();
    document.querySelector("#numeroLocation").value = numericLocation;
    const nameClient = document.querySelector("#nameClient").value;
    const cpfClient = document.querySelector("#cpfClient").value;

    const cpfOrCnpj = cpfClient.replace(/\D/g, "");

    const userClientValidade = [nameClient, cpfOrCnpj];
    const dataLocStr = document.getElementById("dataLoc")?.value || null;
    const dataDevoStr = document.getElementById("DataDevo")?.value || null;
    const pagament = document.getElementById("pagament")?.value || null;
    const residuo = document.getElementById("residuoSelect").value;
    const localDescarte = document.getElementById('locDescarte').value || null


    if (!dataDevoStr || !pagament) {
      Toastify({
        text: "Insira a data de devolução e a Forma de pagamento",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "Red",
      }).showToast();

      return;
    }

    if (!isDataValida(dataLocStr) || !isDataValida(dataDevoStr)) {
      Toastify({
        text: "Data de devolução INVALIDA. Verifique por favor",
        duration: 4000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
      return;
    }

    // const dataLoc = new Date(dataLocStr);
    const dataDevo = parseDataLocal(dataDevoStr);

    if (isFeriado(dataDevo)) {
      Toastify({
        text: "A data de devolução esta dando em um feriado altere a data.",
        duration: 4000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
      return;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const partes = dataLocStr.split("-");
    const dataLocDia = new Date(
      Number(partes[0]), // ano
      Number(partes[1]) - 1, // mês (0-indexado)
      Number(partes[2]) // dia
    );
    dataLocDia.setHours(0, 0, 0, 0);

    if (dataLocDia.getTime() !== hoje.getTime()) {
      Toastify({
        text: "A data da locação deve ser igual à data de hoje.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "orange",
      }).showToast();
      return;
    }

    const normalizarData = (data) => {
      return new Date(data.getFullYear(), data.getMonth(), data.getDate());
    };

    const dateLocation = new Date(dataLocStr);
    const dateDevolution = new Date(dataDevoStr);

    const dataLocNormalizada = normalizarData(dateLocation);
    const dataDevoNormalizada = normalizarData(dateDevolution);

    if (dataLocNormalizada > dataDevoNormalizada) {
      Toastify({
        text: "A data de devolução deve ser maior que a data da locação.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "orange",
      }).showToast();
      return;
    }

    const dadosInputsLoc = localStorage.getItem("dadosInputs");

    if (!dadosInputsLoc) {
      Toastify({
        text: "Você precisa preencher os dados de localização antes de continuar.",
        duration: 4000,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
      return; // impede o envio
    }

    let dateSave;
    try {
      dateSave = JSON.parse(dadosInputsLoc);
    } catch (e) {
      Toastify({
        text: "Erro ao processar os dados de localização salvos. Por favor, tente novamente.",
        duration: 4000,
        gravity: "top",
        position: "right",
        backgroundColor: "#f44336",
      }).showToast();
      return;
    }
    if (!residuo) {
      Toastify({
        text: "Selecione o residuo envolvido nessa Locação",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "orange",
      }).showToast();

      return;
    }

    if(!localDescarte || localDescarte === null){
      Toastify({
        text: "Selecione o local de descarte Obrigatorio!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "orange",
      }).showToast();

      return;
    }


    try {
       await gerarContrato();
        const contratoHTML = document.querySelector(".contrato").innerHTML.trim();
        bens.forEach((bem) => {
        bem.contrato = contratoHTML;
       })
} catch (err) {
  Toastify({
    text: "Erro ao gerar contrato, verifique os dados do cliente ou bens.",
    duration: 4000,
    gravity: "top",
    position: "center",
    backgroundColor: "red",
  }).showToast();
  return;
}

    ;

    const payload = {
      numericLocation,
      userClientValidade,
      dataLoc: dataLocStr,
      dataDevo: dataDevo.toISOString().split("T")[0],
      localization: dateSave,
      descarte:localDescarte,
      resi: residuo,
      pagament,
      bens,
    };

    
    const response = await fetch("/api/datalocation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const errorData = await response.json();

    if (response.ok && response.status === 200) {
      Toastify({
        text: "Contrato de locação gerado com sucesso!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();
         
       const content = document.querySelector('.content')
      if(content)esconderElemento(content)

        gerarContrato();

        setTimeout(() => {
        clearFields();
        localStorage.removeItem("dadosInputs");
        atualizarData("dataLoc");
        preencheraResiduo("residuoSelect");
      }, 500);
    } else {
      Toastify({
        text: errorData.error || "Erro na locação!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
    }
  } catch (error) {
    console.error("Erro ao enviar os dados:", error);
    Toastify({
      text: "Erro ao enviar os dados, verifique se os campos estão todos preechidos!",
      duration: 4000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
  }
}

// CONTRATO COM OS DADOS A LOCAÇÃO
async function gerarContrato() {
  const contratoDiv = document.querySelector(".contrato");
  contratoDiv.innerHTML = "";
  contratoDiv.style.display = "flex";

  const getValue = (id) => document.getElementById(id)?.value || "Não informado";
  const getSelectText = (id) => {
    const select = document.getElementById(id);
    return select?.options[select.selectedIndex]?.text || "Não informado";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return isNaN(d) ? "-" : d.toLocaleDateString("pt-BR");
  };

  const cpfCliente = getValue("cpfClient");
  const nomeCliente = getValue("nameClient");
  const dataLocacao = getValue("dataLoc");
  const dataDevolucao = getValue("DataDevo");
  const numericLocation = getValue("numeroLocation");
  const pagamento = getValue("pagament");
  const residuo = getSelectText("residuoSelect");
  const descarteId = getValue("locDescarte");

  const localDescarte = await buscarLocalDescarte(descarteId);
  const dadosInputsLoc = localStorage.getItem("dadosInputs");
  const enderecoLocacao = dadosInputsLoc ? JSON.parse(dadosInputsLoc) : {};

  const container = document.createElement("div");
  container.className = "text-dark p-4 rounded";

  const h2 = document.createElement("h2");
  h2.className = "text-center mb-4";
  h2.innerHTML = `<i class="bi bi-file-earmark-text-fill me-2"></i>Contrato de Locação de Bens`;
  container.appendChild(h2);

  container.innerHTML += `
    <hr class="border-light">
    <p><i class="bi bi-hash"></i> <strong>Número da locação:</strong> ${numericLocation}</p>
    <p><i class="bi bi-person-fill"></i> <strong>Nome do Cliente:</strong> ${nomeCliente}</p>
    <p><i class="bi bi-credit-card"></i> <strong>CPF/CNPJ do Cliente:</strong> ${cpfCliente}</p>
    <p><i class="bi bi-recycle"></i> <strong>Resíduo Envolvido:</strong> ${residuo}</p>
    <p><i class="bi bi-credit-card-2-front"></i> <strong>Forma de Pagamento:</strong> ${pagamento}</p>
    <p><i class="bi bi-calendar-check"></i> <strong>Data da Locação:</strong>  ${(dataLocacao)}</p>
    <p><i class="bi bi-calendar-x"></i> <strong>Data de Devolução:</strong> ${(dataDevolucao)}</p>
  `;

  const descarteDiv = document.createElement("div");
  descarteDiv.className = "border rounded p-3 mb-3 bg-dark-subtle text-white";
  descarteDiv.innerHTML = `
    <p class="mb-1"><i class="bi bi-trash-fill"></i> <strong>Endereço do Descarte:</strong></p>
    <div class="row">
      <div class="col-md-4 text-dark"><strong>Nome:</strong> ${localDescarte?.derenome || "-"}</div>
      <div class="col-md-4 text-dark"><strong>Tipo:</strong> ${localDescarte?.deretipo || "-"}</div>
      <div class="col-md-4 text-dark"><strong>Rua:</strong> ${localDescarte?.dererua || "-"}</div>
    </div>
    <div class="row">
      <div class="col-md-4 text-dark"><strong>Bairro:</strong> ${localDescarte?.derebair || "-"}</div>
      <div class="col-md-4 text-dark"><strong>Cidade:</strong> ${localDescarte?.derecida || "-"}</div>
      <div class="col-md-4 text-dark"><strong>CEP:</strong> ${localDescarte?.derecep || "-"}</div>
    </div>
    <div class="row">
      <div class="col-md-4 text-dark"><strong>Estado:</strong> ${localDescarte?.dereestd || "-"}</div>
    </div>`;
  container.appendChild(descarteDiv);

  const statusDiv = document.createElement("div")
  statusDiv.className = "border rounded p-3 mb-3 bg-dark-subtle text-dark text-center";
  statusDiv.classList.add("statusLocacaoContainer") 
  statusDiv.style.display = 'none'
  container.appendChild(statusDiv)

  const enderecoDiv = document.createElement("div");
  enderecoDiv.className = "border rounded p-3 mb-3 bg-dark-subtle text-white";
  enderecoDiv.innerHTML = `
    <p class="mb-1"><i class="bi bi-geo-alt-fill"></i> <strong>Endereço da Locação:</strong></p>
    <div class="row">
      <div class="col-md-4 text-dark"><strong>Rua:</strong> ${enderecoLocacao.localizationRua || "-"}</div>
      <div class="col-md-4 text-dark"><strong>Bairro:</strong> ${enderecoLocacao.localizationBairro || "-"}</div>
      <div class="col-md-4 text-dark"><strong>Cidade:</strong> ${enderecoLocacao.localizationCida || "-"}</div>
    </div>
    <div class="row">
      <div class="col-md-4 text-dark"><strong>CEP:</strong> ${enderecoLocacao.localizationCep || "-"}</div>
      <div class="col-md-4 text-dark"><strong>Referência:</strong> ${enderecoLocacao.localizationRefe || "-"}</div>
      <div class="col-md-4 text-dark"><strong>Região:</strong> ${enderecoLocacao.localizationRegion || "-"}</div>
    </div>
  `;
  container.appendChild(enderecoDiv);

  const tituloItens = document.createElement("p");
  tituloItens.innerHTML = `<i class="bi bi-box-seam"></i> <strong>Tipo de bem pedido na locação:</strong>`;
  container.appendChild(tituloItens);

  const bensVinculados =  document.createElement("div")
  bensVinculados.classList.add('bensVinculados')
  bensVinculados.style.display = 'none'
  container.appendChild(bensVinculados)

  const itens = [];
  for (let i = 1; i <= 4; i++) {
    const produto = getValue(`produto${i}`);
    if (produto !== "Não informado") {
      itens.push({
        codeBen: getValue(`family${i}`),
        produto,
        quantidade: getValue(`quantidade${i}`),
        observacao: getValue(`observacao${i}`),
        dataInicio: formatDate(getValue(`dataInicio${i}`)),
        dataFim: formatDate(getValue(`dataFim${i}`))
      });
    }
  }

  if (itens.length > 0) {
    const tableResponsive = document.createElement("div");
    tableResponsive.className = "table-responsive";

    const table = document.createElement("table");
    table.className = "table table-bordered table-dark table-sm";

    const thead = document.createElement("thead");
    thead.className = "table-light";
    const trHead = document.createElement("tr");
    ["Código tipo do Bem", "Produto", "Quantidade", "Descrição", "Data de Início", "Data Final"].forEach(text => {
      const th = document.createElement("th");
      th.textContent = text;
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    itens.forEach(item => {
      const tr = document.createElement("tr");
      ["codeBen", "produto", "quantidade", "observacao", "dataInicio", "dataFim"].forEach(key => {
        const td = document.createElement("td");
        td.textContent = item[key];
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableResponsive.appendChild(table);
    container.appendChild(tableResponsive);
  } else {
    const p = document.createElement("p");
    p.textContent = "Nenhum item informado.";
    container.appendChild(p);
  }

  const divBtn = document.createElement("div");
  divBtn.className = "text-center mt-4 d-flex justify-content-center gap-2";

  const btnVoltar = document.createElement("button");
  btnVoltar.id = "voltar";
  btnVoltar.className = "btn btn-light";
  btnVoltar.innerHTML = `<i class="bi bi-arrow-left"></i> Voltar`;

  const btnSalvar = document.createElement("button");
  btnSalvar.id = "baixarPdf";
  btnSalvar.className = "btn btn-success";
  btnSalvar.innerHTML = `<i class="bi bi-arrow-down-circle-fill me-2"></i>Baixar PDF`;

  divBtn.appendChild(btnVoltar);
  divBtn.appendChild(btnSalvar)
  container.appendChild(divBtn);
  contratoDiv.appendChild(container);

  btnVoltar.addEventListener("click", () => {
    esconderElemento(contratoDiv);
    mostrarElemento(document.querySelector(".tableLocation"));
    mostrarElemento(document.querySelector(".btnInitPageMainLoc"));
  });

   
};



// cadastrar o cliente pela a tela de locação
function registerClientPageLocation() {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    Toastify({
      text: "Sessão expirada. Faça login novamente.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();

    localStorage.removeItem("token");
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 2000);
    return;
  }

  const buttonSubmitRegisterClient = document.querySelector(
    ".btnRegisterClientLoc"
  );
  if (buttonSubmitRegisterClient) {
    buttonSubmitRegisterClient.addEventListener("click", async () => {
      if (!$("#formRegisterClientLoc").valid()) {
        return;
      }
      const clieCep = document
        .querySelector("#clieCepLoc")
        .value.replace(/\D/g, "");
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${clieCep}/json/`
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar o CEP.");
        }

        const data = await response.json();

        if (data.erro) {
          Toastify({
            text: "CEP inválido.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
          }).showToast();
          return;
        }

        // Preenchendo os campos do formulário
        const ruaField = document.getElementById("clieRuaLoc");
        const cityField = document.getElementById("clieCityLoc");
        const stateField = document.getElementById("clieEstdLoc");

        if (ruaField) {
          ruaField.value = `${data.logradouro} - ${data.bairro}` || "";
          ruaField.readOnly = true;
        }
        if (cityField) {
          cityField.value = data.localidade || "";
          cityField.readOnly = true;
        }
        if (stateField) {
          stateField.value = data.uf || "";
          stateField.readOnly = true;
        }
      } catch (error) {
        console.error("Erro ao buscar o CEP:", error);
        Toastify({
          text: "Erro ao buscar o CEP, tente novamente.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
        return;
      }

      const formDataLocation = {
        clieCode: document.querySelector("#clieCodeLoc").value.trim(), // Código
        clieName: document.querySelector("#clieNameLoc").value.trim(), // Nome Completo
        clieTpCl: document.querySelector("#clieTiCliLoc").value, // Tipo de Cliente
        clieCpf: document.querySelector("#cpfClientLoc").value.trim().replace(/\D/g, ''), // CPF
        clieCnpj: document.querySelector("#cnpjClientLoc").value.trim().replace(/\D/g, ''), // CNPJ
        clieCelu: document.querySelector("#clieCeluLoc").value.trim().replace(/\D/g, ''), // Celular
        dtNasc: document.querySelector("#dtNascLoc").value, // Data de Nascimento
        dtCad: document.querySelector("#dtCadLoc").value, // Data de Cadastro
        clieCep: document.querySelector("#clieCepLoc").value.trim().replace(/\D/g, ''), // CEP
        clieRua: document.querySelector("#clieRuaLoc").value.trim(), // Rua
        clieCity: document.querySelector("#clieCityLoc").value.trim(), // Cidade
        clieEstd: document.querySelector("#clieEstdLoc").value.trim(), // Estado
        clieMail: document.querySelector("#clieMailLoc").value.trim(), // E-mail
        clieBanc: document.querySelector("#clieBancLoc").value.trim(), // Banco
        clieAgen: document.querySelector("#clieAgenLoc").value.trim(), // Agência
        clieCont: document.querySelector("#clieContLoc").value.trim(), // Conta
        cliePix: document.querySelector("#cliePixLoc").value.trim(), // Chave Pix
      };

      

      if(formDataLocation.clieTpCl === "Pessoa Jurídica" && formDataLocation.cnpj === ""){
          Toastify({
          text: "O Cliente e uma pessoa jurídica adicione o CNPJ dele. OBRIGATORIO",
          duration: 4000,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
        return;
      }

      if(formDataLocation.clieTpCl === "Pessoa Física" && formDataLocation.cpf === ""){
          Toastify({
          text: "O Cliente e uma Pessoa Física adicione o CPF dele. OBRIGATORIO",
          duration: 4000,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
        return;
      }


      const clieMail = formDataLocation.clieMail;
      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailValido.test(clieMail)) {
        Toastify({
          text: "E-mail inválido. Verifique o formato (ex: nome@dominio.com).",
          duration: 3000,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
        return;
      }

      const datas = [
        { key: "dtCad", label: "Data de Cadastro" },
        { key: "dtNasc", label: "Data de Nascimento" },
      ];
      for (const { key, label } of datas) {
        const str = formDataLocation[key];
        if (!isDataValida(str)) {
          Toastify({
            text: `${label} INVALIDA .`,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
          }).showToast();
          return;
        }
      }

      const [yCad, mCad, dCad] = formDataLocation.dtCad.split("-").map(Number);
      const [yNasc, mNasc, dNasc] = formDataLocation.dtNasc
        .split("-")
        .map(Number);
      const dtCad = new Date(yCad, mCad - 1, dCad);
      const dtNasc = new Date(yNasc, mNasc - 1, dNasc);
      const hoje = new Date();
      const hoje0 = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate()
      );

      if (
        dtCad.getTime() > hoje0.getTime() ||
        dtCad.getTime() < hoje0.getTime()
      ) {
        Toastify({
          text: "Data de Cadastro não pode ser maior  nem menor que a data de hoje.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
        return;
      }

      // 5.2) dtNasc não pode ser futura
      if (dtNasc.getTime() > hoje0.getTime()) {
        Toastify({
          text: "Data de Nascimento não pode ser maior que a data de hoje.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
        return;
      }

      // 5.3) dtNasc deve ser anterior ou igual a dtCad
      if (dtNasc.getTime() > dtCad.getTime()) {
        Toastify({
          text: "Data de Nascimento não pode ser posterior à data de cadastro.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "orange",
        }).showToast();
        return;
      }

      try {
        const response = await fetch("/api/client/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formDataLocation),
        });

        const result = await response.json();

        if (response.ok) {
          Toastify({
            text: "Cliente cadastrado com sucesso!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "green",
          }).showToast();

          document.querySelector("#formRegisterClientLoc").reset();
          
        } else {
          Toastify({
            text: result?.message || "Erro ao cadastrar Cliente.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: response.status === 409 ? "orange" : "red",
          }).showToast();
        } 
      } catch (error) {
        console.error("Erro ao enviar formulário:", error);
         Toastify({
            text: "Erro ao cadastrar Cliente",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
          }).showToast();
      }
    });
  }

  validationFormClientPageLocation();
}
