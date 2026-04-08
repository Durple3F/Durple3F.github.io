import { loadSprite } from "./util";

export const ELEMENTS = {};
export class Element {
	constructor(options) {
		this.id = options.id;
		this.spriteMap = options.sprites;
		this.sprites = {};
		this.loaded = false;
	}

	async load() {
		let promises = [];
		for (let spriteName in this.spriteMap) {
			let url = this.spriteMap[spriteName];
			let p = loadSprite(url)
				.then(img => this.sprites[spriteName] = img);
			promises.push(p);
		}
		return await Promise.all(promises);
	}
}
ELEMENTS["Fire"] = new Element({
	id: "Fire",
	sprites: {
		atom: "./src/img/atoms/fire.png"
	}
});
ELEMENTS["Air"] = new Element({
	id: "Air",
	sprites: {
		atom: "./src/img/atoms/air.png"
	}
});
ELEMENTS["Water"] = new Element({
	id: "Water",
	sprites: {
		atom: "./src/img/atoms/water.png"
	}
});
ELEMENTS["Earth"] = new Element({
	id: "Earth",
	sprites: {
		atom: "./src/img/atoms/earth.png"
	}
});
ELEMENTS["Salt"] = new Element({
	id: "Salt",
	sprites: {
		atom: "./src/img/atoms/salt.png"
	}
});