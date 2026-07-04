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
}

export class BattleCharacter {
	constructor(pokemonId, spriteSheetId, stats, battleClass, equippedMoves){
		this.pokemonId = pokemonId
		this.spriteSheet = CHARACTERSPRITESHEETS[spriteSheetId]
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
		const imageMesh = new THREE.Mesh(geometry, material);
		imageMesh.castShadow = true
		this.object = imageMesh
	}
}