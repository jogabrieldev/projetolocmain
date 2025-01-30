import express from "express";
const route = express.Router()

import { control} from "../controllers/controller.js";
import {AuthController} from "../controllers/authController.js";
import {movementGoods} from "../controllers/goodsRegister.js";
import {movementClient} from '../controllers/clientRegister.js';
import {movementForne} from '../controllers/fornRegister.js';
import {movementOfProd} from '../controllers/prodRegister.js';
import {movementOfFamilyGoods} from '../controllers/familyGoods.js';
import {movementOfTypeProd} from "../controllers/typeProdRegister.js";
import {movementOfDriver} from '../controllers/driverRegister.js';
import {location} from '../controllers/locationController.js';

// Olhar pois e uma classe
route.get("/", () => {
  control.submitStart();
});

route.post("/autenticar", (req, res) => {
  AuthController(req, res);
});

//bens
route.get('/api/listbens',(req , res)=>{
  movementGoods.listBens(req , res)
})

route.post("/api/bens/submit", (req, res) => {
  movementGoods.registerBens(req, res)
});

route.delete('/api/delete/:id', async (req,res)=>{
  movementGoods.deletarGoods(req , res)
})

route.put('/api/update/:id' , async (req , res)=>{
  movementGoods.updateGoods(req , res)
 
})

//client
route.post('/api/client/submit', (req , res)=>{
  movementClient.registerClient(req , res)
})

route.get('/api/listclient', (req , res)=>{
  movementClient.listingOfClient(req, res)
})

route.delete('/api/deleteclient/:id' , (req ,res)=>{
  movementClient.deleteOfClient(req, res)
})

route.put('/api/updateclient/:id' , (req , res)=>{
  movementClient.updateOfClient(req , res)
})


// fornecedor
route.post('/api/forne/submit' , (req , res)=>{
movementForne.registerForn(req, res)
})

route.get('/api/listForn' , (req , res)=>{
  movementForne.listOfForn(req, res)
})

route.delete('/api/deleteForn/:id' , (req , res)=>{
  movementForne.deleteOfForm(req , res)
})

route.put('/api/updateforn/:id' , (req , res)=>{
  movementForne.updateOfForn(req , res)
})

// produto

route.post('/api/prod/submit' , (req , res)=>{
  movementOfProd.registerProd(req ,res)
})

route.get('/api/listProd' , (req , res)=>{
  movementOfProd.listofProd(req , res)
})

route.delete('/api/deleteprod/:id' , (req , res)=>{
  movementOfProd.deleteProd(req , res)
})

route.put('/api/updateprod/:id' , (req , res)=>{
  movementOfProd.updateProduct(req, res)
})

//fabricante

route.post('/api/fabri/submit' , (req , res)=>{
  movementOfFamilyGoods.registerOfFabri(req , res)
})

route.get('/api/listfabri' , (req , res)=>{
  movementOfFamilyGoods.listingOfFabri(req ,res)
})

route.delete('/api/deletefabri/:id' , (req , res )=>{
  movementOfFamilyGoods.deleteOfFabri(req , res)
})

route.put('/api/updatefabe/:id' ,(req , res)=>{
  movementOfFamilyGoods.updateFabri(req ,res)
})

// tipo do produto

route.post('/api/typeprod/submit' , (req , res)=>{
   movementOfTypeProd.registerTyperProd(req , res)
})

route.get('/api/listingTypeProd' , (req, res )=>{
  movementOfTypeProd.listingOfTypeProd(req , res)
})

route.delete('/api/deletetp/:id', (req , res)=>{
  movementOfTypeProd.deleteOfTypeProd(req , res)
})

route.put('/api/updatetypeprod/:id', (req , res)=>{
  movementOfTypeProd.updateOfTypeProd(req , res)
})

 // motorista 

 route.post('/api/drive/submit' , (req , res)=>{
  movementOfDriver.registerOfDriver(req , res)
 })

 route.get('/api/listingdriver' , (req , res)=>{
  movementOfDriver.listingOfDriver(req , res)
 })

 route.delete('/api/deletedriver/:id' , (req ,res)=>{
     movementOfDriver.deleteOfDriver(req , res)
 })

 route.put('/api/updatemoto/:id' , (req ,res)=>{
     movementOfDriver.updateOfDrive(req , res)
 })

 //locação 

// rota para cadastrar client que locou!

 route.post('/api/locclient' , (req , res)=>{
  location.LocacaoClient(req ,res)
 })

// rota para cadastrar o bem locado !
 route.post('/api/locbens' , async (req , res)=>{
     await location.locacaoBens(req, res )
 })

 route.get('/api/locationfinish' , (req , res)=>{
  location.listarLocacoes(req ,res)
 })

route.get('/api/codefamilybens',(req , res)=>{
   location.listarFamilias(req,res)
 })

 route.get('/api/client' , (req , res)=>{
  location.getClientByCPF(req, res)
 })

 export {route}

// module.exports = route;
