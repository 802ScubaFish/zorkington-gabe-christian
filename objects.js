const readline = require('readline');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
};

//could create a pick up method on player that pushes the thing into the inventory of player
let player = {

    inventory: [],
    trapped: true,
    facing: 'north',
    escape(code) {
    }
}
//objects can be really good as a lookup table that just takes a string and points it at that object
let room = {
    inventory: [
        'cabinet',
        'desk',
        'paper'
    ],
    north: 'The north wall of the room is blank, broken only by a large door with a keypad in the handle.\nThe door is locked.',
    south: 'On the south wall of the room is a large cabinet.',
    east: 'Set against the east wall is a fancy writing desk.',
    west: 'Tacked to the west wall is a single sheet of paper.'
}


let cabinet = {
    name: 'cabinet',
    desc: 'A large cabinet locked with a heavy padlock',
    async unlock() {
        if (player.inventory.includes('key')) {
            return console.log('You open the cabinet, inside the door the numbers 12345 are inscribed.')
        } else {
            return console.log(`You do not have the key to open this door. \nGo find it!`)
        }

    }
}

let desk = {
    name: 'Writing desk',
    desc: 'A fancy writing desk. One of the drawers is slightly ajar...',
    inventory: ['key'],
    takeKey() {
        //code here
        let key = this.inventory.pop()
        player.inventory.push(key)
    }
}
//you could slice it out (find the index it's at and slice(1) at that index)
//makes a function that takes things out of the inventory and slices it out.

let paper = {
    name: 'paper',
    desc: "The paper says: 'To free your mind start where all great stories start.'"
}

let roomLookUp = {
    cabinet: cabinet,
    desk: desk,
    paper: paper
}

//room.inventory@roomLookUp?
play()
async function play() {
    let input = await ask('>_')

    if(input.includes('examine')) {
        console.log(`You are facing ${player.facing}.`);
        console.log(room[player.facing]);
        return play()
        //looking around the room
    } else if (input.includes('look') && input.includes('north')) {
        player.facing = 'north';
        console.log(room.north);
        return play()
    } else if (input.includes('look') && input.includes('south')) {
        player.facing = 'south';
        console.log(room.south);
        return play()
    } else if (input.includes('look') && input.includes('east')) {
        player.facing = 'east';
        console.log(room.east);
        return play()
    } else if (input.includes('look') && input.includes('west')) {
        player.facing = 'west';
        console.log(room.west);
        return play()
        //checking things in the room
    } else if (input.includes('check') && input.includes('desk')) {
        if (player.facing === 'east') {
        console.log(desk.desc);
        } else {
            console.log('There is no desk in front of you! Look around!!')
        } return play();
    }  if (input.includes('check') && input.includes('paper')) {
        if (player.facing === 'west') {
        console.log(paper.desc);
        } else {
            console.log('There is no paper in front of you! Look around!!')
        }
        return play();
    } else if (input.includes('check') && input.includes('cabinet')) {
        if (player.facing === 'south') {
        console.log(cabinet.desc);
        } else {
            console.log('There is no cabinet in front of you! Look around!!')
        }
        return play();
        //interact with the desk
    } else if (input.includes('open') && input.includes('desk')) {
        console.log(`You opened the desk drawer and found a key inside!\nYou put the key in your pocket...`);
        desk.takeKey();
        return play();
    } else if (input.includes('unlock') && input.includes('cabinet')) {
        cabinet.unlock();
        return play();
    } else if(input.includes('escape')) {
        if (player.facing === 'north') {
            if (code === '12345') {
                console.log('Congrats!! You escaped!!!')
                return true;
            } else {
                console.log('Wrong code!! Try again!!!')
                return false;
            }
        return win ? process.exit() : play()
    } else {
        console.log(`There is no door in front of you, look around.`)
    }
}
    
    else {
        console.log('I do not understand that input...')
        return play();
    }

}