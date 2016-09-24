import { CheckerContainer } from './CheckerContainer'
import { PlayerId } from './Enums'

export class Point extends CheckerContainer {

    onCheckerCountChanged: (PlayerId, number) => void;
    onSetSelected: (boolean) => void;
    onSetValidDestination: (boolean) => void;
    onSetValidSource: (boolean) => void;

    constructor(pointId: number) {
        super(pointId);
    }

    decrement(playerId: PlayerId): void {
        super.decrement(playerId);
        if (this.onCheckerCountChanged) {
            this.onCheckerCountChanged(playerId, this.checkers[playerId]);
        }
    }

    increment(playerId: PlayerId, count: number): void {
        super.increment(playerId, count);
        if (this.onCheckerCountChanged) {
            this.onCheckerCountChanged(playerId, this.checkers[playerId]);
        }
    }

    setValidDestination(on: boolean) {
        if (this.onSetValidDestination) {
            this.onSetValidDestination(on);
        }
    }

    setValidSource(on: boolean) {
        if (this.onSetValidSource) {
            this.onSetValidSource(on);
        }
    }

    setSelected(on: boolean) {
        if (this.onSetSelected) {
            this.onSetSelected(on);
        }
    }
}