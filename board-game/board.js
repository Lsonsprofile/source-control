// Select the element with id 'red-1'
const redCircle = document.getElementById('red-1');

// Add a circle content into the box
const circleContent = document.createElement('div');
circleContent.style.width = '38px'; // Set the width of the circle
circleContent.style.height = '38px'; // Set the height of the circle
circleContent.style.backgroundColor = 'red'; // Set the background color
circleContent.style.borderRadius = '50%'; // Make it a circle
circleContent.style.display = 'block'; // Ensure it displays properly

redCircle.appendChild(circleContent); // Add the circle content into the box



// Select the button with id 'start-game'
const startGameButton = document.getElementById('start-game');

// Initialize the current cell index
let currentCellIndex = 1;

// Add a click event listener to the button
startGameButton.addEventListener('click', () => {
    // Check if the current cell index is less than 15
    if (currentCellIndex < 15) {
        // Get the current cell and the next cell
        const currentCell = document.getElementById(`red-${currentCellIndex}`);
        const nextCell = document.getElementById(`red-${currentCellIndex + 1}`);

        // Move the circle content to the next cell
        if (currentCell && nextCell) {
            const circleContent = currentCell.querySelector('div');
            if (circleContent) {
                currentCell.removeChild(circleContent);
                nextCell.appendChild(circleContent);
            }
        }

        // Increment the current cell index
        currentCellIndex++;
    }
});