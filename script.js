//=======//
// SETUP //
//=======//
const canvas = document.createElement("canvas")
const context = canvas.getContext("2d")
canvas.style["background-color"] = Colour.Black
canvas.style["margin"] = 0

on.load(async () => {

	document.body.style["background-color"] = Colour.Black
	document.body.style["margin"] = 0
	document.body.style["overflow"] = "hidden"
	document.body.appendChild(canvas)

	setInterval(tick, 1000 / 4)
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
	//drop()
	if (!paused) {
		update()
	}
	//draw()
}

let prevDropper = {
	x: undefined,
	y: undefined,
}
const drop = () => {
	if (!Mouse.Left) {
		prevDropper.x = dropper.x
		prevDropper.y = dropper.y
		return
	}
	if (prevDropper.x !== undefined) {
		const [dx, dy] = [dropper.x - prevDropper.x, dropper.y - prevDropper.y]
		const dmax = Math.max(Math.abs(dx), Math.abs(dy))
		if (dmax === 0) {
			//drop(mx, my)
			//dropperPreviousPosition = [mx, my]
			
			prevDropper.x = dropper.x
			prevDropper.y = dropper.y
			if (dropper.x >= CELL_SIZE || dropper.x < 0 || dropper.y >= CELL_SIZE || dropper.y < 0) {
				
			}
			else {
				dropInCell(world, dropper.x, dropper.y)
				return
			}
		}
		
		const [rx, ry] = [dx / dmax, dy / dmax]
		let [ix, iy] = [prevDropper.x, prevDropper.y]
		for (let i = 0; i < dmax; i++) {
			ix += rx
			iy += ry
			
			if (ix >= CELL_SIZE || ix < 0 || iy >= CELL_SIZE || iy < 0) {
				continue
			}
			dropInCell(world, ix, iy)
		}

	}
	prevDropper.x = dropper.x
	prevDropper.y = dropper.y
}

const dropInCell = (cell, x, y, sx = CELL_SIZE, sy = CELL_SIZE) => {

	if (cell === undefined) return

	if (!cell.isMulti) {
		setCellCode(cell, DROP)
		return
	}

	const width = cell.width
	const height = cell.content.length / width

	const ccx = x / sx * width
	const ccy = y / sy * height

	const cx = Math.floor(ccx)
	const cy = Math.floor(ccy)

	const cutX = ccx - cx
	const cutY = ccy - cy

	const nx = cutX * sx/width
	const ny = cutY * sy/height

	const subcell = cell.content[cx * width + cy]

	dropInCell(subcell, nx, ny, (sx/width), sy/height)

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
	if (behave !== undefined) {
		setCellCode(cell, behave)
		//return
	}

	//=====//
	// 1x2 //
	//=====//
	const code12 = getWindow12(cell)
	const behave12 = BEHAVES.get(code12)
	if (behave12 === undefined) {
		setWindow12(cell, behave12, 1, 2)
		//return
	}

}

const setCellCode = (cell, code) => {
	generateCell(code, cell)
}

const generateCell = (code, cell = {}, parent = cell.parent) => {

	if (code.length === 3) {
		cell.isMulti = false
		cell.content = code.split("").map(c => parseInt(c))
		cell.parent = parent
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

	const content = codes.map(c => generateCell(c, {}, cell))

	cell.isMulti = true
	cell.width = width
	cell.content = content

	return cell

}

const getWindow12 = (cell) => {
	
	const originCode = getCellCode(cell)
	const below = getBelow(cell)
	if (below === undefined) return

	const belowCode = getCellCode(below).d
	
	const code = "(1:" + originCode + "," + belowCode + ")"
	return code
}

const getBelow = (cell) => {
	if (cell.parent === undefined) return
	if (!cell.parent.isMulti) return
	if (cell.content.length <= cell.parent.width) return
	const position = cell.parent.content.indexOf(cell)
	const height = cell.parent.content.length / cell.parent.width
	const isInBottomRow = position % height === 1

	if (cell.content[0] === 9) {
		//print(isInBottomRow)
	}

	if (isInBottomRow) {
		//TODO: overlap other cell
		return
	}

	const belowPosition = position + 1
	const below = cell.parent.content[belowPosition]
	return below

}

const setWindow12 = (cell, value) => {

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
	drop()
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
const drawCell = (cell, ox=0, oy=0, sx=1, sy=1) => {
	if (!cell.isMulti) {
		setColourFillStyle(cell.content)
		context.fillRect(ox + CELL_MARGIN_SIZE*sx, oy + CELL_MARGIN_SIZE*sy, (CELL_SIZE - CELL_MARGIN_SIZE*2)*sx, (CELL_SIZE - CELL_MARGIN_SIZE*2)*sy)
	} else {

		const width = cell.width
		const height = cell.content.length / width

		// SHRINK subcells
		//context.scale(1/width, 1/height)
		let ssx = sx * 1/width
		let ssy = sy * 1/height

		let i = 0
		let oox = 0
		let ooy = 0
		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {

				drawCell(cell.content[i], ox + oox, oy + ooy, ssx, ssy)

				//if (y < height-1) context.translate(0, CELL_SIZE)
				ooy += CELL_SIZE*ssy

				i++
				
			}
			//const tx = x < width-1? CELL_SIZE : 0
			//context.translate(tx, -CELL_SIZE*(height-1))
			oox += CELL_SIZE*ssx
			ooy = 0
		}
		//context.translate(-CELL_SIZE*(width-1), 0)
		oox = 0

		// UnSHRINK subcells
		//context.scale(width, height)

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
let DROP = "961"

const BEHAVES = new Map()
/*BEHAVES.set("911", "(2:293,239)")
BEHAVES.set("293", "(1:911,239)")*/

// WORLD GEN!!!
world.content = [3, 1, 2]
for (let r = 9; r > 1; r--) {
	const nr = Math.max(r - 1, 0)
	BEHAVES.set(`${r}12`, `(2:${nr}12,${nr}12),${nr}12,${nr}12)`)
}

// FALL SAND!!!
BEHAVES.set("(1:961,112)", "(1:112,961)")
