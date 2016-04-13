/// <reference path="DiceUI.ts"/>

class Dice {

    roll1: number;
    roll2: number;    
    diceUI: DiceUI;
    constructor(diceUI: DiceUI) {
        this.diceUI = diceUI;
    }

    private static generateDie(): number {
        return Math.floor(Math.random() * 6) + 1;        
    }
    roll() {
        this.roll1 = Dice.generateDie();
        this.roll2 = Dice.generateDie();
        this.diceUI.setDiceRolls(this.roll1, this.roll2);    
    }
}