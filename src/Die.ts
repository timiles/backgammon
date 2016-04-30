class Die {
    value: number;
    remainingUses: number;
    onChange: (d: Die) => void;
    
    constructor() {
        this.value = Math.floor(Math.random() * 6) + 1;
        this.remainingUses = 1;
    }
    
    decrementRemainingUses(): void {
        this.remainingUses--;
        if (this.onChange) {
            this.onChange(this);
        }
    }
}