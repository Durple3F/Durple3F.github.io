var SetList, AllPrintings, currentSet, currentSetCode
var AllPrintingsIdMap = {}
var SetData = {}
var ScryfallData = {}
var CollectionData = {}
var packsOpened = 0
var dollarsSpent = 0
var dollarsEarned = 0

$.getJSON({
	url: "https://mtgjson.com/api/v5/AllPrintings.json",
	success: res => {
		AllPrintings = res.data
		AllPrintingsIdMap = {}
		for (let set in AllPrintings){
			let cards = AllPrintings[set].cards
			for (let card of cards){
				AllPrintingsIdMap[card.uuid] = card
			}
		}
		updateDataStatus()
	}
})

$.getJSON({
	url: "https://mtgjson.com/api/v5/SetList.json",
	success: function(res){
		SetList = res.data.sort((a, b) => {
			let aDate = new Date(a.releaseDate)
			let bDate = new Date(b.releaseDate)
			return bDate - aDate
		})
		for (let i in SetList){
			let set = SetList[i]
			if (set.type === "promo") continue
			if (set.type === "commander") continue
			if (set.type === "masterpiece") continue
			if (set.baseSetSize <= 50) continue
			$("#set-list").append(`<option value="${set.name}">`)
			$("#set-list").append(`<option value="${set.code}">`)
		}
		$("#set-selector").on("submit", getSetInfo)

		updateDataStatus()
	}
})

function updateDataStatus(){
	if (AllPrintings && SetList){
		$("#data-status").removeClass("error").html("Downloaded all data!")
		setTimeout(function(){
			$("#data-status").fadeOut(250)
		}, 500)
		$("#set-selector").show()
	}
}

function getSetInfo(e){
	if (!AllPrintings) return
	e.preventDefault()
	$("#settings").hide()
	let code = $("#set-code").val()
	let validSets = SetList.filter(s => {
		return s.name === code || s.code === code.toUpperCase()
	})
	if (!validSets.length){
		$("#pack-selector").html("<div class='error'>That set doesn't exist, I'm pretty sure.</div>")
		return
	}
	code = validSets[0].code

	if (SetData[code]){
		loadSetInfo(code)
	}
	else {
		$.getJSON({
			url: `https://mtgjson.com/api/v5/${code}.json`,
			success: function(response){
				SetData[code] = response.data
				loadSetInfo(code)
			},
			error: function(){
				$("#pack-selector").html("<div class='error'>There was a problem getting that set</div>")
			}
		})
	}
}
function getScryfallData(code){
	ScryfallData[code] = {
		complete: false,
		cards: [],
		images: []
	}
	function handle_next_page(res){
		if (res.has_more){
			$.getJSON({
				url: res.next_page
			}).then(handle_next_page)
		}
		else {
			ScryfallData[code].complete = true
		}

		for (let card of res.data){
			ScryfallData[code].cards.push(card)
			
			if (card.image_uris){
				let image = new Image()
				image.src = card.image_uris.normal
				ScryfallData[code].images.push(image)
			}
			else if (card.card_faces){
				for (let face of card.card_faces){
					if (face.image_uris){
						let image = new Image()
						image.src = face.image_uris.normal
						ScryfallData[code].images.push(image)
					}
				}
			}
			else {
				console.log(card)
			}
		}
	}

	$.getJSON({
		url: "https://api.scryfall.com/sets/"+code
	}).then(res => $.getJSON({
		url: res.search_uri
	})).then(handle_next_page)
}
function loadSetInfo(code){
	$("#settings").show()
	let data = SetData[code]
	currentSetCode = code
	currentSet = data
	if (!data.booster){
		$("#pack-selector").html(`<div class='error'>That set doesn't have any packs :(</div>`)
		return
	}
	let boosters = data.booster
	$("#pack-selector").html("")
	let productHtml = `<select id='selected-product'>`
	for (let i in data.sealedProduct){
		let type = data.sealedProduct[i]
		let name = type.name
		let option = `<option value="${i}">${name}</option>`
		productHtml += option
	}
	productHtml += "</select><button id='open-product'>Open</button>"
	$("#pack-selector").html(productHtml)
	$("#open-product").click(displayProduct)
	
	let representedCardIds = {}
	for (let type in boosters){
		let sheets = boosters[type].sheets
		for (let sheetName in sheets){
			let sheet = sheets[sheetName]
			for (let id in sheet.cards){
				representedCardIds[id] = true
			}
		}
	}
	let cardsInSet = Object.keys(representedCardIds)
	
	let representedSets = []
	for (let id of cardsInSet){
		let card = AllPrintingsIdMap[id]
		if (!representedSets.includes(card.setCode)){
			representedSets.push(card.setCode)
		}
	}
	for (let set of representedSets){
		getScryfallData(set)
	}
}

function openPack(type, setCode){
	packsOpened++
	const set = SetData[setCode.toUpperCase()]
	const pack = set.booster[type]
	const boosterType = weightedRandomPackType(pack.boosters)
	let contents = boosterType.contents
	let order = []
	if (contents.basic) order.push("basic")
	if (contents.common) order.push("common")
	if (contents.uncommon) order.push("uncommon")
	if (contents.rare) order.push("rare")
	if (contents.mythicRare) order.push("mythicRare")
	for (let contentType in contents){
		if (!order.includes(contentType)){
			order.push(contentType)
		}
	}
	let result = []
	let foilResults = []
	
	for (let t of order){
		let sheet = pack.sheets[t]
		let amount = contents[t]
		let colorsUsed = {
			W:0,U:0,B:0,R:0,G:0
		}
		let colorBalanced = sheet.balanceColors
		for (let i = 0; i < amount; i++){
			let newCardId = weightedRandomCard(sheet, colorBalanced, colorsUsed)
			result.push(newCardId)
			foilResults.push(!!sheet.foil)
		}
	}

	let final = []
	for (let i in result){
		final.push({
			card: result[i],
			foil: foilResults[i]
		})
	}
	return final
}

function openProduct(product, set){
	const allCards = []

	if (!product) return
	let contents = product.contents
	if (contents.pack){
		for (let i = 0; i < contents.pack.length; i++){
			let pack = contents.pack[i]
			let packContents = openPack(pack.code, pack.set)
			for (let c of packContents){
				allCards.push(c)
			}
		}
	}
	if (contents.sealed){
		for (let i = 0; i < contents.sealed.length; i++){
			let content = contents.sealed[i]
			let containedProduct = set.sealedProduct.find(c => {
				return c.name === content.name
			})
			for (let j = 0; j < content.count; j++){
				let results = openProduct(containedProduct, set)
				for (let k = 0; k < results.length; k++){
					allCards.push(results[k])
				}
			}
		}
	}

	return allCards
}

function displayProduct(){
	const productIndex = $("#selected-product").val()
	const product = currentSet.sealedProduct[productIndex]
	const allCards = openProduct(product, currentSet)

	let resultHtml = `<table>
		<thead>
			<th width='8%'>#</th>
			<th>Name</th>
			<th width='8%'>Foil?</th>
			<th width='8%'>Price</th>
			<th width='16%'>Collected</th>
		</thead>
		<tbody>`
	for (let i in allCards){
		let obj = allCards[i]
		let id = obj.card
		let cardCollectionData = CollectionData[id]
		if (!cardCollectionData){
			CollectionData[id] = {
				count: 1
			}
			cardCollectionData = CollectionData[id]
		} else {
			cardCollectionData.count++
		}

		let isFoil = obj.foil
		let card = AllPrintingsIdMap[id]

		let cardName = card.faceName || card.name
		let setCode = card.setCode
		let price = ""
		let scryfallSet = ScryfallData[setCode]
		if (scryfallSet && scryfallSet.complete){
			let scryfallCard = scryfallSet.cards.find(c => {
				return c.name === card.name
			})
			if (scryfallCard){
				price = scryfallCard.prices.usd || ""
			}
			else {
				console.log(cardName)
			}
		}

		let rarity = card.rarity
		let rarityClass = ""
		if (rarity === "common" || rarity === "basic"){
			rarityClass = "common"
		}
		else if (rarity === "uncommon"){
			rarityClass = "uncommon"
		}
		else if (rarity === "rare"){
			rarityClass = "rare"
		}
		else if (rarity === "mythic"){
			rarityClass = "mythic"
		}
		let isNew = cardCollectionData.count === 1 ? "new" : ""

		let rowHtml = `<tr class="card-row ${rarityClass}">
			<td>${card.number}</td>
			<td>${cardName}</td>
			<td>${isFoil}</td>
			<td>$${price}</td>
			<td class="${isNew}">${cardCollectionData.count}</td>
		</tr>`

		resultHtml += rowHtml
	}
	resultHtml += "</tbody></table>"
	$("#pack").html(resultHtml)
}

function weightedRandomPackType(list){
	if (!list || !list.length){
		console.error("Weighted random function received a nonexistent or empty list", list)
	}

	const cumulativeWeights = []
	for (let i = 0; i < list.length; i++) {
		cumulativeWeights[i] = list[i].weight + (cumulativeWeights[i - 1] || 0)
	}
	const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1]
	const randomNumber = maxCumulativeWeight * Math.random()

	for (let itemIndex = 0; itemIndex < list.length; itemIndex++) {
		if (cumulativeWeights[itemIndex] >= randomNumber) {
			return list[itemIndex]
		}
	}
}

function weightedRandomCard(sheet, colorBalanced, colorUse){
	if (colorBalanced){
		var minColors = []
		var maxColors = []
		let minColorUse = Infinity
		let maxColorUse = 0
		for (let color in colorUse){
			let use = colorUse[color]
			if (use < minColorUse) minColorUse = use
			if (use > maxColorUse) maxColorUse = use
		}
		if (maxColorUse - minColorUse >= 1){
			for (let color in colorUse){
				let use = colorUse[color]
				if (use === minColorUse) minColors.push(color)
				if (use === maxColorUse) maxColors.push(color)
			}
		}
	}
	const cumulativeWeights = []
	const cards = sheet.cards
	const cardIds = Object.keys(cards)
	if (colorBalanced){
		for (let i = 0; i < cardIds.length; i++) {
			let id = cardIds[i]
			let card = AllPrintingsIdMap[id]
			let colors = card.colors
			let canUse = false
			//If we have to care about color representation, make sure that the current card either
			// DOESN'T contain any overrepresented colors or DOES contain an underrepresented color.
			if (minColors.length){
				for (let color of minColors){
					if (colors.includes(color)){
						canUse = true
						break
					}
				}
				if (!canUse){
					let doesntContain = true
					for (let color of maxColors){
						if (colors.includes(color)){
							doesntContain = false
						}
					}
					if (doesntContain){
						canUse = true
					}
				}
			}
			else {
				canUse = true
			}
			let weight = canUse ? cards[id] : 0
			cumulativeWeights[i] = weight + (cumulativeWeights[i - 1] || 0)
		}
	}
	else {
		for (let i = 0; i < cardIds.length; i++) {
			cumulativeWeights[i] = cards[cardIds[i]] + (cumulativeWeights[i - 1] || 0)
		}
	}
	
	const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1]
	const randomNumber = maxCumulativeWeight * Math.random()

	for (let itemIndex = 0; itemIndex < cardIds.length; itemIndex++) {
		if (cumulativeWeights[itemIndex] >= randomNumber) {
			return cardIds[itemIndex]
		}
	}
}