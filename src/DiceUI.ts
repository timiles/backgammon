/// <reference path="Die.ts" />

class DiceUI {
    
    containerDiv: HTMLDivElement;
    die1: Die;
    die2: Die;
    
    constructor() {        
        this.containerDiv = document.createElement('div');
    }
    
    setDiceRolls(die1: Die, die2: Die) {
        this.die1 = die1;
        this.die1.onChange = () => { this.redraw(); };
        this.die2 = die2;
        this.die2.onChange = () => { this.redraw(); };
        
        this.redraw();
    }
    
    private redraw(): void {
        Utils.removeAllChildren(this.containerDiv);
        this.containerDiv.appendChild(DiceUI.createDie(this.die1));
        this.containerDiv.appendChild(DiceUI.createDie(this.die2));
    }
    
    private static createDie(die: Die): HTMLDivElement {
        let div = document.createElement('div');
        div.className = 'die die-uses-' + die.remainingUses;
        div.innerText = die.value.toString();
        return div;
    }
}