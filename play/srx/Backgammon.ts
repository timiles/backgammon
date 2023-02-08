
 declare var $;

 class Backgammon {
    
    constructor(containerId: string, game: Game ) {
                
        let ui = new GameUI(containerId, game);
        game.board.initialise();

        // TODO: UI trigger game to begin
        game.dice.rollToStart(game.statusLogger, (successfulPlayer: PlayerId) => {
            game.begin(successfulPlayer);
        });
    }
}

 class Board {

    checkerContainers: Array<CheckerContainer>;

    onPointInspected: (pointId: number, on: boolean) => void;
    onPointSelected: (pointId: number) => void;

    onCheckerCountChanged: (pointId: number, playerId: PlayerId, count: number) => void;
    onSetBarAsSelected: (playerId: PlayerId, on: boolean) => void;
    onSetPointAsSelected: (pointId: number, on: boolean) => void;
    onSetHomeAsValidDestination: (playerId: PlayerId, on: boolean) => void;
    onSetPointAsValidDestination: (pointId: number, on: boolean) => void;
    onSetBarAsValidSource: (playerId: PlayerId, on: boolean) => void;
    onSetPointAsValidSource: (pointId: number, on: boolean) => void;

    constructor() {

        this.checkerContainers = new Array(26);

        let home = new Home();
        home.onIncrement = (playerId: PlayerId, count: number) => {
            if (this.onCheckerCountChanged) {
                this.onCheckerCountChanged(PointId.HOME, playerId, count);
            }
        };
        home.onSetValidDestination = (playerId: PlayerId, on: boolean) => {
            if (this.onSetHomeAsValidDestination) {
                this.onSetHomeAsValidDestination(playerId, on);
            }
        }
        this.checkerContainers[PointId.HOME] = home;

        let createPoint = (pointId: number): Point => {
            let point = new Point(pointId);
            point.onCheckerCountChanged = (playerId: PlayerId, count: number) => {
                if (this.onCheckerCountChanged) {
                    this.onCheckerCountChanged(pointId, playerId, count);
                }
            };
            point.onSetSelected = (on: boolean) => {
                if (this.onSetPointAsSelected) {
                    this.onSetPointAsSelected(pointId, on);
                }
            };
            point.onSetValidDestination = (on: boolean) => {
                if (this.onSetPointAsValidDestination) {
                    this.onSetPointAsValidDestination(pointId, on);
                }
            };
            point.onSetValidSource = (on: boolean) => {
                if (this.onSetPointAsValidSource) {
                    this.onSetPointAsValidSource(pointId, on);
                }
            };
            return point;
        }
        for (let i = 1; i < 25; i++) {
            this.checkerContainers[i] = createPoint(i);
        }


        let bar = new Bar();
        bar.onCheckerCountChanged = (playerId: PlayerId, count: number) => {
            if (this.onCheckerCountChanged) {
                this.onCheckerCountChanged(PointId.BAR, playerId, count);
            }
        }
        bar.onSetSelected = (playerId: PlayerId, on: boolean) => {
            if (this.onSetBarAsSelected) {
                this.onSetBarAsSelected(playerId, on);
            }
        }
        bar.onSetValidSource = (playerId: PlayerId, on: boolean) => {
            if (this.onSetBarAsValidSource) {
                this.onSetBarAsValidSource(playerId, on);
            }
        }
        this.checkerContainers[PointId.BAR] = bar;
    }

    initialise(layout?: number[][]): void {
        if (layout === undefined) {
            layout = [[0, 0],
                [2, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 5],
                [0, 0], [0, 3], [0, 0], [0, 0], [0, 0], [5, 0],
                [0, 5], [0, 0], [0, 0], [0, 0], [3, 0], [0, 0],
                [5, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 2],
                [0, 0]];
        }

        for (let pointId = 0; pointId < 26; pointId++) {
            for (let playerId of [PlayerId.BLACK, PlayerId.WHITE]) {
                let checkerCount = layout[pointId][playerId];
                if (checkerCount > 0) {
                    this.increment(playerId, pointId, checkerCount);
                }
            }
        }
    }

    decrement(player: PlayerId, pointId: number): void {
        this.checkerContainers[pointId].decrement(player);
    }

    increment(player: PlayerId, pointId: number, count?: number): void {
        this.checkerContainers[pointId].increment(player, count || 1);
    }

    isLegalMove(move: Move): boolean {

        // case: there is no counter to move: fail
        if (this.checkerContainers[move.sourcePointId].checkers[move.playerId] == 0) {
            // console.info('no counter at ' + sourcePointId);
            return false;
        }

        // case: there is a counter on the bar, and this is not it
        if ((move.sourcePointId != PointId.BAR) && (this.checkerContainers[PointId.BAR].checkers[move.playerId] > 0)) {
            // console.info('must move counter off bar first');
            return false;
        }

        // case: bearing off
        let destinationPointId = move.getDestinationPointId();
        if (destinationPointId === PointId.HOME) {
            // check that there are no checkers outside of home board. (BAR has already been checked above)
            const startingPointOfOuterBoard = (move.playerId === PlayerId.BLACK) ? 1 : 24;
            const totalPointsOfOuterBoard = 18;
            const direction = (move.playerId === PlayerId.BLACK) ? 1 : -1;
            for (let offset = 0; offset < totalPointsOfOuterBoard; offset++) {
                if (this.checkerContainers[startingPointOfOuterBoard + (direction * offset)].checkers[move.playerId] > 0) {
                    return false;
                }
            }

            // check that there are no checkers more deserving of this dice roll
            let actualDestinationPointId = move.sourcePointId + (direction * move.numberOfPointsToMove);
            // if it's dead on, we're fine.
            if (actualDestinationPointId === 0 || actualDestinationPointId === 25) {
                return true;
            }

            const startingPointOfHomeBoard = (move.playerId === PlayerId.BLACK) ? 18 : 6;
            for (let homeBoardPointId = startingPointOfHomeBoard; homeBoardPointId !== move.sourcePointId; homeBoardPointId += direction) {
                if (this.checkerContainers[homeBoardPointId].checkers[move.playerId] > 0) {
                    // if we find a checker on a further out point, sourcePointId is not valid
                    return false;
                }
            }
            return true;
        }

        let otherPlayerId = Game.getOtherPlayerId(move.playerId);

        // case: there is a counter, but opponent blocks the end pip
        if (this.checkerContainers[destinationPointId].checkers[otherPlayerId] >= 2) {
            // console.info('point is blocked');
            return false;
        }

        return true;
    }

    move(move: Move): boolean {
        if (!this.isLegalMove(move)) {
            return false;
        }
        let destinationPointId = move.getDestinationPointId();
        let otherPlayerId = Game.getOtherPlayerId(move.playerId);
        if (destinationPointId !== PointId.HOME &&
            this.checkerContainers[destinationPointId].checkers[otherPlayerId] == 1) {
            this.decrement(otherPlayerId, destinationPointId);
            this.increment(otherPlayerId, PointId.BAR);
        }
        this.decrement(move.playerId, move.sourcePointId);
        this.increment(move.playerId, destinationPointId);
        return true;
    }

    checkIfValidDestination(move: Move): void {
        if (this.isLegalMove(move)) {
            let destinationPointId = move.getDestinationPointId();
            if (destinationPointId === PointId.HOME) {
                (<Home>this.checkerContainers[PointId.HOME]).setValidDestination(move.playerId, true);
            }
            else {
                (<Point>this.checkerContainers[destinationPointId]).setValidDestination(true);
            }
        }
    }

    removeAllHighlights(): void {
        for (let pointId = 1; pointId <= 24; pointId++) {
            (<Point>this.checkerContainers[pointId]).setValidDestination(false);
        }
        (<Home>this.checkerContainers[PointId.HOME]).setValidDestination(PlayerId.BLACK, false);
        (<Home>this.checkerContainers[PointId.HOME]).setValidDestination(PlayerId.WHITE, false);
    }
}
 class Game {

    board: Board;
    dice: Dice;
    statusLogger: StatusLogger;

    currentPlayerId: PlayerId;
    players: Player[];
    currentSelectedCheckerContainer: CheckerContainer;

    constructor(board: Board, dice: Dice, statusLogger: StatusLogger, isComputerPlayer = [false, false]) {

        this.board = board;
        this.dice = dice;
        this.statusLogger = statusLogger;
        console.warn(this.board);
        this.players = new Array<Player>(2);
        for (let playerId of [PlayerId.BLACK, PlayerId.WHITE]) {
            this.players[playerId] = (isComputerPlayer[playerId]) ? new ComputerPlayer(playerId, this.board) : new HumanPlayer(playerId, this.board);
        }

        this.board.onPointInspected = (pointId: number, on: boolean) => {
            if (this.currentSelectedCheckerContainer != undefined) {
                // if we're halfway a move, don't check
                return;
            }

            if (!on) {
                this.board.removeAllHighlights();
                return;
            }

            let checkerContainer = this.board.checkerContainers[pointId];
            if (!(checkerContainer instanceof Home) && (checkerContainer.checkers[this.currentPlayerId] > 0)) {
                for (let die of [this.dice.die1, this.dice.die2]) {
                    if (die.remainingUses > 0) {
                        this.board.checkIfValidDestination(new Move(this.currentPlayerId, checkerContainer.pointId, die.value));
                    }
                }
            }
        };

        this.board.onPointSelected = (pointId: number) => {
            //alert(pointId);
            let checkerContainer = this.board.checkerContainers[pointId];
            if (this.currentSelectedCheckerContainer == undefined) {
                if (checkerContainer.checkers[this.currentPlayerId] == 0) {
                    // if no pieces here, exit
                    return;
                }

                let canUseDie = (die: Die): boolean => {
                    let move = new Move(this.currentPlayerId, checkerContainer.pointId, die.value);
                    return (die.remainingUses > 0 && this.board.isLegalMove(move));
                }

                let canBearOff = (die: Die): boolean => {
                    let move = new Move(this.currentPlayerId, checkerContainer.pointId, die.value);
                    return (die.remainingUses > 0 &&
                        move.getDestinationPointId() === PointId.HOME &&
                        this.board.isLegalMove(move));
                }

                let canUseDie1 = canUseDie(this.dice.die1);
                let canUseDie2 = canUseDie(this.dice.die2);

                // if can use one die but not the other, or if it's doubles, or if both bear off home, just play it
                if ((canUseDie1 != canUseDie2) ||
                    (this.dice.die1.value === this.dice.die2.value) ||
                    (canBearOff(this.dice.die1) && canBearOff(this.dice.die2))) {
                    
                    if (canUseDie1) {
                        this.board.move(new Move(this.currentPlayerId, checkerContainer.pointId, this.dice.die1.value));
                        this.dice.die1.decrementRemainingUses();
                        this.evaluateBoard();
                    }
                    else if (canUseDie2) {
                        this.board.move(new Move(this.currentPlayerId, checkerContainer.pointId, this.dice.die2.value));
                        this.dice.die2.decrementRemainingUses();
                        this.evaluateBoard();
                    }

                    this.switchPlayerIfNoValidMovesRemain();

                    // reinspect point
                    if (this.board.onPointInspected) {
                        this.board.onPointInspected(checkerContainer.pointId, false);
                        this.board.onPointInspected(checkerContainer.pointId, true);
                    }
                }
                else if (canUseDie1 || canUseDie2) {
                    if (checkerContainer instanceof Point) {
                        (<Point>checkerContainer).setSelected(true);
                    }
                    else if (checkerContainer instanceof Bar) {
                        (<Bar>checkerContainer).setSelected(this.currentPlayerId, true);
                    }
                    this.currentSelectedCheckerContainer = checkerContainer;
                    this.evaluateBoard();
                }
                // otherwise there was a legal move but this wasn't it
            }
            else if (checkerContainer.pointId === this.currentSelectedCheckerContainer.pointId) {
                if (this.currentSelectedCheckerContainer instanceof Point) {
                    (<Point>this.currentSelectedCheckerContainer).setSelected(false);
                }
                this.currentSelectedCheckerContainer = undefined;
                this.evaluateBoard();
            }
            else {

                let useDieIfPossible = (die: Die): boolean => {
                    let move = new Move(this.currentPlayerId, this.currentSelectedCheckerContainer.pointId, die.value);
                    let destinationPointId = move.getDestinationPointId();
                    if (destinationPointId !== checkerContainer.pointId) {
                        return false;
                    }

                    this.board.move(move);
                    die.decrementRemainingUses();
                    if (this.currentSelectedCheckerContainer instanceof Point) {
                        (<Point>this.currentSelectedCheckerContainer).setSelected(false);
                    }
                    this.currentSelectedCheckerContainer = undefined;
                    this.evaluateBoard();
                    return true;
                }

                // use lazy evaluation so that max one die gets used
                useDieIfPossible(this.dice.die1) || useDieIfPossible(this.dice.die2);

                this.switchPlayerIfNoValidMovesRemain();

                // reinspect point
                if (this.board.onPointInspected) {
                    this.board.onPointInspected(checkerContainer.pointId, false);
                    this.board.onPointInspected(checkerContainer.pointId, true);
                }
            }
        };
    }

    begin(startingPlayerId: PlayerId): void {
        this.currentPlayerId = startingPlayerId;
        this.logCurrentPlayer();
        this.evaluateBoard();
        this.switchPlayerIfNoValidMovesRemain();
    }

    private checkIfValidMovesRemain(): boolean {
        if (this.dice.die1.remainingUses == 0 && this.dice.die2.remainingUses == 0) {
            return false;
        }

        let isValidMove = (die: Die, pointId: number): boolean => {
            return (die.remainingUses > 0) && this.board.isLegalMove(new Move(this.currentPlayerId, pointId, die.value));
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
        if (this.board.checkerContainers[PointId.HOME].checkers[this.currentPlayerId] === 15) {
            this.statusLogger.logInfo(`${PlayerId[this.currentPlayerId]} WINS!`);
            return;
        }
        if (!this.checkIfValidMovesRemain()) {
            // if we're still here, 
            this.switchPlayer();
            this.dice.roll(this.currentPlayerId);
            this.evaluateBoard();
            this.switchPlayerIfNoValidMovesRemain();
            return;
        }

        if (this.players[this.currentPlayerId] instanceof ComputerPlayer) {
            let computerPlayer = <ComputerPlayer>this.players[this.currentPlayerId];
            let bestPossibleGo = computerPlayer.getBestPossibleGo(this.dice.die1.value, this.dice.die2.value);
            if (bestPossibleGo) {
                for (let moveNumber = 0; moveNumber < bestPossibleGo.moves.length; moveNumber++) {
                    let move = bestPossibleGo.moves[moveNumber];
                    this.board.move(move);
                }
            }
            setTimeout(() => {
                this.switchPlayer();
                this.dice.roll(this.currentPlayerId);
                this.evaluateBoard();
                this.switchPlayerIfNoValidMovesRemain();
            }, 500);
        }
    }

    static getOtherPlayerId(player: PlayerId): PlayerId {
        return player === PlayerId.BLACK ? PlayerId.WHITE : PlayerId.BLACK;
    }

    switchPlayer(): void {
        this.currentPlayerId = (this.currentPlayerId + 1) % 2;
        this.logCurrentPlayer();
    }

    evaluateBoard(): void {
        if (this.currentSelectedCheckerContainer != undefined) {
            for (let i = 1; i <= 24; i++) {
                if (i !== this.currentSelectedCheckerContainer.pointId) {
                    (<Point>this.board.checkerContainers[i]).setValidSource(false);
                }
            }
            return;
        }

        let isValidSource = (pointId: number): boolean => {
            if (this.board.checkerContainers[pointId].checkers[this.currentPlayerId] > 0) {
                for (let die of [this.dice.die1, this.dice.die2]) {
                    if ((die.remainingUses > 0) &&
                        (this.board.isLegalMove(new Move(this.currentPlayerId, pointId, die.value)))) {
                        return true;
                    }
                }
            }
            return false;
        };

        (<Bar>this.board.checkerContainers[PointId.BAR]).setValidSource(this.currentPlayerId, isValidSource(PointId.BAR));
        for (let i = 1; i <= 24; i++) {
            (<Point>this.board.checkerContainers[i]).setValidSource(isValidSource(i));
        }
    }

    logCurrentPlayer(): void {
        this.statusLogger.logInfo(`${PlayerId[this.currentPlayerId]} to move`);
    }
}
 class Move {

    constructor(public playerId: PlayerId, public sourcePointId: number, public numberOfPointsToMove: number) {
    }

    getDestinationPointId(): number {
        switch (this.playerId) {
            case PlayerId.BLACK: {
                if (this.sourcePointId === PointId.BAR) {
                    return this.numberOfPointsToMove;
                }

                let destinationPointId = this.sourcePointId + this.numberOfPointsToMove;
                if (destinationPointId > 24) {
                    // bearing off
                    return PointId.HOME;
                }
                return destinationPointId;
            }
            case PlayerId.WHITE: {
                if (this.sourcePointId === PointId.BAR) {
                    return PointId.BAR - this.numberOfPointsToMove;
                }

                let destinationPointId = this.sourcePointId - this.numberOfPointsToMove;
                if (destinationPointId < 1) {
                    // bearing off
                    return PointId.HOME;
                }
                return destinationPointId;
            }
            default: throw `Unknown playerId: ${this.playerId}`;
        }
    }
}

 class CheckerContainer {
    
    pointId: number
    checkers: Array<number>;
    
    constructor(pointId: number) {
        this.pointId = pointId;
        this.checkers = [0, 0];
    }
    
    decrement(player: PlayerId): void {
        this.checkers[player]--;
    }
    
    increment(player: PlayerId, count: number): void {
        this.checkers[player] += count;
    }
}
 class Bar extends CheckerContainer {
    
    onCheckerCountChanged: (PlayerId, number) => void;
    onDecrement: (PlayerId, number) => void;
    onSetSelected: (PlayerId, boolean) => void;
    onSetValidSource: (PlayerId, boolean) => void;

    constructor() {
        super(PointId.BAR);
    }
    
    decrement(playerId: PlayerId): void {
        super.decrement(playerId);
        if (this.onCheckerCountChanged) {
            this.onCheckerCountChanged(playerId, this.checkers[playerId]);
        }
    }
    
    increment(playerId: PlayerId, count: number): void {
        super.increment(playerId, count);
        if (this.onCheckerCountChanged) {
            this.onCheckerCountChanged(playerId, this.checkers[playerId]);
        }
    }
    
    setSelected(playerId: PlayerId, on: boolean) {
        if (this.onSetSelected) {
            this.onSetSelected(playerId, on);
        }
    }
    
    setValidSource(playerId: PlayerId, on: boolean) {
        if (this.onSetValidSource) {
            this.onSetValidSource(playerId, on);
        }
    }
}
 class Home extends CheckerContainer {

    onIncrement: (PlayerId, number) => void;
    onSetValidDestination: (PlayerId, boolean) => void;

    constructor() {
        super(PointId.HOME);
    }

    increment(playerId: PlayerId): void {
        super.increment(playerId, 1);
        if (this.onIncrement) {
            this.onIncrement(playerId, this.checkers[playerId]);
        }
    }

    setValidDestination(playerId: PlayerId, on: boolean) {
        if (this.onSetValidDestination) {
            this.onSetValidDestination(playerId, on);
        }
    }
}
 class Point extends CheckerContainer {

    onCheckerCountChanged: (PlayerId, number) => void;
    onSetSelected: (boolean) => void;
    onSetValidDestination: (boolean) => void;
    onSetValidSource: (boolean) => void;

    constructor(pointId: number) {
        super(pointId);
    }

    decrement(playerId: PlayerId): void {
        super.decrement(playerId);
        if (this.onCheckerCountChanged) {
            this.onCheckerCountChanged(playerId, this.checkers[playerId]);
        }
    }

    increment(playerId: PlayerId, count: number): void {
        super.increment(playerId, count);
        if (this.onCheckerCountChanged) {
            this.onCheckerCountChanged(playerId, this.checkers[playerId]);
        }
    }

    setValidDestination(on: boolean) {
        if (this.onSetValidDestination) {
            this.onSetValidDestination(on);
        }
    }

    setValidSource(on: boolean) {
        if (this.onSetValidSource) {
            this.onSetValidSource(on);
        }
    }

    setSelected(on: boolean) {
        if (this.onSetSelected) {
            this.onSetSelected(on);
        }
    }
}

 class Dice {

    diceRollGenerator: CanGenerateDiceRoll;
    die1: Die;
    die2: Die;
    dieNext1: Die;
    dieNext2: Die;
    remote: any;

    onSetStartingDiceRoll: (playerId: PlayerId, die: Die) => void;
    onSetDiceRolls: (playerId: PlayerId, die1: Die, die2: Die) => void;
    onSetActive: (playerId: PlayerId, active: boolean) => void;

    constructor(diceRollGenerator: CanGenerateDiceRoll, remote: any) {
        this.diceRollGenerator = diceRollGenerator;
        this.remote = remote;
    }

    nextDices(d1,d2){
        this.dieNext1 = new Die(d1);
        this.dieNext2 = new Die(d2);
    }
    rollToStart(statusLogger: StatusLogger, onSuccess: (successfulPlayerId: PlayerId) => void) {

        let die1 = new Die(this.diceRollGenerator.generateDiceRoll());
        let die2 = new Die(this.diceRollGenerator.generateDiceRoll());
        
        if(this.remote.is){
        die1.value = this.remote.blackstart;
        die2.value = this.remote.whitestart;

        }

        if(die1.value == die2.value){
            die1.value == 6?die2.value=1:die2.value=die1.value+1;
        }

        
        if (this.onSetStartingDiceRoll) {
            this.onSetStartingDiceRoll(PlayerId.BLACK, die1);
            this.onSetStartingDiceRoll(PlayerId.WHITE, die2);
        }

        statusLogger.logInfo(`BLACK rolls ${die1.value}`);
        statusLogger.logInfo(`WHITE rolls ${die2.value}`);

        if (die1.value === die2.value) {
            statusLogger.logInfo('DRAW! Roll again');
            setTimeout(() => { this.rollToStart(statusLogger, onSuccess); }, 1000);
        }
        else {
            let successfulPlayerId = die1.value > die2.value ? PlayerId.BLACK : PlayerId.WHITE;
            statusLogger.logInfo(`${PlayerId[successfulPlayerId]} wins the starting roll`);
            setTimeout(() => {
                this.die1 = die1;
                this.die2 = die2;
                if (this.onSetDiceRolls) {
                    this.onSetDiceRolls(successfulPlayerId, die1, die2);
                }
                if (this.onSetActive) {
                    this.onSetActive(successfulPlayerId, true);
                }
                onSuccess(successfulPlayerId);
            }, 1000);
        }
    }

    roll(playerId: PlayerId): void {
        
        if(!this.remote.is){
            this.die1 = new Die(this.diceRollGenerator.generateDiceRoll());
            this.die2 = new Die(this.diceRollGenerator.generateDiceRoll());
        }else{

            this.die1 = this.dieNext1;
            this.die2 = this.dieNext2;
        }

        let isDouble = (this.die1.value === this.die2.value);

       // console.log(this.die1.remainingUses);
       // console.log(this.die2.remainingUses);

        if (isDouble) {
            this.die1.remainingUses = 2;
            this.die2.remainingUses = 2;
        }

        if (this.onSetDiceRolls) {
            this.onSetDiceRolls(playerId, this.die1, this.die2);
        }
        if (this.onSetActive) {
            this.onSetActive(playerId, true);
            let otherPlayerId = playerId === PlayerId.BLACK ? PlayerId.WHITE : PlayerId.BLACK;
            this.onSetActive(otherPlayerId, false);
        }
    }

}

 class Die {
    value: number;
    remainingUses: number;
    onChange: (d: Die) => void;
    
    constructor(value: number) {
        this.value = value;
        this.remainingUses = 1;
    }
    
    decrementRemainingUses(): void {
        this.remainingUses--;
        if (this.onChange) {
            this.onChange(this);
        }
    }
}
 interface CanGenerateDiceRoll {
    generateDiceRoll(): number;
}

 class DiceRollGenerator implements CanGenerateDiceRoll {
    
    generateDiceRoll(): number {
        return Math.floor(Math.random() * 6) + 1;        
    }
}
 enum PlayerId { BLACK, WHITE }
 enum PointId { HOME = 0, BAR = 25 }

 class StatusLogger {
    
    onLogInfo: (info: string) => void;
    
    logInfo(info: string) {
        if (this.onLogInfo) {
            this.onLogInfo(info);
        } 
    }
}


class BoardUI {
    
    containerDiv: HTMLDivElement;
    blackHomeUI: HomeUI;
    whiteHomeUI: HomeUI;
    pointUIs: Array<PointUI>;
    blackBarUI: BarUI;
    whiteBarUI: BarUI;
    
    constructor(gameContainerId: string) {
        
        this.containerDiv = document.createElement('div');
        Utils.removeAllChildren(this.containerDiv);
        this.containerDiv.className = 'board';
        
        this.blackHomeUI = new HomeUI(PlayerId.BLACK);
        this.blackHomeUI.containerDiv.id = `${gameContainerId}_blackhome`;
        this.whiteHomeUI = new HomeUI(PlayerId.WHITE);
        this.whiteHomeUI.containerDiv.id = `${gameContainerId}_whitehome`;
        
        this.pointUIs = new Array<PointUI>(24);
        for (let i = 0; i < this.pointUIs.length; i++) {
            let colour = (i % 2 == 0) ? 'black' : 'white';
            let isTopSide = i >= 12;
            this.pointUIs[i] = new PointUI(colour, isTopSide);
            this.pointUIs[i].containerDiv.id = `${gameContainerId}_point${i + 1}`;
        }
        
        this.blackBarUI = new BarUI(PlayerId.BLACK);
        this.whiteBarUI = new BarUI(PlayerId.WHITE);

        // append all elements in the correct order
        this.containerDiv.appendChild(this.pointUIs[12].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[13].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[14].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[15].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[16].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[17].containerDiv);
        this.containerDiv.appendChild(this.whiteBarUI.containerDiv);
        this.containerDiv.appendChild(this.pointUIs[18].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[19].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[20].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[21].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[22].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[23].containerDiv);
        this.containerDiv.appendChild(this.blackHomeUI.containerDiv);
        this.containerDiv.appendChild(BoardUI.createClearBreak());
        this.containerDiv.appendChild(this.pointUIs[11].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[10].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[9].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[8].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[7].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[6].containerDiv);
        this.containerDiv.appendChild(this.blackBarUI.containerDiv);
        this.containerDiv.appendChild(this.pointUIs[5].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[4].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[3].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[2].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[1].containerDiv);
        this.containerDiv.appendChild(this.pointUIs[0].containerDiv);
        this.containerDiv.appendChild(this.whiteHomeUI.containerDiv);
        this.containerDiv.appendChild(BoardUI.createClearBreak());
    }
    
    private static createClearBreak() {
        let br = document.createElement('br');
        br.className = 'clear';
        return br;
    }
}
class CheckerContainerUI {

    containerDiv: HTMLDivElement;
    onSelected: () => void;

    constructor(containerType: string, isTopSide: boolean) {
        this.containerDiv = document.createElement('div');
        let side = (isTopSide ? 'top' : 'bottom');
        this.containerDiv.className = `checker-container checker-container-${side} ${containerType}`;

        this.containerDiv.onclick = () => { this.onSelected(); };
    }

    setCheckers(player: PlayerId, count: number) {
        Utils.removeAllChildren(this.containerDiv);

        let $containerDiv = $(this.containerDiv);
        let className = PlayerId[player].toLowerCase();
        for (let i = 1; i <= count; i++) {
            if (i > 5) {
                $('.checker-total', $containerDiv).text(count);
            } else if (i == 5) {
                $containerDiv.append($('<div class="checker checker-total">').addClass(className));
            } else {
                $containerDiv.append($('<div class="checker">').addClass(className));
            }
        }
    }

    setSelected(on: boolean): void {
        $(this.containerDiv).toggleClass('selected', on);
    }

    setValidSource(on: boolean): void {
        $(this.containerDiv).toggleClass('valid-source', on);
    }

    setValidDestination(on: boolean): void {
        $(this.containerDiv).toggleClass('valid-destination', on);
    }
}
 class BarUI extends CheckerContainerUI {

    onInspected: (on: boolean) => void;

    constructor(player: PlayerId) {
        super('bar', player === PlayerId.WHITE);

        this.containerDiv.onmouseover = () => { this.onInspected(true); };
        this.containerDiv.onmouseout = () => { this.onInspected(false); };
    }
}

 class DiceUI {
    
    containerDiv: HTMLDivElement;
    die1: Die;
    die2: Die;
    
    constructor(player: PlayerId) {        
        this.containerDiv = document.createElement('div');
        this.containerDiv.className = `dice-container dice-container-${PlayerId[player].toLowerCase()}`;
    }
    
    setStartingDiceRoll(die: Die) {
        Utils.removeAllChildren(this.containerDiv);
        this.containerDiv.appendChild(DiceUI.createDie(die));
    }
    
    setDiceRolls(die1: Die, die2: Die) {
        this.die1 = die1;
        this.die1.onChange = () => { this.redraw(); };
        this.die2 = die2;
        this.die2.onChange = () => { this.redraw(); };
        
        this.redraw();
    }
    
    setActive(active: boolean) {
        if (active) {
            $(this.containerDiv).addClass('active');
        }
        else {
            $(this.containerDiv).removeClass('active');            
        }
    }
    
    private redraw(): void {
        Utils.removeAllChildren(this.containerDiv);
        this.containerDiv.appendChild(DiceUI.createDie(this.die1));
        this.containerDiv.appendChild(DiceUI.createDie(this.die2));
    }
    
    private static createDie(die: Die): HTMLDivElement {
        let div = document.createElement('div');
        div.className = 'die die-uses-' + die.remainingUses + ' dice-'+die.value;
        div.innerText = die.value.toString();
        return div;
    }
}
 class EventBinders {
    static bindGame(game: Game, gameUI: GameUI): void {
        EventBinders.bindBoardEvents(game.board, gameUI.boardUI);
        EventBinders.bindDiceEvents(game.dice, gameUI.blackDiceUI, gameUI.whiteDiceUI);
        EventBinders.bindStatusLoggerEvents(game.statusLogger, gameUI.statusUI);
    }

    private static bindBoardEvents(board: Board, boardUI: BoardUI) {
        // helpers
        let getBarUI = (playerId: PlayerId): BarUI => {
            return (playerId === PlayerId.BLACK) ? boardUI.blackBarUI : boardUI.whiteBarUI;
        }
        let getHomeUI = (playerId: PlayerId): HomeUI => {
            return (playerId === PlayerId.BLACK) ? boardUI.blackHomeUI : boardUI.whiteHomeUI;
        }

        // wire up UI events
        boardUI.blackHomeUI.onSelected = () => board.onPointSelected(PointId.HOME);
        boardUI.whiteHomeUI.onSelected = () => board.onPointSelected(PointId.HOME);
        boardUI.blackBarUI.onInspected = (on: boolean) => board.onPointInspected(PointId.BAR, on);
        boardUI.blackBarUI.onSelected = () => board.onPointSelected(PointId.BAR);
        boardUI.whiteBarUI.onInspected = (on: boolean) => board.onPointInspected(PointId.BAR, on);
        boardUI.whiteBarUI.onSelected = () => board.onPointSelected(PointId.BAR);

        let bindPointUIEvents = (pointId: number): void => {
            let pointUI = boardUI.pointUIs[pointId - 1];
            pointUI.onInspected = (on: boolean) => { board.onPointInspected(pointId, on); };
            pointUI.onSelected = () => { board.onPointSelected(pointId); };
        }
        for (let i = 1; i < 25; i++) {
            bindPointUIEvents(i);
        }

        board.onCheckerCountChanged = (pointId: number, playerId: PlayerId, count: number) => {
            switch (pointId) {
                case PointId.HOME: {
                    getHomeUI(playerId).setCheckers(playerId, count);
                    break;
                }
                case PointId.BAR: {
                    getBarUI(playerId).setCheckers(playerId, count);
                    break;
                }
                default: {
                    boardUI.pointUIs[pointId - 1].setCheckers(playerId, count);
                }
            }
        };
        board.onSetBarAsSelected = (playerId: PlayerId, on: boolean) => {
            getBarUI(playerId).setSelected(on);
        };
        board.onSetPointAsSelected = (pointId: number, on: boolean) => {
            boardUI.pointUIs[pointId - 1].setSelected(on);
        };
        board.onSetHomeAsValidDestination = (playerId: PlayerId, on: boolean) => {
            getHomeUI(playerId).setValidDestination(on);
        };
        board.onSetPointAsValidDestination = (pointId: number, on: boolean) => {
            boardUI.pointUIs[pointId - 1].setValidDestination(on);
        };
        board.onSetBarAsValidSource = (playerId: PlayerId, on: boolean) => {
            getBarUI(playerId).setValidSource(on);
        };
        board.onSetPointAsValidSource = (pointId: number, on: boolean) => {
            boardUI.pointUIs[pointId - 1].setValidSource(on);
        };
    }

    private static bindDiceEvents(dice: Dice, blackDiceUI: DiceUI, whiteDiceUI: DiceUI) {
        let getDiceUI = (playerId: PlayerId): DiceUI => {
            switch (playerId) {
                case PlayerId.BLACK: return blackDiceUI;
                case PlayerId.WHITE: return whiteDiceUI;
                default: throw `Unknown PlayerId: ${playerId}`;
            }
        }

        dice.onSetStartingDiceRoll = (playerId, die) => { getDiceUI(playerId).setStartingDiceRoll(die); };
        dice.onSetDiceRolls = (playerId, die1, die2) => { getDiceUI(playerId).setDiceRolls(die1, die2); };
        dice.onSetActive = (playerId, active) => { getDiceUI(playerId).setActive(active); };
    }

    private static bindStatusLoggerEvents(statusLogger: StatusLogger, statusUI: StatusUI) {
        statusLogger.onLogInfo = (info) => { statusUI.setStatus(info); };
    }
}
 class GameUI {

    boardUI: BoardUI;
    blackDiceUI: DiceUI;
    whiteDiceUI: DiceUI;
    statusUI: StatusUI;

    constructor(containerElementId: string, game: Game) {
        let container = document.getElementById(containerElementId);
        container.className = 'game-container';
        Utils.removeAllChildren(container);

        this.boardUI = new BoardUI(containerElementId);
        this.blackDiceUI = new DiceUI(PlayerId.BLACK);
        this.whiteDiceUI = new DiceUI(PlayerId.WHITE);
        this.statusUI = new StatusUI();

        container.appendChild(this.boardUI.containerDiv);
        let sideContainer = document.createElement('div');
        sideContainer.className = 'side-container';
        let dicesContainer = document.createElement('div');
        dicesContainer.className = 'dices-container';
        dicesContainer.appendChild(this.blackDiceUI.containerDiv);
        dicesContainer.appendChild(this.whiteDiceUI.containerDiv);
        sideContainer.appendChild(dicesContainer);
        sideContainer.appendChild(this.statusUI.containerDiv);
        container.appendChild(sideContainer);

        EventBinders.bindGame(game, this);
    }
}
class HomeUI extends CheckerContainerUI {
    
    constructor(player: PlayerId) {
        super('home', player === PlayerId.BLACK);
    }   
}
class PointUI extends CheckerContainerUI {
    
    onInspected: (on: boolean) => void;
    
    constructor(colour: string, isTopSide: boolean) {
        super(`point-${colour}`, isTopSide);

        this.containerDiv.onmouseover = () => { this.onInspected(true); };
        this.containerDiv.onmouseout = () => { this.onInspected(false); };
    }
}
class StatusUI {
    
    containerDiv: HTMLDivElement;
    constructor() {
        this.containerDiv = document.createElement('div');
        this.containerDiv.className = 'status-container';
    }
    
    setStatus(s: string) {
        let statusP = document.createElement('p');
        statusP.innerText = s;
        this.containerDiv.appendChild(statusP);
        this.containerDiv.scrollTop = this.containerDiv.scrollHeight;
        Utils.highlight(statusP);
    }
}
class Utils {
    static removeAllChildren(element: HTMLElement): void {
        // fastest way to remove all child nodes: http://stackoverflow.com/a/3955238/487544
        while (element.lastChild) {
            element.removeChild(element.lastChild);
        }
    }
        
    static highlight(el: HTMLElement) {
        $(el).addClass('highlight');
        // timeout purely to allow ui to update
        setTimeout(function() {
            $(el).addClass('highlight-end');
        }, 0);
    }
}

class Player {
    constructor(public playerId: PlayerId, public board: Board) {
    }
}
 class ComputerPlayer extends Player {

    private safetyFactor: number;
    private clusteringFactor: number;
    private offensiveFactor: number;
    private reentryFactor: number;

    constructor(playerId: PlayerId, board: Board) {
        super(playerId, board);

        this.safetyFactor = 1;
        this.clusteringFactor = 1;
        this.offensiveFactor = 1;
        this.reentryFactor = 1;
    }

    public getBestPossibleGo(die1Value: number, die2Value: number): PossibleGo {
        let possibleGoes = BoardAnalyser.getPossibleGoes(this.board, this.playerId, die1Value, die2Value);

        if (possibleGoes.length === 0) {
            console.info('No possible go');
            return null;
        }

        let maxScore = 0;
        let bestPossibleGo: PossibleGo;
        for (let i = 0; i < possibleGoes.length; i++) {
            let score = this.evaluateBoard(possibleGoes[i].resultingBoard);
            // greater than or equal: bias towards further on moves
            if (score >= maxScore) {
                maxScore = score;
                bestPossibleGo = possibleGoes[i];
            }
        }
        return bestPossibleGo;
    }

    private evaluateBoard(resultingBoard: Board): number {
        return this.evaluateSafety(resultingBoard) * this.safetyFactor +
            this.evaluateClustering(resultingBoard) * this.clusteringFactor +
            this.evaluateOffensive(resultingBoard) * this.offensiveFactor;
    }

    // return score of how safe the checkers are.
    private evaluateSafety(resultingBoard: Board): number {
        // if the game is a race, safety is irrelevant
        if (BoardAnalyser.isRace(this.board)) {
            return 0;
        }

        let score = 100;
        let direction = (this.playerId === PlayerId.BLACK) ? 1 : -1;
        let homePointId = (this.playerId === PlayerId.BLACK) ? 25 : 0;

        for (let pointId = 1; pointId <= 24; pointId++) {
            if (resultingBoard.checkerContainers[pointId].checkers[this.playerId] === 1) {
                // TODO: factor safety on prob of opp hitting this piece
                let distanceOfBlotToHome = (homePointId - pointId) * direction;
                let relativePenaltyOfLosingThisBlot = distanceOfBlotToHome / 24; 
                score *= (.75 * relativePenaltyOfLosingThisBlot);
            }
        }

        return score;
    }

    // return score of how clustered the towers are.
    private evaluateClustering(resultingBoard: Board): number {
        let score = 0;
        // number of towers
        // proximity of towers

        return score;
    }

    // offensive: putting opponent onto bar
    private evaluateOffensive(resultingBoard: Board): number {
        let otherPlayerId = (this.playerId + 1) % 2;

        switch (resultingBoard.checkerContainers[PointId.BAR].checkers[otherPlayerId]) {
            case 0: return 0;
            case 1: return 65;
            default: return 100;
        }
    }

}
 class HumanPlayer extends Player {

}
 class BoardAnalyser {

    static isRace(board: Board): boolean {
        let playerId = 0;

        for (let pointId = 1; pointId <= 24; pointId++) {
            if (board.checkerContainers[pointId].checkers[playerId] > 0) {
                if (playerId === 0) {
                    // once we've found a checker of one player, switch and we'll look for the other
                    playerId++;
                }
                else {
                    return false;
                }
            }
        }

        return true;
    }

    static getPossibleGoes(board: Board, playerId: PlayerId, die1Value: number, die2Value: number): Array<PossibleGo> {
        let possibleGoes = new Array<PossibleGo>();

        // 1. double number thrown.
        if (die1Value === die2Value) {
            let points = die1Value;

            let testBoard = new Array<Board>(4);
            let numOfMoves = 0;

            // 25: include bar
            for (let i1 = 1; i1 <= 25; i1++) {
                testBoard[0] = BoardAnalyser.clone(board);

                let move1 = new Move(playerId, i1, points);
                if (!testBoard[0].move(move1)) {
                    continue;
                }

                possibleGoes.push(new PossibleGo([move1], testBoard[0]));

                for (let i2 = 1; i2 <= 25; i2++) {
                    testBoard[1] = BoardAnalyser.clone(testBoard[0]);

                    let move2 = new Move(playerId, i2, points);
                    if (!testBoard[1].move(move2)) {
                        continue;
                    }

                    possibleGoes.push(new PossibleGo([move1, move2], testBoard[1]));

                    for (let i3 = 1; i3 <= 25; i3++) {
                        testBoard[2] = BoardAnalyser.clone(testBoard[1]);

                        let move3 = new Move(playerId, i3, points);
                        if (!testBoard[2].move(move3)) {
                            continue;
                        }

                        possibleGoes.push(new PossibleGo([move1, move2, move3], testBoard[2]));

                        for (let i4 = 1; i4 <= 25; i4++) {
                            testBoard[3] = BoardAnalyser.clone(testBoard[2]);

                            let move4 = new Move(playerId, i4, points);
                            if (testBoard[3].move(move4)) {
                                possibleGoes.push(new PossibleGo([move1, move2, move3, move4], testBoard[3]));
                            }
                        }
                    }
                }
            }
            return BoardAnalyser.getPossibleGoesThatUseMostDice(possibleGoes);
        }

        // 2. non-double thrown.
        let points = [die1Value, die2Value];

        for (let startPoint1 = 1; startPoint1 <= 25; startPoint1++) {
            for (let die = 0; die < 2; die++) {
                let testBoard1 = BoardAnalyser.clone(board);

                let move1 = new Move(playerId, startPoint1, points[die]);
                if (testBoard1.move(move1)) {
                    if (!BoardAnalyser.canMove(testBoard1, playerId, points[(die + 1) % 2])) {
                        possibleGoes.push(new PossibleGo([move1], BoardAnalyser.clone(testBoard1)));
                        continue;
                    }
                    // else 
                    for (let startPoint2 = 1; startPoint2 <= 25; startPoint2++) {
                        let testBoard2 = BoardAnalyser.clone(testBoard1);

                        let move2 = new Move(playerId, startPoint2, points[(die + 1) % 2]);
                        if (testBoard2.move(move2)) {
                            possibleGoes.push(new PossibleGo([move1, move2], BoardAnalyser.clone(testBoard2)));
                            continue;
                        }
                    }
                }
            }
        }
        return BoardAnalyser.getPossibleGoesThatUseMostDice(possibleGoes);
    }

    private static clone(source: Board): Board {
        var clone = new Board();
        let layout = new Array<number[]>();
        for (let pointId = 0; pointId < 26; pointId++) {
            layout[pointId] = [source.checkerContainers[pointId].checkers[PlayerId.BLACK], source.checkerContainers[pointId].checkers[PlayerId.WHITE]] 
        }
        clone.initialise(layout);
        return clone;
    }

    private static canMove(board: Board, playerId: PlayerId, points: number): boolean {
        // 25: include bar
        for (let startingPoint = 1; startingPoint <= 25; startingPoint++) {
            if (board.isLegalMove(new Move(playerId, startingPoint, points))) {
                return true;
            }
        }
        return false;
    }

    private static getPossibleGoesThatUseMostDice(possibleGoes: Array<PossibleGo>): Array<PossibleGo> {
        let max = 0;

        // 1. find move with most amount of dice used
        for (let i = 0; i < possibleGoes.length; i++) {
            max = Math.max(max, possibleGoes[i].moves.length);
        }

        let goesThatUseMostDice = new Array<PossibleGo>();

        // 2. copy into new array all with length of max
        for (let i = 0; i < possibleGoes.length; i++) {
            if (possibleGoes[i].moves.length === max) {
                goesThatUseMostDice.push(possibleGoes[i]);
            }
        }

        return goesThatUseMostDice;
    }

}
export class PossibleGo {
    constructor(public moves: Move[], public resultingBoard: Board) {
    }
}



