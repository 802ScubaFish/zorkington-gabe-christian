const readline = require('readline');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
    return new Promise((resolve, reject) => {
        readlineInterface.question(questionText, resolve);
    });
}

function sanitize(input) {
  return input[0].toLowerCase;
}

let commands = {
    move: ['go', 'move'],
    take: ['take', 'pick up'],
    open: ['open', 'enter'],
    speak: ['speak', 'talk'],
    menu: ['menu', 'inventory'],
    examine: ['inspect', 'examine'],
    leave: ['drop', 'leave']
}
rooms = {
    currentRoom: 'bedroom',
    transitions: {
        'bedroom': { canChangeTo: ['downstairs'] },
        'downstairs': { canChangeTo: ['bedroom', 'palletTown'] },
        'palletTown': { canChangeTo: ['laboratory', 'routeOne', 'downstairs'] },
        'laboratory': { canChangeTo: ['palletTown'] },
        'routeOne': { canChangeTo: ['palletTown'] }
    },
    enterRoom(nextRoom) {
        console.log(nextRoom)
        if (this.transitions[this.currentRoom].canChangeTo.includes(nextRoom)) {
            this.currentRoom = nextRoom
            return this.currentRoom
        } else {
            console.log(`That is an invalid transition ${rooms.currentRoom} to ${nextRoom} please try again`)
            //        throw('invalid state transition from ${lightObj.color} to ${nextState}')
        }
        console.log(rooms.currentRoom)
    }
}

let player = {
    inventory: [],

}
start();

async function start() {
    const welcomeMessage = `Bedroom
You awaken in your Bedroom, you see a set of stairs and a PC'`;
    let answer = await ask(`>_`);
    answer = answer.trim();
    sanitize(answer);
    while (answer !== 'exit') {
        rooms.enterRoom(answer)
        console.log(rooms.currentRoom)
        answer = await ask('>_')
    }
    // if (commands.move.includes(answer)) {
    //     enterState(answer)
    //     console.log(rooms.currentRoom);
    //  }
}