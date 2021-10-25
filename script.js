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

	setInterval(tick, 1000 / 20)
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

let paused = true
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

const CAMERA_ZOOM_SPEED = 0.075
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

const BLACK = "000"
const GREY = "112"
const SILVER = "556"
const WHITE = "999"
const GREEN = "293"
const RED = "911"
const BLUE = "239"
const YELLOW = "961"
const ORANGE = "931"
const PINK = "934"
const CYAN = "269"
const PURPLE = "419"

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
	tickTock = !tickTock
}

let tickTock = true
const updateCell = (cell) => {

	if (cell.isMulti) {
		/*for (let i = 0; i < cell.content.length; i++) {
			const subcell = cell.content[i]
			updateCell(subcell)
		}*/
		/*for (let i = cell.content.length-1; i >= 0; i--) {
			const subcell = cell.content[i]
			updateCell(subcell)
		}*/
		/*if (tickTock) {
			for (let i = 0; i < cell.content.length; i++) {
				const subcell = cell.content[i]
				updateCell(subcell)
			}
		}
		else {
			for (let i = cell.content.length-1; i >= 0; i--) {
				const subcell = cell.content[i]
				updateCell(subcell)
			}
		}*/
		//const shuffledSubCells = [...cell.content].shuffle()
		/*for (let i = shuffledSubCells.length-1; i >= 0; i--) {
			const subcell = shuffledSubCells[i]
			updateCell(subcell)
		}*/
		/*for (let i = 0; i < shuffledSubCells.length; i++) {
			const subcell = shuffledSubCells[i]
			updateCell(subcell)
		}*/
		for (let i = 0; i < cell.content.length; i++) {
			const c = Random.Uint8 % cell.content.length
			const subcell = cell.content[c]
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
		//potentialBehaves.push({behave, func: setCellCode})
		setCellCode(cell, behave)
		//return
	}

	//=====//
	// 1x2 //
	//=====//
	let flipped12 = oneIn(2)
	{
		const code12 = getWindow12(cell, flipped12)
		const behave12 = BEHAVES.get(code12)
		if (behave12 !== undefined) {
			setWindow12(cell, behave12, flipped12)
			//return
		}
	}
	
	//=====//
	// 2x1 //
	//=====//
	let flipped = oneIn(2)
	{
		const code21 = getWindow21(cell, flipped)
		const behave21 = BEHAVES.get(code21)
		if (behave21 !== undefined) {
			//code21.d
			setWindow21(cell, behave21, flipped)
			//return
		}
	}
	/*{
		const code21 = getWindow21(cell, !flipped)
		const behave21 = BEHAVES.get(code21)
		if (behave21 !== undefined) {
			setWindow21(cell, behave21, !flipped)
			//return
		}
	}*/

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

const getWindow12 = (cell, flipped) => {
	
	if (flipped) {
		const originCode = getCellCode(cell)
		const above = getAbove(cell)
		if (above === undefined) return
	
		const aboveCode = getCellCode(above)
		
		const code = "(1:" + aboveCode + "," + originCode + ")"
		return code
	}


	const originCode = getCellCode(cell)
	const below = getBelow(cell)
	if (below === undefined) return

	const belowCode = getCellCode(below)
	
	const code = "(1:" + originCode + "," + belowCode + ")"
	return code
}

const getWindow21 = (cell, flipped) => {
	
	if (flipped) {
		const originCode = getCellCode(cell)
		const left = getLeft(cell)
		if (left === undefined) return

		const leftCode = getCellCode(left)
		
		const code = "(2:" + leftCode + "," + originCode + ")"
		return code
	}

	const originCode = getCellCode(cell)
	const right = getRight(cell)
	if (right === undefined) return

	const rightCode = getCellCode(right)
	
	const code = "(2:" + originCode + "," + rightCode + ")"
	return code
}

const getAbove = (cell) => {
	if (cell.parent === undefined) return
	if (!cell.parent.isMulti) return
	//if (cell.content.length <= cell.parent.width) return
	const position = cell.parent.content.indexOf(cell)
	const height = cell.parent.content.length / cell.parent.width
	const isInTopRow = position % height === 0

	if (isInTopRow) {
		if (cell.parent.parent === undefined) return

		const pabove = getAbove(cell.parent)
		if (pabove === undefined) return
		if (!pabove.isMulti) return
		if (pabove.width !== cell.parent.width) return
		if (pabove.content.length !== pabove.content.length) return
		
		const abovePosition = position + height - 1
		const above = pabove.content[abovePosition]

		return above
	}

	const abovePosition = position - 1
	const above = cell.parent.content[abovePosition]
	return above

} 

const getBelow = (cell) => {
	if (cell.parent === undefined) return
	if (!cell.parent.isMulti) return
	//if (cell.content.length <= cell.parent.width) return
	const position = cell.parent.content.indexOf(cell)
	const height = cell.parent.content.length / cell.parent.width
	const isInBottomRow = position % height === 1

	if (isInBottomRow) {
		if (cell.parent.parent === undefined) return

		const pbelow = getBelow(cell.parent)
		if (pbelow === undefined) return
		if (!pbelow.isMulti) return
		if (pbelow.width !== cell.parent.width) return
		if (pbelow.content.length !== pbelow.content.length) return
		
		const belowPosition = position - height + 1
		const below = pbelow.content[belowPosition]

		return below
	}

	const belowPosition = position + 1
	const below = cell.parent.content[belowPosition]
	return below

}

const getLeft = (cell, bug=false) => {
	if (cell.parent === undefined) return
	if (!cell.parent.isMulti) return
	//if (cell.content.length <= cell.parent.width) return
	const position = cell.parent.content.indexOf(cell)
	const height = cell.parent.content.length / cell.parent.width
	const isInleftRow = position < height

	if (bug) {
		//print(position, isInRightRow)
		//print(cell)
	}


	if (isInleftRow) {
		
		if (cell.parent.parent === undefined) return
		if (cell.content[2] === 9) {
			//print(cell.parent)
			//print(pright)
			bug = true
		}

		const pleft = getLeft(cell.parent, bug)
		
		if (pleft === undefined) return
		
		if (!pleft.isMulti) return
		if (pleft.width !== cell.parent.width) return
		if (pleft.content.length !== pleft.content.length) return
		
		const leftPosition = (pleft.width-1)*height + position
		const left = pleft.content[leftPosition]
		
		/*if (cell.content[2] === 9) {

			print(position, "=>", rightPosition)
		}*/

		return left
	}

	const leftPosition = position - height
	const left = cell.parent.content[leftPosition]
	return left

}

const getRight = (cell, bug=false) => {
	if (cell.parent === undefined) return
	if (!cell.parent.isMulti) return
	//if (cell.content.length <= cell.parent.width) return
	const position = cell.parent.content.indexOf(cell)
	const height = cell.parent.content.length / cell.parent.width
	const isInRightRow = position >= cell.parent.content.length - height

	if (bug) {
		//print(position, isInRightRow)
		//print(cell)
	}


	if (isInRightRow) {
		
		if (cell.parent.parent === undefined) return
		if (cell.content[2] === 9) {
			//print(cell.parent)
			//print(pright)
			bug = true
		}

		const pright = getRight(cell.parent, bug)
		
		if (pright === undefined) return
		
		if (!pright.isMulti) return
		if (pright.width !== cell.parent.width) return
		if (pright.content.length !== pright.content.length) return
		
		const rightPosition = position - (pright.width-1)*height
		const right = pright.content[rightPosition]
		
		/*if (cell.content[2] === 9) {

			print(position, "=>", rightPosition)
		}*/

		return right
	}

	const rightPosition = position + height
	const right = cell.parent.content[rightPosition]
	return right

}

const setWindow12 = (cell, value, flipped) => {
	const dummy = generateCell(value)

	if (!flipped) {

		const dorigin = dummy.content[0]
		const dbelow = dummy.content[1]
		cell.content = dorigin.content
		cell.isMulti = dorigin.isMulti
		cell.width = dorigin.width

		const below = getBelow(cell)
		below.content = dbelow.content
		below.isMulti = dbelow.isMulti
		below.width = dbelow.width
	}
	else {
		
		const dorigin = dummy.content[0]
		const dabove = dummy.content[1]
		cell.content = dabove.content
		cell.isMulti = dabove.isMulti
		cell.width = dabove.width

		const above = getAbove(cell)
		above.content = dorigin.content
		above.isMulti = dorigin.isMulti
		above.width = dorigin.width
	}

}

const setWindow21 = (cell, value, flipped) => {
	const dummy = generateCell(value)


	if (flipped) {
		
		const dorigin = dummy.content[0]
		const dleft = dummy.content[1]

		cell.content = dleft.content
		cell.isMulti = dleft.isMulti
		cell.width = dleft.width

		const left = getLeft(cell)
		left.content = dorigin.content
		left.isMulti = dorigin.isMulti
		left.width = dorigin.width
	}
	else {
		
		const dorigin = dummy.content[0]
		const dright = dummy.content[1]

		cell.content = dorigin.content
		cell.isMulti = dorigin.isMulti
		cell.width = dorigin.width

		const right = getRight(cell)
		right.content = dright.content
		right.isMulti = dright.isMulti
		right.width = dright.width
	}

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
let DROP = "253"

const BEHAVES = new Map()
/*BEHAVES.set("911", "(2:293,239)")
BEHAVES.set("293", "(1:911,239)")*/

// FRACTAL ZTUFF
world.content = [2, 5, 3]
for (let i = 9; i > 1; i--) {
	const nr = Math.max(i - 1, 0)
	//BEHAVES.set(`${nr}12`, `(2:${nr}12,${nr}12),${nr}11,${nr}12)`)
	BEHAVES.set(`2${i}3`, `(2:2${nr}3,2${nr}3,239,2${nr}3)`)
}

// WORLD GEN!!!
/*world.content = [7, 1, 2]
for (let r = 9; r > 1; r--) {
	const nr = Math.max(r - 1, 0)
	BEHAVES.set(`${r}12`, `(2:${nr}12,${nr}12),${nr}12,${nr}12)`)
}*/

// SAND FALL
BEHAVES.set("(1:961,112)", "(1:112,961)")
BEHAVES.set("(1:961,239)", "(1:239,961)")

// WATER FALL
BEHAVES.set("(1:239,112)", "(1:112,239)")
BEHAVES.set("(2:239,112)", "(2:112,239)")
BEHAVES.set("(2:112,239)", "(2:239,112)")

