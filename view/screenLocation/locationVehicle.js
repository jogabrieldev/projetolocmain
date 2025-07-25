
function interationSystemLocationVehicle() {
  const btnAtiLocationVehicle = document.querySelector(
    ".btnAtiLocationVehicle"
  );
  if (btnAtiLocationVehicle) {
    btnAtiLocationVehicle.addEventListener("click", () => {
      const containerLocationVehicles = document.querySelector(
        ".containerLocationVehicles"
      );
      if (containerLocationVehicles) {
        mostrarElemento(containerLocationVehicles);
      }

      const containerdecision = document.querySelector(".decisionHeader");
      if (containerdecision) {
        esconderElemento(containerdecision);
      }

      const textTypeLocation = document.querySelector(".textTypeLocation");
      if (textTypeLocation) {
        textTypeLocation.innerHTML = "<b>Locação de Veiculos</b>";
      }
    });
  }

  const btnOutLocationVehicles = document.querySelector(
    ".btnOutLocationVehicles"
  );
  if (btnOutLocationVehicles) {
    btnOutLocationVehicles.addEventListener("click", () => {
      const containerLocationVehicles = document.querySelector(
        ".containerLocationVehicles"
      );
      if (containerLocationVehicles) {
        esconderElemento(containerLocationVehicles);
      }

      const containerdecision = document.querySelector(".decisionHeader");
      if (containerdecision) {
        mostrarElemento(containerdecision);
      }
    });
  }

  const btnloadLocationVehicles = document.querySelector('.buttonLoadLocationVihicle')
  if(btnloadLocationVehicles){
     btnloadLocationVehicles.addEventListener('click' , ()=>{
          frontLocationVeiculos()
     })
  }
}

function hoursField(field){

    try {
        const index = field.replace(/\D/g, '')
        const hrField = document.getElementById(`time${index}`)

         const hoje = new Date()
         const horas = String(hoje.getHours()).padStart(2, "0");
        const minutos = String(hoje.getMinutes()).padStart(2, "0");
        hrField.value = `${horas}:${minutos}`;

    } catch (error) {
        console.error('Erro em carregar horario no campo')
    }
}

async function loadVehicles() {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch('/api/listauto', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    const veiculos = await res.json();
   
    const veiculoMap = new Map();

    const veiculosFiltrados = veiculos.filter(item => item.caaustat === 'Disponivel' && item.caauloca === 'Sim');

    // Preenche os dois selects
    ['veiculo1', 'veiculo2'].forEach(selectId => {
      const select = document.getElementById(selectId);
      if (!select) return;

      // Limpa antes de adicionar as opções
      select.innerHTML = '<option selected disabled value="">Selecione...</option>';

      veiculosFiltrados.forEach(item => {
        const option = document.createElement('option');
        option.value = item.caaucode;
        option.textContent = `${item.caaucode}`;
        select.appendChild(option);

        // Salva o veículo no mapa, usando o código como chave
        veiculoMap.set(item.caaucode, item);
      });

      // Evento de mudança de seleção
      select.addEventListener('change', () => {
        const selectedCode = select.value;
        const data = veiculoMap.get(selectedCode);
        const index = selectId.replace(/\D/g, ''); // pega o número (1 ou 2)

        const placaInput = document.getElementById(`placa${index}`);
        const modeloInput = document.getElementById(`modelo${index}`);

        if (data) {
          if (placaInput) placaInput.value = data.caauplac || '';
          if (modeloInput) modeloInput.value = `${data.caaumaca} ${data.caaumode}` || '';
        }
      });
    });

  } catch (error) {
    console.error('Erro ao carregar veículos:', error);
  }
}

// locação 
async function locationTheVehicle() {

  try {

    const numericLocation = await obterNumeroLocacao();
    document.querySelector("#numeroLocation").value = numericLocation;
    const nameClient = document.querySelector("#nameClient").value;
    const cpfClient = document.querySelector("#cpfClient").value;
    const cpfOrCnpj = cpfClient.replace(/\D/g, '')
    const userClientValidade = [nameClient, cpfOrCnpj];
    const dataLocStr = document.getElementById("dataLoc")?.value || null;
    const dataDevoStr = document.getElementById("DataDevo")?.value || null;
    const pagament = document.getElementById("pagament")?.value || null;
    const residuo = document.getElementById("residuoSelect").value;
    const descart = document.getElementById('locDescarte').value;

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


    if(!residuo){
        Toastify({
        text: "Adicione qual residuo esta envolvido na locação",
        duration: 4000,
        gravity: "top",
        position: "center",
        backgroundColor: "orange",
      }).showToast();
      return; 
    }

    if(!descart){
        Toastify({
        text: "Adicione onde vai ser o local de descarte dessa locação!",
        duration: 4000,
        gravity: "top",
        position: "center",
        backgroundColor: "orange",
      }).showToast();
      return; 
    }

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

    const dataDevo = parseDataLocal(dataDevoStr)

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

    const dateLocation1 = new Date(dataLocStr);
    const dateDevolution = new Date(dataDevoStr);

    const dataLocNormalizada = normalizarData(dateLocation1);
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

    console.log(dateSave);

    const dateLocation = {
      client: userClientValidade,
      cllonmlo: numericLocation,
      cllodtdv: dataDevo.toISOString().split("T")[0],
      cllodtlo: dataLocStr,
      cllopgmt: pagament,
      cllodesc: descart,
      localization: dateSave,
      clloclno:userClientValidade[0],
      clloresi: residuo,
      cllocpcn: userClientValidade[1]
    };


    
    const veiculos = [];

    const veiculo1 = document.getElementById("veiculo1");
    const modelo1 = document.getElementById("modelo1").value;
    const placa1 = document.getElementById("placa1").value;
    const horario1 = document.getElementById("time1").value;
    const carga1 = document.getElementById("carga1").value;
    const quantidade1 = document.getElementById("quantCacamba1").value;
    const observa1 = document.getElementById('obs1').value
    if (veiculo1.value) {
      veiculos.push({
        code: veiculo1.value,
        modelo: modelo1,
        placa: placa1,
        horario: horario1,
        carga: carga1,
        quantidade:quantidade1,
        observacao:observa1,
        status:"Pendente"
      });
    }

    const veiculo2 = document.getElementById("veiculo2");
    const modelo2 = document.getElementById("modelo2").value;
    const placa2 = document.getElementById("placa2").value;
    const horario2 = document.getElementById("time2")?.value;
    const carga2 = document.getElementById("carga2").value;
    const quantidade2 = document.getElementById("quantCacamba2").value;
    const observa2 = document.getElementById('obs2').value

    if (veiculo2.value) {
      veiculos.push({
        code: veiculo2.value,
        modelo: modelo2,
        placa: placa2,
        horario: horario2,
        carga: carga2,
        quantidade:quantidade2,
        observacao:observa2,
        status:'Pendente'
      });
    }

    const camposInvalidos = veiculos.some((v, index) => {
          return (  !v.code || v.code.trim() === "" ||  !v.carga || v.carga.trim() === "" ||!v.quantidade || isNaN(v.quantidade) || Number(v.quantidade) <= 0
         );
      });


      if(camposInvalidos){
         Toastify({
         text: "Preencha todos os campos obrigatórios dos veículos corretamente.",
         duration: 3000,
         close: true,
         gravity: "top",
         position: "center",
         backgroundColor: "red",
       }).showToast();
         return; // impede o envio
      }

    await gerarContratoVeiculos();
    const contratoHTML = document.querySelector(".contratoLocationVehicle").innerHTML.trim();
    if(!contratoHTML){
       return;
    }

    const payloadLocationVehicle = {
      tipo: "veiculo",
      client: dateLocation,
      veiculos: veiculos,
      contrato: contratoHTML
    };
    
     const token = localStorage.getItem('token')
     if(!token)return 
    
    const res = await fetch("/api/locacaoveiculo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payloadLocationVehicle),
    });

    const errorData = await res.json();
  
   if (res.ok) {
    Toastify({
      text: "Locação de Veículo feita com sucesso",
      duration: 4000,
      gravity: "top",
      position: "center",
      backgroundColor: "green",
    }).showToast();


    const codeVehicles = veiculos.map(v => v.code);

    console.log('veiculo' , codeVehicles)

    // Atualiza todos os veículos em paralelo
    const updateRequests = codeVehicles.map(async code =>
      await fetch(`/api/automo/${code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json",
          Authorization:token
         },
        body: JSON.stringify({ caaustat: "Veiculo Locado" }),
      }).then(res => res.json())
        .catch(error => ({ error: true, code, message: error.message }))
    );

    const updateResults = await Promise.all(updateRequests);

    updateResults.forEach(result => {
      if (result.error) {
        console.error(`Erro ao atualizar veículo ${result.code}: ${result.message}`);
        Toastify({
          text: `Erro ao atualizar status do veículo ${result.code}`,
          duration: 4000,
          backgroundColor: "red",
        }).showToast();
        return;
      }
    });

     gerarContratoVeiculos()
     clearFields();
  }else {
      Toastify({
        text: errorData.error || "Erro na locação de veiculo!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
    }
  } catch (error) {
    console.error('Erro location veiculos' , error)

     Toastify({
        text: "Erro no server",
        duration: 4000,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();
  }
}

 async function gerarContratoVeiculos() {
  const cpfCliente = document.getElementById("cpfClient")?.value || "Não informado";
  const nomeCliente = document.getElementById("nameClient")?.value || "Não informado";
  const dataLocacao = document.getElementById("dataLoc")?.value || "Não informado";
  const dataDevolucao = document.getElementById("DataDevo")?.value || "Não informado";
  const numericLocation = document.getElementById("numeroLocation")?.value || "Não informado";
  const pagamento = document.getElementById("pagament")?.value || "Não informado";
  const residuoSelect = document.getElementById('residuoSelect');
  const residuo = residuoSelect?.options[residuoSelect.selectedIndex]?.text || "Não informado";

  const gruposVeiculos = [];
  for (let i = 1; i <= 2; i++) {
    const codeVeiculo = document.getElementById(`veiculo${i}`)?.value || "Não informado";
    const modelo = document.getElementById(`modelo${i}`)?.value || "Não informado";
    const placa = document.getElementById(`placa${i}`)?.value || "Não informado";
    const horario = document.getElementById(`time${i}`)?.value || "Não informado";
    const carga = document.getElementById(`carga${i}`)?.value || "Não informado";

    if (modelo !== "Não informado") {
      gruposVeiculos.push(`
        <tr>
          <td>${codeVeiculo}</td>
          <td>${modelo}</td>
          <td>${placa}</td>
          <td>${horario}</td>
          <td>${carga}</td>
        </tr>
      `);
    }
  }

  const containerContent = document.querySelector(".content");
  if (containerContent) {
    esconderElemento(containerContent);
  }

  const dadosInputsLoc = localStorage.getItem("dadosInputs");
  const enderecoLocacao = dadosInputsLoc ? JSON.parse(dadosInputsLoc) : {};

  const contratoDiv = document.querySelector(".contratoLocationVehicle");
  contratoDiv.innerHTML = `
    <div class="text-dark p-4 rounded bg-secundary">
      <h2 class="text-center mb-4 text-dark"> <b>Contrato de Locação de Veículos</b></h2>
      <hr class="border-light">
      <p><strong>Número da locação:</strong> ${numericLocation}</p>
      <p><strong>Nome do Cliente:</strong> ${nomeCliente}</p>
      <p><strong>CPF/CNPJ do Cliente:</strong> ${cpfCliente}</p>
      
      <div class="border rounded p-3 mb-3 bg-dark-subtle text-white">
        <p class="mb-1"><strong>Endereço para buscar o material:</strong></p>
        <div class="row">
          <div class="col-md-4 text-dark"><strong>Rua:</strong> ${enderecoLocacao?.localizationRua || "-"}</div>
          <div class="col-md-4 text-dark"><strong>Bairro:</strong> ${enderecoLocacao?.localizationBairro || "-"}</div>
          <div class="col-md-4 text-dark"><strong>Cidade:</strong> ${enderecoLocacao?.localizationCida || "-"}</div>
        </div>
        <div class="row">
          <div class="col-md-4 text-dark"><strong>CEP:</strong> ${enderecoLocacao?.localizationCep || "-"}</div>
          <div class="col-md-4 text-dark"><strong>Referência:</strong> ${enderecoLocacao?.localizationRefe || "-"}</div>
          <div class="col-md-4 text-dark"><strong>Quadra/Lote:</strong> ${enderecoLocacao?.localizationQdLt || "-"}</div>
        </div>
      </div> 
       
       <p><strong>Residuo Envolvido na locação:</strong> ${residuo}</p>
      <p><strong>Data da Locação:</strong> ${dataLocacao}</p>
      <p><strong>Data de Devolução:</strong> ${dataDevolucao}</p>
      <p><strong>Forma de Pagamento:</strong> ${pagamento}</p>
      <hr class="border-light">

      <p><strong>Veículos Locados:</strong></p>
      ${
        gruposVeiculos.length > 0
          ? `
          <div class="table-responsive">
            <table class="table table-bordered table-dark table-sm">
              <thead class="table-light">
                <tr>
                  <th>Código do Veículo</th>
                  <th>Modelo</th>
                  <th>Placa</th>
                  <th>Horário</th>
                  <th>Carga</th>
                </tr>
              </thead>
              <tbody>
                ${gruposVeiculos.join("")}
              </tbody>
            </table>
          </div>
          `
          : "<p>Nenhum veículo informado.</p>"
      }

      <div class="text-center mt-4 d-flex justify-content-center gap-2">
        <button id="voltar" class="btn btn-light">Voltar</button>
        <button id="baixarPdf" class="btn btn-success">Salvar como PDF</button>
      </div>
    </div>
  `;

  contratoDiv.style.display = "block";

  const voltarPageContrato = document.getElementById("voltar");
  if (voltarPageContrato) {
    voltarPageContrato.addEventListener("click", () => {
      esconderElemento(contratoDiv);

      const listLocation = document.querySelector(".tableLocation");
      if (listLocation) {
        mostrarElemento(listLocation);
      }

      const buttonMainPage = document.querySelector(".btnInitPageMainLoc");
      if (buttonMainPage) {
        mostrarElemento(buttonMainPage);
      }
    });
  };

};


//TABELA DE LOCAÇÃO
async function frontLocationVeiculos() {
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
    const response = await fetch("/api/locacaoveiculo", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (response.status === 404) {
      document.querySelector(
        ".tableLocation"
      ).innerHTML = `<p style="text-align:center;">Nenhuma locação encontrada.</p>`;
      return;
    }

    const dataFinish = await response.json();
    const locacoes = dataFinish.locacoes || [];

    console.log('locaco veiculos' , locacoes)

    const table = document.querySelector(".tableLocation");
    if (!table) return;

    table.innerHTML = "";

    const listaLocacoes = locacoes.flatMap((locacao) => {
      if (locacao.veiculos && locacao.veiculos.length > 0) {
        return locacao.veiculos.map((veiculo) => ({
          idClient: locacao.clloid,
          numeroLocacao: locacao.cllonmlo || "Não definido",
          nomeCliente: locacao.clloclno || "Não definido",
          dataLocacao: formatDate(locacao.cllodtlo),
          dataDevolucao: formatDate(locacao.cllodtdv),
          formaPagamento: locacao.cllopgmt || "Não definido",
          descarte: locacao.cllodesc || "Não definido",
          localization: {
            cep:locacao.cllocep,
            rua:locacao.cllorua,
            cid:locacao.cllocida,
            ref:locacao.cllorefe || '-',
            bai:locacao.cllobair,
            qdr:locacao.clloqdlt || "-"
          },
          residuo: locacao.clloresi,
          veloidau: veiculo.veloidau || "-",
          veloplac: veiculo.veloplac || "-",
          velomode: veiculo.velomode || "-",
          velotime: veiculo.velotime || "-",
          velotpca: veiculo.velotpca || "-",
          velostat: veiculo.velostat || "Não definido",
        }));
      } else {
        return []; // Ignora locações sem veículos
      }
    });

    renderTableVeiculos(listaLocacoes);
  } catch (error) {
    console.error("Erro ao buscar locações com veículos:", error);
  }
}

function renderTableVeiculos(data) {
  const tableDiv = document.querySelector(".tableLocation");

  tableDiv.innerHTML = "";

  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.justifyContent = "space-between";
  container.style.alignItems = "center";
  container.style.marginBottom = "10px";

  const title = document.createElement("h2");
  title.textContent = "Locações de Veículos";

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
    "Placa",
    "Modelo",
    "Horário",
    "Tipo Carga",
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
    checkbox.setAttribute("data-tipo", "veiculo");
    checkbox.value = locacao.numeroLocacao;

    checkbox.classList.add("locacao-checkbox");
    checkbox.value = JSON.stringify(locacao);
    checkboxTd.appendChild(checkbox);
    row.appendChild(checkboxTd);
    

    [
      "numeroLocacao",
      "velostat",
      "nomeCliente",
      "dataLocacao",
      "dataDevolucao",
      "formaPagamento",
      "veloplac",
      "velomode",
      "velotime",
      "velotpca",
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
      showContratoLocacao(locacao)
     
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
    emptyTd.textContent = "Nenhuma locação com veículos encontrada.";
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

      document.querySelectorAll(".locacao-checkbox").forEach((cb) => {
        if (JSON.parse(cb.value).numeroLocacao === locacaoData.numeroLocacao) {
          cb.checked = isChecked;
        }
      });
    });
  });

  document.querySelector(".searchloc").addEventListener("click", () => {
    document.querySelector(".searchLocation").style.display = "flex";
  });
}

async function showContratoLocacao(locacao) {

  const contratoDiv = document.querySelector(".contratoLocationVehicle");
  if (!contratoDiv) return;

  const nameResiduo = await buscarResiduo(locacao.residuo)
  if(!nameResiduo || nameResiduo === null){
     return
  };

  const destinoDescarte = await buscarLocalDescarte(locacao.descarte)
  if(!destinoDescarte || destinoDescarte === null){
     return
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    
    if (dateStr.includes("/")) {
      const [ano, mes, dia] = dateStr.split("/");
      return `${dia}/${mes}/${ano}`;
    } else {
      const d = new Date(dateStr);
      return isNaN(d) ? "-" : d.toLocaleDateString("pt-BR");
    }
  };

  const container = document.createElement("div");
  container.className = "text-dark p-4 rounded";

  const h2 = document.createElement("h2");
  h2.className = "text-center mb-4";
  h2.textContent = "Contrato de Locação de Veículos";
  container.appendChild(h2);

  const hr1 = document.createElement("hr");
  hr1.className = "border-light";
  container.appendChild(hr1);

  const pNumero = document.createElement("p");
  pNumero.innerHTML = `<strong>Número da locação:</strong> ${locacao.numeroLocacao}`;
  container.appendChild(pNumero);

  const pNome = document.createElement("p");
  pNome.innerHTML = `<strong>Nome do Cliente:</strong> ${locacao.nomeCliente}`;
  container.appendChild(pNome);

 const descarteDiv = document.createElement("div");
  descarteDiv.className = "border rounded p-3 mb-3 bg-dark-subtle text-white";
  descarteDiv.innerHTML = `
    <p class="mb-1"><i class="bi bi-trash-fill"></i> <strong>Endereço do Descarte:</strong></p>
    <div class="row">
      <div class="col-md-4 text-dark"><strong>Nome:</strong> ${destinoDescarte?.derenome || "-"}</div>
      <div class="col-md-4 text-dark"><strong>Tipo:</strong> ${destinoDescarte?.deretipo || "-"}</div>
      <div class="col-md-4 text-dark"><strong>Rua:</strong> ${destinoDescarte?.dererua || "-"}</div>
    </div>
    <div class="row">
      <div class="col-md-4 text-dark"><strong>Bairro:</strong> ${destinoDescarte?.derebair || "-"}</div>
      <div class="col-md-4 text-dark"><strong>Cidade:</strong> ${destinoDescarte?.derecida || "-"}</div>
      <div class="col-md-4 text-dark"><strong>CEP:</strong> ${destinoDescarte?.derecep || "-"}</div>
    </div>
    <div class="row">
      <div class="col-md-4 text-dark"><strong>Estado:</strong> ${destinoDescarte?.dereestd || "-"}</div>
    </div>`;

    container.appendChild(descarteDiv)

  const enderecoDiv = document.createElement("div");
  enderecoDiv.className = "border rounded p-3 mb-3 bg-dark-subtle text-white";

  const enderecoTitulo = document.createElement("p");
  enderecoTitulo.className = "mb-1";
  enderecoTitulo.innerHTML = `<strong>Endereço da Locação:</strong>`;
  enderecoDiv.appendChild(enderecoTitulo);

  const row1 = document.createElement("div");
  row1.className = "row";

  const ruaDiv = document.createElement("div");
  ruaDiv.className = "col-md-4 text-dark";
  ruaDiv.innerHTML = `<strong>Rua:</strong> ${locacao.localization?.rua || "-"}`;
  row1.appendChild(ruaDiv);

  const bairroDiv = document.createElement("div");
  bairroDiv.className = "col-md-4 text-dark";
  bairroDiv.innerHTML = `<strong>Bairro:</strong> ${locacao.localization?.bai || "-"}`;
  row1.appendChild(bairroDiv);

  const cidadeDiv = document.createElement("div");
  cidadeDiv.className = "col-md-4 text-dark";
  cidadeDiv.innerHTML = `<strong>Cidade:</strong> ${locacao.localization?.cid || "-"}`;
  row1.appendChild(cidadeDiv);

  enderecoDiv.appendChild(row1);

  const row2 = document.createElement("div");
  row2.className = "row";

  const cepDiv = document.createElement("div");
  cepDiv.className = "col-md-4 text-dark";
  cepDiv.innerHTML = `<strong>CEP:</strong> ${locacao.localization?.cep || "-"}`;
  row2.appendChild(cepDiv);

  const refDiv = document.createElement("div");
  refDiv.className = "col-md-4 text-dark";
  refDiv.innerHTML = `<strong>Referência:</strong> ${locacao.localization?.ref || "-"}`;
  row2.appendChild(refDiv);

  const qdrDiv = document.createElement("div");
  qdrDiv.className = "col-md-4 text-dark";
  qdrDiv.innerHTML = `<strong>Quadra/Lote:</strong> ${locacao.localization?.qdr || "-"}`;
  row2.appendChild(qdrDiv);

  enderecoDiv.appendChild(row2);

  container.appendChild(enderecoDiv);

  const pResiduo = document.createElement("p");
  pResiduo.innerHTML = `<strong>Residuo Envolvido:</strong> ${nameResiduo  || "-"}`;
  container.appendChild(pResiduo);

  const pDataLoc = document.createElement("p");
  pDataLoc.innerHTML = `<strong>Data da Locação:</strong> ${formatDate(locacao.dataLocacao)}`;
  container.appendChild(pDataLoc);

  const pDataDev = document.createElement("p");
  pDataDev.innerHTML = `<strong>Data de Devolução:</strong> ${formatDate(locacao.dataDevolucao)}`;
  container.appendChild(pDataDev);

  const pPagamento = document.createElement("p");
  pPagamento.innerHTML = `<strong>Forma de Pagamento:</strong> ${locacao.formaPagamento || "-"}`;
  container.appendChild(pPagamento);

  const hr2 = document.createElement("hr");
  hr2.className = "border-light";
  container.appendChild(hr2);

  const pVeiculos = document.createElement("p");
  pVeiculos.innerHTML = `<strong>Veículos Locados:</strong>`;
  container.appendChild(pVeiculos);

  const tableResponsive = document.createElement("div");
  tableResponsive.className = "table-responsive";

  const table = document.createElement("table");
  table.className = "table table-bordered table-dark table-sm";

  const thead = document.createElement("thead");
  thead.className = "table-light";

  const trHead = document.createElement("tr");
  ["Código", "Modelo", "Placa", "Horário", "Tipo de Carga"].forEach(headerText => {
    const th = document.createElement("th");
    th.textContent = headerText;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  // Itera sobre o array de veículos, se existir
 
      const trVeiculo = document.createElement("tr");

      const tdCodigo = document.createElement("td");
      tdCodigo.textContent = locacao.veloidau || "-";
      trVeiculo.appendChild(tdCodigo);

      const tdModelo = document.createElement("td");
      tdModelo.textContent = locacao.velomode || "-";
      trVeiculo.appendChild(tdModelo);

      const tdPlaca = document.createElement("td");
      tdPlaca.textContent = locacao.veloplac || "-";
      trVeiculo.appendChild(tdPlaca);

      const tdHorario = document.createElement("td");
      tdHorario.textContent = locacao.velotime || "-";
      trVeiculo.appendChild(tdHorario);

      const tdTipoCarga = document.createElement("td");
      tdTipoCarga.textContent = locacao.velotpca || "-";
      trVeiculo.appendChild(tdTipoCarga);

      tbody.appendChild(trVeiculo);
   
  table.appendChild(tbody);
  tableResponsive.appendChild(table);
  container.appendChild(tableResponsive);

  // Botões de ação
  const divBtn = document.createElement("div");
  divBtn.className = "text-center mt-4 d-flex justify-content-center gap-2";

  const btnVoltar = document.createElement("button");
  btnVoltar.id = "voltar";
  btnVoltar.className = "btn btn-light";
  btnVoltar.textContent = "Voltar";

   const btnSalvar = document.createElement("button");
  btnSalvar.id = "baixarPdf";
  btnSalvar.className = "btn btn-success";
  btnSalvar.innerHTML = `<i class="bi bi-arrow-down-circle-fill me-2"></i>Baixar PDF`;

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

  divBtn.appendChild(btnVoltar);
  divBtn.appendChild(btnSalvar)
  container.appendChild(divBtn);

  contratoDiv.appendChild(container);

  contratoDiv.style.display = "block";

  const table1 = document.querySelector(".tableLocation");
  if (table1) {
    table1.classList.remove("flex");
    table1.classList.add("hidden");
  }
  const containerBtn = document.querySelector(".btnInitPageMainLoc");
  if (containerBtn) {
    containerBtn.classList.remove("flex");
    containerBtn.classList.add("hidden");
  }

   const btnBaixarPdf = document.getElementById("baixarPdf");
  if (btnBaixarPdf) {
    btnBaixarPdf.addEventListener("click", () => {
      const element = document.querySelector(".contratoLocationVehicle");
      const opt = {
        margin: 0.5,
        filename: `contrato-locacao-${locacao.numeroLocacao}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };
      html2pdf().set(opt).from(element).save();
    });
  }
}



