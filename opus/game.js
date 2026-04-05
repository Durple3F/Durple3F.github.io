import {Hex, Grid, Component, Atom, loadSprite, Molecule, ArmMechanism, ARMTYPES, Reagent, tagHierarchy, lerp, clamp, Product, createMolecule, Circle, find_angle, cross_product} from "./util.js"
import { SCENARIOS } from "./scenarios.js"
import { createInstructionTag, Instruction, INSTRUCTIONS } from "./instructions.js"
import { Glyph } from "./glyphs.js"
import { armSize, atomSize } from "./config.js"
import { Track, TrackPiece } from "./track.js"

const min = Math.min
const max = Math.max
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
		this.submittedProductCounts = [0]
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
		this.elem = null
	}

	clone(component=null){
		let clone = new Program(component ?? this.component, this.name)
		clone.startStep = this.startStep
		clone.period = this.period
		clone.instructions = this.instructions
		clone.elem = this.elem
		return clone
	}

	createElement(){
		let programRow = $("<div>").addClass("program-row")
		this.elem = programRow
		let programName = $("<div>").addClass("program-name").text(this.name)
		$("#program-names").append(programName)
		$("#program-rows").append(programRow)
	}

	getInstruction(timestep){
		if (timestep < this.instructions.length){
			return this.instructions[timestep]
		} else if (timestep >= this.instructions.length && this.period > 0){
			let offset = timestep - this.startStep
			let instruction = this.instructions[this.startStep + (offset % this.period)]
			return instruction
		}
	}
}

export class Game{
	constructor(canvas, controls){
		this.controls = controls
		this.lastTick = performance.now()
		this.isDraggingMap = false
		this.selectedComponent = null
		this.isAdjustingComponent = false
		this.heldInstruction = null
		this.heldInstructions = []

		let scenario = SCENARIOS["test"]
		this.currentLevel = new Level(scenario)
		this.simulation = new Level(scenario)
		this.isPlayingSimulation = false
		this.simulationTimeStep = 0
		this.simulationDeltaT = 0
		this.playbackSpeed = 1
		this.playingAnimations = []

		this.hexSize = 40
		this.canvas = canvas
		this.canvasWidth = canvas.width
		this.canvasHeight = canvas.height
		this.xOffset = -0.5 * canvas.width
		this.yOffset = -0.5 * canvas.height
		this.hoveredHex = null
		this.initialize()
		this.fillComponentPane()
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
			let moleculeName = productMolecule.name
			let molecule = createMolecule(productMolecule.molecule)
			let componentTag = $("<div class='component'>")
			componentTag.text(moleculeName)
			productsPane.append(componentTag)
			componentTag.attr("data-available", true)
			componentTag.on("mousedown", () => {
				let component = new Product(molecule)
				this.beginHoldingComponent(component)
				this.selectedComponent.isRendered = false
			})
		}

		for (let reagentMolecule of reagentMolecules){
			let moleculeName = reagentMolecule.name
			let molecule = createMolecule(reagentMolecule.molecule)
			let componentTag = $("<div class='component'>")
			componentTag.text(moleculeName)
			reagentsPane.append(componentTag)
			componentTag.attr("data-available", true)
			componentTag.on("mousedown", () => {
				let component = new Reagent(molecule)
				this.beginHoldingComponent(component)
				this.selectedComponent.isRendered = false
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

		for (let glyphName of allowedGlyphs){
			let componentTag = $("<div class='component'>")
			componentTag.text(glyphName)
			glyphsPane.append(componentTag)
			componentTag.attr("data-available", true)
			componentTag.on("mousedown", () => {
				let component = new Glyph(glyphName)
				this.beginHoldingComponent(component)
				this.selectedComponent.isRendered = false
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
	}
	deleteComponent(component, level){
		if (!level){
			level = this.currentLevel
		}
		const contents = level.grid.contents
		let index = contents.indexOf(component)
		if (index !== -1){
			contents.splice(index, 1)
		}
	}

	initialize(){
		this.resizeScreen()
		this.getHexAt(0, 0).active = true
	}

	beginHoldingInstruction(instruction){
		this.beginHoldingInstructions([[instruction]])
	}
	beginHoldingInstructions(instructionsList){
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

		this.renderPrograms()
	}
	endHoldingInstructions(){
		this.heldInstructions = []
		$("#tooltip").empty()
	}
	handleProgramMouseMove(event, program, component){
		let row = program.elem[0]
		let rect = row.getBoundingClientRect()
		let mouseX = event.clientX - rect.x
		let mouseY = event.clientY - rect.y
	}
	handleProgramMouseUp(event, program, component){
		//if the player was holding an instruction, place it.
		//Otherwise, do nothing.
		if (!this.heldInstructions.length){
			return
		}
		let instruction = this.heldInstructions[0][0]

		//If the player is moving this instruction, first remove it from any row it was in.
		let programs = this.currentLevel.programs
		let originalProgram = null
		let originalIndex = null
		for (let levelProgram of programs){
			let instructions = levelProgram.instructions
			if (instructions.includes(instruction)){
				let index = instructions.indexOf(instruction)
				// let replacement = new Instruction(INSTRUCTIONS["idle"])
				// instructions.splice(index, 1, replacement)
				// delete instructions[index]
				originalProgram = levelProgram
				originalIndex = index
				break
			}
		}

		let row = program.elem[0]
		let rect = row.getBoundingClientRect()
		let mouseX = event.clientX - rect.x
		let mouseY = event.clientY - rect.y
		//Instructions have a 10 / 9 aspect ratio
		let instructionWidth = rect.height * 10 / 9
		let instructionIndex = Math.floor(mouseX / instructionWidth)
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
				// instructions.splice(instructionIndex, 0, instruction)
			}
		} else {
			//Player is adding to the end of the program
			instructions[instructionIndex] = instruction
		}

		this.fixPrograms()
		this.renderPrograms()
	}
	handleProgramMouseDown(event, program, component){
		//Check if the player is clicking an instruction
		let tags = tagHierarchy(event.target).reverse()
		let instructionTag = tags.find(tag => $(tag).hasClass("instruction"))
		if (instructionTag){
			let instruction = $(instructionTag).data("instruction")
			this.beginHoldingInstruction(instruction)
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

		//Set stats
		let maxPeriod = 0
		for (let program of programs){
			let instructions = program.instructions
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
		for (let program of programs){
			let row = program.elem
			let instructions = program.instructions
			row.empty()
			for (let i = 0; i < instructions.length; i++){
				let instruction = instructions[i]
				let tag = createInstructionTag(instruction)
				row.append(tag)
				tag.data("program", program)
				tag[0].addEventListener("mousedown", () => {
					// this.beginHoldingInstruction(instruction)
				})
			}
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
		} else {
			if (component.lastPlacement && component.lastPlacement.equals(component.homeTile)){
				component.lastPlacement = null
			}
			this.cancelPlacement()
		}
	}
	cancelPlacement(){
		let component = this.selectedComponent
		let wasAdjusting = this.isAdjustingComponent
		if (!wasAdjusting && component.lastPlacement){
			component.homeTile = component.lastPlacement
			this.tryToPlaceSelectedComponent()
		} else {
			this.selectedComponent = null
			this.isAdjustingComponent = false
		}
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
	getAllSimulationCollisionCircles(){
		//For each component, find the areas it occupies, taking into account non-integer rotation and translation.
		const circles = []
		const level = this.simulation
		const components = level.grid.contents
		for (let component of components){
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
		}
		return circles
	}
	detectCollisions(){
		const level = this.simulation
		const circles = this.getAllSimulationCollisionCircles()
		for (let i = 0; i < circles.length; i++){
			let circle1 = circles[i]
			for (let j = i + 1; j < circles.length; j++){
				let circle2 = circles[j]
				if (circle1.intersects(circle2) && this.playbackSpeed > 0){
					window.alert("Some components collided with each other. Reset the simulation and try again.")
					this.playbackSpeed = 0
				}
			}
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
							held: !heldMolecules.includes(molecule)
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

	resetSimulation(){
		//we create a simulated copy of the original level that contains all the same things in all the same places.
		//it is this copy that carries out the simulation, so the original settings remain untouched
		//so that way the player can easily reset back to square one. they never leave square one. they just advance to rectangle two.
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
	}
	startSimulation(){
		this.resetSimulation()
		this.simulationTimeStep = 0
		this.simulationDeltaT = 0
		this.playbackSpeed = 1
		this.isPlayingSimulation = true
		this.beginAnimatingInstructions(this.simulationTimeStep)
	}
	stopSimulation(){
		this.resetSimulation()
		this.simulationTimeStep = 0
		this.simulationDeltaT = 0
		this.isPlayingSimulation = false
		this.playingAnimations.length = 0
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
					const arms = component.arms.contents
					for (let arm of arms){
						arm.grippedComponent = null
					}
				} break
				case "piston_extend": {
					const arms = component.arms.contents
					const firstArm = arms[0]
					if (firstArm.distance >= 3) break
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
					if (firstArm.distance <= 1) break
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
		for (let [molecule, animations] of moleculeMovements){
			if (animations.length === 0) continue
			const rotations = animations.filter(animation => animation.type === "set_rotation")
			//A molecule can never be rotated around two points at once.
			if (rotations.length > 1) {
				illegalAnimation = true
				window.alert("A molecule was moved in an impossible way. You can't rotate a molecule in two ways at once.")
				console.trace()
				break
			}
			const offsets = animations.filter(animation => animation.type === "set_offset")
			//You can't ever rotate and translate a molecule at the same time.
			if (offsets.length && rotations.length){
				illegalAnimation = true
				window.alert("A molecule was moved in an impossible way. You can't rotate and move a molecule at the same time.")
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
					window.alert("A molecule was moved in an impossible way. A molecule can't be moved in two directions at once.")
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
						console.trace()
						break
					}
					if (offsets.length + lengthChanges.length > 1) {
						illegalAnimation = true
						window.alert("An arm can't have both its length and location change in more than one way at once.")
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
		}
		if (illegalAnimation){
			this.playbackSpeed = 0
		}

		//Then, see if the player has satisfied any of the products, and accept them.
		this.acceptProducts()
	}

	placeArmsOnTracks(level){
		const components = level.grid.contents
		const arms = components.filter(component => component.type === "ArmMechanism")
		const tracks = components.filter(component => component.type === "Track")
		for (let arm of arms){
			for (let track of tracks){
				let trackPieces = track.trackPieces
				let found = false
				for (let i = 0; i < trackPieces.length; i++){
					let trackPiece = trackPieces[i]
					let hex = track.homeTile.add(trackPiece.coord)
					if (hex.equals(arm.homeTile)){
						found = true
						arm.attachedTrack = track
						arm.attachedTrackIndex = i
						console.log(arm)
						break
					}
				}
				if (found) break
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
		}
	}

	tick(){
		const now = performance.now()
		const dt = now - this.lastTick
		this.lastTick = now
		const controls = this.controls

		if (this.isPlayingSimulation && this.playbackSpeed > 0){
			//Increase time slightly.
			this.simulationDeltaT += this.playbackSpeed * (dt / 1000)
			//simulation time, simulation delta time.
			this.placeReagents()

			this.applyAllAnimations()

			while (this.simulationDeltaT >= 1){
				//finish all ongoing animations maybe?
				this.simulationTimeStep++
				this.simulationDeltaT--
				this.beginAnimatingInstructions(this.simulationTimeStep)
				this.applyAllAnimations()
			}
			
			this.detectCollisions()
		}

		let mouseX = controls.mouse.x
		let mouseY = controls.mouse.y
		let hoveredHex = this.getHexFromXY(mouseX, mouseY)
		if (this.hoveredHex) this.hoveredHex.active = false
		this.hoveredHex = hoveredHex
		hoveredHex.active = true

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
			if (!this.isAdjustingComponent){
				//This code runs while the player is moving a component
				if (isLeftClicking && controls.isMouseOnScreen() && hoveredHex){
					this.selectedComponent.homeTile = hoveredHex
					this.selectedComponent.isRendered = true
				}
				else if (!isLeftClicking && controls.isMouseOnScreen() && hoveredHex){
					//If the proposed placement is legal, place it. Otherwise, cancel.
					this.tryToPlaceSelectedComponent()
				}
				else if (!isLeftClicking){
					this.cancelPlacement()
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

				let intendedDistance = component.homeTile.distance(hoveredHex)
				intendedDistance = max(1, min(intendedDistance, 3))
				if (component.type === "ArmMechanism"){
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
					let trackCoord = hoveredHex.subtract(track.homeTile)
					track.addTrackPiece(trackCoord, true)
				}

				if (!isLeftClicking){
					this.tryToPlaceSelectedComponent()
				}
			}
		} else if (controls.justClicked("left") && !this.isPlayingSimulation){
			//check if the player just clicked on a component they can move
			const components = this.currentLevel.grid.contents
			for (let component of components){
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

		//Instruction placement
		if (this.heldInstructions.length){
			if (!isLeftClicking){
				this.endHoldingInstructions()
			}
		}

		controls.tick()
	}
}