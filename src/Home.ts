/// <reference path="CheckerContainer.ts"/>
/// <reference path="HomeUI.ts"/>

class Home extends CheckerContainer {
    homeUIs: Array<HomeUI>;
    
    constructor(blackHomeUI: HomeUI, redHomeUI: HomeUI, onSelected: (home: Home) => void) {
        super(PointId.HOME);
        
        this.homeUIs = new Array<HomeUI>(2);
        
        blackHomeUI.onSelected = () => { onSelected(this); };
        this.homeUIs[PlayerId.BLACK] = blackHomeUI;

        redHomeUI.onSelected = () => { onSelected(this); };
        this.homeUIs[PlayerId.RED] = redHomeUI;        
    }
    
    increment(player: PlayerId): void {
        super.increment(player, 1);
        this.homeUIs[player].setCheckers(player, this.checkers[player]);
    }
    
    setValidDestination(player: PlayerId, on: boolean) {
        this.homeUIs[player].setValidDestination(on);
    }
}