import { Board } from './Board'
import { PlayerId } from './Enums'

export class Player {
    constructor(public playerId: PlayerId, public board: Board) {
    }
}