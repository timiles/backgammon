class Board {

    boardDiv: HTMLElement;
    constructor(document: HTMLDocument, boardElementId: string) {
        this.boardDiv = document.getElementById(boardElementId);

        // TODO: check board element is empty
        this.boardDiv.className = 'board';
        
        this.boardDiv.appendChild(Board.createPip(document, 13, 'top', 'red'));
        this.boardDiv.appendChild(Board.createPip(document, 14, 'top', 'black'));
        this.boardDiv.appendChild(Board.createPip(document, 15, 'top', 'red'));
        this.boardDiv.appendChild(Board.createPip(document, 16, 'top', 'black'));
        this.boardDiv.appendChild(Board.createPip(document, 17, 'top', 'red'));
        this.boardDiv.appendChild(Board.createPip(document, 18, 'top', 'black'));
        this.boardDiv.appendChild(Board.createBar(document, 'black'));
        this.boardDiv.appendChild(Board.createPip(document, 19, 'top', 'red'));
        this.boardDiv.appendChild(Board.createPip(document, 20, 'top', 'black'));
        this.boardDiv.appendChild(Board.createPip(document, 21, 'top', 'red'));
        this.boardDiv.appendChild(Board.createPip(document, 22, 'top', 'black'));
        this.boardDiv.appendChild(Board.createPip(document, 23, 'top', 'red'));
        this.boardDiv.appendChild(Board.createPip(document, 24, 'top', 'black'));
        this.boardDiv.appendChild(Board.createHome(document, 'black'));
        this.boardDiv.appendChild(Board.createClearBreak(document));
        this.boardDiv.appendChild(Board.createPip(document, 12, 'bottom', 'black'));
        this.boardDiv.appendChild(Board.createPip(document, 11, 'bottom', 'red'));
        this.boardDiv.appendChild(Board.createPip(document, 10, 'bottom', 'black'));
        this.boardDiv.appendChild(Board.createPip(document, 9, 'bottom', 'red'));
        this.boardDiv.appendChild(Board.createPip(document, 8, 'bottom', 'black'));
        this.boardDiv.appendChild(Board.createPip(document, 7, 'bottom', 'red'));
        this.boardDiv.appendChild(Board.createBar(document, 'red'));
        this.boardDiv.appendChild(Board.createPip(document, 6, 'bottom', 'black'));
        this.boardDiv.appendChild(Board.createPip(document, 5, 'bottom', 'red'));
        this.boardDiv.appendChild(Board.createPip(document, 4, 'bottom', 'black'));
        this.boardDiv.appendChild(Board.createPip(document, 3, 'bottom', 'red'));
        this.boardDiv.appendChild(Board.createPip(document, 2, 'bottom', 'black'));
        this.boardDiv.appendChild(Board.createPip(document, 1, 'bottom', 'red'));
        this.boardDiv.appendChild(Board.createHome(document, 'red'));
        this.boardDiv.appendChild(Board.createClearBreak(document));
    }
    
    private static createPip(document: HTMLDocument, pipNumber: Number, side: string, colour: string) {
        var pip = document.createElement('div');
        pip.id = pipNumber.toString();
        pip.className = `pip ${side}-pip ${colour}-pip`;
        return pip;
    }
    private static createBar(document: HTMLDocument, colour: string) {
        var bar = document.createElement('div');
        bar.id = colour + '-bar';
        bar.className = 'pip bar';
        return bar;
    }
    private static createHome(document: HTMLDocument, colour: string) {
        var bar = document.createElement('div');
        bar.id = colour + '-home';
        bar.className = 'pip home';
        return bar;
    }
    private static createClearBreak(document: HTMLDocument){
        var br = document.createElement('br');
        br.className = 'clear';
        return br;
    }
}
