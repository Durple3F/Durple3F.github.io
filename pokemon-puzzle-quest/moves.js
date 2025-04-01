const pokemonMoveData = {
	"Absorb": {
		name: "Absorb",
		type: "Grass",
		category: "Special",
		strategy: "basic-damage",
		pp: 25,
		power: 20,
		accuracy: 100,
		rechargeTurns: 2,
		energy: {
			green: 5,
			red: 2
		},
		sounds: {
			"attack": "src/audio/attacks/Absorb part 1.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "load-value", value: 0.5 },
			{ type: "multiply-numbers" },
			{ type: "load-value", value: 1 },
			{ type: "heal", target: "user", amount: -2, min: -1 },
		],
	},
	"Astonish": {
		name: "Astonish",
		type: "Ghost",
		category: "Physical",
		strategy: "basic-damage",
		pp: 15,
		power: 30,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			purple: 9,
			yellow: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Astonish.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "get-initiative", target: "opponent" },
			{ type: "load-value", value: 0.5 },
			{ type: "multiply-numbers" },
			{ type: "set-initiative", target: "opponent", initiative: -1 },
		],
	},
	"Aqua Jet": {
		name: "Aqua Jet",
		type: "Water",
		category: "Physical",
		strategy: "basic-damage",
		pp: 20,
		power: 40,
		accuracy: 100,
		rechargeTurns: 2,
		energy: {
			blue: 15,
			yellow: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Aqua Jet.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "get-viable-pokemon", target: "opponent" },
			{ type: "get-active-pokemon", target: "opponent" },
			{ type: "remove-element-from-list", list: -2, element: -1 },
			{ type: "get-list-length", list: -1 },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "choose-pokemon", target: "user", message: "choose-pokemon", pokemon: -4, strategy: "damage" },
			{ type: "load-value", value: 0 },
			{ type: "get-element-from-list", list: -2, index: -1 },
			{ type: "load-value", value: -20 },
			{ type: "damage", toPokemon: -2, additivePower: -1 }
		],
	},
	"Bite": {
		name: "Bite",
		type: "Dark",
		category: "Physical",
		strategy: "basic-damage",
		pp: 25,
		power: 60,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			purple: 12,
			green: 4,
			yellow: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Bite.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "load-value", value: 1 },
			{ type: "choose-tiles", count: -1, target: "user" },
			{ type: "load-value", value: 2 },
			{ type: "load-value", value: 2 },
			{ type: "expand-tile-selection", selection: -3, width: -2, height: -1 },
			{ type: "remove-tiles", selection: -1 }
		],
	},
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
			green: 8,
			orange: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Bug Bite.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "load-value", value: 3 },
			{ type: "select-energy-colors", search: "most-full", target: "opponent", count: -1 },
			{ type: "load-value", value: -2 },
			{ type: "gain-energy", count: -1, colors: -2, target: "opponent" },
			{ type: "load-value", value: -1 },
			{ type: "multiply-energy", amounts: -2, scale: -1 },
			{ type: "gain-energy", amounts: -1, target: "user" }
		],
	},
	"Charm": {
		name: "Charm",
		type: "Fairy",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 20,
		power: null,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			purple: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Charm.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", target: "opponent", debuff: {
					type: "stat",
					stat: "attack",
					amount: -1
				}
			}
		],
	},
	"Curse": {
		name: "Curse",
		type: "Ghost",
		category: "Status",
		strategy: "special",
		pp: 10,
		power: null,
		accuracy: null,
		rechargeTurns: 3,
		energy: {
			red: 1,
			orange: 1,
			yellow: 1,
			green: 1,
			blue: 1,
			purple: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Curse.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-types", target: "user" },
			{ type: "load-value", value: "Ghost" },
			{ type: "jump-if-includes", jumpTo: "Ghost"},
			{
				type: "apply-debuff", target: "user",
				debuff: { type: "stat", stat: "speed", amount: -1 }
			},
			{
				type: "apply-debuff", target: "user",
				debuff: { type: "stat", stat: "attack", amount: 1 }
			},
			{
				type: "apply-debuff", target: "user",
				debuff: { type: "stat", stat: "defense", amount: 1 }
			},
			{ type: "jump", jumpTo: Infinity},
			{ type: "load-value", value: 1, label: "Ghost" },
			{ type: "select-random-tiles", count: -1 },
			{
				type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Cursed", type: "debuff", duration: null }
			}
		],
	},
	"Disarming Voice": {
		name: "Disarming Voice",
		type: "Fairy",
		category: "Special",
		strategy: "basic-damage",
		pp: 15,
		power: 40,
		accuracy: null,
		bypassAccuracyChecks: true,
		rechargeTurns: 1,
		energy: {
			purple: 8,
			blue: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Disarming Voice.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 6 },
			{ type: "jump-if-less-than", jumpTo: "end" },
			{ type: "apply-status-effect", statusEffect: "confused", target: "opponent" },
			{ type: "load-value", value: 6, label: "end" },
			{ type: "end-turn", label: "end" }
		],
	},
	"Echoed Voice": {
		name: "Echoed Voice",
		type: "Normal",
		category: "Special",
		strategy: "basic-damage",
		pp: 15,
		power: 40,
		accuracy: 100,
		rechargeTurns: 0,
		energy: {
			yellow: 12
		},
		sounds: {
			"attack": "src/audio/attacks/Echoed Voice.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "remove-status-effect", target: "user", statusName: "cost-reduction-from-echoed-voice" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "echoed-voice-cost-reduction",
				type: "cost-alteration",
				stacks: false,
				appliesTo: {
					name: "Echoed Voice"
				},
				turns: 2,
				energyCost: {
					yellow: -6
				}
			} }
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
			red: 12
		},
		sounds: {
			"attack": "src/audio/attacks/Ember.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 6 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "load-value", value: 3 },
			{ type: "select-random-tiles", count: -1 },
			{
				type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Burn", type: "debuff", duration: null }
			}
		],
	},
	"Fake Out": {
		name: "Fake Out",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		pp: 10,
		power: 40,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			purple: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Fake Out.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "end-turn" }
		],
		onTurnStart: [
			{ type: "is-trainers-turn", target: "user" },
			{ type: "load-value", value: false },
			{ type: "jump-if-equal", jumpTo: Infinity},
			{ type: "get-status-stacks", statusName: "fake-out-turns-out" },
			{ type: "load-value", value: 2 },
			{ type: "jump-if-equal", jumpTo: "alter-cost" },
			{ type: "jump-if-less-than", test: -3, against: -2, jumpTo: "add-status" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "apply-status-effect", target: "user", label: "alter-cost", statusEffect: {
				name: "fake-out-cost-reduction",
				type: "cost-alteration",
				stacks: false,
				lostOnSwap: true,
				appliesTo: {
					name: "Fake Out"
				},
				energyCost: {
					purple: 7
				}
			} },
			{ type: "jump", jumpTo: Infinity },
			{ type: "apply-status-effect", target: "user", label: "add-status", statusEffect: {
				name: "fake-out-turns-out",
				type: "hidden",
				stacks: true,
				lostOnSwap: true
			} },
		]
	},
	"Feint": {
		name: "Feint",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		pp: 10,
		power: 30,
		accuracy: 100,
		rechargeTurns: 2,
		energy: {
			yellow: 5,
			orange: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Feint.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "remove-status", statusName: "invulnerable" },
			{ type: "damage" }
		]
	},
	"Focus Energy": {
		name: "Focus Energy",
		type: "Normal",
		category: "Status",
		strategy: "buff-user",
		pp: 30,
		power: null,
		accuracy: null,
		rechargeTurns: 2,
		energy: {
			blue: 5,
			purple: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Focus Energy.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", target: "user", debuff: {
					type: "stat",
					stat: "attack",
					amount: 2
				}
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
		rechargeTurns: 1,
		energy: {
			orange: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Growl.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", target: "opponent", debuff: {
					type: "stat",
					stat: "attack",
					amount: -1
				}
			}
		],
	},
	"Harden": {
		name: "Harden",
		type: "Normal",
		category: "Status",
		strategy: "last-priority",
		pp: 30,
		power: null,
		accuracy: 0,
		rechargeTurns: 5,
		energy: {},
		sounds: {
			"attack": "src/audio/attacks/Harden.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", statusEffect: "invulnerable", target: "user" },
			{ type: "end-turn" }
		],
	},
	"Infestation": {
		name: "Infestation",
		type: "Bug",
		category: "Special",
		strategy: "basic-damage",
		pp: 20,
		power: 20,
		accuracy: 100,
		rechargeTurns: 0,
		energy: {
			green: 5,
			yellow: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Infestation.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "load-value", value: 1 },
			{
				type: "select-random-tiles", count: -1,
				conditions: { notTypes: ["green"] }
			},
			{ type: "change-tile-type", selection: "group", which: -1, targetType: "green" },
			{
				type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Infested", type: "debuff", duration: null }
			},
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
			green: 12
		},
		sounds: {
			"attack": "src/audio/attacks/Leafage.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "load-value", value: 3 },
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
			purple: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Leer.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", target: "opponent", debuff: {
					type: "stat",
					stat: "defense",
					amount: -1
				}
			}
		],
	},
	"Lick": {
		name: "Lick",
		type: "Ghost",
		category: "Physical",
		strategy: "basic-damage",
		pp: 30,
		power: 30,
		accuracy: 100,
		rechargeTurns: 2,
		energy: {
			purple: 5,
			red: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Lick.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "load-value", value: 0.5 },
			{ type: "change-tile-weight", tileType: "green", factor: -1 },
			{ type: "load-value", value: -1 },
			{ type: "multiply-numbers" },
			{ type: "change-tile-weight", tileType: "black", add: -1 },
		],
	},
	"Mud-Slap": {
		name: "Mud-Slap",
		type: "Ground",
		category: "Special",
		strategy: "basic-damage",
		pp: 10,
		power: 20,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			orange: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Mud-Slap.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "load-value", value: 2 },
			{ type: "select-random-tiles", count: -1 },
			{
				type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Energy Down", type: "debuff", duration: null }
			},
		],
	},
	"Nasty Plot": {
		name: "Nasty Plot",
		type: "Dark",
		category: "Status",
		strategy: "buff-user",
		pp: 20,
		power: null,
		accuracy: null,
		rechargeTurns: 2,
		energy: {
			orange: 5,
			purple: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Nasty Plot.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", target: "user", debuff: {
					type: "stat",
					stat: "specialAttack",
					amount: 2
				}
			}
		],
	},
	"Nuzzle": {
		name: "Nuzzle",
		type: "Electric",
		category: "Physical",
		strategy: "debuff-opponent",
		pp: 20,
		power: 20,
		accuracy: 100,
		rechargeTurns: 2,
		energy: {
			yellow: 12
		},
		sounds: {
			"attack": "src/audio/attacks/Nuzzle.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "apply-status-effect", statusEffect: "paralyzed", target: "opponent" }
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
			purple: 8,
			orange: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Payback.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-stat", which: "speed", target: "user" },
			{ type: "get-stat", which: "speed", target: "opponent" },
			{ type: "jump-if-less-than", jumpTo: 6 },
			{ type: "damage" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 50 },
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
			yellow: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Peck.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "end-turn" }
		],
	},
	"Play Nice": {
		name: "Play Nice",
		type: "Normal",
		category: "Status",
		strategy: "special",
		pp: 20,
		power: null,
		accuracy: null,
		rechargeTurns: 2,
		energy: {
			purple: 5,
			yellow: 2
		},
		sounds: {
			"attack": "src/audio/attacks/Play Nice.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", target: "opponent", debuff: {
					type: "stat",
					stat: "attack",
					amount: -1
				}
			},
			{ type: "load-value", value: 2 },
			{ type: "choose-tiles", count: -1, target: "user" },
			{ type: "swap-tiles", selection: -1 },
		],
	},
	"Poison Sting": {
		name: "Poison Sting",
		type: "Poison",
		category: "Physical",
		strategy: "basic-damage",
		pp: 35,
		power: 15,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			purple: 7
		},
		sounds: {
			"attack": "src/audio/attacks/Poison Sting.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 8 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "apply-status-effect", statusEffect: "poisoned", target: "opponent" },
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
			red: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Pound.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "end-turn" }
		],
	},
	"Quick Attack": {
		name: "Quick Attack",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		pp: 30,
		power: 40,
		accuracy: 100,
		rechargeTurns: 0,
		energy: {
			yellow: 2,
			orange: 1
		},
		sounds: {
			"attack": "src/audio/attacks/Quick Attack.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" }
		],
	},
	"Roar": {
		name: "Roar",
		type: "Normal",
		category: "Status",
		strategy: "special",
		pp: 20,
		power: null,
		accuracy: null,
		rechargeTurns: 5,
		energy: {
			red: 6,
			orange: 5,
			yellow: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Roar.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-viable-pokemon", target: "opponent" },
			{ type: "get-active-pokemon", target: "opponent" },
			{ type: "remove-element-from-list", list: -2, element: -1 },
			{ type: "get-list-length", list: -1 },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "choose-pokemon", target: "opponent", message: "choose-pokemon", pokemon: -4, strategy: "swap" },
			{ type: "load-value", value: 0 },
			{ type: "get-element-from-list", list: -2, index: -1 },
			{ type: "swap-pokemon", target: "opponent", pokemon: -1 },
		],
	},
	"Scratch": {
		name: "Scratch",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		pp: 35,
		power: 40,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			yellow: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Pound.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "end-turn" }
		],
	},
	"Shadow Sneak": {
		name: "Shadow Sneak",
		type: "Ghost",
		category: "Physical",
		strategy: "basic-damage",
		pp: 30,
		power: 40,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			purple: 15,
			green: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Shadow Sneak.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "count-viable-pokemon", target: "user" },
			{ type: "count-viable-pokemon", target: "opponent" },
			{ type: "jump-if-equal", jumpTo: "tiny-damage" },
			{ type: "load-value", value: 40 },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "damage", label: "tiny-damage" }
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
			blue: 12
		},
		sounds: {
			"attack": "src/audio/attacks/String Shot.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", target: "opponent", debuff: {
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
			purple: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Supersonic part 1.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", statusEffect: "confused", target: "opponent" }
		],
	},
	"Sweet Kiss": {
		name: "Sweet Kiss",
		type: "Normal",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 10,
		power: null,
		accuracy: 75,
		rechargeTurns: 1,
		energy: {
			purple: 4,
			blue: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Sweet Kiss part 1.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", statusEffect: "confused", target: "opponent" },
			{ type: "shuffle" }
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
			yellow: 8
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
			orange: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Tackle.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "end-turn" }
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
			purple: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Tail Whip.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", target: "opponent", debuff: {
					type: "stat",
					stat: "defense",
					amount: -1
				}
			}
		],
	},
	"Thunder Shock": {
		name: "Thunder Shock",
		type: "Electric",
		category: "Special",
		strategy: "basic-damage",
		pp: 30,
		power: 40,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			yellow: 10
		},
		sounds: {
			"attack": "src/audio/attacks/Thunder Shock.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 6 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "load-value", value: 2 },
			{ type: "select-random-tiles", count: -1 },
			{
				type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Static", type: "buff", duration: null }
			}
		],
	},
	"Thunder Wave": {
		name: "Thunder Wave",
		type: "Electric",
		category: "Status",
		strategy: "basic-damage",
		pp: 20,
		power: null,
		accuracy: 90,
		rechargeTurns: 1,
		energy: {
			// yellow: 8
		},
		sounds: {
			"attack": "src/audio/attacks/Thunder Wave part 1.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-board-width" },
			{ type: "load-value", value: -1 },
			{ type: "add-numbers" },
			{ type: "load-value", value: 0 },
			{ type: "random-number", min: -1, max: -2, useArgs: true },
			{ type: "select-column", x: -1 },
			// { 
			// 	type: "select-tiles",
			// 	conditionExpression: "x == %c%",
			// 	conditionArguments: [-1]
			// },
			{
				type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Static", type: "buff", duration: null }
			}
		],
	},
	"Vise Grip": {
		name: "Vise Grip",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		pp: 30,
		power: 55,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			green: 5,
			yellow: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Vice Grip.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "load-value", value: 1 },
			{ type: "choose-tiles", count: -1, target: "user" },
			{
				type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Locked", type: "debuff", duration: 1 }
			}
		],
	},
	"Water Gun": {
		name: "Water Gun",
		type: "Water",
		category: "Special",
		strategy: "basic-damage",
		pp: 25,
		power: 35, //originally 40
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			blue: 12
		},
		sounds: {
			"attack": "src/audio/attacks/Water Gun.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "count-tiles", options: { type: "blue" } },
			{ type: "load-value", value: 2 },
			{ type: "multiply-numbers" },
			{ type: "damage", additivePower: -1 }
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
			green: 5,
			purple: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Wrap.mp3"
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
	"Yawn": {
		name: "Yawn",
		type: "Normal",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 10,
		power: null,
		accuracy: 0,
		rechargeTurns: 3,
		energy: {
			blue: 6,
			purple: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Yawn.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", statusEffect: "drowsy", target: "opponent" }
		],
	},
};

for (let name in pokemonData) {
	pokemonData[name].learnset.splice(0, 0, {
		name: "Struggle",
		unlock: {
			type: "never"
		}
	})
}
fixLearnsets()