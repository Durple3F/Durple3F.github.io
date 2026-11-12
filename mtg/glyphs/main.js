const headings = $("body > .container > h2")
for (let heading of headings){
	const li = $("<li>")
	const text = $(heading).text()
	li.text(text)
	li.appendTo("#table-of-contents > ol")
	li.on("click", () => {
		heading.scrollIntoView()
	})
	if (!$(heading).next().length || $(heading).next()[0].tagName === "H2"){
		li.addClass("red")
	}
}

$("#theme-picker input").change(e => {
	const val = e.target.checked
	if (val){
		$("body").attr("data-theme", "light")
	} else {
		$("body").attr("data-theme", "dark")
	}
})