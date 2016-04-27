class DiceUI {
    
    containerDiv: HTMLDivElement;
    constructor() {
        
        this.containerDiv = document.createElement('div');
    }
    
    setDiceRolls(roll1: number, roll2: number) {
        this.containerDiv.innerText = `${roll1}, ${roll2}`;
    }
}