const dbName = "pokemon-puzzle-quest"
let db

function openDatabase(){
	let promise = new Promise(resolve => {
		const dbRequest = indexedDB.open(dbName, 2) 

		dbRequest.onupgradeneeded = (event) => {
			db = event.target.result
			const saveFileStore = db.createObjectStore("save-file", {autoIncrement: true})

			const pokemonStore = db.createObjectStore("pokemon", {autoIncrement: true})
			pokemonStore.createIndex("uuid", ["uuid"], {unique: true})
			pokemonStore.createIndex("owner", ["owner"], {unique: false})
			pokemonStore.createIndex("pc-box", ["pcBox"], {unique: false})

			const levelStore = db.createObjectStore("levels", {autoIncrement: true})
			levelStore.createIndex("save-file", ["saveFile"], {unique: false})

			const boxStore = db.createObjectStore("boxes", {autoIncrement: true})
			boxStore.createIndex("owner", ["owner"], {unique: false})
		}
		
		dbRequest.onsuccess = event => {
			db = event.target.result
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
			console.log(result)
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
		obj.level = pokemon.level
		obj.exp = pokemon.exp
		obj.ivs = pokemon.ivs
		obj.evs = pokemon.evs
		obj.nature = pokemon.nature
		obj.activeSlot = playerActivePokemon.indexOf(pokemon)
		obj.activeMoves = pokemon.activeMoves.map(move => move.name)
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
	let promise = new Promise(resolve => {
		const transaction = db.transaction(["save-file"], "readonly")
		const saveFileStore = transaction.objectStore("save-file")
		const request = saveFileStore.getAll()
		
		request.onsuccess = event => {
			let result = event.target.result
			resolve(result)
		}
	})
	return promise
}

function makeNewSaveFile(){
	let promise = new Promise(resolve => {
		let uuid = window.crypto.randomUUID()
		const transaction = db.transaction(["save-file"], "readwrite")
		const saveFileStore = transaction.objectStore("save-file")
		const request = saveFileStore.put({uuid: uuid})
		request.onsuccess = event => {
			makeNewBox(uuid, "Box 1")
			.then(() => resolve(uuid))
		}
	})
	return promise
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