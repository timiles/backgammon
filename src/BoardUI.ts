/// <reference path="PointUI.ts"/>

declare var $;

class BoardUI {
    
    boardDiv: HTMLElement;
    constructor(boardElementId: string) {
        
        this.boardDiv = document.getElementById(boardElementId);

        // TODO: check board element is empty
        this.boardDiv.className = 'board';
        
        this.boardDiv.appendChild(BoardUI.createPip(13, Side.TOP));
        this.boardDiv.appendChild(BoardUI.createPip(14, Side.TOP));
        this.boardDiv.appendChild(BoardUI.createPip(15, Side.TOP));
        this.boardDiv.appendChild(BoardUI.createPip(16, Side.TOP));
        this.boardDiv.appendChild(BoardUI.createPip(17, Side.TOP));
        this.boardDiv.appendChild(BoardUI.createPip(18, Side.TOP));
        this.boardDiv.appendChild(BoardUI.createBar(Player.BLACK));
        this.boardDiv.appendChild(BoardUI.createPip(19, Side.TOP));
        this.boardDiv.appendChild(BoardUI.createPip(20, Side.TOP));
        this.boardDiv.appendChild(BoardUI.createPip(21, Side.TOP));
        this.boardDiv.appendChild(BoardUI.createPip(22, Side.TOP));
        this.boardDiv.appendChild(BoardUI.createPip(23, Side.TOP));
        this.boardDiv.appendChild(BoardUI.createPip(24, Side.TOP));
        this.boardDiv.appendChild(BoardUI.createHome(Player.BLACK));
        this.boardDiv.appendChild(BoardUI.createClearBreak());
        this.boardDiv.appendChild(BoardUI.createPip(12, Side.BOTTOM));
        this.boardDiv.appendChild(BoardUI.createPip(11, Side.BOTTOM));
        this.boardDiv.appendChild(BoardUI.createPip(10, Side.BOTTOM));
        this.boardDiv.appendChild(BoardUI.createPip(9, Side.BOTTOM));
        this.boardDiv.appendChild(BoardUI.createPip(8, Side.BOTTOM));
        this.boardDiv.appendChild(BoardUI.createPip(7, Side.BOTTOM));
        this.boardDiv.appendChild(BoardUI.createBar(Player.RED));
        this.boardDiv.appendChild(BoardUI.createPip(6, Side.BOTTOM));
        this.boardDiv.appendChild(BoardUI.createPip(5, Side.BOTTOM));
        this.boardDiv.appendChild(BoardUI.createPip(4, Side.BOTTOM));
        this.boardDiv.appendChild(BoardUI.createPip(3, Side.BOTTOM));
        this.boardDiv.appendChild(BoardUI.createPip(2, Side.BOTTOM));
        this.boardDiv.appendChild(BoardUI.createPip(1, Side.BOTTOM));
        this.boardDiv.appendChild(BoardUI.createHome(Player.RED));
        this.boardDiv.appendChild(BoardUI.createClearBreak());
    }
    
    private static createPip(pipNumber: number, side: Side) {
        let point = new PointUI(pipNumber, side);
        return point.pointDiv;
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
    
    getPipDiv(pipNumber: number, player: Player) {
        switch (pipNumber) {
            case 0 : {
                return document.getElementById(Player[player] + '-home');
            }
            case 25: {
                return document.getElementById(Player[player] + '-bar');
            }
            default: {
                return document.getElementById('point' + pipNumber.toString());
            }
        }
    }

    setPipCounters(pipNumber: number, numberOfCounters: number, player: Player) {
        let $pipDiv = $(this.getPipDiv(pipNumber, player));
        for (let i = 1; i <= numberOfCounters; i++) {
            if (i > 5) {
                $('.counter-total', $pipDiv).text(numberOfCounters);
            } else if (i == 5) {
                $pipDiv.append($('<div class="counter counter-total">').addClass(Player[player]));
            } else {
                $pipDiv.append($('<div class="counter">').addClass(Player[player]));
            }
        }
    }
    
    draw(boardData: BoardData) {
        for (let i = 0; i < 26; i++){
            this.setPipCounters(i, boardData.getCounters(i, Player.BLACK), Player.BLACK);
            this.setPipCounters(i, boardData.getCounters(i, Player.RED), Player.RED);
        }
    }
}
