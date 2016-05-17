/// <reference path="CheckerContainer.ts"/>
/// <reference path="PointUI.ts"/>

class Point extends CheckerContainer {
    
    pointUI: PointUI;
    
    constructor(
        pointUI: PointUI,
        pointId: number,
        onInspected: (point: Point, on: boolean) => void,
        onSelected: (point: Point) => void) {
        super(pointId);
        
        this.pointId = pointId;
        this.pointUI = pointUI;
        this.pointUI.onInspected = (on: boolean) => { onInspected(this, on); };
        this.pointUI.onSelected = () => { onSelected(this); };
    }
    
    decrement(player: Player): void {
        super.decrement(player);
        this.pointUI.setCheckers(player, this.checkers[player]);
    }
    
    increment(player: Player, count: number): void {
        super.increment(player, count);
        this.pointUI.setCheckers(player, this.checkers[player]);
    }
    
    setValidDestination(on: boolean) {
        this.pointUI.setValidDestination(on);
    }
    
    setValidSource(on: boolean) {
        this.pointUI.setValidSource(on);
    }
    
    setSelected(on: boolean) {
        this.pointUI.setSelected(on);
    }
}