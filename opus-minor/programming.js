import { Instruction, INSTRUCTIONS } from "./instructions";


export class Program {
	constructor(component, name) {
		this.component = component
		this.name = name
		//the start step is the index of the first non-idle instruction.
		this.startStep = 0
		//a program's period is the number of instructions from the first to the last non-idle instruction.
		this.period = 0
		this.halts = false
		this.haltIndex = -1
		this.instructions = []
		this.generatedInstructions = []
		this.isLegal = true
		this.elem = null
	}

	clone(component = null) {
		let clone = new Program(component ?? this.component, this.name)
		clone.startStep = this.startStep
		clone.period = this.period
		clone.halts = this.halts
		clone.haltIndex = this.haltIndex
		clone.instructions = this.instructions
		clone.generatedInstructions = this.generatedInstructions
		clone.elem = this.elem
		return clone
	}

	createElement() {
		let programRow = $("<div>").addClass("program-row")
		this.elem = programRow
		let programName = $("<div>").addClass("program-name").text(this.name)
		this.elem.data("program", this)
		this.elem.data("name-tag", programName)
		$("#program-names").append(programName)
		$("#program-rows").append(programRow)
	}

	getInstruction(timestep) {
		let instructions = this.generatedInstructions
		if (this.halts && timestep >= this.haltIndex) {
			console.log("the halterrr")
			return new Instruction(INSTRUCTIONS["idle"])
		} else if (timestep < instructions.length) {
			return instructions[timestep]
		} else if (timestep >= instructions.length && this.period > 0) {
			let offset = timestep - this.startStep
			let instruction = instructions[this.startStep + (offset % this.period)]
			return instruction
		}
	}
}

export class ProgramManager {
	constructor(canvas, controls){
		this.canvas = canvas
		this.controls = controls
		
	}
}