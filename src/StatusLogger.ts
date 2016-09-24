import { StatusUI } from './StatusUI'

export class StatusLogger {
    
    statusUI: StatusUI;
    constructor(statusUI: StatusUI) {
        this.statusUI = statusUI;
    }
    
    logInfo(s: string) { 
        this.statusUI.setStatus(s);
    }
}