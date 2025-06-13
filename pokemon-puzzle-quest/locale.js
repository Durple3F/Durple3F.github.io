const locale = {}
const languages = {
	"en": "src/lang/en.json"
}

function downloadLocale(name){
	let url = languages[name]
	if (!url) {
		console.error("Invalid language name", name)
		return
	}
	return new Promise(resolve => {
		$.ajax({
			url: url,
			success: function(data){
				locale[name] = data
				checkLocale(locale[name], name)
				resolve()
			},
			error: function(){
				downloadLocale(name)
				.then(resolve)
			}
		})
	})
}
function checkLocale(locale, langName){
	if (locale["pokemon"]){
		let missingDexEntries = []
		Object.values(pokemonData)
		.forEach(pData => {
			let id = pData.id
			let locData = locale["pokemon"][id]
			if (!locData){
				console.warn("Locale data is missing pokemon data for",id,langName)
			}
			if (locData && !locData["pokedex-entry"]){
				missingDexEntries.push(id)
			}

			let learnset = pData.learnset ?? []
			learnset.forEach(learnData => {
				let moveId = learnData.name
				if (!(moveId in pokemonMoveData)){
					console.warn(id,"can learn",moveId,"which doesn't exist in move data")
				}
			})
		})
		if (missingDexEntries.length){
			console.log(missingDexEntries)
		}
	} else {
		console.warn("Locale data is missing pokemon data", langName)
	}

	if (locale["moves"]){
		Object.values(pokemonMoveData)
		.forEach(mData => {
			let moveName = mData.name
			let locData = locale["moves"][moveName]
			if (!locData){
				console.warn("Locale data is missing move data for",moveName,langName)
			}
		})
	} else {
		console.warn("Locale data is missing move data", langName)
	}

	if (locale["abilities"]){
		Object.values(pokemonAbilityData)
		.forEach(aData => {
			let abilityId = aData.id
			let locData = locale["abilities"][abilityId]
			if (!locData){
				console.warn("Locale data is missing ability data for",abilityId,langName)
			}
		})
	} else {
		console.warn("Locale data is missing ability data", langName)
	}

	if (locale["pokemon-names"]){
		let missingNames = []
		Object.values(levelData)
		.forEach(lData => {
			let trainers = lData.trainers ?? []
			trainers.forEach(tData => {
				let pokemonList = (tData.pokemon ?? []).concat(tData.possiblePokemon ?? [])
				pokemonList.forEach(pData => {
					let name = pData.name
					if (!name) return
					let nameData = locale["pokemon-names"][name]
					if (!nameData){
						missingNames.push(lData.id + name)
					}
				})
			})
		})
		if (missingNames.length){
			console.log(missingNames)
		}
	}
}

function getLocaleString(id, lang, path, defaultResult=`% STRING MISSING %`){
	var curLang = lang || "en"
	var path = path ?? []
	if (!locale[curLang]){
		console.error("The current language doesn't seem to exist", lang)
		curLang = "en"
	}
	let localeObj = locale[curLang]
	if (path.length){
		for (let route of path){
			if (localeObj[route]){
				localeObj = localeObj[route]
			}
		}
	}
	if (!localeObj[id]){
		if (defaultResult === `% STRING MISSING %`){
			console.warn("String missing:", lang, id, path)
		}
		return defaultResult
	}
	return localeObj[id]
}