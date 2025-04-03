const dbName = "pokemon-puzzle-quest"
const dbVersion = 3
let db
let saveFileCount = -1

const dbStores = [
	{
		name: "save-file",
		options: {autoIncrement: true},
		indexes: [
			{
				name: "uuid",
				path: ["uuid"],
				options: { unique: true }
			}
		]
	},
	{
		name: "pokemon",
		options: { autoIncrement: true },
		indexes: [
			{
				name: "uuid",
				path: ["uuid"],
				options: { unique: true }
			},
			{
				name: "owner",
				path: ["owner"],
				options: { unique: false }
			},
			{
				name: "pc-box",
				path: ["pcBox"],
				options: { unique: false }
			}
		]
	},
	{
		name: "levels",
		options: { autoIncrement: true },
		indexes: [
			{
				name: "uuid",
				path: ["uuid"],
				options: { unique: true }
			},
			{
				name: "save-file",
				path: ["saveFile"],
				options: { unique: false }
			}
		]
	},
	{
		name: "boxes",
		options: { autoIncrement: true },
		indexes: [
			{
				name: "uuid",
				path: ["uuid"],
				options: { unique: true }
			},
			{
				name: "owner",
				path: ["owner"],
				options: { unique: false }
			}
		]
	}
]

function createObjectStore(store){
	if (!store.options) store.options = {}
	if (!store.indexes) store.indexes = []

	let promise = new Promise(resolve => {
		if (!db.objectStoreNames.contains(store.name)){
			const objStore = db.createObjectStore(store.name, store.options)
			for (let index of store.indexes){
				objStore.createIndex(index.name, index.path, index.options)
			}
			resolve()
		} else {
			resolve()
		}
	})
	return promise
}

function openDatabase(){
	let promise = new Promise(resolve => {
		const dbRequest = indexedDB.open(dbName, dbVersion)

		dbRequest.onupgradeneeded = (event) => {
			db = event.target.result
			let txn = event.target.transaction

			let promises = []
			for (let store of dbStores){
				let p = createObjectStore(store)
				promises.push(p)
			}
			let promise = Promise.all(promises)
			.then(() => {
				let promises = []
				for (let store of dbStores){
					let p = new Promise(resolve => {
						const dbStore = txn.objectStore(store.name)
						for (let index of store.indexes){
							console.log(store, index.name)
							console.log(dbStore.indexNames)
							if (!dbStore.indexNames.contains(index.name)){
								//Create that index
								dbStore.createIndex(index.name, index.path, index.options)
							}
						}
						resolve()
					})
					promises.push(p)
				}
				return Promise.all(promises)
			})
			return promise
		}
		
		dbRequest.onsuccess = event => {
			db = event.target.result

			//Now check that all stores have the correct indexes
			

			// Promise.all(promises).then(resolve)
			resolve()
		}
	})
	return promise
}


function doesSaveDataExist(){
	let promise = new Promise((resolve, reject) => {
		const transaction = db.transaction(["save-file"], "readwrite")
		const saveFileStore = transaction.objectStore("save-file")
		const request = saveFileStore.getAll()
		request.onsuccess = event => {
			let result = event.target.result
			if (result.length){
				resolve(true)
			} else {
				resolve(false)
			}
		}
		request.onerror = event => {
			resolve(false)
		}
	})
	return promise
}

function getSaveDataObj(info){
	return {
		name: playerName,
		uuid: playerSaveId,
		settings: config,
		data: info
	}
}
function savePlayerInfo(data){
	data = data ?? getSaveDataObj(playerSaveInfo)
	let uuid = data.uuid
	return new Promise(resolve => {
		findSaveFilePrimaryKey(uuid)
		.then(result => {
			const transaction = db.transaction(["save-file"], "readwrite")
			const saveStore = transaction.objectStore("save-file")
			
			let request
			if (result !== null){
				request = saveStore.put(data, result)
			} else {
				request = saveStore.put(data)
			}
			request.onsuccess = event => {
				resolve()
			}
		})
	})
}
function getPokemonSaveObj(pokemon){
	//This guy is gonna find the pokemon if it exists
	//Pokemon by themselves contain a lot of information unnecessary to store.
	//This object contains only the important stuff
	let obj = {}
	obj.uuid = pokemon.uuid
	obj.owner = pokemon.owner
	obj.name = pokemon.name
	obj.pokemonName = pokemon.pokemonName
	obj.pokemonId = pokemon.pokemonId
	obj.hp = pokemon.hp
	obj.level = pokemon.level
	obj.exp = pokemon.exp
	obj.ivs = pokemon.ivs
	obj.evs = pokemon.evs
	obj.nature = pokemon.nature
	obj.activeSlot = playerActivePokemon.indexOf(pokemon)
	obj.activeMoves = pokemon.activeMoves.map(move => move.name)
	obj.movesUnlocked = pokemon.movesUnlockedMap.map((v, i) => {
		return v ? pokemon.moves[i].name : null
	}).filter(v => v)
	obj.ability = pokemon.ability.id
	if (obj.ability === "No Ability"){
		delete obj.ability
	}
	obj.pcBox = pokemon.pcBox
	obj.pcBoxX = pokemon.pcBoxX
	obj.pcBoxY = pokemon.pcBoxY
	return obj
}
function savePokemonObj(data){
	return new Promise(resolve => {
		findPokemonById(data.uuid)
		.then(result => {
			const transaction = db.transaction(["pokemon"], "readwrite")
			const pokemonStore = transaction.objectStore("pokemon")
			
			let request
			if (result !== null){
				request = pokemonStore.put(data, result)
			} else {
				request = pokemonStore.put(data)
			}
			request.onsuccess = event => {
				resolve()
			}
		})
	})
}
function savePokemon(pokemon){
	let data = getPokemonSaveObj(pokemon)
	return savePokemonObj(data)
}

function findSaveFilePrimaryKey(uuid){
	let promise = new Promise(resolve => {
		const transaction = db.transaction(["save-file"], "readonly")
		const saveFileStore = transaction.objectStore("save-file")
		const index = saveFileStore.index("uuid")
		const cursor = index.openCursor()
		
		cursor.onsuccess = event => {
			const cur = event.target.result
			if (cur){
				if (cur.value.uuid === uuid){
					resolve(cur.primaryKey)
				}
				cur.continue()
			} else {
				resolve(null)
			}
		}
	})
	return promise
}
function findSaveFileInDatabase(uuid){
	let promise = new Promise(resolve => {
		const transaction = db.transaction(["save-file"], "readonly")
		const saveFileStore = transaction.objectStore("save-file")
		const index = saveFileStore.index("uuid")
		const cursor = index.openCursor()
		
		cursor.onsuccess = event => {
			const cur = event.target.result
			if (cur){
				if (cur.value.uuid === uuid){
					resolve(cur.value)
				}
				cur.continue()
			} else {
				resolve(null)
			}
		}
	})
	return promise
}
function findPokemonInDatabase(pokemon){
	return findPokemonById(pokemon.uuid)
}
function findPokemonById(uuid){
	return new Promise(resolve => {
		const transaction = db.transaction(["pokemon"], "readonly")
		const pokemonStore = transaction.objectStore("pokemon")
		const index = pokemonStore.index("uuid")
		const cursor = index.openCursor()
		
		cursor.onsuccess = event => {
			const cur = event.target.result
			if (cur){
				if (cur.value.uuid === uuid){
					resolve(cur.primaryKey)
				}
				cur.continue()
			} else {
				resolve(null)
			}
		}
	})
}

function getPlayerPokemon(saveId){
	let promise = new Promise(resolve => {
		const transaction = db.transaction(["pokemon"], "readonly")
		const pokemonStore = transaction.objectStore("pokemon")
		const saveIndex = pokemonStore.index("owner")
		const request = saveIndex.getAll([saveId])
		
		request.onsuccess = event => {
			let result = event.target.result
			resolve(result)
		}
	})
	return promise
}
function loadPlayerPokemon(dataList){
	return new Promise(resolve => {
		let pokemonMinimumCaughtTotal = 0
		let pokemonMinimumCaught = {}
		for (let pokemonId in pokemonData){
			pokemonMinimumCaught[pokemonId] = 0
			pokemonMinimumCaughtTotal++
		}

		dataList.forEach(obj => {
			// console.log(obj)
			let pokemon = new Pokemon(obj.name, obj.pokemonId, obj)
			//JUST IN CASE we try and load an otherwise illegal pokemon
			if (obj.pokemonId in pokemonData){
				pokemonMinimumCaught[obj.pokemonId]++
				caughtPokemon.push(pokemon)

				if (obj.activeSlot !== -1){
					playerActivePokemon[obj.activeSlot] = pokemon
				}
			}
		})

		//Set the player's caught stats to the minimum they could be
		//from the data we have.
		let pokemonStats = playerSaveInfo["pokemon-caught-stats"]
		for (let pokemonId in pokemonMinimumCaught){
			let stats = pokemonStats[pokemonId]
			let minimum = pokemonMinimumCaught[pokemonId]
			if (stats.caught < minimum){
				stats.caught = minimum
			}
		}
		let totalCaught = playerSaveInfo["total-pokemon-caught"]
		if (totalCaught < pokemonMinimumCaughtTotal){
			playerSaveInfo["total-pokemon-caught"] = pokemonMinimumCaughtTotal
		}

		//If this leaves empty slots in the player's party, remove them.
		removeEmptySlots(playerActivePokemon)

		resolve()
	})
}

function getPlayerLevelData(saveId){
	let promise = new Promise(resolve => {
		const transaction = db.transaction(["levels"], "readonly")
		const levelStore = transaction.objectStore("levels")
		const saveIndex = levelStore.index("save-file")
		const request = saveIndex.getAll([saveId])
		
		request.onsuccess = event => {
			let result = event.target.result
			resolve(result)
		}
	})
	return promise
}

function findPreviousSaveData(){
	saveFileCount = 0
	let promise = new Promise(resolve => {
		const transaction = db.transaction(["save-file"], "readonly")
		const saveFileStore = transaction.objectStore("save-file")
		const request = saveFileStore.getAll()
		
		request.onsuccess = event => {
			let result = event.target.result
			saveFileCount = result.length
			resolve(result)
		}
	})
	return promise
}

function deleteSaveFile(uuid){
	let promise = new Promise(resolve => {
		const transaction = db.transaction(["save-file"], "readwrite")
		const saveFileStore = transaction.objectStore("save-file")
		const index = saveFileStore.index("uuid")
		const cursor = index.openCursor()
		
		cursor.onsuccess = event => {
			const cur = event.target.result
			if (cur){
				if (cur.value.uuid === uuid){
					saveFileStore.delete(cur.primaryKey)
					resolve(true)
				}
				cur.continue()
			} else {
				resolve(false)
			}
		}
	})
	return promise
}

function makeNewSaveFile(){
	let promise = Promise.resolve()
	let chosenName
	promise = promise.then(() => askToNameSave())
	.then(name => {
		chosenName = name
		playerName = name || undefined
	})
	.then(() => new Promise(resolve => {
		const transaction = db.transaction(["save-file"], "readwrite")
		const saveFileStore = transaction.objectStore("save-file")

		const uuid = window.crypto.randomUUID()
		const saveData = newPlayerSaveData()
		const request = saveFileStore.put({
			name: chosenName,
			uuid: uuid,
			settings: config,
			data: getSaveDataObj(saveData)
		})
		request.onsuccess = event => {
			makeNewBox(uuid, "Box 1")
			.then(() => resolve(uuid))
		}
	}))
	
	return promise
}
function askToNameSave(){
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)
	let modal = $("#modal")

	clearModal(modal)

	modal.find(".modal-header").addClass("justify-content-center")
	modal.find(".modal-title").append("<h2>Enter your name:</h2>")
	let body = modal.find(".modal-body")
	let innerStuff = $(`<div class='container d-flex justify-content-center'></div>`)
	innerStuff.append(`<input type='text' class='text-center'
		required placeholder='Save File Name' style='font-size: 1.5em;'>`)
	body.append(innerStuff)

	modal.find(".modal-footer").addClass("justify-content-center")
	.append("<button class='btn btn-primary confirm'>Submit</button>")

	let result
	modal.find(".btn.confirm").click(() => {
		modal.modal("hide")
	})

	modal.on("hidden.bs.modal", () => {
		result = body.find("input").val()
		result = result.trim()
		result = result || (saveFileCount + 1)
		resolvePromise(result)
	})

	modal.modal("show")
	return promise
}
function newPlayerSaveData(){
	let data = {}
	data["total-pokemon-caught"] = 0
	data["pokemon-caught-stats"] = {}
	data["unlocked-pokedex"] = false
	return data
}
function normalizeSave(saveInfo){
	let oldData = newPlayerSaveData()
	Object.keys(saveInfo).forEach(key => oldData[key] = saveInfo[key])
	Object.keys(oldData).forEach(key => saveInfo[key] = oldData[key])

	//Fill pokemon stats
	let pokemonStats = saveInfo["pokemon-caught-stats"]
	for (let pokemonId in pokemonData){
		let stats = {}
		let oldValue = pokemonStats[pokemonId] ?? {}
		pokemonStats[pokemonId] = stats
		stats["caught"] = oldValue["caught"] ?? 0
		stats["seen"] = oldValue["seen"] ?? 0
	}

	let starter = saveInfo["chosen-starter"]
	if (starter && pokemonStats[starter].caught === 0){
		pokemonStats[starter].caught++
	}
}
function logPokemonAs(reason, pokemon){
	let pokemonStats = playerSaveInfo["pokemon-caught-stats"]
	let pokemonId = pokemon.data.id
	if (pokemonId in pokemonStats){
		let stats = pokemonStats[pokemonId]
		stats[reason] = stats[reason] ?? 0
		stats[reason]++
	}
}

function makeNewBox(saveId, name){
	let promise = new Promise(resolve => {
		let uuid = window.crypto.randomUUID()
		const transaction = db.transaction(["boxes"], "readwrite")
		const boxStore = transaction.objectStore("boxes")
		let box = {
			name: name,
			uuid: uuid,
			owner: saveId,
			theme: "forest_frlg"
		}
		const request = boxStore.put(box)
		request.onsuccess = event => {
			resolve(uuid)
		}
	})
	return promise
}
function findBoxById(uuid){
	return new Promise(resolve => {
		const transaction = db.transaction(["boxes"], "readonly")
		const boxStore = transaction.objectStore("boxes")
		const index = boxStore.index("uuid")
		const cursor = index.openCursor()
		
		cursor.onsuccess = event => {
			const cur = event.target.result
			if (cur){
				if (cur.value.uuid === uuid){
					resolve(cur.primaryKey)
				}
				cur.continue()
			} else {
				resolve(null)
			}
		}
	})
}
function saveBoxObj(data){
	return new Promise(resolve => {
		findBoxById(data.uuid)
		.then(result => {
			const transaction = db.transaction(["boxes"], "readwrite")
			const boxStore = transaction.objectStore("boxes")
			
			let request
			if (result !== null){
				request = boxStore.put(data, result)
			} else {
				request = boxStore.put(data)
			}
			request.onsuccess = event => {
				resolve()
			}
		})
	})
}
function getPlayerBoxes(saveId){
	let promise = new Promise(resolve => {
		const transaction = db.transaction(["boxes"], "readonly")
		const boxStore = transaction.objectStore("boxes")
		const saveIndex = boxStore.index("owner")
		const request = saveIndex.getAll([saveId])
		
		request.onsuccess = event => {
			let result = event.target.result
			resolve(result)
		}
	})
	return promise
}
function getPokemonFromBox(boxId){
	let promise = new Promise(resolve => {
		const transaction = db.transaction(["pokemon"], "readonly")
		const pokemonStore = transaction.objectStore("pokemon")
		const pcBoxIndex = pokemonStore.index("pc-box")
		const request = pcBoxIndex.getAll([boxId])
		
		request.onsuccess = event => {
			let result = event.target.result
			resolve(result)
		}
	})
	return promise
}

function findLevelInDatabase(level, saveId){
	let promise = new Promise(resolve => {
		const transaction = db.transaction(["levels"], "readonly")
		const levelStore = transaction.objectStore("levels")
		const index = levelStore.index("save-file")
		const cursor = index.openCursor()
		
		cursor.onsuccess = event => {
			const cur = event.target.result
			if (cur){
				let data = cur.value
				if (data.id === level.id && data.saveFile === saveId){
					resolve(cur.primaryKey)
				}
				cur.continue()
			} else {
				resolve(null)
			}
		}
	})
	return promise
}
function saveLevelStatus(level, status){
	let promise = new Promise(resolve => {
		let obj = {}
		obj.saveFile = playerSaveId
		obj.id = level.id
		obj.status = status

		return saveLevelObj(obj)
		.then(() => resolve())
	})
	return promise
}
function saveLevelObj(data){
	let level = getLevelDataById(data.id)
	let saveId = data.saveFile ?? playerSaveId
	
	let promise = new Promise(resolve => {
		findLevelInDatabase(level, saveId)
		.then(result => {
			const transaction = db.transaction(["levels"], "readwrite")
			const levelStore = transaction.objectStore("levels")

			let request
			if (result !== null){
				request = levelStore.put(data, result)
			} else {
				request = levelStore.put(data)
			}
			console.log(request)
			request.onsuccess = event => {
				console.log("Ding!")
				resolve()
			}
		})
	})
	return promise
}

function getSaveTransferString(saveId){
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)
	let result = {}
	savePlayerInfo()
	.then(() => findSaveFileInDatabase(saveId))
	.then(val => {
		result.saveFile = val
	})
	.then(() => getPlayerPokemon(saveId))
	.then(val => {
		result.pokemon = val
	})
	.then(() => getPlayerLevelData(saveId))
	.then(val => {
		result.levelData = val
	})
	.then(() => getPlayerBoxes(saveId))
	.then(val => {
		result.boxes = val
	})
	.then(() => {
		let str = JSON.stringify(result)
		let compressed = lzjs.compressToBase64(str)
		resolvePromise(compressed)
	})
	return promise
}
function transferSaveFromString(str){
	let uncompressed = lzjs.decompressFromBase64(str)
	let result = JSON.parse(uncompressed)
	let promise = Promise.resolve()

	if (!result.saveFile){
		alert("This data is missing a save file. How did that happen?")
		return promise
	}
	promise = promise.then(() => savePlayerInfo(result.saveFile))

	if (result.pokemon){
		for (let pokemonData of result.pokemon){
			promise = promise.then(() => savePokemonObj(pokemonData))
		}
	}
	if (result.boxes){
		for (let boxData of result.boxes){
			promise = promise.then(() => saveBoxObj(boxData))
		}
	}
	if (result.levelData){
		for (let levelObj of result.levelData){
			promise = promise.then(() => saveLevelObj(levelObj))
		}
	}

	return promise
}