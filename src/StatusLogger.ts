/// <reference path="StatusUI.ts"/>

class StatusLogger {
    
    statusUI: StatusUI;
    constructor(statusUI: StatusUI) {
        this.statusUI = statusUI;
    }
    
    logInfo(s: string) { 
        this.statusUI.setStatus(s);
    }
}