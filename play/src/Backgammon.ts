import { Board } from './BoardComponents/Board'
import { Dice } from './DiceComponents/Dice'
import { DiceRollGenerator } from './DiceComponents/DiceRollGenerator'
import { GameUI } from './UI/GameUI'
import { PlayerId } from './Enums'
import { Game } from './Game'
import { StatusLogger } from './StatusLogger'

export class Backgammon {
    
    constructor(containerId: string, blackIsComputer = false, redIsComputer = false) {
        
        let board = new Board();
        let dice = new Dice(new DiceRollGenerator());
        let statusLogger = new StatusLogger();
        let game = new Game(board, dice, statusLogger, [blackIsComputer, redIsComputer]);
        
        let ui = new GameUI(containerId, game);
        board.initialise();

        // TODO: UI trigger game to begin
        dice.rollToStart(statusLogger, (successfulPlayer: PlayerId) => {
            game.begin(successfulPlayer);
        });
    }
}