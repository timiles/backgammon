class Board {

    boardData: BoardData;
    boardUI: BoardUI;    
    constructor(boardUI: BoardUI) {
        this.boardData = new BoardData();

        this.boardUI = boardUI;
        this.boardUI.draw(this.boardData);
    }   
    
}