/// <reference path="CheckerContainer.ts"/>
/// <reference path="HomeUI.ts"/>

class Home extends CheckerContainer {
    homeUIs: Array<HomeUI>;
    
    constructor(blackHomeUI: HomeUI, redHomeUI: HomeUI, onSelected: (home: Home) => void) {
        super(PointId.HOME);
        
        this.homeUIs = new Array<HomeUI>(2);
        
        blackHomeUI.onSelected = () => { onSelected(this); };
        this.homeUIs[Player.BLACK] = blackHomeUI;

        redHomeUI.onSelected = () => { onSelected(this); };
        this.homeUIs[Player.RED] = redHomeUI;        
    }
    
    increment(player: Player): void {
        super.increment(player, 1);
        this.homeUIs[player].setCheckers(player, this.checkers[player]);
    }
    
    setValidDestination(player: Player, on: boolean) {
        this.homeUIs[player].setValidDestination(on);
    }
}