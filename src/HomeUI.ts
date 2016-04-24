/// <reference path="CheckerContainerUI.ts"/>

class HomeUI extends CheckerContainerUI {
    
    constructor(player: Player) {
        super('home', player === Player.BLACK);
    }   
}