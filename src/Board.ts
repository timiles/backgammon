/// <reference path="Bar.ts"/>
/// <reference path="BoardUI.ts"/>
/// <reference path="CheckerContainer.ts"/>
/// <reference path="Enums.ts"/>
/// <reference path="Home.ts"/>
/// <reference path="Point.ts"/>

enum PointId { HOME = 0, BAR = 25 }

class Board {

    checkerContainers: Array<CheckerContainer>;
    onPointInspected: (checkerContainer: CheckerContainer, on: boolean) => void;
    onPointSelected: (checkerContainer: CheckerContainer, on: boolean) => void;
    boardUI: BoardUI;
        
    constructor(boardUI: BoardUI) {
        this.boardUI = boardUI;

        let onPointInspected = (checkerContainer: CheckerContainer, on: boolean) => {
            if (this.onPointInspected) {
                this.onPointInspected(checkerContainer, on);
            }
        }
        let onPointSelected = (checkerContainer: CheckerContainer, on: boolean) => {
            if (this.onPointSelected) {
                this.onPointSelected(checkerContainer, on);
            }
        }
        this.checkerContainers = new Array(26);
        this.checkerContainers[PointId.HOME] = new Home(this.boardUI.blackHomeUI, this.boardUI.redHomeUI, onPointSelected);
        for (let i = 1; i < 25; i++) {
            this.checkerContainers[i] = new Point(this.boardUI.pointUIs[i-1], i, onPointInspected, onPointSelected);
        }
        this.checkerContainers[PointId.BAR] = new Bar(this.boardUI.blackBarUI, this.boardUI.redBarUI, onPointInspected, onPointSelected);
        
        this.increment(Player.RED, 24, 2);
        this.increment(Player.BLACK, 1, 2);
        this.increment(Player.RED, 6, 5);
        this.increment(Player.BLACK, 19, 5);
        this.increment(Player.RED, 8, 3);
        this.increment(Player.BLACK, 17, 3);
        this.increment(Player.RED, 13, 5);
        this.increment(Player.BLACK, 12, 5);
    }
    
    decrement(player: Player, pointId: number): void {
        this.checkerContainers[pointId].decrement(player);
    }
        
    increment(player: Player, pointId: number, count?: number): void {
        this.checkerContainers[pointId].increment(player, count || 1);
    }
    
    static getDestinationPointId(player: Player, sourcePointId: number, numberOfMoves: number): number {
        switch (player) {
            case Player.BLACK: {
                if (sourcePointId === PointId.BAR) {
                    return numberOfMoves;
                }

                let destinationPointId = sourcePointId + numberOfMoves;
                if (destinationPointId > 24) {
                     // bearing off
                     return PointId.HOME;
                }
                return destinationPointId;

            }
            case Player.RED: {
                if (sourcePointId === PointId.BAR) {
                    return PointId.BAR - numberOfMoves;
                }
                
                let destinationPointId = sourcePointId - numberOfMoves;
                if (destinationPointId < 1) {
                     // bearing off
                     return PointId.HOME;
                }
                return destinationPointId;
            }
            default: throw `Unknown player: ${player}`;
        }
    }
    
    isLegalMove(player: Player, sourcePointId: number, numberOfMoves: number): boolean {
        
        // case: there is no counter to move: fail
        if (this.checkerContainers[sourcePointId].checkers[player] == 0) {
            console.info('no counter at ' + sourcePointId);
            return false;
        }
                
        // case: there is a counter on the bar, and this is not it
        if ((sourcePointId != PointId.BAR) && (this.checkerContainers[PointId.BAR].checkers[player] > 0)) {
            console.info('must move counter off bar first');
            return false;
        }

        // case: bearing off
        const direction = (player === Player.BLACK) ? 1 : -1;
        let destinationPointId = Board.getDestinationPointId(player, sourcePointId, numberOfMoves);
        if (destinationPointId === PointId.HOME) {
            // check that there are no checkers outside of home board. (BAR has already been checked above)
            const startingPointOfOuterBoard = (player === Player.BLACK) ? 1 : 24;
            const totalPointsOfOuterBoard = 18;
            for (let offset = 0; offset < totalPointsOfOuterBoard; offset++) {
                if (this.checkerContainers[startingPointOfOuterBoard + (direction * offset)].checkers[player] > 0) {
                    return false;
                }
            }
            
            // check that there are no checkers more deserving of this dice roll
            let actualDestinationPointId = sourcePointId + (direction * numberOfMoves);
            // if it's dead on, we're fine.
            if (actualDestinationPointId === 0 || actualDestinationPointId === 25) {
                return true;
            }
            
            const startingPointOfHomeBoard = (player === Player.BLACK) ? 18 : 6;
            for (let homeBoardPointId = startingPointOfHomeBoard; homeBoardPointId !== sourcePointId; homeBoardPointId += direction) {
                if (this.checkerContainers[homeBoardPointId].checkers[player] > 0) {
                    // if we find a checker on a further out point, sourcePointId is not valid
                    return false;
                }
            }
            return true;
        }

        let otherPlayer = Game.getOtherPlayer(player);

        // case: there is a counter, but opponent blocks the end pip
        if (this.checkerContainers[destinationPointId].checkers[otherPlayer] >= 2) {
            console.info('point is blocked');
            return false;
        }

        return true;
    }
    
    move(player: Player, sourcePointId: number, numberOfMoves: number): boolean {
        if (!this.isLegalMove(player, sourcePointId, numberOfMoves)) {
            return false;
        }
        let destinationPointId = Board.getDestinationPointId(player, sourcePointId, numberOfMoves);
        let otherPlayer = Game.getOtherPlayer(player);
        if (this.checkerContainers[destinationPointId].checkers[otherPlayer] == 1) {
            this.decrement(otherPlayer, destinationPointId);
            this.increment(otherPlayer, PointId.BAR);
        }
        this.decrement(player, sourcePointId);
        this.increment(player, destinationPointId);
        return true;
    }
        
    checkIfValidDestination(player: Player, sourcePointId: number, numberOfMoves: number): void {
        if (this.isLegalMove(player, sourcePointId, numberOfMoves)) {
            let destinationPointId = Board.getDestinationPointId(player, sourcePointId, numberOfMoves);
            if (destinationPointId === PointId.HOME) {
                (<Home> this.checkerContainers[PointId.HOME]).setValidDestination(player, true);
            }
            else {
                (<Point> this.checkerContainers[destinationPointId]).setValidDestination(true);
            }
        }
    }
    
    removeAllHighlights(): void {
        for (let pointId = 1; pointId <= 24; pointId++) {
            (<Point> this.checkerContainers[pointId]).setValidDestination(false);
        }
        (<Home> this.checkerContainers[PointId.HOME]).setValidDestination(Player.BLACK, false);
        (<Home> this.checkerContainers[PointId.HOME]).setValidDestination(Player.RED, false);
    }
}