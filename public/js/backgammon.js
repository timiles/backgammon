'use strict';

var Backgammon = {
    Players: { Red : 0, Black: 1 },
    Board: function(boardElementId) {

        // layout: 0 is home
        var layout;

        this.init = function() {
            layout = new Array(25);

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

            for (var i = 0; i < 25; i++) {
                layout[i] = [0, 0];
            }

            this.addCounterToPip(24, Backgammon.Players.Red);
            this.addCounterToPip(24, Backgammon.Players.Red);
            this.addCounterToPip(1, Backgammon.Players.Black);
            this.addCounterToPip(1, Backgammon.Players.Black);
            this.addCounterToPip(6, Backgammon.Players.Red);
            this.addCounterToPip(6, Backgammon.Players.Red);
            this.addCounterToPip(6, Backgammon.Players.Red);
            this.addCounterToPip(6, Backgammon.Players.Red);
            this.addCounterToPip(6, Backgammon.Players.Red);
            this.addCounterToPip(19, Backgammon.Players.Black);
            this.addCounterToPip(19, Backgammon.Players.Black);
            this.addCounterToPip(19, Backgammon.Players.Black);
            this.addCounterToPip(19, Backgammon.Players.Black);
            this.addCounterToPip(19, Backgammon.Players.Black);
            this.addCounterToPip(8, Backgammon.Players.Red);
            this.addCounterToPip(8, Backgammon.Players.Red);
            this.addCounterToPip(8, Backgammon.Players.Red);
            this.addCounterToPip(17, Backgammon.Players.Black);
            this.addCounterToPip(17, Backgammon.Players.Black);
            this.addCounterToPip(17, Backgammon.Players.Black);
            this.addCounterToPip(13, Backgammon.Players.Red);
            this.addCounterToPip(13, Backgammon.Players.Red);
            this.addCounterToPip(13, Backgammon.Players.Red);
            this.addCounterToPip(13, Backgammon.Players.Red);
            this.addCounterToPip(13, Backgammon.Players.Red);
            this.addCounterToPip(12, Backgammon.Players.Black);
            this.addCounterToPip(12, Backgammon.Players.Black);
            this.addCounterToPip(12, Backgammon.Players.Black);
            this.addCounterToPip(12, Backgammon.Players.Black);
            this.addCounterToPip(12, Backgammon.Players.Black);
        }

        this.addCounterToPip = function(pip, player) {
            // todo: check for legal moves
                
            var playerNames = ["red", "black"];
            var playerName = playerNames[player];
            layout[pip][player]++;

            var totalCounters = layout[pip][player];

            if (pip == 0) {
                // special case for home pips:
                $('div#' + playerName + '-home').append($('<div class="counter">').addClass(playerName).text(totalCounters));
            }
            else {
                var $pipDiv = $('div#' + pip);
                if (totalCounters > 5) {
                    $pipDiv.append($('<div class="counter">').addClass(playerName).text(totalCounters));
                } else {
                    $pipDiv.append($('<div class="counter">').addClass(playerName));
                }
            }
        }

        this.testMoveCounter = function(pipNumber, moves) {
            var pip = this.getPip(pipNumber);
            // case: there is no counter to move: fail
            if (pip[0] == 0 && pip[1] == 0) {
                return false;
            }
            var me = pip[0] > 0 ? 0 : 1;
            var opp = (me == 0) ? 1 : 0;
            var dir = (me == 0) ? -1 : 1;
            // case: there is a counter, but opponent blocks the end pip
            if (this.getPip(pipNumber + (moves*dir))[opp] >= 2) {
                return false;
            }
            // todo: more checks, eg player can bear off etc
            return true;
        }

        this.getPip = function(pipNumber) {
            return layout[pipNumber];
        }


        this.init();
    }
};