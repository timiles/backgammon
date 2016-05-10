'use strict';

var game;
var fakeDiceRollGenerator;

let FakeDiceRollGenerator = (function () {
    var diceRolls = [];
    var sequenceIndex = 0;
    function FakeDiceRollGenerator(d) {
        diceRolls = d;
    }
    FakeDiceRollGenerator.prototype.generateDiceRoll = function () {
        var nextRoll = diceRolls[sequenceIndex];
        sequenceIndex = ++sequenceIndex % diceRolls.length;
        return diceRolls[sequenceIndex];
    };
    return FakeDiceRollGenerator;
})();

describe('UI: starting board', function () {

    beforeEach(function () {
        
        let ui = new GameUI('backgammon');
        let board = new Board(ui.boardUI);
        
        fakeDiceRollGenerator = new FakeDiceRollGenerator([5, 5]);

        let dice = new Dice(fakeDiceRollGenerator, ui.blackDiceUI, ui.redDiceUI);
        let statusLogger = new StatusLogger(ui.statusUI);

        game = new Game(ui, board, dice, statusLogger);
    });

    it('should initialise points as expected', function () {
        expect($('#backgammon_point1').children('.black').length).toBe(2);
        expect($('#backgammon_point6').children('.red').length).toBe(5);
        expect($('#backgammon_point8').children('.red').length).toBe(3);
        expect($('#backgammon_point12').children('.black').length).toBe(5);
        expect($('#backgammon_point13').children('.red').length).toBe(5);
        expect($('#backgammon_point17').children('.black').length).toBe(3);
        expect($('#backgammon_point19').children('.black').length).toBe(5);
        expect($('#backgammon_point24').children('.red').length).toBe(2);
    });

    it('should highlight valid sources', function () {
        // black: true where move is possible
        expect($('#backgammon_point1').hasClass('state-valid-source')).toBe(false);
        expect($('#backgammon_point12').hasClass('state-valid-source')).toBe(true);
        expect($('#backgammon_point17').hasClass('state-valid-source')).toBe(true);
        expect($('#backgammon_point19').hasClass('state-valid-source')).toBe(false);
        
        // red: none true
        expect($('#backgammon_point6').hasClass('state-valid-source')).toBe(false);
        expect($('#backgammon_point8').hasClass('state-valid-source')).toBe(false);
        expect($('#backgammon_point13').hasClass('state-valid-source')).toBe(false);
        expect($('#backgammon_point24').hasClass('state-valid-source')).toBe(false);

        // rest of the board: none true
        expect($('#backgammon_point2').hasClass('state-valid-source')).toBe(false);
        expect($('#backgammon_point3').hasClass('state-valid-source')).toBe(false);
        expect($('#backgammon_point4').hasClass('state-valid-source')).toBe(false);
        expect($('#backgammon_point5').hasClass('state-valid-source')).toBe(false);
        expect($('#backgammon_point7').hasClass('state-valid-source')).toBe(false);
        expect($('#backgammon_point9').hasClass('state-valid-source')).toBe(false);
        expect($('#backgammon_point10').hasClass('state-valid-source')).toBe(false);
        expect($('#backgammon_point11').hasClass('state-valid-source')).toBe(false);
        expect($('#backgammon_point14').hasClass('state-valid-source')).toBe(false);
        expect($('#backgammon_point15').hasClass('state-valid-source')).toBe(false);
        expect($('#backgammon_point16').hasClass('state-valid-source')).toBe(false);
        expect($('#backgammon_point18').hasClass('state-valid-source')).toBe(false);
        expect($('#backgammon_point20').hasClass('state-valid-source')).toBe(false);
        expect($('#backgammon_point21').hasClass('state-valid-source')).toBe(false);
        expect($('#backgammon_point22').hasClass('state-valid-source')).toBe(false);
        expect($('#backgammon_point23').hasClass('state-valid-source')).toBe(false);
        
    });

});

describe('UI: home board', function () {

    beforeEach(function () {
        
        let ui = new GameUI('backgammon');
        let board = new Board(ui.boardUI);
        
        board.move(Player.BLACK, 1, 22);
        board.move(Player.BLACK, 1, 22);
        board.move(Player.BLACK, 12, 9);
        board.move(Player.BLACK, 12, 9);
        board.move(Player.BLACK, 12, 9);
        board.move(Player.BLACK, 12, 9);
        board.move(Player.BLACK, 12, 9);
        board.move(Player.BLACK, 17, 5);
        board.move(Player.BLACK, 17, 5);
        board.move(Player.BLACK, 17, 5);
        
        fakeDiceRollGenerator = new FakeDiceRollGenerator([6, 4]);

        let dice = new Dice(fakeDiceRollGenerator, ui.blackDiceUI, ui.redDiceUI);
        let statusLogger = new StatusLogger(ui.statusUI);

        game = new Game(ui, board, dice, statusLogger);
    });

    it('should highlight home when inspecting checker that can bear off', function () {
        
        game.board.onPointInspected(game.board.checkerContainers[19], true);

        expect($('#backgammon_point23').hasClass('highlight-destination')).toBe(true);
        expect($('#backgammon_blackhome').hasClass('highlight-destination')).toBe(true);
    });

});
