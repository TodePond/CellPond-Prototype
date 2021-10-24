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

	c = await loadWasm("script.wasm", environment)
	c.setup()
	setInterval(tick, 1000 / 2)

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
	c.resize(document.body.clientWidth, document.body.clientHeight)
	draw()
})

let paused = false
on.keydown(e => {
	if (e.key === " ") {
		paused = !paused
	}
})

//===========//
// GAME LOOP //
//===========//
const tick = () => {
	if (!paused) {
		update()
		draw()
	}
}

const update = () => {
	c.update()
}

const draw = () => {
	c.draw()
}
