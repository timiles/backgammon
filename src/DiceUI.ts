/// <reference path="Die.ts" />

class DiceUI {
    
    containerDiv: HTMLDivElement;
    constructor() {
        
        this.containerDiv = document.createElement('div');
    }
    
    setDiceRolls(die1: Die, die2: Die) {
        Utils.removeAllChildren(this.containerDiv);
        this.containerDiv.appendChild(DiceUI.createDie(die1));
        this.containerDiv.appendChild(DiceUI.createDie(die2));
    }
    
    private static createDie(die: Die): HTMLDivElement {
        let div = document.createElement('div');
        div.className = 'die die-uses-' + die.remainingUses;
        div.innerText = die.value.toString();
        return div;
    }
}