/// <reference path="../Enums.ts"/>
/// <reference path="CheckerContainerUI.ts"/>

class BarUI extends CheckerContainerUI {
    
    onInspected: (on: boolean) => void;
    
    constructor(player: PlayerId) {
        super('bar', player === PlayerId.RED);
                
        this.containerDiv.onmouseover = () => { this.onInspected(true); };
        this.containerDiv.onmouseout = () => { this.onInspected(false); };
    }
}