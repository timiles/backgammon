'use strict';

var board;

describe('UI', function () {

    beforeEach(function () {
        
        let ui = new GameUI('backgammon');
        board = new Board(ui.boardUI);
        let dice = new Dice(ui.blackDiceUI, ui.redDiceUI);
        let statusLogger = new StatusLogger(ui.statusUI);

        new Game(ui, board, dice, statusLogger);
    });

    it('should initialise a standard starting board', function () {
        expect($('#backgammon_point1').children('.black').length).toBe(2);
        expect($('#backgammon_point6').children('.red').length).toBe(5);
        expect($('#backgammon_point8').children('.red').length).toBe(3);
        expect($('#backgammon_point12').children('.black').length).toBe(5);
        expect($('#backgammon_point13').children('.red').length).toBe(5);
        expect($('#backgammon_point17').children('.black').length).toBe(3);
        expect($('#backgammon_point19').children('.black').length).toBe(5);
        expect($('#backgammon_point24').children('.red').length).toBe(2);
    });

});
