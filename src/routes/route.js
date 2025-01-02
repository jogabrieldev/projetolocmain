const express = require("express");
const route = express.Router();

const routeMain = require("../controllers/controller.js");
const AuthController = require("../controllers/authController.js");
const movementGoods = require("../controllers/goodsRegister.js");
const movementClient = require('../controllers/clientRegister.js')
const movementForne = require('../controllers/fornRegister.js');
const movementOfForn = require("../controllers/fornRegister.js");
const movementOfProd  = require('../controllers/prodRegister.js')

route.get("/", () => {
  routeMain.submitStart();
});

route.post("/autenticar", (req, res) => {
  AuthController(req, res);
});

//bens
route.get('/api/listbens',(req , res)=>{
  movementGoods.listBens(req , res)
})

route.post("/api/submit", (req, res) => {
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
movementOfForn.registerForn(req, res)
})

route.get('/api/listForn' , (req , res)=>{
  movementForne.listOfForn(req, res)
})

route.delete('/api/deleteForn/:id' , (req , res)=>{
  movementForne.deleteOfForm(req , res)
})

route.put('/api/updateforn/:id' , (req , res)=>{
  movementOfForn.updateOfForn(req , res)
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


module.exports = route;
