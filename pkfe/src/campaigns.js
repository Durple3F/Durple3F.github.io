import {BattleLevel, MapData, TileSet} from "./level.js"

export const CAMPAIGNS = {}
export async function loadCampaign(url, name){
	await $.getJSON(url, result => {
		CAMPAIGNS[name] = result
		console.log(result)
		for (let mapDataBaseId in result.maps){
			let base = result.maps[mapDataBaseId]
			let mapData = new MapData(base)
		}
		for (let tilesetId in result.tilesets){
			let base = result.tilesets[tilesetId]
			let tileset = new TileSet(base.id, base.path, base.spriteWidth, base.spriteHeight, base.columns, base.rows)
		}
		for (let levelId in result.levels){
			let base = result.levels[levelId]
			let level = new BattleLevel(base)
		}
	})
}