import { PlayerId } from 'Enums'
import { Dice } from '../../Dice'
import { DiceUI } from 'UI/DiceUI'

export class DiceUIEventBinder {

    diceUIs: Array<DiceUI>;
    constructor(dice: Dice, blackDiceUI: DiceUI, redDiceUI: DiceUI) {
        this.diceUIs = new Array<DiceUI>();
        this.diceUIs[PlayerId.BLACK] = blackDiceUI;
        this.diceUIs[PlayerId.RED] = redDiceUI;

        dice.onSetStartingDiceRoll = (playerId, die) => { this.diceUIs[playerId].setStartingDiceRoll(die); };
        dice.onSetDiceRolls = (playerId, die1, die2) => { this.diceUIs[playerId].setDiceRolls(die1, die2); };
        dice.onSetActive = (playerId, active) => { this.diceUIs[playerId].setActive(active); };
    }
}