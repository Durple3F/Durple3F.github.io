const types = [
	"Normal",
	"Fighting",
	"Flying",
	"Poison",
	"Ground",
	"Rock",
	"Bug",
	"Ghost",
	"Steel",
	"Fire",
	"Water",
	"Grass",
	"Electric",
	"Psychic",
	"Ice",
	"Dragon",
	"Dark",
	"Fairy",
	"Typeless"
]
const typeColors = {
	"Water": "#2381ef",
	"Steel": "#60a1b7",
	"Rock": "#aea981",
	"Psychic": "#ee4079",
	"Poison": "#9240cc",
	"Normal": "#9fa19e",
	"Ice": "#3ed9ff",
	"Ground": "#915118",
	"Grass": "#3ea125",
	"Ghost": "#703f70",
	"Flying": "#81b8ee",
	"Fire": "#e62222",
	"Fighting": "#ff7f00",
	"Fairy": "#ee70ee",
	"Electric": "#fabf00",
	"Dragon": "#5160e1",
	"Dark": "#86548b",
	"Bug": "#91a110",
}
const typeEffectiveness = {}
for (let type of types){
	typeEffectiveness[type] = {}
	for (let type2 of types){
		typeEffectiveness[type][type2] = 1
	}
}
typeEffectiveness["Normal"]["Rock"] = 0.5
typeEffectiveness["Normal"]["Ghost"] = 0
typeEffectiveness["Normal"]["Steel"] = 0.5

typeEffectiveness["Fighting"]["Normal"] = 2
typeEffectiveness["Fighting"]["Flying"] = 0.5
typeEffectiveness["Fighting"]["Poison"] = 0.5
typeEffectiveness["Fighting"]["Rock"] = 2
typeEffectiveness["Fighting"]["Bug"] = 0.5
typeEffectiveness["Fighting"]["Ghost"] = 0
typeEffectiveness["Fighting"]["Steel"] = 2
typeEffectiveness["Fighting"]["Psychic"] = 0.5
typeEffectiveness["Fighting"]["Ice"] = 2
typeEffectiveness["Fighting"]["Dark"] = 2
typeEffectiveness["Fighting"]["Fairy"] = 0.5

typeEffectiveness["Flying"]["Fighting"] = 2
typeEffectiveness["Flying"]["Rock"] = 0.5
typeEffectiveness["Flying"]["Bug"] = 2
typeEffectiveness["Flying"]["Steel"] = 0.5
typeEffectiveness["Flying"]["Grass"] = 2
typeEffectiveness["Flying"]["Electric"] = 0.5

typeEffectiveness["Poison"]["Poison"] = 0.5
typeEffectiveness["Poison"]["Ground"] = 0.5
typeEffectiveness["Poison"]["Rock"] = 0.5
typeEffectiveness["Poison"]["Ghost"] = 0.5
typeEffectiveness["Poison"]["Steel"] = 0
typeEffectiveness["Poison"]["Grass"] = 2
typeEffectiveness["Poison"]["Fairy"] = 2

typeEffectiveness["Ground"]["Flying"] = 0
typeEffectiveness["Ground"]["Poison"] = 2
typeEffectiveness["Ground"]["Rock"] = 2
typeEffectiveness["Ground"]["Bug"] = 0.5
typeEffectiveness["Ground"]["Steel"] = 2
typeEffectiveness["Ground"]["Fire"] = 2
typeEffectiveness["Ground"]["Grass"] = 0.5
typeEffectiveness["Ground"]["Electric"] = 2

typeEffectiveness["Rock"]["Fighting"] = 0.5
typeEffectiveness["Rock"]["Flying"] = 2
typeEffectiveness["Rock"]["Ground"] = 0.5
typeEffectiveness["Rock"]["Bug"] = 2
typeEffectiveness["Rock"]["Steel"] = 0.5
typeEffectiveness["Rock"]["Fire"] = 2
typeEffectiveness["Rock"]["Ice"] = 2

typeEffectiveness["Bug"]["Fighting"] = 0.5
typeEffectiveness["Bug"]["Flying"] = 0.5
typeEffectiveness["Bug"]["Poison"] = 0.5
typeEffectiveness["Bug"]["Ghost"] = 0.5
typeEffectiveness["Bug"]["Steel"] = 0.5
typeEffectiveness["Bug"]["Fire"] = 0.5
typeEffectiveness["Bug"]["Grass"] = 2
typeEffectiveness["Bug"]["Psychic"] = 2
typeEffectiveness["Bug"]["Dark"] = 2
typeEffectiveness["Bug"]["Fairy"] = 0.5

typeEffectiveness["Ghost"]["Normal"] = 0
typeEffectiveness["Ghost"]["Ghost"] = 2
typeEffectiveness["Ghost"]["Psychic"] = 2
typeEffectiveness["Ghost"]["Dark"] = 0.5

typeEffectiveness["Steel"]["Rock"] = 2
typeEffectiveness["Steel"]["Steel"] = 0.5
typeEffectiveness["Steel"]["Fire"] = 0.5
typeEffectiveness["Steel"]["Water"] = 0.5
typeEffectiveness["Steel"]["Electric"] = 0.5
typeEffectiveness["Steel"]["Ice"] = 2
typeEffectiveness["Steel"]["Fairy"] = 2

typeEffectiveness["Fire"]["Rock"] = 0.5
typeEffectiveness["Fire"]["Bug"] = 2
typeEffectiveness["Fire"]["Steel"] = 2
typeEffectiveness["Fire"]["Fire"] = 0.5
typeEffectiveness["Fire"]["Water"] = 0.5
typeEffectiveness["Fire"]["Grass"] = 2
typeEffectiveness["Fire"]["Ice"] = 2
typeEffectiveness["Fire"]["Dragon"] = 0.5

typeEffectiveness["Water"]["Ground"] = 2
typeEffectiveness["Water"]["Rock"] = 2
typeEffectiveness["Water"]["Fire"] = 2
typeEffectiveness["Water"]["Water"] = 0.5
typeEffectiveness["Water"]["Grass"] = 0.5
typeEffectiveness["Water"]["Dragon"] = 0.5

typeEffectiveness["Grass"]["Flying"] = 0.5
typeEffectiveness["Grass"]["Poison"] = 0.5
typeEffectiveness["Grass"]["Ground"] = 2
typeEffectiveness["Grass"]["Rock"] = 2
typeEffectiveness["Grass"]["Bug"] = 0.5
typeEffectiveness["Grass"]["Steel"] = 0.5
typeEffectiveness["Grass"]["Fire"] = 0.5
typeEffectiveness["Grass"]["Water"] = 2
typeEffectiveness["Grass"]["Grass"] = 0.5
typeEffectiveness["Grass"]["Dragon"] = 0.5

typeEffectiveness["Electric"]["Flying"] = 2
typeEffectiveness["Electric"]["Ground"] = 0
typeEffectiveness["Electric"]["Water"] = 2
typeEffectiveness["Electric"]["Grass"] = 0.5
typeEffectiveness["Electric"]["Electric"] = 0.5
typeEffectiveness["Electric"]["Dragon"] = 0.5

typeEffectiveness["Psychic"]["Fighting"] = 2
typeEffectiveness["Psychic"]["Poison"] = 2
typeEffectiveness["Psychic"]["Steel"] = 0.5
typeEffectiveness["Psychic"]["Psychic"] = 0.5
typeEffectiveness["Psychic"]["Dark"] = 0

typeEffectiveness["Ice"]["Flying"] = 2
typeEffectiveness["Ice"]["Ground"] = 2
typeEffectiveness["Ice"]["Steel"] = 0.5
typeEffectiveness["Ice"]["Fire"] = 0.5
typeEffectiveness["Ice"]["Water"] = 0.5
typeEffectiveness["Ice"]["Grass"] = 2
typeEffectiveness["Ice"]["Ice"] = 0.5
typeEffectiveness["Ice"]["Dragon"] = 2

typeEffectiveness["Dragon"]["Steel"] = 0.5
typeEffectiveness["Dragon"]["Dragon"] = 2
typeEffectiveness["Dragon"]["Fairy"] = 0

typeEffectiveness["Dark"]["Fighting"] = 0.5
typeEffectiveness["Dark"]["Ghost"] = 2
typeEffectiveness["Dark"]["Psychic"] = 2
typeEffectiveness["Dark"]["Dark"] = 0.5
typeEffectiveness["Dark"]["Fairy"] = 0.5

typeEffectiveness["Fairy"]["Fighting"] = 2
typeEffectiveness["Fairy"]["Poison"] = 0.5
typeEffectiveness["Fairy"]["Steel"] = 0.5
typeEffectiveness["Fairy"]["Fire"] = 0.5
typeEffectiveness["Fairy"]["Dragon"] = 2
typeEffectiveness["Fairy"]["Dark"] = 2

//The list of all the different events which a pokemon may care about writing down when they happen
const evolutionActiveTriggers = [
	"fiveMatchRed",
	"fiveMatchOrange",
	"fiveMatchYellow",
	"fiveMatchGreen",
	"fiveMatchBlue",
	"fiveMatchPurple",
	"fourMatchRed",
	"fourMatchOrange",
	"fourMatchYellow",
	"fourMatchGreen",
	"fourMatchBlue",
	"fourMatchPurple",
]

const pokemonStatusData = {
	"burn": {
		image: "src/img/icons/burn.png",
		color: "#ff8329",
		stacks: false,
		class: "debuff",
		name: "burn"
	},
	"confused": {
		image: "src/img/icons/confused.png",
		color: "#f97077",
		stacks: false,
		class: "debuff",
		name: "confused"
	},
	"poisoned": {
		image: "src/img/icons/poisoned.png",
		color: "#c763c5",
		stacks: false,
		class: "debuff",
		name: "poisoned"
	},
	"paralyzed": {
		image: "src/img/icons/paralyzed.png",
		color: "#ffcf00",
		stacks: false,
		class: "debuff",
		name: "paralyzed"
	},
	"frostbite": {
		image: "src/img/icons/beveled-star.png",
		color: "rgb(69, 197, 186)",
		stacks: false,
		class: "debuff",
		name: "frostbite"
	},
	"invulnerable": {
		image: "src/img/icons/shield.png",
		color: "rgb(122, 104, 223)",
		stacks: false,
		class: "buff",
		name: "invulnerable"
	},
	"drowsy": {
		image: "src/img/icons/yawn.png",
		color: "rgb(61, 79, 197)",
		stacks: false,
		class: "debuff",
		exclusiveTo: ["asleep"],
		name: "drowsy"
	},
	"asleep": {
		image: "src/img/icons/sleep.png",
		color: "rgb(34, 51, 158)",
		stacks: false,
		class: "debuff",
		canReplace: ["drowsy"],
		name: "asleep"
	},
	"fear-frozen": {
		image: "src/img/icons/evil-eyes.png",
		color: "rgb(95, 15, 98)",
		stacks: false,
		class: "debuff",
		name: "fear-frozen"
	},
	"splinters": {
		image: "src/img/icons/spikes-init.png",
		color: "rgb(98, 62, 15)",
		stacks: false,
		class: "debuff",
		name: "splinters"
	},
	"protect": {
		image: "src/img/icons/nested-hexagons-black.png",
		color: "rgb(187, 236, 255)",
		stacks: false,
		class: "buff",
		name: "protect"
	},
	"light screen": {
		image: "src/img/icons/nested-hexagons.png",
		color: "rgb(211, 107, 214)",
		stacks: false,
		class: "buff",
		name: "light screen"
	},
	"reflect": {
		image: "src/img/icons/mirror-mirror.png",
		color: "rgb(211, 107, 214)",
		stacks: false,
		class: "buff",
		name: "reflect"
	},
	"safeguard": {
		image: "src/img/icons/acid-shield.png",
		color: "rgb(211, 107, 214)",
		stacks: false,
		class: "buff",
		name: "safeguard"
	},
	"seedling": {
		image: "src/img/icons/plant-seed.png",
		color: "rgb(27, 121, 43)",
		stacks: false,
		class: "debuff",
		name: "seedling"
	},
	"mist": {
		image: "src/img/icons/fog.png",
		color: "rgb(70, 70, 70)",
		stacks: false,
		class: "buff",
		name: "mist"
	},
}
for (let statusName in pokemonStatusData){
	let statusType = pokemonStatusData[statusName]
	if (!statusType.exclusiveTo){
		statusType.exclusiveTo = []
	}
	if (!statusType.canReplace){
		statusType.canReplace = []
	}
}

const tileStatusData = {
	"Energy Down": {
		url: "src/img/icons/down-arrow.png"
	},
	"Infested": {
		url: "src/img/icons/ladybug.png"
	},
	"Wrap": {
		url: "src/img/icons/thorny-tentacle.png"
	},
	"Burn": {
		url: "src/img/icons/burn-tile.png"
	},
	"Static": {
		url: "src/img/icons/electric.png"
	},
	"Locked": {
		url: "src/img/icons/plain-padlock.png"
	},
	"Cursed": {
		url: "src/img/icons/curse.png"
	},
	"Bubbly": {
		url: "src/img/icons/bubble.png"
	},
	"Freeze": {
		url: "src/img/icons/beveled-star.png"
	},
	"Stun Spore": {
		stacks: false,
		infectious: 0.1,
		url: "src/img/spritesheets/stun spore.png",
		hasSpriteSheet: true,
		spriteSheetJsonUrl: "src/img/spritesheets/stun spore.json",
		framesPerSprite: 5
	},
	"Sleep Powder": {
		stacks: false,
		infectious: 0.1,
		url: "src/img/spritesheets/sleep powder.png",
		hasSpriteSheet: true,
		spriteSheetJsonUrl: "src/img/spritesheets/sleep powder.json",
		framesPerSprite: 5
	},
	"Poison Powder": {
		stacks: false,
		infectious: 0.07,
		url: "src/img/spritesheets/poison powder.png",
		hasSpriteSheet: true,
		spriteSheetJsonUrl: "src/img/spritesheets/poison powder.json",
		framesPerSprite: 5
	},
	"Acidic": {
		stacks: false,
		url: "src/img/spritesheets/acidic.png",
		hasSpriteSheet: true,
		spriteSheetJsonUrl: "src/img/spritesheets/acidic.json",
		framesPerSprite: 5,
		sizeX: 3,
		sizeY: 3
	},
}
for (let tileStatusName in tileStatusData){
	let status = tileStatusData[tileStatusName]
	status.name = status.name ?? tileStatusName
	status.id = tileStatusName
	status.stacks = status.stacks ?? true
	status.infectious = status.infectious ?? 0
	status.hasSpriteSheet = status.hasSpriteSheet ?? false
	status.framesPerSprite = status.framesPerSprite ?? 1
	status.sizeX = status.sizeX ?? 1
	status.sizeY = status.sizeY ?? 1
}

const natures = [
	{name: "hardy", increase: "attack", decrease: "attack"},
	{name: "lonely", increase: "attack", decrease: "defense"},
	{name: "brave", increase: "attack", decrease: "speed"},
	{name: "adamant", increase: "attack", decrease: "specialAttack"},
	{name: "naughty", increase: "attack", decrease: "specialDefense"},
	{name: "bold", increase: "defense", decrease: "attack"},
	{name: "docile", increase: "defense", decrease: "defense"},
	{name: "relaxed", increase: "defense", decrease: "speed"},
	{name: "impish", increase: "defense", decrease: "specialAttack"},
	{name: "lax", increase: "defense", decrease: "specialDefense"},
	{name: "timid", increase: "speed", decrease: "attack"},
	{name: "hasty", increase: "speed", decrease: "defense"},
	{name: "serious", increase: "speed", decrease: "speed"},
	{name: "jolly", increase: "speed", decrease: "specialAttack"},
	{name: "naive", increase: "speed", decrease: "specialDefense"},
	{name: "modest", increase: "specialAttack", decrease: "attack"},
	{name: "mild", increase: "specialAttack", decrease: "defense"},
	{name: "quiet", increase: "specialAttack", decrease: "speed"},
	{name: "bashful", increase: "specialAttack", decrease: "specialAttack"},
	{name: "rash", increase: "specialAttack", decrease: "specialDefense"},
	{name: "calm", increase: "specialDefense", decrease: "attack"},
	{name: "gentle", increase: "specialDefense", decrease: "defense"},
	{name: "sassy", increase: "specialDefense", decrease: "speed"},
	{name: "careful", increase: "specialDefense", decrease: "specialAttack"},
	{name: "quirky", increase: "specialDefense", decrease: "specialDefense"},
]
function getNature(name){
	return natures.find(nature => nature.name === name)
}
function getRandomNature(){
	return randomChoice(natures)
}

function getStatAbbr(stat){
	switch (stat){
		case "hp":
		return "HP"
		case "attack":
		return "ATK"
		case "defense":
		return "DEF"
		case "specialAttack":
		return "SpATK"
		case "specialDefense":
		return "SpDEF"
		case "speed":
		return "SPD"
	}
}
const statNames = [
	"hp", "attack", "defense", "specialAttack", "specialDefense", "speed"
]
function getStatName(stat){
	switch (stat){
		case "hp":
		return "HP"
		case "attack":
		return "Attack"
		case "defense":
		return "Defense"
		case "specialAttack":
		return "Special Attack"
		case "specialDefense":
		return "Special Defense"
		case "speed":
		return "Speed"
	}
}

function getTypeFromTileType(type){
	switch (type){
		case "red": return "Fire"
		case "orange": return "Fighting"
		case "yellow": return "Electric"
		case "green": return "Grass"
		case "blue": return "Water"
		case "purple": return "Psychic"
		case "black": return "Dark"
		case "pink": return "Fairy"
		default:
			console.warn("What type is ", type)
	}
}

function checkIfPokemonMeetsRequirements(pokemon, req, party){
	if (!req) return true
	if (req.type === "level"){
		return pokemon.level >= req.amount
	}
	if (req.type === "levelWithPartyMember"){
		return pokemon.level >= req.amount &&
		party.some(p => {
			if (p === pokemon) return false
			let partyReq = req.partyMember
			if (partyReq.types){
				let types = partyReq.types
				let fits = types.every(type => p.types.includes(type))
				if (!fits) return false
			}
			return true
		})
	}
	if (req.type === "levelWhileTime"){
		return pokemon.level >= req.amount && isItThisTimeRightNow(req.time)
	}
	if (req.type === "pre-evolve"){
		//This is the type for when a move may only be learned by a pre-evolved version of that pokemon.
		return false
	}
	if (req.type === "friendship"){
		let amt = req.amount
		return pokemon.friendship >= amt
	}
	let simpleTriggers = [
		"fiveMatchRed",
		"fiveMatchOrange",
		"fiveMatchYellow",
		"fiveMatchGreen",
		"fiveMatchBlue",
		"fiveMatchPurple",
		"fourMatchRed",
		"fourMatchOrange",
		"fourMatchYellow",
		"fourMatchGreen",
		"fourMatchBlue",
		"fourMatchPurple",
	]
	if (simpleTriggers.includes(req.type)){
		let amt = req.amount
		return pokemon.evolutionTriggerData[req.type] >= amt
	}
	if (req.type === "never" || req.type === "hidden"){
		return false
	}
	console.warn("You never handled this", req)
	return false
}
function getReasonPokemonDoesntMeetRequirements(pokemon, move, options={}){
	let pure = options.pure ?? false
	let moveIndex = pokemon.moves.indexOf(move)
	let req = pokemon.data.learnset.find(m => m.name === move.name).unlock
	if (!req) return "This move doesn't require anything. Why can't you use it? Man, Boo sucks at programming."
	if (req.type === "level"){
		if (pokemon.level < req.amount || pure){
			let text = getLocaleString("pokemon-move-requirement-level", lang)
			text = applyReplacements(text, [req.amount])
			return text
		} else {
			let text = getLocaleString("pokemon-move-requirement-level-error", lang)
			return text
		}
	}
	else if (req.type === "pre-evolve"){
		return "A less evolved version of this pokemon could've learned this move."
	}
	else if (req.type === "never"){
		return "Your Pokemon should NEVER be able to use this move. Why is this message even showing? You should tell Boo about this."
	}
	else if (req.type === "hidden"){
		return "Your Pokemon should NEVER be able to use this move. You shouldn't even be able to see this one?? It's listed as hidden. Why can you see this?? Go yell at Boo. (Preferably with screenshots)"
	}
	console.warn("You never handled this", req)
	return "I don't know why they can't use this move. *shrug*"
}
function getReasonPokemonDoesntMeetEvolutionRequirements(pokemon, evolveData, options={}){
	let pure = options.pure ?? false
	let req = evolveData.unlock
	let evolveName = evolveData.name
	if (!req) return "This evolution doesn't require anything. Why can't you use it? Man, Boo sucks at programming."
	if (req.type === "level"){
		let text = getLocaleString("level", lang, ["evolution-requirements"])
		text = applyReplacements(text, [req.amount, evolveName])
		return text
	}
	if (req.type === "friendship"){
		let text = getLocaleString("friendship", lang, ["evolution-requirements"])
		text = applyReplacements(text, [req.amount, evolveName])
		return text
	}
	if (req.type === "levelWithPartyMember"){
		let text = getLocaleString("levelWithPartyMember", lang, ["evolution-requirements"])
		let partyMember = req.partyMember
		let types = partyMember.types
		let typeText = types.map(t => getLocaleString(t, lang, ["types"])).join(" / ")
		text = applyReplacements(text, [req.amount, typeText, evolveName])
		return text
	}
	if (req.type === "levelWhileTime"){
		let text = getLocaleString(req.time, lang, ["evolution-requirements", "levelWhileTime"])
		text = applyReplacements(text, [req.amount, evolveName])
		return text
	}
	let simpleTriggers = {
		"fiveMatchRed": [
			"five-match-red",
			"five-match-red-plural",
		],
		"fiveMatchOrange": [
			"five-match-orange",
			"five-match-orange-plural",
		],
		"fiveMatchYellow": [
			"five-match-yellow",
			"five-match-yellow-plural",
		],
		"fiveMatchGreen": [
			"five-match-green",
			"five-match-green-plural",
		],
		"fiveMatchBlue": [
			"five-match-blue",
			"five-match-blue-plural",
		],
		"fiveMatchPurple": [
			"five-match-purple",
			"five-match-purple-plural",
		],
		"fourMatchRed": [
			"four-match-red",
			"four-match-red-plural",
		],
		"fourMatchOrange": [
			"four-match-orange",
			"four-match-orange-plural",
		],
		"fourMatchYellow": [
			"four-match-yellow",
			"four-match-yellow-plural",
		],
		"fourMatchGreen": [
			"four-match-green",
			"four-match-green-plural",
		],
		"fourMatchBlue": [
			"four-match-blue",
			"four-match-blue-plural",
		],
		"fourMatchPurple": [
			"four-match-purple",
			"four-match-purple-plural",
		],
	}
	if (req.type in simpleTriggers){
		let localeKeys = simpleTriggers[req.type]
		let localeId = req.amount !== 1 ? localeKeys[1] : localeKeys[0]
		let text = getLocaleString(localeId, lang, ["evolution-requirements"])
		text = applyReplacements(text, [req.amount, evolveName])
		let alreadyHave = pokemon.evolutionTriggerData[req.type]
		text += ` (${alreadyHave} / ${req.amount})`
		return text
	}
	console.warn("You never handled this", req)
	return getLocaleString("default", lang, ["evolution-requirements"])
}

function getEffectParams(effect, effectIndex, moveUseObj){
	let obj = {}
	for (let key in effect){
		if (typeof effect[key] === "number"){
			let index = effect[key]
			if (index < 0) index = effectIndex + index
			if (moveUseObj.info[index] !== undefined){
				obj[key] = moveUseObj.info[index]
			}
		}
	}
	return obj
}

function getAllStatusSprites(){
	let arr = []
	for (let id in tileStatusData){
		let status = tileStatusData[id]
		if (status.url){
			arr.push({
				name: "status-"+id,
				url: status.url
			})
		}
	}
	return arr
}
function loadStatusSprite(statusData){
	let promises = []
	if (statusData.url){
		let spriteName = "status-"+statusData.id
		let p = loadSprite(spriteName, statusData.url)
		promises.push(p)
	}
	if (statusData.hasSpriteSheet){
		let p = download(statusData.spriteSheetJsonUrl, "json")
		promises.push(p)
		p.then(obj => {
			statusData.spriteSheetData = obj
		})
	}

	return Promise.all(promises)
}

function isPokemonUsable(pokemon){
	return pokemon.hp > 0 && !pokemon.fainted
}
function getUsablePokemon(pokemonList){
	return pokemonList.filter(isPokemonUsable)
}