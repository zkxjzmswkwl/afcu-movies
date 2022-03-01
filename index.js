import { WebSocketServer } from 'ws';
const wss = new WebSocketServer({port:6969});

let shouldSendStart = false;
let clients = [];

wss.on('connection', ws =>
{
    clients.push(ws);
    console.log("Connected client.");

    ws.on('close', () =>
    {
        console.log("Client disconnected.");
    });

    ws.on('message', msg =>
    {
        let packetBuffer = JSON.parse(msg);
        if (packetBuffer.type == "admin")
        {
            for (let client of clients)
            {
                client.send(JSON.stringify(packetBuffer));
            }
        }

        if (msg.data == 'admin_start')
        {
            shouldSendStart = true;
        }
    });

    // Debug shit
    setTimeout(() => {
        ws.send('start');
    }, 1000);
});