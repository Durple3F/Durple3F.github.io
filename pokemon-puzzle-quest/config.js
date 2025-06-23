const config = {
	confirmMoveSelection: true,
	pokemonSwapOutInfo: true,
	showBlurOnTiles: true,
	showFPS: "dev",
	skipSeenDialogue: false,
	expShare: true,
	hardMode: false,
	increaseEnemyLevels: false,
	increaseEnemyLevelsAmount: 0,
	debug: false,
	lowerLevelsToRecommendedLevels: true,
	showLevelCompletionData: false,
	antialiasing: true,
	screenShake: true,
	funnyMode: false,
	//Tiles glow if they can be matched
	tileHighlightHints: true,
	//The names shown on the top display the pokemon's level
	showPokemonLevel: true,
	//Setting this to 1 makes the CPU wait until there's no announcements before passing the turn.
	//Setting it to 2 makes the CPU not wait, and there's less delay between turns.
	cpuSpeed: 1,
	textSpeed: 40,

	//In case the player wants to have a little sprite for themselves
	trainerClass: null,

	volumes: {
		"music": 0.02,
		"sound": 0.2,
		"cry": 0.2
	},
	muted: {
		"music": false,
		"sound": false,
		"cry": false
	}
}