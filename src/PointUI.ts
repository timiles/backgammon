declare var $;

class PointUI {
    
    pointDiv: HTMLDivElement;
    constructor(pointId: number) {
        this.pointDiv = document.createElement('div');
        this.pointDiv.id = 'point' + pointId.toString();
        
        let side = (pointId < 13 ? 'bottom' : 'top');
        let colour = (pointId % 2 == 0) ? 'black' : 'red'; 
        this.pointDiv.className = `point ${side}-point ${colour}-point`;
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
                $('.counter-total', $pointDiv).text(count);
            } else if (i == 5) {
                $pointDiv.append($('<div class="counter counter-total">').addClass(Player[player]));
            } else {
                $pointDiv.append($('<div class="counter">').addClass(Player[player]));
            }
        }
    }
}