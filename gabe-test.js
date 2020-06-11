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

class Room {
  constructor(name, description, inventory) {
  this.name = name
  this.description = description
  this.inventory = inventory
  this.locked = false
  }
  describe() {
    console.log(this.description)
  }
}

const bedRoom = {
name: 'bedRoom',
desc: `You awaken in your bedroom. Feel free to look around.`,
inventory: ['stairs', 'bed', 'plant', 'SNES', 'PC', 'table'],
north: 'You are in the center of the room facing an SNES. In the Northwest corner of the room is a PC next to a table. In the Northeast corner is a descending staircase.',
south: 'In the southwest corner of the room is a bed, and in the southeast corner is a tall plant.',
east: 'In the Northeast corner of the room to the left is a descending staircase, and in the southeast corner, to the right, is a plant.',
west: 'In the Northwest corner of the room to your right is a PC, and in the Southwest corner is a bed.'
}

const downStairs = {
  furniture: ['stairs', 'TV', 'bookcase', 'door'],
  people: ['mom'],
  desc: `You go down the stairs to the foyer. Your mom sits at a table in the middle of the room. On the north wall is a TV, and in the northwest corner are some shelves. In the northeast corner are the stairs you came down, and to the south wall is the door.`
}

const player = {
  name: [],
  inventory: [],
  pokemon: [],
  facing: 'north',

}

const SNES = {
  desc: `${player.name} is playing the SNES. Okay! It's time to go!`,
  describe() {
    console.log(this.desc)
  }
}

const rival = {
  name: [],
  pokemon: []
}

let commands = {
  go: ['go', 'move', 'walk'],
  take: ['take', 'pick up'],
  inspect: ['inspect', 'examine', 'look'],
  read: ['read'],
  talk: ['talk', 'speak'],
  use: ['use'],
  drop: ['drop', 'leave', 'throw away'],
  inventory: ['inventory', 'i', 'items', 'bag']
}

let battleCommands = {
    run: ['run', 'flee'],
    fight: ['fight', 'attack'],
    pokemon: ['pokemon'],
    bag: ['items', 'bag', 'inventory']
}

let states = {
  'bedRoom': { canChangeTo: [ 'downStairs' ] },
  'downStairs': { canChangeTo: [ 'palletTown', 'downStairs' ] },
  'palletTown': { canChangeTo: [ 'laboratory', 'routeOne', 'downStairs' ] },
  'laboratory': { canChangeTo: [ 'outSide' ]},
  'routeOne': { canChangeTo: [ 'roomThree' ]}
}

let currentState = `bedRoom`;

function enterState(newState) {
  let validTransitions = states[currentState].canChangeTo;
  if (validTransitions.includes(newState)) {
    currentState = newState;
    console.log(currentState.desc)
  } else {
    throw `Invalid state transition attempted from ${currentState} to ${newState}.`;
  }
}

async function start() {
  let input = await ask (`>_`);
  sanitize(input);

  if (input === ``) {
    start();
  } if (input === `help`) {
    console.log(`Type "go", "move", or "walk" plus "door" or "stairs" to change player location.\nType "take", "pick up" or "withdraw" plus the name of an item to take that item. Other commands are "inspect", "read", "talk", "use", "drop", or "inventory".`)
  }
  if (currentState === 'bedRoom') {
    if (commands.go.includes(input) || commands.use.includes(input)) {
      if (input.includes(`stairs`)) {
        enterState('downStairs');
        start();
      } if (commands.inspect.includes(input)) {
          if (answer.includes('SNES')) {
          console.log(`${player.name} is playing the SNES. Okay! It's time to go!`);
          start();
        }
      }
    }
  }
  else if (commands.inspect.includes(input)) {
    if (input.includes('north')) {
      player.facing = 'north'
      console.log(states.playerState[player.facing])
      start();
    }
  } else {
    console.log(`I do not understand that command.`);
    start();
  }
}
start();

play();

async function play() {
  await ask('OAK: Hello there! Welcome to the //world of Pokemon! My name is Oak. People call //me the "Pokemon prof". This world is //inhabited by creatures called Pokemon! For //some people, Pokemon are pets, others use //them for fights.');
  await ask(`Myself...`);
  await ask(`I study Pokemon as a profession.`);
  player.name = await ask(`First, what is your //name?(Enter Red, Ash, Jack, or a new name //entirely.)\n>_`);
  if (player.name === ``) {
    player.name = `Jack`
  }
  console.log(`This is my grandson. He's been //your rival since you were a baby.`);
  rival.name = await ask (`...Erm, what is his //name again? (Enter Blue, Gary, John, or a new //name entirely.)\n>_`);
  if (rival.name === ``) {
    rival.name = `Blue`;
  }
  await ask (`That's right! I remember now! His //name is ${rival.name}!`);
  console.log(`Your very own Pokemon legend is //about to unfold! A world of dreams and //adventures with Pokemon awaits! Let's go!`);
  playerState = 'bedRoom';
  console.log(`You awaken in your bedroom. Feel //free to look around.\nType "look" + the name //of a cardinal direction to look towards that //side of the room. Type "inspect" or "examine" //+ the name of an object to interact with that //object. For a more detailed list of commands, //type "help" at any time.`)
  start();
}