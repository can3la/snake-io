import { useEffect } from 'react';
import io from 'socket.io-client';

import Game from '../../core/Game.js';
import KeyboardListener from '../../core/KeyboardListener.js';

const socket = io('http://localhost:8080', { transports : ['websocket'] });

const Room = () => {
    useEffect(() => {
        const game = Game();
        socket.on('bootstrap', state => {
            console.log('bootstrap');
            game.setState(state);
            const screen = document.querySelector("#screen");

            screen.setAttribute('width', game.state.screen.width);
            screen.setAttribute('height', game.state.screen.height);
            
            renderScreen(screen, requestAnimationFrame);

            const keyboardListener = KeyboardListener(document);
            keyboardListener.subscribe((command) => {
                socket.emit(command.type, command.payload);
            });
        });

        const renderScreen = (screen, requestAnimationFrame) => {
            const context = screen.getContext('2d');
            context.clearRect(0, 0, screen.width, screen.height);
            game.state.players.forEach(player => {
                context.fillStyle = 'black';
                context.globalAlpha = 1;
                context.fillRect(player.pivot.x, player.pivot.y, 1, 1);
            });
        
            requestAnimationFrame(() => renderScreen(screen, requestAnimationFrame));
        }

        socket.on('add-player', player => {
            console.log('add-player');
            game.addPlayer(player);
        });
        
        socket.on('remove-player', playerId => {
            game.removePlayer(playerId);
        });
        
        socket.on('move-player', ({ playerId, keyPressed }) => {
            game.movePlayer({ playerId, keyPressed });
        });
    }, []);
    
    return <canvas id="screen"></canvas>
}

export default Room;
