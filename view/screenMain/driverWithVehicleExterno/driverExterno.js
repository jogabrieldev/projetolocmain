document.addEventListener('DOMContentLoaded' , function(){
  const buttonInformationDriverWithVehicleExterno = document.querySelector('.buttonInformationDriverWithVehicleExterno')
   if(buttonInformationDriverWithVehicleExterno){
      buttonInformationDriverWithVehicleExterno.addEventListener('click' ,async ()=>{
        try {
          const res = await fetch('/driverexterno' , {
            method:'GET'
            })
          if (!res.ok)
          throw new Error(`Erro HTTP: ${res.status}`);
          const html = await res.text();
          const mainContent = document.querySelector("#mainContent");
          if (mainContent) {
             mainContent.innerHTML = html;
             getDriverWithVehicle();
            
           }
        } catch (error) {
                
         }
     })
   }
})
async function dataDriver(codeMoto){
   try {
      const response = await fetch(`/api/driver/${codeMoto}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.motorista)
      console.log('nome do motorista' , data?.motorista?.motonome)
      return data?.motorista?.motonome;

      
    } catch (error) {
      console.error("Erro ao buscar dados do motorista:", error);
      return null;
    };
  };

async function dataVehicle(codeVeic){
  try {
    const response = await fetch(`/api/automo/${codeVeic}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log(data.veiculo)
    return data?.veiculo?.caauplac || "Veículo não encontrado";
  } catch (error) {
    console.error("Erro ao buscar dados do veículo:", error);
    return null;
  }
}


async function getDriverWithVehicle() {
  try {
    const response = await fetch("/api/listdriverexterno", {
      method:"GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log(result)

    if (!response.ok) {
      Toastify({
        text: result?.message || "Erro ao carregar dados de vínculo motorista/veículo.",
        duration: 4000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
      return;
    }

    const vinculacoes = result.driver;
    const container = document.querySelector(".listDriverExternoWithVehicle");
    container.innerHTML = "";

    if (vinculacoes.length > 0) {
      const wrapper = document.createElement("div");
      wrapper.className = "table-responsive";

      const tabela = document.createElement("table");
      tabela.className = "table table-sm table-hover table-striped table-bordered tableDriverExternoWithVehicle";

      const cabecalho = tabela.createTHead();
      const linhaCabecalho = cabecalho.insertRow();
      const colunas = [, "Nome do Motorista", "Veiculo com motorista", "Data de Vinculação"];

      colunas.forEach((coluna) => {
        const th = document.createElement("th");
        th.textContent = coluna;
        th.classList.add("text-center", "px-3", "py-2", "align-middle", "text-break");
        linhaCabecalho.appendChild(th);
      });

      const corpo = tabela.createTBody();

       for (const item of vinculacoes) {
        const linha = corpo.insertRow();

        // Buscar nome do motorista com base no código
        const nomeMotorista = await dataDriver(item.seexmoto) || `Motorista #${item.seexmoto}`;
        const veiculo = await dataVehicle(item.seexveic) || `Veiculo #${item.seexveic}`
        const dados = [
          nomeMotorista,
          veiculo,
          new Date(item.seexdata).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        ];

        dados.forEach((valor) => {
          const td = linha.insertCell();
          td.textContent = valor || "";
          td.classList.add("text-center", "align-middle", "text-break", "px-2", "py-1");
        });
      }

      wrapper.appendChild(tabela);
      container.appendChild(wrapper);
    } else {
      container.innerHTML = "<p class='text-light'>Nenhum vínculo motorista/veículo encontrado.</p>";
    }

  } catch (error) {
    console.error("Erro ao carregar dados de motorista com veículo:", error);
    document.querySelector(".listDriverExternoWithVehicle").innerHTML =
      "<p class='text-danger'>Erro ao carregar dados de vínculo motorista/veículo.</p>";
  }
}

