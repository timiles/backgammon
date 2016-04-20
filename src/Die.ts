class Die {
    value: number;
    remainingUses: number;
    constructor() {
        this.value = Math.floor(Math.random() * 6) + 1;
        this.remainingUses = 1;
    }
}