/// <reference path="BoardUI.ts"/>
/// <reference path="DiceUI.ts"/>
/// <reference path="StatusUI.ts"/>
/// <reference path="Utils.ts"/>

class GameUI {
    
    board: BoardUI;
    dice: DiceUI;
    status: StatusUI;
    
    constructor(containerElementId: string) {
        let container = document.getElementById(containerElementId);
        Utils.removeAllChildren(container);
        
        this.board = new BoardUI();
        this.dice = new DiceUI();
        this.status = new StatusUI();
        
        container.appendChild(this.board.containerDiv);
        container.appendChild(this.dice.containerDiv);
        container.appendChild(this.status.statusSpan);
    }
}