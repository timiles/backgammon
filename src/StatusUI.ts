class StatusUI {
    
    statusSpan: HTMLSpanElement;
    constructor(statusSpanElementId: string) {
        this.statusSpan = document.getElementById(statusSpanElementId);
    }
    
    setStatus(s: string) {
        this.statusSpan.innerText = s;
    }
}