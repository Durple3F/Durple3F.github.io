import * as THREE from 'three';
import { loader, expDecay, expDecay3d, expDecayAngle, expDecayEuler } from "./util.js";
import { framesPerSecond } from './config.js';

export class Game {
	constructor(renderer, controls){
		console.log(this)
		this.renderer = renderer
		this.controls = controls
		this.cameras = []
		this.currentCamera = -1
		this.newScene()
		this.playerCharacter = new Character("bulbasaur")
		const helper = new THREE.AxesHelper(2);
		this.playerCharacter.model.add(helper);
		this.scene.add(this.playerCharacter.model)
		console.log(this.playerCharacter)
	}
	async newScene(){
		let width = window.innerWidth, height = window.innerHeight;
		let scene = new THREE.Scene();
		this.scene = scene
		this.cameras.length = 0;
		this.cameras.push(new THREE.PerspectiveCamera( 70, width / height, 0.01, 10 ));
		let camera = this.cameras[0]
		camera.position.z = 1;
		camera.position.y = 2;
		camera.rotation.x = -Math.PI * 0.4
		let camera2 = camera.clone()
		this.cameras.push(camera2);
		this.currentCamera = 1

		const al = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(al);

		for (let i = 0; i < 10; i++){
			const char = new Character("bulbasaur")
			const gltf = char.model;
			gltf.position.x += Math.random() - 0.5
			gltf.position.z += Math.random() - 0.5
			scene.add( gltf );
		}

		return scene
	}
	resizeWindow(){
		let width = window.innerWidth
		let height = window.innerHeight
		this.renderer.setSize(width, height);
		this.renderer.setPixelRatio(window.devicePixelRatio)
		// camera.aspect = window.devicePixelRatio;
		// camera.updateProjectionMatrix();
		this.renderer.domElement.width = width;
		this.renderer.domElement.height = height;
	}

	tick(){
		const controls = this.controls
		controls.tick()

		//controls how fast easing is applied
		const decay = 0.1
		const dt = 1000 / framesPerSecond

		const camera1 = this.cameras[0]
		const camera2 = this.cameras[this.currentCamera]
		// camera.rotation.y += this.controls.mouse.vx * 0.001
		const playerCharacter = this.playerCharacter
		const playerPos = playerCharacter.model.position
		let dx = 0
		let dz = 0
		if (controls.isPressing("a")){
			dx -= 1
		}
		if (controls.isPressing("d")){
			dx += 1
		}
		if (controls.isPressing("w")){
			dz -= 1
		}
		if (controls.isPressing("s")){
			dz += 1
		}
		playerPos.x += dx * 0.05
		playerPos.z += dz * 0.05

		//update facing direction
		if (!(dx === 0 && dz === 0)){
			const playerFaceDir = new THREE.Vector3();
			playerCharacter.model.getWorldDirection(playerFaceDir);
			let targetAngle = (new THREE.Euler(0,0,0)).setFromVector3(playerFaceDir).y
			targetAngle = Math.atan2(dx, dz)
			const dir1 = new THREE.Euler(0, targetAngle, 0)
			const dir2 = playerCharacter.model.rotation
			const newDir = expDecayEuler(dir1, dir2, decay, dt)
			playerCharacter.model.rotation.setFromVector3(newDir)
		}

		//Now move the camera towards the goal
		const CAMERA_OFFSET_LOCAL = new THREE.Vector3(0, 1.5, 2);
		// const anchor = playerPos.clone();
		// anchor.y += 2;
		// const moveDirection = camera1.position.clone().sub(anchor).normalize();
		// const desiredDistance = 1;
		// const targetPosition = anchor.clone().add(
		// 	moveDirection.multiplyScalar(desiredDistance)
		// )
		camera1.position.copy(playerPos).add(CAMERA_OFFSET_LOCAL)
		const newCameraPos = expDecay3d(camera1.position, camera2.position, decay, dt)
		camera2.position.copy(newCameraPos)

		// const cameraOffset = new THREE.Vector3(
		// 	0,	// left/right
		// 	0,	// height above character
		// 	0	// distance behind character
		// )
		// const target = new THREE.Vector3().copy(playerPos)
		// target.add(cameraOffset)
		camera1.lookAt(playerPos)
		const dir1 = camera1.rotation
		const dir2 = camera2.rotation
		const newDir = expDecayEuler(dir1, dir2, decay, dt)
		camera2.rotation.setFromVector3(newDir)
	}
}

class Character{
	constructor(modelId){
		this.modelId = modelId
		this.model = MODELS[modelId].gltf.scene.clone()
		this.model.rotation.y = Math.PI
		this.modelData = MODELS[modelId]

		this.vx = 0
		this.vy = 0
		this.vz = 0
	}
	get x(){
		return this.model.position.x
	}
	set x(coord){
		this.model.position.x = coord
	}
	get y(){
		return this.model.position.y
	}
	set y(coord){
		this.model.position.y = coord
	}
	get z(){
		return this.model.position.z
	}
	set z(coord){
		this.model.position.z = coord
	}
}

export const MODELS = {}
class Model{
	constructor(){
		this.modelId = null
		this.url = null
		this.loaded = false
		this.gltf = null
	}
}
export async function loadModel(modelId, url){
	let model = new Model()
	MODELS[modelId] = model
	model.modelId = modelId
	model.url = url
	return loader.loadAsync(url).then(gltf => {
		model.loaded = true
		model.gltf = gltf
	})
	.catch(e => {
		console.error("Model failed to load.")
		console.log(modelId, url)
		console.log(e)
	})
}