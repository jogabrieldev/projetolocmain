import express from "express";
import { validateClient } from "../middleware/validators/validClient.js";
import { validateBens } from "../middleware/validators/validGoods.js";
import { validateForn } from "../middleware/validators/validFornecedor.js";
import { validateMotorista } from "../middleware/validators/validDriver.js"
import { validateProduto } from "../middleware/validators/validProduct.js";
import { validateAutomovel } from "../middleware/validators/validVehicles.js";
import { controllerLinkVehicleWithDriver } from "../controllers/controllerLinkDriverVehicle.js"
import { validateCheckIn } from "../middleware/validators/validCheckIn.js";
import {validateCheckInOpen} from "../middleware/validators/validCheckIn.js"
import { validateLocationGoods } from "../middleware/validators/validLocationGoods.js";
import{validateLocationVehicle} from "../middleware/validators/validLocationVehicle.js";
import { validDeliveryFinish } from "../middleware/validators/validDeliveryFinish.js";
import { validate } from "../middleware/validators.js";
import  authenticateToken from '../middleware/authMiddleware.js'
import {authSystemValidade} from "../controllers/authController.js";
import {movementGoods} from "../controllers/controllerGoods.js";
import {movementClient} from '../controllers/controllerClient.js';
import {movementForne} from '../controllers/controllerFornecedor.js';
import {movementOfProd} from '../controllers/controllerProd.js';
import {movementOfFamilyGoods} from '../controllers/controllerFamilyGoods.js';
import {movementOfTypeProd} from "../controllers/controllerTypeProd.js";
import {movementOfDriver} from '../controllers/controllerDriver.js';
import { movementAuto } from '../controllers/automovelController.js';
import {location} from '../controllers/locationController.js';
import logistcgController from '../controllers/logistcsController.js'
import { controllerDelivery } from "../controllers/deliveryController.js";
import { movementResiduo } from "../controllers/residuoController.js";
import { controllerDestination } from "../controllers/controllerDestination.js";
import{controllerLocationVehicle} from "../controllers/locationVehicleController.js"
import { controllerCheckInAndCheckOut } from "../controllers/controllerCheckIn.js";


const route = express.Router()

// AUTENTICAÇÃO

route.post('/newuser' , (req ,res)=>{
   authSystemValidade.registerUserSystem(req ,res)
})
route.post("/autenticar",  (req, res) => {
   authSystemValidade.AuthLoginCenter(req ,res)
});


//bens

route.post("/api/bens/submit", validateBens,validate, authenticateToken,(req, res) => {
  movementGoods.registerBens(req, res)
});

route.get('/api/listbens',  authenticateToken,(req , res)=>{
  movementGoods.listBens(req , res)
});

route.get("/api/bens/:id" , authenticateToken, (req ,res)=>{
  movementGoods.pegarBemPorID(req,res)
})

route.get('/api/codebens/search', authenticateToken, (req , res)=>{
   movementGoods.getbensByCode(req , res)
})

route.delete('/api/bens/delete/:id', authenticateToken, async (req,res)=>{
  movementGoods.deletarGoods(req , res)
});

route.put('/api/bens/update/:id' , authenticateToken, async (req , res)=>{
  movementGoods.updateGoods(req , res)
});

route.put("/api/updatestatus/:bemId" , authenticateToken, async(req, res)=>{
  movementGoods.updateStatus(req ,res)
});

//client
route.post('/api/client/submit', validateClient, validate, authenticateToken, (req, res) => {
  movementClient.registerClient(req, res);  
});
route.get('/api/cliente/search', authenticateToken ,(req ,res)=>{
  movementClient.searchClient(req ,res)
})
route.get('/api/client/:cliecode' , authenticateToken , (req ,res)=>{
   movementClient.getClientId(req ,res)
})
route.get('/api/listclient', authenticateToken, (req , res)=>{
  movementClient.listingOfClient(req, res)
});
route.delete('/api/deleteclient/:id' , authenticateToken, (req ,res)=>{
  movementClient.deleteOfClient(req, res)
});
route.put('/api/updateclient/:id', authenticateToken, (req , res)=>{
  movementClient.updateOfClient(req , res)
});


// fornecedor
route.post('/api/forne/submit' , validateForn,validate, authenticateToken, (req , res)=>{
movementForne.registerForn(req, res)
});
route.get('/api/codeforn' , authenticateToken, (req , res)=>{
  movementForne.codeForn(req , res)
});
route.get('/api/forne/search' , (req ,res)=>{
   movementForne.searchForneParams(req ,res)
})
route.get('/api/listForn' , authenticateToken, (req , res)=>{
  movementForne.listOfForn(req, res)
});
route.delete('/api/deleteForn/:id' , authenticateToken, (req , res)=>{
  movementForne.deleteOfForn(req , res)
});
route.put('/api/updateforn/:id' , authenticateToken, (req , res)=>{
  movementForne.updateOfForn(req , res)
});


// produto
route.post('/api/prod/submit' , validateProduto, validate,  authenticateToken,  (req , res)=>{
  movementOfProd.registerProd(req ,res)
});
route.get('/api/prod/search' , authenticateToken, (req ,res)=>{
   movementOfProd.searchProductByCode(req ,res)
})
route.get('/api/listProd' ,  authenticateToken,  (req , res)=>{
  movementOfProd.listofProd(req , res)
});
route.delete('/api/deleteprod/:id' ,  authenticateToken,  (req , res)=>{
  movementOfProd.deleteProd(req , res)
});
route.put('/api/updateprod/:id' ,  authenticateToken,   (req , res)=>{
  movementOfProd.updateProduct(req, res)
});


//Familia do bem
route.post('/api/fabri/submit' , authenticateToken,(req , res)=>{
  movementOfFamilyGoods.registerOfFabri(req , res)
});
route.get('/api/family/search' , authenticateToken , (req ,res)=>{
   movementOfFamilyGoods.getfamilygoodsByCode(req ,res)
})
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
route.get('/api/typeprod/search' , authenticateToken , (req ,res)=>{
   movementOfTypeProd.getTypeProductByCode(req ,res)
})
route.get('/api/codetipoprod' ,  authenticateToken,  (req , res)=>{
movementOfProd.codeTipoProd(req , res)
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
 route.post('/api/drive/submit' , validateMotorista , validate, authenticateToken, (req , res)=>{
  movementOfDriver.registerOfDriver(req , res)
 });
 route.get('/api/driver/search' , authenticateToken, (req , res)=>{
  movementOfDriver.searchDriver(req ,res)
 })
 route.post('/api/drive/auth' , (req , res)=>{
   authSystemValidade.loginMotorista(req ,res)
 })
 route.get('/api/driver/:motoristaid' , authenticateToken, (req ,res)=>{
    movementOfDriver.getDriverByCode(req ,res)
 })
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
 route.post('/api/cadauto', authenticateToken, validateAutomovel, validate, (req , res)=>{
  movementAuto.registerAuto(req, res)
 });
 route.get('/api/automovel/search' , authenticateToken, (req ,res)=>{
   movementAuto.getAutomovelByCode(req ,res)
 });
 route.get("/api/automo/:code" , authenticateToken, (req ,res)=>{
  movementAuto.getCodeVehicle(req , res)
 })
 route.get('/api/listauto', authenticateToken, (req , res)=>{
  movementAuto.listingOfAuto(req, res)
 });
 route.put('/api/cadauto/:id',  authenticateToken, (req ,res)=>{
  movementAuto.updateOfAuto(req ,res)
 });
 route.delete('/api/cadauto/:id',  authenticateToken, (req ,res)=>{
  movementAuto.deleteOfAuto(req , res)
 }); 
 route.patch('/api/automo/:id' , authenticateToken, (req ,res)=>{
   movementAuto.updateStatusVehicle(req , res)
 });


 // residuo
route.post('/residuo' , (req ,res)=>{
   movementResiduo.registerResiduo(req ,res)
});

route.get('/residuo' , (req ,res)=>{
  movementResiduo.listResiduo(req ,res)
});

route.get('/residuo/:id',(req ,res)=>{
   movementResiduo.getIdResiduo(req ,res)
});
route.delete("/residuo/:id" , (req , res)=>{
   movementResiduo.deleteResiduo(req , res)
});

// destino

route.post('/api/destination' , (req ,res)=>{
  controllerDestination.insertDestination(req,res)
});

route.get('/api/destination' , (req ,res)=>{
  controllerDestination.getDestination(req ,res)
});

route.get('/api/destination/:code' , (req ,res)=>{
  controllerDestination.getDestinationByCode(req,res)
});

route.delete('/api/destination/:id' , (req,res)=>{
  controllerDestination.deleteDestination(req ,res)
});

route.put('/api/destination/:iddestination' , (req ,res)=>{
  controllerDestination.updateDestination(req ,res)
});

//VINCULAR VEICULO COM MOTORISTA EXTERNO

route.post('/api/linkdriver' , (req , res)=>{
   controllerLinkVehicleWithDriver.registerLinkVehicleWithDriver(req , res)
});

route.get('/api/listdriverexterno' , (req , res)=>{
   controllerLinkVehicleWithDriver.getAllDriverExternoWithVehicle(req ,res)
});

route.get('/api/drivercar/:id' , (req ,res)=>{
   controllerLinkVehicleWithDriver.getVehicleTheDriver(req ,res)
});

// checkIN checkOut

route.post("/api/checkin" ,validateCheckIn , validate, authenticateToken, (req ,res)=>{
  controllerCheckInAndCheckOut.toDoCheckIn(req ,res)
});
route.get('/api/checkin/:idMoto' ,authenticateToken ,(req ,res)=>{
   controllerCheckInAndCheckOut.getCheckInOpenForDriver(req ,res)
});

route.get('/api/checkinmoto/:code' ,authenticateToken, (req,res)=>{
  controllerCheckInAndCheckOut.getCheck(req ,res)
});

route.put("/api/checkin/:id" , authenticateToken, (req ,res)=> {
  controllerCheckInAndCheckOut.toCheckOut(req ,res)
});


 //locação Bens
 route.get('/api/generateNumber' , (req , res)=>{
   location.gerarNumeroLocacao(req , res)
 });
 route.post('/api/datalocation' ,validateLocationGoods,validate, authenticateToken, (req , res)=>{
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
 route.post('/api/locacaoveiculo' ,validateLocationVehicle, validate, authenticateToken,   (req ,res)=>{
  controllerLocationVehicle.dataLocacaoVehicle(req ,res)
 });
 route.get('/api/locacaoveiculo' , (req , res)=>{
   controllerLocationVehicle.getLocationVehicles(req ,res)
 });
 route.delete('/api/locacaoveiculo/:id' ,authenticateToken , (req ,res)=>{
   controllerLocationVehicle.deleteLocationVehicles(req ,res)
 });

 route.patch('/api/contratoveiculo/:id' , authenticateToken, (req , res)=>{
  controllerLocationVehicle.updateContrato(req ,res)
 });
    

 // DELIVERY LOCATION 
 route.post('/logistics' , (req , res)=>{
  logistcgController.submitDateForLogistcs(req ,res)
});

route.get("/api/contrato/:id",(req , res)=>{
  logistcgController.getAll(req ,res)
});

route.put("/api/contrato/:id" , (req ,res)=>{
  logistcgController.updateContratoWithGoods(req ,res)
});

route.patch('/api/updatestatusdelivery/:id', (req ,res)=>{
   controllerDelivery.updateStatusDelivery(req ,res)
});
 route.get('/api/getdelivery' , authenticateToken, (req ,res)=>{
  controllerDelivery.getDate(req ,res)
 });

 route.get("/api/deliverydriver/:id" , (req ,res)=>{
   controllerDelivery.getDataLocationDriver(req ,res)
 });

 route.post("/api/deliveryfinish" , validDeliveryFinish , validate, authenticateToken , (req,res)=>{
    controllerDelivery.finishProcessDelivery(req ,res)
 });

 export {route}


