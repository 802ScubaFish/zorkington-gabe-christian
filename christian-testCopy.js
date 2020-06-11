

let commands = {
    move: ['go', 'move'],
    take: ['take', 'pick up'],
    open: ['open', 'enter'],
    speak: ['speak', 'talk'],
    menu: ['menu', 'inventory'],
    examine: ['inspect', 'examine']
}
let states = {
    'bedroom': { canChangeTo: ['downstairs'] },
    'downstairs': { canChangeTo: ['bedroom', 'palletTown'] },
    'palletTown': { canChangeTo: ['laboratory', 'routeOne', 'downstairs'] },
    'laboratory': { canChangeTo: ['palletTown'] },
    'routeOne': { canChangeTo: ['palletTown'] }
};

let player = {
    inventory: [],

}

let currentState = "green";

function enterState(newState) {
    let validTransitions = states[currentState].canChangeTo;
    if (validTransitions.includes(newState)) {
        currentState = newState;
    } else {
        throw 'Invalid state transition attempted - from ' + currentState + ' to ' + newState;
    }
}

start();

async function start() {
    const welcomeMessage = `Bedroom
You awaken in your Bedroom, you see a set of stairs and a PC'`;
    let answer = await ask(welcomeMessage +'\n>_');
    console.log('Now write your code to make this work!');
    process.exit();
}if (commands.move.includes(answer)){
enterState()
}
