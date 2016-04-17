enum Side { TOP, BOTTOM }

class PointUI {
    
    pointDiv: HTMLDivElement;
    constructor(pointId: number, side: Side) {
        this.pointDiv = document.createElement('div');
        this.pointDiv.id = 'point' + pointId.toString();
        
        let colour = (pointId % 2 == 0) ? 'black' : 'red'; 
        this.pointDiv.className = `point ${Side[side]}-point ${colour}-point`;
    }
}