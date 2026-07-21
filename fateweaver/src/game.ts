import type { ControlManager } from "./controls";

export class Game{
	tickInterval: number;
	controls: ControlManager;
	screen: HTMLCanvasElement;
	bgScreen: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	bgctx: WebGLRenderingContext;
	constructor(controls : ControlManager, screen: HTMLCanvasElement, bgScreen: HTMLCanvasElement){
		this.screen = screen
		this.bgScreen = bgScreen
		this.ctx = this.screen.getContext("2d")!
		this.bgctx = this.bgScreen.getContext("webgl")!
		this.tickInterval = -1
		this.controls = controls
	}
	resizeWindow(){

	}
	tick(){

	}
	startTicks(framesPerSecond : number){
		this.tickInterval = setInterval(this.tick, 1000 / framesPerSecond)
	}
}