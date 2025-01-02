## Projeto caçamba 
usando uma arquitetura MVC 
Estamos usando variavel de ambiente.


## CSS
Cada modulo do css esta configurado com seu conteudo , pela a mesma pasta e o nome do arquivo esta fazendo referencia ao html que ele esta estilizando.

A estrutura esta sendo estilizado de cima para baixo como exemplo: header, body, nas primeiras linhas e o restante de acordo com o conteudo html, divs pai e div filhas estao faceis de indentificar.

Estou usando alguns icones do google fonts e do bootstrapIcons.

Meu CSS da pasta (screenMain) esta estruturado de acordo com os componentes do html , as classes estao intuitivas e os nomes dizem bastante do papel que aquela classe exerce na aplicaçao .

## HTML  
meu html princpal e o main.html , nele esta todas as seções de cadastro e cada seçaõ eu gerei seu proprio arquivo javascript e o proprio arquivo css
 
 usei um padrão para nomear classes , ids , variaveis , (camelCase)

 meu html esta distribuido por seções na tela , dentro de uma div pai e dentro dessa div pai temos as seçoes de cadastro.

## Camadas do projeto 
 view: temos o lado cliente com toda parte de interface. css para estilizar , html para estruturar, js para a interaçao nome dos arquivos dizem em qual parte aquele arquivo e , ou interage.

 controller: contoller esta pegando as requisiçoes do usuario e associando com o model , e o model esta retornando para controller a requisição .

 routes: esta nosso arquivo de rotas e o que cada rota esta apresentando, dentro dele esta meus endpoint que esta fazendo todo meu back-End

 model:Esta fazendo nossa regra de negocio


## instale as dependencias 
  npm install 

## execute o projeto 
 npm run dev   

