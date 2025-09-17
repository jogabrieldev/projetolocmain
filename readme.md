# 📦 Projeto Caçamba 1.0.0 - MVP

Sistema de gestão de locação de caçambas e logística de resíduos, desenvolvido seguindo a arquitetura **MVC (Model-View-Controller)**.

A aplicação é uma **SPA (Single Page Application)** com **JavaScript puro no frontend**, **Node.js no backend** e **PostgreSQL como banco de dados relacional**.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3 (puro), JavaScript Vanilla , Bootstrap5
- **Backend:** Node.js + Express.js + Express Validator
- **Banco de Dados:** PostgreSQL
- **Segurança:** JWT (JSON Web Token), Bcrypt para criptografia de senhas
- **Build/Dev Tools:** Webpack, Babel, Nodemon, Dotenv

---

## 📁 Estrutura de Pastas

├── View/ → Frontend (HTML, CSS, JS , jquery-validation , Jquery-Mask )
├── controller/ → Camada Controller (lógica das requisições ,  e algumas validações para o processo)
|__ Service/ -> Executando transações para garantir a consistencia , quando e preciso fazer mais de 1 transação no banco.
├── model/ → Modelos de dados e acesso ao banco (As query SQL estão nesta pasta)
├── routes/ → Endpoints da API
├── middleware/ → Middlewares (autenticação) / -> Validações das rotas as validações esta sendo aplicada nas rotas do metodo POST
├── config/ → Configuração dos bancos de dados 
├── database/ → Conexão com o banco PostgreSQL
├── .env → Variáveis de ambiente (credenciais, configs)
└── server.js → Inicialização da aplicação


---

## 🧱 Arquitetura MVC

| Camada      | Função                                                                                       |
|-------------|----------------------------------------------------------------------------------------------|
| **Model**   | Contém a lógica de acesso ao banco de dados (queries SQL), mapeamento de tabelas . Utiliza placeholders nas queries para evitar SQL Injection. |
| **View**    | Interface do usuário: SPA com um único HTML (`main.html`), CSS modular por seção e JavaScript responsável por manipulação de DOM e consumo da API via Fetch. |
| **Controller** | Faz a ponte entre o frontend e os models. Recebe as requisições HTTP, valida os dados e coordena as respostas da API. |
| **Service** | contem as transações. |
| **Routes**  | Define todos os endpoints REST disponíveis na API, conectando as requisições aos controllers correspondentes. |

---

## 🌐 Frontend (View)

- Estruturado como **SPA (Single Page Application)**.

- Todas as telas (cadastros, locação, logística, entrega, devolução) estão dentro de **uma única página principal (`main.html`)**, navegadas via manipulação de seções DOM com `display: none` / `display: flex` e funções auxiliares para (mostrarElemento , esconderElemento).

- **CSS Modular:**  
Cada seção tem seu próprio arquivo CSS , além de um CSS global `main.css` com estilos gerais da aplicação e o arquivo do bootstrap juntamente com a CDN aplicada na (`main.html`) .

- **Nomenclatura:**  
Padrão **camelCase** aplicado em IDs, classes, variáveis e funções JavaScript.
- Uso de **Bootstrap Icons** e **Google Fonts** para a interface.
- Manipulação de DOM com JavaScript puro.
- Consumo da API usando `fetch()`.

---

## 📜 Backend (Node.js + PostgreSQL + Express + JWT)

### Controllers:
- Recebem requisições da View.
- Validam dados.
- Aplica validações com base na regra de negocio
- Chamam os Models e valida se deu certo a chamada.
- Retornam as respostas para o cliente.

### Models:
- Todas as queries SQL (CRUD ,relacionamentos , Joins).
- Queries com **placeholders** para prevenir SQL Injection.
- Estrutura por entidade/tabela (ex: `cliente`, `locacoes`, `bens`, `logisticas` , `fornecedor` etc).
- Joins em tabelas quando necessário (ex: consultar cliente + bens locados).
- Exemplo:  
  - Validação de login usando **Bcrypt** para comparar a senha criptografada no banco com a senha digitada.

### Middlewares:
- **Autenticação JWT:**  
Intercepta requisições privadas e valida o token de acesso antes de liberar a execução.

- **Validações de rotas:**
Validações de rotas para validar antes mesmo de processar algo , essas validações esta presente em todas as rotas de registro ,
estou usando o express-validator e aplicando as validações nas rotas pegando propriedade por propriedade.


### Routes:
- Definem todos os **endpoints RESTFULL da aplicação**, nesse modulo temos o arquivo que faz o roteamento da pagínas dinamicamente também 1 arquivo e meus endpoints da aplicação e no outro o roteamento das paginas HTML.
- Exemplo de endpoints:
  - `POST /api/client`
  - `GET /api/listbens`
  - `DELETE /api/locacaoveiculo/:id`
  - ...

---

## 🔐 Segurança

- **Senhas criptografadas** com Bcrypt.
- **Validação de tokens JWT** todas as rotas são privadas e preciso ter uma autenticação para acessar os serviços.
- **Prevenção contra SQL Injection** com uso de queries parametrizadas.

---

## 📦 Instalação e Execução

### 1️⃣ Instalar as dependências:

```bash
npm install

Executar a aplicação em modo desenvolvimento:
npm run dev

## DEPENDENCIA DE PRODUÇÃO
"bcrypt": "^5.1.1",
    "body-parser": "^1.20.3",
    "date-fns": "^4.1.0",
    "express": "^4.21.1",
    "express-validator": "^7.2.1",
    "jquery": "^3.7.1",
    "jquery-mask-plugin": "^1.14.16",
    "jquery-validation": "^1.21.0",
    "jsonwebtoken": "^9.0.2",
    "node-cron": "^4.1.1",
    "node-fetch": "^3.3.2",
    "pg": "^8.13.1",
    "pg-hstore": "^2.3.4",
    "socket.io": "^4.8.1",
    "socket.io-client": "^4.8.1"


##DEPENDENCIA DE DESENVOLVIMENTO

 "@babel/core": "^7.26.10",
    "@babel/preset-env": "^7.26.9",
    "@babel/preset-react": "^7.26.3",
    "babel-loader": "^10.0.0",
    "clean-webpack-plugin": "^4.0.0",
    "css-loader": "^7.1.2",
    "dotenv": "^16.4.5",
    "html-loader": "^5.1.0",
    "html-webpack-plugin": "^5.6.3",
    "nodemon": "^3.1.7",
    "style-loader": "^4.0.0",
    "webpack": "^5.97.1",
    "webpack-cli": "^6.0.1",
    "webpack-dev-server": "^5.2.0"

### MODULO DE LOCAÇÃO

Processo de locação envolve duas tabelas:

Clientes: Dados de quem está locando.

OqueFoiLocado: veiculos/caçambas associados a aquele cliente que locou 1:N.

Geração automática de número de locação com 6 digitos esse numero e gerado pelo o back-end analisando os numeros ja presente e não deixando repetir.

adicionarLocalizaçãoNoMomentoDaLocação('No momento da locação deve adicionar uma localização').

Associação de resíduos a cada locação.

Consulta de histórico de locações com detalhes completos de cliente e itens.

### BOAS PRATICAS

struturação em camadas claras (MVC)

Separação de responsabilidades

Nomenclatura consistente

Segurança com JWT e Bcrypt

Queries protegidas contra SQL Injection

SPA com JavaScript puro para melhor desempenho em ambientes leves

Uso de Webpack e Babel no build do frontend