import { Bar } from './Bar'
import { CheckerContainer } from './CheckerContainer'
import { PlayerId, PointId } from './Enums'
import { Game } from './Game'
import { Home } from './Home'
import { Point } from './Point'
import { Move } from '../Move'

export class Board {

    checkerContainers: Array<CheckerContainer>;

    onPointInspected: (pointId: number, on: boolean) => void;
    onPointSelected: (pointId: number) => void;

    onCheckerCountChanged: (pointId: number, playerId: PlayerId, count: number) => void;
    onSetBarAsSelected: (playerId: PlayerId, on: boolean) => void;
    onSetPointAsSelected: (pointId: number, on: boolean) => void;
    onSetHomeAsValidDestination: (playerId: PlayerId, on: boolean) => void;
    onSetPointAsValidDestination: (pointId: number, on: boolean) => void;
    onSetBarAsValidSource: (playerId: PlayerId, on: boolean) => void;
    onSetPointAsValidSource: (pointId: number, on: boolean) => void;

    constructor() {

        this.checkerContainers = new Array(26);

        let home = new Home();
        home.onIncrement = (playerId: PlayerId, count: number) => {
            if (this.onCheckerCountChanged) {
                this.onCheckerCountChanged(PointId.HOME, playerId, count);
            }
        };
        home.onSetValidDestination = (playerId: PlayerId, on: boolean) => {
            if (this.onSetHomeAsValidDestination) {
                this.onSetHomeAsValidDestination(playerId, on);
            }
        }
        this.checkerContainers[PointId.HOME] = home;

        let createPoint = (pointId: number): Point => {
            let point = new Point(pointId);
            point.onCheckerCountChanged = (playerId: PlayerId, count: number) => {
                if (this.onCheckerCountChanged) {
                    this.onCheckerCountChanged(pointId, playerId, count);
                }
            };
            point.onSetSelected = (on: boolean) => {
                if (this.onSetPointAsSelected) {
                    this.onSetPointAsSelected(pointId, on);
                }
            };
            point.onSetValidDestination = (on: boolean) => {
                if (this.onSetPointAsValidDestination) {
                    this.onSetPointAsValidDestination(pointId, on);
                }
            };
            point.onSetValidSource = (on: boolean) => {
                if (this.onSetPointAsValidSource) {
                    this.onSetPointAsValidSource(pointId, on);
                }
            };
            return point;
        }
        for (let i = 1; i < 25; i++) {
            this.checkerContainers[i] = createPoint(i);
        }


        let bar = new Bar();
        bar.onCheckerCountChanged = (playerId: PlayerId, count: number) => {
            if (this.onCheckerCountChanged) {
                this.onCheckerCountChanged(PointId.BAR, playerId, count);
            }
        }
        bar.onSetSelected = (playerId: PlayerId, on: boolean) => {
            if (this.onSetBarAsSelected) {
                this.onSetBarAsSelected(playerId, on);
            }
        }
        bar.onSetValidSource = (playerId: PlayerId, on: boolean) => {
            if (this.onSetBarAsValidSource) {
                this.onSetBarAsValidSource(playerId, on);
            }
        }
        this.checkerContainers[PointId.BAR] = bar;
    }

    initialise(layout?: number[][]): void {
        if (layout === undefined) {
            layout = [[0, 0],
                [2, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 5],
                [0, 0], [0, 3], [0, 0], [0, 0], [0, 0], [5, 0],
                [0, 5], [0, 0], [0, 0], [0, 0], [3, 0], [0, 0],
                [5, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 2],
                [0, 0]];
        }

        for (let pointId = 0; pointId < 26; pointId++) {
            for (let playerId of [PlayerId.BLACK, PlayerId.RED]) {
                let checkerCount = layout[pointId][playerId];
                if (checkerCount > 0) {
                    this.increment(playerId, pointId, checkerCount);
                }
            }
        }
    }

    decrement(player: PlayerId, pointId: number): void {
        this.checkerContainers[pointId].decrement(player);
    }

    increment(player: PlayerId, pointId: number, count?: number): void {
        this.checkerContainers[pointId].increment(player, count || 1);
    }

    isLegalMove(move: Move): boolean {

        // case: there is no counter to move: fail
        if (this.checkerContainers[move.sourcePointId].checkers[move.playerId] == 0) {
            // console.info('no counter at ' + sourcePointId);
            return false;
        }

        // case: there is a counter on the bar, and this is not it
        if ((move.sourcePointId != PointId.BAR) && (this.checkerContainers[PointId.BAR].checkers[move.playerId] > 0)) {
            // console.info('must move counter off bar first');
            return false;
        }

        // case: bearing off
        let destinationPointId = move.getDestinationPointId();
        if (destinationPointId === PointId.HOME) {
            // check that there are no checkers outside of home board. (BAR has already been checked above)
            const startingPointOfOuterBoard = (move.playerId === PlayerId.BLACK) ? 1 : 24;
            const totalPointsOfOuterBoard = 18;
            const direction = (move.playerId === PlayerId.BLACK) ? 1 : -1;
            for (let offset = 0; offset < totalPointsOfOuterBoard; offset++) {
                if (this.checkerContainers[startingPointOfOuterBoard + (direction * offset)].checkers[move.playerId] > 0) {
                    return false;
                }
            }

            // check that there are no checkers more deserving of this dice roll
            let actualDestinationPointId = move.sourcePointId + (direction * move.numberOfPointsToMove);
            // if it's dead on, we're fine.
            if (actualDestinationPointId === 0 || actualDestinationPointId === 25) {
                return true;
            }

            const startingPointOfHomeBoard = (move.playerId === PlayerId.BLACK) ? 18 : 6;
            for (let homeBoardPointId = startingPointOfHomeBoard; homeBoardPointId !== move.sourcePointId; homeBoardPointId += direction) {
                if (this.checkerContainers[homeBoardPointId].checkers[move.playerId] > 0) {
                    // if we find a checker on a further out point, sourcePointId is not valid
                    return false;
                }
            }
            return true;
        }

        let otherPlayerId = Game.getOtherPlayerId(move.playerId);

        // case: there is a counter, but opponent blocks the end pip
        if (this.checkerContainers[destinationPointId].checkers[otherPlayerId] >= 2) {
            // console.info('point is blocked');
            return false;
        }

        return true;
    }

    move(move: Move): boolean {
        if (!this.isLegalMove(move)) {
            return false;
        }
        let destinationPointId = move.getDestinationPointId();
        let otherPlayerId = Game.getOtherPlayerId(move.playerId);
        if (destinationPointId !== PointId.HOME &&
            this.checkerContainers[destinationPointId].checkers[otherPlayerId] == 1) {
            this.decrement(otherPlayerId, destinationPointId);
            this.increment(otherPlayerId, PointId.BAR);
        }
        this.decrement(move.playerId, move.sourcePointId);
        this.increment(move.playerId, destinationPointId);
        return true;
    }

    checkIfValidDestination(move: Move): void {
        if (this.isLegalMove(move)) {
            let destinationPointId = move.getDestinationPointId();
            if (destinationPointId === PointId.HOME) {
                (<Home>this.checkerContainers[PointId.HOME]).setValidDestination(move.playerId, true);
            }
            else {
                (<Point>this.checkerContainers[destinationPointId]).setValidDestination(true);
            }
        }
    }

    removeAllHighlights(): void {
        for (let pointId = 1; pointId <= 24; pointId++) {
            (<Point>this.checkerContainers[pointId]).setValidDestination(false);
        }
        (<Home>this.checkerContainers[PointId.HOME]).setValidDestination(PlayerId.BLACK, false);
        (<Home>this.checkerContainers[PointId.HOME]).setValidDestination(PlayerId.RED, false);
    }
}