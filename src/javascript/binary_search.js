import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import gsap from "gsap";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
let key_color = "pink";
let cube_color = "red";
let text_color = "white";
let arrow_color = "yellow";
let container = [];
let midArrow, highArrow, lowArrow;
const canvas_container = document.getElementById("threed");

document.getElementById("sceneButton").onclick = function () {
  let color = document.getElementById("scene_background").value;
  scene.background = new THREE.Color(color);
  console.log(color);
};

document.getElementById("keyFound").onclick = function () {
  let color = document.getElementById("key_found").value;
  key_color = color;
};

document.getElementById("cubeColor").onclick = function () {
  let color = document.getElementById("cube_color").value;
  cube_color = color;
  for (let i = 0; i < container.length; i++) {
    container[i].children[0].material.color = new THREE.Color(color);
  }
};

document.getElementById("textColor").onclick = function () {
  let color = document.getElementById("text_color").value;
  text_color = color;
  for (let i = 0; i < container.length; i++) {
    container[i].children[1].material.color = new THREE.Color(color);
  }
};

document
  .getElementById("myForm")
  .addEventListener("submit", async function ex(e) {
    e.preventDefault();

    let array = document.getElementById("array").value;
    array = array.split(/[ ,]+/).filter(Boolean).map(Number);
    array = array.sort((a, b) => {
      return a - b;
    });
    console.log(array);
    let pos = 0;
    for (let i = 0; i < array.length; i++) {
      let g = element(array[i], i);
      scene.add(g);
      container.push(g);
      g.position.set(pos, 0, 0);
      pos += 1.2;
    }
    console.log(container.length);
    if (container.length > 0) {
      let initial = container[0].position;
      let final = container[container.length - 1].position;
      highArrow = createArrow("high");
      lowArrow = createArrow("low");
      midArrow = createArrow("mid", true);
      midArrow.visible = false;

      lowArrow.position.set(initial.x, initial.y + 2, 0);
      highArrow.position.set(final.x, final.y + 2, 0);
    }
  });

document.getElementById("binary_search").addEventListener("submit", (e) => {
  e.preventDefault();
  let key = parseInt(document.getElementById("key").value);
  if (!isNaN(key)) {
    let l = 0;
    let r = container.length - 1;

    let result = binarySearch(container, l, r, key);

    console.log(result);
  }
});
document.getElementById("reset").onclick = () => {
  for (let i = scene.children.length - 1; i >= 0; i--) {
    let obj = scene.children[i];
    scene.remove(obj);
  }
  container = [];
  midArrow = 0;
  lowArrow = 0;
  highArrow = 0;
};

document.getElementById("resetbs").onclick = () => {
  console.log("hello");
  if (container.length > 0) {
    for (let i = 0; i < container.length; i++) {
      container[i].children[0].material.color = new THREE.Color(cube_color);
    }
    let initial = container[0].position;
    let final = container[container.length - 1].position;
    midArrow.visible = false;

    lowArrow.position.set(initial.x, initial.y + 2, 0);
    highArrow.position.set(final.x, final.y + 2, 0);
  }
};

const fontLoader = new FontLoader();

const canvas = document.getElementById("webgl");

const scene = new THREE.Scene();
scene.background = new THREE.Color("#2e2e2e");

const constructArrow = (inital, final) => {
  let ix = inital.x,
    iy = inital.y,
    iz = inital.z,
    fx = final.x,
    fy = final.y,
    fz = final.z;
  const thickness = 0.06;
  const ARROW_BODY = new THREE.CylinderGeometry(1, 1, 1, 12)
    .rotateX(Math.PI / 2)
    .translate(0, 0, 0.5);

  const ARROW_HEAD = new THREE.ConeGeometry(1, 1, 12)
    .rotateX(Math.PI / 2)
    .translate(0, 0, -0.5);

  var material = new THREE.MeshStandardMaterial({ color: arrow_color });

  var length = Math.sqrt((ix - fx) ** 2 + (iy - fy) ** 2 + (iz - fz) ** 2);

  var body = new THREE.Mesh(ARROW_BODY, material);
  body.scale.set(thickness, thickness, length - 10 * thickness);

  var head = new THREE.Mesh(ARROW_HEAD, material);
  head.position.set(0, 0, length);
  head.scale.set(3 * thickness, 3 * thickness, 10 * thickness);

  var arrow = new THREE.Group();
  arrow.position.set(ix, iy, iz);
  arrow.lookAt(fx, fy, fz);
  arrow.add(body, head);

  return arrow;
};
const createArrow = (text, down) => {
  const group = new THREE.Group();
  fontLoader.load("/helvetiker_regular.typeface.json", (font) => {
    const textGeometry = new TextGeometry(text.toString(), {
      font: font,
      size: 0.3,
      height: 0.1,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSegments: 5,
      bevelSize: 0.02,
      bevelOffset: -0.002,
      bevelThickness: 0.02,
    });
    const textMaterial = new THREE.MeshStandardMaterial({ color: text_color });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    group.add(textMesh);
    textMesh.position.set(-0.6, 0.3, 0);
    if (down == true) {
      textMesh.position.set(-0.6, -3.4, 0);
    }
  });

  let initial = { x: 0, y: 0.125, z: 0 };
  let final = { x: 0, y: -1.5, z: 0 };
  if (down == true) {
    final.y = -1.1;
    initial.y = -3;
  }
  let arrow = constructArrow(initial, final);
  group.add(arrow);
  scene.add(group);

  return group;
};
function element(data, index) {
  // Create Cube Mesh and add it to the group
  let group = new THREE.Group();
  let geo = new THREE.BoxGeometry(1, 1, 1);
  let met = new THREE.MeshStandardMaterial({
    color: cube_color,
    roughness: 0.4,
    metalness: 0.5,
  });
  let cubemesh = new THREE.Mesh(geo, met);
  group.add(cubemesh);
  // Create Text Mesh and add it to the group
  fontLoader.load("/helvetiker_regular.typeface.json", (font) => {
    const geo = new TextGeometry(data.toString(), {
      font: font,
      size: 0.5,
      height: 0.1,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSegments: 5,
      bevelSize: 0.02,
      bevelOffset: -0.002,
      bevelThickness: 0.02,
    });
    let mat = new THREE.MeshStandardMaterial({ color: text_color });
    let textmesh = new THREE.Mesh(geo, mat);
    group.add(textmesh);

    let cube_pos = cubemesh.position;
    textmesh.position.set(
      cube_pos.x - 0.43,
      cube_pos.y - 0.2,
      cube_pos.z + 0.6
    );
    const idxgeo = new TextGeometry(index.toString(), {
      font: font,
      size: 0.4,
      height: 0.1,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSegments: 5,
      bevelSize: 0.02,
      bevelOffset: -0.002,
      bevelThickness: 0.02,
    });
    let idxmat = new THREE.MeshStandardMaterial({ color: text_color });
    let idxmesh = new THREE.Mesh(idxgeo, idxmat);
    idxmesh.position.set(-0.3, -1, 0);
    group.add(idxmesh);
  });

  group.userData = {
    data: data,
  };
  return group;
}
const setupArrows = (low, high, mid, container) => {
  if (container.length > 0) {
    let first = container[0].position;
    let last = container[container.length - 1].position;

    mid.position.set(first.x, first.y - 2, 0);
    low.position.set(first.x, first.y + 2, 0);
    high.position.set(last.x, last.y + 2, last.z);
  }
};

const binarySearch = async (arr, l, r, key) => {
  while (l <= r) {
    midArrow.visible = true;
    let mid = Math.floor(l + (r - l) / 2);
    await gsap.to(midArrow.position, { x: arr[mid].position.x, duration: 2 });
    console.log(l, r, key);
    if (arr[mid].userData.data === key) {
      arr[mid].children[0].material.color = new THREE.Color(key_found);
      return mid;
    } else if (arr[mid].userData.data < key) {
      await gsap.to(lowArrow.position, {
        x: arr[mid + 1].position.x,
        duration: 2,
      });
      l = mid + 1;
    } else if (arr[mid].userData.data > key) {
      await gsap.to(highArrow.position, {
        x: arr[mid - 1].position.x,
        duration: 2,
      });

      r = mid - 1;
    }
  }

  return -1;
};

setupArrows(lowArrow, highArrow, midArrow, container);

const sizes = {
  width: canvas_container.clientWidth,
  height: canvas_container.clientHeight,
};
const camera = new THREE.PerspectiveCamera(80, sizes.width / sizes.height);

window.addEventListener(
  "resize",
  () => {
    sizes.width = canvas_container.clientWidth;
    sizes.height = canvas_container.clientHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    controls.update();
  },
  false
);

camera.position.z = 5;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
const regbeloader = new RGBELoader();
regbeloader.load("/hdrr.hdr", function (texture) {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  var envMap = pmremGenerator.fromEquirectangular(texture).texture;
  //scene.background = envMap;

  scene.environment = envMap;
  texture.dispose();
  pmremGenerator.dispose();
});
var pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

renderer.setSize(sizes.width, sizes.height);

const tick = () => {
  controls.update();

  renderer.setSize(sizes.width, sizes.height);
  camera.updateMatrix();
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};
tick();
