// Ensure Three.js is loaded
if (!THREE) console.error("Three.js not found!");

// Get container
const container = document.getElementById('lanyard-container');
if (!container) console.error("No element with id 'lanyard-container' found.");

// Scene & Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(20, 1, 0.1, 1000);
camera.position.set(0, 0, 30);

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

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
  new THREE.Vector3(2, 0, 0),
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
lanyardTexture.repeat.set(1, 4); // Repeat along the rope

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

// Drag
let isDragging = false;
let dragOffset = new THREE.Vector3();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onPointerDown(event) {
  if (!card) return;
  mouse.x = (event.clientX / container.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / container.clientHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(card, true);
  if (intersects.length > 0) {
    isDragging = true;
    dragOffset.copy(intersects[0].point).sub(card.position);
  }
}

function onPointerMove(event) {
  if (!isDragging || !card) return;
  mouse.x = (event.clientX / container.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / container.clientHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), -card.position.z);
  const intersect = new THREE.Vector3();
  raycaster.ray.intersectPlane(planeZ, intersect);
  card.position.copy(intersect.sub(dragOffset));
}

function onPointerUp() {
  isDragging = false;
}

container.addEventListener('pointerdown', onPointerDown);
container.addEventListener('pointermove', onPointerMove);
container.addEventListener('pointerup', onPointerUp);

// Resize & update camera
function resizeRenderer() {
  const width = container.clientWidth;
  const height = container.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  updateCardScale();
}
window.addEventListener('resize', resizeRenderer);
resizeRenderer();

// Card scaling function
function updateCardScale() {
  if (!card) return;
  const scaleFactor = container.clientHeight / 300;
  card.scale.set(scaleFactor, scaleFactor, scaleFactor);
  card.position.set(0, -0.3 * scaleFactor, 0);
}

// Animate
function animate() {
  requestAnimationFrame(animate);

  if (card && !isDragging) {
    card.rotation.y += 0.002;
    card.rotation.x += 0.001;
  }

  // Update lanyard to follow card
  points[4].copy(card ? card.position : points[4]);
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