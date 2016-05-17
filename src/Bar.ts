/// <reference path="BarUI.ts"/>
/// <reference path="Enums.ts"/>
/// <reference path="Point.ts"/>

class Bar extends CheckerContainer {
    barUIs: Array<BarUI>;
    
    constructor(
        blackBarUI: BarUI,
        redBarUI: BarUI,
        onInspected: (bar: Bar, on: boolean) => void,
        onSelected: (bar: Bar, on: boolean) => void) {
        super(PointId.BAR);
        
        blackBarUI.onInspected = (on: boolean) => { onInspected(this, on); };
        blackBarUI.onSelected = (on: boolean) => { onSelected(this, on); };
        redBarUI.onInspected = (on: boolean) => { onInspected(this, on); };
        redBarUI.onSelected = (on: boolean) => { onSelected(this, on); };
        
        this.barUIs = new Array<BarUI>(2);
        this.barUIs[Player.BLACK] = blackBarUI;
        this.barUIs[Player.RED] = redBarUI;
    }
    
    decrement(player: Player): void {
        super.decrement(player);
        this.barUIs[player].setCheckers(player, this.checkers[player]);
    }
    
    increment(player: Player, count: number): void {
        super.increment(player, count);
        this.barUIs[player].setCheckers(player, this.checkers[player]);
    }
    
    setSelected(player: Player, on: boolean) {
        this.barUIs[player].setSelected(on);
    }
    
    setValidSource(player: Player, on: boolean) {
        this.barUIs[player].setValidSource(on);
    }
}