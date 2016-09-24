import { BarUI } from './BarUI'
import { HomeUI } from './HomeUI'
import { PointUI } from './PointUI'
import { Board, PointId } from 'BoardComponents/Board'
import { PlayerId } from '../Enums'
import { Utils } from './Utils'

export class BoardUI {
    
    containerDiv: HTMLDivElement;
    blackHomeUI: HomeUI;
    redHomeUI: HomeUI;
    pointUIs: Array<PointUI>;
    blackBarUI: BarUI;
    redBarUI: BarUI;
    
    constructor(gameContainerId: string, board?: Board) {
        
        this.containerDiv = document.createElement('div');
        Utils.removeAllChildren(this.containerDiv);
        this.containerDiv.className = 'board';
        
        this.blackHomeUI = new HomeUI(PlayerId.BLACK);
        this.blackHomeUI.containerDiv.id = `${gameContainerId}_blackhome`;
        this.redHomeUI = new HomeUI(PlayerId.RED);
        this.redHomeUI.containerDiv.id = `${gameContainerId}_redhome`;
        
        this.pointUIs = new Array<PointUI>(24);
        for (let i = 0; i < this.pointUIs.length; i++) {
            let colour = (i % 2 == 0) ? 'black' : 'red';
            let isTopSide = i >= 12;
            this.pointUIs[i] = new PointUI(colour, isTopSide);
            this.pointUIs[i].containerDiv.id = `${gameContainerId}_point${i + 1}`;
        }
        
        this.blackBarUI = new BarUI(PlayerId.BLACK);
        this.redBarUI = new BarUI(PlayerId.RED);

        // append all elements in the correct order
        this.containerDiv.appendChild(this.pointUIs[12].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[13].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[14].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[15].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[16].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[17].containerDiv);
        this.containerDiv.appendChild(this.redBarUI.containerDiv);
        this.containerDiv.appendChild(this.pointUIs[18].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[19].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[20].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[21].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[22].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[23].containerDiv);
        this.containerDiv.appendChild(this.blackHomeUI.containerDiv);
        this.containerDiv.appendChild(BoardUI.createClearBreak());
        this.containerDiv.appendChild(this.pointUIs[11].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[10].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[9].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[8].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[7].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[6].containerDiv);
        this.containerDiv.appendChild(this.blackBarUI.containerDiv);
        this.containerDiv.appendChild(this.pointUIs[5].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[4].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[3].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[2].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[1].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[0].containerDiv);
        this.containerDiv.appendChild(this.redHomeUI.containerDiv);
        this.containerDiv.appendChild(BoardUI.createClearBreak());

        if (board) {
            this.bindEvents(board);
        }
    }
    
    private static createClearBreak() {
        let br = document.createElement('br');
        br.className = 'clear';
        return br;
    }

    private bindEvents(board: Board) {
        // helpers
        let getBarUI = (playerId: PlayerId): BarUI => {
            return (playerId === PlayerId.BLACK) ? this.blackBarUI : this.redBarUI;
        }
        let getHomeUI = (playerId: PlayerId): HomeUI => {
            return (playerId === PlayerId.BLACK) ? this.blackHomeUI : this.redHomeUI;
        }

        // wire up UI events
        this.blackHomeUI.onSelected = () => board.onPointSelected(PointId.HOME);
        this.redHomeUI.onSelected = () => board.onPointSelected(PointId.HOME);
        this.blackBarUI.onInspected = (on: boolean) => board.onPointInspected(PointId.BAR, on);
        this.blackBarUI.onSelected = () => board.onPointSelected(PointId.BAR);
        this.redBarUI.onInspected = (on: boolean) => board.onPointInspected(PointId.BAR, on);
        this.redBarUI.onSelected = () => board.onPointSelected(PointId.BAR);

        let bindPointUIEvents = (pointId: number): void => {
            let pointUI = this.pointUIs[pointId - 1];
            pointUI.onInspected = (on: boolean) => { board.onPointInspected(pointId, on); };
            pointUI.onSelected = () => { board.onPointSelected(pointId); };
        }
        for (let i = 1; i < 25; i++) {
            bindPointUIEvents(i);
        }

        board.onCheckerCountChanged = (pointId: number, playerId: PlayerId, count: number) => {
            switch (pointId) {
                case PointId.HOME: {
                    getHomeUI(playerId).setCheckers(playerId, count);
                    break;
                }
                case PointId.BAR: {
                    getBarUI(playerId).setCheckers(playerId, count);
                    break;
                }
                default: {
                    this.pointUIs[pointId - 1].setCheckers(playerId, count);
                }
            }
        };
        board.onSetBarAsSelected = (playerId: PlayerId, on: boolean) => {
            getBarUI(playerId).setSelected(on);
        };
        board.onSetPointAsSelected = (pointId: number, on: boolean) => {
            this.pointUIs[pointId - 1].setSelected(on);
        };
        board.onSetHomeAsValidDestination = (playerId: PlayerId, on: boolean) => {
            getHomeUI(playerId).setValidDestination(on);
        };
        board.onSetPointAsValidDestination = (pointId: number, on: boolean) => {
            this.pointUIs[pointId - 1].setValidDestination(on);
        };
        board.onSetBarAsValidSource = (playerId: PlayerId, on: boolean) => {
            getBarUI(playerId).setValidSource(on);
        };
        board.onSetPointAsValidSource = (pointId: number, on: boolean) => {
            this.pointUIs[pointId - 1].setValidSource(on);
        };
    }
}
