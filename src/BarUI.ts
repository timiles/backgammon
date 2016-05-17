/// <reference path="CheckerContainerUI.ts"/>
/// <reference path="Enums.ts"/>

class BarUI extends CheckerContainerUI {
    
    onInspected: (on: boolean) => void;
    
    constructor(player: Player) {
        super('bar', player === Player.RED);
                
        this.containerDiv.onmouseover = () => { this.onInspected(true); };
        this.containerDiv.onmouseout = () => { this.onInspected(false); };
    }
}