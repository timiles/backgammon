/// <reference path="UI/BoardUI.ts"/>
/// <reference path="DiceUI.ts"/>
/// <reference path="Enums.ts"/>
/// <reference path="StatusUI.ts"/>

class GameUI {
    
    boardUI: BoardUI;
    blackDiceUI: DiceUI;
    redDiceUI: DiceUI;
    statusUI: StatusUI;
    
    constructor(containerElementId: string) {
        let container = document.getElementById(containerElementId);
        container.className = 'game-container';
        Utils.removeAllChildren(container);
        
        this.boardUI = new BoardUI(containerElementId);
        this.blackDiceUI = new DiceUI(PlayerId.BLACK);
        this.redDiceUI = new DiceUI(PlayerId.RED);
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