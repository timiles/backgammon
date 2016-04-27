class StatusUI {
    
    statusSpan: HTMLSpanElement;
    constructor() {
        this.statusSpan = document.createElement('span');
    }
    
    setStatus(s: string) {
        this.statusSpan.innerText = s;
    }
}