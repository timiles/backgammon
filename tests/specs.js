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
    
    it('should detect illegal and legal moves for Red', function () {

        // test for Red
        expect(board.getPip(24)[Backgammon.Players.Red]).toBe(2);

        var isLegal1 = board.testMoveCounter(24, 6);
        expect(isLegal1).toBe(true);
        var isLegal2 = board.testMoveCounter(24, 5);
        expect(isLegal2).toBe(false); // end pip is blocked

        var isLegal3 = board.testMoveCounter(23, 1);
        expect(isLegal3).toBe(false); // start pip contains no counter

    });

    it('should detect illegal and legal moves for Black', function () {

        // test for Black
        expect(board.getPip(1)[Backgammon.Players.Black]).toBe(2);
        var isLegal1 = board.testMoveCounter(1, 6);
        expect(isLegal1).toBe(true);
        var isLegal2 = board.testMoveCounter(1, 5);
        expect(isLegal2).toBe(false); // end pip is blocked

        var isLegal3 = board.testMoveCounter(2, 1);
        expect(isLegal3).toBe(false); // start pip contains no counter

    });

});
