/// <reference path="CheckerContainerUI.ts"/>

declare var $;

class PointUI extends CheckerContainerUI {
    
    onInspected: (on: boolean) => void;
    
    constructor(colour: string, isTopSide: boolean) {
        super(`point-${colour}`, isTopSide);

        this.containerDiv.onmouseover = () => { this.onInspected(true); };
        this.containerDiv.onmouseout = () => { this.onInspected(false); };
    }
}