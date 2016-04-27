/// <reference path="Bar.ts"/>
/// <reference path="Home.ts"/>
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
            let colour = (i % 2 == 0) ? 'black' : 'red';
            let isTopSide = i >= 12;
            this.pointUIs[i] = new PointUI(colour, isTopSide);
        }
    }
    
    initialise(checkerContainers: Array<CheckerContainer>): void {
        this.containerDiv.appendChild(this.pointUIs[12].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[13].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[14].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[15].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[16].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[17].checkerContainerDiv);
        this.containerDiv.appendChild((<Bar> checkerContainers[PointId.BAR]).barUIs[Player.RED].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[18].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[19].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[20].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[21].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[22].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[23].checkerContainerDiv);
        this.containerDiv.appendChild((<Home> checkerContainers[PointId.HOME]).homeUIs[Player.BLACK].checkerContainerDiv);
        this.containerDiv.appendChild(BoardUI.createClearBreak());
        this.containerDiv.appendChild(this.pointUIs[11].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[10].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[9].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[8].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[7].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[6].checkerContainerDiv);
        this.containerDiv.appendChild((<Bar> checkerContainers[PointId.BAR]).barUIs[Player.BLACK].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[5].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[4].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[3].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[2].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[1].checkerContainerDiv);
        this.containerDiv.appendChild(this.pointUIs[0].checkerContainerDiv);
        this.containerDiv.appendChild((<Home> checkerContainers[PointId.HOME]).homeUIs[Player.RED].checkerContainerDiv);
        this.containerDiv.appendChild(BoardUI.createClearBreak());
    }
    
    private static createClearBreak() {
        let br = document.createElement('br');
        br.className = 'clear';
        return br;
    }
}
