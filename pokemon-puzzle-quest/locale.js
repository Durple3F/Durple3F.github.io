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
				resolve()
			},
			error: function(){
				downloadLocale(name)
				.then(resolve)
			}
		})
	})
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