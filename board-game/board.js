    const board = document.getElementById("grid-board");

    for (let i = 0; i < 225; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index = i;
      board.appendChild(cell);
    }

    // Example: Remove inner borders from a 3x3 box starting at cell index 11
    function getBoxIndexes(startIndex, boxSize, gridCols) {
  const indexes = [];
  for (let row = 0; row < boxSize; row++) {
    for (let col = 0; col < boxSize; col++) {
      indexes.push(startIndex + row * gridCols + col);
    }
  }
  return indexes;
}

function highlightBox(startIndex, boxSize, gridCols, color="rgb(112, 7, 7)") {
  const boxIndexes = getBoxIndexes(startIndex, boxSize, gridCols);
  
    boxIndexes.forEach((i) => {
      const cell = document.querySelector(`.cell[data-index="${i}"]`);
      if (cell) {
        // Remove all borders, then reapply outer box
        cell.style.border = "none";
 // Highlight the cell background where borders are removed
        cell.style.background = color;
      }
    });
    

     const topEdge = boxIndexes.slice(0, boxSize);
  const bottomEdge = boxIndexes.slice(-boxSize);
  const leftEdge = boxIndexes.filter((_, i) => i % boxSize === 0);
  const rightEdge = boxIndexes.filter((_, i) => (i + 1) % boxSize === 0);

  topEdge.forEach(i => document.querySelector(`.cell[data-index="${i}"]`).style.borderTop = "1px solid #030303");
  bottomEdge.forEach(i => document.querySelector(`.cell[data-index="${i}"]`).style.borderBottom = "1px solid #030303");
  leftEdge.forEach(i => document.querySelector(`.cell[data-index="${i}"]`).style.borderLeft = "1px solid #030303");
  rightEdge.forEach(i => document.querySelector(`.cell[data-index="${i}"]`).style.borderRight = "1px solid #030303");
}



highlightBox(0, 6, 15); // Example call
highlightBox(9, 6, 15, " rgb(4, 88, 4)");  
highlightBox(135, 6, 15, "rgb(2, 8, 87)");
highlightBox(144, 6, 15, "rgb(138, 95, 3)");


const cellColors = [
  //for the red cells 
  { idx: 91, color: "rgb(112, 7, 7)" },
  { idx: 106, color: "rgb(112, 7, 7)" },
  { idx: 107, color: "rgb(112, 7, 7)" },
  {idx: 108, color: "rgb(112, 7, 7)" },
     { idx: 109, color: "rgb(112, 7, 7)" },
     { idx: 110, color: "rgb(112, 7, 7)" },
  //For the green cells    
  { idx: 23, color: "rgb(4, 88, 4)" },
  { idx: 22, color: "rgb(4, 88, 4)" },
  { idx: 37, color: "rgb(4, 88, 4)" },
  { idx: 52, color: "rgb(4, 88, 4)" },
  { idx: 67, color: "rgb(4, 88, 4)" },
  { idx: 82, color: "rgb(4, 88, 4)" },
  //for the blue cells 
  { idx:201, color: "rgb(2, 8, 87)" },
  { idx:202, color: "rgb(2, 8, 87)" },
  { idx:201, color: "rgb(2, 8, 87)" },
  { idx:187, color: "rgb(2, 8, 87)" },
  { idx:172, color: "rgb(2, 8, 87)" },
  { idx:157, color: "rgb(2, 8, 87)" },
  { idx:142, color: "rgb(2, 8, 87)" },
  //for the yellow cells
  { idx:133, color: "rgb(138, 95, 3)" },
  { idx:118, color: "rgb(138, 95, 3)" },
  { idx:117, color: "rgb(138, 95, 3)" },
  { idx:116, color: "rgb(138, 95, 3)" },
  { idx:115, color: "rgb(138, 95, 3)" },
  { idx:114, color: "rgb(138, 95, 3)" },
];

cellColors.forEach(({ idx, color }) => {
  const cell = document.querySelector(`.cell[data-index="${idx}"]`);
  if (cell) cell.style.background = color;
});

const circleCell = document.querySelector('.cell[data-index="112"]');
if (circleCell) {
  circleCell.classList.add("cell-middle");
  circleCell.style.background = "linear-gradient(13deg, rgb(184, 182, 115), rgb(0, 247, 194), rgb(187, 255, 0))"; // Remove white background
  circleCell.style.border = "none";     // Remove border
}

[113, 111, 97, 127].forEach(idx => {
  const cell = document.querySelector(`.cell[data-index="${idx}"]`);
  if (cell) {
    cell.style.background = "linear-gradient(13deg, rgb(255, 0, 221), rgb(247, 0, 42), orange)";      // Keep background color
    cell.style.borderRadius = "10px";   // Keep border radius
  }
});
[128, 126, 96, 98, 127,].forEach(idx => {
  const cell = document.querySelector(`.cell[data-index="${idx}"]`);
  if (cell) {
    cell.style.background = "linear-gradient(13deg, rgb(255, 0, 221), rgb(247, 0, 42), orange)";      // Keep background color
  }
});

[19, 16, 61, 64].forEach(idx => {
  const cell = document.querySelector(`.cell[data-index="${idx}"]`);
  if (cell) {
    cell.classList.add("red-circle-a");
    cell.style.position = "relative";
  }
});
[199, 196,151,154].forEach(idx => {
  const cell = document.querySelector(`.cell[data-index="${idx}"]`);
  if (cell) {
    cell.classList.add("red-circle-b");
    cell.style.position = "relative";
  }
});
[25, 28, 70, 73].forEach(idx => {
  const cell = document.querySelector(`.cell[data-index="${idx}"]`);
  if (cell) {
    cell.classList.add("red-circle-c");
    cell.style.position = "relative";
  }
});
[205, 208, 160, 163].forEach(idx => {
  const cell = document.querySelector(`.cell[data-index="${idx}"]`);
  if (cell) {
    cell.classList.add("red-circle-d");
    cell.style.position = "relative";
  }
});






    const dice = document.querySelectorAll('.dice');
const rollBtn = document.getElementById('start-game');
let rollingInterval = null;

function rollDice(die) {
  // Random rotation values
  const x = Math.floor(Math.random() * 10 + 10) * 90;
  const y = Math.floor(Math.random() * 10 + 10) * 90;
  const z = Math.floor(Math.random() * 10) * 90;
  // Random result (1-6)
  const result = Math.floor(Math.random() * 6) + 1;
  // Apply rotation
  die.style.transform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
  // After animation completes, snap to correct face
  setTimeout(() => {
    switch(result) {
      case 1: die.style.transform = 'rotateX(0deg) rotateY(0deg)'; break;
      case 2: die.style.transform = 'rotateX(-90deg) rotateY(0deg)'; break;
      case 3: die.style.transform = 'rotateX(0deg) rotateY(90deg)'; break;
      case 4: die.style.transform = 'rotateX(0deg) rotateY(-90deg)'; break;
      case 5: die.style.transform = 'rotateX(90deg) rotateY(0deg)'; break;
      case 6: die.style.transform = 'rotateX(180deg) rotateY(0deg)'; break;
    }
  }, 300);
}

// Roll animation for both dice
function startRolling() {
  if (rollingInterval) return;
  rollBtn.disabled = true;
  rollingInterval = setInterval(() => {
    dice.forEach(die => rollDice(die));
  }, 200);
  // Stop after 2 seconds and show final result
  setTimeout(() => {
    clearInterval(rollingInterval);
    rollingInterval = null;
    dice.forEach(die => rollDice(die));
    rollBtn.disabled = false;
  }, 2000);
}

rollBtn.addEventListener('click', startRolling);
