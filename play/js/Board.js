var Player;
(function (Player) {
    Player[Player["BLACK"] = 0] = "BLACK";
    Player[Player["RED"] = 1] = "RED";
})(Player || (Player = {}));
var Board = (function () {
    function Board(boardElementId) {
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
    Board.createPip = function (pipNumber, side, player) {
        var pip = document.createElement('div');
        pip.id = pipNumber.toString();
        pip.className = "pip " + side + "-pip " + Player[player].toLocaleString().toLowerCase() + "-pip";
        return pip;
    };
    Board.createBar = function (player) {
        var bar = document.createElement('div');
        bar.id = Player[player].toLocaleString().toLowerCase() + '-bar';
        bar.className = 'pip bar';
        return bar;
    };
    Board.createHome = function (player) {
        var bar = document.createElement('div');
        bar.id = Player[player].toLocaleString().toLowerCase() + '-home';
        bar.className = 'pip home';
        return bar;
    };
    Board.createClearBreak = function () {
        var br = document.createElement('br');
        br.className = 'clear';
        return br;
    };
    return Board;
})();
