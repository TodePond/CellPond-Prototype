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
void scale(int x, int y);
void translate(int x, int y);

//======//
// CELL //
//======//
typedef struct SingleCell SingleCell;
typedef struct MultiCell MultiCell;
typedef struct AnyCell AnyCell;
typedef union Cell Cell;

struct SingleCell {
	bool isSingle;
	uint8_t r;
	uint8_t g;
	uint8_t b;
	uint8_t a;
};

struct MultiCell {
	bool isSingle;
	size_t width;
	size_t height;
	Cell *cells;
};

struct AnyCell {
	bool isSingle;
};

union Cell {
	SingleCell single;
	MultiCell multi;
	AnyCell any;
};

//=======//
// DEBUG //
//=======//
int greet() {
	return 42;
}

//============//
// HAPPENINGS //
//============//
Cell world;

int screenWidth;
int screenHeight;

void setup() {
	world.single.isSingle = true;
	world.single.r = 70;
	world.single.g = 255;
	world.single.b = 128;
	world.single.a = 255;
}

void drawCell(Cell cell) {
	if (cell.any.isSingle) {
		setFillStyle(cell.single.r, cell.single.g, cell.single.b, cell.single.a);
		fillRect(0, 0, screenWidth, screenHeight);
	}
	else {

		print(sizeof(cell.multi.width));
		//for (int i = 0; i < cell.contents)

		setFillStyle(100, 100, 100, 255);
		fillRect(0, 0, 100, 100);
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
	if (cell->any.isSingle) {
		if (cell->single.a > 0) {
			cell->single.a -= 1;

			Cell array[2];

			array[0].any.isSingle = true;
			array[0].single.r = cell->single.r;
			array[0].single.r = cell->single.g;
			array[0].single.r = cell->single.b;
			array[0].single.r = cell->single.a;

			array[1].any.isSingle = true;
			array[1].single.r = 70;
			array[1].single.r = 128;
			array[1].single.r = 255;
			array[1].single.r = 255;

			cell->any.isSingle = false;
			cell->multi.cells = array;

		}
	}
	else {


	}
}

void update() {
	updateCell(&world);
}
