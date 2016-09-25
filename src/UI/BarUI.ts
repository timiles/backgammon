import { PlayerId } from 'Enums'
import { CheckerContainerUI } from './CheckerContainerUI'

export class BarUI extends CheckerContainerUI {

    onInspected: (on: boolean) => void;

    constructor(player: PlayerId) {
        super('bar', player === PlayerId.RED);

        this.containerDiv.onmouseover = () => { this.onInspected(true); };
        this.containerDiv.onmouseout = () => { this.onInspected(false); };
    }
}