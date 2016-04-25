declare var $;

class CheckerContainerUI {
    
    checkerContainerDiv: HTMLDivElement;
    
    constructor(containerType: string, isTopSide: boolean) {
        this.checkerContainerDiv = document.createElement('div');
        let side = (isTopSide ? 'top': 'bottom');
        this.checkerContainerDiv.className = `checker-container checker-container-${side} ${containerType}`;
    }

    private clearCheckers(): void {
        while (this.checkerContainerDiv.hasChildNodes()) {
            this.checkerContainerDiv.removeChild(this.checkerContainerDiv.childNodes[0]);
        }
    }
    
    setCheckers(player: Player, count: number) {
        this.clearCheckers();

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
}