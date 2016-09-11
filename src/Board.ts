/// <reference path="Bar.ts"/>
/// <reference path="CheckerContainer.ts"/>
/// <reference path="Enums.ts"/>
/// <reference path="Home.ts"/>
/// <reference path="Point.ts"/>

enum PointId { HOME = 0, BAR = 25 }

class Board {

    checkerContainers: Array<CheckerContainer>;
    onPointInspected: (pointId: number, on: boolean) => void;
    onPointSelected: (pointId: number) => void;
    onCheckerCountChanged: (pointId: number, playerId: PlayerId, count: number) => void;
    onSetSelected: (playerId: PlayerId, on: boolean) => void;
    onSetPointSelected: (pointId: number, on: boolean) => void;
    onSetValidDestination: (playerId: PlayerId, on: boolean) => void;
    onSetPointValidDestination: (pointId: number, on: boolean) => void;
    onSetValidSource: (playerId: PlayerId, on: boolean) => void;
    onSetPointValidSource: (pointId: number, on: boolean) => void;

    constructor() {

        this.checkerContainers = new Array(26);

        let home = new Home();
        home.onIncrement = (playerId: PlayerId, count: number) => {
            if (this.onCheckerCountChanged) {
                this.onCheckerCountChanged(PointId.HOME, playerId, count);
            }
        };
        home.onSetValidDestination = (playerId: PlayerId, on: boolean) => {
            if (this.onSetValidDestination) {
                this.onSetValidDestination(playerId, on);
            }
        }
        this.checkerContainers[PointId.HOME] = home;


        for (let i = 1; i < 25; i++) {
            this.checkerContainers[i] = this.createPoint(i);
        }


        let bar = new Bar();
        bar.onCheckerCountChanged = (playerId: PlayerId, count: number) => {
            if (this.onCheckerCountChanged) {
                this.onCheckerCountChanged(PointId.BAR, playerId, count);
            }
        }

        bar.onSetSelected = (playerId: PlayerId, on: boolean) => {
            if (this.onSetSelected) {
                this.onSetSelected(playerId, on);
            }
        }

        bar.onSetValidSource = (playerId: PlayerId, on: boolean) => {
            if (this.onSetValidSource) {
                this.onSetValidSource(playerId, on);
            }
        }
        this.checkerContainers[PointId.BAR] = bar;
    }

    createPoint(pointId: number): Point {
        let point = new Point(pointId);
        point.onCheckerCountChanged = (playerId: PlayerId, count: number) => {
            if (this.onCheckerCountChanged) {
                this.onCheckerCountChanged(pointId, playerId, count);
            }
        };
        point.onSetSelected = (on: boolean) => {
            if (this.onSetPointSelected) {
                this.onSetPointSelected(pointId, on);
            }
        };
        point.onSetValidDestination = (on: boolean) => {
            if (this.onSetPointValidDestination) {
                this.onSetPointValidDestination(pointId, on);
            }
        };
        point.onSetValidSource = (on: boolean) => {
            if (this.onSetPointValidSource) {
                this.onSetPointValidSource(pointId, on);
            }
        };
        return point;
    }

    initialise(): void {
        this.increment(PlayerId.RED, 24, 2);
        this.increment(PlayerId.BLACK, 1, 2);
        this.increment(PlayerId.RED, 6, 5);
        this.increment(PlayerId.BLACK, 19, 5);
        this.increment(PlayerId.RED, 8, 3);
        this.increment(PlayerId.BLACK, 17, 3);
        this.increment(PlayerId.RED, 13, 5);
        this.increment(PlayerId.BLACK, 12, 5);
    }

    decrement(player: PlayerId, pointId: number): void {
        this.checkerContainers[pointId].decrement(player);
    }

    increment(player: PlayerId, pointId: number, count?: number): void {
        this.checkerContainers[pointId].increment(player, count || 1);
    }

    static getDestinationPointId(player: PlayerId, sourcePointId: number, numberOfMoves: number): number {
        switch (player) {
            case PlayerId.BLACK: {
                if (sourcePointId === PointId.BAR) {
                    return numberOfMoves;
                }

                let destinationPointId = sourcePointId + numberOfMoves;
                if (destinationPointId > 24) {
                    // bearing off
                    return PointId.HOME;
                }
                return destinationPointId;

            }
            case PlayerId.RED: {
                if (sourcePointId === PointId.BAR) {
                    return PointId.BAR - numberOfMoves;
                }

                let destinationPointId = sourcePointId - numberOfMoves;
                if (destinationPointId < 1) {
                    // bearing off
                    return PointId.HOME;
                }
                return destinationPointId;
            }
            default: throw `Unknown player: ${player}`;
        }
    }

    isLegalMove(player: PlayerId, sourcePointId: number, numberOfMoves: number): boolean {

        // case: there is no counter to move: fail
        if (this.checkerContainers[sourcePointId].checkers[player] == 0) {
            console.info('no counter at ' + sourcePointId);
            return false;
        }

        // case: there is a counter on the bar, and this is not it
        if ((sourcePointId != PointId.BAR) && (this.checkerContainers[PointId.BAR].checkers[player] > 0)) {
            console.info('must move counter off bar first');
            return false;
        }

        // case: bearing off
        const direction = (player === PlayerId.BLACK) ? 1 : -1;
        let destinationPointId = Board.getDestinationPointId(player, sourcePointId, numberOfMoves);
        if (destinationPointId === PointId.HOME) {
            // check that there are no checkers outside of home board. (BAR has already been checked above)
            const startingPointOfOuterBoard = (player === PlayerId.BLACK) ? 1 : 24;
            const totalPointsOfOuterBoard = 18;
            for (let offset = 0; offset < totalPointsOfOuterBoard; offset++) {
                if (this.checkerContainers[startingPointOfOuterBoard + (direction * offset)].checkers[player] > 0) {
                    return false;
                }
            }

            // check that there are no checkers more deserving of this dice roll
            let actualDestinationPointId = sourcePointId + (direction * numberOfMoves);
            // if it's dead on, we're fine.
            if (actualDestinationPointId === 0 || actualDestinationPointId === 25) {
                return true;
            }

            const startingPointOfHomeBoard = (player === PlayerId.BLACK) ? 18 : 6;
            for (let homeBoardPointId = startingPointOfHomeBoard; homeBoardPointId !== sourcePointId; homeBoardPointId += direction) {
                if (this.checkerContainers[homeBoardPointId].checkers[player] > 0) {
                    // if we find a checker on a further out point, sourcePointId is not valid
                    return false;
                }
            }
            return true;
        }

        let otherPlayer = Game.getOtherPlayer(player);

        // case: there is a counter, but opponent blocks the end pip
        if (this.checkerContainers[destinationPointId].checkers[otherPlayer] >= 2) {
            console.info('point is blocked');
            return false;
        }

        return true;
    }

    move(player: PlayerId, sourcePointId: number, numberOfMoves: number): boolean {
        if (!this.isLegalMove(player, sourcePointId, numberOfMoves)) {
            return false;
        }
        let destinationPointId = Board.getDestinationPointId(player, sourcePointId, numberOfMoves);
        let otherPlayer = Game.getOtherPlayer(player);
        if (destinationPointId !== PointId.HOME &&
            this.checkerContainers[destinationPointId].checkers[otherPlayer] == 1) {
            this.decrement(otherPlayer, destinationPointId);
            this.increment(otherPlayer, PointId.BAR);
        }
        this.decrement(player, sourcePointId);
        this.increment(player, destinationPointId);
        return true;
    }

    checkIfValidDestination(player: PlayerId, sourcePointId: number, numberOfMoves: number): void {
        if (this.isLegalMove(player, sourcePointId, numberOfMoves)) {
            let destinationPointId = Board.getDestinationPointId(player, sourcePointId, numberOfMoves);
            if (destinationPointId === PointId.HOME) {
                (<Home>this.checkerContainers[PointId.HOME]).setValidDestination(player, true);
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