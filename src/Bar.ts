/// <reference path="BarUI.ts"/>
/// <reference path="Enums.ts"/>
/// <reference path="Point.ts"/>

class Bar extends CheckerContainer {
    
    onCheckerCountChanged: (PlayerId, number) => void;
    onDecrement: (PlayerId, number) => void;
    onSetSelected: (PlayerId, boolean) => void;
    onSetValidSource: (PlayerId, boolean) => void;

    constructor() {
        super(PointId.BAR);
    }
    
    decrement(playerId: PlayerId): void {
        super.decrement(playerId);
        if (this.onCheckerCountChanged) {
            this.onCheckerCountChanged(playerId, this.checkers[playerId]);
        }
    }
    
    increment(playerId: PlayerId, count: number): void {
        super.increment(playerId, count);
        if (this.onCheckerCountChanged) {
            this.onCheckerCountChanged(playerId, this.checkers[playerId]);
        }
    }
    
    setSelected(playerId: PlayerId, on: boolean) {
        if (this.onSetSelected) {
            this.onSetSelected(playerId, on);
        }
    }
    
    setValidSource(playerId: PlayerId, on: boolean) {
        if (this.onSetValidSource) {
            this.onSetValidSource(playerId, on);
        }
    }
}