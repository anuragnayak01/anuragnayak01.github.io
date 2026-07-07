/* =========================================================
   three-effects.js  v3
   1. Star-particle background  (hero / skills / timeline)
   2. Front-facing floating 3D avatar
   3. Typewriter effect
   ========================================================= */

function inSphere(count, radius) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    let x, y, z;
    do {
      x = (Math.random()*2-1)*radius;
      y = (Math.random()*2-1)*radius;
      z = (Math.random()*2-1)*radius;
    } while (x*x + y*y + z*z > radius*radius);
    pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=z;
  }
  return pos;
}

/* ── 1. STARS ────────────────────────────────────────────── */
function initStars(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
  camera.position.z = 1;

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(inSphere(5000, 1.2), 3));
  const mat = new THREE.PointsMaterial({
    color:0xf272c8, size:0.002, sizeAttenuation:true, transparent:true, depthWrite:false
  });
  const group = new THREE.Group();
  group.rotation.z = Math.PI / 4;
  group.add(new THREE.Points(geo, mat));
  scene.add(group);

  let last = 0;
  (function loop(now) {
    const d = (now-last)/1000; last = now;
    group.rotation.x -= d/10; group.rotation.y -= d/15;
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  })(0);

  function resize() {
    const p = canvas.parentElement;
    const w = p.offsetWidth, h = Math.max(p.offsetHeight, 100);
    renderer.setSize(w, h, false);
    camera.aspect = w/h; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize); resize();
}

/* ── 2. AVATAR ───────────────────────────────────────────────
   Camera sits directly in front (+Z axis).
   Avatar rotation.y = -PI/2 turns it to face +Z (toward camera).
   T-pose arms then point into/out of screen and are invisible —
   the figure looks like a normal standing person from the front.
   ─────────────────────────────────────────────────────────── */
function initAvatar(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const isMobile = window.matchMedia('(max-width:768px)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  /* Camera straight ahead on +Z axis */
  camera.position.set(0, 0, isMobile ? 6.5 : 5.8);

  /* Lights */
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  scene.add(new THREE.HemisphereLight(0xffffff, 0x050816, 0.5));

  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(1, 3, 4); key.castShadow = true;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0x9966ff, 0.6);
  fill.position.set(-3, 1, 2);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xff66cc, 0.4);
  rim.position.set(0, 4, -3);
  scene.add(rim);

  /* Orbit controls: allow horizontal drag only */
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableZoom = false;
  controls.enablePan  = false;
  controls.target.set(0, 0.2, 0);   /* look at chest level */
  controls.maxPolarAngle = Math.PI / 2;
  controls.minPolarAngle = Math.PI / 2;
  controls.update();

  let avatarObj = null;
  const baseY = -1.6;

  new THREE.GLTFLoader().load(
    './avatar/avatar.glb',
    function(gltf) {
      avatarObj = new THREE.Object3D();
      avatarObj.add(gltf.scene);
      const s = isMobile ? 1.3 : 1.5;
      avatarObj.scale.set(s, s, s);
      avatarObj.position.set(0, baseY, 0);
      /* -PI/2 rotates avatar from facing +X → facing +Z (toward camera) */
      avatarObj.rotation.set(0, -Math.PI / 6, 0); 
      scene.add(avatarObj);
    },
    undefined,
    function(e){ console.warn('GLB error:', e); }
  );

  const clock = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop);
    if (avatarObj) {
      avatarObj.position.y = baseY + Math.sin(clock.getElapsedTime() * 2) * 0.1;
    }
    controls.update();
    renderer.render(scene, camera);
  })();

  function resize() {
    const w = canvas.parentElement.offsetWidth;
    const h = Math.max(canvas.parentElement.offsetHeight, 300);
    renderer.setSize(w, h, false);
    camera.aspect = w/h; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize); resize();
}

/* ── 3. TYPEWRITER ───────────────────────────────────────── */
function initTypewriter(elId, words, speed) {
  const el = document.getElementById(elId);
  if (!el) return;
  let wi=0, ci=0, deleting=false;
  function tick() {
    const word = words[wi];
    el.textContent = word.slice(0, ci);
    if (!deleting) {
      ci++;
      if (ci > word.length) { deleting=true; setTimeout(tick, 1600); return; }
    } else {
      ci--;
      if (ci < 0) { deleting=false; ci=0; wi=(wi+1)%words.length; }
    }
    setTimeout(tick, deleting ? 40 : speed);
  }
  /* small boot delay so the page is rendered first */
  setTimeout(tick, 800);
}

/* ── Boot ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  initAvatar('avatar-canvas');
  initTypewriter('hero-typewriter',
    ['Machine Learning Engineer','Computer Vision Researcher',
     'Data Scientist','Deep Learning Enthusiast'], 75);
});
