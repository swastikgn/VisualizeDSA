import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import gsap from "gsap";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { ThreeMFLoader } from "three/examples/jsm/Addons.js";
import { cos, sin } from "three/examples/jsm/nodes/Nodes.js";

let cube_color = "red";
let text_color = "white";
let indexcolor = "yellow";
let gtext = 0;
let gpattern = 0;

const canvas_container = document.getElementById("threed");

document.getElementById("myForm").addEventListener("submit", function ex(e) {
  e.preventDefault();

  let text = document.getElementById("text").value.trim();
  let pattern = document.getElementById("pattern").value.trim();
  create_objects(text, pattern);
});

document.getElementById("animate").onclick = function () {
  if (gtext == 0 || gpattern == 0) {
    console.log("Text and Pattenr are not entered");
  }
  bruteForceStringMatch(gtext, gpattern);
};

document.getElementById("sceneButton").onclick = function () {
  let color = document.getElementById("scene_background").value;
  console.log(color);
  scene.background = new THREE.Color(color);
};

document.getElementById("cubeColor").onclick = function () {
  let color = document.getElementById("cube_color").value;

  for (let i = 0; i < gtext.children.length; i++) {
    gtext.children[i].children[0].material.color = new THREE.Color(color);
  }
  for (let i = 0; i < gpattern.children.length; i++) {
    gpattern.children[i].children[0].material.color = new THREE.Color(color);
  }
};

document.getElementById("cubeColorOnChange").onclick = function () {};

document.getElementById("textColor").onclick = function () {};
document.getElementById("reset").onclick = function () {
  for (let i = scene.children.length - 1; i >= 0; i--) {
    let obj = scene.children[i];
    scene.remove(obj);
  }
  gtext = 0;
  gpattern = 0;
};

const fontLoader = new FontLoader();

const canvas = document.getElementById("webgl");

const scene = new THREE.Scene();
scene.background = new THREE.Color("#2e2e2e");


function element(data, index) {
  // Create Cube Mesh and add it to the group
  let group = new THREE.Group();
  let geo = new THREE.BoxGeometry(1, 1, 1);
  let met = new THREE.MeshStandardMaterial({
    color: "red",
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
    let mat = new THREE.MeshStandardMaterial({ color: "white" });
    let textmesh = new THREE.Mesh(geo, mat);
    group.add(textmesh);

    let cube_pos = cubemesh.position;
    textmesh.position.set(
      cube_pos.x - 0.25,
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
    let idxmat = new THREE.MeshStandardMaterial({ color: "yellow" });
    let idxmesh = new THREE.Mesh(idxgeo, idxmat);
    idxmesh.position.set(-0.3, -1, 0);
    group.add(idxmesh);
  });

  group.userData = {
    data: data,
  };
  return group;
}
const font = fontLoader.load("/helvetiker_regular.typeface.json");

function create_objects(text, pattern) {
  let textgroup = new THREE.Group();
  textgroup.userData.length = 0;

  for (let i = 0; i < text.length; i++) {
    if (text[i] === " ") {
      let ele = element("_", i);
      ele.position.set(i * 1.3, 0, 0);
      textgroup.userData.length += 1;

      textgroup.add(ele);
    } else {
      let ele = element(text[i], i);
      ele.position.set(i * 1.3, 0, 0);
      textgroup.userData.length += 1;

      textgroup.add(ele);
    }
  }

  scene.add(textgroup);

  let patterngroup = new THREE.Group();
  patterngroup.userData.length = 0;

  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === "_") {
      let ele = element("_", i);
      ele.position.set(i * 1.3, -2.5, 0);

      patterngroup.add(ele);
      patterngroup.userData.length += 1;
    } else {
      let ele = element(pattern[i], i);
      ele.position.set(i * 1.3, -2.5, 0);

      patterngroup.add(ele);
      patterngroup.userData.length += 1;
    }
  }
  scene.add(patterngroup);

  gtext = textgroup;
  gpattern = patterngroup;
  console.log(gtext.userData.length, gpattern.userData.length);
}

async function bruteForceStringMatch(text, pattern) {
  const n = text.userData.length;
  const m = pattern.userData.length;
  console.log("length : ", n, m);
  for (let i = 0; i <= n - m; i++) {
    let j;
    for (j = 0; j < m; j++) {
      if (
        text.children[i + j].userData.data !== pattern.children[j].userData.data
      ) {
        await gsap.to(pattern.position, {
          x: pattern.position.x + 1.3,
          duration: 1.2,
          ease: "circ",
        });
        break;
      } else {
        text.children[i + j].children[0].material.color = new THREE.Color(
          "yellow"
        );
        pattern.children[j].children[0].material.color = new THREE.Color(
          "yellow"
        );
      }
    }

    if (j === m) {
      let length = i;

      for (let k = 0; k < gpattern.userData.length; k++) {
        gtext.children[length].children[0].material.color = new THREE.Color(
          "pink"
        );
        gtext.children[length].children[0].material.metalness = 0.5;
        gtext.children[length].children[0].material.roughness = 0.5;

        gpattern.children[k].children[0].material.color = new THREE.Color(
          "pink"
        );
        gpattern.children[k].children[0].material.metalness = 0.5;
        gpattern.children[k].children[0].material.roughness = 0.5;

        length++;
      }

      console.log("Pattern found at index:", i);
      return i;
    }
  }
  console.log("Not found");
  return;
}
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
  // scene.background = envMap;

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
