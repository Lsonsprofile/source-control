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

// Select the element with class 'red-box'
const redBox = document.querySelector('.red-box');

// Add a circle content with a black background color into the box
const blackCircle = document.createElement('div');
blackCircle.style.width = '38px'; // Set the width of the circle
blackCircle.style.height = '38px'; // Set the height of the circle
blackCircle.style.backgroundColor = 'red'; // Set the background color
blackCircle.style.borderRadius = '50%'; // Make it a circle
blackCircle.style.display = 'block'; // Ensure it displays properly
blackCircle.style.position = 'absolute'; // Position it absolutely
blackCircle.style.top = '10%'; // Center it vertically
blackCircle.style.left = '10%'; // Center it horizontally
redBox.appendChild(blackCircle); // Add the circle content into the box




//dice can button craete value and value can be selected 
let dice1Value = 0;
        let dice2Value = 0;
        let sumValue = 0;
        let selectedDice = null;
        let isRolling = false;
        
        function rollDice() {
            if (isRolling) return;
            
            isRolling = true;
            document.getElementById('start-game').disabled = true;
            
            // Clear selection during rolling
            if (selectedDice) {
                document.getElementById(selectedDice === 1 ? 'dice1' : selectedDice === 2 ? 'dice2' : 'sum').classList.remove('selected');
                selectedDice = null;
            }
            
            // Disable all dice during rolling
            document.getElementById('dice1').classList.add('disabled');
            document.getElementById('dice2').classList.add('disabled');
            document.getElementById('sum').classList.add('disabled');
            
            // Animation duration
            const rollDuration = 500; // milliseconds
            const rollInterval = 100; // milliseconds between number changes
            const startTime = Date.now();
            
            // Animate dice rolling
            const rollAnimation = setInterval(() => {
                const elapsed = Date.now() - startTime;
                if (elapsed >= rollDuration) {
                    clearInterval(rollAnimation);
                    finishRoll();
                    return;
                }
                
                // Generate random numbers for animation
                const tempDice1 = Math.floor(Math.random() * 6) + 1;
                const tempDice2 = Math.floor(Math.random() * 6) + 1;
                const tempSum = tempDice1 + tempDice2;
                
                document.getElementById('dice1').textContent = tempDice1;
                document.getElementById('dice2').textContent = tempDice2;
                document.getElementById('sum').textContent = tempSum;
            }, rollInterval);
        }
        
        function finishRoll() {
            // Generate final dice values
            dice1Value = Math.floor(Math.random() * 6) + 1;
            dice2Value = Math.floor(Math.random() * 6) + 1;
            sumValue = dice1Value + dice2Value;
            
            // Update display with final values
            document.getElementById('dice1').textContent = dice1Value;
            document.getElementById('dice2').textContent = dice2Value;
            document.getElementById('sum').textContent = sumValue;
            
            // Re-enable dice selection
            document.getElementById('dice1').classList.remove('disabled');
            document.getElementById('dice2').classList.remove('disabled');
            document.getElementById('sum').classList.remove('disabled');
            
            // Re-enable roll button
            document.getElementById('start-game').disabled = false;
            isRolling = false;
            
            // Re-apply any previous selection logic if needed
            if (selectedDice) {
                selectDice(selectedDice);
            }
        }
        
        function selectDice(diceNumber) {
            if (isRolling) return;
            
            // Clear previous selection
            if (selectedDice) {
                document.getElementById(selectedDice === 1 ? 'dice1' : selectedDice === 2 ? 'dice2' : 'sum').classList.remove('selected');
                
                // Re-enable all dice
                document.getElementById('dice1').classList.remove('disabled');
                document.getElementById('dice2').classList.remove('disabled');
                document.getElementById('sum').classList.remove('disabled');
            }
            
            // If clicking the same dice again, deselect it
            if (selectedDice === diceNumber) {
                selectedDice = null;
                return;
            }
            
            // Set new selection
            selectedDice = diceNumber;
            const selectedElement = document.getElementById(diceNumber === 1 ? 'dice1' : diceNumber === 2 ? 'dice2' : 'sum');
            selectedElement.classList.add('selected');
            
            // Apply disable logic based on selection
            if (diceNumber === 1) {
                document.getElementById('sum').classList.add('disabled');
            } else if (diceNumber === 2) {
                document.getElementById('sum').classList.add('disabled');
            } else if (diceNumber === 3) {
                document.getElementById('dice1').classList.add('disabled');
                document.getElementById('dice2').classList.add('disabled');
            }
        }