(function game(){
	const titleVariants = [
		["Rather", "Ever So Slightly", "Slightly", "Annoyingly"],
		["Overengineered", "Large", "Bad", "Stupid"]
	]

	let lives = 20
	let roundOver = false
	let lastGuess = ""

	const SETTYPESRANKING = [
		"expansion",
		"core",
		"commander",
		"masters",
		"alchemy",
		"funny",
		"draft_innovation",
		"masterpiece",
		"planechase",
		"archenemy",
		"vanguard",
		"premium_deck",
		"starter",
		"spellbook",
		"duel_deck",
		"from_the_vault",
		"treasure_chest",
		"promo",
		"box",
		"memorabilia",
		"token",
		"minigame",
		"arsenal"
	]
	let shownSets = []
	let cardNames = []
	let firstPrintings = {}
	let settingChoiceLists = {
		"everything": [],
		"standard": []
	}

	let difficulty = null
	let answer = null

	function funnyTitle(){
		var prefixes = titleVariants[0]
		var suffixes = titleVariants[1]
		var prefix = prefixes[Math.floor(Math.random()*prefixes.length)]
		var suffix = suffixes[Math.floor(Math.random()*suffixes.length)]
		var isAn = "aeiou".includes(prefix[0].toLowerCase())
		var an = isAn ? "An" : "A"
		var title = `${an} ${prefix} ${suffix}`
		$("#title > h1 > span").text(title)
	}

	function moveProgressBar(){
		let percentage = completedDownloads / totalDownloads * 100
		$("#loadingBar > div").css("width", percentage + "%")
	}

	let totalDownloads = 0
	let completedDownloads = 0
	let remainingDownloads = []
	downloads = {}
	function download(url, name){
		if (!remainingDownloads.includes(name)){
			totalDownloads++
			remainingDownloads.push(name)
		}

		moveProgressBar()
		
		$.ajax({
			url: url,
			success: function(data){
				downloads[name] = data.data
				remainingDownloads.splice(remainingDownloads.indexOf(name), 1)
				completedDownloads++
				readyStartButton()
			},
			error: function(){
				download(url, name)
			}
		})
	}

	function setFromCode(code){
		return downloads.sets.find(set => set.code === code)
	}

	function readyStartButton(){
		moveProgressBar()
		if (remainingDownloads.length === 0){
			addElementsBehindTheScenes()
			setTimeout(function(){
				$("#loadingBar").css("opacity", "0%")
			}, 1000)
			$("#startButton").attr("disabled", false).click(startGame)
		}
	}

	function addElementsBehindTheScenes(){
		let cards = downloads.cards
		let names = Object.keys(cards)
		names.sort((a, b) => {
			let aRank = cards[a][0].edhrecRank ?? Infinity
			let bRank = cards[b][0].edhrecRank ?? Infinity
			return aRank - bRank
		})
		cardNames = names

		for (let name of names){
			let card = cards[name]
			for (let face of card){
				if (!face.printings) continue
				face.printings.sort((a, b) => {
					let aSet = setFromCode(a)
					let bSet = setFromCode(b)
					let aDate = new Date(aSet.releaseDate)
					let bDate = new Date(bSet.releaseDate)
					return aDate - bDate
				})
				firstPrintings[face.name] = face.firstPrinting ?? face.printings[0]
			}

			settingChoiceLists["everything"].push(name)
			if (card[0].legalities["standard"] === "Legal"){
				settingChoiceLists["standard"].push(name)
			}
		}

		downloads.sets.sort((a, b) => {
			let aSet = setFromCode(a.code)
			let bSet = setFromCode(b.code)
			let aDate = new Date(aSet.releaseDate)
			let bDate = new Date(bSet.releaseDate)
			return aDate - bDate
		})
		let sets = downloads.sets
		
		shownSets = sets.filter(set => {
			if (!set.keyruneCode) return false
			if (set.keyruneCode === "DEFAULT") return false
			if (set.keyruneCode === "PMEI") return false
			if (SETTYPESRANKING.indexOf(set.type) === -1) return false
			if (SETTYPESRANKING.indexOf(set.type) > 10) return false

			return true
		})

		let setList = $("#sets")
		for (let set of shownSets){
			let setName = set.name
			let setTag = $(`
			<div class='set'
				data-value='${set.code}'>
				<i class='ss ss-${set.keyruneCode.toLowerCase()}'></i>
			</div>`)
			setTag.attr('title', setName)
			setList.append(setTag)
			set.element = setTag
		}
	}

	function slideToSet(code, color){
		let set = setFromCode(code)
		let elem = set.element
		if (color !== undefined){
			if (color === "green"){
				elem.css("color", "var(--correct-color)")
			}
			else if (color === "yellow"){
				elem.css("color", "var(--almost-correct-color)")
			}
			else if (color === "red"){
				elem.css("color", "var(--wrong-color-visible)")
			}
			else {
				elem.css("color", color)
			}
		}
		//2em width + 0.25em side margins = 2.5em = 2em * 1.25
		let width = elem.width() * 1.25
		let clientWidth = $(window).width()
		let index = shownSets.indexOf(set)
		let offset = (index * width * -1) + (clientWidth / 2)
		$("#sets").animate({
			left: offset
		}, 1000)
	}

	function nextQuestion(){
		$("#nextQuestion").hide()
		$("#cardName").show()
		let choices = settingChoiceLists[difficulty]
		let choice = Math.floor(Math.random() * choices.length)
		answer = choices[choice]
		results = []
		console.log(answer)
	}

	function fillAutocomplete(){
		let autocomplete = $("#autocomplete")
		autocomplete.html("")
		let guess = $("#cardName").val()
		if (!guess || guess.length < 2) {
			autocomplete.hide()
			return
		}
		let possibleCards = settingChoiceLists[difficulty]
		let firstGuesses = possibleCards.filter(name => {
			return name.toLowerCase().includes(guess.toLowerCase())
		})
		let guesses = firstGuesses
		if (firstGuesses.length < 20){
			let results = stringSimilarity.findBestMatch(guess, possibleCards)
			let ratings = results.ratings
			.filter(rating => {
				return !guesses.includes(rating.target)
			})
			.sort((a, b) => {
				return b.rating - a.rating
			}).slice(0, 20 - firstGuesses.length)
			guesses = firstGuesses.concat(ratings.map(r => r.target))
		}
		for (let guessName of guesses){
			let newTag = $(`<li>${guessName}</li>`)
			newTag.click(selectAutocomplete)
			autocomplete.append(newTag)
		}
		autocomplete.show()
	}

	function selectAutocomplete(event){
		let target = event.delegateTarget
		$("#cardName").val(target.textContent)
		submitAnswer()
	}

	function endRound(){
		$("#nextQuestion").show()
		$("#cardName").hide()
	}

	function submitAnswer(){
		let guess = $("#cardName").val()
		if (!guess) return
		lastGuess = guess
		$("#cardName").val("")
		$("#autocomplete").hide()
		let possibleCards = settingChoiceLists[difficulty]
		let results = stringSimilarity.findBestMatch(guess, possibleCards)
		let bestMatch = results.bestMatch.target
		let cards = downloads.cards
		let card = cards[bestMatch]
		showResultsFrom(card)
		
		if (bestMatch === answer){
			alert("You win!")
			endRound()
		}
		else {
			lives--
			if (lives === 0){
				alert("You lose!")
				endRound()
			}
			else {
				$("#lives > span").html(lives)
			}
		}
	}

	function matchPercent(arr1, arr2){
		let a = arr1.filter(c => arr2.includes(c)).length / arr2.length
		if (isNaN(a)) a = 100
		let b = arr2.filter(c => arr1.includes(c)).length / arr1.length
		if (isNaN(b)) b = 100
		return Math.min(a, b) * 100
	}

	let results = []
	function showResultsFrom(card){
		let cards = downloads.cards
		let correctCard = cards[answer]
		let tbody = $("#results > table > tbody")
		let guess = card[0]
		let correct = correctCard[0]
		console.log(card, correctCard)

		let row = $(`<tr></tr>`)
		results.push(row)
		tbody.prepend(row)
		let html, tag

		if (guess.name === answer){
			html = `<td class='correct'>${results.length}</td>`
		}
		else {
			html = `<td>${results.length}</td>`
		}
		
		row.append(html)

		if (guess.name === answer){
			html = `<td class='correct'>${guess.name}</td>`
		}
		else {
			html = `<td>${guess.name}</td>`
		}
		row.append(html)

		if (guess.manaValue === correct.manaValue){
			html = `<td class='correct'>
				<span>
					<i class='ms ms-cost ms-${guess.manaValue}'></i>
				</span>
			</td>`
		}
		else {
			let direction = guess.manaValue > correct.manaValue ? "down" : "up"
			let difference = Math.abs(guess.manaValue - correct.manaValue)
			let classes = direction + (difference === 1 ? " almost-correct" : "")
			html = `<td class='${classes}'>
				<span>
					<i class='ms ms-cost ms-${guess.manaValue}'></i>
				</span>
			</td>`
		}
		row.append(html)

		let gColors = guess.colorIdentity
		let cColors = correct.colorIdentity
		let colorPercent = matchPercent(gColors, cColors)
		html = `<td></td>`
		tag = $(html)
		if (gColors.length === 0){
			tag.append("<div class='color color-c'></div>")
		}
		else {
			for (let color of gColors){
				tag.append(`<div class='color color-${color.toLowerCase()}'></div>`)
			}
		}
		if (colorPercent !== 100){
			let bar = $("<div class='closeBar'></div>")
			bar.css("background", `linear-gradient(90deg, var(--almost-correct-color) 0%, var(--almost-correct-color) ${colorPercent}%, var(--wrong-color) ${colorPercent}%, var(--wrong-color) 100%)`)
			tag.append(bar)
		}
		else {
			tag.addClass("correct")
		}
		
		row.append(tag)

		let guessSet = downloads.printings[guess.firstPrinting]
		let guessSetCard = guessSet.cards.find(c => c.name === guess.name)
		let guessRarity = guessSetCard.rarity
		let guessRarityClass = guessRarity.split(" ").join("-")
		let correctSet = downloads.printings[correct.firstPrinting]
		let correctSetCard = correctSet.cards.find(c => c.name === correct.name)
		let correctRarity = correctSetCard.rarity
		let rarities = ["common", "uncommon", "rare", "mythic"]
		html = `<td><div class='rarity rarity-${guessRarityClass}'></div></td>`
		tag = $(html)
		if (guessRarity === correctRarity){
			tag.addClass("correct")
		}
		else if (rarities.indexOf(guessRarity) < rarities.indexOf(correctRarity)){
			tag.addClass("up")
		}
		else {
			tag.addClass("down")
		}
		row.append(tag)

		let gTypes = guess.types.concat(guess.supertypes)
		let cTypes = correct.types.concat(correct.supertypes)
		let typesPercent = matchPercent(gTypes, cTypes)
		html = `<td></td>`
		tag = $(html)
		for (let type of guess.supertypes){
			tag.append(type + " ")
		}
		for (let type of guess.types){
			tag.append(type + " ")
		}
		if (typesPercent !== 100){
			let bar = $("<div class='closeBar'></div>")
			bar.css("background", `linear-gradient(90deg, var(--almost-correct-color) 0%, var(--almost-correct-color) ${typesPercent}%, var(--wrong-color) ${typesPercent}%, var(--wrong-color) 100%)`)
			tag.append(bar)
		}
		else {
			tag.addClass("correct")
		}
		row.append(tag)

		gTypes = guess.subtypes
		cTypes = correct.subtypes
		typesPercent = matchPercent(gTypes, cTypes)
		html = `<td></td>`
		tag = $(html)
		for (let type of guess.subtypes){
			tag.append(type + " ")
		}
		if (typesPercent !== 100){
			let bar = $("<div class='closeBar'></div>")
			bar.css("background", `linear-gradient(90deg, var(--almost-correct-color) 0%, var(--almost-correct-color) ${typesPercent}%, var(--wrong-color) ${typesPercent}%, var(--wrong-color) 100%)`)
			tag.append(bar)
		}
		else {
			tag.addClass("correct")
		}
		row.append(tag)
		
		html = `<td>
			<span><i class='ss ss-${guessSet.keyruneCode.toLowerCase()}'></i></span>
		</td>`
		tag = $(html)
		let guessReleaseDate = new Date(guessSet.releaseDate)
		let correctReleaseDate = new Date(correctSet.releaseDate)
		let setClosenessColor = "red"
		if (guessSet === correctSet){
			tag.addClass("correct")
			setClosenessColor = "green"
		}
		else if (guessReleaseDate.getFullYear() === correctReleaseDate.getFullYear()){
			tag.addClass("almost-correct")
			setClosenessColor = "yellow"
		}
		else {
			setClosenessColor = "red"
		}

		if (guessReleaseDate < correctReleaseDate){
			tag.addClass("up")
		}
		else if (guessReleaseDate > correctReleaseDate){
			tag.addClass("down")
		}
		row.append(tag)
		slideToSet(guessSet.code, setClosenessColor)
	}

	function startGame(){
		$("#title").fadeOut()

		difficulty = $("input[name='timeRange']:checked").val()
		nextQuestion()

		$("#quiz").fadeIn()
	}

	download("https://mtgjson.com/api/v5/AtomicCards.json", "cards")
	download("https://mtgjson.com/api/v5/SetList.json", "sets")
	download("https://mtgjson.com/api/v5/AllPrintings.json", "printings")

	$(document).ready(function(){
		funnyTitle()
		$("#title").show()

		$("#nextQuestion").click(nextQuestion)

		$("#setSection").mousedown(function(event){
			let sets = $("#sets")
			let initialX = event.clientX
			let initialOffset = parseInt(sets.css("left"), 10)
			$(document).on("mousemove", function(event){
				let x = event.clientX
				let diff = initialX - x
				let newLeft = initialOffset - diff
				sets.css("left", newLeft)
			})
			.on("mouseup", function(){
				$(document).off("mousemove").off("mouseup")
			})
		})

		$("#cardName").on("keydown", function(event){
			if (event.keyCode === 13){
				submitAnswer()
			}
			else {
				setTimeout(fillAutocomplete, 0)
			}
		}).on("focus", fillAutocomplete)
	})
})()