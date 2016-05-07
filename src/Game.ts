/// <reference path="Board.ts"/>
/// <reference path="CheckerContainer.ts"/>
/// <reference path="Dice.ts"/>
/// <reference path="Enums.ts"/>
/// <reference path="GameUI.ts"/>
/// <reference path="StatusLogger.ts"/>

class Game {
    
    board: Board;
    dice: Dice;
    statusLogger: StatusLogger;
    
    currentPlayer: Player;
    currentSelectedCheckerContainer: CheckerContainer;
    
    constructor(containerId) {
        let self = this;

        let ui = new GameUI(containerId);
        this.dice = new Dice(ui.blackDiceUI, ui.redDiceUI);
        this.board = new Board(ui.boardUI);
        
        this.board.onPointInspected = (checkerContainer: CheckerContainer, on: boolean) => {
            if (self.currentSelectedCheckerContainer != undefined) {
                // if we're halfway a move, don't check
                return;
            }
            
            if (!on) {
                // turn off highlights if any
                if (checkerContainer instanceof Point) {
                    // (<Point> checkerContainer).highlightSource(false);
                }
                else if (checkerContainer instanceof Bar) {
                    // (<Bar> checkerContainer).highlightSource(Player.BLACK, false);
                    // (<Bar> checkerContainer).highlightSource(Player.RED, false);
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
                        // (<Point> checkerContainer).highlightSource(true);
                    }
                    else if (checkerContainer instanceof Bar) {
                        // (<Bar> checkerContainer).highlightSource(this.currentPlayer, true);
                    }
                }
            }
        };
        
        this.board.onPointSelected = (checkerContainer: CheckerContainer, on: boolean) => {
            if (self.currentSelectedCheckerContainer == undefined) {
                if (checkerContainer.checkers[self.currentPlayer] == 0) {
                    // if no pieces here, exit
                    return;
                }

                let canUseDie = (die: Die) => {
                    return (die.remainingUses > 0 &&
                        self.board.isLegalMove(self.currentPlayer, checkerContainer.pointId, die.value));
                }

                let canUseDie1 = canUseDie(self.dice.die1);
                let canUseDie2 = canUseDie(self.dice.die2);

                // if can use one die but not the other, or if it's doubles, just play it
                if ((canUseDie1 != canUseDie2) || (self.dice.die1.value === self.dice.die2.value)) {
                    if (canUseDie1) {
                        self.board.move(self.currentPlayer, checkerContainer.pointId, self.dice.die1.value);
                        self.dice.die1.decrementRemainingUses();
                        self.evaluateBoard();                                        
                    }
                    else if (canUseDie2) {
                        self.board.move(self.currentPlayer, checkerContainer.pointId, self.dice.die2.value);
                        self.dice.die2.decrementRemainingUses();
                        self.evaluateBoard();                                        
                    }
                    
                    self.switchPlayerIfNoValidMovesRemain();
                    
                    // reinspect point
                    this.board.onPointInspected(checkerContainer, false);
                    this.board.onPointInspected(checkerContainer, true);
                }
                else if (canUseDie1 || canUseDie2) {
                    if (checkerContainer instanceof Point) {
                        (<Point> checkerContainer).setSelected(true);
                    }
                    else if (checkerContainer instanceof Bar) {
                        (<Bar> checkerContainer).setSelected(this.currentPlayer, true);
                    }
                    this.currentSelectedCheckerContainer = checkerContainer;
                    this.evaluateBoard();
                }
                // otherwise there was a legal move but this wasn't it
            }
            else if (checkerContainer.pointId === this.currentSelectedCheckerContainer.pointId) {
                if (this.currentSelectedCheckerContainer instanceof Point) {
                    (<Point> this.currentSelectedCheckerContainer).setSelected(false);
                }
                this.currentSelectedCheckerContainer = undefined;
            }
            else {
                
                let isUsingDie = (die: Die) => {
                    return (Board.getDestinationPointId(this.currentPlayer, this.currentSelectedCheckerContainer.pointId, die.value) === checkerContainer.pointId);
                }

                if (isUsingDie(self.dice.die1)) {
                    self.board.move(self.currentPlayer, this.currentSelectedCheckerContainer.pointId, self.dice.die1.value);
                    self.dice.die1.decrementRemainingUses();
                    self.evaluateBoard();                                        
                    if (this.currentSelectedCheckerContainer instanceof Point) {
                        (<Point> this.currentSelectedCheckerContainer).setSelected(false);
                    }
                    this.currentSelectedCheckerContainer = undefined;           
                }
                else if (isUsingDie(self.dice.die2)) {
                    self.board.move(self.currentPlayer, this.currentSelectedCheckerContainer.pointId, self.dice.die2.value);
                    self.dice.die2.decrementRemainingUses();
                    self.evaluateBoard();                                        
                    if (this.currentSelectedCheckerContainer instanceof Point) {
                        (<Point> this.currentSelectedCheckerContainer).setSelected(false);
                    }
                    this.currentSelectedCheckerContainer = undefined;           
                }

                self.switchPlayerIfNoValidMovesRemain();
                                
                // reinspect point
                this.board.onPointInspected(checkerContainer, false);
                this.board.onPointInspected(checkerContainer, true);
            }
        };
        
        
        this.statusLogger = new StatusLogger(ui.statusUI);
        
        // TODO: roll to see who starts. Assume BLACK.
        this.currentPlayer = Player.BLACK;
        this.logCurrentPlayer();
        
        this.dice.roll(this.currentPlayer);
        this.evaluateBoard();
    }
    
    private checkIfValidMovesRemain(): boolean {
        if (this.dice.die1.remainingUses == 0 && this.dice.die2.remainingUses == 0) {
            return false;
        }
        
        let isValidMove = (die: Die, pointId: number): boolean => {
            return (die.remainingUses > 0) && this.board.isLegalMove(this.currentPlayer, pointId, die.value);
        }
        for (let pointId = 1; pointId <= 25; pointId++) {
            if (isValidMove(this.dice.die1, pointId) || isValidMove(this.dice.die2, pointId)) {
                return true;
            }
        }

        this.statusLogger.logInfo('No valid moves remain!');
        return false;
    }
    
    private switchPlayerIfNoValidMovesRemain(): void {
        if (!this.checkIfValidMovesRemain()) {
            // if we're still here, 
            this.switchPlayer();
            this.dice.roll(this.currentPlayer);
            this.evaluateBoard();
            this.switchPlayerIfNoValidMovesRemain();
        }
    }
 
    static getOtherPlayer(player: Player): Player {
        return player === Player.BLACK ? Player.RED : Player.BLACK;
    }
        
    switchPlayer(): void {
        this.currentPlayer = (this.currentPlayer + 1) % 2;
        this.logCurrentPlayer();
    }
    
    evaluateBoard(): void {
        if (this.currentSelectedCheckerContainer != undefined) {
            for (let i = 1; i <= 24; i++) {
                if (i !== this.currentSelectedCheckerContainer.pointId) {
                    (<Point> this.board.checkerContainers[i]).setState(undefined);
                }
            }
            return;
        }
        
        {
            let bar = <Bar> this.board.checkerContainers[PointId.BAR];
            if (bar.checkers[this.currentPlayer] > 0) {
                let validMoveExists = false;
                if (this.dice.die1.remainingUses > 0) {
                    if (this.board.isLegalMove(this.currentPlayer, PointId.BAR, this.dice.die1.value)) {
                        validMoveExists = true;
                    }
                }
                if (this.dice.die2.remainingUses > 0) {
                    if (this.board.isLegalMove(this.currentPlayer, PointId.BAR, this.dice.die2.value)) {
                        validMoveExists = true;
                    }
                }
                if (validMoveExists) {
                    bar.setState(this.currentPlayer, PointState.VALID_SOURCE);
                }
                else {
                    bar.setState(this.currentPlayer, undefined);
                }
             }
             else {
                 bar.setState(this.currentPlayer, undefined);
             }
        }
        
        for (let i = 1; i <= 24; i++) {
            let point = <Point> this.board.checkerContainers[i];
            if (point.checkers[this.currentPlayer] > 0) {
                let validMoveExists = false;
                if (this.dice.die1.remainingUses > 0) {
                    if (this.board.isLegalMove(this.currentPlayer, i, this.dice.die1.value)) {
                        validMoveExists = true;
                    }
                }
                if (this.dice.die2.remainingUses > 0) {
                    if (this.board.isLegalMove(this.currentPlayer, i, this.dice.die2.value)) {
                        validMoveExists = true;
                    }
                }
                if (validMoveExists) {
                    point.setState(PointState.VALID_SOURCE);
                }
                else {
                    point.setState(undefined);
                }
             }
             else {
                 point.setState(undefined);
             }
        }
    }
    
    logCurrentPlayer(): void {
        this.statusLogger.logInfo(`${Player[this.currentPlayer]} to move`);
    }
}