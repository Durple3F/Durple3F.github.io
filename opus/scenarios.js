export class Scenario{
	constructor(productList, reagentList, allowedMechanisms, allowedGlyphs){
		this.productMolecules = productList
		this.reagentMolecules = reagentList
		this.allowedMechanisms = allowedMechanisms
		this.allowedGlyphs = allowedGlyphs
	}
}

export const SCENARIOS = {}
SCENARIOS["test"] = new Scenario([
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
], [
	{
		"name": "Elemental Fire",
		"molecule": [
			[
				["Fire", 0, 0, 0]
			]
		]
	}
], [
	"Fixed-Length Arm",
	"Fixed-Length Double Arm",
	"Fixed-Length Triple Arm",
	"Fixed-Length Sextuple Arm",
	"Piston Arm",
	"Van Berlo's Wheel",
], ["Glyph of Bonding"])