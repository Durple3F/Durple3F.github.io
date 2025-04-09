let currentSceneInfo = {}
function startScene(name, options){
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)
	let gameTag = $("#game")
	let gameIsHidden = $("#game").css("display") === "none"
	gameTag.empty()

	currentSceneInfo.name = name
	currentSceneInfo.options = options

	const fadeInGame = () => {
		if (gameIsHidden){
			gameTag.fadeIn()
			gameTag.css("opacity", "0")
		}
	}

	switch (name){
		case "fight": {
			//This is all handled by the level effects.
			//This one's just here in case I need it later.
			if (!gameIsHidden){
				gameTag.fadeOut()
			}
		} break
		case "choose-starter": {
			if (gameIsHidden){
				gameTag.fadeIn()
			}
			changeMusic("Route 201 (Day)")

			gameTag.addClass("choosing-starter")
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
				chooseTag.find(".ball").popover("dispose")
				delay(250).then(() => $(".popover").remove())
				let caught = new Pokemon(pokemon.name, pokemon.id, {level: 5})
				catchPokemon(caught)
				.then(() => {
					playerSaveInfo["chosen-starter"] = pokemon.id
					playerSaveInfo["started-game"] = true
					return savePlayerInfo()
				})
				.then(() => {
					resolvePromise()
				})
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
				let image = getPokemonImage(pokemon, "large")
				let html = `<div class='text-center'>${pokemon.name}
				<div>
				<img class='pokemon-image' src='${image}'>
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
					let image = getPokemonImage(pokemon, "large")
					chooseTag.append(`<img class='invisible-image' src='${image}'>`)
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
				if (currentIndex === 0 && indexMod < 0 ||
					  currentIndex === groups.length - 1 && indexMod > 0){
					return
				}
				currentIndex += indexMod
				chooseTag.children(".ball").popover("dispose")
				$(".popover").fadeOut().queue(() => {
					$(".popover").remove()
				})
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
			fadeInGame()
			let routeName = options.name

			if (routeName === "Route 1"){
				changeMusic("Route 201 (Day)")
			}

			let listTag = $(`<div class='route-list'></div>`)
			let routeTag = $(`<div class='route-screen'></div>`)

			let pcBtn = $(`<button class='btn btn-primary' id='pc-button'></button>`)
			pcBtn.append(`<div class='route-button-text'>My PC</div>`)
			pcBtn.click(() => {
				changeScene("pc")
			})
			listTag.append(pcBtn)

			let pokemonCenterBtn = $(`<button class='btn btn-primary' id='pokemon-center-button'></button>`)
			pokemonCenterBtn.append(`<div class='route-button-text'>Restore All Pokemon</div>`)
			pokemonCenterBtn.click(() => {
				//TODO: Maybe make the pokemon center an entire screen?
				healAllPokemon(playerActivePokemon)
				determinePokemonCenterActiveness()
			})
			//Should pokemonCenterBtn be active?
			let determinePokemonCenterActiveness = () => {
				let healData = canPokemonBeHealed(playerActivePokemon)
				console.log(healData)
				if (healData.pokemon.length){
					pokemonCenterBtn.attr("disabled", false)
				} else {
					pokemonCenterBtn.attr("disabled", true)
				}
			}
			determinePokemonCenterActiveness()
			listTag.append(pokemonCenterBtn)

			let shownCategory
			const changeCategory = routeName => {
				const change = () => {
					if (shownCategory === routeName) return
					let routeLevels = getLevelsInCategory(routeName)
					displayLevels(routeLevels)
					shownCategory = routeName
				}
				listTag.children(".highlight").removeClass("highlight")
				let categoryBtn = listTag.children(`[data-category="${routeName}"]`)
				categoryBtn.addClass("highlight")
				if (!!shownCategory){
					routeTag.fadeOut(300, () => {
						change()
						routeTag.fadeIn(300)
					})
				} else {
					change()
				}
			}

			determineUnlockedLevels()
			for (let categoryId in levelCategoryData){
				let category = levelCategoryData[categoryId]
				if (!category.unlocked) continue

				let categoryBtn = $(`<button class='route-btn btn btn-primary'></button>`)
				categoryBtn.attr("data-category", categoryId)
				let name = getLocaleString("name", lang, ["route-categories", category.id])
				categoryBtn.text(name)
				listTag.append(categoryBtn)
				categoryBtn.click(event => {
					changeCategory(category.id)
				})
			}

			const displayLevels = levelList => {
				routeTag.html("")
				let levelButtons = []
				levelList.forEach(level => {
					let btn = getLevelButtonHtml(level)
					btn.popover({
						placement: "top",
						trigger: "focus",
						html: true,
						content: () => getPopover(level)
					})
					levelButtons.push(btn)
					routeTag.append(btn)
					btn.on("mouseenter", function(){
						let popoverId = btn.attr("aria-describedby")
						if (!popoverId){
							btn.popover("show")
						}
					})
					function waitBeforeHiding(){
						let popoverId = btn.attr("aria-describedby")
						setTimeout(function(){
							let p = $("#" + popoverId)
							let onPopover = isMouseSomewhereIn(p)
							let onBtn = isMouseSomewhereIn(btn)
							// console.log(currentHoveredElement, onPopover, inPopover, onBtn, inBtn)
							//If the mouse is NOWHERE RELATED TO THE LEVEL
							if (!onPopover && !onBtn){
								btn.popover("hide")
							} else {
								p.off("mouseleave")
								p.on("mouseleave", waitBeforeHiding)
							}
						}, 200)
					}
					btn.on("mouseleave", waitBeforeHiding)
				})
				levelButtons.forEach(btn => {
					$(btn).click(chooseLevel)
				})
			}
			const getPopover = level => {
				let content = $(`<div class='level-popover text-center d-flex flex-column align-items-center justify-content-center'></div>`)
				content.append(`<div class='name'>${level.name}</div>`)
				let btn = $(`<button class='btn btn-primary'>Play Level </button>`)
				btn.append("<i class='bi bi-play-circle-fill'></i>")
				content.append(btn)
				btn.click(() => confirmChoice(level))

				if (level.description){
					let description = getLocaleString(level.description, lang)
					content.append(`<div class='desc'>${description}</div>`)
				}

				return content
			}
			const confirmChoice = level => {
				let usablePokemon = getUsablePokemon(playerActivePokemon)
				if (usablePokemon.length){
					$(".level-button").popover("hide")
					resolvePromise(level.id)
				} else {
					let message = getLocaleString("error-no-usable-pokemon", lang)
					createAnnouncement("general", message)
				}
			}
			const chooseLevel = event => {
				let target = $(event.currentTarget)
				let id = target.attr("data-level")
				let level = getLevelDataById(id)
				let oldActive = $(".level-button.clicked")
				target.toggleClass("clicked")
				oldActive.removeClass("clicked")
				let chosen = target.hasClass("clicked")
				if (chosen){
					
				}
			}
			changeCategory(routeName)

			let NPCDatas = getTrainerClassesFromLevelCategory(routeName)
			NPCDatas.forEach(data => {
				loadTrainerClassSprites(data)
			})

			gameTag.append(listTag)
			gameTag.append(routeTag)

			promise = promise.then(levelID => beginLevel(levelID))
		} break
		case "pc": {
			fadeInGame()
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
						let pokemon = new Pokemon(p.name, p.pokemonId, p)
						currentBoxPokemon.push(pokemon)
						displayPokemon(pokemon)
					})
					updatePCButtons()
				})
			}
			const displayPokemon = p => {
				let pokemon = new Pokemon(p.name, p.pokemonId, p)
				let images = pokemon.data.imageSources
				let source = images.home ?? pokemon.getImage()

				let size = getRealBoxSize()
				let left = pokemon.pcBoxX * size.width + size.offsetX
				let top = pokemon.pcBoxY * size.height + size.offsetY

				let img = $(`<img class='pokemon-image'>`)
				img.attr("src", source)
				img.attr("data-pokemon-id", pokemon.uuid)
				img.css({
					top: top + "px",
					left: left + "px",
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
						let images = p.data.imageSources
						let image = images.home ?? pokemon.getImage()
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

			const getRealBoxSize = () => {
				let boxBackgroundPixels = [156, 116]
				let bgWidth = boxBackgroundPixels[0]
				let bgHeight = boxBackgroundPixels[1]
				let boxWidth = $(pcBox[0]).width()
				let boxHeight = $(pcBox[0]).height()
				let screenRatio = boxWidth / boxHeight
				let boxRatio = bgWidth / bgHeight
				let realBoxWidth, realBoxHeight, realBoxOffsetX, realBoxOffsetY
				if (screenRatio < boxRatio){
					realBoxHeight = boxWidth / bgWidth * bgHeight
					realBoxOffsetY = (boxHeight - realBoxHeight) * 0.5
					realBoxWidth = boxWidth
					realBoxOffsetX = 0
				} else {
					realBoxWidth = boxHeight / bgHeight * bgWidth
					realBoxOffsetX = (boxWidth - realBoxWidth) * 0.5
					realBoxHeight = boxHeight
					realBoxOffsetY = 0
				}
				let result = {
					width: realBoxWidth,
					height: realBoxHeight,
					offsetX: realBoxOffsetX,
					offsetY: realBoxOffsetY
				}
				// console.log(boxRatio, screenRatio, result)
				return result
			}

			let holdInterval
			let heldPokemon = null
			let heldPokemonTag = null

			const handleMouseDown = (event) => {
				let box = $(event.currentTarget)
				let id = box.attr("data-index")
				let index = parseInt(id)
				let pokemon = playerActivePokemon[index]
				stopHolding()
				if (!pokemon) return
				delay(100).then(() => {
					if (!mouse.isDown){
						let alreadySelected = box.hasClass("selected")
						allBoxes.removeClass("selected")
						if (!alreadySelected){
							box.addClass("selected")
							viewPokemonInfo(pokemon)
							.then(() => savePokemon(pokemon))
							.then(() => box.removeClass("selected"))
						}
					} else {
						if (pokemon){
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
				let pokemon = currentBoxPokemon.find(p => p.uuid === id)
				stopHolding()
				if (!pokemon) return
				// console.log(p)
				delay(100).then(() => {
					if (!mouse.isDown){
						viewPokemonInfo(pokemon)
						.then(() => savePokemon(pokemon))
					} else {
						heldPokemon = pokemon
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
				let images = pokemon.data.imageSources
				let image = images.home ?? pokemon.getImage()
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
				// let hoveredBox = [...hovered].find(elem => elem === pcBox[0])
				if (hoveredActiveBox){
					let index = $(hoveredActiveBox).attr("data-index")
					if (index){
						swapActivePokemon(heldPokemon, parseInt(index))
					}
				}
				//Put the pokemon in the box instead
				else {
					let offset = pcBox.offset()
					let left = mouse.x - offset.left
					let top = mouse.y - offset.top
					let realBoxSize = getRealBoxSize()
					left -= realBoxSize.offsetX
					top -= realBoxSize.offsetY
					left = left / realBoxSize.width
					top = top / realBoxSize.height
					let tooLeft = left < 0.05
					let tooTop = top < 0.05
					let tooRight = left > 0.95
					let tooBottom = top > 0.95
					if (tooLeft) left = 0.05
					if (tooTop) top = 0.05
					if (tooRight) left = 0.95
					if (tooBottom) top = 0.95

					//Don't let the player remove their last pokemon
					let onlyOnePokemon = playerActivePokemon.filter(p => p).length === 1
					let active = playerActivePokemon.includes(heldPokemon)
					let satisfiesActiveRule = !onlyOnePokemon || !active
					console.log(left, top)

					if (satisfiesActiveRule){
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
					} else {
						let message = getLocaleString("error-cant-remove-last-pokemon", lang)
						createAnnouncement("general", message)
					}

					currentBoxPokemon.push(heldPokemon)
				}
				savePokemon(heldPokemon)
				.then(() => loadBox(pcBoxData.indexOf(currentBox)))
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
				if (p2){
					p2.pcBox = p1.pcBox
					p2.pcBoxX = p1.pcBoxX
					p2.pcBoxY = p1.pcBoxY
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

			const leaveScene = () => {
				clearInterval(pcInterval)
				clearInterval(holdInterval)
				//Make sure the player doesn't have a gap in their party
				removeEmptySlots(playerActivePokemon)
				resolvePromise()
			}

			updateBoxes()

			let confirmText = getLocaleString("confirm", lang)
			let confirmButton = $(`<button class='btn big-btn btn-primary m-3'>${confirmText}</button>`)
			adminTag.append(confirmButton)
			confirmButton.click(() => {
				leaveScene()
				changeScene("route", {name: "Route 1"})
			})

			let pokedexText = getLocaleString("pokedex", lang)
			let pokedexButton = $(`<button class='btn big-btn btn-primary m-3'>${pokedexText}</button>`)
			if (playerSaveInfo["unlocked-pokedex"]){
				adminTag.append(pokedexButton)
				pokedexButton.click(() => {
					leaveScene()
					changeScene("pokedex")
				})
			}
			
		} break
		case "pokedex": {
			fadeInGame()
			let pokedexTag = $(`<div id='pokedex'></div>`)
			gameTag.append(pokedexTag)

			let dexWindow = $(`<div id='dexWindow'></div>`)
			pokedexTag.append(dexWindow)

			let pokemonList = Object.values(pokemonData)
			.sort((a, b) => {
				let aId = a.number
				let bId = b.number
				if (aId < bId) return -1
				if (aId > bId) return 1
				return 0
			})

			let pokemonStats = playerSaveInfo["pokemon-caught-stats"]
			let pokemonListTag = $("<div class='pokemon-list'>")
			dexWindow.append(pokemonListTag)
			for (let data of pokemonList){
				let pokemonId = data.id
				let pokemonOptions = {
					isShiny: false
				}
				let pokemon = new Pokemon(undefined, pokemonId, pokemonOptions)
				let stats = pokemonStats[pokemonId]
				let section = $(`<div class='pokemon-section'></div>`)

				section.click(() => {
					viewPokemonInfo(pokemon, {pure: true, dex: true})
				})

				let imageSection = $(`<div class='pokemon-image-section'>`)
				section.append(imageSection)

				let url = pokemon.getImage()
				let pokemonImgBg = $(`<div class='pokemon-image-bg'>`)
				pokemonImgBg.css("mask-image", `url(${url})`)
				imageSection.append(pokemonImgBg)

				let pokemonImg = $(`<img class='pokemon-image'>`)
				pokemonImg.attr("src", url)
				imageSection.append(pokemonImg)

				let textSection = $(`<div class='pokemon-name-section'></div>`)
				let pokemonNumberTag = $(`<div class='pokemon-number'></div>`)
				pokemonNumberTag.html(`#${data.number}`)
				textSection.append(pokemonNumberTag)
				let pokemonNameTag = $(`<div class='pokemon-name'></div>`)
				textSection.append(pokemonNameTag)
				let name = getLocaleString("name", lang, ["pokemon", pokemonId])
				if (stats.seen === 0 && stats.caught === 0){
					name = name.replaceAll(/./g, "?")
				}
				pokemonNameTag.html(name)

				if (stats.seen === 0 && stats.caught === 0){
					section.addClass("not-seen")
				}
				if (stats.caught === 0){
					section.addClass("not-caught")
				} else {
					section.addClass("caught")
				}
				
				section.append(textSection)
				pokemonListTag.append(section)
			}

			let adminTag = $(`<div id='pokedex-admin'></div>`)
			pokedexTag.append(adminTag)

			let backButton = $("<button class='btn btn-primary big-btn back-btn'>Back</button>")
			adminTag.append(backButton)

			let allPokemonSections = pokemonListTag.children(".pokemon-section")
			let bgUpAmt = 0
			const pcTick = () => {
				bgUpAmt += 1
				let amt = bgUpAmt / 5
				allPokemonSections.css("background-position", `top ${amt}px left`)
			}
			let dexInterval = setInterval(pcTick, 10)

			const leaveScene = () => {
				clearInterval(dexInterval)
				resolvePromise()
			}

			backButton.click(() => {
				leaveScene()
				changeScene("pc")
			})
		} break
		case "pokemon-center": {

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

	if (name !== currentSceneInfo.name){
		let toHide = gameTag.css("display") === "none" ? $("#board") : gameTag
		toHide.fadeOut(() => {
			gameTag.removeClass("choosing-starter")
			resolvePromise()
		})
	} else {
		resolvePromise()
	}
	
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
	.then(() => {
		// let total = getPlayerSaveInfo("total-pokemon-caught", 0, Number)
		// setPlayerSaveInfo("total-pokemon-caught", total + 1)
		let total = playerSaveInfo["total-pokemon-caught"] || 0
		playerSaveInfo["total-pokemon-caught"] = total + 1
		return logPokemonAs("caught", pokemon)
	})
	.then(() => {
		resolvePromise()
	})

	return promise
}

function askToRenamePokemon(pokemon){
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)
	let modal = $("#modal")
	let name = getLocaleString("name", lang, ["pokemon", pokemon.data.id])
	let image = pokemon.getImage()

	clearModal(modal)

	let question = getLocaleString("ask-to-rename-pokemon", lang)
	question = applyReplacements(question, [name])
	modal.find(".modal-title").text(question)
	let innerStuff = $(`<div class='container d-flex'></div>`)
	innerStuff.append(`<div class='col col-3'><img class='pokemon-image' src='${image}'></div>`)
	innerStuff.append(`<div class='col col-9 d-flex flex-column justify-content-center align-items-center'>
		<input type='text' required value='${name}'>
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
	let level = getLevelDataById(levelID)
	if (level.music){
		changeMusic(level.music)
	}

	if (gameRound){
		clearInterval(gameRound.tickInterval)
	}
	gameRound = undefined
	gameBoard = undefined

	currentLevelProgress = {
		id: levelID,
		level: level,
		effects: level.effects,
		info: [],
		effectIndex: -1,
		nextEffectIndex: 0
	}

	level.attempts++
	let levelResult
	let promise = advanceCurrentLevel()
	.then(val => {
		let promise = Promise.resolve()
		let info = currentLevelProgress.info
		//If you're marked as losing a "fight" effect, then you lose the whole level.
		let effects = currentLevelProgress.effects
		let lostFights = effects.filter((effect, i) => {
			return info[i] === "lose" && effect.type === "fight"
		})
		
		let forgiving = currentLevelProgress.level.forgiving
		if (lostFights.length && !forgiving){
			levelResult = "lose"
		} else if (lostFights.length && forgiving) {
			//TODO Maybe one day, add an extra challenge to go back and finish the level without losing once
			levelResult = "win"
		} else {
			levelResult = "win"
		}

		let shouldHeal = playerActivePokemon.every(pokemon => pokemon.fainted)
		if (shouldHeal){
			healAllPokemon(playerActivePokemon)
		}
		
		if (levelResult === "lose"){
			console.log("You lose :(")
		} else {
			level.status = "won"
			promise = promise.then(() => saveLevelStatus(level, "won"))
		}
		changeScene("route", {name: "Route 1"})
		console.log(promise)
		return promise
	})
	.then(() => {
		console.log(playerSaveInfo)
		return savePlayerInfo()
	})
	
	return promise
}
function advanceCurrentLevel(){
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)
	let level = currentLevelProgress.level
	let effects = currentLevelProgress.effects
	currentLevelProgress.effectIndex = currentLevelProgress.nextEffectIndex
	let effectIndex = currentLevelProgress.effectIndex
	currentLevelProgress.nextEffectIndex++
	let effect = effects[effectIndex]
	let params = getEffectParams(effect, effectIndex, currentLevelProgress)

	if (effectIndex >= effects.length){
		resolvePromise()
		return promise
	}

	// console.log(effect, effectIndex, params)

	let index
	if (effect.jumpTo){
		if (typeof effect.jumpTo === "string"){
			index = effects.findIndex(e => e.label === effect.jumpTo)
		} else {
			index = effect.jumpTo
		}
	}

	switch (effect.type){
		case "stop-music": {
			for (let soundName in sounds){
				let type = sounds[soundName].type
				if (type === "music"){
					stopSound(soundName)
				}
			}
			resolvePromise()
		} break
		case "change-music": {
			let music = effect.music
			changeMusic(music)
			resolvePromise()
		} break
		case "fight": {
			changeScene("fight")
			let displayed = $("#board").css("display") !== "none"
			if (!displayed){
				$("#game").fadeOut()
				$("#board").fadeIn()
			}

			let trainerIndex = effect.trainer ?? 0
			let trainerData = level.trainers[trainerIndex]
			beginRound(trainerData)
			.then(val => new Promise(res => {
				currentLevelProgress.info[effectIndex] = val
				if (val === "lose"){
					currentLevelProgress.endEarly = true
				} else if (val === "win"){
					//Cool you win nothing special happens
				} else {
					console.warn("Fight ended with unexpected result", val)
				}
				res(val)
			}))
			.then(resolvePromise)
			
			let NPCData = NPCTrainerData[trainerData.name] ?? {}
			//If the opponent is wild
			if (!NPCData.type){
				
			}
		} break
		case "dialogue": {
			let dialogueName = effect.source
			let seenDialogue = playerSaveInfo["seen-dialogue"]
			let shouldSkip = config.skipSeenDialogue && seenDialogue.includes(dialogueName)
			if (shouldSkip){
				resolvePromise()
			} else {
				let dialogue = getLocaleString(dialogueName, lang, ["dialogue"], {})
				beginDialogue(dialogue)
				.then(() => {
					if (!seenDialogue.includes(dialogueName)){
						seenDialogue.push(dialogueName)
					}
					resolvePromise()
				})
			}
		} break
		case "random-number": {
			let min = effect.min ?? 0
			let max = effect.max ?? 10
			let val = Math.floor(Math.random() * (max - min + 1)) + min
			currentLevelProgress.info[effectIndex] = val
			resolvePromise()
		} break
		case "load-player-info": {
			currentLevelProgress.info[effectIndex] = playerSaveInfo[effect.key]
			resolvePromise()
		} break
		case "load-setting": {
			currentLevelProgress.info[effectIndex] = config[effect.key]
			resolvePromise()
		} break
		case "save-player-info": {
			let key = effect.key
			let value = params.value
			playerSaveInfo[key] = value
			console.log(key, value, playerSaveInfo)
			resolvePromise()
		} break
		case "load-value": {
			currentLevelProgress.info[effectIndex] = effect.value
			resolvePromise()
		} break
		case "jump-if-lost": {
			let info = currentLevelProgress.info
			//If you're marked as losing a "fight" effect, then you lose the whole level.
			let effects = currentLevelProgress.effects
			let lostFights = effects.filter((effect, i) => {
				return info[i] === "lose" && effect.type === "fight"
			})
			if (lostFights.length){
				currentLevelProgress.nextEffectIndex = index
			}
			resolvePromise()
		} break
		case "jump-if-equal": {
			let test = currentLevelProgress.info[effectIndex - 2]
			let against = currentLevelProgress.info[effectIndex - 1]
			let index
			if (typeof effect.jumpTo === "string"){
				index = effects.findIndex(e => e.label === effect.jumpTo)
			} else {
				index = effect.jumpTo
			}
			if (test === against){
				currentLevelProgress.nextEffectIndex = index
			}
			resolvePromise()
		} break
		case "jump-if-less-than": {
			let test = currentLevelProgress.info[effectIndex - 2]
			let against = currentLevelProgress.info[effectIndex - 1]
			
			if (test < against){
				currentLevelProgress.nextEffectIndex = index
			}
			resolvePromise()
		} break
		case "jump": {
			currentLevelProgress.nextEffectIndex = index
			resolvePromise()
		} break
		default:
			console.warn("You never handled", effect.type)
	}

	promise = promise.then(val => {
		// if (currentLevelProgress.endEarly) return Promise.resolve(val)

		if (effects[currentLevelProgress.nextEffectIndex]){
			return advanceCurrentLevel()
			.then(() => Promise.resolve(val))
		}

		return Promise.resolve(val)
	})

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
		let image = p.getImage()
		chooseable.html(`
			<div class='row mb-3'>
				<div class='col d-flex flex-column justify-content-center'>
					<p>${p.name}</p>
				</div>
				<div class='col text-end'>
					<img class='pokemon-image' src='${image}'>
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
function viewPokemonInfo(pokemon, options={}){
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)

	let modal = $("#modal")
	clearModal(modal)
	modal.modal("show")
	modal.addClass("wide").addClass("summary")
	modal.find(".modal-header").addClass("justify-content-center")
	modal.find(".modal-title").text(pokemon.name)
	modal.find(".modal-title").addClass("display-6")
	let btn = $(`<button class='btn btn-primary'>Done</button>`)
	modal.find(".modal-footer").append(btn)

	let body = modal.find(".modal-body")
	if (options.dex){
		body.css("padding-top", 0)
		let tabs = $("<ul class='nav nav-tabs mb-1 justify-content-center'>")
		body.append(tabs)

		const changeTab = event => {
			tabs.find(".active").removeClass("active")
			let tab = $(event.currentTarget)
			tab.find(".nav-link").addClass("active")
			let className = "." + tab.attr("data-target-class")
			body.children(".info").fadeOut(() => {
				body.children(className).fadeIn()
			})
		}

		let infoTab = $(`<li class='nav-item' data-target-class='pokemon-info'>
			<a class="nav-link active" href="#">Info</a>
		</li>`)
		tabs.append(infoTab)

		let findingTab = $(`<li class='nav-item' data-target-class='location-info'>
			<a class="nav-link" href="#">Locations</a>
		</li>`)
		tabs.append(findingTab)
		tabs.children().click(changeTab)
	}

	//POKEMON
	let image = pokemon.getImage()
	let content = $(`
		<div class='info pokemon-info'>
			<div class='pokemon-section'>
				<div class='image text-center'>
					<img src='${image}' class='pokemon-image'>
				</div>
			</div>
			<div class='move-section'>
			</div>
		</div>
	`)
	body.append(content)
	let pokemonSection = content.children(".pokemon-section")
	let statsSection = $(`<div class='stats-section'>`)
	pokemonSection.append(statsSection)
	let statsHTML = getStatsHTML(pokemon, {
		abbreviate: false,
		pure: options.pure
	})
	statsSection.append(statsHTML)
	let masteryHTML = getMasteryHTML(pokemon, {
		abbreviate: false,
		pure: options.pure
	})
	statsSection.append(masteryHTML)

	const toggleSelect = (move, moveTag) => {
		let activeIndex = pokemon.activeMoves.indexOf(move)
		if (activeIndex === -1){
			if (pokemon.activeMoves.length >= 4){
				createAnnouncement("general", "A Pokemon can't have more than 4 active moves.")
			} else {
				let added = pokemon.addActiveMove(move)
				if (added){
					moveTag.addClass("active-move")
				}
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

		let available = pokemon.movesUnlockedMap[i]
		let requirements = pokemon.data.learnset[i].unlock
		//If move is not available and the move should be hidden, skip the rest of this
		if (!available && requirements.type === "hidden"){
			continue
		}

		let moveTag = getMoveHTML(move, true)

		//If this isn't even really a pokemon, don't bother marking things as available/not.
		if (options.pure){
			moveSection.append(moveTag)
			moveTag.popover({
				placement: "left",
				trigger: "hover",
				content: getReasonPokemonDoesntMeetRequirements(pokemon, move, options)
			})
			continue
		}

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

	//LOCATIONS
	if (options.dex){
		let info = $(`<div class='info location-info'>`)
		body.append(info)
		info.hide()

		for (let level of levelData){
			if (level.obtainablePokemon.includes(pokemon.data.id)){
				let name = getLocaleString("name", lang, ["levels", level.id])
				info.append(name)
			}
		}
	}

	btn.click(() => {
		modal.modal("hide")
	})
	modal.on("hidden.bs.modal", () => {
		moveSection.children(".move").popover("hide")
		// if (playerActivePokemon.owner === playerSaveId){
		// 	savePokemon(pokemon)
		// 	.then(() => resolvePromise())
		// } else {
		// 	resolvePromise()
		// }
		resolvePromise()
	})
	return promise
}

function getStatsHTML(pokemon, options={}){
	let abbreviate = options.abbreviate ?? true
	let pure = options.pure ?? false
	//Stats
	let stats = $(`<div class='stats'></div>`)
	for (let stat in pokemon.data.stats){
		let statName = abbreviate ? getStatAbbr(stat) : getStatName(stat)
		let val, effectiveVal
		if (pure){
			val = pokemon.data.stats[stat]
			effectiveVal = val
		} else {
			val = pokemon.getStat(stat)
			effectiveVal = pokemon.getEffectiveStat(stat)
		}
		let statTag = $("<div class='stat'></div>")
		statTag.append(`<span class='stat-name'>${statName}</span>`)
		let statVal = $("<span class='stat-val'></span>")

		if (effectiveVal > val){
			statVal.addClass("up")
			.append("<i class='bi bi-arrow-up'></i>")
		} else if (effectiveVal < val){
			statVal.addClass("down")
			.append("<i class='bi bi-arrow-down'></i>")
		} 

		statVal.append(effectiveVal.toFixed(0))
		statTag.append(statVal)
		stats.append(statTag)
	}
	return stats
}
function getMasteryHTML(pokemon, options={}){
	let abbreviate = options.abbreviate ?? true
	let pure = options.pure ?? false
	let stats = $(`<div class='stats mastery'></div>`)
	let energyMastery
	if (pure){
		energyMastery = pokemon.data.energyMastery
	} else {
		energyMastery = pokemon.energyMastery
	}
	let colorOrder = Object.keys(energyMastery).sort((a, b) => {
		return colors.indexOf(a) - colors.indexOf(b)
	})
	for (let type of colorOrder){
		let val = energyMastery[type]
		if (val || colors.includes(type)){
			let icon = getEnergyIcon(type)
			let tag = $("<div class='mastery-icon'></div>")
			let left = $("<div class='mastery-left'></div>")
			let img = $("<img>")
			img.attr("src", icon)
			left.append(img)
			tag.append(left)

			if (!abbreviate){
				let typeName = getTypeFromTileType(type)
				let name = `${typeName} Affinity`
				let nameTag = $("<span class='mastery-name'></span>")
				nameTag.text(name)
				left.append(nameTag)
			}

			let number = $("<span></span>")
			number.text(val)
			tag.append(number)
			stats.append(tag)
		}
	}
	return stats
}

function getMoveHTML(move, useLongDescription=false){
	let tag = $("<div class='move'></div>")
	
	let moveTop = $("<div class='move-top'></div>")
	let moveName = getLocaleString("name", lang, ["moves", move.name])
	moveTop.append(`<div class='move-name'>${moveName}</div>`)
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

	let longDescription = getLocaleString("description", lang, ["moves", move.name])
	let shortDescription = getLocaleString("shortDescription", lang, ["moves", move.name])
	let desc = useLongDescription ? longDescription : shortDescription
	tag.append(`<div class='move-desc'>${desc}</div>`)

	let moveCostTag = $("<div class='move-cost'></div>")
	if (!move.specialCost){
		for (let i = 0; i < colors.length; i++){
			let color = colors[i]
			let cost = $("<div class='cost-part energy'></div>")
			cost.addClass("energy-"+color)
			cost.attr("data-cost", color)
			let costValue = move.energy[color] ?? 0
			
			let icon = $("<span class='icon'></span>")
			cost.append(icon)
			cost.append(`<span class='cost'>${costValue}</span>`)
			if (!costValue){
				cost.children().hide()
			}
			
			moveCostTag.append(cost)
		}
	}
	tag.append(moveCostTag)
	return tag
}