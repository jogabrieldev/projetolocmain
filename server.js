import express from 'express';
import { route } from './src/routes/route.js';
import { routeEscreen } from './src/routes/routeScreen.js';
import path from 'path';
import { Server } from "socket.io";
import http from "http";
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { LocacaoModel } from "./src/model/modelsLocationGoods.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'view')));

// Rota para login
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

// Rota para main.html (SPA principal)
// app.get('/main', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'main.html'));
// });



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(route);
app.use("/" , routeEscreen);


const server = http.createServer(app);

// Configurar Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*", // Permite qualquer conexão
    },
});

// Adicionar Socket.IO ao objeto req para acesso nas rotas
app.use((req, res, next) => {
    req.sock = io;
    next();
});

app.set("socketio" , io)
// Evento de conexão do Socket.IO
io.on("connection", (socket) => {

    socket.on("clienteAtualizado", (msg) => {
        io.emit("clienteAtualizado", msg); 
    });

    
    socket.on("updateRunTimeGoods", (msg) => {
        io.emit("updateRunTimeGoods", msg); 
    });

    socket.on("updateRunTimeForne", (msg) => {
        io.emit("updateRunTimeForne", msg); 
    });

    socket.on("updateRunTimeProduto", (msg) => {
        io.emit("updateRunTimeProduto", msg); 
    });

    socket.on("updateRunTimeFamilyBens", (msg) => {
        io.emit("updateRunTimeFamilyBens", msg); 
    });

    socket.on("updateRunTimeTypeProduto", (msg) => {
        io.emit("updateRunTimeTypeProduto", msg); 
    });

    socket.on("updateRunTimeDriver", (msg) => {
        io.emit("updateRunTimeDriver", msg); 
    });

    socket.on("updateRunTimeAutomovel", (msg) => {
        io.emit("updateRunTimeAutomovel", msg); 
    });

    socket.on("updateRunTimeDestinationDiscard" , (msg)=>{
        io.emit("updateRunTimeDestinationDiscard" , msg);
    });

    socket.on("updateRunTimeResiduo", (msg) => {
        io.emit("updateRunTimeResiduo", msg); 
    });

    socket.on("updateRunTimeRegisterLocation", (msg) => {
        io.emit("updateRunTimeRegisterLocation", msg); 
    });

    socket.on("updateRunTimeRegisterLinkGoodsLocation", (msg) => {
        io.emit("updateRunTimeRegisterLinkGoodsLocation", msg); 
    });

    socket.on("updateRunTimeInEditLocation" , (msg)=>{
        io.emit("updateRunTimeInEditLocation" , msg);
    });
    socket.on("InsertNewGoodsRunTimeInEditLocation" , (msg)=>{
        io.emit("InsertNewGoodsRunTimeInEditLocation" , msg);
    });

    socket.on("checkIn" , (msg)=>{
        io.emit("checkIn" , msg);
    });

    socket.on("disconnect", () => {
    });
});
await LocacaoModel.verificarLocacoesComBens(io)



// Agora o servidor HTTP inicia corretamente
server.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
