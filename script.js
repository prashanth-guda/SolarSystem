const canvas = document.getElementById('solarCanvas');
const tooltip = document.getElementById('tooltip');
const pauseBtn = document.getElementById('pauseBtn');
let paused = false;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 20, 50);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Lighting
const ambientLight = new THREE.AmbientLight(0x888888);
const pointLight = new THREE.PointLight(0xffffff, 2, 300);
scene.add(ambientLight, pointLight);

// Sun
const sunGeo = new THREE.SphereGeometry(3, 32, 32);
const sunMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);
pointLight.position.set(0, 0, 0);

// Starfield background
const starGeo = new THREE.BufferGeometry();
const starCount = 1000;
const starPositions = [];

for (let i = 0; i < starCount; i++) {
  const x = (Math.random() - 0.5) * 1000;
  const y = (Math.random() - 0.5) * 1000;
  const z = (Math.random() - 0.5) * 1000;
  starPositions.push(x, y, z);
}

starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// Planet data
const planetData = [
  { name: 'Mercury', radius: 0.4, distance: 6, color: 0xaaaaaa },
  { name: 'Venus', radius: 0.6, distance: 8, color: 0xffcc99 },
  { name: 'Earth', radius: 0.65, distance: 11, color: 0x3399ff },
  { name: 'Mars', radius: 0.5, distance: 14, color: 0xff5533 },
  { name: 'Jupiter', radius: 1.5, distance: 18, color: 0xffcc99 },
  { name: 'Saturn', radius: 1.2, distance: 22, color: 0xeedd99 },
  { name: 'Uranus', radius: 1.0, distance: 26, color: 0x66ccff },
  { name: 'Neptune', radius: 1.0, distance: 30, color: 0x3366cc }
];

const planets = [];
const speeds = {};
const controls = document.getElementById('controls');

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

planetData.forEach((data, index) => {
  const geo = new THREE.SphereGeometry(data.radius, 32, 32);
  const mat = new THREE.MeshStandardMaterial({ color: data.color });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData = {
    angle: Math.random() * Math.PI * 2,
    distance: data.distance,
    name: data.name
  };
  scene.add(mesh);
  planets.push(mesh);

  // Slider for speed control
  const label = document.createElement('label');
  label.textContent = `${data.name} Speed`;
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '0.001';
  slider.max = '0.05';
  slider.step = '0.001';
  slider.value = (0.005 + index * 0.002).toFixed(3);
  speeds[data.name] = parseFloat(slider.value);
  slider.addEventListener('input', () => {
    speeds[data.name] = parseFloat(slider.value);
  });

  controls.appendChild(label);
  controls.appendChild(slider);
});

// Pause/Resume toggle
pauseBtn.addEventListener('click', () => {
  paused = !paused;
  pauseBtn.textContent = paused ? 'Resume' : 'Pause';
});

function animate() {
  requestAnimationFrame(animate);

  if (!paused) {
    planets.forEach(planet => {
      const { angle, distance, name } = planet.userData;
      planet.userData.angle += speeds[name];
      const a = planet.userData.angle;
      planet.position.set(
        distance * Math.cos(a),
        0,
        distance * Math.sin(a)
      );
    });
  }

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planets);
  if (intersects.length > 0) {
    const obj = intersects[0].object;
    tooltip.style.display = 'block';
    tooltip.textContent = obj.userData.name;
    tooltip.style.left = `${(mouse.x + 1) * window.innerWidth / 2 + 10}px`;
    tooltip.style.top = `${(-mouse.y + 1) * window.innerHeight / 2 + 10}px`;
  } else {
    tooltip.style.display = 'none';
  }

  renderer.render(scene, camera);
}

animate();

// Mouse move for tooltip
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Responsive canvas
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});
