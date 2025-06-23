import * as THREE from 'three';
import skyOctahedronShellVS from './glsl/skyOctahedronShell.vs'
import skyOctahedronShellFS from './glsl/skyOctahedronShell.fs'

export default class SkyOctahedronShell {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      // 添加 normalMatrix uniform
      normalMatrix: {
        type: 'm3',
        value: new THREE.Matrix3()
      }
    };
    this.obj = this.createObj();

    // 添加更新法线矩阵的回调
    this.obj.onBeforeRender = () => {
      this.obj.updateMatrixWorld();
      this.uniforms.normalMatrix.value.getNormalMatrix(this.obj.matrixWorld);
    };
  }

  createObj() {
    const geometry = new THREE.OctahedronGeometry(150, 20);
    return new THREE.Mesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: skyOctahedronShellVS,
        fragmentShader: skyOctahedronShellFS,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        // 关键：启用导数扩展
        extensions: {
          derivatives: true
        }
      })
    )
  }

  render(time) {
    this.uniforms.time.value += time;
  }
}
