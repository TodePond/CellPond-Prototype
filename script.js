//=======//
// SETUP //
//=======//
const canvas = document.createElement("canvas")
const context = canvas.getContext("2d")
canvas.style["background-color"] = Colour.Grey
canvas.style["margin"] = 0

on.load(async () => {

	document.body.style["background-color"] = Colour.Black
	document.body.style["margin"] = 0
	document.body.style["overflow"] = "hidden"
	document.body.appendChild(canvas)

	setInterval(tick, 1000 / 2)
	setInterval(draw, 1000 / 60)

	trigger("resize")
})

//================//
// UI SHENANIGENS //
//================//
on.resize(() => {
	canvas.width = document.body.clientWidth
	canvas.height = document.body.clientHeight
	canvas.style["width"] = canvas.width
	canvas.style["height"] = canvas.height
	draw()
})

let paused = false
on.keydown(e => {
	if (e.key === " ") {
		paused = !paused
	}
})

const camera = {
	x: 0,
	y: 0,
	scale: 1.0,
}

on.mousemove(e => {
	if (Mouse.Right) {
		camera.x += e.movementX
		camera.y += e.movementY
		updateDropperPosition()
		//draw()
	}
})

const CAMERA_ZOOM_SPEED = 0.05
on.mousewheel(e => {
	if (e.deltaY > 0) {
		const zoom = (camera.scale - camera.scale * (1 - CAMERA_ZOOM_SPEED))
		camera.scale -= zoom

		camera.x += zoom * dropper.x
		camera.y += zoom * dropper.y
	}
	else {
		const zoom = (camera.scale - camera.scale * (1 - CAMERA_ZOOM_SPEED))
		camera.scale += zoom

		camera.x -= zoom * dropper.x
		camera.y -= zoom * dropper.y
		
	}
	updateDropperPosition()
	//draw()
})

on.contextmenu(e => {
	e.preventDefault()
})

//=================//
// DRAWING USEFULS //
//=================//
const REDS   = [23, 55, 70,  98, 128, 159, 174, 204, 242, 255]
const GREENS = [29, 67, 98, 128, 159, 174, 204, 222, 245, 255]
const BLUES  = [40, 70, 98, 128, 159, 174, 201, 222, 247, 255]

const COLOUR_BLACK = [0, 0, 0]
const COLOUR_GREY = [1, 1, 2]
const COLOUR_SILVER = [5, 5, 6]
const COLOUR_WHITE = [9, 9, 9]
const COLOUR_GREEN = [2, 9, 3]
const COLOUR_RED = [9, 1, 1]
const COLOUR_BLUE = [2, 3, 9]
const COLOUR_YELLOW = [9, 6, 1]
const COLOUR_ORANGE = [9, 3, 1]
const COLOUR_PINK = [9, 3, 4]
const COLOUR_CYAN = [2, 6, 9]
const COLOUR_PURPLE = [4, 1, 9]

const makeColourStyle = ([R, G, B]) => {
	const r = REDS[R]
	const g = GREENS[G]
	const b = BLUES[B]
	const style = "rgb(" + r + "," + g + "," + b + ")"
	return style
}

let prevR = undefined
let prevG = undefined
let prevB = undefined
let prevStyle = undefined
const setColourFillStyle = ([R, G, B]) => {
	if (R === prevR && G === prevG && B === prevB) {
		return
	}
	prevR = R
	prevG = G
	prevB = B
	const style = makeColourStyle([R, G, B])
	context.fillStyle = style
	prevStyle = style
	return style
}

//============//
// WORLD DATA //
//============//
const makeCell = (content = [0, 0, 0], isMulti = false, width = 1) => {
	const cell = {
		isMulti,
		content,
		width,
	}
	return cell
}

const world = makeCell([9, 1, 1], false)
/*const world = {
	isMulti: true,
	width: 2,
	content: [
		makeCell(COLOUR_RED),
		makeCell(COLOUR_BLUE),
	]
}*/

//===========//
// GAME LOOP //
//===========//
let dropper = {
	x: undefined,
	y: undefined,
}

const tick = () => {
	//updateDropperPosition()
	if (!paused) {
		update()
	}
	//draw()
}

const update = () => {
	updateCell(world)
}

const updateCell = (cell) => {

	if (cell.isMulti) {
		for (const subcell of cell.content) {
			updateCell(subcell)
		}
		return
	}
	
	//=====//
	// 1x1 //
	//=====//
	const code = getCellCode(cell)
	const behave = BEHAVES.get(code)
	if (behave === undefined) return
	setCellCode(cell, behave)

}

const setCellCode = (cell, code) => {

	const newCell = generateCell(code)
	cell.isMulti = newCell.isMulti
	cell.width = newCell.width
	cell.content = newCell.content
		
}

const generateCell = (code) => {
	const cell = {}

	if (code.length === 3) {
		cell.isMulti = false
		cell.content = code.split("").map(c => parseInt(c))
		return cell
	}

	const [header, ...tails] = code.split(":")
	const width = parseInt(header.slice(1))
	const tail = tails.join(":")
	let codes = []
	let depth = 0
	for (let i = 0; i < tail.length; i++) {
		const c = tail[i]
		if (depth <= 0 && c === ",") {
			codes.push("")
			continue
		}
		if (c === "(") {
			depth++
		}
		if (c === ")") {
			depth--
			if (depth < 0) continue
		}
		if (codes.length === 0) codes.push("")
		codes[codes.length-1] += c
	}

	const content = codes.map(c => generateCell(c))

	cell.isMulti = true
	cell.width = width
	cell.content = content
	return cell

}

const getCellCode = (cell) => {
	if (!cell.isMulti) {
		return "" + cell.content[0] + cell.content[1] + cell.content[2]
	}
	else {
		const width = cell.width
		return "(" + width + cell.content.map(c => getCellCode(c)) + ")"
	}
}

const updateDropperPosition = () => {
	const [dx, dy] = getDropperPosition()
	dropper.x = dx
	dropper.y = dy
}

const getDropperPosition = () => {
	const [mx, my] = Mouse.position
	const [sx, sy] = [(mx-camera.x) / camera.scale, (my-camera.y) / camera.scale]
	return [sx, sy]
}

const draw = () => {
	updateDropperPosition()
	context.resetTransform()
	context.clearRect(0, 0, canvas.width, canvas.height)

	context.translate(camera.x, camera.y)
	context.scale(camera.scale, camera.scale)

	drawCell(world)

	context.scale(1/camera.scale, 1/camera.scale)
	context.translate(-camera.x, -camera.y)
}

const CELL_MARGIN = 0.02
const CELL_SIZE = 1000
const CELL_MARGIN_SIZE = CELL_MARGIN * CELL_SIZE

let prevFillStyle = undefined
const drawCell = (cell, ox=0, oy=0) => {
	if (!cell.isMulti) {
		setColourFillStyle(cell.content)
		context.fillRect(ox, oy, CELL_SIZE - CELL_MARGIN_SIZE, CELL_SIZE - CELL_MARGIN_SIZE)
	} else {

		const width = cell.width
		const height = cell.content.length / width

		// SHRINK subcells
		context.scale(1/width, 1/height)

		let i = 0
		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {

				/*context.translate(CELL_SIZE/2, CELL_SIZE/2)
				context.scale(1-CELL_MARGIN, 1-CELL_MARGIN)
				context.translate(-CELL_SIZE/2, -CELL_SIZE/2)*/
				drawCell(cell.content[i])
				/*context.translate(CELL_SIZE/2, CELL_SIZE/2)
				context.scale(1/(1-CELL_MARGIN), 1/(1-CELL_MARGIN))
				context.translate(-CELL_SIZE/2, -CELL_SIZE/2)*/

				context.translate(0, CELL_SIZE)
				i++
			}
			context.translate(CELL_SIZE, -CELL_SIZE*height)
		}
		context.translate(-CELL_SIZE*width, 0)

		// UnSHRINK subcells
		context.scale(width, height)

	}
}

const DROPPER_SIZE = 50
const drawDropper = () => {
	context.strokeStyle = "white"
	context.strokeRect(dropper.x - DROPPER_SIZE/2, dropper.y - DROPPER_SIZE/2, DROPPER_SIZE, DROPPER_SIZE)
}

//=========//
// BEHAVES //
//=========//
const BEHAVES = new Map()
/*BEHAVES.set("911", "(2:293,239)")
BEHAVES.set("293", "(1:911,239)")*/

world.content = [7, 9, 3]
for (let r = 9; r > 0; r--) {
	const nr = Math.max(r - 1, 0)
	BEHAVES.set(`${r}93`, `(2:${nr}93,${nr}93),${nr}93,${nr}93)`)
}

