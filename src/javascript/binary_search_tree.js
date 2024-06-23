import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import gsap from "gsap";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
const canvas_container = document.getElementById("threed");
const fontLoader = new FontLoader();
const canvas = document.getElementById("webgl");

let node_color = "red";
let node_text = "blue";
const scene = new THREE.Scene();
scene.background = new THREE.Color("#2e2e2e");
document.getElementById("sceneButton").onclick = function () {
  let color = document.getElementById("scene_background").value;
  scene.background = new THREE.Color(color);
};

document.getElementById("nodeColor").onclick = function () {
  let color = document.getElementById("node_color").value;
  node_color = color;
  const traverse = (root) => {
    if (root != null) {
      root.mesh.children[0].material.color = new THREE.Color(node_color);
    }
    if (root.left) {
      traverse(root.left);
    }
    if (root.right) {
      traverse(root.right);
    }
  };
  traverse(bst.root);
};

document.getElementById("textColor").onclick = function () {
  let color = document.getElementById("text_color").value;
  node_text = color;
  console.log("color", color);
  node_color = color;
  const traverse = (root) => {
    if (root != null) {
      root.mesh.children[1].material.color = new THREE.Color(node_text);
    }
    if (root.left) {
      traverse(root.left);
    }
    if (root.right) {
      traverse(root.right);
    }
  };
  traverse(bst.root);
};

document.getElementById("myForm").addEventListener("submit", function ex(e) {
  e.preventDefault();

  let x = parseInt(document.getElementById("array").value);
  console.log(x);
  bst.insertNode(x);
  const result = bfs(bst.root);
  spaceNodes(result);
  updateArrow(bst.root);
});
document.getElementById("reset").onclick = function () {
  for (let i = scene.children.length - 1; i >= 0; i--) {
    let obj = scene.children[i];
    scene.remove(obj);
  }
  bst.root = null;
};
document.getElementById("animate_bfs").onclick = async function () {
  await bst.animateBfs();
};
document.getElementById("animate_dfs").onclick = async function () {
  await bst.animateDfs(bst.root);
  console.log("AAAAAAAAAAAAAAA");
};
const findParent = (root, node) => {
  if (!root == null || !node == null) {
    return null;
  } else {
    if (root.left.data == node.data || root.right.data == node.data) {
      return root;
    } else {
      if (root.data < node.data) {
        return findParent(root.right, node);
      } else {
        return findParent(root.left, node);
      }
    }
  }
};
const createNode = (data) => {
  const nodeMesh = new THREE.Group();

  const sphereGeometry = new THREE.SphereGeometry(0.7, 16, 16, 16);
  const sphereMaterial = new THREE.MeshStandardMaterial({ color: node_color });
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

  nodeMesh.add(sphereMesh);

  fontLoader.load("/helvetiker_regular.typeface.json", (font) => {
    const textGeometry = new TextGeometry(data.toString(), {
      font: font,
      size: 0.5,
      height: 0.1,
      curveSegments: 3,
      bevelEnabled: true,
      bevelThickness: 0.02,

      bevelSegments: 12,
      bevelSize: 0.02,
      bevelOffset: -0.002,
      bevelThickness: 0.02,
    });
    const textMaterial = new THREE.MeshStandardMaterial({ color: node_text });

    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    nodeMesh.add(textMesh);

    textMesh.position.set(
      sphereMesh.position.x - 0.4,
      sphereMesh.position.y - 0.2,
      sphereMesh.position.z + 0.7
    );
  });
  scene.add(nodeMesh);
  return nodeMesh;
};

const maxDepth = (root) => {
  if (root == null) return 0;
  let maxHeightLeft = maxDepth(root.left);
  let maxHeightRight = maxDepth(root.right);
  return Math.max(maxHeightLeft, maxHeightRight) + 1;
};

const updateArrow = (root) => {
  const thickness = 0.1;

  if (root.left == null && root.right == null) {
    return;
  }
  if (root.left != null && root.leftarrow != null) {
    const inital = root.mesh.position;
    const final = root.left.mesh.position;
    let ix = inital.x,
      iy = inital.y,
      iz = inital.z,
      fx = final.x,
      fy = final.y,
      fz = final.z;
    let length = Math.sqrt((ix - fx) ** 2 + (iy - fy) ** 2 + (iz - fz) ** 2);
    root.leftarrow.children[0].scale.set(
      thickness,
      thickness,
      length - 10 * thickness
    );
    root.leftarrow.children[1].position.set(0, 0, length);
    root.leftarrow.children[1].scale.set(
      3 * thickness,
      3 * thickness,
      10 * thickness
    );
    root.leftarrow.position.set(ix, iy, iz);
    root.leftarrow.lookAt(fx, fy, fz);
  }
  if (root.right != null && root.rightarrow != null) {
    const inital = root.mesh.position;
    const final = root.right.mesh.position;
    let ix = inital.x,
      iy = inital.y,
      iz = inital.z,
      fx = final.x,
      fy = final.y,
      fz = final.z;
    let length = Math.sqrt((ix - fx) ** 2 + (iy - fy) ** 2 + (iz - fz) ** 2);
    root.rightarrow.children[0].scale.set(
      thickness,
      thickness,
      length - 10 * thickness
    );
    root.rightarrow.children[1].position.set(0, 0, length);
    root.rightarrow.children[1].scale.set(
      3 * thickness,
      3 * thickness,
      10 * thickness
    );
    root.rightarrow.position.set(ix, iy, iz);
    root.rightarrow.lookAt(fx, fy, fz);
  }

  if (root.left) {
    updateArrow(root.left);
  }
  if (root.right) {
    updateArrow(root.right);
  }
};

const constructArrow = (inital, final) => {
  let ix = inital.x,
    iy = inital.y,
    iz = inital.z,
    fx = final.x,
    fy = final.y,
    fz = final.z;
  const thickness = 0.1;
  const ARROW_BODY = new THREE.CylinderGeometry(1, 1, 1, 12)
    .rotateX(Math.PI / 2)
    .translate(0, 0, 0.5);

  const ARROW_HEAD = new THREE.ConeGeometry(1, 1, 12)
    .rotateX(Math.PI / 2)
    .translate(0, 0, -0.5);

  var material = new THREE.MeshStandardMaterial({ color: "yellow" });

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
// const spaceNodes = (array) => {
//   var k = 0;
//   for (let i = 1; i < array.length; i++) {
//     for (let j = 0; j < array[i].length; j++) {
//       let pos = positions[k];
//       if (pos == undefined) {
//         pos = [0, 0];
//       }
//       array[i][j].mesh.position.set(pos[0], pos[1], 0);
//       k += 1;
//     }
//   }
// };
// const spaceNodes = (array, height) => {
//   let k = 0;
//   let initialOffset = Math.pow(2, height) - 1; // Initial offset for the first node
//   let horizontalGap = 0.3; // Initial horizontal gap
//   for (let i = 0; i < array.length; i++) {
//     let levelWidth = Math.pow(2, i); // Number of nodes in the current level
//     let levelGap = 2 * (levelWidth - 1); // Total width covered by nodes in the current level
//     let levelOffset = levelGap / 2; // Offset to center the level
//     let p = Math.pow(2, height - i - 1) * horizontalGap; // Calculate the horizontal gap for the current level
//     let offset = Math.pow(2, height - i - 1) * initialOffset; // Calculate the offset for the current level
//     for (let j = 0; j < array[i].length; j++) {
//       let xPos = (j - levelWidth / 2) * 3 - levelOffset; // Calculate x position relative to the center of the level
//       let yPos = i * 3; // Vertical position based on the level
//       array[i][j].mesh.position.set(xPos, -yPos, 0);
//       console.log(array[i][j].mesh.position);
//       k += 1;
//     }
//     horizontalGap *= 2; // Double the horizontal gap for the next level
//   }
// };

// const spaceNodes = (array, HEIGHT) => {
//   console.log(HEIGHT);
//   // Iterate through each level of the binary tree
//   for (let y = 0; y < array.length; y++) {
//     // Calculate the value of p for the current level
//     let p = Math.pow(2, HEIGHT - y - 1);

//     // Calculate the vertical position of the current node
//     let py = 10 - 3 * y;

//     // Iterate through each node in the current level
//     for (let x = 0; x < array[y].length; x++) {
//       // Calculate the horizontal position of the current node

//       let px = 2 * (p / 2 + x * p - Math.pow(2, HEIGHT - 2) - 1);
//       console.log("Array :", array[y][x].data, "x:", px, "y:", py);
//       // Set the position of the current node's mesh
//       array[y][x].mesh.position.set(px, py, 0);
//     }
//   }
// };
const spaceNodes = (array) => {
  for (let y = 0; y < array.length; y++) {
    let p = Math.pow(2, array.length - y - 1);

    let py = 4 - 5 * y;

    for (let x = 0; x < array[y].length; x++) {
      let px = 2 * (p / 2 + x * p - Math.pow(2, array.length - 2) - 1);

      console.log("Array :", array[y][x].data, "x:", px, "y:", py);
      array[y][x].mesh.position.set(px, py, 0);
      gsap.to(array[y][x].mesh.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.5,
        ease: "bounce.out",
      });
    }
  }
};

const createArrows = (root) => {
  if (root.left == null && root.right == null) {
    return;
  }

  if (root.left != null && root.leftarrow == null) {
    const initial = root.mesh.position;
    const final = root.left.mesh.position;
    let arrow = constructArrow(initial, final);
    arrow.children[1].material.color = new THREE.Color("orange");
    root.leftarrow = arrow;
    scene.add(arrow);
  }
  if (root.right != null && root.rightarrow == null) {
    const initial = root.mesh.position;
    const final = root.right.mesh.position;

    let arrow = constructArrow(initial, final);
    arrow.children[1].material.color = new THREE.Color("violet");

    root.rightarrow = arrow;
    scene.add(arrow);
  }
  if (root.left) {
    createArrows(root.left);
  }
  if (root.right) {
    createArrows(root.right);
  }
};

class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
    this.leftarrow = null;
    this.rightarrow = null;
    this.mesh = createNode(data);
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  insertNode(data) {
    const insert = (node, data, pos) => {
      // BST is empty, Return a new node
      if (node == null) {
        const newNode = new Node(data);
        newNode.mesh.scale.set(0, 0, 0);
        newNode.mesh.position.set(pos.x, pos.y, 0);

        return newNode;
      }
      if (data < node.data) {
        node.left = insert(node.left, data, {
          x: pos.x,
          y: pos.y,
        });

        // Else
      } else if (data > node.data) {
        node.right = insert(node.right, data, {
          x: pos.x,
          y: pos.y,
        });
      }
      return node;
    };
    this.root = insert(this.root, data, { x: 0, y: 0 });
    createArrows(this.root);
    updateArrow(this.root);
  }
  animateBfs = async () => {
    if (!this.root) return [];

    let result = [];
    let queue = [this.root];

    while (queue.length > 0) {
      let currentLevel = [];
      let len = queue.length;

      for (let i = 0; i < len; i++) {
        let node = queue.shift();

        await gsap.to(node.mesh.children[0].material, {
          color: new THREE.Color("yellow"),
          duration: 1,
        });
        node.mesh.children[0].material.color = new THREE.Color("yellow");

        currentLevel.push(node);

        if (node.left) {
          queue.push(node.left);
        }
        if (node.right) {
          queue.push(node.right);
        }
      }

      result.push(currentLevel);
    }

    return result;
  };

  animateDfs = async (node) => {
    if (node == null) {
      return;
    }
    await gsap.to(node.mesh.children[0].material, {
      color: new THREE.Color("blue"),
      duration: 1,
    });
    node.mesh.children[0].material.color = new THREE.Color("pink");

    await this.animateDfs(node.left);
    await this.animateDfs(node.right);
  };
}
const bfs = (root) => {
  if (!root) return [];

  let result = [];
  let queue = [root];

  while (queue.length > 0) {
    let currentLevel = [];
    let len = queue.length;

    for (let i = 0; i < len; i++) {
      let node = queue.shift();
      currentLevel.push(node);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(currentLevel);
  }

  return result;
};

const bst = new BinarySearchTree();
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
  //scene.background = envMap;

  scene.environment = envMap;
  texture.dispose();
  pmremGenerator.dispose();
  text_color;
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
