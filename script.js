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

	setInterval(tick, 1000 / 60)

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
		draw()
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
	draw()
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

//const world = makeCell([0, 0, 0], false)
const world = {
	isMulti: true,
	width: 2,
	content: [
		makeCell(COLOUR_RED),
		makeCell(COLOUR_BLUE),
	]
}

//===========//
// GAME LOOP //
//===========//
let dropper = {
	x: undefined,
	y: undefined,
}

const tick = () => {
	if (!paused) {
		update()
		draw()
	}
}

const update = () => {
	updateDropperPosition()
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

	context.clearRect(0, 0, canvas.width, canvas.height)

	context.translate(camera.x, camera.y)
	context.scale(camera.scale, camera.scale)

	drawCell(world)

	context.scale(1/camera.scale, 1/camera.scale)
	context.translate(-camera.x, -camera.y)
}

const CELL_MARGIN = 0.02
const CELL_SIZE = 1000
const drawCell = (cell) => {
	if (!cell.isMulti) {
		const style = makeColourStyle(cell.content)
		context.fillStyle = style
		context.fillRect(0, 0, CELL_SIZE, CELL_SIZE)
	} else {

		const width = cell.width
		const height = cell.content.length / width
		context.scale(1/width, 1/height)

		let i = 0
		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {

				context.translate(CELL_SIZE/2, CELL_SIZE/2)
				context.scale(1-CELL_MARGIN, 1-CELL_MARGIN)
				context.translate(-CELL_SIZE/2, -CELL_SIZE/2)
				drawCell(cell.content[i])
				context.translate(CELL_SIZE/2, CELL_SIZE/2)
				context.scale(1/(1-CELL_MARGIN), 1/(1-CELL_MARGIN))
				context.translate(-CELL_SIZE/2, -CELL_SIZE/2)

				context.translate(0, CELL_SIZE)
				i++
			}
			context.translate(0, -CELL_SIZE*height)
			context.translate(CELL_SIZE, 0)
		}
		context.translate(-CELL_SIZE*width, 0)
		context.scale(width, height)

	}
}

const DROPPER_SIZE = 50
const drawDropper = () => {
	context.strokeStyle = "white"
	context.strokeRect(dropper.x - DROPPER_SIZE/2, dropper.y - DROPPER_SIZE/2, DROPPER_SIZE, DROPPER_SIZE)
}
