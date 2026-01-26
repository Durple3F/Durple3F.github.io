import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let width = window.innerWidth, height = window.innerHeight;

// init

const camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 10 );
camera.position.z = 1;

const loader = new GLTFLoader();
const gltf = await loader.loadAsync( 'public/Bulbasaur.glb' );

const scene = new THREE.Scene();

gltf.scene.scale.x *= 0.5
gltf.scene.scale.y *= 0.5
gltf.scene.scale.z *= 0.5
scene.add( gltf.scene );

const al = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(al);

const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
const material = new THREE.MeshNormalMaterial();

const mesh = new THREE.Mesh( geometry, material );
// scene.add( mesh );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( width, height );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

// animation

function animate( time ) {

	gltf.scene.rotation.x = time / 2000;
	gltf.scene.rotation.y = time / 1000;

	renderer.render( scene, camera );

}

window.addEventListener("resize", () => {
	width = window.innerWidth
	height = window.innerHeight
	renderer.setSize(width, height);
	renderer.setPixelRatio(window.devicePixelRatio)
	// camera.aspect = window.devicePixelRatio;
	// camera.updateProjectionMatrix();
	renderer.domElement.width = width;
	renderer.domElement.height = height;
})

console.log(camera)