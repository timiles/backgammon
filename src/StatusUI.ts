class StatusUI {
    
    containerDiv: HTMLDivElement;
    constructor() {
        this.containerDiv = document.createElement('div');
    }
    
    setStatus(s: string) {
        let statusP = document.createElement('p');
        statusP.innerText = s;
        this.containerDiv.appendChild(statusP);
    }
}