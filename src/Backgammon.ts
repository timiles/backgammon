/// <reference path="Board.ts"/>
/// <reference path="Dice.ts"/>
/// <reference path="DiceRollGenerator.ts"/>
/// <reference path="Game.ts"/>
/// <reference path="UI/GameUI.ts"/>
/// <reference path="StatusLogger.ts"/>

class Backgammon {
    
    constructor(containerId: string, blackIsComputer = false, redIsComputer = false) {
        
        let board = new Board();
        let ui = new GameUI(containerId, board);
        board.initialise();

        let dice = new Dice(new DiceRollGenerator(), ui.blackDiceUI, ui.redDiceUI);
        let statusLogger = new StatusLogger(ui.statusUI);
        let game = new Game(board, dice, statusLogger, [blackIsComputer, redIsComputer]);

        // TODO: UI trigger game to begin
        dice.rollToStart(statusLogger, (successfulPlayer: PlayerId) => {
            game.begin(successfulPlayer);
        });
    }
}