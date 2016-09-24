import { Board } from 'BoardComponents/Board'
import { Move } from '../Move'

export class PossibleGo {
    constructor(public moves: Move[], public resultantBoard: Board) {
    }
}