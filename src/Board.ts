/// <reference path="BoardUI.ts"/>
/// <reference path="Point.ts"/>

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
        // not a valid starting point
        if (this.points[sourcePointId].checkers[player] == 0) {
            return false;
        }
        
        let destinationPointId = Board.getDestinationPointId(player, sourcePointId, numberOfMoves);
        let otherPlayer = (player + 1) % 2;
        return this.points[destinationPointId].checkers[otherPlayer] < 2;
    }
    
    move(player: Player, sourcePointId: number, numberOfMoves: number): boolean {
        if (!this.isLegalMove(player, sourcePointId, numberOfMoves)) {
            return false;
        }
        let destinationPointId = Board.getDestinationPointId(player, sourcePointId, numberOfMoves);
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