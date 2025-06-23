import * as THREE from 'three';
import { debounce } from '@ykob/js-util';

import SkyOctahedron from './SkyOctahedron.js'
import SkyOctahedronShell  from './SkyOctahedronShell.js'
import Ground from './Ground.js'
import Debris from './Debris.js'
import PostEffect from './PostEffect.js'

export default function() {

  const canvas = document.getElementById('canvas-webgl');
  if (!canvas) {
    console.error('未找到 canvas 元素');
    return;
  }
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    canvas: canvas,
    context: canvas.getContext('webgl2')
  });
  const renderBack = new THREE.WebGLRenderTarget(document.body.clientWidth, window.innerHeight);
  const scene = new THREE.Scene();
  const sceneBack = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const cameraBack = new THREE.PerspectiveCamera(45, document.body.clientWidth / window.innerHeight, 1, 10000);
  const clock = new THREE.Clock();

  const skyOctahedron = new SkyOctahedron();
  const skyOctahedronShell = new SkyOctahedronShell();
  const ground = new Ground();
  const debris = [
     new Debris(-500, 0, -150),
     new Debris(-400, 0, -150),
     new Debris(-300, 0, -150),
     new Debris(-200, 0, -150),
     new Debris(-100, 0, -150),
     new Debris(0, 0, -150),
     new Debris(100, 0, -150),
  ];
  const postEffect = new PostEffect(renderBack.texture);

  const elemIntro = document.getElementsByClassName('js-transition-intro');

  const resizeWindow = () => {
    canvas.width = document.body.clientWidth;
    canvas.height = window.innerHeight;
    cameraBack.aspect = document.body.clientWidth / window.innerHeight;
    cameraBack.updateProjectionMatrix();
    renderBack.setSize(document.body.clientWidth, window.innerHeight);
    renderer.setSize(document.body.clientWidth, window.innerHeight);
    postEffect.resize();
  }
  const render = () => {
    const time = clock.getDelta();
    skyOctahedron.render(time);
    skyOctahedronShell.render(time);
    ground.render(time);
    for (let i = 0; i < debris.length; i++) {
      debris[i].render(time);
    }
    renderer.setRenderTarget(renderBack);
    renderer.render(sceneBack, cameraBack);
    postEffect.render(time);
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  }
  const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
  }
  const on = () => {
    window.addEventListener('resize', debounce(() => {
      resizeWindow();
    }), 1000);


  }
  const transitionOnload = () => {
    for (let i = 0; i < elemIntro.length; i++) {
      const elm = elemIntro[i];
      elm.classList.add('is-shown');
    }
  }

  const init = () => {
    renderer.setSize(document.body.clientWidth, window.innerHeight);
    renderer.setClearColor(0x111111, 1.0);
    cameraBack.position.z = 800;
    window.addEventListener('resize', () => {
      resizeWindow();
      // 更新所有材质的统一变量
      skyOctahedron.uniforms.normalMatrix.value.getNormalMatrix(skyOctahedron.obj.matrixWorld);
    });
    sceneBack.add(ground.obj);

      scene.add(postEffect.obj);
      // sceneBack.add(skyOctahedron.obj);
      // sceneBack.add(skyOctahedronShell.obj);
      for (let i = 0; i < debris.length; i++) {
        sceneBack.add(debris[i].obj);
      }
      transitionOnload();

    clock.start();

    on();
    resizeWindow();
    renderLoop();
  }
  init();
}
