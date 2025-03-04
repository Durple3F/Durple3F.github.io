const pokemonMoveData = {
	"Bug Bite": {
		name: "Bug Bite",
		type: "Bug",
		category: "Physical",
		strategy: "basic-damage",
		pp: 20,
		power: 60,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			green: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Bug Bite.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "load-number", value: 1 },
			{ type: "select-energy-colors", search: "most-full", target: "opponent", count: -1 },
			{ type: "load-number", value: -2 },
			{ type: "gain-energy", count: -1, colors: -2, target: "opponent" },
			{ type: "load-number", value: -1 },
			{ type: "multiply-energy", amounts: -2, scale: -1 },
			{ type: "gain-energy", amounts: -1, target: "player" }
		],
	},
	"Ember": {
		name: "Ember",
		type: "Fire",
		category: "Special",
		strategy: "basic-damage",
		pp: 25,
		power: 40,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			red: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Ember.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-number", value: 10 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "load-number", value: 3 },
			{ type: "select-random-tiles", count: -1 },
			{
				type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Burn", type: "debuff", duration: null }
			}
		],
	},
	"Growl": {
		name: "Growl",
		type: "Normal",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 40,
		power: null,
		accuracy: 100,
		rechargeTurns: 0,
		energy: {
			orange: 3,
			green: 1
		},
		sounds: {
			"attack": "src/audio/attacks/Growl.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", debuff: {
					type: "stat",
					stat: "attack",
					amount: -1
				}
			}
		],
	},
	"Leafage": {
		name: "Leafage",
		type: "Grass",
		category: "Physical",
		strategy: "basic-damage",
		pp: 25,
		power: 40,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			green: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Leafage.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "load-number", value: 3 },
			{ type: "select-random-tiles", count: -1 },
			{ type: "change-tile-type", selection: "group", which: -1, targetType: "green" },
		],
	},
	"Leer": {
		name: "Leer",
		type: "Normal",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 30,
		power: null,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			purple: 2
		},
		sounds: {
			"attack": "src/audio/attacks/Leer.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", debuff: {
					type: "stat",
					stat: "defense",
					amount: -1
				}
			}
		],
	},
	"Payback": {
		name: "Payback",
		type: "Dark",
		category: "Physical",
		strategy: "basic-damage",
		pp: 10,
		power: 50,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			purple: 4,
			orange: 2
		},
		sounds: {
			"attack": "src/audio/attacks/Payback.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-stat", which: "speed", target: "player" },
			{ type: "get-stat", which: "speed", target: "opponent" },
			{ type: "jump-if-less-than", jumpTo: 6 },
			{ type: "damage" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-number", value: 50 },
			{ type: "damage", additivePower: -1 }
		],
	},
	"Peck": {
		name: "Peck",
		type: "Flying",
		category: "Physical",
		strategy: "basic-damage",
		pp: 35,
		power: 35,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			yellow: 2
		},
		sounds: {
			"attack": "src/audio/attacks/Peck.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" }
		],
	},
	"Pound": {
		name: "Pound",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		pp: 35,
		power: 40,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			red: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Pound.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" }
		],
	},
	"String Shot": {
		name: "String Shot",
		type: "Bug",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 40,
		power: null,
		accuracy: 95,
		rechargeTurns: 1,
		energy: {
			green: 3,
			blue: 1
		},
		sounds: {
			"attack": "src/audio/attacks/String Shot.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", debuff: {
					type: "stat",
					stat: "speed",
					amount: -2
				}
			}
		],
	},
	"Struggle": {
		name: "Struggle",
		type: "Typeless",
		category: "Physical",
		strategy: "last-priority",
		pp: 1,
		power: 50,
		rechargeTurns: 0,
		energy: {},
		sounds: {
			"attack": "src/audio/attacks/Struggle.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "recoil-percent", percent: 0.25 },
			{ type: "shuffle" },
			{ type: "end-turn" }
		],
	},
	"Supersonic": {
		name: "Supersonic",
		type: "Normal",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 20,
		power: null,
		accuracy: 55,
		rechargeTurns: 1,
		energy: {
			purple: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Supersonic part 1.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", statusEffect: "confused", target: "opponent" }
		],
	},
	"Swift": {
		name: "Swift",
		type: "Normal",
		category: "Special",
		strategy: "basic-damage",
		pp: 20,
		power: 60,
		accuracy: null,
		bypassAccuracyChecks: true,
		rechargeTurns: 0,
		energy: {
			yellow: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Swift.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" }
		],
	},
	"Tackle": {
		name: "Tackle",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		pp: 35,
		power: 40,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			orange: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Tackle.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" }
		],
	},
	"Tail Whip": {
		name: "Tail Whip",
		type: "Normal",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 30,
		power: null,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			purple: 2
		},
		sounds: {
			"attack": "src/audio/attacks/Tail Whip.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", debuff: {
					type: "stat",
					stat: "defense",
					amount: -1
				}
			}
		],
	},
	"Water Gun": {
		name: "Water Gun",
		type: "Water",
		category: "Special",
		strategy: "basic-damage",
		pp: 25,
		power: 40,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			blue: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Water Gun.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "count-tiles", options: { type: "blue" } },
			{ type: "load-number", value: 2 },
			{ type: "multiply-numbers" },
			{ type: "damage", additivePower: 2 }
		],
	},
	"Wrap": {
		name: "Wrap",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		pp: 20,
		power: 15,
		accuracy: 90,
		rechargeTurns: 1,
		energy: {
			green: 0,
			purple: 0
		},
		sounds: {
			"attack": "src/audio/attacks/Tail Whip.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "random-number", min: 2, max: 5 },
			{ type: "select-random-tiles", count: -1 },
			{
				type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Wrap", type: "debuff", duration: null }
			},
		],
	},
};

for (let name in pokemonData){
	pokemonData[name].learnset.splice(0, 0, {
		name: "Struggle",
		unlock: {
			type: "never"
		}
	})
}