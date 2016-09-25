import { PlayerId, PointId } from './Enums'

export class Move {

    constructor(public playerId: PlayerId, public sourcePointId: number, public numberOfPointsToMove: number) {
    }

    getDestinationPointId(): number {
        switch (this.playerId) {
            case PlayerId.BLACK: {
                if (this.sourcePointId === PointId.BAR) {
                    return this.numberOfPointsToMove;
                }

                let destinationPointId = this.sourcePointId + this.numberOfPointsToMove;
                if (destinationPointId > 24) {
                    // bearing off
                    return PointId.HOME;
                }
                return destinationPointId;
            }
            case PlayerId.RED: {
                if (this.sourcePointId === PointId.BAR) {
                    return PointId.BAR - this.numberOfPointsToMove;
                }

                let destinationPointId = this.sourcePointId - this.numberOfPointsToMove;
                if (destinationPointId < 1) {
                    // bearing off
                    return PointId.HOME;
                }
                return destinationPointId;
            }
            default: throw `Unknown playerId: ${this.playerId}`;
        }
    }
}