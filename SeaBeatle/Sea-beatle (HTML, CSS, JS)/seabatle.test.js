import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;

import { createPlayerBoard, createEnemyBoard, isShipClose, isKillClose, handleCellClick } from '../seabatle.js';

describe('Sea Battle Game', () => {
  let playerBoard, enemyBoard;

  beforeEach(() => {
    playerBoard = document.createElement('div');
    playerBoard.id = 'player-board-grid';
    enemyBoard = document.createElement('div');
    enemyBoard.id = 'enemy-board-grid';
    document.body.appendChild(playerBoard);
    document.body.appendChild(enemyBoard);

    window.gameLevel = 0;
    window.playerHits = 0;
    window.enemyHits = 0;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });
});
