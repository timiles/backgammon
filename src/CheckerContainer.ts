/// <reference path="Enums.ts"/>

class CheckerContainer {
    
    pointId: number
    checkers: Array<number>;
    
    constructor(pointId: number) {
        this.pointId = pointId;
        this.checkers = [0, 0];
    }
    
    decrement(player: Player): void {
        this.checkers[player]--;
    }
    
    increment(player: Player, count: number): void {
        this.checkers[player] += count;
    }
}