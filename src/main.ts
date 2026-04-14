/**
 * B-BABO幸存者：无尽深渊
 * 像素风Roguelike生存射击游戏 - 入口
 */

import { Game } from '@core/Game';

// 等待 DOM 就绪
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('[B-BABO] Canvas element not found!');
    return;
  }

  const game = new Game(canvas);
  game.start();

  // 暴露到 window 用于调试
  (window as any).__GAME__ = game;
});
