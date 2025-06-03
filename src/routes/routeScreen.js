import express from 'express';
import { control } from '../controllers/controller.js';

const routeEscreen = express.Router();

routeEscreen.get('/', control.main);

routeEscreen.get('/bens', control.bens);

routeEscreen.get('/client' , control.client)

routeEscreen.get('/clientemp', control.clientEmp)

routeEscreen.get('/fornecedor' , control.forne)

routeEscreen.get('/produto' , control.prod)

routeEscreen.get('/fabe' , control.familyBem)

routeEscreen.get('/typeprod' , control.typeProduto)

routeEscreen.get('/driver' , control.driver)

routeEscreen.get('/veiculos' , control.vehicles)

routeEscreen.get('/location' , control.location)

routeEscreen.get('/logistcs' , control.logistcs)

routeEscreen.get('/delivery' , control.delivery)

routeEscreen.get('/devolution' , control.devolution)

routeEscreen.get('/residuoview' , control.residuoView)

export { routeEscreen };