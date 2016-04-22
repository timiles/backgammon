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
    
    initialise(pointUIs: Array<PointUI>): void {
        this.boardDiv.appendChild(pointUIs[13].pointDiv);
        this.boardDiv.appendChild(pointUIs[14].pointDiv);
        this.boardDiv.appendChild(pointUIs[15].pointDiv);
        this.boardDiv.appendChild(pointUIs[16].pointDiv);
        this.boardDiv.appendChild(pointUIs[17].pointDiv);
        this.boardDiv.appendChild(pointUIs[18].pointDiv);
        this.boardDiv.appendChild(BoardUI.createBar(Player.BLACK));
        this.boardDiv.appendChild(pointUIs[19].pointDiv);
        this.boardDiv.appendChild(pointUIs[20].pointDiv);
        this.boardDiv.appendChild(pointUIs[21].pointDiv);
        this.boardDiv.appendChild(pointUIs[22].pointDiv);
        this.boardDiv.appendChild(pointUIs[23].pointDiv);
        this.boardDiv.appendChild(pointUIs[24].pointDiv);
        this.boardDiv.appendChild(BoardUI.createHome(Player.BLACK));
        this.boardDiv.appendChild(BoardUI.createClearBreak());
        this.boardDiv.appendChild(pointUIs[12].pointDiv);
        this.boardDiv.appendChild(pointUIs[11].pointDiv);
        this.boardDiv.appendChild(pointUIs[10].pointDiv);
        this.boardDiv.appendChild(pointUIs[9].pointDiv);
        this.boardDiv.appendChild(pointUIs[8].pointDiv);
        this.boardDiv.appendChild(pointUIs[7].pointDiv);
        this.boardDiv.appendChild(BoardUI.createBar(Player.RED));
        this.boardDiv.appendChild(pointUIs[6].pointDiv);
        this.boardDiv.appendChild(pointUIs[5].pointDiv);
        this.boardDiv.appendChild(pointUIs[4].pointDiv);
        this.boardDiv.appendChild(pointUIs[3].pointDiv);
        this.boardDiv.appendChild(pointUIs[2].pointDiv);
        this.boardDiv.appendChild(pointUIs[1].pointDiv);
        this.boardDiv.appendChild(BoardUI.createHome(Player.RED));
        this.boardDiv.appendChild(BoardUI.createClearBreak());
    }
    
    private static createBar(player: Player) {
        let bar = document.createElement('div');
        bar.id = Player[player] + '-bar';
        bar.className = 'point bar';
        return bar;
    }
    private static createHome(player: Player) {
        let bar = document.createElement('div');
        bar.id = Player[player] + '-home';
        bar.className = 'point home';
        return bar;
    }
    private static createClearBreak() {
        let br = document.createElement('br');
        br.className = 'clear';
        return br;
    }
}
