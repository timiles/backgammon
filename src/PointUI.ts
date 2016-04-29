/// <reference path="CheckerContainerUI.ts"/>

declare var $;

class PointUI extends CheckerContainerUI {
    
    isSelected: boolean;
    onInspected: (on: boolean) => void;
    onSelected: (on: boolean) => void;
    
    constructor(colour: string, isTopSide: boolean) {
        super(`point-${colour}`, isTopSide);

        let self = this;
        this.checkerContainerDiv.onclick = () => {
            self.isSelected = !self.isSelected;
            self.onSelected(self.isSelected);
        };
        this.checkerContainerDiv.onmouseover = () => { self.onInspected(true); };
        this.checkerContainerDiv.onmouseout = () => { self.onInspected(false); };
    }
    
    highlightDestination(on: boolean): void {
        if (on) {
            $(this.checkerContainerDiv).addClass('highlight-destination');
        }
        else {
            $(this.checkerContainerDiv).removeClass('highlight-destination');
        }
    }
}