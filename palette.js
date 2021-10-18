//=======//
// SETUP //
//=======//
const canvas = document.createElement("canvas")
const context = canvas.getContext("2d")
canvas.style["background-color"] = Colour.Grey
canvas.style["margin"] = 0

let c = {}
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
let firstLoad = true
on.resize(() => {
	canvas.width = document.body.clientWidth
	canvas.height = document.body.clientHeight
	canvas.style["width"] = canvas.width
	canvas.style["height"] = canvas.height
	if (!firstLoad) fullDraw()
	firstLoad = false
})

let paused = true
on.keydown(e => {
	if (e.key === " ") {
		paused = !paused
	}
})

//===========//
// GAME LOOP //
//===========//
const reds = [0, 23, 55, 70, 102, 128, 159, 178, 204, 242, 255]
const greens = [0, 29, 51, 67, 102, 128, 153, 174, 204, 245, 255]
const blues = [0, 26, 40, 77, 98, 128, 153, 179, 201, 247, 255]
const alphas = [0, 26, 51, 77, 102, 128, 153, 179, 204, 230, 255]

const RECT_SIZE = 20

const tick = () => {
	if (!paused) {
		drawer.next()
	}
}

const fullDraw = () => {
	const d = draw()
	context.clearRect(0, 0, canvas.width, canvas.height)
	while (d.next().value !== "finished") {
		
	}
}

const draw = function*() {
	context.clearRect(0, 0, canvas.width, canvas.height)
	for (let r = 0; r < reds.length; r++) for (let g = 0; g < greens.length; g++) for (let b = 0; b < blues.length; b++) {
		const red = reds[r]
		const green = greens[g]
		const blue = blues[b]
		context.fillStyle = `rgb(${red}, ${green}, ${blue})`

		//let y = g * RECT_SIZE
		//let x = b * RECT_SIZE + r * RECT_SIZE*11
		/*while (x+RECT_SIZE > document.body.clientWidth) {
			y += RECT_SIZE*11
			x -= document.body.clientWidth
			
		}*/

		let scale = 1.0
		let d = RECT_SIZE
		d += r * RECT_SIZE * scale

		let x = g * d
		let y = b * d


		let movement = 0.7

		x += r * d * movement
		y += r * d * movement


		context.fillRect(x, y, d, d)
		yield
	}
	return "finished"
}

const drawer = draw()