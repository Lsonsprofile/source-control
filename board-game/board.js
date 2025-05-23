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
            const rollDuration = 5000; // 5 seconds
            const rollInterval = 100; // milliseconds between number changes
            const startTime = Date.now();
            
            // Animate dice rolling
            const rollAnimation = setInterval(() => {
                const elapsed = Date.now() - startTime;
                if (elapsed >= rollDuration) {
                    clearInterval(rollAnimation);
                    finishRoll();
                    // Keep the roll button disabled after animation
                    // Remove the line below if you want to keep it disabled permanently
                    document.getElementById('start-game').disabled = false;
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
            
            // Keep the roll button disabled after animation
            document.getElementById('start-game').disabled = true;
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