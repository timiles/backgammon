import { Board } from '../BoardComponents/Board'
import { Dice } from '../DiceComponents/Dice'
import { PlayerId } from '../Enums'
import { Move } from '../Move'
import { PossibleGo } from './PossibleGo'

export class BoardAnalyser {

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

    static getPossibleGoes(board: Board, playerId: PlayerId, die1Value: number, die2Value: number): Array<PossibleGo> {
        let possibleGoes = new Array<PossibleGo>();

        // 1. double number thrown.
        if (die1Value === die2Value) {
            let points = die1Value;

            let testBoard = new Array<Board>(4);
            let numOfMoves = 0;

            // 25: include bar
            for (let i1 = 1; i1 <= 25; i1++) {
                testBoard[0] = BoardAnalyser.clone(board);

                let move1 = new Move(playerId, i1, points);
                if (!testBoard[0].move(move1)) {
                    continue;
                }

                possibleGoes.push(new PossibleGo([move1], testBoard[0]));

                for (let i2 = 1; i2 <= 25; i2++) {
                    testBoard[1] = BoardAnalyser.clone(testBoard[0]);

                    let move2 = new Move(playerId, i2, points);
                    if (!testBoard[1].move(move2)) {
                        continue;
                    }

                    possibleGoes.push(new PossibleGo([move1, move2], testBoard[1]));

                    for (let i3 = 1; i3 <= 25; i3++) {
                        testBoard[2] = BoardAnalyser.clone(testBoard[1]);

                        let move3 = new Move(playerId, i3, points);
                        if (!testBoard[2].move(move3)) {
                            continue;
                        }

                        possibleGoes.push(new PossibleGo([move1, move2, move3], testBoard[2]));

                        for (let i4 = 1; i4 <= 25; i4++) {
                            testBoard[3] = BoardAnalyser.clone(testBoard[2]);

                            let move4 = new Move(playerId, i4, points);
                            if (testBoard[3].move(move4)) {
                                possibleGoes.push(new PossibleGo([move1, move2, move3, move4], testBoard[3]));
                            }
                        }
                    }
                }
            }
            return BoardAnalyser.getPossibleGoesThatUseMostDice(possibleGoes);
        }

        // 2. non-double thrown.
        let points = [die1Value, die2Value];

        for (let startPoint1 = 1; startPoint1 <= 25; startPoint1++) {
            for (let die = 0; die < 2; die++) {
                let testBoard1 = BoardAnalyser.clone(board);

                let move1 = new Move(playerId, startPoint1, points[die]);
                if (testBoard1.move(move1)) {
                    if (!BoardAnalyser.canMove(testBoard1, playerId, points[(die + 1) % 2])) {
                        possibleGoes.push(new PossibleGo([move1], BoardAnalyser.clone(testBoard1)));
                        continue;
                    }
                    // else 
                    for (let startPoint2 = 1; startPoint2 <= 25; startPoint2++) {
                        let testBoard2 = BoardAnalyser.clone(testBoard1);

                        let move2 = new Move(playerId, startPoint2, points[(die + 1) % 2]);
                        if (testBoard2.move(move2)) {
                            possibleGoes.push(new PossibleGo([move1, move2], BoardAnalyser.clone(testBoard2)));
                            continue;
                        }
                    }
                }
            }
        }
        return BoardAnalyser.getPossibleGoesThatUseMostDice(possibleGoes);
    }

    private static clone(source: Board): Board {
        var clone = new Board();
        let layout = new Array<number[]>();
        for (let pointId = 0; pointId < 26; pointId++) {
            layout[pointId] = [source.checkerContainers[pointId].checkers[PlayerId.BLACK], source.checkerContainers[pointId].checkers[PlayerId.RED]] 
        }
        clone.initialise(layout);
        return clone;
    }

    private static canMove(board: Board, playerId: PlayerId, points: number): boolean {
        // 25: include bar
        for (let startingPoint = 1; startingPoint <= 25; startingPoint++) {
            if (board.isLegalMove(new Move(playerId, startingPoint, points))) {
                return true;
            }
        }
        return false;
    }

    private static getPossibleGoesThatUseMostDice(possibleGoes: Array<PossibleGo>): Array<PossibleGo> {
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