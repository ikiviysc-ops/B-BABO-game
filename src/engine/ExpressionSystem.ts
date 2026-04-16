// ExpressionSystem.ts - 表情系统

export type ExpressionType = 'neutral' | 'hurt' | 'happy' | 'angry' | 'scared';

// 表情修改规则：基于16x16像素精灵
// 定义眼睛和嘴巴区域的行/列偏移
interface ExpressionRule {
  eyeRows: number[];   // 眼睛所在行
  eyeCols: number[];   // 眼睛所在列
  mouthRow: number;    // 嘴巴所在行
  mouthCols: number[]; // 嘴巴列范围
  eyeReplace: string;  // 替换眼睛像素的颜色键
  mouthPixels: string; // 嘴巴像素模式（空格分隔的颜色键）
}

const EXPRESSIONS: Record<ExpressionType, ExpressionRule> = {
  neutral: {
    eyeRows: [5, 6],
    eyeCols: [4, 5, 10, 11],
    mouthRow: 9,
    mouthCols: [6, 7, 8, 9],
    eyeReplace: 'eye',
    mouthPixels: '. mouth . mouth . mouth . mouth',
  },
  hurt: {
    eyeRows: [5, 6],
    eyeCols: [4, 5, 10, 11],
    mouthRow: 9,
    mouthCols: [6, 7, 8, 9],
    eyeReplace: 'hurt_eye',
    mouthPixels: '. . mouth mouth mouth mouth . .',
  },
  happy: {
    eyeRows: [5],
    eyeCols: [4, 5, 10, 11],
    mouthRow: 9,
    mouthCols: [5, 6, 7, 8, 9, 10],
    eyeReplace: 'happy_eye',
    mouthPixels: '. mouth mouth mouth mouth mouth mouth .',
  },
  angry: {
    eyeRows: [4, 5, 6],
    eyeCols: [4, 5, 10, 11],
    mouthRow: 9,
    mouthCols: [6, 7, 8, 9],
    eyeReplace: 'angry_eye',
    mouthPixels: '. . mouth mouth mouth mouth . .',
  },
  scared: {
    eyeRows: [5, 6, 7],
    eyeCols: [4, 5, 10, 11],
    mouthRow: 10,
    mouthCols: [7, 8],
    eyeReplace: 'scared_eye',
    mouthPixels: '. . . . mouth mouth . . . .',
  },
};

export function applyExpression(
  basePixels: string[],
  expression: ExpressionType,
): string[] {
  // 深拷贝
  const pixels = basePixels.map(row => row);
  const rule = EXPRESSIONS[expression];
  if (!rule) return pixels;

  // 修改眼睛
  for (const row of rule.eyeRows) {
    if (row >= pixels.length) continue;
    const rowData = pixels[row].trim().split(/\s+/);
    for (const col of rule.eyeCols) {
      if (col < rowData.length) {
        rowData[col] = rule.eyeReplace;
      }
    }
    pixels[row] = rowData.join(' ');
  }

  // 修改嘴巴
  if (rule.mouthRow < pixels.length) {
    const rowData = pixels[rule.mouthRow].trim().split(/\s+/);
    const mouthPattern = rule.mouthPixels.trim().split(/\s+/);
    for (let i = 0; i < rule.mouthCols.length && i < mouthPattern.length; i++) {
      const col = rule.mouthCols[i];
      if (col < rowData.length && mouthPattern[i] !== '.') {
        rowData[col] = mouthPattern[i];
      }
    }
    pixels[rule.mouthRow] = rowData.join(' ');
  }

  // angry特殊处理：在眼睛上方加眉毛（用深色像素）
  if (expression === 'angry') {
    const browRow = rule.eyeRows[0] - 1;
    if (browRow >= 0 && browRow < pixels.length) {
      const rowData = pixels[browRow].trim().split(/\s+/);
      // 左眉（向内倾斜）
      if (rule.eyeCols[0] + 1 < rowData.length) {
        rowData[rule.eyeCols[0]] = 'hair';
        rowData[rule.eyeCols[0] + 1] = 'hair';
      }
      // 右眉（向内倾斜）
      if (rule.eyeCols[2] - 1 >= 0) {
        rowData[rule.eyeCols[2]] = 'hair';
        rowData[rule.eyeCols[2] - 1] = 'hair';
      }
      pixels[browRow] = rowData.join(' ');
    }
  }

  return pixels;
}

export function createExpressionPalette(
  basePalette: Record<string, string>,
  expression: ExpressionType,
): Record<string, string> {
  const palette = { ...basePalette };

  switch (expression) {
    case 'hurt':
      palette['hurt_eye'] = '#ff4444';
      palette['mouth'] = '#ff6666';
      break;
    case 'happy':
      palette['happy_eye'] = '#44ff44';
      palette['mouth'] = '#ff8888';
      break;
    case 'angry':
      palette['angry_eye'] = '#ff0000';
      palette['mouth'] = '#cc0000';
      break;
    case 'scared':
      palette['scared_eye'] = '#ffffff';
      palette['mouth'] = '#888888';
      break;
    default:
      palette['eye'] = basePalette['eye'] ?? '#000000';
      palette['mouth'] = basePalette['mouth'] ?? '#cc4444';
      break;
  }

  return palette;
}
