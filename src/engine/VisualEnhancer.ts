import { ParticleSystem } from './ParticleSystem';

export function drawCharacterShadow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  isMoving: boolean,
): void {
  ctx.save();
  const scaleX = isMoving ? 1.3 : 1;
  const scaleY = isMoving ? 0.6 : 0.7;
  const rx = (width / 2) * scaleX;
  const ry = (width / 4) * scaleY;

  ctx.translate(x, y);
  ctx.scale(1, 1);
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);

  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  grad.addColorStop(0, 'rgba(0,0,0,0.35)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();
}

export function drawHitFlash(
  ctx: CanvasRenderingContext2D,
  sprite: HTMLCanvasElement,
  x: number,
  y: number,
  flashIntensity: number,
): void {
  if (flashIntensity <= 0) return;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = flashIntensity;
  ctx.drawImage(sprite, x, y);
  ctx.restore();
}

export function drawGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  intensity = 0.6,
): void {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = intensity;

  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
  grad.addColorStop(0, color);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawDamageNumber(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  damage: number,
  isCrit: boolean,
  age: number,
  lifetime: number,
): void {
  const progress = Math.min(age / lifetime, 1);
  const alpha = 1 - progress;

  const riseY = y - age * 60;
  const scale = isCrit
    ? 1 + 0.5 * Math.sin(progress * Math.PI)
    : 1 + 0.25 * Math.sin(progress * Math.PI);

  const fontSize = isCrit ? 28 : 20;
  const text = String(damage);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, riseY);
  ctx.scale(scale, scale);
  ctx.font = `bold ${fontSize}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (isCrit) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.strokeText(text, 0, 0);
    ctx.fillStyle = '#FFD700';
  } else {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeText(text, 0, 0);
    ctx.fillStyle = '#FFFFFF';
  }
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

export function spawnDeathEffect(
  particles: ParticleSystem,
  x: number,
  y: number,
  color: string,
): void {
  const count = 8 + Math.floor(Math.random() * 5);
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const speed = 80 + Math.random() * 160;
    particles.emit(x, y, {
      count: 1,
      speedMin: speed,
      speedMax: speed,
      lifeMin: 0.3,
      lifeMax: 0.7,
      sizeMin: 2,
      sizeMax: 5,
      colors: [color, '#FFFFFF', '#FFAA66'],
      gravity: 60,
      friction: 0.96,
      spreadAngle: 0.01,
    }, angle);
  }
}
