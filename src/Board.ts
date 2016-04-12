declare var $;
enum Player { BLACK, RED }

class Board {
    
    boardDiv: HTMLElement;
    constructor(boardElementId: string) {
        
        this.boardDiv = document.getElementById(boardElementId);

        // TODO: check board element is empty
        this.boardDiv.className = 'board';
        
        this.boardDiv.appendChild(Board.createPip(13, 'top', Player.RED));
        this.boardDiv.appendChild(Board.createPip(14, 'top', Player.BLACK));
        this.boardDiv.appendChild(Board.createPip(15, 'top', Player.RED));
        this.boardDiv.appendChild(Board.createPip(16, 'top', Player.BLACK));
        this.boardDiv.appendChild(Board.createPip(17, 'top', Player.RED));
        this.boardDiv.appendChild(Board.createPip(18, 'top', Player.BLACK));
        this.boardDiv.appendChild(Board.createBar(Player.BLACK));
        this.boardDiv.appendChild(Board.createPip(19, 'top', Player.RED));
        this.boardDiv.appendChild(Board.createPip(20, 'top', Player.BLACK));
        this.boardDiv.appendChild(Board.createPip(21, 'top', Player.RED));
        this.boardDiv.appendChild(Board.createPip(22, 'top', Player.BLACK));
        this.boardDiv.appendChild(Board.createPip(23, 'top', Player.RED));
        this.boardDiv.appendChild(Board.createPip(24, 'top', Player.BLACK));
        this.boardDiv.appendChild(Board.createHome(Player.BLACK));
        this.boardDiv.appendChild(Board.createClearBreak());
        this.boardDiv.appendChild(Board.createPip(12, 'bottom', Player.BLACK));
        this.boardDiv.appendChild(Board.createPip(11, 'bottom', Player.RED));
        this.boardDiv.appendChild(Board.createPip(10, 'bottom', Player.BLACK));
        this.boardDiv.appendChild(Board.createPip(9, 'bottom', Player.RED));
        this.boardDiv.appendChild(Board.createPip(8, 'bottom', Player.BLACK));
        this.boardDiv.appendChild(Board.createPip(7, 'bottom', Player.RED));
        this.boardDiv.appendChild(Board.createBar(Player.RED));
        this.boardDiv.appendChild(Board.createPip(6, 'bottom', Player.BLACK));
        this.boardDiv.appendChild(Board.createPip(5, 'bottom', Player.RED));
        this.boardDiv.appendChild(Board.createPip(4, 'bottom', Player.BLACK));
        this.boardDiv.appendChild(Board.createPip(3, 'bottom', Player.RED));
        this.boardDiv.appendChild(Board.createPip(2, 'bottom', Player.BLACK));
        this.boardDiv.appendChild(Board.createPip(1, 'bottom', Player.RED));
        this.boardDiv.appendChild(Board.createHome(Player.RED));
        this.boardDiv.appendChild(Board.createClearBreak());
    }
    
    private static createPip(pipNumber: Number, side: string, player: Player) {
        var pip = document.createElement('div');
        pip.id = pipNumber.toString();
        pip.className = `pip ${side}-pip ${Player[player]}-pip`;
        return pip;
    }
    private static createBar(player: Player) {
        var bar = document.createElement('div');
        bar.id = Player[player] + '-bar';
        bar.className = 'pip bar';
        return bar;
    }
    private static createHome(player: Player) {
        var bar = document.createElement('div');
        bar.id = Player[player] + '-home';
        bar.className = 'pip home';
        return bar;
    }
    private static createClearBreak() {
        var br = document.createElement('br');
        br.className = 'clear';
        return br;
    }
    
    getPipDiv(pipNumber: Number, player: Player) {
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

    setPipCounters(pipNumber: Number, numberOfCounters: Number, player: Player) {
        var $pipDiv = $(this.getPipDiv(pipNumber, player));
        for (var i = 0; i < numberOfCounters; i++) {
            if (i > 5) {
                $('.counter-total', $pipDiv).text(numberOfCounters);
            } else if (i == 5) {
                $pipDiv.append($('<div class="counter counter-total">').addClass(Player[player]));
            } else {
                $pipDiv.append($('<div class="counter">').addClass(Player[player]));
            }
        }
    }
}
