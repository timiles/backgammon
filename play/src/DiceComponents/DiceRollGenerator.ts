export interface CanGenerateDiceRoll {
    generateDiceRoll(): number;
}

export class DiceRollGenerator implements CanGenerateDiceRoll {
    
    generateDiceRoll(): number {
        return Math.floor(Math.random() * 6) + 1;        
    }
}