"use strict";
import fs from 'fs';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';

const app = http.createServer((request, response) => {
    if (request.method === 'GET') {

        const filePath = path.join('./', 'index.html');

        let readStream = fs.createReadStream(filePath);

        readStream.pipe(response);
    } else if (request.method === 'POST') {
        let data = '';

        request.on('data', chunk => {
            data += chunk;
        });

        request.on('end', () => {
            const parsedData = JSON.parse(data);
            console.log(parsedData);

            response.writeHead(200, { 'Content-Type': 'json'});
            response.end(data);
        });
    } else {
        response.statusCode = 405;
        response.end();
    }
});

const socket = new Server(app);

socket.on('connection', function (socket) {
    const clientAlias = `Client '${Math.floor(Math.random()*10000)}': `

    console.log('New connection');

    socket.broadcast.emit('NEW_CONN_EVENT', {
        msg: 'Connected', userName: clientAlias
    });

    socket.on('CLIENT_MSG', (data) => {
        socket.broadcast.emit('SERVER_MSG', {
            msg: data.msg, userName: clientAlias
        });
        socket.emit('SERVER_MSG', {
            msg: data.msg, userName: clientAlias
        });
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit('SERVER_MSG', {
            msg: 'Disconnected', userName: clientAlias
        });
    });
});

app.listen(3000, 'localhost', () => console.log(`Server running at http://localhost:3000`));