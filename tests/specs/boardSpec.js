'use strict';

define(['BoardComponents/Board', 'Dice', 'DiceRollGenerator', 'Enums', 'Game', 'UI/GameUI', 'StatusLogger', 'Move'],
    function (Board, Dice, DiceRollGenerator, Enums, Game, GameUI, StatusLogger, Move) {

        let PlayerId = Enums.PlayerId;
        let PointId = Board.PointId;

        describe('Backgammon', function () {

            var game;
            var board;

            beforeEach(function () {

                board = new Board.Board();
                let ui = new GameUI.GameUI('backgammon', board);
                board.initialise();

                let dice = new Dice.Dice(new DiceRollGenerator.DiceRollGenerator(), ui.blackDiceUI, ui.redDiceUI);
                dice.roll(PlayerId.BLACK);

                let statusLogger = new StatusLogger.StatusLogger(ui.statusUI);

                game = new Game.Game(board, dice, statusLogger);
            });

            it('should initialise a standard starting board', function () {
                expect(board.checkerContainers[24].checkers[PlayerId.RED]).toBe(2);
                expect(board.checkerContainers[24].checkers[PlayerId.BLACK]).toBe(0);
            });

            it('should detect illegal and legal moves for Red', function () {

                // test for Red
                expect(board.checkerContainers[24].checkers[PlayerId.RED]).toBe(2);
                expect(board.isLegalMove(new Move.Move(PlayerId.RED, 24, 6))).toBe(true);
                // end pip is blocked
                expect(board.isLegalMove(new Move.Move(PlayerId.RED, 24, 5))).toBe(false);
                // start pip contains no counter
                expect(board.isLegalMove(new Move.Move(PlayerId.RED, 23, 1))).toBe(false);

            });

            it('should detect illegal and legal moves for Black', function () {

                // test for Black
                expect(board.checkerContainers[1].checkers[PlayerId.BLACK]).toBe(2);
                expect(board.isLegalMove(new Move.Move(PlayerId.BLACK, 1, 6))).toBe(true);
                // end pip is blocked
                expect(board.isLegalMove(new Move.Move(PlayerId.BLACK, 1, 5))).toBe(false); 
                // start pip contains no counter
                expect(board.isLegalMove(new Move.Move(PlayerId.BLACK, 2, 1))).toBe(false); 

            });

            it('should be able to move a Red counter', function () {

                expect(board.checkerContainers[24].checkers[PlayerId.RED]).toBe(2);
                expect(board.checkerContainers[18].checkers[PlayerId.RED]).toBe(0);
                var legal = board.move(new Move.Move(PlayerId.RED, 24, 6));
                expect(legal).toBe(true);
                expect(board.checkerContainers[24].checkers[PlayerId.RED]).toBe(1);
                expect(board.checkerContainers[18].checkers[PlayerId.RED]).toBe(1);

            });


            it('should be able to move a Black counter', function () {

                expect(board.checkerContainers[17].checkers[PlayerId.BLACK]).toBe(3);
                expect(board.checkerContainers[19].checkers[PlayerId.BLACK]).toBe(5);
                var legal = board.move(new Move.Move(PlayerId.BLACK, 17, 2));
                expect(legal).toBe(true);
                expect(board.checkerContainers[17].checkers[PlayerId.BLACK]).toBe(2);
                expect(board.checkerContainers[19].checkers[PlayerId.BLACK]).toBe(6);

            });


            it('should put Black on the bar when Red hits it', function () {

                // move Black to 22
                board.move(new Move.Move(PlayerId.BLACK, 17, 5));
                // move Red to 22
                board.move(new Move.Move(PlayerId.RED, 24, 2));
                expect(board.checkerContainers[22].checkers[PlayerId.BLACK]).toBe(0);
                expect(board.checkerContainers[22].checkers[PlayerId.RED]).toBe(1);

                expect(board.checkerContainers[PointId.BAR].checkers[PlayerId.BLACK]).toBe(1);

                // now Black cannot make any moves except from the bar:
                expect(board.isLegalMove(new Move.Move(PlayerId.BLACK, 17, 5))).toBe(false);
                expect(board.isLegalMove(new Move.Move(PlayerId.BLACK, 17, 6))).toBe(false);
                expect(board.isLegalMove(new Move.Move(PlayerId.BLACK, PointId.BAR, 6))).toBe(false);
                expect(board.isLegalMove(new Move.Move(PlayerId.BLACK, PointId.BAR, 5))).toBe(true);
                expect(board.isLegalMove(new Move.Move(PlayerId.BLACK, PointId.BAR, 1))).toBe(true);

                // do the move
                expect(board.move(new Move.Move(PlayerId.BLACK, PointId.BAR, 1))).toBe(true);

            });


            it('should put Red on the bar when Black hits it', function () {

                // move Red to 3
                board.move(new Move.Move(PlayerId.RED, 8, 5));
                // move Black to 3
                board.move(new Move.Move(PlayerId.BLACK, 1, 2));
                expect(board.checkerContainers[3].checkers[PlayerId.RED]).toBe(0);
                expect(board.checkerContainers[3].checkers[PlayerId.BLACK]).toBe(1);

                expect(board.checkerContainers[PointId.BAR].checkers[PlayerId.RED]).toBe(1);

                // now Red cannot make any moves except from the bar:
                expect(board.isLegalMove(new Move.Move(PlayerId.RED, 8, 5))).toBe(false);
                expect(board.isLegalMove(new Move.Move(PlayerId.RED, 8, 6))).toBe(false);
                expect(board.isLegalMove(new Move.Move(PlayerId.RED, PointId.BAR, 6))).toBe(false);
                expect(board.isLegalMove(new Move.Move(PlayerId.RED, PointId.BAR, 5))).toBe(true);
                expect(board.isLegalMove(new Move.Move(PlayerId.RED, PointId.BAR, 1))).toBe(true);

                // do the move
                expect(board.move(new Move.Move(PlayerId.RED, PointId.BAR, 1))).toBe(true);

            });


            it('should not allow to bear off until all in home board', function () {

                expect(board.isLegalMove(new Move.Move(PlayerId.BLACK, 19, 6))).toBe(false);

                // move pieces into home board
                board.move(new Move.Move(PlayerId.BLACK, 1, 6));
                board.move(new Move.Move(PlayerId.BLACK, 1, 6));
                board.move(new Move.Move(PlayerId.BLACK, 7, 5));
                board.move(new Move.Move(PlayerId.BLACK, 7, 5));
                board.move(new Move.Move(PlayerId.BLACK, 12, 6));
                board.move(new Move.Move(PlayerId.BLACK, 12, 6));
                board.move(new Move.Move(PlayerId.BLACK, 12, 6));
                board.move(new Move.Move(PlayerId.BLACK, 12, 6));
                board.move(new Move.Move(PlayerId.BLACK, 12, 6));
                board.move(new Move.Move(PlayerId.BLACK, 12, 6));
                board.move(new Move.Move(PlayerId.BLACK, 12, 6));
                board.move(new Move.Move(PlayerId.BLACK, 17, 6));
                board.move(new Move.Move(PlayerId.BLACK, 17, 6));
                board.move(new Move.Move(PlayerId.BLACK, 17, 6));
                board.move(new Move.Move(PlayerId.BLACK, 18, 5));
                board.move(new Move.Move(PlayerId.BLACK, 18, 5));
                board.move(new Move.Move(PlayerId.BLACK, 18, 5));
                board.move(new Move.Move(PlayerId.BLACK, 18, 5));
                board.move(new Move.Move(PlayerId.BLACK, 18, 5));
                board.move(new Move.Move(PlayerId.BLACK, 18, 5));
                board.move(new Move.Move(PlayerId.BLACK, 18, 5));

                // now should be home dry
                expect(board.isLegalMove(new Move.Move(PlayerId.BLACK, 19, 6))).toBe(true);

                expect(board.move(new Move.Move(PlayerId.BLACK, 19, 6))).toBe(true);
                expect(board.move(new Move.Move(PlayerId.BLACK, 19, 6))).toBe(true);
                expect(board.move(new Move.Move(PlayerId.BLACK, 19, 6))).toBe(true);
                expect(board.move(new Move.Move(PlayerId.BLACK, 19, 6))).toBe(true);
                // leave one checker on 19
                // 23s now have to be dead hits to bear off
                expect(board.move(new Move.Move(PlayerId.BLACK, 23, 2))).toBe(true);
                expect(board.move(new Move.Move(PlayerId.BLACK, 23, 2))).toBe(true);
                expect(board.move(new Move.Move(PlayerId.BLACK, 23, 2))).toBe(true);

                // now Red hits Black onto the bar
                expect(board.move(new Move.Move(PlayerId.RED, 24, 5))).toBe(true);

                expect(board.move(new Move.Move(PlayerId.BLACK, 23, 6))).toBe(false);

            });

        });
    });
