declare var $;

class PointUI {
    
    pointDiv: HTMLDivElement;
    isSelected: boolean;
    
    constructor(pointId: number, onInspected: (on: boolean) => void, onSelected: (on: boolean) => void) {
        let self = this;
        
        this.pointDiv = document.createElement('div');
        
        let side = (pointId < 13 ? 'bottom' : 'top');
        let colour = (pointId % 2 == 0) ? 'black' : 'red'; 
        this.pointDiv.className = `point ${side}-point ${colour}-point`;
        this.pointDiv.onmouseover = function() { onInspected(true); };
        this.pointDiv.onmouseout = function() { onInspected(false); };
        this.pointDiv.onclick = function() {
            self.isSelected = !self.isSelected;
            onSelected(self.isSelected);
        };
    }
    
    clearCheckers(): void {
        while (this.pointDiv.hasChildNodes()) {
            this.pointDiv.removeChild(this.pointDiv.childNodes[0]);
        }
    }
    
    setCheckers(player: Player, count: number) {
        this.clearCheckers();

        let $pointDiv = $(this.pointDiv);
        for (let i = 1; i <= count; i++) {
            if (i > 5) {
                $('.checker-total', $pointDiv).text(count);
            } else if (i == 5) {
                $pointDiv.append($('<div class="checker checker-total">').addClass(Player[player]));
            } else {
                $pointDiv.append($('<div class="checker">').addClass(Player[player]));
            }
        }
    }
    
    highlightDestination(on: boolean): void {
        if (on) {
            $(this.pointDiv).addClass('highlight-destination');
        }
        else {
            $(this.pointDiv).removeClass('highlight-destination');
        }
    }
    
    highlightSource(on: boolean): void {
        if (on) {
            $(this.pointDiv).addClass('highlight-source');
        }
        else {
            $(this.pointDiv).removeClass('highlight-source');
        }
    }
}