var BoardData = (function () {
    function BoardData() {
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
    BoardData.getPipIndex = function (pipNumber, player) {
        // special pips:
        if ((pipNumber == 0) || (pipNumber == 25)) {
            return pipNumber;
        }
        // otherwise invert board if we are black
        return player == Player.RED ? pipNumber : 25 - pipNumber;
    };
    BoardData.prototype.increment = function (pipNumber, player, count) {
        return (this.data[BoardData.getPipIndex(pipNumber, player)][player] += (count || 1));
    };
    BoardData.prototype.decrement = function (pipNumber, player) {
        return --this.data[BoardData.getPipIndex(pipNumber, player)][player];
    };
    BoardData.prototype.getCounters = function (pipNumber, player) {
        return this.data[BoardData.getPipIndex(pipNumber, player)][player];
    };
    return BoardData;
})();
