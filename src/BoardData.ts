class BoardData {

    data: Array<Array<number>>;
    constructor() {
        this.data = new Array(26);    
        for (var i = 0; i < 26; i++) {
            this.data[i] = [0, 0];
        }
    }
    static getPipIndex(pipNumber: number, player: Player) {
        // special pips:
        if ((pipNumber == 0) || (pipNumber == 25)) {
            return pipNumber;
        }
        // otherwise invert board if we are black
        return player == Player.RED ? pipNumber : 25 - pipNumber;
    }
    
    increment(pipNumber: number, player: Player) {
        return ++this.data[BoardData.getPipIndex(pipNumber, player)][player];
    }
    decrement(pipNumber: number, player: Player) {
        return --this.data[BoardData.getPipIndex(pipNumber, player)][player];
    }
    getCounters(pipNumber: number, player: Player) {
        return this.data[BoardData.getPipIndex(pipNumber, player)][player];
    }
}