/// <reference path="BoardUI.ts"/>
/// <reference path="Point.ts"/>

enum PointId { HOME = 0, BAR = 25 }

class Board {

    points: Array<Point>;
    onPointInspected: (point: Point, on: boolean) => void;
    onPointSelected: (point: Point, on: boolean) => void;
    boardUI: BoardUI;
        
    constructor(boardUI: BoardUI) {
        this.boardUI = boardUI;

        let onPointInspected = (point: Point, on: boolean) => {
            if (this.onPointInspected) {
                this.onPointInspected(point, on);
            }
        }
        let onPointSelected = (point: Point, on: boolean) => {
            if (this.onPointSelected) {
                this.onPointSelected(point, on);
            }
        }
        this.points = new Array(26);
        for (let i = 0; i < 26; i++) {
            this.points[i] = new Point(i, onPointInspected, onPointSelected);
        }
        
        this.increment(Player.RED, 24, 2);
        this.increment(Player.BLACK, 1, 2);
        this.increment(Player.RED, 6, 5);
        this.increment(Player.BLACK, 19, 5);
        this.increment(Player.RED, 8, 3);
        this.increment(Player.BLACK, 17, 3);
        this.increment(Player.RED, 13, 5);
        this.increment(Player.BLACK, 12, 5);
    
        this.boardUI.initialise(this.points.map(p => p.pointUI));
    }
    
    decrement(player: Player, pointId: number): void {
        this.points[pointId].decrement(player);
    }
        
    increment(player: Player, pointId: number, count?: number): void {
        this.points[pointId].increment(player, count || 1);
    }
    
    private static getDestinationPointId(player: Player, sourcePointId: number, numberOfMoves: number): number {
        if (sourcePointId === PointId.BAR) {
            if (player === Player.BLACK) {
                return numberOfMoves;
            }
            else {
                return 25 - numberOfMoves;
            }
        }
        let direction = player == Player.BLACK ? 1 : -1;
        var destinationPointId = sourcePointId + (direction * numberOfMoves);
        if (destinationPointId > 24 || destinationPointId < 0) return 0; // when bearing off to home
        return destinationPointId;
    }
    
    isLegalMove(player: Player, sourcePointId: number, numberOfMoves: number): boolean {
        
        // case: there is no counter to move: fail
        if (this.points[sourcePointId].checkers[player] == 0) {
            console.info('no counter at ' + sourcePointId);
            return false;
        }
                
        // case: there is a counter on the bar, and this is not it
        if ((sourcePointId != PointId.BAR) && (this.points[PointId.BAR].checkers[player] > 0)) {
            console.info('must move counter off bar first');
            return false;
        }

        // case: bearing off
        let destinationPointId = Board.getDestinationPointId(player, sourcePointId, numberOfMoves);
        if (destinationPointId == 0) {
            // check that there are no pieces outside of home board. (BAR has already been checked above)
            const pointIdOutsideOfHomeBoard = (player === Player.BLACK) ? 1 : 7;
            const totalPointsOutsideOfHomeBoard = 18;
            for (var offset = 0; offset < totalPointsOutsideOfHomeBoard; offset++) {
                if (this.points[pointIdOutsideOfHomeBoard + offset].checkers[player] > 0) {
                    return false;
                }
            }
            return true;
        }

        let otherPlayer = Game.getOtherPlayer(player);

        // case: there is a counter, but opponent blocks the end pip
        if (this.points[destinationPointId].checkers[otherPlayer] >= 2) {
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
        if (this.points[destinationPointId].checkers[otherPlayer] == 1) {
            this.decrement(otherPlayer, destinationPointId);
            this.increment(otherPlayer, PointId.BAR);
        }
        this.decrement(player, sourcePointId);
        this.increment(player, destinationPointId);
        return true;
    }
    
    highlightIfLegalMove(player: Player, sourcePointId: number, numberOfMoves: number, on: boolean): void {
        if (this.isLegalMove(player, sourcePointId, numberOfMoves)) {
            let destinationPointId = Board.getDestinationPointId(player, sourcePointId, numberOfMoves);
            this.points[destinationPointId].highlightDestination(on);
        }
    }
}