
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

async function loadingVehicle(car) {
  const select = document.getElementById(car);
  const token = localStorage.getItem('token');

  if (!token || !select) return;

  const res = await fetch('/api/listauto', {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });

  const veiculos = await res.json();

  const veiculoMap = new Map();


  veiculos.forEach(item => {
    if (item.caaustat === 'Ativo') {
      const option = document.createElement('option');
      option.value = item.caaucode;
      option.textContent = `${item.caaucode}`;
      select.appendChild(option);

      veiculoMap.set(item.caaucode, item);
    }
  });

  // Preenche automaticamente placa e modelo ao selecionar
  select.addEventListener('change', () => {
    const selectedCode = select.value;
    const data = veiculoMap.get(selectedCode);

    if (data) {
      const index = car.replace(/\D/g, ''); // extrai "1" de "veiculo1"
      const placaInput = document.getElementById(`placa${index}`);
      const modeloInput = document.getElementById(`modelo${index}`);

      if (placaInput) placaInput.value = data.caauplac || '';
      if (modeloInput) modeloInput.value = `${data.caaumaca} ${data.caaumode}` || '';
    }
  });
}


async function locationTheVehicle() {

  try {

    
    const numericLocation = await obterNumeroLocacao();
    document.querySelector("#numeroLocation").value = numericLocation;
    const nameClient = document.querySelector("#nameClient").value;
    const cpfClient = document.querySelector("#cpfClient").value;

    const userClientValidade = [nameClient, cpfClient];
    const dataLocStr = document.getElementById("dataLoc")?.value || null;
    const dataDevoStr = document.getElementById("DataDevo")?.value || null;
    const pagament = document.getElementById("pagament")?.value || null;
    const residuo = document.getElementById("residuoSelect").value;


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
      localization: dateSave,
      clloclno:userClientValidade[0],
      clloresi: residuo,
      cllocpf: userClientValidade[1]
    };

    const veiculos = [];

    const veiculo1 = document.getElementById("veiculo1");
    const modelo1 = document.getElementById("modelo1").value;
    const placa1 = document.getElementById("placa1").value;
    const horario1 = document.getElementById("time1").value;
    const carga1 = document.getElementById("carga1").value;

    if (veiculo1.value) {
      veiculos.push({
        code: veiculo1.value,
        modelo: modelo1,
        placa: placa1,
        horario: horario1,
        carga: carga1,
        status:"Pendente"
      });
    }

    const veiculo2 = document.getElementById("veiculo2");
    const modelo2 = document.getElementById("modelo2").value;
    const placa2 = document.getElementById("placa2").value;
    const horario2 = document.getElementById("time2")?.value;
    const carga2 = document.getElementById("carga2").value;

    if (veiculo2.value) {
      veiculos.push({
        code: veiculo2.value,
        modelo: modelo2.value,
        placa: placa2,
        horario: horario2,
        carga: carga2,
        status:'Pendente'
      });
    }

    const body = {
      tipo: "veiculo",
      client: dateLocation,
      veiculos: veiculos,
    };

    console.log("body", body);

    const res = await fetch("/api/locacaoveiculo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const errorData = await res.json();
  
   
    if (res.ok) {
      Toastify({
        text: "Locaçaõ de Veiculo feita com sucesso",
        duration: 4000,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();

        clearFields();

    }  else {
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

    const table = document.querySelector(".tableLocation");
    if (!table) return;

    table.innerHTML = "";

    const listaLocacoes = locacoes.flatMap((locacao) => {
      if (locacao.veiculos && locacao.veiculos.length > 0) {
        return locacao.veiculos.map((veiculo) => ({
          idClient: locacao.clloid,
          numeroLocacao: locacao.cllonmlo || "Não definido",
          nomeCliente: locacao.clloclno || "Não definido",
          cpfCliente: locacao.cllocpf || "Não definido",
          dataLocacao: formatDate(locacao.cllodtlo),
          dataDevolucao: formatDate(locacao.cllodtdv),
          formaPagamento: locacao.cllopgmt || "Não definido",
          velocode: veiculo.velocode,
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
  title.textContent = "Locações com Veículos";

  const messageFilter = document.createElement("span");
  messageFilter.id = "messsageFilter";
  messageFilter.style.display = "none";

  const resetFilterBtn = document.createElement("button");
  resetFilterBtn.id = "resetFilterBtn";
  resetFilterBtn.style.display = "none";
  resetFilterBtn.textContent = "Remover Filtro";

  const searchBtn = document.createElement("button");
  searchBtn.classList.add("searchloc");
  searchBtn.textContent = "Buscar Locação";

  container.appendChild(title);
  container.appendChild(messageFilter);
  container.appendChild(resetFilterBtn);
  container.appendChild(searchBtn);

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
    "CPF do Cliente",
    "Data da Locação",
    "Data de Devolução",
    "Forma de Pagamento",
    "Código Veículo",
    "Identificador",
    "Placa",
    "Modelo",
    "Horário",
    "Tipo Carga",
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
      "velostat",
      "nomeCliente",
      "cpfCliente",
      "dataLocacao",
      "dataDevolucao",
      "formaPagamento",
      "velocode",
      "veloidau",
      "veloplac",
      "velomode",
      "velotime",
      "velotpca",
    ].forEach((key) => {
      const td = document.createElement("td");
      td.textContent = locacao[key];
      row.appendChild(td);
    });

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

