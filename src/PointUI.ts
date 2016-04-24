/// <reference path="CheckerContainerUI.ts"/>

declare var $;

class PointUI extends CheckerContainerUI {
    
    isSelected: boolean;
    
    constructor(pointId: number, onInspected: (on: boolean) => void, onSelected: (on: boolean) => void) {
        super(`point-${(pointId % 2 == 0) ? 'black' : 'red'}`, pointId >= 13);

        let self = this;
        this.checkerContainerDiv.onclick = function() {
            self.isSelected = !self.isSelected;
            onSelected(self.isSelected);
        };
        this.checkerContainerDiv.onmouseover = function() { onInspected(true); };
        this.checkerContainerDiv.onmouseout = function() { onInspected(false); };
    }
    
    highlightDestination(on: boolean): void {
        if (on) {
            $(this.checkerContainerDiv).addClass('highlight-destination');
        }
        else {
            $(this.checkerContainerDiv).removeClass('highlight-destination');
        }
    }
    
    highlightSource(on: boolean): void {
        if (on) {
            $(this.checkerContainerDiv).addClass('highlight-source');
        }
        else {
            $(this.checkerContainerDiv).removeClass('highlight-source');
        }
    }
}