/// <reference path="../Enums.ts"/>
/// <reference path="Utils.ts"/>

declare var $;

class CheckerContainerUI {
    
    containerDiv: HTMLDivElement;
    onSelected: () => void;

    constructor(containerType: string, isTopSide: boolean) {
        this.containerDiv = document.createElement('div');
        let side = (isTopSide ? 'top': 'bottom');
        this.containerDiv.className = `checker-container checker-container-${side} ${containerType}`;
        
        this.containerDiv.onclick = () => { this.onSelected(); };
    }
    
    setCheckers(player: PlayerId, count: number) {
        Utils.removeAllChildren(this.containerDiv);

        let $containerDiv = $(this.containerDiv);
        let className = PlayerId[player].toLowerCase();
        for (let i = 1; i <= count; i++) {
            if (i > 5) {
                $('.checker-total', $containerDiv).text(count);
            } else if (i == 5) {
                $containerDiv.append($('<div class="checker checker-total">').addClass(className));
            } else {
                $containerDiv.append($('<div class="checker">').addClass(className));
            }
        }
    }
    
    setSelected(on: boolean): void {
        $(this.containerDiv).toggleClass('selected', on);
    }

    setValidSource(on: boolean): void {
        $(this.containerDiv).toggleClass('valid-source', on);
    }
    
    setValidDestination(on: boolean): void {
        $(this.containerDiv).toggleClass('valid-destination', on);
    }
}