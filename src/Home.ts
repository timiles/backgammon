/// <reference path="CheckerContainer.ts"/>
/// <reference path="Enums.ts"/>

class Home extends CheckerContainer {

    onIncrement: (PlayerId, number) => void;
    onSetValidDestination: (PlayerId, boolean) => void;

    constructor() {
        super(PointId.HOME);
    }

    increment(playerId: PlayerId): void {
        super.increment(playerId, 1);
        if (this.onIncrement) {
            this.onIncrement(playerId, this.checkers[playerId]);
        }
    }

    setValidDestination(playerId: PlayerId, on: boolean) {
        if (this.onSetValidDestination) {
            this.onSetValidDestination(playerId, on);
        }
    }
}