export const INSTRUCTIONS = []

class Instruction {
	constructor(id, spriteUrl, key = null, isSingleton = false, disabledUrl = null) {
		this.id = id
		this.spriteUrl = spriteUrl
		this.key = key
		this.isSingleton = false
		this.disabledUrl = disabledUrl
	}
}

INSTRUCTIONS.push(new Instruction("idle"))
INSTRUCTIONS.push(new Instruction("pivot_ccw", "./src/img/instructions/pivot_ccw.png", "q"))
INSTRUCTIONS.push(new Instruction("piston_extend", "./src/img/instructions/piston_extend.png", "w"))
INSTRUCTIONS.push(new Instruction("pivot_cw", "./src/img/instructions/pivot_cw.png", "e"))
INSTRUCTIONS.push(new Instruction("grabber_drop", "./src/img/instructions/grabber_drop.png", "r"))
INSTRUCTIONS.push(new Instruction("track_retreat", "./src/img/instructions/track_retreat.png", "t"))
INSTRUCTIONS.push(new Instruction("rotator_ccw", "./src/img/instructions/rotator_ccw.png", "a"))
INSTRUCTIONS.push(new Instruction("piston_retract", "./src/img/instructions/piston_retract.png", "s"))
INSTRUCTIONS.push(new Instruction("rotator_cw", "./src/img/instructions/rotator_ccw.png", "d"))
INSTRUCTIONS.push(new Instruction("grabber_grab", "./src/img/instructions/grabber_grab.png", "f"))
INSTRUCTIONS.push(new Instruction("track_advance", "./src/img/instructions/track_advance.png", "g"))
INSTRUCTIONS.push(new Instruction("delete", "./src/img/instructions/halt.png", "z"))
INSTRUCTIONS.push(new Instruction("period_override", "./src/img/instructions/clock.png", "x", true, "./src/img/clock_disabled.png"))
INSTRUCTIONS.push(new Instruction("reset", "./src/img/instructions/reset.png", "c"))
INSTRUCTIONS.push(new Instruction("repeat", "./src/img/instructions/repeat.png", "v"))
INSTRUCTIONS.push(new Instruction("halt", "./src/img/instructions/halt.png", "b"))

export function createInstructionTag(instruction){
	let tag = $("<div>").addClass("instruction")
	let symbol = $("<img>").addClass("instruction-symbol")
	symbol.attr("src", instruction.spriteUrl)
	tag.append(symbol)
	return tag
}
export function createInstructionButton(instruction) {
	let tag = $("<div>").addClass("instruction-button")
	let instructionTag = createInstructionTag(instruction)
	tag.append(instructionTag)
	if (instruction.key) {
		tag.append(instruction.key.toUpperCase())
	}
	return tag
}