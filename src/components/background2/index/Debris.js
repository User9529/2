import * as THREE from 'three';
import debrisVS from './glsl/debris.vs'
import debrisFS from './glsl/debris.fs'
import { MathEx } from '@ykob/js-util';

export default class Debris {
  constructor(x, y, z) {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      rotate: {
        type: 'f',
        value: Math.random() * 10
      }
    };
    this.obj = this.createObj();
    this.obj.position.set(x, y, z);
  }
  createObj() {
    return new THREE.Mesh(
      new THREE.BoxGeometry(100, 100, 100),
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: debrisVS,
        fragmentShader: debrisFS,
        transparent: true,
        wireframe: true
      })
    )
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
