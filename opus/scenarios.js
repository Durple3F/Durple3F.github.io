export class Scenario{
	constructor(productList, reagentList, allowedMechanisms){
		this.productMolecules = productList
		this.reagentMolecules = reagentList
		this.allowedMechanisms = allowedMechanisms
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
], ["Piston"])