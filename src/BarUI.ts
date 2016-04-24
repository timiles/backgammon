declare var $;

class BarUI {
    
    barDiv: HTMLDivElement;
    isSelected: boolean;
    
    constructor(player: Player, onInspected: (on: boolean) => void, onSelected: (on: boolean) => void) {
        let self = this;
        
        this.barDiv = document.createElement('div');
        
        this.barDiv.id = Player[player] + '-bar';
        this.barDiv.className = 'point bar';

        this.barDiv.onmouseover = function() { onInspected(true); };
        this.barDiv.onmouseout = function() { onInspected(false); };
        this.barDiv.onclick = function() {
            self.isSelected = !self.isSelected;
            onSelected(self.isSelected);
        };
    }
    
    private clearCheckers(): void {
        while (this.barDiv.hasChildNodes()) {
            this.barDiv.removeChild(this.barDiv.childNodes[0]);
        }
    }
    
    setCheckers(player: Player, count: number) {
        this.clearCheckers();

        let $barDiv = $(this.barDiv);
        let className = Player[player].toLowerCase();
        for (let i = 1; i <= count; i++) {
            if (i > 5) {
                $('.checker-total', $barDiv).text(count);
            } else if (i == 5) {
                $barDiv.append($('<div class="checker checker-total">').addClass(className));
            } else {
                $barDiv.append($('<div class="checker">').addClass(className));
            }
        }
    }
}