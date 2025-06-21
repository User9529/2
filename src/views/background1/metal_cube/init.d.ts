import * as THREE from 'three';
import { debounce } from '@ykob/js-util';

import {GLTFLoader} from "three/addons"
import backgroundFS from './glsl/background.fs'
import backgroundVS from './glsl/background.vs'
import objectVS from './glsl/object.vs';
import objectFS from './glsl/object.fs';
import normalizeVector2 from '../../../utils/common/normalizeVector2.ts';
import Force3 from '../../../utils/old/Force3.js';
import ForceCamera from '../../../utils/old/ForceCamera.js';
import Util from './util.js';

export default function() {
  const canvas = document.getElementById('canvas-webgl');
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas,
  });
  const scene = new THREE.Scene();
  const camera = new ForceCamera(35, window.innerWidth / window.innerHeight, 1, 10000);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
  directionalLight.position.set(80, 100, 50);
// 方向光默认指向xyz坐标原点
  scene.add(directionalLight);
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  pointLight.position.set(0, 0, 0);
  scene.add(pointLight);
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);
  // process for this sketch.
  //
  const raycaster = new THREE.Raycaster();
  let intersects = null;
  const cube_force = new Force3();
  const cube_force2 = new Force3();
  let vactor_raycast = null;
  cube_force.mass = 1.4;

  let gltfModel = null;
  const gltfForce = new Force3();
  gltfForce.mass = 1.0;

  const rotationSpeed = new THREE.Vector3();
  const rotationDamping = 0.95;
  const maxRotationSpeed = 0.05;

  const createPlaneForRaymarching = function() {
    const geometry = new THREE.PlaneGeometry(6.0, 6.0);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        time2: {
          type: 'f',
          value: 0,
        },
        acceleration: {
          type: 'f',
          value: 0
        },
        resolution: {
          type: 'v2',
          value: new THREE.Vector2(window.innerWidth, window.innerHeight)
        }
      },
      vertexShader: objectVS,
      fragmentShader: objectFS,
      transparent: true
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'MetalCube';
    return mesh;

  };
  const createBackground =  function() {
    const geometry = new THREE.OctahedronGeometry(30, 4);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0,
        },
        acceleration: {
          type: 'f',
          value: 0
        },
      },
      fragmentShader: backgroundFS,
      vertexShader: backgroundVS,
      side: THREE.BackSide
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'Background';
    return mesh;
  };

  const isPartOfGLTFModel = (object) => {
    if (!gltfModel) return false;

    let currentObject = object;
    while (currentObject) {
      if (currentObject === gltfModel) {
        return true;
      }
      currentObject = currentObject.parent;
    }
    return false;
  };

  const moveObjects = function(scene, camera, vector) {
    if (!vector) return;

    raycaster.setFromCamera(vector, camera);
    intersects = raycaster.intersectObjects(scene.children, true);


    // 检查是否有物体被射线击中
    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;

      // 如果是几何体
      if (intersectedObject.name === 'MetalCube') {
        if (cube_force.acceleration.length() > 0.1) return;

        cube_force.anchor.copy(Util.getPolarCoord(
          Util.getRadian(Util.getRandomInt(-20, 20)),
          Util.getRadian(Util.getRandomInt(0, 360)),
          Util.getRandomInt(30, 90) / 10
        ));
        cube_force2.applyForce(new THREE.Vector3(1, 0, 0));
      }
      // 如果是GLB模型（修改判断逻辑）
      else if (gltfModel && isPartOfGLTFModel(intersectedObject)) {
        if (gltfForce.acceleration.length() > 0.1) return;

        // 设置新的锚点位置
        gltfForce.anchor.copy(Util.getPolarCoord(
          Util.getRadian(Util.getRandomInt(-20, 20)),
          Util.getRadian(Util.getRandomInt(0, 360)),
          Util.getRandomInt(30, 90) / 10
        ));

        // 添加随机旋转速度
        rotationSpeed.set(
          (Math.random() - 0.5) * maxRotationSpeed,
          (Math.random() - 0.5) * maxRotationSpeed,
          (Math.random() - 0.5) * maxRotationSpeed
        );
      }
    }
  };

  const plane = createPlaneForRaymarching();
  const bg = createBackground();


  const initSketch = () => {
    scene.add(plane);
    scene.add(bg);

    const loader = new GLTFLoader()
    loader.load("public/cartoon_shopping_cart.glb",function(gltf) {
      gltfModel = gltf.scene
      scene.add(gltfModel);

      // 设置初始位置
      gltfModel.position.set(0, 0, -15);

      // 初始化物理系统
      gltf.scene.position.copy(gltfModel.position);
      gltfForce.anchor.copy(gltfModel.position);
      gltfForce.velocity.set(0, 0, 0);

      // 添加调试名称
      gltfModel.name = 'ShoppingCart';
      gltfModel.traverse(function(child) {
        if (child.isMesh) {
          child.name = 'CartPart';
          // 设置材质属性增强视觉效果
          if (child.material) {
            child.material.metalness = 0.8;
            child.material.roughness = 0.2;
            child.material.envMapIntensity = 1.0;
          }
        }
      });

      console.log('GLB model loaded:', gltfModel);
    }, undefined, function(error) {
      console.error('Error loading GLB model:', error);
    });

    camera.setPolarCoord(0, Util.getRadian(90), 24);
  }

  //
  // common process
  //

  const resizeWindow = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    plane.material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
  }
  const render = () => {
    moveObjects(scene, camera, vactor_raycast);
    cube_force.applyHook(0, 0.12);
    cube_force.applyDrag(0.01);
    cube_force.updateVelocity();


    if (gltfModel) {
      gltfForce.applyHook(0, 0.09);
      gltfForce.applyDrag(0.5);
      gltfForce.updateVelocity();
      gltfModel.position.copy(gltfForce.velocity);
      if (rotationSpeed.length() > 0.001) {
        gltfModel.rotation.x += rotationSpeed.x;
        gltfModel.rotation.y += rotationSpeed.y;
        gltfModel.rotation.z += rotationSpeed.z;

        // 应用旋转阻尼
        rotationSpeed.multiplyScalar(rotationDamping);
      }
    }

    cube_force2.applyHook(0, 0.005);
    cube_force2.applyDrag(0.2);
    cube_force2.updateVelocity();
    plane.position.copy(cube_force.velocity);


    plane.material.uniforms.time.value++;
    plane.material.uniforms.time2.value += 1 + Math.floor(cube_force.acceleration.length() * 4);
    plane.material.uniforms.acceleration.value = cube_force.acceleration.length();
    bg.material.uniforms.time.value++;
    bg.material.uniforms.acceleration.value = cube_force2.velocity.length();

    camera.force.position.applyHook(0, 0.025);
    camera.force.position.applyDrag(0.2);
    camera.force.position.updateVelocity();
    camera.updatePosition();
    camera.lookAtCenter();

    renderer.render(scene, camera);
  }
  const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
  }
  const on = () => {
    const vectorTouchStart = new THREE.Vector2();
    const vectorTouchMove = new THREE.Vector2();
    const vectorTouchEnd = new THREE.Vector2();

    const touchStart = (x, y) => {
      vectorTouchStart.set(x, y);
      normalizeVector2(vectorTouchStart);
    };
    const touchMove = (x, y) => {
      vectorTouchMove.set(x, y);
      normalizeVector2(vectorTouchMove);
      vactor_raycast = vectorTouchMove;
    };
    const touchEnd = (x, y) => {
      vectorTouchEnd.set(x, y);
    };
    const mouseOut = () => {
      vectorTouchEnd.set(0, 0);
    };

    window.addEventListener('resize', debounce(() => {
      resizeWindow();
    }), 1000);
    canvas.addEventListener('mousedown', function (event) {
      event.preventDefault();
      touchStart(event.clientX, event.clientY, false);
    });
    window.addEventListener('mousemove', function (event) {
      event.preventDefault();
      touchMove(event.clientX, event.clientY, false);
    });
    canvas.addEventListener('mouseup', function (event) {
      event.preventDefault();
      touchEnd(event.clientX, event.clientY, false);
    });
    canvas.addEventListener('touchstart', function (event) {
      event.preventDefault();
      touchStart(event.touches[0].clientX, event.touches[0].clientY, true);
    });
    canvas.addEventListener('touchmove', function (event) {
      event.preventDefault();
      touchMove(event.touches[0].clientX, event.touches[0].clientY, true);
    });
    canvas.addEventListener('touchend', function (event) {
      event.preventDefault();
      touchEnd(event.changedTouches[0].clientX, event.changedTouches[0].clientY, true);
    });
    window.addEventListener('mouseout', function () {
      event.preventDefault();
      mouseOut();
    });
  }

  const init = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xeeeeee, 1.0);
    camera.position.set(1000, 1000, 1000);
    camera.lookAt(new THREE.Vector3());

    on();
    initSketch();
    resizeWindow();
    renderLoop();
  }
  init();
}
