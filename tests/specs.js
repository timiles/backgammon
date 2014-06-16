'use strict';

var board;

describe('Backgammon', function () {

    beforeEach(function () {
        board = new Backgammon.Board('board');
    });

    it('should initialise a standard starting board', function () {
        expect(board.getPip(24)[Backgammon.Players.Red]).toBe(2);
        expect(board.getPip(24)[Backgammon.Players.Black]).toBe(0);
    });
});
