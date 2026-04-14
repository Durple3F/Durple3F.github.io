import { loadSprite } from "./util";

export const ELEMENTS = {};
export class Element {
	constructor(options) {
		this.id = options.id;
		this.spriteMap = options.sprites;
		this.sprites = {};
		this.loaded = false;
		this.properties = options.properties ?? {}
		if (!this.properties.tags){
			this.properties.tags = []
		}
		ELEMENTS[this.id] = this
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
new Element({
	id: "Fire",
	sprites: {
		atom: "./src/img/atoms/fire.png"
	},
	properties: {
		tags: ["classical_element"]
	}
});
new Element({
	id: "Air",
	sprites: {
		atom: "./src/img/atoms/air.png"
	},
	properties: {
		tags: ["classical_element"]
	}
});
new Element({
	id: "Water",
	sprites: {
		atom: "./src/img/atoms/water.png"
	},
	properties: {
		tags: ["classical_element"]
	}
});
new Element({
	id: "Earth",
	sprites: {
		atom: "./src/img/atoms/earth.png"
	},
	properties: {
		tags: ["classical_element"]
	}
});
new Element({
	id: "Salt",
	sprites: {
		atom: "./src/img/atoms/salt.png"
	}
});
new Element({
	id: "Quicksilver",
	sprites: {
		atom: "./src/img/atoms/quicksilver.png"
	}
});
new Element({
	id: "Lead",
	sprites: {
		atom: "./src/img/atoms/lead.png"
	},
	properties: {
		tags: ["metal"],
		metalicity: 1
	}
});
new Element({
	id: "Tin",
	sprites: {
		atom: "./src/img/atoms/tin.png"
	},
	properties: {
		tags: ["metal"],
		metalicity: 2
	}
});
new Element({
	id: "Iron",
	sprites: {
		atom: "./src/img/atoms/iron.png"
	},
	properties: {
		tags: ["metal"],
		metalicity: 3
	}
});
new Element({
	id: "Copper",
	sprites: {
		atom: "./src/img/atoms/copper.png"
	},
	properties: {
		tags: ["metal"],
		metalicity: 4
	}
});
new Element({
	id: "Silver",
	sprites: {
		atom: "./src/img/atoms/silver.png"
	},
	properties: {
		tags: ["metal"],
		metalicity: 5
	}
});
new Element({
	id: "Gold",
	sprites: {
		atom: "./src/img/atoms/gold.png"
	},
	properties: {
		tags: ["metal"],
		metalicity: 6
	}
});