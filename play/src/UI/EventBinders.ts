import { PlayerId, PointId } from '../Enums'
import { Game } from '../Game'
import { GameUI } from './GameUI'

import { Board } from '../BoardComponents/Board'
import { BoardUI } from './BoardUI'
import { BarUI } from './BarUI'
import { HomeUI } from './HomeUI'

import { Dice } from '../DiceComponents/Dice'
import { DiceUI } from './DiceUI'

import { StatusLogger } from '../StatusLogger'
import { StatusUI } from './StatusUI'

export class EventBinders {
    static bindGame(game: Game, gameUI: GameUI): void {
        EventBinders.bindBoardEvents(game.board, gameUI.boardUI);
        EventBinders.bindDiceEvents(game.dice, gameUI.blackDiceUI, gameUI.redDiceUI);
        EventBinders.bindStatusLoggerEvents(game.statusLogger, gameUI.statusUI);
    }

    private static bindBoardEvents(board: Board, boardUI: BoardUI) {
        // helpers
        let getBarUI = (playerId: PlayerId): BarUI => {
            return (playerId === PlayerId.BLACK) ? boardUI.blackBarUI : boardUI.redBarUI;
        }
        let getHomeUI = (playerId: PlayerId): HomeUI => {
            return (playerId === PlayerId.BLACK) ? boardUI.blackHomeUI : boardUI.redHomeUI;
        }

        // wire up UI events
        boardUI.blackHomeUI.onSelected = () => board.onPointSelected(PointId.HOME);
        boardUI.redHomeUI.onSelected = () => board.onPointSelected(PointId.HOME);
        boardUI.blackBarUI.onInspected = (on: boolean) => board.onPointInspected(PointId.BAR, on);
        boardUI.blackBarUI.onSelected = () => board.onPointSelected(PointId.BAR);
        boardUI.redBarUI.onInspected = (on: boolean) => board.onPointInspected(PointId.BAR, on);
        boardUI.redBarUI.onSelected = () => board.onPointSelected(PointId.BAR);

        let bindPointUIEvents = (pointId: number): void => {
            let pointUI = boardUI.pointUIs[pointId - 1];
            pointUI.onInspected = (on: boolean) => { board.onPointInspected(pointId, on); };
            pointUI.onSelected = () => { board.onPointSelected(pointId); };
        }
        for (let i = 1; i < 25; i++) {
            bindPointUIEvents(i);
        }

        board.onCheckerCountChanged = (pointId: number, playerId: PlayerId, count: number) => {
            switch (pointId) {
                case PointId.HOME: {
                    getHomeUI(playerId).setCheckers(playerId, count);
                    break;
                }
                case PointId.BAR: {
                    getBarUI(playerId).setCheckers(playerId, count);
                    break;
                }
                default: {
                    boardUI.pointUIs[pointId - 1].setCheckers(playerId, count);
                }
            }
        };
        board.onSetBarAsSelected = (playerId: PlayerId, on: boolean) => {
            getBarUI(playerId).setSelected(on);
        };
        board.onSetPointAsSelected = (pointId: number, on: boolean) => {
            boardUI.pointUIs[pointId - 1].setSelected(on);
        };
        board.onSetHomeAsValidDestination = (playerId: PlayerId, on: boolean) => {
            getHomeUI(playerId).setValidDestination(on);
        };
        board.onSetPointAsValidDestination = (pointId: number, on: boolean) => {
            boardUI.pointUIs[pointId - 1].setValidDestination(on);
        };
        board.onSetBarAsValidSource = (playerId: PlayerId, on: boolean) => {
            getBarUI(playerId).setValidSource(on);
        };
        board.onSetPointAsValidSource = (pointId: number, on: boolean) => {
            boardUI.pointUIs[pointId - 1].setValidSource(on);
        };
    }

    private static bindDiceEvents(dice: Dice, blackDiceUI: DiceUI, redDiceUI: DiceUI) {
        let getDiceUI = (playerId: PlayerId): DiceUI => {
            switch (playerId) {
                case PlayerId.BLACK: return blackDiceUI;
                case PlayerId.RED: return redDiceUI;
                default: throw `Unknown PlayerId: ${playerId}`;
            }
        }

        dice.onSetStartingDiceRoll = (playerId, die) => { getDiceUI(playerId).setStartingDiceRoll(die); };
        dice.onSetDiceRolls = (playerId, die1, die2) => { getDiceUI(playerId).setDiceRolls(die1, die2); };
        dice.onSetActive = (playerId, active) => { getDiceUI(playerId).setActive(active); };
    }

    private static bindStatusLoggerEvents(statusLogger: StatusLogger, statusUI: StatusUI) {
        statusLogger.onLogInfo = (info) => { statusUI.setStatus(info); };
    }
}