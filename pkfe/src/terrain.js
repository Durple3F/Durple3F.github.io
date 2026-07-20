export class Terrain {
	constructor() {
		this.tiles = []
	}
	createFromData(terrainData) {
		if (terrainData.type === "simple") {
			this.createSimpleTerrain(terrainData.width, terrainData.height, 0)
		}
	}
	createSimpleTerrain(width, height, elevation) {
		for (let i = 0; i < width * height; i++) {
			let x = i % width - Math.round(width / 2)
			let z = Math.floor(i / width) - Math.round(height / 2)
			let tile = new TerrainTile(x, elevation, z)
			tile.worldPosition.x += 0
			tile.worldPosition.y += 0
			tile.worldPosition.z += 0
			this.tiles.push(tile)
		}
		for (let tile of this.tiles) {
			let locs = []
			locs.push([tile.x - 1, tile.z])
			locs.push([tile.x + 1, tile.z])
			locs.push([tile.x, tile.z - 1])
			locs.push([tile.x, tile.z + 1])
			for (let loc of locs) {
				let found = this.tiles.find(tile => tile.x === loc[0] && tile.z === loc[1])
				if (!found) continue
				if (!tile.connectionCosts.has(found)) {
					tile.connections.push(found)
					tile.connectionCosts.set(found, 1)
				}
				if (!found.connectionCosts.has(tile)) {
					found.connections.push(tile)
					found.connectionCosts.set(tile, 1)
				}
			}
		}
	}
	heuristicDistance(startTile, endTile) {
		return Math.abs(startTile.x - endTile.x) + Math.abs(startTile.z - endTile.z) + Math.abs(startTile.y - endTile.y) * 2
	}
	findPath(startTile, endTile, tilePermissions = []) {
		//It's A* you know it baby
		const openSet = new Set()
		openSet.add(startTile)
		const cameFrom = new Map()
		const gScore = new Map() //default value = Infinity
		gScore.set(startTile, 0)
		const fScore = new Map() //default value = Infinity
		fScore.set(startTile, this.heuristicDistance(startTile, endTile))

		function score(map, key) {
			return map.has(key) ? map.get(key) : Infinity;
		}

		function reconstructPath(cameFrom, current) {
			const path = [current];

			while (cameFrom.has(current)) {
				current = cameFrom.get(current);
				path.unshift(current);
			}
			return path;
		}

		while (openSet.size > 0) {
			let current = null
			let curScore = Infinity
			for (let tile of openSet) {
				let cmp = score(fScore, tile)
				if (cmp < curScore) {
					current = tile
					curScore = cmp
				}
			}

			if (current === endTile) {
				return reconstructPath(cameFrom, current)
			}

			openSet.delete(current);

			for (let i = 0; i < current.connections.length; i++) {
				const neighbor = current.connections[i]
				const cost = current.connectionCosts.get(neighbor)

				// Later:
				// if (!this.canEnter(neighbor, tilePermissions))
				//     continue;

				const tentativeG = score(gScore, current) + cost

				if (tentativeG < score(gScore, neighbor)) {
					cameFrom.set(neighbor, current)
					gScore.set(neighbor, tentativeG)
					fScore.set(
						neighbor,
						tentativeG + this.heuristicDistance(neighbor, endTile)
					)
					openSet.add(neighbor)
				}
			}
		}
	}
	getTile(x, y, z){
		return this.tiles.find(tile => tile.x === x && tile.y === y && tile.z === z)
	}
}

class TerrainTile {
	constructor(x, y, z) {
		this.type = "basic"
		this.x = x
		this.y = y
		this.z = z
		this.worldPosition = {
			x: x,
			y: y,
			z: z
		}
		this.connectionCosts = new Map()
		this.connections = []
		this.occupyingCharacter = null
	}
	isOccupied(){
		return this.occupyingCharacter
	}
}