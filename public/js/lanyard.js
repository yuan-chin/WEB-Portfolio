// Ensure Three.js is loaded
if (!THREE) console.error("Three.js not found!");

// ── FULLSCREEN OVERLAY SETUP ──────────────────────────────────────────────────
// Instead of appending the canvas to a small container, we attach it to <body>
// as a fixed overlay so the lanyard/card can appear anywhere on the page.

const canvas = document.createElement('canvas');
canvas.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;   /* pass clicks through by default */
  z-index: 9999;          /* above everything */
`;
document.body.appendChild(canvas);

// Scene & Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 30);

// Renderer (attach to our fullscreen canvas)
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);
const directional = new THREE.DirectionalLight(0xffffff, 2);
directional.position.set(10, 10, 10);
scene.add(directional);

// Load GLB card
let card;
const loader = new THREE.GLTFLoader();
loader.load(
  'assets/card.glb',
  (gltf) => {
    card = gltf.scene;
    scene.add(card);
    updateCardScale();
  },
  undefined,
  (err) => console.error("Failed to load card.glb:", err)
);

// Lanyard points & curve
const points = [
  new THREE.Vector3(0, 4, 0),
  new THREE.Vector3(0.5, 0, 0),
  new THREE.Vector3(1, 0, 0),
  new THREE.Vector3(1.5, 0, 0),
  new THREE.Vector3(2, 0, 0),  // will be overwritten by card pos
];
const curve = new THREE.CatmullRomCurve3(points);

// Texture for lanyard
const textureLoader = new THREE.TextureLoader();
const lanyardTexture = textureLoader.load(
  'assets/lanyard.png',
  undefined,
  undefined,
  (err) => console.error("Failed to load lanyard.png:", err)
);
lanyardTexture.wrapS = lanyardTexture.wrapT = THREE.RepeatWrapping;
lanyardTexture.repeat.set(1, 4);

// Tube geometry for rope
let lanyardMesh;
function createLanyard() {
  if (lanyardMesh) scene.remove(lanyardMesh);
  const tubeGeometry = new THREE.TubeGeometry(curve, 32, 0.06, 8, false);
  const tubeMaterial = new THREE.MeshBasicMaterial({ map: lanyardTexture });
  lanyardMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
  scene.add(lanyardMesh);
}
createLanyard();

// ── DRAG ─────────────────────────────────────────────────────────────────────
let isDragging = false;
let dragOffset = new THREE.Vector3();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function getMouseNDC(event) {
  // Use full window dimensions since canvas is fixed fullscreen
  mouse.x =  (event.clientX / window.innerWidth)  * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function isHoveringCard(event) {
  if (!card) return false;
  getMouseNDC(event);
  raycaster.setFromCamera(mouse, camera);
  return raycaster.intersectObject(card, true).length > 0;
}

// Enable pointer events on canvas only when cursor is over the card
window.addEventListener('mousemove', (event) => {
  if (isDragging) {
    canvas.style.pointerEvents = 'auto';
    return;
  }
  canvas.style.pointerEvents = isHoveringCard(event) ? 'auto' : 'none';
});

function onPointerDown(event) {
  if (!card) return;
  getMouseNDC(event);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(card, true);
  if (intersects.length > 0) {
    isDragging = true;
    dragOffset.copy(intersects[0].point).sub(card.position);
    canvas.style.cursor = 'grabbing';
  }
}

function onPointerMove(event) {
  if (!isDragging || !card) return;
  getMouseNDC(event);
  raycaster.setFromCamera(mouse, camera);
  const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), -card.position.z);
  const intersect = new THREE.Vector3();
  raycaster.ray.intersectPlane(planeZ, intersect);
  card.position.copy(intersect.sub(dragOffset));
}

function onPointerUp() {
  isDragging = false;
  canvas.style.cursor = 'grab';
}

// Listen on the canvas (which sits on top of the page)
canvas.addEventListener('pointerdown', onPointerDown);
window.addEventListener('pointermove', onPointerMove);
window.addEventListener('pointerup', onPointerUp);

// Change cursor to grab when hovering card
canvas.addEventListener('mousemove', (e) => {
  if (!isDragging) canvas.style.cursor = isHoveringCard(e) ? 'grab' : 'default';
});

// ── RESIZE ───────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  updateCardScale();
});

function updateCardScale() {
  if (!card) return;
  const scaleFactor = window.innerHeight / 300;
  card.scale.set(scaleFactor, scaleFactor, scaleFactor);
  const rightOffset = window.innerWidth * 0.18;  
  const topOffset = window.innerHeight * 0.0;   
  card.position.set(rightOffset / 30, topOffset / 30, 0); 
}

// ── ANIMATE ──────────────────────────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);

  if (card && !isDragging) {
    card.rotation.y += 0.002;
    card.rotation.x += 0.001;
  }

  // Update lanyard tail to follow card
  if (card) points[4].copy(card.position);
  for (let i = 3; i >= 0; i--) points[i].lerp(points[i + 1], 0.1);
  curve.points = points;

  if (lanyardMesh) {
    const newGeometry = new THREE.TubeGeometry(curve, 32, 0.06, 8, false);
    lanyardMesh.geometry.dispose();
    lanyardMesh.geometry = newGeometry;
  }

  renderer.render(scene, camera);
}
animate();