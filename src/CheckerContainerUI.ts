/// <reference path="Enums.ts"/>
/// <reference path="Utils.ts"/>

declare var $;

class CheckerContainerUI {
    
    containerDiv: HTMLDivElement;
    
    constructor(containerType: string, isTopSide: boolean) {
        this.containerDiv = document.createElement('div');
        let side = (isTopSide ? 'top': 'bottom');
        this.containerDiv.className = `checker-container checker-container-${side} ${containerType}`;
    }
    
    setState(state?: PointState) {
        // remove any class like 'state-*'
        $(this.containerDiv).removeClass(function (index, css) {
            return (css.match (/(^|\s)state-\S+/g) || []).join(' ');
        });
        if (state != undefined) {
            $(this.containerDiv).addClass('state-' + Utils.toCssClass(PointState[state]));
        }
    }

    setCheckers(player: Player, count: number) {
        Utils.removeAllChildren(this.containerDiv);

        let $containerDiv = $(this.containerDiv);
        let className = Player[player].toLowerCase();
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
    
    highlightSource(on: boolean): void {
        $(this.containerDiv).toggleClass('highlight-source', on);
    }
    
    setSelected(on: boolean): void {
        $(this.containerDiv).toggleClass('selected', on);
    }
}