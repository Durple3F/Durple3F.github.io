export default function render(game){
	let renderer = game.renderer
	let scene = game.scene
	let camera = game.cameras[game.currentCamera]
	renderer.render( scene, camera );
}