export class StatusLogger {
    
    onLogInfo: (info: string) => void;
    
    logInfo(info: string) {
        if (this.onLogInfo) {
            this.onLogInfo(info);
        } 
    }
}