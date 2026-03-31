export class Scenario{
	constructor(allowedMechanisms){
		this.allowedMechanisms = allowedMechanisms
	}
}

export const SCENARIOS = {}
SCENARIOS["test"] = new Scenario(["Piston"])