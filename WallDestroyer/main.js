(function(){
	var game = {
		menuState: 0,
		timeSinceMenuStateChange: 0,
		lastMenuState: 0,
		openMenus: "",
		rightMenu: "",
		tickRate: 60,
		tooltipShown: false,

		//Walls
		currentWall: 0,
		wall: 0,
		walls: [],
		selectWall: function(num){
			var wall = this.walls[num] || this.walls.find(wall => wall.name === num)
			if (wall === undefined){
				return
			}
			this.currentWall = num
			this.wall = wall
			this.wallImgs = wall.imgs
			this.downSegments = 0
			this.fixProgressBarImages()
		},
		destroyWall: function(){
			var rewards = this.wall.rewards
			this.damage -= this.wall.health
			for (var i = 0; i < rewards.length; i++){
				this[rewards[i][1]] += rewards[i][0]
			}
			this.selectWall(this.currentWall + 1)
			this.wallsDestroyed++
		},
		fixProgressBarImages: function(){
			if (!this.wall) return
			this.progressBarImages.children().remove()
			var imgHeight = this.wall.imgHeight
			var imgWidth = this.wall.imgWidth
			var barHeight = this.progressBar.height()
			var barWidth = this.progressBar.width()
			var ratio = barHeight / imgHeight * imgWidth
			var numberOfSegments = Math.floor(barWidth / ratio)
			var damagePercent = this.damage / this.wall.health
			var completeSegments = Math.floor(damagePercent * numberOfSegments)
			var incompleteSegmentShownPercent = damagePercent * numberOfSegments % 1
			var incompleteSegmentShownPixels = incompleteSegmentShownPercent * barHeight
			var totalImages = this.wall.imgs.length
			for (var i = 0; i < numberOfSegments; i++){
				var which = i === 0 ? 0 : i === numberOfSegments - 1 ? totalImages - 1 : 1 + Math.floor((i - 1) / (numberOfSegments - 2) * (totalImages - 2))
				var img = this.wall.imgs[which].cloneNode(true)
				img.style.width = ratio+"px"
				this.progressBarImages.append(img)
			}
			this.repositionProgressBarImages(true)
			this.damagePerDownPixel = this.wall.health / numberOfSegments / barHeight
		},
		repositionProgressBarImages: function(force){
			if (!this.wall) return
			var barHeight = this.progressBar.height()
			var barImages = this.progressBarImages.children()
			var numberOfSegments = barImages.length
			var damagePercent = this.damage / this.wall.health
			var roundedDamagePercent = Math.floor(damagePercent*1000)/1000
			if (roundedDamagePercent <= this.lastRenderedPercentage && !force){
				return
			}
			var completeSegments = Math.floor(damagePercent * numberOfSegments)
			var incompleteSegmentShownPercent = (damagePercent * numberOfSegments) % 1
			var incompleteSegmentShownPixels = Math.floor(incompleteSegmentShownPercent * barHeight)
			var lastRenderedDownPixels = this.lastRenderedDownPixels
			var alreadyDownSegments = this.downSegments
			$.each(barImages, function(i, img){
				if (i < alreadyDownSegments && !force){
					return
				}
				else if (i < completeSegments){
					img.style.opacity = "0"
				}
				else if (i === completeSegments && incompleteSegmentShownPixels > lastRenderedDownPixels){
					img.style.transform = "translate(0, "+(incompleteSegmentShownPixels)+"px)"
				}
				else if (!force){
					return false
				}
			})
			this.downSegments = completeSegments
			this.lastRenderedPercentage = this.roundedDamagePercent
			this.lastRenderedDownPixels = incompleteSegmentShownPixels
		},
		wallImgs: [],
		downSegments: 0,
		lastRenderedPercentage: 0,
		lastRenderedDownPixels: 0,
		damagePerDownPixel: 0,
		secondsPerDownPixel: 0,

		//Resources
		money: 0,
		moneyIncome: 0,
		damage: 0,
		damageIncome: 0,
		bricks: 0,
		brickIncome: 0,
		fourthWallBricks: 0,
		fourthWallBrickIncome: 0,
		cosmicKnowledge: 0,
		futureKnowledgeCapsules: 0,
		futureKnowledgePower: 0,
		timesReset: 0,

		unlockMakeBricks: function(){
			if (this.timesReset){
				this.makeBricksClickable.show()
			}
			else {
				this.makeBricksClickable.fadeIn(1000)
			}
		},
		unlockResetButton: function(){
			if (this.timesReset){
				this.resetButton.show()
			}
			else {
				this.resetButton.fadeIn(1000)
			}
		},
		reset: function(){
			this.damage = 0
			this.money = 0
			this.bricks = 0
			this.fourthWallBricks = 0
			this.timesReset++
			this.futureKnowledgeCapsules += this.cosmicKnowledge
			this.cosmicKnowledge = 0
			this.resetButton.fadeOut(100)

			this.wallsDestroyed = 0
			this.selectWall(0)

			this.handDamageStaticMult = 1
			this.handDamageDynamicMults = []
			this.handBricksStaticMult = 1
			this.handBricksDynamicMults = []

			alert("The Time Bear is coming.")

			this.buildings.forEach(building => this.resetBuilding(building))
			var reBuyUpgrades = []
			this.upgrades.forEach(upgrade => {
				if (upgrade && upgrade.bought && upgrade.keptOnPrestige){
					reBuyUpgrades.push(upgrade)
				}
				if (upgrade){
					upgrade.elem.remove()
					upgrade.unlocked = false
					upgrade.bought = false
				}
			})
			console.log(reBuyUpgrades)
			reBuyUpgrades.forEach(upgrade => {
				this.buyUpgrade(upgrade, true)
			})
		},
		unlockConvertButton: function(){
			this.convertButton.show()
		},
		convertDamage: function(){
			var gained = Math.floor(this.damage / 1e33)
			if (!gained) return
			this.cosmicKnowledge += gained
			this.damage = 0
			this.repositionProgressBarImages(true)
		},

		toResourceString: function(num, unit, suffixStyle, precision, decimal){
			switch (unit){
				case "money": return "$"+game.toReadableNum(num, suffixStyle, precision, undefined, decimal);
				case "bricks": return game.toReadableNum(num, suffixStyle, precision, undefined, decimal) + (num !== 1 ? " bricks" : " brick");
				case "damage": return game.toReadableNum(num, suffixStyle, precision, undefined, decimal) + " damage";
				case "fourth wall bricks": return game.toReadableNum(num, suffixStyle, precision, undefined, decimal) + (num !== 1 ? " fourth wall bricks" : " fourth wall brick");
				case "cosmicKnowledge": return game.toReadableNum(num, suffixStyle, precision, undefined, decimal) + " cosmic knowledge";
				case "bossBricks": return game.toReadableNum(num, suffixStyle, precision, undefined, decimal) + (num !== 1 ? " boss bricks" : " boss brick");
			}
		},
		payCosts: function(costList){
			for (var i = 0; i < costList.length; i++){
				var resource = costList[i][1]
				var amt = costList[i][0]
				switch (resource){
					case "money": this.money -= amt; break;
					case "bricks": this.bricks -= amt; break;
				}
			}
		},

		//Stats
		wallsDestroyed: 0,
		wallsDestroyedTotal: 0,
		handDamageTotal: 0,
		handDamageStaticMult: 1,
		handDamageDynamicMults: [],
		handBricksTotal: 0,
		handBricksStaticMult: 1,
		handBricksDynamicMults: [],
		miscDynamicMults: {},
		bossBricks: 0,

		//Clickables
		currentClickable: 0,
		clickables: [],
		hitWall: function(){
			if (this.damage > this.wall.health){
				this.destroyWall()
			}
			else {
				var amt = this.getTotalMultiplier(this.handDamageStaticMult, this.handDamageDynamicMults, this.getFutureKnowledgeMult())

				//Actually add amounts
				this.damage += amt
				this.money += amt
				this.handDamageTotal += amt

				this.addDamageNumber(amt)

				this.fixProgressBarText()
				var state = this.hitWallClickable[0].style.animation
				if (!state || !parseInt(state.substring(0, state.indexOf("s")))){
					//var rand = Math.floor(Math.random()*1)
					// this.hitWallClickable.css("animation", "shake0 0.3s").on("animationend", function(){
					// 	this.style.animation = "none"
					// })
				}
			}
		},
		makeBricks: function(){
			var amt = this.getTotalMultiplier(this.handBricksStaticMult, this.handBricksDynamicMults, this.getFutureKnowledgeMult())

			//Actually add amounts
			this.bricks += amt
			this.handBricksTotal += amt

			this.addBrickNumber(amt)
		},

		//Buildings
		buildingBuyAmount: 1,
		buildings: [],
		buyBuilding: function(which, force){
			var building = this.buildings[which]
			var amt = this.buildingBuyAmount
			var costs = building.costs
			if (amt > 0){
				var nextMultiple = amt - (building.count % amt)
				for (var i = 0; i < nextMultiple; i++){
					var canBuy = true
					for (var j = 0; j < costs.length; j++){
						var resource = costs[j][1]
						var amt = costs[j][0]
						if (!this.canAfford(amt, resource)){
							canBuy = false
						}
					}
					if (canBuy || force){
						building.count++
						if (!force){
							this.payCosts(costs)
						}
						for (var j = 0; j < costs.length; j++){
							costs[j][0] *= building.costMult
						}
					}
				}
			}
			else if (building.count){
				for (var j = 0; j < costs.length; j++){
					costs[j][0] /= building.costMult
					var amt = Math.floor(costs[j][0])
					var resource = costs[j][1]
					if (resource === "money"){
						this.money += amt
					}
				}
				building.count--
			}

			//Update building's visuals
			this.fixBuildingVisuals()
		},
		getBuildingTooltip: function(building){
			var res = "<div class='buildingName'>"+building.name+"</div>"+building.flavorText
			for (var i = 0; i < building.costs.length; i++){
				var cost = building.costs[i]
				var canAfford = this.canAfford(cost[0], cost[1])
				if (canAfford){
					res += "<div class='tooltipCost green'>"+this.toResourceString(cost[0], cost[1]) + "</div>"
				}
				else {
					var time = this.getTimeUntilCanAfford(cost[0], cost[1])
					res += "<div class='tooltipCost red'>"+this.toResourceString(cost[0], cost[1]) + (time ? (" <a class='tooltipTime'>(" + time + ")</a><br>") : "") + "</div>"
				}
			}
			res += "<div class='tooltipExtraInfo'>"
			for (var i = 0; i < building.effects.length; i++){
				var mainEffect = building.effects[i]
				if (mainEffect[1] === "money"){
					continue
				}
				if (!building.count){
					if (mainEffect[1] === "damage"){
						res += "Buying would increase your DPS by <b>"+this.toReadableNum(mainEffect[0])+(this.damageIncome ? "</b> (<b>"+this.toReadableNum(mainEffect[0] / this.damageIncome * 100)+"%</b> of DPS)" : "</b>")
					}
					else if (mainEffect[1] === "bricks"){
						res += "Buying would increase your bricks created per second by <b>"+this.toReadableNum(mainEffect[0])+(this.brickIncome ? "</b> (<b>"+this.toReadableNum(mainEffect[0] / this.brickIncome * 100)+"%</b> of BPS)" : "</b>")
					}
					else if (mainEffect[1] === "fourth wall bricks"){
						res += "Buying would increase your fourth wall bricks created per second by <b>"+this.toReadableNum(mainEffect[0])+(this.brickIncome ? "</b> (<b>"+this.toReadableNum(mainEffect[0] / this.brickIncome * 100)+"%</b> of BPS)" : "</b>")
					}
				}
				else {
					var mainIncome = building.incomes[i]
					var eachIncome = mainIncome / building.count
					if (mainEffect[1] === "damage"){
						res += "Each of your "+building.pluralName.toLowerCase()+" deal <b>"+this.toReadableNum(eachIncome)+"</b> DPS.<br>"
						res += "In total, they deal <b>"+this.toReadableNum(mainIncome)+"</b> DPS. (<b>"+this.toReadableNum(mainIncome / this.damageIncome * 100)+"%</b> of total DPS)<br>"
						res += "Total Damage Dealt: <b>"+this.toReadableNum(building.totalAmounts[mainEffect[1]], undefined, undefined, undefined, false)+"</b>"
					}
					else if (mainEffect[1] === "bricks"){
						res += "Each of your "+building.pluralName.toLowerCase()+" create <b>"+this.toReadableNum(eachIncome)+"</b> bricks per second.<br>"
						res += "In total, they create <b>"+this.toReadableNum(mainIncome)+"</b> bricks per second. (<b>"+this.toReadableNum(mainIncome / this.fourthWallBrickIncome * 100)+"%</b> of total BPS)<br>"
						res += "Total Bricks Created: <b>"+this.toReadableNum(building.totalAmounts[mainEffect[1]], undefined, undefined, undefined, false)+"</b>"
					}
					else if (mainEffect[1] === "fourth wall bricks"){
						res += "Each of your "+building.pluralName.toLowerCase()+" create <b>"+this.toReadableNum(eachIncome)+"</b> fourth wall bricks per second.<br>"
						res += "In total, they create <b>"+this.toReadableNum(mainIncome)+"</b> fourth wall bricks per second. (<b>"+this.toReadableNum(mainIncome / this.fourthWallBrickIncome * 100)+"%</b> of total)<br>"
						res += "Total Fourth Wall Bricks Created: <b>"+this.toReadableNum(building.totalAmounts[mainEffect[1]], undefined, undefined, undefined, false)+"</b>"
					}
				}
				res += "<br>"
			}
			res = res.substring(0, res.length - 4)
			res += "</div>"
			return res
		},
		fixBuildingVisuals: function(){
			this.lastBuildingUpdate = Date.now()
			var buildings = this.buildings
			var selling = this.buildingBuyAmount < 0
			var amt = selling ? 1 : this.buildingBuyAmount
			for (var i = 0; i < buildings.length; i++){
				var building = buildings[i]
				building.tooltip = this.getBuildingTooltip(building)
				var elem = building.elem
				building.elem.children(".buildingQuantity").html(building.count)
				var costElems = elem.children(".buildingCost")
				var shouldBeUnavailable = false
				if (selling){
					if (!building.count){
						shouldBeUnavailable = true
					}
					else {
						var costs = building.costs
						for (var j = 0; j < costs.length; j++){
							var costElem = costElems.eq(j)
							costElem.html("+"+this.toResourceString(Math.floor(costs[j][0] / building.costMult), costs[j][1]))
							if (costElem.hasClass("red")){
								costElem.removeClass("red").addClass("green")
							}
						}
					}
					
				}
				else {
					var canTotallyAfford = true
					var costs = this.cumulativeBuildingPrice(building, building.count + amt - (building.count % amt))
					for (var j = 0; j < costs.length; j++){
						var cost = costs[j]
						var costElem = costElems.eq(j)
						var canAfford = this.canAfford(cost[0], cost[1])
						costElem.html(this.toResourceString(cost[0], cost[1]))
						if (canAfford && costElem.hasClass("red")){
							costElem.removeClass("red").addClass("green")
						}
						else if (!canAfford && costElem.hasClass("green")){
							costElem.removeClass("green").addClass("red")
						}
						if (!canAfford){
							canTotallyAfford = false
							shouldBeUnavailable = true
						}
					}
				}
				if (shouldBeUnavailable && !elem.hasClass("unavailable")){
					elem.addClass("unavailable")
				}
				else if (!shouldBeUnavailable && elem.hasClass("unavailable")){
					elem.removeClass("unavailable")
				}
			}

			//Hey, also, the upgrade shop is over here too.
			//Better check which ones should be shown as available
			var upgrades = this.upgrades
			for (var i = 0; i < upgrades.length; i++){
				var upgrade = upgrades[i]
				if (!upgrade || upgrade.bought || !upgrade.unlocked){
					continue
				}
				upgrade.tooltip = this.getUpgradeTooltip(upgrade)
				var canAfford = this.canAffordList(upgrade.costs)
				if (canAfford && upgrade.elem.hasClass("unavailable")){
					upgrade.elem.removeClass("unavailable")
				}
				else if (!canAfford && !upgrade.elem.hasClass("unavailable")){
					upgrade.elem.addClass("unavailable")
				}
			}
		},
		cumulativeBuildingPrice: function(building, to, from){
			var totalCosts = []
			for (var i = 0; i < building.costs.length; i++){
				totalCosts.push([0, building.costs[i][1]])
			}
			var costs = building.costs
			if (this.buildingBuyAmount !== -1 || building.count === 0){
				if (building.count === 0 && this.buildingBuyAmount === -1){
					var to = building.count + 1
				}
				for (var i = building.count; i < to; i++){
					for (var j = 0; j < costs.length; j++){
						totalCosts[j][0] += costs[j][0] * Math.pow(building.costMult, i - building.count)
					}
				}
				for (var i = 0; i < totalCosts.length; i++){
					totalCosts[i][0] = Math.floor(totalCosts[i][0] * 100) / 100
				}
			}
			else {
				console.log(building.name)
				for (var i = 0; i < costs.length; i++){
					totalCosts[i][0] += costs[i][0] / building.costMult
				}
				for (var i = 0; i < totalCosts.length; i++){
					totalCosts[i][0] = Math.floor(totalCosts[i][0])
				}
			}
			return totalCosts
		},
		findBuilding: function(name){
			for (var i = 0; i < this.buildings.length; i++){
				if (this.buildings[i].name.toLowerCase() === name.toLowerCase()){
					return this.buildings[i]
				}
			}
		},
		unlockBuilding: function(which){
			var building = this.findBuilding(which)
			building.unlocked = true
			building.elem.removeClass("hidden")
		},
		resetBuilding: function(building){
			building.count = 0
			building.costs = building.baseCosts.map(val => val.map(v => v))
			building.unlocked = building.startsUnlocked
			if (!building.unlocked){
				building.elem.addClass("hidden")
			}
			building.staticMultiplier = 1
			building.dynamicMultipliers = []
		},

		//Upgrades
		upgrades: [],
		baseUpgrades: [],
		upgradeLeftWidth: 0,
		upgradeLeftRows: 0,
		upgradeRightWidth: 0,
		availableUpgradesAreOpen: false,
		fixUpgradeVisuals: function(){
			var w = $("#buildings").width()
			var maxUpgradesPerRow = Math.floor(w / 50)
			var width = w / maxUpgradesPerRow / 1.0001
			this.upgradeLeftWidth = width
			var availableUpgrades = $("#availableUpgrades")
			availableUpgrades.children().css("height", width+"px").css("width", width+"px")
			availableUpgrades.css("height", width+"px")
			this.upgradeLeftRows = Math.ceil(availableUpgrades.children().length / maxUpgradesPerRow)

			var upgrades = $("#upgrades")
			var w = upgrades.width()
			var maxUpgradesPerRow = Math.floor(w / 50)
			var width = w / maxUpgradesPerRow / 1.0001
			upgrades.children().css("height", width+"px").css("width", width+"px")
			$("#achievements").children().css("height", width+"px").css("width", width+"px")
		},
		createUpgradeElement: function(upgrade){
			var elem = document.createElement("div")
			elem.classList.add("upgrade")
			elem.style.backgroundImage = "url("+upgrade.url+")"
			elem.setAttribute("data", this.upgrades.indexOf(upgrade))
			upgrade.elem = $(elem)
			upgrade.elem.on("click", this.buyUpgradeHandler)
		},
		unlockUpgrade: function(which){
			if (typeof which === "number"){
				var upgrade = this.upgrades[which]
			}
			else {
				var upgrade = which
			}
			upgrade.unlocked = true
			if (upgrade.bought){
				this.putUpgradeWhereItShouldBe(upgrade)
				return
			}
			this.putUpgradeWhereItShouldBe(upgrade)

			this.fixUpgradeVisuals()
			upgrade.elem.on("mousedown", this.buyUpgradeHandler)
			upgrade.elem.hide().fadeIn(500)
			// $("#availableUpgrades").css("height", (w / 7)+"px").css("min-height", width+"px")

			var index = this.baseUpgrades.indexOf(upgrade)
			this.baseUpgrades.splice(index, 1)
			this.fixBuildingVisuals()
		},
		getUpgradeTooltip: function(upgrade){
			var res = upgrade.effectsText + (upgrade.flavorText ? "<div class='flavorText'>" + upgrade.flavorText + "</div>" : "") + (upgrade.keptOnPrestige ? "<div class='upgradeTag'>[Persistent]</div>" : "")
			if (!upgrade.bought){
				for (var i = 0; i < upgrade.costs.length; i++){
					var cost = upgrade.costs[i]
					var canAfford = this.canAfford(cost[0], cost[1])
					if (canAfford){
						res = "<div class='tooltipCost green'>"+this.toResourceString(cost[0], cost[1]) + "</div>" + res
					}
					else {
						var time = this.getTimeUntilCanAfford(cost[0], cost[1])
						res = "<div class='tooltipCost red'>"+this.toResourceString(cost[0], cost[1]) + (time ? (" <a class='tooltipTime'>(" + time + ")</a><br>") : "") + "</div>" + res
					}
				}
			}
			else {
				res = "<br>" +res
			}
			//res = "<b>"+upgrade.name+"</b>"+(upgrade.bought ? "<br>" : "")+res
			res = "<b>"+upgrade.name+"</b>"+res
			return res
		},
		buyUpgradeHandler: function(){
			game.buyUpgrade(parseInt(this.getAttribute("data")))
		},
		buyUpgrade: function(which, force){
			if (typeof which === "number"){
				var upgrade = this.upgrades[which]
			}
			else {
				var upgrade = which
			}
			if (!upgrade){
				return
			}
			if (upgrade.bought){
				upgrade.unlocked = true
				return
			}
			var costs = upgrade.costs
			var canBuy = true
			for (var i = 0; i < costs.length; i++){
				var resource = costs[i][1]
				var amt = costs[i][0]
				if (!this.canAfford(amt, resource)){
					canBuy = false
				}
			}
			if (canBuy || force){
				if (!force){
					this.payCosts(costs)
				}
				upgrade.bought = true
				//apply each of the effects of the upgrade
				var effects = upgrade.effects
				for (var i = 0; i < effects.length; i++){
					var effect = effects[i]
					if (effect[0] === "static"){
						if (effect[2] === "handDamage"){
							this.handDamageStaticMult *= effect[1]
						}
						else if (effect[2] === "handBricks"){
							this.handBricksStaticMult *= effect[1]
						}
						else {
							var building = this.findBuilding(effect[2])
							if (!building) {
								console.warn("Can't figure out what this effect means:", effect)
							}
							building.staticMultiplier *= effect[1]
						}
					}
					else if (effect[0] === "dynamic"){
						var building = this.findBuilding(effect[1])
						if (effect[1] === "handDamage"){
							this.handDamageDynamicMults.push(effect.slice(2))
						}
						else if (building){
							building.dynamicMultipliers.push(effect.slice(2))
						}
						else if (effect[1] === "everythingPreSpace"){
							this.addMiscDynamicMult(effect)
						}
					}
					else if (effect[0] === "unlock"){
						if (effect[1] === "building"){
							this.unlockBuilding(effect[2])
						}
					}
					else if (effect[0] === "special"){
						if (effect[1] === "reset"){
							this.unlockResetButton()
						}
						else if (effect[1] === "makeBricks"){
							this.unlockMakeBricks()
						}
						else if (effect[1] === "convert"){
							this.unlockConvertButton()
						}
						else if (effect[1] === "addFutureKnowledgePower"){
							this.futureKnowledgePower += effect[2]
						}
					}
				}
				upgrade.unlocked = true
				upgrade.elem.removeClass("unavailable")
				this.unlockUpgradesThatShouldBeUnlocked()
				this.putUpgradeWhereItShouldBe(upgrade)
				this.fixUpgradeVisuals()
			}
			this.fixBuildingVisuals()
		},
		upgradeShouldBeUnlocked: function(upgrade){
			if (upgrade.unlocked) return true
			var unlocks = upgrade.unlocks
			var result = true
			for (var i = 0; i < unlocks.length; i++){
				var amt = unlocks[i][0] === "static" ? unlocks[i][1] : this.findTotalUnlockAmount(unlocks[i])
				var good = false
				var building = this.findBuilding(unlocks[i][2])
				if (building){
					good = building.count >= unlocks[i][1]
				}
				else {
					switch(unlocks[i][2]){
						case "handDamage": good = this.handDamageTotal >= unlocks[i][1]; break;
						case "handBricks": good = this.handBricksTotal >= unlocks[i][1]; break;
						case "wallsDestroyed": good = this.wallsDestroyed >= unlocks[i][1]; break;
						case "timesReset": good = this.timesReset >= unlocks[i][1]; break;
						case "futureKnowledgeCapsules": good = this.futureKnowledgeCapsules >= unlocks[i][1]; break;
					}
				}
				if (!good){
					result = false
					break
				}
			}
			var reqs = upgrade.preReqUpgrades
			for (var i = 0; i < reqs.length; i++){
				if (!reqs[i].bought){
					result = false
					break
				}
			}
			return result
		},
		unlockUpgradesThatShouldBeUnlocked: function(){
			for (var i = 0; i < this.upgrades.length; i++){
				var upgrade = this.upgrades[i]
				if (!upgrade) continue
				if (!upgrade.unlocked && this.upgradeShouldBeUnlocked(upgrade)){
					this.unlockUpgrade(upgrade)
				}
			}
		},
		findTotalUnlockAmount: function(unlockRequirement){
			console.trace(unlockRequirement)
		},
		resetUpgrade: function(upgrade){
			if (!upgrade || upgrade.keptOnPrestige || (!upgrade.unlocked && !upgrade.bought)){
				return
			}
			if (upgrade.bought){
				var effects = upgrade.effects
				var unknown = false
				for (var i = 0; i < effects.length; i++){
					var effect = effects[i]
					if (effect[0] === "static"){
						if (effect[2] === "handDamage"){
							this.handDamageStaticMult /= effect[1]
						}
						else if (effect[2] === "handBricks"){
							this.handBricksStaticMult /= effect[1]
						}
						else {
							var building = this.findBuilding(effect[2])
							if (!building) {
								console.warn("Can't figure out what this effect means:", effect)
							}
							building.staticMultiplier /= effect[1]
						}
					}
					else if (effect[0] === "dynamic"){
						if (effect[1] === "handDamage"){
							var compEffect = effect.slice(2).toString()
							var index = this.handDamageDynamicMults.findIndex(mult => mult.toString() === compEffect)
							if (index !== -1){
								this.handDamageDynamicMults.splice(index, 1)
							}
						}
						if (effect[2] === "handDamage"){
							var compEffect = effect.slice(2).toString()
							var index = this.handBricksDynamicMults.findIndex(mult => mult.toString() === compEffect)
							if (index !== -1){
								this.handBricksDynamicMults.splice(index, 1)
							}
						}
						else {
							var unknown = true
						}
					}
					else if (effect[0] === "unlock"){
						if (effect[1] === "building"){
							//Do nothing
						}
						else {
							var unknown = true
						}
					}
					else if (effect[0] === "special"){
						//Who cares
					}
					else {
						var unknown = true
					}
				}
			}
			if (!unknown){
				upgrade.elem.remove()
				upgrade.unlocked = false
				upgrade.bought = false
			}
			else {
				console.log("Don't know how to reset this upgrade:")
				console.log(upgrade)
			}
		},
		findUpgrade: function(name){
			return this.upgrades.find(upg => upg && upg.name === name)
		},
		putUpgradeWhereItShouldBe: function(upgrade){
			upgrade.elem.remove()
			if (upgrade.bought){
				var unlockedUpgradeIndex = this.upgrades.filter(upg => upg.bought).indexOf(upgrade)

				if (unlockedUpgradeIndex === 0){
					$("#upgrades").prepend(upgrade.elem)
				}
				else {
					$("#upgrades > .upgrade:nth-child("+unlockedUpgradeIndex+")").after(upgrade.elem)
				}
			}
			else if (upgrade.unlocked){
				var unlockedUpgrades = $.makeArray($("#availableUpgrades .upgrade"))
				var datas = unlockedUpgrades.map(elem => parseInt(elem.getAttribute("data")))
				var unlockedUpgradeIndex = datas.findIndex(data => data > upgrade.index)
				if (unlockedUpgradeIndex === -1){
					unlockedUpgradeIndex = datas.length
				}

				if (unlockedUpgradeIndex === 0){
					$("#availableUpgrades").prepend(upgrade.elem)
				}
				else {
					$("#availableUpgrades > .upgrade:nth-child("+unlockedUpgradeIndex+")").after(upgrade.elem)
				}
			}
		},
		upgradesMap: [
			"win",
			"magicUnlock",
			"magicLevel2",
			"magicLevel3",
			"giantUnlock",
			"fourthWallUnlock",
			"resetUnlock",
			"damageConverterUnlock",
			"finalWallUnlock",
			"spaceResearch",
			"spaceUpgrade1",
			"spaceUpgrade2",
			"spaceUpgrade3",
			"spaceUpgrade4",
			"spaceUpgrade5",
			"spaceUpgrade6",
			"spaceUpgrade7",
			"spaceUpgrade8",
			"spaceUpgrade9",
			"spaceUpgrade10",
			"deepSpaceResearch",
			"spaceUpgrade11",
			"spaceUpgrade12",
			"spaceUpgrade13",
			"spaceUpgrade14",
			"spaceUpgrade15",
			"spaceUpgrade16",
			"spaceUpgrade17",
			"spaceUpgrade18",
			"timeUpgrade1",
			"timeUpgrade2",
			"timeUpgrade3",
			"timeUpgrade4",
			"timeUpgrade5",
			"timeUpgrade6",
			"timeUpgrade7",
			"timeUpgrade8",
			"timeUpgrade9",
			"timeUpgrade10",
			"timeUpgrade11",
			"timeUpgrade12",
			"timeUpgrade13",
			"timeUpgrade14",
			"timeUpgrade15",
			"timeUpgrade16",
			"timeUpgrade17",
			"timeUpgrade18",
			"timeUpgrade19",
			"timeUpgrade20",
			"timeUpgrade21",
			"specialBrickBonus",
			"specialBrickBonus2",
			"endStory",
			"endStory2",
			"endStory3",
			"endStory4",
			"endStory5",
			"endStory6",
			"endStory7",
			"endStory8",
			"endStory9",
			"endStory10",
			"endStory11",
			"finalityUnlock",
			"endStory12",
			"endStory13",
			"endStory14",
			"endStory15",
			"endStory16",
			"endStory17",
			"endStory18",
			"endStory19",
			"endStory20",
			"timeBearWard0",
			"timeBearWard1",
			"timeBearWard2",
			"timeBearWard3",
			"timeBearWard4",
			"timeBearWard5",
			"timeBearWard6",
			"timeBearWard7",
			"timeBearWard8",
			"timeBearWard9",
			"timeBearWard10",
			"timeBearWard11",
			"timeBearWard12",
			"timeBearWard13",
			"timeBearWard14",
			"wallMultiplier",
			"productionMultiplier1",
			"productionMultiplier2",
			"productionMultiplier3",
			"productionMultiplier4",
			"productionMultiplier5",
			"productionMultiplierMagic",
			"productionMultiplierMagic2",
			"productionMultiplierMagic3",
			"productionMultiplier6",
			"productionMultiplierHell",
			"productionMultiplierHell2",
			"productionMultiplierHell3",
			"productionMultiplier7",
			"productionMultiplierBlack",
			"productionMultiplier8",
			"productionMultiplierArmy",
			"productionMultiplier9",
			"productionMultiplier10",
			"fourthWallLegend1",
			"fourthWallLegend2",
			"fourthWallLegend3",
			"fourthWallLegend4",
			"fourthWallLegend5",
			"fourthWallLegend6",
			"fourthWallLegend7",
			"fourthWallLegend8",
			"fourthWallLegend9",
			"fourthWallLegend10",
			"fourthWallLegend11",
			"fourthWallLegend12",
			"fourthWallLegend13",
			"handAndPuncherUpgrade1",
			"handAndPuncherUpgrade2",
			"handAndPuncherUpgrade3",
			"handAndPuncherUpgrade4",
			"handAndPuncherUpgrade5",
			"handAndPuncherUpgrade6",
			"handAndPuncherUpgrade7",
			"handAndClubberUpgrade",
			"handAndSwordsmanUpgrade",
			"handAndGunnerUpgrade",
			"handAndGrenadeUpgrade",
			"handAndWreckingBallUpgrade",
			"handAndBulldozerUpgrade",
			"handAndAirstrikeUpgrade",
			"handAndNecromancerUpgrade",
			"handAndGiantUpgrade",
			"handAndDemonUpgrade",
			"handAndCompromiserUpgrade",
			"handAndObliteratorUpgrade",
			"handBrickFactoryUpgrade",
			"handBrickUnlock",
			"handBrickUpgrade",
			"handBrickUpgrade2",
			"handBrickUpgrade3",
			"handBrickUpgrade4",
			"handBrickUpgrade5",
			"handBrickUpgrade6",
			"handBrickUpgrade7",
			"handBrickUpgrade8",
			"handBrickUpgrade9",
			"handUpgrade1",
			"handUpgrade2",
			"handUpgrade3",
			"handUpgrade4",
			"handUpgrade5",
			"handUpgrade6",
			"handUpgrade7",
			"handUpgrade8",
			"handUpgrade9",
			"handUpgrade10",
			"handUpgrade11",
			"handUpgrade12",
			"handUpgrade13",
			"handUpgrade14",
			"handUpgrade15",
			"puncherUpgrade1",
			"puncherUpgrade2",
			"puncherUpgrade3",
			"puncherUpgrade4",
			"puncherUpgrade5",
			"puncherUpgrade6",
			"puncherUpgrade7",
			"puncherUpgrade8",
			"puncherUpgrade9",
			"puncherUpgrade10",
			"puncherUpgrade11",
			"puncherUpgrade12",
			"puncherUpgrade13",
			"puncherUpgradeMagic1",
			"puncherUpgradeMagic2",
			"puncherUpgradeMagic3",
			"puncherUpgradeBlack",
			"puncherUpgradeArmy",
			"puncher4thWallUpgrade",
			"clubberUpgrade1",
			"clubberUpgrade2",
			"clubberUpgrade3",
			"clubberUpgrade4",
			"clubberUpgrade5",
			"clubberUpgrade6",
			"clubberUpgrade7",
			"clubberUpgrade8",
			"clubberUpgrade9",
			"clubberUpgrade10",
			"clubberUpgrade11",
			"clubberUpgrade12",
			"clubberUpgradeMagic",
			"clubberUpgradeMagic2",
			"clubberUpgradeMagic3",
			"clubberUpgradeBlack",
			"clubberUpgradeArmy",
			"clubber4thWallUpgrade",
			"swordsmanUpgrade1",
			"swordsmanUpgrade2",
			"swordsmanUpgrade3",
			"swordsmanUpgrade4",
			"swordsmanUpgrade5",
			"swordsmanUpgrade6",
			"swordsmanUpgrade7",
			"swordsmanUpgrade8",
			"swordsmanUpgrade9",
			"swordsmanUpgrade10",
			"swordsmanUpgrade11",
			"swordsmanUpgrade12",
			"swordsmanUpgradeMagic",
			"swordsmanUpgradeMagic2",
			"swordsmanUpgradeMagic3",
			"swordsmanUpgradeBlack",
			"swordsmanUpgradeArmy",
			"swordsman4thWallUpgrade",
			"clubAndSwordUpgrade",
			"clubAndSwordUpgrade2",
			"clubAndSwordUpgrade3",
			"clubAndSwordUpgrade4",
			"clubAndSwordUpgrade5",
			"clubAndSwordUpgrade6",
			"clubAndSwordUpgrade7",
			"gunnerUpgrade1",
			"gunnerUpgrade2",
			"gunnerUpgrade3",
			"gunnerUpgrade4",
			"gunnerUpgrade5",
			"gunnerUpgrade6",
			"gunnerUpgrade7",
			"gunnerUpgrade8",
			"gunnerUpgrade9",
			"gunnerUpgrade10",
			"gunnerUpgrade11",
			"gunnerUpgrade12",
			"gunnerUpgradeMagic",
			"gunnerUpgradeMagic2",
			"gunnerUpgradeMagic3",
			"gunnerUpgradeBlack",
			"gunnerUpgradeArmy",
			"gunner4thWallUpgrade",
			"grenadeUpgrade1",
			"grenadeUpgrade2",
			"grenadeUpgrade3",
			"grenadeUpgrade4",
			"grenadeUpgrade5",
			"grenadeUpgrade6",
			"grenadeUpgrade7",
			"grenadeUpgrade8",
			"grenadeUpgrade9",
			"grenadeUpgrade10",
			"grenadeUpgrade11",
			"grenadeUpgrade12",
			"grenadeUpgradeMagic",
			"grenadeUpgradeMagic2",
			"grenadeUpgradeMagic3",
			"grenadeUpgradeBlack",
			"grenadeUpgradeArmy",
			"grenade4thWallUpgrade",
			"gunAndGrenadeUpgrade",
			"gunAndGrenadeUpgrade2",
			"gunAndGrenadeUpgrade3",
			"gunAndGrenadeUpgrade4",
			"gunAndGrenadeUpgrade5",
			"gunAndGrenadeUpgrade6",
			"gunAndGrenadeUpgrade7",
			"wreckingBallUpgrade1",
			"wreckingBallUpgrade2",
			"wreckingBallUpgrade3",
			"wreckingBallUpgrade4",
			"wreckingBallUpgrade5",
			"wreckingBallUpgrade6",
			"wreckingBallUpgrade7",
			"wreckingBallUpgrade8",
			"wreckingBallUpgrade9",
			"wreckingBallUpgrade10",
			"wreckingBallUpgrade11",
			"wreckingBallUpgrade12",
			"wreckingBallUpgradeMagic",
			"wreckingBallUpgradeMagic2",
			"wreckingBallUpgradeMagic3",
			"wreckingBallUpgradeBlack",
			"wreckingBall4thWallUpgrade",
			"puncherAndWreckingBallUpgrade",
			"puncherAndWreckingBallUpgrade2",
			"puncherAndWreckingBallUpgrade3",
			"puncherAndWreckingBallUpgrade4",
			"puncherAndWreckingBallUpgrade5",
			"puncherAndWreckingBallUpgrade6",
			"puncherAndWreckingBallUpgrade7",
			"bulldozerUpgrade1",
			"bulldozerUpgrade2",
			"bulldozerUpgrade3",
			"bulldozerUpgrade4",
			"bulldozerUpgrade5",
			"bulldozerUpgrade6",
			"bulldozerUpgrade7",
			"bulldozerUpgrade8",
			"bulldozerUpgrade9",
			"bulldozerUpgrade10",
			"bulldozerUpgrade11",
			"bulldozerUpgrade12",
			"bulldozerUpgradeMagic",
			"bulldozerUpgradeMagic2",
			"bulldozerUpgradeMagic3",
			"bulldozerUpgradeBlack",
			"bulldozer4thWallUpgrade",
			"airstrikeUpgrade1",
			"airstrikeUpgrade2",
			"airstrikeUpgrade3",
			"airstrikeUpgrade4",
			"airstrikeUpgrade5",
			"airstrikeUpgrade6",
			"airstrikeUpgrade7",
			"airstrikeUpgrade8",
			"airstrikeUpgrade9",
			"airstrikeUpgrade10",
			"airstrikeUpgrade11",
			"airstrikeUpgrade12",
			"airstrikeUpgradeMagic",
			"airstrikeUpgradeMagic2",
			"airstrikeUpgradeMagic3",
			"airstrikeUpgradeBlack",
			"airstrike4thWallUpgrade",
			"bulldozerAndAirstrikeUpgrade",
			"bulldozerAndAirstrikeUpgrade2",
			"bulldozerAndAirstrikeUpgrade3",
			"bulldozerAndAirstrikeUpgrade4",
			"bulldozerAndAirstrikeUpgrade5",
			"bulldozerAndAirstrikeUpgrade6",
			"bulldozerAndAirstrikeUpgrade7",
			"necromancerUpgrade1",
			"necromancerUpgrade2",
			"necromancerUpgrade3",
			"necromancerUpgrade4",
			"necromancerUpgrade5",
			"necromancerUpgrade6",
			"necromancerUpgrade7",
			"necromancerUpgrade8",
			"necromancerUpgrade9",
			"necromancerUpgrade10",
			"necromancerUpgrade11",
			"necromancerUpgradeHell",
			"necromancerUpgradeHell2",
			"necromancerUpgradeHell3",
			"necromancerUpgradeBlack",
			"giantUpgrade1",
			"giantUpgrade2",
			"giantUpgrade3",
			"giantUpgrade4",
			"giantUpgrade5",
			"giantUpgrade6",
			"giantUpgrade7",
			"giantUpgrade8",
			"giantUpgrade9",
			"giantUpgrade10",
			"giantUpgrade11",
			"giantUpgradeHell",
			"giantUpgradeHell2",
			"giantUpgradeHell3",
			"giantUpgradeBlack",
			"necromancerAndTitanUpgrade",
			"necromancerAndTitanUpgrade2",
			"necromancerAndTitanUpgrade3",
			"necromancerAndTitanUpgrade4",
			"necromancerAndTitanUpgrade5",
			"necromancerAndTitanUpgrade6",
			"demonUpgrade1",
			"demonUpgrade2",
			"demonUpgrade3",
			"demonUpgrade4",
			"demonUpgrade5",
			"demonUpgrade6",
			"demonUpgrade7",
			"demonUpgrade8",
			"demonUpgrade9",
			"demonUpgrade10",
			"demonUpgrade11",
			"demonMagicUpgrade",
			"demonMagicUpgrade2",
			"demonMagicUpgrade3",
			"demonUpgradeBlack",
			"compromiserUpgrade",
			"compromiserUpgrade2",
			"compromiserUpgrade3",
			"compromiserUpgrade4",
			"compromiserUpgrade5",
			"compromiserUpgrade6",
			"compromiserUpgrade7",
			"compromiserUpgrade8",
			"compromiserUpgrade9",
			"compromiserUpgrade10",
			"compromiserUpgrade11",
			"compromiserMagicUpgrade",
			"compromiserMagicUpgrade2",
			"compromiserMagicUpgrade3",
			"compromiserUpgradeBlack",
			"lastBuildingUpgrade",
			"lastBuildingUpgrade2",
			"lastBuildingUpgrade3",
			"lastBuildingUpgrade4",
			"lastBuildingUpgrade5",
			"lastBuildingUpgrade6",
			"lastBuildingUpgrade7",
			"lastBuildingUpgrade8",
			"lastBuildingUpgrade9",
			"lastBuildingUpgrade10",
			"lastBuildingUpgradeMagic",
			"lastBuildingUpgradeMagic2",
			"lastBuildingUpgradeMagic3",
			"compromiserAndLastBuildingUpgrade",
			"compromiserAndLastBuildingUpgrade2",
			"compromiserAndLastBuildingUpgrade3",
			"compromiserAndLastBuildingUpgrade4",
			"compromiserAndLastBuildingUpgrade5",
			"brickFactoryUpgrade",
			"brickFactoryUpgrade2",
			"brickFactoryUpgrade3",
			"brickFactoryUpgrade4",
			"brickFactoryUpgrade5",
			"brickFactoryUpgrade6",
			"brickFactoryUpgrade7",
			"brickFactoryUpgrade8",
			"brickFactoryUpgrade9",
			"brickFactoryUpgrade10",
			"brickFactoryUpgrade11",
			"brickFactoryMagicUpgrade",
			"brickFactoryMagicUpgrade2",
			"brickFactoryMagicUpgrade3",
			"brickFactoryUpgradeBlack",
			"brickFactoryAndDemonUpgrade",
			"brickFactoryAndDemonUpgrade2",
			"brickFactoryAndDemonUpgrade3",
			"brickFactoryAndDemonUpgrade4",
			"brickFactoryAndDemonUpgrade5",
			"brickFactoryAndDemonUpgrade6",
			"buildingTrophy1",
			"buildingTrophy2",
			"buildingTrophy3",
			"buildingTrophy4",
			"buildingTrophy5",
			"buildingTrophy6",
			"buildingTrophy7",
			"buildingTrophy8",
			"buildingTrophy9",
			"buildingTrophy10",
			"buildingTrophy11",
			"buildingTrophy12",
			"buildingTrophy13",
			"buildingTrophy14",
			"trophy1",
			"trophy2",
			"trophy3",
			"trophy4",
			"trophy5",
			"trophy6",
			"trophy7",
			"trophy8",
			"trophy9",
			"trophy10",
			"trophy11",
			"trophy12",
			"trophy13",
			"trophy14",
			"trophy15",
			"trophy16",
			"trophy17",
			"trophy18",
			"trophy19",
			"trophy20",
			"trophy21",
			"trophy22",
			"trophy23",
			"trophy24"
		],

		achievements: [],

		lastTick: Date.now(),
		lastSave: Date.now(),
		lastBuildingUpdate: 0,
		lastProgressBarVisualUpdate: Date.now(),
		progressBarUpdateFrequency: 0,
		mouseX: 0,
		mouseY: 0,
		mouseActive: false,
		tickTimes: [],
		currentTooltip: "",
		currentTooltipWidth: 0,
		tick: function(){
			var lastTick = this.lastTick
			var now = Date.now()
			var ticksToDo = Math.floor((now - lastTick) / 16.66666666)
			this.lastTick = ticksToDo ? now : lastTick
			if (ticksToDo){
				this.tickData(now, ticksToDo)
				this.tickVisuals(now)
				this.tickTimes.push(Date.now() - now)
			}
			if (now > this.lastSave + 60000){
				this.save()
			}
		},
		tickData: function(now, times){
			var times = times || won
			var buildings = this.buildings
			var futureKnowledgeMult = this.getFutureKnowledgeMult()
			var totalDamageIncome = 0
			var totalMoneyIncome = 0
			var totalBrickIncome = 0
			var totalfourthWallBrickIncome = 0
			for (var i = 0; i < buildings.length; i++){
				var building = buildings[i]
				if (!building.count){
					continue
				}
				var effects = building.effects
				var mult = this.getTotalMultiplier(building.staticMultiplier, building.dynamicMultipliers, futureKnowledgeMult)
				var count = building.count
				for (var j = 0; j < effects.length; j++){
					var effect = effects[j]
					var amt = effect[0] * mult * count
					building.incomes[j] = amt
					building.totalAmounts[effect[1]] += amt * times / this.tickRate
					switch(effect[1]){
						case "damage": totalDamageIncome += amt; break;
						case "money": totalMoneyIncome += amt; break;
						case "bricks": totalBrickIncome += amt; break;
						case "fourth wall bricks": totalfourthWallBrickIncome += amt; break;
					}
				}
			}
			this.damage += totalDamageIncome / this.tickRate * times
			this.damageIncome = totalDamageIncome
			this.money += totalMoneyIncome / this.tickRate * times
			this.moneyIncome = totalMoneyIncome
			this.bricks += totalBrickIncome / this.tickRate * times
			this.brickIncome = totalBrickIncome
			this.fourthWallBricks += totalfourthWallBrickIncome / this.tickRate * times
			this.fourthWallBrickIncome = totalfourthWallBrickIncome

			this.secondsPerDownPixel = this.damagePerDownPixel / this.damageIncome
			document.title = this.toResourceString(this.money, "money") + ", " + this.toResourceString(this.damage, "damage")

			//Check if we've unlocked anything
			this.unlockUpgradesThatShouldBeUnlocked()
		},
		tickVisuals: function(now){
			this.fixProgressBarText()

			//alter the positions of progress bar images
			if (this.progressBarUpdateFrequency === 1 || now - this.lastProgressBarVisualUpdate > 100){
				this.repositionProgressBarImages()
			}

			//List resources in top right
			var str = ""
			str += "<div class='veryImportantResource'>"+this.toResourceString(this.damageIncome, "damage")+"/sec</div>"
			str += "<div class='veryImportantResource'>"+this.toResourceString(this.money, "money")+" ("+this.toResourceString(this.moneyIncome, "money")+"/sec)</div>"
			if (this.futureKnowledgeCapsules){
				str += "<div class='importantResource'>"+this.toReadableNum(this.futureKnowledgeCapsules) + " future knowledge capsules</div>"
			}
			if (this.bricks || this.wallsDestroyed){
				str += "<div class='importantResource'>"+this.toResourceString(this.bricks, "bricks", undefined, undefined, true)
				if (this.brickIncome){
					str += " ("+this.toReadableNum(this.brickIncome)+"/sec)"
				}
				str += "</div>"
			}
			if (this.fourthWallBricks || this.wallsDestroyed >= 4){
				str += "<div class='importantResource'>"+this.toResourceString(this.fourthWallBricks, "fourth wall bricks", undefined, undefined, true)
				if (this.fourthWallBrickIncome){
					str += " ("+this.toReadableNum(this.fourthWallBrickIncome)+"/sec)"
				}
				str += "</div>"
			}
			$("#mainResources").html(str)

			this.resetButton.html("Rewind Time:<br>+"+this.cosmicKnowledge+" future knowledge capsules")

			var availableUpgrades = this.availableUpgradesElement
			var availableUpgradesWasOpen = this.availableUpgradesAreOpen
			var hovered = availableUpgrades.is(":hover")
			if (!hovered && availableUpgradesWasOpen){
				availableUpgrades.css("height", this.upgradeLeftWidth + "px")
				this.availableUpgradesAreOpen = false
			}
			else if (hovered && !availableUpgradesWasOpen && availableUpgrades.children().length){
				availableUpgrades.css("height", this.upgradeLeftWidth * this.upgradeLeftRows + "px")
				this.availableUpgradesAreOpen = true
			}

			//The Tooltip!
			var tooltip = this.tooltip
			var tooltipType = ""
			var buildings = this.buildings
			var mouseX = this.mouseX
			var mouseY = this.mouseY
			var mouseActive = this.mouseActive
			//Are we hovering over any buildings?
			var skip = false
			if (this.buildingsElement.is(":hover")){
				for (var i = 0; i < this.buildings.length; i++){
					var building = this.buildings[i]
					var elem = building.elem
					if (elem.is(":hover")){
						var tooltipContent = building.tooltip
						skip = true
						tooltipType = "left"
						break
					}
				}
			}
			if (this.buildingsElement.is(":hover") || this.upgradesElement.is(":hover")){
				for (var i = skip ? Infinity : 0; i < this.upgrades.length; i++){
					var upgrade = this.upgrades[i]
					if (!upgrade) continue
					var elem = upgrade.elem
					if (elem && elem.is(":hover")){
						var tooltipContent = this.getUpgradeTooltip(upgrade)
						skip = true
						tooltipType = upgrade.bought ? "right" : "left"
						break
					}
				}
			}
			if (!skip && this.progressBar.is(":hover")){
				var tooltipContent = "<b>"+this.wall.name+"</b><br> <br>Time until destroyed: <div class='tooltipTime'>"+this.getTimeUntilCanAfford(this.wall.health, "damage")+"</div><br>"+(this.timesReset ? this.wall.flavorText2 : this.wall.flavorText)
			}
			else if (!skip && this.resetButton.is(":hover")){
				var tooltipContent = "Rewind time, sending you all the way back to square one.<br>Gain future knowledge capsules based on your progress, which makes subsequent runs faster."
			}

			if (mouseActive && tooltipContent){
				var tw = tooltip.width()
				var th = tooltip.height()
				var w = $(window).width()
				var h = $(window).height()
				this.tooltipShown = true
				tooltip.html(tooltipContent)
				if (tooltipType === "left"){
					var placeX = w * 0.3
					var placeY = mouseY - (th * 0.5)
					if (this.currentTooltip !== tooltipContent){
						tooltip.css("left", "0px").css("top", "0px").css("width", "auto")
						this.currentTooltipWidth = tooltip.width()
						tooltip.css("width", this.currentTooltipWidth+"px")
						this.currentTooltip = tooltipContent
					}
				}
				else if (tooltipType === "right"){
					var placeY = mouseY - (th * 0.5)
					if (this.currentTooltip !== tooltipContent){
						tooltip.css("left", "0px").css("top", "0px").css("width", "auto")
						this.currentTooltipWidth = tooltip.width()
						tooltip.css("width", this.currentTooltipWidth+"px")
						this.currentTooltip = tooltipContent
					}
					var placeX = (w * 0.8) - this.currentTooltipWidth - 22
				}
				else {
					var placeX = mouseX + 15
					var placeY = mouseY + 15
					if (rightEdge > w - 25){
						placeX = w - 25 - tw
					}
					if (bottomEdge > h - 25){
						placeY = h - 25 - th
					}
					if (this.currentTooltip !== tooltipContent){
						tooltip.css("left", "0px").css("top", "0px").css("width", "auto")
						this.currentTooltipWidth = tooltip.width()
						tooltip.css("width", this.currentTooltipWidth+"px")
						this.currentTooltip = tooltipContent
					}
				}
				var newTooltipHeight = tooltip.height()
				var rightEdge = placeX + this.currentTooltipWidth
				var bottomEdge = placeY + newTooltipHeight + 17
				if (w < rightEdge){
					placeX = w - this.currentTooltipWidth - 5
				}
				if (h < bottomEdge){
					placeY = h - newTooltipHeight - 17
				}
				tooltip.css("left", placeX+"px").css("top", placeY+"px").css("opacity", "1")
			}
			else if (this.tooltipShown){
				tooltip.css("opacity", "0")
				this.tooltipShown = false
			}

			if (now - this.lastBuildingUpdate > 1000 && this.openMenus.includes("b")){
				this.fixBuildingVisuals()
			}
		},
		fixProgressBarText: function(){
			if (this.wall){
				if (this.damage > this.wall.health){
					this.progressBarText.html("Destroy "+this.wall.name)
				}
				else {
					var damage = this.toReadableNum(this.damage, 0, 2, true)
					var health = this.toReadableNum(this.wall.health)
					this.progressBarText.html(damage + "/" + health + " damage")
				}
			}
			else {
				this.progressBarText.html(this.toReadableNum(damage))
			}
		},

		progressBar: $("#mainProgressBar"),
		progressBarText: $("#progressBarText"),
		progressBarImages: $("#progressBarImages"),
		tooltip: $("#tooltip"),
		hitWallClickable: $("#hitWall"),
		makeBricksClickable: $("#makeBricks"),
		resetButton: $("#reset"),
		convertButton: $("#convert"),
		availableUpgradesElement: $("#availableUpgrades"),
		upgradesElement: $("#upgrades"),
		buildingsElement: $("#buildings"),

		commafy: function(num){
			if (num instanceof Decimal){
				var num = num.toString()
			}
			else {
				var num = num.toString()
			}
			var parts = num.split(".")
			parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			return parts.join(".")
		},
		toReadableNum: function(num, suffixStyle, precision, force, decimal){
			var suffixStyle = suffixStyle || 0
			var precision = precision === undefined ? 2 : precision
			precision++
			precision = Math.max(precision, 0)
			var force = force || (num > 1000)
			var decimal = decimal === undefined ? true : decimal
			if (num === undefined){
				return "0"
			}
			else {
				if (num === 0){
					return "0"
				}
				else if (num < 1000){
					if (num % 1 === 0) return num.toString()
					if (!decimal){
						return Math.floor(num).toString()
					}
					var p = Math.max(Math.floor(Math.log10(num)+precision), 0)
					return p ? num.toPrecision(p) : (Math.floor(num * 100) / 100).toString()
				}
				var digits = Math.floor(Math.log10(num))+1
				var stoppingPoint = digits - ((digits - 1) % 3) - 1
				var firstFewDigitsNum = Math.round((num / Math.pow(10, Math.floor(stoppingPoint))) * Math.pow(10, precision)) / Math.pow(10, precision)
				var firstFewDigits = firstFewDigitsNum.toString()
				if (firstFewDigits.indexOf(".") !== -1){
					if (precision){
						var decimalIndex = firstFewDigits.indexOf(".")
						firstFewDigits = firstFewDigits.substring(0, decimalIndex + precision)
						var afterDecimalDigits = firstFewDigits.length - decimalIndex
						if (force){
							for (var i = afterDecimalDigits; i < precision; i++){
								firstFewDigits += "0"
							}
						}
					}
					else {
						firstFewDigits = firstFewDigits.substring(0, firstFewDigits.indexOf("."))
					}
				}
				else if (force && num > 999){
					firstFewDigits += "."
					for (var i = 1; i < precision; i++){
						firstFewDigits += "0"
					}
				}
				var suffixIndex = Math.floor((stoppingPoint + 1) / 3)
				return firstFewDigits + (suffixStyle ? this.suffixesFull : this.suffixes)[suffixIndex]
			}
		},
		suffixes: [
			"",
			"k","M","B","T","q","Q","s","S","O","N","D",'UDc','DDc','TDc','QaDc','QiDc','SxDc','SpDc','OcDc','NoDc','Vg','UVg','DVg','TVg','QaVg','QiVg','SxVg','SpVg','OcVg','NoVg','Tg','UTg','DTg','TTg','QaTg','QiTg','SxTg','SpTg','OcTg','NoTg','Qag','UQag','DQag','TQag','QaQag','QiQag','SxQag','SpQag','OcQag','NoQag','Qig','UQig','DQig','TQig','QaQig','QiQig','SxQig','SpQig','OcQig','NoQig','Sxg','USxg','DSxg','TSxg','QaSxg','QiSxg','SxSxg','SpSxg','OcSxg','NoSxg','Spg','USpg','DSpg','TSpg','QaSpg','QiSpg','SxSpg','SpSpg','OcSpg','NoSpg','Ocg','UOcg','DOcg','TOcg','QaOcg','QiOcg','SxOcg','SpOcg','OcOcg','NoOcg','Nog','UNog','DNog','TNog','QaNog','QiNog','SxNog','SpNog','OcNog','NoNog'
		],
		suffixesFull: [
			"",
			" thousand",
			" million",
			" billion",
			" trillion",
			" quadrillion",
			" quintillion",
			" sextillion",
			" septillion",
			" octillion",
			" nonillion",
			" decillion",
		],
		multiplierNames: ["a perplexingly small amount", "exactly", "twice", "three times", "four times", "five times", "six times", "seven times", "eight times", "nine times", "ten times"],
		canAfford: function(amt, resource){
			switch (resource){
				case "money": return this.money >= amt; break;
				case "bricks": return this.bricks >= amt; break;
				case "fourth wall bricks": return this.fourthWallBricks >= amt; break;
				case "damage": return this.damage >= amt; break;
			}
		},
		canAffordList: function(costList){
			var canAfford = true
			for (var i = 0; i < costList.length; i++){
				if (!this.canAfford(costList[i][0], costList[i][1])){
					canAfford = false
					break
				}
			}
			return canAfford
		},
		getTimeUntilCanAfford: function(amt, resource){
			switch(resource){
				case "money": var income = this.moneyIncome; var have = this.money; break;
				case "bricks": var income = this.brickIncome; var have = this.bricks; break;
				case "fourth wall bricks": var income = this.fourthWallBrickIncome; var have = this.fourthWallBricks; break;
				case "damage": var income = this.damageIncome; var have = this.damage; break;
				default: var income = this.moneyIncome; var have = this.money; break;
			}
			if (income === 0){
				return ""
			}
			var time = Math.max((amt - have) / income, 0)
			var days = Math.floor(time / 86400)
			var hours = Math.floor(time / 3600) % 24
			var minutes = Math.floor(time / 60) % 60
			var seconds = Math.floor(time % 60)
			var ret = ""
			if (days){
				ret += days + "d" + (hours || minutes || seconds ? ", " : "")
			}
			if (hours){
				ret += hours + "h" + (minutes || seconds ? ", " : "")
			}
			if (minutes){
				ret += minutes + "m" + (seconds ? ", " : "")
			}
			if (seconds){
				ret += seconds + "s"
			}
			return ret
		},
		getDynamicMultiplier: function(mult){
			if (mult[1] === "building"){
				return mult[0] * this.findBuilding(mult[2]).count
			}
			else if (mult[1] === "capsules"){
				return mult[0] * this.futureKnowledgeCapsules
			}
		},
		getTotalMultiplier: function(){
			var amt = 1
			for (var i = 0; i < arguments.length; i++){
				var arr = arguments[i]
				if (typeof arr === "number"){
					amt *= arr
					continue
				}
				else if (typeof arr === "string"){
					arr = this.miscDynamicMults[arr] || []
				}
				var len = arr.length
				for (var j = 0; j < len; j++){
					amt *= 1 + this.getDynamicMultiplier(arr[j])
				}
			}
			return amt
		},
		addMiscDynamicMult: function(effect){
			var type = effect[1]
			var arr = this.miscDynamicMults[type]
			if (arr === undefined){
				this.miscDynamicMults[type] = []
			}
			this.miscDynamicMults[type].push(effect.slice(2))
		},
		getFutureKnowledgeMult: function(){
			return 1 + (this.futureKnowledgeCapsules * this.futureKnowledgePower)
		},
		addDamageNumber: function(num){
			var allNumbers = $(".floatingNumber")
			if (allNumbers.length > 10){
				allNumbers.eq(0).remove()
			}
			// var w = $(window).width()
			var h = $(window).height()
			// var fullUnit = Math.min(w, h)
			// var difference = w - h
			// var hitWallHeight = this.hitWallClickable.height()
			// var rad = Math.random() * 2 * Math.PI
			// var W = (fullUnit * 0.5) + (Math.cos(rad) * hitWallHeight * 0.8) + (difference * 0.47)
			// var H = (fullUnit * 0.5) + (Math.sin(rad) * hitWallHeight * 0.8)
			var elem = document.createElement("div")
			elem.classList.add("floatingNumber")
			var text = this.toReadableNum(num)
			elem.innerHTML = text
			
			$("#mainScreen").append(elem)
			var width = elem.offsetWidth
			$(elem).hide()
			var W = this.mouseX - (width * 0.5) + Math.floor(Math.random() * h * 0.05) - (h * 0.025)
			var H = this.mouseY - Math.floor(Math.random() * h * 0.05) - (h * 0.01)
			elem.style.left = W+"px"
			elem.style.top = H+"px"
			$(elem).show()
			$(elem).fadeOut(1000, function(){
				$(this).remove()
			}).css("margin-top", (-1 * h * 0.1)+"px")
		},
		addBrickNumber: function(num){
			var allNumbers = $(".floatingNumber")
			if (allNumbers.length > 10){
				allNumbers.eq(0).remove()
			}
			var h = $(window).height()
			var elem = document.createElement("div")
			elem.classList.add("floatingNumber")
			elem.innerHTML = this.toReadableNum(num)
			$("#mainScreen").append(elem)
			var width = elem.offsetWidth
			$(elem).hide()
			var W = this.mouseX - (width * 0.5) + Math.floor(Math.random() * h * 0.05) - (h * 0.025)
			var H = this.mouseY - Math.floor(Math.random() * h * 0.05) - (h * 0.01)
			elem.style.left = W+"px"
			elem.style.top = H+"px"
			$(elem).show()
			$(elem).fadeOut(1000, function(){
				$(this).remove()
			}).css("margin-top", (-1 * h * 0.1)+"px")
		},

		save: function(){
			this.lastSave = Date.now()
			console.log("Saved!")
			var saveObj = {}
			saveObj.currentWall = this.currentWall
			saveObj.wallsDestroyed = this.wallsDestroyed
			saveObj.wallsDestroyedTotal = this.wallsDestroyedTotal
			saveObj.handDamageDynamicMultsTotal = this.handDamageTotal
			saveObj.handBricksTotal = this.handBricksTotal
			saveObj.money = this.money
			saveObj.damage = this.damage
			saveObj.bricks = this.bricks
			saveObj.fourthWallBricks = this.fourthWallBricks
			saveObj.cosmicKnowledge = this.cosmicKnowledge
			saveObj.futureKnowledgeCapsules = this.futureKnowledgeCapsules
			saveObj.timesReset = this.timesReset
			saveObj.lastTick = this.lastTick
			saveObj.buildings = this.buildings.map(building => {
				var bobj = {}
				bobj.count = building.count
				bobj.totalAmounts = building.totalAmounts
				return bobj
			})
			saveObj.upgrades = ""
			for (var i = 0; i < this.upgrades.length; i++){
				if (!this.upgrades[i]){
					saveObj.upgrades += "0"
				}
				else {
					saveObj.upgrades += (this.upgrades[i].bought + this.upgrades[i].unlocked).toString()
				}
			}
			var zip = LZString.compressToBase64(JSON.stringify(saveObj))
			var d = new Date()
			d.setYear(d.getYear() + 1902)
			//Cookies.set("save", zip, {SameSite: "None", Secure: true})
			document.cookie = "save="+zip+";expires="+d.toUTCString()+";SameSite=none;Secure=true"
			return zip
		},
		load: function(input){
			var save = input || Cookies.get("save")
			var str = LZString.decompressFromBase64(save)
			var obj = str && JSON.parse(str)
			if (obj && obj.upgrades && typeof obj.upgrades === "string" && obj.buildings && typeof obj.buildings === "object"){
				this.hardReset()
				$("#quantitySelector div").eq(1).click()
				this.currentWall = obj.currentWall || 0
				this.wallsDestroyed = obj.wallsDestroyed || 0
				this.wallsDestroyedTotal = obj.wallsDestroyedTotal || 0
				this.handDamageTotal = obj.handDamageTotal || 0
				this.handBricksTotal = obj.handBricksTotal || 0
				this.money = obj.money || 0
				this.damage = obj.damage || 0
				this.bricks = obj.bricks || 0
				this.fourthWallBricks = obj.fourthWallBricks || 0
				this.cosmicKnowledge = obj.cosmicKnowledge || 0
				this.futureKnowledgeCapsules = obj.futureKnowledgeCapsules || 0
				this.timesReset = obj.timesReset || 0
				this.lastTick = obj.lastTick || Date.now()
				obj.buildings && obj.buildings.forEach((building, i) => {
					if (this.buildings[i]){
						var count = building.count || 0
						for (var j = 0; j < count; j++){
							this.buyBuilding(i, true)
						}
						this.buildings[i].totalAmounts = building.totalAmounts || {}
						this.buildings[i].incomes.forEach(income => this.buildings[i].totalAmounts[income[1]] = this.buildings[i].totalAmounts[income[1]] || 0)
					}
				})
				obj.upgrades && obj.upgrades.split("").forEach((num, i) => {
					var upgrade = this.upgrades[i]
					if (upgrade){
						if (parseInt(num) > 0){
							this.unlockUpgrade(i)
						}
						if (parseInt(num) > 1){
							this.buyUpgrade(i, true)
						}
					}
				})
				this.selectWall(this.currentWall)
				this.fixBuildingVisuals()
			}
			this.tick()
		},
		hardReset: function(){
			this.currentWall = 0
			this.wallsDestroyed = 0
			this.wallsDestroyedTotal = 0
			this.handDamageTotal = 0
			this.handDamageStaticMult = 1
			this.handDamageDynamicMults = []
			this.handBricksTotal = 0
			this.handBricksStaticMult = 1
			this.handBricksDynamicMults = []
			this.money = 0
			this.damage = 0
			this.bricks = 0
			this.fourthWallBricks = 0
			this.cosmicKnowledge = 0
			this.futureKnowledgeCapsules = 0
			this.timesReset = 0
			this.buildings.forEach(building => {
				this.resetBuilding(building)
				var effects = building.effects
				building.effects.forEach(effect => building.totalAmounts[effect[1]] = 0)
			})
			this.upgrades.forEach(upg => {
				upg.unlocked = false
				upg.bought = false
				$(upg.elem).remove()
			})
			$(".floatingNumber").remove()
			this.selectWall(0)
		}
	}

	function Wall(name, flavorText, firstRunOverrides, health, rewards, imgUrlTemplate, imgWidth, imgHeight, postResetFlavorText){
		game.walls.push(this)
		this.index = game.walls.indexOf(this)
		this.name = name || ""
		this.flavorText = flavorText || ""
		this.flavorText2 = postResetFlavorText || flavorText
		this.firstRunOverrides = firstRunOverrides || []
		this.health = health || 1
		this.rewards = rewards || []
		var imgs = [imgUrlTemplate+".1.png",imgUrlTemplate+".2.png",imgUrlTemplate+".3.png",imgUrlTemplate+".4.png",imgUrlTemplate+".5.png",imgUrlTemplate+".6.png"]
		this.imgWidth = imgWidth || 15
		this.imgHeight = imgHeight || 63
		this.imgs = []
		for (var i = 0; i < imgs.length; i++){
			var img = document.createElement("img")
			img.src = imgs[i]
			this.imgs[i] = img
		}
		if (!imgWidth){
			this.imgs[0].onload = (function(a){
				this.imgWidth = a.target.naturalWidth
				this.imgHeight = a.target.naturalHeight
			}).bind(this)
		}
		this.rewardsText = "Rewards:<br>"
		this.rewardsText2 = "Rewards:<br>"
		for (var i = 0; i < rewards.length; i++){
			var reward = rewards[i]
			if (!this.firstRunOverrides.includes(reward[1])){
				this.rewardsText += game.toResourceString(reward[0], reward[1], true) + (i + 1 !== rewards.length ? "<br>" : "")
			}
			this.rewardsText2 += game.toResourceString(reward[0], reward[1], true) + (i + 1 !== rewards.length ? "<br>" : "")
		}
		if (this.rewardsText.substring(this.rewardsText.length - 4) === "<br>"){
			this.rewardsText = this.rewardsText.substring(0, this.rewardsText.length - 4)
		}
		this.flavorText = this.rewardsText + (this.flavorText ? "<div class='flavorText'>" + this.flavorText + "</div>" : "")
		this.flavorText2 = this.rewardsText2 + (this.flavorText2 ? "<div class='flavorText'>" + this.flavorText2 + "</div>" : "")
	}
	[
		new Wall("The Wall",             "You can keep whatever rubble is left.",   ["bricks", "cosmicKnowledge"], 1e12,   [[2.5e11, "money"], [25, "bricks"],    [1, "cosmicKnowledge"]],                    "img/wallSprites/wall1"),
		new Wall("The Big 2nd Wall",     "",                                        ["cosmicKnowledge"],           1e14,   [[2.5e13, "money"], [100, "bricks"],   [1, "cosmicKnowledge"]],                    "img/wallSprites/wall1"),
		new Wall("The Huge 3rd Wall",    "",                                        ["cosmicKnowledge"],           1e16,   [[2.5e15, "money"], [1e4, "bricks"],   [1, "cosmicKnowledge"]],                    "img/wallSprites/wall1"),
		new Wall("The Massive 4th Wall", "",                                        ["cosmicKnowledge"],           1e18,   [[2.5e17, "money"], [2.5e5, "bricks"], [2, "cosmicKnowledge"]],                    "img/wallSprites/wall1"),
		new Wall("The Final 5th Wall",   "This is the big one.",                    ["cosmicKnowledge", "bossBricks"],                1e20,   [[2.5e19, "money"], [1e7, "bricks"],   [5, "cosmicKnowledge"], [1, "bossBricks"]], "img/wallSprites/wall2"),
		new Wall("Bonus Wall #9",        "You win, but you can keep going anyway.", [],                            2e20,   [[1e20, "money"],   [1e8, "bricks"],   [5, "cosmicKnowledge"]],                    "img/wallSprites/wall3"),
		
		new Wall("Bonus Wall #8",   "", [], 4e20,    [[2e20, "money"],    [2.5e8, "bricks"],  [5, "cosmicKnowledge"]],  "img/wallSprites/wall3"),
		new Wall("Bonus Wall #7",   "", [], 8e20,    [[4e20, "money"],    [5e8, "bricks"],    [6, "cosmicKnowledge"]],  "img/wallSprites/wall3"),
		new Wall("Bonus Wall #6",   "", [], 1.6e21,  [[8e20, "money"],    [1e9, "bricks"],    [7, "cosmicKnowledge"]],  "img/wallSprites/wall3"),
		new Wall("Bonus Wall #5",   "", [], 3.2e21,  [[1.6e21, "money"],  [2e9, "bricks"],    [8, "cosmicKnowledge"]],  "img/wallSprites/wall3"),
		new Wall("Bonus Wall #4",   "", [], 6.4e21,  [[3.2e21, "money"],  [4e9, "bricks"],    [9, "cosmicKnowledge"]],  "img/wallSprites/wall3"),
		new Wall("Bonus Wall #3",   "", [], 1.28e22, [[6.4e21, "money"],  [8e9, "bricks"],    [10, "cosmicKnowledge"]], "img/wallSprites/wall3"),
		new Wall("Bonus Wall #2",   "", [], 2.56e22, [[1.28e22, "money"], [1.6e10, "bricks"], [10, "cosmicKnowledge"]], "img/wallSprites/wall3"),
		new Wall("Bonus Wall #1",   "", [], 5.12e22, [[2.56e22, "money"], [3.2e10, "bricks"], [10, "cosmicKnowledge"]], "img/wallSprites/wall3"),
		new Wall("Boss Bonus Wall", "", [], 1.5e23,  [[7.5e22, "money"],  [1e11, "bricks"],   [20, "cosmicKnowledge"]], "img/wallSprites/wall4"),
	];
	game.selectWall(0)

	$("#hitWall").on("click", game.hitWall.bind(game))
	$("#makeBricks").on("click", game.makeBricks.bind(game))
	$("#reset").on("click", game.reset.bind(game))
	$("#convert").on("click", game.convertDamage.bind(game))
	$("body").on("keypress", function(e){
		if (e.originalEvent.key === "e"){
			var save = game.save()
			prompt("Export: Copy this, save it somewhere", save)
		}
		else if (e.originalEvent.key === "i"){
			var save = prompt("Paste save here:")
			Cookies.set("save", save, {SameSite: "None", Secure: true})
			game.load(save)
		}
	})

	function Building(name, pluralName, baseCosts, baseEffects, damageType, buildingClass, url, idName, flavorText, startsUnlocked, costMult){
		this.name = name
		this.pluralName = pluralName || (name + "s")
		this.idName = idName
		this.url = url
		this.flavorText = flavorText
		this.costs = baseCosts
		this.baseCosts = baseCosts.map(val => val.map(v => v))
		this.effects = baseEffects
		this.damageType = damageType
		this.class = buildingClass
		this.count = 0
		this.staticMultiplier = 1
		this.dynamicMultipliers = []
		this.costMult = costMult || 1.1
		this.incomes = baseEffects.map(val => [val[0], val[1]])
		this.totalAmounts = {}
		this.incomes.forEach(income => this.totalAmounts[income[1]] = 0)
		this.unlocked = startsUnlocked === undefined ? true : startsUnlocked
		this.startsUnlocked = this.unlocked
	}
	//Initialize buildings
	(function(){
		game.buildings[0] = new Building("Puncher", "Punchers", [[20, "money"]], [[0.1, "damage"], [0.1, "money"]], "puncher", "melee", "img/puncher.png", "puncherBuilding", "Punches the wall for you.")
		game.buildings[1] = new Building("Clubber", "Clubbers", [[150, "money"]], [[0.5, "damage"], [0.5, "money"]], "clubber", "melee", "img/clubber.png", "clubberBuilding", "Not to be confused with the other kind of clubbing.")
		game.buildings[2] = new Building("Swordsman", "Swordsmen", [[1100, "money"]], [[2.5, "damage"], [2.5, "money"]], "swordsman", "melee", "img/swordsman.png", "swordsmanBuilding", "Some question the use of swords on a brick wall. Those guys are lame.")
		game.buildings[3] = new Building("Gunner", "Gunners", [[16000, "money"]], [[30, "damage"], [30, "money"]], "gunner", "ranged", "img/gunner.png", "gunnerBuilding", "Shoots a gun.")
		game.buildings[4] = new Building("Grenade Thrower", "Grenade Throwers", [[4e5, "money"]], [[500, "damage"], [500, "money"]], "grenadethrower", "ranged", "img/grenade.png", "grenadeThrowerBuilding", "Throws grenades. I am a master of descriptions.")
		game.buildings[5] = new Building("Wrecking Ball", "Wrecking Balls", [[8e6, "money"]], [[7000, "damage"], [7000, "money"]], "wreckingBall", "heavyDuty", "img/wreckingBall.png", "wreckingBallBuilding", "Something actually meant for destroying walls.")
		game.buildings[6] = new Building("Bulldozer", "Bulldozers", [[1.2e8, "money"]], [[8e4, "damage"], [8e4, "money"]], "bulldozer", "heavyDuty", "img/bulldozer.png", "bulldozerBuilding", "Rams the wall. So good.")
		game.buildings[7] = new Building("Airstrike Caller", "Airstrike Callers", [[5e9, "money"]], [[2.5e6, "damage"], [2.5e6, "money"]], "airstrike", "heavyDuty", "img/airstrike.png", "airstrikeBuilding", "You know, the guy that calls airstrikes.")
		game.buildings[8] = new Building("Necromancer", "Necromancers", [[66666666666, "money"], [1, "bricks"]], [[33333333, "damage"], [33333333, "money"]], "necromancer", "magic", "img/necromancer.png", "necromancerBuilding", "Raises dead wizards to destroy the wall with their dark magic.", false)
		game.buildings[9] = new Building("Titan", "Titans", [[888888888888, "money"]], [[2.5e8, "damage"], [2.5e8, "money"]], "titan", "magic", "img/titan.png", "titanBuilding", "The prime inhabitants of the Old World, back from the dead. They smash the wall with their giant fists.", false)
		game.buildings[10] = new Building("Demon", "Demons", [[666, "bricks"]], [[3666666666, "damage"], [3666666666, "money"]], "demon", "magic", "img/demon.png", "demonBuilding", "Defiles the wall with the darkest magic of all.", false)
		game.buildings[11] = new Building("Reality Compromiser", "Reality Compromisers", [[1.01e13, "money"]], [[4e10, "damage"], [4e10, "money"], [0.05, "fourth wall bricks"]], "compromiser", "dream", "img/compromiser.png", "compromiserBuilding", "Enters reality code and removes the wall from existence.", false)
		game.buildings[12] = new Building("Black Obliterator", "Black Obliterators", [[5.2e18, "money"], [52000, "fourth wall bricks"]], [[1e16, "damage"], [1e16, "money"]], "obliterator", "dream", "img/obliterator.png", "obliteratorBuilding", "Robots covered in The Black. They're really cool, so no one questions mixing the most dangerous & evil thing ever with cold, unfeeling robots.", false)
		game.buildings[13] = new Building("Brick Factory", "Brick Factories", [[16666666666666, "money"]], [[0.05, "bricks"]], "factory", "special", "img/factory.png", "factoryBuilding", "Creates artificial bricks with dark magic.<br>The wizards will never know.", false)
	})()
	
	function Upgrade(name, url, costs, unlocks, effects, flavorText, requiredUpgrades, keptOnPrestige){
		game.upgrades.push(this)
		this.name = name
		this.costs = costs
		this.unlocks = unlocks
		this.effects = effects
		this.effectsText = ""
		this.url = url.indexOf("png") !== -1 ? url : "img/upgrades/"+url+".png"
		this.flavorText = flavorText
		this.laterUpgrades = []
		this.preReqUpgrades = requiredUpgrades || []
		this.unlocked = false
		this.bought = false
		this.currentlyShownAsAvailable = false
		this.idName = this.url.substring(this.url.lastIndexOf("\/")+1, this.url.lastIndexOf("\."))
		this.keptOnPrestige = keptOnPrestige || false
		for (var i = 0; i < this.effects.length; i++){
			var effect = this.effects[i]
			var unknown = false
			if (effect[0] === "static"){
				var building = game.findBuilding(effect[2])
				if (building){
					if (building.name === "Brick Factory"){
						if (effect[1] % 1 > 0){
							this.effectsText += building.pluralName + " make <b>" + (effect[1] - 1)*100 + "%</b> more bricks."
						}
						else {
							this.effectsText += building.pluralName + " make <b>" + game.multiplierNames[effect[1]] + "</b> as many bricks."
						}
					}
					else if (building.name === "Reality Compromiser"){
						if (effect[1] % 1 > 0){
							this.effectsText += building.pluralName + " deal <b>" + (effect[1] - 1)*100 + "%</b> more damage, and create <b>"+(effect[1] - 1)*100+"%</b> more fourth wall bricks."
						}
						else {
							this.effectsText += building.pluralName + " deal <b>" + game.multiplierNames[effect[1]] + "</b> as much damage, and create <b>"+game.multiplierNames[effect[1]]+"</b> as many fourth wall bricks."
						}
					}
					else {
						if (effect[1] % 1 > 0){
							this.effectsText += building.pluralName + " deal <b>" + (effect[1] - 1)*100 + "%</b> more damage."
						}
						else {
							this.effectsText += building.pluralName + " deal <b>" + game.multiplierNames[effect[1]] + "</b> as much damage."
						}
					}
				}
				else if (effect[2] === "handDamage"){
					if (effect[1] % 1 > 0){
						this.effectsText += "Hand punches do <b>" + (effect[1] - 1)*100 + "%</b> more damage."
					}
					else {
						this.effectsText += "Hand punches do <b>" + game.multiplierNames[effect[1]] + "</b> as much damage."
					}
				}
				else if (effect[2] === "handBricks"){
					if (effect[1] % 1 > 0){
						this.effectsText += "Manual brick creation creates <b>" + (effect[1] - 1)*100 + "%</b> more bricks."
					}
					else {
						this.effectsText += "Manual brick creation creates <b>" + game.multiplierNames[effect[1]] + "</b> as many bricks."
					}
				}
				else {
					unknown = true
				}
			}
			else if (effect[0] === "dynamic"){
				if (effect[3] === "building"){
					var building = game.findBuilding(effect[4])
					var building2 = game.findBuilding(effect[1])
					var amt = effect[2]
					if (effect[1] === "handDamage"){
						this.effectsText += "Hand punches do <b>" + ((amt*100) + "%</b> more") + " damage per " + building.name.toLowerCase()+"."
					}
					else if (effect[1] === "handBricks"){
						this.effectsText += "Manual brick creation creates <b>" + ((amt*100) + "%</b> more") + " bricks per " + building.name.toLowerCase()+"."
					}
					else if (building2){
						if (building2.name !== "Brick Factory"){
							this.effectsText += building2.pluralName + " deal <b>" + ((amt*100) + "%</b> more") + " damage per " + building.name.toLowerCase()+"."
						}
						else {
							this.effectsText += building2.pluralName + " create <b>" + ((amt*100) + "%</b> more") + " bricks per " + building.name.toLowerCase()+"."
						}
					}
					else {
						unknown = true
					}
				}
				else if (effect[3] === "capsules"){
					var amt = effect[2]
					if (effect[1] === "everythingPreSpace"){
						this.effectsText += "Everything is <b>" + ((amt*100) + "%</b> more") + " efficient per future knowledge capsule you have."
					}
					else {
						unknown = true
					}
				}
				else {
					unknown = true
				}
			}
			else if (effect[0] === "unlock"){
				if (effect[1] === "building"){
					var building = game.findBuilding(effect[2])
					if (building.name === "Demon"){
						this.effectsText += "Summons <b>"+building.pluralName+"</b>."
					}
					else {
						this.effectsText += "Unlocks <b>"+building.pluralName+"</b>."
					}
				}
				else {
					unknown = true
				}
			}
			else if (effect[0] === "special"){
				if (effect[1] === "reset"){
					this.effectsText += "Unlocks the <b>reset button</b>, which converts walls destroyed into future knowledge capsules, at the expense of your progress."
				}
				else if (effect[1] === "makeBricks"){
					this.effectsText += "Unlocks <b>manual brick creation</b>."
				}
				else if (effect[1] === "fourth wall upgrades"){
					this.effectsText += "Unlocks the <b>4th wall upgrade tier</b>."
				}
				else if (effect[1] === "convert"){
					this.effectsText += "Unlocks the ability to convert damage to cosmic knowledge, at the rate of 2 decillion to 1."
				}
				else if (effect[1] === "addFutureKnowledgePower"){
					this.effectsText += "Remember some of your previous lifetimes, making everything +"+(effect[2] * 100)+"% more efficient per future knowledge capsule you have."
				}
				else {
					unknown = true
				}
			}
			else {
				unknown = true
			}
			if (unknown){
				console.log(effect)
				this.effectsText += "WOAH WOAH WOAH: "+effect.toString()
			}
			if (i < this.effects.length - 1){
				this.effectsText += "<br>"
			}
		}
	}
	//Big Upgrades:
	[
		new Upgrade("Magic Mining",
			"magicUnlock",
			[[1, "bricks"]],
			[["static", 1, "wallsDestroyed"]],
			[["unlock", "building", "Necromancer"]],
			"We need bricks to trade with the underground wizards for their secrets. Bricks are their most valuable resource."
		),
		new Upgrade("Deep Magic Mining",
			"magicLevel2",
			[[66666666666666, "money"], [6, "bricks"]],
			[],
			[["static", 2, "Necromancer"], ["static", 1.5, "Titan"], ["unlock", "building", "Brick Factory"]],
			"The wizards are saying we shouldn't go this deep, but we found these cool dark magic tablets.",
			["Summon Titans"]
		),
		new Upgrade("Dark Magic Mining",
			"magicLevel3",
			[[6666666666666666, "money"], [66666, "bricks"]],
			[["static", 3, "wallsDestroyed"]],
			[["static", 1.5, "Necromancer"], ["static", 1.5, "Titan"], ["unlock", "building", "Demon"]],
			"We need to mine into hell with dark magic so we can make a deal with the devil to destroy the wall. Everything about this plan is excellent.",
		),
		new Upgrade("Summon Titans",
			"giantUnlock",
			[[16, "bricks"]],
			[["static", 2, "wallsDestroyed"]],
			[["unlock", "building", "Titan"]],
			"The wizards are willing to raise titans from the dead to help destroy the walls. This is a good idea.",
		),
		new Upgrade("Reality Research",
			"fourthWallUnlock", 
			[[404400040440040440, "money"],
			[4004404, "bricks"]],
			[["static", 4, "wallsDestroyed"]],
			[["unlock", "building", "Reality Compromiser"], ["special", "fourth wall upgrades"]],
			"We have discovered with the breaking of the 4th wall that we are all inside a stupid idle game. Not even a <i>real</i> game! But we can use this knowledge to our advantage...",
		),
		new Upgrade("Time Rewinders",
			"resetUnlock",
			[[1000, "fourth wall bricks"]],
			[["static", 4, "wallsDestroyed"]],
			[["special", "reset"]],
			"We can rewind time and keep our knowledge.",
		),
		new Upgrade("Prestige Hacker",
			"finalWallUnlock",
			[[1e37, "money"]],
			[["static", 5, "wallsDestroyed"]],
			[["special", "convert"]],
			"The hackers decided there was an easier way to go about this.",
		),
		new Upgrade("Black Research",
			"finalWallUnlock",
			[[4.2e19, "money"]],
			[["static", 5, "wallsDestroyed"]],
			[["unlock", "building", "Black Obliterator"]],
			"We have discovered a substance in <b>[REDACTED]</b> that holds more power than anything we have ever encountered. We call it The Black because it is pitch black.",
		),
	];
	//Time Bear Wards
	[
		new Upgrade("Time Bear Research",         "timeBearWard0",  [[1e6, "money"]],                                 [["static", 1, "timesReset"]],                                      [["special", "addFutureKnowledgePower", 0.001]], "Our guys have been reporting senses of nausea and déjà vu, and keep asking if they've done this already. This is distracting and a poor use of company time. R&D is on the case."),
		new Upgrade("Bronze Time Bear Ward",      "timeBearWard1",  [[1e6, "fourth wall bricks"], [1e8, "bricks"]],   [["static", 30, "futureKnowledgeCapsules"]],                        [["special", "addFutureKnowledgePower", 0.001]], "The wizards report feeling the power of the Time Bear upon their magic, and tell us not to manipulate time further. They can create wards that may steer the Time Bear in a different direction, making our guys less scared, therefore raising their productivity.", ["Time Bear Research",         ]),
		new Upgrade("Silver Time Bear Ward",      "timeBearWard2",  [[1e7, "fourth wall bricks"], [1e9, "bricks"]],   [["static", 125, "futureKnowledgeCapsules"], ["static", 2, "timesReset"]],    [["special", "addFutureKnowledgePower", 0.001]], "We asked the wizards what the Time Bear is, and they said \"Something that you do not want aware of your presence.\" That's a little ominous, but not enough to stop us from using everything we have to take down this wall!", ["Bronze Time Bear Ward",      ]),
		new Upgrade("Gold Time Bear Ward",        "timeBearWard3",  [[1e8, "fourth wall bricks"], [1e10, "bricks"]],  [["static", 250, "futureKnowledgeCapsules"], ["static", 3, "timesReset"]],    [["special", "addFutureKnowledgePower", 0.001]], "We were going to ask the titans what the Time Bear is, but the translator wizards refused to ask them, saying \"There are too many old wounds.\"", ["Silver Time Bear Ward",      ]),
		new Upgrade("Platinum Time Bear Ward",    "timeBearWard4",  [[1e9, "fourth wall bricks"], [1e11, "bricks"]],  [["static", 400, "futureKnowledgeCapsules"], ["static", 4, "timesReset"]],    [["special", "addFutureKnowledgePower", 0.001]], "We asked the demons what the Time Bear is, and the chief demon said \"Something you do not want anywhere near you.\" This sounds strange coming from the guy who has carried around some of the most dangerous things we have ever encountered and trolled people with them.", ["Gold Time Bear Ward",        ]),
		new Upgrade("Ruby Time Bear Ward",        "timeBearWard5",  [[1e10, "fourth wall bricks"], [1e12, "bricks"]], [["static", 750, "futureKnowledgeCapsules"], ["static", 5, "timesReset"]],    [["special", "addFutureKnowledgePower", 0.001]], "One of our agents went crazy, muttering about seeing the Time Bear. The wizards are saying he may have been tainted and must be executed.", ["Platinum Time Bear Ward",    ]),
		new Upgrade("Emerald Time Bear Ward",     "timeBearWard6",  [[1e11, "fourth wall bricks"], [1e13, "bricks"]], [["static", 1250, "futureKnowledgeCapsules"], ["static", 6, "timesReset"]],   [["special", "addFutureKnowledgePower", 0.001]], "Found graffiti on the side of RUC headquarters saying \"THE TIME BEAR IS COMING\". Reports of irrational feelings of fear when looking at it. Requesting termination of the Time Rewinder project. ~Agent Lawrence", ["Ruby Time Bear Ward",        ]),
		new Upgrade("Sapphire Time Bear Ward",    "timeBearWard7",  [[1e12, "fourth wall bricks"], [1e14, "bricks"]], [["static", 4000, "futureKnowledgeCapsules"], ["static", 7, "timesReset"]],   [["special", "addFutureKnowledgePower", 0.001]], "The graffiti is everywhere now. On all of our facilities. It seems to appear overnight, after the cameras strangely go offline. Requesting immediate termination of the Time Rewinder project. ~Chief of Security, RUC", ["Emerald Time Bear Ward",     ]),
		new Upgrade("Unobtainium Time Bear Ward", "timeBearWard8",  [[1e13, "fourth wall bricks"], [1e15, "bricks"]], [["static", 1.5e4, "futureKnowledgeCapsules"], ["static", 8, "timesReset"]],  [["special", "addFutureKnowledgePower", 0.001]], "\"dude this is some creepy shit just cut the time crap\" ~1337 sn1p3r #73", ["Sapphire Time Bear Ward",    ]),
		new Upgrade("Dark Matter Time Bear Ward", "timeBearWard9",  [[1e14, "fourth wall bricks"], [1e16, "bricks"]], [["static", 4e4, "futureKnowledgeCapsules"], ["static", 9, "timesReset"]],    [["special", "addFutureKnowledgePower", 0.001]],  "We asked the wizards if there was any way to fully stop the Time Bear, and they said \"You do not attempt to destroy the sun to prevent it from rising.\"", ["Unobtainium Time Bear Ward", ]),
		new Upgrade("Antimatter Time Bear Ward",  "timeBearWard10", [[1e15, "fourth wall bricks"], [1e17, "bricks"]], [["static", 1.5e5, "futureKnowledgeCapsules"], ["static", 10, "timesReset"]], [["special", "addFutureKnowledgePower", 0.001]], "We asked the demons if they could stop the Time Bear, and they said \"There are things that you do not mess with. With us, there are only two. Our boss, and the Time Bear.\"", ["Dark Matter Time Bear Ward", ]),
		new Upgrade("Rainbow Time Bear Ward",     "timeBearWard11", [[1e16, "fourth wall bricks"], [1e18, "bricks"]], [["static", 4e5, "futureKnowledgeCapsules"], ["static", 11, "timesReset"]],   [["special", "addFutureKnowledgePower", 0.002]],  "The reality compromiser project leader attempted to find the Time Bear in reality code, to remove it. He was found dead two hours later in the seat of a reality compromiser. When inspected for cause of death, it seemed he had died of shock.", ["Antimatter Time Bear Ward",  ]),
		new Upgrade("Final Time Bear Ward",       "timeBearWard12", [[1e18, "fourth wall bricks"], [1e20, "bricks"]], [["static", 1.5e6, "futureKnowledgeCapsules"], ["static", 11, "timesReset"]], [["special", "addFutureKnowledgePower", 0.003]], "\"This is the last ward the wizards can make. I do not know where we should go from this. I am going to remove myself from anywhere that could be associated with time travel. This is a farewell message. The Time Bear is coming.\"<br>~CEO, RUC", ["Rainbow Time Bear Ward",     ]),
		new Upgrade("Black Time Bear Ward",       "timeBearWard13", [[1e20, "fourth wall bricks"], [1e22, "bricks"]], [["static", 4e6, "futureKnowledgeCapsules"], ["static", 12, "timesReset"]],   [["special", "addFutureKnowledgePower", 0.004]],  "There is one thing that does not fear the Time Bear: The Black. The most evil substance known to anyone may be our only hope.", ["Final Time Bear Ward",       ]),
		new Upgrade("Army Time Bear Ward",        "timeBearWard14", [[1e22, "fourth wall bricks"], [1e24, "bricks"]], [["static", 9e6, "futureKnowledgeCapsules"], ["static", 13, "timesReset"]],   [["special", "addFutureKnowledgePower", 0.005]],  "Whoever these guys were or are, they have supposedly come close to the Time Bear and survived. Perhaps their artifacts could help us.", ["Black Time Bear Ward",       ]),
	];
	//Hand brick stuff
	[
		new Upgrade("Dark Magic Training",
			"img/upgrades/handBrickUnlock.png",
			[[4e15, "money"],
			[200, "bricks"]],
			[["static", 25, "Brick Factory"]],
			[["special", "makeBricks"]],
			"Now you will be able to create bricks yourself, even if the dark magic tablets don't like you.",
			undefined, true
		),
		new Upgrade("Psychiatrists",
			"img/upgrades/handBrickUpgrade.png",
			[[7e15, "money"], [1000, "bricks"]],
			[["static", 1000, "handBricks"]],
			[["static", 3, "handBricks"]],
			"To find out why you and the dark magic tablets aren't getting along.",
			undefined, true
		),
		new Upgrade("Necromancer Lessons",
			"img/upgrades/handBrickUpgrade2.png",
			[[4e16, "money"], [1e5, "bricks"]],
			[["static", 1e5, "handBricks"]],
			[["dynamic", "handBricks", 0.015, "building", "Necromancer"]],
			"They can give you lessons in dark magic, and as a bonus, being an asshole.",
			undefined, true
		),
		new Upgrade("Demon Lessons",
			"img/upgrades/handBrickUpgrade3.png",
			[[4e17, "money"], [1e7, "bricks"]],
			[["static", 1e7, "handBricks"], ["static", 1, "Demon"]],
			[["dynamic", "handBricks", 0.015, "building", "Demon"]],
			"Much better at dark magic <b>and</b> at being assholes than the necromancers.",
			undefined, true
		),
		new Upgrade("Joint Necromancer-Demon Lessons",
			"img/upgrades/handBrickUpgrade4.png",
			[[4e19, "money"], [1e9, "bricks"]],
			[["static", 1e9, "handBricks"]],
			[["static", 4, "handBricks"]],
			"They fight a lot, but you somehow learn best when they teach at the same time.",
			undefined, true, ["Necromancer Lessons", "Demon Lessons"]
		),
		new Upgrade("Wisdom of The Titans",
			"img/upgrades/handBrickUpgrade5.png",
			[[4e21, "money"], [1e11, "bricks"]],
			[["static", 1e11, "handBricks"]],
			[["dynamic", "handBricks", 0.01, "building", "Titan"]],
			"After smashing the walls a ton, they have learned a lot about the inner workings of bricks.",
			undefined, true
		),
		new Upgrade("Necromancer Translators",
			"img/upgrades/handBrickUpgrade6.png",
			[[4e24, "money"], [1e13, "bricks"]],
			[["static", 1e13, "handBricks"]],
			[["dynamic", "handBricks", 0.008, "building", "Titan"]],
			"Now with the added benefit of actually being able to understand the titans.",
			undefined, true
		),
		new Upgrade("Demon Translators",
			"handBrickUpgrade7",
			[[4e26, "money"], [1e15, "bricks"]],
			[["static", 1e15, "handBricks"]],
			[["dynamic", "handBricks", 0.008, "building", "Titan"]],
			"They know the tablets very well, so they innately know what the titans are talking about.",
			undefined, true
		),
		new Upgrade("Factory Hand",
			"handBrickUpgrade8",
			[[4e28, "money"], [1e17, "bricks"]],
			[["static", 1e17, "handBricks"]],
			[["static", 4, "handBricks"]],
			"\"It's an assembly line in your palm and a conveyor belt in your wrist! Perfect!\" ~CEO, RUC",
			undefined, true
		),
		new Upgrade("Omnimagic",
			"handBrickUpgrade9",
			[[4e30, "money"], [1e19, "bricks"]],
			[["static", 1e19, "handBricks"]],
			[["static", 5, "handBricks"]],
			"\"i call hax\" ~1337 sn1p3r #10",
			undefined, true
		),
	];
	//Hand Upgrades (based on total hand damage):
	[
		new Upgrade("Caffeine",                    "handUpgrade1",  [[1e4, "money"]],  [["static", 1e3, "handDamage"]],  [["static", 3, "handDamage"]], "Caffeine obviously gives you the ability to punch faster.", undefined, true),
		new Upgrade("Energy Drinks",               "handUpgrade2",  [[1e6, "money"]],  [["static", 1e5, "handDamage"]],  [["static", 2, "handDamage"]], "POWERTHIIIRRRST", undefined, true),
		new Upgrade("Experimental Drugs",          "handUpgrade3",  [[1e8, "money"]],  [["static", 1e7, "handDamage"]],  [["static", 2, "handDamage"]], "Probably completely safe.", undefined, true),
		new Upgrade("Personal Trainer",            "handUpgrade4",  [[1e10, "money"]], [["static", 1e9, "handDamage"]],  [["static", 2, "handDamage"]], "This guy is like the grandmaster of punching walls.", undefined, true),
		new Upgrade("Elephantiasis",               "handUpgrade5",  [[1e12, "money"]], [["static", 1e11, "handDamage"]], [["static", 2, "handDamage"]], "With this horribly crippling disease your fists will be like hardass wrecking balls!", undefined, true),
		new Upgrade("Training Montage",            "handUpgrade6",  [[1e14, "money"]], [["static", 1e13, "handDamage"]], [["static", 2, "handDamage"]], "Set to '80s music, of course.", undefined, true),
		new Upgrade("Laser Brain Surgery",         "handUpgrade7",  [[1e16, "money"]], [["static", 1e15, "handDamage"]], [["static", 2, "handDamage"]], "For enhanced speed!", undefined, true),
		new Upgrade("Mechanical Limbs",            "handUpgrade8",  [[1e18, "money"]], [["static", 1e17, "handDamage"]], [["static", 2, "handDamage"]], "One step closer to being a Terminator.", undefined, true),
		new Upgrade("Cloning",                     "handUpgrade9",  [[1e20, "money"]], [["static", 1e19, "handDamage"]], [["static", 2, "handDamage"]], "Now there are two of you. This is a good idea.", undefined, true),
		new Upgrade("The Final Fist",              "handUpgrade10", [[1e22, "money"]], [["static", 1e21, "handDamage"]], [["static", 2, "handDamage"]], "As spoken of by the prophets, it has finally arrived.", undefined, true),
		new Upgrade("Breaking Point",              "handUpgrade11", [[1e24, "money"]], [["static", 1e23, "handDamage"]], [["static", 2, "handDamage"]], "The most legendary hand combat technique of all time. Invented by Grandmaster Vwynido, the most skilled hand combatant in recorded history. And yes, it totally works on a brick wall.", undefined, true),
		new Upgrade("The Mighty Fist of Reaefsek", "handUpgrade12", [[1e26, "money"]], [["static", 1e25, "handDamage"]], [["static", 2, "handDamage"]], "The fate of Lord Reaefsek is unknown; he simply vanished one day after saying he was \"going to contact the king\". Hyzem was the king at the time, and he reported never having seen Reaefsek. The only evidence of the journey is his severed hand, found lying in a barren field holding the Nightmare Blade.", undefined, true),
		new Upgrade("Proposal #731",               "handUpgrade13", [[1e28, "money"]], [["static", 1e27, "handDamage"]], [["static", 3, "handDamage"]], "\"Reaefsek's wrist had traces of something on the cut. It's hard to describe exactly what it is... it's like magic that has been perfectly optimised. There's so little of it that we could only use it to improve one object.\" ~Head of R&D<br>\"We tried to examine it in reality code to see if we could replicate it, but its code is even more incomprehensible than other magic code. It almost seems like its creator made it confusing on purpose.\" ~RC Project Leader", undefined, true),
		new Upgrade("The Finality Trees",          "handUpgrade14", [[1e30, "money"]], [["static", 1e29, "handDamage"]], [["static", 3, "handDamage"]], "\"Upon the mountainous plateaus of a land afar lies a grove of silver leafless trees. Their power is equal to their mystery, and they symbolize The Finality.\" ~A wall dating back to the time of the first titan king<br> <br>We found them. The power surrounding their presence is so ridiculous that just by chilling next to them for a while you will be thrice as strong. But we could only take you, because getting there is just horrible.", undefined, true),
		new Upgrade("The Hand of God",             "handUpgrade15", [[1e34, "money"]], [["static", 1e33, "handDamage"]], [["static", 4, "handDamage"]], "\"Did he seriously put himself in as the last tier? Oh my god. Oh my fucking god. </i>Disgusting.<i>\" ~Agent Johnson", undefined, true),
	];
	//Hand Upgrades:
	[
		new Upgrade("Team Up", "handAndPuncherUpgrade1", [[2e5, "money"]], [["static", 50, "Puncher"]], [["dynamic", "handDamage", 0.04, "building", "Puncher"]], "Get a morale boost from the fact that you're hiring people to punch a wall."),
		new Upgrade("Come Together", "handAndPuncherUpgrade2", [[2e7, "money"]], [["static", 100, "Puncher"]], [["dynamic", "handDamage", 0.02, "building", "Puncher"], ["static", 1.5, "Puncher"]], "The weak become strong(er)."),
		new Upgrade("Standing Ovation", "handAndPuncherUpgrade3", [[4e11, "money"]], [["static", 200, "Puncher"]], [["dynamic", "handDamage", 0.01, "building", "Puncher"], ["static", 2, "Puncher"]], "After you gave a great inspiring speech about punching walls."),
		new Upgrade("The Challenge", "handAndPuncherUpgrade4", [[1e16, "money"]], [["static", 300, "Puncher"]], [["dynamic", "handDamage", 0.008, "building", "Puncher"], ["static", 2, "Puncher"]], "To destroy the wall with only your fists."),
		new Upgrade("Final Team Up", "handAndPuncherUpgrade5", [[1e20, "money"]], [["static", 400, "Puncher"]], [["dynamic", "handDamage", 0.003, "building", "Puncher"], ["static", 2, "Puncher"]], "To defeat the walls once and for all!"),
		new Upgrade("Ultra Team Up", "handAndPuncherUpgrade6", [[4e23, "money"]], [["static", 500, "Puncher"]], [["dynamic", "handDamage", 0.002, "building", "Puncher"], ["static", 2, "Puncher"]], "We lied about the last one being final, but it's not like we can just stop upgrading!"),
		new Upgrade("Energy Draining","handAndPuncherUpgrade7", [[4e31, "money"]], [["static", 700, "Puncher"]], [["dynamic", "handDamage", 0.002, "building", "Puncher"], ["static", 2, "Puncher"]], "With additional duplicating so the punchers don't lose any power. They'll complain, but you're clearly better than them."),

		new Upgrade("Club Knuckles",       "handAndClubberUpgrade",      [[1e6, "money"]],                               [["static", 50, "Clubber"]],             [["dynamic", "handDamage", 0.01, "building", "Clubber"]],                                                                      "They're like clubs tied to your knuckles. Another brilliant invention from the Realistic Upgrades Corporation (RUC)."),
		new Upgrade("Sword Knuckles",      "handAndSwordsmanUpgrade",    [[7.5e6, "money"]],                             [["static", 50, "Swordsman"]],           [["dynamic", "handDamage", 0.01, "building", "Swordsman"]],                                                                    "We're currently trying to figure out how to combine these with the club knuckles. Then, our work here will be done."),
		new Upgrade("Bullet Punch",        "handAndGunnerUpgrade",       [[1e8, "money"]],                               [["static", 50, "Gunner"]],              [["dynamic", "handDamage", 0.01, "building", "Gunner"]],                                                                       "An ancient technique passed down by the wall punching masters."),
		new Upgrade("Fist Grenades",       "handAndGrenadeUpgrade",      [[2.5e9, "money"]],                             [["static", 50, "Grenade Thrower"]],     [["dynamic", "handDamage", 0.01, "building", "Grenade Thrower"]],                                                              "I honestly don't know what these are. Feel free to imagine them how you want."),
		new Upgrade("Wrecking Ball Punch", "handAndWreckingBallUpgrade", [[5e10, "money"]],                              [["static", 50, "Wrecking Ball"]],       [["dynamic", "handDamage", 0.01, "building", "Wrecking Ball"]],                                                                "Another legendary technique."),
		new Upgrade("Bulldozer Strike",    "handAndBulldozerUpgrade",    [[5e11, "money"]],                              [["static", 50, "Bulldozer"]],           [["dynamic", "handDamage", 0.01, "building", "Bulldozer"]],                                                                    "This isn't actually a legendary technique, we just made it up."),
		new Upgrade("Skydiving",           "handAndAirstrikeUpgrade",    [[2e13, "money"]],                              [["static", 50, "Airstrike Caller"]],    [["dynamic", "handDamage", 0.01, "building", "Airstrike Caller"]],                                                             "30,000 feet of DAMAGE!"),
		new Upgrade("Zombification",       "handAndNecromancerUpgrade",  [[5e14, "money"],[500, "bricks"]],              [["static", 50, "Necromancer"]],         [["dynamic", "handDamage", 0.01, "building", "Necromancer"]],                                                                  "Now you don't have to waste hours sleeping."),
		new Upgrade("Ancient Techniques",  "handAndGiantUpgrade",        [[5e15, "money"]],                              [["static", 50, "Titan"]],               [["dynamic", "handDamage", 0.01, "building", "Titan"]],                                                                        "The walls were around even in the Old World, and with the walls comes wall punching."),
		new Upgrade("Fist of Evil",        "handAndDemonUpgrade",        [[7e5, "bricks"]],                              [["static", 50, "Demon"]],               [["dynamic", "handDamage", 0.005, "building", "Demon"]],                                                                       "It doesn't matter how evil or horrible the technique, all that matters is that the wall comes down!"),
		new Upgrade("Invulnerability",     "handAndCompromiserUpgrade",  [[6e17, "money"], [6e4, "fourth wall bricks"]], [["static", 50, "Reality Compromiser"]], [["dynamic", "handDamage", 0.005, "building", "Reality Compromiser"]],                                                         "Sometimes it hurts to punch a brick wall. Not anymore!"),
		new Upgrade("Fist of The Black",   "handAndObliteratorUpgrade",  [[3e22, "money"], [3e8, "fourth wall bricks"]], [["static", 50, "Black Obliterator"]],   [["dynamic", "handDamage", 0.005, "building", "Black Obliterator"]],                                                           "Since you're invulnerable, you are the only person who can touch The Black without dying a horrible, painful death."),
		new Upgrade("Brick Knuckles",      "handBrickFactoryUpgrade",    [[5e16, "money"]],                              [["static", 50, "Brick Factory"]],       [["dynamic", "handDamage", 0.005, "building", "Brick Factory"], ["dynamic", "handBricks", 0.04, "building", "Brick Factory"]], "Fight fire with fire!"),
	];
	//Puncher-y stuff
	[
		new Upgrade("Gloves", "puncherUpgrade1", [[100, "money"]], [["static", 1, "Puncher"]], [["static", 2, "handDamage"], ["static", 1.5, "Puncher"]], "A little padding."),
		new Upgrade("Padded Gloves", "puncherUpgrade2", [[400, "money"]], [["static", 5, "Puncher"]], [["static", 2, "handDamage"], ["static", 2, "Puncher"]], "Actually significant padding."),
		new Upgrade("Steel Plated Gloves", "puncherUpgrade3", [[10000, "money"]], [["static", 25, "Puncher"]], [["static", 2, "handDamage"], ["static", 2, "Puncher"]], "A brilliant plan."),
		new Upgrade("Brass Knuckles", "puncherUpgrade4", [[1e5, "money"]], [["static", 50, "Puncher"]], [["static", 2, "handDamage"], ["static", 2, "Puncher"]], "That's on top of the steel plated gloves. Hell yeah."),
		new Upgrade("Titanium Knuckles", "puncherUpgrade5", [[1e6, "money"]], [["static", 75, "Puncher"]], [["static", 2, "handDamage"], ["static", 2, "Puncher"]], "Clearly better, because anything made of titanium does way more damage."),
		new Upgrade("Diamond Knuckles", "puncherUpgrade6", [[2e7, "money"]], [["static", 100, "Puncher"]], [["static", 2, "handDamage"], ["static", 3, "Puncher"]], "The only real substance that can make things do more damage than titanium."),
		new Upgrade("Adamantium Gauntlets", "puncherUpgrade7", [[2e9, "money"]], [["static", 150, "Puncher"]], [["static", 1.5, "handDamage"], ["static", 3, "Puncher"]], "Wolverine claws optional."),
		new Upgrade("<b>[REDACTED]</b> Gloves", "puncherUpgrade8", [[2e11, "money"]], [["static", 200, "Puncher"]], [["static", 1.5, "handDamage"], ["static", 4, "Puncher"]], "We brought back an old experiment to make gloves made out of <b>[REDACTED]</b>.<br><b>CHIEF OF R&D EDIT:</b> that's top secret, you idiot."),
		new Upgrade("Antimatter Gauntlets", "puncherUpgrade9", [[2e15, "money"]], [["static", 300, "Puncher"]], [["static", 1.5, "handDamage"], ["static", 5, "Puncher"]], "The RUC is not responsible for any deaths/implosions caused by the Antimatter Gauntlets(TM)."),
		new Upgrade("The Fists of Destiny", "puncherUpgrade10", [[2e19, "money"]], [["static", 400, "Puncher"]], [["static", 1.5, "handDamage"], ["static", 5, "Puncher"]], "We found these in an old mine. They're thousands of years old and punch through anything!"),
		new Upgrade("Eternity Gloves", "puncherUpgrade11", [[2e23, "money"]], [["static", 500, "Puncher"]], [["static", 2, "handDamage"], ["static", 7, "Puncher"]], "We found these in Agent Johnson's office trash can. When asked, he said \"I've never seen those before.\""),
		new Upgrade("The Million", "puncherUpgrade12", [[2e31, "money"]], [["static", 700, "Puncher"]], [["static", 2, "handDamage"], ["static", 5, "Puncher"]], "\"The nickname for Lord Reaefsek's terrifying... punching... thing. How do I describe it without having to describe it?\" ~Agent Carter in the 1,000,000 proposal"),
		new Upgrade("Finality Rock Knuckles", "puncherUpgrade13", [[2e39, "money"]], [["static", 900, "Puncher"]], [["static", 2, "handDamage"], ["static", 4, "Puncher"]], "Protocol upon finding extremely powerful substance: Check if you can tie it to puncher knuckles. Then, like, research it or whatever less exciting stuff you do.<br> <br>As for the Plateau rocks themselves: they may be far less potent than the Trees, but they're still far more so than anything else we've got!"),
		new Upgrade("Magically Enhanced Fists", "puncherUpgradeMagic1", [[2.02e10, "money"], [1, "bricks"]], [], [["static", 1.5, "handDamage"], ["static", 3, "Puncher"]], "A syringe filled with pure magic.", ["Magic Mining"]),
		new Upgrade("Maganium Gauntlets", "puncherUpgradeMagic2", [[2.02e13, "money"], [10, "bricks"]], [["static", 250, "Puncher"]], [["static", 1.5, "handDamage"], ["static", 4, "Puncher"]], "These gauntlets magically enhance your magically enhanced fists."),
		new Upgrade("Black Hole Gloves", "puncherUpgradeMagic3", [[2.02e17, "money"], [2e5, "bricks"]], [["static", 350, "Puncher"]], [["static", 1.5, "handDamage"], ["static", 5, "Puncher"]], "\"These may end up killing us all, but at least they'll take that damn wall down with us.\" ~CEO, RUC"),
		new Upgrade("Black-Dipped Gloves", "puncherUpgradeBlack", [[6.06e27, "money"], [6.06e13, "bricks"]], [["static", 600, "Puncher"]], [["static", 1.5, "handDamage"], ["static", 6, "Puncher"]], "If we haven't mentioned it yet, The Black is a kind of rubbery tar-like substance that slowly moves like it's alive and absorbs and eats through everything. The antimatter gauntlets last a few hours; we're not wasting the Fists of Destiny or Eternity Gloves by testing it with them."),
		new Upgrade("Chess Knuckles", "puncherUpgradeArmy", [[2e35, "money"], [2e24, "bricks"], [2e21, "fourth wall bricks"]], [["static", 800, "Puncher"]], [["static", 2, "handDamage"], ["static", 4, "Puncher"]], "\"Okay, let's review: You find a chess set. Shrouded in mystery, indestructible and incredibly powerful with reality editing, dating back to before Optuqui's time. You make... CHESS KNUCKLES.\" ~Agent Taylor<br>\"I don't understand your problem with this.\" ~Puncher Project Leader"),
		new Upgrade("Maximum Super Strength", "puncher4thWallUpgrade", [[22020020022020002, "money"], [50, "fourth wall bricks"]], [], [["static", 1.5, "handDamage"], ["static", 4, "Puncher"]], "Thanks to rewriting the universe, they can now lift up to 8000 tons.", ["Reality Research"])
	];
	//Clubber-y stuff
	[
		new Upgrade("Better Clubs",                 "clubberUpgrade1",      [[750, "money"]],                                                        [["static", 1, "Clubber"]],   [["static", 1.5, "Clubber"]], "Simply feels better to hold."),
		new Upgrade("Iron Clubs",                   "clubberUpgrade2",      [[7.5e3, "money"]],                                                      [["static", 5, "Clubber"]],   [["static", 2, "Clubber"]],   "Wood is old school."),
		new Upgrade("Titanium Clubs",               "clubberUpgrade3",      [[7.5e4, "money"]],                                                      [["static", 25, "Clubber"]],  [["static", 2, "Clubber"]],   "Heavier, but actually does damage."),
		new Upgrade("Spiked Clubs",                 "clubberUpgrade4",      [[7.5e5, "money"]],                                                      [["static", 50, "Clubber"]],  [["static", 2, "Clubber"]],   "Titanium spikes, of course."),
		new Upgrade("Bigger Clubs",                 "clubberUpgrade5",      [[7.5e6, "money"]],                                                      [["static", 75, "Clubber"]],  [["static", 2, "Clubber"]],   "I'm surprised we didn't get these sooner."),
		new Upgrade("Bomb Clubs",                   "clubberUpgrade6",      [[7.5e7, "money"]],                                                      [["static", 100, "Clubber"]], [["static", 3, "Clubber"]],   "Just attach some bombs to the clubs. An excellent plan."),
		new Upgrade("Plasma Coated Clubs",          "clubberUpgrade7",      [[3.75e9, "money"]],                                                     [["static", 150, "Clubber"]], [["static", 3, "Clubber"]],   "Melts through the wall. Be careful!"),
		new Upgrade("Nuke Clubs",                   "clubberUpgrade8",      [[3.75e11, "money"]],                                                    [["static", 200, "Clubber"]], [["static", 4, "Clubber"]],   "Like bomb clubs, but waaaay more dangerous."),
		new Upgrade("Quantum Clubs",                "clubberUpgrade9",      [[7.5e15, "money"]],                                                     [["static", 300, "Clubber"]], [["static", 5, "Clubber"]],   "We used quantum mechanics to make these clubs do the absolute maximum damage."),
		new Upgrade("Clubs of Happiness",           "clubberUpgrade10",     [[3.75e19, "money"]],                                                    [["static", 400, "Clubber"]], [["static", 5, "Clubber"]],   "Just holding these makes you happy. Sure, there are some pretty bad side effects, but none that will halt wall destruction!"),
		new Upgrade("Protection Against The Clubs", "clubberUpgrade11",     [[7.5e23, "money"]],                                                     [["static", 500, "Clubber"]], [["static", 7, "Clubber"]],   "Now we don't have to clean up after the accidents that the at-this-point-ridiculously-dangerous clubs cause. Maybe this is something we should have gotten earlier."),
		new Upgrade("The Devil's Club",             "clubberUpgrade12",     [[1.5e32, "money"]],                                                     [["static", 700, "Clubber"]], [["static", 5, "Clubber"]],   "Literally. According to the demons, he'd use it to bash sinners over the head in the old days; he doesn't need it any more because he has new methods. (We didn't inquire as to what those are)"),
		new Upgrade("Magic Lava Clubs",             "clubberUpgradeMagic",  [[1.5e9, "money"],[1, "bricks"]],                                        [],                           [["static", 3, "Clubber"]],   "Clubs made out of pure lava. It works because it's magic.", ["Magic Mining"]),
		new Upgrade("Sun Clubs",                    "clubberUpgradeMagic2", [[1.5e13, "money"], [1500, "bricks"]],                                   [["static", 250, "Clubber"]], [["static", 4, "Clubber"]],   "As hot as the sun. Magic!"),
		new Upgrade("Supernova Clubs",              "clubberUpgradeMagic3", [[1.5e17, "money"], [1.5e7, "bricks"]],                                  [["static", 350, "Clubber"]], [["static", 5, "Clubber"]],   "Thanks to the wizards we can now make something even more dangerous than the nuke clubs!"),
		new Upgrade("Black-Infested Clubs",         "clubberUpgradeBlack",  [[4.5e27, "money"], [4.5e14, "bricks"]],                                 [["static", 600, "Clubber"]], [["static", 6, "Clubber"]],   "They spread The Black like a plague with each hit. Only to the walls though, it's safe!"),
		new Upgrade("Perfect Clubs",                "clubberUpgradeArmy",   [[1.5e36, "money"], [1.5e25, "bricks"], [1.5e21, "fourth wall bricks"]], [["static", 800, "Clubber"]], [["static", 4, "Clubber"]],   "\"Are you serious?\" ~Agent Lawrence<br>\"Oh yes. We did it. Mission complete. Project finished. Clubs over.\" ~Head of R&D"),
		new Upgrade("Cartoon Physics",              "clubber4thWallUpgrade",[[3.3e16, "money"], [500, "fourth wall bricks"]],                        [],                           [["static", 4, "Clubber"]],   "You can whack someone 1000 feet into the air with a club now!", ["Reality Research"]),
	];
	//Swordsman-y stuff
	[
		new Upgrade("Sharpening",                         "swordsmanUpgrade1",      [[5.5e3, "money"]],                                                        [["static", 1, "Swordsman"]],   [["static", 1.5, "Swordsman"]], "Kind of useless in the long term of wall-slicing."),
		new Upgrade("Bigger Swords",                      "swordsmanUpgrade2",      [[5.5e4, "money"]],                                                        [["static", 5, "Swordsman"]],   [["static", 2, "Swordsman"]],   "Bigger is better!"),
		new Upgrade("Fancy Hilts",                        "swordsmanUpgrade3",      [[5.5e5, "money"]],                                                        [["static", 25, "Swordsman"]],  [["static", 2, "Swordsman"]],   "Raises morale."),
		new Upgrade("Katanas",                            "swordsmanUpgrade4",      [[5.5e6, "money"]],                                                        [["static", 50, "Swordsman"]],  [["static", 2, "Swordsman"]],   "Regular swords are lame."),
		new Upgrade("Dual Katanas",                       "swordsmanUpgrade5",      [[5.5e7, "money"]],                                                        [["static", 75, "Swordsman"]],  [["static", 2, "Swordsman"]],   "Upping the cool factor by even more. Well, it would be cool if they were good with swords."),
		new Upgrade("Flaming Katanas",                    "swordsmanUpgrade6",      [[1.1e9, "money"]],                                                        [["static", 100, "Swordsman"]], [["static", 3, "Swordsman"]],   "\"If something isn't effective enough, light it on fire.\" ~CEO of Realistic Upgrades Corporation (RUC)"),
		new Upgrade("Anime-Sized Swords",                 "swordsmanUpgrade7",      [[5.5e10, "money"]],                                                       [["static", 150, "Swordsman"]], [["static", 3, "Swordsman"]],   "Bigger than the people wielding them!"),
		new Upgrade("Lightsabers",                        "swordsmanUpgrade8",      [[2.2e12, "money"]],                                                       [["static", 200, "Swordsman"]], [["static", 4, "Swordsman"]],   "We got to work on this the <b>second</b> we got plasma."),
		new Upgrade("Reality Blades",                     "swordsmanUpgrade9",      [[1.1e16, "money"]],                                                       [["static", 300, "Swordsman"]], [["static", 5, "Swordsman"]],   "Swords made out of the fabric of reality. How this works I have no idea, but they are awesome."),
		new Upgrade("Dual Wielding",                      "swordsmanUpgrade10",     [[1.1e20, "money"]],                                                       [["static", 400, "Swordsman"]], [["static", 5, "Swordsman"]],   "Thanks to the swords that cut through anything, it doesn't matter how hard they're swung."),
		new Upgrade("The Finality Swords",                "swordsmanUpgrade11",     [[4.4e24, "money"]],                                                       [["static", 500, "Swordsman"]], [["static", 7, "Swordsman"]],   "This is what the Swordsman Project Leader calls this collection of swords that he reportedly found in a cave. He won't show us them or say what they do."),
		new Upgrade("The Nightmare Blade",                "swordsmanUpgrade12",     [[1.1e33, "money"]],                                                       [["static", 700, "Swordsman"]], [["static", 5, "Swordsman"]],   "\"The Blade was Lord Reaefsek's favorite weapon. It was his first magical artifact, and he kept upgrading it to the point where it's just ridiculously powerful.\" ~Agent Taylor<br>\"The name's pretty cliché though.\" ~Agent Johnson"),
		new Upgrade("Maganium Swords",                    "swordsmanUpgradeMagic",  [[1.1e10, "money"], [1, "bricks"]],                                        [["static", 125, "Swordsman"]], [["static", 3, "Swordsman"]],   "We found this mineral that happens to be the perfect magic enhancer, so we named it maganium.", ["Magic Mining"]),
		new Upgrade("Sword That Cuts Through Everything", "swordsmanUpgradeMagic2", [[1.1e14, "money"], [5000, "bricks"]],                                     [["static", 250, "Swordsman"]], [["static", 4, "Swordsman"]],   "Thanks to the power of dark magic, we have finally made it."),
		new Upgrade("Oblivion Blades",                    "swordsmanUpgradeMagic3", [[1.1e18, "money"], [5e7, "bricks"]],                                      [["static", 350, "Swordsman"]], [["static", 5, "Swordsman"]],   "These were created by accident when we told the wizards to pump as much magic as they possibly could into the swords. Declaration: worth."),
		new Upgrade("Black-Coated Swords",                "swordsmanUpgradeBlack",  [[6.6e28, "money"], [6.6e18, "bricks"]],                                   [["static", 600, "Swordsman"]], [["static", 6, "Swordsman"]],   "\"All those complainers who said hiring someone to make a really cool sword design for these was stupid 'cause The Black would eat through and destroy them eventually were being dumb. Look at these things.\" ~CEO, RUC"),
		new Upgrade("#7's Sword",                         "swordsmanUpgradeArmy",   [[1.1e37, "money"], [1.1e26, "bricks"], [1.1e22, "fourth wall bricks"]],   [["static", 800, "Swordsman"]], [["static", 4, "Swordsman"]],   "According to a demon historian, 35,000 years ago \"some masked asshole tried to sneak into the boss's HQ\". This sword and the mask (made of the same strange material) are all that remain of the stranger, after \"the boss taught him a lesson\". This incident was one of the only times in history that demons were killed, and as said by the Devil, \"the only time I ever got a real challenge\".<br> <br>As a test of this sword's strength, Agent Johnson cut one of our swords that cuts through everything clean in half. He wanted to attempt chopping down a Finality Tree next, but the plan was vetoed by literally everyone else."),
		new Upgrade("Building-Sized Swords",              "swordsman4thWallUpgrade",[[5.5e16, "money"], [2500, "fourth wall bricks"]],                         [],                             [["static", 4, "Swordsman"]],   "We can hold them because it's a damn idle game, it doesn't need to make sense.", ["Reality Research"]),
	];
	//Clubber & Swordsman-y stuff
	[
		new Upgrade("Sword Clubs",                   "clubAndSwordUpgrade",  [[1.5e6, "money"]],  [["static", 25, "Swordsman"], ["static", 25, "Clubber"]],   [["dynamic", "Swordsman", 0.05, "building", "Clubber"], ["dynamic", "Clubber", 0.05, "building", "Swordsman"]],   "I don't actually know what these are, but they sound badass."),
		new Upgrade("Clubs Covered in Swords",       "clubAndSwordUpgrade2", [[3e8, "money"]],    [["static", 100, "Swordsman"], ["static", 100, "Clubber"]], [["dynamic", "Swordsman", 0.03, "building", "Clubber"], ["dynamic", "Clubber", 0.04, "building", "Swordsman"]],   "Genius."),
		new Upgrade("Rotating Chainsaw Sword Clubs", "clubAndSwordUpgrade3", [[3e12, "money"]],   [["static", 200, "Swordsman"], ["static", 200, "Clubber"]], [["dynamic", "Swordsman", 0.02, "building", "Clubber"], ["dynamic", "Clubber", 0.02, "building", "Swordsman"]],   "Don't even try to imagine what the hell these things are."),
		new Upgrade("The Perfect Combination",       "clubAndSwordUpgrade4", [[1.5e16, "money"]], [["static", 300, "Swordsman"], ["static", 300, "Clubber"]], [["dynamic", "Swordsman", 0.015, "building", "Clubber"], ["dynamic", "Clubber", 0.015, "building", "Swordsman"]], "50% club, 50% sword. Perfect."),
		new Upgrade("Bayonets",                      "clubAndSwordUpgrade5", [[3e20, "money"]],   [["static", 400, "Swordsman"], ["static", 400, "Clubber"]], [["dynamic", "Swordsman", 0.012, "building", "Clubber"], ["dynamic", "Clubber", 0.012, "building", "Swordsman"]], "Now our technology is up to par with the 17th century! [applause]"),
		new Upgrade("King Hyzem's Blades",           "clubAndSwordUpgrade6", [[6e24, "money"]],   [["static", 500, "Swordsman"], ["static", 500, "Clubber"]], [["dynamic", "Swordsman", 0.01, "building", "Clubber"], ["dynamic", "Clubber", 0.01, "building", "Swordsman"]],   "It is said that Hyzem's Blades are unrecognizable as any one melee weapon; they are all at once."),
		new Upgrade("The Arena of Sgapang",          "clubAndSwordUpgrade7", [[1.5e33, "money"]], [["static", 700, "Swordsman"], ["static", 700, "Clubber"]], [["dynamic", "Swordsman", 0.005, "building", "Clubber"], ["dynamic", "Clubber", 0.005, "building", "Swordsman"]], "Reaefsek did something to his castle arena to make it extremely effective in improving fighting skill. We'd rather not know what, to be honest. The place is creepy enough as it is."),
	];
	//Gunner-y stuff
	[
		new Upgrade("Laser Sights",                "gunnerUpgrade1",      [[8e4, "money"]],                                                        [["static", 1, "Gunner"]],   [["static", 1.5, "Gunner"]], "You wouldn't think you'd need these when your target is a brick wall, but the guys you hired are really bad at their job."),
		new Upgrade("Double Magazines",            "gunnerUpgrade2",      [[8e5, "money"]],                                                        [["static", 5, "Gunner"]],   [["static", 2, "Gunner"]],   "Less pesky reloading."),
		new Upgrade("Quadruple Magazines",         "gunnerUpgrade3",      [[8e6, "money"]],                                                        [["static", 25, "Gunner"]],  [["static", 2, "Gunner"]],   "A little unwieldy, but agility isn't exactly the first priority when your opponent is a brick wall."),
		new Upgrade("Infinite Magazines",          "gunnerUpgrade4",      [[8e7, "money"]],                                                        [["static", 50, "Gunner"]],  [["static", 2, "Gunner"]],   " As seen in the movies!"),
		new Upgrade("Snipers",                     "gunnerUpgrade5",      [[8e8, "money"]],                                                        [["static", 75, "Gunner"]],  [["static", 2, "Gunner"]],   "They prefer to be known as \"1337 NoScOp3 sn1p3rs\"."),
		new Upgrade("Machine Guns",                "gunnerUpgrade6",      [[8e9, "money"]],                                                        [["static", 100, "Gunner"]], [["static", 3, "Gunner"]],   "\"pistols r 4 overnabz\" ~1337 NoScOp3 sn1p3r #33"),
		new Upgrade("Plasma Rifles",               "gunnerUpgrade7",      [[4e11, "money"]],                                                       [["static", 150, "Gunner"]], [["static", 3, "Gunner"]],   "Thanks, sci-fi technology!"),
		new Upgrade("Laser Chainsaw Gatling Guns", "gunnerUpgrade8",      [[1.6e13, "money"]],                                                     [["static", 200, "Gunner"]], [["static", 4, "Gunner"]],   "We told R&D to be as ridiculous as they could with this, and boy did they deliver."),
		new Upgrade("Unstoppable Bullets",         "gunnerUpgrade9",      [[1.6e17, "money"]],                                                     [["static", 300, "Gunner"]], [["static", 5, "Gunner"]],   "This couldn't possibly have negative effects and is a great idea."),
		new Upgrade("Every Gun Combined Into One", "gunnerUpgrade10",     [[3.2e21, "money"]],                                                     [["static", 400, "Gunner"]], [["static", 5, "Gunner"]],   "\"gg\" ~1337 sn1p3r #52"),
		new Upgrade("Hyzem's Golden Rifle",        "gunnerUpgrade11",     [[6.4e25, "money"]],                                                     [["static", 500, "Gunner"]], [["static", 7, "Gunner"]],   "We profited from Hyzem and Reaefsek's war, because they made a ton of powerful magical artifacts during it."),
		new Upgrade("Reaefsek's Crimson Rifle",    "gunnerUpgrade12",     [[1.6e34, "money"]],                                                     [["static", 700, "Gunner"]], [["static", 5, "Gunner"]],   "King Hyzem is credited as the first ever to claim \"copyscum\"."),
		new Upgrade("Magic Bullets",               "gunnerUpgradeMagic",  [[4e10, "money"], [1, "bricks"]],                                        [["static", 125, "Gunner"]], [["static", 3, "Gunner"]],   "They're magic so they do more damage.", ["Magic Mining"]),
		new Upgrade("Pure Magic Bullets",          "gunnerUpgradeMagic2", [[8e14, "money"], [8e4, "bricks"]],                                      [["static", 250, "Gunner"]], [["static", 4, "Gunner"]],   "The wizards told us you can actually make things out of pure magic, so we capitalized on that immediately."),
		new Upgrade("The Best Gun",                "gunnerUpgradeMagic3", [[4e19, "money"], [4e8, "bricks"]],                                      [["static", 350, "Gunner"]], [["static", 5, "Gunner"]],   "As employed by 12 year olds everywhere."),
		new Upgrade("Black Bullets",               "gunnerUpgradeBlack",  [[1e30, "money"], [1e17, "bricks"]],                                     [["static", 600, "Gunner"]], [["static", 6, "Gunner"]],   "\"I support this because then I will be able to tell people that we're destroying the walls with BB guns and actually be telling the truth.\" ~Agent Johnson"),
		new Upgrade("Consciousness Segmentation",  "gunnerUpgradeArmy",   [[1.6e38, "money"], [1.6e27, "bricks"], [1.6e23, "fourth wall bricks"]], [["static", 800, "Gunner"]], [["static", 4, "Gunner"]],   "One of the scripts written in the Divine Instructions. Allows the 1337 sn1p3rs to play first person shooters while destroying the wall, thus making their dream a reality."),
		new Upgrade("Crossover Guns",              "gunner4thWallUpgrade",[[8.88e16, "money"], [1e4, "fourth wall bricks"]],                       [],                          [["static", 4, "Gunner"]],   "Let's just reach over into other fictional universes and grab ourselves some good guns.", ["Reality Research"]),
	];
	//Grenade-y stuff
	[
		new Upgrade("Greased Pins",               "grenadeUpgrade1",      [[2e6, "money"]],                                                  [["static", 1, "Grenade Thrower"]],   [["static", 1.5, "Grenade Thrower"]], "We received complaints... These guys aren't very good."),
		new Upgrade("Bigger Crates",              "grenadeUpgrade2",      [[2e7, "money"]],                                                  [["static", 5, "Grenade Thrower"]],   [["static", 2, "Grenade Thrower"]],   "Less running to the store."),
		new Upgrade("Big Grenades",               "grenadeUpgrade3",      [[2e8, "money"]],                                                  [["static", 25, "Grenade Thrower"]],  [["static", 2, "Grenade Thrower"]],   "I'm not sure why we were using the small ones."),
		new Upgrade("Flame Grenades",             "grenadeUpgrade4",      [[2e9, "money"]],                                                  [["static", 50, "Grenade Thrower"]],  [["static", 2, "Grenade Thrower"]],   "Not to be confused with incendiaries, these are literally grenades lit on fire. Never doubt the effectiveness of lighting things on fire."),
		new Upgrade("Extra Shrapnel",             "grenadeUpgrade5",      [[2e10, "money"]],                                                 [["static", 75, "Grenade Thrower"]],  [["static", 2, "Grenade Thrower"]],   "\"get shrapped\" ~1337 sn1p3r #73"),
		new Upgrade("Nuclear Grenades",           "grenadeUpgrade6",      [[4e11, "money"]],                                                 [["static", 100, "Grenade Thrower"]], [["static", 3, "Grenade Thrower"]],   "Radiation poisoning? Naaaaah..."),
		new Upgrade("Plasma Grenades",            "grenadeUpgrade7",      [[2e13, "money"]],                                                 [["static", 150, "Grenade Thrower"]], [["static", 3, "Grenade Thrower"]],   "I don't actually know what these do, but they sound cool."),
		new Upgrade("Unobtanium Shrapnel",        "grenadeUpgrade8",      [[4e14, "money"]],                                                 [["static", 200, "Grenade Thrower"]], [["static", 4, "Grenade Thrower"]],   "Just happens to be the perfect material to cut through the wall, but it was really hard to get."),
		new Upgrade("Time-Splitting Grenades",    "grenadeUpgrade9",      [[8e18, "money"]],                                                 [["static", 300, "Grenade Thrower"]], [["static", 5, "Grenade Thrower"]],   "They split through time to destroy the wall's past, present, and future!"),
		new Upgrade("Buckets of Grenades",        "grenadeUpgrade10",     [[8e22, "money"]],                                                 [["static", 400, "Grenade Thrower"]], [["static", 5, "Grenade Thrower"]],   "\"dude just lob the whole bucket\" ~1337 sn1p3r #73, before being promoted"),
		new Upgrade("Holy Hand Grenades",         "grenadeUpgrade11",     [[2e27, "money"]],                                                 [["static", 500, "Grenade Thrower"]], [["static", 7, "Grenade Thrower"]],   "They're actually Hyzem's Bombs of Purgation, but the Grenademan Project Leader insisted we call them this. He's the one who insisted we call them 'grenademen' instead of grenadiers."),
		new Upgrade("Hellfire Bombs",             "grenadeUpgrade12",     [[4e35, "money"]],                                                 [["static", 700, "Grenade Thrower"]], [["static", 5, "Grenade Thrower"]],   "\"What a boring upgrade.\" ~Agent Johnson<br>\"I don't believe interesting names are the priority when upgrading things.\" ~Agent Lawrence<br>\"That's factually incorrect.\" ~Agent Johnson"),
		new Upgrade("Magical Lightning Grenades", "grenadeUpgradeMagic",  [[2e12, "money"], [1, "bricks"]],                                  [["static", 125, "Grenade Thrower"]], [["static", 3, "Grenade Thrower"]],   "These are pretty self-explanatory.", ["Magic Mining"]),
		new Upgrade("Portal Grenades",            "grenadeUpgradeMagic2", [[4e16, "money"], [4e6, "bricks"]],                                [["static", 250, "Grenade Thrower"]], [["static", 4, "Grenade Thrower"]],   "Instead of exploding, these transport what they hit into a magical pool of certain destruction."),
		new Upgrade("Oblivion Grenades",          "grenadeUpgradeMagic3", [[4e20, "money"], [4e9, "bricks"]],                                [["static", 350, "Grenade Thrower"]], [["static", 5, "Grenade Thrower"]],   "These skip the portal and just obliterate anything they hit."),
		new Upgrade("Black-Infused Grenades",     "grenadeUpgradeBlack",  [[3e31, "money"], [3e18, "bricks"]],                               [["static", 600, "Grenade Thrower"]], [["static", 6, "Grenade Thrower"]],   "\"I support this because its acronym is 'BIG'.\" ~Agent Johnson"),
		new Upgrade("Grenades",                   "grenadeUpgradeArmy",   [[4e39, "money"], [4e28, "bricks"], [4e24, "fourth wall bricks"]], [["static", 800, "Grenade Thrower"]], [["static", 4, "Grenade Thrower"]],   "\"We've hit critical.\" ~Head of R&D"),
		new Upgrade("Enlarged Explosions",        "grenade4thWallUpgrade",[[2e17, "money"], [5e4, "fourth wall bricks"]],                    [],                                   [["static", 4, "Grenade Thrower"]],   "Now that we can alter reality, we don't need reasons for things. Explosions are just really big now.", ["Reality Research"]),
	];
	//Gunner & Grenade-y stuff
	[
		new Upgrade("Gun That Shoots Grenades",                      "gunAndGrenadeUpgrade",  [[4e7, "money"]],  [["static", 25, "Grenade Thrower"], ["static", 25, "Gunner"]],   [["dynamic", "Grenade Thrower", 0.04, "building", "Gunner"], ["dynamic", "Gunner", 0.05, "building", "Grenade Thrower"]],   "Not to be confused with a grenade launcher."),
		new Upgrade("Grenade That Shoots",                           "gunAndGrenadeUpgrade2", [[8e10, "money"]], [["static", 100, "Grenade Thrower"], ["static", 100, "Gunner"]], [["dynamic", "Grenade Thrower", 0.01, "building", "Gunner"], ["dynamic", "Gunner", 0.02, "building", "Grenade Thrower"]],   "It shoots little grenades."),
		new Upgrade("Giant Gun Grenades",                            "gunAndGrenadeUpgrade3", [[8e14, "money"]], [["static", 200, "Grenade Thrower"], ["static", 200, "Gunner"]], [["dynamic", "Grenade Thrower", 0.01, "building", "Gunner"], ["dynamic", "Gunner", 0.015, "building", "Grenade Thrower"]],  "Whatever you're thinking these are, they're more ridiculous than that."),
		new Upgrade("Grenade Guns",                                  "gunAndGrenadeUpgrade4", [[8e18, "money"]], [["static", 300, "Grenade Thrower"], ["static", 300, "Gunner"]], [["dynamic", "Grenade Thrower", 0.008, "building", "Gunner"], ["dynamic", "Gunner", 0.01, "building", "Grenade Thrower"]],  "It's hard to describe what exactly these are, but they're perfect."),
		new Upgrade("Hyperbeam Laser Plasma Photon Fusion Gunnades", "gunAndGrenadeUpgrade5", [[8e22, "money"]], [["static", 400, "Grenade Thrower"], ["static", 400, "Gunner"]], [["dynamic", "Grenade Thrower", 0.008, "building", "Gunner"], ["dynamic", "Gunner", 0.008, "building", "Grenade Thrower"]], "\"We just threw a bunch of space-age crap together and whaddya know, it works!\" ~Chief of R&D, RUC"),
		new Upgrade("The Turrets of Bextic",                         "gunAndGrenadeUpgrade6", [[1e27, "money"]], [["static", 500, "Grenade Thrower"], ["static", 500, "Gunner"]], [["dynamic", "Grenade Thrower", 0.007, "building", "Gunner"], ["dynamic", "Gunner", 0.007, "building", "Grenade Thrower"]], "Hyzem's castle defenses were the stuff of legends: giant bombs, guns that shoot bombs, giant guns, bombs that explode into guns... And they're all extremely powerful with Old World magic!"),
		new Upgrade("Inspirational War Films",                       "gunAndGrenadeUpgrade7", [[3e35, "money"]], [["static", 700, "Grenade Thrower"], ["static", 700, "Gunner"]], [["dynamic", "Grenade Thrower", 0.004, "building", "Gunner"], ["dynamic", "Gunner", 0.004, "building", "Grenade Thrower"]], "\"I'm impressed by their ability to even find movies this absolutely terrible.\" ~Agent Connor<br>\"Quality is different from <b>inspirational-ness</b>.\" ~Gunner Project Leader"),
	];
	//Wrecking Ball-y stuff
	[
		new Upgrade("Bigger Balls",              "wreckingBallUpgrade1",       [[4e7, "money"]],                                   [["static", 1, "Wrecking Ball"]],   [["static", 1.5, "Wrecking Ball"]], "(sigh) Yeah. Look, damage is a function of how much you can throw at the wall. Spheres are the best shape for swinging. This is scientifically optimal. I wasn't in charge of names."),
		new Upgrade("Balls of Steel",            "wreckingBallUpgrade2",       [[4e8, "money"]],                                   [["static", 5, "Wrecking Ball"]],   [["static", 2, "Wrecking Ball"]],   "I'm not sure what the previous ones were made out of."),
		new Upgrade("Reinforced Balls",          "wreckingBallUpgrade3",       [[4e9, "money"]],                                   [["static", 25, "Wrecking Ball"]],  [["static", 2, "Wrecking Ball"]],   "They're actually just titanium balls, but the \"Titanium _______\" upgrades were getting boring."),
		new Upgrade("Flaming Balls",             "wreckingBallUpgrade4",       [[4e10, "money"]],                                  [["static", 50, "Wrecking Ball"]],  [["static", 2, "Wrecking Ball"]],   "Yes, this totally works against a brick wall."),
		new Upgrade("Spiked Balls",              "wreckingBallUpgrade5",       [[4e11, "money"]],                                  [["static", 75, "Wrecking Ball"]],  [["static", 2, "Wrecking Ball"]],   "Badass and more effective."),
		new Upgrade("Diamond Balls",             "wreckingBallUpgrade6",       [[4e12, "money"]],                                  [["static", 100, "Wrecking Ball"]], [["static", 3, "Wrecking Ball"]],   "The strongest balls the world has to offer."),
		new Upgrade("Tri-Balls",                 "wreckingBallUpgrade7",       [[4e14, "money"]],                                  [["static", 150, "Wrecking Ball"]], [["static", 3, "Wrecking Ball"]],   "Three is better than one!"),
		new Upgrade("Neutron Balls",             "wreckingBallUpgrade8",       [[8e15, "money"]],                                  [["static", 200, "Wrecking Ball"]], [["static", 4, "Wrecking Ball"]],   "As dense as a neutron star and about the same potential of turning into a black hole."),
		new Upgrade("Singularity Balls",         "wreckingBallUpgrade9",       [[8e19, "money"]],                                  [["static", 300, "Wrecking Ball"]], [["static", 5, "Wrecking Ball"]],   "They are all. They are one. They exist at all times at once."),
		new Upgrade("Agent Johnson is an Idiot", "wreckingBallUpgrade10",      [[1.6e24, "money"]],                                [["static", 400, "Wrecking Ball"]], [["static", 5, "Wrecking Ball"]],   "[REDACTED]<br>CHIEF OF R&D EDIT: Agent Johnson is no longer allowed near the demons."),
		new Upgrade("The Sgapang Ball",          "wreckingBallUpgrade11",      [[3.2e28, "money"]],                                [["static", 500, "Wrecking Ball"]], [["static", 7, "Wrecking Ball"]],   "A large white ball made of an unknown substance found in the center of Sgapang, Lord Reaefsek's castle. Judging by its strange properties, it is unlikely Reaefsek or Hyzem created it. Especially since white is not at all Reaefsek's color."),
		new Upgrade("Reaefsek's Crystal Ball",   "wreckingBallUpgrade12",      [[8e36, "money"]],                                  [["static", 700, "Wrecking Ball"]], [["static", 5, "Wrecking Ball"]],   "\"Couldn't we use this thing's crazy magic power to like, do something, instead of just smashing it into the wall?\" ~Agent Carter<br>\"Hah, good one.\" ~Wrecking Ball Project Leader"),
		new Upgrade("Magic Exploding Balls",     "wreckingBallUpgradeMagic",   [[2e13, "money"], [5, "bricks"]],                   [["static", 125, "Wrecking Ball"]], [["static", 3, "Wrecking Ball"]],   "Yeah, magic can pretty much do anything. Endless explosions!", ["Magic Mining"]),
		new Upgrade("Antimatter Balls",          "wreckingBallUpgradeMagic2",  [[8e17, "money"], [8e7, "bricks"]],                 [["static", 250, "Wrecking Ball"]], [["static", 4, "Wrecking Ball"]],   "The wizards can create antimatter with their magic. It's pretty damn cool."),
		new Upgrade("Hellfire Balls",            "wreckingBallUpgradeMagic3",  [[8e21, "money"], [8e10, "bricks"]],                [["static", 350, "Wrecking Ball"]], [["static", 5, "Wrecking Ball"]],   "The fire of the underworld is hotter than anything else, so we got the wizards to make magic balls out of it."),
		new Upgrade("Black-Absorbed Balls",      "wreckingBallUpgradeBlack",   [[5e32, "money"], [5e19, "bricks"]],                [["static", 600, "Wrecking Ball"]], [["static", 6, "Wrecking Ball"]],   "\"I support this because Agent Johnson doesn't.\" ~Agent Connor"),
		new Upgrade("Planets",                   "wreckingBall4thWallUpgrade", [[4.4e17, "money"], [2.5e5, "fourth wall bricks"]], [],                                 [["static", 4, "Wrecking Ball"]],   "Ah, the things we can do when there's none of that \"realism\" nonsense!", ["Reality Research"]),
	];
	//Bulldozer-y stuff
	[
		new Upgrade("Stronger Blades",           "bulldozerUpgrade1",       [[6e8, "money"]],                                   [["static", 1, "Bulldozer"]],   [["static", 1.5, "Bulldozer"]], "Probably made of titanium."),
		new Upgrade("Power Treads",              "bulldozerUpgrade2",       [[6e9, "money"]],                                   [["static", 5, "Bulldozer"]],   [["static", 2, "Bulldozer"]],   "Power Treads(TM), By the Realistic Upgrades Corporation(RUC)."),
		new Upgrade("Double Blades",             "bulldozerUpgrade3",       [[6e10, "money"]],                                  [["static", 25, "Bulldozer"]],  [["static", 2, "Bulldozer"]],   "Two is better than one, right?"),
		new Upgrade("Powerful Engines",          "bulldozerUpgrade4",       [[3e11, "money"]],                                  [["static", 50, "Bulldozer"]],  [["static", 2, "Bulldozer"]],   "With the intention of leaving a funny bulldozer-shaped hole in the wall, of course."),
		new Upgrade("Blades With Blades",        "bulldozerUpgrade5",       [[3e12, "money"]],                                  [["static", 75, "Bulldozer"]],  [["static", 2, "Bulldozer"]],   "Smaller blades on the blade. More blades, more damage."),
		new Upgrade("Diamond Blades",            "bulldozerUpgrade6",       [[3e13, "money"]],                                  [["static", 100, "Bulldozer"]], [["static", 3, "Bulldozer"]],   "\"Why yes, we are one of the world's richest corporations. Why do you ask?\" ~RUC Head of Finance"),
		new Upgrade("Adamantium Blades",         "bulldozerUpgrade7",       [[3e15, "money"]],                                  [["static", 150, "Bulldozer"]], [["static", 3, "Bulldozer"]],   "Cuts through diamond!(more effectively than this wall)"),
		new Upgrade("The Megadozer",             "bulldozerUpgrade8",       [[3e17, "money"]],                                  [["static", 200, "Bulldozer"]], [["static", 4, "Bulldozer"]],   "It's really, really big."),
		new Upgrade("Gravity-Altering Engines",  "bulldozerUpgrade9",       [[2.4e21, "money"]],                                [["static", 300, "Bulldozer"]], [["static", 5, "Bulldozer"]],   "These assign all the nearby gravity to the bulldozers. And sideways so they hit the wall."),
		new Upgrade("Explosive Blades",          "bulldozerUpgrade10",      [[2.4e25, "money"]],                                [["static", 400, "Bulldozer"]], [["static", 5, "Bulldozer"]],   "\"No, it's not just bombs tied to the blades. That was an early prototype.\" ~Bulldozer Project Leader, RUC"),
		new Upgrade("Hyzem's Tablet",            "bulldozerUpgrade11",      [[6e29, "money"]],                                  [["static", 500, "Bulldozer"]], [["static", 7, "Bulldozer"]],   "Probably King Hyzem's strangest creation, the indestructible tablet that destroys everything it touches except one type of fabric. It says \"CLEANSE\". Let's tie it to a bulldozer blade."),
		new Upgrade("Robotic Bulldozers",        "bulldozerUpgrade12",      [[1.2e38, "money"]],                                [["static", 700, "Bulldozer"]], [["static", 5, "Bulldozer"]],   "\"DESTROY WALL. DESTROY WALL.\" ~Bulldozer #21<br>\"As you can see, we've created the perfect worker.\" ~Head of R&D<br>\"...Can you turn off the constant robot voice announcements?\" ~Agent Carter<br>\"Nope.\""),
		new Upgrade("Phasing Engines",           "bulldozerUpgradeMagic",   [[3e14, "money"], [300, "bricks"]],                 [["static", 125, "Bulldozer"]], [["static", 3, "Bulldozer"]],   "Magically-enhanced engines that allow the dozers to teleport.", ["Magic Mining"]),
		new Upgrade("Antimatter Blades",         "bulldozerUpgradeMagic2",  [[12e18, "money"], [3e8, "bricks"]],                [["static", 250, "Bulldozer"]], [["static", 4, "Bulldozer"]],   "Antimatter is the new titanium."),
		new Upgrade("The Unstoppable Force",     "bulldozerUpgradeMagic3",  [[12e22, "money"], [12e10, "bricks"]],              [["static", 350, "Bulldozer"]], [["static", 5, "Bulldozer"]],   "This wall better not be the immovable barrier."),
		new Upgrade("Black-Enhanced Blades",     "bulldozerUpgradeBlack",   [[7.2e33, "money"], [7.2e20, "bricks"]],            [["static", 600, "Bulldozer"]], [["static", 6, "Bulldozer"]],   "\"How long until we run out of verbs?\" ~Agent Carter<br>\"Our best agents are browsing the thesaurus as we speak.\" ~Agent Connor"),
		new Upgrade("Indestructible Bulldozers", "bulldozer4thWallUpgrade", [[1.2e18, "money"], [1e6, "fourth wall bricks"]],   [],                             [["static", 4, "Bulldozer"]],   "No more scratches!", ["Reality Research"]),
	];
	//Airstrike-y stuff
	[
		new Upgrade("Faster Communications",   "airstrikeUpgrade1",       [[3e10, "money"]],                              [["static", 1, "Airstrike Caller"]],   [["static", 1.5, "Airstrike Caller"]], "Upgrading from dial-up."),
		new Upgrade("Pianos",                  "airstrikeUpgrade2",       [[3e11, "money"]],                              [["static", 5, "Airstrike Caller"]],   [["static", 2, "Airstrike Caller"]],   "What, did you think we were dropping missiles?"),
		new Upgrade("Anvils",                  "airstrikeUpgrade3",       [[3e12, "money"]],                              [["static", 25, "Airstrike Caller"]],  [["static", 2, "Airstrike Caller"]],   "Ah, a classic."),
		new Upgrade("Supersonic Jets",         "airstrikeUpgrade4",       [[1.5e13, "money"]],                            [["static", 50, "Airstrike Caller"]],  [["static", 2, "Airstrike Caller"]],   "3-5 business days no more!"),
		new Upgrade("20-Foot Statues",         "airstrikeUpgrade5",       [[6e13, "money"]],                              [["static", 75, "Airstrike Caller"]],  [["static", 2, "Airstrike Caller"]],   "Statues of the CEO of the RUC of course."),
		new Upgrade("Anvil-Shaped Bombs",      "airstrikeUpgrade6",       [[6e14, "money"]],                              [["static", 100, "Airstrike Caller"]], [["static", 3, "Airstrike Caller"]],   "A lot more effective than anvils, and clearly better than using actual missiles."),
		new Upgrade("Missiles",                "airstrikeUpgrade7",       [[6e16, "money"]],                              [["static", 150, "Airstrike Caller"]], [["static", 3, "Airstrike Caller"]],   "Yeah, we gave in eventually."),
		new Upgrade("Nukes",                   "airstrikeUpgrade8",       [[6e18, "money"]],                              [["static", 200, "Airstrike Caller"]], [["static", 4, "Airstrike Caller"]],   "A little overkill for a brick wall, you think? Well, you haven't seen this wall."),
		new Upgrade("Astral Magnets",          "airstrikeUpgrade9",       [[6e22, "money"]],                              [["static", 300, "Airstrike Caller"]], [["static", 5, "Airstrike Caller"]],   "We drop these and they pull down a bunch of asteroids with them. Also satellites, uh, that was unintentional."),
		new Upgrade("Bigger Everything",       "airstrikeUpgrade10",      [[1.5e27, "money"]],                            [["static", 400, "Airstrike Caller"]], [["static", 5, "Airstrike Caller"]],   "\"Bigger = More Damage\" ~The entire BE proposal"),
		new Upgrade("The Walls of Bixtec",     "airstrikeUpgrade11",      [[1.5e31, "money"]],                            [["static", 500, "Airstrike Caller"]], [["static", 7, "Airstrike Caller"]],   "Bixtec Castle was made to be impenetrable, so its walls are almost indestructible, very heavy, and magicked up to reflect any damage dealt to them back to their attacker. We knew immediately what to do."),
		new Upgrade("The Boxes of Relocation", "airstrikeUpgrade12",      [[3e39, "money"]],                              [["static", 700, "Airstrike Caller"]], [["static", 5, "Airstrike Caller"]],   "Two boxes Lord Reaefsek made that relocate everything put into the \"in\" box to the \"out\" box. So obviously we should tie the out box upside-down to our space station so we can reduce our plane usage."),
		new Upgrade("Density Spells",          "airstrikeUpgradeMagic",   [[3e15, "money"], [2.5e3, "bricks"]],           [["static", 125, "Airstrike Caller"]], [["static", 3, "Airstrike Caller"]],   "How useful!", ["Magic Mining"]),
		new Upgrade("Dimensional Portals",     "airstrikeUpgradeMagic2",  [[6e20, "money"], [6e9, "bricks"]],             [["static", 250, "Airstrike Caller"]], [["static", 4, "Airstrike Caller"]],   "Now we can empty the contents of other dimensions onto the wall!"),
		new Upgrade("???",                     "airstrikeUpgradeMagic3",  [[6e24, "money"], [6e12, "bricks"]],            [["static", 350, "Airstrike Caller"]], [["static", 5, "Airstrike Caller"]],   "We have no idea what this stuff is, but it does the trick. Thanks, dark wizards!"),
		new Upgrade("Black-Merged Anvils",     "airstrikeUpgradeBlack",   [[3e35, "money"], [3e22, "bricks"]],            [["static", 600, "Airstrike Caller"]], [["static", 6, "Airstrike Caller"]],   "\"Is it time to buff the anvils? The answer is yes, always, forever.\" ~Agent Connor, in the BMA proposal<br>\"Finally, we agree.\" ~Agent Johnson"),
		new Upgrade("Planets",                 "airstrike4thWallUpgrade", [[5e18, "money"], [1e7, "fourth wall bricks"]], [],                                    [["static", 4, "Airstrike Caller"]],   "Yeah, we already used this, but it works here too.", ["Reality Research"]),
	];
	//Necromancer-y stuff
	[
		new Upgrade("Polished Bricks",                  "necromancerUpgrade1",       [[3e11, "money"], [2, "bricks"]],    [["static", 1, "Necromancer"]],   [["static", 1.5, "Necromancer"]], "Gives them more of an incentive."),
		new Upgrade("Giant Hats",                       "necromancerUpgrade2",       [[3e12, "money"], [4, "bricks"]],    [["static", 5, "Necromancer"]],   [["static", 2, "Necromancer"]],   "If there's one thing the wizards value other than bricks, it's big hats."),
		new Upgrade("Ancient Scrolls",                  "necromancerUpgrade3",       [[3e13, "money"], [33, "bricks"]],   [["static", 25, "Necromancer"]],  [["static", 2, "Necromancer"]],   "We find these while mining, so we might as well finally put them to use."),
		new Upgrade("Thrones",                          "necromancerUpgrade4",       [[3e14, "money"], [333, "bricks"]],  [["static", 50, "Necromancer"]],  [["static", 2, "Necromancer"]],   "They're demanding these. Necromancers are assholes."),
		new Upgrade("Zombie Preservatives",             "necromancerUpgrade5",       [[3e15, "money"], [3e3, "bricks"]],  [["static", 75, "Necromancer"]],  [["static", 2, "Necromancer"]],   "Keeps them from rotting too fast."),
		new Upgrade("Better Graveyards",                "necromancerUpgrade6",       [[3e16, "money"], [3e5, "bricks"]],  [["static", 100, "Necromancer"]], [["static", 3, "Necromancer"]],   "They were using some pretty low-class wizard graveyards before."),
		new Upgrade("Higher-Classed Necromancers",      "necromancerUpgrade7",       [[3e18, "money"], [3e7, "bricks"]],  [["static", 150, "Necromancer"]], [["static", 3, "Necromancer"]],   "The guys we hired before turned out to be scrubs."),
		new Upgrade("Teleportation Spells",             "necromancerUpgrade8",       [[6e19, "money"], [6e8, "bricks"]],  [["static", 200, "Necromancer"]], [["static", 4, "Necromancer"]],   "So they can clean out the world's graveyards faster."),
		new Upgrade("Duplication Spells",               "necromancerUpgrade9",       [[3e24, "money"], [3e13, "bricks"]], [["static", 300, "Necromancer"]], [["static", 5, "Necromancer"]],   "To multiply the zombification spells for cheap."),
		new Upgrade("Ancient Tombs",                    "necromancerUpgrade10",      [[3e28, "money"], [3e17, "bricks"]], [["static", 400, "Necromancer"]], [["static", 5, "Necromancer"]],   "\"All ancient tombs have tons of useful magical stuff and only the highest quality corpses. We've never really thought why; it's just a fact.\" ~A necromancer"),
		new Upgrade("First Wizard Scrolls",             "necromancerUpgrade11",      [[3e32, "money"], [3e17, "bricks"]], [["static", 500, "Necromancer"]], [["static", 7, "Necromancer"]],   "A few centuries ago, some demons snuck into the Great Wizard Library, took all the First Wizards' scrolls, and sent the wizards on the greatest treasure hunt ever constructed to get them back. The scrolls were never found. We're just going to cheat and use the compromisers to hunt them down.<br> <br>\"I propose we send everyone we have out on the hunt instead of cheating.\" ~Agent Johnson<br>\"No.\" ~Everyone"),
		new Upgrade("Demon Healing Magic",              "necromancerUpgradeHell",    [[3e17, "money"], [3e6, "bricks"]],  [["static", 125, "Necromancer"]], [["static", 3, "Necromancer"]],   "Demon healing magic is so strong it can bring them back from the dead. It's part of the reason they're such assholes, because they know they can never really be killed."),
		new Upgrade("The Devil's Fingernail Clippings", "necromancerUpgradeHell2",   [[6e22, "money"], [6e10, "bricks"]], [["static", 250, "Necromancer"]], [["static", 4, "Necromancer"]],   "So powerful with hell magic they can bring people back to life easily. And Satan's janitor is willing to sell some to us!"),
		new Upgrade("The Cursed Boneyards of Hell",     "necromancerUpgradeHell3",   [[3e26, "money"], [3e15, "bricks"]], [["static", 350, "Necromancer"]], [["static", 5, "Necromancer"]],   "The Boneyards hold the corpses of many famous wizards, and even deceased demons. The Devil has stated he doesn't really care about them, giving us the perfect entrance. He'll still make us pay a shitload for them, because after all he is a businessman."),
		new Upgrade("Black-Melded Zombies",             "necromancerUpgradeBlack",   [[5e36, "money"], [5e25, "bricks"]], [["static", 600, "Necromancer"]], [["static", 6, "Necromancer"]],   "It sounds cool, but really they only last a couple minutes before The Black is done with the bones. Black-melded zombies: actually kind of lame."),
	];
	//Titan-y stuff
	[
		new Upgrade("Wizard Translators",                   "giantUpgrade1",       [[4.4444e12, "money"]],                        [["static", 1, "Titan"]],   [["static", 1.5, "Titan"]], "The titans only speak the language of the Old World, so we gotta get the wizards to translate that."),
		new Upgrade("Strength Restoration Spells",          "giantUpgrade2",       [[4.4444e13, "money"]],                        [["static", 5, "Titan"]],   [["static", 2, "Titan"]],   "Turns out being dead for thousands of years can do things to your strength."),
		new Upgrade("The Lexicon of Knowledge",             "giantUpgrade3",       [[4.4444e14, "money"]],                        [["static", 25, "Titan"]],  [["static", 2, "Titan"]],   "It tells us that the actually strong titans were buried over there."),
		new Upgrade("Giant Brass Knuckles",                 "giantUpgrade4",       [[4.4444e15, "money"]],                        [["static", 50, "Titan"]],  [["static", 2, "Titan"]],   "We finally found a way to improve the titans themselves!"),
		new Upgrade("Giant Swords",                         "giantUpgrade5",       [[2.2222e16, "money"]],                        [["static", 75, "Titan"]],  [["static", 2, "Titan"]],   "Even bigger than the anime swords!"),
		new Upgrade("Giant Lightsabers",                    "giantUpgrade6",       [[2.2222e17, "money"]],                        [["static", 100, "Titan"]], [["static", 3, "Titan"]],   "These cost a lot to make, but totally worth."),
		new Upgrade("Enlarged Cataract",                    "giantUpgrade7",       [[8.8888e19, "money"]],                        [["static", 150, "Titan"]], [["static", 3, "Titan"]],   "These guys are really big, so they need a really big crack to get through faster."),
		new Upgrade("The Strongest Titans",                 "giantUpgrade8",       [[8.8888e20, "money"]],                        [["static", 200, "Titan"]], [["static", 4, "Titan"]],   "We found them, finally!"),
		new Upgrade("The Titan King",                       "giantUpgrade9",       [[2.2222e25, "money"]],                        [["static", 300, "Titan"]], [["static", 5, "Titan"]],   "He lives again, so he can destroy these brick walls for us."),
		new Upgrade("Vwynido's Guide to Hand Combat",       "giantUpgrade10",      [[4.4444e29, "money"]],                        [["static", 400, "Titan"]], [["static", 5, "Titan"]],   "One of the greatest lost books of all time, and we found it! (It was on an online trading site)"),
		new Upgrade("All The Titan King Scrolls of Wisdom", "giantUpgrade11",      [[8.8888e33, "money"]],                        [["static", 500, "Titan"]], [["static", 7, "Titan"]],   "\"What took so long?\" ~Head of Titan Relations<br>\"None of us wanted to attempt to get all the ones that the demons had. We temporarily lifted Agent Johnson's ban from the demons and he managed to get them to fork 'em over for only a few sacrifices.\" ~Agent Connor<br>\"On what grounds?\"<br>\"He didn't... Oh god damn it.\""),
		new Upgrade("Hellfire Weapons",                     "giantUpgradeHell",    [[2.2222e18, "money"], [2.2222e7, "bricks"]],  [["static", 125, "Titan"]], [["static", 3, "Titan"]],   "Of course they're not made out of fire, they're just evilium forged in hellfire."),
		new Upgrade("Access to The Library of Hell",        "giantUpgradeHell2",   [[8.8888e22, "money"], [8.8888e9, "bricks"]],  [["static", 250, "Titan"]], [["static", 4, "Titan"]],   "The library of hell has scrolls from the Old World, knowledge that will allow the titans to regain their old strength."),
		new Upgrade("Baths in The Pits of Ahnsquall",       "giantUpgradeHell3",   [[2.2222e27, "money"], [2.2222e14, "bricks"]], [["static", 350, "Titan"]], [["static", 5, "Titan"]],   "These pits full of red liquid are legendary, for they are what give demons their superhuman strength: they are the demon birthplace. Only beings full of magic can survive being submerged, and the results are extreme."),
		new Upgrade("Black-Encrusted Knuckles",             "giantUpgradeBlack",   [[6.6666e37, "money"], [6.6666e25, "bricks"]], [["static", 600, "Titan"]], [["static", 6, "Titan"]],   "\"This kills more titans than walls.\" ~Agent Lawrence<br>\"What are we gonna do, not have a Black titan upgrade?\" ~Head of R&D"),
	];
	//Demon-y stuff
	[
		new Upgrade("Leather Jackets",                     "demonUpgrade1",       [[3e3, "bricks"]],                             [["static", 1, "Demon"]],   [["static", 1.5, "Demon"]], "The only things we can do to make demons do more damage involve making them want to."),
		new Upgrade("Motorcycles",                         "demonUpgrade2",       [[3e4, "bricks"]],                             [["static", 5, "Demon"]],   [["static", 2, "Demon"]],   "Totally tricked out and really loud, of course."),
		new Upgrade("Ritual Sacrifices",                   "demonUpgrade3",       [[1e5, "bricks"]],                             [["static", 25, "Demon"]],  [["static", 2, "Demon"]],   "The cult that was doing these before stopped, so we have to take over."),
		new Upgrade("Torture Reels",                       "demonUpgrade4",       [[6.6666e5, "bricks"]],                        [["static", 50, "Demon"]],  [["static", 2, "Demon"]],   "Keeping them entertained."),
		new Upgrade("Loads of Weapons",                    "demonUpgrade5",       [[3e6, "bricks"]],                             [["static", 75, "Demon"]],  [["static", 2, "Demon"]],   "They don't have guns down there, so they want some to take back."),
		new Upgrade("Worshippers",                         "demonUpgrade6",       [[3e7, "bricks"]],                             [["static", 100, "Demon"]], [["static", 3, "Demon"]],   "Man, demons are much bigger assholes than necromancers."),
		new Upgrade("Universal Passes",                    "demonUpgrade7",       [[6.6666e9, "bricks"]],                        [["static", 150, "Demon"]], [["static", 3, "Demon"]],   "Okay so some people are worried about the amount of power the demons have at this point... But remember, we're finally gonna take down this wall!"),
		new Upgrade("Nuclear Launch Codes",                "demonUpgrade8",       [[6.6666e11, "bricks"]],                       [["static", 200, "Demon"]], [["static", 4, "Demon"]],   "I'm sure they have a totally legit reason for wanting these."),
		new Upgrade("Not-Destroying-The-World Tax",        "demonUpgrade9",       [[1e16, "bricks"]],                            [["static", 300, "Demon"]], [["static", 5, "Demon"]],   "\"Okay, maybe giving them all of those things was not a good idea.\" ~CEO, RUC"),
		new Upgrade("Lord Reaefsek's Journal",             "demonUpgrade10",      [[6.6666e19, "bricks"]],                       [["static", 400, "Demon"]], [["static", 5, "Demon"]],   "Titled \"Lord Reaefsek: God of The Unfinished\", this journal is full of evil doings and tips & tricks. And, of course, it suddenly cuts off a few dozen pages from the end."),
		new Upgrade("Hyzem's Artifact Vault",              "demonUpgrade11",      [[3e24, "bricks"]],                            [["static", 500, "Demon"]], [["static", 7, "Demon"]],   "\"Oh please tell me you removed The Amsora first.\" ~Agent Taylor<br>\"Yes... So we can give it to them as a seperate upgrade.\" ~Agent Connor<br>\"NOOOOOOOO.\" ~Head of Demon Relations"),
		new Upgrade("Illusion Spells",                     "demonMagicUpgrade",   [[6.6666e8, "bricks"], [6.6666e19, "money"]],  [["static", 125, "Demon"]], [["static", 3, "Demon"]],   "They told us they'd use these strictly for trolling.<br>EDIT: WHY THE HELL DID WE GIVE THEM THESE"),
		new Upgrade("Reality-Bending Magic",               "demonMagicUpgrade2",  [[6.6666e13, "bricks"], [6.6666e24, "money"]], [["static", 250, "Demon"]], [["static", 4, "Demon"]],   "\"Whatever you do, NEVER give them the ability to actually bend reality instead of just look like they can.\" ~Demon Relations Department Chief, RUC"),
		new Upgrade("All The Most Powerful Spell Scrolls", "demonMagicUpgrade3",  [[6.6666e17, "bricks"], [6.6666e28, "money"]], [["static", 350, "Demon"]], [["static", 5, "Demon"]],   "\"You have to be joking.\" ~All the wizards (paraphrased)"),
		new Upgrade("Black-Amalgamated Pitchforks",        "demonUpgradeBlack",   [[3e28, "bricks"], [3e39, "money"]],           [["static", 600, "Demon"]], [["static", 6, "Demon"]],   "The demons request their own Black-themed upgrade, \"mostly for style points\".<br> <br>\"Wait, didn't the Devil himself say not to use this stuff?\" ~Agent Carter<br>\"I've learned to just not question them at this point.\" ~Agent Connor"),
	];
	//Reality Compromiser-y stuff
	[
		new Upgrade("Universal Translators",             "compromiserUpgrade",        [[5e14, "money"], [1e2, "fourth wall bricks"]],                    [["static", 1, "Reality Compromiser"]],   [["static", 1.5, "Reality Compromiser"]], "Reality code is written in some weird language. We only speak AMERICAN!"),
		new Upgrade("Hackers",                           "compromiserUpgrade2",       [[5e15, "money"], [1e3, "fourth wall bricks"]],                    [["static", 5, "Reality Compromiser"]],   [["static", 2, "Reality Compromiser"]],   "To break through all of reality's firewalls."),
		new Upgrade("TV Hackers",                        "compromiserUpgrade3",       [[5e16, "money"], [5e3, "fourth wall bricks"]],                    [["static", 25, "Reality Compromiser"]],  [["static", 2, "Reality Compromiser"]],   "They type at 300 words a minute, and can team up on the same keyboard for better efficiency!"),
		new Upgrade("Overcomplication",                  "compromiserUpgrade4",       [[5e17, "money"], [5e4, "fourth wall bricks"]],                    [["static", 50, "Reality Compromiser"]],  [["static", 2, "Reality Compromiser"]],   "\"More gears! More pistons!\" ~RC project leader"),
		new Upgrade("Reality Sawblades",                 "compromiserUpgrade5",       [[5e18, "money"], [5e5, "fourth wall bricks"]],                    [["static", 75, "Reality Compromiser"]],  [["static", 2, "Reality Compromiser"]],   "They rip through the unhackable fabric to get to the deeper layers of code."),
		new Upgrade("Secret Ingredient",                 "compromiserUpgrade6",       [[5e19, "money"], [5e6, "fourth wall bricks"]],                    [["static", 100, "Reality Compromiser"]], [["static", 3, "Reality Compromiser"]],   "Really it's the 8th secret ingredient. All the materials it takes to break reality are secrets."),
		new Upgrade("Thought-to-Text Translators",       "compromiserUpgrade7",       [[1e21, "money"], [5e8, "fourth wall bricks"]],                    [["static", 150, "Reality Compromiser"]], [["static", 3, "Reality Compromiser"]],   "Now our guys can reprogram reality with their minds. Hell yes."),
		new Upgrade("Extreme Overcomplication",          "compromiserUpgrade8",       [[1e23, "money"], [5e10, "fourth wall bricks"]],                   [["static", 200, "Reality Compromiser"]], [["static", 4, "Reality Compromiser"]],   "\"If the hugely important machines aren't as big as a small city, you're doing it wrong.\" ~Head of Tech, RUC"),
		new Upgrade("Way Better Interface",              "compromiserUpgrade9",       [[1e27, "money"], [2e12, "fourth wall bricks"]],                   [["static", 300, "Reality Compromiser"]], [["static", 5, "Reality Compromiser"]],   "According to the hackers, the custom operating system that we had to make for handling reality code \"is a sack of garbage\", and \"it's like you told the programmers to spend the minimum possible amount of time on it\". Hopefully the latter was a joke, or they know our strategy."),
		new Upgrade("Firewalls",                         "compromiserUpgrade10",      [[2e31, "money"], [1e16, "fourth wall bricks"]],                   [["static", 400, "Reality Compromiser"]], [["static", 5, "Reality Compromiser"]],   "\"Investigating the Sgapang Ball with the compromisers has led to a discovery... It was made by editing reality code.<br> <br>80,000 years ago.<br> <br>Let's be safe.\" ~Hacker #21 in the Firewall proposal"),
		new Upgrade("The Divine Instructions",           "compromiserUpgrade11",      [[5e35, "money"], [1e22, "fourth wall bricks"]],                   [["static", 500, "Reality Compromiser"]], [["static", 7, "Reality Compromiser"]],   "A bunch of carvings in the dungeons of Sauthir, the first titan castle. The titans couldn't make head or tail of them, but we can see that they are instructions to write some extremely useful reality scripts. When questioned of who carved them, Optuqui said that #16 did, saying they were an order from \"the king himself\"."),
		new Upgrade("Code-to-Magic Conversion",          "compromiserMagicUpgrade",   [[5e20, "money"], [5e7, "fourth wall bricks"]],                    [["static", 125, "Reality Compromiser"]], [["static", 3, "Reality Compromiser"]],   "Magically breaking through reality is a lot easier."),
		new Upgrade("Demon Hackers",                     "compromiserMagicUpgrade2",  [[2e25, "money"], [2e11, "fourth wall bricks"]],                   [["static", 250, "Reality Compromiser"]], [["static", 4, "Reality Compromiser"]],   "Closer to the \"hack and slash\" definition of hacker than the programming one."),
		new Upgrade("???",                               "compromiserMagicUpgrade3",  [[2e29, "money"], [2e14, "fourth wall bricks"]],                   [["static", 350, "Reality Compromiser"]], [["static", 5, "Reality Compromiser"]],   "That unknown substance the wizards gave us blows through reality fabric very well. What a useful super dangerous explosive acid! Yes it is!"),
		new Upgrade("Black-Coalesced Reality Sawblades", "compromiserUpgradeBlack",   [[5e39, "money"], [5e28, "bricks"], [5e26, "fourth wall bricks"]], [["static", 600, "Reality Compromiser"]], [["static", 6, "Reality Compromiser"]],   "\"I thought they said mixing the Black with reality editing was a terrible idea.\" ~Agent Carter<br>\"Clearly you do not understand upgrade themes.\" ~Head of R&D"),
	];
	//Black Obliterator-y stuff
	[
		new Upgrade("The Rules",                            "lastBuildingUpgrade",        [[2.5e20, "money"], [2.5e5, "fourth wall bricks"]],                  [["static", 1, "Black Obliterator"]],   [["static", 1.5, "Black Obliterator"]], "Rules of The Black<br>#1: Do not touch it.<br>#2: Do not do anything relating to it without level 10 permission.<br>#3: DO NOT TOUCH IT."),
		new Upgrade("Way More Safeguards",                  "lastBuildingUpgrade2",       [[5e20, "money"], [5e5, "fourth wall bricks"]],                      [["static", 5, "Black Obliterator"]],   [["static", 1.5, "Black Obliterator"]], "\"Way, way, waaaaay more.\" ~Agent Lawrence, in the WMS proposal"),
		new Upgrade("Wizard Research",                      "lastBuildingUpgrade3",       [[5e21, "money"], [5e6, "fourth wall bricks"]],                      [["static", 25, "Black Obliterator"]],  [["static", 2, "Black Obliterator"]],   "The wizards have much knowledge relating to supernatural things, and The Black is kind of like something called Bodjsia, only \"Bodjsia is nothing in comparison, before this it was one of the most feared substances\"."),
		new Upgrade("Titan Research",                       "lastBuildingUpgrade4",       [[5e22, "money"], [5e7, "fourth wall bricks"]],                      [["static", 50, "Black Obliterator"]],  [["static", 2, "Black Obliterator"]],   "The titans can help a lot more. Old World magic is way more powerful than modern magic, and as the 1337 sn1p3rs would say, \"for the pros\"."),
		new Upgrade("Demon Research",                       "lastBuildingUpgrade5",       [[5e23, "money"], [5e8, "fourth wall bricks"]],                      [["static", 75, "Black Obliterator"]],  [["static", 2, "Black Obliterator"]],   "The demons are very interested in The Black, because it is the only thing they have ever found that they have no records of."),
		new Upgrade("Wisdom From The Devil",                "lastBuildingUpgrade6",       [[5e24, "money"], [5e9, "fourth wall bricks"]],                      [["static", 100, "Black Obliterator"]], [["static", 2, "Black Obliterator"]],   "The Big Man is very interested in The Black, because it is the only thing he has ever encountered that emanates more pure evil and power than him."),
		new Upgrade("Wizard Bribes",                        "lastBuildingUpgrade7",       [[2.5e26, "money"], [2.5e11, "fourth wall bricks"]],                 [["static", 150, "Black Obliterator"]], [["static", 3, "Black Obliterator"]],   "The wizards say The Black defies everything they know about magic and the laws of the universe, and we should not be using it but finding a way to destroy it. Screw those guys, right?"),
		new Upgrade("Demon Bribes",                         "lastBuildingUpgrade8",       [[2.5e28, "money"], [5e13, "fourth wall bricks"]],                   [["static", 200, "Black Obliterator"]], [["static", 3, "Black Obliterator"]],   "\"The Black's power is unspeakable... The amount you have been using is only scratching the surface. It is so absolute, in fact, that The Boss is requesting you not use it, as it could very possibly obliterate all of existence if you misuse it.\" ~The Head Demon"),
		new Upgrade("Guide To Properly Handling The Black", "lastBuildingUpgrade9",       [[5e32, "money"], [5e17, "fourth wall bricks"]],                     [["static", 300, "Black Obliterator"]], [["static", 4, "Black Obliterator"]],   "\"We took an expedition back to [REDACTED], and guess what we found in the temple? You'll be just as surprised as we were...\" ~Agent Connor"),
		new Upgrade("Black Distributors",                   "lastBuildingUpgrade10",      [[2.5e37, "money"], [2.5e22, "fourth wall bricks"]],                 [["static", 400, "Black Obliterator"]], [["static", 4, "Black Obliterator"]],   "\"More complex metal parts we have to replace every day? UGH. UUUUUGGGGHHHHH.\" ~Head of Maintanence"),
		new Upgrade("Teleportation Spells",                 "lastBuildingUpgradeMagic",   [[5e25, "money"], [5e10, "fourth wall bricks"], [2.5e14, "bricks"]], [["static", 125, "Black Obliterator"]], [["static", 2, "Black Obliterator"]],   "Teleportation spells are basically the duct tape of magic."),
		new Upgrade("Pure Magic Robots",                    "lastBuildingUpgradeMagic2",  [[5e30, "money"], [5e15, "fourth wall bricks"], [5e19, "bricks"]],   [["static", 250, "Black Obliterator"]], [["static", 3, "Black Obliterator"]],   "As does anything, The Black has more trouble eating through pure magic than the unobtainium plating we were using before."),
		new Upgrade("Pure Antimatter Robots",               "lastBuildingUpgradeMagic3",  [[5e34, "money"], [5e19, "fourth wall bricks"], [5e23, "bricks"]],   [["static", 350, "Black Obliterator"]], [["static", 3, "Black Obliterator"]],   "\"We may be making the robots last longer, but it really just makes the replacements even more expensive.\" ~Head of Finance<br>\"MONEY IS NO CONCERN FOR THE RUC\" ~Automated RUC complaint responder"),
	];
	//Brick Factor-y stuff
	[
		new Upgrade("Interviewers",               "brickFactoryUpgrade",        [[5e13, "money"]],                                 [["static", 1, "Brick Factory"]],   [["static", 1.5, "Brick Factory"]],                              "The dark magic tablets we're using can talk, so we need to learn more about them to use them better. They sound really creepy, and talk about really disturbing stuff."),
		new Upgrade("Assholes",                   "brickFactoryUpgrade2",       [[2.5e14, "money"]],                               [["static", 5, "Brick Factory"]],   [["static", 2, "Brick Factory"]],                                "The tablets like evil, so this is the first step. You can imagine the recruitment process for this."),
		new Upgrade("Convicts",                   "brickFactoryUpgrade3",       [[2.5e15, "money"]],                               [["static", 25, "Brick Factory"]],  [["static", 2, "Brick Factory"]],                                "The next step."),
		new Upgrade("Convict Filtering",          "brickFactoryUpgrade4",       [[5e16, "money"]],                                 [["static", 50, "Brick Factory"]],  [["static", 2, "Brick Factory"], ["static", 2, "handBricks"]],   "We need the real cream of the crop here, not those guys in for possessing drugs."),
		new Upgrade("Evil Robots",                "brickFactoryUpgrade5",       [[5e17, "money"]],                                 [["static", 75, "Brick Factory"]],  [["static", 2, "Brick Factory"], ["static", 3, "handBricks"]],   "Let's make our own evil! Nothing could go wrong with this."),
		new Upgrade("Evil Alchemists",            "brickFactoryUpgrade6",       [[1e19, "money"]],                                 [["static", 100, "Brick Factory"]], [["static", 3, "Brick Factory"], ["static", 4, "handBricks"]],   "They're evil, and they know stuff about illegal brick production! It's perfect!"),
		new Upgrade("Evilium",                    "brickFactoryUpgrade7",       [[5e20, "money"], [3e7, "bricks"]],                [["static", 150, "Brick Factory"]], [["static", 3, "Brick Factory"], ["static", 4, "handBricks"]],   "The prime export of hell, bought it off some demons. Now all we're missing for the ingredients is child blood."),
		new Upgrade("Child Blood",                "brickFactoryUpgrade8",       [[5e22, "money"], [5e9, "bricks"]],                [["static", 200, "Brick Factory"]], [["static", 4, "Brick Factory"], ["static", 5, "handBricks"]],   "The demons always come through. For a price, of course."),
		new Upgrade("Alignment Sliders",          "brickFactoryUpgrade9",       [[2.5e26, "money"], [5e13, "fourth wall bricks"]], [["static", 300, "Brick Factory"]], [["static", 5, "Brick Factory"], ["static", 6, "handBricks"]],   "Brought in the reality compromisers for this one. We found the reality code for good & evil. I'm sure you can guess what we did with that."),
		new Upgrade("Evil-Proof Suits",           "brickFactoryUpgrade10",      [[2.5e30, "money"], [5e13, "fourth wall bricks"]], [["static", 400, "Brick Factory"]], [["static", 5, "Brick Factory"], ["static", 6, "handBricks"]],   "The factories have reached the point where normal people can't really go in anymore, at the risk of being corrupted. We can make suits with the alignment slid all the way over to 'good' to be able to collect the bricks, instead of actually having to do something about it."),
		new Upgrade("The Holy Brick of Vywheir",  "brickFactoryUpgrade11",      [[1e35, "money"]],                                 [["static", 500, "Brick Factory"]], [["static", 7, "Brick Factory"], ["static", 7, "handBricks"]],   "Said to be blessed by the gods, the Holy Brick was first found 37,000 years ago on Vywheir, an uninhabited island.<br> <br>\"It doesn't look anything like a brick.\" ~BF Project Leader<br>\"Would you want a magical artifact called 'The Big White Cube' or 'The Holy Brick of Vywheir'?\" ~Agent Connor"),
		new Upgrade("Evil Magic",                 "brickFactoryMagicUpgrade",   [[1e20, "money"], [5e8, "bricks"]],                [["static", 125, "Brick Factory"]], [["static", 4, "Brick Factory"], ["static", 4, "handBricks"]],   "We've asked the wizards what exactly makes some magic \"evil\", and they said that the First Wizards who invented all the spells just kinda decided that certain spells were \"evil\". The First Wizards are pretty widely hated among magic users."),
		new Upgrade("Black Magic",                "brickFactoryMagicUpgrade2",  [[1e24, "money"], [5e13, "bricks"]],               [["static", 250, "Brick Factory"]], [["static", 4, "Brick Factory"], ["static", 4, "handBricks"]],   "As similar as they sound, Black magic is actually unrelated to dark magic. Dark magic is magic that is frowned upon for general use, whereas Black magic comes from The Black, which is absolute pure evil."),
		new Upgrade("Pure Evil Magic",            "brickFactoryMagicUpgrade3",  [[5e28, "money"], [5e16, "bricks"]],               [["static", 350, "Brick Factory"]], [["static", 5, "Brick Factory"], ["static", 5, "handBricks"]],   "Might as well just make the entire factories out of it, for maximal usage."),
		new Upgrade("Black-Imbued Factory Walls", "brickFactoryUpgradeBlack",   [[1e39, "money"], [5e26, "bricks"]],               [["static", 600, "Brick Factory"]], [["static", 6, "Brick Factory"], ["static", 6, "handBricks"]],   "We really should've done this sooner, seeing as the tablets love evil and that The Black is 100% evil.<br>And that since the demons are in charge, we don't have to be the ones to handle that shit."),
	];

	var map = []
	for (var i = 0; i < game.upgrades.length; i++){
		var index = game.upgradesMap.findIndex(name => name.toLowerCase() === game.upgrades[i].idName.toLowerCase())
		if (index !== -1){
			map[index] = game.upgrades[i]
		}
		else {
			index = Math.max(game.upgradesMap.length, map.length)
			map[index] = game.upgrades[i]
		}
	}
	game.upgrades = map
	for (var i = 0; i < game.upgrades.length; i++){
		var upgrade = game.upgrades[i]
		if (!upgrade) continue
		upgrade.index = i
		game.createUpgradeElement(upgrade)
		var reqs = upgrade.preReqUpgrades
		for (var j = 0; j < reqs.length; j++){
			reqs[j] = game.upgrades.find(upg => upg && upg.name === reqs[j])
		}
		var len = upgrade.preReqUpgrades.length
		upgrade.preReqUpgrades = upgrade.preReqUpgrades.filter(upg => upg)
		if (upgrade.preReqUpgrades.length !== len){
			console.warn(upgrade.name+" has requirements I can't parse.")
		}
	}

	function Achievement(name, url, unlocks, flavorText){
		game.achievements.push(this)
		this.index = game.upgrades.indexOf(this)
		this.name = name
		this.unlocks = unlocks
		this.url = url.indexOf("png") !== -1 ? url : "img/upgrades/"+url+".png"
		this.flavorText = flavorText
	}

	setInterval(game.tick.bind(game), 1000/game.tickRate)

	$(window).resize(function(){
		var progressBar = game.progressBar
		var h = progressBar.height()
		progressBar.css("font-size", h*0.75+"px")
		game.fixProgressBarImages()

		//Resize hitWall button
		var img = $("#hitWall")
		var screen = $("#mainScreen")
		var h = screen.height()
		var w = screen.width()
		img.show()
		img.css("margin-left", (img.width() * -0.5) + "px")

		//fix button line heights
		var buildingButton = $("#buildingButton")
		var h = buildingButton.height()
		buildingButton.css("line-height", h+"px")
		var upgradeButton = $("#upgradeButton")
		upgradeButton.css("line-height", h+"px")
		var achievementsButton = $("#achievementsButton")
		achievementsButton.css("line-height", h+"px")

		game.fixUpgradeVisuals()
	})
	$(window).triggerHandler("resize")
	$("#mainProgressBar").on("click", function(){
		if (game.damage > game.wall.health){
			game.destroyWall.call(game)
		}
	})
	$("#buildingButton").on("click", function(){
		var elem = $(this)
		var otherButton = $("#upgradeButton")
		var buildings = $("#buildings")
		var resources = $("#mainResources")
		if (elem.hasClass("open")){
			elem.removeClass("open")
			buildings.removeClass("open")
			var menus = game.openMenus
			var index = menus.indexOf("b")
			game.openMenus = menus.substring(0, index) + menus.substring(index+1)
		}
		else {
			elem.addClass("open")
			buildings.addClass("open")
			game.openMenus += "b"
		}
	})
	$("#upgradeButton").on("click", function(){
		var elem = $(this)
		var upgrades = $("#upgrades")
		var achievements = $("#achievements")
		var upgradeButton = $("#upgradeButton")
		var achievementsButton = $("#achievementsButton")
		var resources = $("#mainResources")

		var state = game.rightMenu
		if (state === ""){
			resources.addClass("left").removeClass("right")
			upgradeButton.addClass("open")
			achievementsButton.addClass("open")
			achievements.addClass("open").css("z-index", "1")
			upgrades.addClass("open").css("z-index", "2")
			game.rightMenu = "u"
		}
		else if (state === "u"){
			resources.removeClass("left").addClass("right")
			upgradeButton.removeClass("open")
			achievementsButton.removeClass("open")
			achievements.removeClass("open")
			upgrades.removeClass("open")
			game.rightMenu = ""
		}
		else if (state === "a"){
			achievements.css("z-index", "1")
			upgrades.css("z-index", "2")
			game.rightMenu = "u"
		}
	})
	$("#achievementsButton").on("click", function(){
		var elem = $(this)
		var upgrades = $("#upgrades")
		var achievements = $("#achievements")
		var upgradeButton = $("#upgradeButton")
		var achievementsButton = $("#achievementsButton")
		var resources = $("#mainResources")

		var state = game.rightMenu
		if (state === ""){
			resources.addClass("left").removeClass("right")
			upgradeButton.addClass("open")
			achievementsButton.addClass("open")
			achievements.addClass("open").css("z-index", "2")
			upgrades.addClass("open").css("z-index", "1")
			game.rightMenu = "a"
		}
		else if (state === "a"){
			resources.removeClass("left").addClass("right")
			upgradeButton.removeClass("open")
			achievementsButton.removeClass("open")
			achievements.removeClass("open")
			upgrades.removeClass("open")
			game.rightMenu = ""
		}
		else if (state === "u"){
			achievements.css("z-index", "2")
			upgrades.css("z-index", "1")
			game.rightMenu = "a"
		}
	})
	$("#hitWall").on("mouseenter", function(){
		// if (!game.openMenus.includes("b")){
		// 	var elem = $(this)
		// 	elem.addClass("hovered")
		// }
		var elem = $(this)
		elem.addClass("hovered")
	})
	$("#hitWall").on("mouseleave", function(){
		$(this).removeClass("hovered")
	})
	$("#makeBricks").on("mouseenter", function(){
		if (!game.openMenus.includes("b")){
			var elem = $(this)
			elem.addClass("hovered")
		}
	})
	$("#makeBricks").on("mouseleave", function(){
		$(this).removeClass("hovered")
	})
	$("#quantitySelector div").on("click", function(){
		if ($(this).hasClass("active")) return
		$("#quantitySelector div").removeClass("active")
		$(this).addClass("active")
		game.buildingBuyAmount = parseInt($(this).attr("data"))
		game.fixBuildingVisuals()
	})
	// $("#availableUpgrades").on("mouseenter", function(){
	// 	var children = $(this).children().length
	// 	$(this).css("height", (game.upgradeLeftWidth * Math.ceil(children / 7))+"px")
	// })
	// $("#availableUpgrades").on("mouseout", function(){
	// 	var children = $(this).children().length
	// 	$(this).css("height", (game.upgradeLeftWidth * (!children ? 0 : 1))+"px")
	// })

	for (var i = 0; i < game.buildings.length; i++){
		var building = game.buildings[i]
		var html = "<div class='building' id='"+building.idName+"'><div class='buildingQuantity'>"+building.count+"</div><div class='buildingName'>"+building.name+"</div>"
		for (var j = 0; j < building.costs.length; j++){
			var resource = building.costs[j][1]
			var amt = building.costs[j][0]
			var canAfford = game.canAfford(amt, resource)
			html += "<div class='buildingCost "+(canAfford?"green":"red")+"'>"+game.toResourceString(amt, resource)+"</div>"
		}
		html += "</div>"
		$("#buildings").append(html)
		building.elem = $("#"+building.idName)
		building.elem.css("background-image", "url("+building.url+")").attr("data", i)
		if (!building.unlocked){
			building.elem.addClass("hidden")
		}
	}
	$(".building").click(function(){
		game.buyBuilding(parseInt($(this).attr("data")))
	})

	$(".upgrade").click(function(){
		game.buyUpgrade(parseInt($(this).attr("data")))
	})

	$(document).mousemove(function(event) {
		game.mouseX = event.pageX;
		game.mouseY = event.pageY;
		game.mouseActive = true
	})
    $(document).on("mouseout", function(){
    	game.mouseActive = false
    })

    game.fixBuildingVisuals()
    game.load()

    Game = game
})()