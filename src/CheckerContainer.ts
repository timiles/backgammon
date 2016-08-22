/// <reference path="Enums.ts"/>

class CheckerContainer {
    
    pointId: number
    checkers: Array<number>;
    
    constructor(pointId: number) {
        this.pointId = pointId;
        this.checkers = [0, 0];
    }
    
    decrement(player: PlayerId): void {
        this.checkers[player]--;
    }
    
    increment(player: PlayerId, count: number): void {
        this.checkers[player] += count;
    }
}