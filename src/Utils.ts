declare var $;

// REVIEW: invoke as extensions/prototype?
class Utils {
    static removeAllChildren(element: HTMLElement): void {
        // fastest way to remove all child nodes: http://stackoverflow.com/a/3955238/487544
        while (element.lastChild) {
            element.removeChild(element.lastChild);
        }
    }
        
    static highlight(el: HTMLElement) {
        $(el).addClass('highlight');
        // timeout purely to allow ui to update
        setTimeout(function() {
            $(el).addClass('highlight-end');
        }, 0);
    }
}