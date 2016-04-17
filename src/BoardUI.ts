/// <reference path="PointUI.ts"/>

declare var $;

class BoardUI {
    
    boardDiv: HTMLElement;
    constructor(boardElementId: string) {
        
        this.boardDiv = document.getElementById(boardElementId);

        // TODO: check board element is empty
        this.boardDiv.className = 'board';
    }
    
    initialise(boardData: BoardData): void {
        this.boardDiv.appendChild(boardData.data[13].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[14].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[15].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[16].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[17].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[18].pointUI.pointDiv);
        this.boardDiv.appendChild(BoardUI.createBar(Player.BLACK));
        this.boardDiv.appendChild(boardData.data[19].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[20].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[21].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[22].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[23].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[24].pointUI.pointDiv);
        this.boardDiv.appendChild(BoardUI.createHome(Player.BLACK));
        this.boardDiv.appendChild(BoardUI.createClearBreak());
        this.boardDiv.appendChild(boardData.data[12].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[11].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[10].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[9].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[8].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[7].pointUI.pointDiv);
        this.boardDiv.appendChild(BoardUI.createBar(Player.RED));
        this.boardDiv.appendChild(boardData.data[6].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[5].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[4].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[3].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[2].pointUI.pointDiv);
        this.boardDiv.appendChild(boardData.data[1].pointUI.pointDiv);
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
