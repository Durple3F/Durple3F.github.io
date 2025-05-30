const pokemonMoveData = {
	//Steals some hp
	"Absorb": {
		name: "Absorb",
		type: "Grass",
		category: "Special",
		strategy: "basic-damage",
		tags: ["healing"],
		pp: 25,
		power: 20,
		accuracy: 100,
		rechargeTurns: 2,
		energy: {
			green: 3,
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
	//Places status effects on tiles
	"Acid Spray": {
		name: "Acid Spray",
		type: "Poison",
		category: "Special",
		strategy: "basic-damage",
		pp: 20,
		power: 40,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			yellow: 3,
			purple: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Acid Spray.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "load-value", value: 3 },
			{ type: "select-random-tiles", count: -1 },
			{
				type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Acidic", type: "buff" }
			}
		]
	},
	//Removes 3 tiles that share a color
	"Aerial Ace": {
		name: "Aerial Ace",
		type: "Flying",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 20,
		power: 60,
		accuracy: null,
		rechargeTurns: 1,
		energy: {
			blue: 6,
			yellow: 2
		},
		sounds: {
			"attack": "src/audio/attacks/Aerial Ace.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "load-value", value: 3 },
			{ type: "load-value", value: true },
			{ type: "choose-tiles", count: -2, sameType: -1, target: "user", text: "choose" },
			{ type: "remove-tiles", selection: -1 }
		]
	},
	//Raises your speed 2 stages
	"Agility": {
		name: "Agility",
		type: "Psychic",
		category: "Status",
		strategy: "buff-user",
		pp: 30,
		power: null,
		accuracy: null,
		rechargeTurns: 7,
		energy: {
			purple: 5,
			yellow: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Agility part 1.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", target: "user", debuff: {
					type: "stat",
					class: "buff",
					stat: "speed",
					amount: 2
				}
			}
		],
	},
	//Removes a V-shaped selection of tiles
	"Air Cutter": {
		name: "Air Cutter",
		type: "Flying",
		category: "Special",
		strategy: "basic-damage",
		pp: 25,
		power: 60,
		accuracy: 95,
		rechargeTurns: 1,
		energy: {
			blue: 10,
			yellow: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Air Cutter.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "load-value", value: 1 },
			{ type: "choose-tiles", count: -1, target: "user", text: "choose" },
			{ type: "select-tiles-around-given-tile", selection: -1,
				diffs: [
					[-2, -2],
					[-1, -1],
					[2, -2],
					[1, -1],
				]
			},
			{ type: "remove-tiles", selection: -1 }
		]
	},
	//Deals damage with a chance to raise all stats
	"Ancient Power": {
		name: "Ancient Power",
		type: "Rock",
		category: "Special",
		strategy: "basic-damage",
		pp: 5,
		power: 60,
		accuracy: 100,
		rechargeTurns: 3,
		energy: {
			red: 3,
			orange: 3,
			yellow: 3,
			green: 3,
			blue: 3,
			purple: 3,
		},
		sounds: {
			"attack": "src/audio/attacks/Ancient Power.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 6 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{
				type: "apply-debuff", target: "user", debuff: {
					type: "stat",
					stat: "attack",
					class: "buff",
					amount: 1
				}
			},
			{
				type: "apply-debuff", target: "user", debuff: {
					type: "stat",
					stat: "defense",
					class: "buff",
					amount: 1
				}
			},
			{
				type: "apply-debuff", target: "user", debuff: {
					type: "stat",
					stat: "specialAttack",
					class: "buff",
					amount: 1
				}
			},
			{
				type: "apply-debuff", target: "user", debuff: {
					type: "stat",
					stat: "specialDefense",
					class: "buff",
					amount: 1
				}
			},
			{
				type: "apply-debuff", target: "user", debuff: {
					type: "stat",
					stat: "speed",
					class: "buff",
					amount: 1
				}
			},
		]
	},
	//Converts your non-orange energy into orange
	"Arm Thrust": {
		name: "Arm Thrust",
		type: "Fighting",
		category: "Physical",
		strategy: "basic-damage",
		pp: 20,
		power: 15,
		accuracy: 100,
		rechargeTurns: 0,
		energy: {
			orange: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Arm Thrust 1hit.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "load-value", value: 1 },
			{
				type: "select-energy-colors", search: "most-full",
				target: "user", count: -1, notTypes: ["orange"]
			},
			{ type: "load-value", value: -2 },
			{ type: "gain-energy", count: -1, colors: -2, target: "user" },
			{ type: "load-value", value: -0.5 },
			{ type: "multiply-energy", amounts: -2, scale: -1, round: "up" },
			{ type: "convert-energy", amounts: -1, ratios: { orange: 1 } },
			{ type: "gain-energy", amounts: -1, target: "user" }
		]
	},
	//Deals more damage if opponent took damage this turn
	"Assurance": {
		name: "Assurance",
		type: "Dark",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 10,
		power: 40, //Originally 60
		accuracy: 100,
		rechargeTurns: 4,
		energy: {
			orange: 6,
			yellow: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Assurance.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-pokemon-data", target: "opponent", key: "damagedThisTurn" },
			{ type: "jump-if-truthy", jumpTo: "double-damage" },
			{ type: "damage" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "damage", damageMult: 2, label: "double-damage" },
		],
	},
	//Damages and reduces opponent's initiative
	"Astonish": {
		name: "Astonish",
		type: "Ghost",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 15,
		power: 30,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			purple: 6,
			yellow: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Astonish.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "get-initiative", target: "opponent" },
			{ type: "load-value", value: 0.5 },
			{ type: "multiply-numbers" },
			{ type: "set-initiative", target: "opponent", initiative: -1 },
		]
	},
	//Damages a non-active pokemon
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
			blue: 9,
			yellow: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Aqua Jet.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
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
		]
	},
	//Temporarily prevents switching out
	"Baby-Doll Eyes": {
		name: "Baby-Doll Eyes",
		type: "Fairy",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 30,
		power: null,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			purple: 4,
			yellow: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Baby-Doll Eyes.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", target: "opponent", debuff: {
					type: "stat",
					class: "debuff",
					stat: "attack",
					amount: -1
				}
			},
			{ type: "apply-status-effect", target: "opponent", statusEffect: {
				name: "baby-doll-eyes-cant-switch",
				type: "cant-switch",
				stacks: false,
				volatile: true,
				lostOnSwap: true,
				turns: 5,
				lostOnBatonPass: true
			} },
		],
	},
	//Swaps all your status effects with another pokemon's
	"Baton Pass": {
		name: "Baton Pass",
		type: "Normal",
		category: "Status",
		strategy: "special",
		tags: [],
		pp: 40,
		power: null,
		accuracy: null,
		rechargeTurns: 7,
		energy: {
			green: 8,
			orange: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Baton Pass.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-viable-pokemon", target: "user" },
			{ type: "get-active-pokemon", target: "user" },
			{ type: "remove-element-from-list", list: -2, element: -1 },
			{ type: "get-list-length", list: -1 },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "choose-pokemon", target: "user", message: "choose-pokemon", pokemon: -4, strategy: "swap" },
			{ type: "load-value", value: 0 },
			{ type: "get-element-from-list", list: -2, index: -1 },
			{ type: "swap-pokemon", target: "user", pokemon: -1, keepEnergy: true, batonPass: true },
		]
	},
	//Deals damage based on all your remaining viable pokemon's stats
	"Beat Up": {
		name: "Beat Up",
		type: "Fighting",
		category: "Physical",
		strategy: "special",
		tags: ["damage-dealing", "makes-contact"],
		pp: 10,
		power: 0,
		accuracy: 100,
		rechargeTurns: 2,
		energy: {
			purple: 4,
			orange: 10
		},
		sounds: {
			"attack": "src/audio/attacks/Beat Up 1hit.mp3"
		},
		effects: [
			{ type: "get-viable-pokemon", target: "user" },
			{ type: "get-stats-from-pokemon-list", list: -1, which: "attack", base: true },
			{ type: "save-variable", name: "attacks", save: -1 },
			{ type: "get-list-length", list: -1 },
			{ type: "save-variable", name: "length", save: -1 },
			{ type: "load-value", value: 0 },
			{ type: "save-variable", name: "counter", save: -1 },
			
			{ type: "load-variable", name: "counter" },
			{ type: "load-variable", name: "length" },
			{ type: "jump-if-less-than", jumpTo: "startLoop" },
			{ type: "jump", jumpTo: "endLoop" },

			{ type: "load-variable", name: "attacks", label: "startLoop" },
			{ type: "load-variable", name: "counter" },
			{ type: "get-element-from-list", list: -2, index: -1 },
			{ type: "load-value", value: 10 },
			{ type: "divide-numbers" },
			{ type: "load-value", value: 5 },
			{ type: "add-numbers" },
			{ type: "play-sound", name: "attack" },
			{ type: "damage", additivePower: -2 },
			{ type: "log-value" },
			{ type: "load-variable", name: "counter" },
			{ type: "load-value", value: 1 },
			{ type: "add-numbers" },
			{ type: "save-variable", name: "counter", save: -1 },
			{ type: "load-variable", name: "length" },
			{ type: "jump-if-less-than", jumpTo: "startLoop" },
			{ type: "jump", jumpTo: "endLoop" },

			{ type: "do-nothing", label: "endLoop" }
		],
	},
	//Deals damage on a delay
	"Bide": {
		name: "Bide",
		type: "Normal",
		category: "Physical",
		strategy: "special",
		tags: ["damage-dealing", "makes-contact"],
		pp: 10,
		power: null,
		accuracy: null,
		rechargeTurns: 5,
		energy: {
			red: 4,
			blue: 8
		},
		sounds: {
			"attack": "src/audio/attacks/Bide part 1.mp3",
			"activate": "src/audio/attacks/Bide part 2.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "bide-using-bide",
				type: "disability",
				tags: ["count-damage-received"],
				stacks: false,
				volatile: true,
				lostOnSwap: true,
				lostOnBatonPass: true,
				appliesTo: {
					logic: "not"
				},
			} },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "bide-wait-time",
				type: "hidden",
				stacks: false,
				volatile: true,
				lostOnSwap: true,
				lostOnBatonPass: true,
				turns: 2
			} },
		],
		onTurnStart: [
			{ type: "get-status-stacks", statusName: "bide-using-bide" },
			{ type: "jump-if-truthy", jumpTo: "bide-check" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "get-status-stacks", statusName: "bide-wait-time", label: "bide-check" },
			{ type: "jump-if-truthy", jumpTo: Infinity },
			{ type: "get-status-gamedata", key: "damageReceived", statusName: "bide-using-bide" },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-less-than", jumpTo: "remove-status" },
			{ type: "play-sound", name: "activate" },
			{ type: "get-status-gamedata", key: "damageReceived", statusName: "bide-using-bide" },
			{ type: "load-value", value: 2 },
			{ type: "multiply-numbers" },
			{ type: "damage", amount: -1 },
			{ type: "remove-status-effect", target: "user", statusName: "bide-using-bide", label: "remove-status" },
		]
	},
	//Removes a chunk of the board
	"Bite": {
		name: "Bite",
		type: "Dark",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact", "biting"],
		pp: 25,
		power: 60,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			purple: 6,
			green: 4,
			yellow: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Bite.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "load-value", value: 1 },
			{ type: "load-value", value: 4 },
			{ type: "load-value", value: 2 },
			{ type: "load-value", value: 2 },
			{ type: "choose-tiles", count: -4, max: -3, maxWidth: -2, maxHeight: -1, target: "user", text: "choose" },
			{ type: "load-value", value: 2 },
			{ type: "load-value", value: 2 },
			{ type: "expand-tile-selection", selection: -3, width: -2, height: -1 },
			{ type: "remove-tiles", selection: -1 }
		]
	},
	//Prevents switching out permanently
	"Block": {
		name: "Block",
		type: "Normal",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 5,
		power: null,
		accuracy: null,
		rechargeTurns: 10,
		energy: {
			blue: 4,
			yellow: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Block.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", target: "opponent", statusEffect: {
				name: "block-cant-switch",
				type: "cant-switch",
				stacks: false,
				volatile: true,
				lostOnSwap: true,
				lostOnOpponentSwap: true
			} },
		],
	},
	//50% chance to paralyze opponent
	"Body Slam": {
		name: "Body Slam",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 15,
		power: 85,
		accuracy: 100,
		rechargeTurns: 2,
		energy: {
			red: 5,
			orange: 9
		},
		sounds: {
			"attack": "src/audio/attacks/Body Slam.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 6 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "apply-status-effect", statusEffect: "paralyzed", target: "opponent" }
		]
	},
	//Removes light screen & reflect
	"Brick Break": {
		name: "Brick Break",
		type: "Fighting",
		category: "Physical",
		strategy: "basic-damage",
		pp: 15,
		power: 75,
		accuracy: 100,
		rechargeTurns: 2,
		energy: {
			red: 5,
			orange: 8
		},
		sounds: {
			"attack": "src/audio/attacks/Brick Break.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "remove-status-effect", target: "opponent", statusName: "light-screen" },
			{ type: "remove-status-effect", target: "opponent", statusName: "reflect" },
			{ type: "damage" }
		]
	},
	//Deals extra damage while below half health
	"Brine": {
		name: "Brine",
		type: "Water",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing"],
		pp: 10,
		power: 65,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			red: 3,
			blue: 6,
		},
		sounds: {
			"attack": "src/audio/attacks/Brine.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-hp", target: "user" },
			{ type: "get-max-hp", target: "user" },
			{ type: "divide-numbers" },
			{ type: "load-value", value: 0.5 },
			{ type: "jump-if-less-than", jumpTo: "big-damage" },
			{ type: "damage" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 2 },
			{ type: "damage", multiplicativePower: -1, label: "big-damage" }
		],
	},
	//Replaces some Grass and Water tiles with Dark tiles
	"Brutal Swing": {
		name: "Brutal Swing",
		type: "Dark",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 20,
		power: 60,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			purple: 8
		},
		sounds: {
			"attack": "src/audio/attacks/Brutal Swing.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "recoil-damage", damageMult: 0.25 },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "count-tiles", options: { type: "green" } },
			{ type: "load-value", value: 0.5 },
			{ type: "multiply-numbers", round: "up" },
			{
				type: "select-random-tiles", count: -1,
				conditions: { types: ["green"] }
			},
			{ type: "log-value" },
			{ type: "change-tile-type", selection: "group", which: -1, targetType: "black" },
			{ type: "count-tiles", options: { type: "purple" } },
			{ type: "load-value", value: 0.5 },
			{ type: "multiply-numbers", round: "up" },
			{
				type: "select-random-tiles", count: -1,
				conditions: { types: ["purple"] }
			},
			{ type: "change-tile-type", selection: "group", which: -1, targetType: "black" },
		]
	},
	//Makes tiles give extra blue energy
	"Bubble Beam": {
		name: "Bubble Beam",
		type: "Water",
		category: "Special",
		strategy: "basic-damage",
		pp: 20,
		power: 65,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			blue: 8,
			yellow: 8
		},
		sounds: {
			"attack": "src/audio/attacks/Bubble Beam.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "load-value", value: 8 },
			{ 
				type: "select-random-tiles", count: -1,
				conditions: { notTypes: ["blue"] }
			},
			{
				type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Bubbly", type: "buff", duration: null }
			}
		]
	},
	//Steals energy
	"Bug Bite": {
		name: "Bug Bite",
		type: "Bug",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 20,
		power: 60,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			green: 8,
			orange: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Bug Bite.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "load-value", value: 3 },
			{ type: "select-energy-colors", search: "most-full", target: "opponent", count: -1 },
			{ type: "load-value", value: -2 },
			{ type: "gain-energy", count: -1, colors: -2, target: "opponent" },
			{ type: "load-value", value: -1 },
			{ type: "multiply-energy", amounts: -2, scale: -1 },
			{ type: "gain-energy", amounts: -1, target: "user" }
		]
	},
	//Raises attack 1 and defense 1
	"Bulk Up": {
		name: "Bulk Up",
		type: "Fighting",
		category: "Status",
		strategy: "buff-user",
		pp: 20,
		power: null,
		accuracy: null,
		rechargeTurns: 2,
		energy: {
			orange: 5,
			green: 2
		},
		sounds: {
			"attack": "src/audio/attacks/Bulk Up.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", target: "user", debuff: {
					type: "stat",
					stat: "attack",
					class: "buff",
					amount: 1
				}
			},
			{
				type: "apply-debuff", target: "user", debuff: {
					type: "stat",
					stat: "defense",
					class: "buff",
					amount: 1
				}
			},
		],
	},
	//Removes the bottom layer of tiles
	"Bulldoze": {
		name: "Bulldoze",
		type: "Ground",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing"],
		pp: 20,
		power: 60,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			orange: 6,
			grass: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Bulldoze.mp3",
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{
				type: "apply-debuff", target: "opponent", debuff: {
					type: "stat",
					stat: "speed",
					class: "debuff",
					amount: -1
				}
			},
			{ type: "get-board-width" },
			{ type: "save-variable", name: "width", save: -1 },

			{ type: "get-board-height" },
			{ type: "load-value", value: -1 },
			{ type: "add-numbers" },
			{ type: "save-variable", name: "y", save: -1 },
			
			{ type: "get-board-width" },
			{ type: "load-value", value: 0 },
			{ type: "get-side-number", left: -1, right: -2, useParams: true },
			{ type: "save-variable", name: "x", save: -1 },

			{ type: "load-variable", name: "x", label: "startLoop" },
			{ type: "load-variable", name: "y" },
			{ type: "select-tiles-at", y: -1, x: -2 },
			{ type: "remove-tiles", selection: -1, skipTimeSteps: true, cascade: false, animationSpeed: 1.5 },
			
			{ type: "load-variable", name: "x" },
			{ type: "get-side-number", left: 1, right: -1 },
			{ type: "add-numbers" },
			{ type: "save-variable", name: "x", save: -1 },
			{ type: "load-variable", name: "width" },
			{ type: "jump-if-greater-than-or-equal-to", jumpTo: Infinity },
			{ type: "load-variable", name: "x" },
			{ type: "load-value", name: 0 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "jump", jumpTo: "startLoop" },
		],
	},
	//Increases the power of the user's next electric move
	"Charge": {
		name: "Charge",
		type: "Electric",
		category: "Status",
		strategy: "buff-user",
		pp: 20,
		power: null,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			yellow: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Charge.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", target: "user", debuff: {
					type: "stat",
					stat: "specialDefense",
					class: "buff",
					amount: 1
				}
			},
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "charge-charged-up",
				type: "power-alteration",
				stacks: false,
				volatile: true,
				lostOnSwap: true,
				lostOnBatonPass: true,
				numberOfApplications: 1,
				appliesTo: {
					types: ["Electric"]
				},
				modification: {
					change: 2,
					operation: "multiply"
				}
			} },
		],
	},
	//Lowers opponent's attack
	"Charm": {
		name: "Charm",
		type: "Fairy",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 20,
		power: null,
		accuracy: 100,
		rechargeTurns: 10,
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
					class: "debuff",
					stat: "attack",
					amount: -1
				}
			}
		],
	},
	//Forces the opponent to switch to their next pokemon
	"Circle Throw": {
		name: "Circle Throw",
		type: "Fighting",
		category: "Physical",
		strategy: "basic-damage",
		pp: 10,
		power: 60,
		accuracy: 90,
		rechargeTurns: 0,
		energy: {
			orange: 10,
			red: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Circle Throw.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "get-next-viable-pokemon", target: "opponent" },
			{ type: "jump-if-truthy", jumpTo: "swap" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "swap-pokemon", target: "opponent", pokemon: -3, label: "swap" },
		]
	},
	//Confuses opponent and shuffles part of the board
	"Confuse Ray": {
		name: "Confuse Ray",
		type: "Ghost",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 10,
		power: null,
		accuracy: 100,
		rechargeTurns: 5,
		energy: {
			purple: 6,
			red: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Confuse Ray part 1.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", statusEffect: "confused", target: "opponent" },
			{ type: "load-value", value: 1 },
			{ type: "choose-tiles", count: -1, target: "user" },
			{ type: "load-value", value: 3 },
			{ type: "load-value", value: 3 },
			{ type: "expand-tile-selection", selection: -3, width: -2, height: -1 },
			{ type: "shuffle-tiles", selection: -1 }
		],
	},
	//Damages and applies confusion
	"Confusion": {
		name: "Confusion",
		type: "Psychic",
		category: "Special",
		strategy: "basic-damage",
		pp: 25,
		power: 50,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			yellow: 5,
			purple: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Confusion part 1.mp3",
			"activate": "src/audio/attacks/Confusion part 2.mp3",
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 6 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "play-sound", name: "activate" },
			{ type: "apply-status-effect", statusEffect: "confused", target: "opponent" }
		]
	},
	//Copies opponent's last move
	"Copycat": {
		name: "Copycat",
		type: "Normal",
		category: "Status",
		strategy: "special",
		pp: 20,
		power: null,
		accuracy: null,
		rechargeTurns: 1,
		energy: {
			orange: 6,
			purple: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Copycat part 1.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-last-move", target: "opponent" },
			{ type: "jump-if-truthy", jumpTo: "use-move" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "wait", duration: 1000, label: "use-move" },
			{ type: "get-last-move", target: "opponent" },
			{ type: "use-move", move: -1 },
			{ type: "is-z-move" },
			{ type: "jump-if-truthy", jumpTo: "z-move" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "trigger", key: "zEffects", label: "z-move" },
		],
		zEffects: [
			{
				type: "apply-debuff", target: "user",
				debuff: { type: "stat", stat: "speed", class: "buff", amount: 1 }
			},
		],
		highlightOnHover: {
			type: "last-enemy-move"
		}
	},
	//Lowers speed 2
	"Cotton Spore": {
		name: "Cotton Spore",
		type: "Grass",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 40,
		power: null,
		accuracy: 100,
		rechargeTurns: 6,
		energy: {
			green: 5,
			blue: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Spore.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", target: "opponent", debuff: {
					type: "stat",
					stat: "speed",
					class: "debuff",
					amount: -2
				}
			}
		]
	},
	//Deals damage based on the last damage dealt to the user
	"Counter": {
		name: "Counter",
		type: "Fighting",
		category: "Physical",
		strategy: "special",
		tags: ["damage-dealing", "makes-contact"],
		pp: 20,
		power: 0,
		accuracy: 100,
		rechargeTurns: 1,
		bypassEffectiveness: true,
		energy: {
			orange: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Counter.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-last-damage-dealt-to", target: "user" },
			{ type: "save-variable", name: "damage", save: -1 },
			{ type: "get-last-damage-type-dealt-to", target: "user" },
			{ type: "save-variable", name: "type", save: -1 },
			{ type: "load-value", value: "Normal" },
			{ type: "jump-if-equal", jumpTo: "multiply" },
			{ type: "load-variable", name: "type" },
			{ type: "load-value", value: "Fighting" },
			{ type: "jump-if-equal", jumpTo: "multiply" },

			{ type: "load-variable", name: "damage", label: "multiply" },
			{ type: "load-value", value: 2 },
			{ type: "multiply-numbers" },
			{ type: "save-variable", name: "damage", save: -1 },

			{ type: "load-variable", name: "damage", label: "damage" },
			{ type: "damage", amount: -1, fixed: true },
		],
	},
	//Steals energy
	"Covet": {
		name: "Covet",
		type: "Normal",
		category: "Physical",
		strategy: "special",
		tags: ["damage-dealing", "makes-contact"],
		pp: 25,
		power: 60,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			orange: 8,
			blue: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Covet.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "load-value", value: 2 },
			{ type: "select-energy-colors", search: "most-full", target: "opponent", count: -1 },
			{ type: "load-value", value: -6 },
			{ type: "gain-energy", count: -1, colors: -2, target: "opponent" },
			{ type: "load-value", value: -1 },
			{ type: "multiply-energy", amounts: -2, scale: -1 },
			{ type: "gain-energy", amounts: -1, target: "user" }
		]
	},
	//Removes an X-shaped section of tiles.
	"Cross Chop": {
		name: "Cross Chop",
		type: "Fighting",
		category: "Physical",
		strategy: "basic-damage",
		pp: 5,
		power: 100,
		accuracy: 80,
		rechargeTurns: 2,
		energy: {
			orange: 12,
			red: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Cross Chop.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "load-value", value: 1 },
			{ type: "choose-tiles", count: -1, target: "user", text: "choose" },
			{ type: "select-tiles-diagonal-to", selection: -1, maxDistance: 2, includeOriginal: true },
			{ type: "remove-tiles", selection: -1 },
		],
	},
	//Removes a bigger chunk of the board
	"Crunch": {
		name: "Crunch",
		type: "Dark",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 15,
		power: 80,
		accuracy: 100,
		rechargeTurns: 2,
		energy: {
			purple: 8,
			green: 6,
			yellow: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Crunch.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 6 },
			{ type: "jump-if-less-than", jumpTo: "remove-tiles" },
			{
				type: "apply-debuff", target: "opponent", debuff: {
					type: "stat",
					stat: "defense",
					class: "debuff",
					amount: -1
				}
			},

			{ type: "load-value", value: 1, label: "remove-tiles" },
			{ type: "load-value", value: 3 },
			{ type: "load-value", value: 3 },
			{ type: "choose-tiles", count: -3, maxWidth: -2, maxHeight: -1, target: "user" },
			{ type: "load-value", value: 3 },
			{ type: "load-value", value: 3 },
			{ type: "expand-tile-selection", selection: -3, width: -2, height: -1 },
			{ type: "remove-tiles", selection: -1 }
		]
	},
	//Does different stuff depending on its user's types
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
				debuff: { type: "stat", stat: "speed", class: "debuff", amount: -1 }
			},
			{
				type: "apply-debuff", target: "user",
				debuff: { type: "stat", stat: "attack", class: "buff", amount: 1 }
			},
			{
				type: "apply-debuff", target: "user",
				debuff: { type: "stat", stat: "defense", class: "buff", amount: 1 }
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
	//Increases the power of certain moves the user uses later
	"Defense Curl": {
		name: "Defense Curl",
		type: "Normal",
		category: "Status",
		strategy: "buff-user",
		pp: 40,
		power: null,
		accuracy: null,
		rechargeTurns: 1,
		energy: {
			orange: 10
		},
		sounds: {
			"attack": "src/audio/attacks/Defense Curl.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", target: "user", debuff: {
					type: "stat",
					stat: "defense",
					class: "buff",
					amount: 1
				}
			},
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "defense-curl-curled-up",
				type: "power-alteration",
				stacks: false,
				volatile: true,
				lostOnSwap: true,
				lostOnBatonPass: true,
				appliesTo: {
					names: ["Tackle", "Rollout"]
				},
				modification: {
					change: 2,
					operation: "multiply"
				}
			} },
			{ type: "is-z-move" },
			{ type: "jump-if-truthy", jumpTo: "z-move" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "trigger", key: "zEffects", label: "z-move" },
		],
		zEffects: [
			{
				type: "apply-debuff", target: "user",
				debuff: { type: "stat", stat: "speed", class: "buff", amount: 1 }
			},
		],
	},
	//Protect but orange. I'm not messing with it.
	"Detect": {
		name: "Detect",
		type: "Fighting",
		category: "Status",
		strategy: "buff-user",
		pp: 5,
		power: null,
		accuracy: null,
		rechargeTurns: 7,
		energy: {
			red: 2,
			orange: 4,
			yellow: 2
		},
		sounds: {
			"attack": "src/audio/attacks/Detect.mp3",
			"bonk": "src/audio/attacks/Detect shield hit.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", statusEffect: "protect", target: "user" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "detect-cooldown",
				type: "cooldown-alteration",
				stacks: true,
				volatile: true,
				appliesTo: {
					name: "Detect"
				},
				modification: {
					change: 1,
					operation: "add"
				}
			} },
		],
	},
	//Makes the opponent unable to use their last move
	"Disable": {
		name: "Disable",
		type: "Normal",
		category: "Status",
		strategy: "special",
		pp: 20,
		power: null,
		accuracy: 100,
		rechargeTurns: 10,
		energy: {
			orange: 4,
			purple: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Disable.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-last-move", target: "opponent", except: { name: "Struggle" } },
			{ type: "jump-if-truthy", jumpTo: "add-disability" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "get-move-name", move: -3, label: "add-disability" },
			{ type: "apply-status-effect", target: "opponent", statusEffect: {
				name: "disable-disability",
				type: "disability",
				stacks: false,
				volatile: true,
				lostOnSwap: true,
				lostOnBatonPass: true,
				turns: 11, //It should be 10, but add 1 because their turn is about to start anyway
				appliesTo: {
					name: "%c%"
				},
			}, replacementsForResultObj: [
				{
					path: ["appliesTo"],
					key: "name",
					replacements: [-1]
				}
			] },
		],
		highlightOnHover: {
			type: "last-enemy-move",
			except: {
				name: "Struggle"
			}
		}
	},
	//Damages and applies confusion
	"Disarming Voice": {
		name: "Disarming Voice",
		type: "Fairy",
		category: "Special",
		strategy: "basic-damage",
		tags: ["sound-based"],
		pp: 15,
		power: 40,
		accuracy: null,
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
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 6 },
			{ type: "jump-if-less-than", jumpTo: "end" },
			{ type: "apply-status-effect", statusEffect: "confused", target: "opponent" },
			{ type: "end-turn", label: "end" }
		]
	},
	//Might paralyze the enemy
	"Discharge": {
		name: "Discharge",
		type: "Electric",
		category: "Special",
		strategy: "basic-damage",
		tags: ["damage-dealing"],
		pp: 15,
		power: 80,
		accuracy: 100,
		rechargeTurns: 5,
		energy: {
			red: 6,
			yellow: 8,
			green: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Discharge.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 6 },
			{ type: "jump-if-less-than", jumpTo: "end-step1" },
			{ type: "apply-status-effect", statusEffect: "paralyzed", target: "opponent" },
			{ type: "do-nothing", label: "end-step1" },

			{ type: "load-value", value: ["yellow"] },
			{ type: "get-energy-values", target: "user", colors: -1 },
			{ type: "save-variable", name: "energy-obj", save: -1 },
			{ type: "load-value", value: -1 },
			{ type: "multiply-energy", amounts: -2, scale: -1 },
			{ type: "gain-energy", amounts: -1, target: "user" },

			{ type: "load-variable", name: "energy-obj" },
			{ type: "load-value", value: "yellow" },
			{ type: "get-element-from-obj", obj: -2, key: -1 },
			{ type: "load-value", value: 0.2 },
			{ type: "multiply-numbers", round: "down" },
			{ type: "select-random-tiles", count: -1, conditions: { types: ["yellow"] } },
			{ type: "empower-tiles", selection: -1 },
		]
	},
	//Damage once, double energy gain until end of turn, then damage again
	"Double Hit": {
		name: "Double Hit",
		type: "Normal",
		category: "Physical",
		strategy: "special",
		tags: ["damage-dealing", "makes-contact"],
		pp: 10,
		power: 35,
		accuracy: 90,
		rechargeTurns: 2,
		energy: {
			orange: 4,
			yellow: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Double Hit 1hit.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
		],
		additionalEffects: [
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "double-hit-used",
				type: "energy-gain-alteration",
				stacks: false,
				volatile: true,
				turns: 1,
				appliesTo: {},
				modification: {
					change: 1.5,
					operation: "multiply"
				}
			} },
		],
		onTurnEnd: [
			{ type: "get-status-stacks", target: "user", statusName: "double-hit-used" },
			{ type: "load-value", value: 0 },
			{ type: "jump-if-equal", jumpTo: Infinity },
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "remove-status-effect", target: "user", statusName: "double-hit-used" },
		],
	},
	//Basic damage but twice
	"Double Kick": {
		name: "Double Kick",
		type: "Fighting",
		category: "Physical",
		strategy: "special",
		tags: ["damage-dealing", "makes-contact"],
		pp: 30,
		power: 30,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			orange: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Double Kick 1hit.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "play-sound", name: "attack" },
			{ type: "damage" }
		],
	},
	//Lowers its own cost this turn
	"Double Slap": {
		name: "Double Slap",
		type: "Normal",
		category: "Physical",
		strategy: "special",
		tags: ["damage-dealing", "makes-contact"],
		pp: 10,
		power: 15,
		accuracy: 85,
		rechargeTurns: 0,
		energy: {
			orange: 3,
			green: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Double Slap 1hit.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "double-slap-cost-reduction",
				type: "cost-alteration",
				stacks: false,
				volatile: true,
				appliesTo: {
					name: "Double Slap"
				},
				turns: 1,
				energyCost: {
					orange: -1,
					green: -1
				}
			} }
		],
		onTurnEnd: [
			{ type: "remove-status-effect", target: "user", statusName: "double-slap-cost-reduction" },
		]
	},
	//Raises speed 1 and Makes a match for the user
	"Double Team": {
		name: "Double Team",
		type: "Normal",
		category: "Status",
		strategy: "special",
		pp: 15,
		power: null,
		accuracy: null,
		rechargeTurns: 1,
		energy: {
			blue: 7,
			yellow: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Double Team.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", target: "user", debuff: {
					type: "stat",
					stat: "speed",
					class: "buff",
					amount: 1
				}
			},
			{ type: "get-all-swaps" },
			{ type: "random-choice-from-list", list: -1 },
			{ type: "jump-if-truthy", jumpTo: "move" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "perform-swap", swap: -3, label: "move" }
		],
	},
	//Deals huge damage, but has recoil
	"Double-Edge": {
		name: "Double-Edge",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 15,
		power: 120,
		accuracy: 100,
		rechargeTurns: 2,
		energy: {
			red: 12,
			yellow: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Double-Edge.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "recoil-damage", damageMult: 1/3 },
		],
	},
	//50% chance to paralyze opponent
	"Dragon Breath": {
		name: "Dragon Breath",
		type: "Dragon",
		category: "Special",
		strategy: "basic-damage",
		pp: 20,
		power: 60,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			green: 6,
			yellow: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Dragon Breath.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 6 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "apply-status-effect", statusEffect: "paralyzed", target: "opponent" }
		]
	},
	//Steals HP
	"Draining Kiss": {
		name: "Draining Kiss",
		type: "Fairy",
		category: "Special",
		strategy: "basic-damage",
		tags: ["healing"],
		pp: 10,
		power: 50,
		accuracy: 100,
		rechargeTurns: 2,
		energy: {
			purple: 9,
			red: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Draining Kiss part 1.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "load-value", value: 0.75 },
			{ type: "multiply-numbers" },
			{ type: "load-value", value: 1 },
			{ type: "heal", target: "user", amount: -2, min: -1 },
		],
	},
	//Locks a random row of tiles
	"Drill Peck": {
		name: "Drill Peck",
		type: "Flying",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 25,
		power: 40,
		accuracy: 100,
		rechargeTurns: 2,
		energy: {
			blue: 8,
			yellow: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Drill Peck.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "get-board-height" },
			{ type: "load-value", value: -1 },
			{ type: "add-numbers" },
			{ type: "load-value", value: 0 },
			{ type: "random-number", min: -1, max: -2, useArgs: true },
			{ type: "select-row", y: -1 },
			{
				type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Locked", type: "debuff", duration: 6 }
			}
		]
	},
	//Deals bonus damage based on speed stage
	"Drill Run": {
		name: "Drill Run",
		type: "Ground",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 10,
		power: 80,
		accuracy: 95,
		rechargeTurns: 1,
		energy: {
			orange: 4,
			yellow: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Drill Run.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-stat-stage", target: "user", which: "speed" },
			{ type: "load-value", value: 0 },
			{ type: "max" },
			{ type: "load-value", value: 0.1 },
			{ type: "multiply-numbers" },
			{ type: "load-value", value: 1 },
			{ type: "add-numbers" },
			{ type: "damage", multiplicativePower: -1 },
		],
	},
	//Temporarily reduces its own cost
	"Echoed Voice": {
		name: "Echoed Voice",
		type: "Normal",
		category: "Special",
		strategy: "basic-damage",
		tags: ["sound-based"],
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
				volatile: true,
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
	//Deals more damage to slower targets
	"Electro Ball": {
		name: "Electro Ball",
		type: "Electric",
		category: "Special",
		strategy: "special",
		tags: ["damage-dealing"],
		pp: 10,
		power: 0,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			yellow: 8,
			orange: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Electro Ball.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-stat", whcih: "speed", target: "opponent" },
			{ type: "get-stat", whcih: "speed", target: "user" },
			{ type: "divide-numbers" },
			{ type: "load-value", value: 0.25 },
			{ type: "jump-if-less-than", test: -2, jumpTo: "damage-1" },
			{ type: "load-value", value: 1/3 },
			{ type: "jump-if-less-than", test: -4,  jumpTo: "damage-2" },
			{ type: "load-value", value: 0.5 },
			{ type: "jump-if-less-than", test: -6,  jumpTo: "damage-3" },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-less-than", test: -8, jumpTo: "damage-4" },
			{ type: "jump", jumpTo: "damage-5" },

			{ type: "load-value", value: 150, label: "damage-1" },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 120, label: "damage-2" },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 80, label: "damage-3" },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 60, label: "damage-4" },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 40, label: "damage-5" },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
		]
	},
	//Places status effects on tiles
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
			red: 8
		},
		sounds: {
			"attack": "src/audio/attacks/Ember.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 6 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "load-value", value: 3 },
			{ type: "select-random-tiles", count: -1 },
			{
				type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Burn", type: "debuff", duration: 3 }
			}
		]
	},
	//The opponent becomes unable to use moves other than their last one
	"Encore": {
		name: "Encore",
		type: "Normal",
		category: "Status",
		strategy: "special",
		pp: 5,
		power: null,
		accuracy: 100,
		rechargeTurns: 3,
		energy: {
			yellow: 4,
			purple: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Encore.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-last-move", target: "opponent" },
			{ type: "jump-if-truthy", jumpTo: "add-disability" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "get-move-name", move: -3, label: "add-disability" },
			{ type: "load-value", value: ["Transform", "Mimic", "Sketch", "Mirror Move", "Encore", "Struggle"] },
			{ type: "add-element-to-list", list: -1, element: -2 },
			{ type: "apply-status-effect", target: "opponent", statusEffect: {
				name: "disable-disability",
				type: "disability",
				stacks: false,
				volatile: true,
				lostOnSwap: true,
				lostOnBatonPass: true,
				turns: 6, //It should be 5, but add 1 because their turn is about to start anyway
				appliesTo: {
					names: [],
					logic: "not"
				},
			}, statusSettings: [
				{
					path: ["appliesTo"],
					key: "names",
					value: -1
				}
			] },
		],
		highlightOnHover: {
			type: "last-enemy-move"
		}
	},
	//You can't go below 1HP
	"Endure": {
		name: "Endure",
		type: "Normal",
		category: "Status",
		strategy: "buff-user",
		pp: 10,
		power: null,
		accuracy: null,
		rechargeTurns: 3,
		energy: {
			blue: 3,
			red: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Endure.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "endure-enduring",
				type: "damage-enduring",
				stacks: true,
				volatile: true,
				turns: 3
			} },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "endure-cooldown",
				type: "cooldown-alteration",
				stacks: true,
				volatile: true,
				appliesTo: {
					name: "Endure"
				},
				modification: {
					change: 1,
					operation: "add"
				}
			} },
		],
	},
	//Shifts a row of tiles
	"Fairy Wind": {
		name: "Fairy Wind",
		type: "Fairy",
		category: "Special",
		strategy: "basic-damage",
		pp: 30,
		power: 40,
		accuracy: 100,
		rechargeTurns: 2,
		energy: {
			green: 4,
			blue: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Fairy Wind.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "load-value", value: 1 },
			{ type: "choose-tiles", count: -1, target: "user" },
			{ type: "load-value", value: 0 },
			{ type: "get-element-from-list", list: -2, index: -1 },
			{ type: "get-tile-y", tile: -1 },
			{ type: "select-row", y: -1 },
			{ type: "load-value", value: 3 },
			{ type: "load-value", value: 0 },
			{ type: "shift-tiles", selection: -3, xOffset: -2, yOffset: -1 },
		]
	},
	//Permanently changes its power mid-battle
	"Fake Out": {
		name: "Fake Out",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 10,
		power: 40,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			purple: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Fake Out.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
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
				volatile: true,
				lostOnSwap: true,
				appliesTo: {
					name: "Fake Out"
				},
				energyCost: {
					purple: 4
				}
			} },
			{ type: "jump", jumpTo: Infinity },
			{ type: "apply-status-effect", target: "user", label: "add-status", statusEffect: {
				name: "fake-out-turns-out",
				type: "hidden",
				stacks: true,
				volatile: true,
				lostOnSwap: true
			} },
		]
	},
	//Lowers opponent's special defense 2
	"Fake Tears": {
		name: "Fake Tears",
		type: "Normal",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 20,
		power: null,
		accuracy: 100,
		rechargeTurns: 10,
		energy: {
			purple: 10
		},
		sounds: {
			"attack": "src/audio/attacks/Fake Tears.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", target: "opponent", debuff: {
					type: "stat",
					stat: "specialDefense",
					class: "debuff",
					amount: -2
				}
			}
		],
	},
	//Raises attack 2
	"Feather Dance": {
		name: "Feather Dance",
		type: "Normal",
		category: "Status",
		strategy: "buff-user",
		tags: ["dancing"],
		pp: 15,
		power: null,
		accuracy: null,
		rechargeTurns: 4,
		energy: {
			blue: 7,
			yellow: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Feather Dance.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", target: "user", debuff: {
					type: "stat",
					stat: "attack",
					class: "buff",
					amount: 2
				}
			}
		],
	},
	//Removes invulnerable & protect
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
			{ type: "remove-status-effect", target: "opponent", statusName: "invulnerable" },
			{ type: "remove-status-effect", target: "opponent", statusName: "protect" },
			{ type: "damage" }
		]
	},
	//Gives you a bonus if it defeats the enemy
	"Fell Stinger": {
		name: "Fell Stinger",
		type: "Bug",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 25,
		power: 50,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			green: 3,
			yellow: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Fell Stinger.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "is-active-pokemon-viable", target: "opponent" },
			{ type: "jump-if-truthy", jumpTo: Infinity },
			{
				type: "apply-debuff", target: "user", debuff: {
					type: "stat",
					stat: "attack",
					class: "buff",
					amount: 2
				}
			}
		]
	},
	//Deals extra damage if tiles are already burning
	"Fire Fang": {
		name: "Fire Fang",
		type: "Fire",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact", "biting"],
		pp: 15,
		power: 65,
		accuracy: 95,
		rechargeTurns: 2,
		energy: {
			red: 7,
			yellow: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Fire Fang.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "select-tiles-with-status", statusName: "Burn", sourceTrainer: "target", target: "user" },
			{ type: "get-list-length", list: -1 },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-less-than", jumpTo: "small-damage" },
			{ type: "load-value", value: 30 },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "damage", label: "small-damage" },
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 0 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "load-value", value: 3 },
			{ type: "select-random-tiles", count: -1 },
			{
				type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Burn", type: "debuff", duration: 3 }
			}
		],
	},
	//Deals damage based on HP/Max HP
	"Flail": {
		name: "Flail",
		type: "Normal",
		category: "Physical",
		strategy: "special",
		tags: ["damage-dealing", "makes-contact"],
		pp: 15,
		power: 0,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			green: 5,
			red: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Flail.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-hp", target: "user" },
			{ type: "get-max-hp", target: "user" },
			{ type: "divide-numbers" },
			{ type: "save-variable", name: "ratio", save: -1 },
			{ type: "load-value", value: 0.05 },
			{ type: "jump-if-less-than", jumpTo: "damage-1" },
			{ type: "load-variable", name: "ratio" },
			{ type: "load-value", value: 0.10 },
			{ type: "jump-if-less-than", jumpTo: "damage-2" },
			{ type: "load-variable", name: "ratio" },
			{ type: "load-value", value: 0.20 },
			{ type: "jump-if-less-than", jumpTo: "damage-3" },
			{ type: "load-variable", name: "ratio" },
			{ type: "load-value", value: 0.35 },
			{ type: "jump-if-less-than", jumpTo: "damage-4" },
			{ type: "load-variable", name: "ratio" },
			{ type: "load-value", value: 0.70 },
			{ type: "jump-if-less-than", jumpTo: "damage-5" },
			{ type: "jump", jumpTo: "damage-6" },

			{ type: "load-value", value: 200, label: "damage-1" },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 150, label: "damage-2" },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 100, label: "damage-3" },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 80, label: "damage-4" },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 40, label: "damage-5" },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 20, label: "damage-6" },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
		],
	},
	//Burns the same tile 8 times sometimes
	"Flame Wheel": {
		name: "Flame Wheel",
		type: "Fire",
		category: "Physical",
		strategy: "basic-damage",
		pp: 25,
		power: 60,
		accuracy: 100,
		rechargeTurns: 3,
		energy: {
			red: 12
		},
		sounds: {
			"attack": "src/audio/attacks/Flame Wheel.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 6 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "load-value", value: 1 },
			{ type: "select-random-tiles", count: -1 },
			{
				type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Burn", type: "debuff", duration: 1 }
			},
			{
				type: "apply-status-to-tiles", selection: "group", which: -2,
				status: { name: "Burn", type: "debuff", duration: 1 }
			},
			{
				type: "apply-status-to-tiles", selection: "group", which: -3,
				status: { name: "Burn", type: "debuff", duration: 1 }
			},
			{
				type: "apply-status-to-tiles", selection: "group", which: -4,
				status: { name: "Burn", type: "debuff", duration: 1 }
			},
			{
				type: "apply-status-to-tiles", selection: "group", which: -5,
				status: { name: "Burn", type: "debuff", duration: 1 }
			},
			{
				type: "apply-status-to-tiles", selection: "group", which: -6,
				status: { name: "Burn", type: "debuff", duration: 1 }
			},
			{
				type: "apply-status-to-tiles", selection: "group", which: -7,
				status: { name: "Burn", type: "debuff", duration: 1 }
			},
			{
				type: "apply-status-to-tiles", selection: "group", which: -8,
				status: { name: "Burn", type: "debuff", duration: 1 }
			},
		]
	},
	//Confuses the opponent but also buffs them
	"Flatter": {
		name: "Flatter",
		type: "Dark",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 15,
		power: null,
		accuracy: 100,
		rechargeTurns: 5,
		energy: {
			orange: 3,
			purple: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Flatter.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", statusEffect: "confused", target: "opponent" },
			{
				type: "apply-debuff", target: "opponent", debuff: {
					type: "stat",
					stat: "specialAttack",
					class: "buff",
					amount: 1
				}
			}
		]
	},
	//Deals damage based on how much energy you have stored up
	"Fling": {
		name: "Fling",
		type: "Dark",
		category: "Physical",
		strategy: "special",
		tags: ["damage-dealing"],
		pp: 10,
		power: 0,
		accuracy: 100,
		rechargeTurns: 3,
		energy: {},
		sounds: {
			"attack": "src/audio/attacks/Fling.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-total-energy", target: "user" },
			{ type: "load-value", value: 3 },
			{ type: "multiply-numbers" },
			{ type: "damage", additivePower: -1 },
			{ type: "get-energy-values", target: "user" },
			{ type: "load-value", value: -1 },
			{ type: "multiply-energy", amounts: -2, scale: -1 },
			{ type: "gain-energy", amounts: -1, target: "user" },
			{ type: "log-value" },
		],
	},
	//Raises attack 2
	"Focus Energy": {
		name: "Focus Energy",
		type: "Normal",
		category: "Status",
		strategy: "buff-user",
		pp: 30,
		power: null,
		accuracy: null,
		rechargeTurns: 4,
		energy: {
			blue: 7,
			purple: 7
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
					class: "buff",
					amount: 2
				}
			}
		],
	},
	//Damages and applies paralyzed
	"Force Palm": {
		name: "Force Palm",
		type: "Fighting",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 10,
		power: 60,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			orange: 8,
			yellow: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Force Palm.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 6 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "apply-status-effect", statusEffect: "paralyzed", target: "opponent" }
		]
	},
	//Makes the opponent vulnerable to fighting and normal
	"Foresight": {
		name: "Foresight",
		type: "Normal",
		category: "Status",
		strategy: "special",
		pp: 40,
		power: null,
		accuracy: null,
		rechargeTurns: 4,
		energy: {
			green: 3,
			purple: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Foresight.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", target: "opponent", statusEffect: {
				name: "foresight-vulnerability",
				type: "type-vulnerability",
				stacks: false,
				volatile: true,
				appliesTo: {
					types: ["Fighting", "Normal"]
				},
			} },
		],
	},
	//Attacks once per match made this turn
	"Fury Attack": {
		name: "Fury Attack",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 20,
		power: 15,
		accuracy: 85,
		rechargeTurns: 1,
		energy: {
			orange: 5,
			yellow: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Fury Attack 1hit.mp3"
		},
		effects: [
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "fury-attack-attacking",
				type: "hidden",
				stacks: true,
				volatile: true,
				turns: 1
			} },
		],
		onTurnEnd: [
			{ type: "get-status-stacks", target: "user", statusName: "fury-attack-attacking" },
			{ type: "load-value", value: 0 },
			{ type: "jump-if-equal", jumpTo: Infinity },
			{ type: "remove-status-effect", target: "user", statusName: "fury-attack-attacking" },
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "get-cascade" },
			{ type: "load-value", value: 2},
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "get-cascade" },
			{ type: "load-value", value: 3},
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "get-cascade" },
			{ type: "load-value", value: 4},
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "get-cascade" },
			{ type: "load-value", value: 5},
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "play-sound", name: "attack" },
			{ type: "damage" }
		]
	},
	//Doubles its own power with each use, but if you don't use it for a turn, the bonus resets
	"Fury Cutter": {
		name: "Fury Cutter",
		type: "Bug",
		category: "Physical",
		strategy: "special",
		pp: 20,
		power: 40,
		accuracy: 95,
		rechargeTurns: 1,
		energy: {
			orange: 3,
			green: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Fury Cutter.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "fury-cutter-powered-up",
				type: "power-alteration",
				stacks: true,
				volatile: true,
				lostOnSwap: true,
				lostOnBatonPass: true,
				appliesTo: {
					name: "Fury Cutter"
				},
				modification: {
					change: 2,
					operation: "multiply"
				}
			} },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "fury-cutter-cost-increase",
				type: "cost-alteration",
				stacks: true,
				volatile: true,
				appliesTo: {
					name: "Fury Cutter"
				},
				energyCost: {
					orange: 1,
					green: 1
				}
			} },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "fury-cutter-used-fury-cutter",
				type: "hidden",
				stacks: false,
				volatile: true
			} },
		],
		onTurnEnd: [
			{ type: "is-trainers-turn", target: "user" },
			{ type: "load-value", value: false },
			{ type: "jump-if-equal", jumpTo: Infinity},

			{ type: "get-status-stacks", target: "user", statusName: "fury-cutter-used-fury-cutter" },
			{ type: "load-value", value: 0 },
			{ type: "jump-if-equal", jumpTo: "remove-bonus" },
			{ type: "jump", jumpTo: "end" },
			{ type: "remove-status-effect", target: "user", statusName: "fury-cutter-powered-up", label: "remove-bonus" },
			{ type: "remove-status-effect", target: "user", statusName: "fury-cutter-cost-increase" },
			{ type: "remove-status-effect", target: "user", statusName: "fury-cutter-used-fury-cutter", label: "end" },
		]
	},
	//Lowers its own cost this turn
	"Fury Swipes": {
		name: "Fury Swipes",
		type: "Normal",
		category: "Physical",
		strategy: "special",
		tags: ["damage-dealing", "makes-contact"],
		pp: 15,
		power: 18,
		accuracy: 80,
		rechargeTurns: 0,
		energy: {
			orange: 3,
			yellow: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Fury Swipes 1hit.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "fury-swipes-cost-reduction",
				type: "cost-alteration",
				stacks: false,
				volatile: true,
				appliesTo: {
					name: "Fury Swipes"
				},
				turns: 1,
				energyCost: {
					orange: -1,
					yellow: -1
				}
			} }
		],
		onTurnEnd: [
			{ type: "remove-status-effect", target: "user", statusName: "fury-swipes-cost-reduction" },
		]
	},
	//Steals HP
	"Giga Drain": {
		name: "Giga Drain",
		type: "Grass",
		category: "Special",
		strategy: "basic-damage",
		tags: ["healing"],
		pp: 10,
		power: 75,
		accuracy: 100,
		rechargeTurns: 2,
		energy: {
			green: 9,
			red: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Giga Drain.mp3"
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
	//Lowers opponent's attack
	"Growl": {
		name: "Growl",
		type: "Normal",
		category: "Status",
		strategy: "debuff-opponent",
		tags: ["sound-based"],
		pp: 40,
		power: null,
		accuracy: 100,
		rechargeTurns: 7,
		energy: {
			purple: 5
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
					class: "debuff",
					amount: -1
				}
			},
			{ type: "is-z-move" },
			{ type: "jump-if-truthy", jumpTo: "z-move" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "trigger", key: "zEffects", label: "z-move" },
		],
		zEffects: [
			{
				type: "apply-debuff", target: "user",
				debuff: { type: "stat", stat: "defense", class: "buff", amount: 1 }
			},
		],
	},
	//Converts tiles in a diagonal pattern
	"Growth": {
		name: "Growth",
		type: "Normal",
		category: "Status",
		strategy: "buff-user",
		pp: 20,
		power: null,
		accuracy: null,
		rechargeTurns: 1,
		energy: {
			green: 5,
			blue: 2
		},
		sounds: {
			"attack": "src/audio/attacks/Growth.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", target: "user", debuff: {
					type: "stat",
					stat: "attack",
					class: "buff",
					amount: 1
				}
			},
			{ type: "load-value", value: 3 },
			{ type: "select-random-tiles", count: -1, conditions: { types: ["green"] } },
			{ type: "select-tiles-diagonal-to", selection: -1 },
			{ type: "change-tile-type", selection: "group", which: -1, targetType: "green" },
		],
	},
	//Both pokemon have their defensive stats averaged together
	"Guard Split": {
		name: "Guard Split",
		type: "Psychic",
		category: "Status",
		strategy: "special",
		pp: 10,
		power: null,
		accuracy: null,
		rechargeTurns: 6,
		energy: {
			purple: 4,
			blue: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Guard Split.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },

			{ type: "get-stat", which: "defense", target: "user" },
			{ type: "get-stat", which: "defense", target: "opponent" },
			{ type: "add-numbers" },
			{ type: "load-value", value: 2 },
			{ type: "divide-numbers" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "guard-split-defense",
				type: "stat-alteration",
				stacks: true,
				volatile: true,
				lostOnSwap: true,
				stat: "defense",
				modification: {
					change: "%c%",
					operation: "set"
				}
			}, statusSettings: [
				{
					path: ["modification"],
					key: "change",
					value: -1
				}
			] },
			{ type: "apply-status-effect", target: "opponent", statusEffect: {
				name: "guard-split-defense",
				type: "stat-alteration",
				stacks: true,
				volatile: true,
				lostOnSwap: true,
				stat: "defense",
				modification: {
					change: "%c%",
					operation: "set"
				}
			}, statusSettings: [
				{
					path: ["modification"],
					key: "change",
					value: -2
				}
			] },

			{ type: "get-stat", which: "specialDefense", target: "user" },
			{ type: "get-stat", which: "specialDefense", target: "opponent" },
			{ type: "add-numbers" },
			{ type: "load-value", value: 2 },
			{ type: "divide-numbers" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "guard-split-defense",
				type: "stat-alteration",
				stacks: true,
				volatile: true,
				lostOnSwap: true,
				stat: "specialDefense",
				modification: {
					change: "%c%",
					operation: "set"
				}
			}, statusSettings: [
				{
					path: ["modification"],
					key: "change",
					value: -1
				}
			] },
			{ type: "apply-status-effect", target: "opponent", statusEffect: {
				name: "guard-split-defense",
				type: "stat-alteration",
				stacks: true,
				volatile: true,
				lostOnSwap: true,
				stat: "specialDefense",
				modification: {
					change: "%c%",
					operation: "set"
				}
			}, statusSettings: [
				{
					path: ["modification"],
					key: "change",
					value: -2
				}
			] },
		],
	},
	//Pushes the entire board to the side
	"Gust": {
		name: "Gust",
		type: "Flying",
		category: "Special",
		strategy: "basic-damage",
		pp: 35,
		power: 40,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			blue: 8
		},
		sounds: {
			"attack": "src/audio/attacks/Gust.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "load-value", value: 1 },
			{ type: "get-side-number", left: 1, right: -1 },
			{ type: "load-value", value: 0 },
			{ type: "select-all-tiles", y: -1 },
			{ type: "shift-tiles", selection: -1, xOffset: -3, yOffset: -2 },
		]
	},
	//Deals more damage to faster targets
	"Gyro Ball": {
		name: "Gyro Ball",
		type: "Steel",
		category: "Physical",
		strategy: "special",
		tags: ["damage-dealing", "makes-contact"],
		pp: 5,
		power: 0,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			yellow: 4,
			orange: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Gyro Ball.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-stat", whcih: "speed", target: "user" },
			{ type: "load-value", value: 1 },
			{ type: "max" },
			{ type: "save-variable", name: "user-speed", save: -1 },
			
			{ type: "load-value", value: 25 },
			{ type: "get-stat", whcih: "speed", target: "opponent" },
			{ type: "multiply-numbers" },
			{ type: "load-variable", name: "user-speed" },
			{ type: "divide-numbers" },
			{ type: "load-value", value: 1 },
			{ type: "add-numbers" },
			{ type: "load-value", value: 150 },
			{ type: "min" },
			{ type: "damage", additivePower: -1 },
		]
	},
	//Become invulnerable for a turn
	"Harden": {
		name: "Harden",
		type: "Normal",
		category: "Status",
		strategy: "last-priority",
		pp: 30,
		power: null,
		accuracy: null,
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
	//Removes **every** status effect from the opponent
	"Haze": {
		name: "Haze",
		type: "Ice",
		category: "Status",
		strategy: "special",
		pp: 30,
		power: null,
		accuracy: null,
		rechargeTurns: 5,
		energy: {
			red: 5,
			blue: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Haze.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "remove-all-status-effects", target: "opponent" },
		],
	},
	//Damages and reduces opponent's initiative
	"Headbutt": {
		name: "Headbutt",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 15,
		power: 70,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			purple: 7,
			yellow: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Headbutt.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "get-initiative", target: "opponent" },
			{ type: "load-value", value: 0.5 },
			{ type: "multiply-numbers" },
			{ type: "set-initiative", target: "opponent", initiative: -1 },
		]
	},
	//Removes debuff statuses from all of your non-fainted pokemon
	"Heal Bell": {
		name: "Heal Bell",
		type: "Normal",
		category: "Status",
		strategy: "special",
		tags: ["sound-based"],
		pp: 5,
		power: null,
		accuracy: null,
		rechargeTurns: 5,
		energy: {
			green: 5,
			blue: 7,
			purple: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Heal Bell.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-viable-pokemon", target: "user" },
			{ type: "save-variable", name: "pokemon", save: -1 },
			{ type: "get-list-length", list: -1 },
			{ type: "save-variable", name: "length", save: -1 },
			{ type: "load-value", value: 0 },
			{ type: "save-variable", name: "counter", save: -1 },
			
			{ type: "load-variable", name: "counter" },
			{ type: "load-variable", name: "length" },
			{ type: "jump-if-less-than", jumpTo: "startLoop" },
			{ type: "jump", jumpTo: "endLoop" },

			{ type: "load-variable", name: "pokemon", label: "startLoop" },
			{ type: "load-variable", name: "counter" },
			{ type: "get-element-from-list", list: -2, index: -1 },
			{ type: "remove-all-status-effects",
				statusType: "status", statusClass: "debuff", pokemon: -1 },

			{ type: "load-variable", name: "counter" },
			{ type: "load-value", value: 1 },
			{ type: "add-numbers" },
			{ type: "save-variable", name: "counter", save: -1 },
			{ type: "load-variable", name: "length" },
			{ type: "jump-if-less-than", jumpTo: "startLoop" },
			{ type: "jump", jumpTo: "endLoop" },

			{ type: "do-nothing", label: "endLoop" }
		],
	},
	//Reduces move cooldown
	"Helping Hand": {
		name: "Helping Hand",
		type: "Normal",
		category: "Status",
		strategy: "special",
		pp: 20,
		power: null,
		accuracy: null,
		rechargeTurns: 5,
		energy: {
			blue: 4,
			purple: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Helping Hand.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-move-list", target: "user", sort: "recharge",
				direction: "descending", except: ["Helping Hand"] },
			{ type: "get-list-length", list: -1 },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "random-choice-from-list", list: -4 },
			{ type: "load-value", value: -5 },
			{ type: "change-move-cooldown", target: "user", move: -2, amount: -1 },
		],
	},
	//Deals double damage against pokemon with status effects
	"Hex": {
		name: "Hex",
		type: "Ghost",
		category: "Special",
		strategy: "basic-damage",
		tags: ["damage-dealing"],
		pp: 10,
		power: 65,
		accuracy: 100,
		rechargeTurns: 3,
		energy: {
			purple: 8,
			red: 3,
			green: 3,
			blue: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Hex.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "has-any-status", target: "opponent", targetClass: "debuff" },
			{ type: "jump-if-truthy", jumpTo: "big-damage" },
			{ type: "damage" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 65, label: "big-damage" },
			{ type: "damage", additivePower: -1 },
		],
	},
	//Reduces move costs so that the biggest cost color is reduced
	"Hone Claws": {
		name: "Hone Claws",
		type: "Dark",
		category: "Status",
		strategy: "buff-user",
		pp: 15,
		power: null,
		accuracy: null,
		rechargeTurns: 1,
		energy: {
			red: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Hone Claws.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-types", target: "user" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "hone-claws-cost-alteration",
				type: "cost-alteration",
				stacks: true,
				volatile: true,
				numberOfApplications: 1,
				appliesTo: {
					types: "%c%"
				},
				energyCost: {
					greatestColor: -4
				}
			}, replacementsForResultObj: [
				{
					path: ["appliesTo"],
					key: "types",
					value: -1
				}
			] },
		],
	},
	//Deals less damage if it's used second in a turn
	"Horn Attack": {
		name: "Horn Attack",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 25,
		power: 70, //originally 65
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			red: 6,
			yellow: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Horn Attack.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
		],
		onTurnStart: [
			{ type: "remove-status-effect", target: "user", statusName: "horn-attack-small-damage" },
		],
		onFinishUsingMove: [
			{ type: "apply-status-effect", target: "user", label: "add-status", statusEffect: {
				name: "horn-attack-small-damage",
				type: "power-alteration",
				stacks: true,
				turns: 1,
				lostOnSwap: true,
				lostOnBatonPass: true,
				appliesTo: {
					name: "Horn Attack"
				},
				modification: {
					change: -10,
					operation: "add"
				}
			} },
		],
	},
	//Energy gain is multiplied this turn
	"Howl": {
		name: "Howl",
		type: "Normal",
		category: "Status",
		strategy: "buff-user",
		pp: 40,
		power: null,
		accuracy: null,
		rechargeTurns: 3,
		energy: {
			blue: 5,
			green: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Howl.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "howl-psyched-up",
				type: "energy-gain-alteration",
				stacks: false,
				volatile: true,
				turns: 1,
				appliesTo: {},
				modification: {
					change: 1.5,
					operation: "multiply"
				}
			} },
		],
	},
	//Reduces enemy initiative by a scalar
	"Hyper Fang": {
		name: "Hyper Fang",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact", "biting"],
		pp: 15,
		power: 80,
		accuracy: 90,
		rechargeTurns: 2,
		energy: {
			red: 5,
			orange: 10,
			yellow: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Hyper Fang.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "get-initiative", target: "opponent" },
			{ type: "load-value", value: -30 },
			{ type: "add-numbers" },
			{ type: "load-value", value: 0 },
			{ type: "jump-if-less-than", jumpTo: "zero" },
			{ type: "set-initiative", target: "opponent", initiative: -3 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 0, label: "zero" },
			{ type: "set-initiative", target: "opponent", initiative: -1 },
		]
	},
	//Empowers some yellow tiles
	"Hyper Voice": {
		name: "Hyper Voice",
		type: "Normal",
		category: "Special",
		strategy: "basic-damage",
		pp: 10,
		power: 90,
		accuracy: 100,
		rechargeTurns: 3,
		energy: {
			yellow: 10,
			red: 8
		},
		sounds: {
			"attack": "src/audio/attacks/Hyper Voice.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "select-all-tiles", targetType: "yellow" },
			{ type: "empower-tiles", selection: -1 },
		]
	},
	//Puts the opponent to sleep half the time
	"Hypnosis": {
		name: "Hypnosis",
		type: "Normal",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 20,
		power: null,
		accuracy: 60,
		rechargeTurns: 10,
		energy: {
			purple: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Hypnosis part 1.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 6 },
			{ type: "jump-if-less-than", jumpTo: "sleep" },
			{ type: "apply-status-effect", statusEffect: "drowsy", target: "opponent" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "apply-status-effect", statusEffect: "asleep", target: "opponent", label: "sleep" },
		],
	},
	//Freezes but deals extra damage if they're already freezy
	"Ice Fang": {
		name: "Ice Fang",
		type: "Ice",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact", "biting"],
		pp: 15,
		power: 65,
		accuracy: 95,
		rechargeTurns: 2,
		energy: {
			blue: 7,
			yellow: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Ice Fang.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "select-tiles-with-status", statusName: "Freeze", sourceTrainer: "target", target: "user" },
			{ type: "get-list-length", list: -1 },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-less-than", jumpTo: "small-damage" },
			{ type: "load-value", value: 20 },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: "add-status" },
			{ type: "damage", label: "small-damage" },
			{ type: "load-value", value: 1, label: "add-status" },
			{ type: "select-random-tiles", count: -1 },
			{
				type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Freeze", type: "debuff" }
			}
		],
	},
	//Locks random tiles
	"Ice Shard": {
		name: "Ice Shard",
		type: "Ice",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing"],
		pp: 30,
		power: 40,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			blue: 3,
			yellow: 2
		},
		sounds: {
			"attack": "src/audio/attacks/Ice Shard.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "load-value", value: 3 },
			{ type: "select-random-tiles", count: -1 },
			{
				type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Locked", type: "debuff", duration: 5 }
			}
		]
	},
	//Lowers speed 1
	"Icy Wind": {
		name: "Icy Wind",
		type: "Ice",
		category: "Special",
		strategy: "basic-damage",
		pp: 15,
		power: 55,
		accuracy: 95,
		rechargeTurns: 4,
		energy: {
			red: 4,
			blue: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Icy Wind.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{
				type: "apply-debuff", target: "opponent", debuff: {
					type: "stat",
					stat: "speed",
					class: "debuff",
					amount: -1
				}
			}
		]
	},
	//Prevents the opponent from using moves that the user knows
	"Imprison": {
		name: "Imprison",
		type: "Psychic",
		category: "Status",
		strategy: "special",
		pp: 10,
		power: null,
		accuracy: null,
		rechargeTurns: 3,
		energy: {
			blue: 2,
			purple: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Imprison.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "load-value", value: "Struggle" },
			{ type: "get-active-moves", target: "user" },
			{ type: "remove-element-from-list", list: -1, element: -2 },
			{ type: "apply-status-effect", target: "opponent", statusEffect: {
				name: "disable-disability",
				type: "disability",
				stacks: false,
				volatile: true,
				lostOnSwap: true,
				appliesTo: {
					names: [],
				},
			}, statusSettings: [
				{
					path: ["appliesTo"],
					key: "names",
					value: -1
				}
			] },
		]
	},
	//Remove many status effects from yourself and the board
	"Incinerate": {
		name: "Incinerate",
		type: "Fire",
		category: "Special",
		strategy: "basic-damage",
		tags: ["damage-dealing"],
		pp: 15,
		power: 60,
		accuracy: 100,
		rechargeTurns: 2,
		energy: {
			red: 8,
			green: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Incinerate.mp3",
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "select-all-tiles", targetType: "green" },
			{ type: "remove-tiles", selection: -1 }
		],
	},
	//Places a status on tiles that steals energy from the opponent each turn
	"Infestation": {
		name: "Infestation",
		type: "Bug",
		category: "Special",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
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
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
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
		]
	},
	//Get HP every turn and prevent being forced to switch
	"Ingrain": {
		name: "Ingrain",
		type: "Grass",
		category: "Status",
		strategy: "buff-self",
		tags: ["healing"],
		pp: 20,
		power: null,
		accuracy: null,
		rechargeTurns: 5,
		energy: {
			green: 10,
			orange: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Ingrain part 1.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "ingrain-cant-be-force-switched",
				type: "cant-be-force-switched",
				stacks: false,
				volatile: true,
				lostOnSwap: true,
			} },
		],
		onTurnStart: [
			{ type: "is-trainers-turn", target: "user" },
			{ type: "load-value", value: false },
			{ type: "jump-if-equal", jumpTo: Infinity},

			{ type: "get-status-stacks", target: "user", statusName: "ingrain-cant-be-force-switched" },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-less-than", jumpTo: Infinity},

			{ type: "get-max-hp", target: "user" },
			{ type: "load-value", value: 1/32 },
			{ type: "multiply-numbers", round: "up" },
			{ type: "heal", target: "user", amount: -1 },
		],
	},
	//Raises defense 2
	"Iron Defense": {
		name: "Iron Defense",
		type: "Steel",
		category: "Status",
		strategy: "buff-user",
		pp: 15,
		power: null,
		accuracy: null,
		rechargeTurns: 2,
		energy: {
			blue: 4,
			yellow: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Iron Defense.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", target: "user", debuff: {
					type: "stat",
					stat: "defense",
					class: "buff",
					amount: 2
				}
			}
		],
	},
	//Removes a plus-shaped chunk of the board
	"Karate Chop": {
		name: "Karate Chop",
		type: "Fighting",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 25,
		power: 50,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			orange: 9,
		},
		sounds: {
			"attack": "src/audio/attacks/Karate Chop.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "load-value", value: 1 },
			{ type: "choose-tiles", count: -1, target: "user", text: "choose" },
			{ type: "load-value", value: 0 },
			{ type: "get-element-from-list", list: -2, index: -1 },
			{ type: "get-tile-x", tile: -1 },
			{ type: "get-tile-y", tile: -2 },
			{ type: "load-value", value: 1 },
			{ 
				type: "select-tiles-with-expression",
				conditionExpression: "abs(x - %c%) + abs(y - %c%) <= %c%",
				conditionArguments: [-3, -2, -1]
			},
			{ type: "remove-tiles", selection: -1 }
		]
	},
	//Whenever the opponent uses a move, its purple cost increases
	"Kinesis": {
		name: "Kinesis",
		type: "Psychic",
		category: "Status",
		strategy: "debuff-opponent",
		tags: [],
		pp: 15,
		power: null,
		accuracy: 80,
		rechargeTurns: 1,
		energy: {
			purple: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Kinesis.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-last-move", target: "opponent" },
			{ type: "jump-if-truthy", jumpTo: "use-move" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "get-move-name", move: -3, label: "use-move" },
			{ type: "apply-status-effect", target: "opponent", statusEffect: {
				name: "kinesis-cost-increase",
				type: "cost-alteration",
				stacks: true,
				volatile: true,
				lostOnSwap: true,
				lostOnBatonPass: true,
				appliesTo: {
					name: "%c%"
				},
				energyCost: {
					purple: 2
				}
			}, statusSettings: [
				{
					path: ["appliesTo"],
					key: "name",
					value: -1
				}
			] },
		],
		onOpponentUseMove: [
			{ type: "get-triggering-move" },
			{ type: "apply-status-effect", target: "opponent", statusEffect: {
				name: "kinesis-cost-increase",
				type: "cost-alteration",
				stacks: true,
				volatile: true,
				lostOnSwap: true,
				lostOnBatonPass: true,
				appliesTo: {
					move: "%c%"
				},
				energyCost: {
					purple: 2
				}
			}, statusSettings: [
				{
					path: ["appliesTo"],
					key: "move",
					value: -1
				}
			] },
		],
		highlightOnHover: {
			type: "last-enemy-move"
		}
	},
	//Removes energy
	"Knock Off": {
		name: "Knock Off",
		type: "Dark",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 20,
		power: 65,
		accuracy: 100,
		rechargeTurns: 3,
		energy: {
			purple: 8,
			orange: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Knock Off.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "load-value", value: 2 },
			{ type: "select-energy-colors", search: "most-mastery", target: "opponent", count: -1 },
			{ type: "load-value", value: -10 },
			{ type: "gain-energy", count: -1, colors: -2, target: "opponent" },
		]
	},
	//Does nothing unless the user has used all their other moves
	"Last Resort": {
		name: "Last Resort",
		type: "Normal",
		category: "Physical",
		strategy: "special",
		pp: 5,
		power: 140,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			red: 5,
			orange: 5,
			yellow: 5,
			green: 5,
			blue: 5,
			purple: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Last Resort.mp3"
		},
		effects: [
			{ type: "load-value", value: true },
			{ type: "save-variable", name: "canUse", save: -1 },

			{ type: "get-available-moves", target: "user" },
			{ type: "load-value", value: "Last Resort" },
			{ type: "remove-element-from-list", list: -2, element: -1 },
			{ type: "save-variable", name: "allMoves", save: -1 },
			{ type: "get-list-length", list: -1 },
			{ type: "save-variable", name: "length", save: -1 },
			{ type: "load-value", value: 0 },
			{ type: "save-variable", name: "counter", save: -1 },
			
			{ type: "load-variable", name: "counter" },
			{ type: "load-variable", name: "length" },
			{ type: "jump-if-less-than", jumpTo: "startLoop" },
			{ type: "jump", jumpTo: "endLoop" },

			{ type: "load-variable", name: "allMoves", label: "startLoop" },
			{ type: "load-variable", name: "counter" },
			{ type: "get-element-from-list", list: -2, index: -1 },
			{ type: "get-total-move-uses", moveName: -1 },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-less-than", jumpTo: "disable" },
			{ type: "jump", jumpTo: "continue" },

			{ type: "load-value", value: false, label: "disable" },
			{ type: "save-variable", name: "canUse", save: -1 },

			{ type: "do-nothing", label: "continue" },
			{ type: "load-variable", name: "counter" },
			{ type: "load-value", value: 1 },
			{ type: "add-numbers" },
			{ type: "save-variable", name: "counter", save: -1 },
			{ type: "load-variable", name: "length" },
			{ type: "jump-if-less-than", jumpTo: "startLoop" },
			{ type: "jump", jumpTo: "endLoop" },

			{ type: "do-nothing", label: "endLoop" },
			{ type: "load-variable", name: "canUse" },
			{ type: "jump-if-truthy", jumpTo: "use" },
			{ type: "jump", jumpTo: Infinity },
			
			{ type: "play-sound", name: "attack", label: "use" },
			{ type: "damage" },
		],
		onTurnStart: [
			{ type: "trigger", key: "usabilityCheck" },
		],
		onFinishUsingMove: [
			{ type: "trigger", key: "usabilityCheck" },
		],
		usabilityCheck: [
			{ type: "load-value", value: true },
			{ type: "save-variable", name: "canUse", save: -1 },

			{ type: "get-available-moves", target: "user" },
			{ type: "load-value", value: "Last Resort" },
			{ type: "remove-element-from-list", list: -2, element: -1 },
			{ type: "save-variable", name: "allMoves", save: -1 },
			{ type: "get-list-length", list: -1 },
			{ type: "save-variable", name: "length", save: -1 },
			{ type: "load-value", value: 0 },
			{ type: "save-variable", name: "counter", save: -1 },
			
			{ type: "load-variable", name: "counter" },
			{ type: "load-variable", name: "length" },
			{ type: "jump-if-less-than", jumpTo: "startLoop" },
			{ type: "jump", jumpTo: "endLoop" },

			{ type: "load-variable", name: "allMoves", label: "startLoop" },
			{ type: "load-variable", name: "counter" },
			{ type: "get-element-from-list", list: -2, index: -1 },
			{ type: "get-total-move-uses", moveName: -1 },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-less-than", jumpTo: "disable" },
			{ type: "jump", jumpTo: "continue" },

			{ type: "load-value", value: false, label: "disable" },
			{ type: "save-variable", name: "canUse", save: -1 },

			{ type: "do-nothing", label: "continue" },
			{ type: "load-variable", name: "counter" },
			{ type: "load-value", value: 1 },
			{ type: "add-numbers" },
			{ type: "save-variable", name: "counter", save: -1 },
			{ type: "load-variable", name: "length" },
			{ type: "jump-if-less-than", jumpTo: "startLoop" },
			{ type: "jump", jumpTo: "endLoop" },

			{ type: "do-nothing", label: "endLoop" },
			{ type: "load-variable", name: "canUse" },
			{ type: "jump-if-truthy", jumpTo: "remove-disability" },
			{ type: "jump", jumpTo: "add-disability" },
			
			{ type: "apply-status-effect", target: "user", label: "add-disability", statusEffect: {
				name: "last-resort-disabled",
				type: "disability",
				stacks: false,
				volatile: true,
				appliesTo: {
					name: "Last Resort"
				},
			} },
			{ type: "jump", jumpTo: Infinity },
			
			{ type: "do-nothing", label: "remove-disability" },
			{ type: "remove-status-effect", target: "user", statusName: "last-resort-disabled" },
		]
	},
	//Converts random tiles to Grass tiles
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
			green: 8
		},
		sounds: {
			"attack": "src/audio/attacks/Leafage.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "load-value", value: 3 },
			{ type: "select-random-tiles", count: -1 },
			{ type: "change-tile-type", selection: "group", which: -1, targetType: "green" },
		]
	},
	//Every turn the defender has hp drained
	"Leech Seed": {
		name: "Leech Seed",
		type: "Grass",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 10,
		power: null,
		accuracy: 90,
		rechargeTurns: 5,
		energy: {
			red: 6,
			green: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Leech Seed.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", statusEffect: "seedling", target: "opponent" },
		],
	},
	//Lowers enemy defense 1
	"Leer": {
		name: "Leer",
		type: "Normal",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 30,
		power: null,
		accuracy: 100,
		rechargeTurns: 5,
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
					class: "debuff",
					amount: -1
				}
			}
		],
	},
	//Makes Dark tiles more likely and Grass tiles less likely
	"Lick": {
		name: "Lick",
		type: "Ghost",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
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
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "load-value", value: 0.5 },
			{ type: "change-tile-weight", tileType: "green", factor: -1 },
			{ type: "load-value", value: -1 },
			{ type: "multiply-numbers" },
			{ type: "change-tile-weight", tileType: "black", add: -1 },
		]
	},
	//Heals all of your non-fainted pokemon
	"Life Dew": {
		name: "Life Dew",
		type: "Water",
		category: "Status",
		strategy: "special",
		tags: ["healing"],
		pp: 10,
		power: null,
		accuracy: null,
		rechargeTurns: 5,
		energy: {
			green: 5,
			blue: 7,
			purple: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Heal.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-viable-pokemon", target: "user" },
			{ type: "save-variable", name: "pokemon", save: -1 },
			{ type: "get-list-length", list: -1 },
			{ type: "save-variable", name: "length", save: -1 },
			{ type: "load-value", value: 0 },
			{ type: "save-variable", name: "counter", save: -1 },
			
			{ type: "load-variable", name: "counter" },
			{ type: "load-variable", name: "length" },
			{ type: "jump-if-less-than", jumpTo: "startLoop" },
			{ type: "jump", jumpTo: "endLoop" },

			{ type: "load-variable", name: "pokemon", label: "startLoop" },
			{ type: "load-variable", name: "counter" },
			{ type: "get-element-from-list", list: -2, index: -1 },
			{ type: "get-max-hp", pokemon: -1 },
			{ type: "load-value", value: 0.25 },
			{ type: "multiply-numbers", round: "up" },
			{ type: "heal", pokemon: -4, amount: -1 },

			{ type: "load-variable", name: "counter" },
			{ type: "load-value", value: 1 },
			{ type: "add-numbers" },
			{ type: "save-variable", name: "counter", save: -1 },
			{ type: "load-variable", name: "length" },
			{ type: "jump-if-less-than", jumpTo: "startLoop" },
			{ type: "jump", jumpTo: "endLoop" },

			{ type: "do-nothing", label: "endLoop" }
		],
	},
	//Half damage from special moves for 5 turns
	"Light Screen": {
		name: "Light Screen",
		type: "Psychic",
		category: "Status",
		strategy: "buff-user",
		pp: 30,
		power: null,
		accuracy: null,
		rechargeTurns: 7,
		energy: {
			green: 3,
			purple: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Light Screen.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", statusEffect: "light-screen", target: "user" },
		],
	},
	//Deals damage based on opponent's weight
	"Low Kick": {
		name: "Low Kick",
		type: "Fighting",
		category: "Physical",
		strategy: "special",
		tags: ["damage-dealing", "makes-contact"],
		pp: 20,
		power: 0,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			orange: 5,
			red: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Low Kick.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-weight", target: "opponent" },
			{ type: "load-value", value: 10 },
			{ type: "jump-if-less-than", jumpTo: "damage-1" },
			{ type: "get-weight", target: "opponent" },
			{ type: "load-value", value: 25 },
			{ type: "jump-if-less-than", jumpTo: "damage-2" },
			{ type: "get-weight", target: "opponent" },
			{ type: "load-value", value: 50 },
			{ type: "jump-if-less-than", jumpTo: "damage-3" },
			{ type: "get-weight", target: "opponent" },
			{ type: "load-value", value: 100 },
			{ type: "jump-if-less-than", jumpTo: "damage-4" },
			{ type: "get-weight", target: "opponent" },
			{ type: "load-value", value: 200 },
			{ type: "jump-if-less-than", jumpTo: "damage-5" },
			{ type: "jump", jumpTo: "damage-6" },

			{ type: "load-value", value: 20, label: "damage-1" },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 40, label: "damage-2" },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 60, label: "damage-3" },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 80, label: "damage-4" },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 100, label: "damage-5" },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 120, label: "damage-6" },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
		],
	},
	//Shifts the bottom row of tiles
	"Low Sweep": {
		name: "Low Sweep",
		type: "Fighting",
		category: "Physical",
		strategy: "basic-damage",
		pp: 20,
		power: 60,
		accuracy: 100,
		rechargeTurns: 2,
		energy: {
			orange: 10
		},
		sounds: {
			"attack": "src/audio/attacks/Low Sweep.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "get-board-height" },
			{ type: "load-value", value: -1 },
			{ type: "add-numbers" },
			{ type: "select-row", y: -1 },
			{ type: "get-side-number", left: 3, right: -3 },
			{ type: "load-value", value: 0 },
			{ type: "shift-tiles", selection: -3, xOffset: -2, yOffset: -1 },
		]
	},
	//Deals bonus damage if you're faster
	"Mach Punch": {
		name: "Mach Punch",
		type: "Fighting",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact", "punching"],
		pp: 30,
		power: 40,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			orange: 5,
			yellow: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Mach Punch.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-stat", which: "speed", target: "opponent" },
			{ type: "get-stat", which: "speed", target: "user" },
			{ type: "jump-if-less-than", jumpTo: "big-damage" },
			{ type: "damage" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 40 },
			{ type: "damage", additivePower: -1, label: "big-damage" }
		],
	},
	//Empowers all Grass tiles
	"Magical Leaf": {
		name: "Magical Leaf",
		type: "Grass",
		category: "Special",
		strategy: "basic-damage",
		pp: 20,
		power: 60,
		accuracy: 100,
		rechargeTurns: 5,
		energy: {
			green: 10,
			purple: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Magical Leaf.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "load-value", value: 3 },
			{ type: "select-all-tiles", targetType: "green" },
			{ type: "empower-tiles", selection: -1 },
		]
	},
	//Prevents the opponent from switching out
	"Mean Look": {
		name: "Mean Look",
		type: "Normal",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 5,
		power: null,
		accuracy: null,
		rechargeTurns: 10,
		energy: {
			orange: 5,
			purple: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Mean Look.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", statusEffect: "fear-frozen", target: "opponent" }
		],
	},
	//Steals HP
	"Mega Drain": {
		name: "Mega Drain",
		type: "Grass",
		category: "Special",
		strategy: "basic-damage",
		tags: ["healing"],
		pp: 15,
		power: 40,
		accuracy: 100,
		rechargeTurns: 2,
		energy: {
			green: 6,
			red: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Mega Drain part 1.mp3"
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
	//50% chance of raising attack 1
	"Metal Claw": {
		name: "Metal Claw",
		type: "Steel",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 35,
		power: 50,
		accuracy: 95,
		rechargeTurns: 1,
		energy: {
			yellow: 6,
			blue: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Metal Claw.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 6 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{
				type: "apply-debuff", target: "user", debuff: {
					type: "stat",
					stat: "attack",
					class: "buff",
					amount: 1
				}
			}
		],
	},
	//Converts random tiles into Steel tiles
	"Metal Sound": {
		name: "Metal Sound",
		type: "Steel",
		category: "Status",
		strategy: "debuff-opponent",
		tags: ["sound-based"],
		pp: 40,
		power: null,
		accuracy: 85,
		rechargeTurns: 3,
		energy: {
			orange: 4,
			purple: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Metal Sound.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", target: "opponent", debuff: {
					type: "stat",
					stat: "specialDefense",
					class: "debuff",
					amount: -2
				}
			},
			{ type: "load-value", value: 3 },
			{ type: "select-random-tiles", count: -1 },
			{ type: "change-tile-type", selection: "group", which: -1, targetType: "gray" },
		],
	},
	//Adds the opponent's last used move to your active moves until the fight
	"Mimic": {
		name: "Mimic",
		type: "Normal",
		category: "Status",
		strategy: "special",
		pp: 20,
		power: null,
		accuracy: null,
		rechargeTurns: 1,
		energy: {
			orange: 4,
			green: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Mimic.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-last-move", target: "opponent" },
			{ type: "save-variable", name: "move", save: -1 },
			{ type: "jump-if-truthy", jumpTo: "use-move" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "do-nothing", label: "use-move" },
			{ type: "load-variable", name: "move" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "mimic-added-move",
				type: "add-move",
				stacks: true,
				volatile: true,
				move: "%c%"
			}, statusSettings: [
				{
					key: "move",
					value: -1
				}
			] },
			{ type: "reset-moves", target: "user" },
		],
		highlightOnHover: {
			type: "last-enemy-move"
		}
	},
	//Reduces your move costs but also reduces their power
	"Minimize": {
		name: "Minimize",
		type: "Normal",
		category: "Status",
		strategy: "special",
		pp: 10,
		power: null,
		accuracy: null,
		rechargeTurns: 5,
		energy: {
			yellow: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Minimize.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "minimize-cost-reduction",
				type: "cost-alteration",
				stacks: false,
				volatile: true,
				appliesTo: {
					logic: "not",
					name: "Minimize"
				},
				turns: 1,
				modification: {
					change: 0.5,
					operation: "multiply"
				},
				energyCost: {}
			} },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "minimize-power-reduction",
				type: "power-alteration",
				stacks: false,
				volatile: true,
				appliesTo: {
					logic: "not",
					name: "Minimize"
				},
				turns: 1,
				modification: {
					change: 0.75,
					operation: "multiply"
				}
			} },
		],
	},
	//Prevents receiving stat debuffs
	"Mist": {
		name: "Mist",
		type: "Ice",
		category: "Status",
		strategy: "special",
		tags: [],
		pp: 30,
		power: null,
		accuracy: null,
		rechargeTurns: 5,
		energy: {
			blue: 3,
			green: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Mist.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", statusEffect: "mist", target: "user" }
		],
	},
	//Heals HP based on how many blue tiles there are
	"Moonlight": {
		name: "Moonlight",
		type: "Fairy",
		category: "Status",
		strategy: "special",
		tags: ["healing"],
		pp: 5,
		power: null,
		accuracy: null,
		rechargeTurns: 1,
		energy: {
			blue: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Moonlight part 1.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "count-tiles", options: { type: "blue" } },
			{ type: "load-value", value: 0.05 },
			{ type: "multiply-numbers" },
			{ type: "get-max-hp", target: "user" },
			{ type: "multiply-numbers" },
			{ type: "load-value", value: 1 },
			{ type: "heal", target: "user", amount: -2, min: -1 },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "moonlight-cooldown",
				type: "cooldown-alteration",
				stacks: true,
				volatile: true,
				appliesTo: {
					name: "Moonlight"
				},
				modification: {
					change: 2,
					operation: "add"
				}
			} },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "moonlight-cost-alteration",
				type: "cost-alteration",
				stacks: true,
				volatile: true,
				appliesTo: {
					name: "Moonlight"
				},
				energyCost: {
					blue: 4
				}
			} },
		],
	},
	//Gives random tiles Energy Down
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
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "load-value", value: 2 },
			{ type: "select-random-tiles", count: -1 },
			{
				type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Energy Down", type: "debuff", duration: null }
			},
		],
	},
	//Lowers enemy special attack and empowers some red tiles
	"Mystical Fire": {
		name: "Mystical Fire",
		type: "Fire",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 10,
		power: 75,
		accuracy: 100,
		rechargeTurns: 2,
		energy: {
			yellow: 4,
			red: 7
		},
		sounds: {
			"attack": "src/audio/attacks/Mystical Fire.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{
				type: "apply-debuff", target: "opponent", debuff: {
					type: "stat",
					stat: "specialAttack",
					class: "debuff",
					amount: -1
				}
			},
			{ type: "load-value", value: 3 },
			{ type: "select-random-tiles", count: -1, conditions: { types: ["red"] } },
			{ type: "empower-tiles", selection: -1 },
		],
	},
	//Raises your special attack 2
	"Nasty Plot": {
		name: "Nasty Plot",
		type: "Dark",
		category: "Status",
		strategy: "buff-user",
		pp: 20,
		power: null,
		accuracy: null,
		rechargeTurns: 4,
		energy: {
			orange: 7,
			purple: 7
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
					class: "buff",
					amount: 2
				}
			}
		],
	},
	//Deals damage equal the user's level
	"Night Shade": {
		name: "Night Shade",
		type: "Ghost",
		category: "Special",
		strategy: "special",
		tags: ["damage-dealing"],
		pp: 15,
		power: null,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			red: 3,
			purple: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Night Shade.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-level", target: "user" },
			{ type: "damage", amount: -1, fixed: true, finalImmunityCheck: true },
		],
	},
	//Converts a diagonal to Dark tiles
	"Night Slash": {
		name: "Night Slash",
		type: "Dark",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 15,
		power: 70,
		accuracy: 100,
		rechargeTurns: 3,
		energy: {
			yellow: 5,
			red: 8
		},
		sounds: {
			"attack": "src/audio/attacks/Night Slash.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "get-side-number", left: 1, right: 2 },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-equal", jumpTo: "left"},
			{ type: "jump", jumpTo: "right"},

			{ type: "get-board-width", label: "left" },
			{ type: "load-value", value: 0 },
			{ type: "select-tiles-at", x: -1, y: -1 },
			{ type: "save-variable", name: "tile1selection", save: -1 },
			{ type: "get-board-height" },
			{ type: "load-value", value: -1 },
			{ type: "add-numbers" },
			{ type: "get-board-width" },
			{ type: "load-value", value: -1 },
			{ type: "add-numbers" },
			{ type: "select-tiles-at", x: -1, y: -4 },
			{ type: "save-variable", name: "tile2selection", save: -1 },
			{ type: "jump", jumpTo: "convert" },

			{ type: "get-board-width", label: "right" },
			{ type: "load-value", value: -1 },
			{ type: "add-numbers" },
			{ type: "load-value", value: 0 },
			{ type: "select-tiles-at", x: -2, y: -1 },
			{ type: "save-variable", name: "tile1selection", save: -1 },
			{ type: "get-board-height" },
			{ type: "load-value", value: -1 },
			{ type: "add-numbers" },
			{ type: "load-value", value: 0 },
			{ type: "select-tiles-at", x: -1, y: -2 },
			{ type: "save-variable", name: "tile2selection", save: -1 },
			{ type: "jump", jumpTo: "convert" },

			{ type: "load-variable", name: "tile1selection", label: "convert" },
			{ type: "load-variable", name: "tile2selection" },
			{ type: "combine-selections", selection1: -1, selection2: -2 },
			{ type: "select-tiles-between", selection: -1 },
			{ type: "combine-selections", selection1: -1, selection2: -2 },
			{ type: "change-tile-type", selection: "group", which: -1, targetType: "black" },
		],
	},
	//Paralyzes the opponent
	"Nuzzle": {
		name: "Nuzzle",
		type: "Electric",
		category: "Physical",
		strategy: "debuff-opponent",
		tags: ["damage-dealing", "makes-contact"],
		pp: 20,
		power: 20,
		accuracy: 100,
		rechargeTurns: 5,
		energy: {
			yellow: 12
		},
		sounds: {
			"attack": "src/audio/attacks/Nuzzle.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			//This isn't an additional effect because I say so
			{ type: "apply-status-effect", statusEffect: "paralyzed", target: "opponent" }
		],
	},
	//Turns all Electric tiles into Rainbow tiles
	"Pay Day": {
		name: "Pay Day",
		type: "Normal",
		category: "Physical",
		strategy: "special",
		pp: 20,
		power: 40,
		accuracy: 100,
		rechargeTurns: 3,
		energy: {
			yellow: 8,
			purple: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Pay Day.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "select-all-tiles", targetType: "yellow" },
			{ type: "change-tile-type", selection: "group", which: -1, targetType: "rainbow" },
			{ type: "damage" },
			{ type: "end-turn" }
		],
	},
	//Deals extra damage against faster targets
	"Payback": {
		name: "Payback",
		type: "Dark",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
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
			{ type: "jump-if-less-than", jumpTo: "big-damage" },
			{ type: "damage" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 50 },
			{ type: "damage", additivePower: -1, label: "big-damage" }
		],
	},
	//Basic damage and end turn
	"Peck": {
		name: "Peck",
		type: "Flying",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
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
	//Deals damage on a delay, THROUGH invulnerable
	"Phantom Force": {
		name: "Phantom Force",
		type: "Ghost",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 10,
		power: 90,
		accuracy: 100,
		rechargeTurns: 5,
		energy: {
			red: 4,
			purple: 10
		},
		sounds: {
			"attack": "src/audio/attacks/Phantom Force part 1.mp3",
			"activate": "src/audio/attacks/Phantom Force part 2.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", statusEffect: "invulnerable", target: "user" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "phantom-force-using-phantom-force",
				type: "hidden",
				stacks: false,
				volatile: true,
				lostOnSwap: true,
				lostOnBatonPass: true
			} },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "phantom-force-wait-time",
				type: "hidden",
				stacks: false,
				volatile: true,
				lostOnSwap: true,
				lostOnBatonPass: true,
				turns: 1
			} },
			{ type: "end-turn" },
		],
		onTurnStart: [
			{ type: "get-status-stacks", statusName: "phantom-force-using-phantom-force" },
			{ type: "jump-if-truthy", jumpTo: "phantom-force-check" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "get-status-stacks", statusName: "phantom-force-wait-time", label: "phantom-force-check" },
			{ type: "jump-if-truthy", jumpTo: Infinity },
			{ type: "play-sound", name: "activate" },
			{ type: "remove-status-effect", target: "opponent", statusName: "invulnerable" },
			{ type: "remove-status-effect", target: "opponent", statusName: "protect" },
			{ type: "damage" },
			{ type: "remove-status-effect", target: "user", statusName: "phantom-force-using-phantom-force" },
		]
	},
	//The user may swap any two tiles
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
					class: "debuff",
					amount: -1
				}
			},
			{ type: "load-value", value: 2 },
			{ type: "choose-tiles", count: -1, target: "user" },
			{ type: "swap-tiles", selection: -1 },
		],
	},
	//Swaps 2 random tiles
	"Play Rough": {
		name: "Play Rough",
		type: "Fairy",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 10,
		power: 90,
		accuracy: 90,
		rechargeTurns: 1,
		energy: {
			purple: 6,
			yellow: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Play Rough.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "load-value", value: 2 },
			{ type: "select-random-tiles", count: -1 },
			{ type: "swap-tiles", selection: -1 },
		],
	},
	//Steals energy
	"Pluck": {
		name: "Pluck",
		type: "Flying",
		category: "Physical",
		strategy: "special",
		tags: ["damage-dealing", "makes-contact"],
		pp: 20,
		power: 60,
		accuracy: 100,
		rechargeTurns: 3,
		energy: {
			blue: 4,
			red: 2
		},
		sounds: {
			"attack": "src/audio/attacks/Pluck.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "load-value", value: 1 },
			{ type: "select-energy-colors", search: "most-full", target: "opponent", count: -1 },
			{ type: "get-energy-values", colors: -1, target: "opponent" },
			{ type: "load-value", value: -0.5 },
			{ type: "multiply-energy", amounts: -2, scale: -1, round: "down" },
			{ type: "gain-energy", amounts: -1, target: "opponent" },
			{ type: "load-value", value: -1 },
			{ type: "multiply-energy", amounts: -2, scale: -1 },
			{ type: "gain-energy", amounts: -1, target: "user" }
		],
	},
	//Poisons but deals extra damage if they're already poisoned
	"Poison Fang": {
		name: "Poison Fang",
		type: "Poison",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact", "biting"],
		pp: 15,
		power: 50,
		accuracy: 100,
		rechargeTurns: 3,
		energy: {
			purple: 7,
			yellow: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Poison Fang.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-status-stacks", statusName: "poisoned" },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-less-than", jumpTo: "small-damage" },
			{ type: "load-value", value: 20 },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "damage", label: "small-damage" },
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 6 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "apply-status-effect", statusEffect: "poisoned", target: "opponent" },
		],
	},
	//Applies poison
	"Poison Gas": {
		name: "Poison Gas",
		type: "Poison",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 40,
		power: null,
		accuracy: 90,
		rechargeTurns: 5,
		energy: {
			purple: 8
		},
		sounds: {
			"attack": "src/audio/attacks/Poison Gas part 1.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 10 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "apply-status-effect", statusEffect: "poisoned", target: "opponent" },
		],
	},
	//Places infectious status effects on the board that eventually poison
	"Poison Powder": {
		name: "Poison Powder",
		type: "Grass",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 35,
		power: null,
		accuracy: 75,
		rechargeTurns: 5,
		energy: {
			red: 4,
			green: 4,
			purple: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Poison Powder part 1.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "load-value", value: 5 },
			{ type: "select-random-tiles", count: -1 },
			{ type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Poison Powder", type: "debuff", duration: 5 }
			}
		],
	},
	//Deals damage and might poison
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
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 4 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "apply-status-effect", statusEffect: "poisoned", target: "opponent" },
		],
	},
	//Basic damage and end turn
	"Pound": {
		name: "Pound",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
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
	//Freezes a tile
	"Powder Snow": {
		name: "Powder Snow",
		type: "Ice",
		category: "Special",
		strategy: "basic-damage",
		pp: 25,
		power: 40,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			blue: 4,
			yellow: 2
		},
		sounds: {
			"attack": "src/audio/attacks/Powder Snow.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "load-value", value: 1 },
			{ type: "select-random-tiles", count: -1 },
			{
				type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Freeze", type: "debuff" }
			}
		]
	},
	//Empower tiles near the center
	"Power Gem": {
		name: "Power Gem",
		type: "Rock",
		category: "Special",
		strategy: "basic-damage",
		pp: 20,
		power: 80,
		accuracy: 100,
		rechargeTurns: 2,
		energy: {
			orange: 6,
			red: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Power Gem.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "get-board-width" },
			{ type: "load-value", value: -1 },
			{ type: "add-numbers" },
			{ type: "load-value", value: 2 },
			{ type: "divide-numbers" },
			{ type: "save-variable", name: "x", save: -1 },

			{ type: "get-board-height" },
			{ type: "load-value", value: -1 },
			{ type: "add-numbers" },
			{ type: "load-value", value: 2 },
			{ type: "divide-numbers" },
			{ type: "save-variable", name: "y", save: -1 },

			{ type: "load-variable", name: "x" },
			{ type: "load-variable", name: "y" },
			{ type: "load-value", value: 2 },
			{ 
				type: "select-tiles-with-expression",
				conditionExpression: "((x - %c%)^2 + (y - %c%)^2)^0.5 <= %c%",
				conditionArguments: [-3, -2, -1]
			},
			{ type: "empower-tiles", selection: -1 },
		]
	},
	//Dumps all your energy to raise your next move's power
	"Power-Up Punch": {
		name: "Power-Up Punch",
		type: "Fighting",
		category: "Physical",
		strategy: "basic-damage",
		pp: 20,
		power: 40,
		accuracy: 100,
		rechargeTurns: 3,
		energy: {
			orange: 8
		},
		sounds: {
			"attack": "src/audio/attacks/Power-Up Punch.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "apply-debuff", target: "user", debuff: {
				type: "stat",
				stat: "attack",
				class: "buff",
				amount: 1
			} },
			{ type: "get-total-energy", target: "user" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "power-up-punch-powered-up",
				type: "power-alteration",
				stacks: true,
				lostOnSwap: true,
				lostOnBatonPass: true,
				numberOfApplications: 1,
				appliesTo: {
					logic: "not"
				},
				modification: {
					change: "%c%",
					operation: "add"
				}
			}, replacementsForResultObj: [
				{
					path: ["modification"],
					key: "change",
					value: -1
				}
			] },
			{ type: "get-energy", target: "user" },
			{ type: "load-value", value: -1 },
			{ type: "multiply-energy", amounts: -2, scale: -1 },
			{ type: "gain-energy", amounts: -1, target: "user" }
		]
	},
	//Random effects
	"Present": {
		name: "Present",
		type: "Normal",
		category: "Physical",
		strategy: "special",
		tags: ["damage-dealing", "healing"],
		pp: 15,
		power: 0,
		accuracy: 90,
		rechargeTurns: 1,
		energy: {
			blue: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Present damage.mp3",
			"heal": "src/audio/attacks/Present heal.mp3",
		},
		effects: [
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 2 },
			{ type: "jump-if-less-than", jumpTo: "energy" },
			{ type: "random-number", min: 1, max: 9 },
			{ type: "load-value", value: 2 },
			{ type: "jump-if-less-than", jumpTo: "heal" },
			{ type: "random-number", min: 1, max: 8 },
			{ type: "load-value", value: 5 },
			{ type: "jump-if-less-than", jumpTo: "damage-1" },
			{ type: "random-number", min: 1, max: 4 },
			{ type: "load-value", value: 4 },
			{ type: "jump-if-less-than", jumpTo: "damage-2" },
			{ type: "jump", jumpTo: "damage-3" },

			{ type: "play-sound", name: "attack", label: "damage-1" },
			{ type: "load-value", value: 40 },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "play-sound", name: "attack", label: "damage-2" },
			{ type: "load-value", value: 80 },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "play-sound", name: "attack", label: "damage-3" },
			{ type: "load-value", value: 120 },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "play-sound", name: "heal", label: "heal" },
			{ type: "wait", duration: 500 },
			{ type: "get-hp", target: "opponent" },
			{ type: "load-value", value: 0.25 },
			{ type: "multiply-numbers", round: "up" },
			{ type: "heal", target: "opponent", amount: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "play-sound", name: "heal", label: "energy" },
			{ type: "wait", duration: 500 },
			{ type: "get-energy-capacities", target: "opponent" },
			{ type: "gain-energy", amounts: -1, target: "opponent" },
			{ type: "jump", jumpTo: Infinity },
		],
	},
	//Protect.
	"Protect": {
		name: "Protect",
		type: "Normal",
		category: "Status",
		strategy: "buff-user",
		pp: 10,
		power: null,
		accuracy: null,
		rechargeTurns: 7,
		energy: {
			orange: 2,
			yellow: 2,
			blue: 2
		},
		sounds: {
			"attack": "src/audio/attacks/Protect.mp3",
			"bonk": "src/audio/attacks/Protect shield hit.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", statusEffect: "protect", target: "user" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "protect-cooldown",
				type: "cooldown-alteration",
				stacks: true,
				volatile: true,
				appliesTo: {
					name: "Protect"
				},
				modification: {
					change: 1,
					operation: "add"
				}
			} },
		],
	},
	//Choose two tiles, shuffle them and all tiles between them
	"Psybeam": {
		name: "Psybeam",
		type: "Psychic",
		category: "Special",
		strategy: "basic-damage",
		tags: ["damage-dealing"],
		pp: 20,
		power: 65,
		accuracy: 100,
		rechargeTurns: 3,
		energy: {
			purple: 12
		},
		sounds: {
			"attack": "src/audio/attacks/Psybeam.mp3",
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 6 },
			{ type: "jump-if-less-than", jumpTo: "shuffle" },
			{ type: "apply-status-effect", statusEffect: "confused", target: "opponent" },

			{ type: "load-value", value: 2, label: "shuffle" },
			{ type: "choose-tiles", count: -1, target: "user" },
			{ type: "select-tiles-between", selection: -1 },
			{ type: "shuffle-tiles", selection: -1 }
		]
	},
	//Deals extra damage to pokemon that just switched in
	"Pursuit": {
		name: "Pursuit",
		type: "Dark",
		category: "Physical",
		strategy: "special",
		tags: ["damage-dealing", "makes-contact"],
		pp: 20,
		power: 40,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			orange: 8
		},
		sounds: {
			"attack": "src/audio/attacks/Pursuit.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
		],
		onTurnStart: [
			{ type: "get-turns-active", target: "opponent" },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-less-than", jumpTo: "add-status" },
			{ type: "remove-status-effect", target: "user", statusName: "pursuit-double-power" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "apply-status-effect", target: "user", label: "add-status", statusEffect: {
				name: "pursuit-double-power",
				type: "power-alteration",
				stacks: false,
				turns: 1,
				lostOnSwap: true,
				lostOnBatonPass: true,
				appliesTo: {
					names: ["Pursuit"]
				},
				modification: {
					change: 2,
					operation: "multiply"
				}
			} },
		]
	},
	//Caps the opponent's initiative gain
	"Quash": {
		name: "Quash",
		type: "Dark",
		category: "Status",
		strategy: "special",
		tags: [],
		pp: 15,
		power: null,
		accuracy: 100,
		rechargeTurns: 5,
		energy: {
			blue: 5,
			orange: 2
		},
		sounds: {
			"attack": "src/audio/attacks/Quash.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", target: "opponent", statusEffect: {
				name: "quash-quashed",
				type: "initiative-gain-cap-relative",
				stacks: false,
				volatile: true,
				lostOnSwap: true,
				turns: 5
			} },
		],
	},
	//Can be used multiple times in a turn
	"Quick Attack": {
		name: "Quick Attack",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 30,
		power: 40,
		accuracy: 100,
		rechargeTurns: 0,
		energy: {
			yellow: 4,
			orange: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Quick Attack.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" }
		],
	},
	//Reduces enemy power by 75% on moves with recharge < 2
	"Quick Guard": {
		name: "Quick Guard",
		type: "Fighting",
		category: "Status",
		strategy: "buff-user",
		tags: [],
		pp: 15,
		power: null,
		accuracy: null,
		rechargeTurns: 5,
		energy: {
			orange: 3,
			yellow: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Quick Guard.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "quick-guard-protected",
				type: "power-alteration-opponent",
				stacks: true,
				volatile: true,
				lostOnSwap: true,
				turns: 1,
				appliesTo: {
					rechargeTurns: {
						operation: "less-than",
						value: 2
					}
				},
				modification: {
					change: 0.25,
					operation: "multiply"
				}
			} },
		],
	},
	//Remove many status effects from yourself and the board
	"Rapid Spin": {
		name: "Rapid Spin",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 40,
		power: 50,
		accuracy: 100,
		rechargeTurns: 2,
		energy: {
			red: 7
		},
		sounds: {
			"attack": "src/audio/attacks/Rapid Spin.mp3",
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "remove-status-from-all-tiles", statusName: "Wrap", exceptFriendlyStatuses: true },
			{ type: "remove-status-from-all-tiles", statusName: "Infested", exceptFriendlyStatuses: true },
			{ type: "remove-status-from-all-tiles", statusName: "Static", exceptFriendlyStatuses: true },
			{ type: "remove-status-from-all-tiles", statusName: "Locked", exceptFriendlyStatuses: true },
			{ type: "remove-status-effect", target: "user", statusName: "seedling" },
			{ type: "remove-status-effect", target: "user", statusName: "splinters" },
		],
	},
	//Choose two Grass tiles, remove all tiles between them
	"Razor Leaf": {
		name: "Razor Leaf",
		type: "Grass",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing"],
		pp: 25,
		power: 50,
		accuracy: 95,
		rechargeTurns: 2,
		energy: {
			green: 10
		},
		sounds: {
			"attack": "src/audio/attacks/Razor Leaf.mp3",
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "count-tiles", options: { type: "green" } },
			{ type: "load-value", value: 3 },
			{ type: "multiply-numbers" },
			{ type: "damage", additivePower: -1 }
		],
	},
	//Half damage from physical moves for 5 turns
	"Reflect": {
		name: "Reflect",
		type: "Psychic",
		category: "Status",
		strategy: "buff-user",
		pp: 20,
		power: null,
		accuracy: null,
		rechargeTurns: 7,
		energy: {
			red: 3,
			purple: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Reflect.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", statusEffect: "reflect", target: "user" },
		],
	},
	//Heal all your HP back, but all your moves are disabled until the sleep is gone
	"Rest": {
		name: "Rest",
		type: "Psychic",
		category: "Status",
		strategy: "special",
		tags: ["healing"],
		pp: 5,
		power: null,
		accuracy: null,
		rechargeTurns: 10,
		energy: {
			green: 12,
			purple: 12
		},
		sounds: {
			"attack": "src/audio/attacks/Rest part 1.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "remove-status-effect", target: "user", statusName: "asleep" },
			{ type: "apply-status-effect", statusEffect: "asleep", target: "user" },

			{ type: "get-status-stacks", target: "user", statusName: "asleep" },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-greater-than-or-equal-to", jumpTo: "heal" },
			{ type: "jump", jumpTo: Infinity },

			{ type: "get-max-hp", target: "user", label: "heal" },
			{ type: "heal", target: "user", amount: -1 },
			
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "rest-resting",
				type: "disability",
				stacks: false,
				volatile: true,
				appliesTo: {
					logic: "not"
				},
			} },
		],
		onTurnStart: [
			{ type: "get-status-stacks", target: "user", statusName: "rest-resting" },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-greater-than-or-equal-to", jumpTo: "sleep-check" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "get-status-stacks", target: "user", statusName: "asleep", label: "sleep-check" },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-less-than", jumpTo: "ready-to-wake" },
			{ type: "jump", jumpTo: Infinity },
			
			{ type: "apply-status-effect", statusEffect: "asleep", target: "user", label: "ready-to-wake" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "rest-waking",
				type: "hidden",
				stacks: false,
				volatile: true,
			} },
		],
		onTurnEnd: [
			{ type: "get-status-stacks", target: "user", statusName: "rest-waking" },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-greater-than-or-equal-to", jumpTo: "wake-up" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "remove-status-effect", target: "user", statusName: "asleep", label: "wake-up" },
			{ type: "remove-status-effect", target: "user", statusName: "rest-resting" },
			{ type: "remove-status-effect", target: "user", statusName: "rest-waking" },
		]
	},
	//Changes power whenever another of your pokemon faints
	"Retaliate": {
		name: "Retaliate",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 5,
		power: 70,
		accuracy: 100,
		rechargeTurns: 2,
		energy: {
			orange: 5,
			yellow: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Retaliate.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
		],
		onTurnStart: [
			{ type: "remove-status-effect", target: "user", statusName: "retaliate-power-increase-by-fainted" },
			{ type: "remove-status-effect", target: "user", statusName: "retaliate-power-increase-by-turns" },
			{ type: "has-own-pokemon-fainted-since-last-turn", target: "user" },
			{ type: "load-value", value: false },
			{ type: "jump-if-equal", jumpTo: Infinity },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "retaliate-power-increase-by-fainted",
				type: "power-alteration",
				stacks: false,
				lostOnSwap: true,
				lostOnBatonPass: true,
				appliesTo: {
					name: "Retaliate"
				},
				modification: {
					change: 2,
					operation: "multiply"
				}
			} },
			{ type: "get-turns-since-last-turn", target: "user" },
			{ type: "load-value", value: 10 },
			{ type: "multiply-numbers" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "retaliate-power-increase-by-turns",
				type: "power-alteration",
				stacks: false,
				lostOnSwap: true,
				lostOnBatonPass: true,
				appliesTo: {
					name: "Retaliate"
				},
				modification: {
					change: 0,
					operation: "add"
				}
			}, statusSettings: [
				{
					path: ["modification"],
					key: "change",
					value: -1
				}
			] },
		]
	},
	//Deals more damage if you took damage since your last turn ended
	"Revenge": {
		name: "Revenge",
		type: "Fighting",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 10,
		power: 60,
		accuracy: 100,
		rechargeTurns: 4,
		energy: {
			orange: 5,
			red: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Revenge.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-pokemon-data", target: "opponent", key: "damagedSinceLastOwnTurn" },
			{ type: "jump-if-truthy", jumpTo: "double-damage" },
			{ type: "damage" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "damage", damageMult: 2, label: "double-damage" },
		],
	},
	//Flail, but Fighting this time
	"Reversal": {
		name: "Reversal",
		type: "Fighting",
		category: "Physical",
		strategy: "special",
		tags: ["damage-dealing", "makes-contact"],
		pp: 15,
		power: 0,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			orange: 5,
			blue: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Reversal.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-hp", target: "user" },
			{ type: "get-max-hp", target: "user" },
			{ type: "divide-numbers" },
			{ type: "save-variable", name: "ratio", save: -1 },
			{ type: "load-value", value: 0.05 },
			{ type: "jump-if-less-than", jumpTo: "damage-1" },
			{ type: "load-variable", name: "ratio" },
			{ type: "load-value", value: 0.10 },
			{ type: "jump-if-less-than", jumpTo: "damage-2" },
			{ type: "load-variable", name: "ratio" },
			{ type: "load-value", value: 0.20 },
			{ type: "jump-if-less-than", jumpTo: "damage-3" },
			{ type: "load-variable", name: "ratio" },
			{ type: "load-value", value: 0.35 },
			{ type: "jump-if-less-than", jumpTo: "damage-4" },
			{ type: "load-variable", name: "ratio" },
			{ type: "load-value", value: 0.70 },
			{ type: "jump-if-less-than", jumpTo: "damage-5" },
			{ type: "jump", jumpTo: "damage-6" },

			{ type: "load-value", value: 200, label: "damage-1" },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 150, label: "damage-2" },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 100, label: "damage-3" },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 80, label: "damage-4" },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 40, label: "damage-5" },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 20, label: "damage-6" },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
		],
	},
	//Forces opponent to switch
	"Roar": {
		name: "Roar",
		type: "Normal",
		category: "Status",
		strategy: "special",
		tags: ["sound-based"],
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
			{ type: "end-turn" }
		],
	},
	//Removes an entire contiguous area of tiles
	"Rock Smash": {
		name: "Rock Smash",
		type: "Fighting",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		tags: [],
		pp: 15,
		power: 40,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			orange: 6,
			yellow: 4,
			green: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Rock Smash.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "is-active-pokemon-viable", target: "opponent" },
			{ type: "jump-if-truthy", jumpTo: "choose" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 1, label: "choose" },
			{ type: "choose-tiles", count: -1, target: "user" },
			{ type: "select-similar-tiles-surrounding", selection: -1 },
			{ type: "remove-tiles", selection: -1 },
		]
	},
	//Remove an entire column
	"Rock Throw": {
		name: "Rock Throw",
		type: "Rock",
		category: "Physical",
		strategy: "basic-damage",
		tags: [],
		pp: 15,
		power: 50,
		accuracy: 90,
		rechargeTurns: 1,
		energy: {
			red: 4,
			orange: 6,
		},
		sounds: {
			"attack": "src/audio/attacks/Rock Throw.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "is-active-pokemon-viable", target: "opponent" },
			{ type: "jump-if-truthy", jumpTo: "choose" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 1, label: "choose" },
			{ type: "choose-tiles", count: -1, target: "user" },
			{ type: "load-value", value: 0 },
			{ type: "get-element-from-list", list: -2, index: -1 },
			{ type: "get-tile-x", tile: -1 },
			{ type: "select-column", x: -1 },
			{ type: "remove-tiles", selection: -1 },
		]
	},
	//Converts to orange tiles orthogonally adjacent to random tiles
	"Rock Tomb": {
		name: "Rock Tomb",
		type: "Rock",
		category: "Physical",
		strategy: "basic-damage",
		pp: 15,
		power: 60,
		accuracy: 95,
		rechargeTurns: 3,
		energy: {
			orange: 6,
			blue: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Rock Tomb.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "load-value", value: 3 },
			{ type: "select-random-tiles", count: -1, conditions: { notTypes: ["orange"] } },
			{ type: "select-tiles-orthogonally-adjacent-to", selection: -1 },
			{ type: "change-tile-type", selection: "group", which: -1, targetType: "orange" },
		],
	},
	//Deals damage over multiple turns
	"Rollout": {
		name: "Rollout",
		type: "Rock",
		category: "Physical",
		strategy: "special",
		tags: ["damage-dealing", "makes-contact"],
		pp: 20,
		power: 30,
		accuracy: 90,
		rechargeTurns: 6,
		energy: {
			orange: 8,
			yellow: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Rollout.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack", label: "damage" },
			{ type: "damage" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "rollout-attacking",
				type: "disability",
				stacks: false,
				volatile: true,
				turns: 5,
				lostOnSwap: true,
				lostOnBatonPass: true,
				appliesTo: {
					name: "Rollout"
				},
			} },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "rollout-double-power",
				type: "power-alteration",
				stacks: true,
				lostOnSwap: true,
				lostOnBatonPass: true,
				appliesTo: {
					names: ["Rollout"]
				},
				modification: {
					change: 1.5,
					operation: "multiply"
				}
			} },
			{ type: "end-turn" },
		],
		onTurnStart: [
			{ type: "is-trainers-turn", target: "user" },
			{ type: "load-value", value: false },
			{ type: "jump-if-equal", jumpTo: Infinity},

			{ type: "get-status-stacks", target: "user", statusName: "rollout-attacking" },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-greater-than-or-equal-to", jumpTo: "damage" },
			{ type: "remove-status-effect", target: "user", statusName: "rollout-double-power" },
			{ type: "jump", jumpTo: Infinity },

			{ type: "play-sound", name: "attack", label: "damage" },
			{ type: "damage" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "rollout-double-power",
				type: "power-alteration",
				stacks: true,
				lostOnSwap: true,
				lostOnBatonPass: true,
				appliesTo: {
					names: ["Rollout"]
				},
				modification: {
					change: 1.5,
					operation: "multiply"
				}
			} },
		]
	},
	//Heal half your HP back
	"Roost": {
		name: "Roost",
		type: "Flying",
		category: "Status",
		strategy: "buff-user",
		tags: ["healing"],
		pp: 5,
		power: null,
		accuracy: null,
		rechargeTurns: 10,
		energy: {
			green: 12,
			blue: 12
		},
		sounds: {
			"attack": "src/audio/attacks/Roost part 1.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-max-hp", target: "user" },
			{ type: "load-value", value: 0.5 },
			{ type: "multiply-numbers", round: "up" },
			{ type: "heal", target: "user", amount: -1 },
		],
	},
	//Permanently increases the power of all Round moves from either trainer
	"Round": {
		name: "Round",
		type: "Normal",
		category: "Special",
		strategy: "basic-damage",
		tags: ["damage-dealing", "sound-based"],
		pp: 15,
		power: 60,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			yellow: 6,
			purple: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Round.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "remove-status-effect", target: "user", statusName: "round-resonated" },
			{ type: "load-value", value: "Round" },
			{ type: "get-total-move-uses", moveName: -1 },
			{ type: "load-value", value: 10 },
			{ type: "multiply-numbers" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "round-resonated",
				type: "power-alteration",
				stacks: false,
				volatile: true,
				lostOnSwap: true,
				lostOnBatonPass: true,
				appliesTo: {
					name: "Round"
				},
				modification: {
					change: 0,
					operation: "add"
				}
			}, statusSettings: [
				{
					path: ["modification"],
					key: "change",
					value: -1
				}
			] },
		],
		onTurnStart: [
			{ type: "remove-status-effect", target: "user", statusName: "round-resonated" },
			{ type: "get-total-move-uses", moveName: "Round" },
			{ type: "load-value", value: 10 },
			{ type: "multiply-numbers" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "round-resonated",
				type: "power-alteration",
				stacks: false,
				volatile: true,
				lostOnSwap: true,
				lostOnBatonPass: true,
				appliesTo: {
					name: "Round"
				},
				modification: {
					change: 0,
					operation: "add"
				}
			}, statusSettings: [
				{
					path: ["modification"],
					key: "change",
					value: -1
				}
			] },
		]
	},
	//Can't get statuses from opponents for 5 turns
	"Safeguard": {
		name: "Safeguard",
		type: "Psychic",
		category: "Status",
		strategy: "buff-user",
		pp: 25,
		power: null,
		accuracy: null,
		rechargeTurns: 7,
		energy: {
			blue: 3,
			purple: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Safeguard.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", statusEffect: "safeguard", target: "user" },
		],
	},
	//Gives Energy Down to a diamond area of tiles
	"Sand Attack": {
		name: "Sand Attack",
		type: "Ground",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 15,
		power: null,
		accuracy: 100,
		rechargeTurns: 5,
		energy: {
			orange: 4,
			green: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Sand Attack.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "load-value", value: 1 },
			{ type: "select-random-tiles", count: -1 },
			{ type: "load-value", value: 0 },
			{ type: "get-element-from-list", list: -2, index: -1 },
			{ type: "get-tile-x", tile: -1 },
			{ type: "get-tile-y", tile: -2 },
			{ type: "load-value", value: 2 },
			{ 
				type: "select-tiles-with-expression",
				conditionExpression: "((x - %c%)^2 + (y - %c%)^2)^0.5 <= %c%",
				conditionArguments: [-3, -2, -1]
			},
			{
				type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Energy Down", type: "debuff", duration: null }
			},
		],
	},
	//Lowers enemy speed 2
	"Scary Face": {
		name: "Scary Face",
		type: "Normal",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 10,
		power: null,
		accuracy: 100,
		rechargeTurns: 5,
		energy: {
			blue: 2,
			purple: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Scary Face.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", target: "opponent", debuff: {
					type: "stat",
					stat: "speed",
					class: "debuff",
					amount: -2
				}
			}
		],
	},
	//Basic damage and end turn
	"Scratch": {
		name: "Scratch",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 35,
		power: 40,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			yellow: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Scratch.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "end-turn" }
		],
	},
	//Lowers their defense 2
	"Screech": {
		name: "Screech",
		type: "Normal",
		category: "Status",
		strategy: "debuff-opponent",
		tags: ["sound-based"],
		pp: 40,
		power: null,
		accuracy: 85,
		rechargeTurns: 5,
		energy: {
			blue: 3,
			purple: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Screech.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", target: "opponent", debuff: {
					type: "stat",
					stat: "defense",
					class: "buff",
					amount: -2
				}
			}
		],
	},
	//Deals damage exactly equal to user's level
	"Seismic Toss": {
		name: "Seismic Toss",
		type: "Fighting",
		category: "Physical",
		strategy: "special",
		tags: ["damage-dealing", "makes-contact"],
		pp: 20,
		power: null,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			orange: 5,
			green: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Seismic Toss.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-level", target: "user" },
			{ type: "damage", amount: -1, fixed: true, finalImmunityCheck: true },
		],
	},
	//Damages a non-active pokemon
	"Shadow Ball": {
		name: "Shadow Ball",
		type: "Ghost",
		category: "Special",
		strategy: "basic-damage",
		pp: 15,
		power: 80,
		accuracy: 100,
		rechargeTurns: 2,
		energy: {
			purple: 15,
			red: 5,
			yellow: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Shadow Ball.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "get-viable-pokemon", target: "opponent" },
			{ type: "get-active-pokemon", target: "opponent" },
			{ type: "remove-element-from-list", list: -2, element: -1 },
			{ type: "get-list-length", list: -1 },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "choose-pokemon", target: "user", message: "choose-pokemon", pokemon: -4, strategy: "damage" },
			{ type: "load-value", value: 0 },
			{ type: "get-element-from-list", list: -2, index: -1 },
			{ type: "load-value", value: -30 },
			{ type: "damage", toPokemon: -2, additivePower: -1 }
		]
	},
	//Deals more damage if you have a different number of pokemon remaining
	"Shadow Sneak": {
		name: "Shadow Sneak",
		type: "Ghost",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
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
	//Puts the opponent to sleep
	"Sing": {
		name: "Sing",
		type: "Normal",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 15,
		power: null,
		accuracy: 55,
		rechargeTurns: 10,
		energy: {
			blue: 3,
			purple: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Sing part 1.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", statusEffect: "asleep", target: "opponent" },
		],
	},
	//Permanently learn the last move used
	"Sketch": {
		name: "Sketch",
		type: "Normal",
		category: "Status",
		strategy: "special",
		pp: 1,
		power: null,
		accuracy: null,
		rechargeTurns: 1,
		energy: {
			red: 3,
			orange: 3,
			yellow: 3,
			green: 3,
			blue: 3,
			purple: 3,
		},
		sounds: {
			"attack": "src/audio/attacks/Sketch part 1.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-last-move", target: "opponent" },
			{ type: "jump-if-truthy", jumpTo: "use-move" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "get-move", moveName: "Sketch", label: "use-move" },
			{ type: "unlearn-move", move: -1 },
			{ type: "get-last-move", target: "opponent" },
			{ type: "learn-move", move: -1 },
		],
		highlightOnHover: {
			type: "last-enemy-move"
		}
	},
	//Increases its own cost with each use
	"Slam": {
		name: "Slam",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 20,
		power: 80,
		accuracy: 75,
		rechargeTurns: 1,
		energy: {
			red: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Slam.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "slam-cost-alteration",
				type: "cost-alteration",
				stacks: true,
				volatile: true,
				appliesTo: {
					name: "Slam"
				},
				energyCost: {
					orange: 2
				}
			} },
		],
	},
	//Places infectious status effects on the board that eventually cause sleep
	"Sleep Powder": {
		name: "Sleep Powder",
		type: "Grass",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 15,
		power: null,
		accuracy: 75,
		rechargeTurns: 5,
		energy: {
			orange: 4,
			green: 4,
			blue: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Sleep Powder part 1.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "load-value", value: 5 },
			{ type: "select-random-tiles", count: -1 },
			{ type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Sleep Powder", type: "debuff", duration: 5 }
			}
		],
	},
	//Shifts the board down
	"Smack Down": {
		name: "Smack Down",
		type: "Rock",
		category: "Physical",
		strategy: "basic-damage",
		pp: 15,
		power: 50,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			orange: 6,
			yellow: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Smack Down.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "load-value", value: 2 },
			{ type: "load-value", value: 0 },
			{ type: "select-all-tiles" },
			{ type: "shift-tiles", selection: -1, xOffset: -2, yOffset: -3 },
			
			{ type: "apply-status-effect", target: "opponent", statusEffect: {
				name: "foresight-vulnerability",
				type: "type-vulnerability",
				stacks: false,
				volatile: true,
				appliesTo: {
					types: ["Ground"]
				},
			} },
		]
	},
	//Deals damage and might poison
	"Smog": {
		name: "Smog",
		type: "Poison",
		category: "Special",
		strategy: "basic-damage",
		pp: 20,
		power: 30,
		accuracy: 70,
		rechargeTurns: 1,
		energy: {
			purple: 7,
			blue: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Smog.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 5 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "apply-status-effect", statusEffect: "poisoned", target: "opponent" },
		],
	},
	//Paralyzes and deals more damage to paralyzed enemies
	"Spark": {
		name: "Spark",
		type: "Electric",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 20,
		power: 65,
		accuracy: 100,
		rechargeTurns: 3,
		energy: {
			yellow: 7,
			red: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Spark.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-status-stacks", statusName: "paralyzed" },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-less-than", jumpTo: "small-damage" },
			{ type: "load-value", value: 20 },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "damage", label: "small-damage" },
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 6 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "apply-status-effect", statusEffect: "paralyzed", target: "opponent" },
		],
	},
	//Spends all your "stockpile" stacks for damage
	"Spit Up": {
		name: "Spit Up",
		type: "Normal",
		category: "Special",
		strategy: "special",
		tags: ["damage-dealing"],
		pp: 10,
		power: 0,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			yellow: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Spit Up.mp3"
		},
		effects: [
			{ type: "get-status-stacks", statusName: "stockpile" },
			{ type: "save-variable", name: "stacks", save: -1 },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-less-than", jumpTo: Infinity },

			{ type: "remove-status-effect", target: "user", statusName: "stockpile" },
			{ type: "play-sound", name: "attack" },
			{ type: "load-variable", name: "stacks" },
			{ type: "load-value", value: 100 },
			{ type: "multiply-numbers" },
			{ type: "damage", additivePower: -1 },
		]
	},
	//Doubles the opponent's move costs for a while
	"Spite": {
		name: "Spite",
		type: "Ghost",
		category: "Status",
		strategy: "special",
		pp: 10,
		power: null,
		accuracy: 100,
		rechargeTurns: 10,
		energy: {
			green: 4,
			red: 4,
			purple: 8
		},
		sounds: {
			"attack": "src/audio/attacks/Spite.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", target: "opponent", statusEffect: {
				name: "spite-cost-reduction",
				type: "cost-alteration",
				stacks: false,
				volatile: true,
				appliesTo: {
					logic: "not",
				},
				turns: 7,
				numberOfApplications: 3,
				modification: {
					change: 2,
					operation: "multiply"
				},
				energyCost: {}
			} },
		],
	},
	//Makes a single random tile blue
	"Splash": {
		name: "Splash",
		type: "Grass",
		category: "Status",
		strategy: "special",
		pp: 40,
		power: null,
		accuracy: null,
		rechargeTurns: 1,
		energy: {},
		sounds: {
			"attack": "src/audio/attacks/Splash.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 10 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "load-value", value: 1 },
			{ type: "select-random-tiles", count: -1, conditions: { notTypes: ["blue"] } },
			{ type: "change-tile-type", selection: "group", which: -1, targetType: "blue" },
		]
	},
	//Gives the opponent Splinters
	"Stealth Rock": {
		name: "Stealth Rock",
		type: "Rock",
		category: "Physical",
		strategy: "basic-damage",
		pp: 20,
		power: 40,
		accuracy: 100,
		rechargeTurns: 2,
		energy: {
			orange: 8,
			yellow: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Stealth Rock.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "apply-status-effect", statusEffect: "splinters", target: "opponent" }
		]
	},
	//Gives the user a stack of "stockpile"
	"Stockpile": {
		name: "Stockpile",
		type: "Normal",
		category: "Status",
		strategy: "special",
		tags: [],
		pp: 20,
		power: null,
		accuracy: null,
		rechargeTurns: 3,
		energy: {
			green: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Stockpile.mp3"
		},
		effects: [
			{ type: "get-status-stacks", statusName: "stockpile" },
			{ type: "load-value", value: 3 },
			{ type: "jump-if-less-than", jumpTo: "stockpile" },
			{ type: "jump", jumpTo: Infinity },

			{ type: "play-sound", name: "attack", label: "stockpile" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "stockpile",
				type: "hidden",
				stacks: true,
				volatile: true
			} },
			
			{
				type: "apply-debuff", target: "user", debuff: {
					type: "stat",
					stat: "defense",
					class: "buff",
					amount: 1
				}
			},
			{
				type: "apply-debuff", target: "user", debuff: {
					type: "stat",
					stat: "specialDefense",
					class: "buff",
					amount: 1
				}
			},
		],
	},
	//Removes a random chunk of the board
	"Stomp": {
		name: "Stomp",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 20,
		power: 65,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			red: 4,
			orange: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Stomp.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "load-value", value: 1 },
			{ type: "select-random-tiles", count: -1 },
			{ type: "load-value", value: 3 },
			{ type: "load-value", value: 3 },
			{ type: "expand-tile-selection", selection: -3, width: -2, height: -1 },
			{ type: "remove-tiles", selection: -1 }
		]
	},
	//Shifts three columns upwards
	"Strength": {
		name: "Strength",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 15,
		power: 80,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			orange: 8,
			red: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Strength.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "is-active-pokemon-viable", target: "opponent" },
			{ type: "jump-if-truthy", jumpTo: "grip" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 1 },
			{ type: "choose-tiles", count: -1, target: "user" },
			{ type: "load-value", value: 0 },
			{ type: "get-element-from-list", list: -2, index: -1 },
			{ type: "get-tile-x", tile: -1 },
			{ type: "save-variable", name: "x", save: -1 },
			{ type: "select-column", x: -1 },
			{ type: "save-variable", name: "selection1", save: -1 },
			{ type: "log-value" },
			{ type: "load-variable", name: "x" },
			{ type: "load-value", value: 1 },
			{ type: "add-numbers" },
			{ type: "select-column", x: -1 },
			{ type: "save-variable", name: "selection2", save: -1 },
			{ type: "load-variable", name: "x" },
			{ type: "load-value", value: -1 },
			{ type: "add-numbers" },
			{ type: "select-column", x: -1 },
			{ type: "save-variable", name: "selection3", save: -1 },
			
			{ type: "load-variable", name: "selection1" },
			{ type: "load-variable", name: "selection2" },
			{ type: "combine-selections", selection1: -1, selection2: -2 },
			{ type: "load-variable", name: "selection3" },
			{ type: "combine-selections", selection1: -1, selection2: -2 },

			{ type: "load-value", value: -4 },
			{ type: "load-value", value: 0 },
			{ type: "shift-tiles", selection: -3, xOffset: -1, yOffset: -2 },
		]
	},
	//Debuffs enemy attack, and heals HP equal to their old attack
	"Strength Sap": {
		name: "Strength Sap",
		type: "Grass",
		category: "Status",
		strategy: "debuff-opponent",
		tags: ["healing"],
		pp: 10,
		power: null,
		accuracy: 100,
		rechargeTurns: 3,
		energy: {
			red: 3,
			green: 5,
			purple: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Absorb part 1.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-stat", which: "attack", target: "opponent" },
			{ type: "save-variable", name: "attack", save: -1 },
			{
				type: "apply-debuff", target: "opponent", debuff: {
					type: "stat",
					class: "debuff",
					stat: "attack",
					amount: -1
				}
			},
			{ type: "load-variable", name: "attack" },
			{ type: "heal", target: "user", amount: -1 },
		],
	},
	//Lowers opponent's speed 2
	"String Shot": {
		name: "String Shot",
		type: "Bug",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 40,
		power: null,
		accuracy: 95,
		rechargeTurns: 7,
		energy: {
			green: 4,
			blue: 8
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
					class: "debuff",
					amount: -2
				}
			}
		],
	},
	//Shuffles the board and ends the turn
	"Struggle": {
		name: "Struggle",
		type: "Typeless",
		category: "Physical",
		strategy: "last-priority",
		tags: ["damage-dealing", "makes-contact"],
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
			{ type: "get-max-hp", target: "user" },
			{ type: "load-value", value: 0.25 },
			{ type: "multiply-numbers", round: "up" },
			{ type: "recoil-damage", amount: -1, fixed: true },
			{ type: "shuffle-board" },
			{ type: "end-turn" }
		],
	},
	//Swaps random tiles in random directions
	"Struggle Bug": {
		name: "Struggle Bug",
		type: "Bug",
		category: "Special",
		strategy: "basic-damage",
		pp: 20,
		power: 50,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			green: 6,
			yellow: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Struggle Bug.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{
				type: "apply-debuff", target: "opponent", debuff: {
					type: "stat",
					stat: "specialAttack",
					class: "debuff",
					amount: -1
				}
			},
			{ type: "load-value", value: 3 },
			{ type: "select-random-tiles", count: -1, conditions: { types: ["green"] } },
			{ type: "move-tiles-in-random-directions", selection: -1 },
		]
	},
	//Places infectious status effects on the board that eventually paralyze
	"Stun Spore": {
		name: "Stun Spore",
		type: "Grass",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 30,
		power: null,
		accuracy: 75,
		rechargeTurns: 5,
		energy: {
			yellow: 4,
			green: 4,
			blue: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Stun Spore.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "load-value", value: 5 },
			{ type: "select-random-tiles", count: -1 },
			{ type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Stun Spore", type: "debuff", duration: 5 }
			}
		],
	},
	//Deals damage to the opponent as they activate a move
	"Sucker Punch": {
		name: "Sucker Punch",
		type: "Dark",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 5,
		power: 70,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			orange: 2,
			purple: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Sucker Punch.mp3"
		},
		effects: [
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "sucker-punch-using-sucker-punch",
				type: "disability",
				stacks: false,
				volatile: true,
				lostOnSwap: true,
				lostOnBatonPass: true,
				turns: 1,
				appliesTo: {
					name: "Sucker Punch"
				},
			} },
		],
		onOpponentUseMove: [
			{ type: "get-status-stacks", statusName: "sucker-punch-using-sucker-punch" },
			{ type: "jump-if-truthy", jumpTo: "sucker-punch-check" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "get-move-category", oldMove: true, label: "sucker-punch-check" },
			{ type: "save-variable", name: "category", save: -1 },
			{ type: "load-value", value: "Physical" },
			{ type: "jump-if-equal", jumpTo: "deal-damage" },
			{ type: "load-variable", name: "category" },
			{ type: "load-value", value: "Special" },
			{ type: "jump-if-equal", jumpTo: "deal-damage" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "play-sound", name: "attack", label: "deal-damage" },
			{ type: "damage" },
		]
	},
	//Deals damage equal to 50% of the enemy's HP
	"Super Fang": {
		name: "Super Fang",
		type: "Normal",
		category: "Physical",
		strategy: "special",
		tags: ["damage-dealing", "makes-contact"],
		pp: 10,
		power: null,
		accuracy: 90,
		rechargeTurns: 2,
		energy: {
			orange: 10,
			purple: 10
		},
		sounds: {
			"attack": "src/audio/attacks/Super Fang.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-hp", target: "opponent" },
			{ type: "load-value", value: 0.5 },
			{ type: "multiply-numbers", round: "up" },
			{ type: "damage", amount: -1, fixed: true },
		],
	},
	//Confuses the opponent
	"Supersonic": {
		name: "Supersonic",
		type: "Normal",
		category: "Status",
		strategy: "debuff-opponent",
		tags: ["sound-based"],
		pp: 20,
		power: null,
		accuracy: 55,
		rechargeTurns: 5,
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
	//Confuses the opponent but also buffs them
	"Swagger": {
		name: "Swagger",
		type: "Normal",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 15,
		power: null,
		accuracy: 85,
		rechargeTurns: 5,
		energy: {
			red: 3,
			yellow: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Swagger.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", statusEffect: "confused", target: "opponent" },
			{
				type: "apply-debuff", target: "opponent", debuff: {
					type: "stat",
					stat: "attack",
					class: "buff",
					amount: 1
				}
			}
		]
	},
	//Spends all your "stockpile" stacks for healing
	"Swallow": {
		name: "Swallow",
		type: "Normal",
		category: "Status",
		strategy: "special",
		tags: ["healing"],
		pp: 10,
		power: null,
		accuracy: null,
		rechargeTurns: 5,
		energy: {
			blue: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Swallow part 1.mp3"
		},
		effects: [
			{ type: "get-status-stacks", statusName: "stockpile" },
			{ type: "save-variable", name: "stacks", save: -1 },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-less-than", jumpTo: Infinity },

			{ type: "remove-status-effect", target: "user", statusName: "stockpile" },
			{ type: "load-variable", name: "stacks" },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-equal", jumpTo: "heal-1" },
			{ type: "load-variable", name: "stacks" },
			{ type: "load-value", value: 2 },
			{ type: "jump-if-equal", jumpTo: "heal-2" },
			{ type: "jump", jumpTo: "heal-3" },

			{ type: "play-sound", name: "attack", label: "heal-1" },
			{ type: "get-max-hp", target: "user" },
			{ type: "load-value", value: 0.25 },
			{ type: "multiply-numbers", round: "up" },
			{ type: "heal", target: "user", amount: -1 },

			{ type: "play-sound", name: "attack", label: "heal-2" },
			{ type: "get-max-hp", target: "user" },
			{ type: "load-value", value: 0.5 },
			{ type: "multiply-numbers", round: "up" },
			{ type: "heal", target: "user", amount: -1 },

			{ type: "play-sound", name: "attack", label: "heal-3" },
			{ type: "get-max-hp", target: "user" },
			{ type: "heal", target: "user", amount: -1 },
		]
	},
	//Confuses the opponent AND shuffles the board
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
			{ type: "shuffle-board" }
		],
	},
	//Increases the enemy's move costs
	"Sweet Scent": {
		name: "Sweet Scent",
		type: "Normal",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 20,
		power: null,
		accuracy: null,
		rechargeTurns: 3,
		energy: {
			green: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Sweet Scent.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-types", target: "user" },
			{ type: "apply-status-effect", target: "opponent", statusEffect: {
				name: "sweet-scent-cost-alteration",
				type: "cost-alteration",
				stacks: true,
				volatile: true,
				numberOfApplications: 1,
				appliesTo: {
					logic: "not"
				},
				energyCost: {
					greatestColor: 3
				}
			} },
		],
	},
	//Multi-use attack
	"Swift": {
		name: "Swift",
		type: "Normal",
		category: "Special",
		strategy: "basic-damage",
		pp: 20,
		power: 60,
		accuracy: null,
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
	//Swaps your most full energy with your opponent's
	"Switcheroo": {
		name: "Switcheroo",
		type: "Dark",
		category: "Status",
		strategy: "special",
		tags: [],
		pp: 10,
		power: null,
		accuracy: 100,
		rechargeTurns: 5,
		energy: {
			blue: 4,
			orange: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Switcheroo.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },

			{ type: "load-value", value: 1 },
			{ type: "select-energy-colors", search: "most-full", target: "opponent", count: -1 },
			{ type: "get-energy-values", target: "opponent", colors: -1 },
			{ type: "save-variable", name: "opponent-energy", save: -1 },
			{ type: "load-value", value: -1 },
			{ type: "multiply-energy", amounts: -2, scale: -1 },
			{ type: "gain-energy", amounts: -1, target: "opponent" },

			{ type: "load-value", value: 1 },
			{ type: "select-energy-colors", search: "most-full", target: "user", count: -1 },
			{ type: "get-energy-values", target: "user", colors: -1 },
			{ type: "save-variable", name: "user-energy", save: -1 },
			{ type: "load-value", value: -1 },
			{ type: "multiply-energy", amounts: -2, scale: -1 },
			{ type: "gain-energy", amounts: -1, target: "user" },
			{ type: "log-value", value: -1 },
			
			{ type: "load-variable", name: "opponent-energy" },
			{ type: "gain-energy", amounts: -1, target: "user" },
			{ type: "load-variable", name: "user-energy" },
			{ type: "gain-energy", amounts: -1, target: "opponent" },

			// { type: "load-value", value: 2 },
			// { type: "choose-tiles", count: -1, target: "user" },
			// { type: "swap-tiles", selection: -1 },
		]
	},
	//Raises your attack 2
	"Swords Dance": {
		name: "Swords Dance",
		type: "Normal",
		category: "Status",
		strategy: "buff-user",
		tags: ["dancing"],
		pp: 20,
		power: null,
		accuracy: 100,
		rechargeTurns: 3,
		energy: {
			red: 8,
			yellow: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Swords Dance.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", target: "user", debuff: {
					type: "stat",
					stat: "attack",
					class: "debuff",
					amount: 2
				}
			}
		],
	},
	//Heals you whenever you make a green 4-match
	"Synthesis": {
		name: "Synthesis",
		type: "Grass",
		category: "Status",
		strategy: "buff-user",
		tags: ["healing"],
		pp: 5,
		power: null,
		accuracy: null,
		rechargeTurns: 1,
		energy: {
			green: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Synthesis part 1.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "load-value", value: 3 },
			{ type: "select-random-tiles", count: -1, conditions: { notTypes: ["green"] } },
			{ type: "change-tile-type", selection: "group", which: -1, targetType: "green" },
		],
		onFourMatchGreen: [
			{ type: "get-max-hp", target: "user" },
			{ type: "load-value", value: 0.25 },
			{ type: "multiply-numbers", round: "up" },
			{ type: "heal", target: "user", amount: -1 },
		]
	},
	//Just damage
	"Tackle": {
		name: "Tackle",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
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
	//Decreases enemy defense 1
	"Tail Whip": {
		name: "Tail Whip",
		type: "Normal",
		category: "Status",
		strategy: "debuff-opponent",
		pp: 30,
		power: null,
		accuracy: 100,
		rechargeTurns: 7,
		energy: {
			purple: 6
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
					class: "debuff",
					amount: -1
				}
			}
		],
	},
	//Doubles your speed for 4 turns
	"Tailwind": {
		name: "Tailwind",
		type: "Flying",
		category: "Status",
		strategy: "buff-user",
		pp: 15,
		power: null,
		accuracy: null,
		rechargeTurns: 6,
		energy: {
			yellow: 6,
			red: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Tailwind.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", target: "user", statusEffect: {
				name: "tailwind-sped-up",
				type: "stat-alteration",
				stacks: true,
				volatile: true,
				turns: 4,
				stat: "speed",
				modification: {
					change: 2,
					operation: "multiply"
				}
			} },
		],
	},
	//Deals big damage but has recoil
	"Take Down": {
		name: "Take Down",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 20,
		power: 90,
		rechargeTurns: 1,
		energy: {
			red: 4,
			blue: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Take Down.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "load-value", value: 0.25 },
			{ type: "multiply-numbers", round: "up" },
			{ type: "recoil-damage", amount: -1, fixed: true }
		],
	},
	//Disables Status moves
	"Taunt": {
		name: "Taunt",
		type: "Dark",
		category: "Status",
		strategy: "special",
		tags: [],
		pp: 20,
		power: null,
		accuracy: 100,
		rechargeTurns: 5,
		energy: {
			red: 4,
			blue: 4,
			purple: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Taunt.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", target: "opponent", statusEffect: {
				name: "taunt-taunted",
				type: "disability",
				stacks: false,
				volatile: true,
				lostOnSwap: true,
				lostOnBatonPass: true,
				turns: 8,
				appliesTo: {
					category: "Status"
				},
			} },
		],
	},
	//Confuses the opponent and moves their energy around
	"Teeter Dance": {
		name: "Teeter Dance",
		type: "Normal",
		category: "Status",
		strategy: "debuff-opponent",
		tags: ["dancing"],
		pp: 20,
		power: null,
		accuracy: 100,
		rechargeTurns: 4,
		energy: {
			red: 2,
			yellow: 2,
			blue: 2,
		},
		sounds: {
			"attack": "src/audio/attacks/Teeter Dance part 1.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", statusEffect: "confused", target: "opponent" },
			{ type: "load-value", value: 1 },
			{ type: "shift-energy", shift: -1, target: "opponent" },
			{ type: "load-value", value: -1 },
			{ type: "shift-energy", shift: -1, target: "user" },
		],
	},
	//Switch out without ending the turn
	"Teleport": {
		name: "Teleport",
		type: "Psychic",
		category: "Status",
		strategy: "special",
		pp: 20,
		power: null,
		accuracy: null,
		rechargeTurns: 5,
		energy: {
			purple: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Teleport.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-viable-pokemon", target: "user" },
			{ type: "get-active-pokemon", target: "user" },
			{ type: "remove-element-from-list", list: -2, element: -1 },
			{ type: "get-list-length", list: -1 },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "choose-pokemon", target: "user", message: "choose-pokemon", pokemon: -4, strategy: "swap" },
			{ type: "load-value", value: 0 },
			{ type: "get-element-from-list", list: -2, index: -1 },
			{ type: "swap-pokemon", target: "user", pokemon: -1, keepEnergy: true }
		],
	},
	//Paralyzes but deals extra damage if they're already paralyzed
	"Thunder Fang": {
		name: "Thunder Fang",
		type: "Electric",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact", "biting"],
		pp: 15,
		power: 65,
		accuracy: 100,
		rechargeTurns: 2,
		energy: {
			yellow: 7,
			green: 5
		},
		sounds: {
			"attack": "src/audio/attacks/Thunder Fang.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-status-stacks", statusName: "paralyzed" },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-less-than", jumpTo: "small-damage" },
			{ type: "load-value", value: 20 },
			{ type: "damage", additivePower: -1 },
			{ type: "jump", jumpTo: Infinity },
			{ type: "damage", label: "small-damage" },
			// { type: "random-number", min: 1, max: 10 },
			// { type: "load-value", value: 6 },
			// { type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "apply-status-effect", statusEffect: "paralyzed", target: "opponent" },
		],
	},
	//Give static to random tiles
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
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "random-number", min: 1, max: 10 },
			{ type: "load-value", value: 6 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "load-value", value: 2 },
			{ type: "select-random-tiles", count: -1 },
			{
				type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Static", type: "buff", duration: null }
			}
		]
	},
	//Give Static to a whole column
	"Thunder Wave": {
		name: "Thunder Wave",
		type: "Electric",
		category: "Status",
		strategy: "buff-user",
		pp: 20,
		power: null,
		accuracy: 90,
		rechargeTurns: 1,
		energy: {
			yellow: 8
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
			// 	type: "select-tiles-with-expression",
			// 	conditionExpression: "x == %c%",
			// 	conditionArguments: [-1]
			// },
			{
				type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Static", type: "buff", duration: null }
			}
		],
	},
	//Prevents the opponent using the same move twice in a row
	"Torment": {
		name: "Torment",
		type: "Dark",
		category: "Status",
		strategy: "debuff-opponent",
		tags: [],
		pp: 15,
		power: null,
		accuracy: 100,
		rechargeTurns: 5,
		energy: {
			purple: 3,
			red: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Torment.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", statusEffect: "tormented", target: "opponent" }
		],
	},
	//Basic damage
	"Vine Whip": {
		name: "Vine Whip",
		type: "Grass",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 25,
		power: 45,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			green: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Vine Whip.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
		],
	},
	//Locks a tile
	"Vise Grip": {
		name: "Vise Grip",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 30,
		power: 55,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			green: 5,
			yellow: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Vise Grip.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "is-active-pokemon-viable", target: "opponent" },
			{ type: "jump-if-truthy", jumpTo: "grip" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "load-value", value: 1, label: "grip" },
			{ type: "choose-tiles", count: -1, target: "user" },
			{
				type: "apply-status-to-tiles", selection: "group", which: -1,
				status: { name: "Locked", type: "debuff", duration: 10 }
			}
		]
	},
	//Deals damage with more power the more Water tiles exist
	"Water Gun": {
		name: "Water Gun",
		type: "Water",
		category: "Special",
		strategy: "basic-damage",
		tags: [],
		pp: 25,
		power: 35, //originally 40
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			blue: 8
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
	//Deals damage and confuses with a chance based on Water tile count
	"Water Pulse": {
		name: "Water Pulse",
		type: "Water",
		category: "Special",
		strategy: "basic-damage",
		pp: 20,
		power: 60,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			blue: 10
		},
		sounds: {
			"attack": "src/audio/attacks/Water Pulse.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "count-tiles", options: { type: "blue" } },
			{ type: "load-value", value: 5 },
			{ type: "multiply-numbers" },
			{ type: "random-number", min: 0, max: 100 },
			{ type: "jump-if-less-than", test: -1, against: -2, jumpTo: "confused" },
			{ type: "jump", jumpTo: Infinity },
			{ type: "apply-status-effect", statusEffect: "confused", target: "opponent", label: "confused" }
		],
	},
	//Forces the opponent to switch to a random pokemon
	"Whirlwind": {
		name: "Whirlwind",
		type: "Normal",
		category: "Status",
		strategy: "special",
		tags: [],
		pp: 20,
		power: null,
		accuracy: null,
		rechargeTurns: 5,
		energy: {
			yellow: 4,
			green: 5,
			blue: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Whirlwind.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "get-viable-pokemon", target: "opponent" },
			{ type: "get-active-pokemon", target: "opponent" },
			{ type: "remove-element-from-list", list: -2, element: -1 },
			{ type: "get-list-length", list: -1 },
			{ type: "load-value", value: 1 },
			{ type: "jump-if-less-than", jumpTo: Infinity },
			{ type: "random-choice-from-list", list: -4 },
			{ type: "swap-pokemon", target: "opponent", pokemon: -1 },
			{ type: "end-turn" }
		],
	},
	//Removes a group of tiles along a diagonal
	"Wing Attack": {
		name: "Wing Attack",
		type: "Flying",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
		pp: 35,
		power: 60,
		accuracy: 100,
		rechargeTurns: 1,
		energy: {
			blue: 12,
			yellow: 4
		},
		sounds: {
			"attack": "src/audio/attacks/Wing Attack.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "trigger", key: "additionalEffects" },
		],
		additionalEffects: [
			{ type: "random-number", min: -45, max: 45 },
			{ 
				type: "select-tiles-with-expression",
				conditionExpression: "abs((tan(%c% deg) * x) - y + ((h*0.5) - (tan(%c% deg) * (w*0.5))))/sqrt(tan(%c% deg)^2 + 1) <= 0.5",
				conditionArguments: [-1, -1, -1]
			},
			{ type: "remove-tiles", selection: -1 }
		]
	},
	//Ups Atk 1 & SpAtk 1 then empower some orange tiles
	"Work Up": {
		name: "Work Up",
		type: "Normal",
		category: "Status",
		strategy: "buff-user",
		pp: 30,
		power: null,
		accuracy: null,
		rechargeTurns: 5,
		energy: {
			orange: 6,
			red: 6
		},
		sounds: {
			"attack": "src/audio/attacks/Work Up.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{
				type: "apply-debuff", target: "user", debuff: {
					type: "stat",
					stat: "attack",
					class: "buff",
					amount: 1
				}
			},
			{
				type: "apply-debuff", target: "user", debuff: {
					type: "stat",
					stat: "specialAttack",
					class: "buff",
					amount: 1
				}
			},
			{ type: "load-value", value: 3 },
			{ type: "select-random-tiles", count: -1, conditions: { types: ["orange"] } },
			{ type: "empower-tiles", selection: -1 },
		]
	},
	//Place tiles on the board that deal damage when matched
	"Wrap": {
		name: "Wrap",
		type: "Normal",
		category: "Physical",
		strategy: "basic-damage",
		tags: ["damage-dealing", "makes-contact"],
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
	//Gives Drowsy
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
			blue: 5,
			purple: 3
		},
		sounds: {
			"attack": "src/audio/attacks/Yawn.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "apply-status-effect", statusEffect: "drowsy", target: "opponent" }
		],
	},

	"Breakneck Blitz": {
		name: "Breakneck Blitz",
		type: "Normal",
		category: "Physical",
		inheritCategory: true,
		strategy: "basic-damage",
		tags: ["z-move", "damage-dealing", "goes-through-protect"],
		pp: null,
		power: 100,
		powerBasedOnParent: {
			"Barrage": 100,
			"Bide": 100,
			"Bind": 100,
			"Body Slam": 160,
			"Boomburst": 200,
			"Chip Away": 140,
			"Comet Punch": 100,
			"Constrict": 100,
			"Covet": 120,
			"Crush Claw": 140,
			"Crush Grip": 190,
			"Cut": 100,
			"Dizzy Punch": 140,
			"Double Hit": 140,
			"Double Slap": 100,
			"Double-Edge": 190,
			"Echoed Voice": 100,
			"Egg Bomb": 180,
			"Endeavor": 160,
			"Explosion": 200,
			"Extreme Speed": 160,
			"Facade": 140,
			"Fake Out": 100,
			"False Swipe": 100,
			"Feint": 100,
			"Flail": 160,
			"Frustration": 160,
			"Fury Attack": 100,
			"Fury Swipes": 100,
			"Giga Impact": 200,
			"Guillotine": 180,
			"Head Charge": 190,
			"Headbutt": 140,
			"Hidden Power": 120,
			"Hold Back": 100,
			"Horn Attack": 120,
			"Horn Drill": 180,
			"Hyper Beam": 200,
			"Hyper Fang": 160,
			"Hyper Voice": 175,
			"Judgment": 180,
			"Last Resort": 200,
			"Mega Kick": 190,
			"Mega Punch": 160,
			"Multi-Attack": 185,
			"Natural Gift": 160,
			"Pay Day": 100,
			"Pound": 100,
			"Present": 100,
			"Quick Attack": 100,
			"Rage": 100,
			"Rapid Spin": 100,
			"Razor Wind": 160,
			"Relic Song": 140,
			"Retaliate": 140,
			"Return": 160,
			"Revelation Dance": 175,
			"Rock Climb": 175,
			"Round": 120,
			"Scratch": 100,
			"Secret Power": 140,
			"Self-Destruct": 200,
			"Skull Bash": 195,
			"Slam": 160,
			"Slash": 140,
			"Smelling Salts": 140,
			"Snore": 100,
			"Sonic Boom": 100,
			"Spike Cannon": 100,
			"Spit Up": 100,
			"Stomp": 120,
			"Strength": 160,
			"Struggle": 1,
			"Super Fang": 100,
			"Swift": 120,
			"Tackle": 100,
			"Tail Slap": 140,
			"Take Down": 175,
			"Techno Blast": 190,
			"Thrash": 190,
			"Tri Attack": 160,
			"Trump Card": 160,
			"Uproar": 175,
			"Vice Grip": 100,
			"Weather Ball": 160,
			"Wrap": 100,
			"Wring Out": 190,
		},
		accuracy: null,
		rechargeTurns: 0,
		energy: {},
		sounds: {
			"part1": "src/audio/attacks/Breakneck Blitz part 1.mp3",
			"part2": "src/audio/attacks/Breakneck Blitz part 2.mp3",
			"part3": "src/audio/attacks/Breakneck Blitz part 3.mp3",
		},
		effects: [
			{ type: "play-sound", name: "part1", wait: true },
			{ type: "play-sound", name: "part3" },
			{ type: "z-move-animation", animationType: "Normal", resolveOn: "wait" },
			{ type: "save-variable", name: "animPromise", save: -1 },
			// { type: "wait", duration: 5000 },
			{ type: "load-value", value: 5 },
			{ type: "select-random-tiles", count: -1 },
			{ type: "remove-tiles", selection: -1, delay: 50 },
			{ type: "load-value", value: 5 },
			{ type: "select-random-tiles", count: -1 },
			{ type: "remove-tiles", selection: -1, delay: 50 },
			{ type: "load-value", value: 5 },
			{ type: "select-random-tiles", count: -1 },
			{ type: "remove-tiles", selection: -1, delay: 50 },
			{ type: "load-value", value: 5 },
			{ type: "select-random-tiles", count: -1 },
			{ type: "remove-tiles", selection: -1, delay: 50 },
			{ type: "load-value", value: 5 },
			{ type: "select-random-tiles", count: -1 },
			{ type: "remove-tiles", selection: -1, delay: 50 },
			{ type: "load-value", value: 5 },
			{ type: "select-random-tiles", count: -1 },
			{ type: "remove-tiles", selection: -1, delay: 50 },
			{ type: "load-value", value: 5 },
			{ type: "select-random-tiles", count: -1 },
			{ type: "remove-tiles", selection: -1, delay: 50 },
			{ type: "load-value", value: 5 },
			{ type: "select-random-tiles", count: -1 },
			{ type: "remove-tiles", selection: -1, delay: 50 },
			{ type: "load-variable", name: "animPromise" },
			{ type: "promise-wait" },
			{ type: "damage", delay: 0 },
		],
	},
	"All-Out Pummeling": {
		name: "All-Out Pummeling",
		type: "Fighting",
		category: "Physical",
		inheritCategory: true,
		strategy: "basic-damage",
		tags: ["z-move", "damage-dealing", "goes-through-protect"],
		pp: null,
		power: 100,
		powerBasedOnParent: {
			"Arm Thrust": 100,
			"Aura Sphere": 160,
			"Brick Break": 140,
			"Circle Throw": 120,
			"Close Combat": 190,
			"Counter": 100,
			"Cross Chop": 180,
			"Double Kick": 100,
			"Drain Punch": 140,
			"Dynamic Punch": 180,
			"Final Gambit": 180,
			"Flying Press": 170,
			"Focus Blast": 190,
			"Focus Punch": 200,
			"Force Palm": 120,
			"Hammer Arm": 180,
			"High Jump Kick": 195,
			"Jump Kick": 180,
			"Karate Chop": 100,
			"Low Kick": 160,
			"Low Sweep": 120,
			"Mach Punch": 100,
			"Power-Up Punch": 100,
			"Revenge": 120,
			"Reversal": 160,
			"Rock Smash": 100,
			"Rolling Kick": 120,
			"Sacred Sword": 175,
			"Secret Sword": 160,
			"Seismic Toss": 100,
			"Sky Uppercut": 160,
			"Storm Throw": 120,
			"Submission": 160,
			"Superpower": 190,
			"Triple Kick": 120,
			"Vacuum Wave": 100,
			"Vital Throw": 140,
			"Wake-Up Slap": 140,
		},
		accuracy: null,
		rechargeTurns: 1,
		energy: {},
		sounds: {
			"part1": "src/audio/attacks/All-Out Pummeling part 1.mp3",
			"part2": "src/audio/attacks/All-Out Pummeling part 2.mp3",
			"part3": "src/audio/attacks/All-Out Pummeling part 3.mp3",
		},
		effects: [
			{ type: "play-sound", name: "part1", wait: true },
			{ type: "play-sound", name: "part3", waitBeforeFinishMove: true },
			{ type: "z-move-animation", animationType: "Fighting", resolveOn: "wait", waitBeforeFinishMove: true, durations: {
				"expand": 4500,
				"wait": 6000,
				"shrink": 3000
			} },
			{ type: "save-variable", name: "animPromise", save: -1 },
			// { type: "wait", duration: 5000 },
			
			{ type: "damage", delay: 0, damageMult: 1/15 },
			{ type: "load-value", value: 1 },
			{ type: "select-random-tiles", count: -1 },
			{ type: "load-value", value: 0 },
			{ type: "get-element-from-list", list: -2, index: -1 },
			{ type: "get-tile-x", tile: -1 },
			{ type: "get-tile-y", tile: -2 },
			{ type: "load-value", value: 2.5 },
			{ 
				type: "select-tiles-with-expression",
				conditionExpression: "((x - %c%)^2 + (y - %c%)^2)^0.5 <= %c%",
				conditionArguments: [-3, -2, -1]
			},
			{ type: "remove-tiles", selection: -1, delay: 50 },
			{ type: "time-step" },
			
			{ type: "damage", delay: 0, damageMult: 2/15 },
			{ type: "load-value", value: 1 },
			{ type: "select-random-tiles", count: -1 },
			{ type: "load-value", value: 0 },
			{ type: "get-element-from-list", list: -2, index: -1 },
			{ type: "get-tile-x", tile: -1 },
			{ type: "get-tile-y", tile: -2 },
			{ type: "load-value", value: 2.5 },
			{ 
				type: "select-tiles-with-expression",
				conditionExpression: "((x - %c%)^2 + (y - %c%)^2)^0.5 <= %c%",
				conditionArguments: [-3, -2, -1]
			},
			{ type: "remove-tiles", selection: -1, delay: 50 },
			{ type: "time-step" },
			
			{ type: "damage", delay: 0, damageMult: 3/15 },
			{ type: "load-value", value: 1 },
			{ type: "select-random-tiles", count: -1 },
			{ type: "load-value", value: 0 },
			{ type: "get-element-from-list", list: -2, index: -1 },
			{ type: "get-tile-x", tile: -1 },
			{ type: "get-tile-y", tile: -2 },
			{ type: "load-value", value: 2.5 },
			{ 
				type: "select-tiles-with-expression",
				conditionExpression: "((x - %c%)^2 + (y - %c%)^2)^0.5 <= %c%",
				conditionArguments: [-3, -2, -1]
			},
			{ type: "remove-tiles", selection: -1, delay: 50 },
			{ type: "time-step" },
			
			{ type: "damage", delay: 0, damageMult: 4/15 },
			{ type: "load-value", value: 1 },
			{ type: "select-random-tiles", count: -1 },
			{ type: "load-value", value: 0 },
			{ type: "get-element-from-list", list: -2, index: -1 },
			{ type: "get-tile-x", tile: -1 },
			{ type: "get-tile-y", tile: -2 },
			{ type: "load-value", value: 2.5 },
			{ 
				type: "select-tiles-with-expression",
				conditionExpression: "((x - %c%)^2 + (y - %c%)^2)^0.5 <= %c%",
				conditionArguments: [-3, -2, -1]
			},
			{ type: "remove-tiles", selection: -1, delay: 50 },
			{ type: "time-step" },
			
			{ type: "damage", delay: 0, damageMult: 5/15 },
			{ type: "load-value", value: 1 },
			{ type: "select-random-tiles", count: -1 },
			{ type: "load-value", value: 0 },
			{ type: "get-element-from-list", list: -2, index: -1 },
			{ type: "get-tile-x", tile: -1 },
			{ type: "get-tile-y", tile: -2 },
			{ type: "load-value", value: 2.5 },
			{ 
				type: "select-tiles-with-expression",
				conditionExpression: "((x - %c%)^2 + (y - %c%)^2)^0.5 <= %c%",
				conditionArguments: [-3, -2, -1]
			},
			{ type: "remove-tiles", selection: -1, delay: 50 },
			{ type: "time-step" },
			{ type: "load-variable", name: "animPromise" },
			{ type: "promise-wait" },
			{ type: "end-turn" },
		],
	},
	"Supersonic Skystrike": {
		name: "Supersonic Skystrike",
		type: "Flying",
		category: "Physical",
		inheritCategory: true,
		strategy: "basic-damage",
		tags: ["z-move", "damage-dealing", "goes-through-protect"],
		pp: null,
		power: 100,
		powerBasedOnParent: {
			"Acrobatics": 100,
			"Aerial Ace": 120,
			"Aeroblast": 180,
			"Air Cutter": 120,
			"Air Slash": 140,
			"Beak Blast": 180,
			"Bounce": 160,
			"Brave Bird": 190,
			"Chatter": 120,
			"Dragon Ascent": 190,
			"Drill Peck": 160,
			"Fly": 175,
			"Gust": 100,
			"Hurricane": 185,
			"Oblivion Wing": 160,
			"Peck": 100,
			"Pluck": 120,
			"Sky Attack": 200,
			"Sky Drop": 120,
			"Wing Attack": 120,
		},
		accuracy: null,
		rechargeTurns: 1,
		energy: {},
		sounds: {
			"part1": "src/audio/attacks/Supersonic Skystrike part 1.mp3",
			"part2": "src/audio/attacks/Supersonic Skystrike part 2.mp3",
			"part3": "src/audio/attacks/Supersonic Skystrike part 3.mp3",
		},
		effects: [
			{ type: "play-sound", name: "part1", wait: true },
			{ type: "play-sound", name: "part3", waitBeforeFinishMove: true },
			{ type: "z-move-animation", animationType: "Flying" },
			
			{ type: "damage", delay: 0 },
			{ type: "load-value", value: 45 },
			{ 
				type: "select-tiles-with-expression",
				conditionExpression: "abs((tan(%c% deg) * (x + 0.5)) - y + ((h*0.5) - (tan(%c% deg) * (w*0.5))))/sqrt(tan(%c% deg)^2 + 1) <= 0.7",
				conditionArguments: [-1, -1, -1]
			},
			{ type: "load-value", value: -45 },
			{ 
				type: "select-tiles-with-expression",
				conditionExpression: "abs((tan(%c% deg) * (x + 0.5)) - y + ((h*0.5) - (tan(%c% deg) * (w*0.5))))/sqrt(tan(%c% deg)^2 + 1) <= 0.7",
				conditionArguments: [-1, -1, -1]
			},
			{ type: "combine-selections", selection1: -1, selection2: -3 },
			{ type: "remove-tiles", selection: -1 },
			{ type: "end-turn" },
		],
	},
	// Prev version
	// "All-Out Pummeling": {
	// 	name: "All-Out Pummeling",
	// 	type: "Fighting",
	// 	category: "Physical",
	// 	inheritCategory: true,
	// 	strategy: "basic-damage",
	// 	tags: ["z-move", "damage-dealing"],
	// 	pp: null,
	// 	power: 100,
	// 	powerBasedOnParent: {},
	// 	accuracy: null,
	// 	rechargeTurns: 1,
	// 	energy: {},
	// 	sounds: {
	// 		"part1": "src/audio/attacks/All-Out Pummeling part 1.mp3",
	// 		"part2": "src/audio/attacks/All-Out Pummeling part 2.mp3",
	// 		"part3": "src/audio/attacks/All-Out Pummeling part 3.mp3",
	// 	},
	// 	effects: [
	// 		{ type: "play-sound", name: "part1", wait: true },
	// 		{ type: "play-sound", name: "part3" },
	// 		{ type: "wait", duration: 5000 },

	// 		{ type: "get-board-height" },
	// 		{ type: "load-value", value: -1 },
	// 		{ type: "add-numbers" },
	// 		{ type: "load-value", value: -1 },
	// 		{ type: "add-numbers" },
	// 		{ type: "select-row", y: -3 },
	// 		{ type: "select-row", y: -2 },
	// 		{ type: "combine-selections", selection1: -1, selection2: -2 },
	// 		{ type: "remove-tiles", selection: -1, delay: 50 },

	// 		{ type: "get-board-height" },
	// 		{ type: "load-value", value: -1 },
	// 		{ type: "add-numbers" },
	// 		{ type: "load-value", value: -1 },
	// 		{ type: "add-numbers" },
	// 		{ type: "select-row", y: -3 },
	// 		{ type: "select-row", y: -2 },
	// 		{ type: "combine-selections", selection1: -1, selection2: -2 },
	// 		{ type: "remove-tiles", selection: -1, delay: 50 },

	// 		{ type: "get-board-height" },
	// 		{ type: "load-value", value: -1 },
	// 		{ type: "add-numbers" },
	// 		{ type: "load-value", value: -1 },
	// 		{ type: "add-numbers" },
	// 		{ type: "select-row", y: -3 },
	// 		{ type: "select-row", y: -2 },
	// 		{ type: "combine-selections", selection1: -1, selection2: -2 },
	// 		{ type: "remove-tiles", selection: -1, delay: 50 },

	// 		{ type: "get-board-height" },
	// 		{ type: "load-value", value: -1 },
	// 		{ type: "add-numbers" },
	// 		{ type: "load-value", value: -1 },
	// 		{ type: "add-numbers" },
	// 		{ type: "select-row", y: -3 },
	// 		{ type: "select-row", y: -2 },
	// 		{ type: "combine-selections", selection1: -1, selection2: -2 },
	// 		{ type: "remove-tiles", selection: -1, delay: 50 },

	// 		{ type: "get-board-height" },
	// 		{ type: "load-value", value: -1 },
	// 		{ type: "add-numbers" },
	// 		{ type: "load-value", value: -1 },
	// 		{ type: "add-numbers" },
	// 		{ type: "select-row", y: -3 },
	// 		{ type: "select-row", y: -2 },
	// 		{ type: "combine-selections", selection1: -1, selection2: -2 },
	// 		{ type: "remove-tiles", selection: -1, delay: 50 },

	// 		{ type: "get-board-height" },
	// 		{ type: "load-value", value: -1 },
	// 		{ type: "add-numbers" },
	// 		{ type: "load-value", value: -1 },
	// 		{ type: "add-numbers" },
	// 		{ type: "select-row", y: -3 },
	// 		{ type: "select-row", y: -2 },
	// 		{ type: "combine-selections", selection1: -1, selection2: -2 },
	// 		{ type: "remove-tiles", selection: -1, delay: 50 },

	// 		{ type: "damage", delay: 0 },
	// 	],
	// },
};

for (let moveName in pokemonMoveData){
	let move = pokemonMoveData[moveName]
	move.tags = move.tags ?? []
	if (!move.id){
		move.id = moveName
	}
	if (move.power && !move.tags.includes("damage-dealing")){
		move.tags.push("damage-dealing")
	}
	if (move.additionalEffects &&
		move.additionalEffects.length &&
		!move.tags.includes("has-additional-effects")
	){
		move.tags.push("has-additional-effects")
	}
	// if (move.sounds && !Object.values(move.sounds).some(v => v.includes(moveName))){
	// 	console.warn("Weird sound", moveName)
	// }
	
	if (move.effects.some(effect => effect.type === "damage") && !move.tags.includes("damage-dealing")){
		console.log("this move doesn't deal damage?", move)
	}
}
for (let name in pokemonData) {
	pokemonData[name].learnset.splice(0, 0, {
		name: "Struggle",
		unlock: {
			type: "never"
		}
	})
}
fixLearnsets()