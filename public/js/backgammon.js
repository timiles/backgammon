'use strict';

var Backgammon = {
    
    CONSTANTS: Object.freeze({
        HOME: 0,
        BAR: 25,
        RED: 0,
        BLACK: 1
    }),
    
    BoardData: function() {
        var _data = new Array(26);
        for (var i = 0; i < 26; i++) {
            _data[i] = [0, 0];
        }
        function getPipIndex(pipNumber, player) {
            // special pips:
            if ((pipNumber == Backgammon.CONSTANTS.HOME) || (pipNumber == Backgammon.CONSTANTS.BAR)) {
                return pipNumber;
            }
            // otherwise invert board if we are black
            return player == Backgammon.CONSTANTS.RED ? pipNumber : 25 - pipNumber;
        }
        this.increment = function(pipNumber, player) {
            return ++_data[getPipIndex(pipNumber, player)][player];
        }
        this.decrement = function(pipNumber, player) {
            return --_data[getPipIndex(pipNumber, player)][player];
        }
        this.getCounters = function(pipNumber, player) {
            return _data[getPipIndex(pipNumber, player)][player];
        }
    },

    Board: function(boardElementId) {

        var _playerNames = ["red", "black"];
        var _boardData;

        this.init = function() {
            _boardData = new Backgammon.BoardData();

            var $board = $('#' + boardElementId);
            $board.empty();
            $board.addClass('board')
                .append($('<div id="13" class="pip top-pip red-pip">'))
                .append($('<div id="14" class="pip top-pip black-pip">'))
                .append($('<div id="15" class="pip top-pip red-pip">'))
                .append($('<div id="16" class="pip top-pip black-pip">'))
                .append($('<div id="17" class="pip top-pip red-pip">'))
                .append($('<div id="18" class="pip top-pip black-pip">'))
                .append($('<div id="black-bar" class="pip bar">'))
                .append($('<div id="19" class="pip top-pip red-pip">'))
                .append($('<div id="20" class="pip top-pip black-pip">'))
                .append($('<div id="21" class="pip top-pip red-pip">'))
                .append($('<div id="22" class="pip top-pip black-pip">'))
                .append($('<div id="23" class="pip top-pip red-pip">'))
                .append($('<div id="24" class="pip top-pip black-pip">'))
                .append($('<div id="black-home" class="pip home">'))
                .append($('<br class="clear">'))
                .append($('<div id="12" class="pip bottom-pip black-pip">'))
                .append($('<div id="11" class="pip bottom-pip red-pip">'))
                .append($('<div id="10" class="pip bottom-pip black-pip">'))
                .append($('<div id="9" class="pip bottom-pip red-pip">'))
                .append($('<div id="8" class="pip bottom-pip black-pip">'))
                .append($('<div id="7" class="pip bottom-pip red-pip">'))
                .append($('<div id="red-bar" class="pip bar">'))
                .append($('<div id="6" class="pip bottom-pip black-pip">'))
                .append($('<div id="5" class="pip bottom-pip red-pip">'))
                .append($('<div id="4" class="pip bottom-pip black-pip">'))
                .append($('<div id="3" class="pip bottom-pip red-pip">'))
                .append($('<div id="2" class="pip bottom-pip black-pip">'))
                .append($('<div id="1" class="pip bottom-pip red-pip">'))
                .append($('<div id="red-home" class="pip home">'))
                .append($('<br class="clear">'));

            this.addCounterToPip(24, Backgammon.CONSTANTS.RED);
            this.addCounterToPip(24, Backgammon.CONSTANTS.RED);
            this.addCounterToPip(1, Backgammon.CONSTANTS.BLACK);
            this.addCounterToPip(1, Backgammon.CONSTANTS.BLACK);
            this.addCounterToPip(6, Backgammon.CONSTANTS.RED);
            this.addCounterToPip(6, Backgammon.CONSTANTS.RED);
            this.addCounterToPip(6, Backgammon.CONSTANTS.RED);
            this.addCounterToPip(6, Backgammon.CONSTANTS.RED);
            this.addCounterToPip(6, Backgammon.CONSTANTS.RED);
            this.addCounterToPip(19, Backgammon.CONSTANTS.BLACK);
            this.addCounterToPip(19, Backgammon.CONSTANTS.BLACK);
            this.addCounterToPip(19, Backgammon.CONSTANTS.BLACK);
            this.addCounterToPip(19, Backgammon.CONSTANTS.BLACK);
            this.addCounterToPip(19, Backgammon.CONSTANTS.BLACK);
            this.addCounterToPip(8, Backgammon.CONSTANTS.RED);
            this.addCounterToPip(8, Backgammon.CONSTANTS.RED);
            this.addCounterToPip(8, Backgammon.CONSTANTS.RED);
            this.addCounterToPip(17, Backgammon.CONSTANTS.BLACK);
            this.addCounterToPip(17, Backgammon.CONSTANTS.BLACK);
            this.addCounterToPip(17, Backgammon.CONSTANTS.BLACK);
            this.addCounterToPip(13, Backgammon.CONSTANTS.RED);
            this.addCounterToPip(13, Backgammon.CONSTANTS.RED);
            this.addCounterToPip(13, Backgammon.CONSTANTS.RED);
            this.addCounterToPip(13, Backgammon.CONSTANTS.RED);
            this.addCounterToPip(13, Backgammon.CONSTANTS.RED);
            this.addCounterToPip(12, Backgammon.CONSTANTS.BLACK);
            this.addCounterToPip(12, Backgammon.CONSTANTS.BLACK);
            this.addCounterToPip(12, Backgammon.CONSTANTS.BLACK);
            this.addCounterToPip(12, Backgammon.CONSTANTS.BLACK);
            this.addCounterToPip(12, Backgammon.CONSTANTS.BLACK);
        }

        function getPipDiv(pipNumber, player) {
            var playerName = _playerNames[player];
            switch (pipNumber) {
                case Backgammon.CONSTANTS.HOME : {
                    return $('div#' + playerName + '-home');
                }
                case Backgammon.CONSTANTS.BAR: {
                    return $('div#' + playerName + '-bar');
                }
                default: {
                    return $('div#' + pipNumber);
                }
            }
        }
        this.addCounterToPip = function(pipNumber, player) {
            // todo: check for legal moves
                
            var playerName = _playerNames[player];
            var totalCounters = _boardData.increment(pipNumber, player);

            var $pipDiv = getPipDiv(pipNumber, player);
            if (totalCounters > 5) {
                $('.counter-total', $pipDiv).text(totalCounters);
            } else if (totalCounters == 5) {
                $pipDiv.append($('<div class="counter counter-total">').addClass(playerName));
            } else {
                $pipDiv.append($('<div class="counter">').addClass(playerName));
            }
        }
        this.removeCounterFromPip = function(pipNumber, player) {
            // todo: check for legal moves
            
            var totalCounters = _boardData.decrement(pipNumber, player);
            
            var $pipDiv = getPipDiv(pipNumber, player);
            if (totalCounters > 5) {
                $('.counter-total', $pipDiv).text(totalCounters);
            } else if (totalCounters == 5) {
                // remove number on the counter total
                $('.counter-total', $pipDiv).text('');
            } else {
                $('.counter', $pipDiv).first().remove();
            }
        }

        this.testMoveCounter = function(player, pipNumber, moves) {
            var startPip = this.getPip(pipNumber);

            // case: there is no counter to move: fail
            if (startPip[player] == 0) {
                console.info('no counter at ' + pipNumber);
                return false;
            }

            var opponent = (player == 0) ? 1 : 0;
            var direction = (player == 0) ? -1 : 1;

            // case: there is a counter on the bar, and this is not it
            if ((pipNumber != Backgammon.CONSTANTS.BAR) && (this.getPip(Backgammon.CONSTANTS.BAR)[player] > 0)) {
                console.info('must move counter off bar first');
                return false;
            }

            // case: there is a counter, but opponent blocks the end pip
            var endPipNumber = (pipNumber + (moves*direction)) % 25; // mod26 is a hack for black coming off the bar. will probably refactor out later.
            var endPip = this.getPip(endPipNumber);
            if (endPip[opponent] >= 2) {
                console.info('pip is blocked');
                return false;
            }
            // todo: more checks, eg player can bear off etc
            return true;
        }

        this.moveCounter = function(player, pipNumber, moves) {
            // check it's legal first
            if (!this.testMoveCounter(player, pipNumber, moves)) {
                return false;
            }

            var startPip = this.getPip(pipNumber);

            var opponent = (player == 0) ? 1 : 0;
            var direction = (player == 0) ? -1 : 1;

            var endPipNumber = (pipNumber + (moves*direction)) % 25; // mod26 is a hack for black coming off the bar. will probably refactor out later.

            var endPip = this.getPip(endPipNumber);
            if (endPip[opponent] == 1) {
                this.removeCounterFromPip(endPipNumber, opponent);
                this.addCounterToPip(Backgammon.CONSTANTS.BAR, opponent);
            }

            this.removeCounterFromPip(pipNumber, player);
            this.addCounterToPip(endPipNumber, player);

            return true;
        }

        this.getPip = function(pipNumber) {
            return [_boardData.getCounters(pipNumber, 0), _boardData.getCounters(pipNumber, 1)];
        }


        this.init();
    }
};