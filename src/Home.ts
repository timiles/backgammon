/// <reference path="CheckerContainer.ts"/>
/// <reference path="HomeUI.ts"/>

class Home extends CheckerContainer {
    homeUIs: Array<HomeUI>;
    
    constructor() {
        super(PointId.BAR);
        
        this.homeUIs = new Array<HomeUI>(2);
        this.homeUIs[Player.BLACK] = new HomeUI(Player.BLACK);
        this.homeUIs[Player.RED] = new HomeUI(Player.RED);
    }
    
    increment(player: Player): void {
        super.increment(player, 1);
        this.homeUIs[player].setCheckers(player, this.checkers[player]);
    }
}