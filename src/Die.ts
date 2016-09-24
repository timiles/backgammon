export class Die {
    value: number;
    remainingUses: number;
    onChange: (d: Die) => void;
    
    constructor(value: number) {
        this.value = value;
        this.remainingUses = 1;
    }
    
    decrementRemainingUses(): void {
        this.remainingUses--;
        if (this.onChange) {
            this.onChange(this);
        }
    }
}