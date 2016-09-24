import { Board } from './Board'
import { Move } from './Move'

export class PossibleGo {
    constructor(public moves: Move[], public resultantBoard: Board) {
    }
}