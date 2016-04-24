/// <reference path="CheckerContainerUI.ts"/>

declare var $;

class BarUI extends CheckerContainerUI {
    
    isSelected: boolean;
    
    constructor(player: Player, onInspected: (on: boolean) => void, onSelected: (on: boolean) => void) {
        super('bar', player === Player.RED);
        let self = this;
                
        this.checkerContainerDiv.onmouseover = function() { onInspected(true); };
        this.checkerContainerDiv.onmouseout = function() { onInspected(false); };
        this.checkerContainerDiv.onclick = function() {
            self.isSelected = !self.isSelected;
            onSelected(self.isSelected);
        };
    }
}