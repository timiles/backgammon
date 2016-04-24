/// <reference path="Bar.ts"/>
/// <reference path="Home.ts"/>
/// <reference path="Point.ts"/>
/// <reference path="PointUI.ts"/>

declare var $;

class BoardUI {
    
    boardDiv: HTMLElement;
    constructor(boardElementId: string) {
        
        this.boardDiv = document.getElementById(boardElementId);

        while (this.boardDiv.hasChildNodes()) {
            this.boardDiv.removeChild(this.boardDiv.childNodes[0]);
        }
        
        this.boardDiv.className = 'board';
    }
    
    initialise(checkerContainers: Array<CheckerContainer>): void {
        this.boardDiv.appendChild((<Point> checkerContainers[13]).pointUI.checkerContainerDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[14]).pointUI.checkerContainerDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[15]).pointUI.checkerContainerDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[16]).pointUI.checkerContainerDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[17]).pointUI.checkerContainerDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[18]).pointUI.checkerContainerDiv);
        this.boardDiv.appendChild((<Bar> checkerContainers[PointId.BAR]).barUIs[Player.RED].checkerContainerDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[19]).pointUI.checkerContainerDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[20]).pointUI.checkerContainerDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[21]).pointUI.checkerContainerDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[22]).pointUI.checkerContainerDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[23]).pointUI.checkerContainerDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[24]).pointUI.checkerContainerDiv);
        this.boardDiv.appendChild((<Home> checkerContainers[PointId.HOME]).homeUIs[Player.BLACK].checkerContainerDiv);
        this.boardDiv.appendChild(BoardUI.createClearBreak());
        this.boardDiv.appendChild((<Point> checkerContainers[12]).pointUI.checkerContainerDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[11]).pointUI.checkerContainerDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[10]).pointUI.checkerContainerDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[9]).pointUI.checkerContainerDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[8]).pointUI.checkerContainerDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[7]).pointUI.checkerContainerDiv);
        this.boardDiv.appendChild((<Bar> checkerContainers[PointId.BAR]).barUIs[Player.BLACK].checkerContainerDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[6]).pointUI.checkerContainerDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[5]).pointUI.checkerContainerDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[4]).pointUI.checkerContainerDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[3]).pointUI.checkerContainerDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[2]).pointUI.checkerContainerDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[1]).pointUI.checkerContainerDiv);
        this.boardDiv.appendChild((<Home> checkerContainers[PointId.HOME]).homeUIs[Player.RED].checkerContainerDiv);
        this.boardDiv.appendChild(BoardUI.createClearBreak());
    }
    
    private static createClearBreak() {
        let br = document.createElement('br');
        br.className = 'clear';
        return br;
    }
}
