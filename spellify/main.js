(function(){

  let downloads = {}
	function download(url, name){
    let p = new Promise(res => {
      $.ajax({
        url: url,
        success: function(data){
          downloads[name] = data.data
          res()
        },
        error: function(){
          download(url, name)
        }
      })
    })
    return p
	}

  function readyToStart(){
    $("#title-screen > .btn").attr("disabled", false)
    .text("Start")
    .on("click", startGame)
  }

  let hardMode = false
  let guessesUsed = 0
  let difficulty = 1
  let diffAmounts = [100, 500, 2500, 10000, Infinity]
  let prevGuesses = []
  correctCard = null
  answers = {
    "name": "",
    "type": "",
    "text": "",
    "cost": ""
  }
  shown = {
    "name": "",
    "type": "",
    "text": "",
    "cost": ""
  }

  function startGame(){
    $("#title-screen").hide()
    $("#game").show()

    hardMode = $("#hard-mode").is(":checked")
    guessesUsed = 0
    difficulty = parseInt($("#difficulty").val()) || 1
    let maxRank = diffAmounts[difficulty - 1]

    let cards = Object.values(downloads.cards)
    .map(c => c[0])
    .filter(c => (c.faceName ?? c.name).length > 20)
    .filter(c => !c.types.includes("Land"))
    .filter(c => c.edhrecRank < maxRank)
    let card = cards[Math.floor(Math.random() * cards.length)]
    correctCard = card

    answers["name"] = card.faceName ?? card.name ?? ""
    answers["type"] = card.type || ""
    answers["cost"] = card.manaCost || ""
    answers["text"] = card.text || ""
    answers["pt"] = (card.power !== undefined) ? `${card.power}/${card.toughness}` : ""
    
    for (let key in answers){
      shown[key] = (answers[key] || "").replaceAll(/[a-zA-Z0-9]/g, "_")
    }

    showShownStuff()
    resize()
  }

  function resize(){
    let height = $("#card-section").height()
    let width = $("#card-section")[0].getBoundingClientRect().width
    let costWidth = $("#card-section > .card-cost")[0].getBoundingClientRect().width
    let remainingSpace = (width * 0.75) - costWidth
    
    let name = $("#card-section > .card-name").text()
    if (name.length < 20){
      $("#card-section > .card-name").width(remainingSpace)
      .css("font-size", height / 30)
      .css("transform", "translateY(0em)")
    } else {
      $("#card-section > .card-name").width(remainingSpace)
      .css("font-size", height / 45)
      .css("transform", "translateY(0.2em)")
    }
    
    let type = $("#card-section > .card-type").text()
    if (type.length < 20){
      $("#card-section > .card-type").css("font-size", height / 30)
      .css("transform", "translateY(0em)")
    } else {
      $("#card-section > .card-type").css("font-size", height / 40)
      .css("transform", "translateY(0.2em)")
    }
    $("#card-section > .card-cost").css("font-size", height / 35)
    $("#card-section > .card-pt").css("font-size", height / 30)

    $("#card-section > .card-text").css("font-size", height / 30)
    let text = $("#card-section > .card-text").text()
    if (text.length > 100){
      $("#card-section > .card-text").css("font-size", height / 35)
    }
    if (text.length > 150){
      $("#card-section > .card-text").css("font-size", height / 40)
    }
    if (text.length > 200){
      $("#card-section > .card-text").css("font-size", height / 45)
    }
  }

  function revealLetter(letter){
    let found = false
    for (let key in answers){
      let val = answers[key]
      for (let i = 0; i < val.length; i++){
        let that = val[i]
        if (that.toLowerCase() === letter.toLowerCase()){
          shown[key] = shown[key].substring(0, i) + that + shown[key].substring(i + 1)
          found = true
        }

        //If we just found a symbol, skip to the next }
        if (that === "{"){
          i = val.indexOf("}", i)
        }
      }
    }
    showShownStuff()
    return found
  }

  let cardBacks = {
    "white-noncreature": "https://json.edhrec.com/static/public/img/white-noncreature.png",
    "blue-noncreature": "https://json.edhrec.com/static/public/img/blue-noncreature.png",
    "black-noncreature": "https://json.edhrec.com/static/public/img/black-noncreature.png",
    "red-noncreature": "https://json.edhrec.com/static/public/img/red-noncreature.png",
    "green-noncreature": "https://json.edhrec.com/static/public/img/green-noncreature.png",
    "multicolor-noncreature": "https://json.edhrec.com/static/public/img/multicolor-noncreature.png",
    "colorless-noncreature": "https://json.edhrec.com/static/public/img/colorless-noncreature.png",
    "white-creature": "https://json.edhrec.com/static/public/img/white-creature.png",
    "blue-creature": "https://json.edhrec.com/static/public/img/blue-creature.png",
    "black-creature": "https://json.edhrec.com/static/public/img/black-creature.png",
    "red-creature": "https://json.edhrec.com/static/public/img/red-creature.png",
    "green-creature": "https://json.edhrec.com/static/public/img/green-creature.png",
    "multicolor-creature": "https://json.edhrec.com/static/public/img/multicolor-creature.png",
    "colorless-creature": "https://json.edhrec.com/static/public/img/colorless-creature.png",
  }
  let colorNames = {
    "w": "white",
    "u": "blue",
    "b": "black",
    "r": "red",
    "g": "green",
  }

  function fancifyMana(text){
    text = text.replaceAll(/\{_\}/g, "<i class='ms ms-cost ms-shadow'></i>")
    text = text.replaceAll(/\{W\}/g, "<i class='ms ms-w ms-cost ms-shadow'></i>")
    text = text.replaceAll(/\{U\}/g, "<i class='ms ms-u ms-cost ms-shadow'></i>")
    text = text.replaceAll(/\{B\}/g, "<i class='ms ms-b ms-cost ms-shadow'></i>")
    text = text.replaceAll(/\{R\}/g, "<i class='ms ms-r ms-cost ms-shadow'></i>")
    text = text.replaceAll(/\{G\}/g, "<i class='ms ms-g ms-cost ms-shadow'></i>")
    return text
  }

  function showShownStuff(){
    let costText = fancifyMana(shown.cost)
    $("#card-section > .card-cost").html(costText)
    $("#card-section > .card-name").html(shown.name)
    $("#card-section > .card-type").html(shown.type)

    let text = shown.text.replaceAll("\n", "<br>")

    $("#card-section > .card-text").html(text)
    $("#card-section > .card-pt").html(shown.pt)

    let imgToUse = ""
    if (hardMode){
      imgToUse += "white"
    } else {
      let colors = correctCard.colors
      if (colors.length === 0){
        imgToUse += "colorless"
      } else if (colors.length > 1){
        imgToUse += "multicolor"
      } else {
        imgToUse += colorNames[colors[0].toLowerCase()]
      }
    }
    imgToUse += "-"
    if (correctCard.types.includes("Creature")){
      imgToUse += "creature"
    } else {
      imgToUse += "noncreature"
    }
    $("#card-section > .card-back").attr("src", cardBacks[imgToUse])

    $("#guess-count > .used").html(guessesUsed)
  }

  function guess(event){
    let tag = event.currentTarget
    let guessText = tag.innerHTML
    if (guessesUsed >= 13){
      return
    }

    if ($("#keyboard-section").hasClass("front") && !guessText.includes("123")){
      if (prevGuesses.includes(guessText)) return
      guessesUsed++
      prevGuesses.push(guessText)
      let result = revealLetter(guessText)
      if (result) {
        $(tag).addClass("green")
      } else {
        $(tag).addClass("red")
      }
    }
  }

  function guessCard(){
    $("#final-guess-modal").fadeIn()
  }

  function submitFinalGuess(){
    let guess = $("#final-guess-input").val().toLowerCase()
    console.log(guess, answers.name)
    if (guess === answers.name.toLowerCase()){
      alert("You win!")
    }
  }

  // download("AtomicCards.json", "cards")
  download("https://mtgjson.com/api/v5/AtomicCards.json", "cards")
  .then(readyToStart)

  $(".keyboard-row > div").click(guess)

  $(document).on("resize", resize)
  resize()
  setInterval(resize, 1000)

  $("#final-guess").on("click", guessCard)
  $("#final-guess-modal .btn-close").on("click", () => $("#final-guess-modal").fadeOut())
  $("#final-guess-modal .submit").on("click", submitFinalGuess)
})()
