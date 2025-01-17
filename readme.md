## Projeto caçamba 
usando uma arquitetura MVC 
Estamos usando variavel de ambiente.
Meu html (MAIN) e unico e mantem toda minha estrutura do meu site , navegação do meu site esta por seções dentro de uma unica tela html.


## CSS
Cada modulo do css esta configurado com seu conteudo , pela a mesma pasta e o nome do arquivo esta fazendo referencia ao html que ele esta estilizando e a estilização principal da minha aplicação esta na pasta main.css as outras estão fazendo a estilização daquela determinada seção.

A estrutura esta sendo estilizado de cima para baixo como exemplo: header, body, nas primeiras linhas e o restante de acordo com o conteudo html, divs pai e div filhas estao faceis de indentificar.

Estou usando alguns icones do google fonts e do bootstrapIcons.

Meu CSS da pasta (screenMain) esta estruturado de acordo com os componentes do html , as classes estao intuitivas e os nomes dizem bastante do papel que aquela classe exerce na aplicaçao .

a chamada dos meus ID e classes estão usando a a nomeclatura CAMEL CASE. Bem intuitiva e facil para intender 

## HTML  
meu html princpal e o main.html , nele esta todas as seções de cadastro e cada seçaõ eu gerei seu proprio arquivo javascript e o proprio arquivo css
 
 usei um padrão para nomear classes , ids , variaveis , (camelCase)

 meu html esta distribuido por seções na tela , dentro de uma div pai e dentro dessa div pai temos as seçoes de cadastro.

## Camadas do projeto 
 VIEWS: temos o lado cliente com toda parte de interface. css para estilizar , html para estruturar, js para a interaçao nome dos arquivos dizem em qual parte aquele arquivo e , ou interage minhas chaamadas de API esta também na view.

 CONTROLLER: contoller esta pegando as requisiçoes do usuario e associando com o model , e o model esta retornando para controller a requisição .

 ROUTES: esta nosso arquivo de rotas e o que cada rota esta apresentando, dentro dele esta meus endpoint que esta fazendo todo meu back-End

 MODEL: Esta contendo os codigos SQl para a parte da interação da minha aplicação com o banco de dados, la através de um objeto tenho as propriedades para fazer um crud de cada seção , o nome da pasta diz muito sobre oque aquele model esta interagindo


## instale as dependencias 
  npm install 

## execute o projeto 
 npm run dev   

