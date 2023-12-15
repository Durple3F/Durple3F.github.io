let allSpans = $(".col span")
let story = {}
if (storyCode){
  story = storyInfo[storyCode]
}
const storyElemValues = {}
const storyColors = {}
const myrng = new Math.seedrandom(storyCode);

let colors = [
  "red", "crimson", "firebrick", "coral",
  "orange", "orangered", "darkorange", "yellow", "gold",
  "chartreuse", "green", "lime", "mediumspringgreen", "seagreen", "forestgreen",
  "blue", "blueviolet", "deepskyblue",
  "magenta", "fuchsia", "indigo", "orchid", "rebeccapurple"
]
let colorUsage = {}
for (let color of colors){
  colorUsage[color] = 0
}

function getValsFromElement(element){
  for (let factCode in storyElemValues){
    let vals = storyElemValues[factCode]
    let elems = vals.elems
    for (let i = 0; i < elems.length; i++){
      let e = elems[i]
      if (e === element){
        return vals
      }
    }
  }
}

let currentlyHovered;
function hoverFade(e){
  let hoveredList = document.elementsFromPoint(e.clientX, e.clientY)
  let hovered
  for (let tag of hoveredList){
    if (tag.tagName === "SPAN"){
      hovered = tag
      break
    }
  }
  if (!hovered){
    return
  }
  if (currentlyHovered){
    unHoverFade(currentlyHovered)
  }

  currentlyHovered = hovered
  let vals = getValsFromElement(hovered)
  if (!vals) {
    console.warn("????", hovered)
  }
  let css = {
    "background-color": vals.color,
    "text-shadow": "0px 0px 2px black"
  }
  vals.elems.css(css)
  $("#explanation-text").html(vals.fact)

  $("#explanation > .show-all").hide()
}
function unHoverFade(e){
  if (!e.textContent){
    e = $(e.delegateTarget)[0]
  }
  let vals = getValsFromElement(e)
  if (!vals) {
    console.warn("????", hovered)
  }
  let css = {
    "background-color": "transparent",
    "text-shadow": "inherit"
  }
  vals.elems.css(css)
  $("#explanation-text").html("")

  if (showAllButtonIsShown){
    $("#explanation > .show-all").show()
  }
}

let showAllButtonIsShown = false
function toggleColumn(e){
  let elem = $(e.delegateTarget)
  let col = elem.parents(".col")[0]
  let row = $(col).parents(".row")[0]
  let index = [...$(row).children(".col")].indexOf(col) + 1
  let query = `#views > .row > .col:nth-child(${index})`
  console.log(index, query)
  $(query).hide()
  $("#explanation > .show-all").show()
  showAllButtonIsShown = true
}
function showAllColumns(){
  $("#views > .row > .col").show()
  showAllButtonIsShown = false
}

for (let factCode in story){
  let fact = `<div class="fact">${story[factCode] ?? ""}</div>`
  let className = `.f${factCode}`
  let thoseSpans = $(className)
  let minColorUsage = Math.min(...Object.values(colorUsage))
  let validColors = colors.filter(c => colorUsage[c] === minColorUsage)
  let color = validColors[Math.floor(myrng.quick() * validColors.length)]
  colorUsage[color]++
  storyColors[factCode] = color
  let css = {
    "text-decoration-color": color,
    "text-decoration-style": "solid"
  }
  let boundObj = {
    elems: thoseSpans,
    color: color,
    fact: fact
  }
  storyElemValues[factCode] = boundObj
  thoseSpans.css(css)
  .on("mousemove", hoverFade)
  .on("mouseleave", unHoverFade)

  let children = thoseSpans.children("span")
  for (let child of children){
    $(child).css("border-bottom", "1px solid "+color)
  }
}

$(".toggle-btn").click(toggleColumn)
$(".show-all").click(showAllColumns)