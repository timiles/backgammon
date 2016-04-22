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
        return sourcePointId + (direction * numberOfMoves);
    }
    
    /**
     * @deprecated Start using isLegalMove instead
     */
    isLegal(player: Player, pointId: number): boolean {
        if (pointId < 0 || pointId > 25) { 
            return false;
        }
        let otherPlayer = (player + 1) % 2;
        return this.points[pointId].checkers[otherPlayer] < 2;
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

        let destinationPointId = Board.getDestinationPointId(player, sourcePointId, numberOfMoves);
        if (destinationPointId == 0) {
            // check all pieces are in home board
            // REVIEW: this code is fiddly, should be extracted away somewhere
            var p1 = 1, p2 = 18;
            if (player == 0) {
                p1 += 6;
                p2 += 6;
            }
            for (var p = p1; p <= p2; p++) {
                if (this.points[p].checkers[player] > 0) {
                    return false;
                }
            }
            // already checked bar above
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
    
    highlightPointIfLegal(player: Player, pointId: number, on: boolean): void {
        if (this.isLegal(player, pointId)) {
            this.points[pointId].highlightDestination(on);
        }
    }
}