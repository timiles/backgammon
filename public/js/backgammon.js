'use strict';

var Backgammon = {
    
    CONSTANTS: Object.freeze({
        HOME: 0,
        BAR: 25,
        RED: 0,
        BLACK: 1
    }),
    
    Dice: function() {
        this.rollOne = function() {
            return Math.floor(Math.random() * 6) + 1;
        }
        this.rollTwo = function() {
            return [this.rollOne(), this.rollOne()];
        }
    },

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

    BoardGui: function(boardElementId) {

        var _playerNames = ["red", "black"];
        var $board = $('#' + boardElementId);

        function init() {
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
        }
        init();

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

        function getCounters($pipDiv) {
            var totalCounters = parseInt($('.counter-total', $pipDiv).text());
            if (isNaN(totalCounters)) {
                 totalCounters = $('.counter', $pipDiv).length;
            }
            return totalCounters;
        }

        this.addCounter = function(pipNumber, player) {
            var playerName = _playerNames[player];
            var $pipDiv = getPipDiv(pipNumber, player);
            var totalCounters = getCounters($pipDiv) + 1;
            if (totalCounters > 5) {
                $('.counter-total', $pipDiv).text(totalCounters);
            } else if (totalCounters == 5) {
                $pipDiv.append($('<div class="counter counter-total">').addClass(playerName));
            } else {
                $pipDiv.append($('<div class="counter">').addClass(playerName));
            }
        }
        this.removeCounter = function(pipNumber, player) {

            var $pipDiv = getPipDiv(pipNumber, player);
            var totalCounters = getCounters($pipDiv) - 1;
            if (totalCounters > 5) {
                $('.counter-total', $pipDiv).text(totalCounters);
            } else if (totalCounters == 5) {
                // remove number on the counter total
                $('.counter-total', $pipDiv).text('');
            } else {
                $('.counter', $pipDiv).first().remove();
            }
        }
    },

    Board: function(boardElementId) {

        var _boardData, _boardGui;
        var _boardElementId = boardElementId;

        function init() {
            _boardData = new Backgammon.BoardData();
            _boardGui = new Backgammon.BoardGui(_boardElementId);

            addCounterToPip(24, Backgammon.CONSTANTS.RED);
            addCounterToPip(24, Backgammon.CONSTANTS.RED);
            addCounterToPip(1, Backgammon.CONSTANTS.BLACK);
            addCounterToPip(1, Backgammon.CONSTANTS.BLACK);
            addCounterToPip(6, Backgammon.CONSTANTS.RED);
            addCounterToPip(6, Backgammon.CONSTANTS.RED);
            addCounterToPip(6, Backgammon.CONSTANTS.RED);
            addCounterToPip(6, Backgammon.CONSTANTS.RED);
            addCounterToPip(6, Backgammon.CONSTANTS.RED);
            addCounterToPip(19, Backgammon.CONSTANTS.BLACK);
            addCounterToPip(19, Backgammon.CONSTANTS.BLACK);
            addCounterToPip(19, Backgammon.CONSTANTS.BLACK);
            addCounterToPip(19, Backgammon.CONSTANTS.BLACK);
            addCounterToPip(19, Backgammon.CONSTANTS.BLACK);
            addCounterToPip(8, Backgammon.CONSTANTS.RED);
            addCounterToPip(8, Backgammon.CONSTANTS.RED);
            addCounterToPip(8, Backgammon.CONSTANTS.RED);
            addCounterToPip(17, Backgammon.CONSTANTS.BLACK);
            addCounterToPip(17, Backgammon.CONSTANTS.BLACK);
            addCounterToPip(17, Backgammon.CONSTANTS.BLACK);
            addCounterToPip(13, Backgammon.CONSTANTS.RED);
            addCounterToPip(13, Backgammon.CONSTANTS.RED);
            addCounterToPip(13, Backgammon.CONSTANTS.RED);
            addCounterToPip(13, Backgammon.CONSTANTS.RED);
            addCounterToPip(13, Backgammon.CONSTANTS.RED);
            addCounterToPip(12, Backgammon.CONSTANTS.BLACK);
            addCounterToPip(12, Backgammon.CONSTANTS.BLACK);
            addCounterToPip(12, Backgammon.CONSTANTS.BLACK);
            addCounterToPip(12, Backgammon.CONSTANTS.BLACK);
            addCounterToPip(12, Backgammon.CONSTANTS.BLACK);
        }
        init();

        function addCounterToPip(pipNumber, player) {
            // todo: check for legal moves
                
            _boardData.increment(pipNumber, player);
            _boardGui.addCounter(pipNumber, player);
        }
        function removeCounterFromPip(pipNumber, player) {
            // todo: check for legal moves
            
            _boardData.decrement(pipNumber, player);
            _boardGui.removeCounter(pipNumber, player);
        }

        function getDestinationPipNumber(player, pipNumber, moves) {
            if (pipNumber == Backgammon.CONSTANTS.BAR && player == Backgammon.CONSTANTS.BLACK) {
                 // when coming off bar
                 return moves;
            }

            var direction = (player == 0) ? -1 : 1;
            var dest = pipNumber + (moves*direction);
            if (dest > 24 || dest < 0) return 0; // when bearing off to home
            return dest;
        }

        this.isMoveLegal = function(player, pipNumber, moves) {
            var startPip = this.getPip(pipNumber);

            // case: there is no counter to move: fail
            if (startPip[player] == 0) {
                console.info('no counter at ' + pipNumber);
                return false;
            }

            // case: there is a counter on the bar, and this is not it
            if ((pipNumber != Backgammon.CONSTANTS.BAR) && (this.getPip(Backgammon.CONSTANTS.BAR)[player] > 0)) {
                console.info('must move counter off bar first');
                return false;
            }

            var destPipNumber = getDestinationPipNumber(player, pipNumber, moves);
            if (destPipNumber == 0) {
                // check all pieces are in home board
                // REVIEW: this code is fiddly, should be extracted away somewhere
                var p1 = 1, p2 = 18;
                if (player == 0) {
                    p1 += 6;
                    p2 += 6;
                }
                for (var p = p1; p <= p2; p++) {
                    if (_boardData.getCounters(p, player) > 0) {
                        return false;
                    }
                }
                // already checked bar above
                return true;
            }

            var opponent = (player == 0) ? 1 : 0;
            var destPip = this.getPip(destPipNumber);

            // case: there is a counter, but opponent blocks the end pip
            if (destPip[opponent] >= 2) {
                console.info('pip is blocked');
                return false;
            }
            // todo: more checks, eg player can bear off etc
            return true;
        }

        this.move = function(player, pipNumber, moves) {
            // check it's legal first
            if (!this.isMoveLegal(player, pipNumber, moves)) {
                return false;
            }

            var startPip = this.getPip(pipNumber);

            var opponent = (player == 0) ? 1 : 0;

            var destPipNumber = getDestinationPipNumber(player, pipNumber, moves);

            var destPip = this.getPip(destPipNumber);
            if (destPip[opponent] == 1) {
                removeCounterFromPip(destPipNumber, opponent);
                addCounterToPip(Backgammon.CONSTANTS.BAR, opponent);
            }

            removeCounterFromPip(pipNumber, player);
            addCounterToPip(destPipNumber, player);

            return true;
        }

        this.getPip = function(pipNumber) {
            return [_boardData.getCounters(pipNumber, 0), _boardData.getCounters(pipNumber, 1)];
        }
    }
};