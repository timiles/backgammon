var BoardData = (function () {
    function BoardData() {
        this.data = new Array(26);
        for (var i = 0; i < 26; i++) {
            this.data[i] = [0, 0];
        }
    }
    BoardData.getPipIndex = function (pipNumber, player) {
        // special pips:
        if ((pipNumber == 0) || (pipNumber == 25)) {
            return pipNumber;
        }
        // otherwise invert board if we are black
        return player == Player.RED ? pipNumber : 25 - pipNumber;
    };
    BoardData.prototype.increment = function (pipNumber, player) {
        return ++this.data[BoardData.getPipIndex(pipNumber, player)][player];
    };
    BoardData.prototype.decrement = function (pipNumber, player) {
        return --this.data[BoardData.getPipIndex(pipNumber, player)][player];
    };
    BoardData.prototype.getCounters = function (pipNumber, player) {
        return this.data[BoardData.getPipIndex(pipNumber, player)][player];
    };
    return BoardData;
})();
