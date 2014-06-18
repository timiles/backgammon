'use strict';

var board;

describe('Backgammon', function () {

    beforeEach(function () {
        board = new Backgammon.Board('board');
    });

    it('should initialise a standard starting board', function () {
        expect(board.getPip(24)[Backgammon.CONSTANTS.RED]).toBe(2);
        expect(board.getPip(24)[Backgammon.CONSTANTS.BLACK]).toBe(0);
    });
    
    it('should detect illegal and legal moves for Red', function () {

        // test for Red
        expect(board.getPip(24)[Backgammon.CONSTANTS.RED]).toBe(2);

        var isLegal1 = board.isMoveLegal(Backgammon.CONSTANTS.RED, 24, 6);
        expect(isLegal1).toBe(true);
        var isLegal2 = board.isMoveLegal(Backgammon.CONSTANTS.RED, 24, 5);
        expect(isLegal2).toBe(false); // end pip is blocked

        var isLegal3 = board.isMoveLegal(Backgammon.CONSTANTS.RED, 23, 1);
        expect(isLegal3).toBe(false); // start pip contains no counter

    });

    it('should detect illegal and legal moves for Black', function () {

        // test for Black
        expect(board.getPip(1)[Backgammon.CONSTANTS.BLACK]).toBe(2);
        var isLegal1 = board.isMoveLegal(Backgammon.CONSTANTS.BLACK, 1, 6);
        expect(isLegal1).toBe(true);
        var isLegal2 = board.isMoveLegal(Backgammon.CONSTANTS.BLACK, 1, 5);
        expect(isLegal2).toBe(false); // end pip is blocked

        var isLegal3 = board.isMoveLegal(Backgammon.CONSTANTS.BLACK, 2, 1);
        expect(isLegal3).toBe(false); // start pip contains no counter

    });

    it('should be able to move a Red counter', function () {

        expect(board.getPip(24)[Backgammon.CONSTANTS.RED]).toBe(2);
        expect(board.getPip(18)[Backgammon.CONSTANTS.RED]).toBe(0);
        var legal = board.move(Backgammon.CONSTANTS.RED, 24, 6);
        expect(legal).toBe(true);
        expect(board.getPip(24)[Backgammon.CONSTANTS.RED]).toBe(1);
        expect(board.getPip(18)[Backgammon.CONSTANTS.RED]).toBe(1);

    });


    it('should be able to move a Black counter', function () {
        
        expect(board.getPip(17)[Backgammon.CONSTANTS.BLACK]).toBe(3);
        expect(board.getPip(19)[Backgammon.CONSTANTS.BLACK]).toBe(5);
        var legal = board.move(Backgammon.CONSTANTS.BLACK, 17, 2);
        expect(legal).toBe(true);
        expect(board.getPip(17)[Backgammon.CONSTANTS.BLACK]).toBe(2);
        expect(board.getPip(19)[Backgammon.CONSTANTS.BLACK]).toBe(6);

    });


    it('should put Black on the bar when Red hits it', function () {

        // move Black to 22
        board.move(Backgammon.CONSTANTS.BLACK, 17, 5);
        // move Red to 22
        board.move(Backgammon.CONSTANTS.RED, 24, 2);
        expect(board.getPip(22)[Backgammon.CONSTANTS.BLACK]).toBe(0);
        expect(board.getPip(22)[Backgammon.CONSTANTS.RED]).toBe(1);

        expect(board.getPip(Backgammon.CONSTANTS.BAR)[Backgammon.CONSTANTS.BLACK]).toBe(1);

        // now Black cannot make any moves except from the bar:
        expect(board.isMoveLegal(Backgammon.CONSTANTS.BLACK, 17, 5)).toBe(false);
        expect(board.isMoveLegal(Backgammon.CONSTANTS.BLACK, 17, 6)).toBe(false);
        expect(board.isMoveLegal(Backgammon.CONSTANTS.BLACK, Backgammon.CONSTANTS.BAR, 6)).toBe(false);
        expect(board.isMoveLegal(Backgammon.CONSTANTS.BLACK, Backgammon.CONSTANTS.BAR, 5)).toBe(true);
        expect(board.isMoveLegal(Backgammon.CONSTANTS.BLACK, Backgammon.CONSTANTS.BAR, 1)).toBe(true);
        
        // do the move
        expect(board.move(Backgammon.CONSTANTS.BLACK, Backgammon.CONSTANTS.BAR, 1)).toBe(true);

    });


    it('should put Red on the bar when Black hits it', function () {

        // move Red to 3
        board.move(Backgammon.CONSTANTS.RED, 8, 5);
        // move Black to 3
        board.move(Backgammon.CONSTANTS.BLACK, 1, 2);
        expect(board.getPip(3)[Backgammon.CONSTANTS.RED]).toBe(0);
        expect(board.getPip(3)[Backgammon.CONSTANTS.BLACK]).toBe(1);

        expect(board.getPip(Backgammon.CONSTANTS.BAR)[Backgammon.CONSTANTS.RED]).toBe(1);

        // now Red cannot make any moves except from the bar:
        expect(board.isMoveLegal(Backgammon.CONSTANTS.RED, 8, 5)).toBe(false);
        expect(board.isMoveLegal(Backgammon.CONSTANTS.RED, 8, 6)).toBe(false);
        expect(board.isMoveLegal(Backgammon.CONSTANTS.RED, Backgammon.CONSTANTS.BAR, 6)).toBe(false);
        expect(board.isMoveLegal(Backgammon.CONSTANTS.RED, Backgammon.CONSTANTS.BAR, 5)).toBe(true);
        expect(board.isMoveLegal(Backgammon.CONSTANTS.RED, Backgammon.CONSTANTS.BAR, 1)).toBe(true);
        
        // do the move
        expect(board.move(Backgammon.CONSTANTS.RED, Backgammon.CONSTANTS.BAR, 1)).toBe(true);

    });


    it('should not allow to bear off until all in home board', function () {

        expect(board.isMoveLegal(Backgammon.CONSTANTS.BLACK, 19, 6)).toBe(false);
        
        // move pieces into home board
        board.move(Backgammon.CONSTANTS.BLACK, 1, 6);
        board.move(Backgammon.CONSTANTS.BLACK, 1, 6);
        board.move(Backgammon.CONSTANTS.BLACK, 7, 5);
        board.move(Backgammon.CONSTANTS.BLACK, 7, 5);
        board.move(Backgammon.CONSTANTS.BLACK, 12, 6);
        board.move(Backgammon.CONSTANTS.BLACK, 12, 6);
        board.move(Backgammon.CONSTANTS.BLACK, 12, 6);
        board.move(Backgammon.CONSTANTS.BLACK, 12, 6);
        board.move(Backgammon.CONSTANTS.BLACK, 12, 6);
        board.move(Backgammon.CONSTANTS.BLACK, 12, 6);
        board.move(Backgammon.CONSTANTS.BLACK, 12, 6);
        board.move(Backgammon.CONSTANTS.BLACK, 17, 6);
        board.move(Backgammon.CONSTANTS.BLACK, 17, 6);
        board.move(Backgammon.CONSTANTS.BLACK, 17, 6);
        board.move(Backgammon.CONSTANTS.BLACK, 18, 5);
        board.move(Backgammon.CONSTANTS.BLACK, 18, 5);
        board.move(Backgammon.CONSTANTS.BLACK, 18, 5);
        board.move(Backgammon.CONSTANTS.BLACK, 18, 5);
        board.move(Backgammon.CONSTANTS.BLACK, 18, 5);
        board.move(Backgammon.CONSTANTS.BLACK, 18, 5);
        board.move(Backgammon.CONSTANTS.BLACK, 18, 5);

        // now should be home dry
        expect(board.isMoveLegal(Backgammon.CONSTANTS.BLACK, 19, 6)).toBe(true);
        
        expect(board.move(Backgammon.CONSTANTS.BLACK, 19, 6)).toBe(true);
        expect(board.move(Backgammon.CONSTANTS.BLACK, 19, 6)).toBe(true);
        expect(board.move(Backgammon.CONSTANTS.BLACK, 19, 6)).toBe(true);
        expect(board.move(Backgammon.CONSTANTS.BLACK, 19, 6)).toBe(true);
        expect(board.move(Backgammon.CONSTANTS.BLACK, 23, 6)).toBe(true);
        expect(board.move(Backgammon.CONSTANTS.BLACK, 23, 6)).toBe(true);
        expect(board.move(Backgammon.CONSTANTS.BLACK, 23, 6)).toBe(true);

        // now Red hits Black onto the bar
        expect(board.move(Backgammon.CONSTANTS.RED, 24, 5)).toBe(true);

        expect(board.move(Backgammon.CONSTANTS.BLACK, 23, 6)).toBe(false);

    });

});
