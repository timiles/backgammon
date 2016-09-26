'use strict';

define(['BoardComponents/Board', 'Players/ComputerPlayer', 'Enums'],
    function (Board, ComputerPlayer, Enums) {

        let PlayerId = Enums.PlayerId;
        let PointId = Enums.PointId;

        describe('ComputerPlayer', function () {

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
