const Game = () => {
    const observers = [];

    function subscribe(method) {
        observers.push(method);
    }

    function notifyAll(command) {
        for (const method of observers) {
            method(command);
        }
    }

    const state = {
        players: [],
        points: [],
        screen: {
            width: 16,
            height: 16
        }
    }

    function setState(newState) {
        Object.assign(state, newState);
    }

    function createPlayer(id) {
        return {
            id,
            pivot: {
                x: Math.floor(Math.random() * state.screen.width),
                y: Math.floor(Math.random() * state.screen.height)
            },
            points: 0
        }
    }

    function addPlayer(player) {        
        state.players.push(player);

        notifyAll({ type: 'add-player', payload: player });
    }

    function removePlayer(playerId) {
        state.players.splice(state.players.findIndex(player => player.id === playerId), 1);

        notifyAll({ type: 'remove-player', payload: playerId });
    }

    function movePlayer({ playerId, keyPressed }) {
        const acceptedMoves = {
            ArrowUp(player) {
                if (player.pivot.y - 1 >= 0) {
                    player.pivot.y--;
                } else {
                    player.pivot.y = state.screen.height - 1;
                }
            },
            ArrowDown(player) {
                if (player.pivot.y + 1 < state.screen.height) {
                    player.pivot.y++;
                } else {
                    player.pivot.y = 0;
                }
            },
            ArrowLeft(player) {
                if (player.pivot.x - 1 >= 0) {
                    player.pivot.x--;
                } else {
                    player.pivot.x = state.screen.width - 1;
                }
            },
            ArrowRight(player) {
                if (player.pivot.x + 1 < state.screen.width) {
                    player.pivot.x++;
                } else {
                    player.pivot.x = 0;
                }
            }
        }

        const player = state.players.find(player => player.id === playerId);
        const move = acceptedMoves[keyPressed];

        if (move && player) {
            move(player);

            notifyAll({
                type: 'move-player',
                payload: { playerId, keyPressed },
            });
        }
    }

    return {
        subscribe,
        state,
        setState,
        createPlayer,
        addPlayer,
        removePlayer,
        movePlayer
    }
}

export default Game;