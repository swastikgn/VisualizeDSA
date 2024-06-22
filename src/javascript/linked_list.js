import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import gsap from "gsap";

const fontLoader = new FontLoader();

document.getElementById("sceneButton").onclick = function () {
  let color = document.getElementById("scene_background").value;
  scene.background = new THREE.Color(color);
};

const font = fontLoader.load("/helvetiker_regular.typeface.json");
const canvas_container = document.getElementById("threed");

class Node {
  constructor(data) {
    this.mesh = new THREE.Group();

    let cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({
        color: "yellow",
        roughness: 0.5,
        metalness: 0.5,
      })
    );

    let arrow = customArrow(2, 0, 0, 1, 0, 0, 0.17, "yellow");
    console.log(arrow.position);
    arrow.position.set(cube.position.x + 1, 0, 0);
    this.mesh.add(cube);
    this.mesh.add(arrow);

    fontLoader.load("/helvetiker_regular.typeface.json", (font) => {
      const geo = new TextGeometry(data.toString(), {
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
      const mat = new THREE.MeshStandardMaterial({
        color: "red",
        roughness: 0.5,
        metalness: 0.5,
      });
      const textmesh = new THREE.Mesh(geo, mat);
      this.mesh.add(textmesh);

      const cube_pos = cube.position;
      textmesh.position.set(
        cube_pos.x - 0.5,
        cube_pos.y - 0.2,
        cube_pos.z + 0.5
      );
    });
    this.next = null;
    this.data = data;
    this.mesh.visible = false;
    this.mesh.scale.set(0, 0, 0);
    scene.add(this.mesh);
    gsap.to(this.mesh.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.5,
      ease: "bounce.out",
    });
  }
}

class LinkedList {
  constructor() {
    let arrowhead = new THREE.Group();
    let head = customArrow(1, 0, 0, 1, 1, 0, 0.2, "brown");
    head.position.set(0, 0.8, 0);
    arrowhead.add(head);
    fontLoader.load("/helvetiker_regular.typeface.json", (font) => {
      const geo = new TextGeometry("head".toString(), {
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
      const mat = new THREE.MeshStandardMaterial({
        color: "blue",
        roughness: 0.5,
        metalness: 0.5,
      });
      const textmesh = new THREE.Mesh(geo, mat);
      arrowhead.add(textmesh);

      const headpos = head.position;
      console.log(head.position);
      textmesh.position.set(headpos.x - 0.6, headpos.y + 1.2, headpos.z);
    });
    this.arrowhead = arrowhead;

    scene.add(arrowhead);
    this.head = null;
  }

  async addEnd(data) {
    let newnode = new Node(data);

    scene.add(newnode.mesh);

    if (!this.head) {
      this.head = newnode;
      gsap.to(this.arrowhead.position, {
        x: this.head.mesh.position.x,
        duration: 1,
      });
      this.head.mesh.visible = true;

      return;
    }

    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    newnode.mesh.visible = true;
    current.next = newnode;
    newnode.mesh.position.set(current.mesh.position.x + 1.75, 0, 0);
  }

  async deleteEnd() {
    if (!this.head) {
      console.log("The linked list is empty");
      return;
    }
    if (!this.head.next) {
      let temp = this.head;
      this.head = null;
      scene.remove(temp.mesh);
      gsap.to(this.arrowhead.position, { x: 0.9, y: 0, z: 0, duration: 0.5 });
      return;
    }
    let current = this.head;
    while (current.next.next) {
      current = current.next;
    }
    const rem = current.next;

    scene.remove(rem.mesh);

    current.next = null;
  }

  async addBeg(data) {
    let newnode = new Node(data);

    scene.add(newnode.mesh);

    if (!this.head) {
      this.head = newnode;
      this.head.mesh.visible = true;
      gsap.to(this.arrowhead.position, {
        x: -0.7,
        duration: 1,
      });
      // this.arrowhead.position.x = -1.7;
      newnode.mesh.position.set(-1.7, 0, 0);
      return;
    }

    newnode.next = this.head;

    newnode.mesh.visible = true;
    newnode.mesh.position.set(this.head.mesh.position.x - 1.7, 0, 0);
    this.head = newnode;
    gsap.to(this.arrowhead.position, {
      x: this.head.mesh.position.x,
      duration: 1,
    });
    // this.arrowhead.position.x = this.head.mesh.position.x;
  }
  async deleteBeg() {
    if (!this.head) {
      console.log("The list is empty");
      return;
    }
    let temp = this.head;
    scene.remove(temp.mesh);
    this.head = this.head.next;
    gsap.to(this.arrowhead.position, {
      x: this.head.mesh.position.x,
      duration: 1,
    });
  }
}

const canvas = document.getElementById("webgl");

const scene = new THREE.Scene();
let linkedlist = new LinkedList();

document
  .getElementById("form_insert_end")
  .addEventListener("submit", function ex(e) {
    e.preventDefault();

    let x = document.getElementById("insert_at_end").value;
    if (x == "") {
      console.log("Form is empty");
    } else {
      linkedlist.addEnd(x);
    }
  });
document
  .getElementById("form_insert_beg")
  .addEventListener("submit", function ex(e) {
    e.preventDefault();

    let x = document.getElementById("insert_at_beg").value;
    if (x == "") {
      console.log("Form is empty");
    } else {
      linkedlist.addBeg(x);
    }
  });
document
  .getElementById("form_delete_end")
  .addEventListener("submit", function ex(e) {
    e.preventDefault();

    linkedlist.deleteEnd();
  });
document
  .getElementById("form_delete_beg")
  .addEventListener("submit", function ex(e) {
    e.preventDefault();

    linkedlist.deleteBeg();
  });
function customArrow(fx, fy, fz, ix, iy, iz, thickness, color) {
  const ARROW_BODY = new THREE.CylinderGeometry(0.3, 0.3, 1, 12)
    .rotateX(Math.PI / 2)
    .translate(0, 0, 0.5);
  const ARROW_HEAD = new THREE.ConeGeometry(0.2, 0.2, 12)
    .rotateX(Math.PI / 2)
    .translate(0, 0, -0.5);
  var material = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.5,
    metalness: 0.5,
  });

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
}
const sizes = {
  width: canvas_container.clientWidth,
  height: canvas_container.clientHeight,
};
const camera = new THREE.PerspectiveCamera(80, sizes.width / sizes.height);

window.addEventListener(
  "resize",
  () => {
    sizes.width = sizes.width.clientWidth;
    sizes.height = sizes.height.clientHeight;

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
