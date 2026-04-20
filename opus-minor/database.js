import { CampaignProgress, CAMPAIGNS, EventProgress } from "./campaigns"
import { SCENARIOS } from "./scenarios"
import { categoryVolumes } from "./sounds"

const dbName = "opus-minor"
const dbVersion = 1
let db

const dbStores = [
	{
		name: "save-file",
		options: {autoIncrement: true},
		indexes: [
			{
				name: "uuid",
				path: "uuid",
				options: { unique: true }
			}
		]
	},
	{
		name: "solutions",
		options: { autoIncrement: true },
		indexes: [
			{
				name: "uuid",
				path: "uuid",
				options: { unique: true }
			},
			{
				name: "saveUUID",
				path: "saveUUID",
			},
			{
				name: "scenarioId",
				path: "scenarioId",
			},
		]
	},
]

export function doesSaveMeetCriteria(saveFile, campaignId, condition){
	let progress = saveFile.campaignsProgress[campaignId]
	switch (condition.type){
		case "completed":
		let eventId = condition.eventId
		let hasCompleted = progress.events[eventId].completed
		return hasCompleted
		case "and":
		let conditions = condition.conditions
		let conditionMet = conditions.every(condition => {
			return doesSaveMeetCriteria(saveFile, campaignId, condition)
		})
		return conditionMet
		case "never":
		return false
	}
	return false
}

async function createObjectStore(store){
	if (!store.options) store.options = {}
	if (!store.indexes) store.indexes = []
	
	if (!db.objectStoreNames.contains(store.name)){
		const objStore = db.createObjectStore(store.name, store.options)
		for (let index of store.indexes){
			await objStore.createIndex(index.name, index.path, index.options)
		}
	}
}

export async function openDatabase(){
	let resolvePromise
	let promise = new Promise(resolve => {
		resolvePromise = resolve
	})
	const dbRequest = indexedDB.open(dbName, dbVersion)

	dbRequest.onupgradeneeded = async (event) => {
		db = event.target.result
		let txn = event.target.transaction

		for (let store of dbStores){
			await createObjectStore(store)
		}
		for (let store of dbStores){
			const dbStore = txn.objectStore(store.name)
			for (let index of store.indexes){
				console.log(store, index.name)
				console.log(dbStore.indexNames)
				if (!dbStore.indexNames.contains(index.name)){
					//Create that index
					await dbStore.createIndex(index.name, index.path, index.options)
				}
			}
		}
	}
	
	dbRequest.onsuccess = event => {
		db = event.target.result
		resolvePromise()
	}
	return promise
}

export class SaveFile {
	constructor(name){
		this.name = name
		this.uuid = self.crypto.randomUUID()
		this.settings = {}
		this.settings.sounds = {}
		for (let categoryName in categoryVolumes){
			this.settings.sounds[categoryName] = categoryVolumes[categoryName]
		}
		this.campaignsProgress = {}
		this.lastOpenCampaignId = null
		this.lastOpenChapterIndex = null
		this.lastOpenDate = new Date()
	}
	initializeCampaigns(){
		let progresses = this.campaignsProgress
		for (let campaignId in CAMPAIGNS){
			let campaign = CAMPAIGNS[campaignId]
			if (!(campaignId in progresses)){
				let progress = new CampaignProgress(campaign)
				progresses[campaignId] = progress
			}
			let base = new CampaignProgress(campaign)
			let campaignProgress = progresses[campaignId]

			if (!("chapters" in campaignProgress)){
				campaignProgress.chapters = base.chapters
			}

			//Attach a new progress tracker to any events that didn't exist last time the game loaded.
			for (let chapter of campaign.chapters){
				let chapterId = chapter.id
				if (!(chapterId in campaignProgress.chapters)){
					campaignProgress.chapters[chapterId] = base.chapters[chapterId]
				}

				for (let event of chapter.events){
					let id = event.id
					if (!(id in campaignProgress.events)){
						let progress = new EventProgress(event.id, false, false)
						campaignProgress.events[id] = progress
					}
				}
			}
		}
	}
	getNewCampaignUnlocks(campaignId){
		let campaign = CAMPAIGNS[campaignId]
		let progress = this.campaignsProgress[campaignId]
		let result = {}
		let events = []
		result.events = events
		let unlockedChapters = []
		result.chapters = unlockedChapters

		for (let chapter of campaign.chapters){
			let chapterId = chapter.id
			if (!progress.chapters[chapterId].unlocked){
				let unlock = chapter.unlock
				let metCondition = true
				if (unlock){
					metCondition = doesSaveMeetCriteria(this, campaignId, unlock)
				}
				if (metCondition){
					result.chapters.push(chapterId)
				}
			}

			for (let event of chapter.events){
				let id = event.id
				if (progress.events[id].unlocked) continue
				if (!event.info.unlock){
					result.events.push(id)
					continue
				}
				let unlock = event.info.unlock
				let metCondition = doesSaveMeetCriteria(this, campaignId, unlock)
				if (metCondition){
					result.events.push(id)
					continue
				}
			}
		}
		return result
	}
	toStore(){
		let obj = {
			name: this.name,
			uuid: this.uuid,
			settings: this.settings,
			campaignsProgress: this.campaignsProgress,
			lastOpenCampaignId: this.lastOpenCampaignId,
			lastOpenChapterIndex: this.lastOpenChapterIndex,
			lastOpenDate: this.lastOpenDate
		}
		return obj
	}
	static fromStore(store){
		let save = new SaveFile(store.name)
		save.uuid = store.uuid
		save.settings = store.settings ?? save.settings
		save.campaignsProgress = store.campaignsProgress ?? save.campaignsProgress
		save.lastOpenCampaignId = store.lastOpenCampaignId ?? save.lastOpenCampaignId
		save.lastOpenChapterIndex = store.lastOpenChapterIndex ?? save.lastOpenChapterIndex
		save.lastOpenDate = store.lastOpenDate ?? save.lastOpenDate
		return save
	}
}

export async function getSaveFiles(){
	let resolve
	let promise = new Promise(res => resolve = res)
	const transaction = db.transaction(["save-file"], "readonly")
	const saveFileStore = transaction.objectStore("save-file")
	const request = await saveFileStore.getAll() 
	request.onsuccess = () => resolve()
	await promise
	return request.result.map(val => SaveFile.fromStore(val))
}
export async function getSaveFile(uuid){
	let resolve
	let promise = new Promise(res => resolve = res)
	const transaction = db.transaction(["save-file"], "readonly")
	const saveFileStore = transaction.objectStore("save-file")
	const key = IDBKeyRange.only(uuid)
	const index = saveFileStore.index("uuid")
	const request = index.openCursor(key)
	let cursor
	let result
	let primaryKey
	request.onsuccess = async event => {
		cursor = event.target.result
		if (cursor){
			let val = cursor.value
			result = val
			primaryKey = cursor.primaryKey
		}
		resolve()
	}
	await promise
	return [primaryKey, result]
}

export async function createSaveFile(name){
	let resolve
	let promise = new Promise(res => resolve = res)
	const saveFile = new SaveFile(name)
	const transaction = db.transaction(["save-file"], "readwrite")
	const saveFileStore = transaction.objectStore("save-file")
	const request = saveFileStore.put(saveFile.toStore())
	request.onsuccess = () => resolve()
	await promise
	return saveFile
}
export async function saveSaveFile(saveFile){
	let resolve
	let promise = new Promise(res => resolve = res)
	let [primaryKey, record] = await getSaveFile(saveFile.uuid)
	const transaction = db.transaction(["save-file"], "readwrite")
	const saveFileStore = transaction.objectStore("save-file")
	const request = saveFileStore.put(saveFile.toStore(), primaryKey)
	request.onsuccess = () => resolve()
	request.onerror = (e) => {
		console.log(request.error)
	}
	await promise
	return saveFile
}

export class SolutionSave {
	constructor(scenario, saveUUID){
		this.uuid = self.crypto.randomUUID()
		this.saveUUID = saveUUID
		this.version = version
		this.scenarioId = scenario.id
		this.verified = false
		this.name = "New Solution"
		this.solutionArea = 0
		this.solutionCost = 0
		this.solutionCycle = 0
		this.solutionInstructionCount = 0
		this.components = []
		this.programs = []
	}
	clone(){
		let scenario = SCENARIOS[this.scenarioId]
		let clone = new SolutionSave(scenario, this.saveUUID)
		let uuid = clone.uuid
		for (let key in this){
			clone[key] = JSON.parse(JSON.stringify(this[key]))
		}
		clone.uuid = uuid
		return clone
	}
	toStore(){
		let obj = {
			uuid: this.uuid,
			saveUUID: this.saveUUID,
			version: this.version,
			scenarioId: this.scenarioId,
			verified: this.verified,
			name: this.name,
			solutionArea: this.solutionArea,
			solutionCost: this.solutionCost,
			solutionCycle: this.solutionCycle,
			solutionInstructionCount: this.solutionInstructionCount,
			components: this.components,
			programs: this.programs
		}
		return obj
	}
	static fromStore(store){
		if (!store.saveUUID) {
			throw new Error("The data is missing a save it belongs to.")
		}
		if (!store.scenarioId) {
			throw new Error("The data is missing a scenario.")
		}
		let scenario = SCENARIOS[store.scenarioId]
		if (!scenario){
			throw new Error("Can't find scenario: "+store.scenarioId)
		}
		let solution = new SolutionSave(scenario, store.saveUUID)
		solution.uuid = store.uuid
		solution.version = store.version
		solution.scenarioId = store.scenarioId
		solution.name = store.name
		solution.verified = store.verified
		solution.solutionArea = store.solutionArea
		solution.solutionCost = store.solutionCost
		solution.solutionCycle = store.solutionCycle
		solution.solutionInstructionCount = store.solutionInstructionCount
		solution.components = store.components
		solution.programs = store.programs
		return solution
	}
}

export async function getSolutions(scenario, saveUUID=null){
	let resolve
	let promise = new Promise(res => resolve = res)
	const scenarioId = scenario.id
	const transaction = db.transaction(["solutions"], "readonly")
	const solutionsStore = transaction.objectStore("solutions")
	const key = IDBKeyRange.only(scenarioId)
	const index = solutionsStore.index("scenarioId")
	const request = index.openCursor(key)
	let cursor
	let result = []
	request.onsuccess = async event => {
		cursor = event.target.result
		if (cursor){
			let val = cursor.value
			let solution = SolutionSave.fromStore(val)
			result.push(solution)
			cursor.continue()
		} else {
			resolve(result)
		}
	}
	await promise
	if (saveUUID){
		result = result.filter(solutionSave => solutionSave.saveUUID === saveUUID)
	}
	return result
}
export async function getSolution(uuid){
	let resolve
	let promise = new Promise(res => resolve = res)
	const transaction = db.transaction(["solutions"], "readonly")
	const solutionsStore = transaction.objectStore("solutions")
	const key = IDBKeyRange.only(uuid)
	const index = solutionsStore.index("uuid")
	const request = index.openCursor(key)
	let cursor
	let result
	let primaryKey
	request.onsuccess = async event => {
		cursor = event.target.result
		if (cursor){
			let val = cursor.value
			result = val
			primaryKey = cursor.primaryKey
		}
		resolve()
	}
	await promise
	return [primaryKey, result]
}

export async function createSolution(scenario, saveUUID){
	let resolve
	let promise = new Promise(res => resolve = res)
	const solution = new SolutionSave(scenario, saveUUID)
	const transaction = db.transaction(["solutions"], "readwrite")
	const solutionsStore = transaction.objectStore("solutions")
	const request = solutionsStore.put(solution.toStore())
	request.onsuccess = () => resolve()
	await promise
	return solution
}
export async function deleteSolution(solution){
	let resolve
	let promise = new Promise(res => resolve = res)
	const transaction = db.transaction(["solutions"], "readwrite")
	const solutionsStore = transaction.objectStore("solutions")
	const range = IDBKeyRange.only(solution.scenarioId)
	const index = solutionsStore.index("scenarioId")
	const request = index.getKey(range)
	request.onsuccess = e => {
		let primaryKey = e.target.result
		solutionsStore.delete(primaryKey)
		resolve()
	}
	await promise
	return solution
}

export async function saveSolution(solution){
	let resolve
	let promise = new Promise(res => resolve = res)
	let [primaryKey, record] = await getSolution(solution.uuid)
	const transaction = db.transaction(["solutions"], "readwrite")
	const solutionsStore = transaction.objectStore("solutions")
	const request = solutionsStore.put(solution.toStore(), primaryKey)
	request.onsuccess = () => resolve()
	request.onerror = (e) => {
		console.log(request.error)
	}
	await promise
	return solution
}