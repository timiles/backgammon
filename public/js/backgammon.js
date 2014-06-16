'use strict';

var Backgammon = {
    Players: { Red : 0, Black: 1 },
    Board: function(boardElementId) {

        var $board = $('#' + boardElementId);
        $board.addClass('board');
        $board.append($('<div id="13" class="pip top-pip red-pip">'));
        $board.append($('<div id="14" class="pip top-pip black-pip">'));
        $board.append($('<div id="15" class="pip top-pip red-pip">'));
        $board.append($('<div id="16" class="pip top-pip black-pip">'));
        $board.append($('<div id="17" class="pip top-pip red-pip">'));
        $board.append($('<div id="18" class="pip top-pip black-pip">'));
        $board.append($('<div id="black-bar" class="pip bar">'));
        $board.append($('<div id="19" class="pip top-pip red-pip">'));
        $board.append($('<div id="20" class="pip top-pip black-pip">'));
        $board.append($('<div id="21" class="pip top-pip red-pip">'));
        $board.append($('<div id="22" class="pip top-pip black-pip">'));
        $board.append($('<div id="23" class="pip top-pip red-pip">'));
        $board.append($('<div id="24" class="pip top-pip black-pip">'));
        $board.append($('<div id="black-home" class="pip home">'));
        $board.append($('<br class="clear">'));
        $board.append($('<div id="12" class="pip bottom-pip black-pip">'));
        $board.append($('<div id="11" class="pip bottom-pip red-pip">'));
        $board.append($('<div id="10" class="pip bottom-pip black-pip">'));
        $board.append($('<div id="9" class="pip bottom-pip red-pip">'));
        $board.append($('<div id="8" class="pip bottom-pip black-pip">'));
        $board.append($('<div id="7" class="pip bottom-pip red-pip">'));
        $board.append($('<div id="red-bar" class="pip bar">'));
        $board.append($('<div id="6" class="pip bottom-pip black-pip">'));
        $board.append($('<div id="5" class="pip bottom-pip red-pip">'));
        $board.append($('<div id="4" class="pip bottom-pip black-pip">'));
        $board.append($('<div id="3" class="pip bottom-pip red-pip">'));
        $board.append($('<div id="2" class="pip bottom-pip black-pip">'));
        $board.append($('<div id="1" class="pip bottom-pip red-pip">'));
        $board.append($('<div id="red-home" class="pip home">'));
        $board.append($('<br class="clear">'));

        // layout: 0 is home
        var layout = new Array(25);
        for (var i = 0; i < 25; i++) {
            layout[i] = [0, 0];
        }

        this.addCounterToPip = function(pip, player) {
            // todo: check for legal moves
                
            var playerNames = ["red", "black"];
            var playerName = playerNames[player];
            layout[pip][player]++;

            var totalCounters = layout[pip][player];

            if (pip == 0) {
                // special case for home pips:
                $('DIV#' + playerName + '-home').append($('<DIV class="counter">').addClass(playerName).text(totalCounters));
            }
            else {
                var $pipDiv = $('DIV#' + pip);
                if (totalCounters > 5) {
                    $pipDiv.append($('<DIV class="counter">').addClass(playerName).text(totalCounters));
                } else {
                    $pipDiv.append($('<DIV class="counter">').addClass(playerName));
                }
            }
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

        this.getPip = function(pip) {
            return layout[pip];
        }
    }
};