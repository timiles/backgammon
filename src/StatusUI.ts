class StatusUI {
    
    containerDiv: HTMLDivElement;
    constructor() {
        this.containerDiv = document.createElement('div');
        this.containerDiv.className = 'status-container';
    }
    
    setStatus(s: string) {
        let statusP = document.createElement('p');
        statusP.innerText = s;
        this.containerDiv.appendChild(statusP);
        this.containerDiv.scrollTop = this.containerDiv.scrollHeight;
    }
}