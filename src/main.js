import "./style.css";
import * as THREE from "three";
import { initWeatherWidget } from "./weather.js";
import { initCVModal } from "./cv.js";

// Initialize UI components
initWeatherWidget();
initCVModal();

// 1. SCENE SETUP
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505); // Very sleek dark background

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  antialias: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

// 2. RESIZE EVENT LISTENER (Responsive Canvas)
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// 3. TECH-THEMED 3D OBJECTS
// Object A: Abstract Wireframe TorusKnot (Represents complex Logic/Code)
const geometryKnot = new THREE.TorusKnotGeometry(10, 2.5, 120, 16);
const materialKnot = new THREE.MeshStandardMaterial({
  color: 0x4f46e5, // Tech Indigo Blue
  wireframe: true,
  emissive: 0x1a1060,
  emissiveIntensity: 0.5,
});
const torusKnot = new THREE.Mesh(geometryKnot, materialKnot);
scene.add(torusKnot);

torusKnot.position.z = -15;
torusKnot.position.x = 15;

// Object B: Floating Glass-morphism Cube (Represents UI/UX elements)
const cubeGeo = new THREE.BoxGeometry(5, 5, 5);
const cubeMat = new THREE.MeshPhysicalMaterial({
  color: 0xec4899, // Vibrant Pink
  metalness: 0.1,
  roughness: 0.1,
  transparent: true,
  opacity: 0.8,
  transmission: 0.9, // glass-like effect
  clearcoat: 1.0,
});
const cube = new THREE.Mesh(cubeGeo, cubeMat);
scene.add(cube);

cube.position.z = -5;
cube.position.x = -10;
cube.position.y = 5;

// Object C: Cyber Particles (Represents Data Streams)
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 500;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  // Spread particles around the scene
  posArray[i] = (Math.random() - 0.5) * 100;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(posArray, 3),
);
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.15,
  color: 0x00ffcc, // Cyan data points
  transparent: true,
  opacity: 0.8,
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// 4. LIGHTING
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

const blueLight = new THREE.PointLight(0x0055ff, 3);
blueLight.position.set(-10, -10, -10);
scene.add(blueLight);

// 5. SCROLL ANIMATION EVENT
function moveCamera() {
  // Get how far the user has scrolled
  const t = document.body.getBoundingClientRect().top;

  // Rotate objects based on scroll
  cube.rotation.y += 0.05;
  cube.rotation.x += 0.05;

  torusKnot.rotation.x += 0.01;
  torusKnot.rotation.y += 0.02;

  // Move the camera smoothly based on scroll position
  camera.position.z = t * -0.01 + 30;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

// Bind scroll event
document.body.onscroll = moveCamera;
moveCamera(); // Call once to set initial position

// 6. ANIMATION LOOP
const timer = new THREE.Timer(); // for smooth particle animation

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = timer.getElapsed();

  // Gentle continuous rotation
  torusKnot.rotation.x += 0.002;
  torusKnot.rotation.y += 0.001;

  cube.rotation.x += 0.005;
  cube.rotation.z += 0.002;

  // Float the particles slowly
  particlesMesh.rotation.y = elapsedTime * 0.05;

  // Rotate the entire scene extremely slowly to feel dynamic
  scene.rotation.y += 0.0005;

  renderer.render(scene, camera);
}

animate();
