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
    
    isLegal(player: Player, pointId: number): boolean {
        if (pointId < 0 || pointId > 25) { 
            return false;
        }
        let otherPlayer = (player + 1) % 2;
        return this.points[pointId].checkers[otherPlayer] < 2;
    }
    
    move(player: Player, fromPointId: number, toPointId: number): void {
        this.decrement(player, fromPointId);
        this.increment(player, toPointId);
    }
    
    highlightPointIfLegal(player: Player, pointId: number, on: boolean): void {
        if (this.isLegal(player, pointId)) {
            this.points[pointId].highlightDestination(on);
        }
    }
}