## Projeto caçamba 
usando uma arquitetura MVC .
Estamos usando variavel de ambiente.
Meu html (MAIN) e unico e mantem toda minha estrutura do meu site , navegação do meu site esta por seções dentro de uma unica tela html.
aplicação usando a arquitetura SPA para renderização.


## CSS
Cada modulo do css esta configurado com seu conteudo , pela a mesma pasta e o nome do arquivo esta fazendo referencia ao html que ele esta estilizando e a estilização principal da minha aplicação esta na pasta main.css as outras estão fazendo a estilização daquela determinada seção.

* Meus CSS main, envolve algumas estilizações globais , que são estilizações que englobam todo projeto , mais ele também estiliza a parte de bens(Alterar depois e criar um modulo .CSS somente para bens).

*Tenho CSS para cada arquivo , os css desses arquivos estiliza somente aquele parte do projeto.

*Estou usando alguns icones do google fonts e do bootstrapIcons.

Meu CSS da pasta (screenMain) esta estruturado de acordo com os componentes do html , as classes estao intuitivas e os nomes dizem bastante do papel que aquela classe exerce na aplicaçao .

a chamada dos meus ID e classes estão usando a a nomeclatura CAMEL CASE. Bem intuitiva e facil para intender.

## HTML  
meu html princpal e o main.html , nele esta todas as seções de cadastro e cada seçaõ eu gerei seu proprio arquivo javascript e o proprio arquivo css

*Meu index.html renderiza a pagina de login ou seja a pagina inicial para acessar a tela Main.html
 
 usei um padrão para nomear classes , ids , variaveis , (camelCase)

Meu html esta destribuido por seções onde tenho algumas sesões com display none que são acionadas ao clicar em botões referentes , usando o DOM do javascript.

## Javascript
 Meus Arquivos javascript da camada view, faz a interação com rotas que foram criadas , enviam dadods e pegam dados , os nomes dos arquivos diz bastante sobre qual parte da aplicação ele e acionado , meus arquivos do JS da view tem também a interação dos botões usando o DOM para essa manipulação , e também esta sendo responsavel para gerar dados dinamicamente no meu front, atraves de respostas de API.

 meus arquivos JS na camada CONTROLLER tem regra de negocio também  e para gerar a rota , e oque aquele rota ira fazer 

 E na camada Model , envolve SQL e a regra de negocio onde faço o link da minha aplicação com os dados do banco , e com isso consigo fazer relacionamentos , envio de dados , e coletas de dados.

## Camadas do projeto 
 VIEWS: temos o lado cliente com toda parte de interface. css para estilizar , html para estruturar, js para a interaçao nome dos arquivos dizem em qual parte aquele arquivo e , ou interage minhas chaamadas de API esta também na view.

 CONTROLLER: contoller esta pegando as requisiçoes do usuario e associando com o model , e o model esta retornando para controller a requisição .

 ROUTES: esta nosso arquivo de rotas e o que cada rota esta apresentando, dentro dele esta meus endpoint que esta fazendo todo meu back-End

 MODEL: Esta contendo os codigos SQl para a parte da interação da minha aplicação com o banco de dados, la através de um objeto tenho as propriedades para fazer um crud de cada seção , o nome da pasta diz muito sobre oque aquele model esta interagindo


## instale as dependencias 
  npm install 

## execute o projeto 
 npm run dev   


## locação

* meu processo de locação esta envolvendo 2 tabelas , uma para registrar o cliente que locou e outra para registrar o bem locado. Assim que a locação e finalizada e gerado um numero de locação e com esse numero temos acesso ao locação. Temos acesso ao bem que foi locado/ produto, temos acesso a quantidade, a descrição desse bem, e o cliente que solicitou e os dados desse cliente.

## backend 

*  meu back-end e composto por arquivo (CONTROLLER, MODEL, ROUTES ,  MIDDLEWARE , DATABASE , E O CONFIG ENVOLVE AS VARIAVEIS DE AMBIENTE.)
(MODEL)
* no meu model estou estruturando minhas "QUERY" para o banco de dados configurado 

* no model cada arquivo contem os dados para uma tabela especifica no banco , nos arquivos (location.js , logisticsModel.js) temos relacionamentos para ser feito aquele determinado processo, e também temos tabelas para os 2 processos para armazenar.

* No arquivo auth do meu model: eu estou validando se os dados fornecidos no parametro da função são iguais a determinada coluna da tabela , para ai sim poder fazer a validação esses dados estão sendo preenchido pelo o front por 2 inputs na hora do login estou usando o BCRYPT para compara a senha criptografada do banco, com a senha fornecida no input  ou seja  tenho essas camada de segurança pois todas minhas senhas no banco vão estar criptografadas.

* o arquivo (Index.js) do meu model faz o link para uma outra pagina que e onde rola todo meu processo temos um controller e uma rota também para esse processo.

* nos outros arquivos eles fazem basicamente um (CRUD) nas suas respectivas tabelas , alguns faço consulta para buscar um dado ou outro  dependendo doque minha aplicação vai precisar , e se não estiver um endpoint que execute aqule processo.

(MIDDLEWARE)

* estou pegando o tokem fornecido e validando ele para que ele possa acessar determinada rota , ou seja estou  passando uma camada de segurança para que se o o tokem não for fornecido não poderar acessar a rota

(CONTROLLER)

* meus controllers são a ponte para ser emitido meu endPoint no routes

* neles também estou retornando a resposta para o cliente e pegando as requisições

* no controller o nome dos arquivos também diz muito sobre em que precesso ele esta envolvido e quais rotas ele esta controlando.

(ROUTES)

* Todos meus endPoints estão nessa pasta router , e meus arquivos da views estão interagindo com esses endPoints de acordo com a necessidade

* tenho as difinições la no arquivo route.js onde eu descrevo para que esta servindo aqueles determinados endPoints 
