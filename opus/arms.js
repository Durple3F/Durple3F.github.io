import { Hex, Component } from "./util";

export const ARMTYPES = {};
export class ArmMechanismType {
	constructor(id, abilities = {}, armDirectionList = [Hex.directions[0]], atomList = []) {
		this.id = id;
		this.armDirectionList = armDirectionList;
		this.atomList = atomList;
		this.abilities = {
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
new ArmMechanismType("Fixed-Length Arm");
new ArmMechanismType("Fixed-Length Double Arm", {}, [Hex.directions[0], Hex.directions[3]]);
new ArmMechanismType("Fixed-Length Triple Arm", {}, [Hex.directions[0], Hex.directions[2], Hex.directions[4]]);
new ArmMechanismType("Fixed-Length Sextuple Arm", {}, Hex.directions.map(d => d));
new ArmMechanismType("Piston Arm", {
	"piston_extend": true,
	"piston_retract": true
});

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
