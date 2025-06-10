const canvas = document.getElementById("solarCanvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
const pointLight = new THREE.PointLight(0xffffff, 1.2);
scene.add(ambientLight, pointLight);

// Sun
const sunGeometry = new THREE.SphereGeometry(4, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Camera position
camera.position.z = 40;

// Planet data
const planetData = [
  { name: "Mercury", radius: 0.5, distance: 7, color: 0xaaaaaa },
  { name: "Venus", radius: 0.9, distance: 10, color: 0xffcc99 },
  { name: "Earth", radius: 1, distance: 13, color: 0x3399ff },
  { name: "Mars", radius: 0.8, distance: 16, color: 0xff5533 },
  { name: "Jupiter", radius: 2, distance: 20, color: 0xffddaa },
  { name: "Saturn", radius: 1.8, distance: 25, color: 0xeeddaa },
  { name: "Uranus", radius: 1.5, distance: 30, color: 0x66ccff },
  { name: "Neptune", radius: 1.4, distance: 35, color: 0x3366cc }
];

const planets = [];
const speeds = {};
const controlsDiv = document.getElementById("controls");

// Create planets and controls
planetData.forEach((planet, i) => {
  const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: planet.color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = { angle: Math.random() * Math.PI * 2 };
  scene.add(mesh);
  planets.push({ mesh, data: planet });

  // Control
  const label = document.createElement("label");
  label.innerText = `${planet.name} Speed`;
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "0.001";
  slider.max = "0.1";
  slider.step = "0.001";
  slider.value = 0.01 + i * 0.002;
  speeds[planet.name] = parseFloat(slider.value);
  slider.oninput = () => speeds[planet.name] = parseFloat(slider.value);

  controlsDiv.appendChild(label);
  controlsDiv.appendChild(slider);
});

function animate() {
  requestAnimationFrame(animate);
  planets.forEach(({ mesh, data }) => {
    const speed = speeds[data.name];
    mesh.userData.angle += speed;
    const x = data.distance * Math.cos(mesh.userData.angle);
    const z = data.distance * Math.sin(mesh.userData.angle);
    mesh.position.set(x, 0, z);
  });
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
