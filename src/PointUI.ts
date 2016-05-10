/// <reference path="CheckerContainerUI.ts"/>

declare var $;

class PointUI extends CheckerContainerUI {
    
    isSelected: boolean;
    onInspected: (on: boolean) => void;
    onSelected: (on: boolean) => void;
    
    constructor(colour: string, isTopSide: boolean) {
        super(`point-${colour}`, isTopSide);

        let self = this;
        this.containerDiv.onclick = () => {
            self.isSelected = !self.isSelected;
            self.onSelected(self.isSelected);
        };
        this.containerDiv.onmouseover = () => { self.onInspected(true); };
        this.containerDiv.onmouseout = () => { self.onInspected(false); };
    }
}