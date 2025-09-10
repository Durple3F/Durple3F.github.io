$("#btn-tips-toggle").change(() => {
  let state = $("#btn-tips-toggle").is(":checked")
  $("body").attr("data-showtips", state)
})
$("#btn-bluffs-toggle").change(() => {
  let state = $("#btn-bluffs-toggle").is(":checked")
  $("body").attr("data-showbluffs", state)
})

$(".accordion-button").on("click", event => {
  let target = $(event.currentTarget)

  //Close all opened boxes
  target.parents(".accordion").find(".accordion-button:not(.collapsed)").each((index, elem) => {
    if (elem === target[0]) return
    let toClose = $(elem)
    toClose.toggleClass("collapsed")
    toClose.parent().next().toggle("collapse").toggleClass("collapse")
  })

  target.toggleClass("collapsed")
  target.parent().next().toggle("collapse").toggleClass("collapse")
})