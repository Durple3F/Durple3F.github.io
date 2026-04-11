import { Hex, Component, Atom } from "./util";

export const ARMTYPES = {};
export class ArmMechanismType {
	constructor(id, defaultPrice, abilities = {}, armDirectionList = [Hex.directions[0]], atomList = []) {
		this.id = id;
		this.defaultPrice = defaultPrice
		this.armDirectionList = armDirectionList;
		this.atomList = atomList;
		this.abilities = {
			"min_length": 1,
			"max_length": 3,
			"rotator_ccw": true,
			"rotator_cw": true,
			"pivot_ccw": true,
			"pivot_cw": true,
			"piston_extend": false,
			"piston_retract": false,
			"grabber_grab": true,
			"grabber_drop": true,
		};
		for (let ability in this.abilities) {
			if (ability in abilities) {
				this.abilities[ability] = abilities[ability];
			}
		}
		ARMTYPES[this.id] = this
	}
}
new ArmMechanismType("Fixed-Length Arm", 20);
new ArmMechanismType("Fixed-Length Double Arm", 20, {}, [Hex.directions[0], Hex.directions[3]]);
new ArmMechanismType("Fixed-Length Triple Arm", 20, {}, [Hex.directions[0], Hex.directions[2], Hex.directions[4]]);
new ArmMechanismType("Fixed-Length Sextuple Arm", 20, {}, Hex.directions.map(d => d));
new ArmMechanismType("Piston Arm", 40, {
	"piston_extend": true,
	"piston_retract": true
});
new ArmMechanismType("Van Berlo's Wheel", 30, {
	"min_length": 1,
	"max_length": 1,
	"grabber_grab": false,
	"grabber_drop": false
}, Hex.directions.map(d => d), [
	new Atom("Fire").setCoords(-1, 1, 0),
	new Atom("Air").setCoords(0, -1, 1),
	new Atom("Salt").setCoords(1, 0, -1),
	new Atom("Water").setCoords(1, -1, 0),
	new Atom("Earth").setCoords(0, 1, -1),
	new Atom("Salt").setCoords(-1, 0, 1),
])

export class ArmMechanism extends Component {
	constructor(typeId) {
		super();
		this.type = "ArmMechanism";
		let type = ARMTYPES[typeId];
		this.mechanismType = type;
		this.program = null;
		this.attachedTrack = null;
		this.attachedTrackIndex = null;
		for (let armLocation of type.armDirectionList) {
			let arm = new Arm(this.homeTile, armLocation);
			this.arms.contents.push(arm);
		}

		for (let atom of type.atomList){
			let clone = atom.clone()
			this.atoms.contents.push(clone)
		}
	}

	clone() {
		let clone = new ArmMechanism(this.mechanismType.id);
		clone.homeTile = this.homeTile;
		clone.arms.contents.length = 0;
		let origin = new Hex(0, 0, 0);
		for (let arm of this.arms.contents) {
			let armClone = new Arm(origin, arm.direction);
			armClone.distance = arm.distance;
			clone.arms.contents.push(armClone);
		}
		clone.program = this.program.clone(clone);
		clone.currentHexRotation = this.currentHexRotation;
		clone.rotationPoint = this.rotationPoint;
		clone.attachedTrack = this.attachedTrack;
		clone.attachedTrackIndex = this.attachedTrackIndex;
		return clone;
	}
}

export class Arm {
	constructor(home, hand) {
		//Arms remember their coordinates by storing the distance of their arm and a normal vector that shows the direction.
		this.distance = home.distance(hand);
		this.direction = hand;
		this.isGripping = false;
		this.grippedComponent = null;
	}
	setDirection(q, r, s) {
		this.direction = new Hex(q, r, s);
	}
	setCoords(q, r, s) {
		this.direction = new Hex(q, r, s);
	}
}
