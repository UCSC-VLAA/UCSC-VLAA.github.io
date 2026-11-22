// Side-by-side 3D surfaces (ground truth | SAM3 | Dr. SAM3-D | Dr. SAM3-T) with one shared camera.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const CASE_LABELS = {
  CT_AMOS_amos_0214: ["CT", "Abdominal organs (AMOS)"],
  CT_TotalSeg_organs_s0794: ["CT", "Chest and abdomen (TotalSegmentator)"],
  MR_AMOSMR_amos_0592: ["MR", "Abdominal organs (AMOS-MR)"],
  "US_Low-limb-Leg35": ["US", "Lower-leg muscles"],
};
const SOURCES = ["gt", "s", "d", "t"];
const ROOT = "static/meshes/";

const stage = document.getElementById("meshStage");
const canvas = document.getElementById("meshCanvas");
const loading = document.getElementById("meshLoading");
const chips = document.getElementById("meshChips");
const legend = document.getElementById("meshLegend");
const rotateBtn = document.getElementById("meshRotate");
const resetBtn = document.getElementById("meshReset");
const sourceSwitch = document.getElementById("meshSource");
const labels = document.getElementById("meshLabels");

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setScissorTest(true);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const camera = new THREE.PerspectiveCamera(32, 1, 1, 5000);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.6;
controls.enablePan = false;

const scenes = SOURCES.map(() => {
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x334155, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(1, 2, 3);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x93c5fd, 0.8);
  rim.position.set(-2, -1, -2);
  scene.add(rim);
  const group = new THREE.Group();
  scene.add(group);
  return { scene, group };
});

let manifest = null;
let currentCase = null;
let singleSource = "t";
let extent = 300;
const hidden = new Set();
const cache = new Map();

function narrow() {
  return window.matchMedia("(max-width: 720px)").matches;
}

function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (canvas.width !== Math.round(w * renderer.getPixelRatio()) || canvas.height !== Math.round(h * renderer.getPixelRatio())) {
    renderer.setSize(w, h, false);
  }
  camera.aspect = narrow() ? w / h : w / SOURCES.length / h;
  camera.updateProjectionMatrix();
}

function frameCamera() {
  resize();
  const vfov = (camera.fov * Math.PI) / 180;
  const hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect);
  const d = (extent / Math.tan(Math.min(vfov, hfov) / 2)) * 1.12;
  const dir = new THREE.Vector3(0.55, 0.25, 0.8).normalize();
  camera.position.copy(dir.multiplyScalar(d));
  camera.near = d / 50;
  camera.far = d * 10;
  controls.target.set(0, 0, 0);
  camera.updateProjectionMatrix();
  controls.update();
}

function buildGroup(parts, buffer, ext) {
  const group = [];
  for (const p of parts) {
    const q = new Uint16Array(buffer.slice(p.posOffset, p.posOffset + p.vertCount * 6));
    const pos = new Float32Array(q.length);
    for (let i = 0; i < q.length; i++) pos[i] = (q[i] / 32767.5 - 1) * ext;
    const bytes = p.idxType === "u16" ? 2 : 4;
    const slice = buffer.slice(p.idxOffset, p.idxOffset + p.idxCount * bytes);
    const idx = p.idxType === "u16" ? new Uint16Array(slice) : new Uint32Array(slice);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setIndex(new THREE.BufferAttribute(idx, 1));
    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(p.color), roughness: 0.42, metalness: 0.05, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.userData.classId = p.id;
    group.push(mesh);
  }
  return group;
}

async function loadCase(entry) {
  currentCase = entry.case;
  [...chips.children].forEach((b) => b.classList.toggle("active", b.dataset.case === entry.case));
  loading.classList.remove("hidden");
  loading.textContent = "Loading 3D surfaces…";
  hidden.clear();
  try {
    if (!cache.has(entry.case)) {
      const buffers = await Promise.all(SOURCES.map((s) => fetch(`${ROOT}${entry.case}/${s}.bin`).then((r) => {
        if (!r.ok) throw new Error(r.status);
        return r.arrayBuffer();
      })));
      cache.set(entry.case, SOURCES.map((s, i) => buildGroup(entry.sources[s], buffers[i], entry.extent_mm)));
    }
    if (currentCase !== entry.case) return;
    const groups = cache.get(entry.case);
    groups.flat().forEach((m) => { m.visible = true; });
    scenes.forEach(({ group }, i) => {
      group.clear();
      groups[i].forEach((m) => group.add(m));
    });
    extent = entry.extent_mm / 2;
    frameCamera();
    [...labels.children].forEach((span) => {
      const v = entry.dsc && entry.dsc[span.dataset.source];
      const score = span.querySelector(".score");
      if (score) score.textContent = v === undefined ? "" : `DSC ${v.toFixed(1)}`;
    });
    const classes = new Map();
    SOURCES.forEach((s) => entry.sources[s].forEach((p) => { if (!classes.has(p.id)) classes.set(p.id, p); }));
    legend.innerHTML = "";
    [...classes.values()].sort((a, b) => a.id - b.id).forEach((p) => {
      const b = document.createElement("button");
      b.innerHTML = `<i style="background:${p.color}"></i>${p.name}`;
      b.title = "Show / hide";
      b.addEventListener("click", () => {
        if (hidden.has(p.id)) hidden.delete(p.id); else hidden.add(p.id);
        b.classList.toggle("off", hidden.has(p.id));
        scenes.forEach(({ group }) => group.children.forEach((m) => { m.visible = !hidden.has(m.userData.classId); }));
      });
      legend.appendChild(b);
    });
    loading.classList.add("hidden");
  } catch (err) {
    loading.textContent = "Could not load the 3D surfaces (serve the page over HTTP).";
  }
}

function render() {
  resize();
  controls.update();
  const w = canvas.clientWidth, h = canvas.clientHeight;
  renderer.setClearColor(0x000000, 0);
  if (narrow()) {
    const i = SOURCES.indexOf(singleSource);
    renderer.setViewport(0, 0, w, h);
    renderer.setScissor(0, 0, w, h);
    renderer.render(scenes[i].scene, camera);
  } else {
    const panel = w / SOURCES.length;
    scenes.forEach(({ scene }, i) => {
      renderer.setViewport(i * panel, 0, panel, h);
      renderer.setScissor(i * panel, 0, panel, h);
      renderer.render(scene, camera);
    });
  }
}

let running = false;
function loop() {
  if (!running) return;
  render();
  requestAnimationFrame(loop);
}

controls.addEventListener("start", () => {
  controls.autoRotate = false;
  rotateBtn.classList.remove("on");
});
rotateBtn.addEventListener("click", () => {
  controls.autoRotate = !controls.autoRotate;
  rotateBtn.classList.toggle("on", controls.autoRotate);
});
resetBtn.addEventListener("click", () => frameCamera());
sourceSwitch.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  singleSource = b.dataset.source;
  [...sourceSwitch.children].forEach((x) => x.classList.toggle("active", x === b));
});

async function init() {
  manifest = await fetch(`${ROOT}meshes.json`).then((r) => r.json());
  manifest.forEach((entry) => {
    const [mod, label] = CASE_LABELS[entry.case] || [entry.modality, entry.case];
    const b = document.createElement("button");
    b.dataset.case = entry.case;
    b.innerHTML = `<span class="mod">${mod}</span>${label}`;
    b.addEventListener("click", () => loadCase(entry));
    chips.appendChild(b);
  });
  loadCase(manifest[0]);
}

let started = false;
const io = new IntersectionObserver((entries) => {
  const visible = entries.some((e) => e.isIntersecting);
  if (visible && !started) {
    started = true;
    init().catch(() => { loading.textContent = "Could not load the 3D surfaces (serve the page over HTTP)."; });
  }
  if (visible && !running) { running = true; loop(); }
  if (!visible) running = false;
}, { rootMargin: "200px" });
io.observe(stage);
