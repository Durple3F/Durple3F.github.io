import * as THREE from 'three';
import { LZString } from './lz-string.min.js';
import { PROPDATAS, SceneProp } from './props.js';
import { BattleCharacter } from './battleCharacters.js';
import { Terrain } from './terrain.js';
export const LEVELS = {}
export const LEVELDATAS = {}
export const MAPDATAS = {}
export const TILESETS = {}

export class BattleLevel {
	constructor(levelData) {
		this.id = levelData.id
		LEVELS[this.id] = this
		this.map = MAPDATAS[levelData.map]
		this.characters = []
		if ("battleCharacters" in levelData){
			for (let charData of levelData.battleCharacters){
				//TODO: The character data is purposefully vague, for example only specifying that the player character is to be present, but not which pokemon that character is. This is where I'll have to define that later.
				let character = new BattleCharacter(charData.pokemonId, charData.pokemonId, {}, "base", [])
				character.levelCharacterId = charData.id
				this.characters.push(character)
			}
		}
		this.formationSlots = []
		if ("formationSlots" in levelData){
			for (let slotData of levelData.formationSlots){
				let slot = new FormationSlot(slotData.location)
				if (slotData.forcedCharacter){
					let character = this.characters.find(char => char.levelCharacterId === slotData.forcedCharacter)
					slot.setCharacter(character)
				}
				this.formationSlots.push(slot)
			}
		}

		this.cutscenes = levelData.cutscenes ?? []
		this.dialogues = levelData.dialogues ?? {}
	}
	getCharacter(characterId){
		return this.characters.find(char => char.levelCharacterId === characterId)
	}
}

class BattleForce {
	constructor(id, isPlayerControlled=false, relationships={}){
		this.id = id
		this.isPlayerControlled = isPlayerControlled
		this.relationships = relationships
	}
}

class FormationSlot {
	constructor(location){
		this.location = location
		this.isOccupied = false
		this.character = null
	}
	setCharacter(character){
		this.character = character
		this.isOccupied = true
	}
	removeCharacter(){
		this.character = null
		this.isOccupied = false
	}
}

export class MapData {
	constructor(base) {
		this.id = base.id
		MAPDATAS[this.id] = this
		this.width = base.width
		this.height = base.height
		this.layers = base.layers
		this.ambientLight = base.ambientLight
		this.backgroundColor = base.backgroundColor
		this.props = base.props
		this.terrain = base.terrain
	}
}

export class BattleMapLayer {
	constructor(mapLayerData) {
		this.tiles = []
		if ("tiledata" in mapLayerData) {
			this.loadFromEncodedString(mapLayerData.tiledata)
		} else {
			this.width = mapLayerData.width
			this.height = mapLayerData.height
			for (let i = 0; i < width * height; i++) {
				let x = i % width
				let z = Math.floor(i / width)
				// this.tiles.push(new Tile(x, 0, z, [0]))
			}
		}
		this.tileset = mapLayerData.tileset
		let width = this.width
		let height = this.height
		this.atlas = null
		this.mesh = null
		this.uvsArray = null
		this.position = mapLayerData.position ?? [0, 0, 0]
		this.scale = mapLayerData.scale ?? 1
	}

	setTile(x, y, tileId, rotation = 0) {
		const uvsArray = this.uvsArray
		const atlas = this.atlas
		const index = (x + this.width * y) * 8
		uvsArray.set(atlas.uvArrays[tileId][rotation], index)
		const uvAttribute = this.mesh.geometry.attributes.uv
		uvAttribute.addUpdateRange(index, 8)
		this.isMeshDirty = true
	}
	loadFromEncodedString(tiledataStr) {
		let data = JSON.parse(LZString.decompressFromBase64(tiledataStr))
		this.tiles.length = 0
		this.width = data[0]
		this.height = data[1]
		let tilesData = data[2]
		for (let tileData of tilesData) {
			let tile = new Tile(tileData[0], tileData[1], tileData[2], tileData[3], tileData[4])
			this.tiles.push(tile)
		}
	}
}

export class BattleMap {
	constructor(mapdata) {
		this.width = mapdata.width
		this.height = mapdata.height
		this.mapdata = mapdata
		this.tilesets = []
		this.layers = []
		this.props = []
		this.group = new THREE.Group()
		this.group.castShadow = true;
		this.group.receiveShadow = true;

		for (let i = 0; i < mapdata.layers.length; i++) {
			this.layers.push(new BattleMapLayer(mapdata.layers[i]))
		}

		this.terrain = new Terrain()
		if ("terrain" in mapdata){
			this.terrain.createFromData(mapdata.terrain)
		}
	}
	async loadAtlases(loader) {
		for (let layer of this.layers) {
			let atlas = new TileAtlas(loader, TILESETS[layer.tileset])
			layer.atlas = atlas
		}
	}
	async load() {
		const mapdata = this.mapdata
		for (let i = 0; i < mapdata.layers.length; i++) {
			let layerId = mapdata.layers[i]
			let layer = this.layers[i]
			const material = new THREE.MeshStandardMaterial({ map: layer.atlas.texture, transparent: true });

			material.onBeforeCompile = (shader) => {

				const width = this.width * layer.scale
				const height = this.height * layer.scale
				const fadeDistance = Math.sqrt(width * height / 500);

				shader.uniforms.mapHalfSize = {
					value: new THREE.Vector2(width / 2, height / 2)
				};

				shader.uniforms.fadeDistance = {
					value: fadeDistance
				};

				shader.vertexShader = `
					varying vec3 worldPos;
        ` + shader.vertexShader.replace(
					"#include <worldpos_vertex>",
					`
					#include <worldpos_vertex>
					worldPos = worldPosition.xyz;
					`
				);
				shader.fragmentShader = `
					varying vec3 worldPos;
					uniform vec2 mapHalfSize;
					uniform float fadeDistance;
        ` + shader.fragmentShader.replace(
					"#include <dithering_fragment>",
					`

					float dx = mapHalfSize.x - abs(worldPos.x);
					float dz = mapHalfSize.y - abs(worldPos.z);

					float edge = min(dx, dz);

					//float alpha = clamp(edge / fadeDistance, 0.0, 1.0);
					float alpha = smoothstep(0.0, fadeDistance, edge);

					gl_FragColor.a *= alpha;

					#include <dithering_fragment>
					`
				);

			};

			const geometry = new THREE.BufferGeometry(layer.width, layer.height);

			//Creating the buffer geometry is a real pain in the butt.
			//The idea is that, since this piece of geometry needs to be able to display a different tile sprite at every single tile, we need to cheat that by having a UV that we move around to show whatever part of the texture needs to be displayed everywhere.
			const positions = []
			const uvs = []
			const indices = []
			const tileSize = 1
			const width = layer.width
			const height = layer.height
			const x0 = -layer.width * tileSize / 2;
			const z0 = -layer.height * tileSize / 2;
			let vertex = 0;

			for (let z = 0; z < height; z++) {
				for (let x = 0; x < width; x++) {
					const left = x0 + x * tileSize;
					const right = left + tileSize;
					const top = z0 + z * tileSize;
					const bottom = top + tileSize;

					//The vertices of the two triangles that make up this quad with respect to the mesh itself.
					positions.push(
						left, 0, top,
						right, 0, top,
						right, 0, bottom,
						left, 0, bottom
					);

					//The indices of the triplets of data that we just added which create triangles.
					//So like, the first three here say that positions 0, 1, and 2 make a triangle. So do 92, 94, and 95, for example.
					indices.push(
						vertex,
						vertex + 1,
						vertex + 2,

						vertex,
						vertex + 2,
						vertex + 3
					);

					//The atlas precomputed the uvs thank god
					//The tile id represents which kind of tile it is, ie ground, water, ice, path, etc.
					//Not that it matters right now, these are all just zero until they're actually set to something.
					const tileId = 0
					const uv = layer.atlas.uvs[tileId];
					const u0 = 0 //uv.u0
					const u1 = 0 //uv.u1
					const v0 = 0 //uv.v0
					const v1 = 0 //uv.v1

					uvs.push(
						u0, v1,
						u1, v1,
						u1, v0,
						u0, v0
					);

					vertex += 4;
				}
			}
			geometry.setAttribute(
				"position",
				new THREE.Float32BufferAttribute(positions, 3)
			);
			layer.uvsArray = new THREE.Float32BufferAttribute(uvs, 2)
			geometry.setAttribute(
				"uv",
				layer.uvsArray
			);
			geometry.setIndex(indices);
			const imageMesh = new THREE.Mesh(geometry, material);
			layer.mesh = imageMesh
			// imageMesh.castShadow = true;
			imageMesh.receiveShadow = true;
			imageMesh.rotation.x = -Math.PI * 1
			imageMesh.rotation.y = Math.PI * 1
			imageMesh.scale.x = layer.scale * -1
			imageMesh.scale.y = layer.scale
			imageMesh.scale.z = layer.scale
			imageMesh.position.x += layer.position[0]
			imageMesh.position.y += layer.position[1]
			imageMesh.position.z += layer.position[2]
			this.group.add(imageMesh);

			for (let tile of layer.tiles) {
				layer.setTile(tile.x, tile.z, tile.spriteIndexes[tile.spriteIndex])
			}
		}

		for (let propBase of mapdata.props) {
			const propData = PROPDATAS[propBase.modelId]
			await propData.load()
			const prop = new SceneProp(propBase)
			this.props.push(prop)
			if ("scale" in propBase) {
				prop.model.scale.x = propBase.scale
				prop.model.scale.y = propBase.scale
				prop.model.scale.z = propBase.scale
			}
			if ("position" in propBase) {
				prop.scene.position.x = propBase.position[0]
				prop.scene.position.y = propBase.position[1]
				prop.scene.position.z = propBase.position[2]
			}
			this.group.add(prop.scene)
		}
	}
}

export class TileSet {
	constructor(id, path, spriteW, spriteH, columns, rows) {
		this.id = id
		TILESETS[id] = this
		this.path = path
		this.spriteW = spriteW
		this.spriteH = spriteH
		this.columns = columns
		this.rows = rows
	}
}

export class TileAtlas {
	constructor(loader, tileset) {
		this.loaded = false
		this.tileset = tileset
		const texture = loader.load(tileset.path, (texture) => {
			this.loaded = true
		})
		this.texture = texture
		texture.colorSpace = THREE.SRGBColorSpace
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.NearestFilter;
		texture.generateMipmaps = false;
		texture.flipY = true
		this.uvs = []
		this.uvArrays = []
		const rows = tileset.rows
		const columns = tileset.columns
		for (let i = 0; i < rows * columns; i++) {
			const row = Math.floor(i / columns)
			const column = i % columns
			const uv = {}
			this.uvs[i] = uv
			uv.u0 = column / columns
			uv.u1 = (column + 1) / columns
			uv.v0 = row / rows
			uv.v1 = (row + 1) / rows
			const rotation0 = new Float32Array(8)
			const rotation1 = new Float32Array(8)
			const rotation2 = new Float32Array(8)
			const rotation3 = new Float32Array(8)
			rotation0.set([
				uv.u0, uv.v1,
				uv.u1, uv.v1,
				uv.u1, uv.v0,
				uv.u0, uv.v0,
			], 0)
			rotation1.set([
				uv.u1, uv.v1,
				uv.u1, uv.v0,
				uv.u0, uv.v0,
				uv.u0, uv.v1,
			], 0)
			rotation2.set([
				uv.u1, uv.v0,
				uv.u0, uv.v0,
				uv.u0, uv.v1,
				uv.u1, uv.v1,
			], 0)
			rotation3.set([
				uv.u0, uv.v0,
				uv.u0, uv.v1,
				uv.u1, uv.v1,
				uv.u1, uv.v0,
			], 0)

			this.uvArrays[i] = [rotation0, rotation1, rotation2, rotation3]
		}
	}
}

export class Tile {
	constructor(x, y, z, spriteIndexes, spriteChangeInterval = 200) {
		this.x = x
		this.y = y
		this.z = z
		if (typeof spriteIndexes === "number") {
			spriteIndexes = [spriteIndexes]
		}
		this.spriteIndex = 0
		this.spriteIndexes = spriteIndexes
		if (this.spriteIndexes.length <= 1) {
			spriteChangeInterval = -1
		}
		this.spriteChangeInterval = spriteChangeInterval
		this.lastSpriteChangeTime = performance.now()
	}
}

new TileSet("test-tiles", "img/tilesets/test.png", 16, 16, 32, 32)
// new MapData("test", 64, 64, [new MapLayerData("test-tiles", [])])