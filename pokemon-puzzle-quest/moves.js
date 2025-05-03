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
			purple: 9,
			yellow: 5
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
			blue: 15,
			yellow: 5
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
				turns: 2,
				lostOnBatonPass: true
			} },
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
			"attack": "src/audio/attacks/Charm.mp3"
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
			// orange: 10
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
	//Makes the opponent unable to use their last move
	"Disable": {
		name: "Disable",
		type: "Normal",
		category: "Status",
		strategy: "special",
		pp: 20,
		power: null,
		accuracy: 100,
		rechargeTurns: 1,
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
				batonPassable: false,
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
	//Makes a match for the user
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
			blue: 6,
			yellow: 4
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
				status: { name: "Burn", type: "debuff", duration: 5 }
			}
		]
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
		rechargeTurns: 1,
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
				volatile: true,
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
	//Removes invulnerable
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
			{ type: "remove-status-effect", statusName: "invulnerable" },
			{ type: "damage" }
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
	//Raises attack 2
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
					class: "buff",
					amount: 2
				}
			}
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
			{ type: "load-value", value: 3 },
			{ type: "select-random-tiles", count: -1, conditions: { types: ["green"] } },
			{ type: "select-tiles-diagonal-to", selection: -1 },
			{ type: "change-tile-type", selection: "group", which: -1, targetType: "green" },
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
	//Puts the opponent to sleep
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
			purple: 8
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
					class: "buff",
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
			{type: "apply-debuff", target: "opponent", debuff: {
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
		],
	},
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
			"attack": "src/audio/attacks/Pound.mp3"
		},
		effects: [
			{ type: "play-sound", name: "attack" },
			{ type: "damage" },
			{ type: "end-turn" }
		],
	},
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
			orange: 8,
			green: 6
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
			{ type: "swap-pokemon", target: "user", pokemon: -1 }
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
			"attack": "src/audio/attacks/Vice Grip.mp3"
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
		tags: ["z-move", "damage-dealing"],
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
		rechargeTurns: 1,
		energy: {},
		sounds: {
			"part1": "src/audio/attacks/Breakneck Blitz part 1.mp3",
			"part2": "src/audio/attacks/Breakneck Blitz part 2.mp3",
			"part3": "src/audio/attacks/Breakneck Blitz part 3.mp3",
		},
		effects: [
			{ type: "play-sound", name: "part1", wait: true },
			{ type: "play-sound", name: "part3" },
			{ type: "wait", duration: 5000 },
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
			{ type: "damage", delay: 0 },
		],
	},
	"All-Out Pummeling": {
		name: "All-Out Pummeling",
		type: "Fighting",
		category: "Physical",
		inheritCategory: true,
		strategy: "basic-damage",
		tags: ["z-move", "damage-dealing"],
		pp: null,
		power: 100,
		powerBasedOnParent: {},
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
			{ type: "wait", duration: 5000 },
			
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
			{ type: "time-step" }
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