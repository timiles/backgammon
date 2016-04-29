/// <reference path="CheckerContainerUI.ts"/>

class BarUI extends CheckerContainerUI {
    
    isSelected: boolean;
    onInspected: (on: boolean) => void;
    onSelected: (on: boolean) => void;
    
    constructor(player: Player) {
        super('bar', player === Player.RED);
        let self = this;
                
        this.checkerContainerDiv.onmouseover = () => { self.onInspected(true); };
        this.checkerContainerDiv.onmouseout = () => { self.onInspected(false); };
        this.checkerContainerDiv.onclick = () => {
            self.isSelected = !self.isSelected;
            self.onSelected(self.isSelected);
        };
    }
}