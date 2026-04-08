const LOCALE = {}

export async function loadLocale(url, language){
	if (!LOCALE[language]) LOCALE[language] = {}
	let p = new Promise((resolve, reject) => {
		$.ajax({
			url: url,
			dataType: "json",
			success: data => {
				for (let key in data){
					LOCALE[language][key] = data[key]
				}
				resolve()
			},
			failure: async () => {
				await loadLocale(url)
				resolve()
			}
		})
	})
	await p
}

export function getLocaleString(key, language, fallback){
	let path = []
	if (typeof key === "string"){
		path.push(key)
	} else {
		path = key
	}
	let result = LOCALE[language]
	console.log(LOCALE)
	for (let key of path){
		if (key in result){
			result = result[key]
		} else if (language !== "en") {
			result = getLocaleString(key, "en", fallback)
			break
		} else {
			result = fallback
			break
		}
	}
	return result
}