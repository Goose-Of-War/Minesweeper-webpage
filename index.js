let ROWS = 12, COLS = 10, NMIN = 16;
let GRID = {};

function click(row, col) {
	console.log(row, ",", col);
}

//start button function
window.document.getElementById("init-button").onclick = () => {
	self.innerHTML = "Redo";
	//remove old grid if any
	let old_grid = document.getElementById("grid-master");
	if (old_grid) {
		while (old_grid.hasChild) old_grid.removeChild(old_grid.firstChild);
		old_grid.parentElement.removeChild(old_grid);
	}
	//make new grid
	let new_grid = document.createElement("div");
	new_grid.id = "grid-master";
	
	for (let row=0; row<ROWS; row++) {
		for (let col=0; col<COLS; col++) {
			//generate buttons and append them to grid element
			let grid_button = document.createElement("button");
			grid_button.className = "grid-button";
			grid_button.id = `${row} ${col}`;
			grid_button.onclick = () => click(row, col);
			grid_button.style.gridRow = row+1;
			grid_button.style.gridColumn = col+1;
			new_grid.appendChild(grid_button);
			//store button properties in GRID
			GRID[`${row} ${col}`] = {
				object: grid_button,
				opened: false,
				flagged: false,
				mine: false
			}
		}
	}
	document.body.appendChild(new_grid);
}
