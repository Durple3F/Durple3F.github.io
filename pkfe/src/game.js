import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MAPDATAS, BattleMap, LEVELS, LEVELDATAS, BattleLevel } from './level.js';
import { CAMPAIGNS } from './campaigns.js';
import { animate, clamp } from './util.js';
import { BattleCutscene } from './cutscenes.js';
import { Screen2d } from './screen2d.js';
import { InputManager } from './input.js';

export class BattleGame {
	constructor(renderer, screen2d, controls) {
		console.log(this)
		this.renderer = renderer
		this.screen2d = new Screen2d(screen2d)
		this.controls = controls
		this.inputs = new InputManager(controls)
		this.level = null
		this.scene = new THREE.Scene()
		this.lights = []
		this.cameras = []
		this.currentCamera = -1
		this.actors = []
		this.lastFrameTime = performance.now()
		this.textureLoader = new THREE.TextureLoader()
		this.isPlayingCutscene = false
		this.tickFns = []

		this.newScene()
		// const orbitControls = new OrbitControls( this.cameras[0], renderer.domElement );
	}
	async newScene() {
		let level = this.level
		let scale = 1
		this.worldScale = scale

		let width = window.innerWidth, height = window.innerHeight;
		let scene = new THREE.Scene();
		this.scene = scene
		this.cameras.length = 0;
		this.cameras.push(new THREE.PerspectiveCamera(20, width / height, 0.01 * scale, 500 * scale));
		let camera = this.cameras[0]
		this.currentCamera = 0

		const al = new THREE.AmbientLight(0xffffff, 1);
		scene.add(al);
		this.lights.push(al)
		const directionalLight = new THREE.DirectionalLight(0x00bb88, 0.7);
		directionalLight.position.set(6, 10, 30)
		directionalLight.lookAt(5, 0, 10)
		directionalLight.castShadow = true
		directionalLight.shadow.camera.left = -20;
		directionalLight.shadow.camera.right = 20;
		directionalLight.shadow.camera.top = 20;
		directionalLight.shadow.camera.bottom = -20;
		directionalLight.shadow.normalBias = 0.5
		// directionalLight.shadow.bias = -0.005
		scene.add(directionalLight);
		this.lights.push(directionalLight)
		// const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
		// scene.add(helper);

		scene.background = new THREE.Color().setRGB(0.5, 0.5, 0.5);

		const axesHelper = new THREE.AxesHelper( 5 );
		scene.add( axesHelper );

		return scene
	}

	resizeWindow(){
		let width = window.innerWidth
		let height = window.innerHeight
		this.renderer.setSize(width, height, true);
		this.renderer.setPixelRatio(window.devicePixelRatio)

		for (let camera of this.cameras){
			camera.aspect = width/height;
			camera.matrixWorldNeedsUpdate = true; 
			camera.updateProjectionMatrix();
		}
		
		this.screen2d.canvas.width = width
		this.screen2d.canvas.height = height
	}

	async loadLevel(levelId){
		let levelData = LEVELDATAS[levelId]
		let level = new BattleLevel(levelData)
		this.level = level
		await this.loadMap(level.map.id)

		//Load characters
		for (let character of level.characters){
			await character.load()
			this.scene.add(character.fullGroup)
		}
		
		//If there's no need to choose character slots, just skip to starting the level.
		if (level.formationSlots.every(slot => slot.isOccupied)){
			this.resetCharacterPositions()
		}
	}
	async loadMap(mapId){
		let mapdata = MAPDATAS[mapId]
		if (!mapdata) throw "Unable to find mapdata at "+mapId
		let map = new BattleMap(mapdata)
		this.map = map
		this.scene.add(map.group)
		if ("ambientLight" in mapdata){
			this.lights.filter(light => light.isAmbientLight)
			.forEach(light => this.lights.splice(this.lights.indexOf(light), 1))
			const al = new THREE.AmbientLight(mapdata.ambientLight.color, mapdata.ambientLight.intensity);
			this.scene.add(al);
			this.lights.push(al)
		}
		if ("backgroundColor" in mapdata){
			this.scene.background = new THREE.Color(mapdata.backgroundColor)
		}
		await map.loadAtlases(this.textureLoader)
		await map.load()
	}

	async runCutscenes(triggerType, triggerEvent){
		let cutscenesToRun = []
		let cutscenes = this.level.cutscenes
		if (triggerType === "basic"){
			for (let cutsceneData of cutscenes){
				let trigger = cutsceneData.trigger
				if (trigger.type === "basic" && trigger.event === triggerEvent){
					cutscenesToRun.push(cutsceneData)
				}
			}
		}
		for (let cutsceneData of cutscenesToRun){
			let cutscene = new BattleCutscene(this, cutsceneData, triggerEvent)
			await cutscene.play()
		}
	}

	centerCameraOnCharacter(character, camera=null){
		let charWorldPos = character.fullGroup.position
		if (camera === null){
			camera = this.cameras[this.currentCamera]
		}
		let scale = this.worldScale
		camera.position.x = (charWorldPos.x) * scale
		camera.position.y = (charWorldPos.y + 8) * scale
		camera.position.z = (charWorldPos.z + 5.5) * scale
	}

	resetCharacterPositions(){
		//Resets all characters to be at the formation slots they started on.
		for (let slot of this.level.formationSlots){
			let character = slot.character
			let coord = slot.location
			let terrainTile = this.map.terrain.getTile(coord[0], coord[1], coord[2])
			this.setCharacterTile(character, terrainTile)
			character.homeTile = terrainTile
			character.occupyingTiles.add(terrainTile)
			terrainTile.occupyingCharacter = character
		}

		//Center camera on player character
		let firstCharacter = this.level.formationSlots[0].character
		this.cameras[0].rotation.x = -Math.PI * 0.3
		this.centerCameraOnCharacter(firstCharacter)
	}
	setCharacterTile(character, terrainTile){
		const tilePos = terrainTile.worldPosition
		character.fullGroup.position.set(tilePos.x, tilePos.y, tilePos.z)
	}
	offsetCharacter(character, distance){
		const tiles = []
		const newTiles = []
		const dx = distance[0]
		const dy = distance[1]
		const dz = distance[2]
		const terrain = this.map.terrain
		const occupied = character.occupyingTiles
		for (let tile of occupied){
			tiles.push(tile)
		}
		//For each tile we have to move, if we can't find a corresponding tile, stop there.
		//This character cannot move in that direction.
		for (let i = 0; i < tiles.length; i++){
			const tile = tiles[i]
			const newTile = terrain.getTile(tile.x + dx, tile.y + dy, tile.z + dz)
			if (!newTile){
				return false
			}
			newTiles[i] = newTile
		}
		for (let i = 0; i < tiles.length; i++){
			occupied.delete(tiles[i])
		}
		for (let i = 0; i < newTiles.length; i++){
			occupied.add(newTiles[i])
		}
		return true
	}
	async moveCharacterAlongPath(character, path, duration, cameraFollow){
		let pos = character.fullGroup.position
		let totalCost = 0
		let infos = []
		for (let i = 0; i < path.length - 1; i++){
			let info = {}
			infos.push(info)
			info.start = path[i]
			info.end = path[i + 1]
			info.cost = info.start.connectionCosts.get(info.end)
			totalCost += info.cost
		}
		for (let info of infos){
			info.duration = info.cost / totalCost * duration
		}
		for (let info of infos){
			await this.moveCharacter(character, info.start, info.end, info.duration, cameraFollow)
		}
	}
	async moveCharacter(character, start, end, duration=0, cameraFollow){
		let resolve
		const promise = new Promise(res => resolve = res)
		const dx = end.worldPosition.x - start.worldPosition.x
		const dy = end.worldPosition.y - start.worldPosition.y
		const dz = end.worldPosition.z - start.worldPosition.z
		const move = (start, end, p) => {
			character.fullGroup.position.x = start.worldPosition.x + dx * p
			character.fullGroup.position.y = start.worldPosition.y + dy * p
			character.fullGroup.position.z = start.worldPosition.z + dz * p
			if (cameraFollow){
				this.centerCameraOnCharacter(character)
			}
		}
		animate({
			easing: "linear",
			step: p => {
				move(start, end, p)
			},
			complete: () => {
				move(start, end, 1)
				this.setCharacterTile(character, end)
				resolve()
			},
			duration: duration
		})
		await promise
	}

	async start(){
		//Run any start-of-level cutscenes
		await this.runCutscenes("basic", "levelStart")
	}

	tick() {
		const now = performance.now()
		const controls = this.controls
		this.inputs.tick()

		if (this.inputs.events.length){
			console.log(this.inputs.events)
		}

		// const level = this.level
		// const worldData = level.worldData
		// const scale = worldData.scale

		//controls how fast easing is applied
		const decay = 0.01
		const dt = now - this.lastFrameTime
		// console.log(now, dt, this.lastFrameTime)

		//TODO: Only care about controls if the 2d screen isn't focused.
		const camera1 = this.cameras[0]
		if (controls.isPressing("a")) {
			camera1.position.x += -0.05
		}
		if (controls.isPressing("d")) {
			camera1.position.x += 0.05
		}
		if (controls.isPressing("w")) {
			camera1.position.z += -0.05
		}
		if (controls.isPressing("s")) {
			camera1.position.z += 0.05
		}

		const map = this.map
		const cameraPos = this.cameras[this.currentCamera].position
		//Point billboarded props at the screen
		for (let prop of map.props){
			if (prop.isBillboard){
				// prop.scene.lookAt(this.cameras[this.currentCamera].position)
				const dx = cameraPos.x - prop.scene.position.x
				const dz = cameraPos.z - prop.scene.position.z
				prop.scene.rotation.y = clamp(Math.atan2(dx, dz), -1, 1) * 0.25
			}
		}

		//Update characters' tilt and animations
		for (let character of this.level.characters){
			const dx = cameraPos.x - character.object.position.x;
			const dy = cameraPos.y - character.object.position.y;
			const dz = cameraPos.z - character.object.position.z;
			//Did you know that the pythagorean theorem scales into three dimensions without issue?
			const horizontalDistance = Math.sqrt(dx * dx + dz * dz);
			character.billboardPivot.rotation.x = -Math.atan2(dy, horizontalDistance);
			character.updateAnimation(now)
		}

		//Update map tiles that update
		for (let layer of map.layers){
			for (let tile of layer.tiles){
				if (tile.spriteChangeInterval === -1) continue
				if (tile.spriteIndexes.length === 1) continue
				if (tile.lastSpriteChangeTime + tile.spriteChangeInterval < now){
					tile.spriteIndex++
					tile.spriteIndex %= tile.spriteIndexes.length
					tile.lastSpriteChangeTime = now
					layer.setTile(tile.x, tile.z, tile.spriteIndexes[tile.spriteIndex])
					// console.log(tile.spriteIndex)
				}
			}

			if (layer.isMeshDirty){
				layer.mesh.geometry.attributes.uv.needsUpdate = true
				layer.isMeshDirty = false
			}
		}

		if (this.screen2d.isActive || true) {
			this.screen2d.render()
		}

		for (let fn of this.tickFns){
			fn(now, dt)
		}

		this.lastFrameTime = now
	}
}