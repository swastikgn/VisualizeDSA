// import * as THREE from "three";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
// import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
// import gsap from "gsap";

// let array = [];

// const canvas_container = document.getElementById("threed");

// let container = [];
// document.getElementById("myForm").addEventListener("submit", function ex(e) {
//   e.preventDefault();

//   let x = document.getElementById("array").value;
//   array = x.split(/[ ,]+/).filter(Boolean).map(Number);
//   console.log(array);
//   console.log(THREE);
//   createCubes();
// });

// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// document.getElementById("animate_bubble_sort").onclick = function () {
//   bubble_sort(container);
// };
// document.getElementById("animate_selection_sort").onclick = function () {
//   selection_sort(container);
// };

// const fontLoader = new FontLoader();
// const textureLoader = new THREE.TextureLoader();
// const mt = textureLoader.load("/1.png");
// const mt2 = textureLoader.load("/2.png");

// const canvas = document.getElementById("webgl");

// const scene = new THREE.Scene();

// const light = new THREE.AmbientLight(0x404040);
// light.intensity = 20;
// scene.add(light);

// function createCubes() {
//   fontLoader.load("helvetiker_regular.typeface.json", (font) => {
//     create_cubes(array, scene, mt, mt2, font);
//   });
// }

// let gx = -array.length;

// function create_cubes(array, scene, matcapTexture, mt2, font) {
//   for (let i = 0; i < array.length; i++) {
//     const group = new THREE.Group();

//     const box = new THREE.BoxGeometry(1, 1, 1);
//     const mesh = new THREE.Mesh(
//       box,
//       new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
//     );
//     group.add(mesh);
//     const textgeo = new TextGeometry(array[i].toString(), {
//       font,
//       size: 0.5,
//       height: 0.1,
//       curveSegments: 12,
//       bevelEnabled: true,
//       bevelThickness: 0.01,
//       bevelSegments: 5,
//       bevelSize: 0.02,
//       bevelOffset: -0.002,
//       bevelThickness: 0.02,
//     });

//     const texmat = new THREE.MeshMatcapMaterial({ matcap: mt2 });
//     const text = new THREE.Mesh(textgeo, texmat);
//     text.position.set(
//       mesh.position.x - 0.4,
//       mesh.position.y - 0.2,
//       mesh.position.z + 0.5
//     );

//     group.add(text);
//     group.name = array[i].toString();
//     container.push(group);
//     scene.add(group);
//     group.visible = false;

//     let offset = -Math.floor(container.length / 2);
//     for (let i = 0; i < container.length; i++) {
//       container[i].position.set(offset, 0, 0);

//       group.visible = true;

//       offset += 1.2;
//     }
//   }
// }

// /**
//  * Sizes
//  */
// const sizes = {
//   width: canvas_container.clientWidth,
//   height: canvas_container.clientHeight,
// };
// const camera = new THREE.PerspectiveCamera(80, sizes.width / sizes.height);
// // animation functions

// async function bubble_sort(c) {
//   let sawp, temp;
//   let n = c.length;
//   for (let i = 0; i < n; i++) {
//     sawp = false;
//     for (let j = 0; j < n - i - 1; j++) {
//       if (parseInt(c[j].name) > parseInt(c[j + 1].name)) {
//         await move_to(c[j], c[j + 1]);
//         temp = c[j];

//         c[j] = c[j + 1];
//         c[j + 1] = temp;
//         sawp = true;
//       }
//     }
//     if (sawp == false) {
//       break;
//     }
//   }
// }

// async function selection_sort(c) {
//   let n = c.length;
//   let min, temp;
//   for (let i = 0; i < n; i++) {
//     min = i;
//     for (let j = i + 1; j < n; j++) {
//       if (parseInt(c[j].name) < parseInt(c[min].name)) {
//         min = j;
//       }
//     }
//     if (c[min] === c[i]) {
//       continue;
//     }
//     await move_to(c[min], c[i]);
//     temp = c[min];
//     c[min] = c[i];
//     c[i] = temp;
//   }
// }

// async function move_to(obj1, obj2) {
//   let original_obj1 = obj1.position.clone();
//   let original_obj2 = obj2.position.clone();
//   let t1 = gsap.timeline();
//   t1.to(obj1.position, { duration: 0.5, y: 1.5 })
//     .to(obj1.position, { duration: 0.5, x: obj2.position.x })
//     .to(obj1.position, { duration: 0.5, y: obj2.position.y })
//     .to(obj2.position, { duration: 0.5, y: -1.5 })
//     .to(obj2.position, { duration: 0.5, x: obj1.position.x })
//     .to(obj2.position, { duration: 0.5, y: obj1.position.y });
//   await sleep(3000);
// }

// window.addEventListener("resize", () => {
//   sizes.width = canvas_container.clientWidth;
//   sizes.height = canvas_container.clientHeight;
//   camera.aspect = sizes.width / sizes.height;
//   camera.updateProjectionMatrix();
//   renderer.setSize(sizes.width, sizes.height);
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//   controls.update();
// });

// // window.addEventListener("dblclick",()=>{

// //   const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
// //   if (!fullscreenElement){
// //     canvas.requestFullscreen()
// //   }
// //   else {
// //     document.exitFullscreen()
// //   }const targetPosition = new THREE.Vector3();
// // })

// // array
// // box_container
// // text_container

// camera.position.z = 3;
// scene.add(camera);

// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

// const renderer = new THREE.WebGLRenderer({
//   canvas: canvas,
// });
// renderer.setSize(sizes.width, sizes.height);

// const clock = new THREE.Clock();

// const tick = () => {
//   const elapsedTime = clock.getElapsedTime();
//   controls.update();
//   renderer.setSize(sizes.width, sizes.height);
//   camera.updateMatrix();
//   renderer.render(scene, camera);

//   window.requestAnimationFrame(tick);
// };
// tick();
