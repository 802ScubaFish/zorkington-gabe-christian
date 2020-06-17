//a storage bin for misc functions, for now.

export function wrap(string, w) {
    if (string.length <= w) {
        return string;
    }

    async function startPc() {
        console.log(`What do you want to do?`)
        let input = await ask('Withdraw item, Deposit item, Toss item, or Log off\n>_');
        sanitize(input);
        input = input.trim();
        input = input.split(' ');
        let command = input[0];
        let noun = input[input.length - 1];
        if (command.includes('log off') || noun.includes('off')) {
            return start();
        } if (command.includes('withdraw')) {
            console.log(`Pc inventory: ${this.pc}\nPlayer inventory: ${player.inventory}`);
            let input = await ask(`What do you want to withdraw?`);
            if (input.includes('potion')) {
                if (PC_COUNT.potions <= 0) {
                    console.log(`There is nothing stored.`);
                    return this.startPc();
                } else {
                    let input = await ask(`How many? (or cancel)\n`);
                    if (input.includes(`one`) || input.includes(`1`)) {
                        if (PC_COUNT.potions === 1) {
                            this.pc.pop();
                            PC_COUNT.potions--;
                        if (!PLAYER_COUNT.potions) {
                            player.inventory.push(`potion x${PLAYER_COUNT.potions}`);
                        } PLAYER_COUNT.potions++;
                        console.log(`Withdrew potion.`)
                        return this.startPc();
                    } else if (PC_COUNT.potions === 2) {
                        PC_COUNT.potions--;
                        if (!PLAYER_COUNT.potions) {
                        player.inventory.push(`potion x${PLAYER_COUNT.potions}`);
                    } PLAYER_COUNT.potions++;
                        console.log(`Withdrew potion.`)
                        return this.startPc();
                 }
                 } else if (input.includes(`two`) || input.includes('2')) {
                        if (PC_COUNT.potions === 2) {
                            this.pc.pop();
                            PC_COUNT.potions = PC_COUNT.potions - 2;
                            player.inventory.push(`potion x${PLAYER_COUNT.potions}`)
                            PLAYER_COUNT.potions = PLAYER_COUNT.potions + 2;
                            console.log(`Withdrew potion.`)
                            return this.startPc();
                        } else {
                            console.log(`Can't do that.`);
                            return this.startPc();
                        }
                    } if (input.includes(`cancel`)) {
                        return this.startPc();
                    }
                }
             } else {
                console.log(`I didn't understand that.`);
                return this.startPc();
            }
        } else if (command.includes(`deposit`)) {
            if (PLAYER_COUNT.potions > 0) {
                if (input.includes(`one`) || input.includes(`1`)) {
                    if (PLAYER_COUNT.potions === 1) {
                        player.inventory.pop();
                        PLAYER_COUNT.potions--;
                    } if (!this.pc) {
                        this.pc.push(`potion x${PC_COUNT.potions}`);
                        PC_COUNT.potions++;
                        console.log(`Stored potion via PC.`)
                        return this.startPc();
                    } else if (this.pc.inventory) {
                        PC_COUNT.potions++;
                        console.log(`Stored potion via PC.`)
                        return this.startPc();
                    }
                } if (input.includes(`two`) || input.includes('2')) {
                    if (PLAYER_COUNT.potions === 2) {
                        player.inventory.pop();
                        PLAYER_COUNT.potions = PLAYER_COUNT.potions - 2;
                        this.pc.push(`potion x${PC_COUNT.potions}`)
                        PC_COUNT.potions = PC_COUNT.potions + 2;
                        console.log(`Stored potions via PC.`)
                        return this.startPc();
                    } else {
                        console.log(`Can't do that.`);
                        return this.startPc();
                    }
                } if (input.includes(`cancel`)) {
                    return this.startPc();
                }
            } else {
                console.log(`You have nothing to deposit.`);
                return this.startPc();
            }
        }
    }

    //room class was never actually used for this version
class Room {
    constructor(name, description, inventory) {
        this.name = name
        this.desc = description
        this.inventory = inventory
        this.locked = false
    }
    describe() {
        console.log(this.desc)
    }
}

let nextVar = await ask(`Do you want to give a nickname to Squirtle?\n>_`);
if (commands.YES_ANSWERS.includes(nextVar)) {
    let nickName = await ask(`Please enter a nickname.\n>_`);
    squirtle.nickname.push(nickName);
    return rivalsPick();
} else {