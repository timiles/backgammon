/// <reference path="BoardData.ts"/>
/// <reference path="BoardUI.ts"/>

class Board {

    boardData: BoardData;
    boardUI: BoardUI;    
    constructor(boardUI: BoardUI) {
        this.boardData = new BoardData();

        this.boardUI = boardUI;
        this.boardUI.initialise(this.boardData);
    }
}