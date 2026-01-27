import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';

export const loader = new GLTFLoader();

const decay = 16
export function expDecay(a, b, decay, dt){
	return b+(a-b)*Math.exp(-decay * dt)
}
export function expDecayAngle(a, b, decay, dt){
	const PI = Math.PI
	if (b - a > PI) b -= 2*PI
	if (b - a < -PI) b += 2*PI
	return expDecay(a, b, decay, dt)
}
export function expDecay3d(va, vb, decay, dt){
	return new THREE.Vector3(
		expDecay(va.x, vb.x, decay, dt),
		expDecay(va.y, vb.y, decay, dt),
		expDecay(va.z, vb.z, decay, dt)
	)
}
export function expDecayEuler(va, vb, decay, dt){
	return new THREE.Euler(
		expDecayAngle(va.x, vb.x, decay, dt),
		expDecayAngle(va.y, vb.y, decay, dt),
		expDecayAngle(va.z, vb.z, decay, dt)
	)
}

export function dotProduct(vector1, vector2) {
  let result = 0;
  for (let i = 0; i < vector1.length; i++) {
    result += vector1[i] * vector2[i];
  }
  return result;
}

export function dotProduct2d(x1, y1, x2, y2){
	return x1 * x2 + y1 * y2
}
export function dotProduct3d(x1, y1, z1, x2, y2, z2){
	return x1 * x2 + y1 * y2 + z1 * z2
}

export async function solidify(scene, mesh, thickness=0.012){
	const geometry = mesh.geometry
	thickness = thickness.toString()
	if (!thickness.includes(".")){
		thickness += ".0"
	}
	const material = new THREE.ShaderMaterial({
		vertexShader: `
			void main() {
				vec3 newPosition = position + normal * ${thickness};
				gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1);
			}
		`,
		fragmentShader: `
			void main() {
				gl_FragColor = vec4(0, 0, 0, 1);
			}
		`,
		side: THREE.BackSide
	})
	const outline = new THREE.Mesh(geometry, material)
	scene.add(outline)
}