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
        this.boardDiv.appendChild((<Point> checkerContainers[13]).pointUI.pointDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[14]).pointUI.pointDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[15]).pointUI.pointDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[16]).pointUI.pointDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[17]).pointUI.pointDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[18]).pointUI.pointDiv);
        this.boardDiv.appendChild((<Bar> checkerContainers[PointId.BAR]).barUIs[Player.RED].barDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[19]).pointUI.pointDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[20]).pointUI.pointDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[21]).pointUI.pointDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[22]).pointUI.pointDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[23]).pointUI.pointDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[24]).pointUI.pointDiv);
        this.boardDiv.appendChild((<Home> checkerContainers[PointId.HOME]).homeUIs[Player.BLACK].homeDiv);
        this.boardDiv.appendChild(BoardUI.createClearBreak());
        this.boardDiv.appendChild((<Point> checkerContainers[12]).pointUI.pointDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[11]).pointUI.pointDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[10]).pointUI.pointDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[9]).pointUI.pointDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[8]).pointUI.pointDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[7]).pointUI.pointDiv);
        this.boardDiv.appendChild((<Bar> checkerContainers[PointId.BAR]).barUIs[Player.BLACK].barDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[6]).pointUI.pointDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[5]).pointUI.pointDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[4]).pointUI.pointDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[3]).pointUI.pointDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[2]).pointUI.pointDiv);
        this.boardDiv.appendChild((<Point> checkerContainers[1]).pointUI.pointDiv);
        this.boardDiv.appendChild((<Home> checkerContainers[PointId.HOME]).homeUIs[Player.RED].homeDiv);
        this.boardDiv.appendChild(BoardUI.createClearBreak());
    }
    
    private static createClearBreak() {
        let br = document.createElement('br');
        br.className = 'clear';
        return br;
    }
}
