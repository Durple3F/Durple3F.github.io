export const INSTRUCTIONS = {}

class InstructionType {
	constructor(id, spriteUrl, key = null, stopsRepeats=false, isSingleton = false, disabledUrl = null) {
		this.id = id
		this.spriteUrl = spriteUrl
		this.key = key
		this.isSingleton = isSingleton
		this.stopsRepeats = stopsRepeats
		this.disabledUrl = disabledUrl
		INSTRUCTIONS[id] = this
	}
}

export class Instruction {
	constructor(type){
		this.type = type
		this.generatedInstructions = []
		this.isLegal = true
	}
	clone(){
		let clone = new Instruction(this.type)
		clone.isLegal = this.isLegal
		for (let instruction of this.generatedInstructions){
			clone.generatedInstructions.push(instruction.clone())
		}
		return clone
	}
}

new InstructionType("idle")
new InstructionType("pivot_ccw", "./src/img/instructions/pivot_ccw.png", "q",)
new InstructionType("piston_extend", "./src/img/instructions/piston_extend.png", "w",)
new InstructionType("pivot_cw", "./src/img/instructions/pivot_cw.png", "e",)
new InstructionType("grabber_drop", "./src/img/instructions/grabber_drop.png", "r",)
new InstructionType("track_retreat", "./src/img/instructions/track_retreat.png", "t",)
new InstructionType("rotator_ccw", "./src/img/instructions/rotator_ccw.png", "a",)
new InstructionType("piston_retract", "./src/img/instructions/piston_retract.png", "s",)
new InstructionType("rotator_cw", "./src/img/instructions/rotator_cw.png", "d",)
new InstructionType("grabber_grab", "./src/img/instructions/grabber_grab.png", "f",)
new InstructionType("track_advance", "./src/img/instructions/track_advance.png", "g",)
new InstructionType("delete", "./src/img/instructions/halt.png", "z")
new InstructionType("period_override", "./src/img/instructions/clock.png", "x", true, true, "./src/img/clock_disabled.png")
new InstructionType("reset", "./src/img/instructions/reset.png", "c",)
new InstructionType("repeat", "./src/img/instructions/repeat.png", "v", true)
new InstructionType("halt", "./src/img/instructions/halt.png", "b")

export function createInstructionTag(instruction){
	let tag = $("<div>").addClass("instruction")
	let symbol = $("<img>").addClass("instruction-symbol")
	let type = instruction.type
	symbol.attr("src", type.spriteUrl).attr("draggable", false)
	tag.append(symbol)
	tag.attr("data-type", type.id)
	tag.data("instruction", instruction)

	let arrow = $("<div>").addClass("instruction-arrow").appendTo(tag)

	let generatedInstructions = instruction.generatedInstructions
	let generatedTag = $("<div>").addClass("instruction-generated").appendTo(tag)

	for (let i = 1; i < generatedInstructions.length; i++){
		let part = $("<img>").addClass("instruction-arrow-part")
		if (i === generatedInstructions.length - 1){
			if (instruction.isLegal){
				part.attr("src", "./src/img/arrow-head.png")
			} else {
				part.attr("src", "./src/img/arrow-head-illegal.png")
			}
			part.attr("data-final", true)
		} else {
			if (instruction.isLegal){
				part.attr("src", "./src/img/arrow-part.png")
			} else {
				part.attr("src", "./src/img/arrow-part-illegal.png")
			}
			part.attr("data-final", false)
		}
		arrow.append(part)
	}
	for (let i = 0; i < generatedInstructions.length; i++){
		let newInstruction = generatedInstructions[i]
		let newTag = createInstructionTag(newInstruction)
		generatedTag.append(newTag)
	}

	return tag
}
export function createInstructionButton(instruction) {
	let tag = $("<div>").addClass("instruction-button")
	let instructionTag = createInstructionTag(instruction)
	let type = instruction.type
	tag.append(instructionTag)
	if (type.key) {
		tag.append(type.key.toUpperCase())
	}
	return tag
}