// main.ts - 入口文件

import { Game } from './core/Game';

function bootstrap(): void {
  const canvas = document.getElementById('c') as HTMLCanvasElement;
  if (!canvas) {
    console.error('[main] Canvas element #c not found');
    return;
  }

  const game = new Game(canvas);
  game.start();
}

// DOMContentLoaded 或直接执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
