import { Die } from './Die'
import { CanGenerateDiceRoll } from './DiceRollGenerator'
import { PlayerId } from './Enums'
import { StatusLogger } from './StatusLogger'

export class Dice {

    diceRollGenerator: CanGenerateDiceRoll;
    die1: Die;
    die2: Die;

    onSetStartingDiceRoll: (playerId: PlayerId, die: Die) => void;
    onSetDiceRolls: (playerId: PlayerId, die1: Die, die2: Die) => void;
    onSetActive: (playerId: PlayerId, active: boolean) => void;

    constructor(diceRollGenerator: CanGenerateDiceRoll) {
        this.diceRollGenerator = diceRollGenerator;
    }

    rollToStart(statusLogger: StatusLogger, onSuccess: (successfulPlayerId: PlayerId) => void) {

        let die1 = new Die(this.diceRollGenerator.generateDiceRoll());
        let die2 = new Die(this.diceRollGenerator.generateDiceRoll());
        if (this.onSetStartingDiceRoll) {
            this.onSetStartingDiceRoll(PlayerId.BLACK, die1);
            this.onSetStartingDiceRoll(PlayerId.RED, die2);
        }

        statusLogger.logInfo(`BLACK rolls ${die1.value}`);
        statusLogger.logInfo(`RED rolls ${die2.value}`);

        if (die1.value === die2.value) {
            statusLogger.logInfo('DRAW! Roll again');
            setTimeout(() => { this.rollToStart(statusLogger, onSuccess); }, 1000);
        }
        else {
            let successfulPlayerId = die1.value > die2.value ? PlayerId.BLACK : PlayerId.RED;
            statusLogger.logInfo(`${PlayerId[successfulPlayerId]} wins the starting roll`);
            setTimeout(() => {
                this.die1 = die1;
                this.die2 = die2;
                if (this.onSetDiceRolls) {
                    this.onSetDiceRolls(successfulPlayerId, die1, die2);
                }
                if (this.onSetActive) {
                    this.onSetActive(successfulPlayerId, true);
                }
                onSuccess(successfulPlayerId);
            }, 1000);
        }
    }

    roll(playerId: PlayerId): void {
        this.die1 = new Die(this.diceRollGenerator.generateDiceRoll());
        this.die2 = new Die(this.diceRollGenerator.generateDiceRoll());
        let isDouble = (this.die1.value === this.die2.value);

        if (isDouble) {
            this.die1.remainingUses = 2;
            this.die2.remainingUses = 2;
        }

        if (this.onSetDiceRolls) {
            this.onSetDiceRolls(playerId, this.die1, this.die2);
        }
        if (this.onSetActive) {
            this.onSetActive(playerId, true);
            let otherPlayerId = playerId === PlayerId.BLACK ? PlayerId.RED : PlayerId.BLACK;
            this.onSetActive(otherPlayerId, false);
        }
    }
}