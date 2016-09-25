import { StatusLogger } from '../../StatusLogger'
import { StatusUI } from 'UI/StatusUI'

export class StatusUIEventBinder {

    constructor(statusLogger: StatusLogger, ui: StatusUI) {

        statusLogger.onLogInfo = (info) => {
            ui.setStatus(info);
        }
    }
}