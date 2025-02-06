const btnInitCadDrive = document.querySelector(".btnCadMotorista");
btnInitCadDrive.addEventListener("click", () => {

  const containerAppFabri = document.querySelector(".containerAppFabri");
  containerAppFabri.style.display = "none";

  const containerAppClient = document.querySelector(".containerAppClient");
  containerAppClient.style.display = "none";

  const containerAppBens = document.querySelector(".containerAppBens");
  containerAppBens.style.display = "none";

  const containerAppForn = document.querySelector(".containerAppForn");
  containerAppForn.style.display = "none";

  const containerAppProd = document.querySelector(".containerAppProd");
  containerAppProd.style.display = "none";

  const containerAppTypeProd = document.querySelector(".containerAppTipoProd");
  containerAppTypeProd.style.display = "none";

  const containerForm = document.querySelector(".RegisterDriver");
  containerForm.style.display = "none";

  const containerFormEditDriver = document.querySelector(".containerFormEditDriver");
  containerFormEditDriver.style.display = "none";

  const containerAppDriver = document.querySelector(".containerAppDriver");
  containerAppDriver.style.display = "flex";

  const listingDrive = document.querySelector(".listingDriver");
  listingDrive.style.display = "flex";

  const btnMainPage = document.querySelector(".btnInitPageMain");
  btnMainPage.style.display = "flex";

  const informative = document.querySelector(".information");
  informative.style.display = "block";
  informative.textContent = "SEÇÃO MOTORISTA";
});

const registerDriver = document.querySelector(".registerDriver");
registerDriver.addEventListener("click", () => {

  const formRegisterDriver = document.querySelector(".RegisterDriver");
  formRegisterDriver.style.display = "flex";

  const listingDriver = document.querySelector(".listingDriver");
  listingDriver.style.display = "none";

  const btnPageMain = document.querySelector(".btnInitPageMain");
  btnPageMain.style.display = "none";
});

const btnOutSectionDriver = document.querySelector('.buttonExitDriver')
btnOutSectionDriver.addEventListener('click', ()=>{

  const containerAppDriver = document.querySelector(".containerAppDriver");
  containerAppDriver.style.display = "none";

})

const btnOutPageDrive = document.querySelector(".btnOutPageRegister");
btnOutPageDrive.addEventListener("click", (event) => {
  event.preventDefault();

  const formRegisterDriver = document.querySelector(".RegisterDriver");
  formRegisterDriver.style.display = "none";

  const listingDriver = document.querySelector(".listingDriver");
  listingDriver.style.display = "flex";

  const btnPageMain = document.querySelector(".btnInitPageMain");
  btnPageMain.style.display = "flex";
});

const btnOutformPageEdit = document.querySelector('.btnOutPageRegisterEdit')
btnOutformPageEdit.addEventListener('click' , (event)=>{
    event.preventDefault()

    const containerFormEditDriver = document.querySelector('.containerFormEditDriver')
    containerFormEditDriver.style.display = 'none'

    const listingDriver = document.querySelector(".listingDriver");
    listingDriver.style.display = "flex";

    const btnPageMain = document.querySelector(".btnInitPageMain");
     btnPageMain.style.display = "flex";
});

const formRegisterDriver = document.querySelector(".formRegisterDriver");
formRegisterDriver.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  if (
    Object.keys(data).length === 0 ||
    Object.values(data).some((val) => val === "")
  ) {
    console.log("Formulario Vazio");
    Toastify({
      text: "Por favor, preencha o formulário antes de enviar.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return;
  }

    await fetch("/api/drive/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        console.log("deu certo");

        Toastify({
          text: "Cadastrado com Sucesso",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();

        document.querySelector(".formRegisterDriver").reset();
        return;
      } else {
        console.log("deu erro viu");

        Toastify({
          text: "Erro no cadastro",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
      }
    })
    .catch((error) => {
      console.error("deu erro no envio", error);
    });
});

//listagem de motorista

async function fetchListMotorista() {
  try {
    const response = await fetch("/api/listingdriver");
    const motorista = await response.json();

    const motoristaListDiv = document.querySelector(".listingDriver");
    motoristaListDiv.innerHTML = "";

    if (motorista.length > 0) {
      const tabela = document.createElement("table");
      tabela.style.width = "100%";
      tabela.setAttribute("border", "1");

      const cabecalho = tabela.createTHead();
      const linhaCabecalho = cabecalho.insertRow();
      const colunas = [
        "Selecionar",
        "Código",
        "Nome",
        "Data de Nascimento",
        "CPF",
        "Data de Emisão",
        "Categoria da CNH",
        "Data de vencimento",
        "Restrições",
        "Orgão Emissor",
        "Celular",
        "CEP",
        "Rua",
        "Cidade",
        "Estado",
        "E-mail",
      ];

      colunas.forEach((coluna) => {
        const th = document.createElement("th");
        th.textContent = coluna;
        linhaCabecalho.appendChild(th);
      });

      const corpo = tabela.createTBody();
      motorista.forEach((motorista) => {
        const linha = corpo.insertRow();

        linha.setAttribute("data-motocode", motorista.motocode);

        const checkboxCell = linha.insertCell();
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "selectDriver";
        checkbox.value = motorista.motocode;

        const motoristaData = JSON.stringify(motorista);
        if (motoristaData) {
          checkbox.dataset.motorista = motoristaData;
        } else {
          console.warn(`Fornecedor inválido encontrado:`, motorista);
        }

        checkboxCell.appendChild(checkbox);

        const formatDate = (isoDate) => {
          if (!isoDate) return "";
          const dateObj = new Date(isoDate);
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, "0");
          const day = String(dateObj.getDate()).padStart(2, "0");
          return `${year}/${month}/${day}`;
        };

        linha.insertCell().textContent = motorista.motocode;
        linha.insertCell().textContent = motorista.motoname;
        linha.insertCell().textContent = formatDate(motorista.motodtnc);
        linha.insertCell().textContent = motorista.motocpf;
        linha.insertCell().textContent = formatDate(motorista.motodtch);
        linha.insertCell().textContent = motorista.motoctch;
        linha.insertCell().textContent = formatDate(motorista.motodtvc);
        linha.insertCell().textContent = motorista.motorest;
        linha.insertCell().textContent = motorista.motoorem;
        linha.insertCell().textContent = motorista.motocelu;
        linha.insertCell().textContent = motorista.motocep;
        linha.insertCell().textContent = motorista.motorua;
        linha.insertCell().textContent = motorista.motocity;
        linha.insertCell().textContent = motorista.motoestd;
        linha.insertCell().textContent = motorista.motomail;
      });

      motoristaListDiv.appendChild(tabela);
    } else {
      motoristaListDiv.innerHTML = "<p>Nenhum fornecedor cadastrado.</p>";
    }
  } catch (error) {
    console.error("Erro ao carregar fornecedores:", error);
    document.querySelector(".listingDriver").innerHTML =
      "<p>Erro ao carregar fornecedores.</p>";
  }
}
fetchListMotorista();

//delete motorista

const btnDeleteDriver = document.querySelector(".buttonDeleteDriver");
btnDeleteDriver.addEventListener("click", async () => {
  const selectedCheckbox = document.querySelector(
    'input[name="selectDriver"]:checked'
  );
  if (!selectedCheckbox) {
    Toastify({
      text: "Selecione um Motorista para excluir",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return;
  }

  const MotoristaSelecionado = JSON.parse(selectedCheckbox.dataset.motorista);
  const motoristaId = MotoristaSelecionado.motocode;

  const confirmacao = confirm(
    `Tem certeza de que deseja excluir o Fabricante com código ${motoristaId}?`
  );
  if (!confirmacao) {
    return;
  }

  await deleteDriver(motoristaId, selectedCheckbox.closest("tr"));
});

async function deleteDriver(id, driverRow) {
  try {
    const response = await fetch(`/api/deletedriver/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log("Resposta do servidor:", data);

    if (response.ok) {
      Toastify({
        text: "O motorista foi excluído com sucesso!",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();

      driverRow.remove();
    } else {
      console.log("Erro para excluir:", data);
      Toastify({
        text: "Erro na exclusão do Motorista",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
    }
  } catch (error) {
    console.error("Erro ao excluir Motorista:", error);
    Toastify({
      text: "Erro ao excluir Motorista. Tente novamente.",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
  }
}

// botão de editar
const btnFormEditDrive = document.querySelector(".buttonEditDriver");
btnFormEditDrive.addEventListener("click", () => {
  const selectedCheckbox = document.querySelector(
    'input[name="selectDriver"]:checked'
  );

  if (!selectedCheckbox) {
    Toastify({
      text: "Selecione um Motorista para editar",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "red",
    }).showToast();
    return;
  }

  const motoristaData = selectedCheckbox.dataset.motorista;
  if (!motoristaData) {
    console.error("O atributo data-motocode está vazio ou indefinido.");
    return;
  }

  try {
    const motoristaSelecionado = JSON.parse(motoristaData);
    // console.log("Editar item:", fabricanteSelecionado);

    // Campos e IDs correspondentes
    const campos = [
      { id: "editMotoCode", valor: motoristaSelecionado.motocode },
      { id: "editMotoNome", valor: motoristaSelecionado.motoname },
      { id: "editMotoDtnc", valor: motoristaSelecionado.motodtnc },
      { id: "editMotoCpf", valor: motoristaSelecionado.motocpf },
      { id: "editMotoDtch", valor: motoristaSelecionado.motodtch },
      { id: "editMotoctch", valor: motoristaSelecionado.motoctch },
      { id: "editMotoDtvc", valor: motoristaSelecionado.motodtvc },
      { id: "editMotoRest", valor: motoristaSelecionado.motorest },
      { id: "editMotoOrem", valor: motoristaSelecionado.motoorem },
      { id: "editMotoCelu", valor: motoristaSelecionado.motocelu },
      { id: "editMotoCep", valor: motoristaSelecionado.motocep },
      { id: "editMotoRua", valor: motoristaSelecionado.motorua },
      { id: "editMotoCity", valor: motoristaSelecionado.motorua },
      { id: "editMotoEstd", valor: motoristaSelecionado.motoestd },
      { id: "editMotoMail", valor: motoristaSelecionado.motomail },
    ];

    console.log(campos);

    // Atualizar valores no formulário
    campos.forEach(({ id, valor }) => {
      const elemento = document.getElementById(id);
      if (elemento) {
        elemento.value = valor || "";
      } else {
        console.warn(`Elemento com ID '${id}' não encontrado.`);
      }
    });

    // Mostrar o formulário de edição e ocultar a lista
    const spaceEditDriver = document.querySelector(".containerFormEditDriver");
    const btnMainPageDriver = document.querySelector(".btnInitPageMain");
    const listingDriver = document.querySelector(".listingDriver");

    if (spaceEditDriver) {
      spaceEditDriver.style.display = "flex";
    } else {
      console.error("O formulário de edição não foi encontrado.");
    }

    if (listingDriver) {
      listingDriver.style.display = "none";
    } else {
      console.error("A lista de motoristas não foi encontrada.");
    }

    if (btnMainPageDriver) {
      btnMainPageDriver.style.display = "none";
    }
  } catch (error) {
    console.error("Erro ao fazer parse de data-bem:", error);
  }
});

async function editAndUpdateOfDriver() {
  const formEditDrive = document.querySelector(".formEditDriver");

  formEditDrive.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const selectedCheckbox = document.querySelector(
      'input[name="selectDriver"]:checked'
    );

    if (!selectedCheckbox) {
      console.error("Nenhum checkbox foi selecionado.");
      return;
    }

    const motoristaId = selectedCheckbox.dataset.motorista;

    if (!motoristaId) {
      console.error("O atributo data-bem está vazio ou inválido.");
      return;
    }

    let motoIdParsed;
    try {
      motoIdParsed = JSON.parse(motoristaId).motocode;
    } catch (error) {
      console.error("Erro ao fazer parse de bemId:", error);
      return;
    }

    const updateDriver = {
      motocode: document.getElementById("editMotoCode").value,
      motoname: document.getElementById("editMotoNome").value,
      motodtnc: document.getElementById("editMotoDtnc").value,
      motocpf: document.getElementById("editMotoCpf").value,
      motodtch: document.getElementById("editMotoDtch").value,
      motoctch: document.getElementById("editMotoDtch").value,
      motoctch: document.getElementById("editMotoctch").value,
      motodtvc: document.getElementById("editMotoDtvc").value,
      motorest: document.getElementById("editMotoRest").value,
      motoorem: document.getElementById("editMotoOrem").value,
      motocelu: document.getElementById("editMotoCelu").value,
      motocep: document.getElementById("editMotoCep").value,
      motorua: document.getElementById("editMotoRua").value,
      motocity: document.getElementById("editMotoCity").value,
      motoestd: document.getElementById("editMotoEstd").value,
      motomail: document.getElementById("editMotoMail").value,
    };

    try {
      const response = await fetch(`/api/updatemoto/${motoIdParsed}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateDriver),
      });

      console.log("resposta:", response);

      if (response.ok) {
        console.log("Atualização bem-sucedida");

        Toastify({
          text: `Bem '${motoIdParsed}' Atualizado com sucesso!!`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "green",
        }).showToast();

        setTimeout(() => {
          window.location.reload();
          document.querySelector(".containerFormEditDriver").style.display =
            "none";
        }, 3000);

        formEditDrive.reset();
      } else {
        console.error("Erro ao atualizar produto:", await response.text());
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  });
}
editAndUpdateOfDriver();
