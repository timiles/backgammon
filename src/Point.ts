/// <reference path="CheckerContainer.ts"/>
/// <reference path="PointUI.ts"/>

class Point extends CheckerContainer {
    
    pointUI: PointUI;
    
    constructor(
        pointUI: PointUI,
        pointId: number,
        onInspected: (point: Point, on: boolean) => void,
        onSelected: (point: Point, on: boolean) => void) {
        super(pointId);
        
        let self = this;
        this.pointId = pointId;
        this.pointUI = pointUI;
        this.pointUI.onInspected = (on: boolean) => { onInspected(self, on); };
        this.pointUI.onSelected = (on: boolean) => { onSelected(self, on); };
    }
    
    decrement(player: Player): void {
        super.decrement(player);
        this.pointUI.setCheckers(player, this.checkers[player]);
    }
    
    increment(player: Player, count: number): void {
        super.increment(player, count);
        this.pointUI.setCheckers(player, this.checkers[player]);
    }
    
    highlightDestination(on: boolean) {
        this.pointUI.highlightDestination(on);
    }
    
    setState(state?: PointState) {
        this.pointUI.setState(state);
    }
    
    setSelected(on: boolean) {
        this.pointUI.setSelected(on);
    }
    
    touchSelected() {
        let self = this;
        self.pointUI.setSelected(true);
        setTimeout(function() {
            self.pointUI.setSelected(false);
        }, 300);
    }
}