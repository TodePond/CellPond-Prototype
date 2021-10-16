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
	setInterval(tick, 1000 / 60)

	trigger("resize")
})

//==================//
// WASM ENVIRONMENT //
//==================//
const environment = {print}
environment.setFillStyle = (r, g, b, a) => context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
environment.fillRect = (...args) => context.fillRect(...args)
environment.clearRect = (...args) => context.clearRect(...args)

//==============//
// WASM USEFULS //
//==============//
const loadWasm = async (path, env) => {
	const response = await fetch(path)
	const wasm = await response.arrayBuffer()
	const {instance} = await WebAssembly.instantiate(wasm, {env})
	
	return instance.exports

	//imageDataBuffer = getWasmGlobal("imageData", {length: WORLD_AREA * 4, type: Uint8ClampedArray})
	//imageData = new ImageData(imageDataBuffer, WORLD_SIZE, WORLD_SIZE)
	
}

const getWasmGlobal = (name, {length=1, type=Int32Array}) => {
	const offset = c[name]
	return new type(c.memory.buffer, offset, length)
}

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

let paused = true
on.keydown(e => {
	if (e.key === " ") {
		paused = !paused
	}
})

//===========//
// GAME LOOP //
//===========//
const tick = () => {
	update()
	draw()
}

const update = () => {
	c.update()
}

const draw = () => {
	c.draw()
}
