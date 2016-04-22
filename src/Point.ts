/// <reference path="PointUI.ts"/>

class Point {
    
    pointId: number;
    checkers: Array<number>;
    pointUI: PointUI;
    
    constructor(
        pointId: number,
        onInspected: (point: Point, on: boolean) => void,
        onSelected: (point: Point, on: boolean) => void) {
        
        let self = this;
        this.pointId = pointId;
        this.checkers = [0, 0];
        this.pointUI = new PointUI(pointId, (on: boolean) => { onInspected(self, on); }, (on: boolean) => { onSelected(self, on); });
    }
    
    decrement(player: Player): void {
        this.checkers[player]--;
        this.pointUI.setCheckers(player, this.checkers[player]);
    }
    
    increment(player: Player, count: number): void {
        this.checkers[player] += count;
        this.pointUI.setCheckers(player, this.checkers[player]);
    }
    
    highlightDestination(on: boolean) {
        this.pointUI.highlightDestination(on);
    }
    
    highlightSource(on: boolean) {
        this.pointUI.highlightSource(on);        
    }
}