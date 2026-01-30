import * as THREE from 'three';
import { loader, expDecay, expDecay3d, expDecayAngle, expDecayEuler, solidify, getBoundingBox } from "./util.js";
import { framesPerSecond } from './config.js';
import { Capsule } from 'three/addons/math/Capsule.js';
import { LEVELS } from './levels.js';

export class Game {
	constructor(renderer, controls){
		console.log(this)
		this.renderer = renderer
		this.controls = controls
		this.cameras = []
		this.currentCamera = -1
		this.actors = []
		this.lastFrameTime = performance.now()
	}
	async newScene(){
		let level = this.level
		let worldData = level.worldData
		let scale = worldData.scale

		let width = window.innerWidth, height = window.innerHeight;
		let scene = new THREE.Scene();
		this.scene = scene
		this.cameras.length = 0;
		this.cameras.push(new THREE.PerspectiveCamera( 70, width / height, 0.01 * scale, 500 * scale ));
		let camera = this.cameras[0]
		camera.position.z = 1 * scale;
		camera.position.y = 2 * scale;
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

		return scene
	}
	resizeWindow(){
		let width = window.innerWidth
		let height = window.innerHeight
		this.renderer.setSize(width, height);
		this.renderer.setPixelRatio(window.devicePixelRatio)
		// for (let camera of this.cameras){
		// 	camera.aspect = window.devicePixelRatio;
		// 	console.log(camera)
		// 	camera.updateProjectionMatrix();
		// }
		// this.renderer.domElement.width = width;
		// this.renderer.domElement.height = height;
	}

	async startLevel(levelId){
		let level = new World(levelId)
		this.level = level
		await level.load()
		this.newScene()
		let worldSegments = level.worldSegments
		let worldData = level.worldData
		let scale = worldData.scale
		const scene = this.scene
		for (let worldSegmentData of worldSegments){
			let worldSegment = level.worldSegmentMap.get(worldSegmentData)
			let sceneSegment = worldSegment.gltf.scene
			sceneSegment.scale.x = scale
			sceneSegment.scale.y = scale
			sceneSegment.scale.z = scale
			sceneSegment.position.x = worldSegmentData.px * sceneSegment.scale.x
			sceneSegment.position.y = worldSegmentData.py * sceneSegment.scale.y
			sceneSegment.position.z = worldSegmentData.pz * sceneSegment.scale.z
			scene.add(sceneSegment)
		}

		this.playerCharacter = new Character("bulbasaur", { scale, modifiers: ["outline"] })
		this.playerCharacter.name = "Player"
		const helper = new THREE.AxesHelper(2);
		this.playerCharacter.model.add(helper);
		this.scene.add(this.playerCharacter.model)
		// this.scene.add(this.playerCharacter.collisionModel)
		this.actors.push(this.playerCharacter)
		console.log(this.playerCharacter)

		for (let i = 0; i < 10; i++){
			break
			const char = new Character("bulbasaur", { scale, modifiers: ["outline"] })
			const gltf = char.model;
			gltf.position.x += Math.random() - 0.5
			gltf.position.z += Math.random() - 0.5
			scene.add( gltf );
			this.actors.push(char)
		}
	}

	tick(){
		const now = performance.now()
		const controls = this.controls
		controls.tick()

		const level = this.level
		const worldData = level.worldData
		const scale = worldData.scale

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
		const playerMovement = new THREE.Vector3()
		if (controls.isPressing("a")){
			playerMovement.x = -1
		}
		if (controls.isPressing("d")){
			playerMovement.x = 1
		}
		if (controls.isPressing("w")){
			playerMovement.z = -1
		}
		if (controls.isPressing("s")){
			playerMovement.z = 1
		}
		playerMovement.normalize().multiplyScalar(0.01 * scale)
		playerCharacter.velocity.x = expDecay(playerCharacter.velocity.x, playerMovement.x, decay, dt)
		playerCharacter.velocity.z = expDecay(playerCharacter.velocity.z, playerMovement.z, decay, dt)

		//Update collision boxes
		const actors = this.actors
		for (let actor of actors){
			const collisionModel = actor.collisionModel
			const model = actor.model
			collisionModel.rotation.copy(model.rotation)
			collisionModel.position.copy(model.position)
		}

		//update facing direction
		if (playerMovement.length() > 1e-5){
			const playerFaceDir = new THREE.Vector3();
			playerCharacter.collisionModel.getWorldDirection(playerFaceDir);
			const targetAngle = Math.atan2(playerMovement.x, playerMovement.z)
			const dir1 = playerCharacter.collisionModel.rotation
			const dir2 = new THREE.Euler(0, targetAngle, 0)
			const newDir = expDecayEuler(dir1, dir2, decay * 2, dt)
			playerCharacter.collisionModel.rotation.copy(newDir)
		}

		//handle gravity
		for (let actor of actors){
			const collisionModel = actor.collisionModel
			const bbox = getBoundingBox(collisionModel)
			const position = bbox.getCenter(new THREE.Vector3())
			const groundCoord = level.getGroundCoord(position)
			console.log(groundCoord)
			const distFromGround = position.y - groundCoord
			if (distFromGround > 1e-3){
				//Actor is above ground
				actor.velocity.y -= 0.0001 * scale
				// actor.floorLevel = groundCoord
			} else if (distFromGround < -1e-3){
				//Actor is below the ground
				//Pop them out of the ground
				position.y = groundCoord
				actor.velocity.y = 0
			} else {
				//Actor is on the ground
				position.y = groundCoord
				actor.velocity.y = 0
			}
		}

		//Apply velocity
		for (let actor of actors){
			const collisionModel = actor.collisionModel
			const position = collisionModel.position
			//Velocity
			const v = actor.velocity.clone().multiplyScalar(dt)

			//Don't let the player go into a wall
			const bbox = getBoundingBox(collisionModel)
			const center = bbox.getCenter(new THREE.Vector3())
			const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(collisionModel.quaternion)
			const raycaster = new THREE.Raycaster(center, forward)
			const worldModel = level.worldSegmentMap.get(level.worldSegments[0]).gltf.scene
			const result = raycaster.intersectObject(worldModel)
			if (result.length){
				const hit = result[0]
				const dist = hit.distance
				const length = v.length()
				if (dist < length + 0.27 * scale){
					const N = hit.face.normal.clone().transformDirection(hit.object.matrixWorld)
					const intoWall = v.dot(N)
					v.addScaledVector(N, -intoWall)
				}
			}

			if (v.x < -1e-5 || v.x > 1e-5 || v.z < -1e-5 || v.z > 1e-5){
				const groundCoord = level.getGroundCoord(position)
				const distFromGround = position.y - groundCoord
				//If we are only a small amount above the ground now, move them to the ground.
				if (distFromGround > 0 && distFromGround < 0.1 * scale){
					position.y = groundCoord
				}
				//If the ground you're attempting to move into is too high, move back.
				else if (distFromGround < -0.1 * scale){
					v.x = 0
					v.z = 0
				}
			}
			
			position.x += v.x
			position.y += v.y
			position.z += v.z
			if (position.y < actor.floorLevel){
				position.y = actor.floorLevel
				v.y = 0
			}
			actor.velocity.copy(v).multiplyScalar(1 / dt)
			actor.vx = v.x / dt
			actor.vy = v.y / dt
			actor.vz = v.z / dt
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
		CAMERA_OFFSET_LOCAL.multiplyScalar(scale)
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
	constructor(modelId, settings){
		this.modelId = modelId
		this.model = MODELS[modelId].gltf.scene.clone()
		this.name = "Character"
		//Collision element
		const collisionGroup = new THREE.Group()
		const geometry = new THREE.CapsuleGeometry(0.25, 0.2, 2, 6, 4);
		const material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
		const collisionCapsule = new THREE.Mesh( geometry, material );
		collisionCapsule.position.y += 0.2
		collisionCapsule.rotation.x = Math.PI * 0.5
		collisionGroup.add(collisionCapsule)
		this.collisionModel = collisionGroup

		let modifiers = settings.modifiers
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

		let scale = settings.scale || 1
		this.model.scale.x *= scale
		this.model.scale.y *= scale
		this.model.scale.z *= scale
		this.collisionModel.scale.copy(this.model.scale)

		this.velocity = new THREE.Vector3()
		this.vx = 0
		this.vy = 0
		this.vz = 0
		this.floorLevel = 0
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
	getWorldSegment(position){
		return this.worldSegmentMap.get(this.worldSegments[0])
	}
	getGroundCoord(position){
		//Returns the y-coordinate of the nearest ground below the given position.
		let x = position.x
		let z = position.z
		let resolution = this.worldData.heightMapResolution ?? 0.01
		x -= x % resolution
		z -= z % resolution
		let y = position.y
		let key = x.toString()+","+z.toString()
		let heightMap = this.heightMap
		let worldSegmentModel = this.getWorldSegment(position)
		let worldModel = worldSegmentModel.gltf.scene
		let rayOrigin = position
		let raycaster = new THREE.Raycaster(rayOrigin, new THREE.Vector3(0, -1, 0))
		let downResult = raycaster.intersectObject(worldModel)
		let groundCoord = -Infinity
		if (downResult.length){
			let hit = downResult[0]
			let point = hit.point
			let normal = hit.normal
			console.log(y, point.y)
			groundCoord = y - hit.distance
		}
		return groundCoord
		// if (heightMap.has(key) && false){
		// 	return heightMap.get(key)
		// } else {
		// 	let worldSegmentModel = this.worldSegmentMap.get(this.worldSegments[0])
		// 	let worldModel = worldSegmentModel.gltf.scene
		// 	//Check downwards from y=0 to see if the ground is below 0
		// 	let rayOrigin = new THREE.Vector3(x, 0, z)
		// 	let raycaster = new THREE.Raycaster(rayOrigin, new THREE.Vector3(0, 1, 0))
		// 	let upResult = raycaster.intersectObject(worldModel)
		// 	let dist = upResult.length ? upResult[upResult.length - 1].distance : -Infinity
		// 	let groundCoord = dist
		// 	if (groundCoord === -Infinity){
		// 		raycaster.set(rayOrigin, new THREE.Vector3(0, -1, 0))
		// 		let downResult = raycaster.intersectObject(worldModel)
		// 		dist = downResult.length ? downResult[0].distance : Infinity
		// 		groundCoord = -dist
		// 	}
		// 	heightMap.set(key, groundCoord)
			
		// }
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

