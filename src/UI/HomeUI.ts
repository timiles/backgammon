/// <reference path="../Enums.ts"/>
/// <reference path="CheckerContainerUI.ts"/>

class HomeUI extends CheckerContainerUI {
    
    constructor(player: PlayerId) {
        super('home', player === PlayerId.BLACK);
    }   
}