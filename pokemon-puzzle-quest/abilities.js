const abilityData = {
	"No Ability": {
		id: "No Ability"
	},
	//When the opponent makes a 5+ match, maxes out your attack
	"Anger Point": {
		id: "Anger Point"
	},
	//Prevents receiving statuses that lower Defense
	"Big Pecks": {
		id: "Big Pecks"
	},
	//Increases fire power at low hp
	"Blaze": {
		id: "Blaze"
	},
	//Adds green energy if you match things that aren't green
	"Chlorophyll": {
		id: "Chlorophyll"
	},
	//At the end of each turn, 20% chance to cure one non-volatile status
	"Compound Eyes": {
		id: "Compound Eyes"
	},
	//Get a stage of attack when you get a stat debuff
	"Defiant": {
		id: "Defiant"
	},
	//Power to all moves is increased, but a random tax is added every turn
	"Hustle": {
		id: "Hustle"
	},
	//Prevents receiving statuses that lower Attack
	"Hyper Cutter": {
		id: "Hyper Cutter"
	},
	//Literally just Vital Spirit again
	"Insomnia": {
		id: "Insomnia"
	},
	//Gives a bonus to specifically moves tagged with "punching"
	"Iron Fist": {
		id: "Iron Fist"
	},
	//Cost reductions to your moves from opponents are 50% as effective
	"Keen Eye": {
		id: "Keen Eye"
	},
	//Blocks status effects from the opponent based on green energy
	"Leaf Guard": {
		id: "Leaf Guard"
	},
	//Can't be confused
	"Own Tempo": {
		id: "Own Tempo"
	},
	//Spore moves don't trigger
	"Overcoat": {
		id: "Overcoat"
	},
	//Increase grass power at low hp
	"Overgrow": {
		id: "Overgrow"
	},
	//Prevents recoil damage
	"Rock Head": {
		id: "Rock Head"
	},
	//If it was damaged during a turn, its speed increases by 50% during the next turn.
	"Run Away": {
		id: "Run Away"
	},
	//At the end of each turn, 20% chance to cure one non-volatile status
	"Shed Skin": {
		id: "Shed Skin"
	},
	//Additional abilities don't trigger but all move power is increased 30%
	"Sheer Force": {
		id: "Sheer Force"
	},
	//Blocks status effects from the opponent 20% of the time
	"Shield Dust": {
		id: "Shield Dust"
	},
	//Raises speed when initiative is lowered
	"Steadfast": {
		id: "Steadfast"
	},
	//Powers up not very effective moves
	"Tinted Lens": {
		id: "Tinted Lens"
	},
	//Increase water power at low hp
	"Torrent": {
		id: "Torrent"
	},
	//You can't be put to sleep
	"Vital Spirit": {
		id: "Vital Spirit"
	},
	//Stats change on being hit with Physical moves
	"Weak Armor": {
		id: "Weak Armor"
	},
}

Object.values(pokemonData).map(pData => {
	return pData.abilities.concat(pData.hiddenAbilities)
})
.flat()
.filter((v,i,s) => s.indexOf(v)===i)
.forEach(abilityName => {
	if (!abilityData[abilityName]){
		console.warn(abilityName,"does nothing")
	}
})