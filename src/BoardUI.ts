/// <reference path="Bar.ts"/>
/// <reference path="Home.ts"/>
/// <reference path="Point.ts"/>
/// <reference path="PointUI.ts"/>
/// <reference path="Utils.ts"/>

class BoardUI {
    
    containerDiv: HTMLDivElement;
    pointUIs: Array<PointUI>;
    
    constructor() {
        
        this.containerDiv = document.createElement('div');
        Utils.removeAllChildren(this.containerDiv);
        this.containerDiv.className = 'board';
        
        this.pointUIs = new Array<PointUI>(24);
        for (let i = 0; i < this.pointUIs.length; i++) {
            this.pointUIs[i] = new PointUI(i);
        }
    }
    
    initialise(checkerContainers: Array<CheckerContainer>): void {
        this.containerDiv.appendChild((<Point> checkerContainers[13]).pointUI.checkerContainerDiv);
        this.containerDiv.appendChild((<Point> checkerContainers[14]).pointUI.checkerContainerDiv);
        this.containerDiv.appendChild((<Point> checkerContainers[15]).pointUI.checkerContainerDiv);
        this.containerDiv.appendChild((<Point> checkerContainers[16]).pointUI.checkerContainerDiv);
        this.containerDiv.appendChild((<Point> checkerContainers[17]).pointUI.checkerContainerDiv);
        this.containerDiv.appendChild((<Point> checkerContainers[18]).pointUI.checkerContainerDiv);
        this.containerDiv.appendChild((<Bar> checkerContainers[PointId.BAR]).barUIs[Player.RED].checkerContainerDiv);
        this.containerDiv.appendChild((<Point> checkerContainers[19]).pointUI.checkerContainerDiv);
        this.containerDiv.appendChild((<Point> checkerContainers[20]).pointUI.checkerContainerDiv);
        this.containerDiv.appendChild((<Point> checkerContainers[21]).pointUI.checkerContainerDiv);
        this.containerDiv.appendChild((<Point> checkerContainers[22]).pointUI.checkerContainerDiv);
        this.containerDiv.appendChild((<Point> checkerContainers[23]).pointUI.checkerContainerDiv);
        this.containerDiv.appendChild((<Point> checkerContainers[24]).pointUI.checkerContainerDiv);
        this.containerDiv.appendChild((<Home> checkerContainers[PointId.HOME]).homeUIs[Player.BLACK].checkerContainerDiv);
        this.containerDiv.appendChild(BoardUI.createClearBreak());
        this.containerDiv.appendChild((<Point> checkerContainers[12]).pointUI.checkerContainerDiv);
        this.containerDiv.appendChild((<Point> checkerContainers[11]).pointUI.checkerContainerDiv);
        this.containerDiv.appendChild((<Point> checkerContainers[10]).pointUI.checkerContainerDiv);
        this.containerDiv.appendChild((<Point> checkerContainers[9]).pointUI.checkerContainerDiv);
        this.containerDiv.appendChild((<Point> checkerContainers[8]).pointUI.checkerContainerDiv);
        this.containerDiv.appendChild((<Point> checkerContainers[7]).pointUI.checkerContainerDiv);
        this.containerDiv.appendChild((<Bar> checkerContainers[PointId.BAR]).barUIs[Player.BLACK].checkerContainerDiv);
        this.containerDiv.appendChild((<Point> checkerContainers[6]).pointUI.checkerContainerDiv);
        this.containerDiv.appendChild((<Point> checkerContainers[5]).pointUI.checkerContainerDiv);
        this.containerDiv.appendChild((<Point> checkerContainers[4]).pointUI.checkerContainerDiv);
        this.containerDiv.appendChild((<Point> checkerContainers[3]).pointUI.checkerContainerDiv);
        this.containerDiv.appendChild((<Point> checkerContainers[2]).pointUI.checkerContainerDiv);
        this.containerDiv.appendChild((<Point> checkerContainers[1]).pointUI.checkerContainerDiv);
        this.containerDiv.appendChild((<Home> checkerContainers[PointId.HOME]).homeUIs[Player.RED].checkerContainerDiv);
        this.containerDiv.appendChild(BoardUI.createClearBreak());
    }
    
    private static createClearBreak() {
        let br = document.createElement('br');
        br.className = 'clear';
        return br;
    }
}
