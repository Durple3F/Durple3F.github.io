import { createMolecule } from "./util"

export class Scenario{
	constructor(productList, allowedMechanisms){
		this.productMolecules = productList
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
				["Fire", 1, -1, 0]
			], [
				[0, 1]
			]
		]
	}
], ["Piston"])