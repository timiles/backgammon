/// <reference path="BarUI.ts"/>
/// <reference path="Enums.ts"/>
/// <reference path="HomeUI.ts"/>
/// <reference path="PointUI.ts"/>
/// <reference path="Utils.ts"/>

class BoardUI {
    
    containerDiv: HTMLDivElement;
    blackHomeUI: HomeUI;
    redHomeUI: HomeUI;
    pointUIs: Array<PointUI>;
    blackBarUI: BarUI;
    redBarUI: BarUI;
    
    constructor(gameContainerId: string) {
        
        this.containerDiv = document.createElement('div');
        Utils.removeAllChildren(this.containerDiv);
        this.containerDiv.className = 'board';
        
        this.blackHomeUI = new HomeUI(Player.BLACK);
        this.blackHomeUI.containerDiv.id = `${gameContainerId}_blackhome`;
        this.redHomeUI = new HomeUI(Player.RED);
        this.redHomeUI.containerDiv.id = `${gameContainerId}_redhome`;
        
        this.pointUIs = new Array<PointUI>(24);
        for (let i = 0; i < this.pointUIs.length; i++) {
            let colour = (i % 2 == 0) ? 'black' : 'red';
            let isTopSide = i >= 12;
            this.pointUIs[i] = new PointUI(colour, isTopSide);
            this.pointUIs[i].containerDiv.id = `${gameContainerId}_point${i + 1}`;
        }
        
        this.blackBarUI = new BarUI(Player.BLACK);
        this.redBarUI = new BarUI(Player.RED);

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
    }
    
    private static createClearBreak() {
        let br = document.createElement('br');
        br.className = 'clear';
        return br;
    }
}
