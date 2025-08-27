
// TABELA COM AS LOCAÇOES
async function frontLocation() {
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
    const response = await fetch("/api/locationFinish", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 404) {
      document.querySelector(".tableLocation"
      ).innerHTML = `<p class="text-danger text-center">Nenhuma locação encontrada ate o momento.</p>`;
      return;
    }

    const dataFinish = await response.json();
    const locacoesFinishTable = dataFinish.locacoes || [];

    const table = document.querySelector(".tableLocation");
    if (table) {
      table.innerHTML = "";
    } else {
      console.warn("Elemento .tableLocation não encontrado.");
      return;
    }
    
    const listaLocacoes = locacoesFinishTable.map((locacao) => {
        if (locacao.bens.length > 0) {
          return locacao.bens.map((bem) => ({
            idClient: locacao.clloid,
            numeroLocacao: locacao.cllonmlo || "Não definido",
            nomeCliente: locacao.clloclno || "Não definido",
            dataLocacao: formatDataPattersBr(locacao.cllodtlo),
            dataDevolucao: formatDataPattersBr(locacao.cllodtdv),
            formaPagamento: locacao.cllopgmt || "Não definido",
            descarte: locacao.cllodesc || "Não definido",
            cidade:locacao.cllocida|| "__",
            bairro:locacao.cllobair || "__",
            refere:locacao.cllorefe || "__",
            rua:locacao.cllorua || "__", 
            qdlt:locacao.clloqdlt || "__" ,   
            residuo:locacao.clloresi || "__" ,
            codigoBem: bem.belocodb || "-",
            belocode:bem.belocode,
            produto: bem.belobem || "Nenhum bem associado",
            quantidade: bem.beloqntd || "-",
            status: bem.belostat || "Não definido",
            observacao: bem.beloobsv || "Sem observação",
            dataInicio: formatDataPattersBr(bem.belodtin),
            dataFim: formatDataPattersBr(bem.belodtfi),
          }));
           
         }else if(locacao.bens.length > 1){
            return locacao.bens.map((bem) => ({
            idClient: locacao.clloid,
            numeroLocacao: locacao.cllonmlo || "Não definido",
            nomeCliente: locacao.clloclno || "Não definido",
            dataLocacao: formatDataPattersBr(locacao.cllodtlo),
            dataDevolucao: formatDataPattersBr(locacao.cllodtdv),
            formaPagamento: locacao.cllopgmt || "Não definido",
            descarte: locacao.cllodesc || "Não definido",
            cidade:locacao.cllocida|| "__",
            bairro:locacao.cllobair || "__",
            refere:locacao.cllorefe || "__",
            rua:locacao.cllorua || "__", 
            qdlt:locacao.clloqdlt || "__" ,   
            residuo:locacao.clloresi || "__" ,
            codigoBem: bem.belocodb || "-",
            belocode:bem.belocode,
            produto: bem.belobem || "Nenhum bem associado",
            quantidade: bem.beloqntd || "-",
            status: bem.belostat || "Não definido",
            observacao: bem.beloobsv || "Sem observação",
            dataInicio: formatDataPattersBr(bem.belodtin),
            dataFim: formatDataPattersBr(bem.belodtfi),
          }));
         }
      }).flat(); 

      //  console.log("resultado do map" , listaLocacoes)

    renderTable(listaLocacoes); 
  } catch (error) {
    console.error("Erro ao gerar tabela de locação:", error);
  };
};

function renderTable(data) {

  const tableDiv = document.querySelector(".tableLocation");
  tableDiv.innerHTML = ""

  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.justifyContent = "space-between";
  container.style.alignItems = "center";
  container.style.marginBottom = "10px";

  const title = document.createElement("h2");
  title.innerHTML = "<p class='text-dark'>Locaçaõ de Bens</p>";
  title.style.margin = "0";

  const messageFilter = document.createElement("span");
  messageFilter.id = "messsageFilter";
  messageFilter.style.display = "none";

  const resetFilterBtn = document.createElement("button");
  resetFilterBtn.id = "resetFilterBtn";
  resetFilterBtn.style.display = "none";
  resetFilterBtn.textContent = "Remover Filtro";

  container.appendChild(title);
  container.appendChild(messageFilter);
  container.appendChild(resetFilterBtn);

  tableDiv.appendChild(container);

  const table = document.createElement("table");
  table.classList.add("tableLocationAll");

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const headers = [
    "Selecionar",
    "Número de Locação",
    "Status",
    "Nome do Cliente",
    "Data da Locação",
    "Data de Devolução",
    "Forma de Pagamento",
    "Familia do bem",
    "Descrição",
    "Quantidade",
    "Observação",
    "Data Início",
    "Data Final",
    "Visualizar"
  ];

  headers.forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  data.forEach((locacao) => {
    
    const row = document.createElement("tr");

    const checkboxTd = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("locacao-checkbox");
    checkbox.value = JSON.stringify(locacao);
    checkboxTd.appendChild(checkbox);
    row.appendChild(checkboxTd);
  
    [
      "numeroLocacao",
      "status",
      "nomeCliente",
      "dataLocacao",
      "dataDevolucao",
      "formaPagamento",
      "codigoBem",
      "produto",
      "quantidade",
      "observacao",
      "dataInicio",
      "dataFim",
    ].forEach((key) => {
      const td = document.createElement("td");
      td.textContent = locacao[key];
      row.appendChild(td);
    });

     const visualizarTd = document.createElement("td");
    const visualizarBtn = document.createElement("button");
    visualizarBtn.classList.add("btn", "btn-sm", "btn-success");
    visualizarBtn.textContent = "Visualizar";
    if(visualizarBtn){
       visualizarBtn.addEventListener("click", () => {
      showContratoLocationGoods(locacao)
     
       });
    }
    visualizarTd.appendChild(visualizarBtn);
  row.appendChild(visualizarTd);

    tbody.appendChild(row);
  });

  if (data.length === 0) {
    const emptyRow = document.createElement("tr");
    const emptyTd = document.createElement("td");
    emptyTd.colSpan = "14";
    emptyTd.style.textAlign = "center";
    emptyTd.textContent = "Nenhuma locação encontrada.";
    emptyRow.appendChild(emptyTd);
    tbody.appendChild(emptyRow);
  }


  table.appendChild(tbody);
  tableDiv.appendChild(table);

  const checkboxes = document.querySelectorAll(".locacao-checkbox");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const locacaoData = JSON.parse(event.target.value);
      const isChecked = event.target.checked;

    });
  });
};

// buscar residuo
async function buscarResiduo(id) {
  try {
    const result = await fetch(`/residuo/${id}`, {
      method: 'GET',
      headers:{
        "content-type":"application/json"
      }
    });

    const data = await result.json();

    if (data.success && data.resunt && data.resunt.residesc) {
      return data.resunt.residesc;
    } else {
      console.warn('Resposta inválida:', data);
      return null;
    }

  } catch (error) {
    console.error('Erro em buscar residuo:', error);
    return null;
  }
};


async function showContratoLocationGoods(locacao) {
  const contratoDiv = document.querySelector(".contrato");
  const token = localStorage.getItem('token')
  if (!contratoDiv || !token) return;

  const tableList = document.querySelector(".tableLocation");
  if (tableList) {
    tableList.classList.remove("flex");
    tableList.classList.add("hidden");
  }

  const containerBtn = document.querySelector(".btnInitPageMainLoc");
  if (containerBtn) {
    containerBtn.classList.remove("flex");
    containerBtn.classList.add("hidden");
  }

  console.log('mostrar contrato' , locacao)

  try {
    const response = await fetch(`/api/contrato/${locacao.belocode}` , {
      method:'GET',
      headers:{
        "content-type":"application/json",
        Authorization:`Bearer ${token}`
      }
    });
    if (!response.ok){

      const errorData = await response.json()
      Toastify({
      text: errorData.message || "Não foi encontrado o contrato! verifique com suporte por favor.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "#f44336",
    }).showToast();
     throw new Error("Contrato não encontrado.");
       
    } 

    const data = await response.json();
    const contratoHTML = data.result; 

    contratoDiv.innerHTML = contratoHTML;
    contratoDiv.style.display = "block";
     
    const status = contratoDiv.querySelector(".statusLocacaoContainer");
    status.style.display = 'block'
    if(status){
      const statusLocacao = locacao.status || "Não definido"
      status.innerHTML = `<p class = "text-center ">Status da Locação: <br> <strong>${statusLocacao}</strong></p>`;
    };
    
    const btnVoltar = contratoDiv.querySelector("#voltar");
    if (btnVoltar) {
      btnVoltar.addEventListener("click", () => {
        contratoDiv.style.display = "none";

        const table = document.querySelector(".tableLocation");
        if (table) {
          table.classList.remove("hidden");
          table.classList.add("flex");
        }

        const containerBtn = document.querySelector(".btnInitPageMainLoc");
        if (containerBtn) {
          containerBtn.classList.remove("hidden");
          containerBtn.classList.add("flex");
        }
      });
    };

    
    const btnBaixarPdf = document.getElementById("baixarPdf");
  if (btnBaixarPdf) {
    btnBaixarPdf.addEventListener("click", () => {
      const element = document.querySelector(".contrato");
      const opt = {
        margin: 0.5,
        filename: `contrato-locacao-${ locacao.numeroLocacao}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };
      html2pdf().set(opt).from(element).save();
    });
  };

  } catch (error) {
    console.error("Erro ao carregar contrato:", error);
    Toastify({
      text: "Erro ao carregar contrato",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "#f44336",
    }).showToast();
  };
};



//pesquisar por locação
async function searchLocation() {
  
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 2000);
    return;
  };

  try {
    const response = await fetch("/api/locationFinish", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar locações. Status: ${response.status}`);
    };

    const dataFinish = await response.json();
    const locacoes = dataFinish.locacoes || [];

    const numberLocation = document
      .getElementById("numberLocation")
      .value.trim();
    const statusLocation = document
      .getElementById("statusLocation")
      .value.trim();
    const nameClient = document.getElementById("nameClientSearch").value.trim();

    const camposPreenchidos = [
      numberLocation,
      statusLocation,
      nameClient,
    ].filter((value) => value !== "").length;

    if (camposPreenchidos === 0) {
      Toastify({
        text: "Por favor, preencha algum campo de pesquisa.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
      return;
    }

    if (camposPreenchidos > 1) {
      Toastify({
        text: "Preencha somente 1 campo",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "orange",
      }).showToast();
      return;
    }

    const filteredData = locacoes.filter((loc) => {
      const matchNumero = numberLocation
        ? loc.cllonmlo.includes(numberLocation)
        : true;
      const matchStatus = statusLocation
        ? loc.bens.some((bem) =>
            bem.belostat.toLowerCase().includes(statusLocation.toLowerCase())
          )
        : true;
      const matchNome = nameClient
        ? loc.clloclno.toLowerCase().includes(nameClient.toLowerCase())
        : true;

      return matchNumero && matchStatus && matchNome;
    });

    if (filteredData.length === 0) {
      Toastify({
        text: "Nenhuma locação encontrada. Insira um valor válido.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
      return;
    }

    const listaLocacoesFilter = filteredData
      .map((locacao) => {
        if (locacao.bens.length > 0) {
          return locacao.bens.map((bem) => ({
            idClient: locacao.clloid,
            numeroLocacao: locacao.cllonmlo || "Não definido",
            nomeCliente: locacao.clloclno || "Não definido",
            dataLocacao: formatDataPattersBr(locacao.cllodtlo),
            dataDevolucao: formatDataPattersBr(locacao.cllodtdv),
            formaPagamento: locacao.cllopgmt || "Não definido",
            descarte: locacao.cllodesc || "Não definido",
            cidade:locacao.cllocida|| "__",
            bairro:locacao.cllobair || "__",
            refere:locacao.cllorefe || "__",
            rua:locacao.cllorua || "__", 
            qdlt:locacao.clloqdlt || "__" ,   
            residuo:locacao.clloresi || "__" ,
            codigoBem: bem.belocodb || "-",
            belocode:bem.belocode,
            produto: bem.belobem || "Nenhum bem associado",
            quantidade: bem.beloqntd || "-",
            status: bem.belostat || "Não definido",
            observacao: bem.beloobsv || "Sem observação",
            dataInicio: formatDataPattersBr(bem.belodtin),
            dataFim: formatDataPattersBr(bem.belodtfi),
          }));
        } else {
          return [];
        }
      })
      .flat();

    renderTable(listaLocacoesFilter);
    document.querySelector('.popupBackDrop').style.display = "none"
    document.querySelector('.searchLocation').style.display = 'none'
    document.getElementById("resetFilterBtn").style.display = "inline-block";
    document.getElementById("messsageFilter").style.display = "inline-block";
    document.getElementById("messsageFilter").textContent =
      "Tabela filtrada por sua pesquisa.";

    document.getElementById("resetFilterBtn").addEventListener("click", () => {
      frontLocation();
      document.getElementById("resetFilterBtn").style.display = "none";
    });
  } catch (error) {
    console.error("Erro ao buscar e filtrar locações:", error);
  };
};

// BOTÃO DELETAR LOCAÇÃO
function deletarLocationSystem() {
  const btnDeleteLocation = document.querySelector(".buttonDeleteLocation");
  if(!btnDeleteLocation) return

  btnDeleteLocation.addEventListener("click", async () => {
    const selectedCheckbox = document.querySelector(
      ".locacao-checkbox:checked"
    );

    try {
      if (!selectedCheckbox) {
        Toastify({
          text: "Selecione uma Locação para excluir",
          duration: 2000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#f44336",
        }).showToast();
        return;
      }
      const tipo = selectedCheckbox.getAttribute("data-tipo");

      const locacaoData = JSON.parse(selectedCheckbox.value);
      console.log("locacao" , locacaoData)
      const locacaoId = locacaoData.idClient;
      if(!locacaoId) return
      const numeroLocacao = locacaoData?.numeroLocacao
    Swal.fire({
    title: `Excluir a locação ${numeroLocacao}?`,
    text: "Essa ação não poderá ser desfeita!",
    icon: "warning",
    iconColor: "#dc3545", // cor do ícone de alerta
    showCancelButton: true,
    confirmButtonText: "Excluir !",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
    background: "#f8f9fa", // cor de fundo clara
    color: "#212529", // cor do texto
    confirmButtonColor: "#dc3545", // vermelho Bootstrap
    cancelButtonColor: "#6c757d", // cinza Bootstrap
    buttonsStyling: true, // deixa os botões com estilo customizado
    customClass: {
     popup: "rounded-4 shadow-lg", // bordas arredondadas e sombra
     title: "fw-bold text-danger", // título em negrito e vermelho
     confirmButton: "btn btn-danger px-4", // botão vermelho estilizado
     cancelButton: "btn btn-secondary px-4" // botão cinza estilizado
   }
  }).then(async (result) => {
   if (result.isConfirmed) {
      const success =  await deletelocation(locacaoId, tipo, selectedCheckbox.closest("tr"));
      if(success){
        Swal.fire({
        title: "Excluído!",
        text: "A Locação foi removido com sucesso.",
        icon: "success",
        confirmButtonColor: "#198754", 
        confirmButtonText: "OK",
        background: "#f8f9fa",
        customClass: {
        popup: "rounded-4 shadow-lg"
      }
    });
    };
   };
  });

    } catch (error) {
      console.error("Erro ao excluir locação", error);
      Toastify({
        text: "Erro ao validar locação antes da exclusão.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
    }
  });
};

  //  Função de exclusão
  async function deletelocation(id,tipo, rowProd) {
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
      let rota = tipo === "veiculo" ? `/api/locacaoveiculo/${id}` : `/api/deletelocation/${id}`;
      const response = await fetch(rota, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        Toastify({
          text: "Locação excluida com sucesso",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#1d5e1d",
        }).showToast();

        rowProd.remove();
        return true
      } else {
        if (response.status === 400) {
          Toastify({
            text: data.message, // Mensagem retornada do backend
            duration: 4000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "orange",
          }).showToast();
          return false
        } else {
          console.log("Erro para excluir:", data);
          Toastify({
            text: "Erro a excluir locação. Server",
            duration: 2000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#f44336",
          }).showToast();
          return false
        };
      };
    } catch (error) {
      console.error("Erro ao excluir locação:", error);
      Toastify({
        text: "Erro ao excluir locação. Tente novamente.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
      return false
    };
  };

// Editar Locação

function editLocation() {
    const token = localStorage.getItem("token");

        if (!token || isTokenExpired(token)) {
          Toastify({
            text: "Sessão expirada. Faça login novamente.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "RED",
          }).showToast();

          localStorage.removeItem("token");
          setTimeout(() => {
            window.location.href = "/index.html";
          }, 2000);
          return;
        }

  const buttonEditLocation = document.querySelector(".buttonEditLocation");
  if (buttonEditLocation) {
    buttonEditLocation.addEventListener("click", async () => {
      const selectedCheckbox = document.querySelector(
        ".locacao-checkbox:checked"
      );

      try {
        if (!selectedCheckbox) {
          Toastify({
            text: "Selecione uma Locação para editar",
            duration: 2000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#f44336",
          }).showToast();
          return;
        }
        const contentEditlocation = document.querySelector(
          ".containerEditLocation"
        );
        if (contentEditlocation) {
          contentEditlocation.classList.remove("hidden");
          contentEditlocation.classList.add("flex");
        }

        const btnInitPageMainLoc = document.querySelector(
          ".btnInitPageMainLoc"
        );
        if (btnInitPageMainLoc) {
          btnInitPageMainLoc.classList.remove("flex");
          btnInitPageMainLoc.classList.add("hidden");
        }

        const listLocation = document.querySelector(".tableLocation");
        if (listLocation) {
          listLocation.classList.remove("flex");
          listLocation.classList.add("hidden");
        }

        const locacaoData = JSON.parse(selectedCheckbox.value);
      
        if(locacaoData){
           const status = locacaoData?.status
            if(status === "Em Locação"){
              Toastify({
              text: "A locação selecionada já possui um bem em locação!",
              duration: 3000,
              close: true,
              gravity: "top",
              position: "center",
              backgroundColor: "orange",
            }).showToast();
             return;
            }
        };
        const locacaoId = locacaoData.numeroLocacao;
       
         preencherFormularioDeEdicao(locacaoData);

      
      
      } catch (error) {
        console.error('ERRO NA APLICAÇÃO PARA EDITAR LOCAÇÃO' , error)
      }
    });
  };
};

//PRECHER FORMULARIO DE EDIÇÃO
async function preencherFormularioDeEdicao(locacao) {
  if (!locacao) return;

  function formatDateToInput(dateStr) {
  const [dia, mes, ano] = dateStr.split("/");
  return `${ano}-${mes}-${dia}`;
}

let dataForUpdate = ""
  // Campos principais da locação
  document.getElementById("idLocation").value = locacao.numeroLocacao || "Invalido";
  document.getElementById("clientList").value = locacao.nomeCliente || "Não foi informado";

  const dataDevolucao = document.getElementById("dateDev").value = formatDateToInput(locacao.dataDevolucao);
  const dataFinal = document.getElementById("dataFim1Edit").value = formatDateToInput(locacao.dataFim) || "";
  if(dataDevolucao && dataFinal){
     dataForUpdate = {
        dataDevolucao:dataDevolucao,
        dataFinal:dataFinal
     }
  }

  // Campos do bem (assumindo 1 bem por seleção)
  document.getElementById("familyEdit").value = locacao.codigoBem || "";
  document.getElementById("produtoEdit").value = locacao.produto || "";
  document.getElementById("quantidadeEdit").value = locacao.quantidade || "";
  document.getElementById("observacaoEdit").value = locacao.observacao || "";
  document.getElementById("dataInicio1Edit").value = formatDateToInput(locacao.dataInicio) || "";
 
  document.getElementById("belocode1Edit").value = locacao.belocode || "";

  // Se quiser deixar o campo de data inicial readonly
  document.getElementById("dataInicio1Edit").readOnly = true;

  await editarlocationFinish(locacao.belocode , dataForUpdate);
}

 function clearInputsEdition(){

  document.getElementById("familyEdit").value = "";
  document.getElementById("produtoEdit").value = "";
  document.getElementById("quantidadeEdit").value = "";
  document.getElementById("observacaoEdit").value = "";
  document.getElementById("dataInicio1Edit").value = "";
  document.getElementById("idLocation").value = "";
  document.getElementById("clientList").value = "";
  document.getElementById("dateDev").value = "";
  document.getElementById("dataFim1Edit").value = "";

};

// FUNÇAÕ DE ENVIAR A EDIÇÃ
async function editarlocationFinish(id , dataForUpdate) {
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

  const buttonSave = document.querySelector(".save");
  if (buttonSave) {
    buttonSave.addEventListener("click", async (event) => {
      event.preventDefault();
        
      const result = await Swal.fire({
        title: `Atualizar locacao ?`,
        text: "Você tem certeza de que deseja atualizar os dados desta locação?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Atualizar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
        confirmButtonColor: "#1d5e1d",
        cancelButtonColor: "#d33"
      });

      if (!result.isConfirmed) return;

      try {
            const quantidade = document.getElementById("quantidadeEdit")?.value.trim();
            const observacao = document.getElementById("observacaoEdit")?.value.trim();
            const dataDevolucao = document.getElementById("dateDev")?.value;
            const dataFinal = document.getElementById("dataFim1Edit")?.value;
            if(!quantidade || !observacao) return

          const payloadUpdate = {
               quantidade,
               observacao,
               dataDevolucao:dataDevolucao,
               dataFinal: dataFinal
          }
          console.log('data' , payloadUpdate.dataDevolucao)
           
         const updateLocation = await fetch(`/api/location/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payloadUpdate)
       });

     const result = await updateLocation.json();
     console.log('resultado' ,  result)

if (updateLocation.ok) {
  Toastify({
    text: result.message || "Locação atualizada com sucesso!",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "center",
    backgroundColor: "#1d5e1d",
  }).showToast();
  clearInputsEdition()
} else {
  if (result.errors && Array.isArray(result.errors)) {
    result.errors.forEach(err => {
      Toastify({
        text: `${err.message}`, 
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
    });
  } else {
    Toastify({
      text: result.error || "Erro ao atualizar locação!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "#f44336",
    }).showToast();
  }
}
      } catch (error) {
        console.error('Erro para atualizar a locação' , error);

        Toastify({
        text: "Erro para atualizar.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
        }).showToast();
      }

    });
  };
};

// ADICIONAR UM NOVO BEM A LOCAÇÃO
async function addNewGoodsInLocation(novosBens, token) {
  if (novosBens.length > 0) {
   
    try {
      const responseNovoBem = await fetch(`/api/novobem/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          newGoods: novosBens,
        }),
      });

      if (!responseNovoBem.ok) throw new Error("Erro ao inserir novos bens");

      Toastify({
        text: "Novos bens vinculados com sucesso!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#1d5e1d",
      }).showToast();
    } catch (error) {
      console.error("🔥 Erro ao inserir novos bens:", error);
      Toastify({
        text:"Erro ao inserir bens no servidor.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
    }
  };
};


