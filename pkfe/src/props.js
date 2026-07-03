import * as THREE from "three"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
export const PROPDATAS = {}
const propLoader = new GLTFLoader()

export class ScenePropData {
	constructor(base) {
		this.id = base.id
		this.path = base.path
		this.gltf = null
		this.isLoaded = false
		PROPDATAS[this.id] = this
	}
	async load() {
		if (this.isLoaded) {
			return this.gltf
		} else {
			this.gltf = await propLoader.loadAsync(this.path)
			this.gltf.scene.traverse((node) => {
				if (node.isMesh && node.material.map) {
					node.material.map.magFilter = THREE.NearestFilter;
					node.material.map.minFilter = THREE.NearestFilter;
					node.material.map.needsUpdate = true;
				}
			})
			this.isLoaded = true
			return this.gltf
		}
	}
}

export class SceneProp {
	constructor(options) {
		this.isBillboard = options.isBillboard
		let propData = PROPDATAS[options.modelId]
		let scene = new THREE.Scene()
		let gltf = propData.gltf
		let clone = gltf.scene.clone()
		clone.castShadow = true
		clone.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
			if (child.material){
				child.material.alphaTest = 0.2;
				child.material.map.generateMipmaps = false;
				// child.material.map.minFilter = THREE.NearestFilter;
				// child.material.map.magFilter = THREE.NearestFilter;
			}
		});
		scene.add(clone)
		this.model = clone
		this.scene = scene
	}
}