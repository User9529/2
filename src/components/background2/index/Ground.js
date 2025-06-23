import * as THREE from 'three';
import groundVS from './glsl/ground.vs'
import groundFS from './glsl/ground.fs'
import { MathEx } from '@ykob/js-util';


export default class Ground {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
    };
    this.obj = this.createObj();
    this.obj.position.set(0, -150, 0);
    this.obj.rotation.set(MathEx.radians(-90), 0, 0);
  }
  createObj() {
    return new THREE.Mesh(
      new THREE.PlaneGeometry(1024, 1024, 32, 32),
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: groundVS,
        fragmentShader: groundFS,
        transparent: true,
        wireframe: true
      })
    )
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
