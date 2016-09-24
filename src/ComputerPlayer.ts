import { Board } from './Board'
import { PointId } from './Board'
import { BoardEvaluator } from './BoardEvaluator'
import { Dice } from './Dice'
import { PlayerId } from './Enums'
import { Player } from './Player'
import { PossibleGo } from './PossibleGo'
import { StatusLogger } from './StatusLogger'

export class ComputerPlayer extends Player {

    private safetyFactor: number;
    private clusteringFactor: number;
    private offensiveFactor: number;
    private reentryFactor: number;

    constructor(playerId: PlayerId, board: Board) {
        super(playerId, board);

        this.safetyFactor = 1;
        this.clusteringFactor = 1;
        this.offensiveFactor = 1;
        this.reentryFactor = 1;
    }

    public getBestPossibleGo(die1Value: number, die2Value: number): PossibleGo {
        let possibleGoes = BoardEvaluator.getPossibleGoes(this.board, this.playerId, die1Value, die2Value);

        if (possibleGoes.length === 0) {
            console.info('No possible go');
            return null;
        }

        let maxScore = 0;
        let maxScoreIndex = 0;
        for (let i = 0; i < possibleGoes.length; i++) {
            let score = this.evaluateBoard(possibleGoes[i].resultantBoard);
            // greater than or equal: bias towards further on moves
            if (score >= maxScore) {
                maxScore = score;
                maxScoreIndex = i;
            }
        }
        return possibleGoes[maxScoreIndex];
    }

    private evaluateBoard(b: Board): number {
        return this.evaluateSafety(b) * this.safetyFactor +
            this.evaluateClustering(b) * this.clusteringFactor +
            this.evaluateOffensive(b) * this.offensiveFactor;
    }

    /**
     * return score of how safe the stones are.
     */
    private evaluateSafety(b: Board): number {
        // if the game is a race, safety is irrelevant
        if (BoardEvaluator.isRace(b)) {
            return 0;
        }

        let score = 100;
        let direction = (this.playerId === PlayerId.BLACK) ? 1 : -1;
        let homePointId = (this.playerId === PlayerId.BLACK) ? 25 : 0;

        for (let pointId = 1; pointId <= 24; pointId++) {
            if (b.checkerContainers[pointId].checkers[this.playerId] === 1) {
                // TODO: factor safety on prob of opp hitting this piece
                let distanceOfBlotToHome = (homePointId - pointId) * direction;
                let relativePenaltyOfLosingThisBlot = distanceOfBlotToHome / 24; 
                score *= (.75 * relativePenaltyOfLosingThisBlot);
            }
        }

        return score;
    }

    /**
     * return score of how clustered the towers are.
     */
    private evaluateClustering(b: Board): number {
        let score = 0;
        // number of towers
        // proximity of towers

        return score;
    }

    /**
     * offensive: putting opponent onto bar
     */
    private evaluateOffensive(b: Board): number {
        let otherPlayerId = (this.playerId + 1) % 2;

        switch (b.checkerContainers[PointId.BAR].checkers[otherPlayerId]) {
            case 0: return 0;
            case 1: return 65;
            default: return 100;
        }
    }

}