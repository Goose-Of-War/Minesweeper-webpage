let ROWS = 12, COLS = 10, NMIN = 16;
let GRID = {}, F_CL = true; PLAY = false;

max = (a, b) => (a > b) ? a : b;
min = (a, b) => (a < b) ? a : b;
abs = (x) => (x >= 0) ? x : -x;
grd = (r, c) => GRID[`${r} ${c}`]

function first_click(row, col) {
	let mine_locn = [];
	while (mine_locn.length < NMIN) {
		let r = Math.floor(Math.random() * ROWS) + 1;
		let c = Math.floor(Math.random() * COLS) + 1;
		let check = true;
		if (abs(r - row) <= 1 && abs(c - col) <= 1) continue;
		for (let i=0; i<mine_locn.length; i++) {
			if (mine_locn[i][0] == r && mine_locn[i][1] == c) {
				check = false;
				break;
			}
		}
		if (check) mine_locn.push( [r, c] );
		GRID[`${r} ${c}`].mine = true;
	}
	console.log(mine_locn);
}

function click(row, col) {
	//no playing after game over
	if (!PLAY) {
		console.log("Click [Redo]");
		return;
	}
	//no clicking clicked button
	if (GRID[`${row} ${col}`].opened) {
		console.log("Repeated click");
		return;
	};
	console.log(`Clicked: (${row}, ${col})`);
	//if first time, initialization
	if (F_CL) {
		F_CL = false;
		first_click(row, col);
	}

	if (GRID[`${row} ${col}`].mine) {
		for (let r=1; r<ROWS; r++) {
			for (let c=1; c<COLS; c++) {
				if (!grd(r, c).flagged && grd(r, c).mine) {
					grd(r, c).btn.style.backgroundColor = "#d3d";
					grd(r, c).btn.innerHTML = "X";
				}
			}
		}
		PLAY = false;
		return;
	}

	let count = 0;
	for (let i = max(row-1, 1); i <= min(row+1, ROWS); i++){
		for (let j = max(col-1, 1); j <= min(col+1, COLS); j++) {
			if (GRID[`${i} ${j}`].mine && !(i == row && j == col)) count++;
		}
	}
	GRID[`${row} ${col}`].btn.innerHTML = `${count}`;
	GRID[`${row} ${col}`].neighbour = count;
}

//start button function
window.document.getElementById("init-button").onclick = () => {
	document.getElementById("init-button").innerHTML = "Redo";
	//remove old grid if any
	let old_grid = document.getElementById("grid-master");
	if (old_grid) {
		while (old_grid.hasChild) old_grid.removeChild(old_grid.firstChild);
		old_grid.parentElement.removeChild(old_grid);
	}
	for (let obj in GRID) delete GRID[obj];
	//make new grid
	let new_grid = document.createElement("div");
	new_grid.id = "grid-master";
	for (let row=0; row<ROWS; row++) {
		for (let col=0; col<COLS; col++) {
			//generate buttons and append them to grid element
			let grid_button = document.createElement("button");
			grid_button.className = "grid-button";
			grid_button.id = `${row} ${col}`;
			grid_button.onclick = () => click(row+1, col+1);
			grid_button.style.gridRow = row+1;
			grid_button.style.gridColumn = col+1;
			new_grid.appendChild(grid_button);
			//store button properties in GRID
			GRID[`${row+1} ${col+1}`] = {
				btn: grid_button,
				opened: false,
				flagged: false,
				mine: false
			}
		}
	}
	document.body.appendChild(new_grid);
	F_CL = true;
	PLAY = true;
}
