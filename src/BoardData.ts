/// <reference path="Point.ts"/>

class BoardData {

    data: Array<Point>;
    constructor() {
        this.data = new Array(26);    
        for (let i = 0; i < 26; i++) {
            this.data[i] = new Point(i);
        }
        
        this.increment(24, Player.RED, 2);
        this.increment(1, Player.BLACK, 2);
        this.increment(6, Player.RED, 5);
        this.increment(19, Player.BLACK, 5);
        this.increment(8, Player.RED, 3);
        this.increment(17, Player.BLACK, 3);
        this.increment(13, Player.RED, 5);
        this.increment(12, Player.BLACK, 5);
    }
    
    increment(pointId: number, player: Player, count?: number): void {
        this.data[pointId].increment(player, count || 1);
    }
}