/// <reference path="PointUI.ts"/>

class Point {
    
    pointId: number;
    checkers: Array<number>;
    pointUI: PointUI;
    
    constructor(pointId: number, onSelected: (point: Point, selected: boolean) => void) {
        let self = this;
        this.pointId = pointId;
        this.checkers = [0, 0];
        this.pointUI = new PointUI(pointId, (selected: boolean) => { onSelected(self, selected); });
    }
    
    increment(player: Player, count: number): void {
        this.checkers[player] += count;
        this.pointUI.setCheckers(player, this.checkers[player]);
    }
    
    highlight(on: boolean) {
        this.pointUI.highlight(on);
    }
}