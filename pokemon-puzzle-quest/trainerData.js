const defaultDialogueStyle = {
	textBoxBackground1: "linear-gradient(-30deg, #00477d80 0%, #004ea8a0 100%)",
	textBoxBackground2: "radial-gradient(at bottom, #aeaeae, white)",
	textBoxMask: "radial-gradient(ellipse at center, black 67%, transparent 71%)",
	textBoxFilter: `drop-shadow(0.05em 0em 0.1em #ececec)
				drop-shadow(-0.05em 0em 0.1em #ececec)
				drop-shadow(0em 0.05em 0.1em #ececec)
				drop-shadow(0em -0.05em 0.1em #ececec)`,
	textBoxTextBackground: "linear-gradient(4deg, #222, #000)",
	textBoxTextContinueBackground: "radial-gradient(black, black)",
	textBoxFont: "unset",
	namePlateTextBackground: "linear-gradient(-182deg, white 20%, skyblue 80%)",
	namePlateBackgroundColor: "var(--ui-primary-bg)",
	namePlateBackground2: "repeating-linear-gradient( -0.5deg, transparent, transparent 0.1em, rgba(125, 143, 247, 0.266) 0.15em, transparent 0.25em )",
	namePlateBackground2Color: "rgb(0, 68, 255)",
	namePlateOpacity: 1
}
const NPCTrainerData = {
	"Narrator": {
		name: "",
		type: "trainer",
		textStyle: {
			namePlateOpacity: 0
		},
		imageSources: {
			trainer: "src/img/trainers/empty.png"
		}
	},
	"Hau": {
		name: "Hau",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/hau.png"
		},
		textStyle: {
			textBoxBackground1: "radial-gradient(ellipse at center,rgb(243, 183, 42) 50%, #3b3838 100%)",
			textBoxBackground2: "radial-gradient(at bottom,rgb(20, 19, 19),rgb(42, 37, 28))",
			textBoxMask: "radial-gradient(ellipse at center, black 68%, transparent 72%)",
			textBoxFilter: `drop-shadow(0em 0em 0.1em #ececec10)`,
			textBoxTextBackground: "linear-gradient(4deg, #bbb, #fff)",
			textBoxTextContinueBackground: "linear-gradient(4deg, #bbb, #fff)",
		},
		textColorOverrides: {
			"blue": "rgb(100, 129, 248)"
		}
	},
	"Lillie": {
		name: "Lillie",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/lillie.png"
		},
		textStyle: {
			textBoxBackground1: "radial-gradient(ellipse at center,rgb(218, 132, 255) 50%,rgb(235, 190, 252) 100%)",
			textBoxBackground2: "radial-gradient(at bottom,rgb(192, 255, 255),rgb(243, 253, 255))",
			textBoxMask: "radial-gradient(ellipse at center, black 68%, transparent 72%)",
			textBoxFilter: `drop-shadow(0.05em 0em 0.1em #ececec20)
			drop-shadow(-0.05em 0em 0.1em #ececec20)
			drop-shadow(0em 0.05em 0.1em #ececec20)
			drop-shadow(0em -0.05em 0.1em #ececec20)`,
			textBoxTextBackground: "linear-gradient(0deg, #333, #050505, #333)",
			textBoxTextContinueBackground: "linear-gradient(0deg, #333, #050505, #333)",
			namePlateTextBackground: "linear-gradient(0deg, #333, #050505, #333)",
			namePlateBackgroundColor: "rgb(228, 129, 255)",
			namePlateBackground2: "repeating-linear-gradient( -0.5deg, transparent, transparent 0.1em, transparent 0.15em, transparent 0.25em )",
			namePlateBackground2Color: "rgb(216, 248, 254)",
		}
	},
	"Gladion-stance": {
		name: "Gladion",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/gladion-stance.png"
		},
	},
	"Gladion": {
		name: "Gladion",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/gladion.png"
		},
		textStyle: {
			textBoxBackground1: "radial-gradient(ellipse at center,rgb(136, 44, 44) 50%,rgb(179, 74, 74) 100%)",
			textBoxBackground2: "radial-gradient(at bottom,rgb(20, 20, 20),rgb(39, 39, 39))",
			textBoxMask: "radial-gradient(ellipse at center, black 68%, transparent 72%)",
			textBoxFilter: `drop-shadow(0.05em 0em 0.1em rgba(39, 39, 39, 20))
			drop-shadow(-0.05em 0em 0.1em rgba(39, 39, 39, 20))
			drop-shadow(0em 0.05em 0.1em rgba(39, 39, 39, 20))
			drop-shadow(0em -0.05em 0.1em rgba(39, 39, 39, 20))`,
			textBoxTextBackground: "linear-gradient(0deg, rgb(235, 228, 228), rgb(201, 194, 194),rgb(235, 228, 228))",
			textBoxTextContinueBackground: "linear-gradient(0deg, rgb(235, 228, 228), rgb(201, 194, 194),rgb(235, 228, 228))",
			namePlateTextBackground: "linear-gradient(4deg,rgb(235, 228, 228), rgb(201, 194, 194))",
			namePlateBackgroundColor: "rgb(136, 44, 44)",
			namePlateBackground2: "repeating-linear-gradient( -0.5deg, transparent, transparent 0.1em, transparent 0.15em, transparent 0.25em )",
			namePlateBackground2Color: "rgb(92, 25, 25)",
		}
	},
	"Masked-Royal": {
		name: "The Masked Royal",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/theroyal.png"
		},
		textStyle: {
			textBoxBackground1: "radial-gradient(ellipse at center, #149ac7 50%, #003e76 100%)",
			textBoxBackground2: "radial-gradient(ellipse at top, #972611, #de3c21)",
			textBoxMask: "radial-gradient(ellipse at center, black 68%, transparent 72%)",
			textBoxFilter: `drop-shadow(0.05em 0em 0.1em #05050520)
			drop-shadow(-0.05em 0em 0.1em #05050520)
			drop-shadow(0em 0.05em 0.1em #05050520)
			drop-shadow(0em -0.05em 0.1em #05050520)`,
			textBoxTextBackground: "linear-gradient(0deg, rgb(233, 233, 233), #ffffff)",
			textBoxTextContinueBackground: "linear-gradient(0deg, rgb(233, 233, 233), #ffffff)",
			namePlateTextBackground: "linear-gradient(0deg, rgb(233, 233, 233), #ffffff)",
			namePlateBackgroundColor: "#149ac7",
			namePlateBackground2: "repeating-linear-gradient( -0.5deg, transparent, transparent 0.1em, #149ac740 0.15em, transparent 0.25em )",
			namePlateBackground2Color: "#003e76",
		}
	},
	"Hala": {
		name: "Hala",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/hala.png"
		},
		textStyle: {}
	},
	"Ilima": {
		name: "Ilima",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/ilima.png"
		},
		textStyle: {}
	},
	"Lana": {
		name: "Lana",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/lana.png"
		},
		textStyle: {}
	},
	"Kahili": {
		name: "Kahili",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/kahili.png"
		},
		textStyle: {}
	},
	"Dexio": {
		name: "Dexio",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/dexio.png"
		},
		textStyle: {}
	},
	"Sina": {
		name: "Sina",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/sina.png"
		},
		textStyle: {}
	},
	"Ace-Trainer-Gen7": {
		name: "Ace Trainer",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/acetrainer-gen7.png"
		}
	},
	"Ace-Trainer-Gen7-F": {
		name: "Ace Trainer",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/acetrainerf-gen7.png"
		}
	},
	"Aroma-Lady": {
		name: "Aroma Lady",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/aromalady.png"
		}
	},
	"Backpacker-Gen7-F": {
		name: "Backpacker",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/backpackerf.png"
		}
	},
	"Beauty-Gen6": {
		name: "Beauty",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/beauty-gen6.png"
		}
	},
	"Beauty-Gen7": {
		name: "Beauty",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/beauty-gen7.png"
		}
	},
	"Bellhop": {
		name: "Bellhop",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/bellhop.png"
		}
	},
	"Dancer-Gen7": {
		name: "Dancer",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/dancer-gen7.png"
		}
	},
	"Engineer-Gen3": {
		name: "Engineer",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/engineer-gen3.png"
		}
	},
	"Fisherman-Gen7": {
		name: "Fisherman",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/fisherman-gen7.png"
		}
	},
	"Gentleman-Gen7": {
		name: "Gentleman",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/gentleman-gen7.png"
		}
	},
	"Lass-Gen7": {
		name: "Lass",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/lass-gen7.png"
		}
	},
	"Pokemon-Breeder-Gen7": {
		name: "Pokémon Breeder",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/pokemonbreeder-gen7.png"
		}
	},
	"Pokemon-Breeder-Gen7-F": {
		name: "Pokémon Breeder",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/pokemonbreederf-gen7.png"
		}
	},
	"Preschooler-F-Gen7": {
		name: "Preschooler",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/preschoolerf-gen7.png"
		}
	},
	"Rising-Star": {
		name: "Rising Star",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/risingstar.png"
		}
	},
	"Rising-Star-F": {
		name: "Rising Star",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/risingstarf.png"
		}
	},
	"Reporter": {
		name: "Reporter",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/reporter.png"
		}
	},
	"Sightseer": {
		name: "Sightseer",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/sightseer.png"
		}
	},
	"Striker": {
		name: "Striker",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/striker.png"
		}
	},
	"Surfer": {
		name: "Surfer",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/surfer.png"
		}
	},
	"Teacher-Gen7": {
		name: "Teacher",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/teacher-gen7.png"
		}
	},
	"Team-Skull-Grunt": {
		name: "Team Skull Grunt",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/skullgrunt.png"
		},
		textStyle: {
			textBoxFont: "\"Caveat Brush\"",
		}
	},
	"Team-Skull-Grunt-F": {
		name: "Team Skull Grunt",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/skullgruntf.png"
		},
		textStyle: {
			textBoxFont: "\"Caveat Brush\"",
		}
	},
	"Young-Athlete-F": {
		name: "Youth Athlete",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/youngathletef.png"
		}
	},
	"Youngster-Gen7": {
		name: "Youngster",
		type: "trainer",
		imageSources: {
			trainer: "src/img/trainers/youngster-gen7.png"
		}
	},
}
for (let trainerName in NPCTrainerData) {
	let data = NPCTrainerData[trainerName]
	if (!data.id) {
		data.id = trainerName
	}
}

const trainerAnimations = {
	"default-throw-pokeball": function (tag) {
		let promise = new Promise(resolve => {
			let resolved = false
			let animation = p => {
				let rotate = 0
				if (p < 0.4) {
					let partP = (p - 0) / (0.4 - 0)
					rotate = interpolate(0, 30, bezierEase(partP))
				} else if (p < 0.7) {
					let partP = (p - 0.4) / (0.7 - 0.4)
					rotate = interpolate(30, -10, bezierEase(partP))
				} else {
					let partP = (p - 0.7) / (1 - 0.7)
					rotate = interpolate(-10, 0, bezierEase(partP))
				}
				tag.css({
					transform: "rotate(" + rotate + "deg)"
				})
				if (p > 0.5 && !resolved) {
					resolve()
					resolved = true
				}
			}
			delay(500).then(() => {
				$({ val: 0 }).animate({ val: 1 }, {
					duration: 800,
					easing: "linear",
					step: function () {
						animation(this.val)
					},
					complete: function () {
						animation(1)
					}
				})
			})
		})
		return promise
	}
}