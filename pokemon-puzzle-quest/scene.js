function startScene(name, options){
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)
	let gameTag = $("#game")
	gameTag.html("")

	switch (name){
		case "choose-starter": {
			changeMusic("Route 201 (Day)")

			gameTag.addClass("choosing-starter")
			promise = promise//.then(() => stopSound("Route 201 (Day)"))

			gameTag.append(`<i class='bi bi-caret-left-fill left' style='opacity:0'></i>`)
			gameTag.append(`<i class='bi bi-caret-right-fill right' style='opacity:0'></i>`)

			let newChooseTag = () => {
				let chooseTag = $("<div class='choose-starter'></div>")
				let bg = $(`<img class='bg' src='src/img/bg/choose-starter.png'>`)
				chooseTag.append(`<button class='btn btn-primary confirm'>Confirm Starter</button>`)
				chooseTag.append(bg)
				chooseTag.click(() => {
					chooseTag.children(".ball:not(.active)").popover("hide")
				})
				return chooseTag
			}

			let chooseTag = newChooseTag()
			gameTag.append(chooseTag)
			
			let starterPokemon = Object.keys(pokemonData).filter(k => {
				return pokemonData[k].tags.includes("Starter")
			})
			let groups = []

			let currentIndex = 0
			const confirmChoice = pokemon => {
				chooseTag.children(".ball").popover("hide")
				delay(250).then(() => $(".popover").remove())
				let caught = new Pokemon(pokemon.name, pokemon.name, {level: 5})
				catchPokemon(caught)

				//Remove this once it works
				.then(() => {
					let caught = new Pokemon("Comfey", "Comfey", {level: 5})
					return catchPokemon(caught)
				})
				.then(() => {
					let caught = new Pokemon("Popplio", "Popplio", {level: 5})
					return catchPokemon(caught)
				})
				.then(() => {
					let caught = new Pokemon("Comfey", "Comfey", {level: 5})
					return catchPokemon(caught)
				})

				.then(resolvePromise)
			}
			const choose = (event, pokemon) => {
				let oldActive = $(".choose-starter > .ball.active")
				let target = $(event.currentTarget)
				target.toggleClass("active")
				oldActive.removeClass("active")
				let button = chooseTag.children(".confirm")
				button.off("click")
				let chosen = target.hasClass("active")
				if (chosen){
					button.fadeIn().click(() => confirmChoice(pokemon))
				} else {
					button.fadeOut()
				}
			}
			const getPopover = pokemon => {
				let html = `<div class='text-center'>${pokemon.name}
				<div>
				<img class='pokemon-image' src='${pokemon.imageSources[pokemon.name]}'>
				</div></div>`
				return html
			}
			const fillWithPokemon = () => {
				let group = groups[currentIndex]
				let tags = []
				if (!group) return
				for (let i = 0; i < group.length; i++){
					let pokemon = group[i]
					let tag = $(`<div class='ball ball-${i+1}'>
					<img src='src/img/balls/pokeball.png'>
					</div>`)
					chooseTag.append(tag)
					tags.push([tag, pokemon])

					//Now add a tiny, nearly-invisible image of that pokemon
					//(just to get the image preloaded)
					chooseTag.append(`<img class='invisible-image' src='${pokemon.imageSources[pokemon.name]}'>`)
				}

				for (let pair of tags){
					let tag = pair[0]
					let pokemon = pair[1]
					tag.click(event => choose(event, pokemon))
					tag.popover({
						placement: "top",
						trigger: "hover click",
						html: true,
						content: () => getPopover(pokemon)
					})
				}

				if (currentIndex === 0){
					$("#game > .left").removeClass("active").animate({opacity: 0})
				} else {
					$("#game > .left").addClass("active").animate({opacity: 1})
				}

				if (currentIndex === groups.length - 1){
					$("#game > .right").removeClass("active").animate({opacity: 0})
				} else {
					$("#game > .right").addClass("active").animate({opacity: 1})
				}
			}
			const changeGroup = (indexMod, firstLeft, secondLeft) => {
				currentIndex += indexMod
				chooseTag.children(".ball").popover("hide")
				chooseTag.animate({
					left: firstLeft
				}, 400).queue(function(){
					$(this).remove()
				})
				chooseTag = newChooseTag()
				chooseTag.css({
					left: secondLeft
				})
				gameTag.append(chooseTag)
				chooseTag.animate({
					left: "0"
				}, 400)
				fillWithPokemon()
			}
			const nextGroup = () => changeGroup(1, "-100%", "100%")
			const prevGroup = () => changeGroup(-1, "100%", "-100%")
			$("#game > .left").click(prevGroup)
			$("#game > .right").click(nextGroup)

			for (let i = 0; i < starterPokemon.length; i++){
				let arr = i % 3 === 0 ? [] : groups[groups.length - 1]
				if (i % 3 === 0) groups.push(arr)
				arr.push(pokemonData[starterPokemon[i]])
			}
			fillWithPokemon()
		} break
		case "route": {
			console.log(name, options)
			let routeName = options.name

			if (routeName === "Route 1"){
				changeMusic("Route 201 (Day)")
			}

			let listTag = $(`<div class='route-list'></div>`)
			let routeTag = $(`<div class='route-screen'></div>`)

			let pcBtn = $(`<div class='route-button' id='pc-button'></div>`)
			pcBtn.append(`<div class='route-button-text'>My PC</div>`)
			pcBtn.click(() => {
				changeScene("pc")
			})
			listTag.append(pcBtn)

			const getLevels = name => {
				routeTag.html("")
				let routeLevels = levelData.filter(level => {
					return level.category === name
				})
				let levelButtons = []
				routeLevels.forEach(level => {
					let btn = getLevelButtonHtml(level)
					btn.popover({
						placement: "top",
						trigger: "hover focus",
						html: true,
						content: () => getPopover(level)
					})
					levelButtons.push(btn)
					routeTag.append(btn)
				})
				levelButtons.forEach(btn => {
					$(btn).click(chooseLevel)
				})
			}
			const getPopover = level => {
				let content = $(`<div class='d-flex flex-column align-items-center justify-content-center'></div>`)
				content.append(`<div class='name'>${level.name}</div>`)
				let btn = $(`<button class='btn btn-primary'>Play Level </button>`)
				btn.append("<i class='bi bi-play-circle-fill'></i>")
				btn.click(() => confirmChoice(level))
				content.append(btn)
				return content
			}
			const confirmChoice = level => {
				$(".level-button").popover("hide")
				resolvePromise(level.id)
			}
			const chooseLevel = event => {
				let target = $(event.currentTarget)
				let id = target.attr("data-level")
				let level = levelData.find(l => l.id === id)
				let oldActive = $(".level-button.clicked")
				target.toggleClass("clicked")
				oldActive.removeClass("clicked")
				let chosen = target.hasClass("clicked")
				if (chosen){
					
				}
			}
			getLevels(routeName)

			gameTag.append(listTag)
			gameTag.append(routeTag)

			promise = promise.then(levelID => beginLevel(levelID))
		} break
		case "pc": {
			let pcBoxData
			getPlayerBoxes(playerSaveId)
			.then(val => {
				pcBoxData = val
				loadBox(0)
			})

			let pcTag = $(`<div id='pc'></div>`)
			gameTag.append(pcTag)

			let pcHeader = $(`<div id='pc-header'></div>`)
			pcTag.append(pcHeader)

			let prevBoxBtn = $(`<div id='pc-prev-box-btn' class='button' style='opacity:0'><i class='bi bi-caret-left-fill'></i></div>`)
			pcHeader.append(prevBoxBtn)
			let boxName = $(`<div id='pc-box-name'></div>`)
			pcHeader.append(boxName)
			let nextBoxBtn = $(`<div id='pc-next-box-btn' class='button'><i class='bi bi-caret-right-fill'></i></div>`)
			pcHeader.append(nextBoxBtn)

			let pcBox = $(`<div id='pc-box'></div>`)
			pcTag.append(pcBox)

			const pcTick = () => {

			}
			let pcInterval = setInterval(pcTick, 10)

			let currentBox = null
			let currentBoxPokemon = []
			const loadBox = index => {
				let box = pcBoxData[index]
				displayBox(box)
			}
			const displayBox = box => {
				currentBox = box
				let theme = boxThemeData[box.theme]
				if (!theme) return
				boxName.css({
					"background-image": `url(${theme.header})`,
					"color": theme.color
				})
				boxName.text(box.name)
				pcBox.css({
					"background-image": `url(${theme.body})`
				})

				getPokemonFromBox(box.uuid)
				.then(pokemonList => {
					pcBox.html("")
					currentBoxPokemon.splice(0, currentBoxPokemon.length)
					pokemonList.forEach(p => {
						let pokemon = new Pokemon(p.name, p.pokemonName, p)
						currentBoxPokemon.push(pokemon)
						displayPokemon(pokemon)
					})
					updatePCButtons()
				})
			}
			const displayPokemon = p => {
				let pokemon = new Pokemon(p.name, p.pokemonName, p)
				let images = pokemon.data.imageSources
				let source = images["home"] ?? images[pokemon.pokemonName]
				let img = $(`<img class='pokemon-image'>`)
				img.attr("src", source)
				img.attr("data-pokemon-id", pokemon.uuid)
				img.css({
					top: (pokemon.pcBoxY * 100) + "%",
					left: (pokemon.pcBoxX * 100) + "%",
					height: "10%"
				})
				pcBox.append(img)
				img.on("mousedown", handleMouseDown2)
			}

			let adminTag = $(`<div id='pc-admin'></div>`)
			gameTag.append(adminTag)

			let activePokemonTag = $(`<div
				class='active-pokemon-container row justify-content-center align-items-center'></div>`)
			adminTag.append(activePokemonTag)

			let allBoxes
			let allImages
			const updateBoxes = () => {
				activePokemonTag.html("")
				for (let i = 0; i < 6; i++){
					let container = $(`<div class='active-pokemon-box col col-5'></div>`)
					let p = playerActivePokemon[i]
					container.attr("data-index", i)
					if (p){
						container.attr("data-pokemon-id", p.uuid)
						let sources = p.data.imageSources
						let image = sources["home"] ?? sources[p.pokemonName]
						let img = $(`<img src='${image}' class='pokemon-image'>`)
						img.css("opacity", 1)
						container.append(img)
						container.css("cursor", "pointer")
					}
					container.on("mousedown", handleMouseDown)
					activePokemonTag.append(container)
				}
				allBoxes = activePokemonTag.children(".active-pokemon-box")
				allImages = allBoxes.children(".pokemon-image")
				allImages.on("mousedown", function(event){
					event.preventDefault()
				})
			}
			const updatePCButtons = () => {
				let index = pcBoxData.indexOf(currentBox)
				if (index === 0){
					prevBoxBtn.css({
						"pointer-events": "none"
					})
					.animate({opacity: 0})
				} else {
					prevBoxBtn.css({
						"pointer-events": ""
					})
					.animate({opacity: 1})
				}
				if (index === pcBoxData.length - 1){
					nextBoxBtn.children(".bi").removeClass("bi-caret-right-fill")
					.addClass("bi-plus")
				} else {
					nextBoxBtn.children(".bi").removeClass("bi-plus")
					.addClass("bi-caret-right-fill")
				}
			}
			const nextPCBox = () => {
				let index = pcBoxData.indexOf(currentBox)
				if (index < pcBoxData.length - 1){
					loadBox(index + 1)
				} else {
					//Make a new box
					makeNewBox(playerSaveId, `Box ${pcBoxData.length + 1}`)
					.then(() => getPlayerBoxes(playerSaveId))
					.then(val => {
						pcBoxData = val
						loadBox(index + 1)
						updatePCButtons()
					})
				}
			}
			nextBoxBtn.click(nextPCBox)
			const prevPCBox = () => {
				let index = pcBoxData.indexOf(currentBox)
				if (index > 0){
					loadBox(index - 1)
				}
			}
			prevBoxBtn.click(prevPCBox)

			let holdInterval
			let heldPokemon = null
			let heldPokemonTag = null

			const handleMouseDown = (event) => {
				let box = $(event.currentTarget)
				let id = box.attr("data-index")
				let index = parseInt(id)
				let p = playerActivePokemon[index]
				stopHolding()
				if (!p) return
				delay(100).then(() => {
					if (!mouse.isDown){
						let alreadySelected = box.hasClass("selected")
						allBoxes.removeClass("selected")
						if (!alreadySelected){
							box.addClass("selected")
							viewPokemonInfo(p)
							.then(() => box.removeClass("selected"))
						}
					} else {
						if (p){
							heldPokemon = playerActivePokemon[index]
							beginHolding(heldPokemon)
							box.children("img").hide()
						}
					}
				})
			}
			const handleMouseDown2 = (event) => {
				event.preventDefault()
				let box = $(event.currentTarget)
				let id = box.attr("data-pokemon-id")
				let p = currentBoxPokemon.find(p => p.uuid === id)
				stopHolding()
				if (!p) return
				// console.log(p)
				delay(100).then(() => {
					if (!mouse.isDown){
						viewPokemonInfo(p)
					} else {
						heldPokemon = p
						beginHolding(heldPokemon)
						box.hide()
					}
				})
			}
			const beginHolding = pokemon => {
				$("#pokemon-dragger").remove()
				let tag = $(`<img id='pokemon-dragger'>`)
				tag.css("opacity", 0)
				heldPokemonTag = tag
				let sources = pokemon.data.imageSources
				let image = sources["home"] ?? sources[pokemon.pokemonName]
				tag.attr("src", image)
				$("body").append(tag)
				.css("cursor", "pointer")
				holdInterval = setInterval(dragPokemon, 10)
			}
			const dragPokemon = () => {
				if (!mouse.isDown){
					stopHolding()
				}
				if (!heldPokemonTag) return
				heldPokemonTag.css({
					opacity: 1,
					left: mouse.x,
					top: mouse.y
				})
			}
			const stopHolding = () => {
				clearInterval(holdInterval)
				if (!heldPokemon) return
				if (heldPokemonTag){
					heldPokemonTag.remove()
				}
				
				$("body").css({
					cursor: ""
				})

				//Were we hovering over an active pokemon slot?
				let hovered = document.elementsFromPoint(mouse.x, mouse.y)
				let hoveredActiveBox = [...hovered].find(elem => $(elem).hasClass("active-pokemon-box"))
				let hoveredBox = [...hovered].find(elem => elem === pcBox[0])
				if (hoveredActiveBox){
					let index = $(hoveredActiveBox).attr("data-index")
					if (index){
						swapActivePokemon(heldPokemon, parseInt(index))
					}
				} else if (hoveredBox){
					let offset = pcBox.offset()
					let left = mouse.x - offset.left
					let top = mouse.y - offset.top
					left = left / pcBox.width()
					top = top / pcBox.height()
					heldPokemon.pcBox = currentBox.uuid
					heldPokemon.pcBoxX = left
					heldPokemon.pcBoxY = top
					
					let boxIndex = currentBoxPokemon.indexOf(heldPokemon)
					if (boxIndex !== -1){
						currentBoxPokemon.splice(boxIndex, 1)
					}

					let index = playerActivePokemon.indexOf(heldPokemon)
					if (index !== -1){
						playerActivePokemon[index] = undefined
					}

					currentBoxPokemon.push(heldPokemon)
					savePokemon(heldPokemon)
					.then(() => loadBox(pcBoxData.indexOf(currentBox)))
				} else {

				}
				heldPokemonTag = null
				heldPokemon = null
				updateBoxes()
			}
			const swapActivePokemon = (p1, index) => {
				let p2 = playerActivePokemon[index]
				let p1Index = playerActivePokemon.indexOf(p1)
				playerActivePokemon[index] = p1
				if (p1Index !== -1){
					playerActivePokemon[p1Index] = undefined
				}
				p1.pcBox = null
				p1.pcBoxX = null
				p1.pcBoxY = null
				savePokemon(p1)
				if (p2){
					playerActivePokemon[p1Index] = p2
					savePokemon(p2)
				}
			}

			updateBoxes()

			let confirmButton = $(`<button class='btn btn-primary mt-3'>Confirm</button>`)
			adminTag.append(confirmButton)
			confirmButton.click(() => {
				clearInterval(pcInterval)
				clearInterval(holdInterval)
				changeScene("route", {name: "Route 1"})
			})
		} break
		default: {
			console.warn("What scene??", name)
			console.trace()
		}
	}
	return promise
}

function changeScene(name, options){
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)
	let gameTag = $("#game")
	$(".popover").fadeOut().queue(function(){$(this).remove()})
	let toHide = gameTag.css("display") === "none" ? $("#board") : gameTag

	toHide.fadeOut(() => {
		gameTag.html("")
		gameTag.removeClass("choosing-starter")
		resolvePromise()
		gameTag.fadeIn()
	})
	if (name){
		promise = promise.then(() => startScene(name, options))
	}
	return promise
}

function catchPokemon(pokemon){
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)

	pokemon.owner = playerSaveId
	caughtPokemon.push(pokemon)
	if (playerActivePokemon.length < 6){
		playerActivePokemon.push(pokemon)
	} else {
		let lastBox = playerPCBoxes[playerPCBoxes.length - 1]
		pokemon.pcBox = lastBox.uuid
		pokemon.pcBoxX = Math.random()
		pokemon.pcBoxY = Math.random()
	}

	//Later, asking to rename pokemon whenever you catch one should be optional.
	//TODO
	askToRenamePokemon(pokemon)
	.then(() => savePokemon(pokemon))
	.then(() => resolvePromise())

	return promise
}

function askToRenamePokemon(pokemon){
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)
	let modal = $("#modal")
	let pokemonName = pokemon.pokemonName
	let image = pokemon.data.imageSources[pokemonName]

	clearModal(modal)

	modal.find(".modal-title").text(`What would you like to name your ${pokemonName}?`)
	let innerStuff = $(`<div class='container d-flex'></div>`)
	innerStuff.append(`<div class='col col-3'><img class='pokemon-image' src='${image}'></div>`)
	innerStuff.append(`<div class='col col-9 d-flex flex-column justify-content-center align-items-center'>
		<input type='text' required value='${pokemonName}'>
		<button class='btn btn-primary confirm'>Submit</button>
	</div>`)
	let body = modal.find(".modal-body")
	body.append(innerStuff)

	body.find(".btn.confirm").click(() => {
		pokemon.name = body.find("input").val()
		modal.modal("hide")
	})

	modal.on("hidden.bs.modal", () => {
		resolvePromise()
	})

	modal.modal("show")
	return promise
}

let currentLevelProgress
function beginLevel(levelID){
	let level = levelData.find(l => l.id === levelID)
	if (level.music){
		changeMusic(level.music)
	}
	$("#game").fadeOut()
	$("#board").fadeIn()

	currentLevelProgress = {
		id: levelID,
		level: level,
		effects: level.effects,
		effectIndex: 0
	}

	let promise = advanceCurrentLevel()
	.then((val) => {
		console.log(val)
		if (val === "lose"){
			console.log("You lose :(")
		} else {
			level.status = "won"
			saveLevelStatus(level, "won")
		}
		return changeScene("route", {name: "Route 1"})
	})
	
	return promise
}
function advanceCurrentLevel(){
	let promise
	let level = currentLevelProgress.level
	let effects = currentLevelProgress.effects
	let effectIndex = currentLevelProgress.effectIndex
	let effect = effects[effectIndex]
	let trainerData = level.trainers[0]

	switch (effect.type){
		case "fight": {
			promise = beginRound(trainerData)
			let result
			
			let NPCData = NPCTrainerData[trainerData.name] ?? {}
			//If the opponent is wild
			if (!NPCData.type){
				
			}
		} break
	}

	if (effects[effectIndex + 1]){
		promise = promise.then(val => {
			return advanceCurrentLevel()
		})
	} else {
		promise = promise.then(val => {
			console.log("Finished level :)")
		})
	}

	return promise
}

function choosePokemon(message, pokemon, minChooseable=1, maxChooseable=1){
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)

	let modal = $("#modal")
	clearModal(modal)
	modal.addClass("wide")
	modal.find(".modal-title").text(message)
	let btn = $(`<button class='btn btn-primary'>Confirm</button>`)
	modal.find(".modal-footer").append(btn)

	let chosen = []

	const choose = (i) => {
		if (chosen.includes(i)){
			let index = chosen.indexOf(i)
			chosen.splice(index, 1)
		} else {
			chosen.push(i)
			if (chosen.length > maxChooseable){
				let unchosenI = chosen.shift()
			}
		}
		
		container.children().children(".chooseable").removeClass("active")
		for (let j = 0; j < chosen.length; j++){
			container.children().children("[data-choose="+chosen[j]+"]").addClass("active")
		}

		checkLegality()
	}
	const checkLegality = () => {
		if (chosen.length >= minChooseable && chosen.length <= maxChooseable){
			btn.attr("disabled", false)
		} else {
			btn.attr("disabled", true)
		}
	}

	let body = modal.find(".modal-body")
	let container = $(`<div class='d-flex flex-wrap justify-content-between container'></div>`)
	for (let i = 0; i < pokemon.length; i++){
		let p = pokemon[i]
		let box = $(`<div class='col col-6'></div>`)
		let chooseable = $(`<div class='chooseable m-1' data-choose='${i}'></div>`)
		chooseable.html(`
			<div class='row mb-3'>
				<div class='col d-flex flex-column justify-content-center'>
					<p>${p.name}</p>
				</div>
				<div class='col text-end'>
					<img class='pokemon-image' src='${p.data.imageSources[p.pokemonName]}'>
				</div>
			</div>
			<div class='health-bar'>
				<div class='bar'></div>
				<span>${p.hp} / ${p.maxhp}</span>
			</div>
		`)
		let barContainer = chooseable.children(".health-bar")
		let bar = barContainer.children(".bar")
		let healthP = p.hp / p.maxhp
		let color = getHealthColor(healthP)
		bar.css("width", healthP * 100 + "%")
		bar.css("background-color", color)
		box.append(chooseable)
		chooseable.click(function(event){
			let chosen = $(event.currentTarget).attr("data-choose")
			choose(parseInt(chosen))
		})
		container.append(box)
	}
	body.append(container)
	if (minChooseable > 0){
		choose(0)
	}
	checkLegality()

	modal.modal("show")
	btn.click(() => {
		modal.modal("hide")
	})
	modal.on("hidden.bs.modal", () => {
		resolvePromise(chosen.map(i => pokemon[i]))
	})
	return promise
}
function viewPokemonInfo(pokemon){
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)

	let modal = $("#modal")
	clearModal(modal)
	modal.modal("show")
	modal.addClass("wide").addClass("summary")
	modal.find(".modal-title").text(pokemon.name)
	let btn = $(`<button class='btn btn-primary'>Done</button>`)
	modal.find(".modal-footer").append(btn)

	let sources = pokemon.data.imageSources
	let image = sources[pokemon.pokemonName]
	let content = $(`
		<div class='pokemon-info d-flex justify-content-between align-center'>
			<div class='pokemon-section'>
				<div class='image text-center'>
					<img src='${image}' class='pokemon-image'>
				</div>
			</div>
			<div class='move-section'>
			</div>
		</div>
	`)
	modal.find(".modal-body").html(content)
	let statsHTML = getStatsHTML(pokemon, false)
	content.children(".pokemon-section").append(statsHTML)

	const toggleSelect = (move, moveTag) => {
		let activeIndex = pokemon.activeMoves.indexOf(move)
		if (activeIndex === -1){
			if (pokemon.activeMoves.length >= 4){
				createAnnouncement("general", "A Pokemon can't have more than 4 active moves.")
			} else {
				pokemon.activeMoves.push(move)
				moveTag.addClass("active-move")
			}
		} else {
			if (pokemon.activeMoves.length === 1){
				createAnnouncement("general", "A Pokemon must have at least 1 active move.")
			} else {
				pokemon.activeMoves.splice(activeIndex, 1)
				moveTag.removeClass("active-move")
			}
		}
	}

	let moveSection = content.children(".move-section")
	for (let i = 0; i < pokemon.moves.length; i++){
		let move = pokemon.moves[i]
		if (move.name === "Struggle") continue
		let moveTag = getMoveHTML(move, true)
		let available = pokemon.movesUnlockedMap[i]
		if (!available){
			moveTag.addClass("unavailable")
			moveTag.popover({
				placement: "left",
				trigger: "hover",
				content: getReasonPokemonDoesntMeetRequirements(pokemon, move)
			})
		} else {
			moveTag.css("cursor", "pointer")
			moveTag.click(function(){
				toggleSelect(move, moveTag)
			})
		}

		let activeIndex = pokemon.activeMoves.indexOf(move)
		if (activeIndex !== -1){
			moveTag.addClass('active-move')
		}

		moveSection.append(moveTag)
	}
	content.append(moveSection)

	btn.click(() => {
		modal.modal("hide")
	})
	modal.on("hidden.bs.modal", () => {
		moveSection.children(".move").popover("hide")
		savePokemon(pokemon)
		.then(() => resolvePromise())
	})
	return promise
}

function getStatsHTML(pokemon, abbreviate=true){
	let stats = $(`<div class='stats'></div>`)
	for (let stat in pokemon.data.stats){
		let statName = abbreviate ? getStatAbbr(stat) : getStatName(stat)
		let val = pokemon.getStat(stat)
		let effectiveVal = pokemon.getEffectiveStat(stat)
		let statTag = $("<div class='stat'></div>")
		statTag.append(`<span class='stat-name'>${statName}</span>`)
		let statVal = $("<span class='stat-val'></span>")

		if (val > effectiveVal){
			statVal.addClass("down")
			.append("<i class='bi bi-arrow-down'></i>")
		} else if (val < effectiveVal){
			statVal.addClass("up")
			.append("<i class='bi bi-arrow-up'></i>")
		}

		statVal.append(effectiveVal.toFixed(0))
		statTag.append(statVal)
		stats.append(statTag)
	}
	return stats
}

function getMoveHTML(move, useLongDescription=false){
	let tag = $("<div class='move'></div>")
	
	let moveTop = $("<div class='move-top'></div>")
	moveTop.append(`<div class='move-name'>${move.name}</div>`)
	let moveType = $(`<div class='move-type'></div>`)
	let moveRecharge = $(`<div class='move-recharge'></div>`)
	moveRecharge.append(`<img src='src/img/recharge.png'>`)
	moveRecharge.append(`<div class='count'>0</div>`)
	moveType.append(moveRecharge)
	moveRecharge.hide()
	let typeIcon = getTypeIcon(move.type)
	moveType.append(`<img src='${getTypeIcon(move.category)}'>`)
	if (typeIcon){
		moveType.append(`<img src='${typeIcon}'>`)
	}
	moveTop.append(moveType)
	tag.append(moveTop)

	let desc = useLongDescription ? move.description : move.shortDescription
	tag.append(`<div class='move-desc'>${desc}</div>`)

	let moveCostTag = $("<div class='move-cost'></div>")
	if (!move.specialCost){
		for (let i = 0; i < colors.length; i++){
			let color = colors[i]
			let cost = $("<div class='cost-part energy'></div>")
			cost.addClass("energy-"+color)
			cost.attr("data-cost", color)

			if (move.energy[color] !== undefined){
				let icon = $("<span class='icon'></span>")
				cost.append(icon)
				cost.append(`<span class='cost'>${move.energy[color]}</span>`)
			}
			
			moveCostTag.append(cost)
		}
	}
	tag.append(moveCostTag)
	return tag
}