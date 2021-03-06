const readline = require('readline');
const { SSL_OP_NETSCAPE_CA_DN_BUG } = require('constants');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

//converts user input to lower case
function sanitize(input) {
  input.toLowerCase();
}

//lists all possible user commands
const commands = {
  GO_COMMANDS: ['go', 'move', 'walk'],
  TAKE_COMMANDS: ['take', 'pick up'],
  INSPECT_COMMANDS: ['inspect', 'examine', 'look'],
  READ_COMMANDS: ['read'],
  TALK_COMMANDS: ['talk', 'speak'],
  USE_COMMANDS: ['use'],
  DROP_COMMANDS: ['drop', 'leave', 'throw away'],
  INVENTORY_COMMANDS: ['inventory', 'i', 'items', 'bag']
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
desc: `You awaken in your bedroom, facing an SNES in the center of the room. There is a bed in the southwestern corner, to the southeast stands a tall potted plant. In the northwestern corner there is a PC on a stand set beside a small table. In the northeast is a set of stairs leading down to the foyer.\nWhat would you like to do?`,
inventory: ['stairs', 'bed', 'plant', 'snes', 'pc', 'table'],
north: 'You are in the center of the room facing an SNES. In the Northwest corner of the room is a PC next to a table. In the Northeast corner is a descending staircase.',
south: 'In the southwest corner of the room is a bed, and in the southeast corner is a tall plant.',
east: 'In the Northeast corner of the room to the left is a descending staircase, and in the southeast corner, to the right, is a plant.',
west: 'In the Northwest corner of the room to your right is a PC, and in the Southwest corner is a bed.',
plant: {
  desc: `It's just an old plant.`
}
}

const downStairs = {
  furniture: ['stairs', 'TV', 'bookcase', 'door', 'kitchen table'],
  people: ['mom'],
  desc: `You go down the stairs to the foyer. Your mom sits at a table in the middle of the room. On the north wall is a TV, and in the northwest corner is a bookcase. \nIn the northeast corner are the stairs you came down, and to the south wall is the door.`
}

const palletTown = {
  name: 'pallet town'
}

const player = {
  name: [],
  inventory: [],
  pokemon: [],
  facing: 'north',

}

const rival = {
  name: [],
  pokemon: []
}

const mom = {
  name: 'mom',
  pokemon: [],
}

const snes = {
  name: 'snes',
  desc: `${player.name} is playing the SNES. Okay! It's time to go!`
}

const kitchenTable = {
  name: 'kitchen table',
  desc: 'The table has a flower in a vase sitting in the middle of it.'
}

const tv = {
  name: 'tv',
  desc: 'There\'s a movie on tv. Four boys are walking on railroad tracks... I\'d better go too!'
}

const bookCase = {
  name: 'bookcase',
  desc: 'Crammed full of Pokemon Books!'
}

const frontDoor = {
  name: 'front door',
  insideDesc: 'The exit to your childhood home',
  outsideDesc: 'The entrance to your childhood home'
}

const stairs = {
  topDesc: 'These are the stairs to the foyer.',
  bottomDesc: 'These stairs lead to your bedroom!'
}

const plant = {
  name: 'plant',
  desc: `It's just an old plant.`
}

const bed = {
  name: 'bed',
  desc: 'This is your bed.'
}

const pc = {
  desc: `${player.name} turned on the PC.`,
  inventory: ['Potions x1']
}

const table = {
  desc: 'Just a plain table.'
}

let battleCommands = {
  run: ['run', 'flee'],
  fight: ['fight', 'attack'],
  pokemon: ['pokemon'],
  bag: ['items', 'bag', 'inventory']
}

let states = {
  'bedRoom': { canChangeTo: ['downStairs'] },
  'downStairs': { canChangeTo: ['palletTown', 'bedRoom'] },
  'palletTown': { canChangeTo: ['laboratory', 'routeOne', 'downStairs'] },
  'laboratory': { canChangeTo: ['palletTown'] },
  'routeOne': { canChangeTo: ['roomThree'] }
}

let roomLookUpTable = {
  'bedRoom': bedRoom,
  'downStairs': downStairs,
  'palletTown': palletTown,

}

let currentState = 'bedRoom';

function enterState(newState) {
  let validTransitions = states[currentState].canChangeTo;
  if (validTransitions.includes(newState)) {
    currentState = newState;
  } else {
    throw `Invalid state transition attempted from ${currentState} to ${newState}.`;
  }
}

const lookUpTable = {
  'plant': plant,
  'snes': snes,
  'stairs': stairs,
  'pc': pc,
  'table': table
}

async function startPc() {
  let input = await ask('withdraw item, deposit item, toss item, log off');
  sanitize(input);
  input = input.trim();
  input = input.split(' ');
  let command = input[0];
  let noun = input[input.length - 1];
  if (command.includes('withdraw')) {
    console.log(`What do you want to withdraw?`);
    let withdraw = await ask(console.log(pc.inventory));
    if (withdraw.includes('potion') && pc[inventory].includes('Potion x1')) {
      let input = await ask(`How many?`);
      if (input) {
        pc.inventory.pop();
        player.inventory.push('Potion x1');
      } else {
        console.log(`There is nothing here to withdraw.`)
      } return startPc();
    }
  }
}

async function start() {
  console.log(states[currentState])
  let input = await ask (`>_`);

  if (input === ``) {
    console.log(`Please type in a command.`)
    return start();
  }
  sanitize(input);
  input = input.trim();
  input = input.split(' ');
  let command = input[0];
  let noun = input[input.length - 1];
  //if input is help it will print a command list
  if (input === `help`) {
    console.log(`Type "go", "move", or "walk" plus "door" or "stairs" to change player location.\nType "take", "pick up" or "withdraw" plus the name of an item to take that item. Other commands are "inspect", "read", "talk", "use", "drop", or "inventory".`);
    return start();
  } else if (commands.GO_COMMANDS.includes(command)) {
    if (currentState === 'bedRoom') {
      if (noun.includes('stairs') || noun.includes('downstairs')) {
        enterState('downStairs');
        console.log(`The state is ${currentState}.`)
        return start();
      } else {
        console.log(`I don't know where to go.`)
      }
    }
    else if (currentState === 'downStairs' || currentState === 'laboratory') {
      if (noun.includes('town') || noun.includes('outside')) {
        enterState('palletTown');
        console.log(`The state is ${currentState}.`)
        return start();
      }
    } else if (currentState === 'palletTown') {
      if (noun.includes('lab') || noun.includes('laboratory')) {
        enterState('laboratory');
        console.log(`The state is ${currentState}.`)
        return start();
      } else if (noun.includes('one') || noun.includes('routeOne')) {
        if (player.pokemon.length > 0) {
          enterState('routeOne');
          console.log(`The state is ${currentState}.`)
          return start();
        } else {
          console.log('Oak: Hey Wait! It\'s unsafe to go any furthur. Pokemon live in the tall grass')
          return start();
        }
      } else {
        console.log('I did not recognize that location. Would you please try again')
        return start();
      }
    }
  } else if (commands.INSPECT_COMMANDS.includes(command)) {
    if (noun.includes('north')) {
      player.facing = 'north';
      console.log(currentState[player.facing])
    }
    if (roomLookUpTable[currentState].inventory.includes(noun)) {
      if (noun === 'stairs') {
        if (currentState === 'bedRoom') {
          console.log(stairs.topDesc)
        }
        else if (currentState === 'downStairs') {
          console.log(stairs.bottomDesc)
        }
      }
      console.log(lookUpTable[noun].desc);
      return start();
    }
    if (noun.includes('plant')) {
      console.log(bedRoom.plant.desc);
      return start();
    }
    if (noun.includes('pc')) {
      console.log(pc.desc);
      console.log(`What do you want to do?`)
      startPc();
      return start();
    }
  }
  else if (commands.GO_COMMANDS.includes(input)) {
    if (input.includes('stairs')) {
      console.log(`This will work. (You said "go down stairs").`)
      enterState('downStairs');
      return start();
    }
  }
}

play();

async function play() {
  await ask('OAK: Hello there! Welcome to the world of Pokemon! My name is Oak. \nPeople call me the "Pokemon prof". This world is inhabited by creatures called Pokemon! For some people, Pokemon are pets, others use them for fights.\nMyself...\nI study Pokemon as a profession.');
  player.name = await ask(`First, what is your name?(Enter Red, Ash, Jack, or a new name entirely.)\n>_`);
  if (player.name === '') {
    player.name = `Ash`;
  }
  console.log(`Right! So your name is ${player.name}!`)
  console.log(`This is my grandson. He's been your rival since you were a baby.`);
  rival.name = await ask(`...Erm, what is his name again? (Enter Blue, Gary, John, or a new name entirely.)\n>_`);
  if (rival.name === ``) {
    rival.name = `Gary`;
  }
  await ask(`That's right! I remember now! His name is ${rival.name}!`);
  await ask(`Your very own Pokemon legend is about to unfold! A world of dreams and adventures with Pokemon awaits! Let's go!`);
  currentState = 'bedRoom';
  console.log(roomLookUpTable[currentState].desc)
  console.log(`Type "look" with the name of a cardinal direction to look at that side of the room. Type "inspect" or "examine" or "look" and the name of an object to interact with that object. For a more detailed list of commands, type "help" at any time.`);
  start();
}