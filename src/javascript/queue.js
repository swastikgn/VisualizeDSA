import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import gsap from "gsap";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

let container = [];
let arrows = [];
let text_arrow_color = "red";
let cube_color = "yellow";

document.getElementById("sceneButton").onclick = function () {
  let color = document.getElementById("scene_background").value;
  console.log(color);
  scene.background = new THREE.Color(color);
};

document.getElementById("reset").onclick = function () {
  for (let i = 0; i < container.length; i++) {
    scene.remove(container[i]);
  }

  for (let i = 0; i < arrows.length; i++) {
    scene.remove(arrows[i]);
  }
  container = [];
  arrows = [];
};

document.getElementById("cubeColor").onclick = function () {
  let color = document.getElementById("cube_color").value;
  for (let i = 0; i < container.length; i++) {
    container[i].children[0].material.color = new THREE.Color(color);
  }
  cube_color = new THREE.Color(color);
};

document.getElementById("textColor").onclick = function () {
  let color = document.getElementById("text_color").value;
  text_arrow_color = new THREE.Color(color);

  for (let i = 0; i < container.length; i++) {
    container[i].children[1].material.color = text_arrow_color;
  }
  console.log(arrows.length);
  if (arrows.length > 0) {
    for (let i = 0; i < arrows.length; i++) {
      arrows[i].children[0].material.color = text_arrow_color;
      arrows[i].children[1].material.color = text_arrow_color;
    }
  }
};

const canvas_container = document.getElementById("threed");

let previous = new THREE.Vector3(0, 0, 0);
const fontLoader = new FontLoader();
const font = fontLoader.load("/helvetiker_regular.typeface.json");

document.getElementById("myForm").addEventListener("submit", function ex(e) {
  e.preventDefault();

  let x = document.getElementById("array").value;
  array = x.split(/[ ,]+/).filter(Boolean).map(Number);
  if (array.length <= 0) {
    console.log("Empty output");
  } else {
    frontArrow();
    rearArrow();
    enqueue(array[0]);
  }
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

document.getElementById("dequeue").onclick = async function () {
  const front = container[0];

  container.shift();
  gsap.to(front.scale, {
    duration: 0.3,
    x: 0,
    y: 0,
    z: 0,
    ease: "bounce",
  });
  scene.remove(front);

  if (container.length == 0) {
    gsap.to(arrows[0].position, { duration: 0.4, x: 0 });
    gsap.to(arrows[1].position, { duration: 0.4, x: 0 });
  } else {
    const first = container[0].position;
    gsap.to(arrows[1].position, { duration: 0.3, x: first.x });
  }
};

const canvas = document.getElementById("webgl");

const scene = new THREE.Scene();

const sizes = {
  width: canvas_container.clientWidth,
  height: canvas_container.clientHeight,
};
const camera = new THREE.PerspectiveCamera(80, sizes.width / sizes.height);

function frontArrow() {
  fontLoader.load("/helvetiker_regular.typeface.json", async (font) => {
    let group = new THREE.Group();

    const arrowg = new TextGeometry("--->", {
      font: font,
      size: 0.37,
      height: 0.1,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSegments: 5,
      bevelSize: 0.02,
      bevelOffset: -0.002,
      bevelThickness: 0.02,
    });
    const material = new THREE.MeshStandardMaterial({
      color: text_arrow_color,
      roughness: 0,
      metalness: 0.3,
    });
    const arrowmesh = new THREE.Mesh(arrowg, material);
    arrowmesh.rotateZ(THREE.MathUtils.degToRad(-135));
    // arrowmesh.position.set(-0.8, 1.4, 0);
    group.add(arrowmesh);

    const tex = new TextGeometry("rear", {
      font: font,
      size: 0.37,
      height: 0.1,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSegments: 10,
      bevelSize: 0.02,
      bevelOffset: -0.002,
      bevelThickness: 0.02,
    });

    const mesh = new THREE.Mesh(tex, material);
    // mesh.position.set(-1, 1.4, 0);
    group.add(mesh);
    group.position.set(0, 0, 0);
    scene.add(group);
    group.scale.set(0, 0, 0);
    arrows.push(group);
  });
}

function rearArrow() {
  fontLoader.load("/helvetiker_regular.typeface.json", async (font) => {
    let group = new THREE.Group();

    const arrowg = new TextGeometry("--->", {
      font: font,
      size: 0.37,
      height: 0.1,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSegments: 5,
      bevelSize: 0.02,
      bevelOffset: -0.002,
      bevelThickness: 0.02,
    });
    const material = new THREE.MeshStandardMaterial({
      color: text_arrow_color,
      roughness: 0.3,
    });
    const arrowmesh = new THREE.Mesh(arrowg, material);
    arrowmesh.rotateZ(THREE.MathUtils.degToRad(-45));
    arrowmesh.position.set(-1, -0.2, 0);
    group.add(arrowmesh);

    const tex = new TextGeometry("front", {
      font: font,
      size: 0.37,
      height: 0.1,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSegments: 5,
      bevelSize: 0.02,
      bevelOffset: -0.002,
      bevelThickness: 0.02,
    });

    const mesh = new THREE.Mesh(tex, material);
    mesh.position.set(-1.2, 0, 0);
    group.add(mesh);
    group.position.set(0, 0, 0);
    scene.add(group);
    group.scale.set(0, 0, 0);
    arrows.push(group);
  });
}

async function enqueue(value) {
  if (container.length == 0) {
    previous = new THREE.Vector3(0, 0, 0);
  }
  fontLoader.load(
    "/helvetiker_regular.typeface.json",

    async (font) => {
      let group = new THREE.Group();
      const box_geometry = new THREE.BoxGeometry(1, 1, 1);
      const box_material = new THREE.MeshStandardMaterial({
        color: cube_color,
        roughness: 0.1,
        metalness: 0.2,
      });
      const box_mesh = new THREE.Mesh(box_geometry, box_material);

      const text_geometry = new TextGeometry(value.toString(), {
        font: font,
        size: 0.37,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSegments: 5,
        bevelSize: 0.02,
        bevelOffset: -0.002,
        bevelThickness: 0.02,
      });

      const text_material = new THREE.MeshStandardMaterial({
        color: text_arrow_color,
        roughness: 0,
        metalness: 0.4,
      });
      const text_mesh = new THREE.Mesh(text_geometry, text_material);

      text_mesh.position.set(
        box_mesh.position.x - 0.4,
        box_mesh.position.y - 0.2,
        box_mesh.position.z + 0.5
      );
      group.add(box_mesh);
      group.add(text_mesh);
      group.name = value.toString();
      scene.add(group);
      container.push(group);
      group.scale.set(0, 0, 0);

      group.position.set(previous.x, previous.y, previous.z);
      previous.x += 1.2;
      gsap.to(group.scale, {
        duration: 0.4,
        x: 1,
        y: 1,
        z: 1,
        ease: "bounce",
      });
      if (container.length == 1) {
        arrows[0].position.set(
          container[container.length - 1].position.x,
          1.3,
          0
        );
        arrows[1].position.set(container[0].position.x, 1.3, 0);
        gsap.to(arrows[1].scale, { duration: 0.3, x: 1, y: 1, z: 1 });
      }

      const last = container[container.length - 1].position;
      gsap.to(arrows[0].scale, { x: 1, y: 1, z: 1, duration: 0.3 });
      await gsap.to(arrows[0].position, { duration: 0.3, x: last.x + 0.7 });
    }
  );
}

window.addEventListener("resize", () => {
  sizes.width = canvas_container.clientWidth;
  sizes.height = canvas_container.clientHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  controls.update();
});

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
  // scene.background = envMap;

  scene.environment = envMap;
  texture.dispose();
  pmremGenerator.dispose();
});
renderer.setSize(sizes.width, sizes.height);

const tick = () => {
  controls.update();
  renderer.setSize(sizes.width, sizes.height);
  camera.updateMatrix();
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};
tick();
