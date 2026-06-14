/* =========================================================
   three-effects.js
   Drop into /js/ — loaded after Three.js CDN scripts.
   Handles:
     1. Star-particle background (hero, skills, timeline)
     2. Floating 3D avatar (hero only)
   ========================================================= */

/* ---------- helpers ---------- */

function inSphere(count, radius) {
  /* uniform rejection-sample — equivalent to maath/random inSphere */
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    let x, y, z;
    do {
      x = (Math.random() * 2 - 1) * radius;
      y = (Math.random() * 2 - 1) * radius;
      z = (Math.random() * 2 - 1) * radius;
    } while (x * x + y * y + z * z > radius * radius);
    pos[i * 3]     = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;
  }
  return pos;
}

/* ---------- 1. STAR BACKGROUND ----------
   Call once per section canvas id.
   The canvas must be position:absolute, width/height 100%, z-index 0.
   ---------------------------------------- */

function initStars(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
  camera.position.z = 1;

  /* star cloud — 5 000 pink points in a sphere r = 1.2 */
  const positions = inSphere(5000, 1.2);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color:           0xf272c8,
    size:            0.002,
    sizeAttenuation: true,
    transparent:     true,
    depthWrite:      false
  });

  const points = new THREE.Points(geo, mat);

  /* match React: rotation group at Math.PI/4 on Z */
  const group = new THREE.Group();
  group.rotation.z = Math.PI / 4;
  group.add(points);
  scene.add(group);

  let last = 0;
  function animate(now) {
    const delta = (now - last) / 1000;
    last = now;
    /* match React useFrame deltas */
    group.rotation.x -= delta / 10;
    group.rotation.y -= delta / 15;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  function resize() {
    const w = canvas.parentElement.offsetWidth;
    const h = canvas.parentElement.offsetHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();
}

/* ---------- 2. 3D AVATAR ----------
   Loads ./avatar/avatar.glb — same path as Aditya's.
   Canvas must live inside a flex column that fills half the header.
   ---------------------------------- */

function initAvatar(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const isMobile = window.matchMedia('(max-width: 500px)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  const scene  = new THREE.Scene();
  /* same camera as ProfileCanvas: position [20,3,5], fov 25 */
  const camera = new THREE.PerspectiveCamera(25, 1, 0.1, 1000);
  camera.position.set(20, 3, 5);

  /* lights — match React component exactly */
  const hemi = new THREE.HemisphereLight(0xffffff, 0x000000, 0.15);
  scene.add(hemi);

  const point = new THREE.PointLight(0xffffff, 1);
  scene.add(point);

  const spot = new THREE.SpotLight(0xffffff, 1);
  spot.position.set(-20, 50, 10);
  spot.angle     = 0.12;
  spot.penumbra  = 1;
  spot.castShadow = true;
  spot.shadow.mapSize.width = 1024;
  scene.add(spot);

  /* orbit controls — zoom locked, horizontal orbit only */
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableZoom    = false;
  controls.maxPolarAngle = Math.PI / 2;
  controls.minPolarAngle = Math.PI / 2;

  /* load the glb */
  let avatarObj = null;
  const baseY   = isMobile ? -3.8 : -3.5; /* resting Y before float */

  const loader = new THREE.GLTFLoader();
  loader.load(
    './avatar/avatar.glb',
    function (gltf) {
      avatarObj = new THREE.Object3D();
      avatarObj.add(gltf.scene);

      if (isMobile) {
        avatarObj.scale.set(2.3, 2.3, 2.3);
        avatarObj.position.set(-3.8, baseY, -2);
        avatarObj.rotation.set(0.12, 1.26, -0.1);
      } else {
        avatarObj.scale.set(3.6, 3.6, 3.6);
        avatarObj.position.set(-2, baseY, -7.2);
        avatarObj.rotation.set(0.12, 1.1, -0.1);
      }
      scene.add(avatarObj);
    },
    undefined,
    function (err) { console.warn('Avatar GLB load error:', err); }
  );

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    /* floating bob — Math.sin(time * 2) * 0.2 like React useFrame */
    if (avatarObj) {
      avatarObj.position.y = baseY + Math.sin(t * 2) * 0.2;
    }
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  function resize() {
    const w = canvas.parentElement.offsetWidth;
    const h = canvas.parentElement.offsetHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();
}

/* ---------- boot ---------- */
document.addEventListener('DOMContentLoaded', function () {
  initStars('stars-hero');
  initStars('stars-skills');
  initStars('stars-timeline');
  initAvatar('avatar-canvas');
});
