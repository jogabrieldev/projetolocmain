import path, { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Control {
  
  main(req, res) {
    res.sendFile(path.join(__dirname, '..', '..', 'view', 'screenMain', 'main.html'));
  }

  bens(req, res) {
    res.sendFile(path.join(__dirname, '..', '..', 'view', 'screenMain', 'mainGoods', 'mainGoods.html'));
  }

  client(req, res) {
    res.sendFile(path.join(__dirname, '..', '..', 'view', 'screenMain', 'mainClient', 'mainClient.html'));
  }

  forne(req, res) {
    res.sendFile(path.join(__dirname, '..', '..', 'view', 'screenMain', 'mainForn', 'mainForn.html'));
  }

  prod(req, res) {
    res.sendFile(path.join(__dirname, '..', '..', 'view', 'screenMain', 'mainProd', 'mainProd.html'));
  }

  familyBem(req, res) {
    res.sendFile(path.join(__dirname, '..', '..', 'view', 'screenMain', 'mainFabe', 'mainFabe.html'));
  }

  typeProduto(req , res){
     res.sendFile(path.join(__dirname , '..' , '..' , 'view' , 'screenMain' , 'mainTypeProd' , 'mainTypeProd.html'))
  }

  driver(req , res){
    res.sendFile(path.join(__dirname , '..' , '..' , 'view' , 'screenMain' , 'mainDrive' , 'mainDriver.html'))
 }

  vehicles(req ,res){
    res.sendFile(path.join(__dirname , '..' , '..' , 'view' , 'screenMain' , 'mainAutomovel' , 'mainAuto.html'))
  }
   
  residuoView(req , res){
     res.sendFile(path.join(__dirname , '..' , '..' , 'view' , 'screenMain' , 'mainResiduo' , 'mainResiduo.html'))
  }
 
  
  location(req ,res){
    res.sendFile(path.join(__dirname , '..' , '..' , 'view' , 'screenLocation' , 'location.html'))
  }

  logistcs(req ,res){
    res.sendFile(path.join(__dirname , '..' , '..' , 'view' , 'screenLogistics' , 'logistics.html'))
  }

  delivery(req ,res){
    res.sendFile(path.join(__dirname , '..' , '..' , 'view' , 'screenDelivery' , 'mainDelivery.html'))
  }

  devolution(req , res){
    res.sendFile(path.join(__dirname , '..' , '..' , 'view' , 'screenDevolution' , 'mainDevolution.html'))
  }

}


export const control = new Control();
