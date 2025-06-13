import express from "express";
const route = express.Router()
import  authenticateToken from '../middleware/authMiddleware.js'

import { control} from "../controllers/controller.js";
import {AuthController} from "../controllers/authController.js";
import {movementGoods} from "../controllers/goodsRegister.js";
import {movementClient} from '../controllers/clientRegister.js';
import {movementForne} from '../controllers/fornRegister.js';
import {movementOfProd} from '../controllers/prodRegister.js';
import {movementOfFamilyGoods} from '../controllers/familyGoods.js';
import {movementOfTypeProd} from "../controllers/typeProdRegister.js";
import {movementOfDriver} from '../controllers/driverRegister.js';
import { movementAuto } from '../controllers/automovelController.js';
import {location} from '../controllers/locationController.js';
import logistics from '../controllers/logistcsController.js'
import { controllerDelivery } from "../controllers/deliveryController.js";
import { movementResiduo } from "../controllers/residuoController.js";
import{controllerLocationVehicle} from "../controllers/locationVehicleController.js"


route.post("/autenticar",  (req, res) => {
  AuthController(req, res);
});

//bens
route.get('/api/listbens',  authenticateToken,(req , res)=>{
  movementGoods.listBens(req , res)
});

route.post("/api/bens/submit", authenticateToken,(req, res) => {
  movementGoods.registerBens(req, res)
});

route.delete('/api/delete/:id', authenticateToken, async (req,res)=>{
  movementGoods.deletarGoods(req , res)
});

route.put('/api/update/:id' , authenticateToken, async (req , res)=>{
  movementGoods.updateGoods(req , res)
 
});

route.put("/api/updatestatus/:bemId" , authenticateToken, async(req, res)=>{
  movementGoods.update(req ,res)
});

//client

route.post('/api/client/submit', authenticateToken, (req, res) => {
  movementClient.registerClient(req, res);  
});

route.get('/api/listclient', authenticateToken, (req , res)=>{
  movementClient.listingOfClient(req, res)
});

route.delete('/api/deleteclient/:id' , authenticateToken, (req ,res)=>{
  movementClient.deleteOfClient(req, res)
});

route.put('/api/updateclient/:id' , authenticateToken, (req , res)=>{
  movementClient.updateOfClient(req , res)
});

// fornecedor
route.post('/api/forne/submit' , authenticateToken, (req , res)=>{
movementForne.registerForn(req, res)
});

route.get('/api/codeforn' , authenticateToken, (req , res)=>{
  movementForne.codeForn(req , res)
});

route.get('/api/listForn' , authenticateToken, (req , res)=>{
  movementForne.listOfForn(req, res)
});

route.delete('/api/deleteForn/:id' , authenticateToken, (req , res)=>{
  movementForne.deleteOfForm(req , res)
});

route.put('/api/updateforn/:id' , authenticateToken, (req , res)=>{
  movementForne.updateOfForn(req , res)
});

// produto

route.post('/api/prod/submit' ,  authenticateToken,  (req , res)=>{
 
  movementOfProd.registerProd(req ,res)
});

route.get('/api/codetipoprod' ,  authenticateToken,  (req , res)=>{
movementOfProd.codeTipoProd(req , res)
});

route.get('/api/listProd' ,  authenticateToken,  (req , res)=>{
  movementOfProd.listofProd(req , res)
});

route.delete('/api/deleteprod/:id' ,  authenticateToken,  (req , res)=>{
  movementOfProd.deleteProd(req , res)
});

route.put('/api/updateprod/:id' ,  authenticateToken,   (req , res)=>{
  movementOfProd.updateProduct(req, res)
});

// residuo

route.post('/residuo' , (req ,res)=>{
   movementResiduo.registerResiduo(req ,res)
});

route.get('/residuo' , (req ,res)=>{
  movementResiduo.listResiduo(req ,res)
});

route.delete("/residuo/:id" , (req , res)=>{
   movementResiduo.deleteResiduo(req , res)
});


//Familia do bem

route.post('/api/fabri/submit' , authenticateToken,(req , res)=>{
  movementOfFamilyGoods.registerOfFabri(req , res)
});

route.get('/api/codefamilyben' , authenticateToken,(req, res)=>{
  movementGoods.codeFamilyBens(req, res)
});

route.get('/api/listfabri' ,authenticateToken, (req , res)=>{
  movementOfFamilyGoods.listingOfFabri(req ,res)
});

route.delete('/api/deletefabri/:id' , authenticateToken, (req , res )=>{
  movementOfFamilyGoods.deleteOfFabri(req , res)
});

route.put('/api/updatefabe/:id' , authenticateToken,(req , res)=>{
  movementOfFamilyGoods.updateFabri(req ,res)
});

// tipo do produto

route.post('/api/typeprod/submit' , authenticateToken, (req , res)=>{
   movementOfTypeProd.registerTyperProd(req , res)
});

route.get('/api/listingTypeProd' , authenticateToken, (req, res )=>{
  movementOfTypeProd.listingOfTypeProd(req , res)
});

route.delete('/api/deletetp/:id', authenticateToken, (req , res)=>{
  movementOfTypeProd.deleteOfTypeProd(req , res)
});

route.put('/api/updatetypeprod/:id', authenticateToken, (req , res)=>{
  movementOfTypeProd.updateOfTypeProd(req , res)
});

 // motorista 

 route.post('/api/drive/submit' , authenticateToken, (req , res)=>{
  movementOfDriver.registerOfDriver(req , res)
 });

 route.get('/api/listingdriver' , authenticateToken, (req , res)=>{
  movementOfDriver.listingOfDriver(req , res)
 });

 route.delete('/api/deletedriver/:id' , authenticateToken, (req ,res)=>{
     movementOfDriver.deleteOfDriver(req , res)
 });

 route.put('/api/updatemoto/:id' , authenticateToken, (req ,res)=>{
     movementOfDriver.updateOfDrive(req , res)
 });

 route.put("/api/updatestatusMoto/:motoId" , authenticateToken, (req ,res)=>{
    movementOfDriver.updateStatusDriver(req ,res)
 });

 // Veiculo

 route.post('/api/cadauto', authenticateToken, (req , res)=>{
  movementAuto.registerAuto(req, res)
 });
 
 route.get('/api/listauto', authenticateToken, (req , res)=>{
  movementAuto.listingOfAuto(req, res)
 });
 route.put('/api/cadauto/:id',  authenticateToken, (req ,res)=>{
  movementAuto.updateOfAuto(req ,res)
 });
 route.delete('/api/cadauto/:id',  authenticateToken, (req ,res)=>{
  movementAuto.deleteOfAuto(req , res)
 }); 

 //locação Bens

 route.get('/api/generateNumber' , (req , res)=>{
   location.gerarNumeroLocacao(req , res)
 });

 route.post('/api/datalocation' , authenticateToken, (req , res)=>{
  location.dataLocacao(req , res)
 });
 
 route.post("/api/novobem/" , authenticateToken , (req ,res)=>{
   location.insertNewGoods(req ,res)
 });

 route.get('/api/locationFinish' , authenticateToken, (req , res)=>{
  location.buscarLocationFinish(req ,res)
 });
 
 route.get('/api/location/:locacaoId', authenticateToken, (req, res) => {
  location.buscarLocacaoPorId(req, res);
});

route.get('/api/codefamilybens', authenticateToken,(req , res)=>{
   location.listarFamilias(req,res)
 });

 route.get('/api/client' , authenticateToken, (req , res)=>{
  location.getClientByCPF(req, res)
 });

 route.delete('/api/deletelocation/:id' , authenticateToken,(req , res)=>{
  location.DeleteLocationFinish(req , res)
 });

 route.put('/api/updatestatuslocation/:codeLocation' , authenticateToken, (req , res)=>{
    location.updateStatus(req ,res)
 });
 route.put("/api/location/:id", authenticateToken, (req ,res)=>{
  location.updateLocationAndBens(req ,res)
 });

 // LOCAÇÃO VEICULOS

 route.post('/api/locacaoveiculo' , (req ,res)=>{
  controllerLocationVehicle.dataLocacaoVehicle(req ,res)
 })

 route.get('/api/locacaoveiculo' , (req , res)=>{
   controllerLocationVehicle.getLocationVehicles(req ,res)
 })
    
 // DELIVERY LOCATION 

 route.post('/logistics' , (req , res)=>{
  logistics.postData(req , res)
});

 route.get('/api/getdelivery' , (req ,res)=>{
  controllerDelivery.getDate(req ,res)
 });




 export {route}


