/// <reference path="Die.ts"/>
/// <reference path="DiceRollGenerator.ts"/>
/// <reference path="DiceUI.ts"/>
/// <reference path="Enums.ts"/>
/// <reference path="StatusLogger.ts"/>

class Dice {

    diceRollGenerator: CanGenerateDiceRoll;
    die1: Die;
    die2: Die;
    diceUIs: Array<DiceUI>;
    constructor(diceRollGenerator: CanGenerateDiceRoll, blackDiceUI: DiceUI, redDiceUI: DiceUI) {
        this.diceRollGenerator = diceRollGenerator;
        this.diceUIs = new Array<DiceUI>();
        this.diceUIs[Player.BLACK] = blackDiceUI;
        this.diceUIs[Player.RED] = redDiceUI;
    }

    rollToStart(statusLogger: StatusLogger, onSuccess: (successfulPlayer: Player) => void) {
        
        let die1 = new Die(this.diceRollGenerator.generateDiceRoll());
        let die2 = new Die(this.diceRollGenerator.generateDiceRoll());
        this.diceUIs[Player.BLACK].setStartingDiceRoll(die1);
        this.diceUIs[Player.RED].setStartingDiceRoll(die2);

        statusLogger.logInfo(`BLACK rolls ${die1.value}`);
        statusLogger.logInfo(`RED rolls ${die2.value}`);

        if (die1.value === die2.value) {
            statusLogger.logInfo('DRAW! Roll again');
            setTimeout(() => { this.rollToStart(statusLogger, onSuccess); }, 1000);
        }
        else {
            let successfulPlayer = die1.value > die2.value ? Player.BLACK : Player.RED;
            statusLogger.logInfo(`${Player[successfulPlayer]} wins the starting roll`);
            setTimeout(() => {
                this.die1 = die1;
                this.die2 = die2;
                this.diceUIs[successfulPlayer].setDiceRolls(die1, die2);
                this.diceUIs[successfulPlayer].setActive(true);
                onSuccess(successfulPlayer);
            }, 1000);
        }    
    }
    
    roll(player: Player): void {
        this.die1 = new Die(this.diceRollGenerator.generateDiceRoll());
        this.die2 = new Die(this.diceRollGenerator.generateDiceRoll());
        let isDouble = (this.die1.value === this.die2.value);
        
        if (isDouble) {
            this.die1.remainingUses = 2;
            this.die2.remainingUses = 2;
        }
        
        this.diceUIs[player].setDiceRolls(this.die1, this.die2);
        this.diceUIs[player].setActive(true);
        let otherPlayer = player === Player.BLACK ? Player.RED : Player.BLACK;
        this.diceUIs[otherPlayer].setActive(false);
    }
}