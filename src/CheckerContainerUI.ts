/// <reference path="Utils.ts"/>

declare var $;

class CheckerContainerUI {
    
    checkerContainerDiv: HTMLDivElement;
    
    constructor(containerType: string, isTopSide: boolean) {
        this.checkerContainerDiv = document.createElement('div');
        let side = (isTopSide ? 'top': 'bottom');
        this.checkerContainerDiv.className = `checker-container checker-container-${side} ${containerType}`;
    }

    setCheckers(player: Player, count: number) {
        Utils.removeAllChildren(this.checkerContainerDiv);

        let $checkerContainerDiv = $(this.checkerContainerDiv);
        let className = Player[player].toLowerCase();
        for (let i = 1; i <= count; i++) {
            if (i > 5) {
                $('.checker-total', $checkerContainerDiv).text(count);
            } else if (i == 5) {
                $checkerContainerDiv.append($('<div class="checker checker-total">').addClass(className));
            } else {
                $checkerContainerDiv.append($('<div class="checker">').addClass(className));
            }
        }
    }
    
    highlightSource(on: boolean): void {
        if (on) {
            $(this.checkerContainerDiv).addClass('highlight-source');
        }
        else {
            $(this.checkerContainerDiv).removeClass('highlight-source');
        }
    }
}