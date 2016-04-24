/// <reference path="BarUI.ts"/>
/// <reference path="Point.ts"/>

class Bar extends CheckerContainer {
    barUIs: Array<BarUI>;
    
    constructor(
        onInspected: (bar: Bar, on: boolean) => void,
        onSelected: (bar: Bar, on: boolean) => void) {
        super(PointId.BAR);
        
        let self = this;
        this.barUIs = new Array<BarUI>(2);
        this.barUIs[Player.BLACK] =
            new BarUI(Player.BLACK, (on: boolean) => { onInspected(self, on); }, (on: boolean) => { onSelected(self, on); });
        this.barUIs[Player.RED] =
            new BarUI(Player.RED, (on: boolean) => { onInspected(self, on); }, (on: boolean) => { onSelected(self, on); });
    }
    
    decrement(player: Player): void {
        super.decrement(player);
        this.barUIs[player].setCheckers(player, this.checkers[player]);
    }
    
    increment(player: Player, count: number): void {
        super.increment(player, count);
        this.barUIs[player].setCheckers(player, this.checkers[player]);
    }
}