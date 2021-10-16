#include <stdint.h>
#include <stdbool.h>
#include <stddef.h>

//==========//
// IMPORTED //
//==========//
void print(int message);
void fillRect(int x, int y, int width, int height);
void clearRect(int x, int y, int width, int height);
void setFillStyle(uint8_t r, uint8_t g, uint8_t b, uint8_t a);

//======//
// CELL //
//======//
typedef struct Colour Colour;
struct Colour {
	uint8_t r;
	uint8_t g;
	uint8_t b;
	uint8_t a;
};

typedef struct Cells Cells;
struct Cells {
	int *array;
	size_t width;
	size_t height;
};

typedef union Content Content;
union Content {
	Colour colour;
	Cells *cells;
};

typedef struct Cell Cell;
struct Cell {
	bool isColour;
	Content content;
};

//=======//
// DEBUG //
//=======//
int greet() {
	Colour red = {255, 70, 70, 255};
	Cells cells;
	Content content;
	fillRect(0, 0, 100, 100);
	return sizeof(content.colour);
}

//============//
// HAPPENINGS //
//============//
Cell world;


int screenWidth;
int screenHeight;

void setup() {
	world.isColour = true;
	world.content.colour.r = 70;
	world.content.colour.g = 255;
	world.content.colour.b = 128;
	world.content.colour.a = 255;
}

void drawCell(Cell cell) {
	if (cell.isColour) {
		setFillStyle(cell.content.colour.r, cell.content.colour.g, cell.content.colour.b, cell.content.colour.a);
		fillRect(0, 0, screenWidth, screenHeight);
	}
	else {

	}
}

void draw() {
	clearRect(0, 0, screenWidth, screenHeight);
	drawCell(world);
}

void resize(int width, int height) {
	screenWidth = width;
	screenHeight = height;
	draw();
}

void updateCell(Cell *cell) {
	if (cell->isColour) {
		if (cell->content.colour.a > 0) {
			cell->content.colour.r--;
			cell->content.colour.g--;
		}
	}
	else {

	}
}

void update() {
	updateCell(&world);
}
