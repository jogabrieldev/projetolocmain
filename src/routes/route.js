const express = require("express");
const route = express.Router();

const routeMain = require("../controllers/controller.js");
const AuthController = require("../controllers/authController.js");
const movementGoods = require("../controllers/goodsRegister.js");

route.get("/", () => {
  routeMain.submitStart();
});
route.get('/api/listbens',(req , res)=>{
  movementGoods.listBens(req , res)
})

route.post("/autenticar", (req, res) => {
  AuthController(req, res);
});

route.post("/submit", (req, res) => {
  movementGoods.registerBens(req, res)
});

route.get('/bem/:id' , (req , res)=>{
  movementGoods.getBemById(req , res)
})

route.delete('/delete/:id', async (req,res)=>{
  movementGoods.deletarGoods(req , res)
})
route.put('/update/:id' , async (req , res)=>{
  movementGoods.updateGoods(req , res)
 
})

module.exports = route;
