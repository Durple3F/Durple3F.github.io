import * as THREE from 'three';
import {Game, loadModel} from "./game.js"
import render from "./render.js"
import ControlManager from './controls.js';
import { framesPerSecond } from './config.js';

const renderer = new THREE.WebGLRenderer( { antialias: true } );
$("#screen").append( renderer.domElement );
const controls = new ControlManager()
let game

Promise.all([
	loadModel("bulbasaur", "public/Bulbasaur.glb"),
])
.then(async () => {
	game = new Game(renderer, controls)
	await game.startLevel("level1")
	game.renderer.setAnimationLoop( animate );
	resize()
})

const frameTimes = {
	records: [],
	avg: 0,
	min: 0,
	max: 0
}
function animate( time ) {
	let start = performance.now()
	game.time = time
	game.tick()

	// gltf.scene.rotation.x = time / 2000;
	// gltf.scene.rotation.y = time / 1000;

	render(game)
	let end = performance.now()
	frameTimes.records.push(end - start)
	let len = frameTimes.records.length
	if (len > 1000){
		frameTimes.records.splice(0, 100)
	}
	if (len % 10 === 0){
		let records = frameTimes.records
		let min = Infinity
		let max = 0
		let sum = 0
		for (let record of records){
			sum += record
			min = min < record ? min : record
			max = max > record ? max : record
		}
		frameTimes.avg = sum / len
		frameTimes.min = min
		frameTimes.max = max
		let avgText = frameTimes.avg.toFixed(2)
		let text = `${avgText}ms, ${frameTimes.min}ms, ${frameTimes.max}ms`
		$("#frameStats").html(text)
	}

}

const resize = () => {
	game?.resizeWindow()
}
window.addEventListener("resize", resize)