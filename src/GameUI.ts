/// <reference path="BoardUI.ts"/>
/// <reference path="DiceUI.ts"/>
/// <reference path="Enums.ts"/>
/// <reference path="StatusUI.ts"/>
/// <reference path="Utils.ts"/>

class GameUI {
    
    boardUI: BoardUI;
    blackDiceUI: DiceUI;
    redDiceUI: DiceUI;
    statusUI: StatusUI;
    
    constructor(containerElementId: string) {
        let container = document.getElementById(containerElementId);
        container.className = 'game-container';
        Utils.removeAllChildren(container);
        
        this.boardUI = new BoardUI();
        this.blackDiceUI = new DiceUI(Player.BLACK);
        this.redDiceUI = new DiceUI(Player.RED);
        this.statusUI = new StatusUI();
        
        container.appendChild(this.boardUI.containerDiv);
        let sideContainer = document.createElement('div');
        sideContainer.className = 'side-container';
        sideContainer.appendChild(this.blackDiceUI.containerDiv);
        sideContainer.appendChild(this.statusUI.containerDiv);
        sideContainer.appendChild(this.redDiceUI.containerDiv);
        container.appendChild(sideContainer);
    }
}