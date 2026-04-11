import { Component, cross_product, Hex } from "./util.js"

export class TrackPiece {
	constructor(coord) {
		this.type = "single"
		this.imageDirection = "top"
		this.coord = coord
		this.hexRotation = 0
		this.spriteRotation = 0
	}
	getSpriteName(){
		return this.type + "_" + this.imageDirection
	}
	getSpriteNameForDirection(direction){
		return this.type + "_" + direction
	}
	getImageDirections(){
		return [
			this.getSpriteNameForDirection("bottom"),
			this.getSpriteNameForDirection("top")
		]
		// switch (this.hexRotation){
		// 	case 0:
		// 		return [
		// 			this.getSpriteNameForDirection("bottom")
		// 		]
		// 	case 1:
		// 		return [
		// 			this.getSpriteNameForDirection("right"),
		// 			this.getSpriteNameForDirection("top")
		// 		]
		// 	case 2:
		// 		return [
		// 			this.getSpriteNameForDirection("bottom"),
		// 			this.getSpriteNameForDirection("top")
		// 		]
		// 	case 3:
		// 		return [
		// 			this.getSpriteNameForDirection("top"),
		// 			this.getSpriteNameForDirection("right")
		// 		]
		// 	case 4:
		// 		return [
		// 			this.getSpriteNameForDirection("top"),
		// 			this.getSpriteNameForDirection("top")
		// 		]
		// 	case 5:
		// 		return [
		// 			this.getSpriteNameForDirection("bottom"),
		// 			this.getSpriteNameForDirection("left")
		// 		]
		// 	default:
		// 		return [
		// 			this.getSpriteNameForDirection("top"),
		// 			this.getSpriteNameForDirection("left")
		// 		]
		// }
	}
}
TrackPiece.spriteMap = {
	"single_left": "./src/img/tracks/single/left.png",
	"single_right": "./src/img/tracks/single/right.png",
	"single_top": "./src/img/tracks/single/top.png",
	"single_bottom": "./src/img/tracks/single/bottom.png",
	"end_left": "./src/img/tracks/end/left.png",
	"end_right": "./src/img/tracks/end/right.png",
	"end_top": "./src/img/tracks/end/top.png",
	"end_bottom": "./src/img/tracks/end/bottom.png",
	"bend_left": "./src/img/tracks/bend/left.png",
	"bend_right": "./src/img/tracks/bend/right.png",
	"bend_top": "./src/img/tracks/bend/top.png",
	"bend_bottom": "./src/img/tracks/bend/bottom.png",
	"sharp_left": "./src/img/tracks/sharp/left.png",
	"sharp_right": "./src/img/tracks/sharp/right.png",
	"sharp_top": "./src/img/tracks/sharp/top.png",
	"sharp_bottom": "./src/img/tracks/sharp/bottom.png",
	"straight_left": "./src/img/tracks/straight/left.png",
	"straight_right": "./src/img/tracks/straight/right.png",
	"straight_top": "./src/img/tracks/straight/top.png",
	"straight_bottom": "./src/img/tracks/straight/bottom.png",
}
TrackPiece.sprites = {}

export class Track extends Component {
	constructor() {
		super()
		this.type = "Track"
		this.loops = false
		this.trackPieces = []
	}
	clone(){
		let clone = new Track()
		clone.loops = this.loops
		for (let trackPiece of this.trackPieces){
			clone.addTrackPiece(trackPiece.coord)
		}
		clone.homeTile = this.homeTile
		clone.currentHexRotation = this.currentHexRotation
		clone.rotationPoint = this.rotationPoint
		return clone
	}
	fixPieceRotations(){
		const pieces = this.trackPieces
		for (let i = 0; i < pieces.length; i++){
			const piece = pieces[i]
			switch (piece.type){
				case "single":
					piece.spriteRotation = 0
					piece.imageDirection = "top"
				break
				case "end":
				case "straight": {
					let nextTile = i === 0 ? pieces[1] : pieces[i - 1]
					let diff = nextTile.coord.subtract(piece.coord)
					let index = Hex.directions.findIndex(hex => hex.equals(diff))
					piece.hexRotation = Hex.directions.length - index
				} break
				case "bend":
				case "sharp": {
					let pieceXY = piece.coord.toXY()
					let nextTile = pieces[(i + 1) % pieces.length]
					let nextTileXY = nextTile.coord.toXY()
					let prevTile = pieces[(i + pieces.length - 1) % pieces.length]
					let prevTileXY = prevTile.coord.toXY()
					let cross = cross_product(pieceXY[0], pieceXY[1], nextTileXY[0], nextTileXY[1], prevTileXY[0], prevTileXY[1])
					
					if (cross < 0){
						let diff = piece.coord.subtract(prevTile.coord).scale(-1)
						let index = Hex.directions.findIndex(hex => hex.equals(diff))
						piece.hexRotation = Hex.directions.length - index
					} else {
						let diff = piece.coord.subtract(nextTile.coord).scale(-1)
						let index = Hex.directions.findIndex(hex => hex.equals(diff))
						piece.hexRotation = Hex.directions.length - index
					}
				} break
			}
			piece.hexRotation %= Hex.directions.length
			piece.spriteRotation = piece.hexRotation * Math.PI / 3 + Math.PI
			piece.spriteRotation %= 2*Math.PI
		}
	}
	addTrackPiece(coord, end = true) {
		//the end parameter decides whether the new piece is added at the beginning or the end of the track
		let trackPieces = this.trackPieces
		let trackPiece = new TrackPiece(coord)
		if (end) {
			trackPieces.push(trackPiece)
		} else {
			trackPieces.unshift(trackPiece)
		}
		if (trackPieces.length === 1) {
			trackPiece.type = "single"
			this.loops = false
		}
		else if (trackPieces.length === 2) {
			trackPieces[0].type = "end"
			trackPieces[1].type = "end"
			this.loops = false
		} else {
			let intendedIndex = end ? trackPieces.length - 1 : 0
			let indexDiff = end ? -1 : 1

			let ending = trackPieces[intendedIndex]
			let endingH = ending.coord
			let middle = trackPieces[intendedIndex + indexDiff]
			let middleH = middle.coord
			let inner = trackPieces[intendedIndex + indexDiff * 2]
			let innerH = inner.coord
			ending.type = "end"
			const uq = innerH.q - middleH.q, ur = innerH.r - middleH.r, us = innerH.s - middleH.s
			const vq = endingH.q - middleH.q, vr = endingH.r - middleH.r, vs = endingH.s - middleH.s
			const dot = uq * vq + ur * vr + us * vs

			if (dot === 1){
				middle.type = "sharp"
			}
			else if (dot === -1){
				middle.type = "bend"
			}
			else if (dot === -2){
				middle.type = "straight"
			}
			else if (dot === 2){
				//this shouldn't happen
				middle.type = "end"
			}

			//check if first and last are adjacent
			let first = trackPieces[0]
			let firstH = first.coord
			if (firstH.distance(endingH) === 1){
				this.loops = true
				//Perform the same test as we did with the line (inner -> middle -> ending) to determine curviness.
				const uq = middleH.q - endingH.q, ur = middleH.r - endingH.r, us = middleH.s - endingH.s
				const vq = firstH.q - endingH.q, vr = firstH.r - endingH.r, vs = firstH.s - endingH.s
				const dot = uq * vq + ur * vr + us * vs
				if (dot === 1){
					ending.type = "sharp"
				}
				else if (dot === -1){
					ending.type = "bend"
				}
				else if (dot === -2){
					ending.type = "straight"
				}
				else if (dot === 2){
					//this shouldn't happen
					ending.type = "end"
				}
				
				let next = trackPieces[1]
				let nextH = next.coord
				const uq2 = endingH.q - firstH.q, ur2 = endingH.r - firstH.r, us2 = endingH.s - firstH.s
				const vq2 = nextH.q - firstH.q, vr2 = nextH.r - firstH.r, vs2 = nextH.s - firstH.s
				const dot2 = uq2 * vq2 + ur2 * vr2 + us2 * vs2
				if (dot2 === 1){
					first.type = "sharp"
				}
				else if (dot2 === -1){
					first.type = "bend"
				}
				else if (dot2 === -2){
					first.type = "straight"
				}
				else if (dot2 === 2){
					//this shouldn't happen
					first.type = "end"
				}
			} else {
				this.loops = false
				first.type = "end"
				ending.type = "end"
			}
		}

		//Reset the track's alteration points to the beginning and end of the chain
		let final = trackPieces[trackPieces.length - 1]
		this.rotationPoint = final.coord

		this.fixPieceRotations()
	}
	removeFinalTrackPiece() {
		let trackPieces = this.trackPieces
		if (trackPieces.length <= 1) return
		let prevPiece = trackPieces[trackPieces.length - 2]
		this.trackPieces.splice(trackPieces.length - 2, 2)
		this.addTrackPiece(prevPiece.coord, true)
	}
}