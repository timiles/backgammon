/// <reference path="Board.ts"/>
/// <reference path="Dice.ts"/>
/// <reference path="GameUI.ts"/>
/// <reference path="PlayerIndicatorUI.ts"/>
/// <reference path="StatusLogger.ts"/>

enum Player { BLACK, RED }

class Game {
    
    board: Board;
    dice: Dice;
    playerIndicatorUI: PlayerIndicatorUI;
    statusLogger: StatusLogger;
    currentPlayer: Player;
    
    constructor(containerId) {
        let self = this;

        let ui = new GameUI(containerId);
        this.dice = new Dice(ui.diceUI);
        this.board = new Board(ui.boardUI);
        this.playerIndicatorUI = ui.playerIndicatorUI;
        
        this.board.onPointInspected = (checkerContainer: CheckerContainer, on: boolean) => {
            if (!on) {
                // turn off highlights if any
                if (checkerContainer instanceof Point) {
                    (<Point> checkerContainer).highlightSource(false);
                }
                else if (checkerContainer instanceof Bar) {
                    (<Bar> checkerContainer).highlightSource(Player.BLACK, false);
                    (<Bar> checkerContainer).highlightSource(Player.RED, false);
                }
                self.board.removeAllHighlights();
            }
            else if (checkerContainer.checkers[self.currentPlayer] > 0) {
                let validMoveExists = false;
                if (self.dice.die1.remainingUses > 0) {
                    if (self.board.highlightIfLegalMove(self.currentPlayer, checkerContainer.pointId, self.dice.die1.value)) {
                        validMoveExists = true;
                    }
                }
                if (self.dice.die2.remainingUses > 0) {
                    if (self.board.highlightIfLegalMove(self.currentPlayer, checkerContainer.pointId, self.dice.die2.value)) {
                        validMoveExists = true;
                    }
                }
                if (validMoveExists) {
                    if (checkerContainer instanceof Point) {
                        (<Point> checkerContainer).highlightSource(true);
                    }
                    else if (checkerContainer instanceof Bar) {
                        (<Bar> checkerContainer).highlightSource(this.currentPlayer, true);
                    }
                }
            }
        };
        
        this.board.onPointSelected = (point: Point, on: boolean) => {
            if (point.checkers[self.currentPlayer] > 0) {
                if (self.dice.die1.remainingUses > 0 &&
                    self.board.isLegalMove(self.currentPlayer, point.pointId, self.dice.die1.value)) {
                    self.board.move(self.currentPlayer, point.pointId, self.dice.die1.value);
                    self.dice.die1.remainingUses--;
                    self.dice.updateUI();
                }
                else if (self.dice.die2.remainingUses > 0 &&
                    self.board.isLegalMove(self.currentPlayer, point.pointId, self.dice.die2.value)) {
                    self.board.move(self.currentPlayer, point.pointId, self.dice.die2.value);
                    self.dice.die2.remainingUses--;
                    self.dice.updateUI();
                }
            }
            
            if (self.dice.die1.remainingUses == 0 && self.dice.die2.remainingUses == 0) {
                self.switchPlayer();
                self.dice.roll();
            }
        };
        
        
        this.statusLogger = new StatusLogger(ui.statusUI);
        
        // TODO: roll to see who starts. Assume BLACK.
        this.currentPlayer = Player.BLACK;
        this.logCurrentPlayer();
        
        this.dice.roll();
    }
 
    static getOtherPlayer(player: Player): Player {
        return player === Player.BLACK ? Player.RED : Player.BLACK;
    }
        
    switchPlayer(): void {
        this.currentPlayer = (this.currentPlayer + 1) % 2;
        this.logCurrentPlayer();
    }
    
    logCurrentPlayer(): void {
        this.statusLogger.logInfo(`${Player[this.currentPlayer]} to move`);
        this.playerIndicatorUI.setActivePlayer(this.currentPlayer);
    }
}