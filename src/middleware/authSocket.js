import { jwt} from "jsonwebtoken";
import wss from "ws";


function authenticateWebSocket(request, socket, head) {
    const token = request.headers['sec-websocket-protocol']; // O token deve ser enviado nesse cabeçalho

    if (!token) {
        socket.destroy();
        return;
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        request.user = decoded;
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    } catch (error) {
        console.error('Token inválido:', error);
        socket.destroy();
    }
}

export { wss, authenticateWebSocket };