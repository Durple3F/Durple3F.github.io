import { Instruction, INSTRUCTIONS } from "./instructions";
import { SPRITES } from "./sprites";
import { Rectangle } from "./util";


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
		clone.instructions = this.instructions.map(ins => ins.clone())
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
		this.isDragging = false
		this.yOffset = 0
		this.xOffset = 0
		this.programBoxLocation = new Rectangle(0, 0, 0, 0)
		this.buttonLocations = [
			new Rectangle(0, 0, 0, 0),
			new Rectangle(0, 0, 0, 0),
			new Rectangle(0, 0, 0, 0),
		]
		this.renderInfo = {}
		this.insButtons = [
			"pivot_ccw",
			"piston_extend",
			"pivot_cw",
			"grabber_drop",
			"track_retreat",
			"rotator_ccw",
			"piston_retract",
			"rotator_cw",
			"grabber_grab",
			"track_advance",
			null,
			"period_override",
			"reset",
			"repeat",
			"halt",
		]
		this.insButtonLocations = []
		this.insButtonStates = []
		for (let i = 0; i < this.insButtons.length; i++){
			this.insButtonLocations[i] = new Rectangle(0, 0, 0, 0)
			this.insButtonStates[i] = "inactive"
		}
		this.resizeScreen()
	}
	resizeScreen(){
		const renderInfo = this.renderInfo
		const w = window.innerWidth
		const h = window.innerHeight
		//Frame
		const targetFrameHeight = h * 0.3 //40vh
		const frameY = h - targetFrameHeight
		
		const frameLeft = SPRITES["program_pane_frame_left"]
		const frameMiddle = SPRITES["program_pane_frame_center"]
		const frameRight = SPRITES["program_pane_frame_right"]
	
		// Scale widths based on height (preserve aspect ratio)
		const frameLeftW = targetFrameHeight * (frameLeft.width / frameLeft.height)
		const frameMiddleW = targetFrameHeight * (frameMiddle.width / frameMiddle.height)
		const frameRightW = targetFrameHeight * (frameRight.width / frameRight.height)
		const frameRemainingW = w - frameLeftW - frameRightW
		renderInfo.frameLeftW = frameLeftW
		renderInfo.frameMiddleW = frameMiddleW
		renderInfo.frameRightW = frameRightW
		renderInfo.frameRemainingW = frameRemainingW

		//Program rows
		const boxX = frameLeftW * 281 / 295;   // left
		const boxEndX = w - frameRightW * 26 / 74;
		const boxY = frameY + targetFrameHeight * 45 / 296;   // top
		const boxEndY = frameY + targetFrameHeight * 272 / 296;
		const boxW = boxEndX - boxX;   // width
		const boxH = boxEndY - boxY;   // height
		renderInfo.programBoxX = boxX
		renderInfo.programBoxX2 = boxEndX
		renderInfo.programBoxW = boxW
		renderInfo.programBoxY = boxY
		renderInfo.programBoxY2 = boxEndY
		renderInfo.programBoxH = boxH
		this.programBoxLocation.x = boxX
		this.programBoxLocation.y = boxY
		this.programBoxLocation.w = boxW
		this.programBoxLocation.h = boxH

		const programH = boxH / 6
		renderInfo.programH = programH
		const programSprite = SPRITES["instruction"]
		const drawW = programH * programSprite.width / programSprite.height
		renderInfo.tileW = drawW

		const stopButtonSprite = SPRITES["stop_button"]
		const buttonX1 = frameLeftW * 17 / frameLeft.width
		const buttonX2 = frameLeftW * 251 / frameLeft.width
		const buttonY = frameY + targetFrameHeight * 219 / frameLeft.height
		const sizeFactor = frameLeftW / frameLeft.width
		const buttonW = stopButtonSprite.width * sizeFactor
		const buttonH = stopButtonSprite.height * sizeFactor
		const remainingButtonW = buttonX2 - buttonX1 - buttonW * 3
		this.buttonLocations[0].x = buttonX1
		this.buttonLocations[0].y = buttonY
		this.buttonLocations[0].w = buttonW
		this.buttonLocations[0].h = buttonH
		this.buttonLocations[1].x = buttonX1 + buttonW + remainingButtonW * 0.5
		this.buttonLocations[1].y = buttonY
		this.buttonLocations[1].w = buttonW
		this.buttonLocations[1].h = buttonH
		this.buttonLocations[2].x = buttonX1 + buttonW * 2 + remainingButtonW
		this.buttonLocations[2].y = buttonY
		this.buttonLocations[2].w = buttonW
		this.buttonLocations[2].h = buttonH

		const insSectionX = frameLeftW * 25 / frameLeft.width
		const insSectionY = frameY + targetFrameHeight * 58 / frameLeft.height + 1
		const insSectionPadW = frameLeftW * 2.6 / frameLeft.width
		const insSectionPadH = targetFrameHeight * 15.9 / frameLeft.height
		const insBoxH = renderInfo.programH
		const insBoxW = renderInfo.tileW
		const instructionSprite = SPRITES["instruction"]

		for (let i = 0; i < 15; i++){
			const rx = i % 5
			const ry = Math.floor(i / 5)
			const x = insSectionX + (insSectionPadW + insBoxW) * rx
			const y = insSectionY + (insSectionPadH + insBoxH) * ry
			this.insButtonLocations[i].x = x
			this.insButtonLocations[i].y = y
			this.insButtonLocations[i].w = insBoxW
			this.insButtonLocations[i].h = insBoxH
		}
	}
	getIndexesFromXY(x, y){
		let boxX = this.programBoxLocation.x
		let boxY = this.programBoxLocation.y
		let realX = x - boxX - this.xOffset
		let realY = y - boxY - this.yOffset
		let programIndex = realY / this.renderInfo.programH
		let tileIndex = realX / this.renderInfo.tileW
		programIndex = Math.floor(programIndex)
		tileIndex = Math.floor(tileIndex)
		return [programIndex, tileIndex]
	}
	tick(){
		const controls = this.controls
		const mouseX = controls.mouse.x
		const mouseY = controls.mouse.y
		const isInProgramBox = this.programBoxLocation.contains(mouseX, mouseY)
		if (isInProgramBox){
			if (controls.justClicked("right")){
				this.isDragging = true
			}
		}
		if (!controls.isClicking("right")) {
			this.isDragging = false
		}

		if (this.isDragging){
			let records = controls.mouse.records
			let prev = records[records.length - 2]
			let cur = records[records.length - 1]
			let dx = prev[0] - cur[0]
			let dy = prev[1] - cur[1]
			this.xOffset += dx
			this.yOffset += dy
			if (this.yOffset < 0) this.yOffset = 0
			if (this.xOffset < 0) this.xOffset = 0
		}

		for (let i = 0; i < this.insButtonLocations.length; i++){
			let rect = this.insButtonLocations[i]
			if (rect.contains(mouseX, mouseY)){
				this.insButtonStates[i] = "hover"
			} else {
				this.insButtonStates[i] = "inactive"
			}
		}
	}
}