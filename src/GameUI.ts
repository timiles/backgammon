/// <reference path="BoardUI.ts"/>
/// <reference path="DiceUI.ts"/>
/// <reference path="Enums.ts"/>
/// <reference path="PlayerIndicatorUI.ts"/>
/// <reference path="StatusUI.ts"/>
/// <reference path="Utils.ts"/>

class GameUI {
    
    boardUI: BoardUI;
    blackDiceUI: DiceUI;
    redDiceUI: DiceUI;
    playerIndicatorUI: PlayerIndicatorUI;
    statusUI: StatusUI;
    
    constructor(containerElementId: string) {
        let container = document.getElementById(containerElementId);
        Utils.removeAllChildren(container);
        
        this.boardUI = new BoardUI();
        this.blackDiceUI = new DiceUI(Player.BLACK);
        this.redDiceUI = new DiceUI(Player.RED);
        this.playerIndicatorUI = new PlayerIndicatorUI();
        this.statusUI = new StatusUI();
        
        container.appendChild(this.boardUI.containerDiv);
        container.appendChild(this.blackDiceUI.containerDiv);
        container.appendChild(this.redDiceUI.containerDiv);
        container.appendChild(this.playerIndicatorUI.indicators[Player.BLACK]);
        container.appendChild(this.playerIndicatorUI.indicators[Player.RED]);
        container.appendChild(this.statusUI.containerDiv);
    }
}