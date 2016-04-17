class PointUI {
    
    pointDiv: HTMLDivElement;
    constructor(pointId: number) {
        this.pointDiv = document.createElement('div');
        this.pointDiv.id = 'point' + pointId.toString();
        
        let side = (pointId < 13 ? 'bottom' : 'top');
        let colour = (pointId % 2 == 0) ? 'black' : 'red'; 
        this.pointDiv.className = `point ${side}-point ${colour}-point`;
    }
}