/// <reference path="CheckerContainerUI.ts"/>

class BarUI extends CheckerContainerUI {
    
    isSelected: boolean;
    onInspected: (on: boolean) => void;
    onSelected: (on: boolean) => void;
    
    constructor(player: Player) {
        super('bar', player === Player.RED);
        let self = this;
                
        this.checkerContainerDiv.onmouseover = function() { self.onInspected(true); };
        this.checkerContainerDiv.onmouseout = function() { self.onInspected(false); };
        this.checkerContainerDiv.onclick = function() {
            self.isSelected = !self.isSelected;
            self.onSelected(self.isSelected);
        };
    }
}