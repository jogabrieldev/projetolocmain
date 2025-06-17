# 📦 Projeto Caçamba 1.0.0 - MVP

Sistema de gestão de locação de caçambas e logística de resíduos, desenvolvido seguindo a arquitetura **MVC (Model-View-Controller)**.

A aplicação é uma **SPA (Single Page Application)** com **JavaScript puro no frontend**, **Node.js no backend** e **PostgreSQL como banco de dados relacional**.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3 (puro), JavaScript Vanilla , Bootstrap5
- **Backend:** Node.js + Express.js
- **Banco de Dados:** PostgreSQL
- **Segurança:** JWT (JSON Web Token), Bcrypt para criptografia de senhas
- **Build/Dev Tools:** Webpack, Babel, Nodemon, Dotenv

---

## 📁 Estrutura de Pastas

├── public/ → Frontend (HTML, CSS, JS View)
├── controller/ → Camada Controller (lógica das requisições)
├── model/ → Modelos de dados e acesso ao banco
├── routes/ → Endpoints da API
├── middleware/ → Middlewares (ex: autenticação)
├── config/ → Configurações globais e variáveis de ambiente
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
| **Routes**  | Define todos os endpoints REST disponíveis na API, conectando as requisições aos controllers correspondentes. |

---

## 🌐 Frontend (View)

- Estruturado como **SPA (Single Page Application)**.
- Todas as telas (cadastro, locação, logística, entrega, devolução, etc) estão dentro de **uma única página principal (`main.html`)**, navegadas via manipulação de seções DOM com `display: none` / `display: block`.
- **CSS Modular:**  
Cada seção tem seu próprio arquivo CSS, além de um CSS global `main.css` com estilos gerais da aplicação.
- **Nomenclatura:**  
Padrão **camelCase** aplicado em IDs, classes, variáveis e funções JavaScript.
- Uso de **Bootstrap Icons** e **Google Fonts** para a interface.
- Manipulação de DOM com JavaScript puro.
- Consumo da API usando `fetch()`.

---

## 📜 Backend (Node.js + PostgreSQL + Express)

### Controllers:
- Recebem requisições da View.
- Validam dados.
- Chamam os Models.
- Retornam as respostas para o cliente.

### Models:
- Todas as queries SQL (CRUD e relacionamentos).
- Queries com **placeholders** para prevenir SQL Injection.
- Estrutura por entidade/tabela (ex: `clientes`, `locacoes`, `bens`, `logisticas` , `Cadbens` etc).
- Joins em tabelas quando necessário (ex: consultar cliente + bens locados).
- Exemplo:  
  - Validação de login usando **Bcrypt** para comparar a senha criptografada no banco com a senha digitada.

### Middlewares:
- **Autenticação JWT:**  
Intercepta requisições privadas e valida o token de acesso antes de liberar a execução.

### Routes:
- Definem todos os **endpoints REST da aplicação**, agrupados por módulo.
- Exemplo de endpoints:
  - `POST /api/login`
  - `GET /api/locacao`
  - `DELETE /api/locacaoveiculo/:id`
  - ...

---

## 🔐 Segurança

- **Senhas criptografadas** com Bcrypt.
- **Validação de tokens JWT** nas rotas privadas.
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
"express": "^4.21.1",
"jquery": "^3.7.1",
"jquery-mask-plugin": "^1.14.16",
"jquery-validation": "^1.21.0",
"jsonwebtoken": "^9.0.2",
"pg": "^8.13.1",
"pg-hstore": "^2.3.4",
"socket.io": "^4.8.1"


##DEPENDENCIA DE DESENVOLVIMENTO

"@babel/core": "^7.26.10",
"@babel/preset-env": "^7.26.9",
"@babel/preset-react": "^7.26.3",
"babel-loader": "^10.0.0",
"clean-webpack-plugin": "^4.0.0",
"dotenv": "^16.4.5",
"html-webpack-plugin": "^5.6.3",
"nodemon": "^3.1.7",
"webpack": "^5.97.1",
"webpack-cli": "^6.0.1",
"webpack-dev-server": "^5.2.0"

### MODULO DE LOCAÇÃO

Processo de locação envolve duas tabelas:

Clientes: Dados de quem está locando.

Bens Locados: Produtos/caçambas associados à locação ou veiculos.

Geração automática de número de locação sequencial e único.

Cadastro de localização (permitindo inclusão de novos endereços).

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