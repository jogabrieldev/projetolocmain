const express = require("express");
const route = express.Router();

const routeMain = require("../controllers/controller.js");
const AuthController = require("../controllers/authController.js");
const addGoods = require("../controllers/goodsRegister.js");

route.get("/", () => {
  routeMain.submitStart();
});
route.get('/listbens',(req , res)=>{
  addGoods.listBens(req , res)
})

route.post("/autenticar", (req, res) => {
  AuthController(req, res);
});

route.post("/submit", (req, res) => {
  addGoods.registerBens(req,res)
});

module.exports = route;
