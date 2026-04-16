export class Scenario {
	constructor(id, options={}) {
		this.id = id
		this.productMolecules = options.products ?? []
		this.reagentMolecules = options.reagents ?? []
		this.allowedMechanisms = options.mechanisms ?? []
		this.allowedGlyphs = options.glyphs ?? []
		this.prices = options.prices ?? []
		this.sideContent = options.sideContent ?? null
		for (let type of ["Product", "Reagent", "Glyph", "ArmMechanism", "Track"]){
			if (!this.prices[type]){
				this.prices[type] = {}
			}
		}
		SCENARIOS[this.id] = this
	}
}

export const SCENARIOS = {}
new Scenario("test", {
	products: [
		{
			"name": "Phlogiston",
			"molecule": [
				[
					["Fire", 0, 0, 0],
					["Fire", 1, 0, -1],
					["Fire", 2, 0, -2],
					["Fire", 3, 0, -3],
					["Fire", 4, 0, -4],
					["Fire", 5, 0, -5],
					["Fire", 6, 0, -6],
					["Fire", 7, 0, -7],
					["Fire", 8, 0, -8],
					["Fire", 9, 0, -9]
				], [
					[0, 1],
					[1, 2],
					[2, 3],
					[3, 4],
					[4, 5],
					[5, 6],
					[6, 7],
					[7, 8],
					[8, 9],
				]
			]
		}
	],
	reagents: [
		{
			"name": "Elemental Fire",
			"molecule": [
				[
					["Fire", 0, 0, 0],
					["Fire", 1, 0, -1],
					["Fire", 2, 0, -2],
					["Fire", 3, 0, -3],
					["Fire", 4, 0, -4],
					["Fire", 5, 0, -5],
					["Fire", 6, 0, -6],
					["Fire", 7, 0, -7],
					["Fire", 8, 0, -8],
					["Fire", 9, 0, -9]
				], [
					[0, 1],
					[1, 2],
					[2, 3],
					[3, 4],
					[4, 5],
					[5, 6],
					[6, 7],
					[7, 8],
					[8, 9],
				]
			]
		}
	],
	mechanisms: [
		"Fixed-Length Arm",
		"Fixed-Length Double Arm",
		"Fixed-Length Triple Arm",
		"Fixed-Length Sextuple Arm",
		"Piston Arm",
		"Van Berlo's Wheel",
	],
	glyphs: ["Glyph of Bonding"]
})
new Scenario("test2", {
	products: [
		{
			"name": "Output",
			"molecule": [
				[
					["Fire", 0, 0, 0],
				], []
			]
		}
	],
	reagents: [
		{
			"name": "Input",
			"molecule": [
				[
					["Fire", 0, 0, 0],
					["Fire", 1, 0, -1],
					["Fire", 2, -1, -1],
					["Fire", 2, -2, 0],
					["Fire", 1, -2, 1],
				], [
					[0, 1],
					[1, 2],
					[2, 3],
					[3, 4],
				]
			]
		}
	],
	mechanisms: [
		"Fixed-Length Arm",
		"Fixed-Length Double Arm",
		"Fixed-Length Triple Arm",
		"Fixed-Length Sextuple Arm",
		"Piston Arm",
		"Van Berlo's Wheel",
	],
	glyphs: ["Glyph of Bonding", "Glyph of Unbonding", "Glyph of Multi-bonding"]
})
new Scenario("refined-gold", {
	products: [
		{
			"name": "Elemental Gold",
			"molecule": [
				[
					["Gold", 0, 0, 0]
				]
			]
		}
	],
	reagents: [
		{
			"name": "Elemental Lead",
			"molecule": [
				[
					["Lead", 0, 0, 0]
				]
			]
		},
		{
			"name": "Elemental Quicksilver",
			"molecule": [
				[
					["Quicksilver", 0, 0, 0]
				]
			]
		}
	],
	mechanisms: [
		"Fixed-Length Arm",
		"Fixed-Length Double Arm",
		"Fixed-Length Triple Arm",
		"Fixed-Length Sextuple Arm",
		"Piston Arm",
	],
	glyphs: [
		"Glyph of Bonding",
		"Glyph of Projection",
	],
	sideContent: {
		type: "dialogue",
		dialogueId: "refined-gold"
	}
})
new Scenario("face-powder", {
	products: [
		{
			"name": "Face Powder",
			"molecule": [
				[
					["Salt", 0, 0, 0],
					["Earth", 1, 0, -1],
				],
				[
					[0, 1]
				]
			]
		}
	],
	reagents: [
		{
			"name": "Elemental Earth",
			"molecule": [
				[
					["Earth", 0, 0, 0]
				]
			]
		}
	],
	mechanisms: [
		"Fixed-Length Arm",
		"Fixed-Length Double Arm",
		"Fixed-Length Triple Arm",
		"Fixed-Length Sextuple Arm",
		"Piston Arm",
	],
	glyphs: [
		"Glyph of Bonding",
		"Glyph of Calcification",
	],
	sideContent: {
		type: "dialogue",
		dialogueId: "face-powder"
	}
})
new Scenario("waterproof-sealant", {
	products: [
		{
			"name": "Waterproof Sealant",
			"molecule": [
				[
					["Air", -1, 0, 1],
					["Air", 0, 0, 0],
					["Water", 1, -1, 0],
				],
				[
					[0, 1],
					[1, 2]
				]
			]
		}
	],
	reagents: [
		{
			"name": "Elemental Air",
			"molecule": [
				[
					["Air", 0, 0, 0]
				]
			]
		},
		{
			"name": "Elemental Water",
			"molecule": [
				[
					["Water", 0, 0, 0]
				]
			]
		},
	],
	mechanisms: [
		"Fixed-Length Arm",
		"Fixed-Length Double Arm",
		"Fixed-Length Triple Arm",
		"Fixed-Length Sextuple Arm",
		"Piston Arm",
	],
	glyphs: [
		"Glyph of Bonding",
		"Glyph of Multi-bonding",
		"Glyph of Unbonding",
		"Glyph of Calcification",
	],
	sideContent: {
		type: "dialogue",
		dialogueId: "waterproof-sealant"
	}
})
new Scenario("hangover-cure", {
	products: [
		{
			"name": "Hangover Cure",
			"molecule": [
				[
					["Salt", -1, 0, 1],
					["Water", 0, 0, 0],
					["Salt", 1, -1, 0],
				],
				[
					[0, 1],
					[1, 2]
				]
			]
		}
	],
	reagents: [
		{
			"name": "Elemental Water",
			"molecule": [
				[
					["Air", 0, 0, 0]
				]
			]
		},
	],
	mechanisms: [
		"Fixed-Length Arm",
		"Fixed-Length Double Arm",
		"Fixed-Length Triple Arm",
		"Fixed-Length Sextuple Arm",
		"Piston Arm",
	],
	glyphs: [
		"Glyph of Bonding",
		"Glyph of Multi-bonding",
		"Glyph of Unbonding",
		"Glyph of Calcification",
	],
	sideContent: {
		type: "dialogue",
		dialogueId: "hangover-cure"
	}
})
new Scenario("airship-fuel", {
	products: [
		{
			"name": "Airship Fuel",
			"molecule": [
				[
					["Salt", 0, -1, 1],
					["Fire", 0, 0, 0],
					["Fire", 1, 0, -1],
					["Salt", 1, 1, -2],
				],
				[
					[0, 1],
					[1, 2],
					[2, 3],
				]
			]
		}
	],
	reagents: [
		{
			"name": "Elemental Fire",
			"molecule": [[["Fire", 0, 0, 0]]]
		},
		{
			"name": "Elemental Fire",
			"molecule": [[["Fire", 0, 0, 0]]]
		},
		{
			"name": "Elemental Fire",
			"molecule": [[["Fire", 0, 0, 0]]]
		},
	],
	mechanisms: [
		"Fixed-Length Arm",
		"Fixed-Length Double Arm",
		"Fixed-Length Triple Arm",
		"Fixed-Length Sextuple Arm",
		"Piston Arm",
	],
	glyphs: [
		"Glyph of Bonding",
		"Glyph of Multi-bonding",
		"Glyph of Unbonding",
		"Glyph of Calcification",
	],
	sideContent: {
		type: "dialogue",
		dialogueId: "airship-fuel"
	}
})