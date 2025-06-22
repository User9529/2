import * as THREE from 'three';

const Util = {
  getRandomInt: function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },
  getDegree: function(radian) {
    return radian / Math.PI * 180;
  },
  getRadian: function(degrees) {
    return degrees * Math.PI / 180;
  },
  getPolarCoord: function(rad1, rad2, r) {
    const x = Math.cos(rad1) * Math.cos(rad2) * r;
    const z = Math.cos(rad1) * Math.sin(rad2) * r;
    const y = Math.sin(rad1) * r;
    return new THREE.Vector3(x, y, z);
  }
};

export default Util;
