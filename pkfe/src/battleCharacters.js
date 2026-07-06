import * as THREE from 'three';
import { loadImage } from './util.js';

const textureLoader = new THREE.TextureLoader()
export const CHARACTERSPRITESHEETS = {}
export class CharacterSpriteSheet {
	constructor(options){
		this.id = options.id
		CHARACTERSPRITESHEETS[this.id] = this
		this.path = options.path
		this.characterWidth = options.characterWidth
		this.characterHeight = options.characterHeight
		this.spriteWidth = options.spriteWidth
		this.spriteHeight = options.spriteHeight
		this.rows = options.rows
		this.columns = options.columns
		this.spriteLocations = options.spriteLocations
		this.spriteUVMap = new Map()
		this.isLoaded = false
		this.texture = null
	}
	async getTexture(){
		if (this.texture){
			return this.texture
		}
		const texture = await textureLoader.loadAsync(this.path)
		this.isLoaded = true
		return texture
	}
	getUVs(spriteKey){
		if (this.spriteUVMap.has(spriteKey)){
			return this.spriteUVMap.get(spriteKey)
		} else {
			const location = this.spriteLocations[spriteKey]
			const x = location[1]
			const y = location[0]
			const rows = this.rows
			const columns = this.columns
			const u0 = x / columns
			const v0 = (rows - 1 - y) / rows
			const u1 = (x + 1) / columns
			const v1 = (rows - y) / rows
			const uv = new Float32Array([
				u0, v1,
				u1, v1,
				u0, v0,
				u1, v0
			])
			this.spriteUVMap.set(spriteKey, uv)
			return uv
		}
	}
}

export class BattleCharacter {
	constructor(pokemonId, spriteSheetId, stats, battleClass, equippedMoves){
		this.pokemonId = pokemonId
		this.homeTile = null
		this.occupyingTiles = new Set()
		this.spriteSheet = CHARACTERSPRITESHEETS[spriteSheetId]
		this.object = null
		this.billboardPivot = new THREE.Group()
		this.fullGroup = new THREE.Group()
		this.fullGroup.add(this.billboardPivot)
	}
	async load(){
		this.texture = await this.spriteSheet.getTexture()
		let charW = this.spriteSheet.characterWidth
		let charH = this.spriteSheet.characterHeight
		const geometry = new THREE.PlaneGeometry(charW, charH);
		geometry.translate(0, charH / 2, 0)

		const texture = this.texture
		texture.colorSpace = THREE.SRGBColorSpace
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.NearestFilter;
		texture.generateMipmaps = false;
		const material = new THREE.MeshStandardMaterial({ map: texture, transparent: true });
		material.alphaTest = 0.2
		material.side = THREE.DoubleSide;
		const imageMesh = new THREE.Mesh(geometry, material);
		imageMesh.castShadow = true
		this.object = imageMesh
		this.billboardPivot.add(this.object)
		this.setSprite("left")
	}
	setSprite(spriteKey){
		//Set UV's to only show one sprite at a time.
		const uvs = this.spriteSheet.getUVs(spriteKey)
		const geometry = this.object.geometry
		geometry.attributes.uv.array.set(uvs)
		geometry.attributes.uv.needsUpdate = true;
	}
}