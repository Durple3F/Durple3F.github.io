import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MAPDATAS, BattleMap, LEVELS, LEVELDATAS, BattleLevel } from './level.js';
import { CAMPAIGNS } from './campaigns.js';
import { clamp } from './util.js';
import { BattleCutscene } from './cutscenes.js';

export class BattleGame {
	constructor(renderer, controls) {
		console.log(this)
		this.renderer = renderer
		this.controls = controls
		this.scene = new THREE.Scene()
		this.lights = []
		this.cameras = []
		this.currentCamera = -1
		this.actors = []
		this.lastFrameTime = performance.now()
		this.textureLoader = new THREE.TextureLoader()
		this.isPlayingCutscene = false

		this.newScene()
		const orbitControls = new OrbitControls( this.cameras[0], renderer.domElement );
	}
	async newScene() {
		let level = this.level
		// let worldData = level.worldData
		let scale = 1 //worldData.scale
		this.worldScale = scale

		let width = window.innerWidth, height = window.innerHeight;
		let scene = new THREE.Scene();
		this.scene = scene
		this.cameras.length = 0;
		this.cameras.push(new THREE.PerspectiveCamera(45, width / height, 0.01 * scale, 500 * scale));
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
		// this.renderer.domElement.width = width;
		// this.renderer.domElement.height = height;
	}

	async loadLevel(levelId){
		let levelData = LEVELDATAS[levelId]
		let level = new BattleLevel(levelData)
		this.level = level
		await this.loadMap(level.map.id)

		for (let character of level.characters){
			await character.load()
			this.scene.add(character.billboardPivot)
		}
		
		//If there's no need to choose character slots, just skip to starting the level.
		if (level.formationSlots.every(slot => slot.isOccupied)){
			this.resetCharacterPositions()
		}

		//Run any start-of-level cutscenes
		await this.runCutscenes("basic", "levelStart")
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

	resetCharacterPositions(){
		//Resets all characters to be at the formation slots they started on.
		for (let slot of this.level.formationSlots){
			let character = slot.character
			let coord = slot.location
			character.billboardPivot.position.set(coord[0], coord[1], coord[2])
		}

		//Center camera on player character
		let firstCharacter = this.level.formationSlots[0].character
		let charWorldPos = firstCharacter.billboardPivot.position
		let camera = this.cameras[this.currentCamera]
		let scale = this.worldScale
		camera.position.x = (charWorldPos.x) * scale
		camera.position.y = (charWorldPos.y + 3.5) * scale
		camera.position.z = (charWorldPos.z + 2.5) * scale
		camera.rotation.x = -Math.PI * 0.3
	}

	tick() {
		const now = performance.now()
		const controls = this.controls
		controls.tick()

		// const level = this.level
		// const worldData = level.worldData
		// const scale = worldData.scale

		//controls how fast easing is applied
		const decay = 0.01
		const dt = now - this.lastFrameTime
		// console.log(now, dt, this.lastFrameTime)

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

		for (let character of this.level.characters){
			const dx = cameraPos.x - character.object.position.x;
			const dy = cameraPos.y - character.object.position.y;
			const dz = cameraPos.z - character.object.position.z;
			//Did you know that the pythagorean theorem scales into three dimensions without issue?
			const horizontalDistance = Math.sqrt(dx * dx + dz * dz);
			character.billboardPivot.rotation.x = -Math.atan2(dy, horizontalDistance);
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

		this.lastFrameTime = now
	}
}