export type Expression = 'neutral' | 'happy' | 'angry' | 'scared' | 'hurt';

type BubbleType = 'anger' | 'sweat' | 'heart' | 'question' | 'star';

function clonePixels(pixels: string[][]): string[][] {
  return pixels.map(row => [...row]);
}

function isNotBlank(c: string): boolean {
  return c !== '' && c !== undefined;
}

export function applyExpression(
  basePixels: string[][],
  expression: Expression,
): string[][] {
  if (expression === 'neutral') return clonePixels(basePixels);

  const px = clonePixels(basePixels);
  const h = px.length;
  const w = px[0]?.length ?? 0;

  switch (expression) {
    case 'happy': {
      // 嘴角上弯：row 16 两侧嘴角像素替换为 outline 色
      if (h > 16 && w > 14) {
        const outline = '#3a2a1e';
        px[16][13] = outline;
        px[16][14] = outline;
        if (w > 17) {
          px[16][17] = outline;
          px[16][18] = outline;
        }
        // row 15 嘴角上弯弧线
        if (w > 14) {
          px[15][14] = outline;
          if (w > 17) px[15][17] = outline;
        }
      }
      // 眼皮微抬：row 8-9 lid 区域缩小（替换为皮肤色）
      if (h > 9 && w > 12) {
        const skin = '#f5e0cc';
        for (let x = 12; x <= 18 && x < w; x++) {
          if (isNotBlank(px[8][x])) px[8][x] = skin;
          if (isNotBlank(px[9][x])) px[9][x] = skin;
        }
      }
      break;
    }

    case 'angry': {
      // 眉毛V字：row 7 添加 outline 像素形成 V 形
      if (h > 7 && w > 12) {
        const outline = '#3a2a1e';
        px[7][12] = outline;
        px[7][13] = outline;
        px[7][18] = outline;
        px[7][19] = outline;
        if (w > 14) px[7][14] = outline;
        if (w > 17) px[7][17] = outline;
      }
      // 腮红加深：blush 区域扩展
      if (h > 14 && w > 10) {
        const blush = '#d06060';
        for (let x = 10; x <= 12 && x < w; x++) {
          if (h > 13) px[13][x] = blush;
          px[14][x] = blush;
        }
        if (w > 19) {
          for (let x = 19; x <= 21 && x < w; x++) {
            if (h > 13) px[13][x] = blush;
            px[14][x] = blush;
          }
        }
      }
      break;
    }

    case 'scared': {
      // 瞳孔缩小：eyeI 区域减少（替换为眼白色）
      if (h > 11 && w > 12) {
        const eyeW = '#f8f4f0';
        // 左眼瞳孔缩小
        for (let y = 9; y <= 11 && y < h; y++) {
          for (let x = 13; x <= 15 && x < w; x++) {
            px[y][x] = eyeW;
          }
        }
        // 右眼瞳孔缩小
        if (w > 17) {
          for (let y = 9; y <= 11 && y < h; y++) {
            for (let x = 17; x <= 19 && x < w; x++) {
              px[y][x] = eyeW;
            }
          }
        }
        // 保留中心小瞳孔
        const eyeI = '#4a3728';
        if (w > 14) { px[10][14] = eyeI; }
        if (w > 18) { px[10][18] = eyeI; }
      }
      // 嘴巴张大：mouth 区域扩展
      if (h > 17 && w > 14) {
        const mouth = '#c4908a';
        for (let x = 13; x <= 18 && x < w; x++) {
          px[16][x] = mouth;
          px[17][x] = mouth;
        }
      }
      break;
    }

    case 'hurt': {
      // 眼睛变成X形：row 10-11
      if (h > 11 && w > 12) {
        const xColor = '#3a2a1e';
        // 左眼 X
        px[10][13] = xColor; px[10][15] = xColor;
        px[11][13] = xColor; px[11][15] = xColor;
        px[10][14] = ''; px[11][14] = '';
        // 右眼 X
        if (w > 18) {
          px[10][17] = xColor; px[10][19] = xColor;
          px[11][17] = xColor; px[11][19] = xColor;
          px[10][18] = ''; px[11][18] = '';
        }
      }
      // 嘴角下弯：row 16 两侧嘴角下移
      if (h > 17 && w > 14) {
        const outline = '#3a2a1e';
        px[17][13] = outline;
        px[17][14] = outline;
        if (w > 17) {
          px[17][17] = outline;
          px[17][18] = outline;
        }
        // 清除原嘴角
        px[16][13] = '';
        px[16][14] = '';
        if (w > 17) { px[16][17] = ''; px[16][18] = ''; }
      }
      break;
    }
  }

  return px;
}

export function drawEmotionBubble(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  type: BubbleType,
  size: number,
): void {
  ctx.save();
  const s = size;

  // 气泡背景
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#3a2a1e';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, s, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 小尾巴
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(x - s * 0.3, y + s);
  ctx.lineTo(x, y + s * 1.5);
  ctx.lineTo(x + s * 0.3, y + s);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - s * 0.3, y + s);
  ctx.lineTo(x, y + s * 1.5);
  ctx.lineTo(x + s * 0.3, y + s);
  ctx.stroke();

  ctx.fillStyle = '#3a2a1e';
  ctx.strokeStyle = '#3a2a1e';
  const r = s * 0.5;

  switch (type) {
    case 'anger':
      // 怒气十字
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - r, y - r); ctx.lineTo(x + r, y + r);
      ctx.moveTo(x + r, y - r); ctx.lineTo(x - r, y + r);
      ctx.stroke();
      break;

    case 'sweat':
      // 汗滴
      ctx.fillStyle = '#88bbdd';
      ctx.beginPath();
      ctx.moveTo(x, y - r);
      ctx.quadraticCurveTo(x + r, y, x, y + r);
      ctx.quadraticCurveTo(x - r, y, x, y - r);
      ctx.fill();
      break;

    case 'heart':
      // 爱心
      ctx.fillStyle = '#e88888';
      ctx.beginPath();
      ctx.moveTo(x, y + r * 0.7);
      ctx.bezierCurveTo(x - r * 1.5, y - r * 0.2, x - r * 0.5, y - r * 1.3, x, y - r * 0.5);
      ctx.bezierCurveTo(x + r * 0.5, y - r * 1.3, x + r * 1.5, y - r * 0.2, x, y + r * 0.7);
      ctx.fill();
      break;

    case 'question':
      // 问号
      ctx.font = `bold ${s}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', x, y);
      break;

    case 'star':
      // 五角星
      ctx.fillStyle = '#ffcc44';
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        const px = x + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
        const innerAngle = angle + Math.PI / 5;
        const ix = x + Math.cos(innerAngle) * r * 0.4;
        const iy = y + Math.sin(innerAngle) * r * 0.4;
        ctx.lineTo(ix, iy);
      }
      ctx.closePath();
      ctx.fill();
      break;
  }

  ctx.restore();
}
