const readline = require('readline');
const { SSL_OP_NETSCAPE_CA_DN_BUG } = require('constants');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
    return new Promise((resolve, reject) => {
        readlineInterface.question(questionText, resolve);
    });
}

function sanitize(input) {
    input.toLowerCase();
}

function capitalize(input) {
    input = input[0].toUppercase() + input.slice(1).toLowerCase();
}

const commands = {
    GO_COMMANDS: ['go', 'move', 'walk', 'enter', 'play'],
    TAKE_COMMANDS: ['take', 'pick up'],
    INSPECT_COMMANDS: ['inspect', 'examine', 'look', 'check'],
    READ_COMMANDS: ['read'],
    TALK_COMMANDS: ['talk', 'speak'],
    USE_COMMANDS: ['use'],
    DROP_COMMANDS: ['drop', 'leave', 'throw away'],
    INVENTORY_COMMANDS: ['inventory', 'i', 'items', 'bag'],
    YES_ANSWERS: ['yes', 'y', 'sure', 'okay']
}

class Pokemon {
    constructor(name, type, number, height, weight, description, nickname = this.name) {
        this.name = name,
            this.type = type,
            this.number = number,
            this.height = height,
            this.weight = weight,
            this.desc = description,
            this.nickname = nickname
    }
}

//room constructor should include fields for people, inventory, and desc, because the program reads those properties of every room.

const bulbasaur = new Pokemon('Bulbasaur', 'Seed', 'No. 001', `2' 04"`, `15.00 lb`, `A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokemon.`,);

const squirtle = new Pokemon('Squirtle', 'Tinyturtle', 'No. 007', `1' 08"`, `20.0 lb`, `After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth.`)

const charmander = new Pokemon('Charmander', 'Lizard', 'No. 004', `2' 00"`, `19.0 lb`, `Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.`)

const player = {
    name: [],
    inventory: [],
    pokemon: [],
}

const rival = {
    name: [],
    pokemon: []
}

//don't know how to print player.name or rival.name to the console without it saying undefined or just being blank.
const palletTown = {
    desc: `Once outside, You can see ${player.name[0]}'s house to the west, ${rival.name[0]}'s house to the east, and in between them to the south, you see Prof. Oak's laboratory. To the north is the tall grass of the path known as route one. Type "home" to go to your house, "visit" to go to your rival's house, "laboratory" or "lab" to go to the lab, or "route one" to go to Route one, or type 'hint' for a hint.`,
    hint: `Why don't you try to leave town?`,
    people: [],
    inventory: ['player house', 'rival house', 'laboratory', 'route one']
}

const rivalHouse = {
    desc: `Two potted plants sit in the south corners. Your rival's mom sits at a table in front of an open book. Bookcases occupy the north corners, and there is a map on the north wall.`,
    inventory: ['map', 'bookcase', 'book', 'plant', ],
    people: ['mom'],
    book: `It's a big map! This is useful!`,
    map: `A town map.`,
    bookcase: 'Crammed full of Pokemon books!',
    table: `The kitchen table.`,
    plant: `A nice potted plant.`,
    mom: `Hi ${player.name}! ${rival.name} is out at Grandpa's lab.`
}

const routeOne = {
    locked: true,
    desc: `Oak: Hey! Wait! Don't go out!\nIt's unsafe! Wild Pokemon live in tall grass!\nYou need your own Pokemon for your protection. I know!\nHere, come with me!`,
}

const bedRoom = {
    name: 'bedRoom',
    people: [],
    describe() {
        console.log(`You awaken in your bedroom. There is a bed in the southwestern corner, and to the southeast stands a tall potted plant. In the northwestern corner there is a PC set beside a small table. In the northeast is a set of stairs leading down.\nWhat would you like to do?`)
    },
    inventory: ['stairs', 'bed', 'plant', 'snes', 'pc', 'table'],
    stairs: `The stairs leading down to the foyer.`,
    table: `It's just an old table.`,
    plant: `It's just an old plant.`,
    bed: `Your bed sits in the southwest corner of the room.`,
    pc: [`Potion x1`],
    //tried to create an inventory system for player and pc, but settled for "pc lite" due to time constraints. Looking at this function I built, there must be a better way to do this.
    async startPc() {
        console.log(`What do you want to do?`)
        let input = await ask('Withdraw item, Deposit item, Toss item, or Log off\n>_');
        sanitize(input);
        input = input.trim();
        input = input.split(' ');
        let command = input[0];
        let noun = input[input.length - 1];
        if (command.includes('log off') || noun.includes('off')) {
            console.log(`Got off the PC.`)
            return start();
        } else if (command.includes('withdraw')) {
            console.log(`Pc inventory: ${this.pc}\nPlayer inventory: ${player.inventory}`);
            let input = await ask(`What do you want to withdraw?\n`);
            if (input.includes('potion')) {
                if (bedRoom.pc.includes(`Potion x1`)) {
                    player.inventory.push(`Potion x1`);
                    bedRoom.pc.pop();
                    console.log(`Withdrew potion.`)
                    return this.startPc();
                } else {
                    console.log(`Nothing here to withdraw!`);
                    return this.startPc();
                }
            } else {
                console.log(`I didn't understand that command.`);
                return this.startPc();
            }
        } else if (command.includes(`deposit`)) {
            console.log(`Pc inventory: ${this.pc}\nPlayer inventory: ${player.inventory}`);
            let input = await ask(`What do you want to deposit?\n>_`);
            if (input.includes('potion')) {
                if (player.inventory.includes(`Potion x1`)) {
                    bedRoom.pc.push(`Potion x1`);
                    player.inventory.pop();
                    console.log(`Stored the potion via PC.`)
                    return this.startPc();
                } else {
                    console.log(`Nothing here to deposit!`);
                    return this.startPc();
                }
            } else {
                console.log(`I didn't understand that command.`);
                return this.startPc();
            }
        } else if (command.includes(`toss`)) {
            console.log(player.inventory);
            let input = await ask(`What do you want to toss?`);
            if (input === 'potion') {
                if (player.inventory.length >= 1) {
                    player.inventory.pop();
                    console.log(`Got rid of the potion.`);
                    return this.startPc();
                } else {
                    console.log(`You don't have anything to toss away.`);
                    return this.startPc();
                }
            }
        } else {
            console.log(`I didn't understand that command.`);
            return this.startPc();
        }
    }
}

const downStairs = {
    inventory: ['stairs', 'TV', 'bookcase', 'door', 'kitchen table'],
    people: ['mom'],
    desc: `Your mom sits at a table in the middle of the room. On the north wall is a TV, and in the northwest corner is a bookcase. \nIn the northeast corner are the stairs you came down, and to the south wall is the door.`,
    mom: `MOM: Right. All boys leave home some day. It said so on TV.\nProf. Oak, next door, is looking for you.`,
    bookcase: 'Crammed full of Pokemon Books!',
    table: `The table has a flower in a vase sitting in the middle of it.`,
    tv: 'There\'s a movie on tv. Four boys are walking on railroad tracks... I\'d better go, too!',
    stairs: `These stairs lead to your bedroom!`,
    door: `The entrance to your childhood home.`,
}

const laboratory = {
    desc: `You walk into the laboratory where a woman and two aides mill about in the entrance in front of a row of eight bookcases. Beyond these shelves is the lab where your rival in standing. Behind him are more rows of shelves and two books on a desk next to another PC. On a table in the middle of the lab near your rival are three of those poke balls you've been hearing about.\nWhat do you want to do?`,
    book: `It's encyclopedia-like, but the pages are blank!`,
    pc: `There's an email message here!\n...\nCalling all Pokemon trainers!\nThe elite trainers of Pokemon league are ready to take on all comers! Bring your best Pokemon and see how you rate as a trainer! Pokemon League HQ Indigo Plateau\nPS: Prof. Oak! Please visit us!\n...`,
    shelf: {
        names: ['shelf', 'shelves', 'bookshelf', 'bookshelves', 'bookcase', 'bookcases', 'case', 'cases'],
        desc: `Crammed full of Pokemon books!`,
    },
    pokeball: `Those are poke balls. They contain Pokemon!`,
    notpokeball: `That's Prof. Oak's last pokemon!`,
    inventory: ['pokeball1', 'pokeball2', 'pokeball3', 'book', 'pc', 'shelf', 'pokeball', 'pokeballs'],
    people: [`rival`, 'woman', 'aide'],
    rival: `Yo ${player.name[0]}!\nGramps isn't around!`,
    woman: `"Prof Oak is the authority on Pokemon. Many pokemon trainers hold him in high regard."`,
    aide: `"I study Pokemon as Prof. Oak's aide."`,
//In this use case, "locked" means Oak is not yet in the lab and the player cannot choose a pokemon, or the player has already chosen a pokemon.
    locked: true
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
    'routeOne': { canChangeTo: ['palletTown'] }
}

let currentState = 'bedRoom';

//enterState function automatically logs the description of the new room to the console.
function enterState(newState) {
    let validTransitions = states[currentState].canChangeTo;
    if (validTransitions.includes(newState)) {
        currentState = newState;
        console.log(roomLookUpTable[currentState].desc);
    } else {
        throw `Invalid state transition attempted from ${currentState} to ${newState}.`;
    }
}

const roomLookUpTable = {
    'bedRoom': bedRoom,
    'downStairs': downStairs,
    'palletTown': palletTown,
    'rivalHouse': rivalHouse,
    'routeOne': routeOne,
    'laboratory': laboratory
}

//Haven't gotten here, decided to cut the story at your rival chooses his pokemon, for the time being.
async function battleState() {
    console.log(`${rival.name[0]} wants to fight!`);
    console.log(`${rival.name[0]} sent out ${capitalize(rival.pokemon[0])}`)

}

async function rivalsPick() {
    console.log(`${rival.name[0]}: I'll take this one, then!`);
    if (player.pokemon.includes(`bulbasaur`)) {
        console.log(`${rival.name[0]} received a Charmander!`);
        rival.pokemon.push('charmander');
        laboratory.inventory.splice(laboratory.inventory.indexOf('pokeball3'), 1);
        return start();
    } else if (player.pokemon.includes('squirtle')) {
        console.log(`${rival.name[0]} received a Bulbasaur!`);
        rival.pokemon.push(`bulbasaur`);
        laboratory.inventory.splice(laboratory.inventory.indexOf('pokeball1'), 1);
        return start();
    } else if (player.pokemon.includes('charmander')) {
        console.log(`${rival.name[0]} received a Squirtle!`);
        laboratory.inventory.splice(laboratory.inventory.indexOf('pokeball2'), 1)
        rival.pokemon.push(`squirtle`);
        return start();
    }
}

async function start() {
    if (rival.pokemon.length > 0) {
        console.log(`You both got your pokemon. The end!`);
        process.exit();
    } else {
        let input = await ask(`>_`);

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
        if (command === `help` || noun === `help`) {
            console.log(`Type "go", "move", or "walk" plus "door" or "stairs" to change player location.\nType "take", "pick up" or "withdraw" plus the name of an item to take that item. Other commands are "inspect", "read", "talk", "use", "drop", or "inventory".`);
            return start();
        } else if (currentState === laboratory) {
            if (laboratory.locked === false) {
                if (input === '1' || noun === '1') {
                    console.log(bulbasaur);
                    let input = await ask(`Oak: So! You want the plant Pokemon, Bulbasaur?`);
                    sanitize(input);
                    if (input === 'yes') {
                        console.log(`This Pokemon is really energetic!`);
                        player.pokemon.push('bulbasaur');
                        laboratory.inventory.splice(laboratory.inventory.indexOf('pokeball1'), 1)
                        console.log(`${player.name[0]} received a Bulbasaur!`);
                        let nextVar = await ask(`Do you want to give a nickname to Charmander?`);
                        if (commands.YES_ANSWERS.includes(nextVar)) {
                            let nickname = await ask(`Please enter a nickname.`);
                            charmander.nickname.push(nickname);
                            return rivalsPick();
                        } else {
                            return rivalsPick();
                        }
                    } else {
                        return start();
                    }
                } else if (input === '2' || noun === '2') {
                    console.log(squirtle);
                    let input = await ask(`Oak: So! You want the water Pokemon, Squirtle?`);
                    sanitize(input);
                    if (input === 'yes') {
                        console.log(`This Pokemon is really energetic!`)
                        player.pokemon.push('squirtle');
                        laboratory.inventory.splice(laboratory.inventory.indexOf('pokeball2'), 1)
                        console.log(`${player.name[0]} received a Squirtle!`)
                        let nextVar = await ask(`Do you want to give a nickname to Charmander?`);
                        if (commands.YES_ANSWERS.includes(nextVar)) {
                            let nickname = await ask(`Please enter a nickname.`);
                            charmander.nickname.push(nickname);
                            return rivalsPick();
                        } else {
                            return rivalsPick();
                        }
                    } else {
                        return start();
                    }
                } else if (input === '3' || noun === '3') {
                    console.log(charmander);
                    let input = await ask(`Oak: So! You want the fire Pokemon, Charmander?`);
                    sanitize(input);
                    if (input === 'yes') {
                        console.log(`This Pokemon is really energetic!`)
                        player.pokemon.push('charmander');
                        console.log(`${player.name[0]} received a Charmander!`);
                        laboratory.inventory.splice(laboratory.inventory.indexOf('pokeball3'), 1)
                        let nextVar = await ask(`Do you want to give a nickname to Charmander?`);
                        if (commands.YES_ANSWERS.includes(nextVar)) {
                            let nickname = await ask(`Please enter a nickname.`);
                            charmander.nickname.push(nickname);
                            return rivalsPick();
                        } else {
                            return rivalsPick();
                        }
                    } else {
                        return start();
                    }
                }
            }
        } else if (commands.INVENTORY_COMMANDS.includes(command)) {
            console.log(`Player inventory: ${player.inventory}`)
            return start();
        } else if (commands.DROP_COMMANDS.includes(command)) {
            if (noun.includes(`potion`)) {
                if (player.inventory.includes(`Potion x1`)) {
                    player.inventory.pop();
                    console.log(`Got rid of the potion.`);
                    return start();
                } else {
                    console.log(`There is nothing in your inventory.`);
                    return start();
                }
            } else {
                console.log(`You can't drop the ${noun}!`);
                return start();
            }
        }
        else if (commands.TAKE_COMMANDS.includes(command)) {
            if (roomLookUpTable[currentState].inventory.includes(noun)) {
                    console.log(`You can't take the ${noun}.`);
                    return start();
            } else {
                console.log(`There is no ${noun} in this room.`);
                return start();
            }
        } else if (commands.USE_COMMANDS.includes(command) || commands.INSPECT_COMMANDS.includes(command)) {
            if (roomLookUpTable[currentState].inventory.includes(noun)) {
                if (noun === 'pc') {
                    if (roomLookUpTable[currentState].includes('laboratory')) {
                        console.log(laboratory.pc);
                        return start();
                    }
                    console.log(`${player.name[0]} turned on the PC.`)
                    roomLookUpTable[currentState].startPc();
                    return start();
                } if (noun === 'snes') {
                    console.log(`${player.name[0]} is playing the SNES. Okay! It\'s time to go!`);
                    return start();
                } if (noun === 'pokeball' || noun === 'ball') {
                    if (currentState === 'laboratory') {
                        if (laboratory.locked === true) {
                            console.log(laboratory.pokeball);
                            return start();
                        } else if (player.pokemon.length > 0) {
                            console.log(`That's Prof. Oak's last Pokemon!`)
                        } else {
                            console.log(`Please type 1, 2 or 3 to select which Poke ball to inspect.`);
                            return start();
                        }
                    } else {
                        console.log(`There are no Poke balls here!`);
                        return start();
                    }
                } if (noun.includes('tv')) {
                    console.log(roomLookUpTable[currentState].tv);
                    return start();
                } if (noun === 'stairs') {
                    console.log(roomLookUpTable[currentState].stairs);
                    return start();
                } if (noun === 'plant') {
                    console.log(roomLookUpTable[currentState].plant);
                    return start();
                } if (noun === 'bed') {
                    console.log(roomLookUpTable[currentState].bed);
                    return start();
                } if (noun === 'table') {
                    console.log(roomLookUpTable[currentState].table);
                    return start();
                } else {
                    console.log(roomLookUpTable[currentState].noun);
                    return start();
                }
            } else if (noun === 'potion' && player.inventory.includes(`Potion x1`)) {
                console.log(`All healed up!`);
                player.inventory.pop();
                return start();
            } else {
                console.log(`There is no ${noun} in this room.`);
                return start();
            }
        } else if (commands.TALK_COMMANDS.includes(command)) {
            if (noun === 'mom') {
                if (roomLookUpTable[currentState].people.includes('mom')) {
                    console.log(roomLookUpTable[currentState].mom);
                    return start();
                } else {
                    console.log(`You can't talk to mom here.`);
                    return start();
                }
            } else if (noun === `rival`) {
                if (roomLookUpTable[currentState].people.includes('rival')) {
                    console.log(laboratory.rival);
                    return start();
                } else {
                    console.log(`You can't talk to rival here.`);
                    return start();
                }
            } else if (noun.includes('woman')) {
                if (roomLookUpTable[currentState].people.includes('woman')) {
                    console.log(laboratory.woman);
                    return start();
                } else {
                    console.log(`You can't talk to her here.`);
                    return start();
                }
            } else if (noun.includes('aide')) {
                if (roomLookUpTable[currentState].people.includes('aide')) {
                    console.log(laboratory.aide);
                    return start();
                } else {
                    console.log(`You can't talk to aide here.`);
                    return start();
                }
            } else if (noun.includes('oak')) {
                if (roomLookUpTable[currentState].people.includes('oak')) {
                    console.log(`Oak: If a wild Pokemon appears, your Pokemon can fight against it!`);
                    return start();
                } else {
                    console.log(`You can't talk to Prof. Oak here!`);
                    return start();
                }
            } else {
                console.log(`You can't talk to ${noun}.`);
                return start();
            }
        } else if (commands.GO_COMMANDS.includes(command)) {
            if (noun.includes(`outside`) || noun.includes(`town`) || noun.includes(`door`) || noun.includes(`exit`) || noun.includes('out')) {
                if (currentState === 'laboratory' && rival.pokemon.length >= 1) {
                    console.log(`${rival.name[0]}: Hey! ${player.name[0]}! Let's check out our Pokemon! Come on, I'll take you on!`);
                    return battleState();
                }
                if (currentState === 'downStairs' || currentState === 'rivalHouse' || (currentState === 'laboratory' && rival.pokemon.length <= 0)) {
                    console.log(`You exit the building to Pallet Town`)
                    enterState('palletTown');
                    return start();
                } else {
                    console.log(`Can't get outside from here.`);
                    return start();
                }
            } else if (noun.includes('stairs') || noun.includes('downstairs') || noun.includes('down')) {
                if (currentState === 'bedRoom') {
                    console.log(`You walk down the stairs to the foyer.`);
                    enterState('downStairs');
                    return start();
                } else if (currentState === 'downStairs') {
                    console.log(`You walk up the stairs to your bedroom.`);
                    enterState('bedRoom');
                    return start();
                } else {
                    console.log(`There aren't any stairs nearby.`);
                    return start();
                }
            } else if (noun.includes('bed') || noun.includes('bedroom') || noun.includes('upstairs') || noun.includes('up') || noun.includes('room')) {
                if (currentState === 'downStairs') {
                    enterState('bedRoom');
                    console.log(`You walk up the stairs to your bedroom.`)
                    return start();
                } else {
                    console.log(`Can't get to your bedroom from here.`)
                    return start();
                }
            } else if (currentState === 'palletTown') {
                if (input.includes('lab') || input.includes('laboratory')) {
                    enterState('laboratory');
                    console.log(`${laboratory.desc}`)
                    return start();
                } if (noun.includes('inside') || noun.includes('downstairs') || noun.includes(`home`)) {
                    enterState('downStairs');
                    return start();
                } else if (noun.includes('one') || noun.includes('route one')) {
                    if (player.pokemon.length > 0) {
                        enterState('routeOne');
                        return start();
                    } else {
                        console.log(routeOne.desc);
                        laboratory.locked = false;
                        currentState = 'laboratory';
                        laboratory.people.push('oak');
                        await ask(`Professor Oak brings you over to his lab and takes you to the back table where your rival is standing next to a table with three Pokeballs.`);
                        await ask(`${rival.name[0]}: Gramps! I'm fed up with waiting!`);
                        await ask(`Oak: ${rival.name[0]}? Let me think... Oh, that's right, I told you to come! Just wait!\nHere, ${player.name[0]}! There are 3 Pokemon here! Haha! They are inside the Poke balls. When I was young, I was a serious Pokemon trainer! In my old age, I have only 3 Pokemon left, but you can have one! Choose!`);
                        await ask(`${rival.name[0]}: Hey! Gramps! What about me?`);
                        await ask(`Oak: Be patient, ${rival.name[0]}! You can have one too!\nNow, ${player.name[0]}, which Pokemon do you want? (type 1, 2, or 3 to inspect each Poke ball, respectively.)`);
                        return start();
                    }
                } else {
                    console.log('I did not recognize that location or that location is inaccessible. Would you please try again?')
                    return start();
                }
            } else {
                console.log(`I did not understand that command.`)
                return start();
            }
        } else {
            console.log(`I do not understand that command.`);
            return start();
        }
    }
}

play();

async function play() {
    await ask('OAK: Hello there! Welcome to the world of Pokemon! My name is Oak. \nPeople call me the "Pokemon prof". This world is inhabited by creatures called Pokemon! For some people, Pokemon are pets, others use them for fights.\nMyself...\nI study Pokemon as a profession.');
    let playersname = await ask(`First, what is your name? (Enter Red, Ash, Jack, or a new name entirely.)\n>_`);
    if (playersname === ``) {
        player.name.push(`Ash`);
    } else {
        player.name.push(playersname);
    }
    console.log(`Right! So your name is ${player.name[0]}!`)
    console.log(`This is my grandson. He's been your rival since you were a baby.`);
    let rivalsName = await ask(`...Erm, what is his name again? (Enter Blue, Gary, John, or a new name entirely.)\n>_`);
    if (rivalsName === ``) {
        rival.name.push(`Gary`);
    } else {
        rival.name.push(rivalsName);
    }
    await ask(`That's right! I remember now! His name is ${rival.name[0]}!`);
    await ask(`${player.name}!\nYour very own Pokemon legend is about to unfold! A world of dreams and adventures with Pokemon awaits! Let's go!\n`);
    currentState = 'bedRoom';
    roomLookUpTable[currentState].describe();
    console.log(`Type "inspect", "examine", or "look", or "use" plus the name of an object to interact with that object. Type "go" plus an exit to change your location. For a more detailed list of commands, type "help" any time.`);
    start();
}