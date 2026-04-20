<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  shape: 'circle' | 'rect' | 'triangle';
  opacity: number;
}

const canvasRef = ref<HTMLCanvasElement | null>(null);
const active = ref(false);
const colors = ['#10b981', '#fb923c', '#f59e0b', '#34d399', '#fef3c7', '#ffffff'];
let particles: Particle[] = [];
let animationFrame: number;

const createParticle = (width: number, height: number): Particle => {
  const x = Math.random() * width;
  const y = height + 10;
  const vx = (Math.random() - 0.5) * 15;
  const vy = -Math.random() * 20 - 10;
  const size = Math.random() * 10 + 5;
  const color = colors[Math.floor(Math.random() * colors.length)];
  const rotation = Math.random() * Math.PI * 2;
  const rotationSpeed = (Math.random() - 0.5) * 0.3;
  const shapes: ('circle' | 'rect' | 'triangle')[] = ['circle', 'rect', 'triangle'];
  const shape = shapes[Math.floor(Math.random() * shapes.length)];

  return { x, y, vx, vy, size, color, rotation, rotationSpeed, shape, opacity: 1 };
};

const draw = () => {
  if (!canvasRef.value) return;
  const ctx = canvasRef.value.getContext('2d');
  if (!ctx) return;

  const width = canvasRef.value.width;
  const height = canvasRef.value.height;

  ctx.clearRect(0, 0, width, height);

  particles.forEach((p, index) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.25; // Gravity
    p.vx *= 0.98; // Air resistance
    p.rotation += p.rotationSpeed;
    
    if (p.y > height + 20) {
      if (active.value) {
        particles[index] = createParticle(width, height);
      } else {
        p.opacity -= 0.02;
      }
    }

    if (p.opacity <= 0) return;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;

    if (p.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.shape === 'rect') {
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -p.size / 2);
      ctx.lineTo(p.size / 2, p.size / 2);
      ctx.lineTo(-p.size / 2, p.size / 2);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  });

  animationFrame = requestAnimationFrame(draw);
};

const start = () => {
  if (!canvasRef.value) return;
  active.value = true;
  // Initial burst
  particles = Array.from({ length: 150 }, () => createParticle(canvasRef.value!.width, canvasRef.value!.height));
};

const stop = () => {
  active.value = false;
};

defineExpose({ start, stop });

const resize = () => {
  if (canvasRef.value) {
    canvasRef.value.width = window.innerWidth;
    canvasRef.value.height = window.innerHeight;
  }
};

onMounted(() => {
  window.addEventListener('resize', resize);
  resize();
  draw();
});

onUnmounted(() => {
  window.removeEventListener('resize', resize);
  cancelAnimationFrame(animationFrame);
});
</script>

<template>
  <canvas
    ref="canvasRef"
    class="fixed inset-0 pointer-events-none z-[100] transition-opacity duration-1000"
    :class="active ? 'opacity-100' : 'opacity-0'"
  ></canvas>
</template>
