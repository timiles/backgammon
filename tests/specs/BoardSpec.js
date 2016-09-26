'use strict';

define(['BoardComponents/Board', 'Enums', 'Move'],
    function (Board, Enums, Move) {

        let PlayerId = Enums.PlayerId;
        let PointId = Enums.PointId;

        describe('Board', function () {

            var board;

            beforeEach(function () {

                board = new Board.Board();
                board.initialise();
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


            it('should not allow to bear off if not all in home board', function () {

                expect(board.isLegalMove(new Move.Move(PlayerId.BLACK, 19, 6))).toBe(false);
            });

            it('should allow to bear off if all in home board', function () {

                // re-initialise board with BLACK all in home board
                board = new Board.Board();
                board.initialise([[0, 0],
                    [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 5],
                    [0, 0], [0, 3], [0, 0], [0, 0], [0, 0], [0, 0],
                    [0, 5], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
                    [5, 0], [0, 0], [0, 0], [0, 0], [10, 0], [0, 2],
                    [0, 0]]);

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
