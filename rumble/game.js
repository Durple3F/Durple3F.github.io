import * as THREE from 'three';
import { loader, expDecay, expDecay3d, expDecayAngle, expDecayEuler, solidify } from "./util.js";
import { framesPerSecond } from './config.js';
import { Capsule } from 'three/addons/math/Capsule.js';

export class Game {
	constructor(renderer, controls){
		console.log(this)
		this.renderer = renderer
		this.controls = controls
		this.cameras = []
		this.currentCamera = -1
		this.actors = []
		this.lastFrameTime = Date.now()
		this.newScene()
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

		const al = new THREE.AmbientLight(0xffffff, 0.3);
		scene.add(al);
		const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
		directionalLight.position.set(5, 20, -5)
		directionalLight.lookAt(0, 0, 0)
		scene.add(directionalLight);

		scene.background = new THREE.Color().setRGB( 0.5, 0.5, 0.5 );

		this.level = MODELS["level"]
		this.scene.add(this.level.gltf.scene)

		this.playerCharacter = new Character("bulbasaur", ["outline"])
		const helper = new THREE.AxesHelper(2);
		this.playerCharacter.model.add(helper);
		this.scene.add(this.playerCharacter.model)
		// this.scene.add(this.playerCharacter.collisionModel)
		this.actors.push(this.playerCharacter)
		console.log(this.playerCharacter)

		for (let i = 0; i < 10; i++){
			const char = new Character("bulbasaur", ["outline"])
			const gltf = char.model;
			gltf.position.x += Math.random() - 0.5
			gltf.position.z += Math.random() - 0.5
			scene.add( gltf );
			this.actors.push(char)
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

	async startLevel(levelId){
		this.level = new World(levelId)
		await this.level.load()
		let worldSegments = this.level.worldSegments
		console.log(this.level)
		let worldSegment = this.level.worldSegmentMap.get(worldSegments[0])
		this.scene.add(worldSegment.gltf.scene)
	}

	tick(){
		const now = Date.now()
		const controls = this.controls
		controls.tick()

		//controls how fast easing is applied
		const decay = 0.01
		const dt = now - this.lastFrameTime
		// console.log(now, dt, this.lastFrameTime)
		this.lastFrameTime = now

		const camera1 = this.cameras[0]
		const camera2 = this.cameras[this.currentCamera]
		// camera.rotation.y += this.controls.mouse.vx * 0.001
		const playerCharacter = this.playerCharacter
		const playerPos = playerCharacter.model.position
		let dx = 0
		let dz = 0
		if (controls.isPressing("a")){
			dx -= 0.05
		}
		if (controls.isPressing("d")){
			dx += 0.05
		}
		if (controls.isPressing("w")){
			dz -= 0.05
		}
		if (controls.isPressing("s")){
			dz += 0.05
		}
		playerCharacter.vx = expDecay(playerCharacter.vx, dx, decay, dt)
		playerCharacter.vz = expDecay(playerCharacter.vz, dz, decay, dt)
		playerPos.x += playerCharacter.vx
		playerPos.y += playerCharacter.vy
		playerPos.z += playerCharacter.vz

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

		//Update collision boxes
		const actors = this.actors
		for (let actor of actors){
			let collisionModel = actor.collisionModel
			let model = actor.model
			collisionModel.rotation.copy(model.rotation)
			collisionModel.position.copy(model.position)
		}

		//handle gravity
		let level = this.level
		for (let actor of actors){
			let collisionModel = actor.collisionModel
			let position = collisionModel.position
			let groundCoord = level.getGroundCoord(position)
			let distFromGround = position.y - groundCoord
			if (distFromGround > 1e-5){
				//Actor is above ground
				actor.vy -= 0.01
			} else if (distFromGround < -1e-5){
				//Actor is below the ground
				//Pop them out of the ground
				position.y = groundCoord
				actor.vy = 0
			} else {
				//Actor is on the ground
				position.y = groundCoord
				actor.vy = 0
			}
			break
		}

		//Update visual models to reflect collision boxes
		for (let actor of actors){
			let collisionModel = actor.collisionModel
			let model = actor.model
			model.rotation.copy(collisionModel.rotation)
			model.position.copy(collisionModel.position)
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

const LEVELS = {}
LEVELS["level1"] = {
	heightMapResolution: 0.01,
	worldSegments: [
		{
			modelId: "level1/0",
			modelUrl: "public/models/levels/level.glb",
			px: 0,
			py: 0,
			pz: 0,
			rx: 0,
			ry: 0,
			rz: 0
		}
	]
}

class Character{
	constructor(modelId, modifiers){
		this.modelId = modelId
		this.model = MODELS[modelId].gltf.scene.clone()
		//Collision element
		const collisionGroup = new THREE.Group()
		const geometry = new THREE.CapsuleGeometry(0.25, 0.2, 2, 6, 4);
		const material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
		const collisionCapsule = new THREE.Mesh( geometry, material );
		collisionCapsule.position.y += 0.2
		collisionCapsule.rotation.x = Math.PI * 0.5
		collisionGroup.add(collisionCapsule)
		this.collisionModel = collisionGroup

		if (modifiers){
			if (modifiers.includes("outline")){
				let totalGroup = new THREE.Group()
				let outlineGroup = new THREE.Group()
				outlineGroup.rotation.x = Math.PI * 0.5
				let model = this.model
				for (let mesh of model.children){
					solidify(outlineGroup, mesh)
				}
				totalGroup.add(model)
				totalGroup.add(outlineGroup)
				this.model = totalGroup
			}
		}

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

class World {
	constructor(levelId){
		this.isLoaded = false
		this.worldData = LEVELS[levelId]
		let worldSegments = this.worldData.worldSegments
		this.worldSegments = worldSegments
		this.worldSegmentMap = new Map()
		this.heightMap = new Map()
	}
	async load(){
		let p = []
		for (let i = 0; i < this.worldSegments.length; i++){
			let segment = this.worldSegments[i]
			let modelId = segment.modelId
			let modelUrl = segment.modelUrl
			let segmentP = loadModel(modelId, modelUrl)
			.then(model => {
				this.worldSegmentMap.set(segment, model)
			})
			p.push(segmentP)
		}
		p = Promise.all(p).then(() => {
			this.isLoaded = true
		})
		return p
	}
	getGroundCoord(position){
		//Returns the y-coordinate of the nearest ground below the given position.
		let x = position.x
		let z = position.z
		let resolution = this.worldData.heightMapResolution ?? 0.01
		x -= x % resolution
		z -= z % resolution
		let key = x.toString()+","+z.toString()
		let heightMap = this.heightMap
		if (heightMap.has(key)){
			return heightMap.get(key)
		} else {
			let worldSegmentModel = this.worldSegmentMap.get(this.worldSegments[0])
			let worldModel = worldSegmentModel.gltf.scene
			//Check downwards from y=0 to see if the ground is below 0
			let raycaster = new THREE.Raycaster(new THREE.Vector3(x, 0, z), new THREE.Vector3(0, 1, 0))
			let upResult = raycaster.intersectObject(worldModel)
			let dist = upResult.length ? upResult[upResult.length - 1].distance : -Infinity
			let groundCoord = dist
			if (groundCoord === -Infinity){
				raycaster.set(position, new THREE.Vector3(0, -1, 0))
				let downResult = raycaster.intersectObject(worldModel)
				dist = downResult.length ? downResult[0].distance : Infinity
				groundCoord = -dist
			}
			heightMap.set(key, groundCoord)
			return groundCoord
		}
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
	await loader.loadAsync(url).then(gltf => {
		model.loaded = true
		model.gltf = gltf
	})
	.catch(e => {
		console.error("Model failed to load.")
		console.log(modelId, url)
		console.log(e)
		loadModel(modelId, url)
	})
	return model
}

