/// <reference path="BoardUI.ts"/>
/// <reference path="DiceUI.ts"/>
/// <reference path="StatusUI.ts"/>
/// <reference path="Utils.ts"/>

class GameUI {
    
    boardUI: BoardUI;
    diceUI: DiceUI;
    statusUI: StatusUI;
    
    constructor(containerElementId: string) {
        let container = document.getElementById(containerElementId);
        Utils.removeAllChildren(container);
        
        this.boardUI = new BoardUI();
        this.diceUI = new DiceUI();
        this.statusUI = new StatusUI();
        
        container.appendChild(this.boardUI.containerDiv);
        container.appendChild(this.diceUI.containerDiv);
        container.appendChild(this.statusUI.statusSpan);
    }
}