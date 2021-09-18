const KeyboardListener = document => {
    const observers = [];

    function subscribe(method) {
        observers.push(method);
    }

    function notifyAll(command) {
        for (const method of observers) {
            method(command);
        }
    }

    document.addEventListener('keydown', handleKeydown);

    function  handleKeydown(event) {
        const command = { 
            type: 'handle-keydown', 
            payload: event.key 
        }

        notifyAll(command);
    }

    return {
        subscribe
    }
}

export default KeyboardListener;