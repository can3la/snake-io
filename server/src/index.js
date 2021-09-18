import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';

import Game from './core/Game.js';

const app = express();
const io = new Server(app.listen(8080));

app.use(cors());

const game = Game();

game.subscribe(command => {
    io.emit(command.type, command.payload);
});

io.on('connection', socket => {
    game.addPlayer(game.createPlayer(socket.id));

    console.log(game.state);
    socket.emit('bootstrap', game.state);

    socket.on('handle-keydown', keyPressed => {
        game.movePlayer({ playerId: socket.id, keyPressed });
    });

    socket.on('disconnect', () => {
        game.removePlayer(socket.id);
    });
})