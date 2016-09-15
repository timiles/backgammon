/// <reference path="Board.ts"/>
/// <reference path="Enums.ts"/>
/// <reference path="Move.ts"/>
/// <reference path="PossibleGo.ts"/>

class BoardEvaluator {

    static isRace(board: Board): boolean {
        let playerId = 0;

        for (let pointId = 1; pointId <= 24; pointId++) {
            if (board.checkerContainers[pointId].checkers[playerId] > 0) {
                if (playerId === 0) {
                    // once we've found a checker of one player, switch and we'll look for the other
                    playerId++;
                }
                else {
                    return false;
                }
            }
        }

        return true;
    }

    static clone(source: Board): Board {
        var clone = new Board();
        let layout = new Array<number[]>();
        for (let pointId = 0; pointId < 26; pointId++) {
            layout[pointId] = [source.checkerContainers[pointId].checkers[PlayerId.BLACK], source.checkerContainers[pointId].checkers[PlayerId.RED]] 
        }
        clone.initialise(layout);
        return clone;
    }

    static getPossibleGoes(board: Board, playerId: PlayerId, d: Dice): Array<PossibleGo> {
        let possibleGoes = new Array<PossibleGo>();

        // 1. double number thrown.
        if (d.die1 === d.die2) {
            let points = d.die1.value;

            let testBoard = new Array<Board>(4);
            let numOfMoves = 0;

            // 25: include bar
            for (let i1 = 1; i1 <= 25; i1++) {
                testBoard[0] = BoardEvaluator.clone(board);

                if (!testBoard[0].move(playerId, i1, points)) {
                    continue;
                }

                possibleGoes.push(new PossibleGo([new Move(i1, points)], testBoard[0]));

                for (let i2 = 1; i2 <= 25; i2++) {
                    testBoard[1] = BoardEvaluator.clone(testBoard[0]);

                    if (!testBoard[1].move(playerId, i2, points)) {
                        continue;
                    }

                    possibleGoes.push(new PossibleGo([new Move(i1, points), new Move(i2, points)], testBoard[1]));

                    for (let i3 = 1; i3 <= 25; i3++) {
                        testBoard[2] = BoardEvaluator.clone(testBoard[1]);

                        if (!testBoard[2].move(playerId, i3, points)) {
                            continue;
                        }

                        possibleGoes.push(new PossibleGo([new Move(i1, points), new Move(i2, points), new Move(i3, points)], testBoard[2]));

                        for (let i4 = 1; i4 <= 25; i4++) {
                            testBoard[3] = BoardEvaluator.clone(testBoard[2]);

                            if (testBoard[3].move(playerId, i4, points)) {
                                possibleGoes.push(new PossibleGo([new Move(i1, points), new Move(i2, points), new Move(i3, points), new Move(i4, points)], testBoard[3]));
                            }
                        }
                    }
                }
            }
            return BoardEvaluator.getPossibleGoesThatUseMostDice(possibleGoes);
        }

        // 2. non-double thrown.
        let points = [d.die1.value, d.die2.value];

        for (let startPoint1 = 1; startPoint1 <= 25; startPoint1++) {
            for (let die = 0; die < 2; die++) {
                let testBoard1 = <Board>BoardEvaluator.clone(board);

                if (testBoard1.move(playerId, startPoint1, points[die])) {
                    if (!BoardEvaluator.canMove(testBoard1, playerId, points[(die + 1) % 2])) {
                        possibleGoes.push(new PossibleGo([new Move(startPoint1, points[die])], BoardEvaluator.clone(testBoard1)));
                        continue;
                    }
                    // else 
                    for (let startPoint2 = 1; startPoint2 <= 25; startPoint2++) {
                        let testBoard2 = BoardEvaluator.clone(testBoard1);

                        if (testBoard2.move(playerId, startPoint2, points[(die + 1) % 2])) {
                            possibleGoes.push(new PossibleGo([new Move(startPoint1, points[die]), new Move(startPoint2, points[(die + 1) % 2])], BoardEvaluator.clone(testBoard2)));
                            continue;
                        }
                    }
                }
            }
        }
        return BoardEvaluator.getPossibleGoesThatUseMostDice(possibleGoes);
    }

    static canMove(board: Board, playerId: PlayerId, points: number): boolean {
        // 25: include bar
        for (let startingPoint = 1; startingPoint <= 25; startingPoint++) {
            if (board.isLegalMove(playerId, startingPoint, points)) {
                return true;
            }
        }
        return false;
    }

    static getPossibleGoesThatUseMostDice(possibleGoes: Array<PossibleGo>): Array<PossibleGo> {
        let max = 0;

        // 1. find move with most amount of dice used
        for (let i = 0; i < possibleGoes.length; i++) {
            max = Math.max(max, possibleGoes[i].moves.length);
        }

        let goesThatUseMostDice = new Array<PossibleGo>();

        // 2. copy into new array all with length of max
        for (let i = 0; i < possibleGoes.length; i++) {
            if (possibleGoes[i].moves.length === max) {
                goesThatUseMostDice.push(possibleGoes[i]);
            }
        }

        return goesThatUseMostDice;
    }

}