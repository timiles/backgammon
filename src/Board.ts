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
        
        this.increment(24, Player.RED, 2);
        this.increment(1, Player.BLACK, 2);
        this.increment(6, Player.RED, 5);
        this.increment(19, Player.BLACK, 5);
        this.increment(8, Player.RED, 3);
        this.increment(17, Player.BLACK, 3);
        this.increment(13, Player.RED, 5);
        this.increment(12, Player.BLACK, 5);
    
        this.boardUI.initialise(this.points.map(function(p) { return p.pointUI; }));
    }
    
    decrement(pointId: number, player: Player): void {
        this.points[pointId].decrement(player);
    }
        
    increment(pointId: number, player: Player, count?: number): void {
        this.points[pointId].increment(player, count || 1);
    }
    
    isLegal(player: Player, pointId: number): boolean {
        let otherPlayer = (player + 1) % 2;
        return this.points[pointId].checkers[otherPlayer] < 2;
    }
    
    move(player: Player, fromPointId: number, toPointId: number): void {
        this.decrement(fromPointId, player);
        this.increment(toPointId, player);
    }
    
    highlightPointIfLegal(pointId: number, player: Player, on: boolean): boolean {
        let point = this.points[pointId]; 
        let otherPlayer = (player + 1) % 2;
        if (point.checkers[otherPlayer] >= 2) {
            return false;
        }
        point.highlight(on);
        return true;
    }
}