/* =========================================================
   three-effects.js  v2
   1. Animated star-particle background (hero / skills / timeline)
   2. Front-facing floating 3D avatar (hero only)
   ========================================================= */

/* ── helpers ── */
function inSphere(count, radius) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    let x, y, z;
    do {
      x = (Math.random() * 2 - 1) * radius;
      y = (Math.random() * 2 - 1) * radius;
      z = (Math.random() * 2 - 1) * radius;
    } while (x*x + y*y + z*z > radius * radius);
    pos[i*3] = x; pos[i*3+1] = y; pos[i*3+2] = z;
  }
  return pos;
}

/* ── 1. STAR BACKGROUND ── */
function initStars(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
  camera.position.z = 1;

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(inSphere(5000, 1.2), 3));
  const mat = new THREE.PointsMaterial({
    color: 0xf272c8, size: 0.002, sizeAttenuation: true,
    transparent: true, depthWrite: false
  });
  const group = new THREE.Group();
  group.rotation.z = Math.PI / 4;
  group.add(new THREE.Points(geo, mat));
  scene.add(group);

  let last = 0;
  (function animate(now) {
    const d = (now - last) / 1000; last = now;
    group.rotation.x -= d / 10;
    group.rotation.y -= d / 15;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  })(0);

  function resize() {
    const p = canvas.parentElement;
    const w = p.offsetWidth, h = p.offsetHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();
}

/* ── 2. 3D AVATAR ──
   Camera placed directly in front along +Z axis.
   Ready Player Me avatars face +Z by default so rotation (0,0,0) = front-facing.
   ─────────────────── */
function initAvatar(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene  = new THREE.Scene();

  /* Camera: straight in front, fov wide enough to see full body */
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0.5, isMobile ? 5.5 : 4.5);

  /* Lights */
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x000000, 0.4);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(2, 4, 4);
  key.castShadow = true;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0x8855ff, 0.5);
  fill.position.set(-3, 2, -2);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xf272c8, 0.4);
  rim.position.set(0, 5, -4);
  scene.add(rim);

  /* OrbitControls — allow horizontal drag, lock vertical */
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableZoom    = false;
  controls.enablePan     = false;
  controls.target.set(0, -0.5, 0);   /* look at chest level */
  controls.maxPolarAngle = Math.PI / 2;
  controls.minPolarAngle = Math.PI / 2;
  controls.update();

  /* Load GLB */
  let avatarObj = null;
  const baseY = isMobile ? -2.8 : -2.5;

  new THREE.GLTFLoader().load(
    './avatar/avatar.glb',
    function(gltf) {
      avatarObj = new THREE.Object3D();
      avatarObj.add(gltf.scene);

      const s = isMobile ? 2.0 : 2.3;
      avatarObj.scale.set(s, s, s);
      avatarObj.position.set(0, baseY, 0);
      avatarObj.rotation.set(0, 0, 0);   /* front-facing */

      scene.add(avatarObj);
    },
    undefined,
    function(e) { console.warn('GLB error:', e); }
  );

  const clock = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop);
    if (avatarObj) {
      avatarObj.position.y = baseY + Math.sin(clock.getElapsedTime() * 2) * 0.12;
    }
    controls.update();
    renderer.render(scene, camera);
  })();

  function resize() {
    const w = canvas.parentElement.offsetWidth;
    const h = canvas.parentElement.offsetHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();
}

/* ── Typewriter ── */
function initTypewriter(elId, words, speed) {
  const el = document.getElementById(elId);
  if (!el) return;
  let wi = 0, ci = 0, deleting = false;
  function tick() {
    const word = words[wi];
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    if (!deleting && ci > word.length)  { deleting = true; setTimeout(tick, 1400); return; }
    if ( deleting && ci < 0)           { deleting = false; wi = (wi+1) % words.length; ci = 0; }
    setTimeout(tick, deleting ? speed/2 : speed);
  }
  tick();
}

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', function() {
  initStars('stars-hero');
  initStars('stars-skills');
  initStars('stars-timeline');
  initAvatar('avatar-canvas');
  initTypewriter('hero-typewriter',
    ['Machine Learning Engineer', 'Computer Vision Researcher',
     'Data Scientist', 'Deep Learning Enthusiast'], 80);
});
