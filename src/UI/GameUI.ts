import { Board } from 'BoardComponents/Board'
import { BoardUI } from './BoardUI'
import { DiceUI } from './DiceUI'
import { PlayerId } from './Enums'
import { StatusUI } from './StatusUI'
import { Utils } from './UI/Utils'

export class GameUI {
    
    boardUI: BoardUI;
    blackDiceUI: DiceUI;
    redDiceUI: DiceUI;
    statusUI: StatusUI;
    
    constructor(containerElementId: string, board: Board) {
        let container = document.getElementById(containerElementId);
        container.className = 'game-container';
        Utils.removeAllChildren(container);
        
        this.boardUI = new BoardUI(containerElementId, board);
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