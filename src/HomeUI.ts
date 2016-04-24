/// <reference path="CheckerContainerUI.ts"/>

declare var $;

class HomeUI extends CheckerContainerUI {
    
    constructor(player: Player) {
        super('home', player === Player.BLACK);
    }   
}