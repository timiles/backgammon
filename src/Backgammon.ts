import { Board } from 'BoardComponents/Board'
import { Dice } from './Dice'
import { DiceRollGenerator } from './DiceRollGenerator'
import { PlayerId } from './Enums'
import { Game } from './Game'
import { GameUI } from './UI/GameUI'
import { StatusLogger } from './StatusLogger'
import { StatusUIEventBinder } from './UI/EventBinders/StatusUIEventBinder'

export class Backgammon {
    
    constructor(containerId: string, blackIsComputer = false, redIsComputer = false) {
        
        let board = new Board();
        let ui = new GameUI(containerId, board);
        board.initialise();

        let dice = new Dice(new DiceRollGenerator(), ui.blackDiceUI, ui.redDiceUI);
        
        let statusLogger = new StatusLogger();
        new StatusUIEventBinder(statusLogger, ui.statusUI);
        let game = new Game(board, dice, statusLogger, [blackIsComputer, redIsComputer]);

        // TODO: UI trigger game to begin
        dice.rollToStart(statusLogger, (successfulPlayer: PlayerId) => {
            game.begin(successfulPlayer);
        });
    }
}