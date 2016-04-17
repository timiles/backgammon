/// <reference path="PointUI.ts"/>

class Point {
    
    pointId: number;
    checkers: Array<number>;
    pointUI: PointUI;
    constructor(pointId: number) {
        this.pointId = pointId;
        this.checkers = [0, 0];
        this.pointUI = new PointUI(pointId);
    }
    
    increment(player: Player, count: number): void {
        this.checkers[player] += count;
        this.pointUI.setCheckers(player, this.checkers[player]);
    }
}