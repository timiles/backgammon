/// <reference path="CheckerContainerUI.ts"/>

declare var $;

class PointUI extends CheckerContainerUI {
    
    onInspected: (on: boolean) => void;
    
    constructor(colour: string, isTopSide: boolean) {
        super(`point-${colour}`, isTopSide);

        let self = this;
        this.containerDiv.onmouseover = () => { self.onInspected(true); };
        this.containerDiv.onmouseout = () => { self.onInspected(false); };
    }
}