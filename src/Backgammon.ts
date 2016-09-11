/// <reference path="Board.ts"/>
/// <reference path="Dice.ts"/>
/// <reference path="DiceRollGenerator.ts"/>
/// <reference path="Game.ts"/>
/// <reference path="GameUI.ts"/>
/// <reference path="StatusLogger.ts"/>

class Backgammon {
    
    constructor(containerId: string) {
        
        let ui = new GameUI(containerId);
        let board = new Board();
        let dice = new Dice(new DiceRollGenerator(), ui.blackDiceUI, ui.redDiceUI);
        let statusLogger = new StatusLogger(ui.statusUI);

        dice.rollToStart(statusLogger, (successfulPlayer: PlayerId) => {
            new Game(ui, board, dice, statusLogger, successfulPlayer);
        });
    }
}