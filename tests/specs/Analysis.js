'use strict';

define(['BoardComponents/Board', 'Analysis/BoardAnalyser', 'Enums'],
    function (Board, BoardAnalyser, Enums) {

        let PlayerId = Enums.PlayerId;
        let PointId = Enums.PointId;

        describe('Analysis: BoardAnalyser', function () {

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
                var possibleGoes = BoardAnalyser.BoardAnalyser.getPossibleGoes(startingBoard, PlayerId.BLACK, 5, 5);

                expect(possibleGoes.length).toBe(15);
            });

            it('should use all 4 moves if possible when double is thrown', function () {
                var possibleGoes = BoardAnalyser.BoardAnalyser.getPossibleGoes(startingBoard, PlayerId.BLACK, 5, 5);

                for (var i = 0; i < possibleGoes.length; i++) {
                    expect(possibleGoes[i].moves.length).toBe(4);
                }
            });

            it('should use 2 moves if possible when non-double is thrown', function () {
                var possibleGoes = BoardAnalyser.BoardAnalyser.getPossibleGoes(startingBoard, PlayerId.BLACK, 1, 3);

                for (var i = 0; i < possibleGoes.length; i++) {
                    expect(possibleGoes[i].moves.length).toBe(2);
                }
            });

            it('isRace should return false when board is not a race', function () {
                expect(BoardAnalyser.BoardAnalyser.isRace(startingBoard)).toBe(false);
            });

            it('isRace should return true when board is a race', function () {
                expect(BoardAnalyser.BoardAnalyser.isRace(raceConditionBoard)).toBe(true);
            });
        });
    });
