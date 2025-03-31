const colors = ["red", "orange", "yellow", "green", "blue", "purple"]
const cssColors = {
	"energy-red": "#ff2f35",
	"energy-orange": "#e57526",
	"energy-yellow": "#e8aa00",
	"energy-green": "#82dc42",
	"energy-blue": "#00c0e7",
	"energy-purple": "#dd60dd"
}

const tileTypes = [
	"red",
	"orange",
	"yellow",
	"green",
	"blue",
	"purple",
	"black",
	"rainbow"
]

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

function randomAngle(deg1, deg2) {
	let result = (deg1 + Math.random() * (deg2 - deg1)) / 180 * Math.PI
	return result
}
function randomFrom(min, max) {
	let result = min + Math.random() * (max - min + 1)
	return Math.floor(result)
}

function formatNumber(f, digits=2) {
	let decimal = f % 1
	let off = Math.pow(10, -digits)
	if (f % 1 && decimal > off){
		return f.toFixed(digits)
	} else {
		return f.toString()
	}
}

function weightedRandom(items, weights) {
	if (items.length !== weights.length) {
		throw new Error('Items and weights must be of the same size');
	}

	if (!items.length) {
		throw new Error('Items must not be empty');
	}

	// Preparing the cumulative weights array.
	// For example:
	// - weights = [1, 4, 3]
	// - cumulativeWeights = [1, 5, 8]
	const cumulativeWeights = [];
	for (let i = 0; i < weights.length; i += 1) {
		cumulativeWeights[i] = weights[i] + (cumulativeWeights[i - 1] || 0);
	}

	// Getting the random number in a range of [0...sum(weights)]
	// For example:
	// - weights = [1, 4, 3]
	// - maxCumulativeWeight = 8
	// - range for the random number is [0...8]
	const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
	const randomNumber = maxCumulativeWeight * Math.random();

	// Picking the random item based on its weight.
	// The items with higher weight will be picked more often.
	for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
		if (cumulativeWeights[itemIndex] >= randomNumber) {
			return {
				item: items[itemIndex],
				index: itemIndex,
			};
		}
	}
}
function distance(x1, y1, x2, y2) {
	let dx = x2 - x1
	let dy = y2 - y1
	return Math.sqrt(dx * dx + dy * dy)
}
function noDuplicates(arr) {
	return arr.filter((v, i, s) => s.indexOf(v) === i)
}

function bezierEase(t) {
	// return [
	// 	Math.pow(1 - t, 3)*0 + 
	// 	3*Math.pow(1 - t, 2)*t*0.42 + 
	// 	3*(1 - t)*Math.pow(t,2)*0.58 + 
	// 	Math.pow(t, 3)*1,

	// 	Math.pow(1 - t, 3)*0 + 
	// 	3*Math.pow(1 - t, 2)*t*0 + 
	// 	3*(1 - t)*Math.pow(t,2)*1 + 
	// 	Math.pow(t, 3)*1,
	// ]
	let r = Math.pow(1 - t, 3) * 0 + 3 * Math.pow(1 - t, 2) * t * 0 + 3 * (1 - t) * Math.pow(t, 2) * 1 + Math.pow(t, 3) * 1
	return r
}
function interpolate(v1, v2, p) {
	return (1 - p) * v1 + p * v2
}
function lerp(a, b, t) {
	return a + (b - a) * t
}

function randomChoice(arr) {
	return arr[Math.floor(Math.random() * arr.length)]
}
//Note: Mutates the original array
function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}
function toShuffled(array) {
	let newArr = array.map(v => v)
	shuffleArray(newArr)
	return newArr
}
//Note: Mutates the original array
function removeEmptySlots(arr) {
	let emptyIndex = arr.findIndex(p => !p)
	while (emptyIndex !== -1) {
		arr.splice(emptyIndex, 1)
		emptyIndex = arr.findIndex(p => !p)
	}
	return arr
}
function getEmptyEnergy() {
	let t = {}
	colors.forEach(c => t[c] = 0)
	return t
}
function addEnergies(from, to) {
	let keys = Object.keys(from).concat(Object.keys(to))
	keys = noDuplicates(keys)
	let result = {}
	for (let key of keys) {
		result[key] = (to[key] || 0) + (from[key] || 0)
	}
	return result
}
function multiplyEnergies(energy, factor, round) {
	let keys = Object.keys(energy)
	let result = {}
	for (let key of keys) {
		result[key] = energy[key] * factor
		if (round === "up"){
			result[key] = Math.ceil(result[key])
		} else if (round === "down"){
			result[key] = Math.floor(result[key])
		} else if (round){
			result[key] = Math.round(result[key])
		}
	}
	return result
}

function applyReplacements(text, replacements){
	let replacementMatches = [...text.matchAll(/%[^%]+%/g)]
	for (let i in replacementMatches){
		let replaceCommand = replacementMatches[i]
		let command = replaceCommand[0]
		let commandType = command.substring(1, command.length - 1)
		
		if (commandType === "c"){
			text = text.replace(command, replacements[i])
		} else if (commandType === "c-pname"){
			let replace = getLocaleString("name", lang, ["pokemon", replacements[i]])
			text = text.replace(command, replace)
		}
	}
	return text
}

function getTileEnergyValue(type){
	if (type instanceof Tile){
		type = type.type
	}
	let energy = getEmptyEnergy()
	switch (type){
		case "red": energy.red += 1
		break
		case "orange": energy.orange += 1
		break
		case "yellow": energy.yellow += 1
		break
		case "green": energy.green += 1
		break
		case "blue": energy.blue += 1
		break
		case "purple": energy.purple += 1
		break
		case "black":
			energy.red += 1
			energy.purple += 1
		break
		case "rainbow":
		//Nothing happens
		break
		default:
			console.warn("You never said what ",type,"should do")
	}
	return energy
}

function getEmptyTileTypeTable(){
	let result = {}
	tileTypes.forEach(t => result[t] = 0)
	return result
}
function getMatchTypes(match){
	let result = getEmptyTileTypeTable()
	match.forEach(t => {
		//Log what kind of match this is.
		let type = t.type
		result[type] += 1 / match.length
	})
	return result
}

function fixLearnsets() {
	//Any pokemon with pre-evolved forms gain the learnset of those forms
	let allPokemon = Object.values(pokemonData)
	let evolvedForms = allPokemon.filter(pokemon => {
		return allPokemon.some(p => {
			return p.evolutions.some(evo => evo.name === pokemon.id)
		})
	})
	let failsafe = 0
	while (evolvedForms.length && failsafe < 100) {
		let changed = false
		for (let pokemon of evolvedForms) {
			//If this pokemon has a yet-unresolved pre-evolved form, skip this for now.
			let hasUnresolvedPreForm = evolvedForms.some(p => {
				return p.evolutions.some(evo => evo.name === pokemon.id)
			})
			if (hasUnresolvedPreForm) continue
			//Find all preForms of this pokemon
			let preForms = allPokemon.filter(p => {
				return p.evolutions.some(evo => evo.name === pokemon.id)
			})
			//This pokemon is capable of knowing any move that any of the preForms can learn
			let learnset = pokemon.learnset
			let moves = preForms.map(p => p.learnset).flat()
				//Remove moves this pokemon can already learn
				.filter(m => {
					return !learnset.some(m2 => m2.name === m.name)
				})
				//Remove duplicates
				.filter((v, i, s) => {
					return s.find(m => m.name === v.name) === v
				})
			//Add a copy of each to this Pokemon's learnset, but make it impossible to unlock
			moves.forEach(move => {
				let copy = {}
				Object.keys(move).forEach(key => copy[key] = move[key])
				copy.unlock = { type: "pre-evolve" }
				learnset.push(copy)
				changed = true
			})
			if (changed) {
				let index = evolvedForms.indexOf(pokemon)
				evolvedForms.splice(index, 1)
				break
			}
		}
		if (!changed) {
			failsafe++
		}
	}
	if (failsafe >= 100) {
		console.warn("Failed to fix some pokemon's learnsets")
	}

	//Then, make sure that all pokemon technically *can* use moves not in their learnset,
	//but this shouldn't ever happen (barring things like Metronome)
	let allMoves = Object.values(pokemonMoveData)
	for (let pokemon of allPokemon) {
		let learnset = pokemon.learnset
		for (let move of allMoves) {
			let name = move.name
			let canLearn = learnset.find(l => l.name === name)
			if (!canLearn) {
				let newMove = {
					name: name,
					unlock: {
						type: "hidden"
					}
				}
				learnset.push(newMove)
			}
		}
	}
}