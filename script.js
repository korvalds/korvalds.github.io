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
    const words5Letter = document.getElementById('words-5-letter');
    const words6Letter = document.getElementById('words-6-letter');

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

    // Tab switching for found words
    tabButtons.forEach(tab => {
        tab.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const sortType = this.dataset.sort;
            if (sortType === 'order') {
                listByOrder.classList.remove('hidden');
                listByLength.classList.add('hidden');
            } else {
                listByOrder.classList.add('hidden');
                listByLength.classList.remove('hidden');
            }
        });
    });

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
            // If it's the last letter added, remove it
            if (gameData.currentSelection.length > 0 && 
                gameData.currentSelection[gameData.currentSelection.length - 1].position === position) {
                
                // Remove from selection
                gameData.currentSelection.pop();
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
    
    // Function to add a found word to the lists
    function addFoundWord(word) {
        // Add to game data
        gameData.foundWords.push(word);
        
        // Update count display
        foundCountDisplay.textContent = gameData.foundWords.length;
        
        // Add to "by order" list
        const orderListItem = document.createElement('li');
        orderListItem.textContent = word;
        foundWordsByOrder.appendChild(orderListItem);
        
        // Remove "no words found" message if it exists
        const emptyLists = document.querySelectorAll('.empty-list');
        emptyLists.forEach(item => {
            item.parentNode.removeChild(item);
        });
        
        // Add to appropriate length category
        let lengthList;
        if (word.length <= 4) {
            lengthList = words4Letter;
        } else if (word.length === 5) {
            lengthList = words5Letter;
        } else {
            lengthList = words6Letter;
        }
        
        const lengthListItem = document.createElement('li');
        lengthListItem.textContent = word;
        lengthList.appendChild(lengthListItem);
        
        // Check for game completion
        if (gameData.foundWords.length === gameData.totalWords) {
            setTimeout(() => {
                alert('Congratulations! You found all the words!');
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
            case 5:
                points = 15;
                break;
            case 6:
                points = 25;
                break;
            default:
                points = word.length * 5; // For longer words
        }
        
        // Update game data score
        gameData.score += points;
        
        // Update score display
        scoreDisplay.textContent = gameData.score;
        
        // Visual feedback for points (optional)
        const pointsPopup = document.createElement('div');
        pointsPopup.className = 'points-popup';
        pointsPopup.textContent = `+${points}`;
        document.querySelector('.scorebar').appendChild(pointsPopup);
        
        // Animate and remove
        setTimeout(() => {
            pointsPopup.classList.add('fadeout');
            setTimeout(() => {
                pointsPopup.remove();
            }, 500);
        }, 100);
    }
});