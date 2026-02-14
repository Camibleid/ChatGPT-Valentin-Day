const intro = document.getElementById('intro');
const questionArea = document.getElementById('question-area');
const actions = document.getElementById('actions');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const message = document.getElementById('message');
const confettiCanvas = document.getElementById('confetti');

const noStages = [
  'No',
  '¿Estás segura?',
  '¿Estás totalmente segura?',
  '¿Estás superhipermega segura?'
];

let noClicks = 0;
let yesScale = 1;
let noScale = 1;
let noEnabled = true;

const introDurationMs = 6500;

setTimeout(() => {
  intro.classList.add('finished');
  questionArea.classList.remove('hidden');
}, introDurationMs);

noBtn.addEventListener('click', () => {
  if (!noEnabled) return;

  if (noClicks < noStages.length - 1) {
    noClicks += 1;
    yesScale *= 1.1;
    noScale *= 0.9;
    noBtn.textContent = noStages[noClicks];
    yesBtn.style.transform = `scale(${yesScale.toFixed(3)})`;
    noBtn.style.transform = `scale(${noScale.toFixed(3)})`;
    return;
  }

  noEnabled = false;
  noBtn.style.opacity = '0';
  noBtn.style.pointerEvents = 'none';
  message.classList.remove('hidden');
  message.classList.add('show');
  actions.classList.add('final');
  actions.style.justifyContent = 'center';
  yesBtn.style.transform = `scale(${(yesScale * 1.1).toFixed(3)})`;
});

yesBtn.addEventListener('click', () => {
  startConfetti();
  spawnRoseBurst();
});

function startConfetti() {
  confettiCanvas.classList.remove('hidden');
  const ctx = confettiCanvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  confettiCanvas.width = width * dpr;
  confettiCanvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const colors = ['#d94d7a', '#f497b2', '#ffffff', '#ffd166', '#a7cfa6'];
  const pieces = Array.from({ length: 180 }, () => ({
    x: Math.random() * width,
    y: -20 - Math.random() * height,
    r: 4 + Math.random() * 7,
    color: colors[Math.floor(Math.random() * colors.length)],
    speedY: 1.3 + Math.random() * 2.4,
    speedX: -1 + Math.random() * 2,
    swing: Math.random() * Math.PI * 2
  }));

  let frames = 0;

  function animate() {
    ctx.clearRect(0, 0, width, height);

    pieces.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.swing) * 0.45;
      p.swing += 0.07;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.swing);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.7);
      ctx.restore();
    });

    frames += 1;
    if (frames < 360) {
      requestAnimationFrame(animate);
    } else {
      confettiCanvas.classList.add('hidden');
      ctx.clearRect(0, 0, width, height);
    }
  }

  animate();
}

function spawnRoseBurst() {
  const burstPoints = [
    { x: 0.2, y: 0.65 },
    { x: 0.35, y: 0.58 },
    { x: 0.5, y: 0.62 },
    { x: 0.65, y: 0.57 },
    { x: 0.8, y: 0.66 }
  ];

  burstPoints.forEach((point, index) => {
    const burst = document.createElement('div');
    burst.className = 'rose-burst';
    burst.style.left = `calc(${point.x * 100}% - 60px)`;
    burst.style.top = `calc(${point.y * 100}% - 60px)`;
    burst.style.animationDelay = `${index * 0.12}s`;
    burst.innerHTML = `
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="18" fill="#c7356a"/>
        <circle cx="36" cy="50" r="13" fill="#e5638f"/>
        <circle cx="64" cy="50" r="13" fill="#e5638f"/>
        <circle cx="50" cy="36" r="13" fill="#e5638f"/>
        <circle cx="50" cy="64" r="13" fill="#e5638f"/>
        <path d="M49 68 L43 95 L55 95 Z" fill="#4f7f58"/>
        <circle cx="30" cy="30" r="4" fill="#fff"/>
        <circle cx="26" cy="40" r="3" fill="#fff"/>
        <circle cx="74" cy="35" r="4" fill="#fff"/>
      </svg>
    `;

    document.querySelector('.scene').appendChild(burst);
    setTimeout(() => burst.remove(), 3000);
  });
}

window.addEventListener('resize', () => {
  if (!confettiCanvas.classList.contains('hidden')) {
    startConfetti();
  }
});
