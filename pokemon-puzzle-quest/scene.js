let currentSceneInfo = {}
function startScene(name, options={}) {
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)
	let gameTag = $("#game")
	let gameIsHidden = $("#game").css("display") === "none"
	gameTag.empty()

	$(".popover").fadeOut().remove()

	currentSceneInfo.name = name
	currentSceneInfo.options = options

	const fadeInGame = () => {
		if (gameIsHidden) {
			gameTag.fadeIn()
			gameTag.css("opacity", "0")
		}
	}

	switch (name) {
		case "fight": {
			//This is all handled by the level effects.
			//This one's just here in case I need it later.
			if (!gameIsHidden) {
				gameTag.fadeOut()
			}
		} break
		case "choose-starter": {
			if (gameIsHidden) {
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
				let caught = new Pokemon(pokemon.name, pokemon.id, { level: 5 })
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
				if (chosen) {
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
				for (let i = 0; i < group.length; i++) {
					let pokemon = group[i]
					let tag = $(`<div class='ball ball-${i + 1}'>
					<img src='src/img/pokeball.png'>
					</div>`)
					chooseTag.append(tag)
					tags.push([tag, pokemon])

					//Now add a tiny, nearly-invisible image of that pokemon
					//(just to get the image preloaded)
					let image = getPokemonImage(pokemon, "large")
					chooseTag.append(`<img class='invisible-image' src='${image}'>`)
				}

				for (let pair of tags) {
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

				if (currentIndex === 0) {
					$("#game > .left").removeClass("active").animate({ opacity: 0 })
				} else {
					$("#game > .left").addClass("active").animate({ opacity: 1 })
				}

				if (currentIndex === groups.length - 1) {
					$("#game > .right").removeClass("active").animate({ opacity: 0 })
				} else {
					$("#game > .right").addClass("active").animate({ opacity: 1 })
				}
			}
			const changeGroup = (indexMod, firstLeft, secondLeft) => {
				if (currentIndex === 0 && indexMod < 0 ||
					currentIndex === groups.length - 1 && indexMod > 0) {
					return
				}
				currentIndex += indexMod
				chooseTag.children(".ball").popover("dispose")
				$(".popover").fadeOut().queue(() => {
					$(".popover").remove()
				})
				chooseTag.animate({
					left: firstLeft
				}, 400).queue(function () {
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

			for (let i = 0; i < starterPokemon.length; i++) {
				let arr = i % 3 === 0 ? [] : groups[groups.length - 1]
				if (i % 3 === 0) groups.push(arr)
				arr.push(pokemonData[starterPokemon[i]])
			}
			fillWithPokemon()
		} break
		case "route": {
			changeBackgroundImage("none")
			fadeInGame()
			let routeName = options.name ?? playerSaveInfo["last-route"] ?? "Route 1"

			//TODO change music based on route
			changeMusic("Route 201 (Day)")

			let listTag = $(`<div class='route-list'></div>`)
			let routeTag = $(`<div class='route-screen'></div>`)
			gameTag.append(listTag)
			gameTag.append(routeTag)
			let levelButtons = []

			let pcBtn = $(`<button class='btn btn-primary' id='pc-button'></button>`)
			pcBtn.append(`<div class='route-button-text'>My PC</div>`)
			pcBtn.click(() => {
				console.log(levelButtons)
				levelButtons.forEach(btn => btn.off("mouseenter"))
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
				if (healData.pokemon.length) {
					pokemonCenterBtn.attr("disabled", false)
				} else {
					pokemonCenterBtn.attr("disabled", true)
				}
			}
			determinePokemonCenterActiveness()
			listTag.append(pokemonCenterBtn)

			let shownCategory
			const changeCategory = routeName => {
				if (shownCategory === routeName){
					return
				}
				const change = () => {
					if (shownCategory === routeName) return
					let routeData = levelCategoryData[routeName]

					displayLevels(routeData)
					shownCategory = routeName
					playerSaveInfo["last-route"] = routeName
				}
				listTag.children(".highlight").removeClass("highlight")
				let categoryBtn = listTag.children(`[data-category="${routeName}"]`)
				categoryBtn.addClass("highlight")
				if (!!shownCategory) {
					routeTag.fadeOut(300, () => {
						change()
						routeTag.fadeIn(300)
					})
				} else {
					change()
				}
			}

			determineUnlockedLevels()
			for (let categoryId in levelCategoryData) {
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

			const preloadLevelImages = level => {
				if (level.images){
					for (let imgName in level.images){
						let url = level.images[imgName]
						loadSprite(imgName, url)
					}
				}
			}
			const displayLevels = routeData => {
				routeTag.children().popover("dispose")
				routeTag.empty()
				let routeName = routeData.id
				let levelList = getLevelsInCategory(routeName)

				console.log(routeData)
				let style = routeData?.style ?? {}
				if (style.backgroundColor){
					routeTag.css("background-color", style.backgroundColor)
				} else {
					routeTag.css("background-color", "")
				}
				let routeHeight = routeTag.height()
				let routeWidth = routeTag.width()
				let routeRatio = routeWidth / routeHeight
				if (!routeRatio){
					routeRatio = ($(window).width() * 0.75) / $(window).height()
				}
				let backgroundRatio = 1
				let backgroundImage
				if (style.backgroundImage){
					let src = style.backgroundImage
					let spriteName = `route-bg-${routeName}-bg`
					let sprite = sprites.images[spriteName]
					let img = $(sprite.cloneNode())
					img.addClass("route-bg")
					img.attr("src", src)
					routeTag.append(img)
					backgroundRatio = sprite.width / sprite.height
					backgroundImage = img
					backgroundImage.css("--ratio", backgroundRatio)

					let xOffset = 0
					let yOffset = 0
					if (routeRatio > backgroundRatio){
						xOffset = (routeRatio - backgroundRatio) * routeHeight * 0.5
					} else if (routeRatio < backgroundRatio){
						yOffset = ((1/routeRatio) - (1/backgroundRatio)) * routeWidth * 0.5
					}
					backgroundImage.css("width", routeWidth - xOffset * 2)
					backgroundImage.css("height", routeHeight - yOffset * 2)
				}

				levelButtons = []
				levelList.forEach(level => {
					let btn = getLevelButtonHtml(level)
					btn.data("level", level)
					levelButtons.push(btn)
					routeTag.append(btn)

					if (style.positionLevels === "absolute" && backgroundImage){
						let xOffset = 0
						let yOffset = 0
						
						if (routeRatio > backgroundRatio){
							xOffset = (routeRatio - backgroundRatio) * routeHeight * 0.5
						} else if (routeRatio < backgroundRatio){
							yOffset = ((1/routeRatio) - (1/backgroundRatio)) * routeWidth * 0.5
						}
						let imgHeight = routeHeight - yOffset * 2
						let imgWidth = routeWidth - xOffset * 2
						if (level.position){
							btn.addClass("absolute")
							btn.css("left", xOffset + imgWidth * level.position.left)
							btn.css("top", yOffset + imgHeight * level.position.top)
						}
					}
				})
				let levelButtonsSelection = levelButtons.reduce((acc, v) => (acc.add(v)), $())
				levelButtons.forEach(btn => {
					let level = btn.data("level")
					let active = false
					levelButtonsSelection.not(btn).on("mouseenter", () => {
						active = false
						btn.popover("hide")
					})
					btn.on("mouseenter", () => {
						if (!active){
							btn.popover("dispose").popover({
								placement: "bottom",
								trigger: "manual",
								html: true,
								content: () => getPopover(level)
							})
							btn.popover("show")
						}
					})
					btn.on("mouseleave", () => {
						if (!active){
							const waitBeforeHiding = () => {
								let popoverId = btn.attr("aria-describedby")
								if (popoverId){
									let p = $("#" + popoverId)
									let onPopover = isMouseSomewhereIn(p)
									let onBtn = isMouseSomewhereIn(btn)
									if (!onPopover && !onBtn) {
										btn.popover("hide")
									} else {
										p.on("mouseleave", () => btn.popover("hide"))
									}
								}
							}
							setTimeout(waitBeforeHiding, 200)
						}
					})
					routeTag.on("click", () => {
						if (!active){
							let onBtn = isMouseSomewhereIn(btn)
							active = onBtn
						} else {
							active = false
						}
					})
					$(btn).click(chooseLevel)
				})

				levelList.forEach(level => preloadLevelImages(level))
			}
			const getPopover = level => {
				let content = $(`<div class='level-popover text-center d-flex flex-column align-items-center justify-content-center'></div>`)
				let name = getLocaleString("name", lang, ["levels", level.id])
				content.append(`<div class='name'>${name}</div>`)
				let btn = $(`<button class='btn btn-primary'>Play Level </button>`)
				btn.append("<i class='bi bi-play-circle-fill'></i>")
				content.append(btn)
				btn.click(() => confirmChoice(level))

				if (config["showLevelCompletionData"]){
					let statTag = $(`<div class='desc w-100 d-flex justify-content-around flex-wrap'></div>`)
					content.append(statTag)
					statTag.append(`<span class='m-1'>Attempts: ${level.attempts}</span>`)
					statTag.append(`<span class='m-1'>Completions: ${level.completions}</span>`)
				}

				let desc = getLocaleString("description", lang, ["levels", level.id], null)
				if (level.description) {
					desc = getLocaleString(level.description, lang)
				}
				if (desc) {
					content.append(`<div class='desc'>${desc}</div>`)
				}

				return content
			}
			const confirmChoice = level => {
				routeTag.off("click")
				let usablePokemon = getUsablePokemon(playerActivePokemon)
				if (usablePokemon.length) {
					$(".level-button").popover("hide")
					resolvePromise()
					beginLevel(level.id)
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
				if (chosen) {

				}
			}
			changeCategory(routeName)

			let NPCDatas = getTrainerClassesFromLevelCategory(routeName)
			NPCDatas.forEach(data => {
				loadTrainerClassSprites(data)
			})
		} break
		case "pc": {
			fadeInGame()
			let pcBoxData
			let currentBox = null
			let currentBoxIndex = -1
			const resetBoxData = index => {
				currentBox = null
				currentBoxIndex = -1
				getPlayerBoxes(playerSaveId)
					.then(val => {
						pcBoxData = val
						loadBox(index)
					})
			}
			resetBoxData(0)

			let pcTag = $(`<div id='pc'></div>`)
			gameTag.append(pcTag)

			let pcHeader = $(`<div id='pc-header'></div>`)
			pcTag.append(pcHeader)

			let prevBoxBtn = $(`<div id='pc-prev-box-btn' class='button' style='opacity:0'><i class='bi bi-caret-left-fill'></i></div>`)
			pcHeader.append(prevBoxBtn)
			let boxName = $(`<div id='pc-box-name'></div>`)
			pcHeader.append(boxName)

			boxName.click(() => {
				let oldIndex = currentBoxIndex
				viewBoxInfo(currentBox)
					.then(shouldReset => {
						if (shouldReset) {
							let newIndex = oldIndex > 0 ? oldIndex - 1 : 0
							resetBoxData(newIndex)
						} else {
							resetBoxData(oldIndex)
						}
					})
			})

			let nextBoxBtn = $(`<div id='pc-next-box-btn' class='button'><i class='bi bi-caret-right-fill'></i></div>`)
			pcHeader.append(nextBoxBtn)

			let pcBox = $(`<div id='pc-box'></div>`)
			pcTag.append(pcBox)

			let currentBoxPokemon = []
			const loadBox = index => {
				let box = pcBoxData[index]
				currentBox = box
				currentBoxIndex = index
				displayBox(box)
			}
			const displayBox = box => {
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
						//Remove all of the old pokemon
						currentBoxPokemon.splice(0, currentBoxPokemon.length)

						pokemonList.sort((a, b) => {
							return a.pcBoxY - b.pcBoxY
						})
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
				let source = pokemon.getImage("home")

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
				pcBox.off("mouseup").on("mouseup", handleMouseUp2)
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
				for (let i = 0; i < 6; i++) {
					let container = $(`<div class='active-pokemon-box col col-5'></div>`)
					let p = playerActivePokemon[i]
					container.attr("data-index", i)
					if (p) {
						container.attr("data-pokemon-id", p.uuid)
						let image = p.getImage("home")
						let img = $(`<img src='${image}' class='pokemon-image'>`)
						img.css("opacity", 1)
						container.append(img)
						container.css("cursor", "pointer")
					}
					container.on("mousedown", handleMouseDown)
					container.on("mouseup", handleMouseUp)
					activePokemonTag.append(container)
				}
				allBoxes = activePokemonTag.children(".active-pokemon-box")
				allImages = allBoxes.children(".pokemon-image")
				allImages.on("mousedown", function (event) {
					event.preventDefault()
				})
			}
			const updatePCButtons = () => {
				let index = pcBoxData.indexOf(currentBox)
				if (index === 0) {
					prevBoxBtn.css({
						"pointer-events": "none"
					})
						.animate({ opacity: 0 })
				} else {
					prevBoxBtn.css({
						"pointer-events": ""
					})
						.animate({ opacity: 1 })
				}
				if (index === pcBoxData.length - 1) {
					nextBoxBtn.children(".bi").removeClass("bi-caret-right-fill")
						.addClass("bi-plus")
				} else {
					nextBoxBtn.children(".bi").removeClass("bi-plus")
						.addClass("bi-caret-right-fill")
				}
			}
			const nextPCBox = () => {
				let index = pcBoxData.indexOf(currentBox)
				if (index < pcBoxData.length - 1) {
					loadBox(index + 1)
				} else {
					//Make a new box
					let newName = getNextBoxName(pcBoxData)
					makeNewBox(playerSaveId, newName)
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
				if (index > 0) {
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
				if (screenRatio < boxRatio) {
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

			const openPokemon = pokemon => {
				let options = {
					canRename: true,
					canSwitchActiveMoves: true,
					canSwitchPokeball: true,
					pc: true
				}
				return viewPokemonInfo(pokemon, options)
			}

			let activeBox
			let lastMouseDownAt
			let lastMouseDown
			let mouseClickTime = 150
			const handleMouseUp = (event) => {
				let box = activeBox
				let id = box.attr("data-index")
				let index = parseInt(id)
				let pokemon = playerActivePokemon[index]
				if (!pokemon) return
				let now = Date.now()
				let diff = now - lastMouseDown
				if (
					diff < mouseClickTime ||
					(mouse.x === lastMouseDownAt[0] && mouse.y === lastMouseDownAt[1])
				){
					let alreadySelected = box.hasClass("selected")
					allBoxes.removeClass("selected")
					if (!alreadySelected) {
						box.addClass("selected")
						openPokemon(pokemon)
						.then(() => savePokemon(pokemon))
						.then(() => box.removeClass("selected"))
					}
				}
			}
			const handleMouseDown = (event) => {
				let box = $(event.currentTarget)
				activeBox = box
				let id = box.attr("data-index")
				let index = parseInt(id)
				let pokemon = playerActivePokemon[index]
				lastMouseDown = Date.now()
				lastMouseDownAt = [mouse.x, mouse.y]
				stopHolding()
				if (!pokemon) return
				delay(mouseClickTime).then(() => {
					if (mouse.isDown && pokemon) {
						heldPokemon = playerActivePokemon[index]
						beginHolding(heldPokemon)
						box.children("img").hide()
					}
				})
			}
			const handleMouseUp2 = (event) => {
				let box = activeBox
				let id = box.attr("data-pokemon-id")
				let pokemon = currentBoxPokemon.find(p => p.uuid === id)
				if (!pokemon) return
				let now = Date.now()
				let diff = now - lastMouseDown
				console.log(mouse.x, mouse.y, lastMouseDownAt)
				if (
					diff < mouseClickTime ||
					(mouse.x === lastMouseDownAt[0] && mouse.y === lastMouseDownAt[1])
				){
					openPokemon(pokemon)
					.then(() => savePokemon(pokemon))
				}
			}
			const handleMouseDown2 = (event) => {
				event.preventDefault()
				let box = $(event.currentTarget)
				activeBox = box
				let id = box.attr("data-pokemon-id")
				let pokemon = currentBoxPokemon.find(p => p.uuid === id)
				lastMouseDown = Date.now()
				lastMouseDownAt = [mouse.x, mouse.y]
				stopHolding()
				if (!pokemon) return
				// console.log(p)
				delay(mouseClickTime).then(() => {
					heldPokemon = pokemon
					beginHolding(heldPokemon)
					box.hide()
				})
			}
			const beginHolding = pokemon => {
				$("#pokemon-dragger").remove()
				let tag = $(`<img id='pokemon-dragger'>`)
				tag.css("opacity", 0)
				heldPokemonTag = tag
				let image = pokemon.getImage("home")
				tag.attr("src", image)
				$("body").append(tag)
					.css("cursor", "pointer")
				holdInterval = setInterval(dragPokemon, 10)
			}
			const dragPokemon = () => {
				if (!mouse.isDown) {
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
				if (heldPokemonTag) {
					heldPokemonTag.remove()
				}

				$("body").css({
					cursor: ""
				})

				//Were we hovering over an active pokemon slot?
				let promises = []
				let hovered = document.elementsFromPoint(mouse.x, mouse.y)
				let hoveredActiveBox = [...hovered].find(elem => $(elem).hasClass("active-pokemon-box"))
				// let hoveredBox = [...hovered].find(elem => elem === pcBox[0])
				if (hoveredActiveBox) {
					let index = $(hoveredActiveBox).attr("data-index")
					if (index) {
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
					let minBoxX = currentBox.minX
					let maxBoxX = currentBox.maxX
					let minBoxY = currentBox.minY
					let maxBoxY = currentBox.maxY
					let shouldUseSlots = currentBox.useSlots

					//Clamp coordinates
					let tooLeft = left < minBoxX
					let tooTop = top < minBoxY
					let tooRight = left > maxBoxX
					let tooBottom = top > maxBoxY
					if (tooLeft) left = minBoxX
					if (tooTop) top = minBoxY
					if (tooRight) left = maxBoxX
					if (tooBottom) top = maxBoxY

					//If there are slots, figure out the coords closest to the given coords.
					if (shouldUseSlots) {
						let slotNumbers = determinePCBoxSlotNumber(currentBox, left, top)
						let otherPokemonInSameSlot = currentBoxPokemon.filter(boxPokemon => {
							if (heldPokemon === boxPokemon) return false
							let otherSlotNumbers = determinePCBoxSlotNumber(currentBox, boxPokemon.pcBoxX, boxPokemon.pcBoxY)
							let matches = otherSlotNumbers.every((number, index) => number === slotNumbers[index])
							return matches
						})
						let coords = determinePCBoxSlotCoords(currentBox, left, top)
						if (otherPokemonInSameSlot.length) {
							let oldLeft = heldPokemon.pcBoxX
							let oldTop = heldPokemon.pcBoxY
							left = coords[0]
							top = coords[1]
							console.log(oldLeft, oldTop)
							otherPokemonInSameSlot.forEach(otherPokemon => {
								otherPokemon.pcBoxX = oldLeft
								otherPokemon.pcBoxY = oldTop
								promises.push(savePokemon(otherPokemon))
							})
							console.log(otherPokemonInSameSlot)
						} else {
							left = coords[0]
							top = coords[1]
						}
					}

					//Don't let the player remove their last pokemon
					let onlyOnePokemon = playerActivePokemon.filter(p => p).length === 1
					let active = playerActivePokemon.includes(heldPokemon)
					let satisfiesActiveRule = !onlyOnePokemon || !active
					console.log(left, top)

					if (satisfiesActiveRule) {
						heldPokemon.pcBox = currentBox.uuid
						heldPokemon.pcBoxX = left
						heldPokemon.pcBoxY = top

						let boxIndex = currentBoxPokemon.indexOf(heldPokemon)
						if (boxIndex !== -1) {
							currentBoxPokemon.splice(boxIndex, 1)
						}

						let index = playerActivePokemon.indexOf(heldPokemon)
						if (index !== -1) {
							playerActivePokemon[index] = undefined
						}
					} else {
						let message = getLocaleString("error-cant-remove-last-pokemon", lang)
						createAnnouncement("general", message)
					}

					currentBoxPokemon.push(heldPokemon)
				}

				promises.push(savePokemon(heldPokemon))

				Promise.all(promises)
					.then(() => loadBox(pcBoxData.indexOf(currentBox)))
				heldPokemonTag = null
				heldPokemon = null
				updateBoxes()
			}
			const swapActivePokemon = (p1, index) => {
				let p2 = playerActivePokemon[index]
				let p1Index = playerActivePokemon.indexOf(p1)
				playerActivePokemon[index] = p1
				if (p1Index !== -1) {
					playerActivePokemon[p1Index] = undefined
				}
				if (p2) {
					p2.pcBox = p1.pcBox
					p2.pcBoxX = p1.pcBoxX
					p2.pcBoxY = p1.pcBoxY
				}
				p1.pcBox = null
				p1.pcBoxX = null
				p1.pcBoxY = null
				savePokemon(p1)
				if (p2) {
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

			const pcTick = () => {

			}
			let pcInterval = setInterval(pcTick, 10)

			let confirmText = getLocaleString("confirm", lang)
			let confirmButton = $(`<button class='btn big-btn btn-primary m-3'>${confirmText}</button>`)
			adminTag.append(confirmButton)
			confirmButton.click(() => {
				leaveScene()
				changeScene("route")
			})

			let pokedexText = getLocaleString("pokedex", lang)
			let pokedexButton = $(`<button class='btn big-btn btn-primary m-3'>${pokedexText}</button>`)
			if (playerSaveInfo["unlocked-pokedex"]) {
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

			let inputSection = $(`<div class='d-flex justify-content-center w-100'>`)
			dexWindow.append(inputSection)
			let settingsBtn = $(`<button class='btn btn-primary m-3'>`)
			settingsBtn.html(`<i class="bi bi-gear-fill"></i>`)
			inputSection.append(settingsBtn)
			let prevBtn = $(`<button class='btn btn-primary m-3'>`)
			prevBtn.html(`<i class="bi bi-caret-left-fill"></i>`)
			inputSection.append(prevBtn)
			let searchBox = $(`<input class='search text-center form-control m-3 w-50'>`)
			inputSection.append(searchBox)
			let nextBtn = $(`<button class='btn btn-primary m-3'>`)
			nextBtn.html(`<i class="bi bi-caret-right-fill"></i>`)
			inputSection.append(nextBtn)
			let statsBtn = $(`<button class='btn btn-primary m-3'>`)
			statsBtn.html(`<i class="bi bi-bar-chart-line-fill"></i>`)
			inputSection.append(statsBtn)

			const openSettings = () => {
				let modal = $("#modal")
				clearModal(modal)
				modal.addClass("fade")
				let changedSomething = true
				let body = modal.find(".modal-body")

				const makeChange = () => {
					determinePages()
					pageNum = 0
					displayPage(pageNum)
				}

				let baseSectionHTML = `<div class='d-flex justify-content-between align-items-center flex-wrap'>`

				modal.find(".modal-header").addClass("justify-content-center")
				modal.find(".modal-title").html(`<h6 class='display-6 text-center'>Options</h6>`)
				let form = $(`<div class='mx-auto'>`)
				body.append(form)
				let pageSizeSection = $(baseSectionHTML)
				form.append(pageSizeSection)
				pageSizeSection.append(`<label>Items per page:</label>`)
				let pageSizeInput = $(`<input class='form-control w-50' type='number'>`)
				pageSizeInput.val(pageSize)
				pageSizeSection.append(pageSizeInput)
				pageSizeInput.on("input", () => {
					let newVal = Number(pageSizeInput.val()) || 25
					changedSomething = changedSomething || newVal !== pageSize
					pageSize = newVal
					if (changedSomething){
						makeChange()
					}
				})

				let obtainableSection = $(baseSectionHTML)
				form.append(obtainableSection)
				let obtainableInput = $(`<select class='form-select mx-1 w-50'></select>`)
				obtainableInput.append(`<option value="" selected>`)
				obtainableInput.append(`<option value="obtainable">Obtainable</option>`)
				obtainableInput.append(`<option value="unobtainable">Unobtainable</option>`)
				if (filters.obtainable === true){
					obtainableInput.val("obtainable")
				} else if (filters.obtainable === false){
					obtainableInput.val("unobtainable")
				}
				obtainableSection.append(`<label>Obtainable:</label>`)
				obtainableSection.append(obtainableInput)
				obtainableInput.change(() => {
					let oldVal = filters.obtainable
					let val = obtainableInput.val()
					if (val === "obtainable"){
						filters.obtainable = true
					} else if (val === "unobtainable"){
						filters.obtainable = false
					} else {
						delete filters.obtainable
					}
					if (oldVal !== filters.obtainable){
						makeChange()
					}
				})

				let typesSection = $(baseSectionHTML).removeClass("justify-content-between")
				.addClass("justify-content-center").addClass("mt-2")
				let typeCheckboxes = $()
				form.append(typesSection)
				for (let type of types){
					if (type === "Typeless") continue
					let typeIcon = getTypeIcon(type)
					let typeBox = $(`<div class='form-check form-check-inline d-flex align-items-center'>`)
					typesSection.append(typeBox)
					let typeCheckbox = $(`<input type='checkbox' class='form-check-input'>`)
					typeCheckbox.attr("name", "pokedex-filter-type")
					typeBox.append(typeCheckbox)
					let id = ("pokedex-filter-setting-"+type).split(" ").join("-")
					typeCheckbox.val(type).attr("id", id)
					let label = $(`<label class='form-check-label'>`)
					typeBox.append(label)
					label.attr("for", id)
					let img = $(`<img>`)
					label.append(img)
					img.attr("src", typeIcon).css("height", "2em")
					typeCheckboxes = typeCheckboxes.add(typeCheckbox)
					typeCheckbox.change(() => {
						let chosenTypes = []
						for (let checkbox of typeCheckboxes){
							let check = $(checkbox)
							if (!check.is(":checked")) continue
							chosenTypes.push(check.val())
						}
						if (!chosenTypes.length){
							delete filters.types
						} else {
							filters.types = chosenTypes
						}
						makeChange()
					})

					if (filters.types?.includes(type)){
						typeCheckbox.attr("checked", true)
					}
				}
				let typeExclusivityBox = $(`<div class='form-check form-check-inline d-flex align-items-center'>`)
				typesSection.append(typeExclusivityBox)
				let typeExclusivityCheckbox = $(`<input type='checkbox' class='form-check-input'>`)
				.attr("id", "pokedex-filter-setting-type-exclusivity")
				typeExclusivityBox.append(typeExclusivityCheckbox)
				.append(`<label class='form-check-label d-flex align-items-center' for='pokedex-filter-setting-type-exclusivity' style='height: 2em; width: 2em;'>Exclusive</label>`)
				typeExclusivityBox.change(() => {
					filters.typeExclusivity = typeExclusivityCheckbox.is(":checked")
					makeChange()
				})

				modal.modal("show")
				modal.on("hidden.bs.modal", () => {
					
				})
			}
			settingsBtn.click(openSettings)

			let showingStats = 0
			const toggleStats = () => {
				showingStats += 1
				showingStats %= 3
				if (showingStats === 0){
					pokemonListTag.attr("data-showing", "main")
					statsBtn.css("background-color", "")
					statsBtn.css("border-color", "")
					statsBtn.css("color", "")
				}
				else if (showingStats === 1) {
					pokemonListTag.attr("data-showing", "stats")
					statsBtn.css("background-color", "var(--health-high)")
					statsBtn.css("border-color", "var(--health-high)")
					statsBtn.css("color", "")
				}
				else if (showingStats === 2) {
					pokemonListTag.attr("data-showing", "shiny-stats")
					statsBtn.css("background-color", "var(--shiny-color)")
					statsBtn.css("border-color", "var(--shiny-color)")
					statsBtn.css("color", "black")
				}
			}
			statsBtn.click(toggleStats)

			const generateSection = pData => {
				let pokemonId = pData.id
				let pokemonOptions = {
					isShiny: false
				}
				let pokemon = new Pokemon(undefined, pokemonId, pokemonOptions)
				let stats = pokemonStats[pokemonId]
				let section = $(`<div class='pokemon-section'></div>`)

				section.click(() => {
					viewPokemonInfo(pokemon, { pure: true, dex: true, canSwitchActiveMoves: false })
				})

				let mainSection = $(`<div class='main-section'>`)
				section.append(mainSection)

				let imageSection = $(`<div class='pokemon-image-section'>`)
				mainSection.append(imageSection)

				let url = pokemon.getImage()
				let pokemonImgBg = $(`<div class='pokemon-image-bg'>`)
				pokemonImgBg.css("mask-image", `url(${url})`)
				imageSection.append(pokemonImgBg)

				let pokemonImg = $(`<img class='pokemon-image'>`)
				pokemonImg.attr("src", url)
				imageSection.append(pokemonImg)

				let textSection = $(`<div class='pokemon-name-section'></div>`)
				mainSection.append(textSection)
				let pokemonNumberTag = $(`<div class='pokemon-number'></div>`)
				pokemonNumberTag.html(`#${pData.number}`)
				textSection.append(pokemonNumberTag)
				let pokemonNameTag = $(`<div class='pokemon-name'></div>`)
				textSection.append(pokemonNameTag)
				let name = getLocaleString("name", lang, ["pokemon", pokemonId])
				if (stats["seen"] === 0 && stats["caught"] === 0) {
					name = name.replaceAll(/./g, "?")
				}
				pokemonNameTag.html(name)

				if (stats["seen"] === 0 && stats["caught"] === 0) {
					section.addClass("not-seen")
				}
				if (stats["caught"] === 0) {
					section.addClass("not-caught")
				} else {
					section.addClass("caught")
				}

				let shinyIndicator = $("<div class='shiny-indicator'>")
				mainSection.append(shinyIndicator)
				if (stats["caught-shiny"]){
					shinyIndicator.append(`<img src='src/img/icons/stars-fill.svg'>`)
				} else if (stats["seen-shiny"]){
					shinyIndicator.append(`<img src='src/img/icons/stars.svg'>`)
				}
				
				let statsSection = $(`<div class='stats stats-section'>`)
				section.append(statsSection)
				let shinyStatsSection = $(`<div class='stats shiny-stats-section'>`)
				section.append(shinyStatsSection)

				statsSection.append(`<span>Seen: ${stats["seen"]}</span>`)
				statsSection.append(`<span>Caught: ${stats["caught"]}</span>`)
				shinyStatsSection.append(`<span>Seen: ${stats["seen-shiny"]}</span>`)
				shinyStatsSection.append(`<span>Caught: ${stats["seen-shiny"]}</span>`)

				pokedexSections[pokemonId] = section
			}
			let pokedexSections = {}

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
			pokemonListTag.attr("data-showing", "main")
			dexWindow.append(pokemonListTag)
			
			let pageNum = 0
			let pageSize = 25
			let pages = []
			let filters = {}
			const determinePages = () => {
				pages = []
				pages.push([])
				for (let i = 0; i < pokemonList.length; i++){
					let pageI = pages.length - 1
					let lastPage = pages[pageI]
					if (lastPage.length === pageSize){
						pageI++
					}

					let pData = pokemonList[i]
					let fitsFilters = true
					if (filters.name){
						let name = getLocaleString("name", lang, ["pokemon", pData.id]).toLowerCase()
						if (!name.includes(filters.name.toLowerCase())){
							fitsFilters = false
						}
					}

					if ("obtainable" in filters){
						let obtainMethods = findPokemonLocations(pData)
						if (!!obtainMethods.length !== filters.obtainable){
							fitsFilters = false
						}
					}

					if ("types" in filters){
						let types = filters.types
						let possibleTypes = []
						let pTypes = pData.types
						possibleTypes.push(pTypes)
						if (pData.hasForms){
							for (let formId in pData.forms){
								let formData = pData.forms[formId]
								if ("types" in formData){
									pTypes = pTypes.concat(formData.types)
									pTypes = noDuplicates(pTypes)
									possibleTypes.push(formData.types)
								}
							}
						}
						let matches = true
						if (filters.typeExclusivity){
							matches = possibleTypes.some(typeCombo => {
								return types.every(type => typeCombo.includes(type))
							})
						} else {
							matches = possibleTypes.some(typeCombo => {
								return types.some(type => typeCombo.includes(type))
							})
						}
						if (!matches){
							fitsFilters = false
						}
					}

					if (!fitsFilters) continue

					if (!pages[pageI]){
						pages[pageI] = []
					}
					let page = pages[pageI]
					page.push(pData)
				}
			}

			const displayPage = pageNum => {
				pokemonListTag.empty()
				let page = pages[pageNum]
				for (let data of page) {
					generateSection(data)
					let section = pokedexSections[data.id]
					pokemonListTag.append(section)
				}
				allPokemonSections = pokemonListTag.children(".pokemon-section")

				if (pages.length > 1){
					prevBtn.removeAttr("disabled")
					nextBtn.removeAttr("disabled")
				} else {
					prevBtn.attr("disabled", true)
					nextBtn.attr("disabled", true)
				}
			}

			nextBtn.click(() => {
				pageNum += 1
				pageNum %= pages.length
				displayPage(pageNum)
			})
			prevBtn.click(() => {
				pageNum += pages.length - 1
				pageNum %= pages.length
				displayPage(pageNum)
			})
			searchBox.on("input", () => {
				let name = searchBox.val()
				if (!name){
					delete filters.name
				} else {
					filters.name = name
				}
				determinePages()
				pageNum = 0
				displayPage(pageNum)
			})

			let adminTag = $(`<div id='pokedex-admin'></div>`)
			pokedexTag.append(adminTag)

			let backButton = $("<button class='btn btn-primary big-btn back-btn'>Back</button>")
			adminTag.append(backButton)

			let allPokemonSections = $()
			let bgUpAmt = 0
			const pcTick = () => {
				if (!allPokemonSections.length) return
				let height = $(allPokemonSections[0]).height()
				bgUpAmt = Date.now() % (height * 100)
				let amt = bgUpAmt / 100
				allPokemonSections.css("background-position", `top ${amt}px left`)
			}
			let dexInterval = setInterval(pcTick, 10)

			const leaveScene = () => {
				clearInterval(dexInterval)
				resolvePromise()
			}

			determinePages()
			displayPage(pageNum)
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

function changeScene(name, options) {
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)
	let gameTag = $("#game")
	$(".popover").fadeOut().queue(function () { $(this).remove() })

	let dialogueIsVisible = $("#dialogue-container").css("display") !== "none"
	if (dialogueIsVisible){
		$("#dialogue-container").fadeOut()
	}

	if (name !== currentSceneInfo.name) {
		let toHide = gameTag.css("display") === "none" ? $("#board") : gameTag
		toHide.fadeOut(() => {
			gameTag.removeClass("choosing-starter")
			resolvePromise()
		})
	} else {
		resolvePromise()
	}

	if (name) {
		promise = promise.then(() => startScene(name, options))
	}
	return promise
}

function catchPokemon(pokemon) {
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)

	let promises = []
	pokemon.owner = playerSaveId
	caughtPokemon.push(pokemon)
	if (playerActivePokemon.length < 6) {
		playerActivePokemon.push(pokemon)
	} else {
		let lastBox = playerPCBoxes[playerPCBoxes.length - 1]
		promises.push(putPokemonInBox(lastBox, pokemon))
	}

	//Later, asking to rename pokemon whenever you catch one should be optional.
	//TODO
	promises.push(askToRenamePokemon(pokemon))

	Promise.all(promises)
		.then(() => savePokemon(pokemon))
		.then(() => {
			let total = playerSaveInfo["total-pokemon-caught"] || 0
			playerSaveInfo["total-pokemon-caught"] = total + 1
			return logPokemonAs("caught", pokemon)
		})
		.then(() => {
			if (pokemon.isShiny) {
				let total = playerSaveInfo["total-shiny-pokemon-caught"] || 0
				playerSaveInfo["total-shiny-pokemon-caught"] = total + 1
				return logPokemonAs("caught-shiny", pokemon)
			}
			return Promise.resolve()
		})
		.then(() => {
			resolvePromise()
		})


	return promise
}

function askToRenamePokemon(pokemon) {
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

class LevelProgress {
	constructor(levelId, level){
		this.id = levelId
		this.level = level
		this.effects = level.effects
		this.info = []
		this.variables = {}
		this.winningAllowed = true
		this.effectIndex = -1
		this.nextEffectIndex = 0

		this.promise = new Promise(res => {
			this.resolve = res
		})
	}

	hasLost(){
		let lostFights = this.effects.some((effect, i) => {
			return this.info[i] === "lose" && effect.type === "fight"
		})
		let lostTournaments = this.effects.some((effect, i) => {
			return this.info[i] === "lose" && effect.type === "tournament"
		})
		let lostStuff = lostFights || lostTournaments
		let forgiving = this.level.forgiving
		if (lostStuff && forgiving){
			lostStuff = false
		}
		let canWin = this.winningAllowed
		return lostStuff || !canWin
	}
}

let currentLevelProgress
function beginLevel(levelID) {
	let level = getLevelDataById(levelID)
	if (level.music) {
		changeMusic(level.music)
	}

	if (gameRound) {
		clearInterval(gameRound.tickInterval)
	}
	gameRound = undefined
	gameBoard = undefined

	currentLevelProgress = new LevelProgress(levelID, level)

	let levelChangesMap = new Map()
	if (level.recommendedLevels && config["lowerLevelsToRecommendedLevels"]){
		let key = config["hardMode"] ? "hard" : "normal"
		let recommendation = level.recommendedLevels
		if (key in recommendation){
			let lvl = recommendation[key]
			if (typeof lvl === "function"){
				lvl = lvl(playerActivePokemon)
			}
			for (let pokemon of playerActivePokemon){
				if (pokemon.level <= lvl) continue
				let change = {
					pokemon: pokemon,
					exp: pokemon.exp,
					from: pokemon.level,
					to: lvl
				}
				levelChangesMap.set(pokemon, change)
				pokemon.changeLevel(lvl)
			}
		}
	}

	level.attempts++
	let levelResult
	let promise = advanceCurrentLevel()
	.then(val => {
		currentLevelProgress.resolve()
		let promise = Promise.resolve()
		let lost = currentLevelProgress.hasLost()
		
		if (lost) {
			levelResult = "lose"
		} else {
			levelResult = "win"
		}

		//Losing does nothing to the database, but winning does.
		if (levelResult === "lose") {
			console.log("You lose :(")
		} else if (levelResult === "win") {
			level.status = "won"
			level.completions++
			promise = promise.then(() => saveLevelStatus(level, "won"))
		}

		//If we changed any of your pokemon's levels, reset them.
		levelChangesMap.forEach((change, pokemon) => {
			pokemon.changeLevel(change.from)
			pokemon.exp = change.exp
		})

		//You get healed at the end of the level if all your pokemon are unusable
		let shouldHeal = playerActivePokemon.every(pokemon => !isPokemonUsable(pokemon))
		if (shouldHeal) {
			healAllPokemon(playerActivePokemon)
		}

		//Save the player's pokemon...
		for (let pokemon of playerActivePokemon){
			promise = promise.then(() => {
				return savePokemon(pokemon)
			})
		}

		//Then save the player themself.
		promise = promise.then(() => {
			console.log(playerSaveInfo)
			return savePlayerInfo()
		})

		let routeName = level.category
		changeScene("route", { name: routeName })
		return promise
	})

	return promise
}
function advanceCurrentLevel() {
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)
	let level = currentLevelProgress.level
	let effects = currentLevelProgress.effects
	currentLevelProgress.effectIndex = currentLevelProgress.nextEffectIndex
	let effectIndex = currentLevelProgress.effectIndex
	currentLevelProgress.nextEffectIndex++
	let effect = effects[effectIndex]
	let params = getEffectParams(effect, effectIndex, currentLevelProgress)

	if (effectIndex >= effects.length) {
		resolvePromise()
		return promise
	}

	// console.log(effect, effectIndex, params)

	let index
	if (effect.jumpTo) {
		if (typeof effect.jumpTo === "string") {
			index = effects.findIndex(e => e.label === effect.jumpTo)
		} else {
			index = effect.jumpTo
		}
	}

	switch (effect.type) {
		case "stop-music": {
			for (let soundName in sounds) {
				let type = sounds[soundName].type
				if (type === "music") {
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

			let trainerIndex = effect.trainer ?? 0
			let trainerData = level.trainers[trainerIndex]
			beginRound(trainerData)
				.then(val => new Promise(res => {
					currentLevelProgress.info[effectIndex] = val
					res(val)
				}))
				.then(outcome => resolvePromise(outcome))
		} break
		case "tournament": {
			changeScene("fight")

			let wins = 0
			let neededWins = effect.neededWins ?? 0
			let dialogueSources = effect.dialogues || []
			let contestantTag = effect.contestantTag ?? "contestant"
			let trainers = level.trainers.filter(tData => {
				let tags = tData.tags ?? []
				return tags.includes(contestantTag)
			})
			let trainerIndexes = trainers.map(tData => level.trainers.indexOf(tData))
			let foughtTrainers = []
			const advance = () => {
				let p = Promise.resolve()
				let availableTrainerIndexes = trainerIndexes.filter(index => {
					return !foughtTrainers.includes(index)
				})
				if (!availableTrainerIndexes.length){
					finish("win")
					return
				}

				if (dialogueSources[wins]){
					let source = dialogueSources[wins]
					let dialogueOptions = {
						fadeOut: false
					}
					p = p.then(() => tryToBeginDialogue(source, dialogueOptions))
				}

				let index = randomChoice(availableTrainerIndexes)
				let trainerData = level.trainers[index]

				let roundOptions = {
					fadeOutAfterOutro: false
				}
				if (wins > 0 && effect.waningHP){
					let percent = wins / neededWins
					let remainingHP = Math.pow(0.6, wins)
					remainingHP = Math.min(remainingHP + 0.1, 1)
					roundOptions.remainingHP = remainingHP
				}

				p = p.then(() => beginRound(trainerData, roundOptions))
				.then(val => {
					foughtTrainers.push(index)
					if (val === "win"){
						wins++
						if (wins >= neededWins){
							finish("win")
						} else {
							advance()
						}
					} else {
						if (effect.lossDialogue){
							let lossDialogue = effect.lossDialogue
							tryToBeginDialogue(lossDialogue)
							.then(() => finish("lose"))
						}
					}
				})
			}
			const finish = outcome => {
				currentLevelProgress.info[effectIndex] = outcome
				resolvePromise(outcome)
			}

			advance()
		} break
		case "dialogue": {
			$("#game").fadeOut()

			let dialogueOptions = {}
			if ("fadeOut" in effect){
				dialogueOptions.fadeOut = effect.fadeOut
			}

			tryToBeginDialogue(effect.source, dialogueOptions)
			.then(dialogueData => {
				currentLevelProgress.info[effectIndex] = dialogueData.variables
			})
			.then(() => resolvePromise())
		} break
		case "random-number": {
			let min = effect.min ?? 0
			let max = effect.max ?? 10
			let val = Math.floor(Math.random() * (max - min + 1)) + min
			currentLevelProgress.info[effectIndex] = val
			resolvePromise()
		} break
		case "get-val-from-obj": {
			let obj = params.obj
			currentLevelProgress.info[effectIndex] = obj[effect.key]
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
		case "unlock-z-move-type": {
			let type = effect.unlockedType
			let unlocked = playerSaveInfo["z-moves-unlocked"]
			if (!unlocked.includes(type)){
				unlocked.push(type)
			}
			resolvePromise()
		} break
		case "change-background-image": {
			let imgName = effect.name
			let images = level.images
			let wait = effect.wait ?? true
			if (imgName in images){
				let url = images[imgName]
				let combineFades = effect.combineFades ?? false
				let duration = effect.duration ?? 400
				let p = changeBackgroundImage(imgName, url, duration, combineFades)
				if (wait){
					p.then(() => resolvePromise())
				} else {
					resolvePromise()
				}
			}
		} break
		case "load-value": {
			currentLevelProgress.info[effectIndex] = effect.value
			resolvePromise()
		} break
		case "set-variable": {
			let variables = currentLevelProgress.variables
			let effectIndex = currentLevelProgress.effectIndex
			let info = currentLevelProgress.info
			let name = effect.name
			variables[name] = info[effectIndex - 1]
			info[effectIndex] = info[effectIndex - 1]
			resolvePromise()
		} break
		case "load-variable": {
			let variables = currentLevelProgress.variables
			let name = effect.name
			info[effectIndex] = variables[name]
			resolvePromise()
		} break
		case "mark-as-lost": {
			currentLevelProgress.winningAllowed = false
			resolvePromise()
		} break
		case "jump-if-lost": {
			let lost = currentLevelProgress.hasLost()
			if (lost) {
				currentLevelProgress.nextEffectIndex = index
			}
			resolvePromise()
		} break
		case "jump-if-equal": {
			let test = currentLevelProgress.info[effectIndex - 2]
			let against = currentLevelProgress.info[effectIndex - 1]
			let index
			if (typeof effect.jumpTo === "string") {
				index = effects.findIndex(e => e.label === effect.jumpTo)
			} else {
				index = effect.jumpTo
			}
			if (test === against) {
				currentLevelProgress.nextEffectIndex = index
			}
			resolvePromise()
		} break
		case "jump-if-truthy": {
			let test = currentLevelProgress.info[effectIndex - 1]
			let index
			if (typeof effect.jumpTo === "string") {
				index = effects.findIndex(e => e.label === effect.jumpTo)
			} else {
				index = effect.jumpTo
			}
			if (test) {
				currentLevelProgress.nextEffectIndex = index
			}
			resolvePromise()
		} break
		case "jump-if-less-than": {
			let test = currentLevelProgress.info[effectIndex - 2]
			let against = currentLevelProgress.info[effectIndex - 1]

			if (test < against) {
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

		if (effects[currentLevelProgress.nextEffectIndex]) {
			return advanceCurrentLevel()
				.then(() => Promise.resolve(val))
		}

		return Promise.resolve(val)
	})

	return promise
}

function choosePokemon(message, pokemon, minChooseable = 1, maxChooseable = 1) {
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
		if (chosen.includes(i)) {
			let index = chosen.indexOf(i)
			let currentlyLegal = isLegal()
			chosen.splice(index, 1)
			if (currentlyLegal && !isLegal()){
				chosen.splice(index, 0, i)
			}
		} else {
			chosen.push(i)
			if (chosen.length > maxChooseable) {
				chosen.splice(0, 1)
			}
		}

		container.children().children(".chooseable").removeClass("active")
		for (let j = 0; j < chosen.length; j++) {
			container.children().children("[data-choose=" + chosen[j] + "]").addClass("active")
		}

		checkLegality()
	}
	const isLegal = () => {
		return chosen.length >= minChooseable && chosen.length <= maxChooseable
	}
	const checkLegality = () => {
		if (isLegal()) {
			btn.attr("disabled", false)
		} else {
			btn.attr("disabled", true)
		}
	}

	let body = modal.find(".modal-body")
	let container = $(`<div class='d-flex flex-wrap justify-content-between container'></div>`)
	for (let i = 0; i < pokemon.length; i++) {
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
					<img class='pokemon-image'>
				</div>
			</div>
			<div class='health-bar'>
				<div class='bar'></div>
				<span>${p.hp} / ${p.maxhp}</span>
			</div>
		`)
		chooseable.find(".pokemon-image").attr("src", image)
		let barContainer = chooseable.children(".health-bar")
		let bar = barContainer.children(".bar")
		let healthP = p.hp / p.maxhp
		let color = getHealthColor(healthP)
		bar.css("width", healthP * 100 + "%")
		bar.css("background-color", color)
		box.append(chooseable)
		chooseable.click(function (event) {
			let chosen = $(event.currentTarget).attr("data-choose")
			choose(parseInt(chosen))
		})
		container.append(box)
	}
	body.append(container)
	if (minChooseable > 0) {
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
function viewPokemonInfo(pokemon, options = {}) {
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)
	let canSwitchActiveMoves = options.canSwitchActiveMoves ?? false
	let canSwitchPokeball = options.canSwitchPokeball ?? false
	console.log(pokemon, options)

	let data = pokemon.data
	let closing = true

	let modal = $("#modal")
	clearModal(modal)
	modal.modal("show")
	modal.addClass("wide").addClass("summary")
	let header = modal.find(".modal-header")
	header.addClass("justify-content-center")
	let btn = $(`<button class='btn btn-primary'>Done</button>`)
	modal.find(".modal-footer").append(btn)

	let message = options.message ?? pokemon.name
	let nameTag = $(`<span>${message}</span>`)
	let title = modal.find(".modal-title")
	title.append(nameTag).addClass("display-6")
	if (options.canRename) {
		title.addClass("w-100").addClass("d-flex")
			.addClass("justify-content-center").addClass("align-items-center")
		let renameInput = $(`<input class='form-control m-0 w-50 text-center'>`)
		title.append(renameInput)
		renameInput.css({
			"font-size": "calc(1.375rem + 1.5vw - 0.3em + 0.5px)"
		})
		renameInput.hide()
		let renameBtn = $(`<button class='btn btn-sm h-50 ms-1 btn-primary'>
			<i class="bi bi-pencil-fill"></i>
		</button>`)
		title.append(renameBtn)

		const beginRename = () => {
			// renameBtn.fadeOut(100)
			nameTag.fadeOut(100, () => renameInput.fadeIn(100))
			renameInput.val(pokemon.name)
		}

		const changeName = () => {
			let val = renameInput.val()
			pokemon.name = val
			nameTag.text(val)
			renameInput.fadeOut(100, () => nameTag.fadeIn(100))
		}
		renameInput.change(changeName)

		let renaming = false
		const toggleRename = () => {
			if (!renaming) {
				beginRename()
				renaming = true
			} else {
				changeName()
				renaming = false
			}
		}
		renameBtn.click(toggleRename)
	}

	let body = modal.find(".modal-body")

	body.css("padding-top", 0)
	let tabs = $("<ul class='nav nav-tabs mb-1 justify-content-center'>")
	body.append(tabs)

	let shownSection
	const changeTab = event => {
		tabs.find(".active").removeClass("active")
		let tab = $(event.currentTarget)
		tab.find(".nav-link").addClass("active")
		let className = "." + tab.attr("data-target-class")
		let toFadeIn = sections.children(className)
		shownSection.fadeOut(400, () => {
			shownSection.appendTo(sections)
			if (shownSection === toFadeIn){
				toFadeIn.fadeIn()
			}
		})
		shownSection = toFadeIn
	}
	
	let infoTab = $(`<li class='nav-item' data-target-class='pokemon-info'>
		<a class="nav-link active" href="#">Info</a>
	</li>`)
	tabs.append(infoTab)

	//SECTIONS
	let sections = $("<div class='info-sections'>")
	body.append(sections)

	//POKEMON
	let image = pokemon.getImage()
	let content = $(`
		<div class='info pokemon-info'>
			<div class='pokemon-section m-2'>
				<div class='image text-center'>
					<img src='${image}' class='pokemon-image'>
				</div>
			</div>
			<div class='move-section m-2'></div>
		</div>
	`)
	sections.append(content)
	shownSection = content
	let pokemonSection = content.children(".pokemon-section")

	let typeSection = $(`<div class='type-section d-flex justify-content-center'></div>`)
	pokemonSection.append(typeSection)
	pokemon.types.forEach(type => {
		typeSection.append(`<span class='m-1'>${type}</span>`)
	})

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
	//Misc stats like weight, friendship
	if (true){
		let weight = pokemon.getWeight()
		let weightTag = $(`<div class='stat'>
			<span class='stat-name'>${getLocaleString("weight", lang, ["stats"])}</span>
			<span class='stat-val'>${weight.kilograms}kg</span>
		</div>`)
		statsSection.append(weightTag)
	}
	if (!options.pure){
		let friendshipTag = $(`<div class='stat'>
			<span class='stat-name'>${getLocaleString("friendship", lang, ["stats"])}</span>
			<span class='stat-val'>${pokemon.friendship}</span>
		</div>`)
		statsSection.append(friendshipTag)
	}
	//Pokedex entry if it has one
	if (true){
		let pokedexKey = pokemon.getPokedexKey()
		let entry = getLocaleString(pokedexKey, lang, ["pokemon", data.id], null)
		if (entry){
			pokemonSection.append(`<span class='pokedex-entry'>${entry}</span>`)
		}
	}

	const toggleSelect = (move, moveTag) => {
		let activeIndex = pokemon.activeMoves.indexOf(move)
		if (activeIndex === -1) {
			if (pokemon.activeMoves.length >= 4) {
				createAnnouncement("general", "A Pokemon can't have more than 4 active moves.")
			} else {
				let added = pokemon.addActiveMove(move)
				if (added) {
					moveTag.addClass("active-move")
				}
			}
		} else {
			if (pokemon.activeMoves.length === 1) {
				createAnnouncement("general", "A Pokemon must have at least 1 active move.")
			} else {
				pokemon.activeMoves.splice(activeIndex, 1)
				moveTag.removeClass("active-move")
			}
		}
	}

	let moveSection = content.children(".move-section")

	const addMove = move => {
		let added = false
		let i = pokemon.moves.indexOf(move)
		let moveIsUnlocked = pokemon.movesUnlockedMap[i]
		let requirements = pokemon.data.learnset[i].unlock
		//If move is not available and the move should be hidden, skip the rest of this
		if (!moveIsUnlocked && requirements.type === "hidden") {
			return
		}

		let moveTag = getMoveHTML(move, {
			useLongDescription: true
		})
		if (options.highlightedMoves?.includes(move)){
			added = true
			moveSection.prepend(moveTag)
		}

		//If this isn't even really a pokemon, don't bother marking things as available/not.
		if (options.pure) {
			added = true
			moveSection.append(moveTag)
			moveTag.popover({
				placement: "left",
				trigger: "hover",
				content: getReasonPokemonDoesntMeetRequirements(pokemon, move, options)
			})
			moveTag.on("mouseenter", () => {
				$({ val: 0 }).animate({ val: 1 }, {
					duration: 300,
					step: () => {
						moveTag.popover("update")
					}
				})
			})
			return
		}

		if (!moveIsUnlocked) {
			moveTag.addClass("unavailable")
			moveTag.popover({
				placement: "left",
				trigger: "hover",
				content: getReasonPokemonDoesntMeetRequirements(pokemon, move)
			})
		}
		if (moveIsUnlocked && canSwitchActiveMoves) {
			moveTag.css("cursor", "pointer")
			moveTag.click(function () {
				toggleSelect(move, moveTag)
			})
		}

		let activeIndex = pokemon.activeMoves.indexOf(move)
		if (activeIndex !== -1) {
			moveTag.addClass('active-move')
		}
		if (activeIndex === -1 && options.showOnlyActiveMoves){
			return
		}

		if (!added){
			moveSection.append(moveTag)
		}
	}

	for (let move of pokemon.moves) {
		if (move.name === "Struggle") continue
		let i = pokemon.moves.indexOf(move)
		delay(i * 10).then(() => addMove(move))
	}
	content.append(moveSection)

	//EVOLUTIONS
	if ((options.pc || options.dex) && data.evolutions.length){
		let info = $(`<div class='info evolution-info'>`)
		sections.append(info)
		info.hide()
		let tab = $(`<li class='nav-item' data-target-class='evolution-info'>
			<a class="nav-link" href="#">Evolution</a>
		</li>`)
		tabs.append(tab)
		
		if (options.pc){
			let everstoneSection = $("<div class='text-center m-3'>")
			info.append(everstoneSection)
			let everstoneToggle = $(`<input class="form-check-input" type="checkbox" value="" id="everstone-toggle">`)
			everstoneToggle.prop("checked", pokemon.everstoneActive)
			everstoneToggle.change(() => {
				let checked = everstoneToggle.prop("checked")
				pokemon.everstoneActive = checked
			})
			everstoneSection.append(everstoneToggle)
			let everstoneText = getLocaleString("toggle-everstone", lang)
			everstoneSection.append(`<label class='form-check-label' for="everstone-toggle">
				<img src='src/img/Dream_Everstone_Sprite.png' style="height: 2em;">
				${everstoneText}
			</label>`)
		}

		let evolutions = data.evolutions
		let evolutionsSection = $("<div class='pc-evolutions-display m-1'>")
		info.append(evolutionsSection)
		evolutions.forEach(evolveData => {
			let name = evolveData.name
			let pData = pokemonData[name]
			let section = $("<div class='pc-evolution-item'>")
			evolutionsSection.append(section)
			let displayName = getLocaleString("name", lang, ["pokemon", name])
			section.append(`<div class='pc-evolution-item-name'>
				${displayName}
			</div>`)
			let img = $(`<div class='pc-evolution-item-img'>
				<img src="${pData.imageSources.large}">
			</div>`)
			section.append(img)

			section.popover({
				content: getReasonPokemonDoesntMeetEvolutionRequirements(pokemon, evolveData),
				placement: "top",
				trigger: "hover"
			})

			section.click(() => {
				closing = false
				section.popover("dispose")
				modal.modal("hide")
				delay(400).then(() => {
					let pokemonId = pData.id
					let pokemonOptions = {
						isShiny: false
					}
					let evolvePokemon = new Pokemon(undefined, pokemonId, pokemonOptions)
					viewPokemonInfo(evolvePokemon, {dex: true})
				})
			})
		})
	}

	//LOCATIONS
	if (options.dex) {
		let findingTab = $(`<li class='nav-item' data-target-class='location-info'>
			<a class="nav-link" href="#">Locations</a>
		</li>`)

		let info = $(`<div class='info location-info'>`)
		let locationsTag = $("<div class='d-flex justify-content-center'>")
		info.append(locationsTag)

		let obtainMethods = findPokemonLocations(pokemon.data)

		for (let obtainMethod of obtainMethods){
			if (obtainMethod.type === "level"){
				let level = obtainMethod.level
				let name = getLocaleString("name", lang, ["levels", level.id])
				let button = $("<div class='btn btn-primary m-2'>")
				button.html(name)
				locationsTag.append(button)
				button.click(() => {
					modal.modal("hide")
					delay(400).then(() => beginLevel(level.id))
				})
			}
		}

		if (obtainMethods.length){
			tabs.append(findingTab)
			sections.append(info)
			info.hide()
		}
	}

	//NATURES & OTHER INFO
	if (options.pc || options.dex) {
		let info = $(`<div class='info advanced-info'>`)
		sections.append(info)
		info.hide()
		let tab = $(`<li class='nav-item' data-target-class='advanced-info'>
			<a class="nav-link" href="#">Misc</a>
		</li>`)
		tabs.append(tab)

		//Furfrou
		if (canSwitchPokeball && data.id === "Furfrou"){
			let furfrouSection = $("<div class='pokeball-section d-flex flex-wrap justify-content-around'>")
			info.append(furfrouSection)

			const changeCoat = type => {
				pokemon.form = type
			}
			let forms = data.forms ?? {}
			for (let formId in forms){
				let formData = forms[formId]
				let button = $("<div class='pokeball-option p-2 m-2'>")
				furfrouSection.append(button)

				if (pokemon.form === formId){
					button.addClass("active")
				}

				let img = $("<img>")
				button.append(img)
				let src = formData.imageSources.home
				img.attr("src", src)
				img.css("height", "5em")
				button.click(() => {
					furfrouSection.children(".active").removeClass("active")
					button.addClass("active")
					changeCoat(formId)
				})
			}
		}

		const changePokeball = type => {
			pokemon.pokeballType = type
		}
		let pokeballSection = $("<div class='pokeball-section d-flex flex-wrap justify-content-around'>")
		info.append(pokeballSection)
		for (let pokeballType in pokeballImages){
			if (options.pure) break
			let pokeball = $("<div class='pokeball-option p-2 m-2'>")
			let data = pokeballImages[pokeballType]
			let img = $("<img>")
			pokeball.append(img)
			img.attr("src", data.icon)
			img.css("height", "5em")
			if (pokemon.pokeballType === pokeballType){
				pokeball.addClass("active")
			}

			if (canSwitchPokeball){
				pokeball.click(() => {
					pokeballSection.children(".active").removeClass("active")
					pokeball.addClass("active")
					changePokeball(pokeballType)
				})
				pokeballSection.append(pokeball)
			} else if (pokemon.pokeballType === pokeballType) {
				pokeballSection.append(pokeball)
			}
		}

		let abilitySection = $("<div class='ability-section'>")
		info.append(abilitySection)
		const addAbility = ability => {
			if (typeof ability === "string"){
				ability = pokemonAbilityData[ability]
			}
			let abilityName = getLocaleString("name", lang, ["abilities", ability.id])
			abilitySection.append(`<h4>Ability: ${abilityName}</h4>`)
			let abilityDescription = getLocaleString("longDescription", lang, ["abilities", ability.id])
			abilitySection.append(`<p>${abilityDescription}</p>`)
		}
		if (options.pure){
			let abilities = data.abilities.concat(data.hiddenAbilities)
			abilities.forEach(ability => addAbility(ability))
		} else {
			let ability = pokemon.getEffectiveAbility()
			addAbility(ability)
		}
		
		if (!options.pure){
			let natureName = getLocaleString("name", lang, ["natures", pokemon.nature.name])
			abilitySection.append(`<h4>Nature: ${natureName}</h4>`)
			let natureDesc = getLocaleString("description", lang, ["natures", pokemon.nature.name])
			abilitySection.append(`<p>${natureDesc}</p>`)
		}

		if (!options.pure){
			let chartSection = $("<div class='charts'>")
			info.append(chartSection)
			let ivCanvas = $("<canvas>")
			chartSection.append(ivCanvas)
			let evCanvas = $("<canvas>")
			chartSection.append(evCanvas)

			const ivData = {
				labels: [
					'HP',
					'Attack',
					'Defense',
					'Special Attack',
					'Special Defense',
					'Speed'
				],
				datasets: [{
					label: 'Individual Values',
					data: statNames.map(statName => pokemon.ivs[statName]),
					fill: true,
					backgroundColor: 'rgba(255, 99, 132, 0.2)',
					borderColor: 'rgb(255, 99, 132)',
					pointBackgroundColor: 'rgb(255, 99, 132)',
					pointBorderColor: '#fff',
					pointHoverBackgroundColor: '#fff',
					pointHoverBorderColor: 'rgb(255, 99, 132)'
				}]
			};
			const evData = {
				labels: [
					'HP',
					'Attack',
					'Defense',
					'Special Attack',
					'Special Defense',
					'Speed'
				],
				datasets: [{
					label: 'Effort Values',
					data: statNames.map(statName => pokemon.evs[statName]),
					fill: true,
					backgroundColor: 'rgba(54, 162, 235, 0.2)',
					borderColor: 'rgb(54, 162, 235)',
					pointBackgroundColor: 'rgb(54, 162, 235)',
					pointBorderColor: '#fff',
					pointHoverBackgroundColor: '#fff',
					pointHoverBorderColor: 'rgb(54, 162, 235)'
				}]
			};
			new Chart(evCanvas, {
				type: 'radar',
				data: evData,
				options: {
					responsive: false,
					elements: {
						line: {
							borderWidth: 3
						}
					},
					scales: {
						r: {
							angleLines: {
								display: false
							},
							grid: {
								display: false,
								drawOnChartArea: false,
								drawTicks: false,
							},
							pointLabels: {
								backdropColor: "rgba(0, 0, 0, 0)",
								color: "white"
							},
							ticks: {
								backdropColor: "rgba(0, 0, 0, 0)",
								color: "white",
								beginAtZero: true,
								callback: function (value, index, values) {
									if (Math.floor(value) === value) {
										return value;
									}
								}
							},
							min: 0
						}
					}
				},
			})
			new Chart(ivCanvas, {
				type: 'radar',
				data: ivData,
				options: {
					responsive: false,
					elements: {
						line: {
							borderWidth: 3
						}
					},
					scales: {
						r: {
							angleLines: {
								display: false
							},
							grid: {
								display: false,
								drawOnChartArea: false,
								drawTicks: false,
							},
							pointLabels: {
								backdropColor: "rgba(0, 0, 0, 0)",
								color: "white"
							},
							ticks: {
								backdropColor: "rgba(0, 0, 0, 0)",
								color: "white",
								beginAtZero: true,
								maxTicksLimit: 2
							},
							min: 0,
							max: 32
						}
					}
				},
			})
		}
	}

	//DEBUG
	if (config['debug']){
		let info = $(`<div class='info debug-info'>`)
		sections.append(info)
		info.hide()
		let tab = $(`<li class='nav-item' data-target-class='debug-info'>
			<a class="nav-link" href="#">Debug</a>
		</li>`)

		tabs.append(tab)
		let debugSection = $("<div class='debug-section'>")
		info.append(debugSection)

		let levelChanger = $("<input type='number' class='form-control w-50 m-auto' placeholder='Level'>")
		info.append(levelChanger)
		const changeLevel = () => {
			let targetLevel = Number(levelChanger.val())
			if (isNaN(targetLevel)) targetLevel = 5
			targetLevel = Math.max(targetLevel, 1)
			pokemon.changeLevel(targetLevel)
		}
		levelChanger.change(changeLevel)
	}

	tabs.children().click(changeTab)
	btn.click(() => {
		modal.modal("hide")
	})
	modal.on("hidden.bs.modal", () => {
		moveSection.children(".move").popover("dispose")
		if (closing){
			resolvePromise()
		}
	})
	promise = promise.then(() => {
		$("#modal").find(".modal-content")[0].scrollTop = 0 
	})
	return promise
}
function findPokemonLocations(pokemonData){
	let results = []
	if (pokemonData.tags.includes("Starter")){
		results.push({
			type: "starter"
		})
	}
	for (let preFormId of pokemonData.preEvolutions){
		results.push({
			type: "evolve",
			pokemonId: preFormId
		})
	}
	for (let level of levelData) {
		if (level.obtainablePokemon.includes(pokemonData.id)) {
			results.push({
				type: "level",
				level: level
			})
		}
	}
	return results
}

function viewBoxInfo(box) {
	let resolvePromise
	let promise = new Promise(resolve => resolvePromise = resolve)
	let boxId = box.uuid
	let saveId = box.owner
	console.log(box)

	let modal = $("#modal")
	clearModal(modal)
	modal.modal("show")
	// modal.addClass("wide")
	let header = modal.find(".modal-header")
	header.addClass("justify-content-center")

	let nameTag = $(`<span>${box.name}</span>`)
	let title = header.find(".modal-title")
	title.append(nameTag).addClass("display-6")

	//Renaming
	if (true) {
		title.addClass("w-100").addClass("d-flex")
			.addClass("justify-content-center").addClass("align-items-center")
		let renameInput = $(`<input class='form-control m-0 w-50 text-center'>`)
		title.append(renameInput)
		renameInput.css({
			"font-size": "calc(1.375rem + 1.5vw - 0.3em + 0.5px)"
		})
		renameInput.hide()
		let renameBtn = $(`<button class='btn btn-sm h-50 ms-1 btn-primary'>
			<i class="bi bi-pencil-fill"></i>
		</button>`)
		title.append(renameBtn)

		const beginRename = () => {
			// renameBtn.fadeOut(100)
			nameTag.fadeOut(100, () => renameInput.fadeIn(100))
			renameInput.val(box.name)
		}

		const changeName = () => {
			let val = renameInput.val()
			box.name = val
			nameTag.text(val)
			renameInput.fadeOut(100, () => nameTag.fadeIn(100))
		}
		renameInput.change(changeName)

		let renaming = false
		const toggleRename = () => {
			if (!renaming) {
				beginRename()
				renaming = true
			} else {
				changeName()
				renaming = false
			}
		}
		renameBtn.click(toggleRename)
	}

	let body = modal.find(".modal-body")

	let toggleSection = $("<div class='d-flex justify-content-start'>")
	body.append(toggleSection)
	let toggleUseGridSection = $("<div class='d-flex justify-content-start'>")
	toggleSection.append(toggleUseGridSection)
	let toggleUseGrid = $("<input type='checkbox' id='pcBoxToggleUseGrid'>")
	toggleUseGridSection.append(toggleUseGrid)
	toggleUseGrid.prop("checked", box.useSlots)
	toggleUseGridSection.append("<label for='pcBoxToggleUseGrid'>Snap to Grid?</label>")
	toggleUseGrid.on("change", () => {
		box.useSlots = toggleUseGrid.prop("checked")
	})

	let footer = modal.find(".modal-footer")
	footer.addClass("d-flex").addClass("justify-content-between")

	//You can only click the delete button if the box is empty and you have another box.
	let deleteConditionsMet = {
		empty: false,
		notLastBox: false
	}
	let deleteBtn = $(`<button class='btn btn-danger' disabled>Delete</button>`)
	footer.append(deleteBtn)
	const decideDeleteActiveness = () => {
		let good = Object.keys(deleteConditionsMet).every(key => deleteConditionsMet[key])
		deleteBtn.css("pointer-events", "auto")

		if (good) {
			deleteBtn.off("click").on("click", deleteBox)
				.popover("dispose").prop("disabled", false)
				.css("cursor", "pointer")
		} else {
			let message
			if (!deleteConditionsMet.empty) {
				message = getLocaleString("error-cant-delete-box-isnt-empty", lang)
			} else if (!deleteConditionsMet.notLastBox) {
				message = getLocaleString("error-cant-delete-no-boxes-left", lang)
			}

			deleteBtn.popover("dispose").css("cursor", "default")
			if (message) {
				deleteBtn.popover({
					content: message,
					trigger: "hover",
					placement: "left"
				})
			}
		}
	}
	const deleteBox = () => {
		deletePCBox(boxId)
			.then(() => {
				deleted = true
				modal.modal("hide")
			})
	}
	getPokemonFromBox(boxId)
		.then(pokemonDataList => {
			deleteConditionsMet.empty = pokemonDataList.length === 0
			decideDeleteActiveness()
		})
	getPlayerBoxes(saveId)
		.then(boxList => {
			deleteConditionsMet.notLastBox = boxList.length >= 2
			decideDeleteActiveness()
		})

	let btn = $(`<button class='btn btn-primary'>Done</button>`)
	footer.append(btn)
	btn.click(() => {
		modal.modal("hide")
	})
	let deleted = false
	modal.on("hidden.bs.modal", () => {
		let save = !deleted ? saveBoxObj(box) : Promise.resolve()
		let shouldReset = deleted
		save.then(() => resolvePromise(shouldReset))
	})

	return promise
}

function getStatsHTML(pokemon, options = {}) {
	let abbreviate = options.abbreviate ?? true
	let pure = options.pure ?? false
	//Stats
	let statsTag = $(`<div class='stats'></div>`)
	if (!abbreviate && !pure) {
		let statTag = $("<div class='stat'></div>")
		statTag.append(`<span class='stat-name'>Level</span>`)
		let statVal = $(`<span class='stat-val'>${pokemon.level}</span>`)
		statTag.append(statVal)
		statsTag.append(statTag)
	}
	
	let stats = pokemon.getStats()
	for (let stat in stats) {
		let statName = abbreviate ? getStatAbbr(stat) : getStatName(stat)
		let val, effectiveVal
		if (pure) {
			let stats = pokemon.getStats()
			val = stats[stat]
			effectiveVal = val
		} else {
			val = pokemon.getStat(stat)
			if (options.game){
				effectiveVal = options.game.getEffectiveStat(stat, pokemon.trainer, pokemon)
			} else {
				effectiveVal = pokemon.getEffectiveStat(stat)
			}
		}
		let statTag = $("<div class='stat'></div>")
		statsTag.append(statTag)
		statTag.append(`<span class='stat-name'>${statName}</span>`)
		let statVal = $("<span class='stat-val'></span>")

		if (effectiveVal > val) {
			statVal.addClass("up")
				.append("<i class='bi bi-arrow-up'></i>")
		} else if (effectiveVal < val) {
			statVal.addClass("down")
				.append("<i class='bi bi-arrow-down'></i>")
		}

		if (stat === "hp" && !abbreviate && !pure) {
			statVal.append(`${pokemon.hp} / ${effectiveVal.toFixed(0)}`)
		} else {
			statVal.append(effectiveVal.toFixed(0))
		}
		statTag.append(statVal)
	}
	return statsTag
}
function getMasteryHTML(pokemon, options = {}) {
	let abbreviate = options.abbreviate ?? true
	let pure = options.pure ?? false
	let stats = $(`<div class='stats mastery'></div>`)
	let energyMastery
	if (pure) {
		energyMastery = pokemon.data.energyMastery
	} else {
		energyMastery = pokemon.energyMastery
	}
	let colorOrder = Object.keys(energyMastery).sort((a, b) => {
		return colors.indexOf(a) - colors.indexOf(b)
	})
	for (let type of colorOrder) {
		let val = energyMastery[type]
		if (val || colors.includes(type)) {
			let icon = getEnergyIcon(type)
			let tag = $("<div class='mastery-icon'></div>")
			let left = $("<div class='mastery-left'></div>")
			let img = $("<img>")
			img.attr("src", icon)
			left.append(img)
			tag.append(left)

			if (!abbreviate) {
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

function getMoveHTML(move, options={}) {
	let useLongDescription = options.useLongDescription ?? false
	let tag = $("<div class='move'></div>")

	let moveTop = $("<div class='move-top'></div>")
	let moveName = getLocaleString("name", lang, ["moves", move.name])
	moveTop.append(`<div class='move-name'>${moveName}</div>`)
	let moveTypeTag = $(`<div class='move-type'></div>`)
	let moveRecharge = $(`<div class='move-recharge'></div>`)
	moveRecharge.append(`<img src='src/img/recharge.png'>`)
	moveRecharge.append(`<div class='count'>0</div>`)
	moveRecharge.hide()
	let moveType = options.type ?? move.type
	let typeIcon = getTypeIcon(moveType)
	let moveCategory = getMoveCategory(move, options.parentMove)
	moveTypeTag.append(moveRecharge)
	if (move.power && !move.tags.includes("z-move")){
		moveTypeTag.append(`<div>${move.power}</div>`)
	}
	moveTypeTag.append(`<img src='${getTypeIcon(moveCategory)}'>`)
	if (typeIcon) {
		moveTypeTag.append(`<img src='${typeIcon}'>`)
	}
	moveTop.append(moveTypeTag)
	tag.append(moveTop)

	let longDescription = getLocaleString("description", lang, ["moves", move.name])
	let shortDescription = getLocaleString("shortDescription", lang, ["moves", move.name])
	let desc = useLongDescription ? longDescription : shortDescription
	tag.append(`<div class='move-desc'>${desc}</div>`)
	let zStuff = tag.find(".z-move-description")
	zStuff.hide()

	let moveCostTag = $("<div class='move-cost'></div>")
	if (!move.specialCost) {
		for (let i = 0; i < colors.length; i++) {
			let color = colors[i]
			let cost = $("<div class='cost-part energy'></div>")
			cost.addClass("energy-" + color)
			cost.attr("data-cost", color)
			let costValue = move.energy[color] ?? 0

			let icon = $("<span class='icon'></span>")
			cost.append(icon)
			cost.append(`<span class='cost'>${costValue}</span>`)
			if (!costValue) {
				cost.children().hide()
			}

			moveCostTag.append(cost)
		}
	}
	tag.append(moveCostTag)

	let disabledContainer = $("<div class='disabled-container'>")
	disabledContainer.append("<img src='src/img/big red x.png'>")
	tag.append(disabledContainer)

	let effectivenessContainer = $("<div class='effectiveness-container'>")
	effectivenessContainer.append("<div class='effectiveness super-effective'>")
	effectivenessContainer.append("<div class='effectiveness not-very-effective'>")
	effectivenessContainer.append("<div class='effectiveness immune-effective'>")
	tag.append(effectivenessContainer)

	return tag
}

function determinePCBoxSlotNumber(boxObj, x, y) {
	let minBoxX = boxObj.minX
	let maxBoxX = boxObj.maxX
	let minBoxY = boxObj.minY
	let maxBoxY = boxObj.maxY
	let slotsX = boxObj.slotsX
	let slotsY = boxObj.slotsY
	let remainingX = maxBoxX - minBoxX
	let remainingY = maxBoxY - minBoxY
	let slotSpaceX = remainingX / slotsX
	let slotSpaceY = remainingY / slotsY
	x -= (slotSpaceX * 0.5)
	y -= (slotSpaceY * 0.5)
	let playerSlotChosenX = Math.round((x - minBoxX) / slotSpaceX)
	let playerSlotChosenY = Math.round((y - minBoxY) / slotSpaceY)
	return [playerSlotChosenX, playerSlotChosenY]
}
function determinePCBoxSlotCoords(boxObj, x, y) {
	let slotNumbers = determinePCBoxSlotNumber(boxObj, x, y)
	let coords = determinePCBoxSlotCoordsFromSlotNumbers(boxObj, slotNumbers[0], slotNumbers[1])
	return coords
}
function determinePCBoxSlotCoordsFromSlotNumbers(boxObj, slotNumberX, slotNumberY) {
	let minBoxX = boxObj.minX
	let maxBoxX = boxObj.maxX
	let minBoxY = boxObj.minY
	let maxBoxY = boxObj.maxY
	let slotsX = boxObj.slotsX
	let slotsY = boxObj.slotsY
	let remainingX = maxBoxX - minBoxX
	let remainingY = maxBoxY - minBoxY
	let slotSpaceX = remainingX / slotsX
	let slotSpaceY = remainingY / slotsY
	let left = minBoxX + slotNumberX * slotSpaceX + (slotSpaceX * 0.5)
	let top = minBoxY + slotNumberY * slotSpaceY + (slotSpaceY * 0.5)
	return [left, top]
}