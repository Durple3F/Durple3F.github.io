const colorData = {
	"Comfey": {
		imageW: 2216,
		imageH: 2216,
		layers: [
			{
				name: "Yellow 1 Pistil",
				url: "Comfey/Yellow 1 Pistil"
			},
			{
				name: "Yellow 1",
				url: "Comfey/Yellow 1"
			},
			{
				name: "Yellow 2 Pistil",
				url: "Comfey/Yellow 2 Pistil"
			},
			{
				name: "Yellow 2",
				url: "Comfey/Yellow 2"
			},
			{
				name: "Red 1 Pistil",
				url: "Comfey/Red 1 Pistil"
			},
			{
				name: "Red 1",
				url: "Comfey/Red 1"
			},
			{
				name: "Pink 1 Pistil",
				url: "Comfey/Pink 1 Pistil"
			},
			{
				name: "Pink 1",
				url: "Comfey/Pink 1"
			},
			{
				name: "Pink 2 Pistil",
				url: "Comfey/Pink 2 Pistil"
			},
			{
				name: "Pink 2",
				url: "Comfey/Pink 2"
			},
			{
				name: "White 1 Pistil",
				url: "Comfey/White 1 Pistil"
			},
			{
				name: "White 1",
				url: "Comfey/White 1"
			},
			{
				name: "White 2",
				url: "Comfey/White 2"
			},
			{
				name: "Band",
				url: "Comfey/Band"
			},
			{
				name: "Red 2",
				url: "Comfey/Red 2"
			},
			{
				name: "Face",
				url: "Comfey/Face"
			},
			{
				name: "Eyes",
				url: "Comfey/Eyes"
			},
			{
				name: "Bangs",
				url: "Comfey/Bangs"
			},
			{
				name: "Lines",
				url: "Comfey/Lines"
			},
			{
				name: "Bottom Body",
				url: "Comfey/Bottom Body"
			},
			{
				name: "Top Body",
				url: "Comfey/Top Body"
			},
		]
	}
}
for (let pkmn in colorData){
	colorData[pkmn].layers = colorData[pkmn].layers.reverse()
}