class DiceUI {
    
    diceContainerDiv: HTMLElement;
    constructor(diceContainerElementId: string) {
        
        this.diceContainerDiv = document.getElementById(diceContainerElementId);
    }
    
    setDiceRolls(roll1: number, roll2: number) {
        this.diceContainerDiv.innerText = `${roll1}, ${roll2}`;
    }
}