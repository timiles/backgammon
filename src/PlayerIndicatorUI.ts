/// <reference path="Game.ts"/>

class PlayerIndicatorUI {
    
    indicators: Array<HTMLDivElement>;
    constructor() {
        this.indicators = new Array<HTMLDivElement>(2);
        this.indicators[Player.BLACK] = PlayerIndicatorUI.createIndicator(Player.BLACK);
        this.indicators[Player.RED] = PlayerIndicatorUI.createIndicator(Player.RED);
    }
    
    private static createIndicator(player: Player): HTMLDivElement {
        let div = <HTMLDivElement> document.createElement('div');
        div.className = 'player-indicator checker ' + Player[player].toString().toLowerCase();
        return div;
    }
    
    setActivePlayer(player: Player) {
        let otherPlayer = player === Player.BLACK ? Player.RED : Player.BLACK;
        $(this.indicators[otherPlayer]).removeClass('active');
        $(this.indicators[player]).addClass('active');
    }
}