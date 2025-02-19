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


