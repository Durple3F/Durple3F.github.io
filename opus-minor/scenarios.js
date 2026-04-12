export class Scenario {
	constructor(id, options={}) {
		this.id = id
		this.productMolecules = options.products ?? []
		this.reagentMolecules = options.reagents ?? []
		this.allowedMechanisms = options.mechanisms ?? []
		this.allowedGlyphs = options.glyphs ?? []
		this.prices = options.prices ?? []
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
					["Fire", 1, 0, -1]
				], [
					[0, 1]
				]
			]
		}
	],
	reagents: [
		{
			"name": "Elemental Fire",
			"molecule": [
				[
					["Fire", 0, 0, 0]
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
	]
})