

//butoes relacionados aos bens
const buttonStartCadBens = document.querySelector(".btnCadBens");
buttonStartCadBens.addEventListener("click", () => {
  const contentOptionsGoods = document.querySelector(".optionsBens");
  const contentOptionsClient = document.querySelector(".optionsClient");

  if ((contentOptionsGoods.style.display = "none")) {
    contentOptionsGoods.style.display = "flex";
  }
  if ((contentOptionsGoods.style.display = "flex")) {
    contentOptionsClient.style.display = "none";
  }
});

const buttonOutStart = document.querySelector(".material-symbols-outlined");
buttonOutStart.addEventListener("click", () => {
  window.location.href = "main.html";
});

const buttonList = document.querySelector(".listGoods");
buttonList.addEventListener("click", () => {});

const buttonRegisterGoods = document.querySelector(".registerGoods");
buttonRegisterGoods.addEventListener("click", () => {
  const registerBens = document.querySelector(".showContentBens");
  const contentOptions = document.querySelector(".optionsBens");

  if ((contentOptions.style.display = "flex")) {
    contentOptions.style.display = "none";
    registerBens.style.display = "flex";
  }
});

const buttonListGoods = document.querySelector(".listGoods");
buttonListGoods.addEventListener("click", () => {
  const listingGoods = document.querySelector(".pageListingBens");
  const contentOptions = document.querySelector(".optionsBens");
  if ((listingGoods.style.display = "none")) {
    listingGoods.style.display = "flex";
    contentOptions.style.display = "none";
  }
});

const buttonExit = document.querySelector(".buttonExit");
buttonExit.addEventListener("click", () => {
  const pagelistBens = document.querySelector(".pageListingBens");
  if ((pagelistBens.style.display = "flex")) {
    pagelistBens.style.display = "none";
    return;
  }
});

const buttonOutGoods = document.querySelector(".btnOut");
buttonOutGoods.addEventListener("click", (event) => {
  event.preventDefault();
  const ContentBens = document.querySelector(".showContentBens");
  if ((ContentBens.style.display = "flex")) {
    ContentBens.style.display = "none";
  }
  return;
});

const formRegister = document
  .querySelector("#formRegisterBens")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      await fetch("/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      }).then((response) => {
        if (response.ok) {
          Toastify({
            text: "Bem cadastrado com sucesso!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          }).showToast();

          document.querySelector("#formRegisterBens").reset();
          console.log("deu certo");
        } else {
          Toastify({
            text: "Erro ao cadastrar bem!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
          }).showToast();

          console.log("deu ruim");
        }
      });
    } catch (error) {
      console.log("erro no envio", error);
    }
  });

// fazendo listagens

async function fetchBens() {
  try {
    const response = await fetch("/api/listbens");
    const bens = await response.json();

    const bensListDiv = document.querySelector(".listingBens");
    const editButton = document.querySelector(".edit");
    bensListDiv.innerHTML = ""; // Limpa a div antes de preencher

    if (bens.length > 0) {
      const tabela = document.createElement("table");
      tabela.style.width = "100%";
      tabela.setAttribute("border", "1"); // Adiciona borda para tabela

      // Cabeçalho
      const cabecalho = tabela.createTHead();
      const linhaCabecalho = cabecalho.insertRow();
      const colunas = [
        "Selecionar",
        "Código",
        "Nome",
        "Código Fabricante",
        "Modelo",
        "Número de Série",
        "Placa",
        "Ano",
        "Data da Compra",
        "valor de Compra",
        "Nota Fiscal",
        "Código Fornecedor",
        "Km Atual",
        "Data do Km",
        "Status",
        "Data do Status",
        "Hora Status",
        "Chassi",
        "Cor",
        "Número",
        "Renavam",
        "Ctep",
        "Ativo",
        "Alugado",
        "Valor Alugado",
        "Fabricante",
      ];

      // Preenche o cabeçalho
      colunas.forEach((coluna) => {
        const th = document.createElement("th");
        th.textContent = coluna;
        linhaCabecalho.appendChild(th);
      });

      // Corpo da tabela
      const corpo = tabela.createTBody();
      bens.forEach((bem) => {
        const linha = corpo.insertRow();

        const checkboxCell = linha.insertCell();
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "selectBem"; // Nome para identificar o grupo de checkboxes
        checkbox.value = bem.benscode; // Valor associado ao checkbox
        checkbox.dataset.bem = JSON.stringify(bem);
        checkboxCell.appendChild(checkbox);

        // Adiciona os dados do bem
        linha.insertCell().textContent = bem.benscode;
        linha.insertCell().textContent = bem.bensnome;
        linha.insertCell().textContent = bem.benscofa;
        linha.insertCell().textContent = bem.bensmode;
        linha.insertCell().textContent = bem.bensnuse;
        linha.insertCell().textContent = bem.bensplac;
        linha.insertCell().textContent = bem.bensanmo;
        linha.insertCell().textContent = bem.bensdtcp;
        linha.insertCell().textContent = bem.bensvacp;
        linha.insertCell().textContent = bem.bensnunf;
        linha.insertCell().textContent = bem.benscofo;
        linha.insertCell().textContent = bem.benskmat;
        linha.insertCell().textContent = bem.bensdtkm;
        linha.insertCell().textContent = bem.bensstat;
        linha.insertCell().textContent = bem.bensdtus;
        linha.insertCell().textContent = bem.benshrus;
        linha.insertCell().textContent = bem.bensnuch;
        linha.insertCell().textContent = bem.benscore;
        linha.insertCell().textContent = bem.bensnumo;
        linha.insertCell().textContent = bem.bensrena;
        linha.insertCell().textContent = bem.bensctep;
        linha.insertCell().textContent = bem.bensativ;
        linha.insertCell().textContent = bem.bensalug;
        linha.insertCell().textContent = bem.bensvaal;
        linha.insertCell().textContent = bem.bensfabr;

        // Adiciona a tabela à div
        bensListDiv.appendChild(tabela);
      });

      // Evento para o botão Excluir
      const deleteButton = document.querySelector(".buttonDelete");
      deleteButton.addEventListener("click", async () => {
        const selectedCheckbox = document.querySelector(
          'input[name="selectBem"]:checked'
        );
        if (!selectedCheckbox) {
          Toastify({
            text: "Selecione um item para excluir",
            duration: 2000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          }).showToast();
          return;
        }

        const bemSelecionado = JSON.parse(selectedCheckbox.dataset.bem);
        const bemId = bemSelecionado.benscode;

        const confirmacao = confirm(
          `Tem certeza de que deseja excluir o bem com código ${bemId}?`
        );
        if (!confirmacao) {
          return;
        }

        await deleteBem(bemId, selectedCheckbox.closest("tr"));
      });

      // Evento para o botão Editar
      const editButton = document.querySelector(".buttonEdit");
      editButton.addEventListener("click", () => {
        const selectedCheckbox = document.querySelector(
          'input[name="selectBem"]:checked'
        );
        if (!selectedCheckbox) {
          Toastify({
            text: "Selecione um item para editar",
            duration: 2000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          }).showToast();
          return;
        }

        const bemSelecionado = JSON.parse(selectedCheckbox.dataset.bem);

        console.log("Editar item:", bemSelecionado);

        // Exibe o formulário de edição
        const editForm = document.querySelector(".editForm");
        editForm.style.display = "flex";

        const listingBens = document.querySelector(".pageListingBens");
        listingBens.style.display = "none";
      });

       const formEditBens = document.querySelector('.formEditBens')
       formEditBens.addEventListener('submit' , async (event)=>{
         
         event.preventDefault()

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.values);
          
        const bemId = document.querySelector(".edit").dataset.benscode;
  
          await fetch(`/bem/${bemId}` , {
            method: 'GET'
          })
       })







      // botão salvar

      document
        .querySelector(".submitEditBtn")
        .addEventListener("click", async () => {
          const bemId = document.querySelector(".edit").dataset.benscode;
          const updateBem = {
            benscode: document.getElementById("code").value, // Código
            bensnome: document.getElementById("name").value, // Nome
            benscofa: document.getElementById("cofa").value, // Código do fabricante
            bensmode: document.getElementById("model").value, // Modelo
            bensnuse: document.getElementById("serial").value, // Número de série
            bensplac: document.getElementById("placa").value, // Placa
            bensanmo: document.getElementById("bensAnmo").value, // Ano
            bensdtcp: document.getElementById("dtCompra").value, // Data da compra
            bensvacp: document.getElementById("valor").value, // Valor da compra
            bensnunf: document.getElementById("ntFiscal").value, // Nota fiscal
            benscofo: document.getElementById("cofo").value, // Código do fornecedor
            benskmat: document.getElementById("kmAtual").value, // Quilometragem atual
            bensdtkm: document.getElementById("dtKm").value, // Data do KM
            bensstat: document.getElementById("status").value, // Status
            bensdtst: document.getElementById("dtStatus").value, // Data do status
            benshrus: document.getElementById("hrStatus").value, // Hora do status
            bensnuch: document.getElementById("chassi").value, // Chassi
            benscore: document.getElementById("cor").value, // Cor
            bensnumo: document.getElementById("nuMO").value, // Número MO
            bensrena: document.getElementById("rena").value, // Renavam
            bensctep: document.getElementById("bensCtep").value, // CTEP
            bensativ: document.getElementById("bensAtiv").value, // Ativo
            bensalug: document.getElementById("alug").value, // Alugado
            bensvaal: document.getElementById("valorAlug").value, // Valor do aluguel
            bensfabr: document.getElementById("fabri").value, // Fabricante
          };

          const response = await fetch(`/update/${bemId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateBem),
          });
          if (response.ok) {
            console.log("deu certo");
            alert("atualizou sucesso");
          } else {
            alert("Erro ao atualizar o bem");
          }
        });
    } else {
      bensListDiv.innerHTML = "<p>Nenhum bem cadastrado.</p>";
    }
  } catch (error) {
    console.error("Erro ao carregar bens:", error);
    document.getElementById("bensList").innerHTML =
      "<p>Erro ao carregar bens.</p>";
  }
}

fetchBens();

//deleteBens
async function deleteBem(id, bemItem) {
  try {
    const response = await fetch(`/delete/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (response.ok) {
      Toastify({
        text: "O bem foi excluido com sucesso!",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
      }).showToast();
      bemItem.remove();
    } else {
      console.log("erro para excluir");

      Toastify({
        text: "Erro na exclusão do Bem",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red)",
      }).showToast();
    }
  } catch (error) {
    console.error("erro ao excluir bem:", error);
    alert("erro ao excluir o bem");
  }
}