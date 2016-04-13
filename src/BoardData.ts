class BoardData {

    data: Array<Array<number>>;
    constructor() {
        this.data = new Array(26);    
        for (var i = 0; i < 26; i++) {
            this.data[i] = [0, 0];
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
    
    static getPipIndex(pipNumber: number, player: Player): number {
        // special pips:
        if ((pipNumber == 0) || (pipNumber == 25)) {
            return pipNumber;
        }
        // otherwise invert board if we are black
        return player == Player.RED ? pipNumber : 25 - pipNumber;
    }
    
    increment(pipNumber: number, player: Player, count?: number): number {
        return (this.data[BoardData.getPipIndex(pipNumber, player)][player] += (count || 1));
    }
    decrement(pipNumber: number, player: Player): number {
        return --this.data[BoardData.getPipIndex(pipNumber, player)][player];
    }
    getCounters(pipNumber: number, player: Player): number {
        return this.data[BoardData.getPipIndex(pipNumber, player)][player];
    }
}