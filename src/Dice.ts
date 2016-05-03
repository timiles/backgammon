/// <reference path="Die.ts"/>
/// <reference path="DiceUI.ts"/>
/// <reference path="Enums.ts"/>

class Dice {

    die1: Die;
    die2: Die;
    diceUI: DiceUI;
    constructor(diceUI: DiceUI) {
        this.diceUI = diceUI;
    }

    private static generateDie(): number {
        return Math.floor(Math.random() * 6) + 1;        
    }
    roll(): void {
        this.die1 = new Die();
        this.die2 = new Die();
        let isDouble = (this.die1.value === this.die2.value);
        
        if (isDouble) {
            this.die1.remainingUses = 2;
            this.die2.remainingUses = 2;
        }
        
        this.diceUI.setDiceRolls(this.die1, this.die2);
    }
}