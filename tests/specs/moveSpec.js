'use strict';

define(['BoardComponents/Board', 'Enums', 'Move'],
    function (Board, Enums, Move) {

        let PlayerId = Enums.PlayerId;
        let PointId = Board.PointId;

        describe('Move', function () {

            it('should initialise constructor params', function () {
                let move = new Move.Move(PlayerId.RED, 13, 5);
                expect(move.playerId).toBe(PlayerId.RED);
                expect(move.sourcePointId).toBe(13);
                expect(move.numberOfPointsToMove).toBe(5);
            });

            it('should calculate destinationPointId correctly for Black', function () {
                for (let sourcePointId = 0; sourcePointId <= 24; sourcePointId++) {
                    for (let numberOfPointsToMove = 1; numberOfPointsToMove <= 6; numberOfPointsToMove++) {
                        let move = new Move.Move(PlayerId.BLACK, sourcePointId, numberOfPointsToMove);

                        let expectedDestinationPointId = sourcePointId + numberOfPointsToMove;
                        if (expectedDestinationPointId > 24) {
                            // special case for bearing off
                            expectedDestinationPointId = PointId.HOME;
                        }
                        expect(move.getDestinationPointId()).toBe(expectedDestinationPointId);
                    }
                }
            });

            it('should calculate destinationPointId correctly for Red', function () {
                for (let sourcePointId = 0; sourcePointId <= 24; sourcePointId++) {
                    for (let numberOfPointsToMove = 1; numberOfPointsToMove <= 6; numberOfPointsToMove++) {
                        let move = new Move.Move(PlayerId.RED, sourcePointId, numberOfPointsToMove);

                        let expectedDestinationPointId = sourcePointId - numberOfPointsToMove;
                        if (expectedDestinationPointId < 1) {
                            // special case for bearing off
                            expectedDestinationPointId = PointId.HOME;
                        }
                        expect(move.getDestinationPointId()).toBe(expectedDestinationPointId);
                    }
                }
            });
            
        });
    });
