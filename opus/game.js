import {Hex, Grid, Component, Element, Atom, loadSprite, Molecule, ArmMechanism, ARMTYPES, Reagent, tagHierarchy, lerp, clamp} from "./util.js"
import { SCENARIOS } from "./scenarios.js"
import { createInstructionTag, Instruction, INSTRUCTIONS } from "./instructions.js"

const min = Math.min
const max = Math.max
const ROOT3 = Math.sqrt(3)
const floor = Math.floor
const ceil = Math.ceil

export class Level{
	constructor(scenario){
		this.scenario = scenario
		this.grid = new Grid()
		this.timestep = 0
		this.programs = []
		// this.grid.fill(-10, 10, -10, 10)
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
			let instruction = this.instructions[offset % this.period]
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
		let allowedMechanisms = scenario.allowedMechanisms
		let mechanismsPane = $("#components-mechanisms").children(".components-list")
		mechanismsPane.empty()
		for (let mechanismName of allowedMechanisms){
			let componentTag = $("<div class='component'>")
			componentTag.text(mechanismName)
			mechanismsPane.append(componentTag)
			componentTag.attr("data-available", true)
			componentTag.on("mousedown", () => {
				this.selectedComponent = new ArmMechanism(mechanismName)
				this.selectedComponent.isGhost = true
				this.selectedComponent.isRendered = false
			})
		}
	}

	addComponent(component){
		//For rendering purposes, all components must be placed in this order.
		const type = component.type
		const hierarchy = ["Reagent", "Product", "Glyph", "Molecule", "ArmMechanism"]
		const score = hierarchy.indexOf(type)
		const contents = this.currentLevel.grid.contents
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
		if (component.type === "ArmMechanism"){
			let programs = this.currentLevel.programs
			let program = new Program(component, programs.length + 1)
			programs.push(program)
			component.program = program
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
	}

	initialize(){
		this.resizeScreen()
		this.getHexAt(0, 0).active = true

		//Create a molecule of elemental Fire and put it on the home tile.
		let molecule = new Molecule()
		let atom = new Atom("Fire")
		atom.setCoords(0, 0, 0)
		molecule.addAtom(atom)
		let atom2 = new Atom("Fire")
		atom2.setCoords(-1, 1, 0)
		molecule.addAtom(atom2)
		molecule.addBond(atom, atom2)
		let reagent = new Reagent(molecule)
		reagent.homeTile = new Hex(-1, 0, 1)
		this.addComponent(reagent)
		// this.currentLevel.grid.contents[0].moveOrigin(new Hex(-2, 2, 0))
		if (true) {
			// let molecule = new Molecule()
			// let atom = new Atom("Fire")
			// atom.setCoords(0, 0, 0)
			// molecule.addAtom(atom)
			// molecule.moveOrigin(new Hex(2, -2, 0))
			// this.addComponent(molecule)
		}

		// let arm = new ArmMechanism("Piston")
		// arm.homeTile = this.getHexAt(2, -2)
		// this.addComponent(arm)
		// arm.rotateRight()
		// arm.rotateRight()
		// arm.arms.contents.forEach(arm => arm.distance = 2)

		// let arm2 = new ArmMechanism("Piston")
		// arm2.homeTile = this.getHexAt(5, -3)
		// this.addComponent(arm2)
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
		this.renderPrograms()
	}
	endHoldingInstructions(){
		this.heldInstructions = []
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
				}
			}
		}

		//TODO: ensure all programs are the same length
		//(a 5-step program that starts on step 200 is 5 steps long.)
		for (let program of programs){

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

	getCollisionHexes(component){
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
	checkPlacement(component){
		//The rules for collision are that:
		//The home tile of an arm must not overlap with an atom or the home tile of another arm.
		//The same is true for atoms. They can't touch other atoms or arms. The arm itself is fine, just not the home tile.
		//Since this function will only run while the simulation is paused, we don't need to calculate collision
		//using the non-integer rotation and translation stuff.
		//Also, only collisions with *other* components matters. The component can touch itself.
		let legal = true
		let proposedHexes = this.getCollisionHexes(component)

		let components = this.currentLevel.grid.contents
		for (let otherComponent of components){
			if (otherComponent === component) continue
			let takenHexes = this.getCollisionHexes(otherComponent)
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
	cancelPlacement(){
		this.selectedComponent = null
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
		const grid = this.currentLevel.grid
		const hexSize = this.hexSize
		const horiz = ROOT3 * hexSize
		const vert = 1.5 * hexSize
		const xOffset = this.xOffset
		const yOffset = this.yOffset

		const topPixel = 0 + yOffset
		const bottomPixel = h + yOffset
		const leftPixel = 0 + xOffset
		const rightPixel = w + xOffset
		const topR = floor(topPixel / vert)
		const bottomR = ceil(bottomPixel / vert)
		const leftQ = floor(leftPixel / horiz)
		const rightQ = ceil(rightPixel / horiz)
		// grid.fill(leftQ, rightQ, topR, bottomR)

		//TODO: Remove cells that are far outside the current play space.
	}

	getHexAt(q, r){
		const grid = this.currentLevel.grid
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
	getHexFromXY(x, y){
		const hexSize = this.hexSize
		const horiz = ROOT3 * hexSize
		const vert = 1.5 * hexSize
		// let x = (q + 0.5 * r) * horiz - xOffset
		// let y = r * vert - yOffset
		let r = (y + this.yOffset) / vert
		let q = ((x + this.xOffset) / horiz) - 0.5 * r
		let hex = this.getHexAt(q, r)
		return hex
	}

	resetComponents(){
		// const components = this.currentLevel.grid.contents
	}
	startSimulation(){
		//remove all molecules on the board
		//reset everything to initial settings (translation, rotation)
		this.resetComponents()
		this.simulationTimeStep = 0
		this.isPlayingSimulation = true
		this.beginAnimatingInstructions(this.simulationTimeStep)
	}
	stopSimulation(){
		this.resetComponents()
		this.simulationTimeStep = 0
		this.isPlayingSimulation = false
		this.playingAnimations.length = 0
	}
	beginAnimatingInstructions(timestep){
		//get each instruction that should be executed right now and add them to the list of animations
		let programs = this.currentLevel.programs
		for (let program of programs){
			let instruction = program.getInstruction(timestep)
			if (!instruction) continue
			let instructionType = instruction.type.id
			let component = program.component
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
				} break
			}
		}
	}

	applyAnimation(animation, p){
		const component = animation.target
		switch (animation.type){
			case "set_rotation": {
				let v = lerp(animation.startV, animation.endV, p)
				component.rotation = v
			}
		}
	}
	finishAnimation(animation){
		const component = animation.target
		switch (animation.type){
			case "set_rotation": {
				let curAngle = component.rotation
				if (curAngle > 0){
					component.rotation = 0
					component.rotateRight()
				} else if (curAngle < 0){
					component.rotation = 0
					component.rotateLeft()
				}
			}
		}
	}

	tick(){
		const now = performance.now()
		const dt = now - this.lastTick
		this.lastTick = now
		const controls = this.controls
		controls.tick()

		if (this.isPlayingSimulation){
			//Increase time slightly.
			this.simulationDeltaT += this.playbackSpeed * (dt / 1000)
			//simulation time, simulation delta time.
			const st = this.simulationTimeStep + this.simulationDeltaT
			const sdt = this.simulationDeltaT

			//apply each ongoing animation to the appropriate components.
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

			if (sdt >= 1){
				//finish all ongoing animations maybe?
				this.simulationTimeStep++
				this.simulationDeltaT--
				this.beginAnimatingInstructions(this.simulationTimeStep)
			}
		}

		let mouseX = controls.mouse.x
		let mouseY = controls.mouse.y
		let hoveredHex = this.getHexFromXY(mouseX, mouseY)
		if (this.hoveredHex) this.hoveredHex.active = false
		this.hoveredHex = hoveredHex
		hoveredHex.active = true

		//Map dragging
		const isLeftClicking = controls.isClicking("left")
		const isMouseOnScreen = controls.isMouseOnScreen()
		if (isLeftClicking && isMouseOnScreen && controls.justClicked("left", 50)){
			this.isDraggingMap = true
		} else if (!(isLeftClicking && isMouseOnScreen)) {
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

		//Component placement
		if (this.selectedComponent){
			if (isLeftClicking && controls.isMouseOnScreen() && hoveredHex){
				this.selectedComponent.homeTile = hoveredHex
				this.selectedComponent.isRendered = true
			}
			else if (!isLeftClicking && controls.isMouseOnScreen() && hoveredHex){
				//If the proposed placement is legal, place it. Otherwise, cancel.
				if (this.checkPlacement(this.selectedComponent)){
					this.addComponent(this.selectedComponent)
					this.selectedComponent.isGhost = false
					this.selectedComponent = null
				} else {
					this.cancelPlacement()
				}
			}
			else if (!isLeftClicking){
				this.cancelPlacement()
			}
		}

		//Instruction placement
		if (this.heldInstructions.length){
			if (!isLeftClicking){
				this.endHoldingInstructions()
			}
		}
	}
}