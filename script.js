// Word Puzzle Game - Script
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const gameBoard = document.querySelector('.gameboard');
    const letters = document.querySelectorAll('.letter');
    const currentWordDisplay = document.getElementById('current-word');
    const shuffleButton = document.getElementById('shuffle-button');
    const clearButton = document.getElementById('clear-button');
    const scoreDisplay = document.getElementById('score');
    const foundCountDisplay = document.getElementById('found-count');
    const totalCountDisplay = document.getElementById('total-count');
    const foundWordsByOrder = document.getElementById('words-by-order');
    const tabButtons = document.querySelectorAll('.foundwords-tab');
    const listByOrder = document.querySelector('.foundwords-list-by-order');
    const listByLength = document.querySelector('.foundwords-list-by-length');
    const words4Letter = document.getElementById('words-4-letter');
    const words6Letter = document.getElementById('words-6-letter');
    const words7Letter = document.getElementById('words-7-letter');
    const words8Letter = document.getElementById('words-8-letter');

    // Valid words for the game (the ones that can be found)
    const validWords = ['POST', 'BUTIKK', 'VALLDAL', 'BUNNPRIS'];

    // Game data placeholder
    const gameData = {
        score: 0,
        foundWords: [],
        totalWords: validWords.length, // Total number of words to find
        currentSelection: []
    };

    // Display total word count
    totalCountDisplay.textContent = gameData.totalWords;

    // Don't create score element as it's now in HTML
    
    // Set length tab as active by default
    tabButtons.forEach(tab => {
        if (tab.dataset.sort === 'length') {
            tab.classList.add('active');
        } else {
            tab.remove(); // Remove the "order" tab
        }
    });
    
    // Show only length list and hide order list
    listByOrder.classList.add('hidden');
    listByLength.classList.remove('hidden');

    // Event listeners for buttons
    shuffleButton.addEventListener('click', function() {
        shuffleBoard();
    });

    clearButton.addEventListener('click', function() {
        clearSelection();
    });

    // Event listeners for letter tiles
    letters.forEach(letter => {
        letter.addEventListener('click', function() {
            handleLetterSelection(this);
        });
    });

    // Function to handle letter selection
    function handleLetterSelection(letterElement) {
        const letterText = letterElement.querySelector('.letter__label').textContent;
        const position = letterElement.dataset.position;
        
        // Check if letter is already selected
        if (letterElement.classList.contains('selected')) {
            // Allow unselecting any letter regardless of selection order
            const selectionIndex = gameData.currentSelection.findIndex(item => item.position === position);
            if (selectionIndex !== -1) {
                // Remove from selection array
                gameData.currentSelection.splice(selectionIndex, 1);
                letterElement.classList.remove('selected');
                updateCurrentWordDisplay();
            }
            return;
        }
        
        // Add letter to selection
        letterElement.classList.add('selected');
        gameData.currentSelection.push({
            letter: letterText,
            element: letterElement,
            position: position
        });
        
        // Update word display
        updateCurrentWordDisplay();
        
        // Check if word is valid after each selection
        validateWord();
    }
    
    // Function to update the current word display
    function updateCurrentWordDisplay() {
        currentWordDisplay.innerHTML = '';
        
        if (gameData.currentSelection.length === 0) {
            return;
        }
        
        gameData.currentSelection.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.letter;
            li.style.fontWeight = 'bold'; // Make the selected word bold
            currentWordDisplay.appendChild(li);
        });
    }
    
    // Function to clear the current selection
    function clearSelection() {
        gameData.currentSelection.forEach(item => {
            item.element.classList.remove('selected');
        });
        
        gameData.currentSelection = [];
        updateCurrentWordDisplay();
    }

    // Function to shuffle the letters on the board
    function shuffleBoard() {
        const letterElements = Array.from(letters);
        const labelContents = letterElements.map(letter => letter.querySelector('.letter__label').textContent);
        
        // Fisher-Yates shuffle algorithm
        for (let i = labelContents.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [labelContents[i], labelContents[j]] = [labelContents[j], labelContents[i]];
        }
        
        // Update the letter labels with the shuffled content
        letterElements.forEach((letter, index) => {
            letter.querySelector('.letter__label').textContent = labelContents[index];
        });
        
        // Clear any existing selection when shuffling
        clearSelection();
        
        console.log('Board shuffled!');
    }

    // Function to validate if the current selection forms a valid word
    function validateWord() {
        if (gameData.currentSelection.length === 0) return;
        
        // Get the current word from selection
        const currentWord = gameData.currentSelection.map(item => item.letter).join('');
        
        // Check if it's a valid word and hasn't been found yet
        if (validWords.includes(currentWord) && !gameData.foundWords.includes(currentWord)) {
            // Show "Correct" pill animation
            showCorrectPill();
            
            // Add word to found words
            addFoundWord(currentWord);
            
            // Update score based on word length
            updateScore(currentWord);
            
            // Provide visual feedback (optional)
            gameData.currentSelection.forEach(item => {
                item.element.classList.add('found');
                setTimeout(() => {
                    item.element.classList.remove('found');
                }, 1000);
            });
            
            // Clear selection after a short delay
            setTimeout(() => {
                clearSelection();
            }, 1000);
        }
    }
    
    // Function to show the "Correct" pill animation
    function showCorrectPill() {
        // Create the correct pill element
        const correctPill = document.createElement('div');
        correctPill.className = 'correct-pill';
        correctPill.textContent = 'Correct!';
        
        // Keep the current word displayed for a moment so the last letter is visible
        // Then add the pill after a delay
        setTimeout(() => {
            // Now clear the current word display and add the pill
            currentWordDisplay.innerHTML = '';
            currentWordDisplay.appendChild(correctPill);
        }, 250); // 300ms delay to ensure last letter is visible
        
        // Remove after animation ends
        setTimeout(() => {
            // The word will be cleared by clearSelection after this anyway
            correctPill.remove();
        }, 2000); // Adjusted to account for the initial delay
    }
    
    // Function to add a found word to the lists
    function addFoundWord(word) {
        // Add to game data
        gameData.foundWords.push(word);
        
        // Update count display and add highlight animation
        foundCountDisplay.textContent = gameData.foundWords.length;
        foundCountDisplay.classList.add('highlight-animation');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            foundCountDisplay.classList.remove('highlight-animation');
        }, 800);
        
        // Remove "no words found" message if it exists
        const emptyLists = document.querySelectorAll('.empty-list');
        emptyLists.forEach(item => {
            item.parentNode.removeChild(item);
        });
        
        // Add to appropriate length category
        let lengthList;
        if (word.length === 4) {
            lengthList = words4Letter;
        } else if (word.length === 6) {
            lengthList = words6Letter;
        } else if (word.length === 7) {
            lengthList = words7Letter;
        } else if (word.length === 8) {
            lengthList = words8Letter;
        }
        
        const lengthListItem = document.createElement('li');
        lengthListItem.textContent = word;
        lengthList.appendChild(lengthListItem);
        
        // Check for game completion
        if (gameData.foundWords.length === gameData.totalWords) {
            setTimeout(() => {
                showCompletionMessage();
                startConfetti();
            }, 1000);
        }
    }
    
    // Function to update the score
    function updateScore(word) {
        // Score based on word length - more points for longer words
        let points;
        switch(word.length) {
            case 4:
                points = 10;
                break;
            case 6:
                points = 20;
                break;
            case 7:
                points = 30;
                break;
            case 8:
                points = 40;
                break;
            default:
                points = word.length * 5; // For other word lengths
        }
        
        // Update game data score
        gameData.score += points;
        
        // Update score displays and add highlight animation
        scoreDisplay.textContent = gameData.score;
        scoreDisplay.classList.add('highlight-animation');
        
        // Also highlight the score in the words counter
        const scoreValue = document.getElementById('score-value');
        scoreValue.textContent = gameData.score;
        scoreValue.classList.add('highlight-animation');
        
        // Remove animation classes after animation completes
        setTimeout(() => {
            scoreDisplay.classList.remove('highlight-animation');
            scoreValue.classList.remove('highlight-animation');
        }, 800);
    }
    
    // Function to show completion message
    function showCompletionMessage() {
        // Create the message overlay
        const overlay = document.createElement('div');
        overlay.className = 'completion-overlay';
        
        // Create message container
        const messageContainer = document.createElement('div');
        messageContainer.className = 'completion-message';
        
        // Create congratulation text
        const congratsText = document.createElement('h2');
        congratsText.textContent = '🎉 Gratulerer! 🎉';
        
        // Create the special message
        const specialMessage = document.createElement('div');
        specialMessage.className = 'special-message';
        specialMessage.innerHTML = 'Det neste brevet befinner seg hos: <br>' + 
            '<span class="message-word">BUNNPRIS</span>' +
            '<span class="message-word">POST I BUTIKK</span>' +
            '<span class="message-word">VALLDAL</span>';
        
        // Append elements
        messageContainer.appendChild(congratsText);
        messageContainer.appendChild(specialMessage);
        overlay.appendChild(messageContainer);
        document.body.appendChild(overlay);
        
        // Add click event to remove overlay
        overlay.addEventListener('click', function() {
            overlay.classList.add('fadeout');
            setTimeout(() => {
                overlay.remove();
            }, 500);
        });
    }
    
    // Canvas confetti animation using the canvas-confetti library
    function startConfetti() {
        // Initial confetti burst
        confetti({
            particleCount: 200,
            spread: 80,
            origin: { y: 0.6 }
        });
        
        // Confetti cannon from left
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 }
            });
        }, 250);
        
        // Confetti cannon from right
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 }
            });
        }, 400);
        
        // Final confetti shower with custom colors
        setTimeout(() => {
            const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
            
            // Create a confetti shower that lasts longer with school colors
            const end = Date.now() + 3000;
            
            const confettiInterval = setInterval(function() {
                if (Date.now() > end) {
                    return clearInterval(confettiInterval);
                }
                
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors
                });
                
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors
                });
                
            }, 50);
        }, 1000);
    }
});