declare var $;

class BoardUI {
    
    boardDiv: HTMLElement;
    constructor(boardElementId: string) {
        
        this.boardDiv = document.getElementById(boardElementId);

        // TODO: check board element is empty
        this.boardDiv.className = 'board';
        
        this.boardDiv.appendChild(BoardUI.createPip(13, 'top', Player.RED));
        this.boardDiv.appendChild(BoardUI.createPip(14, 'top', Player.BLACK));
        this.boardDiv.appendChild(BoardUI.createPip(15, 'top', Player.RED));
        this.boardDiv.appendChild(BoardUI.createPip(16, 'top', Player.BLACK));
        this.boardDiv.appendChild(BoardUI.createPip(17, 'top', Player.RED));
        this.boardDiv.appendChild(BoardUI.createPip(18, 'top', Player.BLACK));
        this.boardDiv.appendChild(BoardUI.createBar(Player.BLACK));
        this.boardDiv.appendChild(BoardUI.createPip(19, 'top', Player.RED));
        this.boardDiv.appendChild(BoardUI.createPip(20, 'top', Player.BLACK));
        this.boardDiv.appendChild(BoardUI.createPip(21, 'top', Player.RED));
        this.boardDiv.appendChild(BoardUI.createPip(22, 'top', Player.BLACK));
        this.boardDiv.appendChild(BoardUI.createPip(23, 'top', Player.RED));
        this.boardDiv.appendChild(BoardUI.createPip(24, 'top', Player.BLACK));
        this.boardDiv.appendChild(BoardUI.createHome(Player.BLACK));
        this.boardDiv.appendChild(BoardUI.createClearBreak());
        this.boardDiv.appendChild(BoardUI.createPip(12, 'bottom', Player.BLACK));
        this.boardDiv.appendChild(BoardUI.createPip(11, 'bottom', Player.RED));
        this.boardDiv.appendChild(BoardUI.createPip(10, 'bottom', Player.BLACK));
        this.boardDiv.appendChild(BoardUI.createPip(9, 'bottom', Player.RED));
        this.boardDiv.appendChild(BoardUI.createPip(8, 'bottom', Player.BLACK));
        this.boardDiv.appendChild(BoardUI.createPip(7, 'bottom', Player.RED));
        this.boardDiv.appendChild(BoardUI.createBar(Player.RED));
        this.boardDiv.appendChild(BoardUI.createPip(6, 'bottom', Player.BLACK));
        this.boardDiv.appendChild(BoardUI.createPip(5, 'bottom', Player.RED));
        this.boardDiv.appendChild(BoardUI.createPip(4, 'bottom', Player.BLACK));
        this.boardDiv.appendChild(BoardUI.createPip(3, 'bottom', Player.RED));
        this.boardDiv.appendChild(BoardUI.createPip(2, 'bottom', Player.BLACK));
        this.boardDiv.appendChild(BoardUI.createPip(1, 'bottom', Player.RED));
        this.boardDiv.appendChild(BoardUI.createHome(Player.RED));
        this.boardDiv.appendChild(BoardUI.createClearBreak());
    }
    
    private static createPip(pipNumber: number, side: string, player: Player) {
        let pip = document.createElement('div');
        pip.id = pipNumber.toString();
        pip.className = `pip ${side}-pip ${Player[player]}-pip`;
        return pip;
    }
    private static createBar(player: Player) {
        let bar = document.createElement('div');
        bar.id = Player[player] + '-bar';
        bar.className = 'pip bar';
        return bar;
    }
    private static createHome(player: Player) {
        let bar = document.createElement('div');
        bar.id = Player[player] + '-home';
        bar.className = 'pip home';
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
                return document.getElementById(pipNumber.toString());
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