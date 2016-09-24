'use strict';

define(['Board', 'BoardEvaluator', 'ComputerPlayer', 'Enums'],
    function (Board, BoardEvaluator, ComputerPlayer, Enums) {

        let PlayerId = Enums.PlayerId;
        let PointId = Board.PointId;

        describe('AI: BoardEvaluator', function () {

            var startingBoard;
            var raceConditionBoard;

            beforeEach(function () {
                startingBoard = new Board.Board();
                startingBoard.initialise();

                raceConditionBoard = new Board.Board();
                raceConditionBoard.initialise([[0, 0],
                    [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
                    [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 15],
                    [15, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
                    [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
                    [0, 0]]);
            });

            it('should find 15 possible starting moves with 5 & 5', function () {
                var possibleGoes = BoardEvaluator.BoardEvaluator.getPossibleGoes(startingBoard, PlayerId.BLACK, 5, 5);

                expect(possibleGoes.length).toBe(15);
            });

            it('should use all 4 moves if possible when double is thrown', function () {
                var possibleGoes = BoardEvaluator.BoardEvaluator.getPossibleGoes(startingBoard, PlayerId.BLACK, 5, 5);

                for (var i = 0; i < possibleGoes.length; i++) {
                    expect(possibleGoes[i].moves.length).toBe(4);
                }
            });

            it('should use 2 moves if possible when non-double is thrown', function () {
                var possibleGoes = BoardEvaluator.BoardEvaluator.getPossibleGoes(startingBoard, PlayerId.BLACK, 1, 3);

                for (var i = 0; i < possibleGoes.length; i++) {
                    expect(possibleGoes[i].moves.length).toBe(2);
                }
            });

            it('isRace should return false when board is not a race', function () {
                expect(BoardEvaluator.BoardEvaluator.isRace(startingBoard)).toBe(false);
            });

            it('isRace should return true when board is a race', function () {
                expect(BoardEvaluator.BoardEvaluator.isRace(raceConditionBoard)).toBe(true);
            });
        });

        describe('AI: ComputerPlayer', function () {

            var computerPlayer;

            beforeEach(function () {
                var board = new Board.Board();
                // use standard starting board
                board.initialise();
                computerPlayer = new ComputerPlayer.ComputerPlayer(PlayerId.BLACK, board);
            });

            it('should perform standard starting move for 6 & 1', function () {
                var bestPossibleGo = computerPlayer.getBestPossibleGo(6, 1);

                // opinion: 6 & 1 is best played to make a tower on 18
                expect(bestPossibleGo.moves[0].sourcePointId).toBe(17);
                expect(bestPossibleGo.moves[0].numberOfPointsToMove).toBe(1);
                expect(bestPossibleGo.moves[1].sourcePointId).toBe(12);
                expect(bestPossibleGo.moves[1].numberOfPointsToMove).toBe(6);
            });

            it('should perform standard starting move for 3 & 1', function () {
                var bestPossibleGo = computerPlayer.getBestPossibleGo(3, 1);

                // opinion: 3 & 1 is best played to make a tower on 20
                expect(bestPossibleGo.moves[0].sourcePointId).toBe(19);
                expect(bestPossibleGo.moves[0].numberOfPointsToMove).toBe(1);
                expect(bestPossibleGo.moves[1].sourcePointId).toBe(17);
                expect(bestPossibleGo.moves[1].numberOfPointsToMove).toBe(3);
            });

            it('should perform standard starting move for 6 & 5', function () {
                var bestPossibleGo = computerPlayer.getBestPossibleGo(6, 5);

                // opinion: 6 & 5 is best played to get a piece from 1 to 12
                expect(bestPossibleGo.moves[0].sourcePointId).toBe(1);
                expect(bestPossibleGo.moves[0].numberOfPointsToMove).toBe(6);
                expect(bestPossibleGo.moves[1].sourcePointId).toBe(7);
                expect(bestPossibleGo.moves[1].numberOfPointsToMove).toBe(5);
            });
        });
    });
