import type { Game } from "./game";

export function render(game: Game): void{
	const screen = game.screen
	const ctx = game.ctx
	console.log(screen.width)
}