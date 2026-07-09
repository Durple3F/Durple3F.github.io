import { CharacterSpriteSheet } from "./battleCharacters.js"
import { FontSpriteSheet, MugshotSpriteSheet, TalkBox } from "./dialogue.js"
import {BattleLevel, LEVELDATAS, MapData, TileSet} from "./level.js"
import { PROPDATAS, ScenePropData } from "./props.js"

export const CAMPAIGNS = {}
export async function loadCampaign(url, name){
	await $.getJSON(url, async campaignData => {
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
		for (let mugshotId in campaignData.mugshotSpriteSheets){
			let base = campaignData.mugshotSpriteSheets[mugshotId]
			let spritesheet = new MugshotSpriteSheet(base)
		}
		for (let talkboxId in campaignData.talkboxSpriteSheets){
			let base = campaignData.talkboxSpriteSheets[talkboxId]
			let talkbox = new TalkBox(base)
			await talkbox.load()
		}
		for (let fontId in campaignData.fontSpriteSheets){
			let base = campaignData.fontSpriteSheets[fontId]
			//rectify sprite locations
			let spriteLocations = base.spriteLocations
			for (let glyph in spriteLocations){
				let dim = spriteLocations[glyph]
				while (dim.length < 6){
					dim.push(0)
				}
				let obj = {}
				obj.x = dim[0]
				obj.y = dim[1] + dim[3]
				obj.w = dim[2]
				obj.h = base.alphabetHeight - dim[3] + dim[4]
				obj.xBias = dim[5]
				obj.yBias = dim[3]
				spriteLocations[glyph] = obj
			}
			let font = new FontSpriteSheet(base)
			await font.load()
		}
	})
}