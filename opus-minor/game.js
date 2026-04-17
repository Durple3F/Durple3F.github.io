import {Hex, Grid, Component, Atom, loadSprite, Molecule, Reagent, tagHierarchy, lerp, clamp, Product, createMolecule, Circle, find_angle, cross_product, Rectangle, fillScoreboard, clearModal} from "./util.js"
import { ArmMechanism, ARMTYPES } from "./arms.js"
import { SCENARIOS } from "./scenarios.js"
import { createInstructionTag, Instruction, INSTRUCTIONS } from "./instructions.js"
import { Glyph } from "./glyphs.js"
import { armSize, atomSize, msPerCycle, submissionsPerProduct } from "./config.js"
import { Track, TrackPiece } from "./track.js"
import { getLocaleString } from "./locale.js"
import { saveSolution } from "./database.js"
import { playSound } from "./sounds.js"

const min = Math.min
const max = Math.max
const abs = Math.abs
const sin = Math.sin
const cos = Math.cos
const ROOT3 = Math.sqrt(3)
const floor = Math.floor
const ceil = Math.ceil

export class Level{
	constructor(scenario){
		this.scenario = scenario
		this.grid = new Grid()
		this.timestep = 0
		this.programs = []
		this.submittedProductCounts = []
		this.usedProductCounts = []
		this.usedReagentCounts = []
		for (let i = 0; i < this.scenario.productMolecules.length; i++){
			let product = this.scenario.productMolecules[i]
			this.submittedProductCounts[i] = 0
			this.usedProductCounts[i] = 0
		}
		for (let i = 0; i < this.scenario.reagentMolecules.length; i++){
			this.usedReagentCounts[i] = 0
		}
		this.highlightBoxes = []
	}
}

export class Program{
	constructor(component, name){
		this.component = component
		this.name = name
		//the start step is the index of the first non-idle instruction.
		this.startStep = 0
		//a program's period is the number of instructions from the first to the last non-idle instruction.
		this.period = 0
		this.instructions = []
		this.generatedInstructions = []
		this.isLegal = true
		this.elem = null
	}

	clone(component=null){
		let clone = new Program(component ?? this.component, this.name)
		clone.startStep = this.startStep
		clone.period = this.period
		clone.instructions = this.instructions
		clone.generatedInstructions = this.generatedInstructions
		clone.elem = this.elem
		return clone
	}

	createElement(){
		let programRow = $("<div>").addClass("program-row")
		this.elem = programRow
		let programName = $("<div>").addClass("program-name").text(this.name)
		this.elem.data("program", this)
		this.elem.data("name-tag", programName)
		$("#program-names").append(programName)
		$("#program-rows").append(programRow)
	}

	getInstruction(timestep){
		let instructions = this.generatedInstructions
		if (timestep < instructions.length){
			return instructions[timestep]
		} else if (timestep >= instructions.length && this.period > 0){
			let offset = timestep - this.startStep
			let instruction = instructions[this.startStep + (offset % this.period)]
			return instruction
		}
	}
}

class DragBox {
	constructor(type, p1x, p1y, p2x, p2y){
		this.type = type
		this.origin = [p1x, p1y]
		this.setRect(p2x, p2y)
	}
	setRect(px, py){
		let p1x = this.origin[0]
		let p1y = this.origin[1]
		this.rect = new Rectangle(min(p1x, px), min(p1y, py), abs(p1x - px), abs(p1y - py))
	}
}

export class Game{
	constructor(canvas, controls, scenario, solution){
		this.controls = controls
		this.solution = solution
		this.isActive = true
		this.lastTick = performance.now()
		this.isDraggingMap = false
		this.selectedComponent = null
		this.isAdjustingComponent = false
		this.heldInstruction = null
		this.heldInstructions = []
		this.selectedInstructions = []
		//When you place an instruction by clicking the mouse down (via keys) you do nothing when you lift the mouse back up.
		this.overrideInstructionMouseUp = false

		this.currentLevel = null
		this.simulation = null
		this.isPlayingSimulation = false
		this.simulationTimeStep = 0
		this.simulationDeltaT = 0
		this.playbackSpeed = 1
		this.stopSimulationAtNextTimeStep = false
		this.stopSimulationAtTimeStep = Infinity
		this.playingAnimations = []

		this.solutionUsedHexes = []
		this.componentCountInfos = {
			"Product": [],
			"Reagent": []
		}

		this.hexSize = 40
		this.canvas = canvas
		this.canvasWidth = canvas.width
		this.canvasHeight = canvas.height
		this.xOffset = -0.5 * canvas.width
		this.yOffset = -0.5 * canvas.height
		this.hoveredHex = null
		this.isDraggingBox = false
		this.dragBox = null

		this.promise = new Promise(resolve => {
			this.resolvePromise = resolve
		})

		this.setScenario(scenario)
		this.initialize()
		this.createComponentCountInfos()
		this.loadSolution(this.solution)
		this.fillComponentPane()
		this.performUIUpdates()
		console.log(this)
	}

	setScenario(scenario){
		this.currentLevel = new Level(scenario)
		this.simulation = new Level(scenario)
	}
	saveSolution(){
		let solution = this.solution
		let components = this.currentLevel.grid.contents
		let savedComponents = solution.components
		let programs = this.currentLevel.programs
		savedComponents.length = 0
		for (let component of components){
			let obj = {}
			let homeTile = component.homeTile
			obj.type = component.type
			obj.homeTile = homeTile
			switch (component.type){
				case "Track": {
					let trackPieces = component.trackPieces
					obj.trackPieces = []
					for (let trackPiece of trackPieces){
						obj.trackPieces.push(trackPiece.coord)
					}
				} break
				case "Product": {
					let countInfo = component.componentCountInfos.find(info => info.type === "Product")
					let index = countInfo.index
					obj.hexRotation = component.currentHexRotation
					obj.productIndex = index
				} break
				case "Reagent": {
					let countInfo = component.componentCountInfos.find(info => info.type === "Reagent")
					let index = countInfo.index
					obj.hexRotation = component.currentHexRotation
					obj.reagentIndex = index
				} break
				case "Glyph": {
					obj.hexRotation = component.currentHexRotation
					let glyphType = component.glyphType
					let glyphId = glyphType.id
					obj.glyphId = glyphId
				} break
				case "ArmMechanism": {
					obj.hexRotation = component.currentHexRotation
					let mechanismType = component.mechanismType
					let mechanismId = mechanismType.id
					obj.mechanismId = mechanismId
					let armLength = component.arms.contents[0].distance
					obj.armLength = armLength
					let programIndex = programs.indexOf(component.program)
					obj.programIndex = programIndex
				} break
			}
			savedComponents.push(obj)
		}

		let savedPrograms = solution.programs
		savedPrograms.length = 0
		for (let program of programs){
			let instructions = program.instructions
			let savedProgram = {
				name: program.name,
				instructions: []
			}
			let savedInstructions = savedProgram.instructions
			savedPrograms.push(savedProgram)
			for (let instruction of instructions){
				let savedInstruction = instruction.type.id
				savedInstructions.push(savedInstruction)
			}
		}

		saveSolution(solution)
	}
	loadSolution(solution){
		let savedComponents = solution.components
		let savedPrograms = solution.programs
		let programs = this.currentLevel.programs
		let scenario = this.currentLevel.scenario
		for (let savedComponent of savedComponents){
			let component
			switch (savedComponent.type){
				case "Track": {
					let track = new Track()
					let homeTile = savedComponent.homeTile
					track.homeTile = Hex.fromObj(homeTile)
					for (let savedTrackPiece of savedComponent.trackPieces){
						let coord = Hex.fromObj(savedTrackPiece)
						track.addTrackPiece(coord, true)
					}
					component = track
				} break
				case "Product": {
					let productMolecules = scenario.productMolecules
					let index = savedComponent.productIndex
					let product = productMolecules[index]
					let molecule = createMolecule(product.molecule)
					component = new Product(molecule)
					let homeTile = savedComponent.homeTile
					component.homeTile = Hex.fromObj(homeTile)
					if (savedComponent.hexRotation){
						while (savedComponent.hexRotation < component.currentHexRotation){
							component.rotateRight()
						}
						while (savedComponent.hexRotation > component.currentHexRotation){
							component.rotateLeft()
						}
					}
					component.componentCountInfos.push(this.componentCountInfos["Product"][index])
				} break
				case "Reagent": {
					let reagentMolecules = scenario.reagentMolecules
					let index = savedComponent.reagentIndex
					let reagent = reagentMolecules[index]
					let molecule = createMolecule(reagent.molecule)
					component = new Reagent(molecule)
					let homeTile = savedComponent.homeTile
					component.homeTile = Hex.fromObj(homeTile)
					if (savedComponent.hexRotation){
						while (savedComponent.hexRotation < component.currentHexRotation){
							component.rotateRight()
						}
						while (savedComponent.hexRotation > component.currentHexRotation){
							component.rotateLeft()
						}
					}
					component.componentCountInfos.push(this.componentCountInfos["Reagent"][index])
				} break
				case "Glyph": {
					let glyphId = savedComponent.glyphId
					component = new Glyph(glyphId)
					let homeTile = savedComponent.homeTile
					component.homeTile = Hex.fromObj(homeTile)
					if (savedComponent.hexRotation){
						while (savedComponent.hexRotation < component.currentHexRotation){
							component.rotateRight()
						}
						while (savedComponent.hexRotation > component.currentHexRotation){
							component.rotateLeft()
						}
					}
				} break
				case "ArmMechanism": {
					let mechanismId = savedComponent.mechanismId
					component = new ArmMechanism(mechanismId)
					let homeTile = savedComponent.homeTile
					component.homeTile = Hex.fromObj(homeTile)
					if (savedComponent.hexRotation){
						while (savedComponent.hexRotation < component.currentHexRotation){
							component.rotateRight()
						}
						while (savedComponent.hexRotation > component.currentHexRotation){
							component.rotateLeft()
						}
					}
					let firstArm = component.arms.contents[0]
					let lengthDiff = savedComponent.armLength - firstArm.distance
					if (firstArm.distance !== savedComponent.armLength){
						for (let arm of component.arms.contents){
							arm.distance += lengthDiff
						}
					}
					component.rotationPoint = firstArm.direction.scale(firstArm.distance)

					let savedProgram = savedPrograms[savedComponent.programIndex]
					let program = new Program(component, savedProgram.name)
					component.program = program
					let savedInstructions = savedProgram.instructions
					for (let i = 0; i < savedInstructions.length; i++){
						let instructionTypeId = savedInstructions[i]
						let instructionType = INSTRUCTIONS[instructionTypeId]
						let instruction = new Instruction(instructionType)
						program.instructions[i] = instruction
					}
					programs.push(program)
				} break
			}
			if (component){
				this.addComponent(component, this.currentLevel)
			}
		}
	}

	win(){
		let playerName = "You"
		let nowCost = this.getTotalCost()
		let nowCycles = this.simulationTimeStep + 1
		let nowArea = this.solutionUsedHexes.length
		let nowInstructions = this.getTotalInstructions()
		this.solution.solutionArea = nowArea
		this.solution.solutionCost = nowCost
		this.solution.solutionCycle = nowCycles
		this.solution.solutionInstructionCount = nowInstructions
		this.solution.verified = true
		this.saveSolution()

		this.playbackSpeed = 0
		let modalTag = $("#modal")
		clearModal(modalTag)

		let header = modalTag.find(".modal-header")
		header.addClass("justify-content-center")
		let title = modalTag.find(".modal-title")
		title.text(getLocaleString("you-win-message", language))
		title.addClass("text-center").addClass("display-3")
		let body = modalTag.find(".modal-body")
		let scenarioName = getLocaleString(["scenarios", this.currentLevel.scenario.id, "name"], language, "%scenario name%")
		let winSubtitle = getLocaleString("you-win-subtitle", language, "%win message%")
		body.addClass("text-center")
		body.append($("<h2>").text(scenarioName))
		body.append($("<h3>").text(winSubtitle))

		let scoreboards = $("<div>").addClass("scoreboards")
		body.append(scoreboards)

		let costScoreboard = $("<div>").addClass("scoreboard")
		scoreboards.append(costScoreboard)
		let cycleScoreboard = $("<div>").addClass("scoreboard")
		scoreboards.append(cycleScoreboard)
		let areaScoreboard = $("<div>").addClass("scoreboard")
		scoreboards.append(areaScoreboard)
		// TODO:
		// let instructionsScoreboard = $("<div>").addClass("scoreboard")
		// scoreboards.append(instructionsScoreboard)

		fillScoreboard(
			costScoreboard, playerName, getLocaleString("scoreboard-title-cost", language, "COST"), 0, nowCost, 0, 0, {}, []
		)
		costScoreboard.find(".scoreboard-score").append($("<span class='tiny-g'>G</span>"))
		fillScoreboard(
			cycleScoreboard, playerName, getLocaleString("scoreboard-title-cycle", language, "CYCLES"), 0, nowCycles, 0, 0, {}, []
		)
		fillScoreboard(
			areaScoreboard, playerName, getLocaleString("scoreboard-title-area", language, "AREA"), 0, nowArea, 0, 0, {}, []
		)

		var modal = new bootstrap.Modal(modalTag[0], {
			keyboard: false
		})
		modal.toggle()

		modalTag.on("hidden.bs.modal", () => {
			this.resolvePromise([
				{
					type: "set-completion",
					completed: true,
					scenario: this.currentLevel.scenario
				},
				{
					type: "change-scene",
					val: "level-select"
				}
			])
		})
	}
	exit(){
		this.resolvePromise([
			{
				type: "change-scene",
				val: "level-select"
			}
		])
	}

	createComponentCountInfos(){
		let scenario = this.currentLevel.scenario
		let productMolecules = scenario.productMolecules
		let reagentMolecules = scenario.reagentMolecules
		for (let productMolecule of productMolecules){
			let index = productMolecules.indexOf(productMolecule)
			let componentCountInfo = {
				type: "Product",
				index: index,
				count: 0,
				maxCount: 1
			}
			this.componentCountInfos["Product"][index] = componentCountInfo
		}

		for (let reagentMolecule of reagentMolecules){
			let index = reagentMolecules.indexOf(reagentMolecule)
			let componentCountInfo = {
				type: "Reagent",
				index: index,
				count: 0,
				maxCount: 1
			}
			this.componentCountInfos["Reagent"][index] = componentCountInfo
		}
	}

	fillComponentPane(){
		let scenario = this.currentLevel.scenario
		let productMolecules = scenario.productMolecules
		let productsPane = $("#components-products").children(".components-list")
		productsPane.empty()
		let reagentMolecules = scenario.reagentMolecules
		let reagentsPane = $("#components-reagents").children(".components-list")
		reagentsPane.empty()
		let allowedMechanisms = scenario.allowedMechanisms
		let mechanismsPane = $("#components-mechanisms").children(".components-list")
		mechanismsPane.empty()
		let allowedGlyphs = scenario.allowedGlyphs
		let glyphsPane = $("#components-glyphs").children(".components-list")
		glyphsPane.empty()

		for (let productMolecule of productMolecules){
			let index = productMolecules.indexOf(productMolecule)
			let componentCountInfo = this.componentCountInfos["Product"][index]
			let moleculeName = productMolecule.name
			let molecule = createMolecule(productMolecule.molecule)
			let componentTag = $("<div class='component'>")
			componentTag.text(moleculeName)
			productsPane.append(componentTag)
			componentTag.attr("data-available", true)
			componentTag.data("count", componentCountInfo)
			componentTag.on("mousedown", () => {
				let component = new Product(molecule)
				component.componentCountInfos.push(componentCountInfo)
				this.beginHoldingComponent(component)
				this.selectedComponent.isRendered = false
			})
		}

		for (let reagentMolecule of reagentMolecules){
			let index = reagentMolecules.indexOf(reagentMolecule)
			let componentCountInfo = this.componentCountInfos["Reagent"][index]
			let moleculeName = reagentMolecule.name
			let molecule = createMolecule(reagentMolecule.molecule)
			let componentTag = $("<div class='component'>")
			componentTag.text(moleculeName)
			reagentsPane.append(componentTag)
			componentTag.attr("data-available", true)
			componentTag.data("count", componentCountInfo)
			componentTag.on("mousedown", () => {
				let component = new Reagent(molecule)
				component.componentCountInfos.push(componentCountInfo)
				component.isRendered = false
				this.beginHoldingComponent(component)
			})
		}

		for (let mechanismName of allowedMechanisms){
			let componentTag = $("<div class='component'>")
			componentTag.text(mechanismName)
			mechanismsPane.append(componentTag)
			componentTag.attr("data-available", true)
			componentTag.on("mousedown", () => {
				let component = new ArmMechanism(mechanismName)
				component.isRendered = false
				this.beginHoldingComponent(component)
			})
		}

		for (let glyphId of allowedGlyphs){
			let componentTag = $("<div class='component'>")
			componentTag.text(glyphId)
			glyphsPane.append(componentTag)
			componentTag.attr("data-available", true)
			componentTag.on("mousedown", () => {
				let component = new Glyph(glyphId)
				component.isRendered = false
				this.beginHoldingComponent(component)
			})
		}

		//Add one last mechanism for tracks.
		let trackTag = $("<div class='component'>")
		trackTag.text("Track")
		mechanismsPane.append(trackTag)
		trackTag.attr("data-available", true)
		trackTag.on("mousedown", () => {
			let component = new Track()
			component.isRendered = false
			component.addTrackPiece(new Hex(0, 0, 0))
			this.beginHoldingComponent(component)
		})
	}
	updateComponentPane(){
		let holdingCounts = []
		if (this.selectedComponent){
			for (let componentCountInfo of this.selectedComponent.componentCountInfos){
				holdingCounts.push(componentCountInfo)
			}
		}
		//Check whether any components are currently at their limit.
		let componentTags = $("#components").find(".component")
		for (let componentTag of componentTags){
			let componentCountInfo = $(componentTag).data("count")
			if (!componentCountInfo) continue
			let count = componentCountInfo.count
			if (holdingCounts.includes(componentCountInfo)){
				count++
			}
			if (count >= componentCountInfo.maxCount){
				$(componentTag).attr("data-available", false)
			} else {
				$(componentTag).attr("data-available", true)
			}
		}
	}

	addComponent(component, level){
		if (!level){
			level = this.currentLevel
		}
		//For rendering purposes, all components must be placed in this order.
		const type = component.type
		const hierarchy = ["Track", "Reagent", "Product", "Glyph", "Molecule", "ArmMechanism"]
		const score = hierarchy.indexOf(type)
		const contents = level.grid.contents
		let index = contents.length
		while (index !== 0){
			let prev = contents[index - 1]
			if (hierarchy.indexOf(prev.type) > score){
				index--
			} else {
				break
			}
		}
		contents.splice(index, 0, component)

		//If this component was a mechanism, add a new program connected to it.
		if (component.type === "ArmMechanism" && level === this.currentLevel && !component.program){
			let programs = level.programs
			let program = new Program(component, programs.length + 1)
			programs.push(program)
			component.program = program
		}
		if (component.program && level === this.currentLevel && !component.program.elem){
			let program = component.program
			program.createElement()
			program.elem[0].addEventListener("mousemove", e => {
				this.handleProgramMouseMove(e, program, component)
			})
			program.elem[0].addEventListener("mouseup", e => {
				this.handleProgramMouseUp(e, program, component)
			})
			program.elem[0].addEventListener("mousedown", e => {
				this.handleProgramMouseDown(e, program, component)
			})
		}

		if (component.type === "ArmMechanism"){
			this.placeArmsOnTracks(level)
		}

		component.lastPlacement = component.homeTile.clone()

		//If this component is marked as needing count info, count it.
		for (let componentCountInfo of component.componentCountInfos){
			componentCountInfo.count++
		}
		this.performUIUpdates()
	}
	deleteComponent(component, level){
		if (!level){
			level = this.currentLevel
		}
		const contents = level.grid.contents
		let index = contents.indexOf(component)
		if (index !== -1){
			contents.splice(index, 1)

			//If this component is marked as needing count info, count it.
			for (let componentCountInfo of component.componentCountInfos){
				componentCountInfo.count--
			}
		}
		this.performUIUpdates()
	}

	initialize(){
		this.resizeScreen()
		$("#program-names").empty()
		$("#program-rows").empty()
		$("#program-rows").removeClass("playing")
	}

	beginHoldingInstruction(instruction){
		this.beginHoldingInstructions([[instruction]])
	}
	beginHoldingInstructions(instructionsList){
		this.endHoldingInstructions()
		this.heldInstructions = instructionsList

		//if any of those instructions are from a program currently being written, remove them.
		if (!instructionsList.length || !instructionsList[0].length) return
		let programs = this.currentLevel.programs
		for (let instructions of instructionsList){
			let firstInstruction = instructions[0]
			for (let program of programs){
				let programInstructions = program.instructions
				let index = programInstructions.indexOf(firstInstruction)
				if (index !== -1){
					for (let i = 0; i < instructions.length; i++){
						let indexToChange = i + index
						let replacement = new Instruction(INSTRUCTIONS["idle"])
						programInstructions[indexToChange] = replacement
					}
				}
			}
		}

		//Place those instructions into the tooltip
		for (let instructions of instructionsList){
			let rowElem = $("<div>").addClass("program-row")
			for (let instruction of instructions){
				let elem = createInstructionTag(instruction)
				rowElem.append(elem)
			}
			$("#tooltip").append(rowElem)
		}

		this.performUIUpdates()
	}
	endHoldingInstructions(){
		this.heldInstructions = []
		$("#tooltip").empty()
		this.performUIUpdates()
		this.saveSolution()
	}
	placeHeldInstructions(){
		
	}
	handleProgramMouseMove(event, program, component){
		let row = program.elem[0]
		let rect = row.getBoundingClientRect()
		let mouseX = event.clientX - rect.x
		let mouseY = event.clientY - rect.y

		if (this.dragBox?.type === "instructions"){
			//The player is clicking and dragging a box over their program instructions.
			let programs = this.currentLevel.programs
			let dragRect = this.dragBox.rect
			let selectedPrograms = []
			let selectedInstructions = []
			for (let program of programs){
				let row = program.elem
				let rect = row[0].getBoundingClientRect()
				let h = rect.height
				let w = rect.width
				let rowRect = new Rectangle(rect.x, rect.y, w, h)
				let instructionTags = row.children(".instruction")
				if (!rowRect.intersects(dragRect)){
					continue
				}
				let rowSelected = []
				for (let instructionTag of instructionTags){
					let rect = instructionTag.getBoundingClientRect()
					let h = rect.height
					let w = rect.width
					let insRect = new Rectangle(rect.x, rect.y, w, h)
					if (insRect.intersects(dragRect)){
						let instruction = $(instructionTag).data("instruction")
						rowSelected.push(instruction)
					}
				}
				if (rowSelected.length){
					selectedPrograms.push(program)
					selectedInstructions.push(rowSelected)
				}
			}
			//Normalize instructions
			let minIndex = Infinity
			let maxIndex = -Infinity
			for (let i = 0; i < selectedPrograms.length; i++){
				let program = selectedPrograms[i]
				let instructions = program.instructions
				let selected = selectedInstructions[i]
				let first = selected[0]
				let last = selected[selected.length - 1]
				let firstIndex = instructions.indexOf(first)
				let lastIndex = instructions.indexOf(last)
				if (firstIndex < minIndex) minIndex = firstIndex
				if (lastIndex > maxIndex) maxIndex = lastIndex
			}
			for (let i = 0; i < selectedPrograms.length; i++){
				let instructions = selectedPrograms[i].instructions
				let selected = selectedInstructions[i]
				for (let j = minIndex; j <= maxIndex; j++){
					let instruction = instructions[j]
					if (!instruction){
						instruction = new Instruction(INSTRUCTIONS["idle"])
					}
					selected[j - minIndex] = instruction
				}
			}
			//Remove any timesteps from the beginning/end where nothing happens
			let removingFromBeginning = true
			while (removingFromBeginning){
				let allIdle = true
				let foundIdle = false
				for (let j = 0; j < selectedPrograms.length; j++){
					let instruction = selectedInstructions[j][0]
					if (!instruction) continue
					if (instruction.type.id !== "idle"){
						allIdle = false
					} else {
						foundIdle = true
					}
				}
				if (allIdle && foundIdle){
					for (let j = 0; j < selectedPrograms.length; j++){
						selectedInstructions[j].splice(0, 1)
					}
				} else {
					removingFromBeginning = false
					break
				}
			}
			//Remove from the end as well
			let removingFromEnd = true
			while (removingFromEnd){
				let allIdle = true
				let foundIdle = false
				for (let j = 0; j < selectedPrograms.length; j++){
					let lastIndex = selectedInstructions[j].length - 1
					let instruction = selectedInstructions[j][lastIndex]
					if (!instruction) continue
					if (instruction.type.id !== "idle"){
						allIdle = false
					} else {
						foundIdle = true
					}
				}
				if (allIdle && foundIdle){
					for (let j = 0; j < selectedPrograms.length; j++){
						let lastIndex = selectedInstructions[j].length - 1
						selectedInstructions[j].splice(lastIndex, 1)
					}
				} else {
					removingFromBeginning = false
					break
				}
			}
			//Finally, remove all instructions from rows that are now completely idle.
			for (let i = 0; i < selectedInstructions.length; i++){
				let allIdle = true
				let selected = selectedInstructions[i]
				for (let j = 0; j < selected.length; j++){
					let instruction = selected[j]
					if (!instruction) continue
					if (instruction.type.id !== "idle"){
						allIdle = false
					}
				}
				if (allIdle){
					selected.splice(0, selected.length)
				}
			}
			//At this point, there may be some empty lists at the beginning/end of the list.
			while (selectedInstructions[0]?.length === 0){
				selectedInstructions.splice(0, 1)
			}
			while (selectedInstructions[selectedInstructions.length - 1]?.length === 0){
				selectedInstructions.splice(selectedInstructions.length - 1, 1)
			}
			this.selectInstructions(selectedInstructions)
			return
		}
		//Otherwise, they might be starting to drag instructions
		const controls = this.controls
		if (controls.isClicking("left") && this.selectedInstructions.length){
			let oldMousePos = controls.mouseDownOrigin
			if (oldMousePos){
				let mouseX = controls.mouse.clientX
				let mouseY = controls.mouse.clientY
				let dist = Math.hypot(oldMousePos[0] - mouseX, oldMousePos[1] - mouseY)
				if (dist > 5){
					this.beginHoldingInstructions(this.selectedInstructions)
				}
			}
		}
	}
	handleProgramMouseUp(event, program, component){
		if (this.isPlayingSimulation) return
		//if the player was holding an instruction, place it.
		//Otherwise, do nothing.
		if (this.overrideInstructionMouseUp) return
		if (this.isDraggingBox) {
			let rect = this.dragBox.rect
			let size = max(rect.w, rect.h)
			if (size > 5){
				return
			}
		}
		this.deselectInstructions()
		if (!this.heldInstructions.length) return

		let row = program.elem[0]
		let rect = row.getBoundingClientRect()
		let mouseX = event.clientX - rect.x
		let mouseY = event.clientY - rect.y
		//Instructions have a 10 / 9 aspect ratio
		let instructionWidth = rect.height * 10 / 9
		let instructionIndex = Math.floor(mouseX / instructionWidth)

		let programs = this.currentLevel.programs
		let firstProgramIndex = programs.indexOf(program)
		let firstInstruction = this.heldInstructions[0][0]
		let held = this.heldInstructions
		for (let i = 0; i < this.heldInstructions.length; i++){
			let heldInstructions = this.heldInstructions[i]
			let addToProgram = programs[firstProgramIndex + i]
			for (let j = 0; j < heldInstructions.length; j++){
				let instruction = heldInstructions[j]
				this.insertProgramInstruction(instruction, addToProgram, instructionIndex + j)
			}
		}
		
		this.endHoldingInstructions()
		this.performUIUpdates()
		this.selectInstructions(held)
	}
	handleProgramMouseDown(event, program, component){
		if (event.buttons === 1){
			let tags = tagHierarchy(event.target).reverse()
			let instructionTag = tags.find(tag => $(tag).hasClass("instruction"))
			//If the player is holding alt, fast forward to that instruction.
			if (instructionTag && this.controls.isPressing("Alt")){
				let row = tags.find(tag => $(tag).hasClass("program-row"))
				let instruction = $(instructionTag).data("instruction")
				let program = $(row).data("program")
				let index = program.instructions.indexOf(instruction)
				$("#playback-fast-forward-button").click()
				this.stopSimulationAtTimeStep = index + 1
				this.stopSimulationAtNextTimeStep = true
				return
			}
			//If you're playing the simulation, you CAN'T edit things.
			if (this.isPlayingSimulation) return
			//Check if the player is trying to place an instruction they're already holding
			//(like ones they create with keys)
			if (this.heldInstructions.length){
				let row = program.elem[0]
				let rect = row.getBoundingClientRect()
				let mouseX = event.clientX - rect.x
				let mouseY = event.clientY - rect.y
				//Instructions have a 10 / 9 aspect ratio
				let instructionWidth = rect.height * 10 / 9
				let instructionIndex = Math.floor(mouseX / instructionWidth)
				let instruction = this.heldInstructions[0][0]
				this.insertProgramInstruction(instruction, program, instructionIndex)
				this.endHoldingInstructions()
				this.performUIUpdates()
				this.overrideInstructionMouseUp = true
				return
			}
			//Check if the player is clicking an instruction
			if (instructionTag){
				let instruction = $(instructionTag).data("instruction")
				if (instruction.type.id !== "idle"){
					//If this tag was already selected, do nothing.
					let alreadySelected = false
					if (this.selectedInstructions.length){
						let thoseInstructions = this.selectedInstructions.flat(2)
						if (thoseInstructions.includes(instruction)){
							alreadySelected = true
						}
					}
					if (!alreadySelected){
						this.selectInstructions([[instruction]])
					}
					return
					// this.beginHoldingInstruction(instruction)
				}
			}
			//Otherwise, they must be beginning to click and drag a box.
			let x = event.clientX
			let y = event.clientY
			this.isDraggingBox = true
			this.dragBox = new DragBox("instructions", x, y, x, y)
		}
	}
	insertProgramInstruction(instruction, program, instructionIndex){
		let instructions = program.instructions
		//If the player is placing an instruction where there already was one, insert it before that instruction.
		if (instructions.length >= instructionIndex){
			let hoveredInstruction = instructions[instructionIndex]
			if (hoveredInstruction?.type?.id === "idle"){
				//Player is replacing an idle instruction with this instruction
				instructions.splice(instructionIndex, 1, instruction)
			} else {
				//Player is inserting this instruction into previous space
				//To do this, we will first shift instructions from the intended index until the next idle instruction to the right by an amount equal to the length of the added parts.
				let foundOffset = false
				let offset = 1
				while (!foundOffset){
					let nextInstruction = instructions[instructionIndex + offset]
					if (!nextInstruction){
						foundOffset = true
						break
					}
					let type = nextInstruction.type.id
					if (type === "idle"){
						foundOffset = true
						break
					}
					offset++
				}
				for (let i = offset; i >= 1; i--){
					let index = instructionIndex + i
					instructions[index] = instructions[index - 1]
				}
				instructions[instructionIndex] = instruction
			}
		} else {
			//Player is adding to the end of the program
			instructions[instructionIndex] = instruction
		}
	}
	fixPrograms(){
		let programs = this.currentLevel.programs
		for (let program of programs){
			let instructions = program.instructions
			//replace all empty space with idle instructions
			for (let i = 0; i < instructions.length; i++){
				let instruction = instructions[i]
				if (!instruction){
					instruction = new Instruction(INSTRUCTIONS["idle"])
					instructions[i] = instruction
				}
			}
		}
		
		//Remove all idle instructions from the end of the program
		for (let program of programs){
			let instructions = program.instructions
			//replace all empty space with idle instructions
			for (let i = instructions.length - 1; i >= 0; i--){
				let instruction = instructions[i]
				let typeId = instruction.type.id
				if (typeId === "idle") {
					instructions.splice(i, 1)
				} else {
					break
				}
			}
		}

		//Set all "reset position" instructions inside the programs.
		for (let program of programs){
			let instructions = program.instructions
			let positionInfo = {
				grabbing: false,
				rotation: 0,
				extension: 1,
				initialExtension: 1,
				track: 0
			}
			let maxLength = 3
			let minLength = 1
			if (program.component){
				positionInfo.extension = program.component.arms.contents[0].distance
				positionInfo.initialExtension = positionInfo.extension
				let mechanismType = program.component.mechanismType
				minLength = mechanismType.abilities["min_length"]
				maxLength = mechanismType.abilities["max_length"]
			}

			const add = instruction => {
				if (instruction.generatedInstructions.length){
					for (let ins of instruction.generatedInstructions){
						add(ins)
					}
				}
				switch (instruction.type.id){
					case "grabber_grab": positionInfo.grabbing = true; break
					case "grabber_drop": positionInfo.grabbing = false; break
					case "rotator_cw": positionInfo.rotation -= 1; break
					case "rotator_ccw": positionInfo.rotation += 1; break
					case "piston_extend":
						if (positionInfo.extension < maxLength) positionInfo.extension += 1
						break
					case "piston_retract":
						if (positionInfo.extension > minLength) positionInfo.extension -= 1
						break
					case "track_advance": positionInfo.track += 1; break
					case "track_retreat": positionInfo.track -= 1; break
					case "reset": {
						positionInfo.grabbing = false
						positionInfo.rotation = 0
						positionInfo.extension = positionInfo.initialExtension
						positionInfo.track = 0
					} break
				}
			}

			for (let i = 0; i < instructions.length; i++){
				let instruction = instructions[i]
				switch (instruction.type.id){
					case "reset": {
						let rotation = ((positionInfo.rotation % 6) + 6) % 6
						let extension = positionInfo.extension - 1
						let initialExtension = positionInfo.initialExtension - 1
						let extensionDiff = initialExtension - extension
						let trackIndexChange = positionInfo.track
						let generated = []
						if (positionInfo.grabbing){
							let ins = new Instruction(INSTRUCTIONS["grabber_drop"])
							generated.push(ins)
						}
						if (extensionDiff !== 0){
							while (extensionDiff < 0){
								let ins = new Instruction(INSTRUCTIONS["piston_extend"])
								generated.push(ins)
								extension++
							}
							while (extensionDiff > 0){
								let ins = new Instruction(INSTRUCTIONS["piston_retract"])
								generated.push(ins)
								extension--
							}
						}
						if (rotation !== 0){
							while (rotation < 3 && rotation > 0){
								let ins = new Instruction(INSTRUCTIONS["rotator_cw"])
								generated.push(ins)
								rotation--
							}
							while (rotation >= 3 && rotation < 6){
								let ins = new Instruction(INSTRUCTIONS["rotator_ccw"])
								generated.push(ins)
								rotation++
							}
						}
						if (trackIndexChange !== 0){
							if (program.component?.attachedTrack){
								let track = program.component.attachedTrack
								let trackLength = track.trackPieces.length
								let targetIndex = program.component.attachedTrackIndex
								let curIndex = targetIndex + trackIndexChange
								if (curIndex >= trackLength){
									if (track.loops){
										curIndex %= trackLength
									} else {
										curIndex = trackLength - 1
									}
								} else if (curIndex < 0){
									if (track.loops){
										curIndex = trackLength + curIndex
										curIndex += trackLength
										curIndex %= trackLength
									} else {
										curIndex = 0
									}
								}

								let change = curIndex - targetIndex
								if (track.loops){
									const right = (targetIndex - curIndex + trackLength) % trackLength
									const left  = (curIndex - targetIndex + trackLength) % trackLength
									if (left < right) change = left
									else if (right < left) change = -right
									else change = 0
								}
								console.log(change)
								while (change > 0){
									let ins = new Instruction(INSTRUCTIONS["track_retreat"])
									generated.push(ins)
									change--
								}
								while (change < 0){
									let ins = new Instruction(INSTRUCTIONS["track_advance"])
									generated.push(ins)
									change++
								}
							}
						}
						instruction.generatedInstructions = generated
					} break
					case "repeat": {
						let prevInstructions = []
						for (let j = i - 1; j >= 0; j--){
							let ins = instructions[j]
							if (!ins) continue
							let toCheck = [ins]
							let stopped = false
							while (toCheck.length){
								ins = toCheck[0]
								toCheck.splice(0, 1)
								let type = ins.type
								if (type.id !== "idle" && !ins.generatedInstructions.length){
									prevInstructions.push(ins)
								}

								if (ins.generatedInstructions.length){
									for (let ins2 of ins.generatedInstructions){
										toCheck.push(ins2)
									}
								}
								if (type.stopsRepeats){
									stopped = true
									if (prevInstructions.length !== 0){
										break
									}
								}
							}
							if (stopped){
								break
							}
						}
						instruction.generatedInstructions = []
						for (let ins of prevInstructions){
							instruction.generatedInstructions.push(ins.clone())
						}
					}
				}
				add(instruction)
			}
			positionInfo.rotation = ((positionInfo.rotation % 6) + 6) % 6
		}

		//Change the program's true instructions to those generated.
		for (let program of programs){
			program.isLegal = true
			program.generatedInstructions.length = 0
			let generated = program.generatedInstructions
			let instructions = program.instructions
			for (let i = 0; i < instructions.length; i++){
				let instruction = instructions[i]
				instruction.isLegal = true
				generated[i] = instruction
			}
			for (let i = 0; i < instructions.length; i++){
				let instruction = instructions[i]
				for (let j = 0; j < instruction.generatedInstructions.length; j++){
					let gen = instruction.generatedInstructions[j]
					if (j > 0 && generated[i + j] && generated[i + j].type.id !== "idle"){
						program.isLegal = false
						instruction.isLegal = false
					}
					generated[i + j] = gen
				}
			}
		}

		//Set stats
		let maxPeriod = 0
		for (let program of programs){
			let instructions = program.generatedInstructions
			//Find start step
			for (let i = 0; i < instructions.length; i++){
				let instruction = instructions[i]
				if (instruction.type.id !== "idle"){
					program.startStep = i
					break
				}
			}
			//Find end step
			let endStep = max(instructions.length - 1, 0)
			for (let i = endStep; i > program.startStep; i++){
				let instruction = instructions[i]
				if (instruction.type.id !== "idle"){
					endStep = i
					break
				}
			}

			program.period = endStep - program.startStep + 1
			if (program.period > maxPeriod){
				maxPeriod = program.period
			}
		}

		//ensure all programs are the same length
		//(a 5-step program that starts on step 200 is 5 steps long.)
		for (let program of programs){
			let instructions = program.instructions
			while (instructions.length < program.startStep + maxPeriod){
				let instruction = new Instruction(INSTRUCTIONS["idle"])
				instructions.push(instruction)
			}
			program.period = maxPeriod
		}

		//Fix all program's stats for stuff like repeating over time with periods
		for (let program of programs){
			// program.setStats()
		}
	}
	renderPrograms(){
		let programs = this.currentLevel.programs
		for (let i = 0; i < programs.length; i++){
			let program = programs[i]
			program.name = i + 1
			let row = program.elem
			row.data("name-tag")?.text(program.name)
			let instructions = program.instructions
			row.empty()
			for (let j = 0; j < instructions.length; j++){
				let instruction = instructions[j]
				let tag = createInstructionTag(instruction)
				row.append(tag)
				tag.data("program", program)
				tag.data("instruction", instruction)

				let generatedTags = tag.children(".instruction-generated").children(".instruction")
				if (!generatedTags.length){
					tag.data("instructionIndex", j)
					tag.attr("data-index", j)
				}
				for (let k = 0; k < generatedTags.length; k++){
					let gen = $(generatedTags[k])
					gen.data("instructionIndex", j + k)
					gen.attr("data-index", j + k)
				}
				// tag[0].addEventListener("mousedown", () => {
				// 	this.beginHoldingInstruction(instruction)
				// })
			}
		}
	}
	highlightPrograms(timestep){
		let programs = this.currentLevel.programs
		for (let program of programs){
			let instructions = program.instructions
			let row = program.elem
			if (timestep < program.startStep) continue
			let instructionIndex = (timestep - program.startStep) % program.period + program.startStep
			row.find(`.instruction`).removeClass("highlight")
			row.find(`.instruction[data-index=${instructionIndex}]`).addClass("highlight")
		}
	}
	selectInstructions(instructionsList){
		this.selectedInstructions = instructionsList
		let thoseInstructions = this.selectedInstructions.flat(2)
		let programs = this.currentLevel.programs
		for (let program of programs){
			let instructionTags = program.elem.children(".instruction")
			instructionTags.removeClass("highlight")
			for (let instructionTag of instructionTags){
				let instructionTagJ = $(instructionTag)
				let instruction = instructionTagJ.data("instruction")
				if (thoseInstructions.includes(instruction)){
					instructionTagJ.addClass("highlight")
				}
			}
		}
	}
	deselectInstructions(){
		this.selectedInstructions = []
		let programs = this.currentLevel.programs
		for (let program of programs){
			let instructionTags = program.elem.children(".instruction")
			instructionTags.removeClass("highlight")
		}
	}

	getPlacementCollisionHexes(component){
		let result = []
		let homeTile = component.homeTile
		if (component.type === "ArmMechanism"){
			result.push(homeTile)
		}
		let atoms = component.atoms.contents
		for (let atom of atoms){
			let hex = homeTile.add(atom.coord)
			result.push(hex)
		}
		if (component.molecule){
			let atoms = component.molecule.atoms.contents
			for (let atom of atoms){
				let hex = homeTile.add(atom.coord)
				result.push(hex)
			}
		}
		let inputs = component.inputs.contents
		for (let input of inputs){
			let hex = homeTile.add(input.coord)
			result.push(hex)
		}
		if (component.trackPieces){
			let trackPieces = component.trackPieces
			for (let trackPiece of trackPieces){
				let hex = homeTile.add(trackPiece.coord)
				result.push(hex)
			}
		}
		return result
	}
	getAllPlacementCollisionHexes(){
		let hexes = []
		let components = this.currentLevel.grid.contents
		for (let component of components){
			let toAdd = this.getPlacementCollisionHexes(component)
			for (let hex of toAdd){
				let found = false
				for (let otherHex of hexes){
					if (hex.equals(otherHex)){
						found = true
						break
					}
				}
				if (!found){
					hexes.push(hex)
				}
			}
		}
		return hexes
	}
	checkPlacement(component){
		//The rules for collision are that:
		//The home tile of an arm must not overlap with an atom or the home tile of another arm.
		//The same is true for atoms. They can't touch other atoms or arms. The arm itself is fine, just not the home tile.
		//Since this function will only run while the simulation is paused, we don't need to calculate collision
		//using the non-integer rotation and translation stuff.
		//Also, only collisions with *other* components matters. The component can touch itself.
		let legal = true
		let proposedHexes = this.getPlacementCollisionHexes(component)

		let components = this.currentLevel.grid.contents
		for (let otherComponent of components){
			if (otherComponent === component) continue
			if (component.type === "ArmMechanism" && otherComponent.type === "Track") continue
			if (otherComponent.type === "ArmMechanism" && component.type === "Track") continue
			let takenHexes = this.getPlacementCollisionHexes(otherComponent)
			for (let otherHex of takenHexes){
				for (let hex of proposedHexes){
					if (hex.q === otherHex.q && hex.r === otherHex.r){
						legal = false
						return false
					}
				}
			}
		}
		return legal
	}
	beginHoldingComponent(component, adjusting=false){
		//You can't begin holding components while the simulation is running.
		if (this.isPlayingSimulation) return
		this.selectedComponent = component
		this.selectedComponent.isGhost = true
		this.isAdjustingComponent = adjusting

		let components = this.currentLevel.grid.contents
		if (components.includes(component)){
			this.deleteComponent(component)
		}
	}
	tryToPlaceSelectedComponent(){
		let component = this.selectedComponent
		if (!component) return
		if (this.checkPlacement(component)){
			this.addComponent(component)
			this.selectedComponent.isGhost = false
			this.selectedComponent = null
			this.performUIUpdates()
			playSound("piece_place")
		} else {
			if (component.lastPlacement && component.lastPlacement.equals(component.homeTile)){
				component.lastPlacement = null
			}
			this.cancelPlacement()
		}
		this.saveSolution()
	}
	cancelPlacement(force=false){
		let component = this.selectedComponent
		let wasAdjusting = this.isAdjustingComponent
		if (!force && !wasAdjusting && component.lastPlacement){
			component.homeTile = component.lastPlacement
			this.tryToPlaceSelectedComponent()
		} else {
			this.selectedComponent = null
			this.isAdjustingComponent = false
			playSound("piece_remove")

			if (component.program){
				let index = this.currentLevel.programs.indexOf(component.program)
				if (index !== -1){
					this.currentLevel.programs.splice(index, 1)
				}
				if (component.program.elem){
					component.program.elem.data("name-tag").remove()
					component.program.elem.remove()
				}
			}
		}
		this.performUIUpdates()
	}

	resizeScreen(){
		const oldW = this.canvasWidth
		const oldH = this.canvasHeight
		const w = this.canvas.width
		const h = this.canvas.height
		this.canvasWidth = w
		this.canvasHeight = h
		this.xOffset += (oldW - w) * 0.5
		this.yOffset += (oldH - h) * 0.5
		// const grid = this.currentLevel.grid
		// const hexSize = this.hexSize
		// const horiz = ROOT3 * hexSize
		// const vert = 1.5 * hexSize
		// const xOffset = this.xOffset
		// const yOffset = this.yOffset

		// const topPixel = 0 + yOffset
		// const bottomPixel = h + yOffset
		// const leftPixel = 0 + xOffset
		// const rightPixel = w + xOffset
		// const topR = floor(topPixel / vert)
		// const bottomR = ceil(bottomPixel / vert)
		// const leftQ = floor(leftPixel / horiz)
		// const rightQ = ceil(rightPixel / horiz)
		// grid.fill(leftQ, rightQ, topR, bottomR)
	}

	getHexAt(q, r){
		const level = this.isPlayingSimulation ? this.simulation : this.currentLevel
		const grid = level.grid
		q = Math.round(q)
		r = Math.round(r)
		const s = -q - r
		let hex = grid.findHex(q, r, s)
		if (!hex){
			hex = new Hex(q, r, s)
			grid.addHex(hex)
		}
		return hex
	}
	getHexFromXY(x, y, decimal=false){
		const hexSize = this.hexSize
		const horiz = ROOT3 * hexSize
		const vert = 1.5 * hexSize
		// let x = (q + 0.5 * r) * horiz - xOffset
		// let y = r * vert - yOffset
		let r = (y + this.yOffset) / vert
		let q = ((x + this.xOffset) / horiz) - 0.5 * r
		if (!decimal){
			let ref = (new Hex(q, r, -q - r)).round()
			let hex = this.getHexAt(ref.q, ref.r)
			return hex
		} else {
			return new Hex(q, r, -q - r)
		}
	}

	getSimulationCollisionHexes(component){
		let result = []
		let homeTile = component.homeTile
		if (component.type === "ArmMechanism"){
			result.push(homeTile)
		}
		let atoms = component.atoms.contents
		for (let atom of atoms){
			let hex = homeTile.add(atom.coord)
			result.push(hex)
		}
		return result
	}
	getSimulationCollisionCircles(component){
		const circles = []
		const toAdd = this.getSimulationCollisionHexes(component)
		const homeTile = component.homeTile
		const homeXY = homeTile.toXY()
		for (let hex of toAdd){
			hex = hex.add(component.offset.scale(component.offsetDistance))
			let size = atomSize
			if (component.type === "ArmMechanism" && hex.equals(component.homeTile)){
				size = armSize
			}
			let circle = hex.toCircle(size)
			if (component.rotation !== 0){
				let angle = component.rotation
				let circleX = circle.x
				let circleY = circle.y
				let homeX = homeXY[0]
				let homeY = homeXY[1]
				let dx = circleX - homeX
				let dy = circleY - homeY
				let x2 = dx * cos(angle) - dy * sin(angle)
				let y2 = dx * sin(angle) + dy * cos(angle)
				let finalX = x2 + homeX
				let finalY = y2 + homeY
				circle.x = finalX
				circle.y = finalY
				circles.push(circle)
			} else {
				circles.push(circle)
			}
		}
		return circles
	}
	getAllSimulationCollisionCircles(){
		//For each component, find the areas it occupies, taking into account non-integer rotation and translation.
		const circles = []
		const level = this.simulation
		const components = level.grid.contents
		for (let component of components){
			const toAdd = this.getSimulationCollisionCircles(component)
			for (let circle of toAdd){
				circles.push(circle)
			}
		}
		return circles
	}
	detectCollisions(){
		const level = this.simulation
		const circles = this.getAllSimulationCollisionCircles()
		let legal = true
		for (let i = 0; i < circles.length; i++){
			let circle1 = circles[i]
			for (let j = i + 1; j < circles.length; j++){
				let circle2 = circles[j]
				if (circle1.intersects(circle2) && this.playbackSpeed > 0){
					window.alert("Some components collided with each other. Reset the simulation and try again.")
					legal = false
					this.playbackSpeed = 0
					playSound("sim_error")
					let r1 = circle1.radius * 1.3
					let r2 = circle2.radius * 1.3
					let box1 = new Rectangle(circle1.x - r1, circle1.y - r1, r1*2, r1*2)
					let box2 = new Rectangle(circle2.x - r2, circle2.y - r2, r2*2, r2*2)
					level.highlightBoxes.push(box1)
					level.highlightBoxes.push(box2)
					break
				}
			}
			if (!legal) break
		}
	}
	placeReagents(){
		//For each reagent, check if it can create a copy of its molecule on the same tile as it.
		//If so, spawn one in.
		const level = this.simulation
		const circles = this.getAllSimulationCollisionCircles()
		const components = level.grid.contents
		for (let component of components){
			const type = component.type
			if (type !== "Reagent") continue
			const homeTile = component.homeTile
			const atoms = component.molecule.atoms.contents
			const intendedCircles = []
			for (let atom of atoms){
				let hex = homeTile.add(atom.coord)
				intendedCircles.push(hex.toCircle(atomSize))
			}
			let canPlace = true
			for (let circle of intendedCircles){
				for (let otherCircle of circles){
					if (circle.intersects(otherCircle)){
						canPlace = false
					}
				}
			}

			if (canPlace){
				const molecule = component.molecule.clone()
				molecule.homeTile = homeTile.clone()
				this.addComponent(molecule, level)
			}
		}
	}
	carryOutGlyphs(){
		//For each glyph, find their inputs and run whatever code that glyph does.
		//For each product, check if an equivalent molecule is on top of it.
		//If so, despawn the molecule.
		const level = this.simulation
		const components = level.grid.contents
		//Find all molecules that are held by something, so we can tell if other molecules aren't.
		const glyphs = []
		const glyphDatas = []
		const glyphHexes = new Map()
		const allMolecules = []
		const heldMolecules = []

		for (let component of components){
			const type = component.type
			switch (type) {
				case "Glyph":
					glyphs.push(component)
					let glyphData = {}
					glyphDatas.push(glyphData)
					glyphData.glyph = component
					glyphData.inputs = {}
					glyphData.inputLocations = {}
					let inputCoords = {}
					let homeTile = component.homeTile
					let inputs = component.inputs.contents
					for (let input of inputs){
						let tile = homeTile.add(input.coord)
						let key = component.inputs.getKey(tile.q, tile.r, tile.s)
						inputCoords[key] = input
						glyphData.inputs[input.name] = null
						glyphData.inputLocations[key] = input
					}
					glyphHexes.set(component, inputCoords)
				break
				case "ArmMechanism":
					let arms = component.arms.contents
					for (let arm of arms){
						let grippedComponent = arm.grippedComponent
						if (grippedComponent && !heldMolecules.includes(grippedComponent)){
							heldMolecules.push(grippedComponent)
						}
					}
				break
				case "Molecule":
					allMolecules.push(component)
				break
			}
		}

		//Now, for each component, find any atoms that are on one of its inputs and log them.
		for (let molecule of allMolecules){
			let atoms = molecule.atoms.contents
			let homeTile = molecule.homeTile
			for (let atom of atoms){
				let tile = homeTile.add(atom.coord)
				let key = molecule.atoms.getKey(tile.q, tile.r, tile.s)
				for (let glyphData of glyphDatas){
					if (key in glyphData.inputLocations){
						let input = glyphData.inputLocations[key]
						//TODO: Some inputs only accept singleton, non-held atoms.
						let name = input.name
						glyphData.inputs[name] = {
							atom: atom,
							molecule: molecule,
							held: heldMolecules.includes(molecule)
						}
					}
				}
			}
		}
		
		//Now we can finally run the code associated with each glyph.
		for (let glyphData of glyphDatas){
			let glyph = glyphData.glyph
			glyph.execute(this, level, glyphData.inputs)
		}
	}
	acceptProducts(){
		//For each product, check if an equivalent molecule is on top of it.
		//If so, despawn the molecule.
		const level = this.simulation
		const components = level.grid.contents
		//Find all molecules that are held by something, so we can tell if other molecules aren't.
		const products = []
		const productHexes = new Map()
		const allMolecules = []
		const heldMolecules = []

		const sortFunction = (a, b) => {
			return (a.q < b.q || (a.q === b.q && a.r < b.r)) ? -1 : 1
		}

		for (let component of components){
			const type = component.type
			switch (type) {
				case "Product":
					products.push(component)
				break
				case "ArmMechanism":
					let arms = component.arms.contents
					for (let arm of arms){
						let grippedComponent = arm.grippedComponent
						if (grippedComponent && !heldMolecules.includes(grippedComponent)){
							heldMolecules.push(grippedComponent)
						}
					}
				break
				case "Molecule":
					allMolecules.push(component)
				break
			}
		}
		for (let product of products){
			let hexes = this.getPlacementCollisionHexes(product)
			hexes.sort(sortFunction)
			productHexes.set(product, hexes)
		}
		for (let molecule of allMolecules){
			if (heldMolecules.includes(molecule)){
				continue
			}
			let hexes = this.getPlacementCollisionHexes(molecule)
			hexes.sort(sortFunction)
			let wasRemoved = false
			for (let product of products){
				let hexes2 = productHexes.get(product)
				if (hexes.length !== hexes2.length) continue
				let isEqual = true
				for (let i = 0; i < hexes.length; i++){
					if (!hexes[i].equals(hexes2[i])){
						isEqual = false
					}
				}
				if (isEqual){
					level.submittedProductCounts[0]++
					this.deleteComponent(molecule, level)
					break
				}
			}
			if (wasRemoved){
				break
			}
		}
	}
	
	getCircleOverlappingHexes(circle){
		let hexes = []
		let closestHex = Hex.fromXY(circle.x, circle.y).round()
		let candidates = [closestHex]
		for (let direction of Hex.directions){
			let next = closestHex.add(direction)
			candidates.push(next)
		}
		for (let hex of candidates){
			let xy = hex.toXY()
			let c = new Circle(xy[0], xy[1], 0.5)
			if (c.intersects(circle)){
				hexes.push(hex)
			}
		}
		return hexes
	}
	getAllSimulationCollisionHexes(){
		let circles = this.getAllSimulationCollisionCircles()
		let hexes = []
		//For each circle, find the hexes that overlap with it.
		for (let circle of circles){
			let toAdd = this.getCircleOverlappingHexes(circle)
			for (let hex of toAdd){
				hexes.push(hex)
			}
		}
		let len = hexes.length
		for (let i = 0; i < len - 1; i++){
			let hex = hexes[i]
			for (let j = i + 1; j < len; j++){
				let hex2 = hexes[j]
				if (hex.equals(hex2)){
					hexes.splice(j, 1)
					len--
					j--
				}
			}
		}
		return hexes
	}
	getAllSimulationAreaHexes(){
		let hexes = []
		let collisions = this.getAllSimulationCollisionHexes()
		for (let hex of collisions){
			hexes.push(hex)
		}

		let placements = this.getAllPlacementCollisionHexes()
		for (let hex of placements){
			let found = false
			for (let otherHex of hexes){
				if (hex.equals(otherHex)){
					found = true
					break
				}
			}
			if (!found){
				hexes.push(hex)
			}
		}

		//Arms have no collision but do affect area
		let level = this.simulation
		let components = level.grid.contents
		for (let component of components){
			if (component.type !== "ArmMechanism") continue
			let arms = component.arms.contents
			let homeTile = component.homeTile
			if (component.offsetDistance){
				homeTile = homeTile.add(component.offset.scale(component.offsetDistance))
			}
			let homeXY = homeTile.toXY()
			for (let arm of arms){
				let handHex = arm.direction.scale(arm.distance).add(homeTile)
				let handXY = handHex.toXY()
				let handX = handXY[0]
				let handY = handXY[1]
				let angle = component.rotation
				if (angle !== 0){
					let cosT = cos(angle)
					let sinT = sin(angle)
					let dx = handX - homeXY[0]
					let dy = handY - homeXY[1]
					let x = dx * cosT - dy * sinT
					let y = dx * sinT + dy * cosT
					handX = x + homeXY[0]
					handY = y + homeXY[1]
				}
				let distance = arm.distance
				for (let i = 1; i <= distance; i++){
					let dx = handX - homeXY[0]
					let dy = handY - homeXY[1]
					dx *= i / distance
					dy *= i / distance
					let circle = new Circle(homeXY[0] + dx, homeXY[1] + dy, atomSize * 1.2)
					let toAdd = this.getCircleOverlappingHexes(circle)
					for (let hex of toAdd){
						hexes.push(hex)
					}
				}
			}
		}

		return hexes
	}
	updateUsedHexes(){
		let hexes = this.getAllSimulationAreaHexes()
		this.addSimulationAreaHexes(hexes)
		let alreadyUsed = this.solutionUsedHexes
		for (let hex of alreadyUsed){
			let levelHex = this.getHexAt(hex.q, hex.r)
			levelHex.active = true
		}
	}
	addSimulationAreaHexes(hexes){
		let alreadyUsed = this.solutionUsedHexes
		for (let hex of hexes){
			let used = false
			for (let usedHex of alreadyUsed){
				if (hex.equals(usedHex)){
					used = true
					break
				}
			}
			if (!used){
				alreadyUsed.push(hex)
			}
		}
	}

	performUIUpdates(){
		this.placeArmsOnTracks(this.currentLevel)
		this.updateComponentPane()
		this.fixPrograms()
		this.renderPrograms()
		this.updateSolutionStats()
	}

	resetSimulation(){
		//we create a simulated copy of the original level that contains all the same things in all the same places.
		//it is this copy that carries out the simulation, so the original settings remain untouched
		//so that way the player can easily reset back to square one. they never leave square one. they just advance to rectangle two.
		this.solutionUsedHexes.length = 0
		this.simulation = new Level(this.currentLevel.scenario)
		for (let [key, value] of this.currentLevel.grid.map){
			this.simulation.grid.addHex(value.clone())
		}
		const components = this.currentLevel.grid.contents
		const simulationComponents = this.simulation.grid.contents
		for (let component of components){
			//Create a copy in the simulation
			let clone = component.clone()
			clone.renderRotationPoint = false
			simulationComponents.push(clone)
		}

		//Attach programs to the new simulation
		const simulationPrograms = this.simulation.programs
		for (let component of simulationComponents){
			if (component.program){
				simulationPrograms.push(component.program)
			}
		}
		this.placeArmsOnTracks(this.simulation)

		//Update programs that have reset instruction
		// for (let program of simulationPrograms){
		// 	let instructions = program.instructions
		// 	for (let i = 0; i < instructions.length; i++){
		// 		let instruction = instructions[i]
		// 		if (instruction.generatedInstructions.length){
		// 			let toAdd = instruction.generatedInstructions
		// 			for (let j = 0; j < toAdd.length; j++){
		// 				instructions[i + j] = toAdd[j]
		// 			}
		// 		}
		// 	}
		// }
		this.performUIUpdates()
	}
	startSimulation(){
		//If any programs are illegal, do nothing.
		this.fixPrograms()
		let programs = this.currentLevel.programs
		for (let program of programs){
			if (!program.isLegal){
				window.alert("There is a problem with one or more programs. Fix the problems before continuing.")
				return
			}
		}
		this.resetSimulation()
		this.simulationTimeStep = 0
		this.simulationDeltaT = 0
		this.playbackSpeed = 1
		this.isPlayingSimulation = true
		$("#program-rows").addClass("playing")
		this.advanceTimeStep(this.simulationTimeStep)
	}
	stopSimulation(){
		this.resetSimulation()
		this.simulationTimeStep = 0
		this.simulationDeltaT = 0
		this.isPlayingSimulation = false
		$("#program-rows").removeClass("playing")
		this.playingAnimations.length = 0
	}
	advanceTimeStep(timestep){
		this.beginAnimatingInstructions(timestep)
		this.applyAllAnimations()
		this.highlightPrograms(timestep - 1)
	}
	beginAnimatingInstructions(timestep){
		//Some things happen the moment a time step starts.
		//Namely, placing reagents onto the board needs to happen before the arms can grab them.
		this.placeReagents()

		//Then, run all glyphs.
		this.carryOutGlyphs()

		//keep a list of each movement that happens to atoms
		//this way we can tell if an illegal action is occuring
		const moleculeMovements = new Map()
		const armsGrippingMolecules = new Map()
		const armMechanismsGrippingMolecules = new Map()
		const components = this.simulation.grid.contents
		for (let component of components){
			switch (component.type){
				case "Molecule":
				moleculeMovements.set(component, [])
				armsGrippingMolecules.set(component, [])
				armMechanismsGrippingMolecules.set(component, [])
				break
			}
		}

		//get each instruction that should be executed right now and add them to the list of animations
		const programs = this.simulation.programs
		for (let program of programs){
			const instruction = program.getInstruction(timestep)
			if (!instruction) continue
			const instructionType = instruction.type.id
			const component = program.component
			const mechanismType = component.mechanismType
			const abilities = mechanismType.abilities
			if (instructionType in abilities && !abilities[instructionType]) continue
			const homeTile = component.homeTile
			switch (instructionType){
				case "rotator_cw": {
					let animation = {
						type: "set_rotation",
						target: component,
						startT: timestep,
						endT: timestep + 1,
						startV: component.rotation,
						endV: component.rotation + Math.PI / 3
					}
					this.playingAnimations.push(animation)

					//Rotate any molecules gripped by arms
					const arms = component.arms.contents
					for (let arm of arms){
						if (!arm.grippedComponent) continue
						const molecule = arm.grippedComponent
						molecule.moveOrigin(homeTile)
						let animation = {
							type: "set_rotation",
							target: molecule,
							startT: timestep,
							endT: timestep + 1,
							startV: molecule.rotation,
							endV: molecule.rotation + Math.PI / 3
						}
						this.playingAnimations.push(animation)
						moleculeMovements.get(molecule).push(animation)
					}
				} break
				case "rotator_ccw": {
					let animation = {
						type: "set_rotation",
						target: component,
						startT: timestep,
						endT: timestep + 1,
						startV: component.rotation,
						endV: component.rotation - Math.PI / 3
					}
					this.playingAnimations.push(animation)

					//Rotate any molecules gripped by arms
					const arms = component.arms.contents
					for (let arm of arms){
						if (!arm.grippedComponent) continue
						const molecule = arm.grippedComponent
						molecule.moveOrigin(homeTile)
						let animation = {
							type: "set_rotation",
							target: molecule,
							startT: timestep,
							endT: timestep + 1,
							startV: molecule.rotation,
							endV: molecule.rotation - Math.PI / 3
						}
						this.playingAnimations.push(animation)
						moleculeMovements.get(molecule).push(animation)
					}
				} break
				case "grabber_grab": {
					if (component.isGrabbing) break
					component.isGrabbing = true
					let animation = {
						type: "set_grab_animation",
						target: component,
						startT: timestep,
						endT: timestep + 1,
						startV: 0,
						endV: 1
					}
					this.playingAnimations.push(animation)
					const arms = component.arms.contents
					for (let arm of arms){
						const targetHex = homeTile.add(arm.direction.scale(arm.distance)).round()
						//find the first molecule that has an atom at that hex.
						const components = this.simulation.grid.contents
						let targetMolecule = null
						for (let otherComponent of components){
							if (otherComponent.type !== "Molecule") continue
							const hexes = this.getSimulationCollisionHexes(otherComponent)
							for (let hex of hexes){
								if (hex.equals(targetHex)){
									targetMolecule = otherComponent
									break
								}
							}
							if (targetMolecule) break
						}
						if (targetMolecule){
							arm.grippedComponent = targetMolecule
						}
					}
				} break
				case "grabber_drop": {
					if (!component.isGrabbing) break
					component.isGrabbing = false
					let animation = {
						type: "set_grab_animation",
						target: component,
						startT: timestep,
						endT: timestep + 1,
						startV: 1,
						endV: 0
					}
					this.playingAnimations.push(animation)
					const arms = component.arms.contents
					for (let arm of arms){
						arm.grippedComponent = null
					}
				} break
				case "piston_extend": {
					const arms = component.arms.contents
					const firstArm = arms[0]
					const mechanismType = component.mechanismType
					if (firstArm.distance >= mechanismType.abilities["max_length"]) break
					const animation = {
						type: "set_all_arm_length",
						target: component,
						startT: timestep,
						endT: timestep + 1,
						startV: firstArm.distance,
						endV: firstArm.distance + 1
					}
					this.playingAnimations.push(animation)

					//Translate each item those arms were connected to
					for (let arm of arms){
						if (!arm.grippedComponent) continue
						let molecule = arm.grippedComponent
						let distance = 1
						molecule.offset = arm.direction
						const moleculeAnimation = {
							type: "set_offset",
							target: molecule,
							startT: timestep,
							endT: timestep + 1,
							startV: 0,
							endV: distance,
							direction: arm.direction
						}
						this.playingAnimations.push(moleculeAnimation)
						moleculeMovements.get(molecule).push(moleculeAnimation)
					}
				} break
				case "piston_retract": {
					const arms = component.arms.contents
					const firstArm = arms[0]
					const mechanismType = component.mechanismType
					if (firstArm.distance <=  mechanismType.abilities["min_length"]) break
					const animation = {
						type: "set_all_arm_length",
						target: component,
						startT: timestep,
						endT: timestep + 1,
						startV: firstArm.distance,
						endV: firstArm.distance - 1
					}
					this.playingAnimations.push(animation)

					//Translate each item those arms were connected to
					for (let arm of arms){
						if (!arm.grippedComponent) continue
						let molecule = arm.grippedComponent
						let distance = -1
						molecule.offset = arm.direction
						const moleculeAnimation = {
							type: "set_offset",
							target: molecule,
							startT: timestep,
							endT: timestep + 1,
							startV: 0,
							endV: distance,
							direction: arm.direction
						}
						this.playingAnimations.push(moleculeAnimation)
						moleculeMovements.get(molecule).push(moleculeAnimation)
					}
				} break
				case "pivot_cw": {
					//Rotate any molecules gripped by arms
					const arms = component.arms.contents
					for (let arm of arms){
						if (!arm.grippedComponent) continue
						const molecule = arm.grippedComponent
						const handLocation = homeTile.add(arm.direction.scale(arm.distance)).round()
						molecule.moveOrigin(handLocation)
						let animation = {
							type: "set_rotation",
							target: molecule,
							startT: timestep,
							endT: timestep + 1,
							startV: molecule.rotation,
							endV: molecule.rotation + Math.PI / 3
						}
						this.playingAnimations.push(animation)
						moleculeMovements.get(molecule).push(animation)
					}
				} break
				case "pivot_ccw": {
					//Rotate any molecules gripped by arms
					const arms = component.arms.contents
					for (let arm of arms){
						if (!arm.grippedComponent) continue
						const molecule = arm.grippedComponent
						const handLocation = homeTile.add(arm.direction.scale(arm.distance)).round()
						molecule.moveOrigin(handLocation)
						let animation = {
							type: "set_rotation",
							target: molecule,
							startT: timestep,
							endT: timestep + 1,
							startV: molecule.rotation,
							endV: molecule.rotation - Math.PI / 3
						}
						this.playingAnimations.push(animation)
						moleculeMovements.get(molecule).push(animation)
					}
				} break
				case "track_advance": {
					let track = component.attachedTrack
					if (!track) break
					let index = component.attachedTrackIndex
					let trackPieces = track.trackPieces
					if (!track.loops && index === trackPieces.length - 1) break
					let nextIndex = (index + 1) % trackPieces.length
					let curPiece = trackPieces[index]
					let nextPiece = trackPieces[nextIndex]
					let diff = nextPiece.coord.subtract(curPiece.coord)
					component.offset = diff
					const animation = {
						type: "set_offset",
						target: component,
						startT: timestep,
						endT: timestep + 1,
						startV: 0,
						endV: 1,
						direction: diff
					}
					this.playingAnimations.push(animation)
					
					const animation2 = {
						type: "set_track_index",
						target: component,
						startT: timestep,
						endT: timestep + 1,
						startV: index,
						endV: nextIndex
					}
					this.playingAnimations.push(animation2)

					const arms = component.arms.contents
					for (let arm of arms){
						if (!arm.grippedComponent) continue
						let molecule = arm.grippedComponent
						molecule.offset = diff
						const moleculeAnimation = {
							type: "set_offset",
							target: molecule,
							startT: timestep,
							endT: timestep + 1,
							startV: 0,
							endV: 1,
							direction: diff
						}
						this.playingAnimations.push(moleculeAnimation)
						moleculeMovements.get(molecule).push(moleculeAnimation)
					}
				} break
				case "track_retreat": {
					let track = component.attachedTrack
					if (!track) break
					let index = component.attachedTrackIndex
					let trackPieces = track.trackPieces
					if (!track.loops && index === 0) break
					let nextIndex = (index - 1 + trackPieces.length) % trackPieces.length
					let curPiece = trackPieces[index]
					let nextPiece = trackPieces[nextIndex]
					let diff = nextPiece.coord.subtract(curPiece.coord)
					component.offset = diff
					const animation = {
						type: "set_offset",
						target: component,
						startT: timestep,
						endT: timestep + 1,
						startV: 0,
						endV: 1,
						direction: diff
					}
					this.playingAnimations.push(animation)
					
					const animation2 = {
						type: "set_track_index",
						target: component,
						startT: timestep,
						endT: timestep + 1,
						startV: index,
						endV: nextIndex
					}
					this.playingAnimations.push(animation2)

					const arms = component.arms.contents
					for (let arm of arms){
						if (!arm.grippedComponent) continue
						let molecule = arm.grippedComponent
						molecule.offset = diff
						const moleculeAnimation = {
							type: "set_offset",
							target: molecule,
							startT: timestep,
							endT: timestep + 1,
							startV: 0,
							endV: 1,
							direction: diff
						}
						this.playingAnimations.push(moleculeAnimation)
						moleculeMovements.get(molecule).push(moleculeAnimation)
					}
				} break
			}
		}

		//Update which arms are gripping which molecules
		for (let component of components){
			if (component.type !== "ArmMechanism") continue
			let arms = component.arms.contents
			for (let arm of arms){
				if (arm.grippedComponent && armsGrippingMolecules.has(arm.grippedComponent)){
					armsGrippingMolecules.get(arm.grippedComponent).push(arm)
					armMechanismsGrippingMolecules.get(arm.grippedComponent).push(component)
				}
			}
		}

		//Now go through each molecule to see if it was animated in an illegal way
		let illegalAnimation = false
		let illegalMolecules = []
		for (let [molecule, animations] of moleculeMovements){
			if (animations.length === 0) continue
			const rotations = animations.filter(animation => animation.type === "set_rotation")
			//A molecule can never be rotated around two points at once.
			if (rotations.length > 1) {
				illegalAnimation = true
				window.alert("A molecule was moved in an impossible way. You can't rotate a molecule in two ways at once.")
				illegalMolecules.push(molecule)
				console.trace()
			}
			const offsets = animations.filter(animation => animation.type === "set_offset")
			//You can't ever rotate and translate a molecule at the same time.
			if (offsets.length && rotations.length){
				illegalAnimation = true
				window.alert("A molecule was moved in an impossible way. You can't rotate and move a molecule at the same time.")
				illegalMolecules.push(molecule)
				console.trace()
				break
			}
			//And it's hard but possible to translate a molecule more than once at a time.
			if (offsets.length > 1){
				let firstOffset = offsets[0]
				let dir = firstOffset.direction
				let diff = firstOffset.endV - firstOffset.startV
				let firstTotal = dir.scale(diff)
				for (let i = 1; i < offsets.length; i++){
					let offset = offsets[i]
					let dir = offset.direction
					let diff = offset.endV - offset.startV
					let total = dir.scale(diff)
					if (!total.equals(firstTotal)){
						illegalAnimation = true
						break
					}
				}
				if (illegalAnimation){
					illegalAnimation = true
					window.alert("A molecule was moved in an impossible way. A molecule can't be moved in two directions at once.")
					illegalMolecules.push(molecule)
					console.trace()
					break
				}
				//Regardless of how legal it is, we need to remove the duplicate instructions to translate the molecule in the same way.
				else {
					let firstOffset = offsets[0]
					molecule.offset = firstOffset.direction
					for (let i = 1; i < offsets.length; i++){
						let offset = offsets[i]
						this.playingAnimations.splice(this.playingAnimations.indexOf(offset), 1)
					}
				}
			}

			//For all moving molecules, ensure that all arms that are gripping that molecule are being animated in a valid way.
			const armsGripping = armsGrippingMolecules.get(molecule)
			const mechsGripping = armMechanismsGrippingMolecules.get(molecule)
			const mechanismsGripping = armMechanismsGrippingMolecules.get(molecule)
			for (let offset of offsets){
				let dir = offset.direction
				let diff = offset.endV - offset.startV
				let moleculeTotal = dir.scale(diff)
				//For each mechanism gripping this molecule, there ought to be either:
				//A) An identical offset being applied to the arm.
				//B) A change to the arm's length that produces the same offset.
				for (let mechanism of mechanismsGripping){
					let animations = this.playingAnimations.filter(animation => animation.target === mechanism)
					let offsets = animations.filter(animation => animation.type === "set_offset")
					let lengthChanges = animations.filter(animation => animation.type === "set_all_arm_length")
					if (offsets.length + lengthChanges.length === 0) {
						illegalAnimation = true
						window.alert("A molecule an arm is gripping is moving without the arm following it.")
						illegalMolecules.push(molecule)
						console.trace()
						break
					}
					if (offsets.length + lengthChanges.length > 1) {
						illegalAnimation = true
						window.alert("An arm can't have both its length and location change in more than one way at once.")
						illegalMolecules.push(molecule)
						break
					}
					if (offsets.length){
						//Ensure that this offset produces the same change as the total change to the molecule.
						let firstOffset = offsets[0]
						let dir = firstOffset.direction
						let diff = firstOffset.endV - firstOffset.startV
						let armTotal = dir.scale(diff)
						if (!armTotal.equals(moleculeTotal)){
							illegalAnimation = true
							window.alert("A molecule an arm is gripping is moving in a different way than the arm that's gripping it.")
							illegalMolecules.push(molecule)
							console.trace()
							break
						}
					} else if (lengthChanges.length){
						let lengthChange = lengthChanges[0]
						let lengthDiff = lengthChange.endV - lengthChange.startV
						let arms = mechanism.arms.contents.filter(arm => arm.grippedComponent === molecule)
						for (let arm of arms){
							let armTotal = arm.direction.scale(lengthDiff)
							if (!armTotal.equals(moleculeTotal)){
								illegalAnimation = true
								window.alert("A molecule an arm is gripping is moving in a different way than the arm that's gripping it.")
								illegalMolecules.push(molecule)
								console.trace()
								break
							}
						}
					}
				}
				if (illegalAnimation){
					break
				}
			}

			//It's impossible to have two arms holding an atom at the same time AND rotate the atom somehow.
			//UNLESS the molecule is pivoting AND each arm is gripping the same atom
			if (rotations.length && armsGripping.length > 1){
				let onAtom = false
				let homeTile = molecule.homeTile
				let zero = new Hex(0, 0, 0)
				for (let atom of molecule.atoms.contents){
					if (atom.coord.equals(zero)){
						onAtom = true
						break
					}
				}
				if (onAtom){
					//The atom is being pivoted.
					let bad = false
					for (let mechanism of mechsGripping){
						for (let arm of mechanism.arms.contents){
							if (!armsGripping.includes(arm)) continue
							if (!homeTile.equals(mechanism.homeTile)){
								bad = true
								break
							}
						}
						if (bad){
							break
						}
					}
					if (bad){
						illegalAnimation = true
						window.alert("A molecule was moved in an impossible way. Two arms are trying to pivot it in different ways.")
						illegalMolecules.push(molecule)
						console.trace()
						break
					}
				} else {
					//The atom is being rotated about another point.
					if (mechsGripping.length > 1){
						illegalAnimation = true
						window.alert("A molecule was moved in an impossible way. Two arms are trying to rotate it in different ways.")
						illegalMolecules.push(molecule)
						console.trace()
						break
					}
				}
			}
			if (illegalAnimation){
				break
			}
		}
		if (illegalAnimation){
			playSound("sim_error")
			this.playbackSpeed = 0
			for (let molecule of illegalMolecules){
				let circles = this.getSimulationCollisionCircles(molecule)
				let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
				for (let circle of circles){
					if (circle.x - circle.radius < minX){
						minX = circle.x - circle.radius
					}
					if (circle.x + circle.radius > maxX){
						maxX = circle.x + circle.radius
					}
					if (circle.y - circle.radius < minY){
						minY = circle.y - circle.radius
					}
					if (circle.y + circle.radius > maxY){
						maxY = circle.y + circle.radius
					}
				}
				let box = new Rectangle(minX, minY, maxX - minX, maxY - minY)
				this.simulation.highlightBoxes.push(box)
				break
			}
		}

		//Then, see if the player has satisfied any of the products, and accept them.
		this.acceptProducts()
	}

	placeArmsOnTracks(level){
		const components = level.grid.contents
		const arms = components.filter(component => component.type === "ArmMechanism")
		const tracks = components.filter(component => component.type === "Track")
		for (let arm of arms){
			let onTrack = false
			for (let track of tracks){
				let trackPieces = track.trackPieces
				let found = false
				for (let i = 0; i < trackPieces.length; i++){
					let trackPiece = trackPieces[i]
					let hex = track.homeTile.add(trackPiece.coord)
					if (hex.equals(arm.homeTile)){
						found = true
						onTrack = true
						arm.attachedTrack = track
						arm.attachedTrackIndex = i
						break
					}
				}
				if (found) break
			}
			if (!onTrack){
				arm.attachedTrack = null
				arm.attachedTrackIndex = null
			}
		}
	}

	applyAnimation(animation, p){
		const component = animation.target
		switch (animation.type){
			case "set_rotation": {
				const v = lerp(animation.startV, animation.endV, p)
				component.rotation = v
			} break
			case "set_all_arm_length": {
				const arms = component.arms.contents
				const v = lerp(animation.startV, animation.endV, p)
				for (let arm of arms){
					arm.distance = v
				}
			} break
			case "set_offset": {
				const v = lerp(animation.startV, animation.endV, p)
				component.offsetDistance = v
			} break
			case "set_grab_animation": {
				const v = lerp(animation.startV, animation.endV, p)
				component.grabAnimationProgress = v
			} break
		}
	}
	applyAllAnimations(){
		//apply each ongoing animation to the appropriate components.
		const st = this.simulationTimeStep + this.simulationDeltaT
		const animations = this.playingAnimations
		for (let i = 0; i < animations.length; i++){
			let animation = animations[i]
			let startT = animation.startT, endT = animation.endT
			if (st >= endT){
				this.finishAnimation(animation)
				animations.splice(i, 1)
				i--
				continue
			}
			let p = (st - startT) / (endT - startT)
			p = clamp(p, 0, 1)
			this.applyAnimation(animation, p)
		}
	}
	finishAnimation(animation){
		const component = animation.target
		switch (animation.type){
			case "set_rotation": {
				let difference = animation.endV - animation.startV
				let hexesPassedThrough = component.getRotationHexFootprint(difference)
				this.addSimulationAreaHexes(hexesPassedThrough)
				if (difference > 0){
					component.rotation = 0
					component.rotateRight()
				} else if (difference < 0){
					component.rotation = 0
					component.rotateLeft()
				}
			} break
			case "set_all_arm_length": {
				const arms = component.arms.contents
				const v = animation.endV
				for (let arm of arms){
					arm.distance = v
				}
			} break
			case "set_offset": {
				const v = animation.endV
				let translation = component.offset.scale(floor(v)).round()
				component.homeTile = component.homeTile.add(translation)
				component.offsetDistance = 0
			} break
			case "set_track_index": {
				component.attachedTrackIndex = animation.endV
			} break
			case "set_grab_animation": {
				component.grabAnimationProgress = animation.endV
			} break
		}
	}

	getPrice(component){
		let prices = this.currentLevel.scenario.prices
		let price = 0
		if (component.type === "Track"){
			price = component.trackPieces.length * 5
		}
		else if (component.type === "ArmMechanism"){
			price = component.mechanismType.defaultPrice
		}

		return price
	}
	getTotalCost(){
		let sum = 0
		let components = this.currentLevel.grid.contents
		for (let component of components){
			let price = this.getPrice(component)
			sum += price
		}
		return sum
	}
	getTotalInstructions(){
		let totalInstructions = 0
		let programs = this.currentLevel.programs
		for (let program of programs){
			let instructions = program.instructions
			for (let instruction of instructions){
				if (instruction.type.id === "idle") continue
				totalInstructions++
			}
		}
		return totalInstructions
	}

	updateSolutionStats(){
		let statsTag = $("#program-stats")
		let priceTag = statsTag.find(".program-stat[data-stat='cost']")
		priceTag.children(".program-stat-val").text(this.getTotalCost())
		.append($("<span>").addClass("tiny-g").text("G"))
		let cycleTag = statsTag.find(".program-stat[data-stat='cycle']")
		cycleTag.children(".program-stat-val").text(this.simulationTimeStep)
		let areaTag = statsTag.find(".program-stat[data-stat='area']")
		areaTag.children(".program-stat-val").text(this.solutionUsedHexes.length)

		let productTag = statsTag.find(".program-stat[data-stat='products']")
		let totalProducts = 0
		let submittedProductCounts = this.simulation.submittedProductCounts
		let neededProducts = submittedProductCounts.length * submissionsPerProduct
		for (let count of submittedProductCounts){
			totalProducts += min(submissionsPerProduct, count)
		}
		productTag.children(".program-stat-val").text(`${totalProducts}/${neededProducts}`)

		let totalInstructions = this.getTotalInstructions()
		let instructionTag = statsTag.find(".program-stat[data-stat='instructions']")
		instructionTag.children(".program-stat-val").text(totalInstructions)
	}

	tick(){
		const now = performance.now()
		const dt = now - this.lastTick
		this.lastTick = now
		const controls = this.controls

		//Playback keyboard controls
		if (controls.justPressed(" ")){
			if (this.isPlayingSimulation && this.playbackSpeed > 0){
				$("#playback-pause-button").click()
			} else {
				$("#playback-play-button").click()
			}
		}
		if (controls.justPressed("Tab")){
			$("#playback-advance-button").click()
		}
		if (controls.justPressed("Escape")){
			if (this.isPlayingSimulation){
				$("#playback-stop-button").click()
			} else {
				this.exit()
			}
		}

		//Advance time
		if (this.isPlayingSimulation && this.playbackSpeed > 0 && dt > 0){
			//Increase time slightly.
			this.simulationDeltaT += this.playbackSpeed * (dt / msPerCycle)
			// this.simulationDeltaT += 1
			this.placeReagents()

			this.applyAllAnimations()

			let ticks = 0
			while (this.simulationDeltaT >= 1){
				//finish all ongoing animations maybe?
				ticks++
				this.simulationTimeStep++
				this.simulationDeltaT--
				this.advanceTimeStep(this.simulationTimeStep)
			}
			if (ticks > 0 && this.stopSimulationAtNextTimeStep){
				if (this.simulationTimeStep >= this.stopSimulationAtTimeStep){
					this.stopSimulationAtNextTimeStep = false
					this.playbackSpeed = 0
					this.simulationDeltaT = 0
					this.applyAllAnimations()
				}
			}
			
			this.detectCollisions()
			this.updateUsedHexes()
			this.updateSolutionStats()
		}
		//Handle winning
		if (this.isPlayingSimulation && this.playbackSpeed > 0 && dt > 0){
			let submittedProductCounts = this.simulation.submittedProductCounts
			let won = true
			for (let productCount of submittedProductCounts){
				if (productCount < submissionsPerProduct){
					won = false
					break
				}
			}
			if (won){
				this.win()
			}
		}

		let mouseX = controls.mouse.x
		let mouseY = controls.mouse.y
		let hoveredHex = this.getHexFromXY(mouseX, mouseY)
		if (this.hoveredHex && !this.isPlayingSimulation) this.hoveredHex.active = false
		this.hoveredHex = hoveredHex
		if (!this.isPlayingSimulation) hoveredHex.active = true

		const isLeftClicking = controls.isClicking("left")
		const isMouseOnScreen = controls.isMouseOnScreen()

		//Finding whether we should show any components' rotation points
		const components = this.currentLevel.grid.contents
		for (let component of components){
			component.renderRotationPoint = false
		}
		if (isMouseOnScreen){
			for (let component of components){
				//1-atom products and reagents don't need a rotation point.
				if (component.type === "Product" || component.type === "Reagent"){
					if (component.molecule.atoms.contents.length <= 1){
						continue
					}
				}
				if (hoveredHex.equals(component.homeTile)){
					component.renderRotationPoint = true
				} else {
					let rotationHex = component.homeTile.add(component.rotationPoint)
					let rotationXY = rotationHex.toXY()
					let rotationCircle = new Circle(rotationXY[0], rotationXY[1], 0.5)
					let mouseXY = this.getHexFromXY(mouseX, mouseY, true).toXY()
					if (rotationCircle.contains(mouseXY[0], mouseXY[1])){
						component.renderRotationPoint = true
					}
				}
			}
		}

		//Component placement
		if (this.selectedComponent){
			this.updateComponentPane()
			if (!this.isAdjustingComponent){
				//This code runs while the player is moving a component
				if (isLeftClicking && isMouseOnScreen && hoveredHex){
					this.selectedComponent.homeTile = hoveredHex
					this.selectedComponent.isRendered = true
				}
				else if (!isLeftClicking && isMouseOnScreen && hoveredHex){
					//If the proposed placement is legal, place it. Otherwise, cancel.
					this.tryToPlaceSelectedComponent()
				}
				else if (!isLeftClicking){
					this.cancelPlacement()
				}
				//If the player drags a previously-placed component offscreen, delete it.
				else if (!isMouseOnScreen && this.selectedComponent.lastPlacement){
					this.cancelPlacement(true)
				}
			} else if (this.selectedComponent.type !== "Track") {
				//This code runs while the player is adjusting a component's rotation or arm length
				let component = this.selectedComponent
				let mouseXY = this.getHexFromXY(mouseX, mouseY, true).toXY()
				let homeXY = component.homeTile.toXY()
				let rotationPoint = component.rotationPoint.add(component.homeTile)
				let rotationCoords = rotationPoint.toXY()
				//Look I'll admit this was hard and I needed to do math, shut up.
				//By getting the sign of the cross product, we can tell whether the
				//player's mouse is rotating the component left or rigjt.
				let A = {
					x: mouseXY[0],
					y: mouseXY[1]
				}
				let B = {
					x: homeXY[0],
					y: homeXY[1]
				}
				let C = {
					x: rotationCoords[0],
					y: rotationCoords[1]
				}
				let cross = cross_product(A.x, A.y, B.x, B.y, C.x, C.y)
				let side = cross < 0 ? "left" : "right"
				let angle = find_angle(A, B, C)
				if (angle > Math.PI / 6){
					if (side === "left"){
						component.rotateLeft()
					} else {
						component.rotateRight()
					}
				}
				if (component.type === "ArmMechanism"){
					const mechanismType = component.mechanismType
					const minLength = mechanismType.abilities["min_length"]
					const maxLength = mechanismType.abilities["max_length"]
					let intendedDistance = component.homeTile.distance(hoveredHex)
					intendedDistance = max(minLength, min(intendedDistance, maxLength))
					let arms = component.arms.contents
					let changed = false
					for (let arm of arms){
						//TODO: If the arm has any molecules it's holding, translate them accordingly.
						if (arm.distance < intendedDistance){
							changed = true
							arm.distance++
						} else if (arm.distance > intendedDistance){
							changed = true
							arm.distance--
						}
					}
					if (changed){
						let firstArm = arms[0]
						let difference = firstArm.direction.scale(firstArm.distance)
						component.rotationPoint = difference
						playSound("piece_modify")
					}
				}

				if (!isLeftClicking){
					this.tryToPlaceSelectedComponent()
				}
			} else {
				//This code only runs while trying to adjust tracks.
				//The player can only add or remove adjacent tiles from the track.
				let track = this.selectedComponent
				let trackTiles = track.trackPieces.map(piece => track.homeTile.add(piece.coord))
				//If the player is hovering over a Hex that is adjacent to the end tile,
				//AND that tile is empty, add it to the track.
				let finalTile = trackTiles[trackTiles.length - 1]
				if (finalTile.distance(hoveredHex) === 1){
					let legalAdd = true
					//A track may not contain any tiles twice.
					for (let hex of trackTiles){
						if (hex.equals(hoveredHex)){
							legalAdd = false
						}
					}
					
					//A track may not be placed onto an existing non-Arm component.
					if (legalAdd){
						let takenHexes = []
						for (let component of components){
							if (component === track) continue
							if (component.type === "ArmMechanism") continue
							let hexes = this.getPlacementCollisionHexes(component)
							for (let hex of hexes){
								takenHexes.push(hex)
							}
						}
						for (let hex of takenHexes){
							if (hex.equals(hoveredHex)){
								legalAdd = false
							}
						}
					}

					if (legalAdd){
						let trackCoord = hoveredHex.subtract(track.homeTile)
						track.addTrackPiece(trackCoord, true)
						this.placeArmsOnTracks(this.currentLevel)
					} else if (trackTiles.length > 1) {
						//Perhaps the player is trying to remove a tile?
						let prevTile = trackTiles[trackTiles.length - 2]
						if (prevTile.equals(hoveredHex)){
							track.removeFinalTrackPiece()
							this.placeArmsOnTracks(this.currentLevel)
						}
					}
				}

				if (!isLeftClicking){
					this.tryToPlaceSelectedComponent()
				}
			}
		} else if (controls.justClicked("left") && !this.isPlayingSimulation){
			//check if the player just clicked on a component they can move
			const components = this.currentLevel.grid.contents
			for (let i = components.length - 1; i >= 0; i--){
				let component = components[i]
				let hexes = this.getPlacementCollisionHexes(component)
				let rotationPoint = component.rotationPoint.add(component.homeTile)
				//Did the player just click on the component's rotation point?
				let isAdjusting = false

				let rotationCoords = rotationPoint.toXY()
				let rotationCircle = new Circle(rotationCoords[0], rotationCoords[1], 0.5)
				let mouseXY = this.getHexFromXY(mouseX, mouseY, true).toXY()
				if (component.renderRotationPoint && rotationCircle.contains(mouseXY[0], mouseXY[1])){
					isAdjusting = true
				}

				if (isAdjusting || hexes.some(hex => hex.equals(hoveredHex))){
					if (!isAdjusting){
						playSound("piece_pickup")
					}
					this.beginHoldingComponent(component, isAdjusting)
					break
				}
			}
		}

		//Map dragging
		if (controls.justClicked("left")){
			this.isDraggingMap = true
		}
		if (!isMouseOnScreen || !isLeftClicking || this.selectedComponent) {
			this.isDraggingMap = false
		}
		if (this.isDraggingMap){
			let records = controls.mouse.records
			let prev = records[records.length - 2]
			let cur = records[records.length - 1]
			let dx = prev[0] - cur[0]
			let dy = prev[1] - cur[1]
			this.xOffset += dx
			this.yOffset += dy
			this.resizeScreen()
		}

		//instruction keyboard controls
		let continueHoldingInstructions = isLeftClicking
		for (let instructionId in INSTRUCTIONS){
			let instructionType = INSTRUCTIONS[instructionId]
			let key = instructionType.key
			let pressing = controls.isPressing(key)
			if (pressing && (controls.justPressed(key) || !this.heldInstructions.length)){
				let instruction = new Instruction(instructionType)
				this.beginHoldingInstruction(instruction)
			}
			if (pressing){
				continueHoldingInstructions = true
			}
		}

		//Instruction placement
		if (this.heldInstructions.length){
			if (!continueHoldingInstructions){
				this.endHoldingInstructions()
			}
		} else if (this.overrideInstructionMouseUp && !isLeftClicking){
			this.overrideInstructionMouseUp = false
		}

		//Fast-forward step keyboard controls
		if (controls.isPressing("Alt")){
			$("#program-rows-wrapper").addClass("ready-fast-forward")
		} else {
			$("#program-rows-wrapper").removeClass("ready-fast-forward")
		}

		//Click-and-drag boxes.
		if (this.isDraggingBox){
			if (!isLeftClicking){
				this.isDraggingBox = false
				this.dragBox = null
			} else {
				let clientX = controls.mouse.clientX
				let clientY = controls.mouse.clientY
				this.dragBox.setRect(clientX, clientY)
			}
		}

		controls.tick()
	}
}