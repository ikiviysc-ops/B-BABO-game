// main.ts - 入口文件

import { Game } from './core/Game';

function bootstrap(): void {
  const canvas = document.getElementById('c') as HTMLCanvasElement;
  if (!canvas) {
    console.error('[main] Canvas element #c not found');
    return;
  }

  // 防止iOS橡皮筋滚动
  document.body.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

  // 隐藏地址栏（移动端）
  if (window.location.hash !== '#standalone') {
    window.location.hash = '#standalone';
  }

  const game = new Game(canvas);
  game.start();

  // 延迟二次resize：手机浏览器地址栏收起后innerHeight会变化
  setTimeout(() => game.onResize(), 100);
  setTimeout(() => game.onResize(), 500);
  setTimeout(() => game.onResize(), 1000);

  // 监听resize
  window.addEventListener('resize', () => game.onResize());
  // 监听orientation变化
  window.addEventListener('orientationchange', () => {
    setTimeout(() => game.onResize(), 200);
  });
  // 监听visualViewport变化（最可靠）
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => game.onResize());
  }
}

// DOMContentLoaded 或直接执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
