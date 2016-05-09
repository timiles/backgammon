/// <reference path="Die.ts"/>
/// <reference path="DiceRollGenerator.ts"/>
/// <reference path="DiceUI.ts"/>
/// <reference path="Enums.ts"/>

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