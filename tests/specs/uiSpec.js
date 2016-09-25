'use strict';

define(['BoardComponents/Board', 'Dice', 'DiceRollGenerator', 'Enums', 'Game', 'UI/GameUI', 'StatusLogger', 'Move'],
    function (Board, Dice, DiceRollGenerator, Enums, Game, GameUI, StatusLogger, Move) {

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
                let ui = new GameUI.GameUI('backgammon', board);
                board.initialise();

                let fakeDiceRollGenerator = new FakeDiceRollGenerator([5, 5]);

                let dice = new Dice.Dice(fakeDiceRollGenerator, ui.blackDiceUI, ui.redDiceUI);
                dice.roll(PlayerId.BLACK);

                let statusLogger = new StatusLogger.StatusLogger(ui.statusUI);

                let game = new Game.Game(board, dice, statusLogger);
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
                let ui = new GameUI.GameUI('backgammon', board);
                board.initialise();

                let fakeDiceRollGenerator = new FakeDiceRollGenerator([6, 4]);

                let dice = new Dice.Dice(fakeDiceRollGenerator, ui.blackDiceUI, ui.redDiceUI);
                dice.roll(PlayerId.BLACK);

                let statusLogger = new StatusLogger.StatusLogger(ui.statusUI);

                let game = new Game.Game(board, dice, statusLogger);
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
                let ui = new GameUI.GameUI('backgammon', board);
                board.initialise();

                let fakeDiceRollGenerator = new FakeDiceRollGenerator([6, 4]);

                let dice = new Dice.Dice(fakeDiceRollGenerator, ui.blackDiceUI, ui.redDiceUI);
                dice.roll(PlayerId.BLACK);

                let statusLogger = new StatusLogger.StatusLogger(ui.statusUI);

                let game = new Game.Game(board, dice, statusLogger, PlayerId.BLACK);
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

        describe('UI: home board', function () {

            var game;

            beforeEach(function () {

                let board = new Board.Board();
                let ui = new GameUI.GameUI('backgammon', board);
                board.initialise();

                let fakeDiceRollGenerator = new FakeDiceRollGenerator([6, 4]);

                let dice = new Dice.Dice(fakeDiceRollGenerator, ui.blackDiceUI, ui.redDiceUI);
                dice.roll(PlayerId.BLACK);

                let statusLogger = new StatusLogger.StatusLogger(ui.statusUI);

                game = new Game.Game(board, dice, statusLogger);
                game.begin(PlayerId.BLACK);

                board.move(new Move.Move(PlayerId.BLACK, 1, 22));
                board.move(new Move.Move(PlayerId.BLACK, 1, 22));
                board.move(new Move.Move(PlayerId.BLACK, 12, 9));
                board.move(new Move.Move(PlayerId.BLACK, 12, 9));
                board.move(new Move.Move(PlayerId.BLACK, 12, 9));
                board.move(new Move.Move(PlayerId.BLACK, 12, 9));
                board.move(new Move.Move(PlayerId.BLACK, 12, 9));
                board.move(new Move.Move(PlayerId.BLACK, 17, 5));
                board.move(new Move.Move(PlayerId.BLACK, 17, 5));
                board.move(new Move.Move(PlayerId.BLACK, 17, 5));
                game.evaluateBoard();
            });

            it('should enforce maximum possible dice use when bearing off', function () {

                expect($('#backgammon_point19').hasClass('valid-source')).toBe(true);
                expect($('#backgammon_point21').hasClass('valid-source')).toBe(true);
                expect($('#backgammon_point22').hasClass('valid-source')).toBe(false, 'should use 6 or 4');
                expect($('#backgammon_point23').hasClass('valid-source')).toBe(false, 'should use 6 or 4');
            });

            it('should highlight home when inspecting checker that can bear off', function () {

                game.board.onPointInspected(19, true);
                expect($('#backgammon_point23').hasClass('valid-destination')).toBe(true);
                expect($('#backgammon_blackhome').hasClass('valid-destination')).toBe(true);

                game.board.onPointInspected(19, false);
                expect($('#backgammon_point23').hasClass('valid-destination')).toBe(false);
                expect($('#backgammon_blackhome').hasClass('valid-destination')).toBe(false);
            });

            it('should bear off home when selecting checker then selecting home', function () {

                game.board.onPointInspected(19, true);
                $('#backgammon_point19').click();
                game.board.onPointInspected(19, false);

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

                game.board.move(new Move.Move(PlayerId.BLACK, 19, 4));
                game.board.move(new Move.Move(PlayerId.BLACK, 19, 4));
                game.board.move(new Move.Move(PlayerId.BLACK, 19, 4));
                game.board.move(new Move.Move(PlayerId.BLACK, 19, 4));
                game.board.move(new Move.Move(PlayerId.BLACK, 19, 4));
                game.evaluateBoard();

                $('#backgammon_point21').click();

                expect($('#backgammon_blackhome').children('.black').length).toBe(1);

            });
        });
    });
