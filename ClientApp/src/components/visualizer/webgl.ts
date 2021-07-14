/*
 * Modified version of Misaki Nakano's visualizer CodePen (https://codepen.io/mnmxmx/pen/mmZbPK/)
 * for React and TypeScript, although not the most idiomatic code
 *
 * Copyright (c) 2017 Misaki Nakano
 * Licensed under MIT (https://opensource.org/licenses/MIT)
 */

import * as THREE from "three";
import { IUniform, ShaderMaterialParameters } from "three";

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

class Webgl {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  windowW: number;
  windowH: number;

  sphereG!: THREE.IcosahedronBufferGeometry;
  sphereM!: THREE.ShaderMaterial;
  vertex!: string;
  fragment!: string;
  mesh!: THREE.Mesh;

  sphereG_2!: THREE.IcosahedronBufferGeometry;
  sphereM_2!: THREE.ShaderMaterial;
  vertex_2!: string;
  fragment_2!: string;
  mesh_2!: THREE.Mesh;

  verticesArray!: ArrayLike<number>;
  vecCount!: number;
  indexCount!: number;
  vec3Array!: Vec3[];
  allVec3Array!: Vec3[];
  indexArray!: (number | boolean)[];
  indexPosArray!: number[][];
  frequencyNumArray!: number[];

  constructor(wrapper: HTMLDivElement) {
    this.scene = new THREE.Scene();
    const windowW = window.innerWidth;
    const windowH = Math.max(600, window.innerHeight);

    this.camera = new THREE.PerspectiveCamera(
      45,
      windowW / windowH,
      0.1,
      10000
    );
    this.camera.position.set(20, 200, -80);

    this.camera.lookAt(this.scene.position);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    this.renderer.setPixelRatio(1.5);

    this.renderer.setClearColor(0x20c5d4, 0);
    this.renderer.setSize(windowW, windowH);

    wrapper.appendChild(this.renderer.domElement);
    wrapper.style.width = windowW + "px";
    wrapper.style.height = window.innerHeight + "px";

    this.renderer.domElement.style.width = windowW + "px";
    this.renderer.domElement.style.height = windowH + "px";

    // const orbit = new THREEOrbitControls.OrbitControls(
    //   this.camera,
    //   this.renderer.domElement
    // );
    this.windowW = windowW;
    this.windowH = window.innerHeight;

    window.onresize = () => {
      this.windowW = document.body.clientWidth;
      this.windowH = window.innerHeight;
      const _height = Math.max(600, this.windowH);
      this.renderer.setSize(this.windowW, _height);
      this.camera.aspect = this.windowW / _height;
      this.camera.updateProjectionMatrix();

      wrapper.style.width = this.windowW + "px";
      wrapper.style.height = window.innerHeight + "px";
    };

    this.createSphere();

    this.renderer.render(this.scene, this.camera);
  }

  createSphere() {
    this.createShader();

    this.sphereG = new THREE.IcosahedronBufferGeometry(40, 4);
    this.sphereM = new THREE.ShaderMaterial({
      vertexShader: this.vertex,
      fragmentShader: this.fragment,
      uniforms: {
        uTime: { type: "f", value: 0 } as IUniform,
        uScale: { type: "f", value: 0 } as IUniform,
        isBlack: { type: "i", value: 1 } as IUniform,
      },
      wireframe: true,
      transparent: true,
    });

    this.detectIndex();
    this.sphereG.setAttribute(
      "aFrequency",
      new THREE.BufferAttribute(new Float32Array(this.indexArray.length), 1)
    );

    this.mesh = new THREE.Mesh(this.sphereG, this.sphereM);

    this.scene.add(this.mesh);

    this.createSphere2();
  }

  createSphere2() {
    this.sphereG_2 = new THREE.IcosahedronBufferGeometry(39.5, 4);
    this.sphereG_2.setAttribute(
      "aFrequency",
      new THREE.BufferAttribute(new Float32Array(this.indexArray.length), 1)
    );
    this.sphereM_2 = new THREE.ShaderMaterial({
      vertexShader: this.vertex_2,
      fragmentShader: this.fragment_2,
      uniforms: {
        uScale: { type: "f", value: 0 } as IUniform,
        isBlack: { type: "i", value: 1 } as IUniform,
      },
    } as ShaderMaterialParameters);

    this.mesh_2 = new THREE.Mesh(this.sphereG_2, this.sphereM_2);
    this.scene.add(this.mesh_2);
  }

  detectIndex() {
    this.verticesArray = this.sphereG.attributes.position.array;
    const arrayLength = this.verticesArray.length;

    this.vecCount = 0;
    this.indexCount = 0;
    this.vec3Array = [];
    this.allVec3Array = [];
    this.indexArray = [];
    this.indexPosArray = [];
    this.frequencyNumArray = [];

    for (let i = 0; i < arrayLength; i += 3) {
      const vec3: Vec3 = {
        x: this.verticesArray[i],
        y: this.verticesArray[i + 1],
        z: this.verticesArray[i + 2],
      };

      const detect = this.detectVec(vec3);
      this.allVec3Array.push(vec3);

      if (detect === 0 || detect > 0) {
        this.indexArray[this.indexCount] = detect;
        this.indexPosArray[detect as number].push(this.indexCount);
      } else {
        this.vec3Array[this.vecCount] = vec3;
        this.indexArray[this.indexCount] = this.vecCount;

        this.indexPosArray[this.vecCount] = [];
        this.indexPosArray[this.vecCount].push(this.indexCount);

        this.vecCount++;
      }

      this.indexCount++;
    }
  }

  detectVec(vec3: Vec3): number | boolean {
    if (this.vecCount === 0) return false;

    for (var i = 0, len = this.vec3Array.length; i < len; i++) {
      var _vec3 = this.vec3Array[i];
      var isExisted =
        vec3.x === _vec3.x && vec3.y === _vec3.y && vec3.z === _vec3.z;
      if (isExisted) {
        return i;
      }
    }

    return false;
  }

  createShader() {
    this.vertex = [
      "uniform float uTime;",
      "uniform float uScale;",

      "attribute float aFrequency;",
      "varying float vFrequency;",
      "varying float vPos;",

      "const float frequencyNum = 256.0;",
      "const float radius = 40.0;",
      "const float PI = 3.14159265;",
      "const float _sin15 = sin(PI / 10.0);",
      "const float _cos15 = cos(PI / 10.0);",

      "void main(){",

      "float frequency;",
      "float SquareF = aFrequency * aFrequency;",

      "frequency = smoothstep(16.0, 7200.0, SquareF) * SquareF / (frequencyNum * frequencyNum);",

      "vFrequency = frequency;",

      "float _uScale = (1.0 - uScale * 0.5 / frequencyNum) * 3.0;",

      "float _sin = sin(uTime * .5);",
      "float _cos = cos(uTime * .5);",

      "mat2 rot = mat2(_cos, -_sin, _sin, _cos);",
      "mat2 rot15 = mat2(_cos15, -_sin15, _sin15, _cos15);",

      "vec2 _pos = rot * position.xz;",
      "vec3 newPos = vec3(_pos.x, position.y, _pos.y);",
      "newPos.xy = rot15 * newPos.xy;",

      "newPos = (1.0 + uScale / (frequencyNum * 2.0) ) * newPos;",

      "vPos = (newPos.x + newPos.y + newPos.z) / (3.0 * 120.0);",

      "gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos + vFrequency * newPos * _uScale, 1.0);",
      "}",
    ].join("\n");

    this.fragment = [
      "uniform float uTime;",
      "uniform float uScale;",

      "uniform int isBlack;",

      "varying float vFrequency;",
      "varying float vPos;",

      "const float frequencyNum = 256.0;",
      "const vec3 baseColor = vec3(0.95, 0.25, 0.3);",
      // "const vec3 baseColor = vec3(0.0, 0.65, 0.7);",

      "void main(){",
      "float f = smoothstep(0.0, 0.00002, vFrequency * vFrequency) * vFrequency;",
      "float red = min(1.0, baseColor.r + f * 1.9);",
      "float green = min(1.0, baseColor.g + f * 3.6);",
      "float blue = min(1.0, baseColor.b + f* 0.01);",
      "float sum = red + blue + green;",

      "blue = min(1.0, blue + 0.3);",
      "green = max(0.0, green - 0.1);",

      "float offsetSum = (sum - (red + blue + green) / 3.0) / 3.0;",

      "blue += offsetSum + min(vPos * 2.0, -0.2);",
      "red += offsetSum + min(vPos * 0.5, 0.2);",
      "green += offsetSum - vPos * max(0.3, vFrequency * 2.0);",

      "vec3 color;",

      "color = vec3(red, green, blue);",

      "gl_FragColor = vec4(color, 1.0);",
      "}",
    ].join("\n");

    //color: 0xff6673,
    this.vertex_2 = [
      "varying vec3 vPosition;",

      "void main(){",
      "vPosition = position;",
      "gl_Position =projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
      "}",
    ].join("\n");
    this.fragment_2 = [
      "uniform float uScale;",
      "uniform int isBlack;",

      "varying vec3 vPosition;",
      "const float frequencyNum = 256.0;",

      "const float radius = 40.0;",
      "const vec3 baseColor = vec3(1.0, 102.0 / 255.0, 115.0 / 255.0);",
      // "const vec3 baseColor = vec3(0.1, 0.8, 0.9);",

      "void main(){",
      "vec3 pos = vec3(vPosition.x, -vPosition.y, vPosition.z) / (radius * 10.0) + 0.05;",

      "vec3 _color;",

      "_color = baseColor + pos;",

      // "float _uScale = uScale / (frequencyNum * 5.0);",

      "gl_FragColor = vec4(_color, 1.0);",
      "}",
    ].join("\n");
  }

  render() {
    this.sphereG.attributes.aFrequency.needsUpdate = true;

    this.renderer.render(this.scene, this.camera);
  }
}

export default Webgl;