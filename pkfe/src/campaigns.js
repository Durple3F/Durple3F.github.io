import { CharacterSpriteSheet } from "./battleCharacters.js"
import {BattleLevel, LEVELDATAS, MapData, TileSet} from "./level.js"
import { PROPDATAS, ScenePropData } from "./props.js"

export const CAMPAIGNS = {}
export async function loadCampaign(url, name){
	await $.getJSON(url, campaignData => {
		CAMPAIGNS[name] = campaignData
		console.log(campaignData)
		for (let mapDataBaseId in campaignData.maps){
			let base = campaignData.maps[mapDataBaseId]
			let mapData = new MapData(base)
		}
		for (let propDataId in campaignData.props){
			let base = campaignData.props[propDataId]
			let propData = new ScenePropData(base)
		}
		for (let tilesetId in campaignData.tilesets){
			let base = campaignData.tilesets[tilesetId]
			let tileset = new TileSet(base.id, base.path, base.spriteWidth, base.spriteHeight, base.columns, base.rows)
		}
		for (let levelId in campaignData.levels){
			let base = campaignData.levels[levelId]
			LEVELDATAS[levelId] = base
		}
		for (let characterSpriteSheetId in campaignData.characterSpriteSheets){
			let base = campaignData.characterSpriteSheets[characterSpriteSheetId]
			let spritesheet = new CharacterSpriteSheet(base)
		}
	})
}