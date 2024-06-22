import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import gsap from "gsap";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

let array = [];
let container = [];
let index = [];

let cube_color = "red";
let text_color = "yellow";
let cube_color_on_change = "white";

const canvas_container = document.getElementById("threed");

document.getElementById("myForm").addEventListener("submit", function ex(e) {
  e.preventDefault();

  let x = document.getElementById("array").value;
  array = x.split(/[ ,]+/).filter(Boolean).map(Number);

  createCubes();
});

document.getElementById("animate").onclick = function () {
  bubble_sort(container);
};

document.getElementById("sceneButton").onclick = function () {
  let color = document.getElementById("scene_background").value;
  console.log(color);
  scene.background = new THREE.Color(color);
};

document.getElementById("cubeColor").onclick = function () {
  let color = document.getElementById("cube_color").value;
  for (let i = 0; i < container.length; i++) {
    container[i].children[0].material.color = new THREE.Color(color);
  }
  cube_color = new THREE.Color(color);
};

document.getElementById("cubeColorOnChange").onclick = function () {
  let color = document.getElementById("cube_change_color").value;

  cube_color_on_change = new THREE.Color(color);
};

document.getElementById("textColor").onclick = function () {
  let color = document.getElementById("text_color").value;

  for (let i = 0; i < container.length; i++) {
    container[i].children[1].material.color = new THREE.Color(color);
    index[i].material.color = new THREE.Color(color);
  }
  text_color = new THREE.Color(color);
};
document.getElementById("reset").onclick = function () {
  for (let i = 0; i < container.length; i++) {
    scene.remove(container[i]);
  }

  for (let i = 0; i < index.length; i++) {
    scene.remove(index[i]);
  }
  container = [];
  index = [];
};

const fontLoader = new FontLoader();

// const font = fontLoader.load("/helvetiker_regular.typeface.json");

function createTextMesh(text, size, color, font) {
  const index_geometry = new TextGeometry(text.toString(), {
    font: font,
    size: size,
    height: 0.05,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSegments: 5,
    bevelSize: 0.02,
    bevelOffset: -0.002,
    bevelThickness: 0.02,
  });
  const index_material = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0,
    metalness: 0.3,
  });
  const index_mesh = new THREE.Mesh(index_geometry, index_material);
  index_mesh.name = text.toString();
  return index_mesh;
}

const canvas = document.getElementById("webgl");

const scene = new THREE.Scene();

function createCubes() {
  fontLoader.load("/helvetiker_regular.typeface.json", (font) => {
    for (let i = 0; i < array.length; i++) {
      const group = new THREE.Group();

      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({
          color: cube_color,
          roughness: 1,
          metalness: 1,
          wireframe: false,
        })
      );

      group.add(mesh);
      const text_geometry = new TextGeometry(array[i].toString(), {
        font: font,
        size: 0.37,
        height: 0.1,
        curveSegments: 3,
        bevelEnabled: true,
        bevelThickness: 0.02,

        bevelSegments: 12,
        bevelSize: 0.02,
        bevelOffset: -0.002,
        bevelThickness: 0.02,
      });

      const text_material = new THREE.MeshStandardMaterial({
        color: text_color,
        roughness: 0,
        metalness: 0.2,
      });
      const text_mesh = new THREE.Mesh(text_geometry, text_material);
      text_mesh.position.set(
        mesh.position.x - 0.3,
        mesh.position.y - 0.1,
        mesh.position.z + 0.5
      );
      group.add(text_mesh);
      group.name = array[i].toString();
      container.push(group);
      scene.add(group);
      group.visible = false;
    }
    let offset = -Math.floor(container.length / 2);

    for (let j = 0; j < container.length; j++) {
      container[j].position.set(offset, 0, 0);
      container[j].visible = true;

      offset += 1.2;

      const index_mesh = createTextMesh(j, 0.4, text_color, font);
      scene.add(index_mesh);
      index.push(index_mesh);
      index_mesh.position.set(
        container[j].position.x - 0.1,
        container[j].position.y - 1.2,
        container[j].position.z + 0.6
      );
    }
  });
}

const sizes = {
  width: canvas_container.clientWidth,
  height: canvas_container.clientHeight,
};
const camera = new THREE.PerspectiveCamera(80, sizes.width / sizes.height);

async function bubble_sort(c) {
  let sawp, temp;
  let n = c.length;
  for (let i = 0; i < n; i++) {
    sawp = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (parseInt(c[j].name) > parseInt(c[j + 1].name)) {
        c[j].children[0].material.color.set(cube_color_on_change);
        c[j + 1].children[0].material.color.set(cube_color_on_change);

        await move_to(c[j], c[j + 1]);
        c[j].children[0].material.color.set(cube_color);
        c[j + 1].children[0].material.color.set(cube_color);
        temp = c[j];

        c[j] = c[j + 1];
        c[j + 1] = temp;
        sawp = true;
      }
    }
    if (sawp == false) {
      break;
    }
  }
}

async function move_to(obj1, obj2) {
  let original_obj1 = obj1.position.clone();
  let original_obj2 = obj2.position.clone();
  let t1 = gsap.timeline();
  await t1
    .to(obj1.position, { duration: 0.3, y: 1.5 })
    .to(obj1.position, { duration: 0.3, x: obj2.position.x })
    .to(obj1.position, { duration: 0.3, y: obj2.position.y })
    .to(obj2.position, { duration: 0.3, y: -1.5 })
    .to(obj2.position, { duration: 0.3, x: obj1.position.x })
    .to(obj2.position, { duration: 0.3, y: obj1.position.y });
}

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
