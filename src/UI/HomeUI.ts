import { PlayerId } from 'Enums'
import { CheckerContainerUI } from './CheckerContainerUI'

export class HomeUI extends CheckerContainerUI {
    
    constructor(player: PlayerId) {
        super('home', player === PlayerId.BLACK);
    }   
}