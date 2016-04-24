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

        let $homeDiv = $(this.checkerContainerDiv);
        let className = Player[player].toLowerCase();
        for (let i = 1; i <= count; i++) {
            if (i > 5) {
                $('.checker-total', $homeDiv).text(count);
            } else if (i == 5) {
                $homeDiv.append($('<div class="checker checker-total">').addClass(className));
            } else {
                $homeDiv.append($('<div class="checker">').addClass(className));
            }
        }
    }
}