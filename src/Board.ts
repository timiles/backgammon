class Board {
    
    boardDiv: HTMLElement;
    constructor(boardElementId: string) {
        
        this.boardDiv = document.getElementById(boardElementId);

        // TODO: check board element is empty
        this.boardDiv.className = 'board';
        
        this.boardDiv.appendChild(Board.createPip(13, 'top', 'red'));
        this.boardDiv.appendChild(Board.createPip(14, 'top', 'black'));
        this.boardDiv.appendChild(Board.createPip(15, 'top', 'red'));
        this.boardDiv.appendChild(Board.createPip(16, 'top', 'black'));
        this.boardDiv.appendChild(Board.createPip(17, 'top', 'red'));
        this.boardDiv.appendChild(Board.createPip(18, 'top', 'black'));
        this.boardDiv.appendChild(Board.createBar('black'));
        this.boardDiv.appendChild(Board.createPip(19, 'top', 'red'));
        this.boardDiv.appendChild(Board.createPip(20, 'top', 'black'));
        this.boardDiv.appendChild(Board.createPip(21, 'top', 'red'));
        this.boardDiv.appendChild(Board.createPip(22, 'top', 'black'));
        this.boardDiv.appendChild(Board.createPip(23, 'top', 'red'));
        this.boardDiv.appendChild(Board.createPip(24, 'top', 'black'));
        this.boardDiv.appendChild(Board.createHome('black'));
        this.boardDiv.appendChild(Board.createClearBreak());
        this.boardDiv.appendChild(Board.createPip(12, 'bottom', 'black'));
        this.boardDiv.appendChild(Board.createPip(11, 'bottom', 'red'));
        this.boardDiv.appendChild(Board.createPip(10, 'bottom', 'black'));
        this.boardDiv.appendChild(Board.createPip(9, 'bottom', 'red'));
        this.boardDiv.appendChild(Board.createPip(8, 'bottom', 'black'));
        this.boardDiv.appendChild(Board.createPip(7, 'bottom', 'red'));
        this.boardDiv.appendChild(Board.createBar('red'));
        this.boardDiv.appendChild(Board.createPip(6, 'bottom', 'black'));
        this.boardDiv.appendChild(Board.createPip(5, 'bottom', 'red'));
        this.boardDiv.appendChild(Board.createPip(4, 'bottom', 'black'));
        this.boardDiv.appendChild(Board.createPip(3, 'bottom', 'red'));
        this.boardDiv.appendChild(Board.createPip(2, 'bottom', 'black'));
        this.boardDiv.appendChild(Board.createPip(1, 'bottom', 'red'));
        this.boardDiv.appendChild(Board.createHome('red'));
        this.boardDiv.appendChild(Board.createClearBreak());
    }
    
    private static createPip(pipNumber: Number, side: string, colour: string) {
        var pip = document.createElement('div');
        pip.id = pipNumber.toString();
        pip.className = `pip ${side}-pip ${colour}-pip`;
        return pip;
    }
    private static createBar(colour: string) {
        var bar = document.createElement('div');
        bar.id = colour + '-bar';
        bar.className = 'pip bar';
        return bar;
    }
    private static createHome(colour: string) {
        var bar = document.createElement('div');
        bar.id = colour + '-home';
        bar.className = 'pip home';
        return bar;
    }
    private static createClearBreak() {
        var br = document.createElement('br');
        br.className = 'clear';
        return br;
    }
}
