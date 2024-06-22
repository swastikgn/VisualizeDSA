import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import gsap from "gsap";

let container = [];
let top_container = [];
const fontLoader = new FontLoader();

let cube_color = "yellow";
let text_and_top_color = "red";

document.getElementById("sceneButton").onclick = function () {
  let color = document.getElementById("scene_background").value;
  scene.background = new THREE.Color(color);
};

document.getElementById("cubeColor").onclick = function () {
  let color = document.getElementById("cube_color").value;
  console.log(color);
  for (let i = 0; i < container.length; i++) {
    container[i].children[0].material.color = new THREE.Color(color);
  }

  cube_color = new THREE.Color(color);
};

document.getElementById("textColor").onclick = function () {
  let color = document.getElementById("text_color").value;
  text_and_top_color = new THREE.Color(color);

  for (let i = 0; i < container.length; i++) {
    container[i].children[1].material.color = text_and_top_color;
  }
  if (top_container.length > 0) {
    top_container[0].material.color = text_and_top_color;
  }
};

document.getElementById("reset").onclick = function () {
  for (let i = 0; i < container.length; i++) {
    scene.remove(container[i]);
  }
  gsap.to(top_container[0].position, { x: 0.7, y: -3.5, z: 0, duration: 0.5 });
  container = [];
};

const font = fontLoader.load("/helvetiker_regular.typeface.json");

const canvas_container = document.getElementById("threed");

document
  .getElementById("myForm")
  .addEventListener("submit", async function ex(e) {
    e.preventDefault();

    let x = document.getElementById("array").value;

    let array = x.split(/[ ,]+/).filter(Boolean).map(Number);
    console.log(array.length);
    if (array.length <= 0) {
      console.log("Empty output");
    } else {
      create_stack_element(array[0], font);
    }
  });

document.getElementById("pop_stack").onclick = async function () {
  if (container.length <= 1) {
    const top = container.pop();
    scene.remove(top);
    gsap.to(top_container[0].position, {
      duration: 0.5,
      x: 0.8,
      y: -3.5,
      z: 0,
    });
  } else {
    const top = container[container.length - 1];
    container.pop();
    const prev = container[container.length - 1].position;
    top_container[0].visible = true;
    gsap.to(top_container[0].position, {
      duration: 0.5,
      x: prev.x + 1,
      y: prev.y - 0.4,
      z: prev.z,
    });
    scene.remove(top);
  }
};

const canvas = document.getElementById("webgl");

const scene = new THREE.Scene();

const minusone = () => {
  fontLoader.load("/helvetiker_regular.typeface.json", (font) => {
    const geo = new TextGeometry("-1".toString(), {
      font: font,
      size: 0.7,
      height: 0.1,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSegments: 5,
      bevelSize: 0.02,
      bevelOffset: -0.002,
      bevelThickness: 0.02,
    });
    let mat = new THREE.MeshStandardMaterial({ color: "white" });
    let textmesh = new THREE.Mesh(geo, mat);
    scene.add(textmesh);
    textmesh.position.set(-0.3, -3.5, 0);
    const top_pointer_geo = new TextGeometry("<= top", {
      font: font,
      size: 0.7,
      height: 0.12,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSegments: 5,
      bevelSize: 0.02,
      bevelOffset: -0.002,
      bevelThickness: 0.02,
    });

    if (top_container.length == 0) {
      const top_pointer_mat = new THREE.MeshStandardMaterial({
        color: text_and_top_color,
        roughness: 0,
        metalness: 0.4,
        emissive: true,
      });
      const top_pointer = new THREE.Mesh(top_pointer_geo, top_pointer_mat);
      top_container.push(top_pointer);
      top_pointer.position.set(0.7, -3.5, 0);

      scene.add(top_pointer);
    }
  });
};

minusone();
async function create_stack_element(value) {
  fontLoader.load("/helvetiker_regular.typeface.json", function (font) {
    const group = new THREE.Group();
    const box_geometry = new THREE.BoxGeometry(2, 1, 2, 3);
    const box_material = new THREE.MeshStandardMaterial({
      color: cube_color,
      roughness: 1,
      metalness: 1,
    });
    const box_mesh = new THREE.Mesh(box_geometry, box_material);

    box_mesh.position.set(0, 0, 0);

    const text_geometry = new TextGeometry(value.toString(), {
      font: font,
      size: 0.7,
      height: 0.12,
      curveSegments: 11,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSegments: 3,
      bevelSize: 0.03,
      bevelOffset: -0.002,
      bevelThickness: 0.05,
    });
    const text_material = new THREE.MeshStandardMaterial({
      color: text_and_top_color,
      roughness: 0,
      metalness: 0.5,
    });
    const text_mesh = new THREE.Mesh(text_geometry, text_material);
    text_mesh.position.set(
      box_mesh.position.x - 0.9,
      box_mesh.position.y - 0.3,
      box_mesh.position.z + 1.1
    );
    group.add(box_mesh);
    group.add(text_mesh);

    scene.add(group);
    container.push(group);

    let offset = -2;
    for (let j = 0; j < container.length; j++) {
      container[j].position.set(0, offset, 0);
      container[j].visible = true;

      offset += 1.2;
    }

    const prev = container[container.length - 1].position;
    top_container[0].visible = true;
    gsap.to(top_container[0].position, {
      duration: 0.5,
      x: prev.x + 1,
      y: prev.y - 0.4,
      z: prev.z,
    });
  });
}

const sizes = {
  width: canvas_container.clientWidth,
  height: canvas_container.clientHeight,
};
const camera = new THREE.PerspectiveCamera(80, sizes.width / sizes.height);

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
