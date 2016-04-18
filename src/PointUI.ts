declare var $;

class PointUI {
    
    pointDiv: HTMLDivElement;
    
    constructor(pointId: number, onSelected: (selected: boolean) => void) {
        this.pointDiv = document.createElement('div');
        
        let side = (pointId < 13 ? 'bottom' : 'top');
        let colour = (pointId % 2 == 0) ? 'black' : 'red'; 
        this.pointDiv.className = `point ${side}-point ${colour}-point`;
        this.pointDiv.onmouseover = function() { onSelected(true); };
        this.pointDiv.onmouseout = function() { onSelected(false); };
    }
    
    clearCheckers(): void {
        for (let i = 0; i < this.pointDiv.childNodes.length; i++) {
            this.pointDiv.removeChild(this.pointDiv.childNodes[i]);
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
    
    highlight(on: boolean): void {
        if (on) {
            $(this.pointDiv).addClass('highlight');
        }
        else {
            $(this.pointDiv).removeClass('highlight');
        }
    }
}