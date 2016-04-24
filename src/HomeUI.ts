declare var $;

class HomeUI {
    
    homeDiv: HTMLDivElement;
    
    constructor(player: Player) {
        let self = this;
        
        this.homeDiv = document.createElement('div');
        
        let side = (player === Player.BLACK ? 'top' : 'bottom');
        this.homeDiv.id = Player[player] + '-home';
        this.homeDiv.className = `point ${side}-point home`;
    }
    
    private clearCheckers(): void {
        while (this.homeDiv.hasChildNodes()) {
            this.homeDiv.removeChild(this.homeDiv.childNodes[0]);
        }
    }
    
    setCheckers(player: Player, count: number) {
        this.clearCheckers();

        let $homeDiv = $(this.homeDiv);
        let className = Player[player].toLowerCase();
        for (let i = 1; i <= count; i++) {
            if (i > 5) {
                $('.checker-total', $homeDiv).text(count);
            } else if (i == 5) {
                $homeDiv.append($('<div class="checker checker-total">').addClass(className));
            } else {
                $homeDiv.append($('<div class="checker">').addClass(className));
            }
        }
    }
}