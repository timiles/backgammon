'use strict';

define(['BoardComponents/Board', 'Dice', 'Enums', 'Game', 'UI/GameUI', 'StatusLogger'],
    function (Board, Dice, Enums, Game, GameUI, StatusLogger) {

        let PlayerId = Enums.PlayerId;
        let PointId = Enums.PointId;

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
                let board = new Board.Board();
                let fakeDiceRollGenerator = new FakeDiceRollGenerator([5, 5]);
                let dice = new Dice.Dice(fakeDiceRollGenerator);
                let statusLogger = new StatusLogger.StatusLogger();
                
                let game = new Game.Game(board, dice, statusLogger);
                let ui = new GameUI.GameUI('backgammon', game);
                board.initialise();
                dice.roll(PlayerId.BLACK);
                game.begin(PlayerId.BLACK);
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
                expect($('#backgammon_point1').hasClass('valid-source')).toBe(false);
                expect($('#backgammon_point12').hasClass('valid-source')).toBe(true);
                expect($('#backgammon_point17').hasClass('valid-source')).toBe(true);
                expect($('#backgammon_point19').hasClass('valid-source')).toBe(false);

                // red: none true
                expect($('#backgammon_point6').hasClass('valid-source')).toBe(false);
                expect($('#backgammon_point8').hasClass('valid-source')).toBe(false);
                expect($('#backgammon_point13').hasClass('valid-source')).toBe(false);
                expect($('#backgammon_point24').hasClass('valid-source')).toBe(false);

                // rest of the board: none true
                expect($('#backgammon_point2').hasClass('valid-source')).toBe(false);
                expect($('#backgammon_point3').hasClass('valid-source')).toBe(false);
                expect($('#backgammon_point4').hasClass('valid-source')).toBe(false);
                expect($('#backgammon_point5').hasClass('valid-source')).toBe(false);
                expect($('#backgammon_point7').hasClass('valid-source')).toBe(false);
                expect($('#backgammon_point9').hasClass('valid-source')).toBe(false);
                expect($('#backgammon_point10').hasClass('valid-source')).toBe(false);
                expect($('#backgammon_point11').hasClass('valid-source')).toBe(false);
                expect($('#backgammon_point14').hasClass('valid-source')).toBe(false);
                expect($('#backgammon_point15').hasClass('valid-source')).toBe(false);
                expect($('#backgammon_point16').hasClass('valid-source')).toBe(false);
                expect($('#backgammon_point18').hasClass('valid-source')).toBe(false);
                expect($('#backgammon_point20').hasClass('valid-source')).toBe(false);
                expect($('#backgammon_point21').hasClass('valid-source')).toBe(false);
                expect($('#backgammon_point22').hasClass('valid-source')).toBe(false);
                expect($('#backgammon_point23').hasClass('valid-source')).toBe(false);

            });

        });


        describe('UI: game play', function () {

            beforeEach(function () {
                let board = new Board.Board();
                let fakeDiceRollGenerator = new FakeDiceRollGenerator([6, 4]);
                let dice = new Dice.Dice(fakeDiceRollGenerator);
                let statusLogger = new StatusLogger.StatusLogger();
                
                let game = new Game.Game(board, dice, statusLogger);
                let ui = new GameUI.GameUI('backgammon', game);
                board.initialise();
                dice.roll(PlayerId.BLACK);
                game.begin(PlayerId.BLACK);
            });

            it('should re-highlight sources after checker is selected then deselected', function () {
                expect($('#backgammon_point1').hasClass('valid-source')).toBe(true);
                expect($('#backgammon_point12').hasClass('valid-source')).toBe(true);
                expect($('#backgammon_point17').hasClass('valid-source')).toBe(true);
                expect($('#backgammon_point19').hasClass('valid-source')).toBe(true);

                $('#backgammon_point1').click();
                $('#backgammon_point1').click();

                expect($('#backgammon_point1').hasClass('valid-source')).toBe(true);
                expect($('#backgammon_point12').hasClass('valid-source')).toBe(true);
                expect($('#backgammon_point17').hasClass('valid-source')).toBe(true);
                expect($('#backgammon_point19').hasClass('valid-source')).toBe(true);
            });

        });

        describe('UI: the bar', function () {

            beforeEach(function () {
                let board = new Board.Board();
                let fakeDiceRollGenerator = new FakeDiceRollGenerator([6, 4]);
                let dice = new Dice.Dice(fakeDiceRollGenerator);
                let statusLogger = new StatusLogger.StatusLogger();

                let game = new Game.Game(board, dice, statusLogger);
                let ui = new GameUI.GameUI('backgammon', game);
                board.initialise();
                dice.roll(PlayerId.BLACK);
                game.begin(PlayerId.BLACK);
            });

            it('should highlight as valid source when Black on the bar', function () {

                // move Black from 1 point: 6 then 4
                $('#backgammon_point1').click();
                $('#backgammon_point7').click();
                $('#backgammon_point1').click();
                $('#backgammon_point5').click();

                // move Red from 13 point: 6 (hit) then 4
                $('#backgammon_point13').click();
                $('#backgammon_point7').click();
                $('#backgammon_point13').click();
                $('#backgammon_point9').click();

                let $blackBar = $('.checker-container.checker-container-bottom.bar');
                expect($('.checker', $blackBar).length).toBe(1);
                expect($blackBar.hasClass('valid-source')).toBe(true);
            });


            it('should highlight as valid source when Red on the bar', function () {

                // use up Black's roll first
                $('#backgammon_point1').click();
                $('#backgammon_point7').click();
                $('#backgammon_point1').click();
                $('#backgammon_point5').click();

                // move Red from 24 point: 6 then 4
                $('#backgammon_point24').click();
                $('#backgammon_point18').click();
                $('#backgammon_point24').click();
                $('#backgammon_point20').click();

                // move Black from 12 point: 6 (hit) then 4
                $('#backgammon_point12').click();
                $('#backgammon_point18').click();
                $('#backgammon_point12').click();
                $('#backgammon_point16').click();

                let $redBar = $('.checker-container.checker-container-top.bar');
                expect($('.checker', $redBar).length).toBe(1);
                expect($redBar.hasClass('valid-source')).toBe(true);
            });

        });

        describe('UI: board where BLACK is all home', function () {

            // TODO: hover effect in jQuery so we don't need to reference board?
            var board;

            beforeEach(function () {
                board = new Board.Board();
                let fakeDiceRollGenerator = new FakeDiceRollGenerator([6, 4]);
                let dice = new Dice.Dice(fakeDiceRollGenerator);
                let statusLogger = new StatusLogger.StatusLogger();

                let game = new Game.Game(board, dice, statusLogger);
                let ui = new GameUI.GameUI('backgammon', game);
                board.initialise([[0, 0],
                    [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 5],
                    [0, 0], [0, 3], [0, 0], [0, 0], [0, 0], [0, 0],
                    [0, 5], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
                    [5, 0], [0, 0], [5, 0], [3, 0], [2, 0], [0, 2],
                    [0, 0]]);
                dice.roll(PlayerId.BLACK);
                game.begin(PlayerId.BLACK);
            });

            it('should enforce maximum possible dice use when bearing off', function () {

                expect($('#backgammon_point19').hasClass('valid-source')).toBe(true);
                expect($('#backgammon_point21').hasClass('valid-source')).toBe(true);
                expect($('#backgammon_point22').hasClass('valid-source')).toBe(false, 'should use 6 or 4');
                expect($('#backgammon_point23').hasClass('valid-source')).toBe(false, 'should use 6 or 4');
            });

            it('should highlight home when inspecting checker that can bear off', function () {

                board.onPointInspected(19, true);
                expect($('#backgammon_point23').hasClass('valid-destination')).toBe(true);
                expect($('#backgammon_blackhome').hasClass('valid-destination')).toBe(true);

                board.onPointInspected(19, false);
                expect($('#backgammon_point23').hasClass('valid-destination')).toBe(false);
                expect($('#backgammon_blackhome').hasClass('valid-destination')).toBe(false);
            });

            it('should bear off home when selecting checker then selecting home', function () {

                board.onPointInspected(19, true);
                $('#backgammon_point19').click();
                board.onPointInspected(19, false);

                expect($('#backgammon_point19').hasClass('valid-source')).toBe(true);
                expect($('#backgammon_point23').hasClass('valid-destination')).toBe(true);
                expect($('#backgammon_blackhome').hasClass('valid-destination')).toBe(true);

                $('#backgammon_blackhome').click();
                expect($('#backgammon_blackhome').children('.black').length).toBe(1);
                expect($('#backgammon_blackhome').hasClass('valid-destination')).toBe(false);
                for (var i = 1; i <= 24; i++) {
                    expect($('#backgammon_point' + i).hasClass('valid-destination')).toBe(false, 'Point ' + i + ' is not valid destination');
                }
            });

            it('should bear off automatically when selecting furthest checker and both dice exceed required pip count', function () {

                board = new Board.Board();
                let fakeDiceRollGenerator = new FakeDiceRollGenerator([6, 4]);
                let dice = new Dice.Dice(fakeDiceRollGenerator);
                let statusLogger = new StatusLogger.StatusLogger();

                let game = new Game.Game(board, dice, statusLogger);
                let ui = new GameUI.GameUI('backgammon', game);
                board.initialise([[0, 0],
                    [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 5],
                    [0, 0], [0, 3], [0, 0], [0, 0], [0, 0], [0, 0],
                    [0, 5], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
                    [0, 0], [0, 0], [5, 0], [3, 0], [7, 0], [0, 2],
                    [0, 0]]);
                dice.roll(PlayerId.BLACK);
                game.begin(PlayerId.BLACK);

                $('#backgammon_point21').click();
                // don't need to click home, should be already there
                expect($('#backgammon_blackhome').children('.black').length).toBe(1);

                $('#backgammon_point21').click();
                // again don't need to click home, should be already there
                expect($('#backgammon_blackhome').children('.black').length).toBe(2);
            });
        });
    });
