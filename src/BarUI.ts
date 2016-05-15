/// <reference path="CheckerContainerUI.ts"/>
/// <reference path="Enums.ts"/>

class BarUI extends CheckerContainerUI {
    
    isSelected: boolean;
    onInspected: (on: boolean) => void;
    onSelected: (on: boolean) => void;
    
    constructor(player: Player) {
        super('bar', player === Player.RED);
                
        this.containerDiv.onmouseover = () => { this.onInspected(true); };
        this.containerDiv.onmouseout = () => { this.onInspected(false); };
        this.containerDiv.onclick = () => {
            this.isSelected = !this.isSelected;
            this.onSelected(this.isSelected);
        };
    }
}