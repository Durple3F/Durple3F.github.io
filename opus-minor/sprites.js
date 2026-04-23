export const SPRITES = {}

export async function loadSprite(url, id=null) {
	let img = new Image();
	img.src = url;
	return await new Promise((resolve, reject) => {
		img.onload = () => {
			if (id){
				SPRITES[id] = img
			}
			resolve(img);
		};
		img.onerror = async () => {
			img = await loadSprite(url);
			resolve(img);
		};
	});
}

const neededSprites = [
	{url: "./src/img/program-pane/frame.png", id: "program_pane_frame"},
	{url: "./src/img/program-pane/frame-left-end.png", id: "program_pane_frame_left"},
	{url: "./src/img/program-pane/frame-extension.png", id: "program_pane_frame_center"},
	{url: "./src/img/program-pane/frame-right-end.png", id: "program_pane_frame_right"},
	{url: "./src/img/program-pane/row_first.png", id: "program_row_first"},
	{url: "./src/img/program-pane/row_second.png", id: "program_row_second"},
	{url: "./src/img/program-pane/row_background.png", id: "program_row_background"},
	{url: "./src/img/program-pane/row_divider.png", id: "program_row_divider"},
	{url: "./src/img/program-pane/instruction.png", id: "instruction"},
	{url: "./src/img/program-pane/instruction_extension.png", id: "instruction_extension"},
	{url: "./src/img/program-pane/instruction_disabled.png", id: "instruction_disabled"},
	{url: "./src/img/outputs/output_ring.png", id: "product_ring"},
	{url: "./src/img/inputs/input_base.png", id: "reagent_base"},
	{url: "./src/img/inputs/input_bond.png", id: "reagent_bond"},
	{url: "./src/img/inputs/input_ring.png", id: "reagent_ring"},
	{url: "./src/img/outputs/output_base.png", id: "product_base"},
	{url: "./src/img/outputs/output_bond.png", id: "product_bond"},
	{url: "./src/img/outputs/output_ring.png", id: "product_ring"},
	{
		url: "./src/img/hexes/base.png",
		id: "hex_base"
	},
	{
		url: "./src/img/hexes/0.png",
		id: "hex_0"
	},
	{
		url: "./src/img/hexes/1.png",
		id: "hex_1"
	},
	{
		url: "./src/img/hexes/2.png",
		id: "hex_2"
	},
	{
		url: "./src/img/hexes/3.png",
		id: "hex_3"
	},
	{
		url: "./src/img/hexes/4.png",
		id: "hex_4"
	},
	{
		url: "./src/img/hexes/hex_recessed_1.png",
		id: "hex_recessed_shadow"
	},
	{
		url: "./src/img/hexes/debris_shadow.png",
		id: "hex_shadow"
	},
	{
		url: "./src/img/hexes/hex_protruding_1.png",
		id: "hex_protruding_shadow"
	},
]

export async function loadNeededSprites(){
	let promises = []
	for (let sprite of neededSprites){
		let p = loadSprite(sprite.url, sprite.id)
		promises.push(p)
	}
	await Promise.all(promises)
}