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
        return nextRoll;
    };
    return FakeDiceRollGenerator;
})();

describe('UI: starting board', function () {

    beforeEach(function () {
        
        let ui = new GameUI('backgammon');
        let board = new Board(ui.boardUI);
        
        fakeDiceRollGenerator = new FakeDiceRollGenerator([5, 5]);

        let dice = new Dice(fakeDiceRollGenerator, ui.blackDiceUI, ui.redDiceUI);
        dice.roll(Player.BLACK);
        
        let statusLogger = new StatusLogger(ui.statusUI);

        game = new Game(ui, board, dice, statusLogger, Player.BLACK);
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


describe('UI: game play', function () {

    beforeEach(function () {
        
        let ui = new GameUI('backgammon');
        let board = new Board(ui.boardUI);
        
        fakeDiceRollGenerator = new FakeDiceRollGenerator([6, 4]);

        let dice = new Dice(fakeDiceRollGenerator, ui.blackDiceUI, ui.redDiceUI);
        dice.roll(Player.BLACK);
        
        let statusLogger = new StatusLogger(ui.statusUI);

        game = new Game(ui, board, dice, statusLogger, Player.BLACK);
    });

    it('should re-highlight sources after checker is selected then deselected', function () {
        expect($('#backgammon_point1').hasClass('state-valid-source')).toBe(true);
        expect($('#backgammon_point12').hasClass('state-valid-source')).toBe(true);
        expect($('#backgammon_point17').hasClass('state-valid-source')).toBe(true);
        expect($('#backgammon_point19').hasClass('state-valid-source')).toBe(true);

        $('#backgammon_point1').click();
        $('#backgammon_point1').click();
        
        expect($('#backgammon_point1').hasClass('state-valid-source')).toBe(true);
        expect($('#backgammon_point12').hasClass('state-valid-source')).toBe(true);
        expect($('#backgammon_point17').hasClass('state-valid-source')).toBe(true);
        expect($('#backgammon_point19').hasClass('state-valid-source')).toBe(true);
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
        dice.roll(Player.BLACK);
        
        let statusLogger = new StatusLogger(ui.statusUI);

        game = new Game(ui, board, dice, statusLogger, Player.BLACK);
    });

    it('should enforce maximum possible dice use when bearing off', function () {
        
        expect($('#backgammon_point19').hasClass('state-valid-source')).toBe(true);
        expect($('#backgammon_point21').hasClass('state-valid-source')).toBe(true);
        expect($('#backgammon_point22').hasClass('state-valid-source')).toBe(false, 'should use 6 or 4');
        expect($('#backgammon_point23').hasClass('state-valid-source')).toBe(false, 'should use 6 or 4');
    });
    
    it('should highlight home when inspecting checker that can bear off', function () {
        
        game.board.onPointInspected(game.board.checkerContainers[19], true);
        expect($('#backgammon_point23').hasClass('highlight-destination')).toBe(true);
        expect($('#backgammon_blackhome').hasClass('highlight-destination')).toBe(true);
        
        game.board.onPointInspected(game.board.checkerContainers[19], false);
        expect($('#backgammon_point23').hasClass('highlight-destination')).toBe(false);
        expect($('#backgammon_blackhome').hasClass('highlight-destination')).toBe(false);
    });

    it('should bear off home when selecting checker then selecting home', function () {
        
        game.board.onPointInspected(game.board.checkerContainers[19], true);
        $('#backgammon_point19').click();
        game.board.onPointInspected(game.board.checkerContainers[19], false);

        expect($('#backgammon_point19').hasClass('state-valid-source')).toBe(true);
        expect($('#backgammon_point23').hasClass('highlight-destination')).toBe(true);
        expect($('#backgammon_blackhome').hasClass('highlight-destination')).toBe(true);
        
        $('#backgammon_blackhome').click();
        expect($('#backgammon_blackhome').children('.black').length).toBe(1);
        expect($('#backgammon_blackhome').hasClass('highlight-destination')).toBe(false);
        for (var i = 1; i <= 24; i++) {
            expect($('#backgammon_point' + i).hasClass('highlight-destination')).toBe(false, 'Point ' + i + ' is not valid destination');
        }
    });
    
    it('should bear off automatically when selecting furthest checker and both dice exceed required pip count', function () {
        
        game.board.move(Player.BLACK, 19, 4);
        game.board.move(Player.BLACK, 19, 4);
        game.board.move(Player.BLACK, 19, 4);
        game.board.move(Player.BLACK, 19, 4);
        game.board.move(Player.BLACK, 19, 4);

        $('#backgammon_point21').click();

        expect($('#backgammon_blackhome').children('.black').length).toBe(1);
        
    });
});
