
const canvas = document.createElement("canvas")
const context = canvas.getContext("2d")
canvas.style["background-color"] = Colour.Grey
canvas.style["margin"] = 0

on.load(() => {
	document.body.style["background-color"] = Colour.Black
	document.body.style["margin"] = 0
	document.body.appendChild(canvas)
	trigger("resize")
})

const WORLD_WIDTH = 1000
const WORLD_HEIGHT = 1000

on.resize(() => {
	canvas.width = WORLD_WIDTH
	canvas.height = WORLD_HEIGHT
	canvas.style["width"] = 500
	canvas.style["height"] = 500
})

let paused = true
on.keydown(e => {
	if (e.key === " ") {
		paused = !paused
	}
})

const makeCell = ({colour=Colour.White, cells = [[]]} = {}) => {
	const cell = {colour, cells}
	return cell
}

const world = makeCell({
	colour: Colour.Blue,
	//cells: [[]],
	//cells: [[makeCell({colour: Colour.Green}), makeCell({colour: Colour.Red})], [makeCell({colour: Colour.Green}), makeCell({colour: Colour.Green})]],
})

const drawCell = (cell) => {
	if (cell.cells[0].length === 0) {
	
		context.fillStyle = cell.colour
		context.fillRect(0, 0, WORLD_HEIGHT, WORLD_WIDTH)
		context.strokeStyle = Colour.Grey
		context.lineWidth = 10
		context.strokeRect(0, 0, WORLD_HEIGHT, WORLD_WIDTH)
	}
	
	else {
		drawCells(cell.cells)
	}
}

const drawCells = (cells) => {
	
	const rowCount = cells.length
	const columnCount = cells[0].length
	
	const cellHeight = WORLD_HEIGHT / rowCount
	const cellWidth = WORLD_WIDTH / columnCount
	
	for (const row of cells) {
		
		context.scale(1, 1/rowCount)

		for (const cell of row) {
			context.scale(1/columnCount, 1)
			drawCell(cell)
			context.scale(columnCount, 1)
			context.translate(cellWidth, 0)
		}
		context.translate(-WORLD_WIDTH, 0)
		
		context.scale(1, rowCount)
		context.translate(0, cellHeight)
	}
	context.translate(0, -WORLD_HEIGHT)
}

updateCell = (cell) => {
	if (cell.colour === undefined) {
		for (const row of cell.cells) {
			for (const cell of row) {
				updateCell(cell)
			}
		}
		return
	}
	
	if (cell.colour === Colour.Red) {
		cell.colour = undefined
		cell.cells = [[
			makeCell({colour: Colour.Red}),
			makeCell({colour: Colour.White})
		]]
		return
	}
	
	if (cell.colour === Colour.Blue) {
		cell.colour = undefined
		cell.cells = [
			[makeCell({colour: Colour.Green}), makeCell({colour: Colour.Green})],
			[makeCell({colour: Colour.Blue}), makeCell({colour: Colour.Blue})],
		]
		return
	}
}

const tick = () => {
	if (!paused) {
		context.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
		drawCell(world)
		updateCell(world)
	}
	//requestAnimationFrame(tick)
}

//tick()

setInterval(tick, 1000)