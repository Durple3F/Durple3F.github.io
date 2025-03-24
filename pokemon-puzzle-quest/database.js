const dbName = "pokemon-puzzle-quest"
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
		const dbRequest = indexedDB.open(dbName, 1)

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
function savePlayerInfo(){
	return new Promise(resolve => {
		let info = getSaveDataObj(playerSaveInfo)
		findSaveFileInDatabase(playerSaveId)
		.then(result => {
			const transaction = db.transaction(["save-file"], "readwrite")
			const saveStore = transaction.objectStore("save-file")
			const request = saveStore.put(info, result)
			request.onsuccess = event => {
				resolve()
			}
		})
	})
}
function savePokemon(pokemon){
	let promise = new Promise(resolve => {
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
		obj.pcBox = pokemon.pcBox
		obj.pcBoxX = pokemon.pcBoxX
		obj.pcBoxY = pokemon.pcBoxY

		findPokemonInDatabase(pokemon)
		.then(result => {
			const transaction = db.transaction(["pokemon"], "readwrite")
			const pokemonStore = transaction.objectStore("pokemon")
			const request = pokemonStore.put(obj, result)
			request.onsuccess = event => {
				resolve()
			}
		})
	})
	return promise
}

function saveLevelStatus(level, status){
	let promise = new Promise(resolve => {
		//This guy is gonna find the pokemon if it exists
		//Pokemon by themselves contain a lot of information unnecessary to store.
		//This object contains only the important stuff
		let obj = {}
		obj.saveFile = playerSaveId
		obj.id = level.id
		obj.status = status

		findLevelInDatabase(level)
		.then(result => {
			const transaction = db.transaction(["levels"], "readwrite")
			const levelStore = transaction.objectStore("levels")
			const request = levelStore.put(obj, result)
			request.onsuccess = event => {
				resolve()
			}
		})
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
function findPokemonInDatabase(pokemon){
	let promise = new Promise(resolve => {
		const transaction = db.transaction(["pokemon"], "readonly")
		const pokemonStore = transaction.objectStore("pokemon")
		const index = pokemonStore.index("uuid")
		const cursor = index.openCursor()
		
		cursor.onsuccess = event => {
			const cur = event.target.result
			if (cur){
				if (cur.value.uuid === pokemon.uuid){
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
function findLevelInDatabase(level){
	let promise = new Promise(resolve => {
		const transaction = db.transaction(["levels"], "readonly")
		const pokemonStore = transaction.objectStore("levels")
		const index = pokemonStore.index("save-file")
		const cursor = index.openCursor()
		
		cursor.onsuccess = event => {
			const cur = event.target.result
			if (cur){
				if (cur.value.id === level.id){
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
		const uuid = window.crypto.randomUUID()
		const transaction = db.transaction(["save-file"], "readwrite")
		const saveFileStore = transaction.objectStore("save-file")
		const data = newPlayerSaveData()
		const request = saveFileStore.put({
			name: chosenName,
			uuid: uuid,
			settings: config,
			data: getSaveDataObj(data)
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
	return data
}

function makeNewBox(saveId, name){
	let promise = new Promise(resolve => {
		let uuid = window.crypto.randomUUID()
		const transaction = db.transaction(["boxes"], "readwrite")
		const saveFileStore = transaction.objectStore("boxes")
		let box = {
			name: name,
			uuid: uuid,
			owner: saveId,
			theme: "forest_frlg"
		}
		const request = saveFileStore.put(box)
		request.onsuccess = event => {
			resolve(uuid)
		}
	})
	return promise
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