var Board = (function () {
    function Board(boardUI) {
        this.boardData = new BoardData();
        this.boardUI = boardUI;
        this.boardUI.draw(this.boardData);
    }
    return Board;
})();
