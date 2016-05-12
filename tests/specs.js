'use strict';

var board;

describe('Backgammon', function () {

    beforeEach(function () {
        
        let ui = new GameUI('backgammon');
        board = new Board(ui.boardUI);
        let dice = new Dice(new DiceRollGenerator(), ui.blackDiceUI, ui.redDiceUI);
        dice.roll(Player.BLACK);
        
        let statusLogger = new StatusLogger(ui.statusUI);

        new Game(ui, board, dice, statusLogger, Player.BLACK);
    });

    it('should initialise a standard starting board', function () {
        expect(board.checkerContainers[24].checkers[Player.RED]).toBe(2);
        expect(board.checkerContainers[24].checkers[Player.BLACK]).toBe(0);
    });
    
    it('should detect illegal and legal moves for Red', function () {

        // test for Red
        expect(board.checkerContainers[24].checkers[Player.RED]).toBe(2);

        var isLegal1 = board.isLegalMove(Player.RED, 24, 6);
        expect(isLegal1).toBe(true);
        var isLegal2 = board.isLegalMove(Player.RED, 24, 5);
        expect(isLegal2).toBe(false); // end pip is blocked

        var isLegal3 = board.isLegalMove(Player.RED, 23, 1);
        expect(isLegal3).toBe(false); // start pip contains no counter

    });

    it('should detect illegal and legal moves for Black', function () {

        // test for Black
        expect(board.checkerContainers[1].checkers[Player.BLACK]).toBe(2);
        var isLegal1 = board.isLegalMove(Player.BLACK, 1, 6);
        expect(isLegal1).toBe(true);
        var isLegal2 = board.isLegalMove(Player.BLACK, 1, 5);
        expect(isLegal2).toBe(false); // end pip is blocked

        var isLegal3 = board.isLegalMove(Player.BLACK, 2, 1);
        expect(isLegal3).toBe(false); // start pip contains no counter

    });

    it('should be able to move a Red counter', function () {

        expect(board.checkerContainers[24].checkers[Player.RED]).toBe(2);
        expect(board.checkerContainers[18].checkers[Player.RED]).toBe(0);
        var legal = board.move(Player.RED, 24, 6);
        expect(legal).toBe(true);
        expect(board.checkerContainers[24].checkers[Player.RED]).toBe(1);
        expect(board.checkerContainers[18].checkers[Player.RED]).toBe(1);

    });


    it('should be able to move a Black counter', function () {
        
        expect(board.checkerContainers[17].checkers[Player.BLACK]).toBe(3);
        expect(board.checkerContainers[19].checkers[Player.BLACK]).toBe(5);
        var legal = board.move(Player.BLACK, 17, 2);
        expect(legal).toBe(true);
        expect(board.checkerContainers[17].checkers[Player.BLACK]).toBe(2);
        expect(board.checkerContainers[19].checkers[Player.BLACK]).toBe(6);

    });


    it('should put Black on the bar when Red hits it', function () {

        // move Black to 22
        board.move(Player.BLACK, 17, 5);
        // move Red to 22
        board.move(Player.RED, 24, 2);
        expect(board.checkerContainers[22].checkers[Player.BLACK]).toBe(0);
        expect(board.checkerContainers[22].checkers[Player.RED]).toBe(1);

        expect(board.checkerContainers[PointId.BAR].checkers[Player.BLACK]).toBe(1);

        // now Black cannot make any moves except from the bar:
        expect(board.isLegalMove(Player.BLACK, 17, 5)).toBe(false);
        expect(board.isLegalMove(Player.BLACK, 17, 6)).toBe(false);
        expect(board.isLegalMove(Player.BLACK, PointId.BAR, 6)).toBe(false);
        expect(board.isLegalMove(Player.BLACK, PointId.BAR, 5)).toBe(true);
        expect(board.isLegalMove(Player.BLACK, PointId.BAR, 1)).toBe(true);
        
        // do the move
        expect(board.move(Player.BLACK, PointId.BAR, 1)).toBe(true);

    });


    it('should put Red on the bar when Black hits it', function () {

        // move Red to 3
        board.move(Player.RED, 8, 5);
        // move Black to 3
        board.move(Player.BLACK, 1, 2);
        expect(board.checkerContainers[3].checkers[Player.RED]).toBe(0);
        expect(board.checkerContainers[3].checkers[Player.BLACK]).toBe(1);

        expect(board.checkerContainers[PointId.BAR].checkers[Player.RED]).toBe(1);

        // now Red cannot make any moves except from the bar:
        expect(board.isLegalMove(Player.RED, 8, 5)).toBe(false);
        expect(board.isLegalMove(Player.RED, 8, 6)).toBe(false);
        expect(board.isLegalMove(Player.RED, PointId.BAR, 6)).toBe(false);
        expect(board.isLegalMove(Player.RED, PointId.BAR, 5)).toBe(true);
        expect(board.isLegalMove(Player.RED, PointId.BAR, 1)).toBe(true);
        
        // do the move
        expect(board.move(Player.RED, PointId.BAR, 1)).toBe(true);

    });


    it('should not allow to bear off until all in home board', function () {

        expect(board.isLegalMove(Player.BLACK, 19, 6)).toBe(false);
        
        // move pieces into home board
        board.move(Player.BLACK, 1, 6);
        board.move(Player.BLACK, 1, 6);
        board.move(Player.BLACK, 7, 5);
        board.move(Player.BLACK, 7, 5);
        board.move(Player.BLACK, 12, 6);
        board.move(Player.BLACK, 12, 6);
        board.move(Player.BLACK, 12, 6);
        board.move(Player.BLACK, 12, 6);
        board.move(Player.BLACK, 12, 6);
        board.move(Player.BLACK, 12, 6);
        board.move(Player.BLACK, 12, 6);
        board.move(Player.BLACK, 17, 6);
        board.move(Player.BLACK, 17, 6);
        board.move(Player.BLACK, 17, 6);
        board.move(Player.BLACK, 18, 5);
        board.move(Player.BLACK, 18, 5);
        board.move(Player.BLACK, 18, 5);
        board.move(Player.BLACK, 18, 5);
        board.move(Player.BLACK, 18, 5);
        board.move(Player.BLACK, 18, 5);
        board.move(Player.BLACK, 18, 5);

        // now should be home dry
        expect(board.isLegalMove(Player.BLACK, 19, 6)).toBe(true);
        
        expect(board.move(Player.BLACK, 19, 6)).toBe(true);
        expect(board.move(Player.BLACK, 19, 6)).toBe(true);
        expect(board.move(Player.BLACK, 19, 6)).toBe(true);
        expect(board.move(Player.BLACK, 19, 6)).toBe(true);
        // leave one checker on 19
        // 23s now have to be dead hits to bear off
        expect(board.move(Player.BLACK, 23, 2)).toBe(true);
        expect(board.move(Player.BLACK, 23, 2)).toBe(true);
        expect(board.move(Player.BLACK, 23, 2)).toBe(true);

        // now Red hits Black onto the bar
        expect(board.move(Player.RED, 24, 5)).toBe(true);

        expect(board.move(Player.BLACK, 23, 6)).toBe(false);

    });

});
